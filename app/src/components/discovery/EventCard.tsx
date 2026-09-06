import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { EventItem } from '../../data/events';
import { HeartIcon } from '../common/Icons';

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [favorited, setFavorited] = useState(!!event.favorited);
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <Pressable
      style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surfaceRaised }]}
      onPress={() => navigation.navigate('TicketOptions', { event })}
      accessibilityLabel={`Open ${event.title}`}
    >
      <View style={[styles.imageWrap, { height: featured ? 250 : 180, backgroundColor: colors.ink }]}>
        <Image
          source={event.image}
          style={styles.image}
          resizeMode="cover"
          accessible
          accessibilityRole="image"
          accessibilityLabel={`${event.title} at ${event.venue}, ${event.city}`}
        />
        <Pressable
          style={styles.favButton}
          onPress={() => setFavorited((f) => !f)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={favorited ? 'Remove from favourites' : 'Add to favourites'}
          accessibilityState={{ selected: favorited }}
        >
          <HeartIcon size={18} color={favorited ? colors.coral : colors.cream} filled={favorited} strokeWidth={2} />
        </Pressable>
      </View>

      <View
        style={styles.meta}
        accessible
        accessibilityLabel={`${event.title}, ${event.categoryLabel}, ${event.venue}, ${event.city}, ${event.day} ${event.date} ${event.month}, from R${event.priceFrom}`}
      >
        <View style={[styles.dateBadge, { borderRightColor: colors.border }]} importantForAccessibility="no">
          <Text style={[styles.dateDay, { color: colors.textSecondary }]}>{event.day}</Text>
          <Text style={[styles.dateNum, { color: colors.textPrimary }]}>{event.date}</Text>
          <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>{event.month}</Text>
        </View>

        <View style={styles.info} importantForAccessibility="no">
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={[styles.venue, { color: colors.textSecondary }]} numberOfLines={1}>
            {event.venue} · {event.city}
          </Text>
          <Text style={[styles.tag, { color: colors.textMuted }]}>{event.categoryLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  imageWrap: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(20,16,43,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
  },
  dateBadge: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRightWidth: 1,
  },
  dateDay: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dateNum: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 26,
    lineHeight: 30,
  },
  dateMonth: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
    gap: 3,
  },
  title: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 19,
  },
  venue: {
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    marginTop: 2,
  },
});
