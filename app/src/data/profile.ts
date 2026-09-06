export interface FollowedEntity {
  id: string;
  label: string;
  color: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: number;
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
  // Which badges this profile has actually earned — order matters (most
  // recent first). Works whether a profile has earned none, one, or all
  // of them; BadgeGrid just renders whatever list it's handed.
  earnedBadgeIds: [
    'first-event',
    'first-ticket',
    'venue-hopper',
    'double-booker',
    'night-owl',
    'trusted-buyer',
  ] as string[],
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

// The full badge catalogue — every badge that exists in the product,
// each with its real artwork. A profile only ever renders the subset
// it has actually earned (see `profile.earnedBadgeIds` below and
// ProfileScreen), so this list can grow freely without any UI changes.
export const ALL_BADGES: Badge[] = [
  { id: 'first-event', label: 'First Event Attended', icon: require('../../assets/badges/first-event-attended.png') },
  { id: 'first-ticket', label: 'First Ticket Sold', icon: require('../../assets/badges/first-ticket-sold.png') },
  { id: 'venue-hopper', label: 'Venue Hopper', icon: require('../../assets/badges/venue-hopper.png') },
  { id: 'double-booker', label: 'Double Booker', icon: require('../../assets/badges/double-boker.png') },
  { id: 'verified-seller', label: 'Verified Seller', icon: require('../../assets/badges/verified-seller.png') },
  { id: 'trusted-buyer', label: 'Trusted Buyer', icon: require('../../assets/badges/trusted-buyer.png') },
  { id: 'festival-regular', label: 'Festival Regular', icon: require('../../assets/badges/festival-regular.png') },
  { id: 'night-owl', label: 'Night Owl', icon: require('../../assets/badges/night-owl.png') },
  { id: 'early-bird', label: 'Early Bird', icon: require('../../assets/badges/early-bird.png') },
  { id: 'community-builder', label: 'Community Builder', icon: require('../../assets/badges/comunity-builder.png') },
];

/** Resolves a profile's earned badge ids to full Badge records, in order. */
export function earnedBadges(earnedBadgeIds: string[]): Badge[] {
  const byId = new Map(ALL_BADGES.map((b) => [b.id, b]));
  return earnedBadgeIds.map((id) => byId.get(id)).filter((b): b is Badge => !!b);
}
