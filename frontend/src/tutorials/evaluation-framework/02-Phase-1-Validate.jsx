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

  phase:    "#34D399",    // emerald — Phase 1 signature
  phaseDim: "#34D39912",
  phaseMid: "#34D39935",
  red:      "#F87171",
  amber:    "#FBBF24",
  blue:     "#60A5FA",
  violet:   "#A78BFA",
};

const TABS = [
  { id: "overview", label: "Overview & Goal" },
  { id: "what",     label: "What We Build" },
  { id: "what-not", label: "What We Don't Build" },
  { id: "decisions", label: "Key Decisions" },
  { id: "deliverables", label: "Deliverables" },
  { id: "gates",    label: "Exit Gates" },
  { id: "risks",    label: "Risks & Mitigations" },
];

const whatWeBuild = [
  { item: "Rule Engine (Pytest)",  why: "Free, deterministic, catches 30–40% of bad artifacts before any LLM call. Lowest risk first.", category: "Engine" },
  { item: "DeepEval G-Eval on 3 dimensions",  why: "INVEST + AC Quality + Context Adherence. Cover the dominant failure modes without scope creep.", category: "Engine" },
  { item: "RAGAS Faithfulness (single metric)", why: "One cheap signal for hallucination. Avoid the full RAGAS suite until Phase 2.", category: "Engine" },
  { item: "Postgres score log",  why: "Structured persistence. Anything fancier (dashboards, monitoring) blocks shipping.", category: "Storage" },
  { item: "20 golden examples (human-scored)", why: "Just enough to calibrate rubric anchors. Growing organically is more honest than guessing at 100.", category: "Data" },
  { item: "Rubric YAML (3 dimensions)", why: "Version-controlled, single source of truth. Changeable without redeploying code.", category: "Data" },
  { item: "Negative example library (15 anti-patterns)", why: "Used as few-shot negatives in prompts AND as regression fixtures.", category: "Data" },
  { item: "JSON eval report API", why: "No UI yet. Consumers (other agents, dashboards) integrate via JSON. Build UI in Phase 2 when consumers know what they need.", category: "API" },
];

const whatNot = [
  { item: "Multi-pass LLM averaging (3× pass)", reason: "Temperature=0 is stable enough at this scale. 3× cost for <5% accuracy improvement.", phase: "Skip entirely" },
  { item: "Cohen's Kappa calibration", reason: "Needs 50 real artifacts to compute meaningfully. Compute it in Phase 2, after you have signal.", phase: "Phase 2" },
  { item: "TruLens / observability stack", reason: "Postgres + a SQL query gives 90% of the value. Don't import a framework you'll spend a week configuring.", phase: "Phase 3" },
  { item: "Trend dashboard / visualization", reason: "Build dashboards after you know what stakeholders actually want to see. Premature visualization = wasted Phase 1.", phase: "Phase 2" },
  { item: "Human review override workflow", reason: "Phase 1 is read-only. Adding write-back to rubric creates calibration noise before baseline is set.", phase: "Phase 2" },
  { item: "CI/CD blocking gate", reason: "Don't block deploys with an uncalibrated judge. Block only when trusted.", phase: "Phase 3" },
  { item: "All 6 evaluation dimensions", reason: "Business Value & Persona are inside INVEST. Completeness needs epic-level context. Defer all three.", phase: "Phase 3 (optional)" },
  { item: "Adversarial red-teaming (Giskard)", reason: "Red-team after shipping. Hardening an unshipped product is the definition of premature optimization.", phase: "Defer indefinitely" },
];

