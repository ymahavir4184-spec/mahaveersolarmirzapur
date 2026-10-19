import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'public', 'client-assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to create clean solar illustration SVG with gradient
function createSvgPlaceholder({ width, height, title, subtitle, accentColor = '#0062FF', bgColor1 = '#0B192C', bgColor2 = '#1E293B' }) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor1}" />
          <stop offset="100%" stop-color="${bgColor2}" />
        </linearGradient>
        <linearGradient id="solarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284C7" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#0369A1" stop-opacity="0.95" />
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.2" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" />

      <!-- Subtle background grid -->
      <g opacity="0.08" stroke="#FFFFFF" stroke-width="1">
        ${Array.from({ length: 12 }).map((_, i) => `<line x1="${(width / 12) * i}" y1="0" x2="${(width / 12) * i}" y2="${height}" />`).join('')}
        ${Array.from({ length: 8 }).map((_, i) => `<line x1="0" y1="${(height / 8) * i}" x2="${width}" y2="${(height / 8) * i}" />`).join('')}
      </g>

      <!-- Solar Panel Grid Art in Center -->
      <g transform="translate(${width / 2 - 140}, ${height / 2 - 100}) scale(1)">
        <!-- Sun icon / Solar ray -->
        <circle cx="140" cy="-20" r="32" fill="${accentColor}" opacity="0.25" />
        <circle cx="140" cy="-20" r="18" fill="#F59E0B" />

        <!-- 3D Perspective Panel -->
        <polygon points="10,60 270,60 250,150 30,150" fill="url(#solarGlass)" stroke="#38BDF8" stroke-width="2" />
        <line x1="95" y1="60" x2="103" y2="150" stroke="#7DD3FC" stroke-width="1.5" />
        <line x1="185" y1="60" x2="177" y2="150" stroke="#7DD3FC" stroke-width="1.5" />
        <line x1="20" y1="105" x2="260" y2="105" stroke="#7DD3FC" stroke-width="1.5" />
      </g>

      <!-- Content text -->
      <text x="${width / 2}" y="${height / 2 + 90}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">
        ${title}
      </text>
      <text x="${width / 2}" y="${height / 2 + 125}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="400" fill="#94A3B8">
        ${subtitle}
      </text>
    </svg>
  `;
}

// Logo SVG
function createLogoSvg() {
  return `
    <svg width="240" height="60" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0062FF" />
          <stop offset="100%" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
      <!-- Sun + Panel Icon -->
      <g transform="translate(10, 8)">
        <circle cx="22" cy="22" r="20" fill="url(#logoGrad)" />
        <path d="M12 22 L32 22 M22 12 L22 32 M15 15 L29 29 M15 29 L29 15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
        <polygon points="14,24 30,24 28,31 16,31" fill="#FFFFFF" opacity="0.9" />
      </g>
      <!-- Text -->
      <text x="62" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#0B192C" letter-spacing="-0.5">
        Aura<tspan fill="#0062FF">Sun</tspan>
      </text>
      <text x="63" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748B" letter-spacing="1.5">
        SOLAR ENERGY
      </text>
    </svg>
  `;
}

// Favicon ICO (48x48 PNG buffer)
async function generateFavicon() {
  const svg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0062FF" />
          <stop offset="100%" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#favGrad)" />
      <circle cx="24" cy="20" r="8" fill="#F59E0B" />
      <polygon points="12,28 36,28 33,38 15,38" fill="#FFFFFF" />
      <line x1="24" y1="28" x2="24" y2="38" stroke="#0062FF" stroke-width="1.5" />
      <line x1="13.5" y1="33" x2="34.5" y2="33" stroke="#0062FF" stroke-width="1.5" />
    </svg>
  `;
  const buf = await sharp(Buffer.from(svg)).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(outputDir, 'favicon.ico'), buf);
}

const imagesToGenerate = [
  {
    name: 'hero.webp',
    width: 1920,
    height: 1080,
    title: 'Clean Solar Energy for India',
    subtitle: 'Tier-1 Mono PERC &amp; TOPCon Rooftop Installations',
    accentColor: '#0062FF',
    quality: 80,
  },
  {
    name: 'about.webp',
    width: 1200,
    height: 1000,
    title: 'Engineering Solar Excellence',
    subtitle: 'Certified EPC Teams &amp; End-to-End Net Metering',
    accentColor: '#0EA5E9',
    quality: 80,
  },
  {
    name: 'residential.webp',
    width: 1200,
    height: 800,
    title: 'Residential Solar Solutions',
    subtitle: 'Cut Household Electricity Bills up to 90%',
    accentColor: '#0062FF',
    quality: 80,
  },
  {
    name: 'commercial.webp',
    width: 1200,
    height: 800,
    title: 'Commercial Solar Solutions',
    subtitle: 'Accelerated Depreciation &amp; Fixed Long-Term Energy Costs',
    accentColor: '#0284C7',
    quality: 80,
  },
  {
    name: 'industrial.webp',
    width: 1200,
    height: 800,
    title: 'Industrial MW Scale EPC',
    subtitle: 'High Voltage Inverters &amp; Rugged Elevated Structures',
    accentColor: '#0369A1',
    quality: 80,
  },
  {
    name: 'inverter.webp',
    width: 1200,
    height: 800,
    title: 'Smart Solar Inverters',
    subtitle: 'High-Efficiency Grid-Tie &amp; Hybrid Inverters with Wi-Fi App',
    accentColor: '#0284C7',
    quality: 80,
  },
  {
    name: 'battery.webp',
    width: 1200,
    height: 800,
    title: 'Lithium Battery Storage',
    subtitle: 'LiFePO4 Deep Cycle Storage for 24/7 Power Security',
    accentColor: '#0062FF',
    quality: 80,
  },
  {
    name: 'project-01.webp',
    width: 1200,
    height: 800,
    title: '50 kW Commercial Rooftop',
    subtitle: 'Cyber City Hub, Gurugram • 72,000 kWh/year',
    accentColor: '#0062FF',
    quality: 80,
  },
  {
    name: 'project-02.webp',
    width: 1200,
    height: 800,
    title: '15 kW Luxury Villa System',
    subtitle: 'Golf Course Road, Gurugram • Zero Grid Bill',
    accentColor: '#0EA5E9',
    quality: 80,
  },
  {
    name: 'project-03.webp',
    width: 1200,
    height: 800,
    title: '250 kW Industrial Manufacturing EPC',
    subtitle: 'Manesar Industrial Area • 360,000 kWh/year',
    accentColor: '#0284C7',
    quality: 80,
  },
  {
    name: 'fallback.webp',
    width: 800,
    height: 600,
    title: 'Solar Installation Asset',
    subtitle: 'AuraSun High-Performance Solar Infrastructure',
    accentColor: '#0062FF',
    quality: 80,
  },
];

async function main() {
  console.log('Generating client assets in public/client-assets/ ...');

  // 1. Logo
  fs.writeFileSync(path.join(outputDir, 'logo.svg'), createLogoSvg());
  console.log('✓ Created logo.svg');

  // 2. Favicon
  await generateFavicon();
  console.log('✓ Created favicon.ico');

  // 3. WebP Images
  for (const img of imagesToGenerate) {
    const svg = createSvgPlaceholder(img);
    const dest = path.join(outputDir, img.name);
    await sharp(Buffer.from(svg))
      .resize(img.width, img.height)
      .webp({ quality: img.quality })
      .toFile(dest);
    const stat = fs.statSync(dest);
    console.log(`✓ Created ${img.name} (${Math.round(stat.size / 1024)} KB)`);
  }

  console.log('All placeholder assets generated successfully.');
}

main().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
