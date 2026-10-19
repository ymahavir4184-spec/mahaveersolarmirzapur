import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SolarCalculator from "@/components/calculator/SolarCalculator";

export const metadata = {
  title: "Solar Savings Calculator | Estimate Sizing, Cost & Payback Period",
  description: "Calculate your recommended solar rooftop system capacity in kW, estimated monthly generation, annual electricity bill savings, and rough payback period.",
};

export default function SolarSavingsCalculatorPage() {
  return (
    <>
      <PageHero
        badge="Instant Sizing Tool"
        title="Solar Rooftop Savings Calculator"
        subtitle="Input your average monthly power bill or electricity consumption to instantly estimate the ideal solar system capacity, monthly kilowatt-hours generated, and long-term financial payback."
        breadcrumbs={[{ label: "Savings Calculator", href: "/solar-savings-calculator" }]}
      />

      <Section variant="white">
        <Container>
          <SolarCalculator standalone />

          {/* Educational Formula Breakdown */}
          <div className="mt-16 max-w-4xl mx-auto p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl font-bold font-display text-brand-navy">
              How We Estimate Your Solar System Sizing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In most parts of India, a 1 kW grid-connected solar power plant produces an average of 4.0 to 4.5 kilowatt-hours (units) of electricity per day, taking into account seasonal variations, sunny days, and monsoons. This equates to approximately 120 to 135 units per month per kW installed.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              By matching your monthly electricity units against this regional generation curve, we compute the precise kilowatt rating needed to offset your utility bill through bi-directional net metering.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
