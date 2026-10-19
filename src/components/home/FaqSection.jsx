"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Accordion from "../ui/Accordion";
import Button from "../ui/Button";
import { MessageCircle } from "lucide-react";

export default function FaqSection() {
  const { language, t } = useLanguage();
  const rawFaqs = siteConfig.faqs;

  const accordionItems = rawFaqs.map((faq) => ({
    title: faq.question?.[language] || faq.question?.en,
    content: faq.answer?.[language] || faq.answer?.en,
  }));

  const rawPhone = siteConfig.company.whatsapp.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    language === "hi"
      ? "नमस्ते, मेरे पास सोलर इंस्टॉलेशन से संबंधित कुछ सवाल हैं।"
      : "Hello, I have a few technical questions regarding rooftop solar installation."
  )}`;

  return (
    <section className="py-20 md:py-28 bg-brand-ice border-y border-blue-100/60" id="faqs">
      <Container className="max-w-4xl">
        <SectionHeading
          badge={t.sections.faqs.badge}
          title={t.sections.faqs.title}
          subtitle={t.sections.faqs.subtitle}
        />

        <Accordion items={accordionItems} />

        <div className="mt-12 p-6 rounded-2xl bg-white border border-blue-100/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-brand-navy">
              {t.sections.faqs.stillQuestions}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our solar engineering specialists are available to answer your technical questions.
            </p>
          </div>

          <Button
            href={whatsappHref}
            external
            variant="primary"
            size="sm"
            icon={MessageCircle}
          >
            <span>{t.buttons.openWhatsapp}</span>
          </Button>
        </div>
      </Container>
    </section>
  );
}
