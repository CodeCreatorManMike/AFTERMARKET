import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { Action, Card, Copy, ErrorMessage, Flow } from './FlowUI';
import { useMarketplace } from './MarketplaceContext';
import { useStartFlow } from './flows';
import { FIXR_INBOX } from './GuideScreen';
import type { Listing, ListingStatus } from './model';

export function statusLabel(status: ListingStatus) {
  return status === 'transfer_sent' ? 'Transfer sent · we’re checking it landed' : status === 'awaiting_transfer' ? 'Waiting for your FIXR transfer' : 'Preview · not listed';
}

function when(item: Listing) {
  if (item.event.dateOnly) return item.event.startAt.slice(0, 10);
  const london = item.event.timezone === 'Europe/London';
  return `${new Date(item.event.startAt).toLocaleString(london ? 'en-GB' : 'en-ZA', { timeZone: london ? 'Europe/London' : 'Africa/Johannesburg', dateStyle: 'medium', timeStyle: 'short' })} ${london ? 'UK' : 'SAST'}`;
}

export function ListingsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Listings'>) {
  const { state, save } = useMarketplace();
  const { startSell } = useStartFlow();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  async function update(next: Listing[]) {
    setBusy(true); setError('');
    try { await save({ ...state, listings: next }); setRemoving(null); }
    catch { setError('Could not update your listings. Please retry.'); }
    finally { setBusy(false); }
  }
  return <Flow step="MY LISTINGS" title={"Give your spare\na second night."} subtitle="Transfer each ticket to Aftermarket on FIXR to get it verified and listed." back={() => navigation.goBack()}>
    <Action label="+ Sell a ticket" onPress={() => startSell()} />
    <ErrorMessage message={error} />
    {!state.listings.length && <Card><Copy>No listings yet.</Copy><Copy>Pick your FIXR event, add your ticket screenshot and set a price.</Copy></Card>}
    {state.listings.map(item => <Card key={item.id}>
      <Copy>{item.event.title}</Copy><Copy>{item.event.venue} · {when(item)}</Copy>
      <Copy>{item.provider} · {item.ticketType} · {item.currency === 'GBP' ? '£' : 'R'}{item.price.toFixed(2)}</Copy>
      <Copy>{statusLabel(item.status)}{item.event.custom ? ' · new event, our team checks it first' : ''}</Copy>
      {item.status === 'awaiting_transfer' && <>
        <Copy>Transfer it on FIXR to {FIXR_INBOX || 'the Aftermarket inbox (coming soon)'}.</Copy>
        <Action label="I’ve transferred it on FIXR" disabled={busy || !FIXR_INBOX} onPress={() => void update(state.listings.map(other => other.id === item.id ? { ...other, status: 'transfer_sent' } : other))} />
      </>}
      {removing === item.id ? <><Copy>Remove this listing?{item.status === 'transfer_sent' ? ' If you already transferred the ticket, contact us to get it back.' : ''}</Copy>
        <Action label="Remove listing" disabled={busy} onPress={() => void update(state.listings.filter(other => other.id !== item.id))} />
        <Action label="Keep it" secondary disabled={busy} onPress={() => setRemoving(null)} /></>
        : <Action label="Remove listing" secondary disabled={busy} onPress={() => setRemoving(item.id)} />}
    </Card>)}
  </Flow>;
}
