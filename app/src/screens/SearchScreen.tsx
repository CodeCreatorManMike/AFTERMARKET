import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/typography';
import { SearchField } from '../components/discovery/SearchField';
import { CategoryScroller } from '../components/discovery/CategoryScroller';
import { SectionHeader } from '../components/common/SectionHeader';
import { RecentSearchRow } from '../components/discovery/RecentSearchRow';
import { CompactEventRow } from '../components/discovery/CompactEventRow';
import { events } from '../data/events';

const INITIAL_RECENT = ['Keinemusik', 'Cabo Beach Club', 'Ultra South Africa', 'The Jazz Room'];
const POPULAR_IDS = ['e3', 'e2', 'e4', 'e6']; // Fisher, Keinemusik, RÜFÜS DU SOL, Paradise Club

export function SearchScreen() {
  const { colors } = useTheme();
  const [recent, setRecent] = useState(INITIAL_RECENT);
  const popularEvents = POPULAR_IDS.map((id) => events.find((e) => e.id === id)!).filter(Boolean);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          <View style={styles.header}>
            <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Search</Text>
            <Text style={[type.body, { color: colors.textSecondary, marginTop: 3 }]}>
              Events, organisers, or venues.
            </Text>
          </View>

          <SearchField placeholder="Type to search..." />

          <CategoryScroller />

          {recent.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Recent searches"
                action="Clear all"
                onAction={() => setRecent([])}
                showArrow={false}
              />
              <View style={styles.recentList}>
                {recent.map((label) => (
                  <RecentSearchRow
                    key={label}
                    label={label}
                    onRemove={() => setRecent((r) => r.filter((l) => l !== label))}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <SectionHeader title="Popular right now" action="See all" />
            <View style={styles.popularList}>
              {popularEvents.map((event) => (
                <CompactEventRow key={event.id} event={{ ...event, favorited: event.id === 'e4' }} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  page: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 4,
    marginBottom: 28,
  },
  section: {
    marginTop: 30,
  },
  recentList: {
    marginTop: 12,
  },
  popularList: {
    marginTop: 12,
  },
});
