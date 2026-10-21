# Pre-Launch Production Checklist

Complete each of the verification steps below before handing over the live website to a client or driving commercial advertising traffic.

---

## 1. Credentials & Backend Verification
- [ ] **Supabase Setup**: Current `supabase/setup.sql` applied (or all ordered migrations through `20261021000800_remove_rate_limits.sql`); `leads`, `quotations`, `bills`, `bill_items`, `estimates`, `estimate_deletion_log`, and `staff_sessions` exist with RLS enabled; create/report/session/delete-audit RPC functions exist.
- [ ] **Environment Variables**: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`), `QUOTATION_LOGIN_ID`, `QUOTATION_LOGIN_PASSWORD`, and `ESTIMATE_DELETE_MASTER_PASSWORD` set in Vercel. Ensure private keys do not use a `NEXT_PUBLIC_` prefix.
- [ ] **End-to-End Form Test**: Submitted a test enquiry through `/quote`, `/contact`, and the lead popup. Verified the lead appears in the Supabase Table Editor.
- [ ] **Concurrent Staff Use**: Created a test bill/estimate on one device while another device had its records page open; confirmed each document number is unique, data appears after refresh, and no customer/item rows are missing.
- [ ] **Staff Session Security**: Confirmed refresh/tab close asks for staff login again, inactivity signs out after 30 minutes, active work renews the idle window, and logout in one tab closes sibling tabs.
- [ ] **Report Export**: Downloaded bill and estimate CSV exports in Excel and checked document fields, seller snapshot, GST splits, totals, and all item rows.
- [ ] **Estimate Delete Audit**: Confirmed wrong master passwords are rejected, estimate-number confirmation is required, a successful deletion removes the active row, and only receipt/customer/amount/staff-ID/time metadata appears in `estimate_deletion_log`.
- [ ] **WhatsApp Click-to-Chat**: Clicked the WhatsApp floating button and post-submission button on both mobile and desktop. Confirmed the correct phone number and prefilled message open in WhatsApp.
- [ ] **Clickable Telephone**: Confirmed `tel:+91...` initiates a phone call on mobile devices without formatting errors.

---

## 2. Client Business & Legal Content
- [ ] **Legal Review of Privacy & Terms**: The client's legal counsel has reviewed `/privacy` and `/terms` to ensure compliance with Indian data privacy regulations and corporate warranties.
- [ ] **Company Physical Address**: Confirmed the physical office address and embedded Google Maps link correspond to the client's actual registered office.
- [ ] **Operating Hours**: Working hours match the client's customer desk schedule.
- [ ] **Calculator Constants**: Confirmed state electricity tariff (e.g. ₹8.5/unit) and cost per kW (e.g. ₹55,000/kW) reflect the client's current price book.
- [ ] **No Invented Claims**: Confirmed `siteConfig.features.showPlaceholders` is set to `false` if the client has not provided real reviews or verified installation counts.

---

## 3. Bilingual Language Review
- [ ] **Hindi Copy Verification**: A native speaker has reviewed the Hindi dictionary in `src/lib/translations.js` for regional naturalness.
- [ ] **Technical Terms**: Confirmed technical abbreviations (`kW`, `kWh`, `MPPT`, `Mono PERC`, `TOPCon`) remain untranslated.
- [ ] **Language Selection Overlay**: Tested that selecting English or Hindi persists in the cookie and loads correctly on hard page refreshes.

---

## 4. Visual Media & Performance
- [ ] **Real Client Photography**: Replaced placeholder visuals in `public/client-assets/` with authentic photos of the client's real projects and warehouse.
- [ ] **WebP Compression**: Images compressed to under 250 KB each (hero under 400 KB).
- [ ] **Favicon & Logo**: Client's crisp vector logo displays properly on both white and navy backgrounds.
- [ ] **Mobile Responsiveness**: Checked layout on 375px mobile viewport (iPhone SE) and large desktop monitors.
- [ ] **Automated Link Check**: Ran `npm run check-links` to ensure zero internal dead links (404s).
