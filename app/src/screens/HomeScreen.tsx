import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { HomeTopBar } from '../components/discovery/HomeTopBar';
import { Hero } from '../components/discovery/Hero';
import { SearchField } from '../components/discovery/SearchField';
import { FilterRow } from '../components/discovery/FilterRow';
import { CategoryScroller } from '../components/discovery/CategoryScroller';
import { SectionHeader } from '../components/common/SectionHeader';
import { EventCard } from '../components/discovery/EventCard';
import { events } from '../data/events';

export function HomeScreen() {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 }]}
      >
        <View style={styles.page}>
          <HomeTopBar />
          <Hero />
          <SearchField />
          <FilterRow />
          <CategoryScroller />

          <View style={styles.sectionGap}>
            <SectionHeader title="Featured events" action="See all" />
          </View>

          <EventCard event={events[0]} featured />

          {events.slice(1).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  page: {
    paddingHorizontal: 20,
  },
  sectionGap: {
    marginBottom: 16,
  },
});
