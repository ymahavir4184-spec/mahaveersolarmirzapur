"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ items = [], allowMultiple = false, className = "" }) {
  const [openIndices, setOpenIndices] = useState([0]); // first item open by default

  const toggleIndex = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        const headingId = `accordion-heading-${index}`;
        const contentId = `accordion-content-${index}`;

        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-brand-primary/40 bg-white shadow-sm"
                : "border-brand-border/80 bg-white hover:border-slate-300"
            }`}
          >
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between text-left p-5 sm:p-6 font-display font-bold text-base sm:text-lg text-brand-navy hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <span className="pr-4">{item.title}</span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-blue-50 text-brand-primary" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={contentId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className={`px-5 sm:px-6 pb-6 pt-1 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100/80 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
