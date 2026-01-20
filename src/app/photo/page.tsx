import { ContentDownloader } from "@/components/content-downloader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram Photo Downloader - Download Instagram Photos & Images Free | HD",
    description: "Download Instagram photos and images for free in high quality. Save single or multiple photos from Instagram posts. Fast and secure photo downloader.",
    keywords: "instagram photo downloader, download instagram photos, instagram image download, save instagram pictures, instagram photo saver, ig photo download",
};

export default function PhotoPage() {
    const howItWorks = [
        "Open Instagram and find the photo or album you want to download",
        "Copy the post URL from your browser or share menu",
        "Paste the URL into the input field above",
        "Click 'Download' to fetch the photos",
        "For multiple photos, select individual images or download all at once",
        "Save high-quality photos to your device"
    ];

    return (
        <ContentDownloader
            contentType="photo"
            title="Instagram Photo Downloader"
            description="Download Instagram Photos, Images, and Albums for free with the highest quality. Support for single and multiple photos."
            seoKeywords="Free Instagram photo downloader - Multiple photos support - HD Quality - No watermark"
            howItWorks={howItWorks}
        />
    );
}
