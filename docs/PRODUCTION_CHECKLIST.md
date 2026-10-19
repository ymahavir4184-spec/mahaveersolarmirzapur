# Pre-Launch Production Checklist

Complete each of the verification steps below before handing over the live website to a client or driving commercial advertising traffic.

---

## 1. Credentials & Backend Verification
- [ ] **Supabase Setup**: Real Supabase project created; `supabase/schema.sql` executed; table `leads` exists with RLS enabled.
- [ ] **Environment Variables**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in Vercel. Ensure `NEXT_PUBLIC_` prefix was NOT used on the service role key.
- [ ] **End-to-End Form Test**: Submitted a test enquiry through `/quote`, `/contact`, and the lead popup. Verified the lead appears in the Supabase Table Editor.
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
