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
import { Cpu, ShieldCheck } from "lucide-react";

export default function ProductsGrid() {
  const { language, t } = useLanguage();
  const products = siteConfig.productCategories;

  return (
    <section className="py-20 md:py-28 bg-white" id="products">
      <Container>
        <SectionHeading
          badge={t.sections.products.badge}
          title={t.sections.products.title}
          subtitle={t.sections.products.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((prod, idx) => {
            const name = prod.name?.[language] || prod.name?.en;
            const desc = prod.description?.[language] || prod.description?.en;

            return (
              <MotionReveal key={prod.id} delay={idx * 0.08}>
                <Card hover padding="none" className="h-full flex flex-col overflow-hidden bg-white">
                  <div className="relative aspect-[16/9] w-full bg-slate-100">
                    <SmartImage
                      src={prod.image}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="text-lg font-bold font-display text-brand-navy flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-brand-primary flex-shrink-0" />
                        <span>{name}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t.sections.products.specsHeading}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prod.specs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            <ShieldCheck className="w-3 h-3 text-brand-primary" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/products" variant="outline" size="md">
            <span>{t.buttons.learnMore}</span>
          </Button>
        </div>
      </Container>
    </section>
  );
}
