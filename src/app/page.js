import HeroSection from "@/components/home/HeroSection";
import BrandRangeSection from "@/components/home/BrandRangeSection";
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

      {/* 3. Brands available for customer solar projects */}
      <BrandRangeSection />

      {/* 4. Trust Indicators */}
      <TrustSection />

      {/* 5. Residential, Commercial, Industrial Solutions */}
      <ServicesOverview />

      {/* 6. Product Categories */}
      <ProductsGrid />

      {/* 7. How Installation Works */}
      <ProcessSection />

      {/* 8. Project Gallery */}
      <ProjectsGallery />

      {/* 9. Company Advantages */}
      <WhyUsSection />

      {/* 10. Savings Calculator */}
      <CalculatorSection />

      {/* 11. Testimonials */}
      <TestimonialsSection />

      {/* 12. FAQ */}
      <FaqSection />

      {/* 13. Quote CTA Band */}
      <CtaBand />

      {/* 14. Contact + WhatsApp Section */}
      <HomeContactSection />
    </>
  );
}
