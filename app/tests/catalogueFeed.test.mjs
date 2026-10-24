import test from 'node:test';
import assert from 'node:assert/strict';
import { validCatalogueResponse } from '../src/features/marketplace/catalogueFeed.ts';

const event = { id: '123', title: 'Demo night', venue: 'Bridge Oxford', date: '2026-10-31',
  startAt: '2026-10-31T22:00:00Z', endAt: '2026-11-01T03:00:00Z', address: 'Oxford',
  url: 'https://fixr.co/event/demo-night-tickets-123',
  imageUrl: 'https://fixr-cdn.fixr.co/images/event/demo.jpeg',
  excerpt: 'A short summary', description: 'An organiser-approved full description',
  availabilityAtCheck: 'sold_out' };

test('app accepts an approved catalogue response and rejects duplicate or unsafe links', () => {
  const feed = { source: 'fixr', city: 'oxford', suppliedAt: '2026-10-24T06:00:00Z', events: [event] };
  assert.equal(validCatalogueResponse(feed), true);
  assert.equal(validCatalogueResponse({ ...feed, events: [event, event] }), false);
  assert.equal(validCatalogueResponse({ ...feed, events: [{ ...event, url: 'https://evil.example/event/demo-tickets-123' }] }), false);
  assert.equal(validCatalogueResponse({ ...feed, events: [{ ...event, imageUrl: 'javascript:alert(1)' }] }), false);
});
