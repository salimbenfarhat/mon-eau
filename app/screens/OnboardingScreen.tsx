import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useSettingsStore } from '../store/settings.store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

export default function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const [weight, setWeight] = useState('');
  const [glass, setGlass] = useState('250');
  const { setWeight: setW, setGlassMl } = useSettingsStore();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Bienvenue 👋</Text>
      <Text>Votre poids (kg)</Text>
      <TextInput keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="70"
        style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12 }} />
      <Text>Taille d’un verre (ml)</Text>
      <TextInput keyboardType="numeric" value={glass} onChangeText={setGlass} placeholder="250"
        style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12 }} />
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          const w = parseFloat(weight);
          const g = parseInt(glass, 10);
          if (!isNaN(w)) setW(w);
          if (!isNaN(g)) setGlassMl(g);
          navigation.replace('Home');
        }}
        style={{ backgroundColor: '#1EA7FD', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Commencer</Text>
      </Pressable>
    </View>
  );
}
