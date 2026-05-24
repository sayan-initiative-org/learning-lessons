import { useState } from "react";
import { Link } from "react-router-dom";

const T = {
  bg:       "#0A0E1A",
  s1:       "#0E1424",
  card:     "#131B2E",
  border:   "#1E2940",
  text:     "#E8EEF8",
  dim:      "#7A8BAD",
  muted:    "#3A4A6A",
  bright:   "#A8B9D8",

  accent:   "#22D3EE",     // cyan — comprehensive doc
  accentDim:"#22D3EE12",
  accentMid:"#22D3EE35",

  p1:       "#34D399",     // phase colors stay consistent across docs
  p2:       "#FBBF24",
  p3:       "#A78BFA",

  red:      "#F87171",
  amber:    "#FBBF24",
  pink:     "#F472B6",
  blue:     "#60A5FA",
};

const TABS = [
  { id: "philosophy",  label: "Philosophy" },
  { id: "dimensions",  label: "Dimensions Matrix" },
  { id: "metrics",     label: "Metrics Catalogue" },
  { id: "antipatterns",label: "Anti-Patterns" },
  { id: "matrix",      label: "Phase Recommendation Matrix" },
  { id: "tradeoffs",   label: "Cross-Phase Trade-offs" },
];

const philosophyTenets = [
  {
    n: "01",
    title: "Rules before LLM",
    detail: "Deterministic checks catch the dumb stuff for free. Save LLM tokens for genuine semantic evaluation. A story with no acceptance criteria doesn't need an LLM to fail it.",
    appliesAt: ["Phase 1", "Phase 2", "Phase 3"],
    color: T.p1,
  },
  {
    n: "02",
    title: "Calibrate, don't decree",
    detail: "Eval scores must agree with humans before they have any authority. Cohen's Kappa > 0.60 isn't a vanity metric — it's evidence of trust.",
    appliesAt: ["Phase 2", "Phase 3"],
    color: T.p2,
  },
  {
    n: "03",
    title: "Authority follows trust",
    detail: "Block deploys only when teams trust the judge. Premature enforcement destroys adoption. Phase 1 observes, Phase 2 informs, Phase 3 enforces.",
    appliesAt: ["Phase 3"],
    color: T.p3,
  },
  {
    n: "04",
    title: "Ship the simplest thing that learns",
    detail: "Phase 1 isn't a small Phase 3. It's the minimum viable surface to learn what users actually need. Premature features are buried features.",
    appliesAt: ["Phase 1"],
    color: T.p1,
  },
  {
    n: "05",
    title: "Aggregate over individual",
    detail: "Sprint-level scoring drives systemic improvement. Per-author scoring drives gaming. Always report at the right level of abstraction.",
    appliesAt: ["Phase 2", "Phase 3"],
    color: T.p2,
  },
  {
    n: "06",
    title: "Bounded customisation",
    detail: "Org-wide baseline locked. Per-team overrides limited to ±20%. Customisation is valuable; fragmentation is not.",
    appliesAt: ["Phase 3"],
    color: T.p3,
  },
];

const dimensionMatrix = [
  {
    dim: "INVEST Compliance",
    weight_p1: "40%",
    weight_p2: "40%",
    weight_p3: "30%",
    evaluator: "Hybrid (Rule + LLM)",
    when: "Phase 1+",
    color: T.p1,
    notes: "Core proxy for story quality. Most failures show up here first. Weight reduced in P3 only because new dims absorb some signal.",
  },
  {
    dim: "AC Quality",
    weight_p1: "35%",
    weight_p2: "35%",
    weight_p3: "25%",
    evaluator: "LLM (G-Eval)",
    when: "Phase 1+",
    color: T.p1,
    notes: "Second-highest failure mode. ACs are the bridge to test cases. Critical for downstream work.",
  },
  {
    dim: "Context Adherence",
    weight_p1: "25%",
    weight_p2: "25%",
    weight_p3: "20%",
    evaluator: "RAG (RAGAS)",
    when: "Phase 1+",
    color: T.p1,
    notes: "Catches AI hallucinations against source docs. Unique to AI-generated artifacts — non-negotiable.",
  },
  {
    dim: "Business Value Clarity",
    weight_p1: "—",
    weight_p2: "—",
    weight_p3: "10%",
    evaluator: "LLM (G-Eval)",
    when: "Phase 3",
    color: T.p3,
    notes: "Was inside INVEST 'Valuable' in P1+2. Extracted as separate dim only when correlation data shows it adds predictive power.",
  },
  {
    dim: "Persona Accuracy",
    weight_p1: "—",
    weight_p2: "—",
    weight_p3: "10%",
    evaluator: "Rule + LLM",
    when: "Phase 3",
    color: T.p3,
    notes: "Format check done by rule engine in P1. Semantic check added in P3 only when justified.",
  },
  {
    dim: "Completeness & Coverage",
    weight_p1: "—",
    weight_p2: "—",
    weight_p3: "5%",
    evaluator: "LLM (Epic-level)",
    when: "Phase 3 (opt-in)",
    color: T.p3,
    notes: "Most expensive dim — requires epic context. Opt-in per epic, not universal. Low weight reflects narrow applicability.",
  },
];

