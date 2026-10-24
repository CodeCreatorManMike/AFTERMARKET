import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Image, Keyboard, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, useWindowDimensions, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../components/common/Screen';
import { BackArrowIcon } from '../../components/common/Icons';
import { useTheme } from '../../theme/ThemeContext';
import { ALL_BADGES } from '../../data/profile';
import { fonts, type } from '../../theme/typography';

export function Copy({ children, title = false }: { children: React.ReactNode; title?: boolean }) {
  const { colors } = useTheme();
  return <Text style={[title ? type.pageTitle : type.body, { color: colors.textPrimary }]}>{children}</Text>;
}

export function Action({ label, onPress, secondary = false, disabled = false }: {
  label: string; onPress: () => void; secondary?: boolean; disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [styles.action, {
        borderColor: colors.borderStrong, backgroundColor: secondary ? colors.surface : colors.coral,
        opacity: disabled ? .45 : pressed ? .8 : 1, transform: [{ scale: pressed ? .985 : 1 }],
      }]}>
      <Text style={[type.bodyStrong, { color: secondary ? colors.textPrimary : colors.ink, textAlign: 'center', flexShrink: 1 }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={[type.mono, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={colors.textSecondary}
        returnKeyType={props.multiline ? 'default' : 'done'} onSubmitEditing={props.multiline ? undefined : Keyboard.dismiss}
        {...props} onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={[styles.field, { color: colors.textPrimary, backgroundColor: colors.surface,
          borderColor: focused ? colors.coral : colors.borderStrong, minHeight: props.multiline ? 96 : 54,
          textAlignVertical: props.multiline ? 'top' : 'center' }, props.style]} />
    </View>
  );
}

export function ChoiceRow({ children }: { children: React.ReactNode }) {
  const { fontScale, width } = useWindowDimensions();
  return <View style={{ flexDirection: fontScale > 1.3 || width < 350 ? 'column' : 'row', gap: 10 }}>{children}</View>;
}

export function Choice({ label, selected, onPress, swatch }: { label: string; selected: boolean; onPress: () => void; swatch?: string }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress}
    style={({ pressed }) => [styles.choice, { borderColor: selected ? colors.coral : colors.borderStrong,
      backgroundColor: selected ? colors.coralSoft : colors.surface, opacity: pressed ? .75 : 1 }]}>
    {swatch && <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: swatch }} />}
    <Text style={[type.bodyStrong, { color: colors.textPrimary, flexShrink: 1 }]}>{label}</Text>
    <Text style={{ color: colors.textPrimary }}>{selected ? '●' : '○'}</Text>
  </Pressable>;
}

export function Flow({ step, title, subtitle, children, back, footer, error, progress, artwork }: {
  step: string; title: string; subtitle: string; children: React.ReactNode; back?: () => void;
  footer?: React.ReactNode; error?: string; progress?: number; artwork?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const fade = useRef(new Animated.Value(1)).current;
  const scroll = useRef<ScrollView>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  // At accessibility sizes or on a short keyboard viewport, let the action scroll
  // with the form rather than consuming most of the usable screen.
  const inlineFooter = fontScale > 1.3 || (keyboardOpen && height < 750);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReducedMotion(value); });
    const change = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => { mounted = false; change.remove(); show.remove(); hide.remove(); };
  }, []);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
    if (reducedMotion) { fade.setValue(1); return; }
    fade.setValue(0);
    const animation = Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [step, fade, reducedMotion]);
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
      if (inlineFooter) scroll.current?.scrollToEnd({ animated: !reducedMotion });
    }
  }, [error, inlineFooter, reducedMotion]);
  const actionArea = <><ErrorMessage message={error ?? ''} />{footer}</>;
  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.nav, { borderBottomColor: colors.border }]}>
          {back && <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back} style={[styles.back, { backgroundColor: colors.surface }]}><BackArrowIcon color={colors.textPrimary} size={20} /></Pressable>}
          <Text style={[styles.wordmark, { color: colors.textPrimary }]}>AFTERMARKET<Text style={{ color: colors.coral }}>.</Text></Text>
          <Text style={[type.monoSmall, { color: colors.textSecondary, flexShrink: 1 }]}>PREVIEW</Text>
        </View>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: width < 350 ? 16 : 20, paddingBottom: 24 + (footer && !inlineFooter ? 0 : insets.bottom), gap: 20 }}>
          <Animated.View style={{ opacity: fade, gap: 20 }}>
            <View style={{ gap: 12 }}>
              <Text style={[type.mono, { color: colors.textSecondary }]}>{step}</Text>
              {progress !== undefined && <View accessibilityRole="progressbar" accessibilityLabel="Setup progress" accessibilityValue={{ min: 1, max: 3, now: progress }} style={{ flexDirection: 'row', gap: 6 }}>
                {[1, 2, 3].map(n => <View key={n} style={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: n <= progress ? colors.coral : colors.border }} />)}
              </View>}
            </View>
            {artwork}
            <View style={{ gap: 10 }}>
              <Text accessibilityRole="header" style={[type.hero, { color: colors.textPrimary, fontSize: width < 350 ? 30 : 36, lineHeight: width < 350 ? 34 : 39 }]}>{title}</Text>
              <Text style={[type.body, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
            {children}
          </Animated.View>
          {inlineFooter && <View style={{ gap: 12 }}>{actionArea}</View>}
        </ScrollView>
        {footer && !inlineFooter && <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>{actionArea}</View>}
      </KeyboardAvoidingView>
    </Screen>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  const { colors } = useTheme();
  return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[type.bodyStrong, { color: colors.textPrimary }]}>{message}</Text> : null;
}

export function Rewards() {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const rewards = [
    { id: 'trusted-buyer', title: 'Buy your first ticket', detail: 'Start your badge collection.' },
    { id: 'first-event', title: 'Be there', detail: 'Turn attended events into profile stickers.' },
    { id: 'first-ticket', title: 'Pass a ticket on', detail: 'Complete a sale. Earn your seller badge.' },
  ];
  return <View style={{ gap: 12 }}>
    {rewards.map((reward, index) => <View key={reward.id} style={[styles.reward, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: fontScale > 1.5 ? 'column' : 'row' }]}>
      <Image source={ALL_BADGES.find(b => b.id === reward.id)!.icon} accessible={false} resizeMode="contain" style={{ width: 68, height: 68, transform: [{ rotate: index % 2 ? '5deg' : '-5deg' }] }} />
      <View style={{ flex: 1, gap: 4 }}><Text style={[type.monoSmall, { color: colors.textSecondary }]}>0{index + 1} / LOCKED</Text><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{reward.title}</Text><Text style={[type.body, { color: colors.textSecondary }]}>{reward.detail}</Text></View>
    </View>)}
    <Text style={[type.mono, { color: colors.textSecondary }]}>Your nights become your collection. Rewards unlock after confirmed activity.</Text>
  </View>;
}

const styles = StyleSheet.create({
  nav: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, flexWrap: 'wrap' },
  wordmark: { fontFamily: fonts.displayBlack, fontSize: 17, flexGrow: 1, flexShrink: 1 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  action: { minHeight: 54, padding: 15, borderRadius: 14, borderWidth: 1, justifyContent: 'center' },
  card: { padding: 18, gap: 12, borderRadius: 18, borderWidth: 1 },
  field: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, borderWidth: 1.5, borderRadius: 12, padding: 14 },
  footer: { borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  choice: { flex: 1, minHeight: 54, padding: 14, borderRadius: 14, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  reward: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 14, alignItems: 'center' },
});
