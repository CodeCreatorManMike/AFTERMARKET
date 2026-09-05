import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { HomeIcon, SearchIcon, TicketIcon, ProfileIcon } from './Icons';

export type TabKey = 'home' | 'search' | 'tickets' | 'profile';

const TABS: { key: TabKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'search', label: 'Search', Icon: SearchIcon },
  { key: 'tickets', label: 'Tickets', Icon: TicketIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export function AppTabBar({ active }: { active: TabKey }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        const tint = isActive ? colors.coral : `${colors.ink}A6`;
        return (
          <Pressable key={key} style={styles.item} hitSlop={8}>
            <Icon size={24} color={tint} strokeWidth={isActive ? 2.3 : 2} />
            <Text style={[styles.label, { color: tint }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const TAB_BAR_HEIGHT = 78;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
    paddingTop: 10,
    width: '100%',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
  },
});
