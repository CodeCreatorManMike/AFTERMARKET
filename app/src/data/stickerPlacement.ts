import { stickers } from './stickers';

export interface PlacedSticker {
  source: number;
  rotation: number;
  size: number;
  topPct: number;
  leftPct: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(length: number, rng: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function placement(stickerIndex: number, rng: () => number): PlacedSticker {
  // Biased toward the left/centre — over the ticket text, not tucked
  // away by the QR side — while the wide spread still lets it land
  // anywhere, including mostly off-card.
  const biased = (center: number, spread: number) => center + ((rng() + rng()) / 2 - 0.5) * spread;
  return {
    source: stickers[stickerIndex],
    rotation: -60 + rng() * 120,
    size: 140 + rng() * 220,
    topPct: biased(50, 150),
    leftPct: biased(32, 150),
  };
}

// Draws the next sticker index from `pool` starting at `cursor`, skipping
// past (via swap, not removal — keeps the rest of the shuffle intact) any
// index in `avoid`. Reshuffles (excluding `avoid` where possible) once the
// pool runs out.
function drawNext(pool: number[], cursor: { i: number }, rng: () => number, avoid: Set<number>): number {
  if (cursor.i >= pool.length) {
    pool.splice(0, pool.length, ...shuffled(stickers.length, rng));
    cursor.i = 0;
  }
  let j = cursor.i;
  while (avoid.has(pool[j]) && j < pool.length - 1) {
    j += 1;
  }
  const value = pool[j];
  pool[j] = pool[cursor.i];
  pool[cursor.i] = value;
  cursor.i += 1;
  return value;
}

// Assigns 1, 2, or (occasionally) 3 stickers per ticket, drawing from a
// shuffled, non-repeating pool so nearby tickets on the same page don't
// get handed the same sticker image — only reshuffling (and therefore
// allowing a repeat) once every unique sticker has been used at least
// once, since a long enough list will always outrun a finite pool. Also
// explicitly avoids handing a ticket any sticker its immediately
// preceding neighbor got, so the same artwork never lands on two
// adjacent cards.
export function assignStickers(ticketIds: string[]): Record<string, PlacedSticker[]> {
  // Re-seeded from true randomness on every call (i.e. every app
  // load/reload), so sticker choice/size/rotation/position are always
  // different — not tied to the ticket ids, which never change.
  const rng = mulberry32(Math.floor(Math.random() * 2 ** 31) || 1);
  const pool = shuffled(stickers.length, rng);
  const cursor = { i: 0 };

  const result: Record<string, PlacedSticker[]> = {};
  let previousIndices = new Set<number>();

  for (const id of ticketIds) {
    const roll = rng();
    const count = roll < 0.12 ? 3 : roll < 0.45 ? 2 : 1;
    const placements: PlacedSticker[] = [];
    const currentIndices = new Set<number>();

    for (let k = 0; k < count; k++) {
      const stickerIndex = drawNext(pool, cursor, rng, previousIndices);
      currentIndices.add(stickerIndex);
      placements.push(placement(stickerIndex, rng));
    }

    result[id] = placements;
    previousIndices = currentIndices;
  }
  return result;
}
