"""Licensed event-feed ingestion and public catalogue read model.

The importer accepts data supplied by a provider or organiser under a separate
agreement. It deliberately does not request, crawl, or parse FIXR web pages.
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo


CITY_TIMEZONES = {"oxford": "Europe/London", "cape_town": "Africa/Johannesburg"}


SCHEMA = """
CREATE TABLE IF NOT EXISTS catalogue_venues (
  id INTEGER PRIMARY KEY, city TEXT NOT NULL, name TEXT NOT NULL,
  normalized_name TEXT NOT NULL, address TEXT, first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL, UNIQUE(city, normalized_name)
);
CREATE TABLE IF NOT EXISTS catalogue_series (
  id INTEGER PRIMARY KEY, city TEXT NOT NULL, venue_id INTEGER NOT NULL REFERENCES catalogue_venues(id),
  normalized_title TEXT NOT NULL, title TEXT NOT NULL,
  first_seen_at TEXT NOT NULL, last_seen_at TEXT NOT NULL,
  UNIQUE(city, venue_id, normalized_title)
);
CREATE TABLE IF NOT EXISTS catalogue_events (
  source TEXT NOT NULL, source_id TEXT NOT NULL, city TEXT NOT NULL,
  title TEXT NOT NULL, venue_id INTEGER NOT NULL REFERENCES catalogue_venues(id),
  series_id INTEGER NOT NULL REFERENCES catalogue_series(id),
  date TEXT NOT NULL, start_at TEXT, end_at TEXT, address TEXT, url TEXT NOT NULL,
  image_url TEXT NOT NULL, excerpt TEXT NOT NULL, description TEXT, availability TEXT NOT NULL,
  first_seen_at TEXT NOT NULL, last_seen_at TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(source, source_id)
);
CREATE INDEX IF NOT EXISTS catalogue_events_city_date ON catalogue_events(city, date);
CREATE TABLE IF NOT EXISTS catalogue_imports (
  id INTEGER PRIMARY KEY, source TEXT NOT NULL, imported_at TEXT NOT NULL,
  supplied_at TEXT NOT NULL, event_count INTEGER NOT NULL
);
"""


def _normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


def _required_text(value: object, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label} must be non-empty text")
    return value.strip()


def _iso(value: object, label: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(_required_text(value, label).replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"{label} must be an ISO timestamp") from exc
    if parsed.tzinfo is None:
        raise ValueError(f"{label} needs a timezone")
    return parsed


def _url(value: object, label: str, hosts: set[str]) -> str:
    result = _required_text(value, label)
    parsed = urlparse(result)
    if parsed.scheme != "https" or parsed.hostname not in hosts or parsed.username or parsed.password:
        raise ValueError(f"{label} must be an approved HTTPS URL")
    return result


def validate_event(raw: object, city: str = "oxford") -> dict:
    if not isinstance(raw, dict):
        raise ValueError("event must be an object")
    event = {key: _required_text(raw.get(key), key) for key in ("id", "title", "venue", "date", "url", "imageUrl", "excerpt")}
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", event["date"]):
        raise ValueError("date must be YYYY-MM-DD")
    try:
        datetime.strptime(event["date"], "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("date is invalid") from exc
    if not re.fullmatch(r"[0-9]{1,20}", event["id"]):
        raise ValueError("FIXR event id is invalid")
    if not event["url"].startswith("https://fixr.co/event/"):
        raise ValueError("event URL must be a direct FIXR event")
    event["url"] = _url(event["url"], "url", {"fixr.co"})
    event["imageUrl"] = _url(event["imageUrl"], "imageUrl", {"fixr-cdn.fixr.co"})
    if event["id"] not in event["url"].rsplit("/", 1)[-1]:
        raise ValueError("FIXR URL and id do not match")
    if len(event["excerpt"]) > 500:
        raise ValueError("excerpt is too long")
    event["description"] = raw.get("description") or None
    if event["description"] is not None:
        event["description"] = _required_text(event["description"], "description")
        if len(event["description"]) > 20000:
            raise ValueError("description is too long")
    event["address"] = raw.get("address") or None
    if event["address"] is not None:
        event["address"] = _required_text(event["address"], "address")
    event["startAt"] = raw.get("startAt") or None
    event["endAt"] = raw.get("endAt") or None
    if event["startAt"]:
        start = _iso(event["startAt"], "startAt")
        if start.astimezone(ZoneInfo(CITY_TIMEZONES[city])).date().isoformat() != event["date"]:
            raise ValueError("startAt does not match the local event date")
        if event["endAt"] and _iso(event["endAt"], "endAt") <= start:
            raise ValueError("endAt must follow startAt")
    elif event["endAt"]:
        raise ValueError("endAt requires startAt")
    event["availabilityAtCheck"] = raw.get("availabilityAtCheck")
    if event["availabilityAtCheck"] not in ("on_sale", "sold_out"):
        raise ValueError("invalid availability")
    # Optional popularity and pricing signals supplied by the feed.
    event["fixrRank"] = raw.get("fixrRank")
    if event["fixrRank"] is not None and (not isinstance(event["fixrRank"], int) or isinstance(event["fixrRank"], bool) or not 1 <= event["fixrRank"] <= 100000):
        raise ValueError("fixrRank must be a positive integer")
    event["lastTicketPrice"] = raw.get("lastTicketPrice")
    if event["lastTicketPrice"] is not None and (isinstance(event["lastTicketPrice"], bool) or not isinstance(event["lastTicketPrice"], (int, float)) or not 0 < event["lastTicketPrice"] <= 100000):
        raise ValueError("lastTicketPrice must be a positive amount")
    return event


class Catalogue:
    def __init__(self, database: str | Path):
        if str(database) != ":memory:":
            path = Path(database)
            path.touch(mode=0o600, exist_ok=True)
            os.chmod(path, 0o600)
        self.db = sqlite3.connect(str(database))
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript(SCHEMA)
        columns = {row[1] for row in self.db.execute("PRAGMA table_info(catalogue_events)")}
        if "description" not in columns:
            self.db.execute("ALTER TABLE catalogue_events ADD COLUMN description TEXT")
        if "active" not in columns:
            self.db.execute("ALTER TABLE catalogue_events ADD COLUMN active INTEGER NOT NULL DEFAULT 1")
        if "address" not in columns:
            self.db.execute("ALTER TABLE catalogue_events ADD COLUMN address TEXT")
        if "fixr_rank" not in columns:
            self.db.execute("ALTER TABLE catalogue_events ADD COLUMN fixr_rank INTEGER")
        if "last_ticket_price" not in columns:
            self.db.execute("ALTER TABLE catalogue_events ADD COLUMN last_ticket_price REAL")
        if "city" not in {row[1] for row in self.db.execute("PRAGMA table_info(catalogue_imports)")}:
            self.db.execute("ALTER TABLE catalogue_imports ADD COLUMN city TEXT NOT NULL DEFAULT 'oxford'")

    def close(self):
        self.db.close()

    def ingest(self, feed: dict) -> dict:
        """Atomically upsert an authorised complete provider snapshot by source ID."""
        city = feed.get("city")
        if feed.get("source") != "fixr" or city not in CITY_TIMEZONES or feed.get("rightsConfirmed") is not True:
            raise ValueError("a rights-confirmed FIXR feed for a supported city is required")
        supplied_at = _iso(feed.get("suppliedAt"), "suppliedAt").isoformat()
        if datetime.fromisoformat(supplied_at) > datetime.now(timezone.utc):
            raise ValueError("feed timestamp is in the future")
        latest = self.db.execute("SELECT supplied_at FROM catalogue_imports WHERE city=? ORDER BY id DESC LIMIT 1", (city,)).fetchone()
        if latest and datetime.fromisoformat(supplied_at) < datetime.fromisoformat(latest[0]):
            raise ValueError("feed is older than the current catalogue")
        raw_events = feed.get("events")
        if not isinstance(raw_events, list):
            raise ValueError("events must be an array")
        events = [validate_event(raw, city) for raw in raw_events]
        if len({event["id"] for event in events}) != len(events):
            raise ValueError("duplicate FIXR event id")
        existing = {row[0] for row in self.db.execute("SELECT source_id FROM catalogue_events WHERE source='fixr' AND city=?", (city,))}
        if not existing and feed.get("complete") is not True:
            raise ValueError("first import must be a complete feed")
        if not events and existing and feed.get("complete") is True:
            raise ValueError("refusing to retire the full catalogue from an empty feed")
        now = datetime.now(timezone.utc).isoformat()
        with self.db:
            for event in events:
                venue_key = _normalized(event["venue"])
                series_key = _normalized(event["title"])
                self.db.execute("""INSERT INTO catalogue_venues(city,name,normalized_name,address,first_seen_at,last_seen_at)
                    VALUES(?,?,?,?,?,?) ON CONFLICT(city,normalized_name) DO UPDATE SET
                    name=excluded.name,address=COALESCE(excluded.address,catalogue_venues.address),last_seen_at=excluded.last_seen_at""",
                    (city, event["venue"], venue_key, event["address"], now, now))
                venue_id = self.db.execute("SELECT id FROM catalogue_venues WHERE city=? AND normalized_name=?", (city, venue_key)).fetchone()[0]
                self.db.execute("""INSERT INTO catalogue_series(city,venue_id,normalized_title,title,first_seen_at,last_seen_at)
                    VALUES(?,?,?,?,?,?) ON CONFLICT(city,venue_id,normalized_title) DO UPDATE SET
                    title=excluded.title,last_seen_at=excluded.last_seen_at""",
                    (city, venue_id, series_key, event["title"], now, now))
                series_id = self.db.execute("SELECT id FROM catalogue_series WHERE city=? AND venue_id=? AND normalized_title=?", (city, venue_id, series_key)).fetchone()[0]
                self.db.execute("""INSERT INTO catalogue_events(source,source_id,city,title,venue_id,series_id,date,start_at,end_at,address,url,image_url,excerpt,description,availability,fixr_rank,last_ticket_price,first_seen_at,last_seen_at,active)
                    VALUES('fixr',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1) ON CONFLICT(source,source_id) DO UPDATE SET
                    title=excluded.title,venue_id=excluded.venue_id,series_id=excluded.series_id,date=excluded.date,
                    start_at=excluded.start_at,end_at=excluded.end_at,address=excluded.address,url=excluded.url,image_url=excluded.image_url,
                    excerpt=excluded.excerpt,description=excluded.description,availability=excluded.availability,fixr_rank=excluded.fixr_rank,last_ticket_price=excluded.last_ticket_price,last_seen_at=excluded.last_seen_at,active=1""",
                    (event["id"], city, event["title"], venue_id, series_id, event["date"], event["startAt"], event["endAt"], event["address"],
                     event["url"], event["imageUrl"], event["excerpt"], event["description"], event["availabilityAtCheck"], event["fixrRank"], event["lastTicketPrice"], now, now))
            if feed.get("complete") is True:
                incoming = {event["id"] for event in events}
                for identifier in existing - incoming:
                    self.db.execute("UPDATE catalogue_events SET active=0 WHERE source='fixr' AND city=? AND source_id=?", (city, identifier))
            self.db.execute("INSERT INTO catalogue_imports(source,city,imported_at,supplied_at,event_count) VALUES('fixr',?,?,?,?)", (city, now, supplied_at, len(events)))
        return {"imported": len(events), "new": sum(event["id"] not in existing for event in events)}

    def upcoming(self, now: datetime | None = None, city: str = "oxford") -> dict:
        if city not in CITY_TIMEZONES:
            raise ValueError("unsupported city")
        now = now or datetime.now(timezone.utc)
        if now.tzinfo is None:
            raise ValueError("now needs a timezone")
        local_date = now.astimezone(ZoneInfo(CITY_TIMEZONES[city])).date().isoformat()
        rows = self.db.execute("""SELECT e.*,v.name AS venue FROM catalogue_events e
            JOIN catalogue_venues v ON v.id=e.venue_id WHERE e.city=? AND e.active=1 ORDER BY e.date,e.start_at,e.title""", (city,)).fetchall()
        events = []
        for row in rows:
            if row["end_at"] and _iso(row["end_at"], "endAt") <= now:
                continue
            if not row["end_at"] and row["date"] < local_date:
                continue
            events.append({"id": row["source_id"], "title": row["title"], "venue": row["venue"],
                           "date": row["date"], "startAt": row["start_at"], "endAt": row["end_at"],
                           "address": row["address"], "url": row["url"], "imageUrl": row["image_url"],
                           "excerpt": row["excerpt"], "description": row["description"], "availabilityAtCheck": row["availability"],
                           "fixrRank": row["fixr_rank"], "lastTicketPrice": row["last_ticket_price"]})
        latest = self.db.execute("SELECT supplied_at FROM catalogue_imports WHERE city=? ORDER BY id DESC LIMIT 1", (city,)).fetchone()
        return {"source": "fixr", "city": city, "suppliedAt": latest[0] if latest else None, "events": events}

    def venue_history(self, city: str = "oxford") -> list[dict]:
        return [dict(row) for row in self.db.execute("""SELECT v.name,v.address,COUNT(e.source_id) AS occurrences,
            COUNT(DISTINCT e.series_id) AS series_count FROM catalogue_venues v
            LEFT JOIN catalogue_events e ON e.venue_id=v.id WHERE v.city=? GROUP BY v.id ORDER BY occurrences DESC,v.name""", (city,))]

    def recurring_series(self) -> list[dict]:
        return [dict(row) for row in self.db.execute("""SELECT s.title,v.name AS venue,COUNT(e.source_id) AS occurrences
            FROM catalogue_series s JOIN catalogue_venues v ON v.id=s.venue_id
            JOIN catalogue_events e ON e.series_id=s.id GROUP BY s.id HAVING COUNT(e.source_id)>=2
            ORDER BY occurrences DESC,s.title""")]


def ingest_file(database: str | Path, path: str | Path) -> dict:
    with open(path, encoding="utf-8") as handle:
        feed = json.load(handle)
    catalogue = Catalogue(database)
    try:
        return catalogue.ingest(feed)
    finally:
        catalogue.close()
