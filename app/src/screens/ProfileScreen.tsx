import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { useTheme } from '../theme/ThemeContext';
import { type } from '../theme/typography';

export function ProfileScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={styles.page}>
        <Text style={[type.pageTitle, { color: colors.textPrimary }]}>Profile</Text>
        <Text style={[type.body, { color: colors.textSecondary, marginTop: 8 }]}>
          Your profile, badges, and following will live here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
