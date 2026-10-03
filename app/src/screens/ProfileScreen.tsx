import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { useMarketplace } from '../features/marketplace/MarketplaceContext';
import { Action, Copy, Rewards } from '../features/marketplace/FlowUI';
import { Screen } from '../components/common/Screen';
import { ProfileIdentity } from '../components/profile/ProfileIdentity';
import { ProfileActivityStats } from '../components/profile/ProfileActivityStats';
import { useOverlay } from '../navigation/OverlayContext';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useMarketplace();
  const member = state.member;
  const { openSettings } = useOverlay();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={{ backgroundColor: member?.accent === 'lime' ? '#C6FF3D' : '#FF5470', padding: 28, gap: 14 }}>
          <Text style={{ color: '#14102B', fontSize: 48, fontFamily: 'Archivo_900Black' }}>{member?.name.slice(0, 2).toUpperCase() || 'AM'}</Text>
          <Text style={{ color: '#14102B', fontFamily: 'IBMPlexMono_400Regular' }}>YOUR AFTERMARKET IDENTITY</Text>
        </View>
        <View style={[styles.page, { gap: 18, paddingTop: 22 }]}>
          <ProfileIdentity username={member?.name ?? 'New member'} memberSince={new Date(member?.joined ?? Date.now()).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })} />
          {!!member?.bio && <Copy>{member.bio}</Copy>}
          <Copy>Local profile preview · buy + sell</Copy>
          <ProfileActivityStats eventsAttended={0} ticketsSold={0} />
          <Action label="Edit profile" secondary onPress={() => navigation.navigate('EditProfile')} />
          <Action label="Sell a ticket" onPress={() => navigation.navigate('Sell')} />
          <Action label={`My listings (${state.listings.length})`} secondary onPress={() => navigation.navigate('Listings')} />
          <Rewards />
          <Action label="Settings & appearance" secondary onPress={openSettings} />
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
