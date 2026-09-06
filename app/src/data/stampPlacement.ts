import { RANDOM_STAMPS } from './stamps';
import { drawNext, mulberry32, PlacedOverlay, randomPlacement, shuffled } from './randomOverlay';

export type PlacedStamp = PlacedOverlay;

const STAMP_CHANCE = 0.4; // most tickets get none — this is occasional, not guaranteed

// Unlike stickers (always >=1, guaranteed), stamps are a lighter-touch
// accent: each ticket independently rolls a chance of getting exactly
// one, so plenty of past tickets have no stamp at all. When two
// adjacent tickets both roll a stamp, they still never get the same
// stamp image, same rule as stickers.
export function assignStamps(ticketIds: string[]): Record<string, PlacedStamp[]> {
  const rng = mulberry32(Math.floor(Math.random() * 2 ** 31) || 1);
  const pool = shuffled(RANDOM_STAMPS.length, rng);
  const cursor = { i: 0 };

  const result: Record<string, PlacedStamp[]> = {};
  let previousIndices = new Set<number>();

  for (const id of ticketIds) {
    if (rng() >= STAMP_CHANCE) {
      result[id] = [];
      previousIndices = new Set();
      continue;
    }

    const stampIndex = drawNext(pool, cursor, rng, previousIndices, RANDOM_STAMPS.length);
    result[id] = [randomPlacement(stampIndex, RANDOM_STAMPS, rng, [110, 220], [-35, 35])];
    previousIndices = new Set([stampIndex]);
  }
  return result;
}
