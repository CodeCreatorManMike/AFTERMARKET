# AFTERMARKET

<img src="BRAND/Logo_mockup/logo(main).png" alt="Aftermarket logo" width="360" />

Cape Town · peer-to-peer event ticket resale, held safe in escrow

---

## 1. Brand identity

<p>
  <img src="BRAND/MAIN_STAMP.png" alt="Aftermarket coral stamp" width="220" />
  <img src="BRAND/SECONDARY_STEMP.png" alt="Aftermarket lime stamp" width="220" />
</p>

**Colours**

| Swatch | Hex | Name | Role |
|---|---|---|---|
| Coral | `#FF5470` | Resale Coral | Primary — CTAs, energy, urgency |
| Ink | `#14102B` | Shop Floor Ink | Base — backgrounds, depth |
| Lime | `#C6FF3D` | Verified Lime | Signal — trust, confirmation, checks |
| Cream | `#F5F0E6` | Stock Cream | Paper — text, ticket stock, light surfaces |

**Typography**
- **Display — Archivo, weight 900.** Wide, confident, industrial. Wordmark and headlines only.
- **Catalog — IBM Plex Mono.** Fixed-width, parts-catalog feel. Labels, prices, ticket IDs, fine print (e.g. `AM-0142 · GENERAL ADMISSION · VERIFIED · R450.00`).

**Logo lockups** — three variants built: full wordmark (`AFTERMARKET.`), icon + wordmark (`AM` badge + name), and stacked icon + subline (`AM` + "CAPE TOWN RESALE").

**Ticket stub asset collection** — four SVG stub designs, each a distinct colour/type combo, perforated centre line, catalog ID and price:
1. General Admission — coral base, ink text
2. VIP Access — ink base, lime accent text
3. Verified Resale — cream base, lime "VERIFIED" tag
4. In Escrow — lime base, "SOLD SECURE" + escrow-held label

**Texture/pattern set** — hazard stripe (coral diagonal), verified dot (lime polka), perforation (circle-punch), catalog grid — for backgrounds and secondary surfaces.

**Voice** — direct, plain verbs, no hype-speak, confident like a receipt rather than a sales pitch. Sample lines: *"Your money doesn't move until the ticket does."* / *"Sold out isn't closed. It's just changed hands."*

**Deliverables produced:** a live HTML mockup of the brand mood board, exported as a matching full-resolution PNG and single-page PDF (pixel-identical, rendered via headless Chromium rather than a lossy HTML→PDF converter).

---

## 2. General description (Cape Town)

An app made for young adults to buy/sell tickets for events — a third-party resale platform.

- The USP is trust: when a seller lists a ticket and a buyer wants it, the ticket transfers to the app's own (third-party) account, then funds transfer.
- Buyers pay for tickets and the money is held by the app until the ticket is confirmed.
- Sellers then get paid, and buyers receive their tickets via the platform they originally bought them on.
- If a seller isn't able to sell a ticket, it's returned to them just before the event. If a buyer's ticket isn't confirmed within a set time period, the money is sent back to them.
- The app needs to replicate — and actually hold — accounts with the major event platforms and ticket providers in Cape Town, so tickets can be transferred to and from the app's own accounts with those providers.
- Users can explore ongoing events, search for events, and see full details and ticket options.
- Users can manage tickets they've bought, or sell/register a ticket for sale.
- Users have a customisable account, with reviews from both directions (buyers review sellers, sellers review buyers).
- Users can follow/favourite event providers, to get notified about upcoming events.
- Users can add friends and follow sellers/other accounts.

**Reality-check on the provider-account plan** (researched, see Section 3): none of the major Cape Town providers expose a public API for this. Every provider except Computicket does have *some* transfer mechanism an Aftermarket-controlled account can use — but it's either riding a provider's own built-in resale feature (Howler) or browser-automating an account you control against the provider's own website (Quicket, Webtickets, Ticketmaster SA). Computicket has no confirmed self-service transfer at all, so it falls back to manual upload. This doesn't kill the plan — it changes *how* it's built. Full detail below.

---

## 3. Provider landscape — confirmed capability per platform

| Provider | Self-service transfer? | Native resale marketplace? | Payment inside transfer? | Aftermarket integration path |
|---|---|---|---|---|
| **Howler** | Yes — email-based, old ticket invalidated, new one issued | **Yes** — official "Resell your Ticket" pool, per-event, seller gets paid automatically when it sells | Yes, for resale-enabled events | **Best case.** Where Howler resale is enabled for an event, list straight into Howler's own pool — no admin-account relay needed, Howler already is the escrow. Where it isn't enabled, fall back to the same RPA relay as Quicket |
| **Quicket** (Ticketmaster-owned) | Yes — `My Tickets → Manage Booking → Transfer`, to any email; organiser can disable it | No | No — free gift transfer only | Admin-account relay (browser automation) |
| **Webtickets** | Yes — "Secure Ticket Transfer," explicitly built for resale | **Yes** — buyer pays Webtickets directly as part of accepting the transfer | Yes | Admin-account relay, but creates a two-payment ledger problem (Section 6) |
| **Ticketmaster SA** | Yes, same infra as Quicket | No — help docs explicitly say *"not used for exchanging tickets"* | No | Admin-account relay, higher ToS-risk since resale use is explicitly discouraged |
| **Computicket** | Unconfirmed — nothing in public docs describes buyer-to-buyer transfer | No | Unknown | Treat as unsupported until proven otherwise. Manual upload only |

