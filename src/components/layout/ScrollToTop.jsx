"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Start each newly opened route at its top instead of restoring a stale offset. */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
