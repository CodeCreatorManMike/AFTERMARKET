import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Action, Card, Copy, ErrorMessage, Field, Flow, Rewards } from './FlowUI';
import { AuthMethod, validContact } from './model';
import { useMarketplace } from './MarketplaceContext';

export function OnboardingScreen({ onDone }: { onDone?: () => void }) {
  const { state, save, error: loadError } = useMarketplace();
  const editing = !!state.member;
  const [step, setStep] = useState(editing ? 1 : 0);
  const [method, setMethod] = useState<AuthMethod>(state.member?.method ?? 'Apple');
  const [contact, setContact] = useState('');
  const [name, setName] = useState(state.member?.name ?? '');
  const [bio, setBio] = useState(state.member?.bio ?? '');
  const [accent, setAccent] = useState<'coral' | 'lime'>(state.member?.accent ?? 'coral');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function finish() {
    setBusy(true); setError('');
    try {
      await save({ ...state, member: { name: name.trim(), bio: bio.trim(), accent, method, joined: state.member?.joined ?? new Date().toISOString() } });
      onDone?.();
    } catch { setError('Could not save your profile. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Flow step={editing ? 'EDIT PROFILE' : `WELCOME / 0${step + 1} OF 03`} title={step === 0 ? 'Your next night\nstarts here.' : step === 1 ? 'Make it yours.' : 'More nights.\nMore you.'} subtitle={step === 0 ? 'One account. Buy tickets, sell your spare, build your story.' : step === 1 ? 'Just a name to start. Everything else can wait.' : 'Your profile grows with every confirmed purchase, event and sale.'} back={step > 0 ? () => { setError(''); editing && step === 1 ? onDone?.() : setStep(step - 1); } : undefined}>
    <ErrorMessage message={error || loadError} />
    {step === 0 && <>
      <Card><Copy>ACCOUNT PREVIEW</Copy><Copy>Try the joining flow. No real account is created yet, and no sign-in message is sent. Use a sample contact.</Copy></Card>
      {(['Apple', 'Google', 'Email', 'Phone'] as AuthMethod[]).map(option => <Action key={option} label={`${method === option ? '✓ ' : ''}Continue with ${option}`} secondary={method !== option} onPress={() => { setMethod(option); setContact(''); setError(''); }} />)}
      {(method === 'Email' || method === 'Phone') && <Field label={method === 'Email' ? 'Email address' : 'Phone number including country code'} value={contact} onChangeText={setContact} keyboardType={method === 'Email' ? 'email-address' : 'phone-pad'} autoCapitalize="none" autoCorrect={false} placeholder={method === 'Email' ? 'you@example.com' : '+27 82 123 4567'} maxLength={120} />}
      <Action label="Try account setup →" onPress={() => { if (!validContact(method, contact)) setError(method === 'Email' ? 'Enter a valid email address.' : 'Use a country code, for example +27 82 123 4567.'); else { setError(''); setStep(1); } }} />
    </>}
    {step === 1 && <>
      <View style={{ backgroundColor: accent === 'coral' ? '#FF5470' : '#C6FF3D', height: 96, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}><View style={{ backgroundColor: '#14102B', borderRadius: 50, padding: 18 }}><Text style={{ color: '#F5F0E6', fontSize: 24, fontFamily: 'Archivo_900Black' }}>{name.trim().slice(0, 2).toUpperCase() || 'AM'}</Text></View></View>
      <Field label="Display name · required" value={name} onChangeText={setName} maxLength={30} autoCapitalize="words" placeholder="What should we call you?" />
      <Field label="Bio · optional" value={bio} onChangeText={setBio} maxLength={160} multiline placeholder="Your kind of night…" />
      <Copy>Pick your starting colour</Copy><Action label={`${accent === 'coral' ? '✓ ' : ''}Resale Coral`} secondary onPress={() => setAccent('coral')} /><Action label={`${accent === 'lime' ? '✓ ' : ''}Verified Lime`} secondary onPress={() => setAccent('lime')} />
      <Action label={editing ? 'Save profile' : 'Next →'} disabled={busy} onPress={() => { if (name.trim().length < 2) setError('Use at least 2 characters for your name.'); else { setError(''); editing ? void finish() : setStep(2); } }} />
    </>}
    {step === 2 && <><Rewards /><Card><Copy>BUY + SELL, FROM DAY ONE</Copy><Copy>Find your next event or list a spare ticket. No separate seller account needed.</Copy></Card><Action label={busy ? 'Saving…' : 'Enter Aftermarket →'} disabled={busy} onPress={() => void finish()} /></>}
  </Flow>;
}
