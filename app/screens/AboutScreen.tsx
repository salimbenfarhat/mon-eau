import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '800' }}>À propos</Text>
      <Text>Application : Mon Eau</Text>
      <Text>Auteur : Salim Benfarhat</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => Linking.openURL('https://github.com/salimbenfarhat')}
        style={{ borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, alignItems: 'center', width: 200 }}
      >
        <Text>GitHub: salimbenfarhat</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => Linking.openURL('https://buymeacoffee.com/')}
        style={{ backgroundColor: '#1EA7FD', padding: 12, borderRadius: 10, alignItems: 'center', width: 200 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Soutenir le projet 💙</Text>
      </Pressable>
    </View>
  );
}
