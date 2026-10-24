import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { type, fonts } from '../theme/typography';
import { useCatalogue } from '../features/marketplace/CatalogueContext';
import { useSetCity } from '../features/marketplace/flows';
import { locateCity } from '../features/marketplace/locate';
import { CITIES, City } from '../data/catalogue';

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const { colors, scheme, toggle } = useTheme();
  const { city: current } = useCatalogue();
  const setCity = useSetCity();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function chooseCity(city: City, source: 'location' | 'manual' = 'manual') {
    setError('');
    try { await setCity(city, source); }
    catch { setError('Could not save your city. Try again.'); }
  }
  async function locateMe() {
    setBusy(true); setError('');
    const result = await locateCity();
    if ('city' in result) await chooseCity(result.city, 'location'); else setError(result.error);
    setBusy(false);
  }
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
      <View style={styles.header}>
        <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Settings</Text>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
          style={[styles.closeButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.closeGlyph, { color: colors.textPrimary }]}>×</Text>
        </Pressable>
      </View>

      <View style={[styles.row, { borderColor: colors.border, alignItems: 'flex-start', gap: 12, flexDirection: 'column' }]}>
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>Your city</Text>
        <Text style={[type.body, { color: colors.textSecondary }]}>Events shown are for this city: United Kingdom → Oxford, South Africa → Cape Town.</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
          {(Object.keys(CITIES) as City[]).map(city => <Pressable key={city} accessibilityRole="radio" accessibilityState={{ checked: current === city }} onPress={() => void chooseCity(city)} style={[styles.pill, { flex: 1, minHeight: 56, height: undefined, paddingVertical: 8, borderColor: current === city ? colors.coral : colors.border, backgroundColor: current === city ? colors.coral : colors.surface, justifyContent: 'center', alignItems: 'center' }]}><Text style={[type.bodyStrong, { color: current === city ? colors.ink : colors.textPrimary }]}>{CITIES[city].label}</Text><Text style={[type.monoSmall, { color: current === city ? colors.ink : colors.textSecondary }]}>{CITIES[city].country}</Text></Pressable>)}
        </View>
        <Pressable onPress={() => void locateMe()} disabled={busy} accessibilityRole="button" style={[styles.pill, { alignSelf: 'stretch', height: 46, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', opacity: busy ? .5 : 1 }]}><Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{busy ? 'Finding you…' : 'Use my location'}</Text></Pressable>
        {!!error && <Text accessibilityRole="alert" style={[type.body, { color: colors.coral }]}>{error}</Text>}
      </View>

      <View style={[styles.row, { borderColor: colors.border }]}>
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>Appearance</Text>
        <Pressable
          onPress={toggle}
          style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel={`Currently ${scheme}. Double tap to switch.`}
        >
          <Text style={[styles.pillText, { color: colors.textPrimary }]}>
            {scheme === 'dark' ? 'Night' : 'Day'}
          </Text>
        </Pressable>
      </View>

      <Text style={[type.body, { color: colors.textMuted, marginTop: 20, paddingHorizontal: 20 }]}>
        Account, notifications and provider connections will live here.
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 20,
    lineHeight: 22,
  },
  row: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
});
