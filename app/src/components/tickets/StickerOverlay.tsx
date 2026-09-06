import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { hashString, stickers } from '../../data/stickers';

// Scrapbook-style "attended" sticker, randomly picked and placed per ticket
// (but stable per ticket id), biased toward the card's centre, with a
// random rotation and a size that lets it bleed off the card edges —
// the card's own overflow:hidden gives the "cut off" scrapbook clip.
export function StickerOverlay({ id }: { id: string }) {
  const h = hashString(id);

  const sticker = stickers[h % stickers.length];
  const rotation = -24 + (h % 49); // -24..24 deg
  const size = 140 + (Math.floor(h / 7) % 60); // 140..199
  const topPct = 32 + (Math.floor(h / 3) % 30); // 32..61 %
  const leftPct = 26 + (Math.floor(h / 11) % 38); // 26..63 %

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
