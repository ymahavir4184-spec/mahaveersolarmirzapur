"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import Button from "../ui/Button";
import SmartImage from "../SmartImage";
import Badge from "../ui/Badge";
import { CheckCircle2, ArrowRight, Calculator, Zap, Sun, Shield } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const FloatingCard = ({ children, className = "", delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10, scale: 0.95 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HeroSection() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const companyTagline =
    siteConfig.company.tagline?.[language] ||
    siteConfig.company.tagline?.en ||
    t.hero.subtitle;

  const features = [t.hero.feature1, t.hero.feature2, t.hero.feature3];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 70% at 50% -5%, rgba(0, 98, 255, 0.08) 0%, transparent 60%), linear-gradient(180deg, #eef5ff 0%, #f8fbff 30%, #ffffff 70%)",
      }}
    >
      {/* Decorative ambient blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.07) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 98, 255, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid dots */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,98,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%)",
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial={shouldReduceMotion ? "show" : "hidden"}
            animate="show"
            className="lg:col-span-7 space-y-7"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge variant="primary" size="md" className="shadow-sm">
                {t.hero.badge}
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold tracking-tight font-display leading-[1.08] text-balance">
                <span className="text-brand-navy">{t.hero.title.split(" ").slice(0, -2).join(" ")} </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #0062FF 0%, #0EA5E9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t.hero.title.split(" ").slice(-2).join(" ")}
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl"
            >
              {companyTagline}
            </motion.p>

            {/* Feature chips */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-full px-4 py-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Button
                href="/quote"
                variant="primary"
                size="lg"
                className="shadow-xl"
                style={{ boxShadow: "0 8px 32px -8px rgba(0, 98, 255, 0.45)" }}
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>

              <Button href="/solar-savings-calculator" variant="secondary" size="lg">
                <Calculator className="w-5 h-5 mr-1" />
                <span>{t.hero.ctaSecondary}</span>
              </Button>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                MNRE Approved
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Tier-1 Modules Only
              </span>
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-brand-primary" />
                PM Surya Ghar Partner
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow behind image */}
              <div
                className="absolute -inset-6 rounded-3xl pointer-events-none -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 40%, rgba(0,98,255,0.14) 0%, rgba(14,165,233,0.08) 50%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Main image frame */}
              <FloatingCard delay={0.3} className="relative">
                <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/60">
                  <SmartImage
                    src={siteConfig.assets.dashboardHero}
                    alt="Mahaveer Enterprises solar energy solutions in Mirzapur"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent" />
                </div>
              </FloatingCard>

              {/* Floating: MNRE badge */}
              <FloatingCard
                delay={0.55}
                className="relative mt-3 w-fit max-w-full z-10 sm:absolute sm:mt-0 sm:-bottom-5 sm:-left-6"
              >
                <div className="glass-card px-4 py-3 rounded-2xl shadow-elevated flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-brand-navy">MNRE Approved</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Govt. Subsidy Certified</div>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating: Generation stat badge */}
              <FloatingCard
                delay={0.7}
                className="relative mt-3 ml-auto w-fit max-w-full z-10 sm:absolute sm:mt-0 sm:ml-0 sm:-top-4 sm:-right-5"
              >
                <div className="glass-card px-4 py-3 rounded-2xl shadow-elevated flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-brand-navy">4.2+ kWh / day</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Per kW Installed</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
