export type EventCategory = 'nightlife' | 'festival' | 'live_music' | 'daylife';
export type EventStatus = 'scheduled' | 'sold_out' | 'cancelled' | 'postponed';
export type OfferAvailability = 'in_stock' | 'low_stock' | 'sold_out';

export interface DemoEventOffer {
  id: string;
  name: string;
  price: number;
  currency: 'ZAR';
  availability: OfferAvailability;
}

export interface DemoEventVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  province: 'Western Cape';
  countryCode: 'ZA';
  latitude: number;
  longitude: number;
}

export interface DemoEventOrganiser {
  id: string;
  name: string;
  verified: boolean;
}

export interface DemoEventSource {
  kind: 'synthetic';
  provider: 'demo';
  externalId: string;
  sourceUrl: null;
  ticketUrl: null;
  importedAt: string;
  refreshedAt: string;
  contentRights: 'original_demo';
}

export interface DemoEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  tags: string[];
  startAt: string;
  endAt: string;
  timezone: 'Africa/Johannesburg';
  status: EventStatus;
  ageRestriction: 'All ages' | '16+' | '18+' | '21+';
  dressCode: string | null;
  parking: string | null;
  prohibitedItems: string[];
  refundPolicy: string;
  organiser: DemoEventOrganiser;
  venue: DemoEventVenue;
  offers: DemoEventOffer[];
  priceFrom: number;
  currency: 'ZAR';
  imageKey: number;
  featured: boolean;
  popularityScore: number;
  source: DemoEventSource;
}

const TITLE_LEADS = [
  'Afterglow', 'All Together', 'Atlantic', 'Backyard', 'Bloom', 'City Lights', 'Coastal',
  'Common Ground', 'Daybreak', 'Electric', 'Golden Hour', 'High Tide', 'Late Checkout',
  'Moonrise', 'Neighbourhood', 'Night Market', 'Open Air', 'Signal', 'Sunday Social', 'Wildflower',
] as const;

const TITLE_ENDS = [
  'Assembly', 'Block Party', 'Club', 'Collective', 'Dance', 'Festival', 'Garden Sessions',
  'Live', 'Night', 'Picnic', 'Rooftop', 'Sessions', 'Social', 'Sound System', 'Weekender',
  'Warehouse', 'Waves', 'Yard', 'Gathering', 'Showcase',
] as const;

const ORGANISERS = [
  'Amber Room Projects', 'Assembly Works', 'Atlantic Culture Club', 'Backline Collective',
  'Cape Circuit', 'Daylight Department', 'District Sound', 'First Thursday Studio',
  'Good Measure Events', 'Harbour House Productions', 'Local Frequency', 'Mother City Social',
  'Night Shift Projects', 'Open Field Collective', 'Side Street Culture', 'Signal Room',
  'Slow Sunday Club', 'Southern Lights', 'The Listening Society', 'Weekend Office',
] as const;

const VENUES = [
  ['The Salt Yard', '12 Dock Road', 'Cape Town', -33.9078, 18.4209],
  ['Signal Hall', '48 Buitengracht Street', 'Cape Town', -33.9198, 18.4172],
  ['The Brickworks', '19 Albert Road', 'Woodstock', -33.9277, 18.4475],
  ['Atlantic Lawn', '3 Beach Road', 'Sea Point', -33.9184, 18.3851],
  ['Orchard House', '61 Main Road', 'Constantia', -34.0265, 18.4241],
  ['The Foundry', '24 Canterbury Street', 'Zonnebloem', -33.9286, 18.4269],
  ['Green Point Yard', '8 Somerset Road', 'Green Point', -33.9128, 18.4145],
  ['The Glasshouse', '17 Kloof Street', 'Gardens', -33.9299, 18.4128],
  ['Harbour Shed', '2 East Pier', 'Hout Bay', -34.0503, 18.3477],
  ['Upper Deck', '70 Regent Road', 'Sea Point', -33.9234, 18.3789],
  ['The Courtyard', '15 Lower Main Road', 'Observatory', -33.9372, 18.4691],
  ['Cedar Grove', '9 Spaanschemat River Road', 'Constantia', -34.0351, 18.4299],
  ['The Exchange', '33 Long Street', 'Cape Town', -33.9224, 18.4201],
  ['West Coast Field', '14 Otto du Plessis Drive', 'Blouberg', -33.8021, 18.4627],
  ['Mountain View Farm', '6 Paarl Road', 'Stellenbosch', -33.9321, 18.8602],
  ['The Old Mill', '22 Main Road', 'Muizenberg', -34.1079, 18.4696],
  ['Lantern Room', '41 Loop Street', 'Cape Town', -33.9208, 18.4198],
  ['Palm Courtyard', '10 Victoria Road', 'Camps Bay', -33.9512, 18.3776],
  ['Winelands Pavilion', '7 Market Street', 'Paarl', -33.7357, 18.9623],
  ['False Bay Stage', '26 Main Road', 'Kalk Bay', -34.1264, 18.4495],
] as const;

