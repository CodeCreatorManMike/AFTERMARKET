# Aftermarket — Roadmap

_Last updated: 2026-09-06. This document summarizes the full delivery roadmap tracked in
[GitHub Issues](https://github.com/CodeCreatorManMike/AFTERMARKET/issues) and the
[AFTERMARKET project board](https://github.com/users/CodeCreatorManMike/projects/3)._

## Product mission

Aftermarket is a secure resale platform for festival and event tickets, starting in Cape Town,
South Africa. The core problem is ticket-resale fraud. Aftermarket reduces that risk by combining:

- Escrow-style payment handling (held by Aftermarket until a ticket transfer is confirmed)
- Ticket-provider transfer-process validation, researched and documented per provider
- Ticket authenticity validation where provider APIs or ticket UUIDs are available
- Clear ticket and seller status throughout a resale transaction
- A modern, social, event-discovery-focused mobile experience

Aftermarket does **not** replace ticket providers (Howler, Quicket, Webtickets, Computicket,
Ticketmaster, Fatsoma, etc.). It enables secure resale where transfers are permitted, routes users
to official providers when resale inventory doesn't exist, and builds a social/discovery layer
around events, venues, DJs, and trusted users.

**Do not claim** guaranteed fraud prevention, confirmed legal "escrow" status, confirmed provider
API access, or confirmed Stripe South Africa availability anywhere in product copy until each is
backed by actual legal review or provider-confirmed evidence. See `docs/mvp-scope.md` (tracked in
issue #16) for the living list of confirmed decisions vs. open assumptions.

## MVP scope (high level)

In scope for MVP (Phases 0–4):
- Home, search/discovery, event detail, ticket/listing, and profile screens
- Onboarding with clear trust/anti-scam messaging
- A defined listing lifecycle (draft → ... → completed/disputed) with an escrow-style payment hold
- Manual-transfer fallback for providers that don't support automation
- Auth, RLS-based access control, audit logging, and a pre-pilot security review
- A single, tightly-scoped private pilot (Phase 5)

Explicitly deferred to post-MVP: referral/affiliate integrations, venue/organizer/DJ follow
entities, expanded badges/reputation, wallet/ticket-collection keepsakes, user-generated media,
provider dashboards, paid advertising, automated provider reporting, and geographic expansion.

## Phase timeline

| Phase | Window | Goal | Status |
|---|---|---|---|
| 0 — Project setup & research foundation | 2026-09-05 → 2026-09-12 | Project board organized, brand guide centralized, provider research structure created, first static homepage mock-up ready | Mostly done — brand guide, provider research scaffold, issue templates in place |
| 1 — Product definition, UX foundation & architecture | 2026-09-13 → 2026-09-27 | Data models drafted, onboarding wireframes complete, design system foundation, provider research expanded, ADR complete, MVP scope locked | Data model drafted (`docs/data-model.md`), design-system tokens built (`app/src/theme`). Onboarding wireframes, ADR, MVP scope lock still open |
| 2 — Interactive frontend prototype | 2026-09-28 → 2026-10-18 | All 4 core screens + onboarding built against mock data, light/dark mode, internal demo | **Ahead of schedule.** Home, Search, Tickets, Profile all built against mock data with light/dark theming (`app/`). Mockups for the next batch (event detail, buy-resale-ticket, ticket view, edit profile, previous event — `MOCK-UPS/ui sprint 2/`) are in hand. Event-detail page and onboarding flow still open |
| 3 — Backend foundation & secure-flow PoC | 2026-10-19 → 2026-11-15 | Supabase live, auth + RLS, listing lifecycle on real data, secure-transfer PoC, payment architecture decision | Not started |
| 4 — MVP transaction workflow & pilot readiness | 2026-11-16 → 2026-12-20 | End-to-end staging workflow, manual fallback, notifications, admin review, security review, pilot plan | Not started |
| 5 — Private pilot | 2027-01-04 → 2027-01-31 | Limited pilot, monitoring, feedback, fraud/dispute tracking, go/no-go decision | Not started |
| Post-MVP | after Phase 5 go/no-go | Referral integrations, social/discovery entities, badges, wallet, provider dashboards, scaling | Not started |

Dates are the starting plan from the roadmap brief. Where a Phase-0/1 dependency slips, the
milestone due date is preserved and the affected issue is flagged rather than silently rescheduled.

## Team responsibilities

| Person | Role | Primary responsibilities |
|---|---|---|
| **Michael Jones** | Product & technical lead | Project/roadmap management, frontend build, homepage, architecture decisions, brand-system implementation, provider referral strategy |
| **Matthew "Yorkie" York-Smith** | Product research & design support | Provider T&Cs and transfer-process research, evidence capture, starter UI icon set, briefing Warwick |
| **Warwick York-Smith** | Potential engineering contributor | No assigned ownership until briefed (#15) and availability/role confirmed in writing |

## Major risks

- **Legal/compliance**: escrow-style fund holding, KYC/AML, and consumer-protection obligations
  are unconfirmed — no production copy may call the payment flow "escrow" until legally reviewed
  (#30, #31, #49, #58).
- **Provider policy risk**: some providers explicitly discourage resale use of their transfer
  feature (e.g. Ticketmaster SA's transfer docs say "not used for exchanging tickets" per the
  existing README research) — automating against those terms is a real ToS/account-suspension risk.
- **Payments feasibility**: Stripe South Africa's marketplace/payout/hold support is still a
  research question, not a confirmed capability (#31).
- **Team capacity**: only Michael and Yorkie are currently committed; Warwick's availability is
  unconfirmed (#15).
- **Scope discipline**: post-MVP social/wallet/referral features are intentionally excluded from
  MVP scope to avoid diluting the trust-first core loop.

## Provider-research status

Tracked under `/ticket-transfer-process/providers/` (#7) and the linked issues below. The existing
`README.md` (§3) already contains first-pass findings for 5 of these — the issues below formalize
that into sourced, evidenced documentation per the required template.

| Provider | Issue | Status | Preliminary integration path (per README §3, unverified against template) |
|---|---|---|---|
| Howler | #8 | Research started | Best case — native resale pool where enabled; RPA relay fallback otherwise |
| Quicket | #25 | Not started | Admin-account relay (browser automation) |
| Webtickets | #26 | Not started | Admin-account relay — creates a two-payment ledger to track separately |
| Computicket | #27 | Not started | Unsupported until proven otherwise — manual upload only |
| Ticketmaster (SA) | #28 | Not started | Admin-account relay, flagged higher ToS-risk (resale explicitly discouraged) |
| Fatsoma | #29 | Not started | No prior research — greenfield |

## Key architecture assumptions

These are **assumptions carried forward from prior research**, not confirmed decisions — see the
architecture decision record (#32) for the point at which each becomes confirmed:

- Frontend: React Native, Expo decision pending
- Backend: Supabase (Postgres, Auth, Storage, RLS, Edge Functions)
- Payments: Peach Payments / Stripe South Africa both under evaluation (#31) — no provider is
  confirmed yet
- Provider integration: one adapter per provider (`TicketProviderAdapter` protocol), with
  browser-automation (RPA) relay for providers without a public API, and manual-upload fallback
  where no transfer mechanism is confirmed
- Escrow flow: buyer payment held by Aftermarket → ticket-transfer confirmation → seller payout,
  pending legal sign-off on National Payment System Act / FSCA implications

## Where to look

- Full issue backlog: [GitHub Issues](https://github.com/CodeCreatorManMike/AFTERMARKET/issues)
- Roadmap board: [AFTERMARKET project](https://github.com/users/CodeCreatorManMike/projects/3)
- Provider evidence: `/ticket-transfer-process/providers/`
- MVP scope (confirmed vs. assumed): `docs/mvp-scope.md` (tracked in #16)
