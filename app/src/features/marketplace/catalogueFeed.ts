import type { CatalogueEvent, City } from '../../data/catalogue';

export type CatalogueFeedResponse = { source: 'fixr'; city: City; suppliedAt: string; events: CatalogueEvent[] };

const optionalNumber = (value: unknown, max: number) => value === null || value === undefined || (typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= max);

export function validCatalogueResponse(value: unknown, city: City = 'oxford'): value is CatalogueFeedResponse {
  if (!value || typeof value !== 'object') return false;
  const feed = value as Record<string, unknown>;
  if (feed.source !== 'fixr' || feed.city !== city || typeof feed.suppliedAt !== 'string' || !Number.isFinite(Date.parse(feed.suppliedAt)) || !Array.isArray(feed.events)) return false;
  const ids = new Set<string>();
  return feed.events.every((raw: unknown) => {
    if (!raw || typeof raw !== 'object') return false;
    const event = raw as Record<string, unknown>;
    if (typeof event.id !== 'string' || !/^\d{1,20}$/.test(event.id) || ids.has(event.id) || typeof event.title !== 'string' || typeof event.venue !== 'string' || typeof event.excerpt !== 'string' ||
        typeof event.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(event.date) ||
        typeof event.url !== 'string' || !/^https:\/\/fixr\.co\/event\/[^?#]+/.test(event.url) || !event.url.split('-').at(-1)?.startsWith(event.id) ||
        typeof event.imageUrl !== 'string' || !/^https:\/\/fixr-cdn\.fixr\.co\//.test(event.imageUrl) ||
        (event.description !== null && event.description !== undefined && typeof event.description !== 'string') ||
        (event.address !== null && event.address !== undefined && typeof event.address !== 'string') ||
        (event.startAt !== null && event.startAt !== undefined && (typeof event.startAt !== 'string' || !Number.isFinite(Date.parse(event.startAt)))) ||
        (event.endAt !== null && event.endAt !== undefined && (typeof event.endAt !== 'string' || !Number.isFinite(Date.parse(event.endAt)))) ||
        !optionalNumber(event.fixrRank, 100000) || !optionalNumber(event.lastTicketPrice, 100000) ||
        !['on_sale', 'sold_out'].includes(String(event.availabilityAtCheck))) return false;
    ids.add(event.id);
    return true;
  });
}

/** EXPO_PUBLIC_CATALOGUE_URL is the API base, e.g. https://host/v1/catalogue (a legacy …/oxford suffix is accepted). */
export function feedUrl(base: string | undefined, city: City): string | null {
  const trimmed = base?.trim().replace(/\/+$/, '').replace(/\/(oxford|cape_town)$/, '');
  return trimmed && /^https:\/\/[^/]+/.test(trimmed) ? `${trimmed}/${city}` : null;
}
