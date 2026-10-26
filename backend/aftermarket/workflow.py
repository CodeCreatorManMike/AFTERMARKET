"""Durable, operator-reviewed FIXR transaction workflow.

No provider login, ticket credential, payment credential, or transfer link is stored here.
External payment and FIXR actions require independent operator evidence.
"""

from __future__ import annotations

import re
import sqlite3
import os
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


class WorkflowError(ValueError):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _email(value: str) -> str:
    value = value.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
        raise WorkflowError("A valid email address is required")
    return value


def _required(value: str, label: str) -> str:
    value = value.strip()
    if not value or len(value) > 300:
        raise WorkflowError(f"{label} must be 1–300 characters")
    return value


SCHEMA = """
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY, seller_email TEXT NOT NULL, event_name TEXT NOT NULL,
  ticket_type TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'ZAR' CHECK(currency IN ('ZAR','GBP')),
  fixr_event_id TEXT,
  provider TEXT NOT NULL DEFAULT 'FIXR' CHECK(provider = 'FIXR'),
  status TEXT NOT NULL CHECK(status IN ('pending_review','awaiting_transfer','listed','reserved','sold','withdrawn')),
  policy_evidence TEXT, custody_evidence TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, listing_id TEXT NOT NULL UNIQUE REFERENCES listings(id),
  buyer_email TEXT NOT NULL, amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL CHECK(currency IN ('ZAR','GBP')),
  state TEXT NOT NULL CHECK(state IN
    ('payment_pending','funds_held','transfer_pending','claim_reported',
     'transfer_verified','payout_requested','completed','refund_requested','refunded','cancelled')),
  hold_expires_at TEXT NOT NULL, payment_reference TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  transfer_evidence TEXT, payout_reference TEXT UNIQUE, refund_reference TEXT UNIQUE,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT REFERENCES orders(id),
  listing_id TEXT NOT NULL REFERENCES listings(id), event_type TEXT NOT NULL,
  actor TEXT NOT NULL, evidence TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notification_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER NOT NULL REFERENCES audit_events(id),
  recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
  created_at TEXT NOT NULL, sent_at TEXT, attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT, UNIQUE(event_id, recipient)
);
CREATE TABLE IF NOT EXISTS stripe_events (
  event_id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id),
  created_at TEXT NOT NULL
);
"""


TEMPLATES = {
    "listing_approved": ("FIXR transfer step for listing {listing_id}", "Listing {listing_id} passed initial review. If FIXR allows transfer, email its unique transfer link privately to {inbox} with the event name and this listing ID in the subject. We will confirm receipt in FIXR before listing the ticket. Do not publish or reuse the link."),
    "fixr_received": ("FIXR ticket receipt confirmed", "Listing {listing_id}: an operator confirmed the ticket in the receiving FIXR account. The listing can now be reviewed for sale."),
    "funds_held": ("Payment confirmed; FIXR handover next", "Order {order_id}: Stripe reported a successful payment. The ticket handover through FIXR is being prepared. Do not accept a ticket link from an unknown sender."),
    "transfer_pending": ("FIXR ticket transfer underway", "Order {order_id}: the receiving FIXR account reports a transfer was sent to you. Claim it in your own FIXR account. Do not share the unique link. Tell us once it appears in your bookings."),
    "claim_reported": ("FIXR claim needs review", "Order {order_id}: the buyer reports a claim. An operator must confirm the ticket in the buyer's FIXR account before payout can be requested."),
    "transfer_verified": ("FIXR transfer verified", "Order {order_id}: the ticket transfer was independently reviewed. Seller payout can now be requested from the payment provider."),
    "payout_requested": ("Payout requested", "Order {order_id}: payout has been requested. We will confirm when the payment provider reports completion."),
    "completed": ("Sale completed", "Order {order_id}: the payment provider confirmed the seller payout."),
    "refund_requested": ("Refund review started", "Order {order_id}: the transfer was not completed in time. A refund has been requested; we will confirm after the payment provider reports it complete."),
    "refunded": ("Refund confirmed", "Order {order_id}: the payment provider confirmed the refund."),
    "cancelled": ("Reservation expired", "Order {order_id}: the reservation expired before a payment hold was confirmed. No transfer should be sent."),
}


