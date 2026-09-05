export type EventCategory = 'nightlife' | 'festival' | 'live_music' | 'daylife';

export interface EventItem {
  id: string;
  title: string;
  venue: string;
  city: string;
  category: EventCategory;
  categoryLabel: string;
  day: string;
  date: string;
  month: string;
  priceFrom: number;
  image: number;
  favorited?: boolean;
}

export const events: EventItem[] = [
  {
    id: 'e1',
    title: 'Black Coffee',
    venue: 'The Ostrich',
    city: 'Cape Town',
    category: 'nightlife',
    categoryLabel: 'Electronic · Nightlife',
    day: 'SAT',
    date: '18',
    month: 'OCT',
    priceFrom: 450,
    image: require('../../assets/event-images/event-1.png'),
  },
  {
    id: 'e2',
    title: 'Keinemusik',
    venue: 'Cabo Beach Club',
    city: 'Cape Town',
    category: 'nightlife',
    categoryLabel: 'House · Nightlife',
    day: 'SUN',
    date: '10',
    month: 'NOV',
    priceFrom: 380,
    image: require('../../assets/event-images/event-2.png'),
  },
  {
    id: 'e3',
    title: 'Rocking the Daisies',
    venue: 'Cloof Wine Estate',
    city: 'Darling',
    category: 'festival',
    categoryLabel: 'Festival · Multi-day',
    day: 'THU',
    date: '9',
    month: 'OCT',
    priceFrom: 890,
    image: require('../../assets/event-images/event-3.png'),
  },
  {
    id: 'e4',
    title: 'Fisher',
    venue: 'Grand Arena',
    city: 'Cape Town',
    category: 'nightlife',
    categoryLabel: 'Electronic · Nightlife',
    day: 'SAT',
    date: '26',
    month: 'OCT',
    priceFrom: 520,
    image: require('../../assets/event-images/event-4.png'),
  },
  {
    id: 'e5',
    title: 'RÜFÜS DU SOL',
    venue: 'The Ostrich',
    city: 'Cape Town',
    category: 'live_music',
    categoryLabel: 'Live music',
    day: 'FRI',
    date: '8',
    month: 'NOV',
    priceFrom: 610,
    image: require('../../assets/event-images/event-5.png'),
  },
  {
    id: 'e6',
    title: 'Paradise Club Day',
    venue: 'City Bowl',
    city: 'Cape Town',
    category: 'daylife',
    categoryLabel: 'Daylife',
    day: 'SAT',
    date: '14',
    month: 'DEC',
    priceFrom: 250,
    image: require('../../assets/event-images/event-6.png'),
  },
];

export const categories: { key: 'all' | EventCategory; label: string }[] = [
  { key: 'all', label: 'All events' },
  { key: 'nightlife', label: 'Nightlife' },
  { key: 'festival', label: 'Festivals' },
  { key: 'live_music', label: 'Live music' },
  { key: 'daylife', label: 'Daylife' },
];
