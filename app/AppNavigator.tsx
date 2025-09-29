import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SettingsScreen from './screens/SettingsScreen';
import HistoryScreen from './screens/HistoryScreen';
import { useSettingsStore } from './store/settings.store';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Settings: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const weight = useSettingsStore((s) => s.weightKg);
  const initialRoute = weight ? 'Home' : 'Onboarding';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShadowVisible: false }} initialRouteName={initialRoute as any}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mon Eau' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Réglages' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
