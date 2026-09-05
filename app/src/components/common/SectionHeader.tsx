import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { type, fonts } from '../../theme/typography';

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text style={type.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable hitSlop={8}>
          <Text style={styles.action}>{action} →</Text>
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
    color: colors.coral,
  },
});
