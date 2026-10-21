import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = '/Users/akashyadav/.gemini/antigravity-ide/brain/ad599ae8-ab05-475c-89a8-d9f62b693f93/.user_uploaded/media_1792416302934.png';
const targetDir = '/Users/akashyadav/Documents/Solar_Website/public/client-assets';

async function processLogo() {
  console.log('Processing Mahaveer Enterprises logo...\n');

  // 1. Trim whitespace to center the circular emblem tightly
  const trimmedBuffer = await sharp(inputPath)
    .trim()
    .toBuffer();

  const metadata = await sharp(trimmedBuffer).metadata();
  console.log(`Trimmed dimensions: ${metadata.width}x${metadata.height}`);

  // Create a clean square bounding box with small 10px breathing room
  const maxDim = Math.max(metadata.width, metadata.height) + 20;

  // 2. High-res PNG for crisp rendering
  const logoPngPath = path.join(targetDir, 'logo.png');
  await sharp(trimmedBuffer)
    .resize({
      width: 600,
      height: 600,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(logoPngPath);
  console.log(`✓ Created ${logoPngPath}`);

  // 3. Web-optimized WebP
  const logoWebpPath = path.join(targetDir, 'logo.webp');
  await sharp(trimmedBuffer)
    .resize({
      width: 600,
      height: 600,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .webp({ quality: 95 })
    .toFile(logoWebpPath);
  console.log(`✓ Created ${logoWebpPath}`);

  // 4. Also write to public/client-assets/logo.svg fallback or keep logo.png as primary
  // Generate favicon (128x128 png and ico)
  const faviconPngPath = path.join(targetDir, 'favicon.ico');
  await sharp(trimmedBuffer)
    .resize(64, 64, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(faviconPngPath);
  console.log(`✓ Updated favicon at ${faviconPngPath}`);

  // Copy to public/favicon.ico as well
  fs.copyFileSync(faviconPngPath, '/Users/akashyadav/Documents/Solar_Website/public/favicon.ico');
  console.log('✓ Updated public/favicon.ico');
}

processLogo().catch(err => {
  console.error('Logo processing failed:', err);
  process.exit(1);
});