class Workflow:
    def __init__(self, database: str | Path):
        if str(database) != ":memory:":
            path = Path(database)
            path.touch(mode=0o600, exist_ok=True)
            os.chmod(path, 0o600)
        self.db = sqlite3.connect(str(database), isolation_level=None)
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SCHEMA)

    def close(self) -> None:
        self.db.close()

    @contextmanager
    def _tx(self):
        self.db.execute("BEGIN IMMEDIATE")
        try:
            yield
            self.db.execute("COMMIT")
        except Exception:
            self.db.execute("ROLLBACK")
            raise

    def _row(self, table: str, identifier: str) -> sqlite3.Row:
        row = self.db.execute(f"SELECT * FROM {table} WHERE id = ?", (identifier,)).fetchone()
        if row is None:
            raise WorkflowError(f"{table} record not found")
        return row

    def _event(self, listing_id: str, order_id: str | None, kind: str, actor: str,
               recipient: str | None = None, evidence: str | None = None) -> None:
        now = _now()
        event = self.db.execute(
            "INSERT INTO audit_events(listing_id,order_id,event_type,actor,evidence,created_at) VALUES(?,?,?,?,?,?)",
            (listing_id, order_id, kind, actor, evidence, now),
        )
        if recipient:
            subject, body = TEMPLATES[kind]
            self.db.execute(
                "INSERT INTO notification_outbox(event_id,recipient,subject,body,created_at) VALUES(?,?,?,?,?)",
                (event.lastrowid, recipient, subject.format(listing_id=listing_id, order_id=order_id), body.format(listing_id=listing_id, order_id=order_id,
                    inbox=os.environ.get('AFTERMARKET_FIXR_INBOX', 'the pilot inbox shared by an operator')), now),
            )

    def create_listing(self, seller_email: str, event_name: str, ticket_type: str,
                       amount_cents: int, actor: str, currency: str = 'ZAR',
                       fixr_event_id: str | None = None) -> str:
        if not isinstance(amount_cents, int) or isinstance(amount_cents, bool) or not 1 <= amount_cents <= 10_000_000:
            raise WorkflowError("Amount must be 1–10,000,000 minor currency units")
        seller_email = _email(seller_email)
        event_name = _required(event_name, "Event name")
        ticket_type = _required(ticket_type, "Ticket type")
        actor = _required(actor, "Actor")
        if currency not in ('ZAR', 'GBP'):
            raise WorkflowError("Currency must be ZAR or GBP")
        if fixr_event_id is not None:
            fixr_event_id = _required(fixr_event_id, "FIXR event id")
        listing_id, now = uuid4().hex, _now()
        with self._tx():
            self.db.execute(
                "INSERT INTO listings(id,seller_email,event_name,ticket_type,amount_cents,currency,fixr_event_id,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,'pending_review',?,?)",
                (listing_id, seller_email, event_name, ticket_type, amount_cents, currency, fixr_event_id, now, now),
            )
            self._event(listing_id, None, "listing_created", actor)
        return listing_id

    def approve_listing(self, listing_id: str, policy_evidence: str, actor: str) -> None:
        """Evidence must establish event transfer availability and organiser permission."""
        policy_evidence, actor = _required(policy_evidence, "Policy evidence"), _required(actor, "Actor")
        with self._tx():
            row = self._row("listings", listing_id)
            if row["status"] != "pending_review":
                raise WorkflowError("Only pending listings can be approved")
            self.db.execute("UPDATE listings SET status='awaiting_transfer',policy_evidence=?,updated_at=? WHERE id=?",
                            (policy_evidence, _now(), listing_id))
            self._event(listing_id, None, "listing_approved", actor, row["seller_email"], policy_evidence)

    def confirm_fixr_receipt(self, listing_id: str, custody_evidence: str, actor: str) -> None:
        """Operator must inspect the receiving FIXR account; email is only a lead."""
        custody_evidence, actor = _required(custody_evidence, "Custody evidence"), _required(actor, "Actor")
        if re.search(r"https?://", custody_evidence, re.IGNORECASE):
            raise WorkflowError("Do not store transfer links in evidence")
        with self._tx():
            row = self._row("listings", listing_id)
            if row["status"] != "awaiting_transfer":
                raise WorkflowError("Listing is not awaiting a FIXR transfer")
            self.db.execute("UPDATE listings SET status='listed',custody_evidence=?,updated_at=? WHERE id=?",
                            (custody_evidence, _now(), listing_id))
            self._event(listing_id, None, "fixr_received", actor, row["seller_email"], custody_evidence)

    def record_transfer_lead(self, listing_id: str, message_id: str, actor: str) -> bool:
        """Log an authenticated FIXR or seller email for operator review; once per message."""
        evidence = f"email lead {_required(message_id, 'Message ID')}"
        with self._tx():
            row = self._row("listings", listing_id)
            if row["status"] != "awaiting_transfer":
                raise WorkflowError("Listing is not awaiting a FIXR transfer")
            if self.db.execute("SELECT 1 FROM audit_events WHERE listing_id=? AND event_type='fixr_email_lead' AND evidence=?",
                               (listing_id, evidence)).fetchone():
                return False
            self._event(listing_id, None, "fixr_email_lead", _required(actor, "Actor"), evidence=evidence)
        return True

    def reserve(self, listing_id: str, buyer_email: str, hold_expires_at: str, actor: str) -> str:
        buyer_email, actor = _email(buyer_email), _required(actor, "Actor")
        try:
            deadline = datetime.fromisoformat(hold_expires_at)
            if deadline.tzinfo is None or deadline <= datetime.now(timezone.utc):
                raise ValueError()
            deadline = deadline.astimezone(timezone.utc)
        except ValueError as exc:
            raise WorkflowError("Hold deadline must be a future timezone-aware ISO timestamp") from exc
        with self._tx():
            listing = self._row("listings", listing_id)
            if listing["status"] != "listed" or listing["seller_email"] == buyer_email:
                raise WorkflowError("Listing unavailable or buyer is the seller")
            order_id, now = uuid4().hex, _now()
            self.db.execute("UPDATE listings SET status='reserved',updated_at=? WHERE id=?", (now, listing_id))
            self.db.execute(
                "INSERT INTO orders(id,listing_id,buyer_email,amount_cents,currency,state,hold_expires_at,created_at,updated_at) VALUES(?,?,?,?,?,'payment_pending',?,?,?)",
                (order_id, listing_id, buyer_email, listing["amount_cents"], listing["currency"], deadline.isoformat(), now, now),
            )
            self._event(listing_id, order_id, "order_reserved", actor)
        return order_id

    def transition(self, order_id: str, action: str, actor: str, evidence: str) -> str:
        """Move only after an operator checks the named external evidence."""
        actor, evidence = _required(actor, "Actor"), _required(evidence, "Evidence")
        edges = {
            "confirm_payment": ("payment_pending", "funds_held", "payment_reference", "seller_email"),
            "relay_sent": ("funds_held", "transfer_pending", None, "buyer_email"),
            "buyer_claimed": ("transfer_pending", "claim_reported", None, "seller_email"),
            "verify_transfer": ("claim_reported", "transfer_verified", "transfer_evidence", "seller_email"),
            "request_payout": ("transfer_verified", "payout_requested", None, "seller_email"),
            "confirm_payout": ("payout_requested", "completed", "payout_reference", "buyer_email"),
            "request_refund": (None, "refund_requested", None, "buyer_email"),
            "confirm_refund": ("refund_requested", "refunded", "refund_reference", "buyer_email"),
            "cancel_unpaid": ("payment_pending", "cancelled", None, "buyer_email"),
        }
        if action not in edges:
            raise WorkflowError("Unknown action")
        if re.search(r"https?://", evidence, re.IGNORECASE):
            raise WorkflowError("Do not store transfer links in evidence")
        previous, next_state, reference_column, recipient_column = edges[action]
        with self._tx():
            order = self._row("orders", order_id)
            listing = self._row("listings", order["listing_id"])
            if action == "request_refund":
                if order["state"] not in ("funds_held", "transfer_pending", "claim_reported"):
                    raise WorkflowError("Refund cannot be requested from this state")
            elif order["state"] != previous:
                raise WorkflowError(f"{action} requires {previous}; current state is {order['state']}")
            if action == "confirm_payment" and datetime.fromisoformat(order["hold_expires_at"]) <= datetime.now(timezone.utc):
                raise WorkflowError("Hold deadline expired")
            if action == "cancel_unpaid" and datetime.fromisoformat(order["hold_expires_at"]) > datetime.now(timezone.utc):
                raise WorkflowError("Reservation has not expired")
            # This deadline is the ticket-transfer deadline, not a claim that a
            # payment provider's financial hold lasts until this instant.
            # A verified transfer still needs operator-reviewed payout evidence.
            if reference_column:
                self.db.execute(f"UPDATE orders SET state=?,{reference_column}=?,updated_at=? WHERE id=?",
                                (next_state, evidence, _now(), order_id))
            else:
                self.db.execute("UPDATE orders SET state=?,updated_at=? WHERE id=?", (next_state, _now(), order_id))
            if next_state in ("completed", "refunded", "cancelled"):
                self.db.execute("UPDATE listings SET status=?,updated_at=? WHERE id=?",
                                ("sold" if next_state == "completed" else "withdrawn", _now(), listing["id"]))
            recipient = listing["seller_email"] if recipient_column == "seller_email" else order["buyer_email"]
            self._event(listing["id"], order_id, next_state, actor, recipient, evidence)
        return next_state

    def bind_stripe_payment_intent(self, order_id: str, intent_id: str) -> None:
        intent_id = _required(intent_id, "Stripe PaymentIntent id")
        if not intent_id.startswith("pi_"):
            raise WorkflowError("Invalid Stripe PaymentIntent id")
        with self._tx():
            order = self._row("orders", order_id)
            if order["state"] != "payment_pending":
                raise WorkflowError("Order is not awaiting payment")
            if order["stripe_payment_intent_id"] and order["stripe_payment_intent_id"] != intent_id:
                raise WorkflowError("Order is already bound to another PaymentIntent")
            self.db.execute("UPDATE orders SET stripe_payment_intent_id=?,updated_at=? WHERE id=?",
                            (intent_id, _now(), order_id))

    def confirm_stripe_payment(self, *, event_id: str, order_id: str, listing_id: str,
                               intent_id: str, amount_received: int, currency: str,
                               livemode: bool, expected_livemode: bool) -> str:
        """Only call after verifying Stripe's webhook signature against raw bytes."""
        if livemode != expected_livemode:
            raise WorkflowError("Stripe live/test mode mismatch")
        with self._tx():
            if self.db.execute("SELECT 1 FROM stripe_events WHERE event_id=?", (event_id,)).fetchone():
                return "duplicate"
            order = self._row("orders", order_id)
            if (order["state"] != "payment_pending" or order["listing_id"] != listing_id
                    or order["stripe_payment_intent_id"] != intent_id
                    or order["amount_cents"] != amount_received
                    or order["currency"].lower() != currency.lower()):
                raise WorkflowError("Stripe payment does not match reserved order")
            if datetime.fromisoformat(order["hold_expires_at"]) <= datetime.now(timezone.utc):
                raise WorkflowError("Payment arrived after reservation deadline; manual refund review required")
            listing = self._row("listings", listing_id)
            self.db.execute("UPDATE orders SET state='funds_held',payment_reference=?,updated_at=? WHERE id=?",
                            (intent_id, _now(), order_id))
            self.db.execute("INSERT INTO stripe_events(event_id,order_id,created_at) VALUES(?,?,?)",
                            (event_id, order_id, _now()))
            self._event(listing_id, order_id, "funds_held", "stripe_webhook", order["buyer_email"], intent_id)
        return "funds_held"

    def expire_due(self, actor: str) -> list[str]:
        """Queue refund review, never mark money refunded before PSP confirmation."""
        actor = _required(actor, "Actor")
        due = self.db.execute(
            "SELECT id,state FROM orders WHERE hold_expires_at <= ? AND state IN ('payment_pending','funds_held','transfer_pending','claim_reported')",
            (_now(),),
        ).fetchall()
        changed = []
        for row in due:
            try:
                self.transition(row["id"], "cancel_unpaid" if row["state"] == "payment_pending" else "request_refund", actor, "Hold deadline elapsed")
                changed.append(row["id"])
            except WorkflowError:
                pass
        return changed

    def outbox(self) -> list[dict]:
        return [dict(row) for row in self.db.execute(
            "SELECT id,recipient,subject,body,created_at,sent_at,attempts,last_error FROM notification_outbox ORDER BY id"
        )]

    def pending_notifications(self) -> list[dict]:
        return [dict(row) for row in self.db.execute(
            "SELECT id,recipient,subject,body,event_id FROM notification_outbox WHERE sent_at IS NULL ORDER BY id"
        )]

    def record_delivery(self, notification_id: int, error: str | None = None) -> None:
        with self._tx():
            self.db.execute(
                "UPDATE notification_outbox SET attempts=attempts+1,last_error=?,sent_at=CASE WHEN ? IS NULL THEN ? ELSE sent_at END WHERE id=? AND sent_at IS NULL",
                (error, error, _now(), notification_id),
            )

    def order(self, order_id: str) -> dict:
        return dict(self._row("orders", order_id))
