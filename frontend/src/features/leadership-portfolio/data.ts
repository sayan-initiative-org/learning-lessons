export type RefType = "framework" | "research" | "vendor-survey" | "how-to" | "finance";
export type Ref = { title: string; url: string; type: RefType; keyPoint: string };
export type Stage =
  | "Frame" | "Research" | "Build" | "Stress-test" | "Summarise" | "Review" | "Sanitise" | "Publish";
export type Step = { stage: Stage; action: string };
export type Piece = {
  id: string; title: string; weeks: string; dates: string;
  proves: string; format: string;
  topics: string[]; references: Ref[]; researchTasks: string[];
  steps: Step[]; bestPractices: string[]; pitfalls: string[];
  interviewUse: string; doneCriteria: string[];
};

export const START_DATE = "2026-11-23"; // Monday of week 1 ("23 Nov" in the plan)
export const TOTAL_WEEKS = 12;
export const EXAM_WEEKS = [4, 8];

export const STAGES: { stage: Stage; text: string }[] = [
  { stage: "Frame", text: `name the decision the piece supports, the audience (CFO, CTO, board), and a one-sentence thesis with a number.` },
  { stage: "Research", text: `read the references, collect 2–3 external benchmarks, and log every source.` },
  { stage: "Build", text: `create the model, document or deck, with an assumptions register (each assumption, its value, its source, how confident you are).` },
  { stage: "Stress-test", text: `run a sensitivity analysis on the top 3 assumptions; find the break-even value for each.` },
  { stage: "Summarise", text: `a one-page executive summary that leads with the decision and gives the number as a range.` },
  { stage: "Review", text: `one finance-minded reviewer and one senior technology leader; fix what they flag.` },
  { stage: "Sanitise", text: `remove all employer data, names, client details and internal figures; label all numbers as illustrative; check your employer's policy on social media and outside publishing.` },
  { stage: "Publish", text: `export to PDF, add it to the portfolio hub, link it from LinkedIn Featured, and rehearse a 2-minute walkthrough.` },
];

export const PUBLICATION_RULES: string[] = [
  `Use illustrative or public-benchmark numbers only, never your employer's internal data, client names or unreleased product details.`,
  `Read your employer's social media and outside-publishing policy before posting; describe your work in general terms ("an enterprise AI coding assistant I led") unless you have approval to name it.`,
  `Present the portfolio as thought leadership, not as job seeking.`,
  `Cite every external statistic with a link; quote briefly and summarise in your own words.`,
  `Every chart has a title that states the finding, units on its axes, and a source line.`,
  `Keep one version of each file as the master; date your exports.`,
];

// Theme labels are navigation aids added for grouping; the practice text is unchanged.
export const BEST_PRACTICE_GROUPS: { theme: string; items: { lead: string; body: string }[] }[] = [
  {
    theme: "Lead with the message",
    items: [
      { lead: `Lead with the decision`, body: `the first line states what you recommend and what it's worth.` },
      { lead: `Ranges, not points`, body: `"$1.0–1.7M NPV", with the assumption that drives the range.` },
    ],
  },
  {
    theme: "Rigour and honesty",
    items: [
      { lead: `Kill criteria`, body: `every investment case says what would make you stop.` },
      { lead: `Capacity is not cash`, body: `separate released hours from money Finance can actually bank.` },
      { lead: `Show both sides of the evidence`, body: `AI productivity research conflicts, and saying so builds credibility.` },
    ],
  },
  {
    theme: "Packaging and rhythm",
    items: [
      { lead: `One artefact, three formats`, body: `a model (sheet), a one-pager (PDF), and a story (2 minutes spoken).` },
      { lead: `Publish on a rhythm`, body: `one article every 4 weeks beats five in one week.` },
    ],
  },
];

// Every source below was re-read on 22 Nov 2026. Qualifiers (vendor survey, method not stated, etc.)
// are kept in the source line so they travel with the number.
export const RESEARCH_CHECKED = `22 Nov 2026`;

