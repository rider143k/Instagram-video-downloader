"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
    className?: string;
}

export function TabNavigation({ className }: TabNavigationProps) {
    const pathname = usePathname();

    const tabs = [
        { href: "/video", label: "Video" },
        { href: "/photo", label: "Photo" },
        { href: "/reels", label: "Reels" },
        { href: "/story", label: "Story" },
        { href: "/igtv", label: "IGTV" },
    ];

    return (
        <div className={cn("flex justify-center px-4 py-4 sm:py-6", className)}>
            <div className="inline-flex w-full max-w-full overflow-x-auto scrollbar-hide sm:max-w-3xl sm:overflow-x-visible sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 rounded-full sm:rounded-2xl border border-gray-200 bg-gray-50/50 p-1.5 sm:p-3 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "group relative overflow-hidden whitespace-nowrap rounded-full transition-all duration-300 flex-shrink-0",
                                "transform hover:scale-105 active:scale-95",
                                "px-3.5 py-2 sm:px-6 sm:py-2.5",
                                "text-xs sm:text-sm font-semibold text-center",
                                "flex items-center justify-center",
                                isActive
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            )}
                        >
                            {isActive && (
                                <>
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 opacity-20 blur-sm animate-pulse"></span>
                                    <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 blur-md"></span>
                                </>
                            )}
                            <span className="relative z-10">
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
