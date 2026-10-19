# Supabase Database & Inbound Lead Management

The platform stores all inbound customer leads (from the quote form, contact form, and popup modal) inside a private, secure [Supabase](https://supabase.com) PostgreSQL database.

---

## Schema Overview: `public.leads`

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `gen_random_uuid()` | Unique primary key for each lead record |
| `created_at` | `TIMESTAMPTZ` | `now()` | UTC timestamp when lead submitted form |
| `name` | `TEXT` | `NOT NULL` | Customer's full name |
| `phone` | `TEXT` | `NOT NULL` | Normalized Indian mobile number (`+91XXXXXXXXXX`) |
| `email` | `TEXT` | `NULL` | Optional email address |
| `city` | `TEXT` | `NULL` | Customer's city, district, or region |
| `category` | `TEXT` | `'General Solar Enquiry'` | Sizing/segment of interest (e.g. Residential, 50 kW EPC) |
| `source` | `TEXT` | `'quote'` | Inbound route (`quote`, `contact`, or `popup`) |
| `page_path` | `TEXT` | `'/'` | URL path where user submitted the form |
| `language` | `TEXT` | `'en'` | Active language at time of submission (`en` or `hi`) |
| `consent` | `BOOLEAN` | `true` | Explicit consent flag |
| `consent_at` | `TIMESTAMPTZ` | `now()` | Timestamp when consent was given |
| `monthly_bill` | `TEXT` | `NULL` | Average monthly electricity bill figure |
| `message` | `TEXT` | `NULL` | Optional roof notes or requirements |
| `user_agent` | `TEXT` | `NULL` | Sanitized browser user-agent header |
| `status` | `TEXT` | `'new'` | Lead status (`new`, `contacted`, `survey_scheduled`, `converted`, `archived`) |

---

## Security Architecture & Row Level Security (RLS)

1. **Service Role Key Only**: Inbound leads are inserted solely via the server-side Next.js route `/api/leads`. The route authenticates with Supabase using `SUPABASE_SERVICE_ROLE_KEY`.
2. **Zero Public Access**: Row Level Security (RLS) is enabled on the `leads` table with **no public policies**. This means:
   - Anonymous users cannot inspect, read, or dump leads from browser network tabs.
   - Even if the public Supabase URL is inspected, no data can be queried without the backend service key.
3. **No Admin Dashboard on the Website**: To keep the platform lightweight, zero-cost, and immune to authentication bypass vulnerabilities, leads are viewed and managed directly within the official Supabase Dashboard.

---

## How to Manage & Export Leads

### Viewing Inbound Leads
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **Table Editor** on the left navigation bar.
3. Select the `leads` table. All new customer enquiries will appear sorted chronologically.

### Updating Lead Status
You can directly edit the `status` column for each lead in the Supabase Table Editor:
- `new`: Uncontacted inbound lead
- `contacted`: Initial feasibility call conducted
- `survey_scheduled`: Physical or drone roof survey scheduled
- `converted`: Deal closed, installation in progress
- `archived`: Non-viable or out-of-jurisdiction enquiry

### Exporting to CSV / Excel
Click **Export -> Export to CSV** in the top right of the Supabase Table Editor to download customer data for integration with CRM systems like Zoho, Salesforce, or LeadSquared.
