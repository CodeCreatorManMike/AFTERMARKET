export type HighlightColor = 'coral' | 'lime';

export interface HeroLine {
  text: string;
  highlight?: HighlightColor;
}

export interface HeroQuip {
  lines: HeroLine[];
  body: string;
}

// Brand-voice hero quips (direct, receipt-like, no hype-speak — see
// AFTERMARKET_Brand_Guide.md §21-22). One picked at random per app load.
// Each has exactly one highlighted line/phrase, alternating between the
// two brand accent colors depending on what that line means: Coral for
// action/urgency, Lime for the trust/verification beat.
export const HERO_QUIPS: HeroQuip[] = [
  {
    lines: [
      { text: 'SOLD OUT' },
      { text: "DOESN'T MEAN" },
      { text: "YOU'RE OUT.", highlight: 'coral' },
    ],
    body: "Buy and resell event tickets securely. Your money doesn't move until the ticket does.",
  },
  {
    lines: [
      { text: 'GET IN.', highlight: 'lime' },
      { text: 'EVEN IF' },
      { text: "IT'S SOLD OUT." },
    ],
    body: 'Someone can’t go. You still can — held safe until the ticket actually moves.',
  },
  {
    lines: [
      { text: "CAN'T GO?" },
      { text: 'PASS IT ON,', highlight: 'coral' },
      { text: 'SAFELY.' },
    ],
    body: 'Resell directly to real people. Your money stays held until the transfer is confirmed.',
  },
  {
    lines: [
      { text: 'BUY FROM PEOPLE.' },
      { text: 'NOT SCREENSHOTS.' },
      { text: 'VERIFIED, ALWAYS.', highlight: 'lime' },
    ],
    body: 'Every resale ticket is checked against the provider before your money ever moves.',
  },
  {
    lines: [
      { text: 'YOUR NEXT NIGHT OUT' },
      { text: 'IS ALREADY SOMEONE' },
      { text: "ELSE'S SPARE TICKET.", highlight: 'coral' },
    ],
    body: 'Discover resale tickets from real sellers, held safe until the swap is done.',
  },
  {
    lines: [
      { text: 'THE TICKET MOVES.' },
      { text: 'THEN THE MONEY DOES.', highlight: 'lime' },
      { text: 'NOT BEFORE.' },
    ],
    body: "That's the whole trick. Buy and resell event tickets, without the risk of getting burned.",
  },
];

export function pickHeroQuip(): HeroQuip {
  return HERO_QUIPS[Math.floor(Math.random() * HERO_QUIPS.length)];
}
