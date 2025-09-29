import { format } from 'date-fns';
export const getTodayKey = (d: Date = new Date()) => format(d, 'yyyy-MM-dd');