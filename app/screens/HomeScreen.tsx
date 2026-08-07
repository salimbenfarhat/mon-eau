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
import { useGamificationStore } from '../store/gamification.store';
import VirtualPlant from '../components/composite/VirtualPlant';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../lib/themes';
import { useNavigation } from '@react-navigation/native';
import AdBanner from '../components/composite/AdBanner';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { profiles, currentProfileId } = useSettingsStore();
  const currentProfile = currentProfileId ? profiles[currentProfileId] : null;

  const { logs, addGlass, currentStreak, bestStreak, undoLast } = useHydrationStore();
  const { data: gamificationData } = useGamificationStore();
  const profileGamification = currentProfileId ? gamificationData[currentProfileId] : null;

  const currentThemeId = profileGamification?.currentTheme ?? 'default';
  const theme = THEMES[currentThemeId];

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('Settings')} style={{ marginRight: 16 }}>
          <Ionicons name="settings-outline" size={24} color={theme.primary} />
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable onPress={() => navigation.navigate('Achievements')} style={{ marginLeft: 16 }}>
          <Ionicons name="trophy-outline" size={24} color={theme.primary} />
        </Pressable>
      ),
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
    });
  }, [navigation, theme]);

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
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      {/* Header Gamification */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.accent, padding: 8, borderRadius: 20, marginRight: 8 }}>
            <Ionicons name="star" size={20} color={theme.primary} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>
            Niv. {profileGamification?.level ?? 1}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}>
          <Ionicons name="water" size={18} color="#D97706" style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#B45309' }}>
            {profileGamification?.gouttes ?? 0} gouttes
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={ringStyle}>
            <ProgressFillCircle progress={progress} color={theme.primary} fill={theme.primary} bg={theme.ringBg} />
          </Animated.View>
          <View style={{ position: 'absolute' }}>
            <VirtualPlant progress={progress} />
          </View>
        </View>

        <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '600', color: theme.text }}>
          {formatMl(totalMl)} / {formatMl(goalMl)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ajouter un verre, ${glassMl} millilitres`}
          onPress={handleAdd}
          style={{
            backgroundColor: theme.primary,
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
          accessibilityLabel="Supprimer le dernier ajout"
          onPress={undoLast}
          style={{
            borderColor: theme.card,
            borderWidth: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: theme.subText }}>Supprimer le dernier ajout</Text>
        </Pressable>

        <Text style={{ color: theme.subText, marginTop: 12 }}>
          Série : {currentProfileStreak} • Meilleur : {bestProfileStreak}
        </Text>
      </View>

      <AdBanner />
    </View>
  );
}
