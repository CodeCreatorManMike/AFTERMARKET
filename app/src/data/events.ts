import {
  DemoEvent,
  EventCategory,
  eventCatalog,
} from './eventCatalog';

export type { EventCategory } from './eventCatalog';
export type TimeOfDay = 'day' | 'night';

export interface EventItem {
  id: string;
  title: string;
  venue: string;
  city: string;
  category: EventCategory;
  categoryLabel: string;
  timeOfDay: TimeOfDay;
  day: string;
  date: string;
  month: string;
  priceFrom: number;
  image: number;
  favorited?: boolean;
}

const EVENT_IMAGES = [
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
  require('../../assets/event-images/day/rocking-the-daisies.png'),
  require('../../assets/event-images/day/ultra-south-africa.png'),
  require('../../assets/event-images/day/tropico-sunset-sessions.png'),
  require('../../assets/event-images/day/afrikaburn-desert.png'),
  require('../../assets/event-images/day/forest-grove-day.png'),
] as const;

const CATEGORY_LABELS: Record<EventCategory, string> = {
  nightlife: 'Electronic · Nightlife',
  festival: 'Festival · Multi-stage',
  live_music: 'Live music',
  daylife: 'Daylife · Cape Town',
};

const dateFormatter = new Intl.DateTimeFormat('en-ZA', {
  timeZone: 'Africa/Johannesburg',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

function toEventItem(event: DemoEvent): EventItem {
  const dateParts = Object.fromEntries(
    dateFormatter.formatToParts(new Date(event.startAt)).map((part) => [part.type, part.value]),
  );
  const localHour = Number(new Intl.DateTimeFormat('en-ZA', {
    timeZone: event.timezone,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(event.startAt)));

  return {
    id: event.id,
    title: event.title,
    venue: event.venue.name,
    city: event.venue.city,
    category: event.category,
    categoryLabel: CATEGORY_LABELS[event.category],
    timeOfDay: localHour >= 18 || localHour < 5 ? 'night' : 'day',
    day: dateParts.weekday.toUpperCase(),
    date: dateParts.day,
    month: dateParts.month.toUpperCase(),
    priceFrom: event.priceFrom,
    image: EVENT_IMAGES[event.imageKey],
  };
}

/** UI-compatible projection of the complete 500-record demo catalogue. */
export const events: EventItem[] = eventCatalog.map(toEventItem);

/** Keep the current ScrollView fast while the eventual catalogue screen is built. */
export const featuredEvents = events.slice(0, 12);

export const categories: { key: 'all' | EventCategory; label: string }[] = [
  { key: 'all', label: 'All events' },
  { key: 'nightlife', label: 'Nightlife' },
  { key: 'festival', label: 'Festivals' },
  { key: 'live_music', label: 'Live music' },
  { key: 'daylife', label: 'Daylife' },
];
