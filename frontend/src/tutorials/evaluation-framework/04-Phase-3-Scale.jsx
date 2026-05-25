import { useState } from "react";
import { Link } from "react-router-dom";

// Warm-dark editorial palette. Phase 3 signature = plum.
const T = {
  bg:       "#0d0d0f",
  s1:       "#0a0a0c",
  card:     "#15151a",
  border:   "#26262c",
  text:     "#f0ebe1",
  dim:      "#8a857c",
  muted:    "#5c5a55",
  bright:   "#c8c3b8",

  phase:    "#9b7bbf",    // plum — Phase 3 signature
  phaseDim: "#9b7bbf12",
  phaseMid: "#9b7bbf35",
  red:      "#a85544",
  green:    "#7a9966",
  amber:    "#d4a64a",
  blue:     "#6b8aa8",
  pink:     "#c87553",
};

const TABS = [
  { id: "overview", label: "Overview & Goal" },
  { id: "what",     label: "What We Add" },
  { id: "what-not", label: "Permanent Exclusions" },
  { id: "decisions", label: "Key Decisions" },
  { id: "deliverables", label: "Deliverables" },
  { id: "feedback", label: "Feedback Loop" },
  { id: "gates",    label: "Maturity Gates" },
  { id: "risks",    label: "Risks & Mitigations" },
];

const whatWeBuild = [
  { item: "3 additional dimensions (Business Value, Persona, Completeness)", why: "Now that core 3 dims are stable, expand to full 6. Each new dim gets its own calibration cycle.", category: "Coverage" },
  { item: "CI/CD blocking gate",  why: "Stories below threshold cannot progress to sprint backlog. Authority earned through Phase 1+2 trust.", category: "Enforcement" },
  { item: "Self-improving rubric loop", why: "Quarterly correlation analysis: which dimensions predict sprint outcomes? Adjust weights based on data, not opinion.", category: "Learning" },
  { item: "Per-team rubric customisation", why: "Org-wide baseline + per-team overrides. Mature teams can tighten thresholds; new teams loosen them.", category: "Scale" },
  { item: "Cross-artifact evaluation",  why: "Move beyond single-story scoring to epic-level coverage analysis. Detects scenario gaps and AC-to-TC traceability.", category: "Coverage" },
  { item: "Production monitoring (TruLens or equivalent)", why: "Real-time drift detection, eval quality alerts, automated golden set re-validation.", category: "Observability" },
  { item: "Multi-tenant deployment",  why: "Other product teams onboard SDLC Copilot eval framework. Same engine, isolated tenants.", category: "Scale" },
  { item: "Quarterly model upgrade workflow", why: "When Claude releases new model, automated golden set re-eval determines if upgrade is safe. Block if Kappa drops > 0.05.", category: "Operations" },
];

const permanentExclusions = [
  { item: "Replace human reviewers entirely", reason: "Eval framework augments judgment, never replaces it. Final story acceptance always human.", basis: "Philosophical" },
  { item: "Use eval scores in performance reviews", reason: "Creates gaming incentive. Quality is collective, not individual. Sprint-level only.", basis: "Cultural" },
  { item: "Real-time rubric mutation from overrides", reason: "Creates instability. Overrides feed quarterly review, not continuous updates.", basis: "Methodological" },
  { item: "Public team leaderboards / shaming", reason: "Destroys trust faster than any technical failure. Permanent ban.", basis: "Cultural" },
  { item: "Cross-org eval score sharing without consent", reason: "Each team's data is theirs. Aggregation requires explicit opt-in.", basis: "Governance" },
  { item: "Auto-rewriting failing stories without author review", reason: "Removes craft. Eval flags issues; authors decide how to address.", basis: "Philosophical" },
];

