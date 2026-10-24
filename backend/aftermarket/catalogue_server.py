"""Public catalogue API with optional daily import of an authorised JSON feed."""

from __future__ import annotations

import json
import os
import threading
import time
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from .catalogue import CITY_TIMEZONES, Catalogue


def fetch_licensed_feed(url: str, token: str) -> dict:
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or not token:
        raise ValueError("A licensed HTTPS feed URL and bearer token are required")
    request = Request(url, headers={"Authorization": f"Bearer {token}", "Accept": "application/json"})
    with urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise ValueError(f"feed returned HTTP {response.status}")
        if int(response.headers.get("Content-Length", "0")) > 5_000_000:
            raise ValueError("feed is too large")
        body = response.read(5_000_001)
    if len(body) > 5_000_000:
        raise ValueError("feed is too large")
    return json.loads(body)


def daily_import(database: str, feed_url: str, token: str, stop: threading.Event):
    """Sync on startup, then after each 06:00 UTC boundary; retry failures hourly."""
    while not stop.is_set():
        try:
            feed = fetch_licensed_feed(feed_url, token)
            catalogue = Catalogue(database)
            try:
                result = catalogue.ingest(feed)
            finally:
                catalogue.close()
            print(f"catalogue import: {result}", flush=True)
            now = datetime.now(timezone.utc)
            next_run = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
            if now.hour < 6:
                next_run -= timedelta(days=1)
            stop.wait(max(60, (next_run - now).total_seconds()))
        except Exception as exc:
            print(f"catalogue import failed: {exc}", flush=True)
            stop.wait(3600)


def serve(database: str, host: str = "127.0.0.1", port: int = 4243):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            city = self.path.removeprefix("/v1/catalogue/")
            if not self.path.startswith("/v1/catalogue/") or city not in CITY_TIMEZONES:
                self.send_error(404)
                return
            catalogue = Catalogue(database)
            try:
                payload = catalogue.upcoming(city=city)
            finally:
                catalogue.close()
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "public, max-age=300")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    stop = threading.Event()
    feed_url, token = os.environ.get("AFTERMARKET_LICENSED_FIXR_FEED_URL"), os.environ.get("AFTERMARKET_LICENSED_FIXR_FEED_TOKEN")
    if feed_url and token:
        threading.Thread(target=daily_import, args=(database, feed_url, token, stop), daemon=True).start()
    try:
        ThreadingHTTPServer((host, port), Handler).serve_forever()
    finally:
        stop.set()


if __name__ == "__main__":
    serve(os.environ.get("AFTERMARKET_DB_PATH", "/private/tmp/aftermarket-catalogue.db"),
          os.environ.get("AFTERMARKET_CATALOGUE_HOST", "127.0.0.1"),
          int(os.environ.get("AFTERMARKET_CATALOGUE_PORT", "4243")))
