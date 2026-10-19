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
3. Open `supabase/schema.sql` from this repository, paste the contents into the editor, and click **Run**.
4. Navigate to **Project Settings -> API**:
   - Copy **Project URL**
   - Copy **service_role** secret key (under Project API keys)

### Step 7: Configure Environment Variables
Create `.env.local` for local testing and set the following in your hosting provider (e.g. Vercel):
```env
NEXT_PUBLIC_SITE_URL="https://clientdomain.com"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
UPSTASH_REDIS_REST_URL="" # Optional
UPSTASH_REDIS_REST_TOKEN="" # Optional
```

### Step 8: Deploy on Vercel
1. Import the Git repository into Vercel.
2. Select **Next.js** framework preset.
3. Add the environment variables configured in Step 7.
4. Click **Deploy**.
5. Once deployed, add the custom production domain under **Settings -> Domains** and configure the required DNS records (`A` and `CNAME`).

### Step 9: Post-Deployment Verification
- Submit a test lead through `/quote` and verify the lead row appears in the Supabase `leads` table.
- Test the language toggle between English and Hindi on desktop and mobile.
- Verify that WhatsApp prefilled links open properly.
- Run `npm run check-links` to ensure zero broken links.
