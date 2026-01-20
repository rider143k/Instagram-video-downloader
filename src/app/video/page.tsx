import { Hero } from "@/app/(home)/_components/hero";
import { Features } from "@/app/(home)/_components/features";
import { HowItWorks } from "@/app/(home)/_components/how-it-works";
import { Testimonials } from "@/app/(home)/_components/testimonials";
import { FrequentlyAsked } from "@/app/(home)/_components/frequently-asked";
import { Header } from "@/app/(home)/_components/header";
import { Footer } from "@/app/(home)/_components/footer";
import { TabNavigation } from "@/components/tab-navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram Video Downloader - Download Instagram Videos Free | HD Quality",
    description: "Download Instagram videos for free in HD quality. Fast, easy, and secure Instagram video downloader. No registration required. Works on all devices.",
    keywords: "instagram video downloader, download instagram videos, instagram video download, save instagram videos, instagram downloader, ig video download",
};

export default function VideoPage() {
    return (
        <>
            <Header />
            <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <TabNavigation />
                {/* Hero Section */}
                <Hero />

                {/* Features Section */}
                <Features />

                {/* How It Works Section */}
                <HowItWorks />

                {/* Testimonials Section */}
                <Testimonials />

                {/* FAQ Section */}
                <FrequentlyAsked />
            </div>
            <Footer />
        </>
    );
}
