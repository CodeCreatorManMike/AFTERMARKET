import React, { useState } from 'react';
import { Text } from 'react-native';
import { Action, Choice, ChoiceRow, Field, Flow, Rewards } from './FlowUI';
import { NightPass } from './BrandVisuals';
import { AuthMethod, validContact } from './model';
import { useMarketplace } from './MarketplaceContext';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { CITIES, City, deviceCity } from '../../data/catalogue';
import { locateCity } from './locate';

export function OnboardingScreen({ onDone }: { onDone?: () => void }) {
  const { state, save, error: loadError } = useMarketplace();
  const { colors } = useTheme();
  const editing = !!state.member;
  const [step, setStep] = useState(editing ? 1 : 0);
  const [method, setMethod] = useState<AuthMethod>(state.member?.method ?? 'Apple');
  const [contact, setContact] = useState('');
  const [name, setName] = useState(state.member?.name ?? '');
  const [bio, setBio] = useState(state.member?.bio ?? '');
  const [accent, setAccent] = useState<'coral' | 'lime'>(state.member?.accent ?? 'coral');
  const [city, setCity] = useState<City | null>(state.member?.city ?? (editing ? 'oxford' : null));
  const suggested = deviceCity();
  const [citySource, setCitySource] = useState<'location' | 'manual'>(state.member?.citySource ?? 'manual');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function finish() {
    setBusy(true); setError('');
    try {
      await save({ ...state, member: { name: name.trim(), bio: bio.trim(), accent, method, joined: state.member?.joined ?? new Date().toISOString(), city: city ?? undefined, citySource: city ? citySource : undefined } });
      onDone?.();
    } catch { setError('Could not save your profile. Please try again.'); }
    finally { setBusy(false); }
  }
  function next() {
    if (step === 0 && !validContact(method, contact)) {
      setError(method === 'Email' ? 'Enter a valid email address.' : 'Use a country code, for example +27 82 123 4567.'); return;
    }
    if (step === 1 && name.trim().length < 2) { setError('Use at least 2 characters for your name.'); return; }
    if (step === 2 && !city) { setError('Share your location or choose a city to see nearby nights.'); return; }
    setError('');
    if (step === 3 || editing) void finish(); else setStep(step + 1);
  }
  async function findCity() {
    setBusy(true); setError('');
    const result = await locateCity();
    if ('city' in result) { setCity(result.city); setCitySource('location'); }
    else setError(result.error);
    setBusy(false);
  }
  function choose(option: AuthMethod) { setMethod(option); setContact(''); setError(''); }
  return (
    <Flow step={editing ? 'YOUR IDENTITY / EDIT PROFILE' : `YOUR ALL-ACCESS PASS / 0${step + 1}`} progress={editing ? undefined : step + 1} progressMax={editing ? 3 : 4}
      title={step === 0 ? 'Your next night\nstarts here.' : step === 1 ? 'Make it yours.' : step === 2 ? 'Your city.\nYour nights.' : 'Collect nights.\nNot just tickets.'}
      subtitle={step === 0 ? 'Find a way in. Pass a spare on. One account does both.' : step === 1 ? 'Your name. Your colour. Your corner of the crowd.' : step === 2 ? 'We show FIXR events where you are. Allow location, or pick your city.' : 'Buy, show up, pass it on. Build a profile with a story.'}
      artwork={step < 2 ? <NightPass name={step === 1 ? name : undefined} accent={accent} /> : undefined}
      error={error || loadError}
      back={step > 0 ? () => { setError(''); editing && step === 1 ? onDone?.() : setStep(step - 1); } : undefined}
      footer={<Action label={busy ? 'Please wait…' : editing ? 'Save my profile' : step === 0 ? `Try ${method} setup →` : step === 1 ? 'Next: choose your city →' : step === 2 ? 'Next: your collection →' : 'Find my next night →'} disabled={busy} onPress={next} />}>
      {step === 0 && <>
        <ChoiceRow>{(['Apple', 'Google'] as AuthMethod[]).map(option => <Choice key={option} label={option} selected={method === option} onPress={() => choose(option)} />)}</ChoiceRow>
        <ChoiceRow>{(['Email', 'Phone'] as AuthMethod[]).map(option => <Choice key={option} label={option} selected={method === option} onPress={() => choose(option)} />)}</ChoiceRow>
        {(method === 'Email' || method === 'Phone') && <Field label={method === 'Email' ? 'Email address' : 'Phone number including country code'} value={contact} onChangeText={setContact} keyboardType={method === 'Email' ? 'email-address' : 'phone-pad'} autoCapitalize="none" autoCorrect={false} placeholder={method === 'Email' ? 'you@example.com' : '+27 82 123 4567'} maxLength={120} />}
        <Text style={[type.mono, { color: colors.textSecondary }]}>Try the flow with sample details. No real account or sign-in message yet.</Text>
      </>}
      {step === 1 && <>
        <Field label="Display name · required" value={name} onChangeText={setName} maxLength={30} autoCapitalize="words" placeholder="What should we call you?" />
        <Field label="Bio · optional" value={bio} onChangeText={setBio} maxLength={160} multiline placeholder="Your kind of night…" />
        <ChoiceRow><Choice label="Coral" swatch="#FF5470" selected={accent === 'coral'} onPress={() => setAccent('coral')} /><Choice label="Lime" swatch="#C6FF3D" selected={accent === 'lime'} onPress={() => setAccent('lime')} /></ChoiceRow>
      </>}
      {step === 2 && <>
        <Action label={busy ? 'Finding you…' : city && citySource === 'location' ? `✓ Located · ${CITIES[city].country}` : 'Allow location access'} disabled={busy} onPress={() => void findCity()} />
        <Text style={[type.body, { color: colors.textSecondary }]}>We only check which country you’re in — UK events are in Oxford, South African events are in Cape Town. Your exact location is never saved, and you can change city in Settings.</Text>
        <ChoiceRow>{(Object.keys(CITIES) as City[]).map(key => <Choice key={key} label={`${CITIES[key].label}${!city && key === suggested ? ' · suggested' : ''}`} selected={city === key} onPress={() => { setCity(key); setCitySource('manual'); setError(''); }} />)}</ChoiceRow>
        {city && <Text style={[type.mono, { color: colors.coral }]}>YOUR CITY / {CITIES[city].label.toUpperCase()} · {CITIES[city].country.toUpperCase()}</Text>}
      </>}
      {step === 3 && <><Rewards /><Text style={[type.body, { color: colors.textSecondary }]}>Buy and sell from the same account. The first time you do either, we’ll walk you through it in a few steps.</Text></>}
    </Flow>
  );
}
