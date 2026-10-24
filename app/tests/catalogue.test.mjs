import test from 'node:test';
import assert from 'node:assert/strict';
import { byPopularity, cityForCoordinates, cityForCountry, cityForTimezone, defaultAskingPrice, filterEvents, matchesDate } from '../src/data/catalogue.ts';
import { oxfordFixrEvents } from '../src/data/oxfordFixrEvents.ts';
import { assessQrScan } from '../src/features/marketplace/ticketQr.ts';
import { decodeState, eventStart } from '../src/features/marketplace/model.ts';
import { feedUrl } from '../src/features/marketplace/catalogueFeed.ts';

const base = { venue: 'Bridge Oxford', url: 'https://fixr.co/event/x-tickets-1', imageUrl: 'https://fixr-cdn.fixr.co/a.jpg', excerpt: '' };

test('location resolves by country, timezone is only a suggestion', () => {
  assert.equal(cityForCoordinates(51.752, -1.258), 'oxford');
  assert.equal(cityForCoordinates(51.503, -0.128), 'oxford'); // London is UK → Oxford list
  assert.equal(cityForCoordinates(55.95, -3.19), 'oxford');
  assert.equal(cityForCoordinates(-33.925, 18.424), 'cape_town');
  assert.equal(cityForCoordinates(-26.2, 28.04), 'cape_town');
  assert.equal(cityForCoordinates(48.858, 2.294), null);
  assert.equal(cityForCoordinates(999, 0), null);
  assert.equal(cityForCountry('gb'), 'oxford');
  assert.equal(cityForCountry('ZA'), 'cape_town');
  assert.equal(cityForCountry('IE'), null);
  assert.equal(cityForTimezone('Europe/London'), 'oxford');
  assert.equal(cityForTimezone('Africa/Johannesburg'), 'cape_town');
  assert.equal(cityForTimezone('America/New_York'), null);
});

test('sold-out and scarce events rank first, then FIXR order and date', () => {
  const events = [
    { ...base, id: '1', title: 'Quiet night', date: '2026-10-25', availabilityAtCheck: 'on_sale' },
    { ...base, id: '2', title: 'Big night', date: '2026-10-31', availabilityAtCheck: 'sold_out' },
    { ...base, id: '3', title: 'Boiler (FINAL 50 TICKETS)', date: '2026-10-30', availabilityAtCheck: 'on_sale' },
    { ...base, id: '4', title: 'Ranked', date: '2026-10-29', availabilityAtCheck: 'on_sale', fixrRank: 1 },
  ];
  assert.deepEqual(byPopularity(events).map(event => event.id), ['2', '4', '3', '1']);
});

test('date and search filters combine and ended events stay hidden', () => {
  const now = new Date('2026-10-28T12:00:00Z'); // Wednesday
  const all = oxfordFixrEvents;
  const weekend = filterEvents(all, { query: '', date: 'weekend', soldOutOnly: false }, now, 'oxford');
  assert.ok(weekend.length > 0 && weekend.every(event => ['2026-10-30', '2026-10-31', '2026-11-01'].includes(event.date)));
  assert.ok(filterEvents(all, { query: 'bullingdon', date: 'all', soldOutOnly: false }, now, 'oxford').every(event => /bullingdon/i.test(`${event.venue} ${event.title} ${event.address}`)));
  assert.ok(filterEvents(all, { query: '', date: 'all', soldOutOnly: true }, now, 'oxford').every(event => event.availabilityAtCheck === 'sold_out'));
  assert.ok(filterEvents(all, { query: '', date: 'all', soldOutOnly: false }, now, 'oxford').every(event => event.date >= '2026-10-28'));
  assert.equal(matchesDate({ date: '2026-10-29' }, 'tomorrow', now, 'oxford'), true);
});

test('asking price defaults to FIXR last available price when known', () => {
  assert.equal(defaultAskingPrice({ lastTicketPrice: 18.5 }), '18.50');
  assert.equal(defaultAskingPrice({}), '');
  assert.equal(defaultAskingPrice(null), '');
});

test('screenshots need exactly one readable QR code', () => {
  assert.equal(assessQrScan([]).ok, false);
  assert.equal(assessQrScan([{ type: 'qr', data: '' }]).ok, false);
  assert.equal(assessQrScan([{ type: 'qr', data: 'FIXR-123456789' }]).ok, true);
  assert.equal(assessQrScan([{ type: 'qr', data: 'A-1234' }, { type: 'qr', data: 'A-1234' }]).ok, true);
  assert.equal(assessQrScan([{ type: 'qr', data: 'A-1234' }, { type: 'qr', data: 'B-5678' }]).ok, false);
  assert.equal(assessQrScan([{ type: 'ean13', data: '123456789012' }]).ok, false);
});

test('custom event times respect UK daylight saving and SAST', () => {
  assert.equal(eventStart('2026-10-24', '22:00', 'Europe/London'), '2026-10-24T21:00:00.000Z');
  assert.equal(eventStart('2026-11-24', '22:00', 'Europe/London'), '2026-11-24T22:00:00.000Z');
  assert.equal(eventStart('2026-03-29', '01:30', 'Europe/London'), null);
});

test('saved state keeps guides and transfer statuses, rejects unknown ones', () => {
  const state = { member: { name: 'Tester', bio: '', accent: 'lime', method: 'Email', joined: '2026-10-03T00:00:00Z', city: 'oxford', guides: ['sell'] },
    listings: [{ id: '1', event: { id: '9', title: 'Night', venue: 'Bridge', startAt: '2026-11-01T20:00:00Z', timezone: 'Europe/London' }, provider: 'FIXR', ticketType: 'GA', price: 20, currency: 'GBP', status: 'transfer_sent', qrChecked: true, createdAt: '2026-10-03T00:00:00Z' }] };
  assert.deepEqual(decodeState(JSON.stringify(state)), state);
  assert.throws(() => decodeState(JSON.stringify({ ...state, member: { ...state.member, guides: ['admin'] } })));
  assert.throws(() => decodeState(JSON.stringify({ ...state, listings: [{ ...state.listings[0], status: 'sold' }] })));
});

test('feed URL is built per city and requires HTTPS', () => {
  assert.equal(feedUrl('https://api.example/v1/catalogue/', 'cape_town'), 'https://api.example/v1/catalogue/cape_town');
  assert.equal(feedUrl('https://api.example/v1/catalogue/oxford', 'cape_town'), 'https://api.example/v1/catalogue/cape_town');
  assert.equal(feedUrl('http://api.example/v1/catalogue', 'oxford'), null);
  assert.equal(feedUrl(undefined, 'oxford'), null);
});
