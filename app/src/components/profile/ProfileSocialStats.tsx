import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';

export function ProfileSocialStats({
  countryFlag,
  following,
  followers,
}: {
  countryFlag: string;
  following: number;
  followers: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={styles.flag}>{countryFlag}</Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Pressable style={styles.stat} accessibilityRole="button" accessibilityLabel={`${following} following`}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{following}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Following</Text>
      </Pressable>

      <Pressable style={styles.stat} accessibilityRole="button" accessibilityLabel={`${followers} followers`}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{followers}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Followers</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 20,
  },
  flag: {
    fontSize: 26,
  },
  divider: {
    width: 1,
    height: 28,
  },
  stat: {
    alignItems: 'flex-start',
  },
  value: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 22,
    lineHeight: 25,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    marginTop: 1,
  },
});
