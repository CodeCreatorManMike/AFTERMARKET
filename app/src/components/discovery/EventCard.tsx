import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { EventItem } from '../../data/events';
import { HeartIcon } from '../common/Icons';

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [favorited, setFavorited] = useState(!!event.favorited);
  return (
    <View style={styles.card}>
      <View style={[styles.imageWrap, { height: featured ? 250 : 180 }]}>
        <Image source={event.image} style={styles.image} resizeMode="cover" />
        <Pressable style={styles.favButton} onPress={() => setFavorited((f) => !f)} hitSlop={8}>
          <HeartIcon size={18} color={favorited ? colors.coral : colors.cream} filled={favorited} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={styles.meta}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{event.day}</Text>
          <Text style={styles.dateNum}>{event.date}</Text>
          <Text style={styles.dateMonth}>{event.month}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.venue} numberOfLines={1}>
            {event.venue} · {event.city}
          </Text>
          <Text style={styles.tag}>{event.categoryLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    marginBottom: 16,
  },
  imageWrap: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.ink,
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
    borderRightColor: colors.border,
  },
  dateDay: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dateNum: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 30,
  },
  dateMonth: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
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
    color: colors.ink,
  },
  venue: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
