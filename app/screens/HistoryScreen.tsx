import React from 'react';
import { View, Text } from 'react-native';
export default function HistoryScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Historique</Text>
      <Text style={{ color: '#6B7280', marginTop: 8 }}>Vue 7 jours à venir.</Text>
    </View>
  );
}
