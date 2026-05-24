# SDLC Copilot — Consolidated Technical & Executive Brief
**Prepared for:** Group CTO  
**Date:** May 2026  
**Classification:** Internal

---

## Table of Contents

1. [What Is SDLC Copilot](#1-what-is-sdlc-copilot)
2. [The Problem It Solves](#2-the-problem-it-solves)
3. [Adoption & Impact Metrics](#3-adoption--impact-metrics)
4. [PDLC Stage Compression](#4-pdlc-stage-compression)
5. [System Architecture](#5-system-architecture)
6. [The Six Specialist Agents](#6-the-six-specialist-agents)
7. [Unified LangGraph Workflow](#7-unified-langgraph-workflow)
8. [Hybrid Retrieval Pipeline](#8-hybrid-retrieval-pipeline)
9. [MCP Integration — Test Script Generation](#9-mcp-integration--test-script-generation)
10. [Quality & Evaluation Framework](#10-quality--evaluation-framework)
11. [Memory, Observability & Tooling](#11-memory-observability--tooling)
12. [Roadmap](#12-roadmap)
13. [Strategic Thesis](#13-strategic-thesis)
14. [The Ask](#14-the-ask)

---

## 1. What Is SDLC Copilot

SDLC Copilot is a **purpose-built, multi-agent AI platform** that automates the requirements and test authoring layer of the Product Delivery Lifecycle (PDLC). Built on LangGraph with Azure OpenAI, it ingests product intent — from free-text briefs or existing JIRA/TFS tickets — and generates production-ready artifacts with a built-in quality gate and human-in-the-loop refinement interface.

### Core Capability Surface

| Capability | Description |
|---|---|
| **Generate** | User Stories (INVEST-grade), Epics, Acceptance Criteria, Test Cases, Gherkin/BDD scripts |
| **Refine** | Natural-language refinement BOT — add scenarios, rewrite steps, regenerate selections |
| **Connect** | JIRA/TFS ingestion, Redis blackboard memory, MCP server surface, full observability |

### Technology Stack

- **Orchestration:** LangGraph (DAG-based conditional edges)
- **LLM Backend:** Azure OpenAI
- **Retrieval:** Hybrid BM25 + Dense Embedding (E5/BGE-M3) + RRF fusion + Cross-encoder reranking
- **Memory:** Redis pub/sub blackboard with ACL enforcement
- **Observability:** Arize Phoenix, LangSmith
- **Evaluation:** DeepEval, RAGAS, Pytest
- **Integration:** JIRA MCP, TFS API, MCP server for external callers

---

## 2. The Problem It Solves

The Define and Test stages of the PDLC are where delivery velocity consistently degrades — before a single line of business code is written.

### Four Root Causes

**Requirements drift**  
Business intent dilutes as it passes through BAs, leads, and developers. Each interpretation gap becomes a rework cycle late in the sprint.

**Manual story authoring**  
Senior engineers spend 8–12 hours per sprint writing User Stories, Acceptance Criteria, and BDD scripts by hand. This is high-cost, low-leverage work.

**Test coverage gaps**  
Negative paths, edge cases, and regression scenarios are routinely skipped under deadline pressure. Defects that originate at the requirements layer account for 30–40% of total bugs found downstream.

**Knowledge locked in JIRA**  
Past sprints contain the answers — domain context, prior decisions, reusable patterns — but no system reads them. Every new feature starts from a blank page.

### The Cost

- Define + Test stages consume up to **40% of every sprint**
- Typical Define stage for a mid-sized epic: **2–3 weeks**
- Manual authoring ceiling: roughly **3 senior engineers full-time**

---

## 3. Adoption & Impact Metrics

All numbers reflect production usage — every artifact passed human review before being accepted into the backlog or test suite.

| Metric | Value |
|---|---|
| User Stories generated | **600+** |
| Test Cases produced | **4,500+** |
| Specialist agents in production | **6** |
| PDLC Define + Test compression | **~65%** |

### What These Numbers Mean

- Generation throughput exceeds the manual ceiling of three full-time senior engineers
- Every artifact is traceable — logged in Arize Phoenix and LangSmith with full span-level observability
- The artifact corpus is itself retrieval signal — newer generations retrieve from older ones via the hybrid BM25 + dense + RRF stack, so quality compounds over time
- 600 stories and 4,500 test cases represent live institutional memory the system actively queries

---

## 4. PDLC Stage Compression

The ~65% compression is concentrated in two stages. All other stages are untouched.

| Stage | Before Copilot | With Copilot | Delta |
|---|---|---|---|
| Define | 12 days | 4 days | **−67%** |
| Design | 5 days | 5 days | — |
| Build | 14 days | 14 days | — |
| Test | 10 days | 4 days | **−60%** |
| Release | 3 days | 3 days | — |
| **Total** | **44 days** | **30 days** | **~32% end-to-end** |

*Figures based on median mid-sized epic. Define + Test combined: 22 days → 8 days = 64% reduction.*

The win is **concentrated and attributable** — Copilot does not touch Build, Design, or Release. This means the benefit is easy to measure, easy to isolate, and carries no risk of introducing AI into code-generation or deployment gates.

---

## 5. System Architecture

SDLC Copilot is organised into five layers.

### Layer 1 — Interface Layer
Exposes three surfaces to users and external systems:
- **Web UI** — product team-facing interface for brief submission and artifact review
- **Refinement BOT** — conversational interface for iterative refinement of any generated artifact
- **MCP Server endpoints** — protocol-standard surface for any compliant external caller

### Layer 2 — Orchestration Layer
The central coordination brain:
- **Intent Identifier** — parses incoming brief into structured intent, target artifact types, and context signals
- **DAG Task Planner** — builds a directed acyclic graph of agent invocations based on the identified intent
- **Agent Registry** — resolves which specialist agent handles each node in the plan; supports versioned agent swap-out

### Layer 3 — Agent Layer
Six LangGraph specialist agents, each owning one artifact type and one quality bar.  
Each agent runs a **CRAG (Corrective RAG) retrieval loop** — if retrieved context scores below a threshold, the agent triggers a web search or broader corpus search before proceeding.  
Each agent also runs a **Reflexion quality retry loop** — if the LLM-as-Judge scores the output below threshold, the critique is attached and the agent regenerates. This loop terminates after three attempts; failure escalates to the Error Handler.

### Layer 4 — Knowledge Layer
Hybrid retrieval stack:
- **BM25** for exact-term, ticket ID, and acronym recall
- **Dense embedding** (E5 / BGE-M3 with asymmetric prefixing) for semantic intent
- **RRF (Reciprocal Rank Fusion)** for model-agnostic rank blending
- **Cross-encoder reranking** for top-k precision lifting before context is passed to the LLM

### Layer 5 — Memory & Observability
- **Redis blackboard** — pub/sub shared memory across agents, scoped by ACL enforcement so cross-tenant leakage is impossible
- **Arize Phoenix** — span-level trace capture, latency, retrieval scoring, judge score history
- **LangSmith** — prompt-level logging, replay debugging, regression diffing

### Design Principles

| Principle | Rationale |
|---|---|
| Agentic, not monolithic | Each agent owns one artifact type and one quality bar. Failures are isolated and attributable. |
| DAG over chains | Parallel agent execution where artifacts are independent; sequential where one depends on another. |
| Memory is shared | Redis blackboard means context flows freely across agents without re-passing through the LLM context window. |
| MCP-first surface | Any compliant client can call our agents without a bespoke SDK or integration agreement. |
| Evaluation is built-in | A 5-layer LLM-as-Judge gates every output. The system cannot silently regress. |

---

## 6. The Six Specialist Agents

### Agent 01 — Intent Identifier
Parses the incoming brief (free-text, structured form, or JIRA ticket URL) into a normalised intent object: artifact targets, domain context, priority signals, and JIRA/TFS parent references. This is the only agent that does no generation — its job is structured understanding.

### Agent 02 — User Story Agent
Generates INVEST-grade User Stories with full Acceptance Criteria in Given/When/Then format. Runs CRAG retrieval against the historical corpus (600+ stories) and a Reflexion retry loop against the 5-layer judge. Fetches existing JIRA/TFS tickets in the same epic as retrieval context so new stories are consistent with prior work.

### Agent 03 — Epic Decomposer
Takes a high-level business brief and decomposes it into capability-level Epics with parent-child linking and story point estimates. Ensures each Epic maps to a bounded value delivery — no sprawling 200-point "do everything" epics.

### Agent 04 — Acceptance Criteria Agent
Produces Given/When/Then criteria mapped to individual User Stories. Covers happy path, alternative flows, and boundary conditions. Feeds directly into the Test Case Agent as input context.

### Agent 05 — Test Case Agent
Generates Test Cases across three coverage dimensions:
- **Positive** — expected happy-path flows
- **Negative** — invalid inputs, unauthorised access, boundary violations
- **Edge** — concurrency, race conditions, data extremes, fallback behaviour

Each test case carries a traceability link back to the originating User Story and Acceptance Criteria.

### Agent 06 — BDD Script Agent
Emits Cucumber-ready Gherkin feature files from the Test Cases generated by Agent 05. Validates syntax before returning. This is the agent whose output is exposed via the MCP server surface — any compliant caller can request a BDD script by passing a User Story ID or JIRA ticket reference.

---

## 7. Unified LangGraph Workflow

A single LangGraph topology handles both initial generation and all subsequent refinement — there is no separate "edit mode".

```
Intake (JIRA/TFS)
    ↓
Intent Identifier
    ↓
DAG Task Planner
    ↓
Retrieve (BM25 + Dense + RRF + Cross-Encoder)
    ↓
    ├──→ User Story Agent ──┐
    ├──→ Test Case Agent   ─┼──→ 5-layer Judge
    └──→ BDD Script Agent ──┘
              ↑                       │
              └── Refinement BOT ◄────┘ (conditional edge if score < threshold
                                         or user requests refinement)
```

### Conditional Edge Logic

The Refinement BOT is not a separate product — it is a conditional edge in the graph. When triggered (by a judge score below threshold, or a user refinement request), it routes back to the appropriate agent node with:
- The original output
- The judge's critique with dimension-level scores
- The user's natural-language instruction (if user-triggered)

This allows the agent to regenerate surgically — a single failing test case can be re-run without re-running the full story + criteria chain.

### JIRA/TFS Ingestion as Context

Before any generation begins, the system fetches existing tickets from the same Epic or Sprint context. This serves two functions:
1. **Consistency enforcement** — new stories use the same terminology, patterns, and acceptance criteria structure as existing ones
2. **Deduplication** — the agent is aware of what already exists and will not regenerate functionally identical artifacts

---

## 8. Hybrid Retrieval Pipeline

SDLC Copilot does not use naive vector search. The retrieval pipeline has six stages:

| Stage | Method | Role |
|---|---|---|
| 1. Query Expansion | Intent + entity extraction | Broadens recall surface |
| 2. BM25 Lexical | Sparse keyword index | Exact ticket IDs, acronyms, jargon |
| 3. Dense Embedding | E5 / BGE-M3 (asymmetric prefix) | Semantic intent and paraphrase |
| 4. RRF Fusion | Reciprocal Rank Fusion | Tunable, model-agnostic rank blend |
| 5. Cross-Encoder Rerank | Bi-directional attention over query+doc | Top-k precision lifting |
| 6. Agent Context | Top 5–8 chunks to LLM | Final context window population |

### Why Each Stage Exists

**BM25 first** — A pure embedding model will miss exact ticket IDs, story keys, and domain acronyms. Lexical recall catches what semantic similarity cannot.

**Dense second** — Semantic retrieval handles paraphrase and intent mapping. "Customer cannot log in" should retrieve "authentication failure on sign-in" — BM25 alone cannot do this.

**RRF fusion** — Reciprocal Rank Fusion blends the two ranked lists without requiring a hand-tuned interpolation weight. It is model-agnostic and degrades gracefully when one retriever underperforms.

**Cross-encoder rerank** — The cross-encoder reads the full query alongside each candidate document jointly — far more accurate than independent bi-encoder similarity. This is computationally expensive so is applied only to the top 20–30 candidates from the fused list, lifting top-1 precision sharply before the LLM sees its context window.

---

## 9. MCP Integration — Test Script Generation

### What Is Exposed

SDLC Copilot publishes an MCP (Model Context Protocol) server that exposes test script generation as a callable capability. Any MCP-compliant host — IDE, CI/CD pipeline, agent framework, or partner system — can invoke our agents without a bespoke SDK or integration agreement.

### Published MCP Tools

| Tool | Description |
|---|---|
| `generate_test_script` | Emits a Gherkin/BDD feature file from a User Story ID or plain-text story |
| `refine_test_script` | Natural-language refinement — add scenarios, rewrite steps, add edge cases |
| `generate_test_from_jira` | Pulls a JIRA or TFS ticket by ID and returns a Cucumber-ready feature file |
| `validate_script` | Runs a provided script through the 5-layer LLM-as-Judge and returns a quality score with dimension breakdown |

### Caller Ecosystem

The MCP surface makes SDLC Copilot callable from:
- **Claude Code** and Cursor (IDE-native agent access)
- **VS Code / JetBrains extensions** (via MCP client plugins)
- **CI/CD pipelines** (pre-merge Gherkin generation and validation gates)
- **JIRA / TFS** (ticket-to-script automation)
- **Custom agents** built by other teams
- **Partner GCCs and portfolio companies** (with Group authorisation)
- **Any MCP-compliant client** — the protocol is the contract

### Three Strategic Properties

**Zero integration cost**  
MCP is an open protocol. No SDK to ship, no client library to version-manage across teams. Any compliant host connects in minutes.

**Quality travels with every call**  
Every `generate_test_script` response is automatically gated by the 5-layer LLM-as-Judge before being returned to the caller. Consumers cannot retrieve an unvalidated script — quality is enforced at the protocol boundary.

**Footprint grows at zero marginal cost**  
Each new MCP host that connects extends our reach without additional engineering. The more surfaces that speak MCP, the larger our distribution becomes — with no incremental effort from the Copilot team.

---

## 10. Quality & Evaluation Framework

Every artifact generated by SDLC Copilot passes through a **5-layer LLM-as-Judge framework** before being returned to the user or MCP caller. Outputs below threshold are automatically routed back to the originating agent with the judge's critique attached.

### The Five Evaluation Layers

**L1 — Schema & Structure**  
Is the output well-formed? Does a User Story satisfy INVEST criteria? Is a Gherkin file parseable by Cucumber? Structural validation before any semantic evaluation.

**L2 — Faithfulness to Source**  
Does the output stay grounded in the retrieved context? Does a test case actually reflect the intent of the User Story it is derived from? Hallucination and fabrication detection.

**L3 — Functional Correctness**  
Do the Acceptance Criteria logically validate the stated feature? Do the Test Cases exercise the right system boundary? Would these tests actually catch the failure modes they claim to catch?

**L4 — Coverage & Completeness**  
Are negative paths, edge cases, and regression scenarios present? Is the test suite complete relative to the story scope, or are there obvious omission patterns?

**L5 — Style & Reusability**  
Tone, vocabulary, step-granularity, and pattern alignment with the organisation's house standards. Ensures generated artifacts are consistent with hand-written ones and require minimal editing.

### Composite Scoring

Each layer contributes a weighted score. The composite produces a single quality health score across 12 dimensions. The quality threshold is configurable per artifact type — User Stories and BDD scripts have different baselines.

### Evaluation Tooling Stack

| Tool | Role |
|---|---|
| **DeepEval** | Functional correctness rubrics, LLM-as-Judge wrappers |
| **RAGAS** | Faithfulness, context recall, answer relevance for retrieval quality |
| **Pytest** | CI-grade regression harness — eval runs gate every deployment |
| **Arize Phoenix** | Span-level trace capture, retrieval scoring, judge score history, latency tracking |
| **LangSmith** | Prompt-level logging, replay debugging, production diffing |

---

## 11. Memory, Observability & Tooling

### Redis Blackboard

The Redis pub/sub blackboard is the shared memory layer across all six agents. Key properties:

- **ACL enforcement** — each agent can only read/write keys scoped to its own tenant context; cross-tenant leakage is architecturally impossible
- **Cross-agent context sharing** — the Epic Decomposer's output is visible to the User Story Agent without re-passing through the LLM context window
- **Pub/sub messaging** — agents subscribe to completion events, enabling parallel execution where the DAG allows it
- **Ephemeral by design** — blackboard state is sprint-scoped and flushed after artifact acceptance, keeping memory footprint bounded

### Arize Phoenix (Observability)

- Full span-level trace for every agent invocation
- Retrieval quality scoring per chunk (relevance score, rank position)
- Judge score history — track quality trends across sprints
- Latency tracking by agent, retrieval stage, and model call
- Filterable by artifact type, sprint, team

### LangSmith (Development & Debugging)

- Prompt-level logging with full input/output capture
- Replay mode — re-run any historical invocation against a new model or prompt version
- Regression diffing — compare output quality before/after a retrieval or prompt change
- Used as the primary tool for CRAG loop debugging

---

## 12. Roadmap

### Now — Production Hardening
- Refinement BOT GA across all active product squads
- MCP server published to internal registry with `generate_test_script`, `refine_test_script`, `generate_test_from_jira`, `validate_script`
- 5-layer LLM-as-Judge gating every artifact in production
- Full observability via Arize Phoenix + LangSmith

### Next — Q3–Q4 2026 (Retrieval Upgrades)
- **HyDE (Hypothetical Document Embeddings)** — generate a synthetic ideal document for sparse / cold-start queries where the corpus has limited prior art; improves recall for first-of-kind features
- **Self-RAG controller** — adaptive retrieval decides per-token whether to retrieve at all, reducing unnecessary latency on high-confidence generation
- **Agentic chunking** — context-aware chunking for Design Documents and SoWs, enabling the corpus to ingest structured long-form documents beyond JIRA tickets

### After — 2027 H1 (Surface Expansion)
- **Design Doc Agent** — extends the agent layer to generate Statements of Work, Design Documents, and RFP responses at enterprise grade
- **Sprint Retrospective Agent** — mines historical JIRA sprint data to surface patterns, recurring blockers, and estimation drift
- **Code-stub generation from ACs** — MCP tools that convert Acceptance Criteria into typed function stubs and unit test skeletons, bridging the Copilot into the Build stage for the first time

---

## 13. Strategic Thesis

SDLC Copilot turns institutional knowledge — 600 stories, 4,500 test cases, and every sprint's worth of JIRA history — into a continuously-learning agentic workforce that drafts, refines, and tests the requirements layer of every new initiative.

**The compounding dynamic:** Every artifact we generate becomes retrieval context for the next generation. Newer sprints retrieve from older ones. Quality improves not because we tuned a model, but because the corpus grows and the retrieval stack has more signal to work with. The system gets sharper, not just bigger.

**The distribution dynamic:** The MCP server surface means SDLC Copilot is not a web application — it is a callable capability. As the MCP ecosystem grows (IDEs, pipelines, partner systems), our footprint expands without engineering effort. We become infrastructure, not a product.

**The two benefits are independent:** Teams benefit from speed today regardless of whether the MCP surface is enabled. The MCP surface extends reach regardless of whether teams care about PDLC compression. Both compound.

---

## 14. The Ask

Three commitments are needed to move SDLC Copilot from a program capability to a Group-wide platform.

**01 — Endorse the platform**  
Position SDLC Copilot as the default requirements + test authoring path for all Group product teams. The tooling, quality framework, and human-in-the-loop guardrails are production-ready today.

**02 — Fund Phase 2 retrieval**  
Greenlight the HyDE + Self-RAG work and the Design Doc Agent for Q3–Q4 2026. Both are scoped, sequenced, and will be gated by the same eval framework already in production.

**03 — Open the MCP surface**  
Authorise publication of the MCP server to partner GCCs and selected portfolio companies as a Group-wide differentiator. This is an architectural decision, not an engineering one — the surface already exists.

---

*SDLC Copilot Program · Prepared for the Group CTO · May 2026*
