import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { MapPin, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: `Solar Installation Projects & Portfolio | ${siteConfig.company.name}`,
  description: `Browse completed residential, commercial, and industrial rooftop solar projects installed and commissioned by ${siteConfig.company.name}.`,
};

export default function ProjectsPage() {
  const projects = siteConfig.projects;

  return (
    <>
      <PageHero
        badge="Proven Track Record"
        title="Featured Solar Rooftop Installations"
        subtitle="Explore our portfolio of commissioned residential, corporate, and industrial solar power plants delivering clean kilowatt-hours daily."
        breadcrumbs={[{ label: "Projects", href: "/projects" }]}
      />

      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <Card
                key={proj.slug}
                hover
                padding="none"
                className="flex flex-col justify-between overflow-hidden bg-white shadow-card border-brand-border/80"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <SmartImage
                      src={proj.image}
                      alt={proj.title.en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-brand-navy/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.capacityKw} kW</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                      {proj.type}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                      <span>{proj.location.en}</span>
                    </div>

                    <h3 className="text-lg font-bold font-display text-brand-navy">
                      {proj.title.en}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {proj.summary.en}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <Button
                    href={`/projects/${proj.slug}`}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-brand-ice border border-blue-100 text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
              Have a Similar Solar Installation in Mind?
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Our engineering team can evaluate your site layout and calculate expected solar generation and payback period.
            </p>
            <Button href="/quote" variant="primary" size="md">
              <span>Request Free Site Feasibility Study</span>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
