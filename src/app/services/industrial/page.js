import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { CheckCircle2, Factory, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Industrial Solar EPC & MW Scale Rooftop Installations",
  description: "Turnkey megawatt-scale solar EPC for manufacturing plants, warehouses, cold storage, and industrial complexes with high-voltage interconnection and SCADA monitoring.",
};

export default function IndustrialSolarPage() {
  const service = siteConfig.services.industrial;

  return (
    <>
      <PageHero
        badge="Megawatt Scale EPC"
        title={service.title.en}
        subtitle={service.summary.en}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Industrial EPC", href: "/services/industrial" },
        ]}
      />

      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <SmartImage
                src={service.image}
                alt={service.title.en}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                100 kW to 5+ MW Scale
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy font-display">
                Heavy-Duty Renewable Infrastructure for Manufacturing Plants
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                For manufacturing facilities, textile mills, auto ancillary plants, and cold storage warehouses, energy costs represent a substantial percentage of total operational expenditure. Our industrial EPC team designs high-capacity rooftop, elevated structure, and ground-mount plants capable of offsetting gigawatt-hours of grid consumption each year.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Industrial EPC Advantages:
                </h4>
                <ul className="space-y-2.5">
                  {service.benefits.en.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button href="/quote?type=industrial" variant="primary" size="lg">
                  <span>Request Industrial Feasibility Study</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button href="/contact" variant="outline" size="lg">
                  <span>Speak with Lead EPC Engineer</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Financing Models */}
      <Section variant="ice">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Flexible Industrial Financing Models
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Choose the financing structure that best matches your company&apos;s capital allocation strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 px-2.5 py-1 rounded-md">
                Direct Ownership
              </span>
              <h3 className="text-xl font-bold font-display text-brand-navy">
                CAPEX Model (Capital Expenditure)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The enterprise self-funds or bank-finances the solar plant installation. Full electricity generation savings accrue to your balance sheet from Day 1, with complete accelerated depreciation tax write-offs in the first financial year.
              </p>
            </Card>

            <Card className="bg-white p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Zero Upfront Investment
              </span>
              <h3 className="text-xl font-bold font-display text-brand-navy">
                OPEX / RESCO Model (PPA)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Third-party solar investors fund and maintain the rooftop solar plant on your industrial shed. You simply buy clean solar power at a guaranteed tariff 20% to 40% lower than state discom grid rates through a long-term Power Purchase Agreement.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Industrial Process */}
      <Section variant="white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Industrial Commissioning Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.en.map((p, i) => (
              <Card key={i} className="p-6 bg-slate-50/50 space-y-3">
                <span className="w-9 h-9 rounded-xl bg-brand-primary text-white font-bold flex items-center justify-center text-sm">
                  0{i + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-brand-navy leading-relaxed">
                  {p}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
