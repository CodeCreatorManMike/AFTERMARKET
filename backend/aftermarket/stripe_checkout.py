"""Stripe PaymentIntent creation and signed webhook verification.

This module is an integration seam. It is not exposed to the prototype app until
real member auth, a protected API and Stripe account credentials are configured.
"""

import hashlib
import hmac
import json
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .workflow import Workflow, WorkflowError


def _stripe_request(method: str, path: str, key: str, form: dict | None = None) -> dict:
    body = urlencode(form).encode() if form is not None else None
    request = Request(f"https://api.stripe.com/v1/{path}", data=body, method=method,
                      headers={"Authorization": f"Bearer {key}",
                               "Content-Type": "application/x-www-form-urlencoded"})
    if method == "POST":
        request.add_header("Idempotency-Key", f"aftermarket-{form['metadata[order_id]']}-intent-v1")
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def create_payment_intent(workflow: Workflow, order_id: str, secret_key: str,
                          request=_stripe_request) -> dict:
    """Amount and metadata are taken from the reserved order, never client input."""
    order = workflow.order(order_id)
    if order["state"] != "payment_pending":
        raise WorkflowError("Order is not awaiting payment")
    if order["stripe_payment_intent_id"]:
        intent = request("GET", f"payment_intents/{order['stripe_payment_intent_id']}", secret_key)
    else:
        intent = request("POST", "payment_intents", secret_key, {
            "amount": order["amount_cents"], "currency": order["currency"].lower(),
            "automatic_payment_methods[enabled]": "true",
            "metadata[order_id]": order_id,
            "metadata[listing_id]": order["listing_id"],
        })
    if (intent.get("amount") != order["amount_cents"] or
            intent.get("currency", "").lower() != order["currency"].lower() or
            intent.get("metadata", {}).get("order_id") != order_id or
            intent.get("metadata", {}).get("listing_id") != order["listing_id"]):
        raise WorkflowError("Stripe PaymentIntent mismatch")
    if not order["stripe_payment_intent_id"]:
        workflow.bind_stripe_payment_intent(order_id, intent["id"])
    return {"payment_intent_id": intent["id"], "client_secret": intent["client_secret"]}


def verify_signature(payload: bytes, header: str, webhook_secret: str,
                     now: int | None = None, tolerance: int = 300) -> dict:
    """Stripe v1 signature over timestamp.raw-body with five-minute replay limit."""
    parts = [part.strip().split("=", 1) for part in header.split(",") if "=" in part]
    values: dict[str, list[str]] = {}
    for key, value in parts:
        values.setdefault(key, []).append(value)
    try:
        timestamp = int(values["t"][0])
        signatures = values["v1"]
    except (KeyError, ValueError, IndexError) as exc:
        raise WorkflowError("Invalid Stripe signature header") from exc
    current = now if now is not None else int(time.time())
    if abs(current - timestamp) > tolerance:
        raise WorkflowError("Stripe webhook timestamp outside replay window")
    expected = hmac.new(webhook_secret.encode(), str(timestamp).encode() + b"." + payload,
                        hashlib.sha256).hexdigest()
    if not any(hmac.compare_digest(expected, signature) for signature in signatures):
        raise WorkflowError("Stripe webhook signature failed")
    try:
        return json.loads(payload)
    except (ValueError, UnicodeDecodeError) as exc:
        raise WorkflowError("Invalid Stripe webhook JSON") from exc


def accept_webhook(workflow: Workflow, payload: bytes, header: str,
                   webhook_secret: str, expected_livemode: bool = False) -> str:
    event = verify_signature(payload, header, webhook_secret)
    if event.get("type") != "payment_intent.succeeded":
        return "ignored"
    intent = event.get("data", {}).get("object", {})
    if intent.get("object") != "payment_intent" or intent.get("status") != "succeeded":
        raise WorkflowError("Stripe success event has no succeeded PaymentIntent")
    metadata = intent.get("metadata") or {}
    if not isinstance(event.get("id"), str) or not isinstance(intent.get("id"), str):
        raise WorkflowError("Stripe success event is missing identifiers")
    return workflow.confirm_stripe_payment(
        event_id=event["id"], order_id=metadata.get("order_id", ""),
        listing_id=metadata.get("listing_id", ""), intent_id=intent["id"],
        amount_received=intent.get("amount_received"), currency=intent.get("currency", ""),
        livemode=event.get("livemode"), expected_livemode=expected_livemode,
    )
