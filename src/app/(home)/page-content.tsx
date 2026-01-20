import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { HowItWorks } from "./_components/how-it-works";
import { Testimonials } from "./_components/testimonials";
import { FrequentlyAsked } from "./_components/frequently-asked";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <div>
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
