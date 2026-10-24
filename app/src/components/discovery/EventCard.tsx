import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootStack';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { CatalogueEvent, CITIES, City } from '../../data/catalogue';

export function eventDateParts(event: CatalogueEvent, city: City) {
  const instant = event.startAt ? new Date(event.startAt) : new Date(`${event.date}T12:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: event.startAt ? CITIES[city].timezone : 'UTC', ...options }).format(instant);
  return { day: format({ weekday: 'short' }).toUpperCase(), date: format({ day: 'numeric' }), month: format({ month: 'short' }).toUpperCase(), time: event.startAt ? format({ hour: '2-digit', minute: '2-digit' }) : 'TIME ON FIXR' };
}

/** Poster card for a FIXR catalogue event. Tapping opens the Aftermarket event page. */
export function EventCard({ event, city, featured = false }: { event: CatalogueEvent; city: City; featured?: boolean }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [failed, setFailed] = useState(false);
  const parts = eventDateParts(event, city);
  const soldOut = event.availabilityAtCheck === 'sold_out';
  return (
    <Pressable onPress={() => navigation.navigate('Event', { eventId: event.id })} accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${event.venue}, ${parts.day} ${parts.date} ${parts.month}${soldOut ? ', sold out on FIXR' : ''}`}
      style={({ pressed }) => [styles.card, { borderColor: colors.border, backgroundColor: colors.surfaceRaised, opacity: pressed ? 0.85 : 1 }]}>
      <View style={[styles.imageWrap, { height: featured ? Math.min(260, width * 0.62) : Math.min(190, width * 0.48), backgroundColor: colors.ink }]}>
        {failed ? <View style={styles.fallback}><Text style={[styles.fallbackText, { color: colors.lime }]}>FIXR / {CITIES[city].label.toUpperCase()}</Text></View>
          : <Image source={{ uri: event.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} onError={() => setFailed(true)} accessible={false} />}
        {soldOut && <View style={[styles.badge, { backgroundColor: colors.coral }]}><Text style={[styles.badgeText, { color: colors.ink }]}>SOLD OUT ON FIXR</Text></View>}
      </View>
      <View style={styles.meta} importantForAccessibility="no-hide-descendants">
        <View style={[styles.dateBadge, { borderRightColor: colors.border }]}>
          <Text style={[styles.dateDay, { color: colors.textSecondary }]}>{parts.day}</Text>
          <Text style={[styles.dateNum, { color: colors.textPrimary }]}>{parts.date}</Text>
          <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>{parts.month}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{event.title}</Text>
          <Text style={[styles.venue, { color: colors.textSecondary }]} numberOfLines={1}>{event.venue} · {parts.time}</Text>
          <Text style={[styles.tag, { color: soldOut ? colors.coral : colors.textMuted }]}>{soldOut ? 'FIND A RESALE SPARE →' : 'ON SALE ON FIXR · SELL A SPARE →'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, marginBottom: 16 },
  imageWrap: { width: '100%', position: 'relative' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1 },
  badge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, transform: [{ rotate: '-3deg' }] },
  badgeText: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.6 },
  meta: { flexDirection: 'row' },
  dateBadge: { width: 72, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRightWidth: 1 },
  dateDay: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5 },
  dateNum: { fontFamily: fonts.displayExtraBold, fontSize: 26, lineHeight: 30 },
  dateMonth: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5 },
  info: { flex: 1, paddingVertical: 14, paddingHorizontal: 14, justifyContent: 'center', gap: 4 },
  title: { fontFamily: fonts.displayExtraBold, fontSize: 18, lineHeight: 22 },
  venue: { fontFamily: fonts.mono, fontSize: 12 },
  tag: { fontFamily: fonts.mono, fontSize: 11, marginTop: 2 },
});
