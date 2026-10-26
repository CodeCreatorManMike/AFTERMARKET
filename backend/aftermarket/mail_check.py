"""Triage a FIXR inbox message; never verify ticket custody from email alone."""

from email import policy
from email.parser import BytesParser
from email.utils import getaddresses, parseaddr
import re
from urllib.parse import urlparse


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


def inspect_seller_link_email(raw: bytes, *, inbox: str, seller_email: str,
                              listing_id: str, event_title: str,
                              trusted_dkim_domain: str | None = None) -> dict:
    """Nominate a seller-shared FIXR link for manual review; never return the link."""
    message = BytesParser(policy=policy.default).parsebytes(raw)
    sender = parseaddr(message.get("From", ""))[1].lower()
    recipients = {address.lower() for _, address in getaddresses(
        message.get_all("To", []) + message.get_all("Delivered-To", []))}
    subject = str(message.get("Subject", ""))
    texts = []
    for part in message.walk():
        if part.get_content_type() == "text/plain" and part.get_content_disposition() != "attachment":
            try:
                texts.append(part.get_content())
            except (UnicodeDecodeError, LookupError):
                pass
    body = "\n".join(texts)
    sender_domain = sender.rsplit("@", 1)[-1] if "@" in sender else ""
    authenticated = sender_domain == (trusted_dkim_domain or "").lower()
    # The listing ID is a routing token, not proof of ticket ownership.
    listing_match = bool(re.search(rf"(?<![a-f0-9]){re.escape(listing_id)}(?![a-f0-9])", subject, re.IGNORECASE))
    event_match = event_title.casefold() in (subject + "\n" + body).casefold()
    link_present = any(urlparse(value.rstrip(').,>')).hostname in {"fixr.co", "www.fixr.co"}
                       for value in re.findall(r"https://[^\s<>]+", body, re.IGNORECASE))
    return {
        "sender": sender,
        "authenticated_seller_domain": authenticated,
        "addressed_to_inbox": inbox.lower() in recipients,
        "listing_id_match": listing_match,
        "event_title_match": event_match,
        "fixr_link_present": link_present,
        "candidate_for_review": sender == seller_email.lower() and authenticated and
                                inbox.lower() in recipients and listing_match and event_match and link_present,
        "ticket_verified": False,
    }
