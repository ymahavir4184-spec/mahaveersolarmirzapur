# Image Specifications & Optimization Standards

High-performance websites require optimized imagery to achieve 90+ Lighthouse scores and avoid Cumulative Layout Shift (CLS). This document outlines the exact dimensions, formats, and compression rules for all imagery used across the platform.

---

## Required Visual Assets Table

| Filename | Purpose | Recommended Resolution | Recommended Format | Max File Size | Target Aspect Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `logo.svg` | Primary brand header & footer logo | Scalable Vector (or 512×128 px PNG) | SVG (preferred) or PNG | < 50 KB | Horizontal ~4:1 |
| `favicon.ico` | Browser tab favicon | 48×48 px | ICO (or PNG) | < 25 KB | Square 1:1 |
| `hero.webp` | Homepage main hero graphic | 1920×1080 px | WebP | < 400 KB | 16:9 |
| `about.webp` | About page overview visual | 1200×1000 px | WebP | < 250 KB | 6:5 |
| `residential.webp` | Residential rooftop service image | 1200×800 px | WebP | < 250 KB | 3:2 |
| `commercial.webp` | Commercial rooftop service image | 1200×800 px | WebP | < 250 KB | 3:2 |
| `industrial.webp` | Industrial megawatt EPC image | 1200×800 px | WebP | < 250 KB | 3:2 |
| `inverter.webp` | Grid-tie & hybrid solar inverters | 1200×800 px | WebP | < 250 KB | 3:2 |
| `battery.webp` | Energy storage lithium batteries | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-01.webp` | Portfolio showcase case study 1 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-02.webp` | Portfolio showcase case study 2 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-03.webp` | Portfolio showcase case study 3 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `fallback.webp` | Branded fallback if an image fails | 800×600 px | WebP | < 100 KB | 4:3 |

---

## Formatting & Compression Best Practices

1. **Format**: Always deploy photographs in **WebP** format. WebP produces 25% to 35% smaller file sizes than JPEG at equivalent visual fidelity.
2. **Aspect Ratio Enforcement**: Use explicit aspect ratio containers (`aspect-[16/10]`, `aspect-[4/3]`) to prevent layout shifts while images load.
3. **Responsive Sizing**: The `SmartImage` component automatically configures responsive `sizes` attributes so mobile devices receive smaller, faster-loading image files.
4. **Hero Priority**: The hero image uses `priority={true}` to preload critical Above-The-Fold visual content. All subsequent images default to lazy loading (`loading="lazy"`).
5. **Lossy Compression**: When preparing photos with tools like Squoosh, TinyPNG, or Sharp, set quality to `75% - 85%`. Avoid exporting uncompressed 10 MB camera RAW/JPEG files directly into the web repository.
