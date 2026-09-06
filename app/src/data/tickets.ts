export type TicketVariant = 'general' | 'vip' | 'verified' | 'escrow';
export type TicketWhen = 'upcoming' | 'past';

export interface TicketItem {
  id: string;
  code: string;
  eventTitle: string;
  ticketTypeLabel: string;
  variant: TicketVariant;
  venue: string;
  city: string;
  day: string;
  date: string;
  month: string;
  time: string;
  image: number;
  when: TicketWhen;
}

const NIGHT_IMAGES = [
  require('../../assets/event-images/night/black-coffee-ostrich.png'),
  require('../../assets/event-images/night/keinemusik-cabo.png'),
  require('../../assets/event-images/night/fisher-grand-arena.png'),
  require('../../assets/event-images/night/rufus-du-sol.png'),
  require('../../assets/event-images/night/origin-butterfly-stage.png'),
  require('../../assets/event-images/night/paradise-late-set.png'),
  require('../../assets/event-images/night/karoo-nights-crowd.png'),
  require('../../assets/event-images/night/warehouse-sessions.png'),
  require('../../assets/event-images/night/boiler-room-tent.png'),
  require('../../assets/event-images/night/neon-nights-red-tent.png'),
];

const DAY_IMAGES = [
  require('../../assets/event-images/day/rocking-the-daisies.png'),
  require('../../assets/event-images/day/ultra-south-africa.png'),
  require('../../assets/event-images/day/tropico-sunset-sessions.png'),
  require('../../assets/event-images/day/afrikaburn-desert.png'),
  require('../../assets/event-images/day/forest-grove-day.png'),
];

