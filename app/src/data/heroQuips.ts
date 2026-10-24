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
    body: 'Sold out on FIXR? Find a verified spare from someone who can’t make it.',
  },
  {
    lines: [
      { text: 'GET IN.', highlight: 'action' },
      { text: 'EVEN IF' },
      { text: "IT'S SOLD OUT." },
    ],
    body: 'Find the exact event first. A spare ticket can give someone else a way in.',
  },
  {
    lines: [
      { text: "CAN'T GO?" },
      { text: 'PASS IT ON,', highlight: 'action' },
      { text: 'SAFELY.' },
    ],
    body: 'Start a private resale preview. Ticket review and checkout are being built.',
  },
  {
    lines: [
      { text: 'BUY FROM PEOPLE.' },
      { text: 'NOT SCREENSHOTS.' },
      { text: 'CHECK THE DETAILS.', highlight: 'trust' },
    ],
    body: 'A screenshot alone cannot verify a ticket. Match the event and confirm transfer rules.',
  },
  {
    lines: [
      { text: 'YOUR NEXT NIGHT OUT' },
      { text: 'IS ALREADY SOMEONE' },
      { text: "ELSE'S SPARE TICKET.", highlight: 'action' },
    ],
    body: 'Browse the event catalogue and learn the steps before resale opens.',
  },
  {
    lines: [
      { text: 'ONE EVENT.' },
      { text: 'ONE SPARE TICKET.', highlight: 'trust' },
      { text: 'A CLEAR TRAIL.' },
    ],
    body: 'Seller review, FIXR handover, payment confirmation and buyer claim each need a check.',
  },
  {
    lines: [
      { text: 'SOLD OUT IS JUST' },
      { text: 'THE' },
      { text: 'AFTERMARKET.', highlight: 'action' },
    ],
    body: 'A fairer second chance for great nights, every ticket checked by transfer.',
  },
  {
    lines: [
      { text: 'REAL TICKETS.' },
      { text: 'REAL PEOPLE.' },
      { text: 'SAFER TOGETHER.', highlight: 'trust' },
    ],
    body: 'See how the pilot plans to match people, payments and ticket transfers.',
  },
  {
    lines: [
      { text: 'PAYMENTS COME' },
      { text: 'AFTER REVIEW.', highlight: 'trust' },
      { text: 'NOT YET LIVE.' },
    ],
    body: 'Stripe checkout and payout controls are still being connected.',
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
    body: 'Discover live events and preview how passing a spare on will work.',
  },
  {
    lines: [
      { text: 'TICKETS CHANGE HANDS.' },
      { text: 'CULTURE MOVES FORWARD.', highlight: 'trust' },
    ],
    body: 'Every resale starts by matching the exact event and checking the transfer route.',
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
