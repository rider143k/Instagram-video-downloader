import { ContentDownloader } from "@/components/content-downloader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram IGTV Downloader - Download IGTV Videos Free | HD Quality",
    description: "Download Instagram IGTV videos for free in HD quality. Fast, easy, and secure IGTV downloader. No registration required.",
    keywords: "instagram igtv downloader, download igtv videos, igtv download, save igtv videos, igtv downloader",
};

export default function IGTVPage() {
    const howItWorks = [
        "Open Instagram and find the IGTV video you want to download",
        "Copy the IGTV URL from your browser or share menu",
        "Paste the URL into the input field above",
        "Click 'Download' to fetch the IGTV video",
        "Save the HD quality video to your device"
    ];

    return (
        <ContentDownloader
            contentType="igtv"
            title="Instagram IGTV Downloader"
            description="Download Instagram IGTV videos for free in HD quality. Fast and secure IGTV downloader with no watermark."
            seoKeywords="Free Instagram IGTV downloader - HD Quality - No watermark - Fast download"
            howItWorks={howItWorks}
        />
    );
}
