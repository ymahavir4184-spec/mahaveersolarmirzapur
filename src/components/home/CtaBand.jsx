"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CtaBand() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-24 overflow-hidden" id="cta-band">
      {/* Rich dark navy gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #051022 0%, #0B192C 40%, #0d2145 100%)",
        }}
      />

      {/* Glowing orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,98,255,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Container className="relative z-10 text-center max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-xs font-bold mb-6 border border-white/10 backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Obligation · Free Site Feasibility</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white leading-[1.1] text-balance">
          {t.sections.ctaBand.title}
        </h2>

        <p className="mt-5 text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
          {t.sections.ctaBand.subtitle}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/quote"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            style={{ boxShadow: "0 12px 40px -8px rgba(0, 98, 255, 0.5)" }}
          >
            <span>{t.sections.ctaBand.cta}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>

          <Button
            href={`tel:${siteConfig.company.phone}`}
            variant="white"
            size="lg"
            className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
          >
            <PhoneCall className="w-4 h-4 mr-1.5" />
            <span>{siteConfig.company.displayPhone || siteConfig.company.phone}</span>
          </Button>
        </div>

        {/* Trust micro-copy */}
        <p className="mt-8 text-xs text-slate-400">
          Trusted by 500+ homeowners &amp; businesses · Engineers respond within 2 hours
        </p>
      </Container>
    </section>
  );
}
