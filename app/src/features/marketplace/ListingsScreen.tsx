import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { Action, Card, Copy, ErrorMessage, Flow } from './FlowUI';
import { useMarketplace } from './MarketplaceContext';
export function ListingsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Listings'>) {
  const { state, save } = useMarketplace();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  async function remove(id: string) {
    setBusy(true); setError('');
    try { await save({ ...state, listings: state.listings.filter(item => item.id !== id) }); setRemoving(null); }
    catch { setError('Could not remove this preview. Please retry.'); }
    finally { setBusy(false); }
  }
  return <Flow step="MY LISTINGS" title={"Give your spare\na second night."} subtitle="Local previews. Nothing here is public, verified or in escrow." back={() => navigation.goBack()}>
    <Action label="+ Sell a ticket" onPress={() => navigation.navigate('Sell')} />
    <ErrorMessage message={error} />
    {!state.listings.length && <Card><Copy>No listings yet.</Copy><Copy>Choose an event, attach your screenshot and set your price. You can buy and sell with the same profile.</Copy></Card>}
    {state.listings.map(item => <Card key={item.id}><Copy>{item.event.title}</Copy><Copy>{item.event.venue}</Copy><Copy>{new Date(item.event.startAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })} SAST</Copy>{!!item.event.description && <Copy>{item.event.description}</Copy>}<Copy>{item.provider} · {item.ticketType} · R{item.price.toFixed(2)}</Copy><Copy>{item.event.custom ? 'New event · moderation needed' : 'Existing event'} · preview saved</Copy><Copy>Ticket image not retained. Upload again when secure storage is available.</Copy>{removing === item.id ? <><Copy>Remove this local listing preview?</Copy><Action label="Remove preview" disabled={busy} onPress={() => void remove(item.id)} /><Action label="Keep listing" secondary disabled={busy} onPress={() => setRemoving(null)} /></> : <Action label="Remove listing" secondary disabled={busy} onPress={() => setRemoving(item.id)} />}</Card>)}
  </Flow>;
}
