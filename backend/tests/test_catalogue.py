import copy
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from backend.aftermarket.catalogue import Catalogue


def event(identifier, title="Saturday Sessions", date="2026-10-31", venue="Bridge Oxford"):
    return {"id": identifier, "title": title, "venue": venue, "date": date,
            "startAt": f"{date}T22:00:00Z", "endAt": "2026-11-01T03:00:00Z",
            "address": "6 Hythe Bridge Street, Oxford", "url": f"https://fixr.co/event/demo-tickets-{identifier}",
            "imageUrl": "https://fixr-cdn.fixr.co/images/event/demo.jpeg", "excerpt": "A demo night.",
            "availabilityAtCheck": "sold_out"}


def feed(events):
    return {"source": "fixr", "city": "oxford", "rightsConfirmed": True,
            "suppliedAt": "2026-10-24T00:00:00Z", "complete": True, "events": events}


class CatalogueTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.catalogue = Catalogue(Path(self.temp.name) / "catalogue.db")

    def tearDown(self):
        self.catalogue.close()
        self.temp.cleanup()

    def test_upsert_new_events_and_build_venue_series_history(self):
        first = feed([event("123")])
        first["events"][0]["description"] = "The organiser's complete licensed description."
        self.assertEqual(self.catalogue.ingest(first), {"imported": 1, "new": 1})
        updated = copy.deepcopy(first)
        updated["events"][0]["availabilityAtCheck"] = "on_sale"
        second = event("456")
        second["address"] = "Another entrance, Oxford"
        updated["events"].append(second)
        self.assertEqual(self.catalogue.ingest(updated), {"imported": 2, "new": 1})
        self.assertEqual(len(self.catalogue.venue_history()), 1)
        self.assertEqual(self.catalogue.recurring_series()[0]["occurrences"], 2)
        result = self.catalogue.upcoming(datetime(2026, 10, 31, 23, tzinfo=timezone.utc))
        self.assertEqual(len(result["events"]), 2)
        self.assertEqual(result["events"][0]["availabilityAtCheck"], "on_sale")
        self.assertEqual(result["events"][0]["description"], "The organiser's complete licensed description.")
        self.assertEqual({item["address"] for item in result["events"]}, {"6 Hythe Bridge Street, Oxford", "Another entrance, Oxford"})
        removed = feed([event("456")])
        removed["complete"] = True
        self.catalogue.ingest(removed)
        self.assertEqual([item["id"] for item in self.catalogue.upcoming(datetime(2026, 10, 31, 23, tzinfo=timezone.utc))["events"]], ["456"])
        self.assertEqual(self.catalogue.recurring_series()[0]["occurrences"], 2)
        self.assertEqual(len(self.catalogue.upcoming(datetime(2026, 11, 1, 2, tzinfo=timezone.utc))["events"]), 1)
        self.assertEqual(len(self.catalogue.upcoming(datetime(2026, 11, 1, 3, tzinfo=timezone.utc))["events"]), 0)

    def test_invalid_or_unauthorised_feed_keeps_previous_data(self):
        self.catalogue.ingest(feed([event("123")]))
        invalid = feed([event("456"), event("456")])
        with self.assertRaises(ValueError):
            self.catalogue.ingest(invalid)
        invalid = feed([event("456")])
        invalid["rightsConfirmed"] = False
        with self.assertRaises(ValueError):
            self.catalogue.ingest(invalid)
        stale = feed([event("456")])
        stale["suppliedAt"] = "2026-10-23T00:00:00Z"
        with self.assertRaises(ValueError):
            self.catalogue.ingest(stale)
        self.assertEqual(len(self.catalogue.upcoming(datetime(2026, 10, 24, tzinfo=timezone.utc))["events"]), 1)


if __name__ == "__main__":
    unittest.main()


class CapeTownCatalogueTests(unittest.TestCase):
    def test_cities_are_isolated_and_keep_rank_and_price(self):
        with tempfile.TemporaryDirectory() as folder:
            catalogue = Catalogue(Path(folder) / "c.db")
            try:
                cape = event("777", title="Sunset Sessions", venue="Shimmy Beach Club")
                cape.update(startAt="2026-10-31T16:00:00Z", endAt="2026-10-31T22:00:00Z", fixrRank=2, lastTicketPrice=350,
                            url="https://fixr.co/event/sunset-sessions-tickets-777")
                feed = {"source": "fixr", "city": "cape_town", "rightsConfirmed": True, "complete": True,
                        "suppliedAt": "2026-10-24T00:00:00Z", "events": [cape]}
                catalogue.ingest(feed)
                now = datetime(2026, 10, 24, tzinfo=timezone.utc)
                result = catalogue.upcoming(now, city="cape_town")
                self.assertEqual([(e["id"], e["fixrRank"], e["lastTicketPrice"]) for e in result["events"]], [("777", 2, 350)])
                self.assertEqual(catalogue.upcoming(now, city="oxford")["events"], [])
                with self.assertRaises(ValueError):
                    catalogue.ingest({**feed, "city": "london"})
            finally:
                catalogue.close()
