import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { SellerListing } from '../../data/sellers';
import { BoltIcon, CheckBadgeIcon, ClockIcon, InfoIcon, StarIcon, TicketIcon } from '../common/Icons';

export function SellerRow({ seller }: { seller: SellerListing }) {
  const { colors } = useTheme();
  const instant = seller.deliverySpeed === 'instant';

  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: seller.avatarColor }]}>
          <Text style={styles.avatarInitial}>{seller.username.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.usernameRow}>
            <Text style={[styles.username, { color: colors.textPrimary }]} numberOfLines={1}>
              {seller.username}
            </Text>
            {seller.verified && <CheckBadgeIcon size={15} color={colors.lime} />}
          </View>

          <View style={styles.metaRow}>
            {seller.topSeller && (
              <>
                <Text style={[styles.topSeller, { color: colors.coral }]}>Top seller</Text>
                <Text style={[styles.dot, { color: colors.textMuted }]}>·</Text>
              </>
            )}
            <StarIcon size={12} color="#F2B94D" />
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {seller.rating.toFixed(1)} ({seller.ratingCount})
            </Text>
          </View>
          <Text style={[styles.soldCount, { color: colors.textMuted }]}>{seller.ticketsSold} tickets sold</Text>
        </View>

        <View style={styles.priceCol}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>R{seller.price}</Text>
          <Text style={[styles.perTicket, { color: colors.textMuted }]}>per ticket</Text>
          <Pressable
            style={[styles.buyButton, { backgroundColor: colors.coral }]}
            accessibilityRole="button"
            accessibilityLabel={`Buy securely from ${seller.username} for R${seller.price}`}
          >
            <Text style={styles.buyButtonText}>Buy securely</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.bottomRow, { borderTopColor: colors.border }]}>
        <View style={styles.deliveryRow}>
          {instant ? (
            <BoltIcon size={14} color={colors.lime} />
          ) : (
            <ClockIcon size={13} color={colors.coral} strokeWidth={1.8} />
          )}
          <Text style={[styles.deliveryText, { color: instant ? colors.lime : colors.coral }]}>
            {instant ? 'Instant transfer' : seller.deliverySpeed === 'within1h' ? 'Within 1 hour' : 'Within 2 hours'}
          </Text>
          <InfoIcon size={13} color={colors.textMuted} />
        </View>
        <View style={styles.availableRow}>
          <TicketIcon size={13} color={colors.textMuted} />
          <Text style={[styles.availableText, { color: colors.textMuted }]}>
            {seller.ticketsAvailable === 1 ? '1 ticket available' : `1-${seller.ticketsAvailable} tickets available`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 17,
    color: '#F5F0E6',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  username: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topSeller: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  dot: {
    fontSize: 12,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
  soldCount: {
    fontFamily: fonts.mono,
    fontSize: 11,
    marginTop: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 19,
  },
  perTicket: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    marginBottom: 4,
  },
  buyButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,
    color: '#14102B',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  availableText: {
    fontFamily: fonts.mono,
    fontSize: 11,
  },
});
