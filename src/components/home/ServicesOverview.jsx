"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import SmartImage from "../SmartImage";
import Button from "../ui/Button";
import MotionReveal from "../ui/MotionReveal";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesOverview() {
  const { language, t } = useLanguage();
  const services = Object.values(siteConfig.services);

  return (
    <section className="py-20 md:py-28 bg-brand-ice border-y border-blue-100/60" id="services">
      <Container>
        <SectionHeading
          badge={t.sections.services.badge}
          title={t.sections.services.title}
          subtitle={t.sections.services.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const title = service.title?.[language] || service.title?.en;
            const summary = service.summary?.[language] || service.summary?.en;
            const benefits = service.benefits?.[language] || service.benefits?.en || [];

            return (
              <MotionReveal key={service.slug} delay={index * 0.1}>
                <Card hover padding="none" className="h-full flex flex-col overflow-hidden bg-white">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <SmartImage
                      src={service.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm">
                      {index === 0 ? "1 kW - 10 kW" : index === 1 ? "10 kW - 100 kW" : "100 kW - 5 MW"}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold font-display text-brand-navy">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {summary}
                      </p>

                      {/* Benefits List */}
                      <ul className="space-y-2 pt-2">
                        {benefits.slice(0, 3).map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Button
                        href={`/services/${service.slug}`}
                        variant="secondary"
                        size="sm"
                        className="w-full justify-between"
                      >
                        <span>{t.sections.services.viewDetails}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
