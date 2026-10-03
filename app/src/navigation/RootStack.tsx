import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../features/marketplace/OnboardingScreen';
import { SellScreen } from '../features/marketplace/SellScreen';
import { ListingsScreen } from '../features/marketplace/ListingsScreen';
import { useMarketplace } from '../features/marketplace/MarketplaceContext';
import { MainTabs } from './MainTabs';
import { TicketOptionsScreen } from '../screens/TicketOptionsScreen';
import { EventItem } from '../data/events';

export type RootStackParamList = {
  Tabs: undefined;
  Sell: undefined;
  Listings: undefined;
  EditProfile: undefined;
  TicketOptions: { event: EventItem };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// TicketOptions is pushed on top of the tab navigator (no tab bar while
// viewing it, matching the reference) rather than living inside a
// per-tab stack — that way both Home and Search can push into it.
export function RootStack() {
  const { state, ready } = useMarketplace();
  if (!ready) return null;
  if (!state.member) return <OnboardingScreen />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="Sell" component={SellScreen} />
      <Stack.Screen name="Listings" component={ListingsScreen} />
      <Stack.Screen name="EditProfile">{({ navigation }) => <OnboardingScreen onDone={() => navigation.goBack()} />}</Stack.Screen>
      <Stack.Screen name="TicketOptions" component={TicketOptionsScreen} />
    </Stack.Navigator>
  );
}
