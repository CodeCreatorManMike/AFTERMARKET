import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { MAIN_STAMP, SECONDARY_STAMP } from '../../data/stamps';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { Action, ErrorMessage } from './FlowUI';
import { Screen } from '../../components/common/Screen';
import { BackArrowIcon, BoltIcon, MailIcon, QRIcon, SearchIcon, ShieldCheckIcon, TicketIcon } from '../../components/common/Icons';
import { useMarketplace } from './MarketplaceContext';
import { CITIES } from '../../data/catalogue';
import { useCatalogue } from './CatalogueContext';
import type { Guide } from './model';

export const FIXR_INBOX = process.env.EXPO_PUBLIC_FIXR_INBOX?.trim() || '';

type Step = { title: string; detail: string; Icon: (props: { size?: number; color?: string }) => React.ReactElement; tag: string };

function steps(mode: Guide, currency: string): Step[] {
  const inbox = FIXR_INBOX || 'the Aftermarket FIXR inbox (shown when you list)';
  return mode === 'sell' ? [
    { tag: 'MATCH', Icon: SearchIcon, title: 'Pick your FIXR event', detail: 'Choose the exact night from the FIXR list. Not there? Add it in a few details — we check new events before they go live.' },
    { tag: 'SCAN', Icon: QRIcon, title: 'Upload your ticket screenshot', detail: 'Use the full screenshot from FIXR with the QR code showing. We check for a readable QR code on your phone before you continue.' },
    { tag: 'PRICE', Icon: TicketIcon, title: 'Set your price', detail: `We start you at the event’s last available FIXR price in ${currency}. Change it if you want to.` },
    { tag: 'TRANSFER', Icon: MailIcon, title: 'Share the FIXR transfer link', detail: `In FIXR, open your booking and tap Transfer tickets. Send the unique transfer link privately to ${inbox}. Keep the link out of public listings.` },
    { tag: 'REVIEW', Icon: ShieldCheckIcon, title: 'We confirm it landed', detail: 'A transfer email starts a review. We must claim the link and check the ticket in the receiving FIXR account before calling it verified.' },
    { tag: 'HANDOVER', Icon: BoltIcon, title: 'Buyer handover', detail: 'Checkout and payout are being connected. A ticket cannot be sold here until payment and transfer verification are live.' },
  ] : [
    { tag: 'FIND', Icon: SearchIcon, title: 'Find your sold-out night', detail: 'Browse the FIXR events in your city, sorted by demand. Sold-out nights come first.' },
    { tag: 'REVIEW', Icon: ShieldCheckIcon, title: 'Look for reviewed spares', detail: 'We check the seller’s transfer in the receiving FIXR account before a ticket can be offered for sale.' },
    { tag: 'PAY', Icon: TicketIcon, title: 'Pay by Apple Pay or card', detail: 'Stripe checkout is coming. When enabled, payment must match the exact order and ticket before a handover starts.' },
    { tag: 'CLAIM', Icon: MailIcon, title: 'Claim it in FIXR', detail: 'Once payment is confirmed, you receive a private FIXR transfer link and claim the ticket to your own account.' },
    { tag: 'GO', Icon: QRIcon, title: 'Show up', detail: 'Your ticket and QR code are in FIXR under Your Bookings. Enjoy your night.' },
  ];
}