const metricsCatalogue = [
  // Phase 1
  { phase: "P1", phaseColor: T.p1, metric: "composite_score", purpose: "Single headline score 0–100", target: "Range visible across grade bands" },
  { phase: "P1", phaseColor: T.p1, metric: "grade (A/B/C/D)", purpose: "Human-readable verdict", target: "Distribution roughly bell-shaped" },
  { phase: "P1", phaseColor: T.p1, metric: "hard_fail_flags", purpose: "Rule violations (binary)", target: "Surface immediately, no LLM needed" },
  { phase: "P1", phaseColor: T.p1, metric: "top_issue", purpose: "Single actionable fix per artifact", target: "1 sentence, specific" },
  { phase: "P1", phaseColor: T.p1, metric: "eval_latency_ms", purpose: "Operational health", target: "P95 < 8s" },
  { phase: "P1", phaseColor: T.p1, metric: "ragas_faithfulness", purpose: "Hallucination signal", target: "> 0.75 mean" },
  // Phase 2
  { phase: "P2", phaseColor: T.p2, metric: "cohens_kappa", purpose: "Inter-rater agreement (LLM vs Human)", target: "> 0.60" },
  { phase: "P2", phaseColor: T.p2, metric: "mae_per_dimension", purpose: "Mean absolute error vs human", target: "< 0.5" },
  { phase: "P2", phaseColor: T.p2, metric: "false_pass_rate", purpose: "% bad stories scored ≥ 70", target: "< 3%" },
  { phase: "P2", phaseColor: T.p2, metric: "false_fail_rate", purpose: "% good stories scored < 70", target: "< 5%" },
  { phase: "P2", phaseColor: T.p2, metric: "score_variance_2pass", purpose: "Stability check on borderline scores", target: "< 0.6" },
  { phase: "P2", phaseColor: T.p2, metric: "override_rate", purpose: "% scores overridden by humans", target: "< 20%" },
  { phase: "P2", phaseColor: T.p2, metric: "sprint_avg_composite", purpose: "Sprint-level quality trend", target: "Stable or improving" },
  { phase: "P2", phaseColor: T.p2, metric: "ragas_context_precision", purpose: "Retrieval quality", target: "> 0.70" },
  // Phase 3
  { phase: "P3", phaseColor: T.p3, metric: "outcome_correlation", purpose: "Eval score vs sprint outcome correlation", target: "Significant positive correlation per dim" },
  { phase: "P3", phaseColor: T.p3, metric: "ci_block_rate", purpose: "% PRs blocked by CI gate", target: "< 10%, stable" },
  { phase: "P3", phaseColor: T.p3, metric: "ci_override_rate", purpose: "% blocks overridden", target: "< 5%" },
  { phase: "P3", phaseColor: T.p3, metric: "model_upgrade_kappa_delta", purpose: "Kappa change when LLM model upgraded", target: "Absolute delta < 0.05" },
  { phase: "P3", phaseColor: T.p3, metric: "cross_tenant_score_normalisation", purpose: "Comparable scores across teams", target: "Normalised distributions overlap" },
  { phase: "P3", phaseColor: T.p3, metric: "golden_set_drift", purpose: "Composite drift on frozen set", target: "< 5 pts" },
];

