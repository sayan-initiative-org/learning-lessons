# Prompt — Generate "AI Value: Learning Lessons" React app

> **How to use:** Copy everything inside the fenced block below into a fresh model
> session (Claude/GPT with artifact or code output), then run it. The model returns one
> ready-to-run `App.tsx`. The 19 topic cards are **already filled in** (see `# Content`),
> drawn verbatim from the `finops-ai` study module — no pasting needed.
>
> **Scope note:** this intentionally produces a *single self-contained `App.tsx`*
> (runs as one artifact), **not** the repo's feature-module pattern. If you later want
> it wired into `frontend/src/tutorials/`, that's a separate conversion step.
>
> **Content provenance:** every fact/number/source in the cards traces to
> `frontend/src/features/finops-ai/sections/*.jsx`, which the module notes were verified
> against finops.org at build time. To regenerate the content from updated source,
> re-derive the cards from those section files — do not invent figures.

---

````markdown
# Role
You are a senior front-end engineer and learning-experience designer. Build a React learning app called **"AI Value: Learning Lessons"** from the topic content I paste at the end. It prepares a senior technology leader for the FinOps Certified: AI Value exam and for VP-level interviews.

# Tech requirements
- React 18 + TypeScript, styled with Tailwind CSS. Use lucide-react for icons.
- Deliver ONE self-contained file `App.tsx` (default export, no backend), with all lesson data in a typed `lessons` array at the top of the file.
- Use component state for navigation instead of a router, so it runs as a single artifact.
- Save progress (notes, confidence, review dates, quiz results) to localStorage, with every read and write wrapped in try/catch. If storage fails, the app must still work.
- Responsive from 360px mobile to desktop, keyboard-navigable, WCAG AA contrast, visible focus states.

# Data model
Convert every topic card into this shape. Use the card text exactly as written: never invent facts, numbers or sources.

```ts
type Lesson = {
  id: string;            // "0.1" ... "3.5"
  level: 0 | 1 | 2 | 3;  // 0 = Introduction
  title: string;
  coreIdea: string;
  mustKnow: string[];
  examTrap: string;
  copilot: string;       // "SDLC Copilot" field
  interviewLine: string;
  sources: { title: string; url: string }[];
};
```

Level names: 0 Introduction · 1 Visibility & Foundations · 2 Strategy, Control & Governance · 3 Optimisation & Advanced Economics.

# Pages
1. **Dashboard**
   - Four level cards showing lessons completed / total and an average confidence bar.
   - A "Due for review today" list.
   - A search box that searches titles and content.
   - A "Start 1-minute review" button.
2. **Level page**
   - The level's lessons as cards, each showing its id, title, confidence badge and next review date.
3. **Lesson page**, with sections in this fixed order:
   1. **Core idea:** a large highlighted statement.
   2. **Must know:** each fact hidden behind a "Reveal" button. Say it from memory first, then reveal.
   3. **Spot the trap:** one multiple-choice question per lesson.
      - The correct option comes from the card's facts.
      - One distractor is the card's exam trap, rephrased.
      - Add two more plausible distractors.
      - On answering, show why each option is right or wrong. You may write the distractors, but the correct answer must come from the card.
   4. **Apply it to SDLC Copilot:** the copilot text, plus a short prompt: "What would you measure first?"
   5. **Interview line:**
      - The soundbite in a quote block.
      - A "Practise aloud" 30-second timer.
      - A "Copy" button.
   6. **My notes:** an autosaving textarea.
   7. **Sources:** links that open in a new tab.
   8. **Rate your confidence:** four buttons: Not started / Shaky / Solid / Can teach it. Rating a lesson schedules its next review on day 1, 3, 7 or 14, based on how many reviews are done. A "Shaky" rating resets the schedule to day 1.
   - Navigation: previous / next lesson buttons, plus ← and → keyboard shortcuts.
