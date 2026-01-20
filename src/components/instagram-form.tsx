"use client";

import React from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Download, Loader2, X } from "lucide-react";

import { cn, getPostShortcode, isShortcodePresent } from "@/lib/utils";
import { useGetInstagramPostMutation } from "@/features/react-query/mutations/instagram";
import { HTTP_CODE_ENUM } from "@/features/api/http-codes";

type ContentType = "video" | "photo" | "reels" | "story" | "igtv";

function extractUsernameFromUrl(url: string) {
    try {
        // for URLs like: https://www.instagram.com/reel/xyz/
        const segments = new URL(url).pathname.split("/").filter(Boolean);
        // reel URLs don't always include username, so fallback:
        if (segments[0] && !["reel", "p", "tv", "stories"].includes(segments[0])) {
            return segments[0]; // username found
        }
    } catch { }
    return "";
}

function buildFilename(url: string, platform = "instagram", brand = "InstaD", ext = "mp4") {
    const username = extractUsernameFromUrl(url) || "video";
    const date = new Date().toISOString().split("T")[0];
    return `${platform}-${username}-${date}-${brand}.${ext}`;
}



// 5 minutes
const CACHE_TIME = 5 * 60 * 1000;

const useFormSchema = () => {
    const t = useTranslations("components.instagramForm.inputs");

    return z.object({
        url: z
            .string({ required_error: t("url.validation.required") })
            .trim()
            .min(1, {
                message: t("url.validation.required"),
            })
            .startsWith("https://www.instagram.com", t("url.validation.invalid"))
            .refine(
                (value) => {
                    return isShortcodePresent(value);
                },
                { message: t("url.validation.invalid") }
            ),
    });
};

