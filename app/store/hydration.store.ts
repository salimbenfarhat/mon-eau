import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../lib/dates';

export type Entry = { id: string; ml: number; ts: number };
export type DayLog = { date: string; totalMl: number; goalMl: number; entries: Entry[] };

type State = {
  logs: Record<string, DayLog>;
  currentStreak: number;
  bestStreak: number;
  addGlass: (ml: number, goalMl: number) => void;
  undoLast: () => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const useHydrationStore = create<State>()(
  persist(
    (set, get) => ({
      logs: {},
      currentStreak: 0,
      bestStreak: 0,
      addGlass: (ml, goalMl) => {
        const date = getTodayKey();
        const log = get().logs[date] ?? { date, totalMl: 0, goalMl, entries: [] };
        const newTotal = log.totalMl + ml;
        const updated: DayLog = {
          ...log,
          totalMl: newTotal,
          goalMl,
          entries: [...log.entries, { id: uid(), ml, ts: Date.now() }],
        };
        const logs = { ...get().logs, [date]: updated };

        // Update streak quand on atteint l’objectif
        let { currentStreak, bestStreak } = get();
        if (log.totalMl < goalMl && newTotal >= goalMl) {
          currentStreak += 1;
          bestStreak = Math.max(bestStreak, currentStreak);
        }
        set({ logs, currentStreak, bestStreak });
      },
      undoLast: () => {
        const date = getTodayKey();
        const log = get().logs[date];
        if (!log || log.entries.length === 0) return;
        const last = log.entries[log.entries.length - 1];
        const updated: DayLog = {
          ...log,
          totalMl: Math.max(0, log.totalMl - last.ml),
          entries: log.entries.slice(0, -1),
        };
        set({ logs: { ...get().logs, [date]: updated } });
      },
    }),
    { name: 'hydration', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