const decisions = [
  {
    title: "Temperature = 0 on all judge LLM calls",
    rationale: "Reproducibility outweighs creativity for evaluation. Variance in scoring is a reliability problem, not a feature.",
    tradeoff: "Slightly more deterministic, less creative justifications — acceptable.",
    impact: "Critical",
    color: T.phase,
  },
  {
    title: "Single LLM pass per dimension (not 3x averaging)",
    rationale: "Cost discipline. At Phase 1 scale, variance reduction doesn't justify 3× spend. Reassess in Phase 2 only if score_variance > 0.7.",
    tradeoff: "±0.3–0.5 score variance on borderline cases. Mitigated by good rubric anchors.",
    impact: "Cost-Critical",
    color: T.amber,
  },
  {
    title: "Score anchors defined behaviourally, not adjectivally",
    rationale: "Replacing 'good ACs' with 'all 4 ACs use Given/When/Then or include measurable thresholds' cuts judge variance by ~40%.",
    tradeoff: "Rubric files are longer, but evaluator behavior is dramatically more stable.",
    impact: "Quality-Critical",
    color: T.phase,
  },
  {
    title: "Hard fails skip LLM entirely (rule layer short-circuit)",
    rationale: "Story with no AC has composite=0. Don't waste tokens explaining the obvious. Saves 30–40% of LLM costs.",
    tradeoff: "Need to maintain a small list of hard-fail rules. Worth it.",
    impact: "Cost + Latency",
    color: T.blue,
  },
  {
    title: "20 golden examples to start (not 100)",
    rationale: "You don't know what real SDLC Copilot output looks like yet. 20 is enough to calibrate; growing on real data is more honest than imagining failure modes.",
    tradeoff: "Less statistical power early. Mitigated by aggressive iteration cycle in weeks 2–3.",
    impact: "Calibration",
    color: T.violet,
  },
  {
    title: "JSON output only — no UI in Phase 1",
    rationale: "Stakeholders don't know what visualizations they need until they've seen scores in context. Premature UI is wasted UI.",
    tradeoff: "Less immediate stakeholder demo appeal. Compensated by faster iteration cycle.",
    impact: "Strategic",
    color: T.dim,
  },
];

const deliverables = [
  {
    name: "Rubric YAML files",
    detail: "Three files: invest.yaml, ac_quality.yaml, context_adherence.yaml. Each defines criteria, score anchors (1–5), evaluator type (rule/llm/rag), weight, and hard-fail conditions.",
    owner: "Tech Lead",
    week: "Week 1",
    color: T.phase,
  },
  {
    name: "Golden Dataset v1",
    detail: "20 user stories with human-assigned scores per dimension. Range across grade bands (5 Excellent, 8 Good, 5 Needs Work, 2 Poor) for calibration coverage.",
    owner: "BA + QA Lead",
    week: "Week 1",
    color: T.phase,
  },
  {
    name: "Evaluation Pipeline (Pytest+DeepEval+RAGAS)",
    detail: "Single Python service exposing POST /evaluate endpoint. Takes artifact + context, returns JSON report with composite score, per-dimension scores, top issue, improvements.",
    owner: "ML Engineer",
    week: "Week 2",
    color: T.phase,
  },
  {
    name: "Score persistence + query layer",
    detail: "Postgres schema for eval_reports table. SQL views for sprint averages, per-dimension trends. Read-only — no admin UI required.",
    owner: "Backend Engineer",
    week: "Week 3",
    color: T.phase,
  },
];

const exitGates = [
  {
    n: "G1",
    name: "Calibration Gate",
    color: T.phase,
    criteria: "All 20 golden examples scored by pipeline. LLM judge scores within ±1 point of human ground truth on 85%+ of examples.",
    blockingFor: "Phase 1 internal release",
    failureMode: "If MAE > 1.0, rewrite rubric anchors and re-test. Do not skip this.",
  },
  {
    n: "G2",
    name: "Real-Signal Gate",
    color: T.blue,
    criteria: "Pipeline run on 30+ real SDLC Copilot generations. Human spot-check confirms scores 'feel right' to reviewers.",
    blockingFor: "Phase 1 → Phase 2 transition",
    failureMode: "If reviewers consistently disagree, rubric is the problem — not the LLM. Recalibrate before adding more dimensions.",
  },
  {
    n: "G3",
    name: "Operational Gate",
    color: T.violet,
    criteria: "P95 latency < 8s. Cost per eval < $0.06. Zero pipeline failures in last 100 runs.",
    blockingFor: "Internal team self-service usage",
    failureMode: "If latency or cost exceeds bounds, profile before scaling. Common cause: RAGAS context retrieval misconfiguration.",
  },
];

