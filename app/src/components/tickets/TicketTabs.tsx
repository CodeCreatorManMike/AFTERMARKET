import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';

export function TicketTabs({
  active,
  onChange,
  upcomingCount,
  pastCount,
}: {
  active: 'upcoming' | 'past';
  onChange: (tab: 'upcoming' | 'past') => void;
  upcomingCount: number;
  pastCount: number;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { borderBottomColor: colors.borderStrong }]}>
      <Tab
        label={`Upcoming (${upcomingCount})`}
        isActive={active === 'upcoming'}
        onPress={() => onChange('upcoming')}
      />
      <Tab label={`Past (${pastCount})`} isActive={active === 'past'} onPress={() => onChange('past')} />
    </View>
  );
}

function Tab({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? colors.textPrimary : colors.textMuted },
          isActive && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
      {isActive && <View style={[styles.indicator, { backgroundColor: colors.coral }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    marginBottom: 22,
  },
  tab: {
    marginRight: 28,
    paddingBottom: 12,
  },
  tabLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15.5,
  },
  tabLabelActive: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  indicator: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
});
