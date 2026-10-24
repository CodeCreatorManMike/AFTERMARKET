import React, { useState } from 'react';
import { Text } from 'react-native';
import { Action, Choice, ChoiceRow, Field, Flow, Rewards } from './FlowUI';
import { NightPass } from './BrandVisuals';
import { AuthMethod, validContact } from './model';
import { useMarketplace } from './MarketplaceContext';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';

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
  function next() {
    if (step === 0 && !validContact(method, contact)) {
      setError(method === 'Email' ? 'Enter a valid email address.' : 'Use a country code, for example +27 82 123 4567.'); return;
    }
    if (step === 1 && name.trim().length < 2) { setError('Use at least 2 characters for your name.'); return; }
    setError('');
    if (step === 2 || editing) void finish(); else setStep(step + 1);
  }
  function choose(option: AuthMethod) { setMethod(option); setContact(''); setError(''); }
  return (
    <Flow step={editing ? 'YOUR IDENTITY / EDIT PROFILE' : `YOUR ALL-ACCESS PASS / 0${step + 1}`} progress={editing ? undefined : step + 1}
      title={step === 0 ? 'Your next night\nstarts here.' : step === 1 ? 'Make it yours.' : 'Collect nights.\nNot just tickets.'}
      subtitle={step === 0 ? 'Find a way in. Pass a spare on. One account does both.' : step === 1 ? 'Your name. Your colour. Your corner of the crowd.' : 'Buy, show up, pass it on. Build a profile with a story.'}
      artwork={step < 2 ? <NightPass name={step === 1 ? name : undefined} accent={accent} /> : undefined}
      error={error || loadError}
      back={step > 0 ? () => { setError(''); editing && step === 1 ? onDone?.() : setStep(step - 1); } : undefined}
      footer={<Action label={busy ? 'Saving…' : editing ? 'Save my profile' : step === 0 ? `Try ${method} setup →` : step === 1 ? 'Next: your collection →' : 'Find my next night →'} disabled={busy} onPress={next} />}>
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
      {step === 2 && <Rewards />}
    </Flow>
  );
}
