# Client Assets Directory (`public/client-assets/`)

This directory houses all brand assets, imagery, and icons for the solar website platform. To customize this platform for any solar company client, simply replace the files in this directory using the exact filenames and specifications listed below.

## Asset Specifications Table

| Filename | Purpose | Recommended Dimensions | Recommended Format | Max File Size | Aspect Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `logo.svg` | Primary brand logo in header & footer | Scalable SVG (or 512×128 px PNG) | SVG (preferred) or WebP/PNG | < 50 KB | Horizontal (~4:1) |
| `favicon.ico` | Browser tab icon | 48×48 px | ICO (or 48×48 PNG) | < 25 KB | 1:1 |
| `hero.webp` | Homepage main hero background/display | 1920×1080 px | WebP | < 400 KB | 16:9 |
| `about.webp` | About page & company overview visual | 1200×1000 px | WebP | < 250 KB | 6:5 |
| `residential.webp` | Residential rooftop solar service visual | 1200×800 px | WebP | < 250 KB | 3:2 |
| `commercial.webp` | Commercial & corporate rooftop service visual | 1200×800 px | WebP | < 250 KB | 3:2 |
| `industrial.webp` | Industrial megawatt-scale solar EPC visual | 1200×800 px | WebP | < 250 KB | 3:2 |
| `inverter.webp` | Grid-tie & hybrid solar inverters product visual | 1200×800 px | WebP | < 250 KB | 3:2 |
| `battery.webp` | Solar lithium/lead storage solutions visual | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-01.webp` | Portfolio project showcase item 1 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-02.webp` | Portfolio project showcase item 2 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `project-03.webp` | Portfolio project showcase item 3 | 1200×800 px | WebP | < 250 KB | 3:2 |
| `fallback.webp` | Branded placeholder when an image fails to load | 800×600 px | WebP | < 100 KB | 4:3 |

## Image Guidelines
1. **Format**: Always use modern **WebP** for photographic content and **SVG** for vector logos to maximize performance and SEO scores.
2. **Compression**: Compress images with tools like Squoosh, Sharp, or TinyPNG before deploying.
3. **Regeneration Script**: You can regenerate tasteful placeholder assets at any time by running:
   ```bash
   npm run generate-placeholders
   ```
