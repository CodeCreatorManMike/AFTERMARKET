import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeState, eventStart, priceInCents, validContact } from '../src/features/marketplace/model.ts';

test('prices use cents and reject invalid, zero, negative and over-limit values', () => {
  for (const input of ['', '0', '-1', '1.001', '1e3', 'Infinity', 'NaN', '100000.01', '1,20']) assert.equal(priceInCents(input), null, input);
  assert.equal(priceInCents('0.01'), 1);
  assert.equal(priceInCents('19.99'), 1999);
  assert.equal(priceInCents(' 250.5 '), 25050);
  assert.equal(priceInCents('100000'), 10000000);
});
test('event times default to SAST regardless of device timezone, rejecting calendar rollovers', () => {
  assert.equal(eventStart('2028-02-29', '20:30'), '2028-02-29T18:30:00.000Z');
  assert.equal(eventStart('2026-01-01', '00:00'), '2025-12-31T22:00:00.000Z');
  for (const [date, time] of [['2026-02-29', '20:00'], ['2026-04-31', '12:00'], ['2026-12-01', '24:00'], ['2026-12-01', '12:60'], ['26-01-01', '12:00']]) assert.equal(eventStart(date, time), null);
});
test('contact preview validates email and international phone formats', () => {
  assert.equal(validContact('Email', 'test@example.com'), true);
  assert.equal(validContact('Email', 'invalid@'), false);
  assert.equal(validContact('Phone', '+27 82 123 4567'), true);
  assert.equal(validContact('Phone', '0821234567'), false);
  assert.equal(validContact('Phone', '+00'), false);
  assert.equal(validContact('Apple', ''), true);
  assert.equal(validContact('Google', ''), true);
});

test('corrupt persisted previews are rejected before screens render', () => {
  assert.deepEqual(decodeState('{"member":null,"listings":[]}'), { member: null, listings: [] });
  for (const raw of ['null', '{}', '{"member":{},"listings":[]}', '{"member":null,"listings":[{}]}', 'not json']) assert.throws(() => decodeState(raw));
  const state = { member: { name: 'Tester', bio: '', accent: 'coral', method: 'Apple', joined: '2026-10-03T00:00:00Z' }, listings: [{ id: '1', event: { id: 'e1', title: 'Night', venue: 'Cape Town', startAt: '2027-01-01T20:00:00Z' }, provider: 'FIXR', ticketType: 'General', price: 12.99, status: 'draft_review', createdAt: '2026-10-03T00:00:00Z' }] };
  assert.deepEqual(decodeState(JSON.stringify(state)), state);
  state.listings[0].price = -1;
  assert.throws(() => decodeState(JSON.stringify(state)));
});
