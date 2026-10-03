import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TextInputProps, View } from 'react-native';
import { Screen } from '../../components/common/Screen';
import { useTheme } from '../../theme/ThemeContext';
import { ALL_BADGES } from '../../data/profile';
import { type } from '../../theme/typography';

export function Copy({ children, title = false }: { children: React.ReactNode; title?: boolean }) {
  const { colors } = useTheme();
  return <Text style={[title ? type.pageTitle : type.body, { color: colors.textPrimary }]}>{children}</Text>;
}
export function Action({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ minHeight: 50, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: secondary ? colors.surface : colors.coral, opacity: disabled ? .45 : pressed ? .75 : 1, justifyContent: 'center' })}><Text style={[type.bodyStrong, { color: secondary ? colors.textPrimary : colors.ink, textAlign: 'center' }]}>{label}</Text></Pressable>;
}
export function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={{ padding: 18, gap: 12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>{children}</View>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  return <View style={{ gap: 7 }}><Text style={[type.mono, { color: colors.textPrimary }]}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.textSecondary} {...props} style={[type.body, { color: colors.textPrimary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 12, padding: 14, minHeight: 50 }, props.style]} /></View>;
}
export function Flow({ step, title, subtitle, children, back }: { step: string; title: string; subtitle: string; children: React.ReactNode; back?: () => void }) {
  const { colors } = useTheme();
  return <Screen><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView key={step} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 22, paddingBottom: 48, gap: 18 }}>
    {back && <Action label="← Back" secondary onPress={back} />}
    <Text style={[type.mono, { color: colors.textSecondary }]}>AFTERMARKET / {step}</Text><Copy title>{title}</Copy><Copy>{subtitle}</Copy>{children}
  </ScrollView></KeyboardAvoidingView></Screen>;
}
export function ErrorMessage({ message }: { message: string }) {
  const { colors } = useTheme();
  return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[type.bodyStrong, { color: colors.textPrimary }]}>{message}</Text> : null;
}
export function Rewards() {
  return <Card><Copy>YOUR NIGHTS. YOUR IDENTITY.</Copy><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{ALL_BADGES.filter(b => ['first-event', 'first-ticket', 'trusted-buyer'].includes(b.id)).map(b => <Image key={b.id} source={b.icon} accessibilityLabel={`${b.label} · locked reward preview`} resizeMode="contain" style={{ width: 76, height: 76 }} />)}</View><Copy>◈ First purchase → collector badge</Copy><Copy>✦ First event attended → profile sticker</Copy><Copy>↗ First completed sale → seller badge</Copy><Copy>Keep going to unlock more colours, banners and customisation. Rewards arrive after confirmed activity; these are a preview.</Copy></Card>;
}
