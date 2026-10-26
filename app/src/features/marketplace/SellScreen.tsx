import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Image as RemoteImage } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { CatalogueEvent, CITIES, defaultAskingPrice, filterEvents, formatPrice, upcomingEvents } from '../../data/catalogue';
import { eventDateParts } from '../../components/discovery/EventCard';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { Action, Card, Copy, Field, Flow } from './FlowUI';
import { UploadTile } from './BrandVisuals';
import { useCatalogue } from './CatalogueContext';
import { useMarketplace } from './MarketplaceContext';
import { eventStart, Listing, ListingEvent, priceInCents } from './model';
import { pickImage } from './pickImage';
import { checkTicketQr, QrCheck } from './ticketQr';
import { FIXR_INBOX } from './GuideScreen';

type Qr = { state: 'idle' } | { state: 'checking' } | QrCheck & { state: 'done' };

export function SellScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Sell'>) {
  const { colors } = useTheme();
  const { state, save } = useMarketplace();
  const { city, events: catalogue, live } = useCatalogue();
  const place = CITIES[city];
  const preselected = catalogue.find(item => item.id === route.params?.eventId) ?? null;
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<CatalogueEvent | null>(preselected);
  const [custom, setCustom] = useState(false);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [proof, setProof] = useState<string | null>(null);
  const [qr, setQr] = useState<Qr>({ state: 'idle' });
  const [ticketType, setTicketType] = useState('General admission');
  const [price, setPrice] = useState(() => defaultAskingPrice(preselected));
  const [priceEdited, setPriceEdited] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [saved, setSaved] = useState<Listing | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const scan = useRef(0);

  // Default the asking price to FIXR's last available price until the seller edits it.
  useEffect(() => { if (!priceEdited) setPrice(defaultAskingPrice(custom ? null : event)); }, [event, custom, priceEdited]);

  const results = useMemo(() => {
    const matches = filterEvents(catalogue, { query, date: 'all', soldOutOnly: false }, new Date(), city);
    return query.trim() ? matches.slice(0, 30) : matches.slice(0, 12);
  }, [catalogue, query, city]);

  async function choose(kind: 'cover' | 'proof') {
    setError(''); setBusy(true);
    try {
      const uri = await pickImage();
      if (!uri) return;
      if (kind === 'cover') { setCover(uri); return; }
      setProof(uri); setQr({ state: 'checking' });
      const run = ++scan.current;
      const result = await checkTicketQr(uri);
      if (run === scan.current) setQr({ state: 'done', ...result });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not open your photos.'); }
    finally { setBusy(false); }
  }

  function listingEvent(): ListingEvent | null {
    if (custom) {
      const startAt = eventStart(date.trim(), time.trim(), place.timezone);
      if (!title.trim() || !venue.trim() || !startAt || new Date(startAt).getTime() <= Date.now()) return null;
      return { id: `custom-${Date.now()}`, title: title.trim(), venue: venue.trim(), startAt, description: description.trim() || undefined, custom: true, timezone: place.timezone as ListingEvent['timezone'] };
    }
    if (!event || !upcomingEvents(new Date(), [event], city).length) return null;
    return { id: event.id, title: event.title, venue: event.venue, startAt: event.startAt ?? `${event.date}T23:59:59.000Z`, dateOnly: !event.startAt, timezone: place.timezone as ListingEvent['timezone'], sourceUrl: event.url };
  }

  const cents = priceInCents(price);
  function next() {
    setError('');
    if (step === 0 && !listingEvent()) { setError(custom ? `Add an event name, venue, and a future date and time (${place.label} time).` : 'Choose the upcoming FIXR event on your ticket.'); return; }
    if (step === 1) {
      if (!proof || qr.state !== 'done' || !qr.ok) { setError('Add a ticket screenshot with a readable QR code.'); return; }
      if (!ticketType.trim() || cents === null || cents > place.maxPrice * 100) { setError(`Set a price from ${place.symbol}0.01 to ${place.symbol}${place.maxPrice}.`); return; }
    }
    setStep(step + 1);
  }

  async function submit() {
    const target = listingEvent();
    if (submitting.current || !target || !confirmed || cents === null || qr.state !== 'done' || !qr.ok) return;
    submitting.current = true; setBusy(true); setError('');
    const listing: Listing = { id: `listing-${Date.now()}`, event: target, provider: 'FIXR', ticketType: ticketType.trim(), price: cents / 100, currency: place.currency, status: 'awaiting_transfer', qrChecked: true, createdAt: new Date().toISOString() };
    try {
      // The QR screenshot is checked on-device and never stored.
      await save({ ...state, listings: [listing, ...state.listings] });
      setProof(null); setSaved(listing); setStep(3);
    } catch { setError('Could not save your listing. Please retry.'); }
    finally { submitting.current = false; setBusy(false); }
  }

  async function markSent() {
    if (!saved) return;
    setBusy(true); setError('');
    try {
      await save({ ...state, listings: state.listings.map(item => item.id === saved.id ? { ...item, status: 'transfer_sent' } : item) });
      navigation.replace('Listings');
    } catch { setError('Could not update your listing. Please retry.'); }
    finally { setBusy(false); }
  }

  async function copyInbox() {
    await Clipboard.setStringAsync(FIXR_INBOX);
    setCopied(true);
  }

  const shown = custom ? null : event;
  const footer = step < 3
    ? <Action label={step === 2 ? busy ? 'Saving…' : 'List it — next, transfer →' : 'Continue →'} disabled={busy || (step === 1 && qr.state === 'checking') || (step === 2 && !confirmed)} onPress={step === 2 ? () => void submit() : next} />
    : <Action label={busy ? 'Saving…' : 'I’ve shared the transfer link'} disabled={busy || !FIXR_INBOX} onPress={() => void markSent()} />;

  return <Flow step={step === 3 ? 'SELL / TRANSFER' : `SELL / 0${step + 1} OF 03`}
    title={['Find your night.', 'Show us your spare.', 'One last look.', 'Now send it on FIXR.'][step]}
    subtitle={[`Choose the FIXR event on your ticket in ${place.label}.`, 'Add your ticket screenshot and set your price.', 'Check the details before saving.', 'Share your private FIXR transfer link for review. Receipt in our FIXR account must be checked separately.'][step]}
    progress={step < 3 ? step + 1 : undefined} error={error} footer={footer}
    back={step === 3 ? () => navigation.replace('Listings') : () => { setError(''); setConfirmed(false); step ? setStep(step - 1) : navigation.goBack(); }}>
    {step === 0 && <>
      <Action label={custom ? '← Choose a FIXR event' : '+ Event not listed? Add it'} secondary onPress={() => { setCustom(!custom); setError(''); }} />
      {custom ? <>
        <Field label="Event name · required" value={title} onChangeText={setTitle} maxLength={100} />
        <Field label="Venue · required" value={venue} onChangeText={setVenue} maxLength={140} />
        <Field label="Date · YYYY-MM-DD · required" value={date} onChangeText={setDate} placeholder="2026-12-31" maxLength={10} keyboardType="numbers-and-punctuation" />
        <Field label={`Start time · HH:MM · ${place.label} time · required`} value={time} onChangeText={setTime} placeholder="22:00" maxLength={5} keyboardType="numbers-and-punctuation" />
        <Field label="Description · optional" value={description} onChangeText={setDescription} maxLength={600} multiline />
        <Action label={cover ? 'Replace event image' : '+ Event image · optional'} secondary disabled={busy} onPress={() => void choose('cover')} />
        {cover && <Image source={{ uri: cover }} style={{ height: 160, borderRadius: 14 }} accessibilityLabel="Event image preview" />}
        <Copy>New events are checked by our team before they appear for buyers.</Copy>
      </> : <>
        <Field label={`Search ${place.label} FIXR events`} value={query} onChangeText={setQuery} placeholder="Event or venue" autoCorrect={false} />
        <Text style={[type.monoSmall, { color: colors.textSecondary }]}>{query.trim() ? `${results.length} MATCHES` : 'MOST IN-DEMAND FIRST'} · {live ? 'PROVIDER FEED' : city === 'oxford' ? '24 OCT SNAPSHOT' : 'FEED PENDING'}</Text>
        {results.map(item => { const parts = eventDateParts(item, city); const selected = event?.id === item.id; return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={`${item.title}, ${item.venue}, ${parts.day} ${parts.date} ${parts.month}`} onPress={() => setEvent(item)}
          style={{ flexDirection: 'row', gap: 12, padding: 10, borderWidth: 1.5, borderColor: selected ? colors.coral : colors.border, backgroundColor: selected ? colors.coralSoft : colors.surface, borderRadius: 16, alignItems: 'center' }}>
          <RemoteImage source={{ uri: item.imageUrl }} style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: colors.ink }} contentFit="cover" accessible={false} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[type.bodyStrong, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
            <Text style={[type.monoSmall, { color: colors.textSecondary }]} numberOfLines={1}>{parts.day} {parts.date} {parts.month} · {item.venue}</Text>
            {item.availabilityAtCheck === 'sold_out' && <Text style={[type.monoSmall, { color: colors.coral }]}>SOLD OUT AT LAST CHECK · HIGH DEMAND</Text>}
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 18 }}>{selected ? '●' : '○'}</Text>
        </Pressable>; })}
        {!results.length && <Card><Copy>{catalogue.length ? 'No matching upcoming events.' : `The ${place.label} FIXR list is on its way.`}</Copy><Copy>Add your event with the button above and we’ll check it.</Copy></Card>}
      </>}
    </>}
    {step === 1 && <>
      <Card><Copy>{shown?.title ?? title}</Copy><Copy>{shown?.venue ?? venue}</Copy></Card>
      <UploadTile uri={proof} busy={busy} onPress={() => void choose('proof')} />
      <QrStatus qr={qr} />
      <Field label="Ticket type · required" value={ticketType} onChangeText={setTicketType} maxLength={70} />
      <Field label={`Asking price · ${place.currency} · required`} value={price} onChangeText={value => { setPrice(value); setPriceEdited(true); }} keyboardType="decimal-pad" placeholder={city === 'oxford' ? '25.00' : '250.00'} maxLength={8} />
      <Text style={[type.monoSmall, { color: colors.textSecondary }]}>{shown?.lastTicketPrice ? `STARTS AT FIXR’S LAST AVAILABLE PRICE · ${formatPrice(shown.lastTicketPrice, city)}` : 'FIXR PRICE NOT AVAILABLE FOR THIS EVENT · SET YOUR OWN'}</Text>
    </>}
    {step === 2 && <>
      <Card><Copy>{shown?.title ?? title}</Copy><Copy>{shown?.venue ?? venue}</Copy><Copy>FIXR · {ticketType}</Copy><Copy>{formatPrice((cents ?? 0) / 100, city)} · one ticket</Copy><Copy>✓ QR code found on your screenshot</Copy>{custom && <Copy>New event · our team checks it first</Copy>}</Card>
      <Action label={`${confirmed ? '✓' : '○'} This is my ticket and I can transfer it on FIXR`} secondary onPress={() => setConfirmed(!confirmed)} />
      <Copy>Next you’ll share the private FIXR transfer link. This local preview is not visible to buyers.</Copy>
    </>}
    {step === 3 && <>
      <Card>
        <Text style={[type.mono, { color: colors.coral }]}>SEND IT TO</Text>
        <Text selectable style={[type.sectionTitle, { color: colors.textPrimary }]}>{FIXR_INBOX || 'Inbox not configured yet'}</Text>
        {!!FIXR_INBOX && <Action label={copied ? '✓ Email copied' : 'Copy email address'} secondary onPress={() => void copyInbox()} />}
      </Card>
      {['Open the FIXR app or fixr.co and go to Your Bookings.', `Open ${saved?.event.title ?? 'your booking'} and tap Transfer tickets.`, 'Share the unique transfer link privately by email to the address above.', 'Come back here and tap “I’ve shared the transfer link”.'].map((text, index) =>
        <View key={text} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: index % 2 ? colors.lime : colors.coral, alignItems: 'center', justifyContent: 'center' }}><Text style={[type.mono, { color: colors.ink }]}>{index + 1}</Text></View>
          <Text style={[type.body, { color: colors.textPrimary, flex: 1, paddingTop: 5 }]}>{text}</Text>
        </View>)}
      {saved?.event.sourceUrl && <Action label="Open this event on FIXR ↗" secondary onPress={() => void Linking.openURL(saved.event.sourceUrl!)} />}
      <Copy>Sending the link is only the first step. An operator must claim it and confirm the ticket in our FIXR account. This preview does not submit a live listing.</Copy>
    </>}
  </Flow>;
}

function QrStatus({ qr }: { qr: Qr }) {
  const { colors } = useTheme();
  if (qr.state === 'idle') return <Copy>Use the full screenshot from FIXR — the QR code, event name and ticket details all visible. It’s checked on your phone and never uploaded.</Copy>;
  const good = qr.state === 'done' && qr.ok;
  const text = qr.state === 'checking' ? 'Checking for a QR code…' : qr.ok ? 'QR code found. Ticket authenticity still needs FIXR transfer review.' : qr.reason;
  return <View accessibilityLiveRegion="polite" style={{ borderRadius: 14, borderWidth: 1.5, padding: 14, borderColor: good ? colors.lime : qr.state === 'checking' ? colors.border : colors.coral, backgroundColor: good ? colors.limeSoft : colors.surface }}>
    <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{qr.state === 'checking' ? '…' : good ? '✓ ' : '✕ '}{text}</Text>
  </View>;
}
