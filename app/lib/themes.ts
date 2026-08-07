export type ThemeId = 'default' | 'ocean' | 'night';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  subText: string;
  accent: string;
  ringBg: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  default: {
    primary: '#1EA7FD',
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#333333',
    subText: '#6B7280',
    accent: '#EEF2FF',
    ringBg: '#F3F4F6',
  },
  ocean: {
    primary: '#0369A1',
    background: '#F0F9FF',
    card: '#E0F2FE',
    text: '#0C4A6E',
    subText: '#384E77',
    accent: '#BAE6FD',
    ringBg: '#E0F2FE',
  },
  night: {
    primary: '#6366F1',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subText: '#94A3B8',
    accent: '#334155',
    ringBg: '#1E293B',
  },
};
