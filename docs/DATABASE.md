# Supabase Database

The website uses a private [Supabase](https://supabase.com) PostgreSQL database for customer leads, staff quotations, and billing records. Apply the SQL setup before deploying the corresponding APIs.

## Initial Setup

For initial setup or to update an older SQL Editor setup, run the current `supabase/setup.sql` in the Supabase Dashboard SQL Editor. It includes leads, quotations, bills, estimates, optional invoice fields, atomic create functions, database-backed staff sessions, and the compact estimate-deletion audit log. It removes the earlier full-row recovery archive and old rate-limit counter storage. If the project already has the earlier setup, apply the required migrations in timestamp order through `supabase/migrations/20261021000800_remove_rate_limits.sql` once. Do not run individual migrations as well if using the full SQL Editor setup workflow.

For a project managed by Supabase CLI, apply every migration in timestamp order through `20261021000800_remove_rate_limits.sql`; do not run `setup.sql` as well. Keep SQL Editor and CLI migration workflows separate.

Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env.local` for local development and in the hosting provider for deployment. The secret key is server-only: never give it a `NEXT_PUBLIC_` prefix or commit it to Git. Existing projects can use `SUPABASE_SERVICE_ROLE_KEY` as a legacy fallback. The staff portal requires private `QUOTATION_LOGIN_ID` and `QUOTATION_LOGIN_PASSWORD` values of 1–10 characters. Estimate deletion requires a private `ESTIMATE_DELETE_MASTER_PASSWORD` of 1–10 characters, separate from the staff password. Deletion also requires an active staff session and the estimate number as confirmation; the password is checked server-side without being stored in Supabase. There is no application-level attempt cooldown or request rate limit.

## Tables and Functions

| Database object | Purpose |
| :--- | :--- |
| `public.leads` | Inquiries from quote, contact, and popup forms |
| `public.quotations` | Staff-created customer quotations and purchase status |
| `public.bills` | Invoice headers and seller snapshot |
| `public.bill_items` | Invoice product, quantity, and tax lines |
| `public.bill_number_seq` | Generates sequential invoice numbers |
| `create_bill_v1` | Creates a bill and all lines in one transaction, with idempotent retries |
| `list_bills_v1` | Lists filtered bills with their line items |
| `bill_report_v1` | Returns filtered billing totals and daily summaries |
| `public.estimates` | A4 estimate, customer details, item lines, and seller snapshot |
| `public.estimate_number_seq` | Generates sequential estimate numbers by fiscal year |
| `create_bill_v2`, `create_estimate_v2` | Save the document header, optional details, and all item rows atomically; retries with the same request ID do not overwrite the first saved record |
| `create_estimate_v1` | Saves an estimate and its calculated GST totals in one transaction |
| `public.staff_sessions` | Stores hashes of random HttpOnly staff session tokens, last activity, expiry, and revocation state; raw tokens are never stored |
| `touch_staff_session_v1` | Validates and refreshes the session activity timestamp, rejecting revoked or idle sessions |
| `public.estimate_deletion_log` | Compact audit rows with receipt number/date, customer name, total, staff login ID, and deletion timestamp; no bill items or recovery snapshot |
| `delete_estimate_with_audit_v1` | Locks and verifies the estimate number, writes the audit row, and removes the estimate atomically |

### Lead columns

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key |
| `created_at` | `TIMESTAMPTZ` | UTC submission time |
| `name`, `phone` | `TEXT` | Customer identity; phone is normalized to `+91XXXXXXXXXX` |
| `email`, `city` | `TEXT` | Optional contact details |
| `category` | `TEXT` | Segment or system size of interest |
| `source` | `TEXT` | `quote`, `contact`, or `popup` |
| `page_path`, `language` | `TEXT` | Form route and active language (`en` or `hi`) |
| `consent`, `consent_at` | `BOOLEAN`, `TIMESTAMPTZ` | Consent and its timestamp |
| `monthly_bill`, `message`, `user_agent` | `TEXT` | Optional enquiry details and browser metadata |
| `status` | `TEXT` | `new`, `contacted`, `survey_scheduled`, `converted`, or `archived` |

## Access and Row Level Security

Row Level Security is enabled on all private tables, with no policies for `anon` or `authenticated`. Table grants also revoke access from those browser roles. The Next.js server uses the secret key for data operations; it bypasses RLS and must stay private. Billing and estimate functions are revoked from `public`, `anon`, and `authenticated` and executable only by `service_role`.

Staff API routes validate the random staff session against Supabase before accessing quotations or billing. The browser cookie is HttpOnly and session-only; a refresh, tab close, logout, or 30 minutes without activity requires signing in again. Active input and staff API use refresh the shared idle timer; each device applies the same 30-minute policy. Leads are submitted through `/api/leads`, with no application-level rate limit or duplicate cooldown. Staff bill/estimate CSV exports include all matching records and line items up to the safe export cap, and are protected by the same session. Estimate deletion requires the master password plus retyping the estimate number; there is no failed-attempt cooldown. The password is compared server-side and never stored. The estimate is removed from active records; only a compact audit row remains. The audit log can be reviewed in the staff Estimate Records screen or Supabase Table Editor. Full recovery snapshots are not kept.

## Managing Lead Records

In Supabase Dashboard, open **Table Editor -> leads**. Update the `status` field as work progresses:

- `new`: Uncontacted enquiry
- `contacted`: Initial feasibility call completed
- `survey_scheduled`: Roof survey scheduled
- `converted`: Deal closed
- `archived`: Non-viable or out-of-jurisdiction enquiry

Use **Export -> Export to CSV** in the Table Editor for data exports. The billing interface also provides filtered bill reports.
