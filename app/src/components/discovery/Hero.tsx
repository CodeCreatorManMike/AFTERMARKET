import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { HERO_QUIPS, HighlightIntent, pickHeroQuipIndex } from '../../data/heroQuips';

const CYCLE_MS = 25000;

export function Hero() {
  const { colors, scheme } = useTheme();
  const [index, setIndex] = useState(() => pickHeroQuipIndex());

  useEffect(() => {
    // Ticks on a fixed interval regardless of scroll position — this
    // isn't tied to visibility, so it keeps cycling even while the
    // user is scrolled further down the Home feed.
    const id = setInterval(() => {
      setIndex((current) => pickHeroQuipIndex(current));
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const quip = HERO_QUIPS[index];

  // Day mode's page background IS green/lime, so a "trust" highlight
  // can never render in lime there — it'd disappear. Day mode gets
  // Coral or Cream only; night mode uses the real Coral/Lime split.
  const highlightColor = (intent: HighlightIntent) => {
    if (scheme === 'light') {
      return intent === 'trust' ? colors.cream : colors.coral;
    }
    return intent === 'trust' ? colors.lime : colors.coral;
  };

  return (
    <View style={styles.wrap}>
      <Text style={[type.hero, { color: colors.textPrimary, marginBottom: 18 }]}>
        {quip.lines.map((line, i) => (
          <Text key={i} style={line.highlight ? { color: highlightColor(line.highlight) } : undefined}>
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
