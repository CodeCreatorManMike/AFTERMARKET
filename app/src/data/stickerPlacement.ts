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

// Assigns 1, 2, or (occasionally) 3 stickers per ticket, drawing from a
// shuffled, non-repeating pool so nearby tickets on the same page don't
// get handed the same sticker image — only reshuffling (and therefore
// allowing a repeat) once every unique sticker has been used at least
// once, since a long enough list will always outrun a finite pool.
export function assignStickers(ticketIds: string[]): Record<string, PlacedSticker[]> {
  const rng = mulberry32(hashString(ticketIds.join('|')) || 1);
  let pool = shuffled(stickers.length, rng);
  let cursor = 0;

  const result: Record<string, PlacedSticker[]> = {};
  for (const id of ticketIds) {
    const roll = rng();
    const count = roll < 0.12 ? 3 : roll < 0.45 ? 2 : 1;
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
