import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { TicketItem } from '../../data/tickets';
import { TicketStub } from './TicketStub';

export function TicketCard({ ticket }: { ticket: TicketItem }) {
  const { colors } = useTheme();
  const isPast = ticket.when === 'past';

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <ImageBackground
        source={ticket.image}
        style={styles.hero}
        imageStyle={isPast ? styles.heroImagePast : undefined}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: isPast ? 'rgba(20,16,43,0.35)' : 'rgba(20,16,43,0.12)' }]} />

        {isPast && (
          <View style={[styles.usedChip, { backgroundColor: colors.background }]}>
            <Text style={[styles.usedText, { color: colors.textPrimary }]}>USED</Text>
          </View>
        )}

        <TicketStub ticket={ticket} muted={isPast} />
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
  heroImagePast: {
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  usedChip: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  usedText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
