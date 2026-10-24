# FIXR pilot workflow (Oxford and Cape Town)

## City catalogue feed

`backend.aftermarket.catalogue_server` serves `GET /v1/catalogue/oxford` and `GET /v1/catalogue/cape_town` from SQLite. Each feed is stored per city (venues, recurring series and import history are separate). Events may carry optional `fixrRank` (FIXR listing position, used for popularity) and `lastTicketPrice` (FIXR's last available price in GBP/ZAR, used as the seller's default asking price). With `AFTERMARKET_LICENSED_FIXR_FEED_URL` and `AFTERMARKET_LICENSED_FIXR_FEED_TOKEN` set, it imports an authorised JSON feed on startup and daily at 06:00 UTC; failed imports retry hourly and retain the last good catalogue. The service must remain running on a deployed host with persistent storage. Configure the Expo build with `EXPO_PUBLIC_CATALOGUE_URL=https://your-host/v1/catalogue`; the app appends the member's city. Without it, the app uses its dated Oxford snapshot and shows Cape Town as coming soon. Neither the server nor the app scrapes FIXR pages.

The feed must be supplied under a FIXR/organiser agreement and have this shape:

```json
{
  "source": "fixr", "city": "oxford", "rightsConfirmed": true,
  "suppliedAt": "2026-10-24T06:00:00Z", "complete": true,
  "events": [{
    "id": "123456", "title": "Example event", "venue": "Example venue",
    "address": "Oxford address", "date": "2026-10-31",
    "startAt": "2026-10-31T20:00:00Z", "endAt": "2026-11-01T02:00:00Z",
    "url": "https://fixr.co/event/example-tickets-123456",
    "imageUrl": "https://fixr-cdn.fixr.co/images/event/example.jpeg",
    "excerpt": "A short event summary.", "description": "Complete licensed organiser description.",
    "availabilityAtCheck": "sold_out"
  }]
}
```

Import uses FIXR event ID for updates, retains first/last seen timestamps, stores venues and title plus venue series, and filters finished events using Oxford time. `complete: true` removes missing events from the live catalogue while retaining history. The API exposes only upcoming records. Exact description and image URLs are displayed only when the feed grants those rights. `rightsConfirmed` is an importer assertion, not a substitute for the agreement. Keep the feed token server-side and the catalogue endpoint on HTTPS. The public API is read only and contains no customer or ticket data.

Run locally after configuring a permitted feed: `AFTERMARKET_DB_PATH=/private/path/catalogue.db AFTERMARKET_LICENSED_FIXR_FEED_URL=https://provider.example/feed AFTERMARKET_LICENSED_FIXR_FEED_TOKEN=... python3 -m backend.aftermarket.catalogue_server`. A one-off import can call `ingest_file(database, path)` from `backend.aftermarket.catalogue`. The daily worker is inactive until the feed settings and a continuously running server are supplied.

This is a local operator proof of concept, not a live checkout or escrow service. It stores listing and order state in SQLite, creates a transactional email outbox, checks candidate FIXR mail, and has a Stripe PaymentIntent and signed webhook seam. The Expo app is not connected to this database. No real ticket or money moves through the prototype.

## Sequence

1. Seller selects an exact FIXR event and creates a local preview in the app. The screenshot is shown in that session and discarded when the preview is saved.
2. An operator creates a backend listing, confirms organiser permission and that transfer is available, then approves it. Approval queues a message telling the seller to transfer to `AFTERMARKET_FIXR_INBOX` through FIXR.
3. `mail_poll.py` (see `docs/fixr-inbox-setup.md`) reads the Gmail inbox over IMAP and records a `fixr_email_lead` when one listing matches. Any adapter must fetch the original RFC 822 message and trusted authentication results from the mail provider. `inspect_fixr_email` checks the apparent sender domain, trusted DKIM domain, recipient, and event title. A match is only a review candidate. The operator must independently confirm the ticket in the receiving FIXR account before `confirm-fixr-receipt` makes the listing reservable. Never store a unique link or QR code in SQLite or notifications.
4. A buyer reserves the listing. The server creates a Stripe PaymentIntent from the stored order amount, currency and IDs. The signed `payment_intent.succeeded` webhook must match that order, listing, amount, currency, mode and PaymentIntent ID before the workflow records payment. Card and Apple Pay can use a future authenticated app checkout; no checkout endpoint is exposed yet.
5. An operator transfers the ticket from the receiving FIXR account to the buyer after payment, records the buyer's claim and independent verification, then reviews payout. Refund requests remain pending until Stripe confirms a real refund. There is no automated payout or refund call yet.

