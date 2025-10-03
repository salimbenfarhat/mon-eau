import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Unit = 'ml' | 'l';
export type Sex = 'male' | 'female';

export type Profile = {
  id: string;
  name: string;
  weightKg: number | null;
  age: number | null; // Added age
  unit: Unit;
  glassMl: number;
  sex: Sex;
  isPregnant: boolean;
  isLactating: boolean;
  notificationEnabled: boolean; // Added for notifications
  notificationTime: string; // Added for notifications (e.g., "14:30")
};

type SettingsState = {
  profiles: Record<string, Profile>;
  currentProfileId: string | null;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  setCurrentProfile: (id: string) => void;
  // Existing setters, now operating on the current profile
  setWeight: (kg: number) => void;
  setUnit: (u: Unit) => void;
  setGlassMl: (ml: number) => void;
  setSex: (s: Sex) => void;
  setAge: (age: number | null) => void;
  setPregnant: (v: boolean) => void;
  setLactating: (v: boolean) => void;
  setNotificationEnabled: (v: boolean) => void; // Added for notifications
  setNotificationTime: (time: string) => void; // Added for notifications
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      profiles: {},
      currentProfileId: null,
      addProfile: (profileData) => {
        const id = uid();
        const newProfile: Profile = { ...profileData, id };
        set((state) => ({
          profiles: { ...state.profiles, [id]: newProfile },
          currentProfileId: state.currentProfileId || id, // Set as current if it's the first profile
        }));
      },
      updateProfile: (id, profileData) => {
        set((state) => ({
          profiles: { ...state.profiles, [id]: { ...state.profiles[id], ...profileData } },
        }));
      },
      removeProfile: (id) => {
        set((state) => {
          const newProfiles = { ...state.profiles };
          delete newProfiles[id];
          let newCurrentProfileId = state.currentProfileId;
          if (newCurrentProfileId === id) {
            newCurrentProfileId = Object.keys(newProfiles)[0] || null;
          }
          return { profiles: newProfiles, currentProfileId: newCurrentProfileId };
        });
      },
      setCurrentProfile: (id) => set({ currentProfileId: id }),

      // Existing setters, now operating on the current profile
      setWeight: (kg) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { weightKg: kg });
        }
      },
      setUnit: (unit) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { unit });
        }
      },
      setGlassMl: (glassMl) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { glassMl });
        }
      },
      setSex: (sex) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { sex });
        }
      },
      setPregnant: (isPregnant) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { isPregnant });
        }
      },
      setLactating: (isLactating) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { isLactating });
        }
      },
      setAge: (age) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { age });
        }
      },
      setNotificationEnabled: (notificationEnabled) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { notificationEnabled });
        }
      },
      setNotificationTime: (notificationTime) => {
        const { currentProfileId, profiles } = get();
        if (currentProfileId && profiles[currentProfileId]) {
          get().updateProfile(currentProfileId, { notificationTime });
        }
      },
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        // Initialize a default profile if none exist after rehydration
        return (state) => {
          if (state && Object.keys(state.profiles).length === 0) {
            const defaultProfileId = uid();
            state.profiles = {
              [defaultProfileId]: {
                id: defaultProfileId,
                name: 'Moi',
                weightKg: null,
                age: null, // Default age
                unit: 'ml',
                glassMl: 250,
                sex: 'male', // Default to male
                isPregnant: false,
                isLactating: false,
                notificationEnabled: false, // Default
                notificationTime: '14:00', // Default
              },
            };
            state.currentProfileId = defaultProfileId;
          }
        };
      },
    },
  ),
);
