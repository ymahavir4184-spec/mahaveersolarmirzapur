import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LeadForm from "@/components/forms/LeadForm";
import { ShieldCheck, PhoneCall, CheckCircle2, Clock } from "lucide-react";

export const metadata = {
  title: "Get a Free Solar Quote | Rooftop Solar Sizing & Pricing",
  description: "Request a custom solar quote for your residential, commercial, or industrial rooftop. Free shadow analysis, payback estimate, and subsidy calculation.",
};

export default async function QuotePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const defaultKw = resolvedParams?.kw || "";
  const defaultBill = resolvedParams?.bill || "";
  const defaultType = resolvedParams?.type || "residential";

  return (
    <>
      <PageHero
        badge="Zero Obligation Sizing"
        title="Get Your Free Rooftop Solar Quote"
        subtitle="Tell us about your property and electricity consumption. Our certified solar engineering team will prepare an engineered 3D design and financial forecast."
        breadcrumbs={[{ label: "Get Quote", href: "/quote" }]}
      />

      <Section variant="ice">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Form Card (7 cols) */}
            <div className="lg:col-span-7">
              <LeadForm
                source="quote"
                defaultKw={defaultKw}
                defaultBill={defaultBill}
                defaultType={defaultType}
              />
            </div>

            {/* Right: What You Get & Assurance (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-border/80 space-y-6">
                <h3 className="text-xl font-bold font-display text-brand-navy">
                  What Happens Next?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">Engineer Review</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        A senior engineer analyzes your monthly consumption and rooftop orientation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">Free Feasibility Call</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        We contact you within 2 business hours to share sizing options and government subsidy calculations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">Complimentary Site Survey</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Our technicians conduct a physical shadow and structural roof inspection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>No spam guarantee. Your details are private.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% free with no obligation to purchase.</span>
                  </div>
                </div>
              </div>

              {/* Direct Call Card */}
              <div className="p-6 rounded-2xl bg-brand-navy text-white space-y-2">
                <span className="text-xs text-brand-secondary font-bold uppercase tracking-wider">
                  Prefer Speaking Immediately?
                </span>
                <div className="text-lg font-bold">
                  Call our solar desk:
                </div>
                <a
                  href={`tel:${siteConfig.company.phone}`}
                  className="inline-flex items-center gap-2 text-xl font-extrabold text-brand-secondary hover:underline"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>{siteConfig.company.displayPhone || siteConfig.company.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
