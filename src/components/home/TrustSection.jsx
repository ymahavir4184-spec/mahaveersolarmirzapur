"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";

// Animated counter component
function AnimatedStat({ value, label }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Extract numeric portion and suffix (e.g. "500+" → 500, "+")
    const match = String(value).match(/^([0-9,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }
    const numStr = match[1].replace(/,/g, "");
    const suffix = match[2] || "";
    const num = parseFloat(numStr);

    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const duration = 1400;
          const start = performance.now();
          const isDecimal = numStr.includes(".");
          const decimalPlaces = isDecimal ? (numStr.split(".")[1] || "").length : 0;

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * num;
            const formatted = isDecimal
              ? current.toFixed(decimalPlaces)
              : Math.round(current).toLocaleString("en-IN");
            setDisplayValue(`${formatted}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display stat-number">
      {displayValue}
    </div>
  );
}

export default function TrustSection() {
  const { language } = useLanguage();
  const trustData = siteConfig.trustStats;
  const showPlaceholders = siteConfig.features.showPlaceholders;

  if (!trustData || !trustData.stats || trustData.stats.length === 0) {
    return null;
  }
  if (trustData.isPlaceholder && !showPlaceholders) {
    return null;
  }

  return (
    <section className="relative py-14 bg-white border-b border-slate-100 overflow-hidden">
      {/* Subtle background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(0, 98, 255, 0.03) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustData.stats.map((stat, i) => {
            const label = stat.label?.[language] || stat.label?.en || "";
            return (
              <div
                key={i}
                className="group flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100/80 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <AnimatedStat value={stat.value} label={label} />
                <div className="mt-2 text-xs sm:text-sm font-semibold text-brand-muted leading-snug">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