const CATEGORY_SEQUENCE: EventCategory[] = [
  'nightlife', 'festival', 'live_music', 'daylife', 'nightlife', 'live_music', 'festival', 'daylife',
];

const TAGS: Record<EventCategory, string[]> = {
  nightlife: ['Electronic', 'House', 'Dance', 'Late night'],
  festival: ['Multi-stage', 'Outdoor', 'Food', 'Weekend'],
  live_music: ['Live band', 'Local artists', 'Acoustic', 'Concert'],
  daylife: ['Day party', 'Food', 'Family', 'Outdoor'],
};

const OFFER_NAMES = ['Early release', 'General admission', 'Final release', 'VIP access'] as const;
const DRESS_CODES = [null, 'Come as you are', 'Smart casual', 'Festival-friendly'] as const;
const PARKING = [null, 'Limited secure parking available', 'Use ride-share where possible', 'Paid parking nearby'] as const;
const AGE_RESTRICTIONS: DemoEvent['ageRestriction'][] = ['18+', '18+', 'All ages', '16+', '21+'];
const PROHIBITED_ITEMS = ['Outside alcohol', 'Weapons', 'Illegal substances', 'Professional recording equipment'];

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function startOfTomorrow(referenceDate: Date) {
  return new Date(Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate() + 1,
  ));
}

function buildOffers(id: string, category: EventCategory, random: () => number): DemoEventOffer[] {
  const isFree = random() < 0.08;
  const basePrice = isFree ? 0 : 100 + Math.floor(random() * (category === 'festival' ? 900 : 400) / 25) * 25;
  const count = isFree ? 1 : 2 + Math.floor(random() * 3);

  return Array.from({ length: count }, (_, index) => ({
    id: `${id}-offer-${index + 1}`,
    name: isFree ? 'Free RSVP' : OFFER_NAMES[index],
    price: isFree ? 0 : basePrice + index * (category === 'festival' ? 175 : 75),
    currency: 'ZAR' as const,
    availability: index === 0 && random() < 0.22 ? 'sold_out' : index === count - 1 && random() < 0.18 ? 'low_stock' : 'in_stock',
  }));
}

/**
 * Produces a large, realistic catalogue without copying a ticketing provider's
 * event text, artwork, URLs, or identifiers. Pass a date in tests for stable output.
 */
