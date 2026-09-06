# Aftermarket — Canonical Data Model

_Last updated: 2026-09-06._ Single source of truth for DB schema + JSON shapes, reconciling
`README.md` §5 (target Postgres/Supabase schema) with the actual mock-data shapes already coded in
`app/src/data/*.ts`. Use this to build Supabase tables (Phase 3) and any new screen — the JSON shape
a screen consumes should always be a view/projection over the tables below, never a divergent
one-off shape.

Status key: **DB** = target Postgres table (README §5, unchanged unless noted). **MOCK** = current
Expo app mock file. **GAP** = mock field with no DB column yet — needs adding when real data lands.

---

## 1. Identity & social

### `users` (DB) ↔ `profile.ts` (MOCK)

| DB column | Type | Mock field | Notes |
|---|---|---|---|
| `id` | uuid pk | — | mock has no id, single hardcoded profile |
| `username` | text | `username` | e.g. `kai.m` |
| `email` | text | — | not in mock (no auth yet) |
| `phone` | text | — | not in mock |
| `country_flag` | text (emoji) | `countryFlag` | `🇿🇦` |
| `bio` | text | — | GAP — profile edit screen will need this |
| `avatar_url` | text | `avatar` (local `require`) | swap to Supabase Storage URL |
| `banner_url` | text | `banner` (local `require`) | swap to Supabase Storage URL |
| `created_at` | timestamptz | `memberSince` (display string `"Mar 2024"`) | store real timestamp, format client-side |
| `reputation_score` | numeric | — | GAP — nightly batch job per README §7 |
| `tickets_sold_count` | int | `ticketsSold` | |
| `events_attended_count` | int | `eventsAttended` | |
| GAP | int | `following` / `followers` | derive via `COUNT(*) FROM follows`, don't denormalize onto `users` unless perf requires it |

```json
{
  "id": "usr_01h...",
  "username": "kai.m",
  "email": "kai@example.com",
  "phone": null,
  "country_flag": "🇿🇦",
  "bio": null,
  "avatar_url": "https://.../avatars/kai.png",
  "banner_url": "https://.../banners/kai.png",
  "created_at": "2024-03-01T00:00:00Z",
  "reputation_score": 4.8,
  "tickets_sold_count": 11,
  "events_attended_count": 18
}
```

### `follows` (DB)
`(follower_id uuid, followee_id uuid, followee_type enum('user','organiser','venue'))`

Mock equivalent is `followedEntities` in `profile.ts` — currently organiser/venue only, each with a
`color` for the chip UI:

```ts
interface FollowedEntity { id: string; label: string; color: string; }
```

`color` is a GAP — either store on `organisers`/`venues` as a `brand_color` column, or keep it
purely client-side (derived by hashing the id) so the DB doesn't carry UI styling. Recommend the
latter unless organisers want to set their own brand color.

### `friendships` (DB) — unchanged from README
`(user_id, friend_id, status enum('pending','accepted'))`. No mock yet — "add friends" button on
Profile is UI-only today.

---

## 2. Events

### `organisers` (DB) — unchanged: `(id, name, logo_url, verified boolean)`
No mock file yet (events currently hardcode `venue`/`city` strings, no organiser join). When wiring
real data, every `EventItem.venue` needs backfilling to `venue_id → venues.name` and an
`organiser_id`.

### `venues` (DB) — unchanged: `(id, name, address, lat, lng)`

### `events` (DB) ↔ `events.ts` (MOCK)