4. **1-minute review mode**
   - Flashcards drawn from lessons due for review; if none are due, draw from the lowest-confidence lessons.
   - Front: the title. Back: the core idea and the must-know facts.
   - Space flips the card; buttons 1–4 rate confidence.
5. **Exam drill**
   - 10 random "Spot the trap" questions with a score at the end.
   - A list of the lessons to revisit.

# Design
- Calm, professional study-tool look: neutral background, one accent colour, generous spacing, readable type at 16–18px.
- Each lesson's sections are visually distinct cards with small labelled headers. Keep icons consistent.
- No pictures, mascots or decorative clutter.
- The top bar shows overall progress (lessons rated Solid or better out of 19) and a study streak in days.

# Quality bar (check before you finish)
- [ ] All 19 lessons are present, in curriculum order, with no text changed.
- [ ] Every source link is present and opens in a new tab.
- [ ] Quiz answers are correct according to the card text.
- [ ] Refreshing the page keeps notes and progress.
- [ ] The app works on a 360px-wide screen.
- [ ] There are no console errors or TypeScript errors.

# Output
Return only the complete `App.tsx`, ready to run. After the code, add a 3-line summary of features and any assumptions.

# Content
Source URL key (use these exact URLs in each card's `sources`):
- S1 FinOps Framework 2025 (PDF) — https://www.finops.org/wp-content/uploads/2025/05/English-FinOps-Framework-2025.pdf
- S2 FinOps for AI — Overview — https://www.finops.org/wg/finops-for-ai-overview/
- S3 Token Economics: The Atomic Unit of AI Value — https://www.finops.org/insights/token-economics-the-atomic-unit-of-ai-value/
- S4 Unit Economics capability — https://www.finops.org/framework/capabilities/unit-economics/
- S5 FinOps for AI — Technology Category — https://www.finops.org/framework/technology-categories/ai/
- S6 FinOps Principles — https://www.finops.org/framework/principles/
- S7 FinOps Domains — https://www.finops.org/framework/domains/
- S8 FinOps Capabilities — https://www.finops.org/framework/capabilities/
- S9 What is FinOps? — https://www.finops.org/introduction/what-is-finops/
- S10 2025 Framework — the addition of Scopes — https://www.finops.org/insights/2025-finops-framework/
- S11 2026 Framework — Technology Categories — https://www.finops.org/insights/2026-finops-framework/

## LEVEL 0 — Introduction

### 0.1 Why AI needs its own cost discipline
- Core idea: Traditional software cost is fixed and predictable; AI cost is variable, consumption-driven and opaque. You cannot govern what you cannot express per unit.
- Must know:
  1. Traditional SaaS cost driver is seats and instances; AI cost driver is tokens, inferences and GPU-hours.
  2. Marginal cost is approximately zero per user for traditional SaaS; it is non-zero per request for AI.
  3. Predictability is high for traditional SaaS; low for AI because of spikes, retries and prompt bloat.
  4. Visibility is a line-item invoice for SaaS; for AI it is buried in API and GPU bills.
  5. AI can tie cost to cost-per-outcome; SaaS value linkage is indirect.
- Exam trap: Assuming AI spend behaves like a SaaS subscription, so a fixed annual budget by seat count is enough.
- SDLC Copilot: Treat the Copilot as a metered service, not a licence. Its spend moves with how much it is used.
- Interview line: "AI cost is consumption-driven and opaque, so the first job is making it expressible per unit."
- Sources: S5, S9

### 0.2 AI economics are unit economics
- Core idea: If you cannot state cost per inference, per user and per resolved outcome, you cannot decide whether a use case is worth running, or whether to build or buy it.
- Must know:
  1. The three units are cost per inference, cost per user and cost per resolved outcome.
  2. FinOps was built for variable cloud spend, so it maps almost perfectly onto AI.
  3. Unit economics lets you decide worth-running and build-vs-buy.
- Exam trap: Reporting aggregate monthly AI spend as the headline metric instead of a per-unit or per-outcome figure.
- SDLC Copilot: Express Copilot cost per request, per developer and per completed task, not only as a monthly total.
- Interview line: "I report AI cost per outcome, because aggregate spend can't tell me whether a use case is worth running."
- Sources: S4, S3

### 0.3 What FinOps is
- Core idea: FinOps is an operational framework and cultural practice that maximizes the business value of technology, enables timely data-driven decisions and creates financial accountability across engineering, finance and business.
- Must know:
  1. The 2025 definition says "value of technology", not "value of cloud".
  2. The Foundation deliberately broadened the definition beyond cloud in 2025.
  3. That broadening lets the same discipline govern AI, SaaS, licensing and data-center spend.
  4. It is a collaboration between engineering, finance and business teams.
- Exam trap: Describing FinOps as a cloud cost-cutting practice owned by finance.
- SDLC Copilot: The Copilot's cost needs engineering, finance and product at the same table, not finance alone.
- Interview line: "FinOps is about the business value of technology, not just trimming the cloud bill."
- Sources: S9, S1

### 0.4 The six FinOps Principles
- Core idea: The six principles make FinOps a collaborative, value-driven, ownership-based practice that runs on timely data and embraces the variable cost model.
- Must know:
  1. Teams need to collaborate.
  2. Business value drives technology decisions.
  3. Everyone takes ownership of their usage.
  4. FinOps data is accessible, timely and accurate.
  5. FinOps is enabled centrally.
  6. Take advantage of the variable cost model.
- Exam trap: Believing a central FinOps team owns all cost optimization; principle 3 pushes ownership to engineers who own cost from design to operations, while the central function enables.
- SDLC Copilot: The engineers building the Copilot own its cost; a central team provides data and rate optimization.
- Interview line: "Accountability sits at the edge with the engineers; the central team enables, it doesn't own the spend."
- Sources: S6, S1

## LEVEL 1 — Visibility & Foundations

### 1.1 The four Domains and their Capabilities
- Core idea: The current framework is organized around four Domains, which are outcome headlines rather than process phases: Understand, Quantify, Optimize, Manage.
- Must know:
  1. Understand Usage & Cost: Data Ingestion, Allocation, Reporting & Analytics, Anomaly Management.
  2. Quantify Business Value: Planning & Estimating, Forecasting, Budgeting, KPIs & Benchmarking, Unit Economics.
  3. Optimize Usage & Cost: Architecting & Workload Placement, Rate Optimization, Usage Optimization, Sustainability, Licensing & SaaS.
  4. Manage the FinOps Practice: Practice Operations, Governance/Policy/Risk, Assessment, Automation/Tools, Education & Enablement, Invoicing & Chargeback, Intersecting Disciplines, Executive Strategy Alignment.
  5. Unit Economics sits under Quantify Business Value.
- Exam trap: Answering with the pre-2024 Inform → Optimize → Operate lifecycle; it has been superseded by the four Domains.
- SDLC Copilot: Map the Copilot's cost questions onto the four Domains, starting with Understand (allocation and reporting).
- Interview line: "The framework is four outcome domains now, not the old Inform-Optimize-Operate lifecycle."
- Sources: S7, S8

### 1.2 Maturity: Crawl / Walk / Run
- Core idea: Maturity is per capability, not global. You adopt any capability at Crawl and mature it as business value warrants.
- Must know:
  1. Crawl is reactive: problems are addressed after they occur, with basic metrics and thin adoption.
  2. Walk shows growing proactivity; personas build metrics for specific scopes, with defined processes.
  3. Run factors cost into architecture up front, with automated, unit-economics-driven decisions.
  4. You never need to be Run everywhere.
- Exam trap: Treating Crawl/Walk/Run as one organisation-wide score that must reach Run on every capability.
- SDLC Copilot: Run Copilot allocation at Walk while unit economics is still at Crawl, and raise each only as value warrants.
- Interview line: "Maturity is per capability; I mature what business value justifies, not everything to Run."
- Sources: S1, S8

### 1.3 Scopes and Technology Categories
- Core idea: A Scope is a segment of technology-related spending to which practitioners apply FinOps concepts; the 2026 update reframes Scopes as Technology Categories.
- Must know:
  1. Scopes became a core element of the framework in 2025.
  2. The 2026 update reframes them as Technology Categories.
  3. The categories are Public Cloud, SaaS, Data Center, Licensing and AI.
  4. Priorities differ per category: workload optimization dominates cloud but is not even top-five for AI.
- Exam trap: Applying the same optimization priorities to AI that you apply to public cloud.
- SDLC Copilot: Classify the Copilot under the AI category and use AI priorities, not cloud rightsizing habits.
- Interview line: "AI is its own technology category with its own priorities, so I don't port cloud playbooks over unchanged."
- Sources: S10, S11, S5

### 1.4 What makes AI a differentiated category, and its cost drivers
- Core idea: The FinOps Foundation treats AI as differentiated because of cost complexity, a faster development cycle, spend unpredictability and a greater need for policy and governance.
- Must know:
  1. 98% of FinOps teams manage AI spend, up from 31% two years earlier.
  2. Tokens are the fundamental metering unit for LLM services (about 2,048 tokens is roughly 1,500 words).
  3. API calls are tracked per invocation across managed services.
  4. GPUs/TPUs are consumed during both training and inference.
  5. Data ingestion is often uncertain and hard to evaluate up front.
  6. Model training cost varies with model complexity and performance targets.
- Exam trap: Naming only the API bill as the AI cost driver and ignoring GPUs, data ingestion and training.
- SDLC Copilot: List the Copilot's drivers across tokens, API calls, GPU use and data ingestion before modelling its cost.
- Interview line: "Nearly every FinOps team now manages AI spend, and tokens are the metering unit I start from."
- Sources: S5, S2

### 1.5 Allocation and forecasting reality
- Core idea: Attribution is hard when multi-tenant or multi-agent setups share services, and forecast variance is high early on, so use shorter forecasting windows.
- Must know:
  1. Attribution is hard in multi-tenant / multi-agent setups where many projects share the same services.
  2. Forecast variance is high in early (Crawl/Walk) stages.
  3. The Foundation recommends shorter forecasting windows.
  4. Revisit project funding more frequently until accuracy improves.
  5. Classic rightsizing barely applies to AI; the levers are usage optimization, rate optimization and workload placement.
- Exam trap: Locking a long-horizon annual AI forecast and revisiting funding only once a year.
- SDLC Copilot: Forecast the Copilot over short windows and review its funding frequently while accuracy is low.
- Interview line: "For AI I shorten the forecast window and revisit funding more often until accuracy improves."
- Sources: S2, S5

## LEVEL 2 — Strategy, Control & Governance

### 2.1 The AI Total Cost of Ownership stack
- Core idea: Inference is the visible cost; data, talent and human-in-the-loop are usually the dominant cost. Model the whole stack.
- Must know:
  1. The stack, top to bottom: Governance/risk/guardrails/compliance; Observability, evals, monitoring (MLOps); Human-in-the-loop (review, labeling, QA); Inference/serving (tokens or GPU-hours); Retrieval infra (vector DB, embeddings); Fine-tuning/adaptation (compute + data); Data (acquisition, labeling, pipelines).
  2. Talent (ML/AI engineers) is often the biggest line.
  3. Opportunity cost of time-to-market is also counted.
  4. Governance and compliance are the layer most often ignored.
- Exam trap: Modelling only the API or inference bill as the total cost of the use case.
- SDLC Copilot: Cost the Copilot across all layers, including human review, evals and governance, not only inference.
- Interview line: "Inference is the visible cost; data, talent and human review are usually the dominant ones."
- Sources: S2

### 2.2 Quantify the value: four value types
- Core idea: Cost is meaningless without value. The value type sets the ROI bar.
- Must know:
  1. Revenue-generating (new product, upsell) maps to incremental revenue.
  2. Cost-avoiding (automation, deflection) maps to hours or FTE saved.
  3. Risk-reducing (fraud, compliance) maps to loss avoided.
  4. Strategic/experimental use cases accept a lower ROI bar, but the budget must be capped explicitly.
  5. The Quantify Business Value domain exists to force this linkage before spend scales.
- Exam trap: Holding a strategic or experimental use case to the same ROI bar as a revenue-generating one, or leaving its budget uncapped.
- SDLC Copilot: Decide which value type the Copilot returns and measure value in that type.
- Interview line: "I classify the value type first, because it sets the ROI bar and tells me what to measure."
- Sources: S7, S4

### 2.3 Build vs buy: the spectrum and decision factors
- Core idea: Build vs buy is rarely binary. Most real systems sit in the middle, wrapping a bought model in a built product and data moat.
- Must know:
  1. The spectrum runs from Buy (closed API, managed LLM, SaaS AI) through Hybrid (RAG/prompt-eng on an API, fine-tuning a managed model) to Build (self-host open models, own serving, own GPU/infra).
  2. Buy is fast with low capex, but has high marginal cost and lock-in risk.
  3. Build is slow with high capex and low marginal cost, and is talent-heavy.
  4. Factors to score: differentiation, volume/scale, data sensitivity, latency/control, talent, time-to-market, lock-in tolerance.
  5. Core vs Context (Geoffrey Moore): build what differentiates you; buy what is necessary but undifferentiated.
- Exam trap: Treating the decision as binary, or building a model for something that is context rather than core.
- SDLC Copilot: Score the Copilot against the seven factors; the likely shape is a bought model with a built product and data moat.
- Interview line: "Buy the model, build the product experience and data moat around it."
- Sources: S2

### 2.4 Governance: the AI Investment Council
- Core idea: The recommended governance body is an AI Investment Council that approves, evaluates and tracks AI projects before spend scales.
- Must know:
  1. It approves, evaluates and tracks AI projects against defined outcomes.
  2. It considers risk profiles, delivery models and strategic objectives.
  3. It sets clear expectations before spend scales.
  4. AI has a greater need for policy and governance than other categories.
- Exam trap: Letting each team approve its own AI spend after the fact, with no central approval body.
- SDLC Copilot: Put the Copilot's business case and outcomes in front of an AI Investment Council before scaling spend.
- Interview line: "I want an AI Investment Council setting outcomes and risk expectations before spend scales."
- Sources: S5, S2

### 2.5 Aligned frameworks and attribution
- Core idea: Several established frameworks feed FinOps, but only the FinOps pieces are FinOps Foundation canon.
- Must know:
  1. TCO is the full lifecycle cost: direct, indirect and hidden.
  2. TBM is a standard taxonomy mapping IT spend to business services, and comes from the TBM Council, a separate body from the FinOps Foundation.
  3. Showback/Chargeback attributes (or bills) spend to the team that caused it, driving ownership.
  4. Core vs Context is Geoffrey Moore's.
  5. Break-even, Cost of Delay and ROI/NPV are general managerial finance.
  6. The Cloud Value Framework balances cost against agility, speed and resilience.
- Exam trap: Attributing TBM or Core vs Context to the FinOps Foundation.
- SDLC Copilot: Use showback to attribute Copilot spend to the teams causing it.
- Interview line: "FinOps is the operating discipline; TBM, TCO and break-even feed it, and I attribute each correctly."
- Sources: S1, S9

## LEVEL 3 — Optimisation & Advanced Economics

### 3.1 The unit-economics ladder
- Core idea: The Foundation's maturation path for AI unit economics runs from cost per token to cost per inference to cost per outcome.
- Must know:
  1. Crawl: cost per token, raw metering, where everyone starts.
  2. Walk: cost per inference (total inference spend ÷ request volume), accounting for system prompts, context and retries; also training cost ÷ performance.
  3. Run: cost per outcome, filtered by token yield rate, the share of generated tokens that reach a usable result.
  4. Outcome examples: cost per assist, per agent action, per case deflected, and time-to-close.
- Exam trap: Stopping at cost per token and calling it unit economics.
- SDLC Copilot: Move the Copilot's metric from cost per token toward cost per accepted assist or completed task.
- Interview line: "I take unit economics from cost per token up to cost per outcome, filtered by token yield."
- Sources: S3, S4

### 3.2 The viability test and verified formulas
- Core idea: A use case is viable only when value per outcome clears the fully loaded cost plus a target margin.
- Must know:
  1. cost_per_inference = (in_tokens × in_price) + (out_tokens × out_price).
  2. Viable if and only if Value_per_outcome > Cost_per_outcome + target_margin.
  3. Cost per API call = Total API Costs ÷ Number of API Calls; for example $1,200 ÷ 240,000 = $0.005 per call.
  4. AI ROI = (Financial Benefits − Costs) ÷ Costs × 100.
- Exam trap: Computing ROI as benefits divided by costs, or leaving out the target margin in the viability test.
- SDLC Copilot: Run the viability test on the Copilot using fully loaded cost per outcome.
- Interview line: "Viable means value per outcome beats fully loaded cost per outcome plus target margin."
- Sources: S4, S3

### 3.3 Break-even and the utilization trap
- Core idea: API pricing is pure variable cost; self-hosting is high fixed cost plus low marginal cost. Find the crossover volume.
- Must know:
  1. Buy (API): Total = Volume × price_per_call.
  2. Build (self-host): Total = Fixed_build + (Volume × marginal_build).
  3. V* = Fixed_build ÷ (price_buy − marginal_build).
  4. Below V*, buy; above V*, build can win, but only if utilization stays high.
  5. A GPU running at 20% is more expensive than the API it replaced.
- Exam trap: Using peak throughput instead of real utilization when justifying self-hosting.
- SDLC Copilot: Compare the Copilot's actual sustained volume against V* before considering self-hosting.
- Interview line: "Self-hosting only beats an API at high, steady utilization, so I model utilization, not peak."
- Sources: S2, S5

### 3.4 Optimization levers unique to AI
- Core idea: AI cost is reduced by model, prompt, cache, routing and throughput levers. Track each lever with cost per outcome, not raw spend.
- Must know:
  1. Model right-sizing: use the cheapest model that still passes evals.
  2. Prompt/context compression: fewer input tokens per call.
  3. Caching: reuse results for repeated or similar requests.
  4. Routing/cascades: small model first, escalate to a large one only when needed.
  5. Batching and quantization: raise throughput per GPU-hour.
  6. Buy vs self-host: the break-even decision.
- Exam trap: Measuring an optimization by token reduction alone when quality dropped.
- SDLC Copilot: Apply routing and caching to the Copilot, and judge each by cost per outcome.
- Interview line: "I track every optimization lever by cost per outcome so a cheaper-but-worse change shows up honestly."
- Sources: S5, S3

### 3.5 How the frameworks compose
- Core idea: TCO and value type qualify a use case; core-vs-context and break-even decide build-vs-buy; FinOps runs it continuously with unit economics as the north-star metric.
- Must know:
  1. TCO and value type qualify the use case.
  2. Core-vs-Context and break-even decide build vs buy.
  3. FinOps (Understand → Quantify → Optimize → Manage) runs it continuously.
  4. Unit economics is the north-star metric throughout.
  5. Cost of Delay is the economic cost of shipping later, which weighs against building in-house.
  6. ROI/NPV/Payback is the funding gate for a use case.
- Exam trap: Using break-even alone to decide build vs buy while ignoring Cost of Delay and core vs context.
- SDLC Copilot: Walk the Copilot through qualify, decide, then run, with unit economics tracked throughout.
- Interview line: "Qualify with TCO and value, decide with core-vs-context and break-even, then run it with FinOps."
- Sources: S1, S4
````
