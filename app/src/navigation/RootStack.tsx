import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { TicketOptionsScreen } from '../screens/TicketOptionsScreen';
import { EventItem } from '../data/events';

export type RootStackParamList = {
  Tabs: undefined;
  TicketOptions: { event: EventItem };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// TicketOptions is pushed on top of the tab navigator (no tab bar while
// viewing it, matching the reference) rather than living inside a
// per-tab stack — that way both Home and Search can push into it.
export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="TicketOptions" component={TicketOptionsScreen} />
    </Stack.Navigator>
  );
}
