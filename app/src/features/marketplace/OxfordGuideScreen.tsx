import React, { useState } from 'react';
import { ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { visibleOxfordEvents } from '../../data/oxfordFixrEvents';
import { MAIN_STAMP } from '../../data/stamps';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, type } from '../../theme/typography';
import { Action } from './FlowUI';
import { Screen } from '../../components/common/Screen';
import { BackArrowIcon, TicketIcon, ShieldCheckIcon } from '../../components/common/Icons';
import { Image } from 'react-native';

const HERO = require('../../../assets/event-images/oxford-halloween-pilot.png');
const INBOX = process.env.EXPO_PUBLIC_FIXR_INBOX?.trim();

const sellerSteps = [
  ['01', 'Match your night', 'Choose the exact Oxford FIXR event and ticket type. Check the organiser allows transfer for your ticket.'],
  ['02', 'Attach a private preview', 'Choose a full ticket screenshot for review and set a GBP asking price. The image stays on this device for now.'],
  ['03', 'Wait for review', 'We need to check the event, ticket details and transfer route before giving the go-ahead. A screenshot alone is not proof of ownership.'],
  ['04', 'Send through FIXR', `Only after approval, use FIXR’s Transfer tickets to a friend action and send the unique link to ${INBOX || 'the Aftermarket pilot inbox shown after review'}. Never post it in a listing.`],
  ['05', 'We check receipt', 'An operator checks the message and confirms the ticket in the FIXR account. Email alone does not make a ticket verified.'],
  ['06', 'Buyer claims; seller paid', 'After a buyer pays, the ticket is transferred through FIXR. Payout follows an independently confirmed buyer claim.'],
];
const buyerSteps = [
  ['01', 'Find the right ticket', 'Match the event, date, venue, ticket type and entry rules. The live FIXR page remains the source for event details.'],
  ['02', 'Review before paying', 'See the resale price and transfer status. Checkout stays unavailable until the listing and payment setup are ready.'],
  ['03', 'Pay securely', 'When Stripe is connected, card or Apple Pay will complete in Stripe’s payment sheet. We will trust the signed server webhook, not a screenshot or app success screen.'],
  ['04', 'Claim in FIXR', 'Open the unique transfer link privately and claim the ticket in your own FIXR account. Do not forward the link.'],
  ['05', 'Check your bookings', 'Confirm the ticket appears under Your Bookings in FIXR and the event details match before we complete the sale.'],
];

