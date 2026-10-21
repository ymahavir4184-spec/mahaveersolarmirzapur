# Client Setup Guide: Launching a New Solar Client Website

This step-by-step guide explains how to take this master codebase and configure it for a brand-new solar installation company in under 30 minutes.

---

## 9-Step Onboarding Workflow

### Step 1: Duplicate the Master Repository
Create a new private repository for your new client and copy the codebase:
```bash
git clone <this-repository-url> client-solar-website
cd client-solar-website
rm -rf .git
git init
git add .
git commit -m "Initial commit from master solar platform template"
```

### Step 2: Customize `src/config/site.js`
Open `src/config/site.js`. This is the central control room for the entire site:
1. **Company Details**: Update `name`, `tagline` (EN/HI), `phone`, `displayPhone`, `whatsapp`, `email`, `address`, and `mapsUrl`.
2. **Branding Colors**: Adjust `primary` (default `#0062FF`), `primaryDark`, `secondary`, and `text` to match the client's corporate palette.
3. **Services**: Review the residential, commercial, and industrial offerings.
4. **Projects**: Add real project installations under `projects` (slug, title, location, capacityKw, details).
5. **Feature Flags**:
   - `loginButton`: Set to `true` and provide `login.url` only if the client provides an external customer portal link. Otherwise leave `false`.
   - `showPlaceholders`: Set to `false` in production so sample stats/testimonials are hidden until real verified data is provided.
6. **Calculator Constants**: Set `defaultTariffPerUnit` (e.g. `8.5`), `costPerKw` (e.g. `55000`), and `generationPerKwPerDay` (e.g. `4.2`) based on the client's state discom rates.

### Step 3: Replace Client Assets in `public/client-assets/`
Replace the placeholder image files with authentic client media (keep exact filenames):
- `logo.svg`: Client's high-resolution vector logo
- `favicon.ico`: 48×48 px icon
- `hero.webp`: 1920×1080 px image of a real rooftop installation
- `about.webp`: 1200×1000 px photo of the client's engineering team or warehouse
- `residential.webp`: 1200×800 px photo of an installed home solar system
- `commercial.webp`: 1200×800 px photo of a commercial rooftop
- `industrial.webp`: 1200×800 px photo of an industrial plant
- `project-01.webp`, `project-02.webp`, `project-03.webp`: 1200×800 px case study imagery

*Refer to `docs/IMAGES.md` for exact resolution and compression instructions.*

### Step 4: Verify Hindi & English Content
Review `src/lib/translations.js` if the client operates in a specific regional market. Ensure city names, phone numbers, and local discom references align with the client's operating jurisdiction.

### Step 5: Configure Production Domain
In `src/config/site.js` and `.env.local`, set:
```bash
NEXT_PUBLIC_SITE_URL="https://clientdomain.com"
```

### Step 6: Set Up Supabase Database
1. Create a free account and project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your new project dashboard.
3. Open the current `supabase/setup.sql`, paste the whole file into SQL Editor, and click **Run** once. It creates or safely updates the leads, quotations, bill and estimate tables/functions, optional document fields, staff sessions, and compact estimate-deletion audit log. For SQL Editor users, use this full setup file rather than running individual migrations alongside it.
4. Navigate to **Project Settings -> API**:
   - Copy **Project URL**
   - Copy the **Secret key** (`sb_secret_...`) from API Keys. If the project only has legacy keys, use its `service_role` key instead.
5. Keep the secret key private. Never use a `NEXT_PUBLIC_` prefix or commit it to Git.

### Step 7: Configure Environment Variables
Create `.env.local` for local testing and set the following in your hosting provider (e.g. Vercel):
```env
NEXT_PUBLIC_SITE_URL="https://clientdomain.com"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SECRET_KEY="sb_secret_your-secret-key"
# Legacy-key fallback, only if no Secret key is available:
# SUPABASE_SERVICE_ROLE_KEY="your-legacy-service-role-key"
QUOTATION_LOGIN_ID="your-id-10"
QUOTATION_LOGIN_PASSWORD="your-pass9"
ESTIMATE_DELETE_MASTER_PASSWORD="your-private-value-up-to-10-chars"
COMPANY_GSTIN="registered-business-gstin"
COMPANY_BANK_ACCOUNT="account-number-printed-on-invoices"
BILL_NUMBER_PREFIX="ME"
ESTIMATE_NUMBER_PREFIX="ME"
```
Set the staff login ID, staff password, and estimate-delete master password to private values of 1–10 characters each; keep the delete password distinct from the staff password. The login fields accept up to 10 characters. Deletion also requires an active staff session and estimate-number confirmation. Keep `.env.local` out of source control and set the private values in the hosting provider too. The delete password is only checked by the server and is not stored in the database.

The legal billing profile is configured in `src/config/site.js`. Keep `COMPANY_GSTIN` and `COMPANY_BANK_ACCOUNT` in server-side environment variables only; do not add either with a `NEXT_PUBLIC_` prefix.

### Step 8: Deploy on Vercel
1. Import the Git repository into Vercel.
2. Select **Next.js** framework preset.
3. Add the environment variables configured in Step 7.
4. Click **Deploy**.
5. Once deployed, add the custom production domain under **Settings -> Domains** and configure the required DNS records (`A` and `CNAME`).

### Step 9: Post-Deployment Verification
- Verify the `leads`, `quotations`, `bills`, `bill_items`, `estimates`, `estimate_deletion_log`, and `staff_sessions` tables exist with RLS enabled, and the billing/estimate create, report, session, and delete/audit functions are present.
- Open the Bill Records and Estimate Records pages on two devices; newly saved rows should appear after refresh or within 30 seconds.
- Download both CSV exports in Excel and verify their header rows, GST breakdowns, optional invoice fields, and every product line.
- Submit a test lead through `/quote` and verify the lead row appears in the Supabase `leads` table.
- Test the language toggle between English and Hindi on desktop and mobile.
- Verify that WhatsApp prefilled links open properly.
- Run `npm run check-links` to ensure zero broken links.
