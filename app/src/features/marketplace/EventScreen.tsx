import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { Screen } from '../../components/common/Screen';
import { BackArrowIcon, CalendarIcon, MapPinIcon, ShieldCheckIcon } from '../../components/common/Icons';
import { eventDateParts } from '../../components/discovery/EventCard';
import { CITIES, formatPrice, upcomingEvents } from '../../data/catalogue';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, type } from '../../theme/typography';
import { Action, Card, Copy } from './FlowUI';
import { useCatalogue } from './CatalogueContext';
import { useMarketplace } from './MarketplaceContext';
import { useStartFlow } from './flows';
import { statusLabel } from './ListingsScreen';

export function EventScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Event'>) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { city, events } = useCatalogue();
  const { state } = useMarketplace();
  const { startBuy, startSell } = useStartFlow();
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  const event = events.find(item => item.id === route.params.eventId);
  const ended = event && !upcomingEvents(new Date(), [event], city).length;

  if (!event) return <Screen><View style={styles.page}>
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.back}><BackArrowIcon color={colors.textPrimary} /></Pressable>
    <Card><Copy>This event is no longer in the {CITIES[city].label} list.</Copy><Copy>It may have finished, or you changed city.</Copy></Card>
  </View></Screen>;

  const parts = eventDateParts(event, city);
  const soldOut = event.availabilityAtCheck === 'sold_out';
  const mine = state.listings.filter(item => item.event.id === event.id);
  const buying = !!route.params.buying;

  return <Screen><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}><BackArrowIcon color={colors.textPrimary} /></Pressable>
    <View style={[styles.poster, { height: Math.min(300, width * 0.7), backgroundColor: colors.ink }]}>
      {!failed && <Image source={{ uri: event.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" onError={() => setFailed(true)} accessibilityLabel={`${event.title} artwork from FIXR`} />}
      {soldOut && <View style={[styles.badge, { backgroundColor: colors.coral }]}><Text style={[styles.badgeText, { color: colors.ink }]}>SOLD OUT ON FIXR</Text></View>}
    </View>
    <Text style={[type.mono, { color: colors.coral }]}>FIXR / {CITIES[city].label.toUpperCase()}</Text>
    <Text style={[type.pageTitle, { color: colors.textPrimary }]}>{event.title}</Text>
    <View style={styles.metaRow}><CalendarIcon size={16} color={colors.textSecondary} /><Text style={[type.bodyStrong, { color: colors.textSecondary, flex: 1 }]}>{parts.day} {parts.date} {parts.month} · {parts.time}</Text></View>
    <View style={styles.metaRow}><MapPinIcon size={16} color={colors.textSecondary} /><Text style={[type.bodyStrong, { color: colors.textSecondary, flex: 1 }]}>{event.venue}{event.address ? ` · ${event.address}` : ''}</Text></View>
    <Text style={[type.body, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 4}>{event.description || event.excerpt}</Text>
    {(event.description || event.excerpt).length > 160 && <Pressable accessibilityRole="button" onPress={() => setExpanded(!expanded)}><Text style={[type.bodyStrong, { color: colors.coral }]}>{expanded ? 'Show less' : 'Read more'}</Text></Pressable>}
    {ended ? <Card><Copy>This event has finished.</Copy></Card> : <>
      <View style={[styles.buyPanel, { backgroundColor: buying ? colors.coralSoft : colors.surface, borderColor: buying ? colors.coral : colors.border }]}>
        <View style={styles.metaRow}><ShieldCheckIcon size={22} color={colors.textPrimary} /><Text style={[type.sectionTitle, { color: colors.textPrimary, flex: 1 }]}>Verified spares</Text></View>
        <Text style={[type.body, { color: colors.textSecondary }]}>Tickets appear here once they have been transferred into Aftermarket’s FIXR account and checked.{event.lastTicketPrice ? ` FIXR’s last available price was ${formatPrice(event.lastTicketPrice, city)}.` : ''}</Text>
        <Text style={[type.monoSmall, { color: colors.textPrimary }]}>NO VERIFIED SPARES YET · APPLE PAY AND CARD CHECKOUT IS COMING WITH STRIPE</Text>
        {!buying && <Action label={soldOut ? 'Find me a spare →' : 'Buy a resale ticket →'} onPress={() => startBuy(event.id)} />}
      </View>
      {mine.map(item => <Card key={item.id}><Copy>YOUR LISTING · {item.ticketType}</Copy><Copy>{formatPrice(item.price, item.currency === 'GBP' ? 'oxford' : 'cape_town')} · {statusLabel(item.status)}</Copy></Card>)}
      <Action label="Got a spare? Sell it here" secondary onPress={() => startSell(event.id)} />
    </>}
    <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(event.url)} style={[styles.fixr, { borderColor: colors.border }]}>
      <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>View on FIXR ↗</Text>
    </Pressable>
    <Text style={[type.monoSmall, { color: colors.textMuted }]}>Event details and artwork from FIXR. Check FIXR for the latest times and entry rules.</Text>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 48, gap: 12 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  poster: { borderRadius: 20, overflow: 'hidden' },
  badge: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, transform: [{ rotate: '-3deg' }] },
  badgeText: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buyPanel: { borderWidth: 1.5, borderRadius: 18, padding: 16, gap: 10, marginTop: 6 },
  fixr: { minHeight: 48, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
