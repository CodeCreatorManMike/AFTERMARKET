import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.outer}>
        <View style={styles.inner}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
});