function triggerDownload(url: string, contentType: ContentType = "video") {
    if (typeof window === "undefined") return;

    // Determine file extension based on content type
    const ext = contentType === "photo" ? "jpg" : "mp4";
    const filename = buildFilename(url, "instagram", "InstaD", ext);

    const proxyUrl = new URL("/api/download-proxy", window.location.origin);
    proxyUrl.searchParams.append("url", url);
    proxyUrl.searchParams.append("filename", filename);

    const link = document.createElement("a");
    link.href = proxyUrl.toString();
    link.target = "_blank";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


type CachedUrl = {
    videoUrl?: string;
    photoUrl?: string;
    contentType?: ContentType;
    expiresAt: number;
    invalid?: {
        messageKey: string;
    };
};

export function InstagramForm(props: { className?: string }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const cachedUrls = React.useRef(new Map<string, CachedUrl>());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedType, setSelectedType] = React.useState<ContentType>("video");

    const t = useTranslations("components.instagramForm");

    const {
        isError,
        isPending,
        mutateAsync: getInstagramPost,
    } = useGetInstagramPostMutation();

    const formSchema = useFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });

    const errorMessage = form.formState.errors.url?.message;

    const isDisabled = isPending || !form.formState.isDirty;
    const isShowClearButton = form.watch("url").length > 0;

    function clearUrlField() {
        form.setValue("url", "");
        form.clearErrors("url");
        inputRef.current?.focus();
    }

    function setCachedUrl(
        shortcode: string,
        videoUrl?: string,
        photoUrl?: string,
        contentType?: ContentType,
        invalid?: CachedUrl["invalid"]
    ) {
        cachedUrls.current?.set(shortcode, {
            videoUrl,
            photoUrl,
            contentType,
            expiresAt: Date.now() + CACHE_TIME,
            invalid,
        });
    }

    function getCachedUrl(shortcode: string) {
        const cachedUrl = cachedUrls.current?.get(shortcode);

        if (!cachedUrl) {
            return null;
        }

        if (cachedUrl.expiresAt < Date.now()) {
            cachedUrls.current.delete(shortcode);
            return null;
        }

        return cachedUrl;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isError) {
            toast.dismiss("toast-error");
        }

        const shortcode = getPostShortcode(values.url);

        if (!shortcode) {
            form.setError("url", { message: t("inputs.url.validation.invalid") });
            return;
        }

        const cachedUrl = getCachedUrl(shortcode);
        if (cachedUrl?.invalid) {
            form.setError("url", { message: t(cachedUrl.invalid.messageKey) });
            return;
        }

        // Check cache based on selected type
        if (selectedType === "photo" && cachedUrl?.photoUrl) {
            triggerDownload(cachedUrl.photoUrl, "photo");
            return;
        }

        if ((selectedType === "video" || selectedType === "reels" || selectedType === "igtv") && cachedUrl?.videoUrl) {
            triggerDownload(cachedUrl.videoUrl, selectedType);
            return;
        }

        try {
            const { data, status } = await getInstagramPost({ shortcode });

            if (status === HTTP_CODE_ENUM.OK) {
                const mediaData = data.data.xdt_shortcode_media;
                const videoUrl = mediaData.video_url;
                const photoUrl = mediaData.display_url;

                let downloadUrl: string | undefined;
                let contentType: ContentType = selectedType;

                // Determine what to download based on selected type and available content
                if (selectedType === "photo") {
                    downloadUrl = photoUrl;
                    contentType = "photo";
                } else if (selectedType === "video" || selectedType === "reels" || selectedType === "igtv") {
                    downloadUrl = videoUrl;
                    contentType = selectedType;
                } else if (selectedType === "story") {
                    // Stories can be either photo or video
                    downloadUrl = videoUrl || photoUrl;
                    contentType = videoUrl ? "video" : "photo";
                }

                if (downloadUrl) {
                    triggerDownload(downloadUrl, contentType);
                    setCachedUrl(shortcode, videoUrl, photoUrl, contentType);
                    toast.success(t("toasts.success"), {
                        id: "toast-success",
                        position: "top-center",
                        duration: 1500,
                    });
                } else {
                    throw new Error("Content URL not found");
                }
            } else if (
                status === HTTP_CODE_ENUM.NOT_FOUND ||
                status === HTTP_CODE_ENUM.BAD_REQUEST ||
                status === HTTP_CODE_ENUM.TOO_MANY_REQUESTS ||
                status === HTTP_CODE_ENUM.INTERNAL_SERVER_ERROR
            ) {
                const errorMessageKey = `serverErrors.${data.error}`;
                form.setError("url", { message: t(errorMessageKey) });
                if (
                    status === HTTP_CODE_ENUM.BAD_REQUEST ||
                    status === HTTP_CODE_ENUM.NOT_FOUND
                ) {
                    setCachedUrl(shortcode, undefined, undefined, undefined, {
                        messageKey: errorMessageKey,
                    });
                }
            } else {
                throw new Error("Failed to fetch content");
            }
        } catch (error) {
            console.error(error);
            toast.error(t("toasts.error"), {
                dismissible: true,
                id: "toast-error",
                position: "top-center",
            });
        }
    }

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className={cn("w-full space-y-4", props.className)}>
            {errorMessage ? (
                <p className="h-4 text-center text-sm text-red-500 animate-in fade-in slide-in-from-top-2 duration-300">{errorMessage}</p>
            ) : (
                <div className="h-4"></div>
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-3 sm:flex-row sm:items-end"
                >
                    <FormField
                        control={form.control}
                        name="url"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="sr-only">
                                    {t("inputs.url.label")}
                                </FormLabel>
                                <FormControl>
                                    <div className="relative w-full group">
                                        <Input
                                            {...field}
                                            type="url"
                                            ref={inputRef}
                                            minLength={1}
                                            maxLength={255}
                                            placeholder={t("inputs.url.placeholder")}
                                            className="h-12 sm:h-14 rounded-full bg-white pr-20 sm:pr-24 text-sm sm:text-base shadow-lg transition-all duration-300 focus:shadow-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:focus:ring-blue-500"
                                        />
                                        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                                            {!isShowClearButton && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={async () => {
                                                        try {
                                                            const text = await navigator.clipboard.readText();
                                                            form.setValue("url", text);
                                                        } catch (err) {
                                                            console.error("Failed to read clipboard:", err);
                                                        }
                                                    }}
                                                    className="h-7 sm:h-8 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                                >
                                                    Paste
                                                </Button>
                                            )}
                                            {isShowClearButton && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={clearUrlField}
                                                    className="h-6 w-6 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isDisabled}
                        type="submit"
                        className="h-12 sm:h-14 w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-600 dark:to-blue-700"
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Download className="h-5 w-5" />
                        )}
                        <span className="ml-2">{t("submit")}</span>
                    </Button>
                </form>
            </Form>
            <p className="text-muted-foreground text-center text-xs sm:text-sm animate-in fade-in duration-500 delay-200">{t("hint")}</p>
        </div>
    );
}
