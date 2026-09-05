import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { CalendarIcon, ChevronDownIcon, MapPinIcon, SlidersIcon } from '../common/Icons';

export function FilterRow() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Pressable style={[styles.pill, { flex: 1.15, borderColor: colors.border }]}>
        <MapPinIcon size={16} color={colors.textPrimary} />
        <Text style={[styles.pillText, { color: colors.textPrimary }]} numberOfLines={1}>
          Cape Town
        </Text>
      </Pressable>
      <Pressable style={[styles.pill, { flex: 1.15, borderColor: colors.border }]}>
        <CalendarIcon size={16} color={colors.textPrimary} />
        <Text style={[styles.pillText, { color: colors.textPrimary }]} numberOfLines={1}>
          Any date
        </Text>
        <ChevronDownIcon size={12} color={colors.textPrimary} />
      </Pressable>
      <Pressable style={[styles.iconButton, { borderColor: colors.border }]}>
        <SlidersIcon size={17} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  pill: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  pillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
