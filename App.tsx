import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/AppNavigator';
import { ErrorBoundary } from './app/lib/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initAudio, playStart, unloadAudio } from './app/lib/sound';
import { registerForPushNotificationsAsync, scheduleHydrationReminder } from './app/lib/notifications';
import { useSettingsStore } from './app/store/settings.store';

import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const { currentProfileId, profiles } = useSettingsStore();
  const currentProfile = currentProfileId ? profiles[currentProfileId] : null;

  useEffect(() => {
    (async () => {
      await initAudio();
      await playStart();

      // Register for push notifications and schedule reminders on app start
      if (currentProfileId && currentProfile?.notificationEnabled) {
        await registerForPushNotificationsAsync();
        await scheduleHydrationReminder(currentProfileId);
      }
    })();
    return () => { unloadAudio(); };
  }, [currentProfileId, currentProfile?.notificationEnabled, currentProfile?.notificationTime]); // Re-run if profile or notification settings change

  const [fontsLoaded] = useFonts(Ionicons.font); // charge la police des vector-icons
  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
