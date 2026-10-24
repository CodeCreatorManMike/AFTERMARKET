"""Triage a FIXR inbox message; never verify ticket custody from email alone."""

from email import policy
from email.parser import BytesParser
from email.utils import getaddresses, parseaddr


def inspect_fixr_email(raw: bytes, *, inbox: str, event_title: str,
                       trusted_dkim_domain: str | None = None) -> dict:
    """Return review signals from a mailbox provider's authenticated fetch.

    `trusted_dkim_domain` must come from the mailbox provider's trusted message
    metadata, not from a sender-controlled header. Until a real sample and inbox
    adapter exist, this function can only nominate messages for manual review.
    """
    message = BytesParser(policy=policy.default).parsebytes(raw)
    sender = parseaddr(message.get("From", ""))[1].lower()
    recipients = {address.lower() for _, address in getaddresses(
        message.get_all("To", []) + message.get_all("Delivered-To", []))}
    sender_domain = sender.rsplit("@", 1)[-1] if "@" in sender else ""
    from_fixr = sender_domain == "fixr.co" or sender_domain.endswith(".fixr.co")
    dkim_domain = (trusted_dkim_domain or "").lower()
    authenticated = dkim_domain == "fixr.co" or dkim_domain.endswith(".fixr.co")
    texts = []
    for part in message.walk():
        if part.get_content_type() == "text/plain" and part.get_content_disposition() != "attachment":
            try:
                texts.append(part.get_content())
            except (UnicodeDecodeError, LookupError):
                pass
    searchable = (str(message.get("Subject", "")) + "\n" + "\n".join(texts)).casefold()
    event_match = event_title.casefold() in searchable
    inbox_match = inbox.lower() in recipients
    return {
        "sender": sender,
        "from_fixr_domain": from_fixr,
        "authenticated_fixr_domain": authenticated,
        "addressed_to_inbox": inbox_match,
        "event_title_match": event_match,
        "candidate_for_review": from_fixr and authenticated and inbox_match and event_match,
        "ticket_verified": False,
    }
