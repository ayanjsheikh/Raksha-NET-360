import { Hero } from "@/components/shared/Hero";
import { FeaturesSection } from "@/components/shared/FeaturesSection";
import { HowItWorksSection } from "@/components/shared/HowItWorksSection";
import { TestimonialsSection } from "@/components/shared/TestimonialsSection";
import { CTASection } from "@/components/shared/CTASection";

export default function Landing() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
