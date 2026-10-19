import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Compass, Home, Phone } from "lucide-react";

export const metadata = {
  title: "Page Not Found (404) | AuraSun Solar",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 bg-brand-ice/50">
      <Container className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-brand-primary flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200/60">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy font-display">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          Page Not Found
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          The solar page or resource you are looking for does not exist, has been removed, or has been relocated.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Return to Homepage</span>
          </Button>

          <Button href="/contact" variant="outline" size="md">
            <Phone className="w-4 h-4 mr-1.5" />
            <span>Contact Support</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
