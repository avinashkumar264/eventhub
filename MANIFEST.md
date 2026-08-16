# EventHub — Day 3 → Day 4 delta

Scoped for your local repo at Day 3 (commit 778ae79). Brings it to Day 4:
customer dashboard, create/list/detail/edit event, and service-request
(EventRequest) creation on the event detail page. Matches sandbox commit
8be33ff.

## Schema change

`Event` gained: `startTime`, `endTime` (String?, "HH:mm"), `venueType`,
`description`, `requirements` (String?), `status` (new `EventStatus` enum,
default `DRAFT`). New `EventMedia` model (architecture only, no upload
provider wired up). `EventRequest` needed NO changes — it already
supported everything Day 4 needed (category, description, status,
eventId, customerId).

## How to apply

1. No new npm packages for Day 4 (nothing beyond Day 3's bcryptjs/jose/zod).
2. Copy every file below into your project, overwriting where it exists.
   `app/customer/page.tsx` REPLACES the Day 3 placeholder — that's expected.
3. Run against your local Postgres:
   ```
   npx prisma validate
   npx prisma migrate dev --name day4_customer_event_foundation
   npx prisma generate
   npm run lint
   npm run build
   npm run dev
   ```
4. Manual test: login as CUSTOMER → /customer → create event → open it →
   add a Photography request, add a Catering request → refresh, confirm
   both persist → try a second CUSTOMER account against the first
   customer's event id directly (should 404) → try posting to the same
   event's request form as the second customer (should fail — ownership
   is re-checked inside the server action itself, not just in the UI).
5. Only once all of that genuinely passes:
   ```
   git add <files below>
   git commit -m "Day 4: Customer event foundation"
   git push origin main
   ```

## New files

```
app/customer/events/[id]/edit/page.tsx
app/customer/events/[id]/page.tsx
app/customer/events/new/page.tsx
app/customer/events/page.tsx
components/customer/event-form.tsx
components/customer/event-request-form.tsx
components/customer/status-badge.tsx
lib/actions/event-requests.ts
lib/actions/events.ts
lib/validation/event-request.ts
lib/validation/event.ts
prisma/migrations/20260816000000_event_lifecycle_foundation/migration.sql
```

## Modified files (overwrite these)

```
app/customer/page.tsx     <- was the Day 3 role placeholder, now the real dashboard
prisma/schema.prisma      <- Event lifecycle fields + EventMedia model (see above)
```

## Authorization notes (matches the doc's requirements)

- Every event/event-request mutation derives the customer id from the
  session (`requireRole(["CUSTOMER"])` → `session.sub`), never from the
  request body or URL.
- Event updates use `updateMany({ where: { id, customerId } })` — a
  tampered id for another customer's event matches zero rows.
- Event-request creation first re-verifies event ownership via
  `findFirst({ where: { id, customerId } })` before inserting anything.
- Event detail/edit pages use `findFirst({ where: { id, customerId } })`
  → `notFound()` on a miss, so a foreign id 404s instead of leaking
  existence or throwing a 403 that would confirm the id is valid.
