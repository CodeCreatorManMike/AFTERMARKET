import React, { useRef, useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { OxfordFixrEvent, oxfordFixrEvents, visibleOxfordEvents } from '../../data/oxfordFixrEvents';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { useMarketplace } from './MarketplaceContext';
import { Action, Card, Copy, Field, Flow } from './FlowUI';
import { UploadTile } from './BrandVisuals';
import { pickImage } from './pickImage';
import { priceInCents } from './model';

const INBOX = process.env.EXPO_PUBLIC_FIXR_INBOX?.trim();

export function OxfordSellScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'OxfordSell'>) {
  const { colors } = useTheme();
  const { state, save } = useMarketplace();
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState<OxfordFixrEvent | null>(() => oxfordFixrEvents.find(item => item.id === route.params?.eventId) ?? null);
  const [query, setQuery] = useState(() => oxfordFixrEvents.find(item => item.id === route.params?.eventId)?.title ?? '');
  const [proof, setProof] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState('General admission');
  const [price, setPrice] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const events = visibleOxfordEvents().filter(item => `${item.title} ${item.venue}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, query.trim() ? undefined : 12);

  async function chooseProof() {
    setBusy(true); setError('');
    try { const uri = await pickImage(); if (uri) setProof(uri); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not open your photos.'); }
    finally { setBusy(false); }
  }
  function next() {
    setError('');
    if (step === 0 && (!event || !visibleOxfordEvents().some(item => item.id === event.id))) { setError('Choose an upcoming FIXR event shown on your ticket.'); return; }
    if (step === 1 && (!proof || !ticketType.trim() || priceInCents(price) === null || Number(price) > 500)) {
      setError('Add a screenshot, ticket type and GBP price from £0.01 to £500.00.'); return;
    }
    setStep(step + 1);
  }
  async function submit() {
    if (submitting.current || !event || !visibleOxfordEvents().some(item => item.id === event.id) || !proof || !confirmed || priceInCents(price) === null) return;
    submitting.current = true; setBusy(true); setError('');
    try {
      await save({ ...state, listings: [{
        id: `oxford-${Date.now()}`,
        event: { id: event.id, title: event.title, venue: event.venue,
          startAt: event.startAt ?? `${event.date}T23:59:59.000Z`, dateOnly: !event.startAt, timezone: 'Europe/London', sourceUrl: event.url },
        provider: 'FIXR', ticketType: ticketType.trim(), price: priceInCents(price)! / 100,
        currency: 'GBP', status: 'draft_review', createdAt: new Date().toISOString(),
      }, ...state.listings] });
      setProof(null); setStep(3);
    } catch { setError('Could not save your preview. Please retry.'); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Flow step={step === 3 ? 'PREVIEW SAVED' : `OXFORD / SELL / 0${step + 1} OF 03`}
    title={['Find your night.', 'Show us your spare.', 'Check every detail.', 'Ready for review.'][step]}
    subtitle={['Choose the exact event on FIXR. The ticket and event need to match.', 'Attach a private screenshot and set your asking price in pounds.', 'No ticket is transferred or listed yet. Confirm what you entered.', 'Your details are saved locally. The ticket screenshot was not retained.'][step]}
    progress={step < 3 ? step + 1 : undefined} error={error}
    back={step === 3 ? undefined : () => step ? (setStep(step - 1), setConfirmed(false)) : navigation.goBack()}
    footer={step < 3 ? <Action label={step === 2 ? busy ? 'Saving…' : 'Save private preview' : 'Continue →'} disabled={busy || (step === 2 && !confirmed)} onPress={step === 2 ? () => void submit() : next} /> : <Action label="View my listings" onPress={() => navigation.replace('Listings')} />}>
    {step === 0 && <>
      <Card><Copy>FIXR / OXFORD PILOT</Copy><Copy>Pick from public FIXR listings checked on 24 October. This does not prove your ticket can be transferred; check the transfer button in your FIXR booking.</Copy></Card>
      <Field label="Search Oxford events" value={query} onChangeText={setQuery} placeholder="Event or venue" />
      {!query.trim() && <Copy>Showing the next 12. Search by name or venue to match any event in the Oxford catalogue.</Copy>}
      {events.map(item => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: event?.id === item.id }} onPress={() => setEvent(item)} style={{ flexDirection: 'row', gap: 12, padding: 15, borderWidth: 1.5, borderColor: event?.id === item.id ? colors.coral : colors.border, backgroundColor: colors.surface, borderRadius: 16 }}>
        <View style={{ width: 42, height: 46, borderRadius: 10, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}><Text style={[type.mono, { color: colors.ink }]}>{item.date.slice(8)}</Text></View>
        <View style={{ flex: 1, gap: 3 }}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{item.title}</Text><Text style={[type.monoSmall, { color: colors.textSecondary }]}>{item.venue} · {item.date}</Text></View>
        <Text style={{ color: colors.textPrimary }}>{event?.id === item.id ? '●' : '○'}</Text>
      </Pressable>)}
      {!events.length && <Copy>No matching future pilot event. Open the official FIXR event page and contact us to add it.</Copy>}
      {event && <><Image source={{ uri: event.imageUrl }} resizeMode="cover" style={{ width: '100%', height: 160, borderRadius: 14 }} accessibilityLabel={`${event.title} organiser artwork via FIXR`} /><Action label="Check this event on FIXR ↗" secondary onPress={() => void Linking.openURL(event.url)} /></>}
    </>}
    {step === 1 && <>
      <Card><Copy>{event?.title}</Copy><Copy>{event?.venue} · {event?.date}</Copy></Card>
      <UploadTile uri={proof} busy={busy} onPress={() => void chooseProof()} />
      {proof && <Action label="Remove screenshot" secondary onPress={() => setProof(null)} />}
      <Copy>Include the event and ticket details in the private preview. Keep the original ticket in FIXR. The image stays in this session and is discarded after save.</Copy>
      <Field label="Ticket type" value={ticketType} onChangeText={setTicketType} maxLength={70} />
      <Field label="Asking price · GBP" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="25.00" maxLength={7} />
      <Card><Copy>CHECK THE TRANSFER BUTTON</Copy><Copy>FIXR says an organiser can disable transfers, a ticket has a transfer limit, and transfer may close near the event. Do not send a link yet.</Copy></Card>
    </>}
    {step === 2 && <>
      <Card><Copy>{event?.title}</Copy><Copy>{event?.venue} · {event?.date}</Copy><Copy>FIXR · {ticketType}</Copy><Copy>£{(priceInCents(price)! / 100).toFixed(2)} · one ticket</Copy><Copy>Screenshot attached for this session · unverified</Copy></Card>
      {proof && <Image source={{ uri: proof }} resizeMode="contain" style={{ width: '100%', height: 170, borderRadius: 12 }} accessibilityLabel="Private ticket screenshot preview" />}
      <Copy>Saving makes a private local preview only. It does not upload the image, publish a listing, collect payment, or confirm a transfer.</Copy>
      <Action label={`${confirmed ? '✓' : '○'} I own this ticket and the details match FIXR`} secondary onPress={() => setConfirmed(!confirmed)} />
    </>}
    {step === 3 && <>
      <Card><Copy>01 / REVIEW FIRST</Copy><Copy>Your preview needs an event and transfer check before a real listing can open.</Copy><Copy>02 / SEND THROUGH FIXR</Copy><Copy>After approval, use FIXR’s transfer action. The pilot receiving inbox is {INBOX || 'configured by the team and shared after review'}.</Copy><Copy>03 / VERIFY THEN SELL</Copy><Copy>An operator must confirm the ticket in FIXR. Stripe checkout is not live yet.</Copy></Card>
      <Copy>Do not transfer a real ticket based on this local preview. Wait for explicit approval and a confirmed handover route.</Copy>
    </>}
  </Flow>;
}