export function createDemoEventCatalog(count = 500, referenceDate = new Date()): DemoEvent[] {
  const anchor = startOfTomorrow(referenceDate);

  return Array.from({ length: count }, (_, index) => {
    const random = mulberry32(8042 + index * 97);
    const id = `demo-event-${String(index + 1).padStart(4, '0')}`;
    const titleLead = TITLE_LEADS[index % TITLE_LEADS.length];
    const titleEnd = TITLE_ENDS[Math.floor(index / TITLE_LEADS.length) % TITLE_ENDS.length];
    const edition = Math.floor(index / (TITLE_LEADS.length * TITLE_ENDS.length));
    const title = `${titleLead} ${titleEnd}${edition > 0 ? ` — Edition ${edition + 1}` : ''}`;
    const category = CATEGORY_SEQUENCE[index % CATEGORY_SEQUENCE.length];
    const venueData = VENUES[(index * 7) % VENUES.length];
    const organiserName = ORGANISERS[(index * 11) % ORGANISERS.length];
    const localStartHour = category === 'nightlife' ? 20 + (index % 3) : 10 + (index % 8);
    const dayOffset = 1 + ((index * 17) % 300);
    const durationHours = category === 'festival' ? 10 + (index % 20) : 3 + (index % 6);
    const startAt = new Date(anchor.getTime() + dayOffset * 86_400_000 + (localStartHour - 2) * 3_600_000);
    const endAt = new Date(startAt.getTime() + durationHours * 3_600_000);
    const offers = buildOffers(id, category, random);
    const city = venueData[2];

    return {
      id,
      slug: `${slugify(title)}-${String(index + 1).padStart(4, '0')}`,
      title,
      description: `${title} brings ${pick(TAGS[category], random).toLowerCase()} energy to ${city}. A locally produced demo event with food, music, and a carefully programmed crowd experience.`,
      category,
      tags: [pick(TAGS[category], random), pick(TAGS[category], random), city],
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      timezone: 'Africa/Johannesburg',
      status: offers.every((offer) => offer.availability === 'sold_out') ? 'sold_out' : 'scheduled',
      ageRestriction: pick(AGE_RESTRICTIONS, random),
      dressCode: pick(DRESS_CODES, random),
      parking: pick(PARKING, random),
      prohibitedItems: [...PROHIBITED_ITEMS],
      refundPolicy: 'Demo policy: refunds are available until seven days before the event.',
      organiser: {
        id: `demo-organiser-${String((index * 11) % ORGANISERS.length + 1).padStart(2, '0')}`,
        name: organiserName,
        verified: index % 4 !== 0,
      },
      venue: {
        id: `demo-venue-${String((index * 7) % VENUES.length + 1).padStart(2, '0')}`,
        name: venueData[0],
        address: venueData[1],
        city,
        province: 'Western Cape',
        countryCode: 'ZA',
        latitude: venueData[3],
        longitude: venueData[4],
      },
      offers,
      priceFrom: Math.min(...offers.map((offer) => offer.price)),
      currency: 'ZAR',
      imageKey: index % 15,
      featured: index < 12,
      popularityScore: Math.round((0.45 + random() * 0.55) * 100),
      source: {
        kind: 'synthetic',
        provider: 'demo',
        externalId: id,
        sourceUrl: null,
        ticketUrl: null,
        importedAt: anchor.toISOString(),
        refreshedAt: anchor.toISOString(),
        contentRights: 'original_demo',
      },
    };
  });
}

export interface CatalogValidation {
  valid: boolean;
  errors: string[];
}

export function validateEventCatalog(catalog: DemoEvent[]): CatalogValidation {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  catalog.forEach((event, index) => {
    if (ids.has(event.id)) errors.push(`Duplicate id at index ${index}: ${event.id}`);
    if (slugs.has(event.slug)) errors.push(`Duplicate slug at index ${index}: ${event.slug}`);
    if (!event.title || !event.description) errors.push(`Missing content for ${event.id}`);
    if (!event.offers.length) errors.push(`No ticket offers for ${event.id}`);
    if (event.priceFrom !== Math.min(...event.offers.map((offer) => offer.price))) {
      errors.push(`Incorrect priceFrom for ${event.id}`);
    }
    if (event.imageKey < 0 || event.imageKey > 14) errors.push(`Invalid imageKey for ${event.id}`);
    if (event.source.contentRights !== 'original_demo') errors.push(`Unsafe content rights for ${event.id}`);
    ids.add(event.id);
    slugs.add(event.slug);
  });

  return { valid: errors.length === 0, errors };
}

export const eventCatalog = createDemoEventCatalog();
