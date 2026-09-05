import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { TicketItem, TicketVariant } from '../../data/tickets';

const QR = require('../../../assets/icons/qr-code.png');

const NOTCH_SIZE = 20;

function variantStyle(variant: TicketVariant, colors: ReturnType<typeof useTheme>['colors']) {
  switch (variant) {
    case 'general':
      return { bg: colors.coral, text: '#FFFFFF', sub: 'rgba(255,255,255,0.78)', dash: 'rgba(255,255,255,0.4)' };
    case 'vip':
      return { bg: colors.ink, text: colors.lime, sub: 'rgba(245,240,230,0.7)', dash: 'rgba(245,240,230,0.35)' };
    case 'verified':
      return { bg: colors.cream, text: '#14102B', sub: 'rgba(20,16,43,0.6)', dash: 'rgba(20,16,43,0.3)' };
    case 'escrow':
      return { bg: colors.lime, text: '#14102B', sub: 'rgba(20,16,43,0.65)', dash: 'rgba(20,16,43,0.35)' };
  }
}

export function TicketStub({ ticket }: { ticket: TicketItem }) {
  const { colors } = useTheme();
  const v = variantStyle(ticket.variant, colors);

  return (
    <View style={[styles.stub, { backgroundColor: v.bg }]}>
      <View style={[styles.notch, styles.notchTop, { backgroundColor: colors.background }]} />
      <View style={[styles.notch, styles.notchBottom, { backgroundColor: colors.background }]} />

      <View style={styles.left}>
        <Text style={[styles.code, { color: v.sub }]}>{ticket.code}</Text>
        <Text style={[styles.eventTitle, { color: v.text }]} numberOfLines={1}>
          {ticket.eventTitle}
        </Text>
        <Text style={[styles.typeLabel, { color: v.sub }]}>{ticket.ticketTypeLabel}</Text>
        <View style={styles.spacer} />
        <Text style={[styles.venue, { color: v.sub }]} numberOfLines={1}>
          {ticket.venue} · {ticket.city}
        </Text>
        <Text style={[styles.venue, { color: v.sub }]}>
          {ticket.day} {ticket.date} {ticket.month} · {ticket.time}
        </Text>
      </View>

      <View style={[styles.dashLine, { borderLeftColor: v.dash }]} />

      <View style={styles.right}>
        <View style={styles.qrWrap}>
          <Image source={QR} style={styles.qr} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stub: {
    position: 'absolute',
    left: 72,
    right: 6,
    top: 24,
    bottom: 24,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    right: 94,
    marginLeft: -NOTCH_SIZE / 2,
  },
  notchTop: {
    top: -NOTCH_SIZE / 2,
  },
  notchBottom: {
    bottom: -NOTCH_SIZE / 2,
  },
  left: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 14,
    justifyContent: 'flex-start',
  },
  spacer: {
    flex: 1,
    minHeight: 6,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 7,
  },
  eventTitle: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 24,
    lineHeight: 27,
  },
  typeLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  venue: {
    fontFamily: fonts.mono,
    fontSize: 13,
    lineHeight: 18,
  },
  dashLine: {
    width: 1,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  right: {
    width: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWrap: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: 'rgba(20,16,43,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  qr: {
    width: '100%',
    height: '100%',
  },
});
