import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/AppNavigator';
import { ErrorBoundary } from './app/lib/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initAudio, playStart, unloadAudio } from './app/lib/sound';

import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  useEffect(() => {
    (async () => {
      await initAudio();
      await playStart();
    })();
    return () => { unloadAudio(); };
  }, []);

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
