"""Explicit SMTP outbox worker. Configure secrets as environment variables."""

import os
import smtplib
import ssl
from email.message import EmailMessage

from .workflow import Workflow


def send_pending(workflow: Workflow) -> tuple[int, int]:
    host = os.environ["AFTERMARKET_SMTP_HOST"]
    port = int(os.environ.get("AFTERMARKET_SMTP_PORT", "587"))
    user = os.environ["AFTERMARKET_SMTP_USER"]
    password = os.environ["AFTERMARKET_SMTP_PASSWORD"]
    sender = os.environ["AFTERMARKET_FROM_EMAIL"]
    sent = failed = 0
    for item in workflow.pending_notifications():
        message = EmailMessage()
        message["From"] = sender
        message["To"] = item["recipient"]
        message["Subject"] = item["subject"]
        message["Message-ID"] = f"<aftermarket-{item['event_id']}-{item['id']}@{sender.split('@', 1)[1]}>"
        message.set_content(item["body"])
        try:
            with smtplib.SMTP(host, port, timeout=20) as server:
                server.starttls(context=ssl.create_default_context())
                server.login(user, password)
                server.send_message(message)
            workflow.record_delivery(item["id"])
            sent += 1
        except (OSError, smtplib.SMTPException) as exc:
            workflow.record_delivery(item["id"], f"{type(exc).__name__}: delivery failed")
            failed += 1
    return sent, failed
