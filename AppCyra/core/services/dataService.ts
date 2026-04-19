/**
 * Data Service Layer
 * Abstraction for local data operations with future backend integration support
 * 
 * Architecture:
 * - All data operations go through this service
 * - Interface remains stable while implementation details can change
 * - Ready for AsyncStorage/SQLite backend swap
 * - Supports future API integration without UI changes
 */

import {
  UserProfile,
  Cycle,
  CycleDay,
  Symptom,
  SymptomLog,
  Insight,
  Event,
  SymptomIntensity,
  EventType,
  CyclePhase,
} from '../types/index';
import { calculateDayOfCycle, calculatePhase } from '../utils/cycleCalculations';

// ============================================================================
// MOCK DATA STORE (In-memory for now, swappable with AsyncStorage/DB)
// ============================================================================

let userProfile: UserProfile | null = null;
let cycles: Map<string, Cycle> = new Map();
let cycleDays: Map<string, CycleDay> = new Map();
let symptomLogs: Map<string, SymptomLog> = new Map();
let insights: Map<string, Insight> = new Map();
let events: Event[] = [];

// Reference symptom taxonomy
const SYMPTOM_TAXONOMY: Symptom[] = [
  { id: '1', name: 'Cramps', category: 'PHYSICAL', commonDuringPhases: [CyclePhase.MENSTRUATION], isCustom: false },
  { id: '2', name: 'Bloating', category: 'PHYSICAL', commonDuringPhases: [CyclePhase.LUTEAL, CyclePhase.MENSTRUATION], isCustom: false },
  { id: '3', name: 'Headache', category: 'PHYSICAL', isCustom: false },
  { id: '4', name: 'Fatigue', category: 'PHYSICAL', commonDuringPhases: [CyclePhase.MENSTRUATION, CyclePhase.LUTEAL], isCustom: false },
  { id: '5', name: 'Mood swings', category: 'EMOTIONAL', commonDuringPhases: [CyclePhase.LUTEAL], isCustom: false },
  { id: '6', name: 'Breast tenderness', category: 'PHYSICAL', commonDuringPhases: [CyclePhase.LUTEAL], isCustom: false },
  { id: '7', name: 'Backache', category: 'PHYSICAL', isCustom: false },
  { id: '8', name: 'Acne', category: 'PHYSICAL', isCustom: false },
  { id: '9', name: 'Food cravings', category: 'PHYSICAL', commonDuringPhases: [CyclePhase.LUTEAL], isCustom: false },
  { id: '10', name: 'Nausea', category: 'PHYSICAL', isCustom: false },
  { id: '11', name: 'Insomnia', category: 'PHYSICAL', isCustom: false },
  { id: '12', name: 'Anxiety', category: 'EMOTIONAL', isCustom: false },
  { id: '13', name: 'Dizziness', category: 'PHYSICAL', isCustom: false },
  { id: '14', name: 'Hot flashes', category: 'PHYSICAL', isCustom: false },
  { id: '15', name: 'Increased energy', category: 'EMOTIONAL', commonDuringPhases: [CyclePhase.FOLLICULAR, CyclePhase.OVULATION], isCustom: false },
  { id: '16', name: 'Better mood', category: 'EMOTIONAL', commonDuringPhases: [CyclePhase.FOLLICULAR], isCustom: false },
  { id: '17', name: 'Heightened senses', category: 'PHYSICAL', isCustom: false },
  { id: '18', name: 'Breast pain', category: 'PHYSICAL', isCustom: false },
  { id: '19', name: 'Increased libido', category: 'EMOTIONAL', commonDuringPhases: [CyclePhase.OVULATION], isCustom: false },
];

// ============================================================================
// SERVICE INTERFACE
// ============================================================================

export class DataService {
  /**
   * Initialize user profile
   * In production: load from backend or AsyncStorage
   */
  static async initializeUser(profile: UserProfile): Promise<void> {
    userProfile = { ...profile, updatedAt: new Date() };
    await this.logEvent({
      id: this._generateId(),
      userId: profile.id,
      type: EventType.PROFILE_UPDATED,
      timestamp: new Date(),
    });
  }

