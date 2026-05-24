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

  phase:    "#FBBF24",    // amber — Phase 2 signature
  phaseDim: "#FBBF2412",
  phaseMid: "#FBBF2435",
  red:      "#F87171",
  green:    "#34D399",
  blue:     "#60A5FA",
  violet:   "#A78BFA",
};

const TABS = [
  { id: "overview", label: "Overview & Goal" },
  { id: "what",     label: "What We Add" },
  { id: "what-not", label: "What Stays Deferred" },
  { id: "decisions", label: "Key Decisions" },
  { id: "deliverables", label: "Deliverables" },
  { id: "calibration", label: "Calibration Method" },
  { id: "gates",    label: "Exit Gates" },
  { id: "risks",    label: "Risks & Mitigations" },
];

const whatWeBuild = [
  { item: "Cohen's Kappa calibration",   why: "Now that 50+ artifacts exist, statistically validate that LLM judge agrees with human reviewers. Target κ > 0.60.", category: "Calibration" },
  { item: "Human override workflow",     why: "Reviewers can adjust scores. Disagreements are logged and become input to rubric calibration — the feedback loop begins.", category: "Workflow" },
  { item: "Sprint quality dashboard",    why: "Visualise sprint-level trends: avg composite, pass rate, weakest dimension. Stakeholders see signal, not just numbers.", category: "Visibility" },
  { item: "RAGAS context_precision metric", why: "Add the second RAGAS metric. Validates that retrieved context is actually relevant — not just whether the artifact is faithful to it.", category: "Engine" },
  { item: "Score_variance check (2-pass)",  why: "Run borderline-score artifacts (65–75 range) through judge twice. If variance > 0.6, flag for human review. Catches calibration weak spots.", category: "Quality" },
  { item: "Grow golden set to 50",       why: "Add 30 more examples — selected from real production failures and false-pass cases. Targeted growth, not bulk addition.", category: "Data" },
  { item: "Negative example library to 25", why: "Add 10 more anti-patterns discovered during Phase 1 production runs. Real failures, not imagined ones.", category: "Data" },
  { item: "Slack/Teams notification hooks", why: "When score < 50 or hard fail, notify story author via DM. Closes the loop without requiring users to check a dashboard.", category: "UX" },
];

const stillDeferred = [
  { item: "All 6 evaluation dimensions",  reason: "Adding dimensions before 3 are trusted dilutes signal. Wait for Phase 3.", phase: "Phase 3" },
  { item: "CI/CD blocking gate",          reason: "Don't block deploys until the judge is statistically validated AND teams trust it informally.", phase: "Phase 3" },
  { item: "Self-improving rubric loop",   reason: "Need 6+ months of correlation data between scores and sprint outcomes. Premature loop reinforces bias.", phase: "Phase 3" },
  { item: "Adversarial red-teaming",      reason: "Hardening a non-blocking system is wasted work. Add when judge has real authority.", phase: "Phase 3" },
  { item: "Multi-tenant / per-team rubrics", reason: "Standardisation first, customisation later. Org-wide baseline beats per-team complexity.", phase: "Phase 3+" },
  { item: "Trend forecasting / predictive analytics", reason: "Vanity metrics. Skip until basic trend reporting is consumed and acted on.", phase: "Defer indefinitely" },
];

const decisions = [
  {
    title: "Cohen's Kappa > 0.60 as Phase 2 success gate",
    rationale: "Substantial agreement threshold from Landis & Koch (1977). Below 0.60 means the judge and humans disagree more than chance allows for trust.",
    tradeoff: "May require 2–3 iterations of rubric tuning to hit. Worth it — without this, eval scores are uninformative.",
    impact: "Trust-Critical",
    color: T.phase,
  },
  {
    title: "Human overrides are logged, never auto-update rubric",
    rationale: "If overrides directly tune the LLM, you create a feedback loop that overfits to recent reviewers. Logs feed rubric review, not real-time adaptation.",
    tradeoff: "Slower learning, but stable scores. Calibration via batch analysis is more honest than continuous drift.",
    impact: "Stability",
    color: T.blue,
  },
  {
    title: "Dashboard shows trends, not individual scores",
    rationale: "Per-story scores invite gaming. Sprint-level trends drive systemic improvement. Aggregation reduces individual-blame culture.",
    tradeoff: "Less granular detail for QA team. Acceptable — granular detail is in the JSON API for those who need it.",
    impact: "Culture",
    color: T.green,
  },
  {
    title: "2-pass variance check only on borderline scores (65–75)",
    rationale: "Targeted spend — running variance on all artifacts doubles costs for the 80% of cases where it doesn't matter. Borderlines are where bias hides.",
    tradeoff: "Need a hot-path for borderline detection. Trivial to implement.",
    impact: "Cost-Quality Balance",
    color: T.amber,
  },
  {
    title: "Slack notification only on FAIL or hard-fail",
    rationale: "Notification fatigue kills adoption. Only notify when action is genuinely required.",
    tradeoff: "Authors of 'Good' stories don't get positive reinforcement. Compensated by sprint-level recognition.",
    impact: "Adoption",
    color: T.violet,
  },
  {
    title: "Sprint dashboard owned by Eng Manager, not QA",
    rationale: "Quality is an engineering concern, not a QA gate. Ownership signals organisational accountability.",
    tradeoff: "Requires Eng Manager buy-in upfront. Mitigated by including them in Phase 2 kickoff.",
    impact: "Organisational",
    color: T.dim,
  },
  {
    title: "Calibration dataset frozen after rubric updates",
    rationale: "If you re-score the calibration set after every rubric edit, you can't detect regression. Freeze it, version it.",
    tradeoff: "Need a separate 'living' set for ongoing learning. Worth the operational complexity.",
    impact: "Methodology",
    color: T.green,
  },
  {
    title: "No public team leaderboards",
    rationale: "Public scoring creates incentive distortion — teams game the metrics instead of improving quality.",
    tradeoff: "Less competitive pressure. Compensated by private team dashboards + Eng Manager reviews.",
    impact: "Culture",
    color: T.red,
  },
];

