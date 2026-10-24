# FIXR receiving inbox: choice and setup

Sellers transfer tickets on FIXR to one Aftermarket email address. That address owns the
Aftermarket FIXR account, so a ticket that lands there is verified. The inbox must (1) receive
FIXR account and transfer emails reliably, (2) be readable by our automation, and (3) give us a
trustworthy DKIM result so a forged "FIXR" email cannot fake a transfer.

## Recommendation

**Now: a dedicated free Gmail account, read over IMAP with an app password.**

- Free, set up in minutes, and FIXR will deliver to it like any customer address.
- Google adds its own `Authentication-Results` header (`mx.google.com; dkim=pass header.d=fixr.co`).
  `backend/aftermarket/mail_poll.py` trusts only that top header, so spoofed mail is ignored.
- IMAP with an app password needs no OAuth app or Google Cloud project. App passwords need
  2-Step Verification and are revoked if the account password changes.

**Later, once the domain is set up: Cloudflare Email Routing → Email Worker** (for example
`tickets@<our domain>`). Receiving is free, a Worker processes each message on arrival (no polling),
and it can also forward a copy to the Gmail inbox. Use it when we want a branded address or
per-seller addresses. It needs the domain's DNS on Cloudflare.

Not recommended for this use: Outlook.com (IMAP only with OAuth), Zoho Mail free (no IMAP on the free
plan), Proton (IMAP only through the paid Bridge).

## Setup (done by you; the account must be yours)

1. Create a new Gmail account used only for Aftermarket's FIXR account. Use a strong unique password
   in your password manager. Do not share it in chat or commit it.
2. Turn on 2-Step Verification, then create an app password (Google Account → Security → App passwords).
3. Create the FIXR account with that Gmail address and verify it.
4. Put the address in `app/.env.local` (git-ignored): `EXPO_PUBLIC_FIXR_INBOX=that-address@gmail.com`.
5. On the backend host only, set `AFTERMARKET_IMAP_USER`, `AFTERMARKET_IMAP_PASSWORD` (the app password)
   and `AFTERMARKET_FIXR_INBOX`.
6. Buy one test ticket on FIXR, transfer it to the inbox, and send us the raw email (Gmail →
   ⋮ → Show original → Download). We use it to tune event matching in `mail_check.py`.

## Running the check

```sh
python3 -m backend.aftermarket.mail_poll --db /private/path/fixr.db
```

It reads unread FIXR mail, keeps only messages Google says passed DKIM for `fixr.co`, matches the
event title to one listing in `awaiting_transfer`, and records a `fixr_email_lead` audit event. It
does not mark the ticket received: an operator confirms the ticket in the FIXR account and runs
`confirm-fixr-receipt`. Transfer links are never stored.
