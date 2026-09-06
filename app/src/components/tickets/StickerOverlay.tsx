import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { hashString, stickers } from '../../data/stickers';

// Seeded PRNG (mulberry32) so each ticket's sticker is stable across
// re-renders but every ticket gets an independently chaotic placement —
// not derived from the same one or two hash bits, which is what made
// every sticker land in roughly the same spot at roughly the same size.
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

// Human/scrapbook feel: a real person doesn't center a sticker and
// resize it proportionally — sizes and positions swing wildly, and a
// sticker slapped near an edge often mostly hangs off the card, with
// only a sliver caught inside it once the card clips it.
export function StickerOverlay({ id }: { id: string }) {
  const rng = mulberry32(hashString(id));

  const sticker = stickers[Math.floor(rng() * stickers.length) % stickers.length];
  const rotation = -55 + rng() * 110; // -55..55deg, genuinely chaotic
  const size = 90 + rng() * 190; // 90..280 — some small, some huge and overflowing

  // Center-biased (triangular) distribution so most land mid-card, but
  // the tails reach past the edges — that's what gives the occasional
  // "barely showing" sticker once the card clips it.
  const centerBias = (spread: number) => 50 + ((rng() + rng()) / 2 - 0.5) * spread;
  const topPct = centerBias(140); // can swing well past 0/100
  const leftPct = centerBias(140);

  return (
    <Image
      source={sticker}
      resizeMode="contain"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.sticker,
        {
          width: size,
          height: size,
          top: `${topPct}%`,
          left: `${leftPct}%`,
          transform: [{ translateX: -size / 2 }, { translateY: -size / 2 }, { rotate: `${rotation}deg` }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    zIndex: 5,
  },
});
