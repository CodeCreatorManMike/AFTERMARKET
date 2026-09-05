import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { categories } from '../../data/events';

export function CategoryScroller() {
  const [active, setActive] = useState<string>('all');
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {categories.map((c) => {
        const isActive = c.key === active;
        return (
          <Pressable
            key={c.key}
            onPress={() => setActive(c.key)}
            style={[
              styles.chip,
              isActive
                ? { backgroundColor: colors.coral }
                : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? '#14102B' : colors.textPrimary },
                isActive && styles.chipTextActive,
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 30,
  },
  row: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13.5,
  },
  chipTextActive: {
    fontFamily: fonts.bodySemiBold,
  },
});
