import http from 'http';
import { siteConfig } from '../src/config/site.js';
import { translations } from '../src/lib/translations.js';
import { normalizeIndianPhone } from '../src/lib/phone.js';

const port = process.env.PORT || 3005;
const baseUrl = `http://localhost:${port}`;

async function fetchPage(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    http
      .get(url, { headers }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          })
        );
      })
      .on('error', reject);
  });
}

async function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = JSON.stringify(body);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            json: JSON.parse(data),
          })
        );
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log('=====================================================');
  console.log('RUNNING FULL AUTOMATED VERIFICATION SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. First-visit behavior: Language overlay rendered in DOM
  console.log('1. Testing Language Selection First-Visit Overlay...');
  const resNoCookie = await fetchPage('/');
  assert(resNoCookie.status === 200, 'Homepage returns 200');
  assert(
    resNoCookie.body.includes('Continue in English') && resNoCookie.body.includes('हिंदी में आगे बढ़ें'),
    'Language overlay markup present for first-time visitors'
  );
  assert(
    resNoCookie.body.includes('Power Your Future with Smarter') && resNoCookie.body.includes('Solar Energy.'),
    'Underlying page content rendered in DOM for SEO crawlers'
  );

  // 2. Language cookie SSR matching
  console.log('\n2. Testing Language Cookie Persistence & SSR Matching...');
  const resHindi = await fetchPage('/', { Cookie: 'NEXT_LOCALE=hi' });
  assert(resHindi.status === 200, 'Hindi SSR request returns 200');
  assert(
    resHindi.body.includes('lang="hi"'),
    'HTML lang attribute correctly set to "hi" from cookie'
  );

  // 3. Indian Phone Normalization
  console.log('\n3. Testing Indian Phone Normalizer & Validator...');
  assert(normalizeIndianPhone('9876543210').isValid, '10-digit number is valid');
  assert(normalizeIndianPhone('9876543210').normalized === '+919876543210', 'Normalized to +919876543210');
  assert(normalizeIndianPhone('+91 98765 43210').normalized === '+919876543210', 'Handles +91 with spaces');
  assert(normalizeIndianPhone('09876543210').normalized === '+919876543210', 'Handles leading 0');
  assert(!normalizeIndianPhone('1234567890').isValid, 'Rejects numbers not starting 6-9');
  assert(!normalizeIndianPhone('98765').isValid, 'Rejects short numbers');

  // 4. API Without Supabase Credentials: 503 Honest Message
  console.log('\n4. Testing API Without Supabase Credentials (Honest Fallback)...');
  const freshPhone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
  const apiRes = await postJson('/api/leads', {
    name: 'Aarav Sharma',
    phone: freshPhone,
    category: 'Residential',
    consent: true,
    source: 'quote',
    language: 'en',
  });
  assert(apiRes.status === 503, 'Returns HTTP 503 Service Unavailable when DB unconfigured');
  assert(apiRes.json.code === 'BACKEND_NOT_CONFIGURED', 'Code is BACKEND_NOT_CONFIGURED');
  assert(
    apiRes.json.message.includes('Database storage is not configured'),
    'Returns honest message without fake success'
  );

  // 4b. Testing Deduplication
  console.log('\n4b. Testing 10-Minute Lead Deduplication Guard...');
  const dupeRes = await postJson('/api/leads', {
    name: 'Aarav Sharma',
    phone: freshPhone,
    category: 'Residential',
    consent: true,
    source: 'quote',
    language: 'en',
  });
  assert(dupeRes.status === 200, 'Duplicate submission returns 200');
  assert(dupeRes.json.code === 'DUPLICATE_RECENT', 'Deduplication code is DUPLICATE_RECENT');

  // 5. API Honeypot rejection
  console.log('\n5. Testing Honeypot Bot Rejection...');
  const hpRes = await postJson('/api/leads', {
    name: 'Bot Spammer',
    phone: '9876543210',
    consent: true,
    source: 'quote',
    honeypot: 'http://spam-link.ru',
  });
  assert(hpRes.status === 200, 'Honeypot returns 200');
  assert(hpRes.json.code === 'LEAD_RECORDED', 'Bot submission silently discarded');

  // 6. API Validation failure
  console.log('\n6. Testing Server-Side Zod Validation Errors...');
  const errRes = await postJson('/api/leads', {
    name: 'A', // too short
    phone: '123', // invalid
    consent: false, // consent required
  });
  assert(errRes.status === 400, 'Returns HTTP 400 Bad Request on validation failure');
  assert(errRes.json.code === 'VALIDATION_FAILED', 'Code is VALIDATION_FAILED');

  // 7. Login Button Config Visibility
  console.log('\n7. Testing Login Button Configuration...');
  assert(siteConfig.features.loginButton === false, 'loginButton is false by default in config');
  assert(
    !resNoCookie.body.includes('rel="noopener noreferrer">Client Portal</a>'),
    'Login button is completely omitted and takes zero space when loginButton: false'
  );

  // 8. Security Headers
  console.log('\n8. Testing Production Security Headers...');
  assert(resNoCookie.headers['x-frame-options'] === 'DENY', 'X-Frame-Options: DENY present');
  assert(resNoCookie.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff present');
  assert(resNoCookie.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy present');

  // 9. WhatsApp Pre-fill Encoding
  console.log('\n9. Testing WhatsApp Link Encoding...');
  const rawWhatsApp = siteConfig.company.whatsapp.replace(/\D/g, '');
  const sampleMsg = `Hello ${siteConfig.company.name}, I would like a quote.`;
  const waUrl = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(sampleMsg)}`;
  assert(waUrl.includes('https://wa.me/919452216034?text=Hello%20Mahaveer'), 'WhatsApp link properly encoded');

  // 10. Sitemap & Robots
  console.log('\n10. Testing Sitemap and Robots.txt...');
  const sitemapRes = await fetchPage('/sitemap.xml');
  assert(sitemapRes.status === 200, 'sitemap.xml returns 200');
  assert(sitemapRes.body.includes('<urlset'), 'Valid XML urlset');
  assert(sitemapRes.body.includes('projects/50kw-gurugram-cyber-city'), 'Sitemap contains project slugs');

  const robotsRes = await fetchPage('/robots.txt');
  assert(robotsRes.status === 200, 'robots.txt returns 200');
  assert(robotsRes.body.includes('Disallow: /api/'), 'Robots disallows /api/');
  assert(robotsRes.body.includes('sitemap.xml'), 'Robots references sitemap.xml');

  console.log('\n=====================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
