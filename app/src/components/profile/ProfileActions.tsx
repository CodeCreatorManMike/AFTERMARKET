import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { AddFriendIcon, LinkIcon, QRIcon } from '../common/Icons';

export function ProfileActions() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.addFriends, { backgroundColor: colors.lime, borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel="Add friends"
      >
        <AddFriendIcon size={21} color="#14102B" />
        <Text style={styles.addFriendsText}>Add friends</Text>
      </Pressable>

      <Pressable style={styles.iconButton} hitSlop={10} accessibilityRole="button" accessibilityLabel="Show profile QR code">
        <QRIcon size={32} color={colors.textPrimary} />
      </Pressable>

      <Pressable style={styles.iconButton} hitSlop={10} accessibilityRole="button" accessibilityLabel="Copy profile link">
        <LinkIcon size={30} color={colors.textPrimary} strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
  },
  addFriends: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  addFriendsText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: '#14102B',
  },
  iconButton: {
    width: 44,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
