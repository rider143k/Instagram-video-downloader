import { Header } from "@/app/(home)/_components/header";
import { Footer } from "@/app/(home)/_components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Instagram Downloader",
    description: "Privacy Policy for our Instagram downloader service. Learn how we protect your privacy and handle data.",
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

                    <div className="space-y-6 text-muted-foreground">
                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                            <p>
                                We are committed to protecting your privacy. Our Instagram downloader service is designed with privacy in mind:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>We do not require user registration or login</li>
                                <li>We do not store Instagram URLs you submit</li>
                                <li>We do not save downloaded content on our servers</li>
                                <li>We collect minimal analytics data for service improvement</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">2. How We Use Information</h2>
                            <p>
                                The limited information we collect is used solely for:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>Providing and improving our download service</li>
                                <li>Understanding usage patterns to enhance user experience</li>
                                <li>Detecting and preventing abuse or misuse of our service</li>
                                <li>Complying with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">3. Cookies and Tracking</h2>
                            <p>
                                We use minimal cookies and tracking technologies:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>Essential cookies for website functionality</li>
                                <li>Analytics cookies to understand how users interact with our service (optional)</li>
                                <li>No third-party advertising cookies</li>
                            </ul>
                            <p className="mt-2">
                                You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">4. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your data:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>HTTPS encryption for all connections</li>
                                <li>No storage of personal information</li>
                                <li>Regular security audits and updates</li>
                                <li>Secure server infrastructure</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">5. Third-Party Services</h2>
                            <p>
                                Our service may interact with third-party services:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>Instagram (for fetching public content)</li>
                                <li>Analytics providers (for usage statistics)</li>
                            </ul>
                            <p className="mt-2">
                                We do not share your personal information with third parties for marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">6. Children&apos;s Privacy</h2>
                            <p>
                                Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">7. Your Rights</h2>
                            <p>
                                You have the right to:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>Access any personal data we hold about you</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">8. Data Retention</h2>
                            <p>
                                We retain data only as long as necessary to provide our service and comply with legal obligations. Since we don&apos;t store user-submitted URLs or downloaded content, there is minimal data retention.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">9. Changes to Privacy Policy</h2>
                            <p>
                                We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page with an updated revision date.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">10. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or our data practices, please contact us through our contact page.
                            </p>
                        </section>

                        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                            <p className="text-sm">
                                <strong>Last Updated:</strong> January 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
