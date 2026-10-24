import hashlib
import hmac
import json
import tempfile
import time
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from backend.aftermarket.mail_check import inspect_fixr_email
from backend.aftermarket.stripe_checkout import accept_webhook, create_payment_intent, verify_signature
from backend.aftermarket.workflow import Workflow, WorkflowError


class IntegrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.flow = Workflow(Path(self.temp.name) / "pilot.db")
        self.listing = self.flow.create_listing("seller@example.com", "Oxford Night", "General", 2500,
                                                "seller", "GBP", "123456")
        self.flow.approve_listing(self.listing, "Event transfer allowed; case 1", "operator")
        self.flow.confirm_fixr_receipt(self.listing, "Checked receiving FIXR bookings; case 2", "operator")
        self.order = self.flow.reserve(self.listing, "buyer@example.com",
                                       (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(), "buyer")

    def tearDown(self):
        self.flow.close()
        self.temp.cleanup()

    def _intent(self, method, path, key, form=None):
        self.assertEqual(key, "sk_test_fake")
        if method == "POST":
            self.assertEqual(form["amount"], 2500)
            self.assertEqual(form["currency"], "gbp")
            self.assertEqual(form["metadata[order_id]"], self.order)
            self.assertEqual(form["metadata[listing_id]"], self.listing)
        return {"id": "pi_test_order_1", "client_secret": "pi_test_order_1_secret_test",
                "amount": 2500, "currency": "gbp",
                "metadata": {"order_id": self.order, "listing_id": self.listing}}

    def _signed_event(self, amount=2500, secret="whsec_test"):
        event = {"id": "evt_test_1", "type": "payment_intent.succeeded", "livemode": False,
                 "data": {"object": {"id": "pi_test_order_1", "object": "payment_intent",
                                     "status": "succeeded", "amount_received": amount,
                                     "currency": "gbp", "metadata": {"order_id": self.order,
                                                                     "listing_id": self.listing}}}}
        raw = json.dumps(event).encode()
        timestamp = int(time.time())
        signature = hmac.new(secret.encode(), str(timestamp).encode() + b"." + raw,
                             hashlib.sha256).hexdigest()
        return raw, f"t={timestamp},v1={signature}"

    def test_stripe_success_matches_order_and_is_idempotent(self):
        result = create_payment_intent(self.flow, self.order, "sk_test_fake", self._intent)
        self.assertEqual(result["payment_intent_id"], "pi_test_order_1")
        raw, header = self._signed_event()
        self.assertEqual(accept_webhook(self.flow, raw, header, "whsec_test"), "funds_held")
        self.assertEqual(accept_webhook(self.flow, raw, header, "whsec_test"), "duplicate")
        self.assertEqual(self.flow.order(self.order)["state"], "funds_held")

    def test_stripe_rejects_bad_signature_amount_and_mode(self):
        create_payment_intent(self.flow, self.order, "sk_test_fake", self._intent)
        raw, header = self._signed_event(amount=2400)
        with self.assertRaises(WorkflowError):
            accept_webhook(self.flow, raw, header, "wrong_secret")
        with self.assertRaises(WorkflowError):
            accept_webhook(self.flow, raw, header, "whsec_test")
        with self.assertRaises(WorkflowError):
            accept_webhook(self.flow, raw, header, "whsec_test", expected_livemode=True)
        self.assertEqual(self.flow.order(self.order)["state"], "payment_pending")
        with self.assertRaises(WorkflowError):
            verify_signature(raw, header, "whsec_test", now=int(time.time()) + 600)

    def test_fixr_message_is_only_a_review_candidate(self):
        raw = (b"From: Tickets <tickets@fixr.co>\r\n"
               b"To: pilot@example.com\r\nSubject: Oxford Night ticket\r\n"
               b"Content-Type: text/plain; charset=utf-8\r\n\r\nOxford Night confirmation")
        result = inspect_fixr_email(raw, inbox="pilot@example.com", event_title="Oxford Night",
                                    trusted_dkim_domain="fixr.co")
        self.assertTrue(result["candidate_for_review"])
        self.assertFalse(result["ticket_verified"])
        self.assertFalse(inspect_fixr_email(raw, inbox="pilot@example.com",
                                            event_title="Oxford Night")["candidate_for_review"])
        spoofed = raw.replace(b"tickets@fixr.co", b"tickets@fixr.co.evil.example")
        self.assertFalse(inspect_fixr_email(spoofed, inbox="pilot@example.com",
                                            event_title="Oxford Night",
                                            trusted_dkim_domain="fixr.co")["candidate_for_review"])


if __name__ == "__main__":
    unittest.main()
