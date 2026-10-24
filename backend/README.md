# FIXR Oxford pilot workflow

This is a local operator proof of concept, not a live checkout or escrow service. It stores listing and order state in SQLite, creates a transactional email outbox, checks candidate FIXR mail, and has a Stripe PaymentIntent and signed webhook seam. The Expo app is not connected to this database. No real ticket or money moves through the prototype.

## Sequence

1. Seller selects an exact FIXR event and creates a local preview in the app. The screenshot is shown in that session and discarded when the preview is saved.
2. An operator creates a backend listing, confirms organiser permission and that transfer is available, then approves it. Approval queues a message telling the seller to transfer to `AFTERMARKET_FIXR_INBOX` through FIXR.
3. The receiving mailbox adapter, when added, must fetch the original RFC 822 message and trusted authentication results from the mail provider. `inspect_fixr_email` checks the apparent sender domain, trusted DKIM domain, recipient, and event title. A match is only a review candidate. The operator must independently confirm the ticket in the receiving FIXR account before `confirm-fixr-receipt` makes the listing reservable. Never store a unique link or QR code in SQLite or notifications.
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
