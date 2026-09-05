import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, fonts } from '../../theme/typography';

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[type.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {action ? (
        <Pressable hitSlop={8}>
          <Text style={[styles.action, { color: colors.coral }]}>{action} →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
});
