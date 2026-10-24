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
import { featuredEvents } from '../data/events';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { Action } from '../features/marketplace/FlowUI';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 }]}
      >
        <View style={styles.page}>
          <HomeTopBar />
          <Hero />
          <View style={{ marginVertical: 18, gap: 8 }}>
            <Action label="Explore Oxford FIXR events →" onPress={() => navigation.navigate('OxfordEvents')} />
            <Action label="Oxford Halloween · how it works" secondary onPress={() => navigation.navigate('OxfordGuide')} />
          </View>
          <SearchField />
          <FilterRow />
          <CategoryScroller />

          <View style={styles.sectionGap}>
            <SectionHeader title="Featured events" action="See all" />
          </View>

          <EventCard event={featuredEvents[0]} featured />

          {featuredEvents.slice(1).map((event) => (
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
