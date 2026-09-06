import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { AddFriendIcon, CopyIcon, LinkIcon, QRIcon } from '../common/Icons';

export function ProfileActions({ username }: { username: string }) {
  const { colors, scheme } = useTheme();
  // Whichever brand color isn't the page background: lime pops on the
  // dark/ink night page, coral pops on the green day page.
  const addFriendsBg = scheme === 'dark' ? colors.lime : colors.coral;
  const shareUrl = `aftermarket.com/u/${username}`;

  return (
    <View>
      <View style={styles.row}>
        <Pressable
          style={[styles.addFriends, { backgroundColor: addFriendsBg, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Add friends"
        >
          <AddFriendIcon size={19} color="#14102B" />
          <Text style={styles.addFriendsText}>Add friends</Text>
        </Pressable>

        <Pressable
          style={[styles.scanCode, { borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Scan a code"
        >
          <QRIcon size={18} color={colors.textPrimary} />
          <Text style={[styles.scanCodeText, { color: colors.textPrimary }]}>Scan code</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.shareRow, { borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel={`Copy profile link ${shareUrl}`}
      >
        <LinkIcon size={18} color={colors.textSecondary} />
        <View style={styles.shareTextWrap}>
          <Text style={[styles.shareLabel, { color: colors.textPrimary }]}>Share your link</Text>
          <Text style={[styles.shareUrl, { color: colors.textSecondary }]}>{shareUrl}</Text>
        </View>
        <CopyIcon size={19} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  addFriends: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  addFriendsText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#14102B',
  },
  scanCode: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanCodeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  shareRow: {
    marginTop: 10,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  shareTextWrap: {
    flex: 1,
  },
  shareLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14.5,
  },
  shareUrl: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    marginTop: 1,
  },
});
