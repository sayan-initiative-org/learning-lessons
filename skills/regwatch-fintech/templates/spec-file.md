# Feature Spec: <Feature / Change Title>

**Spec ID:** <YYYY-MM-DD>-<slug>
**Source requirement:** <story id / reg clause + URL>
**Status:** Draft
**Author:** regwatch-fintech (impact analysis)

> This spec is a handoff artifact for a coding agent. It states WHAT and WHY,
> with testable criteria. It does not prescribe HOW (no implementation detail
> beyond the impacted surfaces already identified).

---

## 1. Summary

<2–3 sentences: what changes and why. If reg-driven, cite the obligation in one line.>

## 2. User story

**As a** <role>
**I want** <capability>
**So that** <outcome / compliance reason>

## 3. Scope

**In scope:**
- <bullet>

**Out of scope:**
- <bullet>

## 4. Functional requirements

| ID | Requirement | Surface |
|----|-------------|---------|
| FR-1 | The system MUST <testable behaviour>. | frontend / backend / db |
| FR-2 | The system MUST <testable behaviour>. | … |

_Each requirement is atomic and testable. Use MUST / SHOULD / MAY._

## 5. Acceptance criteria (Given–When–Then)

**AC-1** (→ FR-1)
- **GIVEN** <state>
- **WHEN** <action>
- **THEN** <observable outcome>

**AC-2** (→ FR-2)
- **GIVEN** … **WHEN** … **THEN** …

## 6. Impacted surfaces (from Code Impact Report)

| Layer | File:line | Change |
|-------|-----------|--------|
| Frontend | `<path:line>` | <change> |
| Backend | `<path:line>` | <change> |
| Database | `<path:line>` | <change, or "none">|

**DB change required:** **Yes / No** — <one-line reason>

## 7. Dependencies & sequencing

- <ordering constraints, e.g. migration before backend deploy before FE>

## 8. Open questions

- [ ] <question> — owner: <SME / PM>

## 9. Traceability

| Requirement | Source clause/story | Acceptance |
|-------------|--------------------|------------|
| FR-1 | <clause/story id> | AC-1 |

---

_Generated from impact analysis on <DATE>. Review before implementation._
