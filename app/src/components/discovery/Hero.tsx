import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';

export function Hero() {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[type.hero, { color: colors.textPrimary, marginBottom: 18 }]}>
        SOLD OUT{'\n'}DOESN'T MEAN{'\n'}YOU'RE OUT.
      </Text>
      <Text style={[type.body, { color: colors.textSecondary }]}>
        Buy and resell event tickets securely.{'\n'}Your money doesn't move until the ticket does.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginBottom: 28,
  },
});
