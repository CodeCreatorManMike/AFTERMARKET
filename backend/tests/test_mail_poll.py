import tempfile
import unittest
from pathlib import Path

from backend.aftermarket.mail_poll import match_transfer_email, trusted_dkim_domain
from backend.aftermarket.workflow import Workflow


def message(auth_headers, sender="transfers@fixr.co", subject="Tickets transferred: Oxford Night"):
    lines = [f"Authentication-Results: {value}" for value in auth_headers]
    lines += [f"From: FIXR <{sender}>", "To: pilot@example.com", "Message-ID: <abc@fixr.co>",
              f"Subject: {subject}", "Content-Type: text/plain", "", "You have been sent a ticket."]
    return "\r\n".join(lines).encode()


class MailPollTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.flow = Workflow(Path(self.temp.name) / "pilot.db")
        self.listing = self.flow.create_listing("seller@example.com", "Oxford Night", "General", 2500, "seller", "GBP", "123")
        self.flow.approve_listing(self.listing, "Transfer allowed; case 1", "operator")

    def tearDown(self):
        self.flow.close()
        self.temp.cleanup()

    def test_only_top_receiver_header_is_trusted(self):
        good = "mx.google.com; dkim=pass header.i=@fixr.co header.s=s1; spf=pass"
        forged = "attacker.example; dkim=pass header.d=fixr.co"
        self.assertEqual(trusted_dkim_domain(message([good])), "fixr.co")
        self.assertIsNone(trusted_dkim_domain(message([forged, good])))
        self.assertIsNone(trusted_dkim_domain(message(["mx.google.com; dkim=fail header.d=fixr.co"])))
        self.assertIsNone(trusted_dkim_domain(message([])))

    def test_authenticated_match_records_one_lead_once(self):
        raw = message(["mx.google.com; dkim=pass header.d=fixr.co"])
        leads = match_transfer_email(self.flow, raw, inbox="pilot@example.com")
        self.assertEqual([lead["listing_id"] for lead in leads], [self.listing])
        match_transfer_email(self.flow, raw, inbox="pilot@example.com")
        count = self.flow.db.execute("SELECT COUNT(*) FROM audit_events WHERE event_type='fixr_email_lead'").fetchone()[0]
        self.assertEqual(count, 1)
        self.assertEqual(self.flow.db.execute("SELECT status FROM listings").fetchone()[0], "awaiting_transfer")

    def test_spoofed_or_wrong_event_is_ignored(self):
        self.assertEqual(match_transfer_email(self.flow, message(["mx.google.com; dkim=pass header.d=evil.example"]), inbox="pilot@example.com"), [])
        self.assertEqual(match_transfer_email(self.flow, message(["mx.google.com; dkim=pass header.d=fixr.co"], subject="Other night"), inbox="pilot@example.com"), [])


if __name__ == "__main__":
    unittest.main()