const risks = [
  {
    risk: "Rubric anchors too vague — high judge variance",
    likelihood: "High",
    impact: "Critical",
    mitigation: "Behavioural anchors mandatory. Each score level (1–5) must reference observable artifact features, not adjectives. Validate via 3-pass variance test on 5 examples.",
    color: T.red,
  },
  {
    risk: "Golden dataset biased toward 'good' examples",
    likelihood: "Medium",
    impact: "High",
    mitigation: "Mandatory distribution: 5 Excellent, 8 Good, 5 Needs Work, 2 Poor. Source from real SDLC Copilot output — including known bad generations.",
    color: T.amber,
  },
  {
    risk: "RAGAS context retrieval returns irrelevant chunks",
    likelihood: "Medium",
    impact: "Medium",
    mitigation: "Validate retrieval separately before evaluation. If context_precision < 0.6, fix retrieval first — don't blame the judge.",
    color: T.amber,
  },
  {
    risk: "Stakeholders demand UI / dashboard before Phase 2",
    likelihood: "Medium",
    impact: "Schedule",
    mitigation: "Communicate the staging philosophy. Show JSON output + SQL queries as 'minimum viable observability'. Plan UI in Phase 2 brief.",
    color: T.blue,
  },
  {
    risk: "Score regression after rubric edits",
    likelihood: "High",
    impact: "Quality",
    mitigation: "Every rubric change re-runs golden dataset. If any score drifts > 5 points, treat as regression. Version-control all rubric files.",
    color: T.red,
  },
  {
    risk: "False sense of confidence from happy-path golden set",
    likelihood: "High",
    impact: "Critical",
    mitigation: "Negative example library is mandatory. 15 anti-patterns from real failed generations. Used both in prompts (few-shot) and as regression fixtures.",
    color: T.red,
  },
];