export type KeyStat = { stat: string; source: string; url: string };
export const KEY_STATS: KeyStat[] = [
  { stat: `98% of FinOps practitioners manage AI spend, up from 63% in 2025 and 31% in 2024`, source: `State of FinOps 2026, FinOps Foundation (1,192 respondents; published Feb 2026)`, url: `https://data.finops.org` },
  { stat: `78% of FinOps teams report to the CTO or CIO; AI cost management is the most desired skill set (58%)`, source: `CIO Dive, citing State of FinOps 2026`, url: `https://www.ciodive.com/trendline/finops/509/` },
  { stat: `72% hit a surprise AI bill in the past year; 52% say there is no clear AI cost owner`, source: `Harness, State of AI in FinOps 2026 — vendor survey (700 engineering leaders and practitioners; fielded May–June 2026)`, url: `https://www.harness.io/state-of-ai-in-finops-2026` },
  { stat: `Respondents estimate that roughly a quarter of AI spend (26%) is wasted. This is an estimate by respondents, not a measured loss`, source: `Harness, State of AI in FinOps 2026 — vendor survey`, url: `https://www.harness.io/state-of-ai-in-finops-2026` },
  { stat: `Labor accounts for 50% to 70% of typical AI initiative costs, while non-labor token spend represents only 15% to 30%`, source: `TBM Council press release, 17 Nov 2026 (the release does not state the method; check the "Beyond Tokenomics" paper before quoting)`, url: `https://www.pr.com/press-release/978727` },
  { stat: `Only about one in five senior finance leaders (22%) can tie AI spend to outcomes, and 87% say they need to within the year`, source: `CloudZero, Finding the ROI of AI: The Finance Perspective (2026) — vendor-authored survey of 260 senior finance leaders, 135 of them CFOs; the page gives no publication or field dates`, url: `https://www.cloudzero.com/finance-needs-ai-roi-2026-survey-report/` },
  { stat: `In a controlled experiment, developers with GitHub Copilot completed a task 55.8% faster`, source: `Peng et al., 2023 (one task: implement an HTTP server in JavaScript)`, url: `https://arxiv.org/abs/2302.06590` },
  { stat: `In a randomized trial with 96 full-time Google software engineers, the best estimate was that developers using AI were about 21% faster on one enterprise task, with a large confidence interval`, source: `Paradis et al., Google, 2024`, url: `https://arxiv.org/abs/2410.12944` },
  { stat: `Experienced open-source developers took 19% longer with early-2025 AI tools, despite forecasting a 24% speed-up`, source: `METR, July 2025 — METR now labels this result out of date`, url: `https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/` },
  { stat: `In METR's late-2025 follow-up, the estimated change in task time was −18% for 10 returning developers (confidence interval −38% to +9%) and −4% for 47 new developers (−15% to +9%); negative means faster. METR calls these raw estimates a likely bad proxy because of selection effects and says the true speed-up could be much higher`, source: `METR, 24 Feb 2026`, url: `https://metr.org/blog/2026-02-24-uplift-update/` },
  { stat: `Microsoft engineers who adopted Claude Code or GitHub Copilot CLI merged roughly 24% more pull requests than they would have otherwise, across a four-month window. The authors note a merged PR is not the same as the value it delivers`, source: `Murphy-Hill, Butler and Savelieva, Microsoft, arXiv, 1 Jul 2026`, url: `https://arxiv.org/abs/2607.01418` },
  { stat: `AI acts as an amplifier: it magnifies the strengths of high-performing organisations and the dysfunctions of struggling ones`, source: `DORA 2025 (Google Cloud; nearly 5,000 technology professionals, per InfoQ)`, url: `https://dora.dev/research/2025/dora-report/` },
];

const ref = (title: string, type: RefType, keyPoint: string, url: string): Ref => ({ title, type, keyPoint, url });
const st = (stage: Stage, action: string): Step => ({ stage, action });

