import { hashString, stickers } from './stickers';

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
  const centerBias = () => 50 + ((rng() + rng()) / 2 - 0.5) * 140;
  return {
    source: stickers[stickerIndex],
    rotation: -55 + rng() * 110,
    size: 90 + rng() * 190,
    topPct: centerBias(),
    leftPct: centerBias(),
  };
}

// Assigns 1 or 2 stickers per ticket (id order matters for stability),
// drawing from a shuffled, non-repeating pool so no two tickets on the
// same page ever get the same sticker image — only reshuffling (and
// therefore allowing a repeat) if we genuinely run out.
export function assignStickers(ticketIds: string[]): Record<string, PlacedSticker[]> {
  const rng = mulberry32(hashString(ticketIds.join('|')) || 1);
  let pool = shuffled(stickers.length, rng);
  let cursor = 0;

  const result: Record<string, PlacedSticker[]> = {};
  for (const id of ticketIds) {
    const count = rng() < 0.3 ? 2 : 1;
    const placements: PlacedSticker[] = [];
    for (let k = 0; k < count; k++) {
      if (cursor >= pool.length) {
        pool = shuffled(stickers.length, rng);
        cursor = 0;
      }
      placements.push(placement(pool[cursor], rng));
      cursor += 1;
    }
    result[id] = placements;
  }
  return result;
}
