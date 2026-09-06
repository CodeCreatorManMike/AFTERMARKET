import React, { useMemo, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { fonts, type } from '../theme/typography';
import { EventItem } from '../data/events';
import { generateSellers } from '../data/sellers';
import { MAIN_STAMP, SECONDARY_STAMP } from '../data/stamps';
import { SpinningStamp } from '../components/tickets/SpinningStamp';
import { SellerRow } from '../components/eventDetail/SellerRow';
import { BackArrowIcon, CalendarIcon, MapPinIcon, ShieldCheckIcon } from '../components/common/Icons';

type TicketType = 'general' | 'vip';

function timeRangeFor(event: EventItem): string {
  return event.timeOfDay === 'night' ? '18:00 – 23:00' : '11:00 – 17:00';
}

export function TicketOptionsScreen({
  route,
  navigation,
}: {
  route: { params: { event: EventItem } };
  navigation: { goBack: () => void };
}) {
  const { event } = route.params;
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [ticketType, setTicketType] = useState<TicketType>('general');
  const [sort, setSort] = useState<'best' | 'lowest' | 'top'>('best');
  const [qty, setQty] = useState(1);

  const vipPrice = Math.round(event.priceFrom * 2.1);
  const generalSellers = useMemo(() => generateSellers(event.id, 'general', event.priceFrom), [event.id, event.priceFrom]);
  const vipSellers = useMemo(() => generateSellers(event.id, 'vip', vipPrice), [event.id, vipPrice]);

  const sellers = ticketType === 'general' ? generalSellers : vipSellers;
  const sortedSellers = useMemo(() => {
    const list = [...sellers];
    if (sort === 'lowest') list.sort((a, b) => a.price - b.price);
    if (sort === 'top') list.sort((a, b) => b.ticketsSold - a.ticketsSold);
    return list;
  }, [sellers, sort]);

  const cornerStamp = scheme === 'dark' ? SECONDARY_STAMP : MAIN_STAMP;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={navigation.goBack}
          style={[styles.backButton, { backgroundColor: colors.surfaceRaised }]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <BackArrowIcon size={19} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[type.pageTitle, { color: colors.textPrimary, fontSize: 30 }]}>Ticket options</Text>
          <Text style={[type.body, { color: colors.textSecondary, marginTop: 2 }]}>
            Choose your tickets and join the experience.
          </Text>
        </View>

        <SpinningStamp source={cornerStamp} size={58} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.eventCard, { borderColor: colors.border }]}>
          <ImageBackground source={event.image} style={styles.eventImage} resizeMode="cover" />
          <View style={styles.eventInfo}>
            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>AFTERMARKET PRESENTS</Text>
            <Text style={[styles.eventTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.eventMetaRow}>
              <MapPinIcon size={13} color={colors.textSecondary} />
              <Text style={[styles.eventMetaText, { color: colors.textSecondary }]} numberOfLines={1}>
                {event.venue} · {event.city}
              </Text>
            </View>
            <View style={styles.eventMetaRow}>
              <CalendarIcon size={13} color={colors.textSecondary} />
              <Text style={[styles.eventMetaText, { color: colors.textSecondary }]}>
                {event.day} {event.date} {event.month} · {timeRangeFor(event)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketTypeRow}>
          <Pressable
            onPress={() => setTicketType('general')}
            style={[
              styles.ticketTypePill,
              ticketType === 'general' ? { backgroundColor: colors.coral } : { borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.ticketTypeLabel, { color: ticketType === 'general' ? '#14102B' : colors.textPrimary }]}>
              General Admission
            </Text>
            <Text style={[styles.ticketTypePrice, { color: ticketType === 'general' ? '#14102B' : colors.textMuted }]}>
              From R{event.priceFrom}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTicketType('vip')}
            style={[
              styles.ticketTypePill,
              ticketType === 'vip' ? { backgroundColor: colors.coral } : { borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.ticketTypeLabel, { color: ticketType === 'vip' ? '#14102B' : colors.textPrimary }]}>
              VIP Access
            </Text>
            <Text style={[styles.ticketTypePrice, { color: ticketType === 'vip' ? '#14102B' : colors.textMuted }]}>
              From R{vipPrice}
            </Text>
          </Pressable>

          <Pressable style={[styles.ticketTypePill, styles.allTicketsPill, { borderColor: colors.border }]}>
            <Text style={[styles.ticketTypeLabel, { color: colors.textPrimary }]}>All tickets</Text>
          </Pressable>
        </View>

        <View style={styles.sortRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortScrollWrap}
            contentContainerStyle={styles.sortScroll}
          >
            {(['best', 'lowest', 'top'] as const).map((key) => {
              const label = key === 'best' ? 'Best match' : key === 'lowest' ? 'Lowest price' : 'Top sellers';
              const active = sort === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSort(key)}
                  style={[
                    styles.sortPill,
                    active ? { backgroundColor: colors.coral } : { borderWidth: 1, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.sortLabel, { color: active ? '#14102B' : colors.textPrimary }]}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.qtyDivider, { backgroundColor: colors.border }]} />

          <View style={styles.qtyRow}>
            {[1, 2, 3, 4].map((n) => (
              <Pressable
                key={n}
                onPress={() => setQty(n)}
                style={[
                  styles.qtyChip,
                  qty === n ? { backgroundColor: colors.coral } : { borderWidth: 1, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.qtyLabel, { color: qty === n ? '#14102B' : colors.textPrimary }]}>
                  {n === 4 ? '4+' : n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sellerList}>
          {sortedSellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </View>

        <View style={[styles.trustBanner, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <ShieldCheckIcon size={26} color={colors.lime} />
          <View style={styles.trustText}>
            <Text style={[styles.trustTitle, { color: colors.textPrimary }]}>Your money is safe</Text>
            <Text style={[styles.trustBody, { color: colors.textSecondary }]}>
              We hold your payment in escrow until the ticket transfer is confirmed. If there's an issue, you'll get a
              full refund.
            </Text>
            <Text style={[styles.trustLink, { color: colors.lime }]}>Learn more →</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  eventCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
  },
  eventImage: {
    width: 140,
    alignSelf: 'stretch',
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  eventTitle: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 18,
    lineHeight: 21,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMetaText: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    flexShrink: 1,
  },
  ticketTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  ticketTypePill: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  allTicketsPill: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketTypeLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  ticketTypePrice: {
    fontFamily: fonts.mono,
    fontSize: 11,
    marginTop: 2,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sortScrollWrap: {
    flex: 1,
  },
  sortScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  sortPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
  },
  qtyDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 10,
  },
  qtyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  qtyChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,
  },
  sellerList: {
    marginBottom: 8,
  },
  trustBanner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  trustText: {
    flex: 1,
    gap: 3,
  },
  trustTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  trustBody: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
  },
  trustLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,
    marginTop: 4,
  },
});
