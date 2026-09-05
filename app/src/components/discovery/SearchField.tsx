import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { SearchIcon } from '../common/Icons';

export function SearchField({ placeholder = 'Search events, venues, organisers...' }: { placeholder?: string }) {
  return (
    <Pressable style={styles.wrap}>
      <SearchIcon size={22} color={colors.coral} strokeWidth={2.4} />
      <Text style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.clear}>
        <Text style={styles.clearGlyph}>×</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 60,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 10,
    marginBottom: 12,
    shadowColor: '#14102B',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  placeholder: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: colors.textMuted,
  },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearGlyph: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 16,
  },
});
