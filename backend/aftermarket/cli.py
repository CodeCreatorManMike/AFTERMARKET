"""Local operator CLI for the FIXR workflow proof of concept.

Run from repository root: python3 -m backend.aftermarket.cli --db /path/to/file.db ...
"""

import argparse
import json

from .workflow import Workflow, WorkflowError


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", required=True, help="Private SQLite database path")
    commands = parser.add_subparsers(dest="command", required=True)
    create = commands.add_parser("create-listing")
    create.add_argument("--seller", required=True)
    create.add_argument("--event", required=True)
    create.add_argument("--ticket-type", required=True)
    create.add_argument("--cents", type=int, required=True)
    create.add_argument("--currency", choices=["GBP", "ZAR"], default="ZAR")
    create.add_argument("--fixr-event-id")
    create.add_argument("--actor", required=True)
    approve = commands.add_parser("approve-listing")
    approve.add_argument("listing_id")
    approve.add_argument("--policy-evidence", required=True)
    approve.add_argument("--actor", required=True)
    receipt = commands.add_parser("confirm-fixr-receipt")
    receipt.add_argument("listing_id")
    receipt.add_argument("--custody-evidence", required=True, help="Operator review reference, not a link")
    receipt.add_argument("--actor", required=True)
    reserve = commands.add_parser("reserve")
    reserve.add_argument("listing_id")
    reserve.add_argument("--buyer", required=True)
    reserve.add_argument("--deadline", required=True, help="Timezone-aware ISO timestamp")
    reserve.add_argument("--actor", required=True)
    move = commands.add_parser("move")
    move.add_argument("order_id")
    move.add_argument("action", choices=["confirm_payment", "relay_sent", "buyer_claimed",
                                         "verify_transfer", "request_payout", "confirm_payout",
                                         "request_refund", "confirm_refund", "cancel_unpaid"])
    move.add_argument("--actor", required=True)
    move.add_argument("--evidence", required=True, help="External reference or review note; no transfer links")
    expire = commands.add_parser("expire-due")
    expire.add_argument("--actor", required=True)
    show = commands.add_parser("show-order")
    show.add_argument("order_id")
    commands.add_parser("outbox")
    commands.add_parser("send-outbox", help="Send queued notifications via configured SMTP")
    args = parser.parse_args()
    workflow = Workflow(args.db)
    try:
        if args.command == "create-listing":
            result = {"listing_id": workflow.create_listing(args.seller, args.event, args.ticket_type, args.cents, args.actor, args.currency, args.fixr_event_id)}
        elif args.command == "approve-listing":
            workflow.approve_listing(args.listing_id, args.policy_evidence, args.actor)
            result = {"status": "awaiting_transfer"}
        elif args.command == "confirm-fixr-receipt":
            workflow.confirm_fixr_receipt(args.listing_id, args.custody_evidence, args.actor)
            result = {"status": "listed"}
        elif args.command == "reserve":
            result = {"order_id": workflow.reserve(args.listing_id, args.buyer, args.deadline, args.actor)}
        elif args.command == "move":
            result = {"state": workflow.transition(args.order_id, args.action, args.actor, args.evidence)}
        elif args.command == "expire-due":
            result = {"refund_review_orders": workflow.expire_due(args.actor)}
        elif args.command == "show-order":
            result = workflow.order(args.order_id)
        elif args.command == "send-outbox":
            from .mailer import send_pending
            sent, failed = send_pending(workflow)
            result = {"sent": sent, "failed": failed}
        else:
            result = workflow.outbox()
        print(json.dumps(result, indent=2))
    except WorkflowError as exc:
        parser.exit(2, f"Workflow error: {exc}\n")
    finally:
        workflow.close()


if __name__ == "__main__":
    main()
