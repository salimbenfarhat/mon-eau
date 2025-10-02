import type { Sex } from '../store/settings.store';

type Thresholds = {
  softTotalMl: number; // seuil alerte douce sur le total (le + petit de p95 & 150% objectif)
  hardTotalMl: number; // seuil alerte forte sur le total (≥200% objectif)
  rateMlPerHour: number; // débit max recommandé
};

/**
 * Calcule les seuils d'alerte adaptés.
 * - P95 boissons (approx) : H 3.2 L, F 2.5 L
 * - Ajustement grossesse +0.3 L, allaitement +0.7 L
 * - Relatifs à l'objectif perso : soft = 150%, hard = 200%
 * - Débit max : 1 L/h
 */
export function computeThresholds(params: {
  sex: Sex;
  isPregnant: boolean;
  isLactating: boolean;
  goalMl: number;
}): Thresholds {
  const { sex, isPregnant, isLactating, goalMl } = params;
  let p95Drinks = sex === 'male' ? 3200 : sex === 'female' ? 2500 : Infinity;
  if (sex === 'female') {
    if (isPregnant) p95Drinks += 300;
    if (isLactating) p95Drinks += 700;
  }

  const softRel = goalMl * 1.5; // 150%
  const hardRel = goalMl * 2.0; // 200%

  // softTotal = min(P95-boissons, 150% objectif) (si sexe inconnu => ignore p95)
  const softTotalMl = Math.min(isFinite(p95Drinks) ? p95Drinks : softRel, softRel);
  const hardTotalMl = hardRel;

  return {
    softTotalMl,
    hardTotalMl,
    rateMlPerHour: 1000, // 1 L/h
  };
}

/**
 * Retourne le total des ajouts sur la fenêtre de 60min.
 */
export function computeLastHourMl(entries: { ts: number; ml: number }[], now: number = Date.now()): number {
  const oneHourAgo = now - 60 * 60 * 1000;
  return entries.reduce((sum, e) => (e.ts >= oneHourAgo ? sum + e.ml : sum), 0);
}