const antipatterns = [
  {
    title: "Premature optimisation of the judge",
    desc: "Spending Phase 1 perfecting the LLM prompt before validating that the framework produces useful signal at all.",
    symptom: "Week 2 and still tuning prompts. No real artifacts scored yet.",
    fix: "Set time-box. Ship the rough version on real data. Tune from real disagreements, not imagined ones.",
    severity: "High",
    color: T.red,
  },
  {
    title: "Vanity dashboards",
    desc: "Building beautiful dashboards before scores are trusted. Visualisation creates illusion of value where none exists.",
    symptom: "Stakeholders praise the dashboard. Nobody acts on the data.",
    fix: "Defer dashboards until Phase 2. Use SQL queries in Phase 1. Build dashboard only after you know what stakeholders ask for.",
    severity: "Medium",
    color: T.amber,
  },
  {
    title: "Kappa theatre",
    desc: "Computing Cohen's Kappa on insufficient data and treating the number as meaningful. Kappa needs 50+ dual-scored examples.",
    symptom: "κ = 0.58 reported on 12 examples. Decision made based on it.",
    fix: "Don't compute Kappa until 50 real artifacts dual-scored. Report confidence intervals if sample size < 100.",
    severity: "High",
    color: T.red,
  },
  {
    title: "Score gaming",
    desc: "Story authors learn to write for the rubric, not for clarity. Surface features rewarded; substance ignored.",
    symptom: "Scores rising while sprint quality unchanged. Stories look formulaic.",
    fix: "Audit a sample. Rewrite rubric anchors to focus on behaviour, not surface markers. Never expose individual scores publicly.",
    severity: "Critical",
    color: T.red,
  },
  {
    title: "Auto-tuning the rubric from overrides",
    desc: "Letting human override patterns automatically update LLM prompts or weights. Creates feedback loops that overfit to recent reviewers.",
    symptom: "Scores shift weekly. Rubric file changed 10 times in a month.",
    fix: "Quarterly review cadence. Overrides log to a database, are analysed batch, and proposed changes go through human review.",
    severity: "High",
    color: T.red,
  },
  {
    title: "All-dimensions-at-once expansion",
    desc: "In Phase 3, adding 3 new dimensions simultaneously. Each lacks individual calibration. Composite score becomes noisy.",
    symptom: "Composite scores drop or become erratic after Phase 3 launch.",
    fix: "Add one dimension at a time. Calibrate independently. Validate Kappa > 0.60 standalone before adding to composite.",
    severity: "High",
    color: T.red,
  },
  {
    title: "Eval scores in performance reviews",
    desc: "Treating eval scores as developer performance indicators. Permanent ban — destroys trust and creates perverse incentives.",
    symptom: "Manager references story scores in 1:1. Author defensiveness rises.",
    fix: "Codify in framework charter. Sprint-level aggregates only. Never per-author breakdowns.",
    severity: "Critical",
    color: T.red,
  },
  {
    title: "Eval as the gate, not the signal",
    desc: "Treating evaluation as a blocking gate when it should be informative. Removes human judgment from final acceptance.",
    symptom: "Stories rejected for low score even when reviewer would accept them. Override fatigue grows.",
    fix: "Even in Phase 3, manual override exists with low friction. Eval informs decisions; humans make them.",
    severity: "Medium",
    color: T.amber,
  },
];