const decisions = [
  {
    title: "CI/CD gate threshold: composite < 50 blocks merge",
    rationale: "Only Grade D (Poor) blocks. Grade C (Needs Work) flags but doesn't block. Earned this authority in Phase 2 with Kappa > 0.60.",
    tradeoff: "Some legitimate edge cases will hit the gate. Acceptable — manual override exists for emergencies.",
    impact: "Enforcement",
    color: T.phase,
  },
  {
    title: "Expand to 6 dimensions one at a time, not all at once",
    rationale: "Each new dimension needs its own calibration cycle. Adding 3 simultaneously dilutes signal and overwhelms reviewers.",
    tradeoff: "Slower expansion. Compensated by higher trust in each new dim before next is added.",
    impact: "Quality",
    color: T.green,
  },
  {
    title: "Rubric weight adjustments quarterly, not continuously",
    rationale: "Weight changes affect historical comparisons. Quarterly cycle creates clean comparison windows.",
    tradeoff: "Less responsive to acute issues. Acceptable — most quality issues are chronic, not acute.",
    impact: "Stability",
    color: T.blue,
  },
  {
    title: "Self-improving loop uses correlation, not causation",
    rationale: "If AC Quality scores predict sprint failures better than INVEST, increase AC weight. We can't prove causation — but predictive power is enough.",
    tradeoff: "Could reinforce existing biases. Mitigated by mandatory human review of every weight change.",
    impact: "Methodological",
    color: T.amber,
  },
  {
    title: "Per-team rubric overrides must stay within ±20% of org baseline",
    rationale: "Customisation is valuable; fragmentation is not. Bounded flexibility prevents 'every team has different standards.'",
    tradeoff: "Some teams will want more freedom. Compensated by clear opt-out path (don't use eval at all).",
    impact: "Governance",
    color: T.pink,
  },
  {
    title: "Model upgrades gated by Kappa preservation",
    rationale: "New Claude version must score golden set within ±0.05 Kappa of current. Otherwise, recalibrate before upgrading.",
    tradeoff: "Slower model adoption. Compensated by stable judge behavior across versions.",
    impact: "Operations",
    color: T.red,
  },
  {
    title: "Cross-artifact eval is opt-in per epic",
    rationale: "Epic-level coverage analysis is expensive. PMs opt in for important epics, not blanket.",
    tradeoff: "Inconsistent coverage analysis. Acceptable — selective depth beats universal shallowness.",
    impact: "Cost-Coverage",
    color: T.dim,
  },
];

const deliverables = [
  {
    name: "Expanded Rubric (6 Dimensions)",
    detail: "Three new dimensions added: Business Value Clarity, Role/Persona Accuracy, Completeness & Coverage. Each calibrated independently before adding to composite.",
    owner: "Tech Lead + ML Engineer",
    week: "Month 3–4",
    color: T.phase,
  },
  {
    name: "CI/CD Integration",
    detail: "Pre-merge gate via GitHub/GitLab webhook. Stories with composite < 50 block PR. Manual override requires Tech Lead approval + justification.",
    owner: "DevOps + Backend Engineer",
    week: "Month 3",
    color: T.phase,
  },
  {
    name: "Quarterly Correlation Report",
    detail: "Statistical analysis correlating eval scores with sprint outcomes (completion rate, defects, UAT pass). Drives quarterly rubric weight adjustments.",
    owner: "ML Engineer + QA Lead",
    week: "End of Q1",
    color: T.phase,
  },
  {
    name: "Multi-Tenant Platform",
    detail: "Eval framework deployable as a service for other product teams. Per-tenant rubric configs, isolated golden sets, shared judge infrastructure.",
    owner: "Platform Team",
    week: "Month 4–5",
    color: T.phase,
  },
  {
    name: "Production Observability Stack",
    detail: "Real-time monitoring: Kappa drift, score variance trends, golden set regression alerts, judge latency dashboards. PagerDuty integration for critical alerts.",
    owner: "SRE + ML Engineer",
    week: "Month 4",
    color: T.phase,
  },
];

