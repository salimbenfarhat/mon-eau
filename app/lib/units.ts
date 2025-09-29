export const roundUp = (value: number, step = 50) => Math.ceil(value / step) * step;
export const formatMl = (ml: number) => (ml >= 1000 ? `${(ml / 1000).toFixed(1)} L` : `${ml} ml`);
