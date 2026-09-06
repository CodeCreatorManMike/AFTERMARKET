import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/typography';
import { TicketTabs } from '../components/tickets/TicketTabs';
import { TicketCard } from '../components/tickets/TicketCard';
import { tickets } from '../data/tickets';
import { assignStickers } from '../data/stickerPlacement';

export function TicketsScreen() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = tickets.filter((t) => t.when === 'upcoming');
  const past = tickets.filter((t) => t.when === 'past');
  const visible = tab === 'upcoming' ? upcoming : past;

  // Computed once for the whole Past list so no two tickets on the page
  // ever get handed the same sticker image.
  const pastIds = past.map((t) => t.id).join(',');
  const stickerAssignments = useMemo(() => assignStickers(pastIds ? pastIds.split(',') : []), [pastIds]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[type.pageTitle, { color: colors.textPrimary }]}>My Tickets</Text>
      </View>

      <View style={styles.page}>
        <TicketTabs
          active={tab}
          onChange={setTab}
          upcomingCount={upcoming.length}
          pastCount={past.length}
        />
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <TicketCard
              ticket={item}
              stickerPlacements={item.when === 'past' ? stickerAssignments[item.id] : undefined}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  page: {
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 24,
  },
});
