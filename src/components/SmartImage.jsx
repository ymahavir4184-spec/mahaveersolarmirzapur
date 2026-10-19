"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * SmartImage Component
 * Wraps next/image with resilient error handling, automatic lazy loading,
 * responsive sizes, and a branded fallback placeholder on failure.
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  fallbackSrc = siteConfig.assets?.fallback || "/client-assets/fallback.webp",
  quality = 85,
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  // Fallback to safe alt text if missing
  const safeAlt = alt || "Solar energy equipment and installation by AuraSun Solar";

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const imageProps = {
    src: currentSrc,
    alt: safeAlt,
    priority,
    sizes: fill ? sizes : undefined,
    quality,
    onError: handleError,
    className: `transition-opacity duration-300 ${className}`,
    ...rest,
  };

  if (fill) {
    return <Image fill alt={safeAlt} {...imageProps} />;
  }

  return (
    <Image
      width={width || 800}
      height={height || 600}
      alt={safeAlt}
      {...imageProps}
    />
  );
}
