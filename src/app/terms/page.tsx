import { Header } from "@/app/(home)/_components/header";
import { Footer } from "@/app/(home)/_components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - Instagram Downloader",
    description: "Terms of Service for using our Instagram downloader service. Read our terms and conditions.",
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

                    <div className="space-y-6 text-muted-foreground">
                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using this Instagram downloader service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">2. Use License</h2>
                            <p>
                                Permission is granted to temporarily download Instagram content for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="ml-6 mt-2 list-disc space-y-1">
                                <li>Use the downloaded content for commercial purposes</li>
                                <li>Modify or copy the materials</li>
                                <li>Attempt to decompile or reverse engineer any software contained on our website</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">3. Disclaimer</h2>
                            <p>
                                The materials on our website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">4. Limitations</h2>
                            <p>
                                In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">5. Accuracy of Materials</h2>
                            <p>
                                The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">6. Links</h2>
                            <p>
                                We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user&apos;s own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">7. Copyright Notice</h2>
                            <p>
                                All content downloaded through our service remains the property of its respective owners. We respect intellectual property rights and expect our users to do the same. Users are responsible for ensuring they have the right to download and use any content.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">8. Modifications</h2>
                            <p>
                                We may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">9. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-2xl font-semibold text-foreground">10. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us through our contact page.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
