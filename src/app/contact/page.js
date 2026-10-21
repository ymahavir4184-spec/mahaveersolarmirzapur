import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import LeadForm from "@/components/forms/LeadForm";
import Button from "@/components/ui/Button";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us | Solar Consultation & Office Locations",
  description: `Contact ${siteConfig.company.name} for rooftop solar site surveys, commercial EPC consultations, and government subsidy guidance.`,
};

export default function ContactPage() {
  const company = siteConfig.company;
  const rawPhone = company.whatsapp.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${rawPhone}?text=${encodeURIComponent(`Hello ${company.name}, I would like to get in touch regarding a solar project.`)}`;

  return (
    <>
      <PageHero
        badge="Connect with Our Team"
        title={`Contact ${company.name}`}
        subtitle="Have a question about rooftop solar viability, net metering regulations, or custom commercial quotes? Our senior solar engineers are ready to assist."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
      />

      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Info & Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-brand-ice/60 border-blue-100 p-6 sm:p-8 space-y-6">
                <h3 className="text-xl font-bold font-display text-brand-navy">
                  Corporate Headquarters
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Office Address
                      </span>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed mt-0.5">
                        {company.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Telephone
                      </span>
                      <a
                        href={`tel:${company.phone}`}
                        className="text-sm font-bold text-brand-navy hover:text-brand-primary"
                      >
                        {company.displayPhone || company.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Email Desk
                      </span>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-sm font-bold text-brand-navy hover:text-brand-primary break-all"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>

                  <div className="pl-9 text-xs text-slate-500">
                    <b>GSTIN/UIN:</b> {company.gstin}
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Working Hours
                      </span>
                      <p className="text-sm text-slate-700 mt-0.5">
                        {siteConfig.businessHours.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200/60 space-y-3">
                  <Button
                    href={company.mapsUrl}
                    external
                    variant="outline"
                    size="sm"
                    className="w-full bg-white"
                  >
                    <span>View on Google Maps</span>
                  </Button>

                  <Button
                    href={whatsappHref}
                    external
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A]"
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right: Message Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h3 className="text-2xl font-bold font-display text-brand-navy">
                  Send Us a Direct Message
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in your details below and an engineer will reply within 2 business hours.
                </p>
              </div>

              <LeadForm source="contact" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
