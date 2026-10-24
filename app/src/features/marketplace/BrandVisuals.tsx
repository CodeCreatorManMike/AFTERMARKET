import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TicketIcon } from '../../components/common/Icons';
import { MAIN_STAMP } from '../../data/stamps';
import { events } from '../../data/events';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, type } from '../../theme/typography';

const NIGHT = require('../../../assets/event-images/night/black-coffee-ostrich.png');
const artworkById = new Map(events.map(event => [event.id, event.image]));

export function NightPass({ name, accent = 'coral' }: { name?: string; accent?: 'coral' | 'lime' }) {
  const { fontScale } = useWindowDimensions();
  return <View style={styles.pass}>
    <ImageBackground source={NIGHT} style={{ minHeight: 112 }} imageStyle={{ opacity: .85 }}>
      <LinearGradient colors={['transparent', '#14102B']} style={styles.photoShade}>
        <Text style={[type.mono, { color: '#F5F0E6', flex: 1 }]}>CAPE TOWN / AFTER HOURS</Text>
        <Image source={MAIN_STAMP} accessible={false} style={{ width: 58, height: 58, transform: [{ rotate: '12deg' }] }} />
      </LinearGradient>
    </ImageBackground>
    <View style={[styles.passBody, { backgroundColor: accent === 'coral' ? '#FF5470' : '#C6FF3D' }]}>
      <View style={{ flexDirection: fontScale > 1.4 ? 'column' : 'row', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={[type.monoSmall, { color: '#14102B' }]}>ALL ACCESS / YOUR PROFILE</Text>
          <Text style={[type.sectionTitle, { color: '#14102B' }]}>{name?.trim() || 'Good nights.\nNew stories.'}</Text>
        </View>
        <TicketIcon size={36} color="#14102B" />
      </View>
      <View style={styles.perforation} />
      <Text style={[type.mono, { color: '#14102B' }]}>BUY. SELL. SHOW UP. REPEAT.</Text>
    </View>
  </View>;
}

export function EventChoice({ id, title, venue, date, selected, onPress }: {
  id: string; title: string; venue: string; date: string; selected: boolean; onPress: () => void;
}) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  return <Pressable accessibilityRole="radio" accessibilityLabel={`${title}, ${venue}, ${date}`} accessibilityState={{ checked: selected }} onPress={onPress}
    style={({ pressed }) => [styles.event, { borderColor: selected ? colors.coral : colors.border, backgroundColor: colors.surface, opacity: pressed ? .75 : 1, flexDirection: fontScale > 1.4 ? 'column' : 'row' }]}>
    <Image source={artworkById.get(id) ?? NIGHT} accessible={false} style={{ width: fontScale > 1.4 ? '100%' : 74, height: fontScale > 1.4 ? 100 : 86, borderRadius: 10 }} />
    <View style={{ flex: 1, gap: 5 }}>
      <Text style={[type.monoSmall, { color: colors.textSecondary }]}>{date}</Text>
      <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[type.mono, { color: colors.textSecondary }]}>{venue}</Text>
    </View>
    <Text style={{ color: colors.textPrimary, fontSize: 20 }}>{selected ? '●' : '○'}</Text>
  </Pressable>;
}

export function UploadTile({ uri, busy, onPress }: { uri: string | null; busy: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={uri ? 'Replace ticket screenshot' : 'Upload ticket screenshot'} accessibilityState={{ disabled: busy }} disabled={busy} onPress={onPress}
    style={({ pressed }) => ({ borderRadius: 18, borderWidth: 1.5, borderStyle: uri ? 'solid' : 'dashed', borderColor: colors.coral, padding: 20, gap: 12, alignItems: 'center', backgroundColor: colors.coralSoft, opacity: pressed || busy ? .65 : 1 })}>
    {uri ? <Image source={{ uri }} resizeMode="contain" style={{ width: '100%', height: 190 }} accessibilityLabel="Private ticket screenshot preview" /> : <View style={{ padding: 16, borderRadius: 18, backgroundColor: colors.coral, transform: [{ rotate: '-7deg' }] }}><TicketIcon size={40} color={colors.ink} /></View>}
    <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{busy ? 'Opening photos…' : uri ? 'Screenshot attached · tap to replace' : 'Drop your spare in here.'}</Text>
    <Text style={[type.mono, { color: colors.textSecondary, textAlign: 'center' }]}>{uri ? 'PRIVATE PREVIEW / NOT VERIFIED' : 'CHOOSE A SCREENSHOT / MAX 15 MB'}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  pass: { borderRadius: 18, overflow: 'hidden', backgroundColor: '#14102B' },
  photoShade: { minHeight: 112, padding: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  passBody: { padding: 18, gap: 14 },
  perforation: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(20,16,43,.4)' },
  event: { padding: 10, borderRadius: 16, borderWidth: 1.5, gap: 12, alignItems: 'center' },
});