export default function Phase1() {
  const [tab, setTab] = useState("overview");
  const [expandedDec, setExpandedDec] = useState(0);

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
        code { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* ── Breadcrumb / nav ── */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "10px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.dim, textDecoration: "none" }}>Hub-Phase-Rollout.md</Link>
          <span style={{ color: T.muted }}>/</span>
          <span style={{ color: T.phase, fontWeight: 600 }}>Phase-1-Validate.md</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.muted, textDecoration: "none" }}>← Hub</Link>
          <Link to="/tutorials/03-phase-2-harden" style={{ color: T.amber, textDecoration: "none" }}>Phase 2 →</Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "36px 36px 32px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 15% 50%, ${T.phase}12 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, background: T.phaseDim, border: `2px solid ${T.phase}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: T.phase }}>01</span>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Phase 1 · Weeks 1–3</div>
              <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Validate</h1>
            </div>
          </div>
          <p style={{ fontSize: 16, color: T.bright, maxWidth: 680, lineHeight: 1.6, fontWeight: 400 }}>
            Prove the evaluation loop works on real SDLC Copilot artifacts. Ship the minimum viable judge, calibrate against a small golden set, validate it produces signal that humans agree with.
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
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

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <TabHead title="The Validation Mandate" sub="What success looks like by end of Week 3" />

            {/* Goal banner */}
            <div style={{ background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Core Goal</div>
              <p style={{ fontSize: 17, color: T.text, lineHeight: 1.65, fontWeight: 400 }}>
                Ship an evaluation pipeline that produces scores humans agree with — on 30 real SDLC Copilot artifacts — within 3 weeks. Nothing else matters in Phase 1.
              </p>
            </div>

            {/* Success criteria */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                { label: "By end of Week 3", desc: "Pipeline running on 30+ real artifacts. Human reviewers agree with scores 'most of the time'.", color: T.phase },
                { label: "Stakeholder reaction", desc: "QA Lead and BA Lead see the JSON reports and say: 'This catches issues we'd flag.'", color: T.blue },
                { label: "Anti-goal", desc: "Do NOT aim for statistical validation (Kappa, MAE benchmarks) in Phase 1. That's Phase 2 work.", color: T.red },
              ].map(s => (
                <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `2px solid ${s.color}`, borderRadius: 7, padding: 18 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.color, marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Philosophy */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>Phase 1 Philosophy</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>The 3-Week Discipline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { week: "Week 1", focus: "Foundation",   detail: "Rubric YAML files complete. Golden dataset v1 (20 examples) finalised. Pipeline scaffold compiles and runs end-to-end on 1 example.", color: T.phase },
                { week: "Week 2", focus: "Integration",  detail: "Full pipeline running on all 20 golden examples. LLM judge calibrated (MAE < 1.0). Rule engine catches all 15 anti-patterns.", color: T.blue },
                { week: "Week 3", focus: "Validation",   detail: "Pipeline run on 30+ real SDLC Copilot generations. Human spot-check completed. Internal demo to QA + BA + Tech Lead.", color: T.violet },
              ].map(w => (
                <div key={w.week} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${w.color}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "100px 130px 1fr", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: w.color, fontWeight: 600 }}>{w.week}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{w.focus}</span>
                  <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{w.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WHAT WE BUILD ── */}
        {tab === "what" && (
          <div>
            <TabHead title="The Build Manifest" sub="8 things we ship in Phase 1 — and nothing more" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {whatWeBuild.map((b, i) => (
                <div key={b.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.phase}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr 120px", gap: 16, alignItems: "center" }}>
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

        {/* ── WHAT WE DON'T BUILD ── */}
        {tab === "what-not" && (
          <div>
            <TabHead title="The Exclusion List" sub="Equally important — what we deliberately leave for later phases" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {whatNot.map((w, i) => (
                <div key={w.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.red}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 130px", gap: 16, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{w.item}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>NOT IN PHASE 1</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{w.reason}</div>
                  <Chip label={w.phase} color={w.phase.includes("2") ? T.amber : w.phase.includes("3") ? T.violet : T.dim} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 7, padding: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Why This Matters</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                Premature investment in any of the deferred items has killed more eval projects than under-investment. The cost is not the feature — it's the delay in learning what users actually need. Phase 1 buys you that learning.
              </div>
            </div>
          </div>
        )}

        {/* ── DECISIONS ── */}
        {tab === "decisions" && (
          <div>
            <TabHead title="Non-Negotiable Decisions" sub="6 choices that define Phase 1's character" />
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
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.amber, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Trade-off Accepted</div>
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

        {/* ── DELIVERABLES ── */}
        {tab === "deliverables" && (
          <div>
            <TabHead title="The 4 Shippable Artifacts" sub="What exists at the end of Phase 1 — and who owns each" />
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

        {/* ── GATES ── */}
        {tab === "gates" && (
          <div>
            <TabHead title="Phase 1 Exit Gates" sub="3 checkpoints that must pass before Phase 2 begins" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {exitGates.map((g, i) => (
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
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.phase, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pass Criteria</div>
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

        {/* ── RISKS ── */}
        {tab === "risks" && (
          <div>
            <TabHead title="Risk Register" sub="6 things that will likely go wrong — and how to absorb each" />
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

      {/* Footer with next doc */}
      <div style={{ background: T.s1, borderTop: `1px solid ${T.border}`, padding: "20px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>End of Phase 1</div>
            <div style={{ fontSize: 14, color: T.dim }}>Phase 1 complete? Move to <span style={{ color: T.amber, fontWeight: 600 }}>Phase-2-Harden.md</span></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/tutorials/01-hub-phase-rollout" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.dim, padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: 4, textDecoration: "none" }}>← Hub</Link>
            <Link to="/tutorials/03-phase-2-harden" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.amber, padding: "8px 14px", border: `1px solid ${T.amber}66`, borderRadius: 4, background: T.amber + "10", textDecoration: "none" }}>Phase 2 →</Link>
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
