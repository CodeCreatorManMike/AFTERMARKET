import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { EventFeed } from '../components/discovery/EventFeed';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/typography';

export function SearchScreen() {
  const { colors } = useTheme();
  return <Screen><EventFeed title="All upcoming events" header={<View style={styles.header}>
    <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Search</Text>
    <Text style={[type.body, { color: colors.textSecondary, marginTop: 3 }]}>Events and venues on FIXR near you.</Text>
  </View>} /></Screen>;
}

const styles = StyleSheet.create({ header: { marginTop: 4, marginBottom: 18 } });
