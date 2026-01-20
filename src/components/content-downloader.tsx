"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Header } from "@/app/(home)/_components/header";
import { Footer } from "@/app/(home)/_components/footer";
import { TabNavigation } from "@/components/tab-navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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
import { getPostShortcode, isShortcodePresent } from "@/lib/utils";
import { useGetInstagramPostMutation } from "@/features/react-query/mutations/instagram";
import { HTTP_CODE_ENUM } from "@/features/api/http-codes";

type ContentType = "video" | "photo" | "reels" | "story" | "igtv";

interface ContentDownloaderProps {
    contentType: ContentType;
    title: string;
    description: string;
    seoKeywords?: string;
    howItWorks?: string[];
}

interface MediaItem {
    url: string;
    type: "photo" | "video";
    thumbnail?: string;
}

function extractUsernameFromUrl(url: string) {
    try {
        const segments = new URL(url).pathname.split("/").filter(Boolean);
        if (segments[0] && !["reel", "p", "tv", "stories"].includes(segments[0])) {
            return segments[0];
        }
    } catch { }
    return "";
}

function buildFilename(url: string, index: number = 0, ext = "jpg") {
    const username = extractUsernameFromUrl(url) || "content";
    const date = new Date().toISOString().split("T")[0];
    const suffix = index > 0 ? `-${index + 1}` : "";
    return `instagram-${username}-${date}${suffix}.${ext}`;
}

const CACHE_TIME = 5 * 60 * 1000;

type CachedUrl = {
    mediaItems?: MediaItem[];
    expiresAt: number;
    invalid?: {
        messageKey: string;
    };
};

