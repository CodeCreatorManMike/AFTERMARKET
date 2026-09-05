import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { SearchIcon } from '../common/Icons';

export function SearchField({ placeholder = 'Search events, venues, organisers...' }: { placeholder?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          shadowColor: colors.scheme === 'dark' ? '#000000' : '#14102B',
        },
      ]}
    >
      <SearchIcon size={22} color={colors.coral} strokeWidth={2.4} />
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>{placeholder}</Text>
      <View style={[styles.clear, { backgroundColor: colors.border }]}>
        <Text style={[styles.clearGlyph, { color: colors.textPrimary }]}>×</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 60,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 10,
    marginBottom: 12,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  placeholder: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
  },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearGlyph: {
    fontSize: 14,
    lineHeight: 16,
  },
});
