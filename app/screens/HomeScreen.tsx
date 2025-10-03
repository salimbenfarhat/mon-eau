// app/screens/HomeScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import ProgressFillCircle from '../components/composite/ProgressFillCircle';
import { useSettingsStore } from '../store/settings.store';
import { useHydrationStore } from '../store/hydration.store';
import { roundUp, formatMl } from '../lib/units';
import { getTodayKey } from '../lib/dates';
import { playClick } from '../lib/sound';
import { computeThresholds, computeLastHourMl } from '../lib/hydrationAlerts';
import { calculateDailyGoal } from '../lib/hydrationUtils'; // Import the new utility
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

export default function HomeScreen() {
  const { profiles, currentProfileId } = useSettingsStore();
  const currentProfile = currentProfileId ? profiles[currentProfileId] : null;

  const { logs, addGlass, currentStreak, bestStreak, undoLast } = useHydrationStore();

  // Use current profile's settings
  const weightKg = currentProfile?.weightKg ?? null;
  const glassMl = currentProfile?.glassMl ?? 250;
  const sex = currentProfile?.sex ?? null;
  const isPregnant = currentProfile?.isPregnant ?? false;
  const isLactating = currentProfile?.isLactating ?? false;

  // Calculate goalMl using the new utility function
  const goalMl = useMemo(() => {
    if (!currentProfile) return 2000; // Default if no profile is selected
    return calculateDailyGoal(currentProfile);
  }, [currentProfile]);
  const today = getTodayKey();

  const profileTodayLog = currentProfileId ? logs[currentProfileId]?.[today] : undefined;
  const totalMl = profileTodayLog?.totalMl ?? 0;
  const progress = Math.min(totalMl / goalMl, 1);

  // Ensure sex is not null when passed to computeThresholds
  const thresholds = computeThresholds({ sex: sex ?? 'male', isPregnant, isLactating, goalMl });
  const lastHourMl = computeLastHourMl(profileTodayLog?.entries ?? []);

  const ringScale = useSharedValue(1);
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ringScale.value }] }));

  const handleAdd = async () => {
    if (!currentProfileId) {
      Alert.alert('Erreur', 'Veuillez sélectionner ou créer un profil.');
      return;
    }
    await playClick();

    const newTotal = totalMl + glassMl;
    const newLastHour = lastHourMl + glassMl;

    if (newLastHour >= thresholds.rateMlPerHour) {
      Alert.alert('Débit trop rapide', "Vous enregistrez plus de 1 L sur une heure. Espacez vos apports.", [{ text: 'OK' }]);
    }
    if (newTotal >= thresholds.hardTotalMl) {
      Alert.alert('Quantité très élevée', "Votre total dépasse 200% de l’objectif.", [{ text: 'OK' }]);
    } else if (newTotal >= thresholds.softTotalMl) {
      Alert.alert('Quantité élevée', "Vous approchez/depassez des repères élevés aujourd’hui.", [{ text: 'OK' }]);
    }

    // petit “pulse”
    ringScale.value = 0.96;
    ringScale.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
    addGlass(glassMl, goalMl);
  };

  const currentProfileStreak = currentProfileId ? currentStreak[currentProfileId] ?? 0 : 0;
  const bestProfileStreak = currentProfileId ? bestStreak[currentProfileId] ?? 0 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={ringStyle}>
          <ProgressFillCircle progress={progress} />
        </Animated.View>

        <Text style={{ marginTop: 12, fontSize: 18 }}>
          {formatMl(totalMl)} / {formatMl(goalMl)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ajouter un verre, ${glassMl} millilitres`}
          onPress={handleAdd}
          style={{
            backgroundColor: '#1EA7FD',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>+1 verre ({glassMl} ml)</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Annuler le dernier ajout"
          onPress={undoLast}
          style={{
            borderColor: '#E5E7EB',
            borderWidth: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>Annuler</Text>
        </Pressable>

        <Text style={{ color: '#6B7280', marginTop: 12 }}>
          Série : {currentProfileStreak} • Meilleur : {bestProfileStreak}
        </Text>
      </View>
    </View>
  );
}
