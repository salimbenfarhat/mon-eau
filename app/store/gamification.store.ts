import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettingsStore } from './settings.store';

export type PlantType = 'sprout' | 'cactus' | 'flower' | 'tree';

export type Plant = {
  id: string;
  type: PlantType;
  name: string;
  price: number;
  isUnlocked: boolean;
};

type GamificationState = {
  // profileId -> data
  data: Record<string, {
    gouttes: number;
    xp: number;
    level: number;
    unlockedPlants: string[];
    currentPlantId: string;
    isPremium: boolean;
    unlockedThemes: string[];
    currentTheme: 'default' | 'ocean' | 'night';
  }>;

  addGouttes: (amount: number) => void;
  addXP: (amount: number) => void;
  unlockPlant: (plantId: string, price: number) => boolean;
  setCurrentPlant: (plantId: string) => void;
  setPremium: (status: boolean) => void;
  setTheme: (themeId: 'default' | 'ocean' | 'night') => void;
};

const INITIAL_DATA = {
  gouttes: 0,
  xp: 0,
  level: 1,
  unlockedPlants: ['default_sprout'],
  currentPlantId: 'default_sprout',
  isPremium: false,
  unlockedThemes: ['default'],
  currentTheme: 'default' as const,
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      data: {},

      addGouttes: (amount) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        set((state) => {
          const profileData = state.data[profileId] ?? { ...INITIAL_DATA };
          return {
            data: {
              ...state.data,
              [profileId]: {
                ...profileData,
                gouttes: profileData.gouttes + amount,
              },
            },
          };
        });
      },

      addXP: (amount) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        set((state) => {
          const profileData = state.data[profileId] ?? { ...INITIAL_DATA };
          const newXP = profileData.xp + amount;

          // Logic simple de niveau: 100 XP par niveau
          const newLevel = Math.floor(newXP / 100) + 1;

          return {
            data: {
              ...state.data,
              [profileId]: {
                ...profileData,
                xp: newXP,
                level: newLevel,
              },
            },
          };
        });
      },

      unlockPlant: (plantId, price) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return false;

        const profileData = get().data[profileId] ?? { ...INITIAL_DATA };
        if (profileData.gouttes < price || profileData.unlockedPlants.includes(plantId)) {
          return false;
        }

        set((state) => ({
          data: {
            ...state.data,
            [profileId]: {
              ...profileData,
              gouttes: profileData.gouttes - price,
              unlockedPlants: [...profileData.unlockedPlants, plantId],
            },
          },
        }));
        return true;
      },

      setCurrentPlant: (plantId) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        set((state) => {
          const profileData = state.data[profileId] ?? { ...INITIAL_DATA };
          return {
            data: {
              ...state.data,
              [profileId]: {
                ...profileData,
                currentPlantId: plantId,
              },
            },
          };
        });
      },

      setPremium: (status) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        set((state) => {
          const profileData = state.data[profileId] ?? { ...INITIAL_DATA };
          return {
            data: {
              ...state.data,
              [profileId]: {
                ...profileData,
                isPremium: status,
                unlockedThemes: status
                  ? Array.from(new Set([...profileData.unlockedThemes, 'ocean', 'night']))
                  : profileData.unlockedThemes
              },
            },
          };
        });
      },

      setTheme: (themeId) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        set((state) => {
          const profileData = state.data[profileId] ?? { ...INITIAL_DATA };
          return {
            data: {
              ...state.data,
              [profileId]: {
                ...profileData,
                currentTheme: themeId,
              },
            },
          };
        });
      },
    }),
    {
      name: 'gamification',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
