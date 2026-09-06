import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { Badge } from '../../data/profile';

const ICON_SIZE = 80;

// Horizontal so any number of earned badges works the same way — a
// profile with 1 and one with all 10 both just fit, scrolling instead
// of wrapping once there's more than fits on screen.
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {badges.map((b) => (
        <View key={b.id} style={styles.cardWrap}>
          <Image source={b.icon} style={styles.icon} resizeMode="contain" />
          <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={2}>
            {b.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 16,
    paddingRight: 20,
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
    fontFamily: fonts.bodySemiBold,
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
