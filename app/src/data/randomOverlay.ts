// Shared primitives for "randomly scatter images from a pool across a
// list of tickets, never repeating on two adjacent ones" — used by both
// the sticker pack and the stamp pack.

export interface PlacedOverlay {
  source: number;
  rotation: number;
  size: number;
  topPct: number;
  leftPct: number;
}

export function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled(length: number, rng: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Draws the next index from `pool` starting at `cursor`, skipping past
 * (via swap, not removal) any index in `avoid`. Reshuffles once the pool
 * runs out (against `poolLength`). */
export function drawNext(
  pool: number[],
  cursor: { i: number },
  rng: () => number,
  avoid: Set<number>,
  poolLength: number
): number {
  if (cursor.i >= pool.length) {
    pool.splice(0, pool.length, ...shuffled(poolLength, rng));
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

export function randomPlacement(
  sourceIndex: number,
  sources: number[],
  rng: () => number,
  sizeRange: [number, number] = [140, 360],
  rotationRange: [number, number] = [-60, 60]
): PlacedOverlay {
  // Biased toward the left/centre — over the ticket text, not tucked
  // away by the QR side — while the wide spread still lets it land
  // anywhere, including mostly off-card.
  const biased = (center: number, spread: number) => center + ((rng() + rng()) / 2 - 0.5) * spread;
  const [minSize, maxSize] = sizeRange;
  const [minRot, maxRot] = rotationRange;
  return {
    source: sources[sourceIndex],
    rotation: minRot + rng() * (maxRot - minRot),
    size: minSize + rng() * (maxSize - minSize),
    topPct: biased(50, 150),
    leftPct: biased(32, 150),
  };
}
