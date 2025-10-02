import React, { useState } from 'react';
import { View, Text, TextInput, Platform, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native';
import { useSettingsStore } from '../store/settings.store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { setWeight, setGlassMl, setSex, setPregnant, setLactating } = useSettingsStore();
  const [weight, setWeightText] = useState('');
  const [glass, setGlassText] = useState('250');
  const [sex, setSexState] = useState<'male'|'female'|null>(null);

  const onContinue = () => {
    const w = parseFloat(weight);
    const g = parseInt(glass, 10);
    if (!isNaN(w)) setWeight(w);
    if (!isNaN(g)) setGlassMl(g);
    setSex(sex);
    setPregnant(false);
    setLactating(false);
    navigation.replace('Tabs'); // important
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 16 }}>Mon Eau</Text>
          <Text style={{ textAlign: 'center', color: '#6B7280', marginBottom: 24 }}>
            Renseigne ton profil pour un objectif adapté
          </Text>

          <View style={{ gap: 12 }}>
            <Text style={{ fontWeight: '600' }}>Poids (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeightText}
              placeholder="ex: 70"
              style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 }}
            />

            <Text style={{ fontWeight: '600', marginTop: 8 }}>Taille d’un verre (ml)</Text>
            <TextInput
              keyboardType="numeric"
              value={glass}
              onChangeText={setGlassText}
              placeholder="ex: 250"
              style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 }}
            />

            <Text style={{ fontWeight: '600', marginTop: 8 }}>Sexe</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={() => setSexState('male')}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, alignItems: 'center',
                  borderWidth: 1, borderColor: sex === 'male' ? '#1EA7FD' : '#E5E7EB',
                  backgroundColor: sex === 'male' ? '#E6F4FF' : 'white'
                }}
              >
                <Text>Homme</Text>
              </Pressable>
              <Pressable
                onPress={() => setSexState('female')}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, alignItems: 'center',
                  borderWidth: 1, borderColor: sex === 'female' ? '#1EA7FD' : '#E5E7EB',
                  backgroundColor: sex === 'female' ? '#E6F4FF' : 'white'
                }}
              >
                <Text>Femme</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={onContinue}
            style={{ backgroundColor: '#1EA7FD', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Continuer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
