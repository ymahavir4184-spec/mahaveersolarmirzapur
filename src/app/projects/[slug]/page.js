import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { Zap, MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return siteConfig.projects.map((proj) => ({
    slug: proj.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const project = siteConfig.projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title.en} | Solar Installation Case Study`,
    description: project.summary.en,
  };
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const project = siteConfig.projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const estAnnualUnits = Math.round(project.capacityKw * (siteConfig.calculator.generationPerKwPerDay || 4.2) * 365);
  const estCo2OffsetTons = Math.round((estAnnualUnits * 0.82) / 1000); // ~0.82 kg CO2 per unit in India

  return (
    <>
      <PageHero
        badge={`${project.capacityKw} kW Solar Installation`}
        title={project.title.en}
        subtitle={project.summary.en}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.title.en, href: `/projects/${project.slug}` },
        ]}
      />

      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Main Project Image and Narrative (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <SmartImage
                  src={project.image}
                  alt={project.title.en}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                  Project Overview & Engineering Highlights
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {project.details.en}
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  The system was engineered using Tier-1 Monocrystalline modules and advanced multi-MPPT inverters to minimize mismatch losses and maximize power harvest throughout the day. Comprehensive lightning protection, dual chemical copper earthings, and digital SCADA telemetry were installed according to MNRE and CEA guidelines.
                </p>
              </div>

              {/* Commissioning Checklist */}
              <div className="p-6 sm:p-8 rounded-2xl bg-brand-ice border border-blue-100 space-y-4">
                <h3 className="text-lg font-bold font-display text-brand-navy">
                  Verified Engineering Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>3D Shadow & Structural Load Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>State Discom Net-Metering Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>25-Year Linear Power Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>Live Cloud Generation Telemetry</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specification Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-slate-50 border-slate-200/80 p-6 sm:p-7 space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-brand-navy border-b border-slate-200 pb-3">
                  Technical Specifications
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">Installed Capacity</span>
                    <span className="font-bold text-brand-navy text-lg">{project.capacityKw} kW</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Project Location</span>
                    <span className="font-semibold text-slate-800">{project.location.en}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Installation Sector</span>
                    <span className="font-semibold text-slate-800 capitalize">{project.type} Rooftop</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Approx. Annual Output</span>
                    <span className="font-bold text-emerald-600">~{estAnnualUnits.toLocaleString("en-IN")} kWh / year</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Estimated Annual CO₂ Offset</span>
                    <span className="font-semibold text-slate-800">~{estCo2OffsetTons} Tons CO₂ / year</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Button
                    href={`/quote?kw=${project.capacityKw}&type=${project.type}`}
                    variant="primary"
                    className="w-full justify-between"
                  >
                    <span>Request Similar System</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
