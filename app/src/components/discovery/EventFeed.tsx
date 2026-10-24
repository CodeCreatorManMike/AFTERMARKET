import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { type } from '../../theme/typography';
import { CITIES, DateFilter, filterEvents } from '../../data/catalogue';
import { useCatalogue } from '../../features/marketplace/CatalogueContext';
import { useSetCity, useStartFlow } from '../../features/marketplace/flows';
import { Action } from '../../features/marketplace/FlowUI';
import { SearchField } from './SearchField';
import { FilterRow } from './FilterRow';
import { EventCard } from './EventCard';

/** Searchable, filterable FIXR list for the member's city, most in-demand first. */
export function EventFeed({ header, title }: { header?: React.ReactNode; title: string }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { city, events, live, refresh } = useCatalogue();
  const setCity = useSetCity();
  const { startSell } = useStartFlow();
  const [query, setQuery] = useState('');
  const [date, setDate] = useState<DateFilter>('all');
  const [soldOutOnly, setSoldOutOnly] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [error, setError] = useState('');
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    const unsubscribe = navigation.addListener('focus', () => { setNow(new Date()); void refresh(); });
    return () => { clearInterval(timer); unsubscribe(); };
  }, [navigation, refresh]);
  const results = useMemo(() => filterEvents(events, { query, date, soldOutOnly }, now, city), [events, query, date, soldOutOnly, now, city]);
  const filtered = !!query.trim() || date !== 'all' || soldOutOnly;
  return <FlatList data={results} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
    contentContainerStyle={styles.list} initialNumToRender={6} windowSize={7}
    ListHeaderComponent={<View>
      {header}
      <SearchField value={query} onChangeText={setQuery} />
      <FilterRow city={city} onCity={next => { setError(''); setCity(next).catch(() => setError('Could not change city. Try again.')); }} date={date} onDate={setDate} soldOutOnly={soldOutOnly} onSoldOutOnly={setSoldOutOnly} />
      {!!error && <Text accessibilityRole="alert" style={[type.body, { color: colors.coral, marginBottom: 10 }]}>{error}</Text>}
      <View style={styles.heading}>
        <Text style={[type.sectionTitle, { color: colors.textPrimary }]}>{filtered ? `${results.length} ${results.length === 1 ? 'event' : 'events'}` : title}</Text>
        <Text style={[type.monoSmall, { color: colors.textSecondary }]}>{CITIES[city].label.toUpperCase()} · FIXR · {live ? 'LIVE' : 'LATEST LIST'} · MOST IN-DEMAND FIRST</Text>
      </View>
    </View>}
    renderItem={({ item, index }) => <EventCard event={item} city={city} featured={index === 0 && !filtered} />}
    ListEmptyComponent={<View style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Text style={[type.cardTitle, { color: colors.textPrimary }]}>{events.length ? 'Nothing matches those filters.' : `${CITIES[city].label} events are on their way.`}</Text>
      <Text style={[type.body, { color: colors.textSecondary }]}>{events.length ? 'Try another date or clear your search.' : `We’re bringing the ${CITIES[city].label} FIXR list into Aftermarket. Got a ticket already? You can still list it.`}</Text>
      {events.length ? <Action label="Clear filters" secondary onPress={() => { setQuery(''); setDate('all'); setSoldOutOnly(false); }} /> : <Action label="Sell a ticket" onPress={() => startSell()} />}
    </View>} />;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  heading: { gap: 4, marginBottom: 14 },
  empty: { borderWidth: 1, borderRadius: 18, padding: 18, gap: 10 },
});