const deliverables = [
  {
    name: "Inter-Rater Reliability Report",
    detail: "Statistical report showing Cohen's Kappa per dimension, MAE between LLM and human reviewers, and per-dimension calibration status. Updated weekly.",
    owner: "ML Engineer + QA Lead",
    week: "Week 4–5",
    color: T.phase,
  },
  {
    name: "Human Override API + Audit Log",
    detail: "POST /reports/{id}/override endpoint. Each override stores: original score, human score, justification, reviewer ID, timestamp. Read-only audit log.",
    owner: "Backend Engineer",
    week: "Week 4",
    color: T.phase,
  },
  {
    name: "Sprint Quality Dashboard",
    detail: "Single-page dashboard showing 4 charts: avg composite over time, dimension breakdown, pass/review/reject rates, weakest dimension. Read-only.",
    owner: "Frontend Engineer",
    week: "Week 6",
    color: T.phase,
  },
  {
    name: "Golden Set v2 (50 examples)",
    detail: "Original 20 + 30 new — distributed across grade bands + targeted at Phase 1 weak spots (false positives, false negatives, borderline cases).",
    owner: "QA Lead + BA",
    week: "Week 5",
    color: T.phase,
  },
  {
    name: "Calibration Playbook",
    detail: "Documented methodology for: detecting drift, recalibrating anchors, running variance tests, deciding when re-calibration is needed.",
    owner: "Tech Lead",
    week: "Week 7",
    color: T.phase,
  },
  {
    name: "Stakeholder Briefing Deck",
    detail: "Single slide deck for Eng Leadership + Product showing: what the eval framework is, what it's catching, what trends look like, Phase 3 readiness criteria.",
    owner: "Product Manager",
    week: "Week 8",
    color: T.phase,
  },
];

const calibrationSteps = [
  { n: "01", title: "Dual Scoring", desc: "30 artifacts scored by LLM judge AND 2 independent human reviewers. Use sampling stratified across grade bands.", color: T.phase },
  { n: "02", title: "Compute Kappa", desc: "Calculate Cohen's Kappa for LLM vs Human-1, LLM vs Human-2, and Human-1 vs Human-2 (sanity check). Target: κ > 0.60.", color: T.blue },
  { n: "03", title: "Identify Disagreements", desc: "List all artifacts where LLM and human disagree by > 1 point. Cluster by dimension. Pattern-match the disagreement type.", color: T.green },
  { n: "04", title: "Rubric Diagnosis", desc: "For each disagreement cluster: is the rubric anchor too vague? Does the LLM lack context? Is the human applying unwritten rules?", color: T.violet },
  { n: "05", title: "Targeted Anchor Edits", desc: "Rewrite specific score anchors based on diagnoses. Avoid bulk rewrites — change only what data demands.", color: T.amber },
  { n: "06", title: "Regression Check", desc: "Re-run golden set after every anchor edit. Score drift > 5 points on any artifact = regression, investigate before committing.", color: T.red },
  { n: "07", title: "Iterate Until Gate Passes", desc: "Repeat steps 1–6 until Kappa > 0.60 AND false-pass rate < 3% AND false-fail rate < 5%. Don't move on early.", color: T.phase },
];