The SQLite state `funds_held` means Stripe reported a succeeded payment in this prototype. It does **not** mean that Stripe or Aftermarket provides escrow or a delayed-capture hold.

## Local walkthrough

Use a private database outside the repository. The CLI is for trusted local operators only. Do not put credentials, transfer links or personal ticket images in Git or audit notes.

```sh
export AFTERMARKET_FIXR_INBOX='your-pilot-inbox@example.com'
python3 -m backend.aftermarket.cli --db /private/path/fixr.db create-listing \
  --seller seller@example.com --event 'Oxford Demo Night' --ticket-type General \
  --cents 2500 --currency GBP --fixr-event-id FIXR_EVENT_ID --actor operator
python3 -m backend.aftermarket.cli --db /private/path/fixr.db approve-listing LISTING_ID \
  --policy-evidence 'Organiser and FIXR transfer check case 123' --actor operator
python3 -m backend.aftermarket.cli --db /private/path/fixr.db confirm-fixr-receipt LISTING_ID \
  --custody-evidence 'Ticket visible in receiving FIXR bookings; case 124' --actor operator
python3 -m backend.aftermarket.cli --db /private/path/fixr.db reserve LISTING_ID \
  --buyer buyer@example.com --deadline 2026-10-31T12:00:00+00:00 --actor operator
```

`create_payment_intent(workflow, order_id, secret_key)` in `stripe_checkout.py` calls Stripe and binds its PaymentIntent to the order. Run `STRIPE_WEBHOOK_SECRET=... AFTERMARKET_DB_PATH=/private/path/fixr.db python3 -m backend.aftermarket.webhook_server` to receive Stripe CLI test events at `127.0.0.1:4242/stripe/webhook`. It defaults to test mode; `STRIPE_LIVEMODE=true` must be deliberate. Never expose this demo server publicly or return its client secret without authentication and authorization. The CLI `confirm_payment` action is a manual operator attestation for demonstrations; it must be removed or restricted when real checkout is enabled so a payment cannot be asserted without a signed provider event.

After confirmed payment, the local CLI transitions are `relay_sent`, `buyer_claimed`, `verify_transfer`, `request_payout`, and `confirm_payout`, each with `--actor` and `--evidence`. `expire-due --actor scheduler` cancels unpaid reservations and queues refund review for expired paid handovers. It does not issue a Stripe refund. `show-order`, `outbox`, and `send-outbox` inspect orders and notifications.

## Notifications and deployment gates

Set `AFTERMARKET_SMTP_HOST`, `AFTERMARKET_SMTP_PORT` (default 587), `AFTERMARKET_SMTP_USER`, `AFTERMARKET_SMTP_PASSWORD`, and `AFTERMARKET_FROM_EMAIL` before `send-outbox`. The worker uses STARTTLS. Run one worker at a time; delivery is at least once and a crash after SMTP acceptance can duplicate an email. The app pilot inbox is set separately with `EXPO_PUBLIC_FIXR_INBOX` for local UI builds. Review sender identity, consent and templates before any real email delivery.

Before launching: secure an approved FIXR/organiser commercial transfer route; connect the pilot mailbox with trusted provider authentication data and a real sample; implement authenticated app and operator APIs, secure ticket evidence storage and access controls; configure Stripe account, publishable key, Apple Pay merchant identifier, webhook endpoint, refund and payout flows; establish the actual custody/settlement model with legal and payment-provider review. FIXR's [transfer guide](https://help.fixr.co/en/articles/2032380-how-do-i-transfer-a-ticket) describes a unique link that the recipient claims, while [transfer limits](https://help.fixr.co/en/articles/2032395-why-is-it-not-allowing-me-to-transfer-my-ticket) depend on organiser and timing. [Customer terms](https://fixr.co/legal/customer-terms-and-conditions) restrict commercial use and automated extraction. This prototype does not automate FIXR access or claim a ticket is valid from email alone.

Run `python3 -m unittest discover -s backend/tests -v` for focused checks.
