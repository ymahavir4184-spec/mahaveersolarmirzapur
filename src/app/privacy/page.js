import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

export const metadata = {
  title: `Privacy Policy | ${siteConfig.company.name}`,
  description: `Privacy policy and customer data handling practices for ${siteConfig.company.name}.`,
};

export default function PrivacyPage() {
  const company = siteConfig.company;

  return (
    <>
      <PageHero
        badge="Legal & Compliance"
        title="Privacy Policy"
        subtitle={`How ${company.name} collects, protects, and uses customer consultation data.`}
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
      />

      <Section variant="white">
        <Container className="max-w-4xl">
          {/* Legal Review Disclaimer Notice */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
            <strong>Legal Notice:</strong> This privacy policy document is provided as an operational baseline template driven by the site configuration of {company.name}. The website owner should have this policy reviewed by qualified legal counsel to ensure full compliance with applicable Indian data protection laws, including the Digital Personal Data Protection Act (DPDPA).
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">1. Information We Collect</h2>
              <p>
                When you submit an enquiry, request a solar quote, or use our solar savings calculator on this website, {company.name} collects the following personal information with your explicit consent:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>Full Name</li>
                <li>Indian Mobile Number</li>
                <li>Email Address (optional)</li>
                <li>City, District, and State of installation</li>
                <li>Property category (Residential, Commercial, Industrial)</li>
                <li>Approximate monthly electricity bill or energy consumption figures</li>
                <li>Information regarding your rooftop area and solar preferences</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">2. Purpose of Data Processing</h2>
              <p>
                The information provided by you is strictly utilized for the following business purposes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>Preparing customized 3D solar system sizing and shadow feasibility reports</li>
                <li>Contacting you via phone call, SMS, or WhatsApp to schedule a complimentary site survey</li>
                <li>Processing discom net-metering applications and government subsidy paperwork (e.g. PM Surya Ghar Muft Bijli Yojana)</li>
                <li>Providing after-sales technical support and warranty documentation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">3. Data Sharing & Third Parties</h2>
              <p>
                {company.name} does <strong>not</strong> sell, rent, or trade your personal information to third-party marketing companies or data brokers. Your contact details are only shared with authorized entities strictly necessary to execute your solar installation:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>State electricity distribution companies (Discoms) for net-metering approval</li>
                <li>National solar portal / Ministry of New and Renewable Energy (MNRE) for direct subsidy credit</li>
                <li>Accredited electrical inspectors and structural testing engineers where mandated by law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">4. Data Retention & Security</h2>
              <p>
                Inbound customer enquiries are stored on secure cloud database servers with strict Row Level Security (RLS) policies. Only authorized project managers have access to lead records. We retain consultation records for as long as necessary to fulfill project warranties and customer service obligations.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">5. Your Privacy Rights</h2>
              <p>
                Under applicable Indian data protection principles, you have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request the deletion of your consultation record. To exercise these rights, please contact our data grievance desk at:
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