const exitGates = [
  {
    n: "G1",
    name: "Statistical Validation Gate",
    color: T.phase,
    criteria: "Cohen's Kappa > 0.60 on dual-scored calibration set. MAE < 0.5 per dimension. False-pass rate < 3%.",
    blockingFor: "Stakeholder trust → Phase 3 expansion",
    failureMode: "Kappa < 0.55 means rubric anchors are wrong, not the LLM. Recalibrate before adding features. Resist the urge to add more dimensions.",
  },
  {
    n: "G2",
    name: "Adoption Gate",
    color: T.green,
    criteria: "At least 2 teams using eval scores during sprint reviews. Override rate < 20% (humans agreeing with judge most of the time).",
    blockingFor: "Authority to enforce in Phase 3",
    failureMode: "Low adoption signals scores are seen as noise. Run user research — usually a UX or notification problem, not a calibration one.",
  },
  {
    n: "G3",
    name: "Stability Gate",
    color: T.blue,
    criteria: "30 consecutive sprints (or 4–6 weeks) without rubric edits. Score distribution stable within ±2 points week-over-week.",
    blockingFor: "Phase 3 CI/CD gating",
    failureMode: "Frequent edits = unsettled rubric. Don't gate deploys on a moving target.",
  },
  {
    n: "G4",
    name: "Stakeholder Sign-Off Gate",
    color: T.violet,
    criteria: "Eng Manager + QA Lead + Product Manager have all reviewed Phase 2 outputs and explicitly endorsed Phase 3 progression.",
    blockingFor: "Phase 3 authorisation",
    failureMode: "Build consensus before scaling. Phase 3 features (CI gates, multi-dim, feedback loops) are organisationally heavier — need real buy-in.",
  },
];

const risks = [
  {
    risk: "Kappa plateau below 0.60 — rubric ceiling reached",
    likelihood: "Medium",
    impact: "Critical",
    mitigation: "If anchor rewrites stop improving Kappa, the underlying dimension may be too subjective. Consider splitting (e.g. AC Quality → Measurability + Completeness) or accepting a lower threshold on that dim only.",
    color: T.red,
  },
  {
    risk: "Human reviewers disagree with each other (low human-human Kappa)",
    likelihood: "Medium",
    impact: "High",
    mitigation: "If human-human κ < 0.65, you have a human calibration problem. Run reviewer alignment workshop using golden set before continuing. Most common cause is unspoken assumptions.",
    color: T.amber,
  },
  {
    risk: "Dashboard becomes vanity — looked at, not acted on",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Build into sprint retrospective. Eng Manager must reference scores during retro. Make absence of reference a documented anti-pattern. Adoption is a process problem, not a tool problem.",
    color: T.amber,
  },
  {
    risk: "Override fatigue — humans stop reviewing low-score cases",
    likelihood: "Medium",
    impact: "Medium",
    mitigation: "Cap reviewer load at 5 overrides/week per person. Rotate reviewers. Surface only borderline (65–75) cases for review — let clear passes/fails go through.",
    color: T.blue,
  },
  {
    risk: "Score gaming — story authors rewrite to score well, not write well",
    likelihood: "Medium",
    impact: "High",
    mitigation: "Don't expose individual scores in team meetings. Trend at sprint level. Audit randomly. If gaming detected, rubric is too literal — anchor on behaviour, not surface features.",
    color: T.amber,
  },
  {
    risk: "Drift in production data vs golden set",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Run golden set evaluation weekly. If composite drifts >3 points without rubric changes, production data has shifted — refresh golden set selection.",
    color: T.amber,
  },
];

