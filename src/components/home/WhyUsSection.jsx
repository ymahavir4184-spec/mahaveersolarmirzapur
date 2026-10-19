"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import MotionReveal from "../ui/MotionReveal";
import { Award, ShieldCheck, FileCheck, Smartphone } from "lucide-react";

const ICONS = [Award, ShieldCheck, FileCheck, Smartphone];

const ACCENT_COLORS = [
  { icon: "text-blue-400", ring: "bg-blue-400/15 border-blue-400/25" },
  { icon: "text-emerald-400", ring: "bg-emerald-400/15 border-emerald-400/25" },
  { icon: "text-amber-400", ring: "bg-amber-400/15 border-amber-400/25" },
  { icon: "text-purple-400", ring: "bg-purple-400/15 border-purple-400/25" },
];

export default function WhyUsSection() {
  const { t } = useLanguage();
  const points = t.sections.whyUs.points;

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden text-white"
      id="why-us"
      style={{
        background:
          "linear-gradient(135deg, #051022 0%, #0B192C 45%, #0d2145 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,98,255,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Container className="relative z-10">
        <SectionHeading
          badge={t.sections.whyUs.badge}
          title={t.sections.whyUs.title}
          subtitle={t.sections.whyUs.subtitle}
          invert
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {points.map((pt, idx) => {
            const Icon = ICONS[idx] || ShieldCheck;
            const colors = ACCENT_COLORS[idx] || ACCENT_COLORS[0];

            return (
              <MotionReveal key={idx} delay={idx * 0.08}>
                <div className="group relative flex flex-col h-full p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-default">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(0,98,255,0.6), transparent)",
                    }}
                  />

                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${colors.ring} ${colors.icon} flex items-center justify-center border`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">
                      {pt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {pt.description}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
