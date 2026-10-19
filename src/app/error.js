"use client";

import { useEffect } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log only safe error metadata
    console.error("Application error:", error?.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 bg-brand-ice/50">
      <Container className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-200">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
          Something Went Wrong
        </h1>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          An unexpected error occurred while rendering this solar page. Please try refreshing or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary" size="md">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </Button>

          <Button href="/" variant="outline" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Go to Homepage</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
