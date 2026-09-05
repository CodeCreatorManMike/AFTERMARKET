import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useOverlay } from '../../navigation/OverlayContext';
import { fonts } from '../../theme/typography';
import { GearIcon, MoonIcon, SunIcon } from '../common/Icons';

const LOGO = require('../../../assets/logo/aftermarket-mark.png');

export function HomeTopBar() {
  const { colors, scheme, toggle } = useTheme();
  const { openSettings } = useOverlay();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.row}>
      <Image
        source={LOGO}
        style={styles.brandMark}
        resizeMode="contain"
        accessible
        accessibilityRole="image"
        accessibilityLabel="Aftermarket"
      />

      <View style={styles.right}>
        <View
          style={[styles.dayNight, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessible
          accessibilityRole="switch"
          accessibilityLabel="Appearance"
          accessibilityValue={{ text: isDark ? 'Night' : 'Day' }}
          accessibilityState={{ checked: isDark }}
          accessibilityHint="Double tap to switch between day and night mode"
        >
          <Pressable
            onPress={() => !isDark && toggle()}
            hitSlop={6}
            style={[styles.dayNightHalf, isDark && { backgroundColor: colors.lime }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <MoonIcon size={14} color={isDark ? '#14102B' : colors.textMuted} strokeWidth={2} />
          </Pressable>
          <Pressable
            onPress={() => isDark && toggle()}
            hitSlop={6}
            style={[styles.dayNightHalf, !isDark && { backgroundColor: colors.coral }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <SunIcon size={14} color={!isDark ? '#14102B' : colors.textMuted} strokeWidth={2} />
          </Pressable>
        </View>

        <Pressable
          style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={openSettings}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <GearIcon size={17} color={colors.textPrimary} />
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
  dayNight: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  dayNightHalf: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
