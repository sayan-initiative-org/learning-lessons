# SDLC Copilot — CTO Presentation
**Audience:** Group CTO
**Format:** 9-slide executive deck + 90-second verbal opener
**Date:** May 2026

---

## 90-Second Verbal Opener

> "The Define and Test stages of every sprint eat 40% of our delivery capacity — before a single line of business code gets written. Senior engineers spend 8 to 12 hours a sprint writing user stories, acceptance criteria, and test cases by hand. Knowledge from past sprints sits locked in JIRA, unread.
>
> SDLC Copilot fixes that layer. It's a multi-agent platform built on LangGraph that ingests a brief — or an existing JIRA ticket — and produces INVEST-grade user stories, full acceptance criteria, test cases across positive, negative, and edge dimensions, and Cucumber-ready BDD scripts. Every artifact passes a 5-layer quality judge before it reaches a human.
>
> Production today: 600+ user stories, 4,500+ test cases, ~65% compression on Define and Test combined. Every artifact is human-reviewed, traceable, and observable end-to-end.
>
> And we've exposed test script generation as an MCP server — meaning Claude Code, Cursor, CI pipelines, and any compliant client can call our agents without integration work. We become callable infrastructure, not a web app.
>
> What I want from you in the next 15 minutes: endorsement to make this the default path Group-wide, and authorisation to open the MCP surface to partner GCCs."

---

## Slide 1 — Title

**SDLC Copilot**
*Agentic Requirements & Test Authoring for the Group*

Prepared for the Group CTO · May 2026

*Speaker note:* Set tone. This is a production platform with measurable impact, not a pilot or a demo.

---

## Slide 2 — The Problem in One Frame

**Define + Test stages consume up to 40% of every sprint.**

Four root causes:

| Cause | Cost |
|---|---|
| Requirements drift through BAs → leads → devs | Late-sprint rework cycles |
| Manual story authoring by senior engineers | 8–12 hours per sprint per engineer |
| Negative paths and edge cases skipped under deadline pressure | 30–40% of downstream defects originate at requirements layer |
| Past sprint knowledge locked in JIRA, never re-read | Every new feature starts from a blank page |

**Manual ceiling: ~3 senior engineers full-time on artifact authoring alone.**

*Speaker note:* This is the cost we are paying today. The CTO needs to feel the size of the leak before seeing the fix.

---

## Slide 3 — What SDLC Copilot Does

**A purpose-built multi-agent platform that automates the requirements and test authoring layer of the PDLC.**

Three capability surfaces:

- **Generate** — User Stories (INVEST-grade), Epics, Acceptance Criteria, Test Cases (positive / negative / edge), Cucumber/Gherkin BDD scripts
- **Refine** — A conversational refinement BOT that adds missing scenarios, rewrites steps, or regenerates selectively against any existing artifact
- **Connect** — Native JIRA / TFS ingestion (refine from existing tickets), Redis blackboard memory, MCP server surface, full observability

**Built on LangGraph + Azure OpenAI. Every output passes a 5-layer quality judge before it reaches a human.**

*Speaker note:* One slide. One answer to "what is it." Don't open architecture yet.

---

## Slide 4 — Proof in Production

| Metric | Value |
|---|---|
| User Stories generated and accepted | **600+** |
| Test Cases produced and accepted | **4,500+** |
| Specialist agents in production | **6** |
| Define + Test compression | **~65%** |
| End-to-end PDLC compression | **~32%** |

**Define stage:** 12 days → 4 days · **Test stage:** 10 days → 4 days

*Every artifact human-reviewed before acceptance. Every artifact traceable in Arize Phoenix and LangSmith with span-level observability.*

**Compounding dynamic:** the 600 stories and 4,500 test cases are themselves retrieval signal — newer generations retrieve from older ones via the hybrid BM25 + dense + RRF stack. The system gets sharper as it gets larger.

*Speaker note:* These are not projections. This is shipped production work, gated by human review and live observability.

---

## Slide 5 — Architecture at a Glance

**Five layers, agentic-not-monolithic, MCP-first.**

```
┌─────────────────────────────────────────────────────────┐
│  Interface       Web UI · Refinement BOT · MCP Server   │
├─────────────────────────────────────────────────────────┤
│  Orchestration   Intent Identifier → DAG Planner        │
├─────────────────────────────────────────────────────────┤
│  Agents          6 LangGraph specialists                │
│                  (CRAG retrieval + Reflexion retry)     │
├─────────────────────────────────────────────────────────┤
│  Knowledge       BM25 + Dense + RRF + Cross-Encoder     │
├─────────────────────────────────────────────────────────┤
│  Memory/Obs.     Redis Blackboard · Phoenix · LangSmith │
└─────────────────────────────────────────────────────────┘
```

Design principles the CTO should hear:

- **Agentic, not monolithic** — each agent owns one artifact type and one quality bar; failures are isolated and attributable
- **MCP-first surface** — any compliant client connects without a bespoke SDK
- **Evaluation is built-in** — the 5-layer judge gates every output; the system cannot silently regress
- **Memory is shared** — Redis blackboard means context flows across agents without re-passing through the LLM window

