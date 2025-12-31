# Architecture Decision Record - Cycle Intelligence Platform

**Date:** December 31, 2025  
**Status:** FINAL  
**Target Audience:** CTOs, Technical Leads, Acquiring Engineers

---

## ADR-001: Domain-Driven Design Over Feature-Driven

**Decision:** Organize codebase around domain entities (Cycle, Symptom, SymptomLog) rather than features (Home, Calendar, Profile).

**Rationale:**
- Domain model is stable across product iterations
- Features change; domain doesn't
- Makes backend integration natural
- Supports acquisition by different companies

**Implementation:**
- `/core/types/index.ts` is the single source of truth
- All code references these canonical types
- UI depends on types; types don't depend on UI

**Trade-off:**
- Slightly more upfront modeling
- Future-proofs significantly

---

## ADR-002: Data Service Abstraction

**Decision:** All data access goes through `DataService`, NOT direct storage calls.

**Rationale:**
- Decouples UI from persistence mechanism
- In-memory → AsyncStorage → SQLite → API requires ONE file change
- Event logging for audit trail & analytics
- Supports future state management migration

**NOT Using:**
- ❌ Redux (too heavy for MVP)
- ❌ MobX (unnecessary complexity)
- ❌ Context API (implied but explicit service is clearer)
- ❌ Direct AsyncStorage calls (scattered, hard to refactor)

**Chose:**
- ✅ Simple class with static methods
- ✅ In-memory store (mock data included)
- ✅ Future: swap internals, API unchanged

**Example:**
```typescript
// This works today (in-memory)
// Will work with AsyncStorage without UI change
// Will work with backend API without UI change
const symptomLog = await DataService.logSymptom('user-1', date, 'Cramps', MILD);
```

---

## ADR-003: Phase is Derived, Never User-Entered

**Decision:** Menstrual cycle phase is ALWAYS calculated from cycle mathematics, never directly entered by user.

**Rationale:**
- Phase is 100% deterministic given:
  - Last period start date
  - Cycle length
  - Current date
- User input on phase is noise
- Derived values are truth sources for analysis
- Supports future ML (phase is feature, not variable)

**Implementation:**
```typescript
// Phase is ALWAYS calculated
const dayOfCycle = calculateDayOfCycle(date, lastPeriodDate, cycleLength);
const phase = calculatePhase(dayOfCycle, cycleLength);

// Never this:
// const phase = userInputPhase;  ❌ WRONG
```

**CycleDay Model:**
```typescript
interface CycleDay {
  dayOfCycle: number;     // Calculated: 1-28
  phase: CyclePhase;      // Calculated: MENSTRUATION | FOLLICULAR | OVULATION | LUTEAL
  symptomLogs: SymptomLog[];  // User-provided
}
```

---

## ADR-004: Symptom Intensity as Enum

**Decision:** Symptom intensity is a normalized enum (MILD | MODERATE | SEVERE), not free text.

**Rationale:**
- Enables aggregation: "How many users report SEVERE cramps during menstruation?"
- ML-ready: categorical feature for clustering
- Prevents data entry chaos (no "pretty bad", "ow", "death")
- Clear when analyzing patterns

**NOT:**
- ❌ Free text ("a little", "super bad", "meh")
- ❌ Numeric 1-10 scale (subjective boundaries)
- ❌ Multiple selection (pick one)

**IS:**
- ✅ Enum: MILD | MODERATE | SEVERE
- ✅ Pre-selected UI chips
- ✅ Consistent across app

**Analytics ready:**
```sql
-- This query works beautifully
SELECT 
  phase, 
  symptomName,
  intensity,
  COUNT(*) as count,
  COUNT(*) / (SELECT COUNT(*) FROM symptomLogs) as prevalence
FROM symptomLogs
GROUP BY phase, symptomName, intensity
ORDER BY prevalence DESC;
```

---

## ADR-005: Educational Language, Not Medical

**Decision:** All UI copy is educational/observational, never diagnostic or prescriptive.

**Rationale:**
- Avoids regulatory burden
- Not making medical claims
- Scalable: data-driven, not opinion-driven
- Attracts health platforms (not just wellness)

**Language Rules:**

| NEVER | ALWAYS |
|-------|--------|
| "You will experience fatigue" | "Many users report increased fatigue" |
| "Prevents anemia" | "Supports iron levels" |
| "Treats cramps" | "Often observed: discomfort during menstruation" |
| "You should rest" | "Many users benefit from rest" |
| "Fertility peak" | "Peak fertility window (based on cycle math)" |

**Mechanism:**
- Avoid second person ("you")
- Use population reference ("many users", "often observed")
- Remove determinism ("will" → "may", "commonly")
- Data-grounding ("based on your patterns", "similar cycles show")

---

## ADR-006: Minimal MVP Feature Set

**Decision:** Include only features that directly feed cycle intelligence graph. Everything else is deferred.

**INCLUDED (Core):**
- ✅ Cycle Setup (dates, lengths)
- ✅ Symptom Logging (with intensity)
- ✅ Calendar Visualization
- ✅ Pattern Insights (observational)

**EXCLUDED (Deferred):**
- ❌ Food Recommendations (not core to cycle intelligence)
- ❌ Wellness Content (distracting)
- ❌ Wearable Integration (nice-to-have)
- ❌ Notifications (attention-seeking)
- ❌ Social/Community (scope creep)
- ❌ Health Tracking Toggles (overwhelming)

**Why:**
- Core MVP can be built in weeks
- Investors see focus (not feature bloat)
- Easy to add later (architecture supports it)
- Data quality: fewer features = better data

---

## ADR-007: Flat Type Structure (No Nesting)

**Decision:** Domain types are flat, relationships are foreign keys (IDs), not nested objects.

