# Deployment Guide: Vercel & Production Infrastructure

This platform is optimized for seamless zero-downtime deployment on [Vercel](https://vercel.com).

---

## 1. Deploying to Vercel

### Step-by-Step Deployment
1. Create the Supabase project and run the current `supabase/setup.sql` in its SQL Editor before deploying. Database-backed staff sessions, billing APIs, and the estimate deletion audit log require the included tables/functions. For an existing setup, apply any required migrations through `20261021000800_remove_rate_limits.sql` once.
2. Push your client repository to GitHub, GitLab, or Bitbucket.
3. Sign in to [Vercel](https://vercel.com) and click **Add New -> Project**.
4. Select your solar client repository.
5. Framework Preset will automatically detect **Next.js**.
6. In the **Environment Variables** accordion, add the following production keys:
   - `NEXT_PUBLIC_SITE_URL`: The client's canonical URL (e.g. `https://aurasunsolar.com`)
   - `SUPABASE_URL`: The client's Supabase project URL
   - `SUPABASE_SECRET_KEY`: The client's Supabase Secret key (`sb_secret_...`); legacy projects can use `SUPABASE_SERVICE_ROLE_KEY`
   - `QUOTATION_LOGIN_ID`, `QUOTATION_LOGIN_PASSWORD`: Private staff portal credentials, each 1–10 characters
   - `ESTIMATE_DELETE_MASTER_PASSWORD`: Private value of 1–10 characters. It is checked server-side, and an active staff session plus estimate-number confirmation are required. Never commit it or add a `NEXT_PUBLIC_` prefix.
   - `COMPANY_GSTIN`: (Optional) Company's registered GSTIN; required to charge GST
   - `COMPANY_BANK_ACCOUNT`: (Optional) Account number printed on invoices
   - `BILL_NUMBER_PREFIX`: (Optional) Invoice number prefix, defaults to `ME`
   - `ESTIMATE_NUMBER_PREFIX`: (Optional) Estimate number prefix, defaults to `ME`
   - `RESEND_API_KEY`: (Optional) API key for immediate email notifications
   - `NOTIFICATION_EMAIL`: (Optional) Owner email for lead alerts
7. Click **Deploy**.

---

## 2. Custom Domain Configuration

1. In Vercel, navigate to **Settings -> Domains**.
2. Enter the client's apex domain (e.g. `aurasunsolar.com`) and choose the recommended option to redirect `www.aurasunsolar.com` to `aurasunsolar.com`.
3. In the client's DNS registrar (GoDaddy, Cloudflare, Namecheap, Google Domains):
   - Add an **A Record**: Host `@` pointing to Vercel's IP `76.76.21.21`
   - Add a **CNAME Record**: Host `www` pointing to `cname.vercel-dns.com`
4. Vercel will automatically provision and renew a free Let's Encrypt SSL/TLS certificate.

---

## 3. Production Security Headers

The `next.config.js` file automatically applies HTTP security headers on all routes:
- `X-Frame-Options: DENY` (prevents clickjacking attacks)
- `X-Content-Type-Options: nosniff` (prevents MIME-sniffing vulnerabilities)
- `Referrer-Policy: strict-origin-when-cross-origin` (protects user privacy on outbound links)
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (disables unnecessary hardware access)

---

## 4. Multi-Tenant Deployment Note
Each solar client should be deployed as its **own isolated Vercel project** with its own distinct Supabase database. This guarantees complete data isolation between competing solar companies and prevents cross-tenant credential leakage.
