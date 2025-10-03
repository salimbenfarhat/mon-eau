import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../lib/dates';
import { useSettingsStore } from './settings.store';
import { useBadgesStore } from './badges.store';

export type Entry = { id: string; ml: number; ts: number };
export type DayLog = { date: string; totalMl: number; goalMl: number; entries: Entry[] };

type State = {
  logs: Record<string, Record<string, DayLog>>; // Nested record: profileId -> date -> DayLog
  currentStreak: Record<string, number>; // Streak per profile
  bestStreak: Record<string, number>; // Best streak per profile
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
      currentStreak: {},
      bestStreak: {},
      addGlass: (ml, goalMl) => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        const date = getTodayKey();
        const profileLogs = get().logs[profileId] ?? {};
        const log = profileLogs[date] ?? { date, totalMl: 0, goalMl, entries: [] };
        const newTotal = log.totalMl + ml;
        const updated: DayLog = {
          ...log,
          totalMl: newTotal,
          goalMl,
          entries: [...log.entries, { id: uid(), ml, ts: Date.now() }],
        };

        const newProfileLogs = { ...profileLogs, [date]: updated };
        const newLogs = { ...get().logs, [profileId]: newProfileLogs };

        // Update streak quand on atteint l’objectif
        let currentStreak = get().currentStreak[profileId] ?? 0;
        let bestStreak = get().bestStreak[profileId] ?? 0;

        if (log.totalMl < goalMl && newTotal >= goalMl) {
          currentStreak += 1;
          bestStreak = Math.max(bestStreak, currentStreak);
        }

        set({
          logs: newLogs,
          currentStreak: { ...get().currentStreak, [profileId]: currentStreak },
          bestStreak: { ...get().bestStreak, [profileId]: bestStreak },
        });

        // Check and award badges after hydration update
        const currentHydrationState = get();
        const currentSettingsState = useSettingsStore.getState();
        useBadgesStore.getState().checkAndAwardBadges(
          profileId,
          currentHydrationState,
          currentSettingsState
        );
      },
      undoLast: () => {
        const profileId = useSettingsStore.getState().currentProfileId;
        if (!profileId) return;

        const date = getTodayKey();
        const profileLogs = get().logs[profileId] ?? {};
        const log = profileLogs[date];
        if (!log || log.entries.length === 0) return;

        const last = log.entries[log.entries.length - 1];
        const updated: DayLog = {
          ...log,
          totalMl: Math.max(0, log.totalMl - last.ml),
          entries: log.entries.slice(0, -1),
        };

        const newProfileLogs = { ...profileLogs, [date]: updated };
        const newLogs = { ...get().logs, [profileId]: newProfileLogs };

        set({ logs: newLogs });
      },
    }),
    { name: 'hydration', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
