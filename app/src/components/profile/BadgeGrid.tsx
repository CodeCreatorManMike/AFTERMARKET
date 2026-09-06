import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { Badge } from '../../data/profile';
import { BoltIcon, DiagonalArrowIcon, PlaneIcon, TicketIcon } from '../common/Icons';

const ICONS = {
  ticket: TicketIcon,
  diagonalArrow: DiagonalArrowIcon,
  plane: PlaneIcon,
  bolt: BoltIcon,
};

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {badges.map((b) => {
        const Icon = ICONS[b.icon];
        return (
          <View key={b.id} style={styles.cardWrap}>
            <View style={[styles.card, { backgroundColor: b.bg }]}>
              <Icon size={24} color={b.iconColor} />
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={2}>
              {b.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  cardWrap: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
});
