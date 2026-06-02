# Code Impact Report — <DATE>

**Requirement:** <story id / reg clause> — <one-line title>
**Source:** <MCP story | reg obligation (source, clause)>
**Code roots scanned:** FE `<frontend_paths>` · BE `<backend_paths>` · DB `<db_paths>`
**Search terms:** `<term1>`, `<term2>`, `<term3>`

---

## TL;DR

> One sentence: what this requirement forces the code to change, and whether the DB is touched.

---

## Frontend impact

| # | File:line | What changes | Confidence |
|---|-----------|--------------|------------|
| 1 | `<path:line>` | <e.g. add consent checkbox + validation to onboarding form> | High/Med/Low |

_None? → "No frontend candidates — requirement doesn't reach the UI layer."_

## Backend impact

| # | File:line | What changes | Confidence |
|---|-----------|--------------|------------|
| 1 | `<path:line>` | <e.g. add `consent_timestamp` to KYC DTO + validator> | High/Med/Low |

_None? → "No backend candidates."_

## Database change

**Verdict:** **Required / Not required / Uncertain**

**Why:** <one line — e.g. "adds persisted field `consent_timestamp`; needs a migration + model update">

| # | File:line | Change | Confidence |
|---|-----------|--------|------------|
| 1 | `<migrations/...>` | <new column / index / constraint / enum value> | High/Med/Low |

_If Uncertain →_ **Resolves with:** <the single fact that settles it>

---

## Ripple / dependencies

- <e.g. new field flows: migration → ORM model → DTO → validator → form. Don't ship FE before BE.>

## Open questions (need a human)

- <ambiguity that blocks a confident answer — route to SME / PM>

---

**Next:** turn this into a spec file? (orchestrator asks for consent)