export function OxfordGuideScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'OxfordGuide'>) {
  const { colors } = useTheme();
  const [mode, setMode] = useState<'sell' | 'buy'>('sell');
  const events = visibleOxfordEvents();
  return <Screen><ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.back}><BackArrowIcon color={colors.textPrimary} /></Pressable>
    <ImageBackground source={HERO} style={styles.hero} imageStyle={styles.heroImage}>
      <View style={styles.heroShade}>
        <Text style={[type.mono, styles.heroKicker]}>AFTERMARKET / OXFORD PILOT</Text>
        <Text style={[type.hero, styles.heroTitle]}>ONE TICKET.\nNEXT NIGHT.</Text>
        <Text style={[type.body, styles.heroBody]}>Your Halloween plans, passed on with a clear trail.</Text>
      </View>
    </ImageBackground>
    <View style={styles.introRow}>
      <Text style={[type.mono, { color: colors.textSecondary, flex: 1 }]}>24 OCT — 1 NOV 2026 / FIXR EVENTS</Text>
      <Image source={MAIN_STAMP} accessible={false} style={styles.stamp} />
    </View>
    <Text style={[type.pageTitle, { color: colors.textPrimary }]}>How it works.</Text>
    <Text style={[type.body, { color: colors.textSecondary }]}>A visual guide to the Oxford pilot. Listings, payment and transfer checks are being built; no checkout is live yet.</Text>
    <View style={styles.toggle}>
      {(['sell', 'buy'] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: mode === value }} onPress={() => setMode(value)} style={[styles.toggleItem, { backgroundColor: mode === value ? colors.coral : colors.surface, borderColor: colors.border }]}><Text style={[type.bodyStrong, { color: mode === value ? colors.ink : colors.textPrimary }]}>{value === 'sell' ? 'I’m selling' : 'I’m buying'}</Text></Pressable>)}
    </View>
    {(mode === 'sell' ? sellerSteps : buyerSteps).map(([number, title, detail], index) => <View key={number} style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.stepNumber, { backgroundColor: index % 2 ? colors.lime : colors.coral }]}><Text style={[type.mono, { color: colors.ink }]}>{number}</Text></View>
      <View style={{ flex: 1, gap: 5 }}><Text style={[type.cardTitle, { color: colors.textPrimary }]}>{title}</Text><Text style={[type.body, { color: colors.textSecondary }]}>{detail}</Text></View>
      {index === 0 ? <TicketIcon color={colors.coral} size={24} /> : index === (mode === 'sell' ? 4 : 4) ? <ShieldCheckIcon color={colors.lime} size={24} /> : null}
    </View>)}
    {mode === 'sell' && <Action label="Attach my Oxford ticket →" onPress={() => navigation.navigate('OxfordSell')} />}
    {mode === 'buy' && <View style={[styles.notice, { backgroundColor: colors.limeSoft, borderColor: colors.border }]}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>Checkout is being connected</Text><Text style={[type.body, { color: colors.textSecondary }]}>Explore the events below. Buyer payment and ticket handover will open after review and Stripe setup.</Text></View>}
    <View style={styles.catalogHeader}><Text style={[type.sectionTitle, { color: colors.textPrimary }]}>Oxford on FIXR</Text><Text style={[type.monoSmall, { color: colors.textSecondary }]}>PUBLIC LINKS / CHECKED 24 OCT</Text></View>
    <Text style={[type.body, { color: colors.textSecondary }]}>A reviewed pilot selection from FIXR’s public pages. Times, availability, age rules and transfer permissions can change. Check the official event page.</Text>
    {!events.length && <View style={[styles.notice, { backgroundColor: colors.limeSoft, borderColor: colors.border }]}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>This pilot window has ended.</Text><Text style={[type.body, { color: colors.textSecondary }]}>The October catalogue is archived. Check FIXR for current Oxford events.</Text></View>}
    {events.map(event => <Pressable key={event.id} accessibilityRole="link" onPress={() => void Linking.openURL(event.url)} style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.dateBadge, { backgroundColor: colors.coral }]}><Text style={[type.mono, { color: colors.ink }]}>{event.date.slice(8)}</Text><Text style={[type.monoSmall, { color: colors.ink }]}>OCT</Text></View>
      <View style={{ flex: 1, gap: 3 }}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{event.title}</Text><Text style={[type.monoSmall, { color: colors.textSecondary }]}>{event.venue} · {event.date}</Text>{event.note && <Text style={[type.monoSmall, { color: colors.coral }]}>{event.note}</Text>}</View>
      <Text style={[type.bodyStrong, { color: colors.coral }]}>↗</Text>
    </Pressable>)}
    <Text style={[type.monoSmall, { color: colors.textSecondary }]}>FIXR transfer availability varies by organiser and ticket. FIXR says transfers may stop within an hour of the event and a ticket has a transfer limit.</Text>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 50, gap: 16 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  hero: { height: 245, borderRadius: 22, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImage: { borderRadius: 22 },
  heroShade: { padding: 20, paddingTop: 70, backgroundColor: 'rgba(20,16,43,.44)', gap: 4 },
  heroKicker: { color: '#C6FF3D' }, heroTitle: { color: '#F5F0E6', fontSize: 30, lineHeight: 33 }, heroBody: { color: '#F5F0E6' },
  introRow: { flexDirection: 'row', alignItems: 'center' }, stamp: { height: 54, width: 54, transform: [{ rotate: '10deg' }] },
  toggle: { flexDirection: 'row', gap: 10 }, toggleItem: { flex: 1, minHeight: 50, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepCard: { flexDirection: 'row', padding: 14, gap: 12, borderWidth: 1, borderRadius: 18, alignItems: 'flex-start' },
  stepNumber: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notice: { borderWidth: 1, borderRadius: 18, padding: 18, gap: 8 },
  catalogHeader: { marginTop: 12, gap: 4 },
  eventCard: { flexDirection: 'row', gap: 12, padding: 12, borderWidth: 1, borderRadius: 15, alignItems: 'center' },
  dateBadge: { width: 42, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
