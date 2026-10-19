"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const { language, t } = useLanguage();
  const testimonials = siteConfig.testimonials;
  const showPlaceholders = siteConfig.features.showPlaceholders;

  // STRICT RULE: Hide section automatically when data is empty or placeholder and showPlaceholders is false.
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Filter valid real testimonials
  const displayList = testimonials.filter((item) => {
    if (item.isPlaceholder && !showPlaceholders) return false;
    return true;
  });

  if (displayList.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-white" id="testimonials">
      <Container>
        <SectionHeading
          badge={t.sections.testimonials.badge}
          title={t.sections.testimonials.title}
          subtitle={t.sections.testimonials.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.map((item, idx) => (
            <Card key={idx} hover className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{item.quote?.[language] || item.quote?.en || item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-brand-navy">{item.author}</div>
                  <div className="text-xs text-slate-500">{item.role || item.location}</div>
                </div>
                {item.systemSize && (
                  <span className="text-xs font-semibold bg-blue-50 text-brand-primary px-2.5 py-1 rounded-full">
                    {item.systemSize}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
