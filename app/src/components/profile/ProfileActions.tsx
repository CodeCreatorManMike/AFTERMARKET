import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/typography';
import { AddFriendIcon, LinkIcon } from '../common/Icons';

const QR = require('../../../assets/icons/qr-code.png');

export function ProfileActions() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.addFriends, { backgroundColor: colors.coral }]}
        accessibilityRole="button"
        accessibilityLabel="Add friends"
      >
        <AddFriendIcon size={19} color="#14102B" />
        <Text style={styles.addFriendsText}>Add friends</Text>
      </Pressable>

      <Pressable
        style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel="Show profile QR code"
      >
        <Image source={QR} style={styles.qr} resizeMode="contain" />
      </Pressable>

      <Pressable
        style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel="Copy profile link"
      >
        <LinkIcon size={19} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  addFriends: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addFriendsText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#14102B',
  },
  iconButton: {
    width: 64,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr: {
    width: 28,
    height: 28,
  },
});
