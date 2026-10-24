"""Local Stripe webhook receiver for Stripe CLI forwarding and test mode."""

import os
from http.server import BaseHTTPRequestHandler, HTTPServer

from .stripe_checkout import accept_webhook
from .workflow import Workflow, WorkflowError


def serve() -> None:
    secret = os.environ["STRIPE_WEBHOOK_SECRET"]
    db_path = os.environ["AFTERMARKET_DB_PATH"]
    expected_live = os.environ.get("STRIPE_LIVEMODE", "false").lower() == "true"
    port = int(os.environ.get("AFTERMARKET_WEBHOOK_PORT", "4242"))

    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):
            if self.path != "/stripe/webhook":
                self.send_error(404); return
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                self.send_error(400); return
            if not 0 < length <= 1024 * 1024:
                self.send_error(413); return
            raw = self.rfile.read(length)
            flow = Workflow(db_path)
            try:
                result = accept_webhook(flow, raw, self.headers.get("Stripe-Signature", ""),
                                        secret, expected_livemode=expected_live)
            except WorkflowError:
                self.send_error(400, "Invalid or unmatched Stripe event"); return
            finally:
                flow.close()
            body = result.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    HTTPServer(("127.0.0.1", port), Handler).serve_forever()


if __name__ == "__main__":
    serve()
