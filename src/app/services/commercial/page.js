import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { CheckCircle2, TrendingUp, Building2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Commercial Solar Power Systems | Offices, Hospitals & Schools",
  description: "Cut commercial operational costs and claim 40% accelerated depreciation with custom rooftop solar plants engineered for offices, schools, hospitals and retail centers.",
};

export default function CommercialSolarPage() {
  const service = siteConfig.services.commercial;

  return (
    <>
      <PageHero
        badge="Commercial Clean Power"
        title={service.title.en}
        subtitle={service.summary.en}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Commercial Solar", href: "/services/commercial" },
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
                10 kW to 100 kW Capacity
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy font-display">
                Protect Your Operating Margins Against Rising Commercial Tariffs
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Commercial electricity tariffs in Indian metros typically range between ₹8.5 to ₹12.5 per unit. A grid-tied solar plant generates electricity at an effective levelized cost (LCOE) below ₹2.50 per unit over 25 years. This generates substantial annual operating savings with full recovery of capital expenditure within 3 to 4 years.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Commercial Advantages:
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
                <Button href="/quote?type=commercial" variant="primary" size="lg">
                  <span>Request Commercial Site Audit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button href="/solar-savings-calculator" variant="secondary" size="lg">
                  <span>Estimate Commercial ROI</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Accelerated Depreciation Highlight */}
      <Section variant="ice">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-blue-100 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-8 h-8" />
            </div>

            <div className="space-y-2 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
                Tax Benefit: 40% Accelerated Depreciation (AD)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Under Section 32 of the Indian Income Tax Act, commercial businesses can claim up to 40% accelerated depreciation on solar power plant assets in the very first financial year. This significantly reduces taxable corporate income, effectively subsidizing up to 25% of the total project cost.
              </p>
            </div>

            <Button href="/quote?type=commercial" variant="primary" size="md" className="flex-shrink-0">
              <span>Talk to Tax Specialist</span>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Commercial Execution Process */}
      <Section variant="white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Commercial EPC Delivery Process
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Turnkey engineering designed for zero interruption to your daily business operations.
            </p>
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
