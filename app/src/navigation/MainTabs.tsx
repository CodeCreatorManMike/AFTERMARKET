import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { TicketsScreen } from '../screens/TicketsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AppTabBar, TabKey } from '../components/common/AppTabBar';

const Tab = createBottomTabNavigator();

// Route name <-> our design-system TabKey. Keeps React Navigation's route
// names free to evolve (e.g. nested stacks per tab) without touching AppTabBar.
const ROUTE_TO_KEY: Record<string, TabKey> = {
  Home: 'home',
  Search: 'search',
  Tickets: 'tickets',
  Profile: 'profile',
};
const KEY_TO_ROUTE: Record<TabKey, string> = {
  home: 'Home',
  search: 'Search',
  tickets: 'Tickets',
  profile: 'Profile',
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeRoute = state.routes[state.index].name;
        return (
          <AppTabBar
            active={ROUTE_TO_KEY[activeRoute] ?? 'home'}
            onChange={(key) => navigation.navigate(KEY_TO_ROUTE[key])}
          />
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