const feedbackLoop = [
  { stage: "Stage 1", name: "Capture",        desc: "Every eval score logged with full context: artifact, source docs, scoring rationale, human overrides, sprint outcome later.", color: T.phase },
  { stage: "Stage 2", name: "Aggregate",      desc: "Quarterly: join eval scores with sprint outcomes (story completed on time? defects? UAT pass?). Build correlation table.", color: T.blue },
  { stage: "Stage 3", name: "Hypothesise",    desc: "Identify dimensions where score reliably predicts (or fails to predict) sprint success. Form hypotheses about weight adjustments.", color: T.green },
  { stage: "Stage 4", name: "Propose",        desc: "Generate proposed rubric changes: weight shifts, anchor refinements, new sub-metrics. Document each with evidence.", color: T.amber },
  { stage: "Stage 5", name: "Human Review",   desc: "QA Lead + Tech Lead + ML Engineer review proposals. Reject any change that lacks clear evidence. Accept narrowly scoped changes.", color: T.pink },
  { stage: "Stage 6", name: "Regression Test",desc: "Before deployment: re-run frozen golden set under proposed rubric. If any score drifts > 5 points unexpectedly, investigate.", color: T.red },
  { stage: "Stage 7", name: "Deploy + Watch", desc: "Roll out rubric change. Monitor Kappa, override rate, false-pass rate for 2 sprints. Rollback if any metric degrades.", color: T.phase },
];

const maturityGates = [
  {
    n: "M1",
    name: "Coverage Maturity",
    color: T.phase,
    criteria: "All 6 dimensions in production with Kappa > 0.60 each. No regression in original 3 dimensions after expansion.",
    blockingFor: "Marketing as 'complete' framework",
    failureMode: "If any new dim's Kappa is < 0.55, roll back that dimension. Better to ship 5 reliable dims than 6 unreliable ones.",
  },
  {
    n: "M2",
    name: "Enforcement Maturity",
    color: T.blue,
    criteria: "CI/CD gate active for 8+ weeks. Override rate < 5%. Zero rollbacks due to false positives.",
    blockingFor: "Cross-team rollout",
    failureMode: "If override rate > 10%, gate is too strict OR rubric needs work. Don't roll out across teams until override rate stabilises.",
  },
  {
    n: "M3",
    name: "Learning Maturity",
    color: T.green,
    criteria: "Quarterly correlation report produced and reviewed. At least 1 rubric weight change deployed and validated.",
    blockingFor: "Multi-tenant scaling",
    failureMode: "If correlation analysis shows no predictive power, eval framework may be measuring wrong things. Deep review required.",
  },
  {
    n: "M4",
    name: "Scale Maturity",
    color: T.amber,
    criteria: "Eval framework deployed in 3+ product teams. Per-tenant configs working. No infrastructure incidents in 30 days.",
    blockingFor: "Org-wide platform status",
    failureMode: "Scaling problems are operational, not framework problems. Slow expansion until infra is robust.",
  },
  {
    n: "M5",
    name: "Cultural Maturity",
    color: T.pink,
    criteria: "Eval scores referenced in 80%+ of sprint retrospectives. No documented anti-gaming behaviour. Authors discuss scores collaboratively.",
    blockingFor: "Framework retirement / replacement decisions",
    failureMode: "If gaming detected or cultural resistance grows, technical fixes won't solve it. Pause expansion, run user research.",
  },
];