export function GuideScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Guide'>) {
  const { colors, scheme } = useTheme();
  const { width } = useWindowDimensions();
  const { state, save } = useMarketplace();
  const { city } = useCatalogue();
  const intent = route.params.mode;
  const [mode, setMode] = useState<Guide>(intent);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const eventId = route.params.eventId;
  const list = steps(mode, CITIES[city].currency);

  async function proceed() {
    if (!state.member) return;
    setBusy(true); setError('');
    try {
      const guides = Array.from(new Set([...(state.member.guides ?? []), intent]));
      await save({ ...state, member: { ...state.member, guides } });
      if (intent === 'sell') navigation.replace('Sell', { eventId });
      else if (eventId) navigation.replace('Event', { eventId, buying: true });
      else navigation.goBack();
    } catch { setError('Could not save. Please try again.'); }
    finally { setBusy(false); }
  }

  return <Screen><ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}><BackArrowIcon color={colors.textPrimary} /></Pressable>
    <View style={[styles.hero, { backgroundColor: colors.ink, borderColor: colors.border }]}>
      <Image source={scheme === 'dark' ? SECONDARY_STAMP : MAIN_STAMP} accessible={false} style={[styles.heroStamp, { width: Math.min(110, width * 0.26), height: Math.min(110, width * 0.26) }]} />
      <Text style={[type.mono, { color: colors.lime }]}>{mode === 'sell' ? 'SELLING / HOW IT WORKS' : 'BUYING / HOW IT WORKS'}</Text>
      <Text style={[type.hero, styles.heroTitle, { color: colors.cream }]}>{mode === 'sell' ? 'YOUR SPARE.\nTHEIR NIGHT.' : 'SOLD OUT?\nNOT FOR YOU.'}</Text>
      <Text style={[type.body, { color: colors.cream, opacity: 0.85 }]}>{mode === 'sell' ? 'Prepare your ticket, then share a private FIXR transfer link for review.' : 'Find your night and see how verified ticket handover will work.'}</Text>
    </View>
    <View style={styles.toggle} accessibilityRole="tablist">
      {(['sell', 'buy'] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: mode === value }} onPress={() => setMode(value)}
        style={[styles.toggleItem, { backgroundColor: mode === value ? colors.coral : colors.surface, borderColor: mode === value ? colors.coral : colors.border }]}>
        <Text style={[type.bodyStrong, { color: mode === value ? colors.ink : colors.textPrimary }]}>{value === 'sell' ? 'Selling' : 'Buying'}</Text>
      </Pressable>)}
    </View>
    {mode !== intent && <Text style={[type.monoSmall, { color: colors.textSecondary }]}>YOU’RE READING THE {mode === 'sell' ? 'SELLER' : 'BUYER'} SIDE · SWITCH BACK ANY TIME</Text>}
    {list.map(({ title, detail, Icon, tag }, index) => <View key={title} style={styles.stepRow}>
      <View style={styles.rail}>
        <View style={[styles.stepNumber, { backgroundColor: index % 2 ? colors.lime : colors.coral, transform: [{ rotate: index % 2 ? '4deg' : '-4deg' }] }]}><Text style={[type.mono, { color: colors.ink }]}>0{index + 1}</Text></View>
        {index < list.length - 1 && <View style={[styles.line, { borderColor: colors.borderStrong }]} />}
      </View>
      <View style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.stepHead}><Text style={[type.monoSmall, { color: colors.coral, flex: 1 }]}>{tag}</Text><Icon size={22} color={colors.textPrimary} /></View>
        <Text style={[type.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[type.body, { color: colors.textSecondary }]}>{detail}</Text>
      </View>
    </View>)}
    <ErrorMessage message={error} />
    <Action label={busy ? 'Saving…' : intent === 'sell' ? 'Got it — list my ticket →' : 'Got it — show me tickets →'} disabled={busy || !state.member} onPress={() => void proceed()} />
    <Text style={[type.monoSmall, { color: colors.textMuted }]}>FIXR organisers can switch off transfers for some tickets, and transfers can close near the event. Check your booking in FIXR.</Text>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 48, gap: 14 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  hero: { borderRadius: 22, borderWidth: 1, padding: 20, paddingTop: 28, gap: 8, overflow: 'hidden' },
  heroStamp: { position: 'absolute', right: -10, top: -10, transform: [{ rotate: '14deg' }], opacity: 0.95 },
  heroTitle: { fontSize: 30, lineHeight: 33 },
  toggle: { flexDirection: 'row', gap: 10 },
  toggleItem: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepRow: { flexDirection: 'row', gap: 10 },
  rail: { width: 40, alignItems: 'center' },
  stepNumber: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, borderLeftWidth: 1.5, borderStyle: 'dashed', marginVertical: 4 },
  stepCard: { flex: 1, padding: 14, gap: 6, borderWidth: 1, borderRadius: 18, marginBottom: 4 },
  stepHead: { flexDirection: 'row', alignItems: 'center' },
});
