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

export const tickets: TicketItem[] = [
  // --- Upcoming — one of every variant ---
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
    image: require('../../assets/event-images/night/black-coffee-ostrich.png'),
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
    image: require('../../assets/event-images/night/keinemusik-cabo.png'),
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
    image: require('../../assets/event-images/night/fisher-grand-arena.png'),
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
    image: require('../../assets/event-images/night/origin-butterfly-stage.png'),
    when: 'upcoming',
  },

  // --- Past ---
  {
    id: 't5',
    code: 'AM-01187',
    eventTitle: 'Rocking the Daisies',
    ticketTypeLabel: 'GENERAL ADMISSION',
    variant: 'general',
    venue: 'Cloof Wine Estate',
    city: 'Darling',
    day: 'THU',
    date: '9',
    month: 'OCT',
    time: '12:00',
    image: require('../../assets/event-images/day/rocking-the-daisies.png'),
    when: 'past',
  },
  {
    id: 't6',
    code: 'AM-00942',
    eventTitle: 'Ultra South Africa',
    ticketTypeLabel: 'VIP ACCESS',
    variant: 'vip',
    venue: 'Cape Town Stadium',
    city: 'Cape Town',
    day: 'SAT',
    date: '21',
    month: 'FEB',
    time: '11:00',
    image: require('../../assets/event-images/day/ultra-south-africa.png'),
    when: 'past',
  },
  {
    id: 't7',
    code: 'AM-03356',
    eventTitle: 'AfrikaBurn',
    ticketTypeLabel: 'GENERAL ADMISSION',
    variant: 'verified',
    venue: 'Tankwa Karoo',
    city: 'Karoo',
    day: 'MON',
    date: '27',
    month: 'APR',
    time: '09:00',
    image: require('../../assets/event-images/day/afrikaburn-desert.png'),
    when: 'past',
  },
  {
    id: 't8',
    code: 'AM-02275',
    eventTitle: 'Neon Nights',
    ticketTypeLabel: 'ESCROW · SECURE',
    variant: 'escrow',
    venue: 'Athlone Stadium',
    city: 'Cape Town',
    day: 'SAT',
    date: '31',
    month: 'OCT',
    time: '20:00',
    image: require('../../assets/event-images/night/neon-nights-red-tent.png'),
    when: 'past',
  },
];
