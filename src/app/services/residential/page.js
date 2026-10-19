import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, FileText } from "lucide-react";

export const metadata = {
  title: "Residential Rooftop Solar Installation | PM Surya Ghar Subsidy",
  description: "Cut your household electricity bills by up to 90% with Tier-1 residential rooftop solar systems and up to ₹78,000 direct central government subsidy.",
};

export default function ResidentialSolarPage() {
  const service = siteConfig.services.residential;

  return (
    <>
      <PageHero
        badge="Residential Clean Energy"
        title={service.title.en}
        subtitle={service.summary.en}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Residential Solar", href: "/services/residential" },
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
                1 kW to 10 kW Capacity
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy font-display">
                Slash Domestic Electricity Bills up to 90%
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Whether you live in an independent villa, kothi, or row-house, residential rooftop solar transforms your empty terrace into a private power generation asset. Through grid-synchronous net metering, daytime surplus generation is exported to the discom, reducing your monthly electricity bills to near zero.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Homeowner Benefits:
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
                <Button href="/quote?type=residential" variant="primary" size="lg">
                  <span>Get Residential Quote</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button href="/solar-savings-calculator" variant="secondary" size="lg">
                  <span>Calculate Home Savings</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Subsidy Highlight */}
      <Section variant="ice">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-blue-100 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8" />
            </div>

            <div className="space-y-2 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
                PM Surya Ghar: Muft Bijli Yojana Assistance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eligible residential consumers can claim direct central financial assistance: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and above. Our team handles your entire portal registration, document verification, and discom liaison at zero extra fee.
              </p>
            </div>

            <Button href="/quote?type=residential" variant="primary" size="md" className="flex-shrink-0">
              <span>Apply for Subsidy</span>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Installation Process */}
      <Section variant="white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Residential Installation Steps
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A smooth, transparent four-step workflow from survey to bi-directional net meter synchronization.
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
