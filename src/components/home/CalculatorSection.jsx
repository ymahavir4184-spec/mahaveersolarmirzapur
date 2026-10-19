"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import SolarCalculator from "../calculator/SolarCalculator";

export default function CalculatorSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-brand-ice border-y border-blue-100/60" id="calculator">
      <Container>
        <SectionHeading
          badge={t.sections.calculator.badge}
          title={t.sections.calculator.title}
          subtitle={t.sections.calculator.subtitle}
        />

        <SolarCalculator />
      </Container>
    </section>
  );
}
