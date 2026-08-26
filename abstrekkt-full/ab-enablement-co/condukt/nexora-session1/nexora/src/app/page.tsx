import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { CTASection, Footer } from "@/components/landing/cta-footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen noise-overlay">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
