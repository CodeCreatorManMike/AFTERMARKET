import type { OxfordFixrEvent } from './oxfordFixrEvents';

export type City = 'oxford' | 'cape_town';
/** A FIXR event in one launch city. Prices are in major currency units. */
export type CatalogueEvent = OxfordFixrEvent & { fixrRank?: number | null; lastTicketPrice?: number | null };

export const CITIES: Record<City, {
  label: string; country: string; timezone: string; currency: 'GBP' | 'ZAR'; symbol: string; locale: string; fixrUrl: string; maxPrice: number;
}> = {
  oxford: { label: 'Oxford', country: 'United Kingdom', timezone: 'Europe/London', currency: 'GBP', symbol: '£', locale: 'en-GB', fixrUrl: 'https://fixr.co/city/oxford', maxPrice: 500 },
  cape_town: { label: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', currency: 'ZAR', symbol: 'R', locale: 'en-ZA', fixrUrl: 'https://fixr.co/city/cape-town', maxPrice: 10000 },
};

export function localDate(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const field = (name: string) => parts.find(part => part.type === name)?.value ?? '';
  return `${field('year')}-${field('month')}-${field('day')}`;
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

/** Events disappear at their published end, or after their local date when no end is known. */
export function upcomingEvents(now: Date, events: CatalogueEvent[], city: City): CatalogueEvent[] {
  const today = localDate(now, CITIES[city].timezone);
  return events.filter(event => event.endAt ? new Date(event.endAt).getTime() > now.getTime() : event.date >= today);
}

const TITLE_DEMAND = /sold\s*out|final\s+\d*\s*tickets|last\s+\d*\s*tickets|selling\s+fast|limited/i;

/**
 * Higher is more popular: sold out on FIXR, scarcity in the organiser's title,
 * FIXR's own listing position when the feed supplies it, and repeat nights at a venue.
 */
export function popularity(event: CatalogueEvent, all: CatalogueEvent[]): number {
  const repeats = all.filter(other => other.venue === event.venue && other.title === event.title).length;
  const rank = event.fixrRank ? Math.max(0, 50 - event.fixrRank) : 0;
  return (event.availabilityAtCheck === 'sold_out' ? 100 : 0) + (TITLE_DEMAND.test(event.title) ? 40 : 0) + rank + Math.min(repeats - 1, 3) * 5;
}

export function byPopularity(events: CatalogueEvent[]): CatalogueEvent[] {
  return events.map((event, index) => ({ event, index, score: popularity(event, events) }))
    .sort((a, b) => b.score - a.score || a.event.date.localeCompare(b.event.date) || a.index - b.index)
    .map(item => item.event);
}

export type DateFilter = 'all' | 'today' | 'tomorrow' | 'weekend' | 'next7';
export const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: 'all', label: 'Any date' }, { key: 'today', label: 'Tonight' }, { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'This weekend' }, { key: 'next7', label: 'Next 7 days' },
];

export function matchesDate(event: CatalogueEvent, filter: DateFilter, now: Date, city: City): boolean {
  if (filter === 'all') return true;
  const today = localDate(now, CITIES[city].timezone);
  if (filter === 'today') return event.date === today;
  if (filter === 'tomorrow') return event.date === addDays(today, 1);
  if (filter === 'next7') return event.date >= today && event.date <= addDays(today, 6);
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const friday = weekday === 0 ? addDays(today, -2) : weekday === 6 ? addDays(today, -1) : addDays(today, 5 - weekday);
  return event.date >= friday && event.date <= addDays(friday, 2) && event.date >= today;
}

export type EventFilters = { query: string; date: DateFilter; soldOutOnly: boolean };

export function filterEvents(events: CatalogueEvent[], filters: EventFilters, now: Date, city: City): CatalogueEvent[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return byPopularity(upcomingEvents(now, events, city).filter(event =>
    matchesDate(event, filters.date, now, city) &&
    (!filters.soldOutOnly || event.availabilityAtCheck === 'sold_out') &&
    (!query || `${event.title} ${event.venue} ${event.address ?? ''}`.toLocaleLowerCase().includes(query))));
}

/** Country-level match: anywhere in the UK browses Oxford, anywhere in South Africa browses Cape Town. */
export function cityForCoordinates(latitude: number, longitude: number): City | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  if (latitude >= 49.8 && latitude <= 60.95 && longitude >= -8.7 && longitude <= 1.9) return 'oxford';
  if (latitude >= -35 && latitude <= -22.1 && longitude >= 16.4 && longitude <= 33) return 'cape_town';
  return null;
}

export function cityForCountry(isoCountryCode: string): City | null {
  const code = isoCountryCode.trim().toUpperCase();
  return code === 'GB' ? 'oxford' : code === 'ZA' ? 'cape_town' : null;
}

/** Best guess before location permission: the device timezone. */
export function cityForTimezone(timezone: string | undefined): City | null {
  if (!timezone) return null;
  if (timezone === 'Europe/London' || timezone === 'Europe/Belfast') return 'oxford';
  if (timezone === 'Africa/Johannesburg') return 'cape_town';
  return null;
}

export function deviceCity(): City {
  try { return cityForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone) ?? 'oxford'; }
  catch { return 'oxford'; }
}

export function formatPrice(amount: number, city: City) {
  return `${CITIES[city].symbol}${amount.toFixed(2)}`;
}

/** Seller default: FIXR's last available face-value price, when the feed supplies it. */
export function defaultAskingPrice(event: CatalogueEvent | null | undefined): string {
  return event?.lastTicketPrice && event.lastTicketPrice > 0 ? event.lastTicketPrice.toFixed(2) : '';
}
