import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { Badge } from '../../data/profile';

const ICON_SIZE = 80;

// Renders whatever badges it's handed — a profile with 1 earned badge
// and one with all of them both just work, wrapping onto extra rows
// past 4 rather than assuming a fixed count.
export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const { colors } = useTheme();

  if (badges.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Your first badge starts with your first event.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {badges.map((b) => (
        <View key={b.id} style={styles.cardWrap}>
          <Image source={b.icon} style={styles.icon} resizeMode="contain" />
          <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={2}>
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 8,
  },
  cardWrap: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  empty: {
    paddingVertical: 12,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
  },
});
