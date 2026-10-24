import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../features/marketplace/OnboardingScreen';
import { SellScreen } from '../features/marketplace/SellScreen';
import { ListingsScreen } from '../features/marketplace/ListingsScreen';
import { GuideScreen } from '../features/marketplace/GuideScreen';
import { EventScreen } from '../features/marketplace/EventScreen';
import { useMarketplace } from '../features/marketplace/MarketplaceContext';
import type { Guide } from '../features/marketplace/model';
import { MainTabs } from './MainTabs';

export type RootStackParamList = {
  Tabs: undefined;
  Sell: { eventId?: string } | undefined;
  Listings: undefined;
  EditProfile: undefined;
  Event: { eventId: string; buying?: boolean };
  Guide: { mode: Guide; eventId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  const { state, ready } = useMarketplace();
  if (!ready) return null;
  if (!state.member) return <OnboardingScreen />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Guide" component={GuideScreen} />
      <Stack.Screen name="Sell" component={SellScreen} />
      <Stack.Screen name="Listings" component={ListingsScreen} />
      <Stack.Screen name="EditProfile">{({ navigation }) => <OnboardingScreen onDone={() => navigation.goBack()} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
