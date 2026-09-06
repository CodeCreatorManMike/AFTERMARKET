import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, fonts } from '../../theme/typography';

export function ProfileIdentity({ username, memberSince }: { username: string; memberSince: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[type.pageTitle, { color: colors.textPrimary, fontSize: 26, lineHeight: 30 }]}>
        {username}
      </Text>
      <Text style={[styles.since, { color: colors.textSecondary }]}>Member since {memberSince}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 4,
  },
  since: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    marginTop: 2,
  },
});
