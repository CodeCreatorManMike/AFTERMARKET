import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { ChevronDownIcon, MoonIcon, SunIcon } from '../common/Icons';

const LOGO = require('../../../assets/logo/aftermarket-mark.png');

export function HomeTopBar({ city = 'CAPE TOWN' }: { city?: string }) {
  const { colors, scheme, toggle } = useTheme();
  return (
    <View style={styles.row}>
      <Image source={LOGO} style={styles.brandMark} resizeMode="contain" />

      <View style={styles.right}>
        <Pressable
          style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={toggle}
          hitSlop={8}
        >
          {scheme === 'dark' ? (
            <SunIcon size={15} color={colors.lime} strokeWidth={2} />
          ) : (
            <MoonIcon size={15} color={colors.ink} strokeWidth={2} />
          )}
        </Pressable>

        <Pressable style={styles.locationTrigger} hitSlop={8}>
          <Text style={[styles.locationText, { color: colors.textPrimary }]}>{city}</Text>
          <ChevronDownIcon size={13} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandMark: {
    width: 74,
    height: 40,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: fonts.displayBold,
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