export default function Phase2() {
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

      {/* Breadcrumb */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.border}`, padding: "10px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/01-hub-phase-rollout" style={{ color: T.dim, textDecoration: "none" }}>Hub-Phase-Rollout.md</Link>
          <span style={{ color: T.muted }}>/</span>
          <span style={{ color: T.phase, fontWeight: 600 }}>Phase-2-Harden.md</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <Link to="/tutorials/02-phase-1-validate" style={{ color: T.green, textDecoration: "none" }}>← Phase 1</Link>
          <Link to="/tutorials/04-phase-3-scale" style={{ color: T.violet, textDecoration: "none" }}>Phase 3 →</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", padding: "36px 36px 32px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 15% 50%, ${T.phase}12 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, background: T.phaseDim, border: `2px solid ${T.phase}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: T.phase }}>02</span>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Phase 2 · Weeks 4–8</div>
              <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Harden</h1>
            </div>
          </div>
          <p style={{ fontSize: 16, color: T.bright, maxWidth: 680, lineHeight: 1.6 }}>
            Demonstrate quality to stakeholders with calibrated metrics. Move from "scores feel right" to "scores agree with humans statistically." Build the trust required for Phase 3 authority.
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
            <TabHead title="The Hardening Mandate" sub="What success looks like by end of Week 8" />

            <div style={{ background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Core Goal</div>
              <p style={{ fontSize: 17, color: T.text, lineHeight: 1.65 }}>
                Statistically prove the eval judge agrees with humans (Cohen's Kappa &gt; 0.60). Get 2+ teams actively using scores in sprint reviews. Build the institutional trust required for Phase 3 authority.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Statistical bar",  desc: "Cohen's Kappa > 0.60 across all 3 dimensions. False-pass rate < 3%, false-fail rate < 5%.", color: T.phase },
                { label: "Adoption bar",     desc: "2+ teams reference eval scores during sprint reviews. Override rate < 20%.", color: T.blue },
                { label: "Anti-goal",        desc: "Do NOT expand to 6 dimensions. Do NOT add CI/CD gates. Trust must precede authority.", color: T.red },
              ].map(s => (
                <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `2px solid ${s.color}`, borderRadius: 7, padding: 18 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.color, marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>Phase 2 Cadence</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>5-Week Iteration Plan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { week: "Week 4",   focus: "Override & Calibration Infra",     detail: "Human override API. Audit log. First Kappa measurement on 30 dual-scored artifacts.", color: T.phase },
                { week: "Week 5",   focus: "Golden Set + Anchor Iteration",   detail: "Grow golden set to 50 examples. First rubric anchor edits based on disagreement clusters.", color: T.blue },
                { week: "Week 6",   focus: "Dashboard + Team Rollout",         detail: "Sprint dashboard live. Roll out to 2 pilot teams. Begin daily Kappa monitoring.", color: T.green },
                { week: "Week 7",   focus: "Stability + Drift Watch",         detail: "Iterate anchors until Kappa stable across 2 sprints. Document calibration playbook.", color: T.violet },
                { week: "Week 8",   focus: "Stakeholder Sign-Off",            detail: "Briefing deck. Eng Manager + QA Lead + PM endorsement. Phase 3 readiness review.", color: T.amber },
              ].map(w => (
                <div key={w.week} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${w.color}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "100px 180px 1fr", gap: 16, alignItems: "center" }}>
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
            <TabHead title="The Hardening Additions" sub="8 things we add to the Phase 1 foundation" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {whatWeBuild.map((b, i) => (
                <div key={b.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.phase}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr 130px", gap: 16, alignItems: "center" }}>
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

        {/* DEFERRED */}
        {tab === "what-not" && (
          <div>
            <TabHead title="Still Deferred to Phase 3" sub="Even at Phase 2, these are too early — and why" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stillDeferred.map(w => (
                <div key={w.item} className="hov" style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.red}`, borderRadius: 5, padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 110px", gap: 16, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{w.item}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>NOT IN PHASE 2</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{w.reason}</div>
                  <Chip label={w.phase} color={w.phase.includes("3") ? T.violet : T.dim} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DECISIONS */}
        {tab === "decisions" && (
          <div>
            <TabHead title="Phase 2 Non-Negotiables" sub="8 strategic choices that shape Phase 2" />
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
            <TabHead title="The 6 Phase 2 Artifacts" sub="What exists at the end of Phase 2" />
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

        {/* CALIBRATION */}
        {tab === "calibration" && (
          <div>
            <TabHead title="Calibration Methodology" sub="The 7-step rubric tuning loop that powers Phase 2" />

            <div style={{ background: T.phaseDim, border: `1px solid ${T.phaseMid}`, borderRadius: 7, padding: 18, marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.phase, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Why This Matters</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>
                Calibration is what separates a "scoring system" from a "trusted evaluator." Cohen's Kappa &gt; 0.60 isn't a number to hit — it's evidence that your scores are reproducible across reviewers. Without it, every Phase 3 expansion is built on sand.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {calibrationSteps.map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.color, fontWeight: 600 }}>{s.n}</span>
                    </div>
                    {i < calibrationSteps.length - 1 && <div style={{ width: 1, flex: 1, background: T.border, margin: "3px 0" }} />}
                  </div>
                  <div className="hov" style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 18px", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GATES */}
        {tab === "gates" && (
          <div>
            <TabHead title="Phase 2 Exit Gates" sub="4 checkpoints that must pass before Phase 3 begins" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {exitGates.map(g => (
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
            <TabHead title="Risk Register" sub="6 things that derail Phase 2 — and how to absorb each" />
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
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>End of Phase 2</div>
            <div style={{ fontSize: 14, color: T.dim }}>Phase 2 gates passed? Move to <span style={{ color: T.violet, fontWeight: 600 }}>Phase-3-Scale.md</span></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/tutorials/02-phase-1-validate" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.green, padding: "8px 14px", border: `1px solid ${T.green}44`, borderRadius: 4, background: T.green + "10", textDecoration: "none" }}>← Phase 1</Link>
            <Link to="/tutorials/04-phase-3-scale" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.violet, padding: "8px 14px", border: `1px solid ${T.violet}66`, borderRadius: 4, background: T.violet + "10", textDecoration: "none" }}>Phase 3 →</Link>
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
