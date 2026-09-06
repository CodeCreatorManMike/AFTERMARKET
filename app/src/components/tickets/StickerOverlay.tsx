import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { PlacedSticker } from '../../data/stickerPlacement';

export function StickerOverlay({ placements }: { placements: PlacedSticker[] }) {
  return (
    <>
      {placements.map((p, i) => (
        <Image
          key={i}
          source={p.source}
          resizeMode="contain"
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.sticker,
            {
              width: p.size,
              height: p.size,
              top: `${p.topPct}%`,
              left: `${p.leftPct}%`,
              transform: [
                { translateX: -p.size / 2 },
                { translateY: -p.size / 2 },
                { rotate: `${p.rotation}deg` },
              ],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    zIndex: 5,
  },
});
