# FIXR receiving inbox: choice and setup

Sellers share their unique FIXR transfer link privately with one Aftermarket email address.
The current pilot address is `michaeljonesincorporated@gmail.com`. An operator must claim
the link and check the ticket in the receiving FIXR account; mail delivery alone does not
verify custody. The inbox must receive FIXR account and seller emails reliably and be readable
by the review worker.

## Recommendation

**Now: the Gmail address above, read over IMAP with an app password after it is configured.**

- Free, set up in minutes, and FIXR will deliver to it like any customer address.
- Google adds its own `Authentication-Results` header. `backend/aftermarket/mail_poll.py`
  trusts only that top header. It can nominate a directly authenticated FIXR notice or a
  seller-shared link matching the seller address, event name and backend listing ID.
- IMAP with an app password needs no OAuth app or Google Cloud project. App passwords need
  2-Step Verification and are revoked if the account password changes.

**Later, once the domain is set up: Cloudflare Email Routing** (for example
`tickets@<our domain>`). Receiving is free and can forward to the Gmail inbox. An Email Worker
could process incoming mail on arrival. This needs the domain's DNS on Cloudflare and a
real forwarded sample to validate authentication headers.

Not recommended for this use: Outlook.com (IMAP only with OAuth), Zoho Mail free (no IMAP on the free
plan), Proton (IMAP only through the paid Bridge).

## Setup (done by you; the account must be yours)

1. Keep the pilot Gmail password in your password manager. Do not share it in chat or commit it.
2. Turn on 2-Step Verification, then create an app password (Google Account → Security → App passwords).
3. Create a dedicated FIXR account with the pilot address and verify it.
4. Put the address in `app/.env.local` (git-ignored): `EXPO_PUBLIC_FIXR_INBOX=michaeljonesincorporated@gmail.com`.
5. On the backend host only, set `AFTERMARKET_IMAP_USER`, `AFTERMARKET_IMAP_PASSWORD` (the app password)
   and `AFTERMARKET_FIXR_INBOX`.
6. Obtain one transferable test ticket on FIXR and email the unique transfer link to the pilot
   inbox. Include the backend listing ID and event name in the subject. Preserve a **redacted**
   original email sample (Gmail → ⋮ → Show original → Download) for adapter validation. Never
   commit or share the live link. Claim the ticket in the receiving FIXR account and inspect
   Your Bookings before recording custody.

## Running the check

```sh
python3 -m backend.aftermarket.mail_poll --db /private/path/fixr.db
```

It reads unread mail and nominates a message only when the authentication and listing signals
match one `awaiting_transfer` listing. It records a hashed message fingerprint as a
`fixr_email_lead` audit event. It does not mark the ticket received: an operator claims and
confirms the ticket in the FIXR account, then runs `confirm-fixr-receipt`. Transfer links are
never stored.
