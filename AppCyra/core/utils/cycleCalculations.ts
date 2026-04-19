/**
 * Cycle intelligence utilities
 * Pure functions for cycle phase calculation and data derivation
 */

import { CyclePhase } from '../types/index';

/**
 * Calculate which phase user is in based on cycle day
 * @param dayOfCycle 1-based day of cycle
 * @param cycleLength total cycle length in days
 * @returns CyclePhase
 *
 * Standard cycle breakdown (approximate):
 * - Menstruation: Days 1-5
 * - Follicular: Days 6 to ~48% of cycle
 * - Ovulation: ~48% to ~58% of cycle
 * - Luteal: Remaining days
 */
export function calculatePhase(dayOfCycle: number, cycleLength: number): CyclePhase {
  // Normalize dayOfCycle to be within [1, cycleLength] to handle out-of-bounds inputs
  const normalizedDay = ((dayOfCycle - 1) % cycleLength + cycleLength) % cycleLength + 1;

  if (normalizedDay <= 5) {
    return CyclePhase.MENSTRUATION;
  }

  const ovulationStart = Math.floor(cycleLength * 0.48);
  const ovulationEnd = Math.floor(cycleLength * 0.58);

  if (normalizedDay > ovulationStart && normalizedDay <= ovulationEnd) {
    return CyclePhase.OVULATION;
  }

  if (normalizedDay > 5 && normalizedDay <= ovulationStart) {
    return CyclePhase.FOLLICULAR;
  }

  return CyclePhase.LUTEAL;
}

/**
 * Calculate day of cycle given a date and last period start date
 * @param date the date to calculate for
 * @param lastPeriodStartDate when the last period started
 * @param cycleLength length of the cycle in days
 * @returns 1-based day of cycle
 */
export function calculateDayOfCycle(
  date: Date,
  lastPeriodStartDate: Date,
  cycleLength: number
): number {
  // Normalize to UTC midnight to avoid Daylight Savings Time (DST) issues
  const d1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = Date.UTC(lastPeriodStartDate.getFullYear(), lastPeriodStartDate.getMonth(), lastPeriodStartDate.getDate());
  
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceLastPeriod = Math.floor((d1 - d2) / msPerDay);
  
  // Use a robust modulo to handle negative days (dates before last period start)
  // and ensure the result is always a valid 1-based day of the cycle.
  const normalizedDays = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength;
  return normalizedDays + 1;
}

/**
 * Get human-readable phase description
 * Educational, non-medical language
 */
export function getPhaseDescription(phase: CyclePhase): string {
  const descriptions: Record<CyclePhase, string> = {
    [CyclePhase.MENSTRUATION]:
      'Your menstrual phase. Many users report lower energy and benefit from rest.',
    [CyclePhase.FOLLICULAR]:
      'Follicular phase. Estrogen rises and energy often increases. Many users feel more creative and social.',
    [CyclePhase.OVULATION]:
      'Ovulation window. Peak fertility phase. Many users report heightened confidence and social energy.',
    [CyclePhase.LUTEAL]:
      'Luteal phase. Progesterone rises. Many users benefit from more introspective, slower-paced activities.',
  };
  return descriptions[phase];
}

/**
 * Get color scheme for phase (brand consistency)
 */
export function getPhaseColors(phase: CyclePhase): { primary: string; secondary: string } {
  const colors: Record<CyclePhase, { primary: string; secondary: string }> = {
    [CyclePhase.MENSTRUATION]: { primary: '#FF6B8B', secondary: '#FF8E8B' },
    [CyclePhase.FOLLICULAR]: { primary: '#7986CB', secondary: '#5C6BC0' },
    [CyclePhase.OVULATION]: { primary: '#4CAF50', secondary: '#81C784' },
    [CyclePhase.LUTEAL]: { primary: '#FFB74D', secondary: '#FFA726' },
  };
  return colors[phase];
}