**Legal note carried over from earlier research:** South African law doesn't ban ticket resale itself, but primary sellers' T&Cs often restrict it — Ticketmaster SA's terms say tickets can be gifted, not resold, and accounts can be blocked for breaching that. This is a real business-risk line, not just a technical one.

---

## 4. Feature breakdown

### Home page (discover events)
- Location / date filter — optional, works with none set
- Category pills: All events · Nightlife · Festivals · Live music · Daylife
- Scrollable event cards (icon, title, date/location) → tap through for full details, and follow the organiser and/or venue from there
- Ticket options per type (e.g. General/VIP), each shown as one of:
  - **On sale (provider)** — buy directly from the issuing platform's page
  - **Available (Aftermarket)** — connects buyer with a seller's listing
  - **Notify me** — sold out everywhere, waitlist
- More/similar events below the fold
- Sellers ranked by reputation and past sales — strong rating + sales history surfaces first

### Search page
- Single search bar: events, organisers, or venues
- Search current/upcoming events

### Tickets page
- Upcoming / Past tabs at the top
- Each ticket shown as a stylised stub over the event's hero image — different asset treatments per event type and ticket type (distinct look for VIP vs. general, daytime vs. nightlife)

### Profile page
- Username + "member since" date
- Top right: pencil (edit profile/info) and gear (settings/troubleshooting) icons
- Profile picture with banner image behind it
- Country flag, then Following/Followers (tappable lists)
- Events attended & tickets sold counts
- Add-friends button, and directly beside it: profile QR code (Aftermarket logo underneath), plus share-link/copy-link
- Row of icons for followed organisers/venues
- Badges: first event attended, first ticket sold, venue hopper, double booker, etc.

---

## 5. DATA

```sql
-- Identity & social
users            (id, username, email, phone, country_flag, bio, avatar_url,
                  banner_url, created_at, reputation_score, tickets_sold_count,
                  events_attended_count)
follows          (follower_id, followee_id, followee_type ENUM('user','organiser','venue'))
friendships      (user_id, friend_id, status ENUM('pending','accepted'))

-- Events
organisers       (id, name, logo_url, verified BOOLEAN)
venues           (id, name, address, lat, lng)
events           (id, organiser_id, venue_id, title, category ENUM('nightlife',
                  'festival','live_music','daylife'), start_at, end_at,
                  hero_image_url, source_platform ENUM('howler','quicket',
                  'webtickets','computicket','ticketmaster','manual'))
ticket_types     (id, event_id, name, face_value, currency)

-- Marketplace
listings         (id, seller_id, ticket_type_id, asking_price,
                  provider ENUM('howler','quicket','webtickets','computicket',
                  'ticketmaster','other'),
                  verification_method ENUM('provider_transfer','uploaded_proof'),
                  trust_badge ENUM('provider_verified','unverifiable')
                    GENERATED ALWAYS AS (
                      CASE WHEN verification_method = 'provider_transfer'
                      THEN 'provider_verified' ELSE 'unverifiable' END) STORED,
                  status ENUM('draft','pending_verification','listed','reserved',
                  'sold','expired','returned'),
                  original_asset_url, verified_at)

orders           (id, listing_id, buyer_id, amount,
                  escrow_state ENUM('funds_held','ticket_verified',
                  'payout_released','refunded'),
                  hold_expires_at, created_at)

-- Provider integration
transfer_jobs    (id, listing_id, provider, status ENUM('queued','running',
                  'awaiting_relay','succeeded','failed','manual_review'),
                  admin_inbox, attempts, last_error, screenshot_url,
                  created_at, updated_at)

-- Trust & gamification
reviews          (id, order_id, reviewer_id, reviewee_id,
                  direction ENUM('buyer_to_seller','seller_to_buyer'),
                  rating, comment)
badges           (id, code, name, icon_url)
user_badges      (user_id, badge_id, earned_at)
```

`trust_badge` is what renders directly on the ticket-option card — "Provider-Verified" (green) vs. "Unverifiable — seller-uploaded" (orange) — the exact distinction the brief asked for between tickets that came through a real provider transfer vs. ones that only have an uploaded PDF/QR/screenshot as proof.

**Screen → data mapping**
- **Home/Discover** — `events` filtered by category/date/location, joined to `listings` for price range, ordered by organiser `verified` then seller `reputation_score`.
- **Search** — full-text search across `events.title`, `organisers.name`, `venues.name` (Postgres `tsvector` is enough at this scale).
- **Tickets tab** — `orders` (as buyer) + `listings` (as seller), split on `start_at < now()`.
- **Profile** — aggregate counts off `follows`, `friendships`, `user_badges`, `reviews`.

---

## 6. ARCHITECTURE

