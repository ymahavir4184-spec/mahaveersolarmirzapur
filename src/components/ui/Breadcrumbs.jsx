import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 text-xs sm:text-sm ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-brand-muted">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="hover:text-brand-primary flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary rounded"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-medium text-brand-navy truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
