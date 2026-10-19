import http from 'http';

const port = process.env.PORT || 3000;
const host = `http://localhost:${port}`;

const routesToCheck = [
  '/',
  '/about',
  '/services',
  '/services/residential',
  '/services/commercial',
  '/services/industrial',
  '/products',
  '/projects',
  '/projects/50kw-gurugram-cyber-city',
  '/projects/15kw-luxury-villa-gurugram',
  '/projects/250kw-industrial-plant-manesar',
  '/solar-savings-calculator',
  '/quote',
  '/contact',
  '/privacy',
  '/terms',
  '/sitemap.xml',
  '/robots.txt',
  '/client-assets/logo.svg',
  '/client-assets/favicon.ico',
  '/client-assets/hero.webp',
  '/client-assets/about.webp',
  '/client-assets/residential.webp',
  '/client-assets/commercial.webp',
  '/client-assets/industrial.webp',
  '/client-assets/inverter.webp',
  '/client-assets/battery.webp',
  '/client-assets/project-01.webp',
  '/client-assets/project-02.webp',
  '/client-assets/project-03.webp',
  '/client-assets/fallback.webp',
];

async function checkUrl(route) {
  const url = `${host}${route}`;
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        resolve({
          route,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
        });
      })
      .on('error', (err) => {
        resolve({
          route,
          status: 'ERROR',
          error: err.message,
          ok: false,
        });
      });
  });
}

async function main() {
  console.log(`Checking internal route links against ${host} ...\n`);

  let allPassed = true;
  for (const route of routesToCheck) {
    const res = await checkUrl(route);
    if (res.ok) {
      console.log(`  ✓ [${res.status}] ${route}`);
    } else {
      console.error(`  ❌ [${res.status}] ${route} (${res.error || 'Failed'})`);
      allPassed = false;
    }
  }

  console.log('\n----------------------------------------');
  if (allPassed) {
    console.log(`✓ All ${routesToCheck.length} routes and static assets returned HTTP 200/300. Zero broken links!`);
    process.exit(0);
  } else {
    console.error('❌ Some routes failed link check.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Link check runner failed:', err);
  process.exit(1);
});