function triggerDownload(url: string, filename: string) {
    if (typeof window === "undefined") return;

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

const useFormSchema = () => {
    return z.object({
        url: z
            .string({ required_error: "URL is required" })
            .trim()
            .min(1, { message: "URL is required" })
            .startsWith("https://www.instagram.com", "Invalid Instagram URL")
            .refine((value) => isShortcodePresent(value), {
                message: "Invalid Instagram URL",
            }),
    });
};

export function ContentDownloader({
    title,
    description,
    seoKeywords,
    howItWorks
}: ContentDownloaderProps) {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const cachedUrls = React.useRef(new Map<string, CachedUrl>());
    const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([]);
    const [showMedia, setShowMedia] = React.useState(false);

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
        setMediaItems([]);
        setShowMedia(false);
        inputRef.current?.focus();
    }

    function setCachedUrl(
        shortcode: string,
        items?: MediaItem[],
        invalid?: CachedUrl["invalid"]
    ) {
        cachedUrls.current?.set(shortcode, {
            mediaItems: items,
            expiresAt: Date.now() + CACHE_TIME,
            invalid,
        });
    }

    function getCachedUrl(shortcode: string) {
        const cachedUrl = cachedUrls.current?.get(shortcode);
        if (!cachedUrl) return null;
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

        // Check if it's a story URL and handle it differently
        if (values.url.includes('/stories/')) {
            const storyMatch = values.url.match(/\/stories\/([^\/]+)\/(\d+)/);

            if (!storyMatch) {
                form.setError("url", { message: "Invalid story URL format" });
                return;
            }

            const [, username, storyId] = storyMatch;

            try {
                const response = await fetch(`/api/instagram/stories/${username}/${storyId}`);
                const result = await response.json();

                if (response.ok && result.data) {
                    const item: MediaItem = {
                        url: result.data.url,
                        type: result.data.type as "photo" | "video",
                    };

                    setMediaItems([item]);
                    setShowMedia(true);
                    setCachedUrl(`story_${storyId}`, [item]);

                    // Auto download story
                    const ext = item.type === "photo" ? "jpg" : "mp4";
                    triggerDownload(item.url, buildFilename(values.url, 0, ext));
                    toast.success("Story download started!", { position: "top-center", duration: 1500 });
                } else {
                    form.setError("url", {
                        message: result.error || "Story not found. It may be private or expired."
                    });
                    toast.error("Story not available", {
                        description: "Story may be private, expired, or deleted",
                        position: "top-center",
                        duration: 4000
                    });
                }
                return;
            } catch {
                form.setError("url", { message: "Failed to fetch story" });
                toast.error("Failed to fetch story", { position: "top-center" });
                return;
            }
        }

        const shortcode = getPostShortcode(values.url);

        if (!shortcode) {
            form.setError("url", { message: "Invalid Instagram URL" });
            return;
        }

        const cachedUrl = getCachedUrl(shortcode);
        if (cachedUrl?.invalid) {
            form.setError("url", { message: cachedUrl.invalid.messageKey });
            return;
        }

        if (cachedUrl?.mediaItems) {
            setMediaItems(cachedUrl.mediaItems);
            setShowMedia(true);

            // Auto download if single item
            if (cachedUrl.mediaItems.length === 1) {
                const item = cachedUrl.mediaItems[0];
                const ext = item.type === "photo" ? "jpg" : "mp4";
                triggerDownload(item.url, buildFilename(values.url, 0, ext));
                toast.success("Download started!", { position: "top-center", duration: 1500 });
            }
            return;
        }

        try {
            const { data, status } = await getInstagramPost({ shortcode });

            if (status === HTTP_CODE_ENUM.OK) {
                const mediaData = data.data.xdt_shortcode_media;
                const items: MediaItem[] = [];

                // Check for carousel (multiple photos/videos)
                if (mediaData.edge_sidecar_to_children?.edges) {
                    mediaData.edge_sidecar_to_children.edges.forEach((edge: any) => {
                        if (edge.node.is_video) {
                            items.push({
                                url: edge.node.video_url,
                                type: "video",
                                thumbnail: edge.node.display_url,
                            });
                        } else {
                            items.push({
                                url: edge.node.display_url,
                                type: "photo",
                            });
                        }
                    });
                } else {
                    // Single media
                    if (mediaData.is_video && mediaData.video_url) {
                        items.push({
                            url: mediaData.video_url,
                            type: "video",
                            thumbnail: mediaData.display_url,
                        });
                    } else if (mediaData.display_url) {
                        items.push({
                            url: mediaData.display_url,
                            type: "photo",
                        });
                    }
                }

                if (items.length > 0) {
                    setMediaItems(items);
                    setCachedUrl(shortcode, items);
                    setShowMedia(true);

                    // Auto download if single item
                    if (items.length === 1) {
                        const item = items[0];
                        const ext = item.type === "photo" ? "jpg" : "mp4";
                        triggerDownload(item.url, buildFilename(values.url, 0, ext));
                        toast.success("Download started!", {
                            id: "toast-success",
                            position: "top-center",
                            duration: 1500,
                        });
                    } else {
                        toast.success(`Found ${items.length} items! Select to download.`, {
                            position: "top-center",
                            duration: 2000,
                        });
                    }
                } else {
                    throw new Error("No media found");
                }
            } else if (
                status === HTTP_CODE_ENUM.NOT_FOUND ||
                status === HTTP_CODE_ENUM.BAD_REQUEST ||
                status === HTTP_CODE_ENUM.TOO_MANY_REQUESTS ||
                status === HTTP_CODE_ENUM.INTERNAL_SERVER_ERROR
            ) {
                const errorMessageKey = `Server error: ${data.error}`;
                form.setError("url", { message: errorMessageKey });
                if (status === HTTP_CODE_ENUM.BAD_REQUEST || status === HTTP_CODE_ENUM.NOT_FOUND) {
                    setCachedUrl(shortcode, undefined, {
                        messageKey: errorMessageKey,
                    });
                }
            } else {
                throw new Error("Failed to fetch content");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.", {
                dismissible: true,
                id: "toast-error",
                position: "top-center",
            });
        }
    }

    function handleDownload(item: MediaItem, index: number) {
        const ext = item.type === "photo" ? "jpg" : "mp4";
        const filename = buildFilename(form.getValues("url"), index, ext);
        triggerDownload(item.url, filename);
        toast.success("Download started!", { position: "top-center", duration: 1000 });
    }

    function handleDownloadAll() {
        mediaItems.forEach((item, index) => {
            setTimeout(() => {
                handleDownload(item, index);
            }, index * 500); // Stagger downloads
        });
        toast.success(`Downloading ${mediaItems.length} items...`, {
            position: "top-center",
            duration: 2000,
        });
    }

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                {/* Tab Navigation */}
                <TabNavigation />

                {/* Main Content */}
                <div className="flex flex-1 flex-col items-center px-4 py-6 sm:py-8 md:py-12">
                    <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
                        {/* Title and Description */}
                        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                {title}
                            </h1>
                            <p className="text-muted-foreground mt-3 sm:mt-4 text-base sm:text-lg md:text-xl">
                                {description}
                            </p>
                            {seoKeywords && (
                                <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
                                    {seoKeywords}
                                </p>
                            )}
                        </div>

                        {/* Form */}
                        <div className="w-full space-y-4">
                            {errorMessage ? (
                                <p className="h-4 text-center text-sm text-red-500">{errorMessage}</p>
                            ) : (
                                <div className="h-4"></div>
                            )}
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex w-full flex-col gap-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="url"
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="sr-only">Instagram URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            {...field}
                                                            type="url"
                                                            ref={inputRef}
                                                            minLength={1}
                                                            maxLength={255}
                                                            placeholder="Insert instagram link here..."
                                                            className="h-14 rounded-full bg-white pr-24 text-base shadow-lg dark:bg-gray-800"
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
                                                                    className="h-8 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                                                                    className="h-6 w-6 cursor-pointer"
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
                                        className="h-14 w-full rounded-full bg-blue-500 text-lg font-semibold text-white shadow-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        {isPending ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <Download className="h-6 w-6" />
                                        )}
                                        Download
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        {/* Media Grid */}
                        {showMedia && mediaItems.length > 0 && (
                            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                        Found {mediaItems.length} {mediaItems.length === 1 ? "item" : "items"}
                                    </h3>
                                    {mediaItems.length > 1 && (
                                        <Button
                                            onClick={handleDownloadAll}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download All
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {mediaItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="group relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                                                {item.type === "photo" ? (
                                                    <img
                                                        src={`/api/proxy-image?url=${encodeURIComponent(item.url)}`}
                                                        alt={`Photo ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="relative h-full w-full">
                                                        <img
                                                            src={`/api/proxy-image?url=${encodeURIComponent(item.thumbnail || item.url)}`}
                                                            alt={`Video ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                            <div className="rounded-full bg-white/90 p-3">
                                                                <svg
                                                                    className="h-8 w-8 text-gray-800"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() => handleDownload(item, index)}
                                                className="absolute bottom-2 left-2 right-2 bg-blue-500 opacity-100 transition-opacity hover:bg-blue-600 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download {item.type === "photo" ? "Photo" : "Video"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* How It Works */}
                        {howItWorks && howItWorks.length > 0 && (
                            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
                                <ol className="space-y-3">
                                    {howItWorks.map((step, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <p className="text-muted-foreground pt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
