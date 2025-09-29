import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import ProgressRing from '../components/composite/ProgressRing';
import { useSettingsStore } from '../store/settings.store';
import { useHydrationStore } from '../store/hydration.store';
import { roundUp, formatMl } from '../lib/units';
import { getTodayKey } from '../lib/dates';

export default function HomeScreen() {
  const { weightKg, glassMl } = useSettingsStore();
  const { logs, addGlass, currentStreak, bestStreak, undoLast } = useHydrationStore();

  const goalMl = useMemo(() => (weightKg ? roundUp(weightKg * 30) : 2000), [weightKg]);
  const today = getTodayKey();
  const totalMl = logs[today]?.totalMl ?? 0;
  const progress = Math.min(totalMl / goalMl, 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Mon Eau</Text>
      <Text style={{ color: '#6B7280', marginTop: 4 }}>Objectif du jour : {formatMl(goalMl)}</Text>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <ProgressRing progress={progress} />
        <Text style={{ marginTop: 12, fontSize: 18 }}>
          {formatMl(totalMl)} / {formatMl(goalMl)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ajouter un verre, ${glassMl} millilitres`}
        onPress={() => addGlass(glassMl, goalMl)}
        style={{ backgroundColor: '#1EA7FD', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>+1 verre ({glassMl} ml)</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Annuler le dernier ajout"
        onPress={undoLast}
        style={{ borderColor: '#E5E7EB', borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
      >
        <Text style={{ fontSize: 16 }}>Annuler</Text>
      </Pressable>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: '#6B7280' }}>Série : {currentStreak} • Meilleur : {bestStreak}</Text>
      </View>
    </View>
  );
}
