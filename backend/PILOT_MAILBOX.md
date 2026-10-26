# FIXR pilot inbox

Current pilot address: `michaeljonesincorporated@gmail.com`. Set the app's `EXPO_PUBLIC_FIXR_INBOX` and the backend's `AFTERMARKET_FIXR_INBOX` to this address until a branded domain is available. The address is an inbox identifier, not a credential. Keep account passwords and recovery details private.

Use one dedicated receiving address for the FIXR account and the seller handover instructions. A seller shares the **unique FIXR transfer link** to that address. An incoming message is only a lead: an operator must claim the link and independently confirm the ticket in that FIXR account before marking custody verified.

## Free branded route

If Aftermarket owns a domain and can manage its DNS, Cloudflare Email Routing can create a branded address such as `tickets@your-domain` and forward mail to an existing inbox at no charge. The address can be used for a dedicated FIXR account. Routing is forwarding, not a standalone mailbox or an outbound sender. It also depends on the domain's DNS being on Cloudflare. See [Cloudflare routing rules](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/) and [pricing](https://developers.cloudflare.com/email-service/platform/pricing/).

For now, configure `EXPO_PUBLIC_FIXR_INBOX` for the app and `AFTERMARKET_FIXR_INBOX` for the backend to the current Gmail address above. When a domain is ready, route a branded address to that Gmail inbox and change both settings together. Do not put mailbox passwords, app passwords, FIXR credentials, transfer links, or QR payloads in Git. The IMAP worker assumes Gmail receives the message and trusts only Gmail's top authentication header. It can nominate a seller message when sender authentication, seller address, listing ID, event name, recipient and a FIXR link all match. A real sample is still needed to validate the header format. Its output is never custody verification.

The current Gmail address can receive a private pilot transfer without waiting for a domain. A new Proton Free address is another no-domain option, but Proton Free does not include standard IMAP/SMTP client access, so the existing IMAP worker cannot poll it; see [Proton's plan comparison](https://proton.me/mail/pricing). Zoho advertises a free custom-domain mailbox in selected data centres, but its free tier is web-only and also lacks IMAP/POP, so it does not fit this worker; see [Zoho's subscription details](https://www.zoho.com/mail/help/adminconsole/subscription.html).

## Pilot sequence

1. Set up the receiving address and register a dedicated FIXR account with it. Keep account recovery and two-factor access under the operator's control.
2. Buy or otherwise obtain a ticket whose organiser permits transfer. In FIXR, choose **Transfer tickets** and share the unique link privately to the receiving address. Do not publish the link or put it in a listing.
3. Have the seller include the backend listing ID and event name in the email subject. Preserve one redacted example of the raw email headers and structure for the mail adapter. Never commit the live link or personal data.
4. Have the operator claim the link in the receiving FIXR account and inspect **Your Bookings**. Record the event, ticket type, and ticket count as custody evidence. A QR code in a screenshot or an email from FIXR alone is insufficient.
5. Only after this pilot succeeds should the app and backend be connected through authenticated APIs and the payment path enabled.

FIXR's [transfer guide](https://help.fixr.co/en/articles/2032380-how-do-i-transfer-a-ticket) describes the link and claim step. Its [customer terms](https://fixr.co/legal/customer-terms-and-conditions) restrict commercial use and automated extraction, so a provider or organiser agreement is needed for a live commercial catalogue and transfer operation.
