import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
