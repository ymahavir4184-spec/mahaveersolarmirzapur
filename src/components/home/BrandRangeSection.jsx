"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";

const brands = [
  { name: "Luminous", wordmark: "LUMINOUS", color: "#e3262e", style: "font-black tracking-tight" },
  { name: "Waaree", wordmark: "WAAREE", submark: "ENERGIES", color: "#146b45", style: "font-black italic tracking-wide" },
  { name: "Adani Solar", wordmark: "ADANI", submark: "SOLAR", color: "#174b82", style: "font-extrabold tracking-[0.12em]" },
  { name: "Exide", wordmark: "EXIDE", color: "#19733d", style: "font-black italic tracking-tight" },
  { name: "Livguard", wordmark: "LIVGUARD", color: "#d32f3a", style: "font-black tracking-tight" },
  { name: "Microtek", wordmark: "MICROTEK", color: "#1556a0", style: "font-black tracking-tight" },
  { name: "Okaya", wordmark: "OKAYA", color: "#c62836", style: "font-black tracking-[0.08em]" },
  { name: "Premier Energies", wordmark: "PREMIER", submark: "ENERGIES", color: "#25477b", style: "font-black tracking-[0.1em]" },
  { name: "Havells", wordmark: "HAVELLS", color: "#e3262e", style: "font-black tracking-tight" },
];

export default function BrandRangeSection() {
  const { language } = useLanguage();
  const isHindi = language === "hi";

  return (
    <section
      aria-labelledby="brand-range-heading"
      className="border-y border-blue-100/70 bg-gradient-to-b from-white via-blue-50/40 to-white py-10 sm:py-14"
    >
      <Container>
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-primary">
            {isHindi ? "हमारे यहाँ उपलब्ध ब्रांड" : "Brands available"}
          </p>
          <h2 id="brand-range-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            {isHindi ? "सोलर के जाने-माने ब्रांड" : "Solar brands for your system"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {isHindi
              ? "आपकी जरूरत और सिस्टम के अनुसार अलग-अलग ब्रांड के विकल्प।"
              : "Choose from popular brands based on your system and requirements."}
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {brands.map((brand, index) => (
            <li
              key={brand.name}
              className={`flex min-h-[76px] items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:min-h-[88px] sm:rounded-2xl ${
                index === brands.length - 1 ? "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:mx-0 sm:w-auto" : ""
              }`}
              aria-label={brand.name}
            >
              <div className="flex flex-col items-center justify-center text-center leading-none" role="img" aria-label={`${brand.name} brand wordmark`}>
                <span className={`text-base sm:text-lg ${brand.style}`} style={{ color: brand.color }}>
                  {brand.wordmark}
                </span>
                {brand.submark && (
                  <span className="mt-1 text-[9px] font-extrabold tracking-[0.24em] text-slate-500 sm:text-[10px]">
                    {brand.submark}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-5 max-w-3xl text-center text-[11px] leading-5 text-slate-500">
          {isHindi
            ? "ब्रांड/मॉडल की उपलब्धता प्रोजेक्ट की जरूरत के अनुसार confirm की जाएगी। सभी brand names उनके respective owners के हैं।"
            : "Brand and model availability is confirmed for each project. All brand names belong to their respective owners."}
        </p>
      </Container>
    </section>
  );
}
