/** Manually reviewed public FIXR links, checked 24 October 2026.
 * Dates come from FIXR event/organiser pages. Ticket availability and transfer
 * permission can change and must be checked on FIXR before a sale.
 */
export type OxfordFixrEvent = {
  id: string;
  title: string;
  venue: string;
  date: string; // Europe/London calendar day; time is deliberately not inferred.
  url: string;
  note?: string;
};

export const oxfordFixrEvents: OxfordFixrEvent[] = [
  { id: '821431366', title: 'FISHIES HALLOWEEN 2026', venue: 'O2 Academy Oxford', date: '2026-10-24', url: 'https://fixr.co/event/fishies-halloween-2026-tickets-821431366', note: 'FIXR organiser listed this as sold out.' },
  { id: '646719838', title: 'Saturday Sessions at Bridge', venue: 'Bridge Oxford', date: '2026-10-24', url: 'https://fixr.co/event/saturday-sessions-at-bridge-nightclub-tickets-646719838' },
  { id: '871397674', title: 'PARTYLICIOUS', venue: 'Plush Oxford', date: '2026-10-24', url: 'https://fixr.co/event/partylicious-your-ultimate-saturday-night-out-tickets-871397674' },
  { id: '549618733', title: 'THE BONE TEMPLE', venue: 'Bridge Oxford', date: '2026-10-30', url: 'https://fixr.co/event/fright-night-weekender-tickets-549618733' },
  { id: '968056463', title: 'RITMO Halloween Party', venue: 'The Varsity Club', date: '2026-10-30', url: 'https://fixr.co/event/latin-reggaeton-halloween-party-ritmo-at-varsity-tickets-968056463' },
  { id: '37167564', title: 'WTF FRIDAYS', venue: 'Plush Oxford', date: '2026-10-30', url: 'https://fixr.co/event/wtf-fridays-oxfords-biggest-friday-night-out-tickets-37167564' },
  { id: '444626175', title: 'Fright Night / Day of the Dead', venue: 'Bridge Oxford', date: '2026-10-31', url: 'https://fixr.co/event/fright-night-weekender-bridge-spirit-bar-tickets-444626175', note: 'FIXR page says individual tickets sold out; check current status.' },
  { id: '55317127', title: 'Halloween Red Light Boiler', venue: 'O2 Academy Oxford', date: '2026-10-31', url: 'https://fixr.co/event/the-halloween-red-light-boiler-final-50-tickets-tickets-55317127' },
  { id: '952290322', title: 'SOUL SISTA Halloween', venue: 'The Bullingdon', date: '2026-10-31', url: 'https://fixr.co/event/soul-sista-presents-halloween-2026-tickets-952290322' },
  { id: '836278672', title: 'HALLOWQUEEN', venue: 'Plush Oxford', date: '2026-10-31', url: 'https://fixr.co/event/hallowqueen-oxfords-biggest-halloween-party-tickets-836278672' },
  { id: '154819617', title: '90s Day Party: Oxford', venue: 'Plush Oxford', date: '2026-10-31', url: 'https://fixr.co/event/90s-day-party-oxford-tickets-154819617' },
  { id: '31368442', title: 'Nightmare on Park End Street', venue: 'Bubbly Lounge', date: '2026-10-31', url: 'https://fixr.co/event/nightmare-on-park-end-street-halloween-club-night-tickets-31368442' },
  { id: '339858749', title: 'Check In to the Dark', venue: 'OXO Bar', date: '2026-10-31', url: 'https://fixr.co/event/check-in-to-the-dark-halloween-at-the-oxo-bar-dj-a-tickets-339858749', note: 'FIXR page lists 21+ entry.' },
  { id: '383518769', title: 'The Horror Hotel Halloween', venue: 'The Varsity Club', date: '2026-10-31', url: 'https://fixr.co/event/the-horror-hotel-halloween-tickets-383518769' },
];

export function visibleOxfordEvents(now = new Date()): OxfordFixrEvent[] {
  // The catalogue is a dated pilot, not a perpetual feed.
  return oxfordFixrEvents.filter(event => new Date(`${event.date}T23:59:59Z`).getTime() >= now.getTime());
}
