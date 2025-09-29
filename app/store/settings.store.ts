import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Unit = 'ml' | 'l';

type SettingsState = {
  weightKg: number | null;
  unit: Unit;
  glassMl: number;
  setWeight: (kg: number) => void;
  setUnit: (u: Unit) => void;
  setGlassMl: (ml: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      weightKg: null,
      unit: 'ml',
      glassMl: 250,
      setWeight: (kg) => set({ weightKg: kg }),
      setUnit: (unit) => set({ unit }),
      setGlassMl: (glassMl) => set({ glassMl }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
