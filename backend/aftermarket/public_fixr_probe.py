"""Local proof-of-value collector for public FIXR city and event pages.

Uses a normal browser session and published page markup. Keep this disabled in
production until FIXR grants data and media rights. No account or cookies are
stored, and a challenge is never solved or bypassed automatically.
"""

from __future__ import annotations

import json
import html
import re
from datetime import datetime, timezone
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

from .catalogue import CITY_TIMEZONES


CITY_PAGES = {
    "oxford": "https://fixr.co/cities/oxford",
    "cape_town": "https://fixr.co/cities/cape-town",
}


def _card(link, rank: int) -> dict:
    parts = [line.strip() for line in link.inner_text().splitlines() if line.strip()]
    url = link.get_attribute("href") or ""
    image = link.locator("img").first.get_attribute("src") or ""
    title = link.locator("h3").first.inner_text().strip()
    if len(parts) < 4 or not re.search(r"-tickets-\d+$", url.split("?", 1)[0]):
        raise ValueError("FIXR card markup changed")
    return {
        "url": "https://fixr.co" + url.split("?", 1)[0],
        "id": url.split("?", 1)[0].rsplit("-", 1)[-1],
        "title": title,
        "venue": parts[-2],
        "imageUrl": image,
        "availabilityAtCheck": "sold_out" if "sold out" in parts[-1].casefold() else "on_sale",
        "fixrRank": rank,
    }


def _details(page, card: dict, city: str) -> dict:
    page.goto(card["url"], wait_until="domcontentloaded", timeout=30_000)
    page.locator('script[type="application/ld+json"]').filter(has_text='"@type":"Event"').first.wait_for(state="attached", timeout=15_000)
    payloads = [json.loads(text) for text in page.locator('script[type="application/ld+json"]').all_text_contents()]
    event = next((item for item in payloads if item.get("@type") == "Event"), None)
    if not event or html.unescape(event.get("name", "")) != card["title"]:
        raise ValueError(f"structured event data missing for {card['id']}")
    starts = datetime.fromisoformat(event["startDate"].replace("Z", "+00:00"))
    ends = datetime.fromisoformat(event["endDate"].replace("Z", "+00:00")) if event.get("endDate") else None
    if starts.tzinfo is None or (ends and ends.tzinfo is None):
        raise ValueError("FIXR event timestamp has no timezone")
    location = event.get("location") or {}
    address = location.get("address") or {}
    address_text = ", ".join(html.unescape(str(address[key]).strip()) for key in
                             ("streetAddress", "addressLocality", "postalCode", "addressCountry") if address.get(key))
    description = re.sub(r"\s+", " ", html.unescape(event.get("description") or "")).strip()
    images = event.get("image") or []
    image = images[0] if isinstance(images, list) and images else images if isinstance(images, str) else None
    if image and urlparse(image).hostname == "fixr-cdn.fixr.co":
        card["imageUrl"] = image
    availability = (event.get("offers") or {}).get("availability")
    if availability == "https://schema.org/SoldOut":
        card["availabilityAtCheck"] = "sold_out"
    elif availability == "https://schema.org/InStock":
        card["availabilityAtCheck"] = "on_sale"
    return {**card, "title": html.unescape(event["name"]), "venue": html.unescape(location.get("name") or card["venue"]),
            "date": starts.astimezone(ZoneInfo(CITY_TIMEZONES[city])).date().isoformat(),
            "startAt": starts.isoformat(), "endAt": ends.isoformat() if ends else None,
            "address": address_text or None, "description": description or None,
            "excerpt": (description[:197] + "…") if len(description) > 200 else (description or card["title"]),
            "lastTicketPrice": None}


def collect(city: str = "oxford", max_pages: int = 200) -> dict:
    if city not in CITY_PAGES:
        raise ValueError("unsupported city")
    from playwright.sync_api import sync_playwright

    cards: list[dict] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=False)
        try:
            listing = browser.new_page(viewport={"width": 390, "height": 844})
            listing.goto(CITY_PAGES[city], wait_until="domcontentloaded", timeout=30_000)
            for attempt in range(3):
                try:
                    listing.locator('a[href*="/event/"]').first.wait_for(timeout=15_000)
                    listing.get_by_role("button", name="All events", exact=True).wait_for(timeout=15_000)
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    listing.reload(wait_until="domcontentloaded", timeout=30_000)
            for page_number in range(1, max_pages + 1):
                links = listing.locator('a[href*="/event/"]')
                current = [_card(links.nth(i), len(cards) + i + 1) for i in range(links.count())]
                if not current:
                    raise ValueError("empty FIXR listing page")
                seen = {card["id"] for card in cards}
                cards.extend(card for card in current if card["id"] not in seen)
                print(f"{city} page {page_number}: {len(cards)} cards", flush=True)
                next_button = listing.get_by_role("button", name="Next", exact=True).last
                if next_button.is_disabled():
                    break
                first_href = links.first.get_attribute("href")
                next_button.click()
                listing.wait_for_function(
                    "previous => !!document.querySelector('a[href*=\"/event/\"]') && document.querySelector('a[href*=\"/event/\"]')?.getAttribute('href') !== previous",
                    arg=first_href, timeout=30_000)
                links.first.wait_for(timeout=30_000)
            else:
                raise ValueError("page limit reached before FIXR pagination ended")
            if len({card["id"] for card in cards}) != len(cards):
                raise ValueError("duplicate event IDs across FIXR pages")
            detail = browser.new_page()
            events = []
            for index, card in enumerate(cards, 1):
                events.append(_details(detail, card, city))
                if index % 12 == 0 or index == len(cards):
                    print(f"{city} details: {index}/{len(cards)}", flush=True)
        finally:
            browser.close()
    return {"source": "fixr", "city": city, "suppliedAt": datetime.now(timezone.utc).isoformat(),
            "complete": True, "prototype": True, "rightsConfirmed": False, "events": events}


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--city", choices=CITY_PAGES, default="oxford")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    feed = collect(args.city)
    with open(args.output, "w", encoding="utf-8") as output:
        json.dump(feed, output, ensure_ascii=False, indent=2)
    print(f"Collected {len(feed['events'])} {args.city} events to {args.output}")
