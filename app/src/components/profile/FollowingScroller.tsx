import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { FollowedEntity } from '../../data/profile';

export function FollowingScroller({ entities }: { entities: FollowedEntity[] }) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {entities.map((e) => (
        <Pressable
          key={e.id}
          style={styles.item}
          accessibilityRole="button"
          accessibilityLabel={`View ${e.label}`}
        >
          <View style={[styles.circle, { backgroundColor: e.color }]}>
            <Text style={styles.initial}>{e.label.charAt(0)}</Text>
          </View>
          <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
            {e.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 16,
    paddingRight: 20,
  },
  item: {
    alignItems: 'center',
    width: 72,
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 22,
    color: '#F5F0E6',
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    marginTop: 6,
    textAlign: 'center',
  },
});
