import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { CalendarIcon, ChevronDownIcon, MapPinIcon, SlidersIcon } from '../common/Icons';
import { CITIES, City, DATE_FILTERS, DateFilter } from '../../data/catalogue';

type Props = {
  city: City; onCity: (city: City) => void;
  date: DateFilter; onDate: (date: DateFilter) => void;
  soldOutOnly: boolean; onSoldOutOnly: (value: boolean) => void;
};

/** Location, date and availability filters. Each pill opens its own option row. */
export function FilterRow({ city, onCity, date, onDate, soldOutOnly, onSoldOutOnly }: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState<'city' | 'date' | 'more' | null>(null);
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360 || fontScale > 1.25;
  const toggle = (panel: typeof open) => setOpen(open === panel ? null : panel);
  const chip = (label: string, selected: boolean, onPress: () => void) => <Pressable key={label} onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }}
    style={[styles.chip, { borderColor: selected ? colors.coral : colors.border, backgroundColor: selected ? colors.coral : colors.surface }]}>
    <Text style={[styles.chipText, { color: selected ? colors.ink : colors.textPrimary }]}>{label}</Text>
  </Pressable>;
  const activeFilters = (date !== 'all' ? 1 : 0) + (soldOutOnly ? 1 : 0);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable onPress={() => toggle('city')} style={[styles.pill, { flex: 1.1, borderColor: open === 'city' ? colors.coral : colors.border }]} accessibilityRole="button" accessibilityLabel={`Location: ${CITIES[city].label}`} accessibilityHint="Change your city" accessibilityState={{ expanded: open === 'city' }}>
          {!compact && <MapPinIcon size={16} color={colors.textPrimary} />}
          <Text style={[styles.pillText, { color: colors.textPrimary }]} numberOfLines={1}>{CITIES[city].label}</Text>
          <ChevronDownIcon size={12} color={colors.textPrimary} />
        </Pressable>
        <Pressable onPress={() => toggle('date')} style={[styles.pill, { flex: 1.15, borderColor: open === 'date' || date !== 'all' ? colors.coral : colors.border }]} accessibilityRole="button" accessibilityLabel={`Date: ${DATE_FILTERS.find(item => item.key === date)?.label}`} accessibilityState={{ expanded: open === 'date' }}>
          {!compact && <CalendarIcon size={16} color={colors.textPrimary} />}
          <Text style={[styles.pillText, { color: colors.textPrimary }]} numberOfLines={1}>{DATE_FILTERS.find(item => item.key === date)?.label}</Text>
          <ChevronDownIcon size={12} color={colors.textPrimary} />
        </Pressable>
        <Pressable onPress={() => toggle('more')} style={[styles.iconButton, { borderColor: open === 'more' || soldOutOnly ? colors.coral : colors.border }]} accessibilityRole="button" accessibilityLabel={`More filters${activeFilters ? `, ${activeFilters} active` : ''}`} accessibilityState={{ expanded: open === 'more' }}>
          <SlidersIcon size={17} color={colors.textPrimary} />
          {activeFilters > 0 && <View style={[styles.dot, { backgroundColor: colors.coral }]} />}
        </Pressable>
      </View>
      {open === 'city' && <View style={styles.options}>{(Object.keys(CITIES) as City[]).map(key => chip(`${CITIES[key].label} · ${CITIES[key].country}`, city === key, () => { onCity(key); setOpen(null); }))}</View>}
      {open === 'date' && <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollOptions}>{DATE_FILTERS.map(item => chip(item.label, date === item.key, () => { onDate(item.key); setOpen(null); }))}</ScrollView>}
      {open === 'more' && <View style={styles.options}>
        {chip('Everything', !soldOutOnly, () => onSoldOutOnly(false))}
        {chip('Sold out at last check', soldOutOnly, () => onSoldOutOnly(true))}
        {activeFilters > 0 && chip('Clear filters', false, () => { onDate('all'); onSoldOutOnly(false); setOpen(null); })}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 18, gap: 10 },
  row: { flexDirection: 'row', gap: 8 },
  pill: { minHeight: 50, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 10 },
  pillText: { fontFamily: fonts.bodyMedium, fontSize: 13, flexShrink: 1 },
  iconButton: { width: 50, height: 50, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scrollOptions: { gap: 8 },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.mono, fontSize: 12 },
});
