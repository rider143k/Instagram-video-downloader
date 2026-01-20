import { ContentDownloader } from "@/components/content-downloader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram Reels Downloader - Download Instagram Reels Free | HD Quality",
    description: "Download Instagram Reels for free in HD quality. Fast, easy, and secure Reels downloader. No registration required. Works on all devices.",
    keywords: "instagram reels downloader, download instagram reels, instagram reels download, save instagram reels, reels downloader, ig reels download",
};

export default function ReelsPage() {
    const howItWorks = [
        "Open Instagram and find the Reel you want to download",
        "Copy the Reel URL from your browser or share menu",
        "Paste the URL into the input field above",
        "Click 'Download' to fetch the Reel",
        "Save the HD quality Reel to your device"
    ];

    return (
        <ContentDownloader
            contentType="reels"
            title="Instagram Reels Downloader"
            description="Download Instagram Reels for free in HD quality. Fast and secure Reels downloader with no watermark."
            seoKeywords="Free Instagram Reels downloader - HD Quality - No watermark - Fast download"
            howItWorks={howItWorks}
        />
    );
}
