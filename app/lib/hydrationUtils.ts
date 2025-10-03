import { Profile, Sex } from '../store/settings.store';
import { roundUp } from './units';

/**
 * Calcule l'objectif d'hydratation quotidien en ml basé sur le profil de l'utilisateur.
 * Les recommandations sont basées sur l'avis scientifique de l'EFSA (2010) et des règles générales.
 *
 * @param profile Le profil de l'utilisateur.
 * @returns L'objectif d'hydratation quotidien en millilitres.
 */
export function calculateDailyGoal(profile: Profile): number {
  const { weightKg, age, sex, isPregnant, isLactating } = profile;
  let goalMl: number;

  // EFSA recommendations for total water intake (including food moisture)
  // These are general guidelines and can be adjusted based on activity level and climate.

  if (age !== null) {
    if (age >= 0 && age <= 0.5) { // 0-6 months
      // EFSA: 100-190 mL/kg per day. Using an average for calculation.
      goalMl = weightKg ? roundUp(weightKg * 145) : 700; // Assuming average weight for this age, or using weightKg if available
    } else if (age > 0.5 && age <= 1) { // 6-12 months
      // EFSA: 800-1000 mL/day. Using average 900ml.
      goalMl = 900;
    } else if (age > 1 && age <= 3) { // 1-3 years (EFSA 2-3 years: 1300 mL/day)
      goalMl = 1300;
    } else if (age > 3 && age <= 8) { // 4-8 years
      goalMl = 1600;
    } else if (age > 8 && age <= 13) { // 9-13 years
      if (sex === 'male') {
        goalMl = 2100;
      } else { // female
        goalMl = 1900;
      }
    } else { // Adolescents (14+) and Adults
      if (sex === 'male') {
        goalMl = 2500; // EFSA: 2.5 L/day for males
      } else { // female
        goalMl = 2000; // EFSA: 2.0 L/day for females
      }
    }
  } else {
    // Fallback if age is not specified, use weight-based or default adult values
    if (weightKg) {
      goalMl = roundUp(weightKg * 30); // General recommendation: 30ml/kg
    } else {
      // Default for adults if no age or weight is provided
      goalMl = (sex === 'male') ? 2500 : 2000;
    }
  }

  // Adjust for specific conditions
  if (isPregnant) {
    goalMl += 300; // EFSA: +300 mL/day for pregnant women
  }
  if (isLactating) {
    goalMl += 700; // EFSA: +700 mL/day for lactating women
  }

  // Ensure a minimum sensible goal, e.g., 500ml for very young children or edge cases
  return Math.max(500, goalMl);
}
