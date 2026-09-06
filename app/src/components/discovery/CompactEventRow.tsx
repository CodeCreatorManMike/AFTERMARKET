import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { EventItem } from '../../data/events';
import { HeartIcon } from '../common/Icons';

export function CompactEventRow({ event }: { event: EventItem }) {
  const [favorited, setFavorited] = useState(!!event.favorited);
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  return (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('TicketOptions', { event })}
      accessible
      accessibilityLabel={`Open ${event.title}, ${event.venue}, ${event.city}, ${event.day} ${event.date} ${event.month}`}
    >
      <Image source={event.image} style={styles.thumb} resizeMode="cover" importantForAccessibility="no" />
      <View style={styles.info} importantForAccessibility="no">
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={[styles.venue, { color: colors.textSecondary }]} numberOfLines={1}>
          {event.venue} · {event.city}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {event.day} {event.date} {event.month}
        </Text>
      </View>
      <Pressable
        style={styles.favButton}
        onPress={() => setFavorited((f) => !f)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={favorited ? 'Remove from favourites' : 'Add to favourites'}
        accessibilityState={{ selected: favorited }}
      >
        <HeartIcon size={19} color={favorited ? colors.coral : colors.textMuted} filled={favorited} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 84,
    gap: 14,
    marginBottom: 18,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 17.5,
  },
  venue: {
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
  },
  favButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