const risks = [
  {
    risk: "New dimensions degrade composite score reliability",
    likelihood: "High",
    impact: "Critical",
    mitigation: "Each new dimension MUST be calibrated to Kappa > 0.60 before inclusion in composite. Add to composite only after 2 sprints of standalone stability. Resist the urge to ship all 3 new dims together.",
    color: T.red,
  },
  {
    risk: "CI/CD gate creates developer friction, eroding adoption",
    likelihood: "High",
    impact: "High",
    mitigation: "Soft launch — gate fires warnings for 4 weeks before becoming blocking. Emergency override path documented. Eng Manager monitors complaints weekly.",
    color: T.amber,
  },
  {
    risk: "Self-improving loop overfits to recent sprint outcomes",
    likelihood: "Medium",
    impact: "High",
    mitigation: "Use rolling 4-quarter window for correlation analysis. Require minimum 200 artifacts per quarter. Reject changes based on < 1 quarter of data.",
    color: T.amber,
  },
  {
    risk: "Multi-tenant config drift makes cross-team comparison impossible",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Org-wide baseline locked. Per-team overrides limited to ±20%. All cross-team reporting uses normalised scores.",
    color: T.amber,
  },
  {
    risk: "Production monitoring noise — too many alerts ignored",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Alert thresholds tuned conservatively. PagerDuty only for: Kappa drop > 0.1, golden set drift > 10 pts, pipeline failure. Everything else is dashboard-only.",
    color: T.blue,
  },
  {
    risk: "Framework becomes a maintenance burden no one wants to own",
    likelihood: "Medium",
    impact: "Critical",
    mitigation: "Phase 3 includes platform team handoff. Establish quarterly review cadence with named owner. If owner can't be found, freeze framework rather than let it decay.",
    color: T.red,
  },
];

