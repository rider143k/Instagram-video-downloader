import { Header } from "@/app/(home)/_components/header";
import { Footer } from "@/app/(home)/_components/footer";
import { Metadata } from "next";
import { Mail, MessageSquare, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - Instagram Downloader",
  description: "Get in touch with us. Contact our Instagram downloader support team for help and inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>

          <div className="space-y-8">
            <section>
              <p className="text-muted-foreground text-lg">
                Have questions, feedback, or need help? We&apos;re here to assist you. Choose the best way to reach us below.
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Email Support</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  For general inquiries, support requests, or feedback, send us an email.
                </p>
                <a
                  href="mailto:support@instadownloader.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  support@instadownloader.com
                </a>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Live Chat</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get instant help with our live chat support during business hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9 AM - 6 PM (IST)
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Social Media</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Follow us on social media for updates, tips, and announcements.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">Twitter: @InstaDownloader</p>
                  <p className="text-sm">Facebook: /InstaDownloader</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Business Hours</h2>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="mt-4 text-sm">
                    <strong>Timezone:</strong> India Standard Time (IST)
                  </p>
                </div>
              </div>
            </div>

            <section className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">How do I download Instagram content?</h3>
                  <p className="text-muted-foreground text-sm">
                    Simply paste the Instagram URL into the input field on our homepage and click download. The content will be fetched and ready to download.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Is this service free?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes, our Instagram downloader is completely free to use with no hidden charges or registration required.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Do you store my downloaded content?</h3>
                  <p className="text-muted-foreground text-sm">
                    No, we do not store any content on our servers. All downloads are processed in real-time and delivered directly to your device.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">What content types are supported?</h3>
                  <p className="text-muted-foreground text-sm">
                    We support downloading Instagram videos, photos, reels, stories, and IGTV content in high quality.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">Need Immediate Help?</h2>
              <p className="mb-6">
                Check out our comprehensive guides and tutorials to get the most out of our Instagram downloader service.
              </p>
              <Link
                href="/"
                className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
              >
                Back to Home
              </Link>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
