import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { TicketItem } from '../../data/tickets';
import { PlacedSticker } from '../../data/stickerPlacement';
import { TicketStub } from './TicketStub';
import { StickerOverlay } from './StickerOverlay';

export function TicketCard({ ticket, stickerPlacements }: { ticket: TicketItem; stickerPlacements?: PlacedSticker[] }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <ImageBackground source={ticket.image} style={styles.hero} resizeMode="cover">
        <View style={styles.overlay} />
        <TicketStub ticket={ticket} />
        {stickerPlacements && <StickerOverlay placements={stickerPlacements} />}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 210,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 18,
  },
  hero: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,16,43,0.12)',
  },
});
