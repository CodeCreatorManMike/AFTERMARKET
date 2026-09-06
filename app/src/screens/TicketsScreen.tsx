import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/typography';
import { TicketTabs } from '../components/tickets/TicketTabs';
import { TicketCard } from '../components/tickets/TicketCard';
import { tickets } from '../data/tickets';
import { assignStickers } from '../data/stickerPlacement';
import { assignStamps } from '../data/stampPlacement';
import { MAIN_STAMP, SECONDARY_STAMP } from '../data/stamps';

export function TicketsScreen() {
  const { colors, scheme } = useTheme();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = tickets.filter((t) => t.when === 'upcoming');
  const past = tickets.filter((t) => t.when === 'past');
  const visible = tab === 'upcoming' ? upcoming : past;

  // Computed once for the whole Past list so no two tickets on the page
  // ever get handed the same sticker/stamp image.
  const pastIds = past.map((t) => t.id).join(',');
  const stickerAssignments = useMemo(() => assignStickers(pastIds ? pastIds.split(',') : []), [pastIds]);
  const stampAssignments = useMemo(() => assignStamps(pastIds ? pastIds.split(',') : []), [pastIds]);

  // Night page is Ink — the Coral main stamp reads fine there, but so
  // does the Lime secondary, and Lime gives it more pop against dark.
  // Day page is itself green, so the Lime stamp would disappear —
  // always use the Coral main stamp there instead.
  const cornerStamp = scheme === 'dark' ? SECONDARY_STAMP : MAIN_STAMP;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[type.pageTitle, { color: colors.textPrimary }]}>My Tickets</Text>
        <Image source={cornerStamp} style={styles.cornerStamp} resizeMode="contain" />
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
              stampPlacements={item.when === 'past' ? stampAssignments[item.id] : undefined}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cornerStamp: {
    width: 68,
    height: 68,
    marginTop: -6,
    transform: [{ rotate: '-10deg' }],
  },
  page: {
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 24,
  },
});
