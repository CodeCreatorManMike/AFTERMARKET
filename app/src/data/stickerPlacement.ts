import { stickers } from './stickers';
import { drawNext, mulberry32, PlacedOverlay, randomPlacement, shuffled } from './randomOverlay';

export type PlacedSticker = PlacedOverlay;

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
      const stickerIndex = drawNext(pool, cursor, rng, previousIndices, stickers.length);
      currentIndices.add(stickerIndex);
      placements.push(randomPlacement(stickerIndex, stickers, rng));
    }

    result[id] = placements;
    previousIndices = currentIndices;
  }
  return result;
}
