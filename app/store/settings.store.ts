import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Unit = 'ml' | 'l';
export type Sex = 'male' | 'female' | null;

type SettingsState = {
  weightKg: number | null;
  unit: Unit;
  glassMl: number;
  sex: Sex;
  isPregnant: boolean;
  isLactating: boolean;
  setWeight: (kg: number) => void;
  setUnit: (u: Unit) => void;
  setGlassMl: (ml: number) => void;
  setSex: (s: Sex) => void;
  setPregnant: (v: boolean) => void;
  setLactating: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      weightKg: null,
      unit: 'ml',
      glassMl: 250,
      sex: null,
      isPregnant: false,
      isLactating: false,
      setWeight: (kg) => set({ weightKg: kg }),
      setUnit: (unit) => set({ unit }),
      setGlassMl: (glassMl) => set({ glassMl }),
      setSex: (sex) => set({ sex }),
      setPregnant: (isPregnant) => set({ isPregnant }),
      setLactating: (isLactating) => set({ isLactating }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
