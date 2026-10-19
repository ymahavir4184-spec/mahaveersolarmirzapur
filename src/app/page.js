import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import ProductsGrid from "@/components/home/ProductsGrid";
import ProcessSection from "@/components/home/ProcessSection";
import ProjectsGallery from "@/components/home/ProjectsGallery";
import WhyUsSection from "@/components/home/WhyUsSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import CtaBand from "@/components/home/CtaBand";
import HomeContactSection from "@/components/home/HomeContactSection";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `${siteConfig.seo.title}`,
  description: siteConfig.seo.description,
};

export default function HomePage() {
  return (
    <>
      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Trust Indicators */}
      <TrustSection />

      {/* 4. Residential, Commercial, Industrial Solutions */}
      <ServicesOverview />

      {/* 5. Product Categories */}
      <ProductsGrid />

      {/* 6. How Installation Works */}
      <ProcessSection />

      {/* 7. Project Gallery */}
      <ProjectsGallery />

      {/* 8. Company Advantages */}
      <WhyUsSection />

      {/* 9. Savings Calculator */}
      <CalculatorSection />

      {/* 10. Testimonials */}
      <TestimonialsSection />

      {/* 11. FAQ */}
      <FaqSection />

      {/* 12. Quote CTA Band */}
      <CtaBand />

      {/* 13. Contact + WhatsApp Section */}
      <HomeContactSection />
    </>
  );
}