  /**
   * Get current user profile
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    return userProfile;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!userProfile) throw new Error('User profile not initialized');

    userProfile = {
      ...userProfile,
      ...updates,
      updatedAt: new Date(),
    };

    await this.logEvent({
      id: this._generateId(),
      userId: userProfile.id,
      type: EventType.PROFILE_UPDATED,
      timestamp: new Date(),
    });

    return userProfile;
  }

  /**
   * Get current cycle or create new one if needed
   */
  static async getCurrentCycle(userId: string): Promise<Cycle> {
    const cyclesArray = Array.from(cycles.values()).filter((c) => c.userId === userId);
    const currentCycle = cyclesArray[cyclesArray.length - 1];

    if (currentCycle) {
      return currentCycle;
    }

    // Create new cycle based on last period date
    if (!userProfile) throw new Error('User profile not initialized');

    const newCycle: Cycle = {
      id: this._generateId(),
      userId,
      startDate: userProfile.lastPeriodStartDate,
      expectedEndDate: new Date(userProfile.lastPeriodStartDate.getTime() + userProfile.cycleLength * 24 * 60 * 60 * 1000),
      cycleLength: userProfile.cycleLength,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cycles.set(newCycle.id, newCycle);
    return newCycle;
  }

  /**
   * Get or create cycle day for given date
   */
  static async getCycleDay(userId: string, date: Date): Promise<CycleDay> {
    const currentCycle = await this.getCurrentCycle(userId);
    if (!userProfile) throw new Error('User profile not initialized');

    const dayOfCycle = calculateDayOfCycle(date, currentCycle.startDate, userProfile.cycleLength);
    const phase = calculatePhase(dayOfCycle, userProfile.cycleLength);

    const key = `${currentCycle.id}-${date.toISOString().split('T')[0]}`;
    let cycleDay = cycleDays.get(key);

    if (!cycleDay) {
      cycleDay = {
        id: this._generateId(),
        cycleId: currentCycle.id,
        userId,
        date: new Date(date),
        dayOfCycle,
        phase,
        symptomLogs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      cycleDays.set(key, cycleDay);
    }

    return cycleDay;
  }

  /**
   * Log a symptom for a given date
   */
  static async logSymptom(
    userId: string,
    date: Date,
    symptomName: string,
    intensity: SymptomIntensity
  ): Promise<SymptomLog> {
    const cycleDay = await this.getCycleDay(userId, date);
    const currentCycle = await this.getCurrentCycle(userId);

    // Find symptom by name or create custom one
    let symptom = SYMPTOM_TAXONOMY.find((s) => s.name === symptomName);
    if (!symptom) {
      symptom = {
        id: this._generateId(),
        name: symptomName,
        category: 'OTHER',
        isCustom: true,
      };
    }

    const symptomLog: SymptomLog = {
      id: this._generateId(),
      cycleId: currentCycle.id,
      userId,
      symptomId: symptom.id,
      symptomName: symptom.name,
      intensity,
      loggedAt: date,
      createdAt: new Date(),
    };

    symptomLogs.set(symptomLog.id, symptomLog);

    // Update cycle day
    cycleDay.symptomLogs.push(symptomLog);
    cycleDay.updatedAt = new Date();

    await this.logEvent({
      id: this._generateId(),
      userId,
      type: EventType.SYMPTOM_LOGGED,
      entityId: symptomLog.id,
      metadata: { intensity, symptomName },
      timestamp: new Date(),
    });

    return symptomLog;
  }

  /**
   * Get all symptoms for a specific date
   */
  static async getSymptomsByDate(userId: string, date: Date): Promise<SymptomLog[]> {
    const cycleDay = await this.getCycleDay(userId, date);
    return cycleDay.symptomLogs;
  }

  /**
   * Get all symptoms in current cycle
   */
  static async getSymptomsByCycle(userId: string): Promise<SymptomLog[]> {
    return Array.from(symptomLogs.values()).filter((log) => log.userId === userId);
  }

  /**
   * Get symptom taxonomy
   */
  static getSymptomTaxonomy(): Symptom[] {
    return SYMPTOM_TAXONOMY;
  }

  /**
   * Generate insights (placeholder for future ML)
   */
  static async generateInsights(userId: string): Promise<Insight[]> {
    const cycle = await this.getCurrentCycle(userId);
    const symptoms = await this.getSymptomsByCycle(userId);

    // Simple observation-based insights (no ML)
    const insights_list: Insight[] = [];

    // Check if user has logged symptoms
    if (symptoms.length > 0) {
      const symptomNames = [...new Set(symptoms.map((s) => s.symptomName))];
      insights_list.push({
        id: this._generateId(),
        userId,
        cycleId: cycle.id,
        type: 'PHASE_OBSERVATION',
        title: 'Pattern Recognition',
        description: `You've logged ${symptomNames.length} different symptoms. These patterns help personalize insights over time.`,
        confidence: 'HIGH',
        createdAt: new Date(),
      });
    }

    return insights_list;
  }

  /**
   * Log an event for audit trail
   */
  static async logEvent(event: Event): Promise<void> {
    events.push(event);
  }

  /**
   * Get event history
   */
  static async getEvents(userId: string, limit: number = 100): Promise<Event[]> {
    return events.filter((e) => e.userId === userId).slice(-limit);
  }

  /**
   * Reset all data (for development/testing)
   */
  static reset(): void {
    userProfile = null;
    cycles.clear();
    cycleDays.clear();
    symptomLogs.clear();
    insights.clear();
    events = [];
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private static _generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
