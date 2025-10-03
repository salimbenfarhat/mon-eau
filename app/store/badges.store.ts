import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayLog } from './hydration.store';
import { Profile } from './settings.store';

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string; // Name of Ionicons icon
  unlockedAt: number; // Timestamp when unlocked
};

export type BadgeCriteria = {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (
    profileId: string,
    hydrationLogs: { logs: Record<string, Record<string, DayLog>>; currentStreak: Record<string, number>; bestStreak: Record<string, number>; },
    settings: { profiles: Record<string, Profile>; currentProfileId: string | null },
    unlockedBadges: Record<string, Record<string, Badge>>,
  ) => boolean;
};

// Define all possible badges and their criteria
export const ALL_BADGES: BadgeCriteria[] = [
  {
    id: 'first_glass',
    name: 'Premier Verre',
    description: 'Buvez votre premier verre d\'eau.',
    icon: 'water',
    check: (profileId, hydrationLogs, settings, unlockedBadges) => {
      const profileLogs = hydrationLogs.logs[profileId];
      if (!profileLogs) return false;
      const totalEntries = Object.values(profileLogs).reduce((acc: number, dayLog: DayLog) => acc + dayLog.entries.length, 0);
      return totalEntries >= 1;
    },
  },
  {
    id: 'seven_day_streak',
    name: 'Série de 7 Jours',
    description: 'Atteignez votre objectif d\'hydratation pendant 7 jours consécutifs.',
    icon: 'calendar',
    check: (profileId, hydrationLogs, settings, unlockedBadges) => {
      return hydrationLogs.currentStreak[profileId] >= 7;
    },
  },
  {
    id: 'hydration_master',
    name: 'Maître de l\'Hydratation',
    description: 'Atteignez un total de 100 litres bus.',
    icon: 'trophy',
    check: (profileId, hydrationLogs, settings, unlockedBadges) => {
      const profileLogs = hydrationLogs.logs[profileId];
      if (!profileLogs) return false;
      const totalMl = Object.values(profileLogs).reduce((acc: number, dayLog: DayLog) => acc + dayLog.totalMl, 0);
      return totalMl >= 100000; // 100 liters in ml
    },
  },
  // Add more badges here
];

type BadgesState = {
  unlockedBadges: Record<string, Record<string, Badge>>; // profileId -> badgeId -> Badge
  unlockBadge: (profileId: string, badgeId: string) => void;
  checkAndAwardBadges: (
    profileId: string,
    hydrationLogs: { logs: Record<string, Record<string, DayLog>>; currentStreak: Record<string, number>; bestStreak: Record<string, number>; },
    settings: { profiles: Record<string, Profile>; currentProfileId: string | null },
  ) => void;
};

export const useBadgesStore = create<BadgesState>()(
  persist(
    (set, get) => ({
      unlockedBadges: {},
      unlockBadge: (profileId, badgeId) => {
        const badgeCriteria = ALL_BADGES.find(b => b.id === badgeId);
        if (!badgeCriteria) return;

        set(state => {
          const profileBadges = state.unlockedBadges[profileId] || {};
          if (profileBadges[badgeId]) {
            return state; // Already unlocked
          }

          const newBadge: Badge = {
            id: badgeId,
            name: badgeCriteria.name,
            description: badgeCriteria.description,
            icon: badgeCriteria.icon,
            unlockedAt: Date.now(),
          };

          return {
            unlockedBadges: {
              ...state.unlockedBadges,
              [profileId]: {
                ...profileBadges,
                [badgeId]: newBadge,
              },
            },
          };
        });
      },
      checkAndAwardBadges: (profileId, hydrationLogs, settings) => {
        ALL_BADGES.forEach(badgeCriteria => {
          const isUnlocked = get().unlockedBadges[profileId]?.[badgeCriteria.id];
          if (!isUnlocked && badgeCriteria.check(profileId, hydrationLogs, settings, get().unlockedBadges)) {
            get().unlockBadge(profileId, badgeCriteria.id);
          }
        });
      },
    }),
    {
      name: 'badges',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
