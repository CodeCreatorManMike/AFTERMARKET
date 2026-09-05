import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { ClockIcon, XIcon } from '../common/Icons';

export function RecentSearchRow({ label, onRemove }: { label: string; onRemove: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <ClockIcon size={17} color={colors.textMuted} strokeWidth={1.8} />
      <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>
        {label}
      </Text>
      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label} from recent searches`}
      >
        <XIcon size={15} color={colors.textMuted} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
  },
});