export default function Phase3() {
  const [tab, setTab] = useState("overview");
  const [expandedDec, setExpandedDec] = useState(0);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Geist', system-ui, sans-serif", color: T.text, letterSpacing: "-0.005em" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        ::selection { background: ${T.phase}; color: ${T.bg}; }
        .tab-b { cursor: pointer; border: none; background: transparent; transition: all 0.15s; }
        .tab-b:hover { color: ${T.text} !important; }
        .hov { transition: all 0.15s; cursor: pointer; }
        .hov:hover { border-color: ${T.bright} !important; }
        code { font-family: 'JetBrains Mono', monospace; }
        h1, h2, h3 {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-optical-sizing: auto;
          font-variation-settings: "opsz" 96;
          letter-spacing: -0.03em;
        }
        h1 { font-variation-settings: "opsz" 144; letter-spacing: -0.04em; }
        h4, h5, h6 { font-family: 'Geist', system-ui, sans-serif; }
        em { color: ${T.amber}; font-style: italic; }
        strong { color: ${T.amber}; font-weight: 500; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "10px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.dim, textDecoration: "none" }}>Hub-Phase-Rollout.md</Link>
          <span style={{ color: T.muted }}>/</span>
          <span style={{ color: T.phase, fontWeight: 600 }}>Phase-3-Scale.md</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/03-phase-2-harden" style={{ color: T.amber, textDecoration: "none" }}>← Phase 2</Link>
          <Link to="/tutorials/05-comprehensive-recs" style={{ color: "#22D3EE", textDecoration: "none" }}>Comprehensive Recs →</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", padding: "36px 36px 32px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 15% 50%, ${T.phase}12 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, background: T.phaseDim, border: `2px solid ${T.phase}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: T.phase }}>03</span>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Phase 3 · Month 3+</div>
              <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Scale</h1>
            </div>
          </div>
          <p style={{ fontSize: 16, color: T.bright, maxWidth: 680, lineHeight: 1.6 }}>
            Expand only when Phase 2 is trusted and teams ask for more. Move from observation to enforcement. Add dimensions, CI/CD gates, feedback loops, and multi-tenant scale.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "0 36px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-b" onClick={() => setTab(t.id)}
              style={{ padding: "12px 18px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: tab === t.id ? T.phase : T.dim, borderBottom: `2px solid ${tab === t.id ? T.phase : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 36px" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <TabHead title="The Scaling Mandate" sub="What success looks like at the end of Phase 3" />

            <div style={{ background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Core Goal</div>
              <p style={{ fontSize: 17, color: T.text, lineHeight: 1.65 }}>
                Transform the eval framework from "useful tool" to "organisational quality infrastructure." Full coverage (6 dimensions), enforcement authority (CI/CD gates), continuous improvement (feedback loops), and multi-tenant scale.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                { label: "End-state",       desc: "Eval framework is org-wide infrastructure. 3+ teams active. CI/CD enforced. Self-improving via quarterly correlation analysis.", color: T.phase },
                { label: "Pace",            desc: "Slow and deliberate. Each expansion validated before next. No 'big bang' rollouts.", color: T.blue },
                { label: "Anti-goal",       desc: "Do NOT make eval scores part of performance reviews. Do NOT auto-mutate rubric in real-time. Do NOT skip calibration for any new dim.", color: T.red },
              ].map(s => (
                <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `2px solid ${s.color}`, borderRadius: 7, padding: 18 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.color, marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>Phase 3 Roadmap</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Quarter-by-Quarter Progression</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { week: "Month 3",   focus: "Dimension Expansion #1",   detail: "Add Business Value dimension. Calibrate independently. Validate Kappa > 0.60 before adding to composite.", color: T.phase },
                { week: "Month 4",   focus: "CI/CD Soft Launch",        detail: "Gate fires warnings only. Track override rate. Monitor developer sentiment. Tune thresholds.", color: T.blue },
                { week: "Month 5",   focus: "Dimension Expansion #2-3", detail: "Add Persona Accuracy and Completeness dimensions. One at a time. Each calibrated independently.", color: T.green },
                { week: "Month 6",   focus: "CI/CD Hard Launch",        detail: "Gate becomes blocking. Composite < 50 blocks merge. Manual override requires justification.", color: T.amber },
                { week: "Month 7+",  focus: "Multi-Tenant + Learning",  detail: "Onboard 2nd team. Run first quarterly correlation analysis. Deploy first rubric weight adjustment.", color: T.pink },
              ].map(w => (
                <div key={w.week} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${w.color}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "100px 200px 1fr", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: w.color, fontWeight: 600 }}>{w.week}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{w.focus}</span>
                  <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{w.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WHAT WE ADD */}
        {tab === "what" && (
          <div>
            <TabHead title="Phase 3 Additions" sub="8 capabilities added across months 3–7" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {whatWeBuild.map((b, i) => (
                <div key={b.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.phase}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr 140px", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: T.phase, fontWeight: 600, minWidth: 30 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{b.item}</div>
                    <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{b.why}</div>
                  </div>
                  <Chip label={b.category} color={T.phase} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PERMANENT EXCLUSIONS */}
        {tab === "what-not" && (
          <div>
            <TabHead title="Permanent Exclusions" sub="6 things we will NEVER add — and why these stay banned" />
            <div style={{ background: T.red + "10", border: `1px solid ${T.red}33`, borderRadius: 7, padding: 18, marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.red, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Why This List Matters</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                Phase 3 is when scope creep is most dangerous. Each of these has been requested in similar frameworks — and each has predictably damaged either trust, culture, or methodology. Codifying the exclusions prevents future regret.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {permanentExclusions.map(w => (
                <div key={w.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.red}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 130px", gap: 16, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{w.item}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>NEVER</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{w.reason}</div>
                  <Chip label={w.basis} color={T.red} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DECISIONS */}
        {tab === "decisions" && (
          <div>
            <TabHead title="Phase 3 Non-Negotiables" sub="7 strategic choices that govern Phase 3" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {decisions.map((d, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${d.color}`, borderRadius: 6, overflow: "hidden" }}>
                  <div className="hov" onClick={() => setExpandedDec(expandedDec === i ? null : i)}
                    style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 16, alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: d.color, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{d.title}</span>
                    <Chip label={d.impact} color={d.color} />
                    <span style={{ color: T.muted, fontSize: 12 }}>{expandedDec === i ? "▲" : "▼"}</span>
                  </div>
                  {expandedDec === i && (
                    <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${T.border}`, paddingTop: 14, background: T.s1 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: d.color, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Rationale</div>
                          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.65 }}>{d.rationale}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.amber, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Trade-off</div>
                          <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{d.tradeoff}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERABLES */}
        {tab === "deliverables" && (
          <div>
            <TabHead title="The 5 Phase 3 Artifacts" sub="What exists at the end of Phase 3" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {deliverables.map((d, i) => (
                <div key={i} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `3px solid ${d.color}`, borderRadius: 7, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: d.color, fontWeight: 600 }}>D{i + 1}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Chip label={d.owner} color={T.dim} />
                      <Chip label={d.week} color={d.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.65 }}>{d.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK LOOP */}
        {tab === "feedback" && (
          <div>
            <TabHead title="Self-Improving Feedback Loop" sub="7-stage quarterly cycle that powers continuous improvement" />
            <div style={{ background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 7, padding: 18, marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Principle</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                The eval framework doesn't get smarter by training the LLM — it gets smarter by adjusting which signals we weight. This loop runs quarterly. Anything more frequent reinforces bias; anything less frequent misses real shifts.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {feedbackLoop.map((s, i) => (
                <div key={s.stage} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.color, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {i < feedbackLoop.length - 1 && <div style={{ width: 1, flex: 1, background: T.border, margin: "3px 0" }} />}
                  </div>
                  <div className="hov" style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 18px", marginBottom: 4, display: "grid", gridTemplateColumns: "120px 130px 1fr", gap: 16, alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.color, fontWeight: 600 }}>{s.stage}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATURITY GATES */}
        {tab === "gates" && (
          <div>
            <TabHead title="Phase 3 Maturity Gates" sub="5 levels of maturity — each unlocks the next capability" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {maturityGates.map(g => (
                <div key={g.n} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 7, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${T.border}`, background: g.color + "0E" }}>
                    <div style={{ width: 36, height: 36, background: g.color + "22", border: `1px solid ${g.color}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: g.color, fontWeight: 700 }}>{g.n}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: g.color }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Blocking for: <span style={{ color: T.text }}>{g.blockingFor}</span></div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.green, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pass Criteria</div>
                      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.65 }}>{g.criteria}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.red, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>If Failed</div>
                      <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{g.failureMode}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISKS */}
        {tab === "risks" && (
          <div>
            <TabHead title="Phase 3 Risk Register" sub="6 systemic risks at scale — each can derail org-wide adoption" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {risks.map((r, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${r.color}`, borderRadius: 5, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.risk}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Chip label={`P: ${r.likelihood}`} color={r.likelihood === "High" ? T.red : T.amber} />
                      <Chip label={`I: ${r.impact}`} color={r.impact === "Critical" ? T.red : T.amber} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.65 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.phase, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 8 }}>Mitigation:</span>
                    {r.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background: T.s1, borderTop: `1px solid ${T.border}`, padding: "20px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>End of Phase Rollout</div>
            <div style={{ fontSize: 14, color: T.dim }}>For cross-phase reference, see <span style={{ color: "#22D3EE", fontWeight: 600 }}>Comprehensive-Recs.md</span></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/tutorials/03-phase-2-harden" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.amber, padding: "8px 14px", border: `1px solid ${T.amber}44`, borderRadius: 4, background: T.amber + "10", textDecoration: "none" }}>← Phase 2</Link>
            <Link to="/tutorials/05-comprehensive-recs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#22D3EE", padding: "8px 14px", border: `1px solid #22D3EE66`, borderRadius: 4, background: "#22D3EE10", textDecoration: "none" }}>Comprehensive Recs →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>{title}</h2>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim, marginTop: 5 }}>{sub}</p>
      <div style={{ width: 32, height: 2, background: T.phase, borderRadius: 1, marginTop: 10 }} />
    </div>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: "2px 8px", borderRadius: 3, background: color + "15", color, border: `1px solid ${color}30`, whiteSpace: "nowrap", fontWeight: 500 }}>
      {label}
    </span>
  );
}
