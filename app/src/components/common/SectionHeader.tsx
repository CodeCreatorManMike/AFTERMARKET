import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { type, fonts } from '../../theme/typography';

export function SectionHeader({
  title,
  action,
  onAction,
  showArrow = true,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  showArrow?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[type.sectionTitle, { color: colors.textPrimary }]} accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          accessibilityRole="link"
          accessibilityLabel={`${action} ${title}`}
        >
          <Text style={[styles.action, { color: colors.coral }]}>
            {action}
            {showArrow ? ' →' : ''}
          </Text>
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
