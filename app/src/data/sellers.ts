import { mulberry32 } from './randomOverlay';

export type DeliverySpeed = 'instant' | 'within1h' | 'within2h';

export interface SellerListing {
  id: string;
  username: string;
  verified: boolean;
  topSeller: boolean;
  rating: number;
  ratingCount: number;
  ticketsSold: number;
  price: number;
  deliverySpeed: DeliverySpeed;
  ticketsAvailable: number;
  avatarColor: string;
}

const PREFIXES = [
  'sun', 'cape', 'palm', 'good', 'neon', 'night', 'beach', 'vibe', 'ultra', 'deep',
  'city', 'sea', 'moon', 'dust', 'fog', 'wild', 'gold', 'sky', 'sand', 'echo',
];
const SUFFIXES = [
  'tunes', 'townraver', 'sandbeats', 'vibesonly', 'nightsza', 'owl', 'bass', 'waves',
  'district', 'sessions', 'collective', 'soundz', 'rooftop', 'lowkey', 'static', 'motion',
];

const AVATAR_COLORS = ['#1E7A5C', '#2B2560', '#5B2E8C', '#E07A2E', '#7A1E3C', '#1E5A7A', '#8C5E2E'];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Procedurally generates a unique, plausible seller-listing set for one
 * event + ticket type combo. Seeded by event id so the same event always
 * shows the same sellers within a session, but every event gets its own
 * distinct set — this has to scale to a 500-event catalogue, not a
 * hand-authored list. */
export function generateSellers(eventId: string, ticketType: 'general' | 'vip', basePrice: number): SellerListing[] {
  const rng = mulberry32(hashString(`${eventId}:${ticketType}`) || 1);
  const count = 3 + Math.floor(rng() * 3); // 3-5 sellers
  const sellers: SellerListing[] = [];
  let price = Math.round(basePrice * (0.98 + rng() * 0.06));

  for (let i = 0; i < count; i++) {
    const username = `${PREFIXES[Math.floor(rng() * PREFIXES.length)]}${SUFFIXES[Math.floor(rng() * SUFFIXES.length)]}`;
    const topSeller = i === 0 && rng() < 0.7;
    const speedRoll = rng();
    sellers.push({
      id: `${eventId}-${ticketType}-${i}`,
      username,
      verified: rng() < 0.85,
      topSeller,
      rating: Math.round((4.4 + rng() * 0.59) * 10) / 10,
      ratingCount: 30 + Math.floor(rng() * 320),
      ticketsSold: 15 + Math.floor(rng() * 240),
      price,
      deliverySpeed: speedRoll < 0.4 ? 'instant' : speedRoll < 0.75 ? 'within1h' : 'within2h',
      ticketsAvailable: 1 + Math.floor(rng() * 4),
      avatarColor: AVATAR_COLORS[Math.floor(rng() * AVATAR_COLORS.length)],
    });
    price = Math.round(price * (1.02 + rng() * 0.04));
  }

  return sellers.sort((a, b) => a.price - b.price);
}
