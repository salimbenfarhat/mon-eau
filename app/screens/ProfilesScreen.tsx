import React from 'react';
import { View, Text } from 'react-native';

export default function ProfilesScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Profils</Text>
      <Text style={{ color: '#6B7280', marginTop: 8 }}>
        Bientôt : ajouter plusieurs profils (ex. grand-mère, nourrisson), et basculer entre eux.
      </Text>
    </View>
  );
}
