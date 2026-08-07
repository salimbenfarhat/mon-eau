import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfilesScreen from '../screens/ProfilesScreen';
import ShopScreen from '../screens/ShopScreen';

import { useGamificationStore } from '../store/gamification.store';
import { useSettingsStore } from '../store/settings.store';
import { THEMES } from '../lib/themes';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { currentProfileId } = useSettingsStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;
  const currentThemeId = profileGamification?.currentTheme ?? 'default';
  const theme = THEMES[currentThemeId];

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.card,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          title: 'Mon Eau',
          tabBarIcon: ({ color, size }) => <Ionicons name="water-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analyse"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Boutique"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profils"
        component={ProfilesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
