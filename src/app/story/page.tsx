import { ContentDownloader } from "@/components/content-downloader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram Story Downloader - Download Instagram Stories Free",
    description: "Download Instagram Stories for free. Fast and easy story downloader. Save photos and videos from Instagram stories.",
    keywords: "instagram story downloader, download instagram stories, instagram story download, save instagram stories, story downloader",
};

export default function StoryPage() {
    const howItWorks = [
        "Open Instagram and view the story you want to download",
        "Copy the story URL (available for public stories)",
        "Paste the URL into the input field above",
        "Click 'Download' to fetch the story content",
        "Download photos or videos from the story",
        "View stories offline on your device"
    ];

    return (
        <ContentDownloader
            contentType="story"
            title="Instagram Story Downloader"
            description="Download Instagram Stories for free. Save photos and videos from Instagram stories with the highest quality."
            seoKeywords="Free Instagram Story downloader - Anonymous - Photos & Videos - HD Quality"
            howItWorks={howItWorks}
        />
    );
}
