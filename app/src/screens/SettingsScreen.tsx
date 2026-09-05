import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { type, fonts } from '../theme/typography';

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const { colors, scheme, toggle } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Settings</Text>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
          style={[styles.closeButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.closeGlyph, { color: colors.textPrimary }]}>×</Text>
        </Pressable>
      </View>

      <View style={[styles.row, { borderColor: colors.border }]}>
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>Appearance</Text>
        <Pressable
          onPress={toggle}
          style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel={`Currently ${scheme}. Double tap to switch.`}
        >
          <Text style={[styles.pillText, { color: colors.textPrimary }]}>
            {scheme === 'dark' ? 'Night' : 'Day'}
          </Text>
        </Pressable>
      </View>

      <Text style={[type.body, { color: colors.textMuted, marginTop: 20, paddingHorizontal: 20 }]}>
        Account, notifications, privacy, and provider connections will live here.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 20,
    lineHeight: 22,
  },
  row: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
});