*Speaker note:* Don't read every layer. Land the four principles — these are the architecturally load-bearing choices.

---

## Slide 6 — The Unified LangGraph Workflow

**One graph, not two. Initial generation and refinement share the same topology.**

```
   JIRA / TFS Ticket  ─or─  Free-text Brief
                  │
                  ▼
          Intent Identifier
                  │
                  ▼
          DAG Task Planner
                  │
        ┌─────────┴─────────┐
        ▼         ▼         ▼
  User Story   Test Case   BDD Script
     Agent       Agent       Agent
        └─────────┬─────────┘
                  ▼
           5-Layer Judge
                  │
       score ≥ threshold ─→ Return to user
       score < threshold ─→ Refinement BOT
                              │
                              └→ back to originating agent
                                 (surgical regeneration)
```

Conditional-edge logic does two things at once:

1. **From-scratch generation** — clean greenfield path for new briefs
2. **Refine-existing flow** — pulls a JIRA/TFS ticket as retrieval context and regenerates against it. The same workflow handles "create from blank" and "improve what we have."

The Refinement BOT is **not a separate product** — it's a conditional edge triggered by either a judge-score miss or a user request. It can regenerate a single failing test case without re-running the full chain.

*Speaker note:* This is the architectural lever that gives us low marginal cost on refinement — we did not build a second product to handle edits.

---

## Slide 7 — MCP: Test Script Generation as a Callable Capability

**SDLC Copilot publishes an MCP server. Any compliant host can invoke our agents — no SDK, no integration agreement.**

Published MCP tools:

| Tool | What it does |
|---|---|
| `generate_test_script` | Emits a Gherkin/BDD feature file from a User Story ID or plain-text story |
| `generate_test_from_jira` | Pulls a JIRA / TFS ticket by ID and returns a Cucumber-ready script |
| `refine_test_script` | Natural-language refinement — add scenarios, rewrite steps, add edge cases |
| `validate_script` | Runs a script through the 5-layer judge, returns quality score with dimension breakdown |

Caller ecosystem (live or imminent):

- **Claude Code, Cursor, VS Code, JetBrains** — IDE-native agent access
- **CI/CD pipelines** — pre-merge Gherkin generation and validation gates
- **JIRA / TFS** — ticket-to-script automation
- **Partner GCCs and portfolio companies** — with Group authorisation

**Three properties make MCP strategically load-bearing:**

1. **Zero integration cost** — MCP is an open protocol; no SDK to ship, no client library to version across teams
2. **Quality travels with every call** — every `generate_test_script` response is gated by the 5-layer judge before return. Consumers cannot retrieve an unvalidated script.
3. **Footprint grows at zero marginal cost** — every new MCP-speaking host extends our reach with no engineering effort from us

*Speaker note:* This is the slide where the CTO should see "platform," not "tool." We become callable infrastructure.

---

## Slide 8 — Quality, Observability, and Trust

**Every artifact passes a 5-layer LLM-as-Judge before reaching a human.**

| Layer | What it checks |
|---|---|
| L1 — Schema & Structure | INVEST conformance, Gherkin parseability |
| L2 — Faithfulness to Source | Stays grounded in retrieved context, no hallucination |
| L3 — Functional Correctness | Do these tests actually catch the failures they claim to? |
| L4 — Coverage & Completeness | Negative paths and edge cases present, no obvious omissions |
| L5 — Style & Reusability | Matches house tone, granularity, and pattern vocabulary |

Below-threshold outputs auto-route back to the originating agent with the critique attached — **the system cannot silently regress.**

Observability stack:

- **Arize Phoenix** — span-level traces, retrieval scoring, judge-score history, latency by agent
- **LangSmith** — prompt-level logging, replay debugging, regression diffing
- **DeepEval + RAGAS + Pytest** — CI-gated eval runs on every deployment

*Speaker note:* This is the "is it safe to scale" slide. The answer is yes, and here is the evidence trail.

---

## Slide 9 — The Ask

**Three commitments to move from program capability to Group-wide platform.**

**01 — Endorse the platform**
Position SDLC Copilot as the default requirements + test authoring path for all Group product teams. Production-ready today; human-in-the-loop guardrails are in place.

**02 — Fund Phase 2 retrieval**
Greenlight HyDE + Self-RAG + Agentic Chunking for Q3–Q4 2026, plus the Design Doc Agent. Scoped, sequenced, and gated by the same eval framework already in production.

**03 — Open the MCP surface**
Authorise publication of the MCP server to partner GCCs and selected portfolio companies as a Group-wide differentiator. The surface already exists — this is an architectural decision, not an engineering one.

---

## Closing Frame (verbal, ~30 seconds)

> "Two compounding dynamics: the corpus grows, so retrieval gets sharper. The MCP surface spreads, so reach grows without engineering effort. Teams get speed today regardless of MCP; MCP extends reach regardless of any one team. Both compound independently. That's why this is worth treating as Group infrastructure."

---

*SDLC Copilot Program · CTO Presentation · May 2026*
