"""Poll the pilot FIXR inbox over IMAP and nominate transfer emails for review.

Designed for a dedicated Gmail account with 2-Step Verification and an app
password (imap.gmail.com). Gmail stamps the top `Authentication-Results`
header itself, so that header is the trusted DKIM source; any lower copy may
have been written by the sender and is ignored.

A match only records an audit lead. An operator must still confirm the ticket
inside the receiving FIXR account before `confirm-fixr-receipt` lists it.
Transfer links are never stored.

Run from the repository root:
    AFTERMARKET_IMAP_USER=... AFTERMARKET_IMAP_PASSWORD=... \
    AFTERMARKET_FIXR_INBOX=... python3 -m backend.aftermarket.mail_poll --db /private/path/fixr.db
"""

from __future__ import annotations

import argparse
import imaplib
import json
import os
import re
from email import policy
from email.parser import BytesParser

from .mail_check import inspect_fixr_email
from .workflow import Workflow

DKIM_PASS = re.compile(r"\bdkim=pass\b[^;]*?\bheader\.(?:d|i)=@?([A-Za-z0-9.-]+)", re.IGNORECASE)


def trusted_dkim_domain(raw: bytes, authserv_id: str = "mx.google.com") -> str | None:
    """Return the DKIM-passing domain from the receiving server's own header."""
    message = BytesParser(policy=policy.default).parsebytes(raw)
    headers = message.get_all("Authentication-Results", [])
    if not headers:
        return None
    top = str(headers[0]).strip()
    if top.split(";", 1)[0].strip().lower() != authserv_id.lower():
        return None
    match = DKIM_PASS.search(top)
    return match.group(1).lower() if match else None


def match_transfer_email(workflow: Workflow, raw: bytes, *, inbox: str,
                         authserv_id: str = "mx.google.com") -> list[dict]:
    """Compare one message with every listing awaiting a FIXR transfer."""
    dkim = trusted_dkim_domain(raw, authserv_id)
    message_id = str(BytesParser(policy=policy.default).parsebytes(raw).get("Message-ID", "")).strip()[:200]
    leads = []
    rows = workflow.db.execute(
        "SELECT id,event_name FROM listings WHERE status='awaiting_transfer' AND provider='FIXR'").fetchall()
    for row in rows:
        signals = inspect_fixr_email(raw, inbox=inbox, event_title=row["event_name"], trusted_dkim_domain=dkim)
        if signals["candidate_for_review"]:
            leads.append({"listing_id": row["id"], "message_id": message_id, **signals})
    if len(leads) == 1:
        # Several matches (same event title) are ambiguous; leave them for an operator.
        workflow.record_transfer_lead(leads[0]["listing_id"], message_id, "mail_poll")
    return leads


def poll_imap(workflow: Workflow, *, host: str, user: str, password: str, inbox: str,
              authserv_id: str = "mx.google.com") -> list[dict]:
    leads: list[dict] = []
    client = imaplib.IMAP4_SSL(host)
    try:
        client.login(user, password)
        client.select("INBOX")
        status, data = client.search(None, "UNSEEN", "FROM", '"fixr.co"')
        if status != "OK":
            raise RuntimeError("IMAP search failed")
        for number in data[0].split():
            status, parts = client.fetch(number, "(BODY.PEEK[])")
            raw = next((part[1] for part in parts if isinstance(part, tuple)), None)
            if status != "OK" or raw is None:
                continue
            found = match_transfer_email(workflow, raw, inbox=inbox, authserv_id=authserv_id)
            leads.extend(found)
            if len(found) == 1:
                client.store(number, "+FLAGS", "\\Seen")
    finally:
        try:
            client.logout()
        except Exception:
            pass
    return leads


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--db", required=True, help="Private SQLite database path")
    args = parser.parse_args()
    workflow = Workflow(args.db)
    try:
        leads = poll_imap(workflow, host=os.environ.get("AFTERMARKET_IMAP_HOST", "imap.gmail.com"),
                          user=os.environ["AFTERMARKET_IMAP_USER"], password=os.environ["AFTERMARKET_IMAP_PASSWORD"],
                          inbox=os.environ["AFTERMARKET_FIXR_INBOX"],
                          authserv_id=os.environ.get("AFTERMARKET_IMAP_AUTHSERV_ID", "mx.google.com"))
    finally:
        workflow.close()
    print(json.dumps([{key: lead[key] for key in ("listing_id", "message_id", "event_title_match")} for lead in leads], indent=2))


if __name__ == "__main__":
    main()
