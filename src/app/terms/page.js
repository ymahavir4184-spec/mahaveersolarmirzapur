import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Terms & Conditions | AuraSun Solar Solutions",
  description: `Terms and conditions of website use and solar estimation services for ${siteConfig.company.name}.`,
};

export default function TermsPage() {
  const company = siteConfig.company;

  return (
    <>
      <PageHero
        badge="Legal & Compliance"
        title="Terms & Conditions"
        subtitle={`Terms governing the use of the website and services provided by ${company.name}.`}
        breadcrumbs={[{ label: "Terms & Conditions", href: "/terms" }]}
      />

      <Section variant="white">
        <Container className="max-w-4xl">
          {/* Legal Review Disclaimer Notice */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
            <strong>Legal Notice:</strong> These Terms and Conditions are provided as an operational baseline template driven by the site configuration of {company.name}. The website owner should have these terms formally reviewed by legal counsel before deploying to commercial production.
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">1. Nature of Website & Solar Estimations</h2>
              <p>
                All calculations, energy generation metrics, cost savings estimates, and payback periods displayed on this website or calculated by our Solar Savings Calculator are indicative estimates based on standard regional solar irradiation models (approx. 4.2 units/kW/day).
              </p>
              <p className="mt-2">
                Actual solar power generation depends on dynamic physical variables including azimuth angle, roof tilt, physical obstructions, dust accumulation, weather conditions, grid voltage fluctuations, and discom net metering policies. These estimates do not constitute a legally binding contractual guarantee of electrical generation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">2. Quotations and Engineering Site Surveys</h2>
              <p>
                Formal pricing and technical proposals are finalized only after a physical or drone-assisted shadow survey conducted by {company.name} engineers. Written proposals supersede all preliminary estimates provided online.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">3. Government Subsidies and Discom Approvals</h2>
              <p>
                Central financial assistance (such as PM Surya Ghar Muft Bijli Yojana) and net metering approvals are administered by the respective state discoms and the Ministry of New and Renewable Energy (MNRE). While {company.name} provides comprehensive liaison and documentation assistance, official grant approval timelines and disbursal remain subject to governmental discretion.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">4. Equipment Warranties</h2>
              <p>
                Solar photovoltaic modules, inverters, and battery storage units are backed by the respective original equipment manufacturers (OEMs). {company.name} provides manufacturer warranty certificates upon plant commissioning and facilitates warranty claims during the covered term.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">5. Contact Information</h2>
              <p>
                For questions regarding these terms, please contact our legal desk:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                <p><strong>Company:</strong> {company.name}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p><strong>Phone:</strong> {company.displayPhone || company.phone}</p>
                <p><strong>Address:</strong> {company.address}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
