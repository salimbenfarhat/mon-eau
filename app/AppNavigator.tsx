import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Tabs from './navigation/Tabs';
import { useSettingsStore } from './store/settings.store';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { profiles, currentProfileId } = useSettingsStore();
  const currentProfile = currentProfileId ? profiles[currentProfileId] : null;
  const initialRoute = currentProfile?.weightKg ? 'Tabs' : 'Onboarding';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute as any} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
