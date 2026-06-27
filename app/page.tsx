import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import Orb from "@/components/hero/Orb";
import FeatureCards from "@/components/ui/FeatureCards";
import CTAButton from "@/components/ui/CTAButton";

import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Top Hero Layout */}
        <HeroSection />
        <Orb />
        <FeatureCards />
        <CTAButton />

        {/* Extended Landing Page Sections */}
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TestimonialsSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
