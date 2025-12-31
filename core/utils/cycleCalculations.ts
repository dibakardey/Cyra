/**
 * Cycle intelligence utilities
 * Pure functions for cycle phase calculation and data derivation
 */

import { CyclePhase } from '../types/index';

/**
 * Calculate which phase user is in based on cycle day
 * @param dayOfCycle 1-based day of cycle (1-28 for standard cycle)
 * @param cycleLength total cycle length in days
 * @returns CyclePhase
 *
 * Standard cycle breakdown:
 * - Menstruation: Days 1-5
 * - Follicular: Days 6-13
 * - Ovulation: Days 14-16 (peak around day 14)
 * - Luteal: Days 17-28
 */
export function calculatePhase(dayOfCycle: number, cycleLength: number): CyclePhase {
  // Normalize to percentage through cycle
  const percentThroughCycle = dayOfCycle / cycleLength;

  if (dayOfCycle >= 1 && dayOfCycle <= 5) {
    return CyclePhase.MENSTRUATION;
  } else if (dayOfCycle > 5 && dayOfCycle <= Math.floor(cycleLength * 0.48)) {
    return CyclePhase.FOLLICULAR;
  } else if (dayOfCycle > Math.floor(cycleLength * 0.48) && dayOfCycle <= Math.floor(cycleLength * 0.58)) {
    return CyclePhase.OVULATION;
  } else {
    return CyclePhase.LUTEAL;
  }
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
  const daysSinceLastPeriod = Math.floor(
    (new Date(date).getTime() - new Date(lastPeriodStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Modulo to handle cycles extending beyond current observation
  const dayOfCycle = (daysSinceLastPeriod % cycleLength) + 1;
  return Math.max(1, dayOfCycle);
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
