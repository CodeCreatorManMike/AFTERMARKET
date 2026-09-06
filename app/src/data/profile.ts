export interface FollowedEntity {
  id: string;
  label: string;
  color: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: 'ticket' | 'diagonalArrow' | 'plane' | 'bolt';
  bg: string;
  iconColor: string;
}

export const profile = {
  username: 'kai.m',
  memberSince: 'Mar 2024',
  countryFlag: '🇿🇦',
  following: 342,
  followers: '1.2K',
  eventsAttended: 18,
  ticketsSold: 11,
  banner: require('../../assets/event-images/day/tropico-sunset-sessions.png'),
  avatar: require('../../assets/portraits/artist-press-shot-1.png'),
};

export const followedEntities: FollowedEntity[] = [
  { id: 'cabo', label: 'Cabo', color: '#1E7A5C' },
  { id: 'ostrich', label: 'The Ostrich', color: '#2B2560' },
  { id: 'ultra', label: 'Ultra SA', color: '#5B2E8C' },
  { id: 'daisies', label: 'Rocking the Daisies', color: '#E07A2E' },
  { id: 'ct-nightlife', label: 'CT Nightlife', color: '#1A1A1A' },
  { id: 'truth', label: 'Truth', color: '#7A1E3C' },
  { id: 'shimmy', label: 'Shimmy Beach', color: '#1E5A7A' },
];

export const badges: Badge[] = [
  { id: 'first-event', label: 'First Event Attended', icon: 'ticket', bg: '#FF5470', iconColor: '#14102B' },
  { id: 'first-ticket', label: 'First Ticket Sold', icon: 'diagonalArrow', bg: '#C6FF3D', iconColor: '#14102B' },
  { id: 'venue-hopper', label: 'Venue Hopper', icon: 'plane', bg: '#2B2560', iconColor: '#F5F0E6' },
  { id: 'double-booker', label: 'Double Booker', icon: 'bolt', bg: '#FF5470', iconColor: '#C6FF3D' },
];