// A pool of plausible Cape Town events/venues an "unlimited" number of
// past tickets can be procedurally generated from — not a fixed list of
// hand-authored tickets. Each entry just says whether it reads as a
// night or day event so it draws from the matching photo pool.
const EVENT_POOL: { title: string; venue: string; city: string; timeOfDay: 'day' | 'night' }[] = [
  { title: 'Black Coffee', venue: 'The Ostrich', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Keinemusik', venue: 'Cabo Beach Club', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Fisher', venue: 'Grand Arena', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'RÜFÜS DU SOL', venue: 'The Ostrich', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Origin Festival', venue: 'Val de Vie', city: 'Paarl', timeOfDay: 'night' },
  { title: 'Paradise Club', venue: 'City Bowl', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Karoo Nights', venue: 'Tankwa Karoo', city: 'Karoo', timeOfDay: 'night' },
  { title: 'Warehouse Sessions', venue: 'Woodstock', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Boiler Room Cape Town', venue: 'Truth', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Neon Nights', venue: 'Athlone Stadium', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Shimza', venue: 'Shimmy Beach Club', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Da Capo', venue: 'Truth', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Black Motion', venue: 'The Ostrich', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Culoe De Song', venue: 'Cabo Beach Club', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Zakes Bantwini', venue: 'Grand Arena', city: 'Cape Town', timeOfDay: 'night' },
  { title: 'Rocking the Daisies', venue: 'Cloof Wine Estate', city: 'Darling', timeOfDay: 'day' },
  { title: 'Ultra South Africa', venue: 'Cape Town Stadium', city: 'Cape Town', timeOfDay: 'day' },
  { title: 'Trópico Sunset Sessions', venue: 'Camps Bay Beach', city: 'Cape Town', timeOfDay: 'day' },
  { title: 'AfrikaBurn', venue: 'Tankwa Karoo', city: 'Karoo', timeOfDay: 'day' },
  { title: 'Forest Grove Day Party', venue: 'Kirstenbosch Gardens', city: 'Cape Town', timeOfDay: 'day' },
  { title: 'Sun-El Musician', venue: 'Kirstenbosch Gardens', city: 'Cape Town', timeOfDay: 'day' },
  { title: 'Goldfish Live', venue: 'V&A Waterfront', city: 'Cape Town', timeOfDay: 'day' },
  { title: "Vinny Da Vinci", venue: 'Camps Bay Beach', city: 'Cape Town', timeOfDay: 'day' },
  { title: 'Prince Kaybee', venue: 'Cloof Wine Estate', city: 'Darling', timeOfDay: 'day' },
];

const VARIANTS: TicketVariant[] = ['general', 'vip', 'verified', 'escrow'];
const VARIANT_LABEL: Record<TicketVariant, string> = {
  general: 'GENERAL ADMISSION',
  vip: 'VIP ACCESS',
  verified: 'GENERAL ADMISSION',
  escrow: 'ESCROW · SECURE',
};

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedurally generates `count` past tickets — scales to any number of
 * "events visited" without hand-authoring each one. Deterministic (stable
 * seed) so the list doesn't reshuffle on every render. */
function generatePastTickets(count: number): TicketItem[] {
  // Re-seeded from true randomness on every app load/reload, so the
  // past-ticket lineup is different each time rather than fixed forever.
  const rng = mulberry32(Math.floor(Math.random() * 2 ** 31));
  const list: TicketItem[] = [];

  for (let i = 0; i < count; i++) {
    const pool = EVENT_POOL[Math.floor(rng() * EVENT_POOL.length)];
    const images = pool.timeOfDay === 'night' ? NIGHT_IMAGES : DAY_IMAGES;
    const variant = VARIANTS[Math.floor(rng() * VARIANTS.length)];

    list.push({
      id: `past-${i}`,
      code: `AM-${String(Math.floor(rng() * 90000) + 10000)}`,
      eventTitle: pool.title,
      ticketTypeLabel: VARIANT_LABEL[variant],
      variant,
      venue: pool.venue,
      city: pool.city,
      day: DAYS[Math.floor(rng() * DAYS.length)],
      date: String(Math.floor(rng() * 28) + 1),
      month: MONTHS[Math.floor(rng() * MONTHS.length)],
      time: `${String(Math.floor(rng() * 12) + 10).padStart(2, '0')}:00`,
      image: images[Math.floor(rng() * images.length)],
      when: 'past',
    });
  }
  return list;
}

const upcomingTickets: TicketItem[] = [
  {
    id: 't1',
    code: 'AM-02819',
    eventTitle: 'Black Coffee',
    ticketTypeLabel: 'GENERAL ADMISSION',
    variant: 'general',
    venue: 'The Ostrich',
    city: 'Cape Town',
    day: 'SAT',
    date: '18',
    month: 'OCT',
    time: '18:00',
    image: NIGHT_IMAGES[0],
    when: 'upcoming',
  },
  {
    id: 't2',
    code: 'AM-04172',
    eventTitle: 'Keinemusik',
    ticketTypeLabel: 'VIP ACCESS',
    variant: 'vip',
    venue: 'Cabo Beach Club',
    city: 'Cape Town',
    day: 'SUN',
    date: '10',
    month: 'NOV',
    time: '14:00',
    image: NIGHT_IMAGES[1],
    when: 'upcoming',
  },
  {
    id: 't3',
    code: 'AM-05531',
    eventTitle: 'TYLA',
    ticketTypeLabel: 'GENERAL ADMISSION',
    variant: 'verified',
    venue: 'Grand Arena',
    city: 'Cape Town',
    day: 'SAT',
    date: '30',
    month: 'NOV',
    time: '20:00',
    image: NIGHT_IMAGES[2],
    when: 'upcoming',
  },
  {
    id: 't4',
    code: 'AM-06390',
    eventTitle: 'Origin Festival',
    ticketTypeLabel: 'ESCROW · SECURE',
    variant: 'escrow',
    venue: 'Val de Vie',
    city: 'Paarl',
    day: 'FRI',
    date: '13',
    month: 'NOV',
    time: '16:00',
    image: NIGHT_IMAGES[4],
    when: 'upcoming',
  },
];

export const tickets: TicketItem[] = [...upcomingTickets, ...generatePastTickets(26)];
