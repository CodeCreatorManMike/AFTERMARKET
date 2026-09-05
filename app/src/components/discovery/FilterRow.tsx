import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { CalendarIcon, ChevronDownIcon, MapPinIcon, SlidersIcon } from '../common/Icons';

export function FilterRow() {
  return (
    <View style={styles.row}>
      <Pressable style={[styles.pill, { flex: 1.15 }]}>
        <MapPinIcon size={16} color={colors.ink} />
        <Text style={styles.pillText} numberOfLines={1}>
          Cape Town
        </Text>
      </Pressable>
      <Pressable style={[styles.pill, { flex: 1.15 }]}>
        <CalendarIcon size={16} color={colors.ink} />
        <Text style={styles.pillText} numberOfLines={1}>
          Any date
        </Text>
        <ChevronDownIcon size={12} color={colors.ink} />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <SlidersIcon size={17} color={colors.ink} />
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
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  pillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
