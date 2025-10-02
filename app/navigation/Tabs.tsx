import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfilesScreen from '../screens/ProfilesScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#1EA7FD',
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
        name="Historique"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profils"
        component={ProfilesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="À propos"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
