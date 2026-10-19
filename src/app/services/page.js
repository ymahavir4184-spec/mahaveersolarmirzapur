import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Solar Installation Services | Residential, Commercial & Industrial EPC",
  description: "Explore turnkey rooftop solar solutions for residences, commercial enterprises, and industrial manufacturing plants with complete net metering and subsidy support.",
};

export default function ServicesPage() {
  const services = Object.values(siteConfig.services);

  return (
    <>
      <PageHero
        badge="Our Solar Capabilities"
        title="Comprehensive Solar Energy Solutions"
        subtitle="Turnkey engineering, procurement, construction (EPC), and net-metering services tailored to your property's specific electrical load and architectural structure."
        breadcrumbs={[{ label: "Services", href: "/services" }]}
      />

      <Section variant="white">
        <Container>
          <div className="space-y-16">
            {services.map((svc, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={svc.slug}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual */}
                  <div className={`lg:col-span-6 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-white ${
                    isEven ? "lg:order-2" : ""
                  }`}>
                    <SmartImage
                      src={svc.image}
                      alt={svc.title.en}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Text Details */}
                  <div className={`lg:col-span-6 space-y-5 ${isEven ? "lg:order-1" : ""}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                      {index === 0 ? "Residential" : index === 1 ? "Commercial" : "Industrial MW"}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                      {svc.title.en}
                    </h2>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {svc.summary.en}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Key Value Highlights
                      </h4>
                      <ul className="space-y-2">
                        {svc.benefits.en.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Button href={`/services/${svc.slug}`} variant="primary" size="md">
                        <span>Explore Full Solution</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>

                      <Button href={`/quote?type=${svc.slug}`} variant="outline" size="md">
                        <span>Get Site Feasibility Study</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Comparison Table Section */}
      <Section variant="ice">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Solar Solutions Comparison
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A quick guide to finding the right solar installation for your specific building category.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-700">
                <tr>
                  <th className="p-4 sm:p-5">Feature / Parameter</th>
                  <th className="p-4 sm:p-5">Residential Solar</th>
                  <th className="p-4 sm:p-5">Commercial Solar</th>
                  <th className="p-4 sm:p-5">Industrial EPC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-brand-navy">Typical Capacity</td>
                  <td className="p-4 sm:p-5">1 kW to 10 kW</td>
                  <td className="p-4 sm:p-5">10 kW to 100 kW</td>
                  <td className="p-4 sm:p-5">100 kW to 5+ MW</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-brand-navy">Primary Financial Benefit</td>
                  <td className="p-4 sm:p-5">PM Surya Ghar Subsidy (up to ₹78k)</td>
                  <td className="p-4 sm:p-5">40% Accelerated Depreciation (AD)</td>
                  <td className="p-4 sm:p-5">Fixed Low LCOE Tariff for 25 yrs</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-brand-navy">Estimated Payback</td>
                  <td className="p-4 sm:p-5">3.5 - 4.5 Years</td>
                  <td className="p-4 sm:p-5">3.0 - 4.0 Years</td>
                  <td className="p-4 sm:p-5">2.5 - 3.5 Years</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-brand-navy">Net Metering Support</td>
                  <td className="p-4 sm:p-5">LT Bi-directional Meter</td>
                  <td className="p-4 sm:p-5">LT / HT Discom Synchronization</td>
                  <td className="p-4 sm:p-5">HT 11kV/33kV CEIG Clearance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
    </>
  );
}
