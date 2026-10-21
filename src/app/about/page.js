import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { ShieldCheck, Award, Users, CheckCircle2, Zap } from "lucide-react";

export const metadata = {
  title: "About Us | Leading Solar EPC Provider in India",
  description: `Learn about ${siteConfig.company.name}, our engineering background, certified solar installation teams, and commitment to clean renewable energy.`,
};

export default function AboutPage() {
  const company = siteConfig.company;

  const milestones = [
    {
      year: company.establishedYear || "2018",
      title: "Company Founded",
      desc: "Established with a mission to bring world-class engineering to rooftop solar installations across North India.",
    },
    {
      year: "2020",
      title: "Commercial & Industrial EPC Expansion",
      desc: "Delivered megawatt-scale solar installations for manufacturing units and corporate parks.",
    },
    {
      year: "2022",
      title: "10 MW Installation Milestone",
      desc: "Surpassed 10 MW of operational solar rooftop capacity with 99.4% uptime across commercial and residential sites.",
    },
    {
      year: "2024+",
      title: "PM Surya Ghar National Accreditation",
      desc: "Empaneled provider facilitating direct central subsidy clearances and high-efficiency TOPCon installations.",
    },
  ];

  return (
    <>
      <PageHero
        badge={`About ${company.name}`}
        title="Engineering Precision. Clean Energy Independence."
        subtitle="We design, engineer, and commission high-yield rooftop solar systems engineered for 25+ years of reliable, zero-maintenance power generation."
        breadcrumbs={[{ label: "About Us", href: "/about" }]}
      />

      {/* Company Story & Mission */}
      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[6/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <SmartImage
                src={siteConfig.assets.about}
                alt={`${company.name} engineers at work`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy font-display">
                Built on Engineering Excellence and Uncompromising Quality
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                At {company.name}, we believe rooftop solar is more than just panel installation—it is a long-term infrastructure investment. Our certified electrical and structural engineers conduct detailed shadow analysis, structural load testing, and electrical yield modeling before a single bolt is tightened.
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We work exclusively with MNRE-approved, Tier-1 Mono PERC and TOPCon solar modules, high-efficiency European and Indian string inverters, and hot-dip galvanized mounting structures rated for wind speeds up to 170 km/h.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-brand-primary font-bold text-lg font-display">100% In-House</div>
                  <div className="text-xs text-slate-600 mt-1">Certified engineers, no outsourced technicians.</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-brand-primary font-bold text-lg font-display">Tier-1 Guaranteed</div>
                  <div className="text-xs text-slate-600 mt-1">25-year linear performance warranty.</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Principles */}
      <Section variant="ice">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Our Core Operational Standards
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              How our engineering team ensures your solar plant produces maximum kilowatt-hours every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-navy">
                Structural Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hot-dip galvanized steel frames with 80+ micron zinc coating ensure zero rust or degradation over 25+ years, even in high humidity or coastal zones.
              </p>
            </Card>

            <Card className="bg-white p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-navy">
                Optimal Generation Yield
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Using 3D PVSyst shadow analysis, each array is oriented at the exact astronomical tilt angle to maximize year-round solar energy capture.
              </p>
            </Card>

            <Card className="bg-white p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-navy">
                Dedicated Discom Liaison
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our in-house regulatory team manages the entire discom paperwork, inspection, bi-directional net meter installation, and central subsidy disbursement.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Company Milestones */}
      <Section variant="white">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Our Journey of Growth
            </h2>
          </div>

          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-24 text-2xl font-extrabold font-display text-brand-primary flex-shrink-0">
                  {m.year}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button href="/quote" variant="primary" size="lg">
              <span>Book a Free Solar Feasibility Study</span>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
