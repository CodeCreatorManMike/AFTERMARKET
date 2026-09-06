import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/common/Screen';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProfileHero } from '../components/profile/ProfileHero';
import { ProfileIdentity } from '../components/profile/ProfileIdentity';
import { ProfileSocialStats } from '../components/profile/ProfileSocialStats';
import { ProfileActivityStats } from '../components/profile/ProfileActivityStats';
import { ProfileActions } from '../components/profile/ProfileActions';
import { ProfileQRCard } from '../components/profile/ProfileQRCard';
import { FollowingScroller } from '../components/profile/FollowingScroller';
import { BadgeGrid } from '../components/profile/BadgeGrid';
import { profile, followedEntities, earnedBadges } from '../data/profile';
import { useOverlay } from '../navigation/OverlayContext';

export function ProfileScreen() {
  const { openSettings } = useOverlay();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ProfileHero banner={profile.banner} avatar={profile.avatar} onSettings={openSettings} />

        <View style={styles.page}>
          <ProfileIdentity username={profile.username} memberSince={profile.memberSince} />

          <ProfileSocialStats
            countryFlag={profile.countryFlag}
            following={profile.following}
            followers={profile.followers}
          />

          <ProfileActivityStats eventsAttended={profile.eventsAttended} ticketsSold={profile.ticketsSold} />

          <View style={styles.qrCard}>
            <ProfileQRCard username={profile.username} />
          </View>

          <ProfileActions username={profile.username} />

          <View style={styles.section}>
            <SectionHeader title="Following" action="See all" />
            <View style={styles.followingList}>
              <FollowingScroller entities={followedEntities} />
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Badges" action="See all" />
            <View style={styles.badgeList}>
              <BadgeGrid badges={earnedBadges(profile.earnedBadgeIds)} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  page: {
    paddingHorizontal: 20,
  },
  qrCard: {
    marginTop: 20,
  },
  section: {
    marginTop: 28,
  },
  followingList: {
    marginTop: 14,
  },
  badgeList: {
    marginTop: 14,
  },
});
