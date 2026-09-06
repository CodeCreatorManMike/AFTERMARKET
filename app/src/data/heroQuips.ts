export type HighlightIntent = 'action' | 'trust';

export interface HeroLine {
  text: string;
  highlight?: HighlightIntent;
}

export interface HeroQuip {
  lines: HeroLine[];
  body: string;
}

// Brand-voice hero quips (direct, receipt-like, no hype-speak — see
// AFTERMARKET_Brand_Guide.md §21-22 and the moodboard's "GOOD PEOPLE
// GREAT NIGHTS" / "REAL TICKETS. REAL PEOPLE. SAFER TOGETHER." lines).
// Each highlighted phrase carries an *intent*, not a literal color:
// 'action' = urgency/CTA, 'trust' = verification/safety. resolveHighlightColor
// below maps that intent to an actual color per theme, since Lime reads
// as trust on the dark page but disappears on the green day page.
export const HERO_QUIPS: HeroQuip[] = [
  {
    lines: [
      { text: 'SOLD OUT' },
      { text: "DOESN'T MEAN" },
      { text: "YOU'RE OUT.", highlight: 'action' },
    ],
    body: "Buy and resell event tickets securely. Your money doesn't move until the ticket does.",
  },
  {
    lines: [
      { text: 'GET IN.', highlight: 'action' },
      { text: 'EVEN IF' },
      { text: "IT'S SOLD OUT." },
    ],
    body: 'Someone can’t go. You still can — held safe until the ticket actually moves.',
  },
  {
    lines: [
      { text: "CAN'T GO?" },
      { text: 'PASS IT ON,', highlight: 'action' },
      { text: 'SAFELY.' },
    ],
    body: 'Resell directly to real people. Your money stays held until the transfer is confirmed.',
  },
  {
    lines: [
      { text: 'BUY FROM PEOPLE.' },
      { text: 'NOT SCREENSHOTS.' },
      { text: 'VERIFIED, ALWAYS.', highlight: 'trust' },
    ],
    body: 'Every resale ticket is checked against the provider before your money ever moves.',
  },
  {
    lines: [
      { text: 'YOUR NEXT NIGHT OUT' },
      { text: 'IS ALREADY SOMEONE' },
      { text: "ELSE'S SPARE TICKET.", highlight: 'action' },
    ],
    body: 'Discover resale tickets from real sellers, held safe until the swap is done.',
  },
  {
    lines: [
      { text: 'THE TICKET MOVES.' },
      { text: 'THEN THE MONEY DOES.', highlight: 'trust' },
      { text: 'NOT BEFORE.' },
    ],
    body: "That's the whole trick. Buy and resell event tickets, without the risk of getting burned.",
  },
  {
    lines: [
      { text: 'SOLD OUT IS JUST' },
      { text: 'THE' },
      { text: 'AFTERMARKET.', highlight: 'action' },
    ],
    body: 'A fairer second chance for great nights — buy and resell with confidence.',
  },
  {
    lines: [
      { text: 'REAL TICKETS.' },
      { text: 'REAL PEOPLE.' },
      { text: 'SAFER TOGETHER.', highlight: 'trust' },
    ],
    body: 'Peer-to-peer resale, held safe in escrow from the first tap to the last.',
  },
  {
    lines: [
      { text: 'WE HOLD THE MONEY' },
      { text: 'UNTIL THE TICKET' },
      { text: 'IS YOURS.', highlight: 'trust' },
    ],
    body: "No ticket, no payout. That's the whole deal.",
  },
  {
    lines: [
      { text: 'A FAIRER' },
      { text: 'SECOND CHANCE', highlight: 'action' },
      { text: 'FOR GREAT NIGHTS.' },
    ],
    body: 'Festivals, nightlife, live music — find your way back in.',
  },
  {
    lines: [
      { text: 'GOOD PEOPLE.' },
      { text: 'GREAT NIGHTS.', highlight: 'action' },
    ],
    body: 'Buy, sell and discover live events with people you can actually trust.',
  },
  {
    lines: [
      { text: 'TICKETS CHANGE HANDS.' },
      { text: 'CULTURE MOVES FORWARD.', highlight: 'trust' },
    ],
    body: 'Every resale keeps the night alive for someone else — safely, verifiably.',
  },
];

export function pickHeroQuipIndex(exclude?: number): number {
  if (HERO_QUIPS.length <= 1) return 0;
  let next = Math.floor(Math.random() * HERO_QUIPS.length);
  while (next === exclude) {
    next = Math.floor(Math.random() * HERO_QUIPS.length);
  }
  return next;
}
