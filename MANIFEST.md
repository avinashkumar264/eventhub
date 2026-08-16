# EventHub — Day 4 → Day 5 delta

Scoped for your local repo at Day 4 (commit c67d941). Matches sandbox
commit ca193ad. No new npm packages required.

## Schema changes (minimal, as specified)

- `Provider.experienceYears` (Int?)
- New `ProviderMedia` model — portfolio/gallery architecture only, no
  upload provider wired up (same pattern as Day 4's `EventMedia`)
- `Lead.viewedAt` (DateTime?) — distinguishes new vs. viewed leads
  without inventing new `LeadStatus` values

Everything else reused unchanged: `Provider`, `Service`, `Lead`,
`LeadStatus`, `Subscription`, `SubscriptionPlan`, `EventRequest`.

## How to apply

1. Copy every file below into your project, overwriting where it exists.
   `app/vendor/page.tsx` and `app/freelancer/page.tsx` REPLACE the Day 3
   placeholders — expected.
2. Run against your local Postgres:
   ```
   npx prisma validate
   npx prisma migrate dev --name day5_vendor_freelancer_foundation
   npx prisma generate
   npm run lint
   npm run build
   npm run dev
   ```
3. Manual test:
   - Register/login a VENDOR with a service in some category (e.g.
     "Catering") → save profile → add that service.
   - As a CUSTOMER, create an event and add an EventRequest with a
     matching category → confirm a Lead appears under the vendor's
     `/vendor/leads`.
   - Open the lead → confirm no customer phone/email is shown anywhere,
     confirm `viewedAt` gets set, try updating status.
   - Confirm a FREELANCER cannot open `/vendor/*` and vice versa.
   - Try opening another provider's lead id directly → should 404.
4. Only once all of that genuinely passes:
   ```
   git add .
   git commit -m "Day 5: Vendor and freelancer foundation"
   git push origin main
   ```
   I can't run any of step 2 onward myself — needs your local DB, dev
   server, and GitHub credentials.

## New files

```
app/freelancer/leads/[id]/page.tsx
app/freelancer/leads/page.tsx
app/freelancer/profile/page.tsx
app/vendor/leads/[id]/page.tsx
app/vendor/leads/page.tsx
app/vendor/profile/page.tsx
components/provider/lead-detail.tsx
components/provider/lead-status-badge.tsx
components/provider/lead-status-form.tsx
components/provider/provider-dashboard.tsx
components/provider/provider-leads-list.tsx
components/provider/provider-profile-form.tsx
components/provider/service-form.tsx
components/provider/service-list.tsx
lib/actions/leads.ts
lib/actions/provider.ts
lib/validation/lead.ts
lib/validation/provider.ts
lib/validation/service.ts
prisma/migrations/20260817000000_provider_lead_foundation/migration.sql
```

## Modified files (overwrite these)

```
app/freelancer/page.tsx   <- Day 3 placeholder -> real dashboard
app/vendor/page.tsx       <- Day 3 placeholder -> real dashboard
lib/actions/event-requests.ts   <- adds lead-generation hook on request creation
prisma/schema.prisma
```

## Authorization notes

- Every provider mutation derives identity from the session
  (`requireRole(["VENDOR","FREELANCER"])` → `session.sub`); `Provider.type`
  is derived from the role, never accepted from the client.
- Leads are always queried scoped by `providerId` from the session's own
  provider row — a foreign lead id matches zero rows / 404s.
- Every lead query uses an explicit `select` that omits
  `customer.phone`/`customer.email` entirely — there's no field to leak.
