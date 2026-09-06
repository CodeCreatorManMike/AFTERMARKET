import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { pickHeroQuip } from '../../data/heroQuips';

export function Hero() {
  const { colors } = useTheme();
  // Picked once per mount (i.e. once per app load), not on every
  // re-render — the whole point is it's stable while browsing, and
  // different again next time the app opens.
  const [quip] = useState(pickHeroQuip);

  return (
    <View style={styles.wrap}>
      <Text style={[type.hero, { color: colors.textPrimary, marginBottom: 18 }]}>
        {quip.lines.map((line, i) => (
          <Text
            key={i}
            style={line.highlight ? { color: line.highlight === 'coral' ? colors.coral : colors.lime } : undefined}
          >
            {line.text}
            {i < quip.lines.length - 1 ? '\n' : ''}
          </Text>
        ))}
      </Text>
      <Text style={[type.body, { color: colors.textSecondary }]}>{quip.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginBottom: 28,
  },
});
