import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { OxfordFixrEvent, visibleOxfordEvents } from '../../data/oxfordFixrEvents';
import { Screen } from '../../components/common/Screen';
import { BackArrowIcon } from '../../components/common/Icons';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, type } from '../../theme/typography';
import { Action } from './FlowUI';

type Props = NativeStackScreenProps<RootStackParamList, 'OxfordEvents'>;
const dates = ['all', ...Array.from({ length: 9 }, (_, index) => `2026-${index < 8 ? '10' : '11'}-${String(index < 8 ? index + 24 : 1).padStart(2, '0')}`)];

function eventTime(event: OxfordFixrEvent) {
  if (!event.startAt) return `${event.date} · time on FIXR`;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(event.startAt));
}

function venueLabel(event: OxfordFixrEvent) {
  return event.venue.toLocaleLowerCase().endsWith('oxford') ? event.venue : `${event.venue}, Oxford`;
}

function EventCard({ event, onSell }: { event: OxfordFixrEvent; onSell: () => void }) {
  const { colors } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    {imageFailed ? <View style={[styles.poster, { backgroundColor: colors.ink, justifyContent: 'center', padding: 16 }]}><Text style={[type.mono, { color: colors.lime }]}>FIXR / OXFORD</Text><Text style={[type.cardTitle, { color: colors.cream }]} numberOfLines={2}>{event.title}</Text></View> :
      <Image source={{ uri: event.imageUrl }} style={styles.poster} resizeMode="cover" onError={() => setImageFailed(true)} accessibilityLabel={`${event.title} organiser artwork via FIXR`} />}
    <View style={styles.cardBody}>
      <View style={styles.topRow}>
        <Text style={[type.monoSmall, { color: colors.coral, flex: 1 }]}>{eventTime(event).toUpperCase()}</Text>
        {event.availabilityAtCheck === 'sold_out' && <Text style={[type.monoSmall, { color: colors.textSecondary }]}>SOLD OUT AT CHECK</Text>}
      </View>
      <Text style={[type.cardTitle, { color: colors.textPrimary }]}>{event.title}</Text>
      <Text style={[type.bodyStrong, { color: colors.textSecondary }]}>{venueLabel(event)}</Text>
      {event.address && <Text style={[type.monoSmall, { color: colors.textMuted }]}>{event.address}</Text>}
      <Text style={[type.body, { color: colors.textSecondary }]} numberOfLines={3}>{event.excerpt}</Text>
      <Text style={[type.monoSmall, { color: colors.textMuted }]}>Event details and artwork: FIXR / organiser · checked 24 Oct</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(event.url)} style={[styles.linkButton, { borderColor: colors.border }]}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>Full details ↗</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onSell} style={[styles.linkButton, { backgroundColor: colors.coral, borderColor: colors.coral }]}><Text style={[type.bodyStrong, { color: colors.ink }]}>Sell spare →</Text></Pressable>
      </View>
    </View>
  </View>;
}

export function OxfordEventsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('all');
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15_000);
    const unsubscribe = navigation.addListener('focus', () => setNow(new Date()));
    return () => { clearInterval(timer); unsubscribe(); };
  }, [navigation]);
  const visible = visibleOxfordEvents(now);
  const results = useMemo(() => visible.filter(event =>
    (date === 'all' || event.date === date) &&
    `${event.title} ${event.venue} ${event.address ?? ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  ), [visible, date, query]);
  return <Screen><FlatList data={results} keyExtractor={item => item.id} showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled"
    ListHeaderComponent={<View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.back}><BackArrowIcon color={colors.textPrimary} /></Pressable>
      <Text style={[type.mono, { color: colors.coral }]}>AFTERMARKET / OXFORD / FIXR</Text>
      <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Find your night.</Text>
      <Text style={[type.body, { color: colors.textSecondary }]}>FIXR events from 24 October to 1 November. Ended events disappear after their published finish time. Check FIXR for changes before buying or selling.</Text>
      <TextInput accessibilityLabel="Search Oxford events" value={query} onChangeText={setQuery} placeholder="Search event or venue" placeholderTextColor={colors.textMuted} style={[styles.search, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dates}>
        {dates.map(day => <Pressable key={day} accessibilityRole="button" accessibilityState={{ selected: date === day }} onPress={() => setDate(day)} style={[styles.dateChip, { backgroundColor: date === day ? colors.coral : colors.surface, borderColor: colors.border }]}><Text style={[type.monoSmall, { color: date === day ? colors.ink : colors.textPrimary }]}>{day === 'all' ? 'ALL DATES' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`)).toUpperCase()}</Text></Pressable>)}
      </ScrollView>
      <Text style={[type.monoSmall, { color: colors.textSecondary }]}>{results.length} UPCOMING / ONGOING EVENTS · PUBLIC SNAPSHOT</Text>
    </View>}
    ListEmptyComponent={<View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[type.cardTitle, { color: colors.textPrimary }]}>No matching upcoming events.</Text><Text style={[type.body, { color: colors.textSecondary }]}>Clear the search or date filter. FIXR has the latest Oxford listings.</Text><Action label="Open FIXR Oxford ↗" secondary onPress={() => void Linking.openURL('https://fixr.co/cities/oxford')} /></View>}
    renderItem={({ item }) => <EventCard event={item} onSell={() => navigation.navigate('OxfordSell', { eventId: item.id })} />}
  /></Screen>;
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 50, gap: 14 }, header: { gap: 14, marginBottom: 8 }, back: { width: 44, height: 44, justifyContent: 'center' },
  search: { borderWidth: 1.5, borderRadius: 14, minHeight: 52, paddingHorizontal: 16, fontFamily: fonts.body, fontSize: 16 },
  dates: { gap: 8, paddingVertical: 2 }, dateChip: { minHeight: 38, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 14 }, poster: { width: '100%', height: 185 }, cardBody: { padding: 16, gap: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  linkButton: { flex: 1, minHeight: 46, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { borderWidth: 1, borderRadius: 18, padding: 18, gap: 10 },
});
