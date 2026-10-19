import { siteConfig } from "@/config/site";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SmartImage from "@/components/SmartImage";
import Button from "@/components/ui/Button";
import { ShieldCheck, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Solar Equipment & Hardware | Tier-1 Panels, Inverters & Batteries",
  description: "Explore MNRE-approved Tier-1 Mono PERC solar panels, smart European and Indian string inverters, LiFePO4 solar batteries, and certified mounting structures.",
};

export default function ProductsPage() {
  const products = siteConfig.productCategories;

  return (
    <>
      <PageHero
        badge="Certified Solar Hardware"
        title="High-Yield Solar Modules & Electrical Hardware"
        subtitle="We partner strictly with Tier-1 manufacturers to supply ALMM-listed solar panels, high-efficiency grid-tied inverters, and rugged structural components."
        breadcrumbs={[{ label: "Products", href: "/products" }]}
      />

      <Section variant="white">
        <Container>
          <div className="space-y-16">
            {products.map((product, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={product.id}
                  id={product.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`lg:col-span-6 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-white ${
                      isEven ? "lg:order-2" : ""
                    }`}
                  >
                    <SmartImage
                      src={product.image}
                      alt={product.name.en}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className={`lg:col-span-6 space-y-5 ${isEven ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-brand-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                        Tier-1 Certified
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                      {product.name.en}
                    </h2>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {product.description.en}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Technical Specifications & Standards:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {product.specs.map((spec, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60"
                          >
                            <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button href={`/quote?category=${encodeURIComponent(product.name.en)}`} variant="primary" size="md">
                        <span>Inquire About {product.name.en}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