export const PIECES: Piece[] = [
  {
    id: `P1`,
    title: `SDLC Copilot AI Unit Economics Model + Optimisation Roadmap`,
    weeks: `1–3`,
    dates: `23 Nov – 13 Dec`,
    proves: `AI economics, unit-cost thinking, optimisation checked against quality evaluations`,
    format: `spreadsheet model + 1-page summary + 1 chart`,
    topics: [
      `GenAI cost stack (tokens, embeddings, vector DB, orchestration, evals, observability, platform team)`,
      `agentic call multiplication`,
      `prompt caching, model routing, batch processing`,
      `input, output and cached token pricing (the FinOps Foundation's token paper says output tokens usually cost three to five times input per token)`,
      `cost per accepted suggestion`,
      `capacity released vs cash`,
      `total cost of ownership including the team`,
      `evidence that keeps moving: METR now labels its 2025 slowdown result out of date, and a 2026 Microsoft rollout study measured output, not value`,
    ],
    references: [
      ref(`FinOps for AI Overview`, "framework", `Cost drivers, KPIs incl. cache hit rate and model fit; measure the use case, not the token (updated 28 Oct 2026)`, `https://www.finops.org/wg/finops-for-ai-overview/`),
      ref(`FinOps for AI Technology Category`, "framework", `How each capability applies to AI`, `https://www.finops.org/framework/technology-categories/ai/`),
      ref(`Managing AI Token Costs from Direct Model Provider APIs`, "framework", `Output tokens usually cost three to five times input; unit metrics incl. cost per successful outcome; FOCUS 1.5 scheduled for ratification in December 2026 (updated 28 Oct 2026)`, `https://www.finops.org/wg/token-economics/`),
      ref(`Optimizing GenAI Usage`, "framework", `Model size, utilisation, inference optimisation (May 2025; its savings ranges are unsourced, so verify before quoting)`, `https://www.finops.org/wg/optimizing-genai-usage/`),
      ref(`Optimize cost for AI workloads on Azure`, "how-to", `Caching, batching, routing, eval gate`, `https://learn.microsoft.com/en-us/startups/build/ai/ai-cost-optimization`),
      ref(`The Impact of AI on Developer Productivity (Peng et al.)`, "research", `55.8% faster in a controlled task`, `https://arxiv.org/abs/2302.06590`),
      ref(`How much does AI impact development speed? (Google RCT)`, "research", `About 21% faster in a randomized trial of 96 Google engineers; large confidence interval`, `https://arxiv.org/abs/2410.12944`),
      ref(`METR early-2025 developer study`, "research", `19% slower for experienced developers (METR now labels this out of date)`, `https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/`),
      ref(`METR: We are Changing our Developer Productivity Experiment Design`, "research", `Late-2025 raw estimates were speed-ups but METR calls them a poor proxy because of selection effects`, `https://metr.org/blog/2026-02-24-uplift-update/`),
      ref(`Adoption and Impact of Command-Line AI Coding Agents (Microsoft)`, "research", `Adopters merged about 24% more pull requests over four months; merged PRs are not the same as value`, `https://arxiv.org/abs/2607.01418`),
      ref(`The SPACE of Developer Productivity`, "research", `Productivity needs several dimensions, not one metric`, `https://queue.acm.org/detail.cfm?id=3454124`),
    ],
    researchTasks: [
      `Look up current input/output/cached prices on 2 provider pricing pages`,
      `Pick 3 SPACE dimensions to measure value`,
      `Note how Peng and METR differ in method and setting`,
      `Read METR's February 2026 update and note why it says its new estimate is unreliable`,
    ],
    steps: [
      st("Frame", `Write the thesis, e.g. "Routing and caching cut cost per active developer by about 60% with no drop in acceptance"`),
      st("Research", `Collect token prices, cache and batch discounts, and the productivity evidence above`),
      st("Build", `Driver sheet (developers, requests, calls per request, tokens, prices) → cost per request → cost per active developer`),
      st("Build", `Value sheet: hours saved × loaded rate × realisation factor; add platform team cost for full TCO`),
      st("Build", `Optimisation sheet: each lever with its saving and the evaluation check it must pass`),
      st("Stress-test", `Sensitivity on calls per request, routing share and cache hit rate; find the value-to-cost break-even`),
      st("Summarise", `One page: baseline vs optimised, the value ratio as a range, top 3 actions`),
      st("Review", `Check with a finance reviewer that capacity and cash are clearly separated`),
      st("Sanitise", `Replace all internal numbers with labelled illustrative values`),
      st("Publish", `PDF + one chart titled with the finding; add to hub`),
    ],
    bestPractices: [
      `Report unit costs as median and 90th percentile`,
      `Show full TCO, not just API cost`,
      `Gate every saving behind an evaluation`,
    ],
    pitfalls: [
      `Claiming productivity gains from a single study`,
      `Counting capacity released as cash savings`,
      `Ignoring calls per request in agentic flows`,
    ],
    interviewUse: `"Walk me through how you'd judge whether an AI coding assistant is worth it."`,
    doneCriteria: [`Model recalculates from drivers`, `Sensitivity table present`, `One-pager reviewed`, `Sanitised`, `Published`],
  },
  {
    id: `A1`,
    title: `Article: "Cost per accepted suggestion: how to judge an AI coding assistant"`,
    weeks: `3`,
    dates: `publish by 12 Dec`,
    proves: `thought leadership in AI economics`,
    format: `LinkedIn article, 900–1,200 words, 1 chart from P1`,
    topics: [
      `why cost per token misleads`,
      `conflicting productivity evidence, and why it keeps changing: METR now calls its 2025 slowdown result out of date`,
      `output is not value: Microsoft's 2026 study counts merged pull requests, and its authors say a merged PR is not the same as the value it delivers`,
      `a balanced scorecard (cost, acceptance, cycle time, satisfaction)`,
    ],
    references: [
      ref(`Peng et al.`, "research", `55.8% faster`, `https://arxiv.org/abs/2302.06590`),
      ref(`METR`, "research", `19% slower, 24% expected faster (METR now labels this out of date)`, `https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/`),
      ref(`METR February 2026 update`, "research", `Raw late-2025 estimates were speed-ups, but selection effects make them a poor proxy; true speed-up could be higher`, `https://metr.org/blog/2026-02-24-uplift-update/`),
      ref(`Microsoft early-2026 rollout study`, "research", `About 24% more merged pull requests for adopters over four months`, `https://arxiv.org/abs/2607.01418`),
      ref(`DORA 2025`, "research", `AI as amplifier`, `https://dora.dev/research/2025/dora-report/`),
      ref(`Write and publish articles on LinkedIn`, "how-to", `Publishing steps, cover image, scheduling`, `https://linkedin.com/help/linkedin/answer/a522427`),
    ],
    researchTasks: [
      `Read the DORA 2025 executive summary`,
      `Write down one surprising takeaway from each study`,
      `Read METR's February 2026 update before you cite its 2025 result`,
    ],
    steps: [
      st("Frame", `A hook stating a tension ("The most-cited AI slowdown study now calls its own result out of date")`),
      st("Research", `Summarise each study in two sentences, in your own words`),
      st("Build", `Draft: hook → evidence → your metric → how to measure it → what leaders should do`),
      st("Stress-test", `Ask: what would a sceptical CFO challenge?`),
      st("Summarise", `Headline + 2-line summary for the LinkedIn post that links to the article`),
      st("Review", `One peer read for clarity`),
      st("Sanitise", `No employer names or numbers`),
      st("Publish", `Publish, pin to Featured, reply to every comment within 24h`),
    ],
    bestPractices: [`One idea per article`, `Cite every statistic`, `End with a question to invite discussion`],
    pitfalls: [`Promoting yourself or your employer`, `Overstating any single study`],
    interviewUse: `"Tell me about a point of view you hold on AI that others might disagree with."`,
    doneCriteria: [`Published`, `Linked in Featured`, `Added to hub`],
  },
  {
    id: `P2`,
    title: `GenAI Scale-up Investment Case (AI Document Generator)`,
    weeks: `4–6`,
    dates: `14 Dec – 3 Jan (week 4 is an exam week: framing and research only)`,
    proves: `investment judgement — NPV, risk-weighting, stage gates`,
    format: `1-page investment memo + model`,
    topics: [
      `NPV, IRR, payback, ROI and when each misleads`,
      `risk-weighted benefits`,
      `adoption ramp`,
      `stage-gated funding and kill criteria`,
      `cost per generated document`,
      `budgeting AI spend from a measured baseline: the FinOps Foundation's token paper suggests measuring for 30 to 60 days, then budgeting at about 110 to 120 percent of baseline with alerts at 80 and 100 percent`,
    ],
    references: [
      ref(`Net Present Value (CFI)`, "finance", `NPV definition and formula`, `https://corporatefinanceinstitute.com/resources/valuation/net-present-value-npv/`),
      ref(`Cost Estimation of AI Workloads`, "framework", `Provisioned capacity changes the cost model versus per-token billing (Sep 2025; its example unit rates are not kept up to date)`, `https://www.finops.org/wg/cost-estimation-of-ai-workloads/`),
      ref(`How to Forecast AI Services Costs in Cloud`, "framework", `Weekly/monthly forecasting cadence (July 2025; older than the 2026 pages)`, `https://www.finops.org/wg/how-to-forecast-ai-services-costs-in-cloud/`),
      ref(`Managing AI Token Costs from Direct Model Provider APIs`, "framework", `Current budgeting guidance: measure 30 to 60 days, budget at 110 to 120 percent of baseline, shorter forecast windows (updated 28 Oct 2026)`, `https://www.finops.org/wg/token-economics/`),
      ref(`Unit Economics capability`, "framework", `Unit cost and value metrics`, `https://www.finops.org/framework/capabilities/unit-economics/`),
    ],
    researchTasks: [
      `Choose a discount rate and justify it`,
      `Benchmark manual hours per document from a public or self-measured source`,
      `Check batch pricing on one provider`,
      `Check the date on every FinOps Foundation page you rely on; two of the AI pages here date from 2025`,
    ],
    steps: [
      st("Frame", `The decision: "Fund scale-up to three more business units?"`),
      st("Research", `Manual baseline cost per document; adoption ramp assumptions`),
      st("Build", `Five-year cash flows: build, run (cost per document × volume), benefits risk-weighted at 50%`),
      st("Build", `NPV, payback and ROI; a kill criterion at each stage gate`),
      st("Stress-test", `Scenarios: build overrun +30%, adoption −40%, benefits arrive a year late`),
      st("Summarise", `Memo: decision, options, recommendation, NPV range, risks, kill criteria, owner`),
      st("Review", `Finance reviewer checks the discount rate and the risk-weighting`),
      st("Sanitise", `Generic business units; illustrative volumes`),
      st("Publish", `PDF memo + model; add to hub`),
    ],
    bestPractices: [`Recommend a stage-gated option, not a single go/no-go`, `State the assumption that drives the result`],
    pitfalls: [`ROI without timing`, `Benefits with no owner`],
    interviewUse: `"How do you decide whether to fund a GenAI initiative?"`,
    doneCriteria: [`NPV range with scenarios`, `Kill criteria`, `Reviewed`, `Published`],
  },
  {
    id: `P3`,
    title: `Run / Grow / Transform Portfolio Rebalancing Plan`,
    weeks: `6–7`,
    dates: `28 Dec – 10 Jan`,
    proves: `portfolio and budget leadership`,
    format: `3 slides + 1 table`,
    topics: [
      `Run/Grow/Transform split`,
      `funding Transform from Run savings`,
      `TBM cost pools → technology resource towers → solutions`,
      `decommissioning, commitments, SaaS licence rationalisation`,
      `where AI cost really sits: the TBM Council's November 2026 release says labor is 50% to 70% of typical AI initiative costs and token spend 15% to 30%`,
    ],
    references: [
      ref(`TBM Taxonomy 5.0.1`, "framework", `Latest version (released 18 July 2025): cost pools, technology resource towers, solutions; AI supported across layers with new AI sub-towers`, `https://www.tbmcouncil.org/taxonomy`),
      ref(`The CFO's Guide to the TBM Taxonomy`, "framework", `Traceability from general ledger to business outcomes`, `https://www.tbmcouncil.org/the-cfos-guide-to-the-tbm-taxonomy/`),
      ref(`TBM Council: TBM as the Business Operating System for AI (press release, 17 Nov 2026)`, "research", `Labor is 50% to 70% of typical AI initiative costs and token spend 15% to 30%; the release gives no method`, `https://www.pr.com/press-release/978727`),
      ref(`FinOps Framework 2026`, "framework", `Executive Strategy Alignment, Multi-Year Investment Strategy`, `https://www.finops.org/insights/2026-finops-framework/`),
      ref(`State of FinOps 2026`, "research", `FinOps now covers SaaS, licensing, data centre and AI`, `https://data.finops.org`),
    ],
    researchTasks: [
      `Map a sample $50M budget to TBM cost pools`,
      `List 4 sources of Run savings, each with a realistic % saving`,
    ],
    steps: [
      st("Frame", `Thesis: "Move from 65/20/15 to 55/25/20 in three years, funded by Run savings"`),
      st("Research", `Savings levers and their typical size from public sources`),
      st("Build", `Year-by-year table: Run savings → Grow/Transform funding`),
      st("Stress-test", `What if savings arrive 50% slower?`),
      st("Summarise", `3 slides: today, the plan, the risks`),
      st("Review", `Test it with a technology leader for realism`),
      st("Sanitise", `Generic budget figures`),
      st("Publish", `PDF + add to hub`),
    ],
    bestPractices: [`Name an owner for each savings lever`, `Show the sequence over time, not just the end state`],
    pitfalls: [`Cutting Run spend without assessing risk`, `Ignoring decommissioning costs`],
    interviewUse: `"How would you rebalance a technology budget towards innovation?"`,
    doneCriteria: [`3-year table`, `Risks`, `Published`],
  },
  {
    id: `A2`,
    title: `Article: "Why AI run cost is the smaller half of AI TCO"`,
    weeks: `7`,
    dates: `publish by 9 Jan`,
    proves: `thought leadership in technology value`,
    format: `LinkedIn article, 900–1,200 words, 1 chart`,
    topics: [
      `TCO components`,
      `platform team, evals and adoption effort`,
      `labor versus token spend: the TBM Council's November 2026 release puts labor at 50% to 70% of typical AI initiative costs and token spend at 15% to 30%`,
      `self-funding AI through efficiency`,
    ],
    references: [
      ref(`State of FinOps 2026 (press release)`, "research", `Organisations asked to self-fund AI through efficiency gains (19 Feb 2026)`, `https://www.linuxfoundation.org/press/state-of-finops-survey-ai-value-and-skills-top-priorities-as-finops-matures-across-technology-value-98-manage-ai-90-saas-64-licensing-48-data-center-1`),
      ref(`Harness State of AI in FinOps 2026`, "vendor-survey", `Surprise AI bills and unclear ownership; respondents estimate 26% of AI spend is wasted`, `https://www.harness.io/state-of-ai-in-finops-2026`),
      ref(`TBM Council: TBM as the Business Operating System for AI (press release, 17 Nov 2026)`, "research", `Labor is 50% to 70% of typical AI initiative costs and token spend 15% to 30%; the release gives no method`, `https://www.pr.com/press-release/978727`),
      ref(`Write and publish articles on LinkedIn`, "how-to", `Publishing steps`, `https://linkedin.com/help/linkedin/answer/a522427`),
    ],
    researchTasks: [
      `Gather 2 statistics on AI cost ownership; label vendor surveys as vendor surveys`,
      `Open the TBM Council's "Beyond Tokenomics" paper (linked from its press release) and check how the labor and token ranges were derived before you quote them`,
    ],
    steps: [
      st("Frame", `Hook: "Your AI API bill is the visible part of the cost."`),
      st("Research", `TCO line items from P1`),
      st("Build", `Draft: hook → TCO breakdown chart → what leaders miss → 3 actions`),
      st("Stress-test", `Check every claim has a source or an "illustrative" label`),
      st("Summarise", `Post text + headline`),
      st("Review", `Peer read`),
      st("Sanitise", `No employer data`),
      st("Publish", `Publish, add to Featured and the hub`),
    ],
    bestPractices: [`One chart, titled with the finding`, `Clearly label which sources are vendor surveys`],
    pitfalls: [`Presenting vendor surveys as neutral research`],
    interviewUse: `"What do most organisations get wrong about AI costs?"`,
    doneCriteria: [`Published`, `Linked`],
  },
  {
    id: `P4`,
    title: `FinOps & AI Operating Model + 90-Day Plan`,
    weeks: `9–10`,
    dates: `18 – 31 Jan (week 8, 11–17 Jan, is an exam week: buffer only)`,
    proves: `organisation design, governance and decision rights for a VP role`,
    format: `1 page + 1 diagram`,
    topics: [
      `forums and cadence`,
      `decision rights`,
      `AI investment council`,
      `where FinOps reports (CTO with a dotted line to Finance)`,
      `90-day plan: visibility → quick wins → governance`,
      `who owns AI cost today: Harness's 2026 vendor survey found 52% have no clear owner, with accountability split across Platform/DevOps, FinOps, Finance and Engineering`,
    ],
    references: [
      ref(`Executive Strategy Alignment`, "framework", `Added in the 2026 Framework; executives set priorities and FinOps puts them into action through Scopes (the four areas are listed on the 2026 Framework page)`, `https://www.finops.org/topic/executive-strategy-alignment/`),
      ref(`FinOps for AI Technology Category`, "framework", `AI Investment Council, personas`, `https://www.finops.org/framework/technology-categories/ai/`),
      ref(`CIO Dive on State of FinOps 2026`, "research", `78% of FinOps teams report to CTO/CIO`, `https://www.ciodive.com/trendline/finops/509/`),
      ref(`State of FinOps 2026`, "research", `78% of teams report to the CTO or CIO; teams reporting to the CFO fell to 8%`, `https://data.finops.org`),
      ref(`Harness State of AI in FinOps 2026`, "vendor-survey", `52% say there is no clear AI cost owner; ownership is split across several functions`, `https://www.harness.io/state-of-ai-in-finops-2026`),
      ref(`FinOps KPI Library`, "framework", `KPIs for governance forums`, `https://www.finops.org/wg/finops-kpis/`),
    ],
    researchTasks: [`Read the Executive Strategy Alignment page`, `Pick 5 KPIs for the forums`],
    steps: [
      st("Frame", `Thesis: "Three forums, clear decision rights, unit-cost KPIs in the QBR"`),
      st("Research", `Persona roles and recommended reporting lines`),
      st("Build", `Diagram of forums, cadence, chairs and decisions; RACI table`),
      st("Build", `90-day plan with milestones and measurable targets`),
      st("Stress-test", `What happens when Engineering and Finance disagree? Write the escalation path`),
      st("Summarise", `One page`),
      st("Review", `Test it with a current Director or VP`),
      st("Sanitise", `Generic organisation`),
      st("Publish", `PDF + add to hub`),
    ],
    bestPractices: [`Every forum has a decision it owns`, `Targets are numbers with dates`],
    pitfalls: [`Forums that only review reports`, `No escalation path`],
    interviewUse: `"What would you do in your first 90 days?"`,
    doneCriteria: [`Diagram`, `RACI`, `90-day plan`, `Published`],
  },
  {
    id: `P5`,
    title: `CFO Value Scorecard + QBR Narrative`,
    weeks: `10–11`,
    dates: `25 Jan – 7 Feb`,
    proves: `executive communication`,
    format: `1-page scorecard + 8–10 slide quarterly business review (QBR)`,
    topics: [
      `5–7 metrics with target, actual, trend and owner`,
      `spend bridge (volume, price, mix, efficiency)`,
      `translating engineering language for a CFO`,
      `what finance leaders say about AI ROI: a 2026 CloudZero vendor survey found 22% can tie AI spend to outcomes`,
    ],
    references: [
      ref(`Unit Economics capability`, "framework", `Unit metrics for executives`, `https://www.finops.org/framework/capabilities/unit-economics/`),
      ref(`FinOps KPI Library`, "framework", `KPI definitions`, `https://www.finops.org/wg/finops-kpis/`),
      ref(`DORA 2025`, "research", `Delivery metrics alongside AI adoption`, `https://dora.dev/research/2025/dora-report/`),
      ref(`Finding the ROI of AI: The Finance Perspective (CloudZero, 2026)`, "vendor-survey", `22% of senior finance leaders can tie AI spend to outcomes; 87% say they need to within the year; page has no publication or field dates`, `https://www.cloudzero.com/finance-needs-ai-roi-2026-survey-report/`),
      ref(`FinOps for AI Overview`, "framework", `Measure the use case, not the token: cost per successful outcome, reported as a range (updated 28 Oct 2026)`, `https://www.finops.org/wg/finops-for-ai-overview/`),
    ],
    researchTasks: [`Choose 2 DORA delivery metrics and 3 cost/value metrics`, `Draft a spend bridge from P1 data`],
    steps: [
      st("Frame", `Audience: the CFO; decision: continue and expand the AI programme?`),
      st("Research", `Metric definitions and targets`),
      st("Build", `Scorecard table + spend bridge chart + 8–10 slides in the order: headline, scorecard, bridge, risks, asks`),
      st("Stress-test", `Rehearse the three hardest CFO questions`),
      st("Summarise", `A 1-line headline for each slide`),
      st("Review", `Finance reviewer`),
      st("Sanitise", `Illustrative figures`),
      st("Publish", `PDF + add to hub`),
    ],
    bestPractices: [`One number per slide headline`, `Trend plus target, never a value on its own`],
    pitfalls: [`Too many metrics`, `Engineering jargon`],
    interviewUse: `"How do you show the business what technology delivers?"`,
    doneCriteria: [`Scorecard`, `Bridge`, `Slides`, `Published`],
  },
  {
    id: `A3`,
    title: `Article: "What a CFO wants from your AI programme: five numbers"`,
    weeks: `11`,
    dates: `publish by 6 Feb`,
    proves: `executive translation`,
    format: `LinkedIn article, 800–1,000 words`,
    topics: [`the five numbers`, `why ranges beat single values`, `capacity vs cash`],
    references: [
      ref(`State of FinOps 2026`, "research", `FinOps shifting into executive decision-making`, `https://data.finops.org`),
      ref(`Finding the ROI of AI: The Finance Perspective (CloudZero, 2026)`, "vendor-survey", `22% of senior finance leaders can tie AI spend to outcomes; vendor-authored survey, so label it as such`, `https://www.cloudzero.com/finance-needs-ai-roi-2026-survey-report/`),
      ref(`Write and publish articles on LinkedIn`, "how-to", `Publishing steps`, `https://linkedin.com/help/linkedin/answer/a522427`),
    ],
    researchTasks: [
      `Turn the P5 scorecard into five plain-English questions`,
      `Check whether the CloudZero survey page now shows a date and field period; it showed neither on 22 Nov 2026`,
    ],
    steps: [
      st("Frame", `Hook: "Your CFO doesn't care about tokens."`),
      st("Build", `One section per number, each with a one-line example`),
      st("Review", `Peer read by someone in finance`),
      st("Sanitise", `No employer data`),
      st("Publish", `Publish, add to Featured and the hub`),
    ],
    bestPractices: [`Write for a finance reader`, `Keep each section short`],
    pitfalls: [`Lecturing finance readers`],
    interviewUse: `"How do you talk to a CFO about AI?"`,
    doneCriteria: [`Published`, `Linked`],
  },
  {
    id: `P6`,
    title: `Portfolio Hub + Publication`,
    weeks: `12`,
    dates: `8 – 14 Feb`,
    proves: `a coherent leadership brand`,
    format: `one-page site (GitHub Pages) + LinkedIn Featured section + PDF pack`,
    topics: [
      `hub structure (positioning line, 5 pieces, 3 articles, contact)`,
      `consistent naming and dates`,
      `accessibility`,
    ],
    references: [
      ref(`Quickstart for GitHub Pages`, "how-to", `Create a site at username.github.io`, `https://docs.github.com/en/pages/quickstart`),
      ref(`Write and publish articles on LinkedIn`, "how-to", `Publishing and scheduling`, `https://linkedin.com/help/linkedin/answer/a522427`),
    ],
    researchTasks: [`Look at 3 senior technology leaders' LinkedIn Featured sections for structure`],
    steps: [
      st("Frame", `Positioning line: "I build AI products and run them like investments."`),
      st("Build", `Hub page: positioning, 5 piece cards (1-line finding + PDF link), 3 article links`),
      st("Review", `Check on mobile; check every link`),
      st("Sanitise", `Final pass over all PDFs`),
      st("Publish", `Go live; update the LinkedIn headline, About section and Featured; add the hub link to your CV`),
    ],
    bestPractices: [`One-line finding on every card`, `Same visual style across PDFs`],
    pitfalls: [`Broken links`, `Mixing in unpolished drafts`],
    interviewUse: `Send the hub link with your CV and after interviews`,
    doneCriteria: [`Hub live`, `All links work`, `LinkedIn updated`],
  },
];
