import test from 'node:test';
import assert from 'node:assert/strict';
import { oxfordDate, oxfordFixrEvents, visibleOxfordEvents } from '../src/data/oxfordFixrEvents.ts';

test('Oxford snapshot has unique direct FIXR IDs and event imagery', () => {
  assert.equal(oxfordFixrEvents.length, 84);
  assert.equal(new Set(oxfordFixrEvents.map(event => event.id)).size, 84);
  for (const event of oxfordFixrEvents) {
    assert.match(event.url, new RegExp(`^https://fixr\\.co/event/.+-tickets-${event.id}$`));
    assert.match(event.imageUrl, /^https:\/\/fixr-cdn\.fixr\.co\/images\//);
    assert.ok(event.date >= '2026-10-24' && event.date <= '2026-11-01');
    if (event.startAt && event.endAt) assert.ok(new Date(event.endAt) > new Date(event.startAt));
  }
});

test('ended Oxford events disappear at their actual finish, including after midnight', () => {
  const fishies = '821431366';
  assert.ok(visibleOxfordEvents(new Date('2026-10-25T02:59:59Z')).some(event => event.id === fishies));
  assert.ok(!visibleOxfordEvents(new Date('2026-10-25T03:00:00Z')).some(event => event.id === fishies));
  assert.equal(oxfordDate(new Date('2026-10-24T23:30:00Z')), '2026-10-25');
  const dateOnly = '94608818';
  assert.ok(visibleOxfordEvents(new Date('2026-10-31T23:59:00Z')).some(event => event.id === dateOnly));
  assert.ok(!visibleOxfordEvents(new Date('2026-11-01T00:00:00Z')).some(event => event.id === dateOnly));
  assert.ok(visibleOxfordEvents(new Date('2026-11-01T01:00:00Z')).some(event => event.id === '328549350'));
  assert.equal(visibleOxfordEvents(new Date('2026-11-02T03:00:00Z')).length, 0);
});