const phaseRecMatrix = [
  { area: "Number of dimensions",     p1: "3 (INVEST + AC + Context)",    p2: "3 (calibrated)",               p3: "Up to 6 (each calibrated)" },
  { area: "LLM passes per artifact",  p1: "1 (temperature=0)",            p2: "1 + 2-pass on borderlines",     p3: "1 + 2-pass on borderlines" },
  { area: "Golden set size",          p1: "20",                            p2: "50",                            p3: "100+" },
  { area: "Negative examples",        p1: "15",                            p2: "25",                            p3: "40+" },
  { area: "Cohen's Kappa target",     p1: "Not measured",                  p2: "> 0.60 (gate)",                 p3: "> 0.65 (continuous)" },
  { area: "Output format",            p1: "JSON API only",                 p2: "JSON + sprint dashboard",       p3: "JSON + dashboard + CI integration" },
  { area: "Human override",           p1: "Not implemented",               p2: "Logged, batch analysed",        p3: "Quarterly rubric input" },
  { area: "Enforcement",              p1: "Observation only",              p2: "Slack notification on fail",    p3: "CI/CD blocking gate" },
  { area: "Monitoring",               p1: "Postgres logs + SQL",           p2: "Sprint dashboard",              p3: "Real-time observability stack" },
  { area: "Adoption breadth",         p1: "1 team (pilot)",                p2: "2 teams",                       p3: "3+ teams (multi-tenant)" },
  { area: "Cost per artifact",        p1: "~$0.01–0.03",                   p2: "~$0.03–0.06",                   p3: "~$0.08–0.15" },
  { area: "Latency P95",              p1: "< 5s",                          p2: "< 8s",                          p3: "< 12s" },
  { area: "Self-improvement",         p1: "Manual rubric edits",           p2: "Manual + override-informed",    p3: "Quarterly correlation analysis" },
];

const crossPhaseTradeoffs = [
  {
    title: "Speed of ship vs depth of evaluation",
    summary: "Each phase trades evaluation depth for faster validation cycles. Phase 1 ships in 3 weeks at 3 dimensions. Phase 3 reaches 6 dimensions over months.",
    p1: "Optimised for speed — minimum viable judge",
    p2: "Optimised for trust — calibrated metrics",
    p3: "Optimised for coverage — full framework",
    color: T.accent,
  },
  {
    title: "Centralisation vs customisation",
    summary: "Phase 1 has zero customisation (one rubric for everyone). Phase 3 introduces per-team overrides — bounded to ±20% of baseline.",
    p1: "Single org-wide rubric",
    p2: "Single rubric + override logging",
    p3: "Org baseline + bounded team customisation",
    color: T.p2,
  },
  {
    title: "Observation vs enforcement",
    summary: "Authority earned, not granted. Phase 1 observes silently. Phase 2 informs via notifications. Phase 3 enforces via CI/CD gates.",
    p1: "Observe — logs and reports only",
    p2: "Inform — Slack notifications on failure",
    p3: "Enforce — CI/CD gate blocks bad merges",
    color: T.p3,
  },
  {
    title: "Cost vs comprehensiveness",
    summary: "Per-artifact cost grows ~5× from Phase 1 to Phase 3 (more dimensions, 2-pass on borderlines, additional RAGAS metrics, monitoring overhead).",
    p1: "~$0.01–0.03 — bare essentials",
    p2: "~$0.03–0.06 — added context_precision + variance check",
    p3: "~$0.08–0.15 — full coverage + monitoring",
    color: T.amber,
  },
  {
    title: "Manual rubric tuning vs data-driven adjustment",
    summary: "Phase 1+2 rely on human judgment for rubric edits. Phase 3 introduces data-driven weight adjustment via quarterly correlation analysis.",
    p1: "Manual — anchor edits based on intuition",
    p2: "Manual — anchor edits based on disagreement patterns",
    p3: "Data-driven — weight adjustment from outcome correlation",
    color: T.blue,
  },
  {
    title: "Single tenant vs multi-tenant",
    summary: "Phase 1 is single-team. Phase 2 adds a second team for cross-validation. Phase 3 makes it a platform with isolated tenants and shared infrastructure.",
    p1: "1 team — your team",
    p2: "2 teams — pilot + 1 other",
    p3: "3+ teams — multi-tenant platform",
    color: T.pink,
  },
];