| DB column | Type | Mock field |
|---|---|---|
| `id` | uuid pk | `id` (`e1`, `e2`, ...) |
| `organiser_id` | uuid fk | GAP |
| `venue_id` | uuid fk | `venue` (flat string today) |
| `title` | text | `title` |
| `category` | enum(`nightlife`,`festival`,`live_music`,`daylife`) | `category` |
| GAP (derive, don't store) | text | `categoryLabel` (`"Electronic · Nightlife"`) | build client-side from `category` + a genre tag |
| GAP | enum(`day`,`night`) | `timeOfDay` | could derive from `start_at` hour, but mock treats it as independent (a day event can run into evening) — keep as its own column |
| `start_at` | timestamptz | `day`/`date`/`month` (display strings) | store real timestamp; format `day`/`date`/`month` client-side, same as `created_at` above |
| `end_at` | timestamptz | — | not in mock |
| `hero_image_url` | text | `image` (local `require`) | swap to Storage URL |
| `source_platform` | enum(`howler`,`quicket`,`webtickets`,`computicket`,`ticketmaster`,`manual`) | — | GAP, needed once `ticket_types`/`listings` wire to real providers |
| GAP | numeric | `priceFrom` | derive as `MIN(ticket_types.face_value)` per event, don't store redundantly |
| GAP | boolean (per-user, not per-event) | `favorited` | this is really a row in a `user_favorite_events` join table (or reuse `follows` with `followee_type='event'` if favoriting an event, not just an organiser/venue, becomes a requirement) |

```json
{
  "id": "e1",
  "organiser_id": "org_01h...",
  "venue_id": "ven_01h...",
  "title": "Black Coffee",
  "category": "nightlife",
  "time_of_day": "night",
  "start_at": "2026-10-18T18:00:00+02:00",
  "end_at": null,
  "hero_image_url": "https://.../events/black-coffee-ostrich.png",
  "source_platform": "howler"
}
```

### `ticket_types` (DB) — unchanged: `(id, event_id, name, face_value, currency)`
Mock doesn't model this separately yet — `EventItem.priceFrom` and `TicketItem.ticketTypeLabel` /
`variant` both partially stand in for it. When wiring real data, `TicketItem.variant` becomes a
derived UI treatment (see §3), not a DB column on `ticket_types` itself.

---

## 3. Tickets & marketplace

This is the biggest reconciliation gap: `tickets.ts` models a **user-facing ticket** (what's shown
on the Tickets tab), which in the target schema is actually a join across `orders` (as buyer) or
`listings` (as seller), per README's own screen→data mapping. Nothing here changes that mapping —
this section defines the exact projection so the frontend type and the DB view agree field-for-field.

### `listings` (DB) — unchanged: see README §5 for full column list, esp. the generated `trust_badge`.

### `orders` (DB) — unchanged: `(id, listing_id, buyer_id, amount, escrow_state, hold_expires_at, created_at)`

### Ticket view — `TicketItem` (MOCK) → derived read model

```ts
type TicketVariant = 'general' | 'vip' | 'verified' | 'escrow';
type TicketWhen = 'upcoming' | 'past';

interface TicketItem {
  id: string;            // orders.id (buyer) — listings.id (seller, no order yet)
  code: string;           // GAP: human-readable ticket code, e.g. "AM-02819" — needs a real column,
                          //       either generated on ticket_types or on the order/listing itself
  eventTitle: string;     // events.title (join)
  ticketTypeLabel: string;// ticket_types.name, uppercased for display
  variant: TicketVariant; // NOT a DB enum — derived at read time:
                          //   'vip'      if ticket_types.name ~ VIP
                          //   'escrow'   if orders.escrow_state = 'funds_held'
                          //   'verified' if listings.trust_badge = 'provider_verified'
                          //   'general'  otherwise (default fallback)
  venue: string;          // venues.name (join)
  city: string;           // venues.address (parsed) or a dedicated venues.city column — GAP, add
                          // a `city` column to `venues` rather than parsing `address` at read time
  day/date/month/time     // formatted from events.start_at, client-side or in the view
  image: string;          // events.hero_image_url
  when: TicketWhen;       // events.start_at < now() ? 'past' : 'upcoming'  (per README §5 mapping)
}
```

**Recommendation:** implement this as a Postgres view (`v_user_tickets`) joining
`orders ⋈ listings ⋈ ticket_types ⋈ events ⋈ venues`, filtered by `buyer_id = auth.uid()`, so the
mobile client's `TicketItem` shape is a straight `SELECT *` and the variant/day/date/city
derivations live in one place (the view), not duplicated in app code.

**`code` is the one real GAP** — add a `ticket_code` text column (e.g. generated
`'AM-' || lpad(nextval('ticket_code_seq')::text, 5, '0')`) on `orders`, since that's what's actually
printed/scanned.

### `transfer_jobs` (DB) — unchanged, see README §5/§6/§7.

---

## 4. Trust & gamification

### `reviews` (DB) — unchanged: `(id, order_id, reviewer_id, reviewee_id, direction, rating, comment)`

### `badges` (DB) ↔ `stamps.ts`/`profile.ts` `ALL_BADGES` (MOCK)

`badges (id, code, name, icon_url)` already matches the mock catalogue shape directly:

```ts
interface Badge { id: string; label: string; icon: number /* → icon_url */ }
```

Mock catalogue (`ALL_BADGES`) is the full seed list for the `badges` table:

```json
[
  { "code": "first-event", "name": "First Event Attended" },
  { "code": "first-ticket", "name": "First Ticket Sold" },
  { "code": "venue-hopper", "name": "Venue Hopper" },
  { "code": "double-booker", "name": "Double Booker" },
  { "code": "verified-seller", "name": "Verified Seller" },
  { "code": "trusted-buyer", "name": "Trusted Buyer" },
  { "code": "festival-regular", "name": "Festival Regular" },
  { "code": "night-owl", "name": "Night Owl" },
  { "code": "early-bird", "name": "Early Bird" },
  { "code": "community-builder", "name": "Community Builder" }
]
```

### `user_badges` (DB) — unchanged: `(user_id, badge_id, earned_at)`
Mock's `profile.earnedBadgeIds: string[]` (ordered, most-recent-first) is the per-user projection:
`SELECT badge_id FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC`.

---

## 5. Decorative overlays — NOT part of the backend schema

`stamps.ts`, `stickers.ts`, `stampPlacement.ts`, `stickerPlacement.ts`, `randomOverlay.ts`,
`heroQuips.ts` are **purely presentational, client-only, re-randomized per app load** — there is no
DB-backed state here and none should be added. Documented so nobody mistakes them for a data gap:

- `RANDOM_STAMPS` / `stickers`: static asset pools (`UI/ASSETS/STAMPS`, `app/assets/stickers`).
- `assignStamps(ticketIds)` / `assignStickers(ticketIds)`: pure functions, seeded `mulberry32` RNG,
  re-seeded from `Math.random()` on each call — output is `Record<ticketId, PlacedOverlay[]>`,
  recomputed client-side every render pass, never persisted.
- `PlacedOverlay`: `{ source, rotation, size, topPct, leftPct }` — pure layout math, no server
  round-trip.
- `heroQuips.ts`: static copy pool for the Home hero, no DB table.

If a future requirement needs a *stable* (not re-randomized) sticker/stamp per ticket (e.g. "keep
the sticker I got"), that would need a new join table (`ticket_overlays(order_id, overlay_type,
overlay_code, placement_json)`) — out of scope until that requirement exists.

---

## 6. Full entity list (quick reference)

| Table | Screen(s) that read it |
|---|---|
| `users` | Profile, Home (seller ranking), Search |
| `follows` | Profile (following/followers, followed organisers/venues row) |
| `friendships` | Profile (add-friends) — UI only today |
| `organisers` | Home, Search, event detail |
| `venues` | Home, Search, Tickets, event detail |
| `events` | Home, Search, Tickets (via order/listing join) |
| `ticket_types` | event detail, listing creation |
| `listings` | Home (ticket options), Tickets (as seller) |
| `orders` | Tickets (as buyer), escrow flow |
| `transfer_jobs` | backend only — surfaces to `manual_review` admin tooling |
| `reviews` | Profile (future: reviews list), listing detail |
| `badges` / `user_badges` | Profile (badge grid) |

Screen → data mapping otherwise unchanged from README §5.

---

## 7. What to build next against this doc

1. Add the GAP columns called out above (`venues.city`, `orders.ticket_code`, `events.time_of_day`,
   `organisers`/`venues` real rows) to the Supabase migration when Phase 3 starts.
2. Build `v_user_tickets` view per §3 so the mobile `TicketItem` type stays a direct query result.
3. Keep `stamps`/`stickers`/`heroQuips` exactly as-is — no backend work needed there (§5).
4. When wiring `events.ts` to real data, backfill `organiser_id`/`venue_id` — every mock event
   currently only has flat `venue`/`city` strings.
