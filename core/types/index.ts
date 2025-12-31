/**
 * Canonical domain model types for Cycle Intelligence Platform
 * All types are immutable, timestamped, and API-ready
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Menstrual cycle phases derived from cycle day
 * Not user-entered; calculated from lastPeriodDate and cycle length
 */
export enum CyclePhase {
  MENSTRUATION = 'MENSTRUATION',
  FOLLICULAR = 'FOLLICULAR',
  OVULATION = 'OVULATION',
  LUTEAL = 'LUTEAL',
}

/**
 * Normalized symptom intensity levels
 * Enables consistent aggregation and ML-readiness
 */
export enum SymptomIntensity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

/**
 * Generic event types for analytics/audit trail
 * Supports future event streaming architecture
 */
export enum EventType {
  SYMPTOM_LOGGED = 'SYMPTOM_LOGGED',
  CYCLE_STARTED = 'CYCLE_STARTED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  INSIGHT_GENERATED = 'INSIGHT_GENERATED',
}

// ============================================================================
// DOMAIN MODELS
// ============================================================================

/**
 * User profile with cycle parameters
 * Minimal but sufficient for cycle phase calculations
 */
export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  lastPeriodStartDate: Date;
  cycleLength: number; // days, typically 21-35
  periodLength: number; // days, typically 2-7
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Single cycle instance
 * Represents one complete menstrual cycle
 */
export interface Cycle {
  id: string;
  userId: string;
  startDate: Date; // First day of menstruation
  expectedEndDate: Date; // Calculated
  actualEndDate?: Date; // If known
  cycleLength: number; // Actual observed length
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Daily cycle data
 * One record per day tracking logged symptoms and derived phase
 */
export interface CycleDay {
  id: string;
  cycleId: string;
  userId: string;
  date: Date;
  dayOfCycle: number; // 1-based, e.g., day 3 of 28-day cycle
  phase: CyclePhase; // DERIVED, not user-entered
  symptomLogs: SymptomLog[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Symptom definition (reference data)
 * Canonical list of symptoms with metadata
 * Future: sourced from backend taxonomy
 */
export interface Symptom {
  id: string;
  name: string;
  category: 'PHYSICAL' | 'EMOTIONAL' | 'OTHER';
  description?: string;
  commonDuringPhases?: CyclePhase[];
  isCustom: boolean; // Whether user-defined or from taxonomy
}

/**
 * Single symptom logged by user
 * Timestamped, normalized, aggregatable
 */
export interface SymptomLog {
  id: string;
  cycleId: string;
  userId: string;
  symptomId: string;
  symptomName: string; // Denormalized for quick access
  intensity: SymptomIntensity;
  loggedAt: Date;
  createdAt: Date;
}

/**
 * Pattern insight (non-predictive)
 * Explains observed correlations without medical claims
 */
export interface Insight {
  id: string;
  userId: string;
  cycleId: string;
  type: 'PHASE_OBSERVATION' | 'SYMPTOM_PATTERN' | 'TREND';
  title: string;
  description: string; // e.g., "Many users report increased fatigue during menstruation"
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'; // Based on sample size/recency
  supportingData?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Generic event for audit trail and analytics
 * Enables future event sourcing architecture
 */
export interface Event {
  id: string;
  userId: string;
  type: EventType;
  entityId?: string; // Reference to affected entity (symptom, cycle, etc.)
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Recommendation (reserved for future use)
 * Currently not used in MVP, but structure is reserved
 */
export interface Recommendation {
  id: string;
  userId: string;
  cycleId: string;
  category: 'LIFESTYLE' | 'NUTRITION' | 'ACTIVITY'; // Avoid medical categories
  title: string;
  description: string;
  relevantDuringPhase: CyclePhase;
  evidenceLevel: 'OBSERVATIONAL' | 'USER_REPORTED'; // Never "clinical"
  createdAt: Date;
}
