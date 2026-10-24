import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

from backend.aftermarket.mailer import send_pending
from backend.aftermarket.workflow import Workflow, WorkflowError


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp.name) / "flow.db"
        self.flow = Workflow(self.db_path)
        self.deadline = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        self.listing = self.flow.create_listing("seller@example.com", "Demo Night", "General", 25000, "seller")
        self.flow.approve_listing(self.listing, "Organiser enabled transfer; review #123", "operator")
        self.flow.confirm_fixr_receipt(self.listing, "Operator saw ticket in receiving FIXR bookings #123", "operator")
        self.order = self.flow.reserve(self.listing, "buyer@example.com", self.deadline, "buyer")

    def tearDown(self):
        self.flow.close()
        self.temp.cleanup()

    def move(self, action, evidence="review #123"):
        return self.flow.transition(self.order, action, "operator", evidence)

    def test_payout_requires_claim_and_independent_review(self):
        with self.assertRaises(WorkflowError):
            self.move("request_payout")
        self.move("confirm_payment", "PSP hold 001")
        self.move("relay_sent")
        with self.assertRaises(WorkflowError):
            self.move("verify_transfer")
        self.move("buyer_claimed")
        self.move("verify_transfer", "FIXR buyer bookings reviewed #456")
        self.move("request_payout")
        self.move("confirm_payout", "PSP payout 001")
        self.assertEqual(self.flow.order(self.order)["state"], "completed")
        with self.assertRaises(WorkflowError):
            self.move("confirm_payout", "PSP payout 001")
        self.assertEqual(len(self.flow.outbox()), 8)

    def test_refund_needs_psp_confirmation_and_blocks_payout(self):
        self.move("confirm_payment", "PSP hold 002")
        self.move("request_refund", "Transfer failed")
        with self.assertRaises(WorkflowError):
            self.move("request_payout")
        self.move("confirm_refund", "PSP refund 002")
        self.assertEqual(self.flow.order(self.order)["state"], "refunded")

    def test_one_buyer_and_no_duplicate_state_change(self):
        with self.assertRaises(WorkflowError):
            self.flow.reserve(self.listing, "other@example.com", self.deadline, "buyer")
        self.move("confirm_payment", "PSP hold 003")
        with self.assertRaises(WorkflowError):
            self.move("confirm_payment", "PSP hold 003")
        self.assertEqual(len(self.flow.outbox()), 3)

    def test_expiry_queues_refund_review_only_once(self):
        self.move("confirm_payment", "PSP hold 004")
        self.flow.db.execute("UPDATE orders SET hold_expires_at=? WHERE id=?",
                             ((datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat(), self.order))
        self.assertEqual(self.flow.expire_due("scheduler"), [self.order])
        self.assertEqual(self.flow.expire_due("scheduler"), [])
        self.assertEqual(self.flow.order(self.order)["state"], "refund_requested")

    def test_unpaid_reservation_expires_without_refund(self):
        self.flow.db.execute("UPDATE orders SET hold_expires_at=? WHERE id=?",
                             ((datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat(), self.order))
        self.assertEqual(self.flow.expire_due("scheduler"), [self.order])
        self.assertEqual(self.flow.order(self.order)["state"], "cancelled")
        with self.assertRaises(WorkflowError):
            self.move("confirm_payment", "late payment")

    def test_outbox_delivery_record_is_durable(self):
        item = self.flow.pending_notifications()[0]
        self.flow.record_delivery(item["id"])
        self.flow.close()
        self.flow = Workflow(self.db_path)
        self.assertEqual(len(self.flow.pending_notifications()), 1)
        self.assertIsNotNone(self.flow.outbox()[0]["sent_at"])

    def test_smtp_worker_sends_queued_message_once(self):
        class FakeSMTP:
            messages = []

            def __init__(self, *args, **kwargs):
                pass

            def __enter__(self):
                return self

            def __exit__(self, *args):
                pass

            def starttls(self, **kwargs):
                pass

            def login(self, *args):
                pass

            def send_message(self, message):
                self.messages.append(message)

        config = {
            "AFTERMARKET_SMTP_HOST": "smtp.example.com",
            "AFTERMARKET_SMTP_USER": "test",
            "AFTERMARKET_SMTP_PASSWORD": "test",
            "AFTERMARKET_FROM_EMAIL": "tickets@example.com",
        }
        with patch.dict("os.environ", config), patch("smtplib.SMTP", FakeSMTP):
            self.assertEqual(send_pending(self.flow), (2, 0))
            self.assertEqual(send_pending(self.flow), (0, 0))
        self.assertEqual(len(FakeSMTP.messages), 2)

    def test_no_transfer_link_appears_in_notifications(self):
        self.move("confirm_payment", "PSP hold 005")
        self.move("relay_sent")
        self.assertTrue(all("https://" not in mail["body"] for mail in self.flow.outbox()))
        with self.assertRaises(WorkflowError):
            self.move("buyer_claimed", "https://fixr.co/private-link")


if __name__ == "__main__":
    unittest.main()
