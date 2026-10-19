"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import MotionReveal from "../ui/MotionReveal";

export default function ProcessSection() {
  const { t } = useLanguage();
  const steps = t.sections.howItWorks.steps;

  return (
    <section className="py-20 md:py-28 bg-brand-ice border-y border-blue-100/60" id="how-it-works">
      <Container>
        <SectionHeading
          badge={t.sections.howItWorks.badge}
          title={t.sections.howItWorks.title}
          subtitle={t.sections.howItWorks.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <MotionReveal key={index} delay={index * 0.08}>
              <Card hover className="h-full bg-white relative p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-primary font-display font-extrabold text-lg flex items-center justify-center border border-blue-200/60">
                      {step.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step {index + 1} of 6
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-brand-navy mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
