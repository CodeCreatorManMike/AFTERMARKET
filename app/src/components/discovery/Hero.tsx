import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { type } from '../../theme/typography';

export function Hero() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>
        SOLD OUT{'\n'}DOESN'T MEAN{'\n'}YOU'RE OUT.
      </Text>
      <Text style={styles.body}>
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
  title: {
    ...type.hero,
    color: colors.ink,
    marginBottom: 18,
  },
  body: {
    ...type.body,
    color: colors.textSecondary,
  },
});
