import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { TicketIcon } from '../common/Icons';

export function ProfileActivityStats({ eventsAttended, ticketsSold }: { eventsAttended: number; ticketsSold: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      <View style={styles.stat}>
        <View style={styles.statTop}>
          <TicketIcon size={18} color={colors.textPrimary} />
          <Text style={[styles.value, { color: colors.textPrimary }]}>{eventsAttended}</Text>
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Events attended</Text>
      </View>
      <View style={[styles.centerDivider, { backgroundColor: colors.border }]} />
      <View style={styles.stat}>
        <View style={styles.statTop}>
          <TicketIcon size={18} color={colors.textPrimary} />
          <Text style={[styles.value, { color: colors.textPrimary }]}>{ticketsSold}</Text>
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tickets sold</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  centerDivider: {
    width: 1,
  },
  value: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 19,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
});
