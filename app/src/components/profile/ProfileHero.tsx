import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { BackArrowIcon, GearIcon, PencilIcon } from '../common/Icons';

const BANNER_HEIGHT = 225;
const AVATAR_SIZE = 118;

export function ProfileHero({
  banner,
  avatar,
  onBack,
  onEdit,
  onSettings,
}: {
  banner: number;
  avatar: number;
  onBack?: () => void;
  onEdit?: () => void;
  onSettings?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { marginBottom: AVATAR_SIZE / 2 - 8 }]}>
      <ImageBackground source={banner} style={styles.banner} resizeMode="cover">
        <View style={styles.topRow}>
          <RoundButton onPress={onBack} accessibilityLabel="Back">
            <BackArrowIcon size={19} color="#14102B" />
          </RoundButton>
          <View style={styles.topRight}>
            <RoundButton onPress={onEdit} accessibilityLabel="Edit profile">
              <PencilIcon size={17} color="#14102B" />
            </RoundButton>
            <RoundButton onPress={onSettings} accessibilityLabel="Settings">
              <GearIcon size={17} color="#14102B" />
            </RoundButton>
          </View>
        </View>
      </ImageBackground>

      <View
        style={[
          styles.avatarWrap,
          { borderColor: colors.background, backgroundColor: colors.surfaceRaised },
        ]}
      >
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />
      </View>
    </View>
  );
}

function RoundButton({
  children,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.roundButton}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  banner: {
    height: BANNER_HEIGHT,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  topRight: {
    flexDirection: 'row',
    gap: 10,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245,240,230,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    position: 'absolute',
    left: 20,
    top: BANNER_HEIGHT - AVATAR_SIZE / 2,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
