import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Tabs from './navigation/Tabs';
import SettingsScreen from './screens/SettingsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import AboutScreen from './screens/AboutScreen';
import WaterGuideScreen from './screens/WaterGuideScreen';
import PreventionScreen from './screens/PreventionScreen';
import SolidarityScreen from './screens/SolidarityScreen';
import { useSettingsStore } from './store/settings.store';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
  Settings: undefined;
  Achievements: undefined;
  About: undefined;
  WaterGuide: undefined;
  Prevention: undefined;
  Solidarity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { profiles, currentProfileId, hasSeenPrevention } = useSettingsStore();
  const currentProfile = currentProfileId ? profiles[currentProfileId] : null;

  let initialRoute = currentProfile?.weightKg ? 'Tabs' : 'Onboarding';
  if (!hasSeenPrevention) initialRoute = 'Prevention';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute as any} screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Réglages' }} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Mes Badges' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'À propos' }} />
        <Stack.Screen name="WaterGuide" component={WaterGuideScreen} options={{ title: 'Guide des Eaux' }} />
        <Stack.Screen name="Prevention" component={PreventionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Solidarity" component={SolidarityScreen} options={{ title: 'Solidarité' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