export default function Comprehensive() {
  const [tab, setTab] = useState("philosophy");

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.muted}; }
        .tab-b { cursor: pointer; border: none; background: transparent; transition: all 0.15s; }
        .tab-b:hover { color: ${T.text} !important; }
        .hov { transition: all 0.15s; cursor: pointer; }
        .hov:hover { border-color: ${T.bright} !important; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "10px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.dim, textDecoration: "none" }}>Hub-Phase-Rollout.md</Link>
          <span style={{ color: T.muted }}>/</span>
          <span style={{ color: T.accent, fontWeight: 600 }}>Comprehensive-Recs.md</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.dim, textDecoration: "none" }}>← Hub</Link>
          <Link to="/tutorials/02-phase-1-validate" style={{ color: T.p1, textDecoration: "none" }}>Phase 1 ·</Link>
          <Link to="/tutorials/03-phase-2-harden" style={{ color: T.p2, textDecoration: "none" }}>Phase 2 ·</Link>
          <Link to="/tutorials/04-phase-3-scale" style={{ color: T.p3, textDecoration: "none" }}>Phase 3</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", padding: "36px 36px 32px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${T.accent}10 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Cross-Phase Reference</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
            Comprehensive<br />
            <span style={{ color: T.accent }}>Recommendations</span>
          </h1>
          <p style={{ fontSize: 16, color: T.bright, maxWidth: 700, lineHeight: 1.65 }}>
            The companion reference to the phased rollout. Philosophy, dimensions matrix, metrics catalogue, anti-patterns, and cross-phase trade-offs in one place — for when you need the full picture across all three phases.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "0 36px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-b" onClick={() => setTab(t.id)}
              style={{ padding: "12px 18px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: tab === t.id ? T.accent : T.dim, borderBottom: `2px solid ${tab === t.id ? T.accent : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 36px" }}>

        {/* PHILOSOPHY */}
        {tab === "philosophy" && (
          <div>
            <TabHead title="Foundational Philosophy" sub="6 tenets that govern every phase decision" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {philosophyTenets.map(t_ => (
                <div key={t_.n} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${t_.color}`, borderRadius: 6, padding: 20, display: "grid", gridTemplateColumns: "60px 1fr 180px", gap: 18, alignItems: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: t_.color }}>{t_.n}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>{t_.title}</div>
                    <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{t_.detail}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {t_.appliesAt.map(p => (
                      <Chip key={p} label={p} color={p === "Phase 1" ? T.p1 : p === "Phase 2" ? T.p2 : T.p3} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIMENSIONS */}
        {tab === "dimensions" && (
          <div>
            <TabHead title="Dimensions Across All Phases" sub="6 dimensions, their weights per phase, and when they're introduced" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                <thead>
                  <tr style={{ background: T.s1, borderBottom: `1px solid ${T.border}` }}>
                    {["Dimension", "P1 Weight", "P2 Weight", "P3 Weight", "Evaluator", "Introduced", "Notes"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.dim, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dimensionMatrix.map((d, i) => (
                    <tr key={d.dim} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.card : T.bg }}>
                      <td style={{ padding: "14px", fontSize: 13, fontWeight: 600, color: d.color, borderLeft: `3px solid ${d.color}` }}>{d.dim}</td>
                      <td style={{ padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: d.weight_p1 === "—" ? T.muted : T.p1 }}>{d.weight_p1}</td>
                      <td style={{ padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: d.weight_p2 === "—" ? T.muted : T.p2 }}>{d.weight_p2}</td>
                      <td style={{ padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: d.weight_p3 === "—" ? T.muted : T.p3 }}>{d.weight_p3}</td>
                      <td style={{ padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.dim }}>{d.evaluator}</td>
                      <td style={{ padding: "14px" }}><Chip label={d.when} color={d.color} /></td>
                      <td style={{ padding: "14px", fontSize: 11, color: T.dim, maxWidth: 280, lineHeight: 1.55 }}>{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 20, background: T.accentDim, border: `1px solid ${T.accentMid}`, borderRadius: 6, padding: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Weight Math</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                Phase 1+2 use 3 dimensions summing to 100%. Phase 3 introduces 3 more — original 3 dims drop in weight as new ones absorb signal. Total always sums to 100%. Weights are starting points; quarterly correlation analysis in Phase 3 adjusts based on predictive power.
              </div>
            </div>
          </div>
        )}

        {/* METRICS */}
        {tab === "metrics" && (
          <div>
            <TabHead title="Complete Metrics Catalogue" sub="20 metrics organised by phase introduction" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "60px 240px 1fr 200px", gap: 12, padding: "6px 14px" }}>
                {["Phase", "Metric", "Purpose", "Target"].map(h => (
                  <div key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>{h}</div>
                ))}
              </div>
              {metricsCatalogue.map((m, i) => (
                <div key={m.metric} className="hov" style={{ background: i % 2 === 0 ? T.card : T.s1, border: `1px solid ${T.border}`, borderRadius: 5, padding: "10px 14px", display: "grid", gridTemplateColumns: "60px 240px 1fr 200px", gap: 12, alignItems: "center" }}>
                  <Chip label={m.phase} color={m.phaseColor} />
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: m.phaseColor }}>{m.metric}</code>
                  <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{m.purpose}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.text }}>{m.target}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANTI-PATTERNS */}
        {tab === "antipatterns" && (
          <div>
            <TabHead title="Anti-Patterns Library" sub="8 failure modes documented — recognise early, avoid always" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {antipatterns.map((a, i) => (
                <div key={a.title} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${a.color}`, borderRadius: 6, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{i + 1}. {a.title}</span>
                    <Chip label={a.severity} color={a.color} />
                  </div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65, marginBottom: 12 }}>{a.desc}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: T.s1, borderRadius: 5, padding: "10px 14px" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.red, marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Symptom</div>
                      <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{a.symptom}</div>
                    </div>
                    <div style={{ background: T.s1, borderRadius: 5, padding: "10px 14px" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.p1, marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Fix</div>
                      <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{a.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHASE MATRIX */}
        {tab === "matrix" && (
          <div>
            <TabHead title="Phase Recommendation Matrix" sub="Side-by-side comparison of recommendations across all 3 phases" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                <thead>
                  <tr style={{ background: T.s1, borderBottom: `1px solid ${T.border}` }}>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.dim, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Area</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.p1, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Phase 1 · Validate</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.p2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Phase 2 · Harden</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.p3, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Phase 3 · Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseRecMatrix.map((r, i) => (
                    <tr key={r.area} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.card : T.s1 }}>
                      <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: T.text }}>{r.area}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{r.p1}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{r.p2}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{r.p3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRADE-OFFS */}
        {tab === "tradeoffs" && (
          <div>
            <TabHead title="Cross-Phase Trade-offs" sub="6 strategic dimensions where each phase makes deliberate trade-offs" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {crossPhaseTradeoffs.map((t_, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `3px solid ${t_.color}`, borderRadius: 6, padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t_.color, marginBottom: 8 }}>{t_.title}</div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65, marginBottom: 14 }}>{t_.summary}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[[T.p1, "P1", t_.p1], [T.p2, "P2", t_.p2], [T.p3, "P3", t_.p3]].map(([col, lbl, txt]) => (
                      <div key={lbl} style={{ background: T.s1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${col}`, borderRadius: 5, padding: "10px 12px" }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: col, marginBottom: 4, letterSpacing: "0.1em" }}>{lbl}</div>
                        <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{txt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background: T.s1, borderTop: `1px solid ${T.border}`, padding: "20px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Cross-Phase Reference</div>
            <div style={{ fontSize: 13, color: T.dim }}>Navigate to phase deep-dives for execution detail</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/tutorials/01-hub-phase-rollout" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.dim, padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: 4, textDecoration: "none" }}>← Hub</Link>
            <Link to="/tutorials/02-phase-1-validate" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.p1, padding: "8px 14px", border: `1px solid ${T.p1}44`, borderRadius: 4, background: T.p1 + "10", textDecoration: "none" }}>Phase 1</Link>
            <Link to="/tutorials/03-phase-2-harden" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.p2, padding: "8px 14px", border: `1px solid ${T.p2}44`, borderRadius: 4, background: T.p2 + "10", textDecoration: "none" }}>Phase 2</Link>
            <Link to="/tutorials/04-phase-3-scale" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.p3, padding: "8px 14px", border: `1px solid ${T.p3}44`, borderRadius: 4, background: T.p3 + "10", textDecoration: "none" }}>Phase 3</Link>
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
      <div style={{ width: 32, height: 2, background: T.accent, borderRadius: 1, marginTop: 10 }} />
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