**Rationale:**
- Normalizes data for server-side aggregation
- Easier to serialize/deserialize
- Supports eventual database schema
- Avoids circular dependencies

**NOT:**
```typescript
❌ interface CycleDay {
  cycle: Cycle;              // Nested object
  symptomLogs: SymptomLog[]; // Embedded array
}
```

**IS:**
```typescript
✅ interface CycleDay {
  id: string;
  cycleId: string;           // Foreign key
  userId: string;
  symptomLogs: SymptomLog[]; // Embedded for convenience (but FKs exist)
}
```

**Why:**
- Maps 1:1 to REST API responses
- Normalizes for SQL/document databases
- No impedance mismatch later

---

## ADR-008: Event Logging for Audit Trail

**Decision:** All data mutations emit events (even in MVP with in-memory storage).

**Rationale:**
- Audit trail for compliance
- Event sourcing foundation (future feature)
- Analytics without separate tracking SDK
- Supports eventual replay/rollback

**Event Types:**
```typescript
SYMPTOM_LOGGED
CYCLE_STARTED
PROFILE_UPDATED
INSIGHT_GENERATED
```

**Example:**
```typescript
// When symptom is logged:
await DataService.logSymptom('user-1', date, 'Cramps', MODERATE);

// Internally emits:
const event: Event = {
  id: uuid(),
  userId: 'user-1',
  type: EventType.SYMPTOM_LOGGED,
  entityId: symptomLogId,
  metadata: { intensity: 'MODERATE', symptomName: 'Cramps' },
  timestamp: now(),
};
await this.logEvent(event);
```

**Not Overkill Because:**
- Small overhead
- Future big payoff
- Required for serious data product

---

## ADR-009: No Analytics SDK in MVP

**Decision:** No third-party analytics (Segment, Mixpanel, etc.) in MVP. Event log is the source of truth.

**Rationale:**
- No external dependencies
- Full control of data
- Can instrument easily later
- Aligns with data leverage model (no external tracking)

**Plan:**
1. MVP: Events logged to in-memory store
2. Phase 2: Events persisted to local DB
3. Phase 3: Events synced to backend on demand
4. Phase 4+: Instrument with third-party if needed

---

## ADR-010: Async/Await Throughout, Not Promises

**Decision:** All DataService methods are async, all callers use async/await.

**Rationale:**
- Future-proofs for async storage (AsyncStorage, DB queries)
- Clearer code flow
- Error handling via try/catch

**Implementation:**
```typescript
// All DataService methods
static async getUserProfile(): Promise<UserProfile | null>
static async logSymptom(...): Promise<SymptomLog>
static async getSymptomsByDate(...): Promise<SymptomLog[]>

// All callers
useEffect(() => {
  const load = async () => {
    const symptoms = await DataService.getSymptomsByDate(userId, date);
    setSymptoms(symptoms);
  };
  load();
}, []);
```

---

## ADR-011: No State Management Library (Yet)

**Decision:** Use React hooks + DataService for state. No Redux/Zustand/MobX in MVP.

**Rationale:**
- Simpler for MVP (fewer dependencies)
- DataService acts as single source
- Can add state library later without refactoring DataService

**Pattern:**
```typescript
const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    const s = await DataService.getSymptomsByDate(userId, date);
    setSymptoms(s);
    setLoading(false);
  };
  load();
}, [userId, date]);
```

**Future:**
- When needed, wrap DataService calls in Zustand/Context
- No UI changes required
- DataService layer insulates from state lib

---

## ADR-012: Timestamp Everything

**Decision:** Every entity has `createdAt` and `updatedAt` timestamps.

**Rationale:**
- Audit trail
- Temporal analysis ("how patterns evolved")
- Sorting/filtering by recency
- Required for production data product

**Model:**
```typescript
interface Entity {
  id: string;
  createdAt: Date;  // Immutable
  updatedAt: Date;  // Mutable (when field changes)
  // ... other fields
}
```

---

## Summary Table: Key Decisions

| Decision | Chosen | Why | Trade-off |
|----------|--------|-----|-----------|
| Architecture | Domain-Driven | Stable, acquisition-ready | More upfront modeling |
| Data Access | DataService abstraction | Backend-agnostic | Small abstraction cost |
| Phase Source | Derived (not user) | Accuracy + ML-ready | Can't let user override |
| Intensity | Enum (not string) | Aggregation + normalization | Less flexibility initially |
| Language | Educational | Regulatory + scalable | Requires discipline |
| Features | Minimal MVP | Focus + speed | Must defer good ideas |
| Types | Flat (no nesting) | API/DB ready | Slightly more boilerplate |
| Events | Always logged | Audit + analytics | Some overhead |
| Analytics | None (yet) | Simplicity | Manual instrumentation later |
| Async | Async/await | Future-proof | Slightly more code |
| State | Hooks only | Simplicity | May need library later |
| Timestamps | Always | Temporal analysis | Storage cost |

---

## What This Means for Acquirers

**If a health platform acquires this:**
- ✅ They can replace UI, keep DataService
- ✅ Phase derivation algorithm is clean & portable
- ✅ Data model maps naturally to their schema
- ✅ No medical claims to clean up

**If a data analytics firm acquires this:**
- ✅ Event log is ready for streaming
- ✅ Normalized data enables aggregation
- ✅ No coupling to consumer product
- ✅ Can retarget to B2B2C

**If a wearables company acquires this:**
- ✅ DataService easily integrates sensors
- ✅ Phase math is independent
- ✅ Symptom logging decoupled from wearables
- ✅ Can add device integrations without rework

---

**End of Architecture Decision Record**

This document locks key technical decisions. Deviation requires explicit approval from technical leadership.