```
Mobile/web client
        │
   API layer — Python (FastAPI): auth, listings, search, escrow state machine
        │
   Postgres (RDS) — schema above
   S3 — ticket asset uploads, profile/banner images, RPA failure screenshots
   Redis — search cache, rate limiting on listing creation
        │
   SQS — transfer job queue
        │
   ECS Fargate worker pool — Playwright-driven provider adapters
        │
   Peach Payments — Checkout API (buyer pay-in) + Payouts API (seller pay-out)
```

**Provider adapter interface** — one small, testable class per provider:

```python
class TicketProviderAdapter(Protocol):
    def initiate_transfer(self, ticket_ref: str, admin_inbox: str) -> TransferJob: ...
    def poll_status(self, job: TransferJob) -> TransferStatus: ...
    def relay_to_buyer(self, job: TransferJob, buyer_email: str) -> None: ...
```

- **HowlerResaleAdapter** — where Howler's native resale pool is enabled, lists straight into it and polls for a completed sale. No RPA, no admin-account relay — Howler already is the escrow.
- **HowlerTransferAdapter** — for events without resale enabled, falls back to the same RPA relay as Quicket.
- **QuicketAdapter** — Playwright RPA against an Aftermarket-controlled admin account: persistent authenticated session, drives the transfer form, watches a dedicated inbox for the "ticket received" confirmation, then repeats the flow to relay to the real buyer once payment clears.
- **WebticketsAdapter** — same RPA pattern, but the admin account must actually *pay* Webtickets' checkout to accept the incoming transfer (funded via a card on the Peach Payments side). Webtickets tickets therefore carry a real cost leg on Aftermarket's books, separate from what the buyer is charged — track it explicitly, don't net it off silently.
- **TicketmasterSAAdapter** — same shape as Quicket, flagged as higher ToS-risk since their docs explicitly discourage resale use of the transfer feature.
- **ComputicketAdapter / ManualUploadAdapter** — stub that always routes to manual upload: seller submits PDF/QR/screenshot, backend decodes and sanity-checks event/date/type, but can't confirm the ticket hasn't already been used elsewhere. Sets `verification_method = 'uploaded_proof'`.

**Why Fargate, not Lambda:** Playwright sessions are too heavy/long-running for Lambda's execution model. Fargate tasks, one isolated browser context per job, keep sessions from bleeding into each other.

**Escrow flow via Peach Payments (Cape Town-based, has both a Checkout API and a Payouts API):**
1. Buyer pays into Aftermarket's Checkout — funds land with Aftermarket, not the seller.
2. `orders.escrow_state = funds_held`.
3. Transfer job runs; on success, `escrow_state = ticket_verified`.
4. Payouts API releases funds to the seller's bank account → `payout_released`.
5. On failure/timeout → refund via Checkout, `escrow_state = refunded`.

**Legal flag, not just an engineering note:** holding customer funds pending a future event edges into territory the National Payment System Act and FSCA care about. Routing everything through a licensed orchestrator (Peach) rather than warehousing funds directly is the right shape architecturally, but this needs an actual fintech-savvy lawyer's sign-off before real money moves.

---

## 7. AUTOMATION

- **Escrow timers** — `hold_expires_at` on `orders` (buyer refund window) and an equivalent on `listings` (seller ticket-return window). A scheduled job every 5–10 minutes queries expired rows and triggers the right Peach Payments call (refund or payout-cancel) plus a status flip. Start here; graduate to per-row AWS EventBridge Scheduler only once volume justifies it.
- **Ticket verification pipeline** — `pyzbar`/`opencv-python` decode QR/barcodes from uploaded assets, cross-checked against the listing's claimed event and ticket type. Where a provider has a public "verify a ticket" page, cross-check there too.
- **Transfer job monitoring** — failed RPA jobs capture a screenshot + page state to S3, flip to `manual_review`, and alert (Slack/email) rather than silently retrying forever.
- **Reputation scoring** — nightly batch job, not per-request:
  ```
  score = (avg_rating * 0.5) + (log(tickets_sold + 1) * 0.3) + (verification_rate * 0.2)
  ```
- **Follow notifications** — when a followed organiser/venue publishes a new event, fan out a notification job per follower via SQS + worker, not a synchronous loop on publish.
- **Badge unlocks** — evaluated as triggers on the events that matter (order completed, ticket scanned, Nth sale), e.g. on `escrow_state → payout_released`, check and award "First ticket sold" if not already held — not a recurring full-table scan.

---

## 8. Open questions still worth deciding

1. Launch with the RPA/manual-fallback approach live, or wait until at least one formal organiser/provider partnership exists?
2. Who owns the FSCA/legal conversation before real money moves?
3. Worth cataloguing Howler's per-event resale availability rules before building further — it's the one provider where a full RPA relay might not even be needed.
4. Computicket's transfer capability is still unconfirmed — worth a direct enquiry to their support before ruling it out entirely.

---

## Deliverables produced so far
- `skarrel.html` — first-pass brand mockup (earlier name, superseded by Aftermarket)
- `aftermarket-moodboard.html` / `.png` / `.pdf` — full brand identity mood board, matching pixel-for-pixel across formats
- This document — full product, data, architecture, and automation brief
