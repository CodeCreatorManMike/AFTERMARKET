import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { SearchIcon } from '../common/Icons';

export function SearchField({ value, onChangeText, placeholder = 'Search events or venues…' }: { value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, shadowColor: colors.scheme === 'dark' ? '#000000' : '#14102B' }]}>
      <SearchIcon size={22} color={colors.coral} strokeWidth={2.4} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted}
        accessibilityLabel="Search events" returnKeyType="search" autoCorrect={false} clearButtonMode="never"
        style={[styles.input, { color: colors.textPrimary }]} />
      {!!value && <Pressable onPress={() => onChangeText('')} style={[styles.clear, { backgroundColor: colors.border }]} hitSlop={12} accessibilityRole="button" accessibilityLabel="Clear search">
        <Text style={[styles.clearGlyph, { color: colors.textPrimary }]}>×</Text>
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 58, borderRadius: 22, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 10, marginBottom: 12, shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  input: { flex: 1, height: '100%', fontFamily: fonts.body, fontSize: 16 },
  clear: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearGlyph: { fontSize: 15, lineHeight: 17 },
});
