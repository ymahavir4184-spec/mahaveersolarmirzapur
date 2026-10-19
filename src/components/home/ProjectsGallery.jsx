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
import { MapPin, Zap, ArrowRight } from "lucide-react";

export default function ProjectsGallery() {
  const { language, t } = useLanguage();
  const projects = siteConfig.projects;

  if (!siteConfig.features.projects || !projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-white" id="projects-gallery">
      <Container>
        <SectionHeading
          badge={t.sections.projects.badge}
          title={t.sections.projects.title}
          subtitle={t.sections.projects.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj, idx) => {
            const title = proj.title?.[language] || proj.title?.en;
            const location = proj.location?.[language] || proj.location?.en;
            const summary = proj.summary?.[language] || proj.summary?.en;

            return (
              <MotionReveal key={proj.slug} delay={idx * 0.1}>
                <Card hover padding="none" className="h-full flex flex-col overflow-hidden bg-white">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <SmartImage
                      src={proj.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-brand-navy/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.capacityKw} kW</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                        <span>{location}</span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-brand-navy">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-colors"
                      >
                        <span>{t.sections.projects.viewCaseStudy}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/projects" variant="primary" size="md">
            <span>{t.buttons.viewAllProjects}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
