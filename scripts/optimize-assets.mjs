import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const brainDir = '/Users/akashyadav/.gemini/antigravity-ide/brain/ad599ae8-ab05-475c-89a8-d9f62b693f93';
const targetDir = '/Users/akashyadav/Documents/Solar_Website/public/client-assets';

const mappings = [
  {
    src: 'hero_solar_rooftop_1792408196871.jpg',
    targets: ['hero.webp'],
    width: 1920,
    quality: 85,
  },
  {
    src: 'about_solar_team_1792408277391.jpg',
    targets: ['about.webp'],
    width: 1600,
    quality: 84,
  },
  {
    src: 'residential_solar_home_1792408232481.jpg',
    targets: ['residential.webp', 'project-02.webp'],
    width: 1400,
    quality: 84,
  },
  {
    src: 'commercial_solar_array_1792408214768.jpg',
    targets: ['commercial.webp'],
    width: 1400,
    quality: 84,
  },
  {
    src: 'industrial_solar_plant_1792408256557.jpg',
    targets: ['industrial.webp', 'project-03.webp'],
    width: 1600,
    quality: 84,
  },
  {
    src: 'project_cyber_city_1792408303393.jpg',
    targets: ['project-01.webp'],
    width: 1400,
    quality: 84,
  },
];

async function convert() {
  console.log('Optimizing and converting generated AI imagery to WebP...\n');
  for (const item of mappings) {
    const srcPath = path.join(brainDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }

    for (const targetFile of item.targets) {
      const outPath = path.join(targetDir, targetFile);
      await sharp(srcPath)
        .resize({ width: item.width, withoutEnlargement: true })
        .webp({ quality: item.quality, effort: 5 })
        .toFile(outPath);
      
      const stats = fs.statSync(outPath);
      console.log(`✓ Generated ${targetFile} (${Math.round(stats.size / 1024)} KB) from ${item.src}`);
    }
  }
  console.log('\nAll assets converted successfully!');
}

convert().catch(err => {
  console.error('Error during image conversion:', err);
  process.exit(1);
});
