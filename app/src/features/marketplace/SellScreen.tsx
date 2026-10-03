import React, { useMemo, useRef, useState } from 'react';
import { Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { eventCatalog } from '../../data/eventCatalog';
import { Action, Card, Copy, ErrorMessage, Field, Flow } from './FlowUI';
import { eventStart, ListingEvent, priceInCents } from './model';
import { useMarketplace } from './MarketplaceContext';
import { pickImage } from './pickImage';

export function SellScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Sell'>) {
  const { state, save } = useMarketplace();
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<ListingEvent | null>(null);
  const [custom, setCustom] = useState(false);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [provider, setProvider] = useState<'FIXR' | 'Fatsoma'>('FIXR');
  const [ticketType, setTicketType] = useState('General admission');
  const [price, setPrice] = useState('');
  const [proof, setProof] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const results = useMemo(() => eventCatalog.filter(e => new Date(e.startAt).getTime() > Date.now() && e.status !== 'cancelled' && `${e.title} ${e.venue.name}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12), [query]);
  async function upload(kind: 'cover' | 'proof') {
    setError(''); setBusy(true);
    try { const uri = await pickImage(); if (uri) kind === 'cover' ? setCover(uri) : setProof(uri); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not open your photos. Please try again.'); }
    finally { setBusy(false); }
  }
  function next() {
    setError('');
    if (step === 0) {
      if (custom) {
        const startAt = eventStart(date.trim(), time.trim());
        if (!title.trim() || !venue.trim() || !startAt || new Date(startAt).getTime() <= Date.now()) { setError('Add an event name, venue, and valid future date and time.'); return; }
        setEvent({ id: event?.custom ? event.id : `custom-${Date.now()}`, title: title.trim(), venue: venue.trim(), startAt, description: description.trim(), image: cover ?? undefined, custom: true });
      } else if (!event) { setError('Choose an event or add a new one.'); return; }
    }
    if (step === 1 && (!proof || !ticketType.trim() || priceInCents(price) === null)) { setError('Add a ticket screenshot, ticket type and a price from R0.01 to R100,000 (up to 2 decimals).'); return; }
    setStep(step + 1);
  }
  async function submit() {
    if (submitting.current || !event || !confirmed || !proof || priceInCents(price) === null) return;
    submitting.current = true; setBusy(true); setError('');
    try {
      // Never persist ticket QR images in unencrypted prototype storage.
      await save({ ...state, listings: [{ id: `listing-${Date.now()}`, event: { ...event, image: undefined }, provider, ticketType: ticketType.trim(), price: priceInCents(price)! / 100, status: 'draft_review', createdAt: new Date().toISOString() }, ...state.listings] });
      setProof(null); setStep(3);
    } catch { setError('Could not save your listing. Your details are still here; please retry.'); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Flow step={step === 3 ? 'SAVED LOCALLY' : `SELL / 0${step + 1} OF 03`} title={['Find your event.', 'Your spare.\nTheir next night.', 'Check the details.', 'Ready for the\nnext step.'][step]} subtitle={['Attach one ticket to an existing event, or add a missing event.', 'Start with FIXR or Fatsoma. One ticket per listing.', 'A quick check before saving your listing preview.', 'Your listing preview is saved on this device. It is not public or sent to a moderator.'][step]} back={step === 3 ? undefined : () => { setError(''); setConfirmed(false); step ? setStep(step - 1) : navigation.goBack(); }}>
    {step === 0 && <>
      <Action label={custom ? '← Choose an existing event' : '+ Event missing? Add it'} secondary onPress={() => { setCustom(!custom); setEvent(null); setError(''); }} />
      {custom ? <>
        <Field label="Event name · required" value={title} onChangeText={setTitle} maxLength={100} />
        <Field label="Venue / location · required" value={venue} onChangeText={setVenue} maxLength={140} />
        <Field label="Date · YYYY-MM-DD · required" value={date} onChangeText={setDate} placeholder="2026-12-31" maxLength={10} keyboardType="numbers-and-punctuation" />
        <Field label="Time · HH:MM · Cape Town (SAST) · required" value={time} onChangeText={setTime} placeholder="20:00" maxLength={5} keyboardType="numbers-and-punctuation" />
        <Field label="Description · optional" value={description} onChangeText={setDescription} maxLength={600} multiline />
        <Action label={cover ? 'Replace event image' : '+ Event image · optional'} secondary disabled={busy} onPress={() => void upload('cover')} />
        {cover && <><Image source={{ uri: cover }} style={{ height: 160, borderRadius: 14 }} accessibilityLabel="Your event cover preview" /><Action label="Remove event image" secondary onPress={() => setCover(null)} /></>}
        <Copy>New events will need moderator approval before appearing in discovery. Optional images are previewed for this session.</Copy>
      </> : <>
        <Field label="Search events or venues" value={query} onChangeText={setQuery} placeholder="Find your event…" />
        <Copy>Demo catalogue · showing up to 12 matches</Copy>
        {results.map(item => <Action key={item.id} secondary={event?.id !== item.id} label={`${event?.id === item.id ? '✓ ' : ''}${item.title}\n${item.venue.name} · ${new Date(item.startAt).toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg' })}`} onPress={() => setEvent({ id: item.id, title: item.title, venue: item.venue.name, startAt: item.startAt })} />)}
        {!results.length && <Copy>No matching events. Add yours using the button above.</Copy>}
      </>}
      <Action label="Next: ticket details →" disabled={busy} onPress={next} />
    </>}
    {step === 1 && <>
      <Card><Copy>{event?.title}</Copy><Copy>{event?.venue}</Copy></Card>
      <Copy>Ticket provider</Copy>{(['FIXR', 'Fatsoma'] as const).map(p => <Action key={p} label={`${provider === p ? '✓ ' : ''}${p}`} secondary={provider !== p} onPress={() => setProvider(p)} />)}
      <Field label="Ticket type · required" value={ticketType} onChangeText={setTicketType} maxLength={70} />
      <Field label="Asking price · ZAR · required" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="250.00" maxLength={10} />
      <Action label={busy ? 'Opening photos…' : proof ? 'Replace ticket screenshot' : '+ Upload ticket screenshot'} secondary disabled={busy} onPress={() => void upload('proof')} />
      {proof && <><Image source={{ uri: proof }} resizeMode="contain" style={{ height: 240, backgroundColor: '#F5F0E6', borderRadius: 14 }} accessibilityLabel="Private ticket screenshot preview" /><Action label="Remove screenshot" secondary onPress={() => setProof(null)} /></>}
      <Copy>Include the full QR code, event name and ticket details. Up to 15 MB. The image stays in this session and is not published or retained after saving.</Copy>
      <Card><Copy>EMAIL TRANSFER · NEXT PHASE</Copy><Copy>We’ll guide you through the available transfer route for your ticket provider. For now, do not email or transfer your ticket. A screenshot does not verify ownership or guarantee entry.</Copy></Card>
      <Action label="Review listing →" disabled={busy} onPress={next} />
    </>}
    {step === 2 && <>
      {cover && custom && <Image source={{ uri: cover }} style={{ height: 140, borderRadius: 14 }} />}
      <Card><Copy>{event?.title}</Copy><Copy>{event?.venue}</Copy><Copy>{event && new Date(event.startAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })} SAST</Copy>{!!event?.description && <Copy>{event.description}</Copy>}<Copy>{provider} · {ticketType}</Copy><Copy>R{((priceInCents(price) ?? 0) / 100).toFixed(2)} · 1 ticket</Copy><Copy>{event?.custom ? 'New event · moderation required' : 'Existing demo event'}</Copy><Copy>Screenshot attached · unverified</Copy></Card>
      <Copy>No payment, escrow, transfer or public listing happens in this preview. The screenshot will need to be uploaded again when secure storage is connected.</Copy>
      <Action label={`${confirmed ? '✓' : '○'} I own this ticket and the details are correct`} secondary onPress={() => setConfirmed(!confirmed)} />
      <Action label={busy ? 'Saving…' : 'Save listing preview'} disabled={!confirmed || busy} onPress={() => void submit()} />
    </>}
    {step === 3 && <><Card><Copy>01 / LISTING SAVED</Copy><Copy>{event?.title} · R{Number(price).toFixed(2)}</Copy><Copy>02 / MODERATION — COMING NEXT</Copy><Copy>Event and ticket checks before anything goes live.</Copy><Copy>03 / TRANSFER + ESCROW — LATER</Copy><Copy>Provider handover and payment protection will be connected separately.</Copy></Card><Action label="View my listings" onPress={() => navigation.replace('Listings')} /><Action label="Back to browsing" secondary onPress={() => navigation.popToTop()} /></>}
    <ErrorMessage message={error} />
  </Flow>;
}
