import { useState } from "react";
import { Link } from "react-router-dom";

const T = {
  bg:       "#0A0E1A",
  s1:       "#0E1424",
  card:     "#131B2E",
  border:   "#1E2940",
  bright:   "#2A3A5C",
  text:     "#E8EEF8",
  dim:      "#7A8BAD",
  muted:    "#3A4A6A",

  // phase colors stay consistent across all 4 docs
  p1:       "#34D399",   // emerald — Validate
  p1Dim:    "#34D39915",
  p2:       "#FBBF24",   // amber — Harden
  p2Dim:    "#FBBF2415",
  p3:       "#A78BFA",   // violet — Scale
  p3Dim:    "#A78BFA15",

  accent:   "#22D3EE",   // cyan — hub accent
  accentDim:"#22D3EE15",
};

const phaseCards = [
  {
    id: "p1",
    n: "01",
    label: "Phase 1",
    title: "Validate",
    color: T.p1,
    bg: T.p1Dim,
    timeline: "Weeks 1–3",
    headline: "Prove the eval loop end-to-end on real artifacts",
    desc: "Ship the minimum viable judge. 3 dimensions, 20 golden examples, JSON-only output. Prove signal before investing in polish.",
    deliverables: 4,
    decisions: 6,
    gates: 3,
    risk: "Low",
    confidence: "Validating",
    doc: "Phase-1-Validate.md",
    slug: "/tutorials/02-phase-1-validate",
  },
  {
    id: "p2",
    n: "02",
    label: "Phase 2",
    title: "Harden",
    color: T.p2,
    bg: T.p2Dim,
    timeline: "Weeks 4–8",
    headline: "Demonstrate quality to stakeholders with calibrated metrics",
    desc: "Add the metrics that build trust — Cohen's Kappa, human override, sprint dashboard. Prove the judge agrees with human reviewers.",
    deliverables: 6,
    decisions: 8,
    gates: 4,
    risk: "Medium",
    confidence: "Calibrating",
    doc: "Phase-2-Harden.md",
    slug: "/tutorials/03-phase-2-harden",
  },
  {
    id: "p3",
    n: "03",
    label: "Phase 3",
    title: "Scale",
    color: T.p3,
    bg: T.p3Dim,
    timeline: "Month 3+",
    headline: "Expand only when Phase 2 is trusted and teams ask for more",
    desc: "Add remaining dimensions, CI/CD gates, feedback loops. Move from observation to enforcement. Self-improving rubric.",
    deliverables: 5,
    decisions: 7,
    gates: 5,
    risk: "Strategic",
    confidence: "Trusted",
    doc: "Phase-3-Scale.md",
    slug: "/tutorials/04-phase-3-scale",
  },
];

const principles = [
  { color: T.p1, rule: "Rules before LLM", detail: "Catch structural failures free. Never pay LLM tokens for a story with no AC." },
  { color: T.p2, rule: "Calibrate on real data", detail: "Cohen's Kappa is computed after 50 real artifacts, not before launch." },
  { color: T.p3, rule: "Block only what's trusted",  detail: "Don't make the eval a deploy gate until teams agree the scores feel right." },
  { color: T.accent, rule: "Ship the simplest thing that learns", detail: "Phase 1 isn't a small Phase 3 — it's the minimum surface to learn what users need." },
];

const crossRefs = [
  { from: "Phase 1", to: "Phase 2", trigger: "20 real artifacts evaluated · human reviewers agree with scores", color: T.p1 },
  { from: "Phase 2", to: "Phase 3", trigger: "Cohen's Kappa > 0.60 · False pass rate < 3% · Teams actively using scores", color: T.p2 },
  { from: "Any Phase", to: "Rollback", trigger: "False pass > 5% OR team distrust → freeze rubric, recalibrate", color: T.p3 },
];

export default function Hub() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.muted}; }
        .phase-card { transition: all 0.2s; cursor: pointer; }
        .phase-card:hover { transform: translateY(-4px); }
        code { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "44px 36px 36px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, ${T.p1}10 0%, transparent 50%), radial-gradient(circle at 50% 30%, ${T.p2}10 0%, transparent 50%), radial-gradient(circle at 85% 70%, ${T.p3}10 0%, transparent 50%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}22 1px, transparent 1px), linear-gradient(90deg, ${T.border}22 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", opacity: 0.5 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Link to="/" style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.dim, textDecoration: "none", marginBottom: 12 }}>← All tutorials</Link>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>
            SDLC Copilot · Evaluation Framework
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 44, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 14 }}>
            Phase-by-Phase<br />
            <span style={{ background: `linear-gradient(90deg, ${T.p1}, ${T.p2}, ${T.p3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rollout Strategy</span>
          </h1>
          <p style={{ fontSize: 16, color: T.dim, maxWidth: 620, lineHeight: 1.7, marginBottom: 28 }}>
            A strategic, three-phase rollout for the SDLC Copilot evaluation framework — balanced for production deployment without over-engineering. Each phase is a deep-dive document linked from this hub.
          </p>

          {/* Stat strip */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { v: "3", l: "Phases", c: T.accent },
              { v: "3 weeks", l: "to Phase 1 ship", c: T.p1 },
              { v: "4", l: "linked documents", c: T.p2 },
              { v: "0", l: "lines of code (strategy only)", c: T.p3 },
            ].map(s => (
              <div key={s.l} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `2px solid ${s.c}`, borderRadius: 6, padding: "10px 18px" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, color: s.c }}>{s.v}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.dim, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px" }}>

        {/* ── Phase Cards ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>The Three Phases</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Click any phase to deep-dive</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {phaseCards.map((p) => (
              <Link key={p.id} to={p.slug} style={{ textDecoration: "none", display: "block" }}>
              <div
                className="phase-card"
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === p.id ? p.bg : T.card,
                  border: `1px solid ${hovered === p.id ? p.color + "66" : T.border}`,
                  borderTop: `3px solid ${p.color}`,
                  borderRadius: 8,
                  padding: 22,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, fontWeight: 800, color: p.color, opacity: 0.05, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{p.n}</div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color, fontWeight: 600, letterSpacing: "0.15em" }}>{p.label.toUpperCase()}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.dim, padding: "2px 8px", borderRadius: 3, background: T.bg, border: `1px solid ${T.border}` }}>{p.timeline}</span>
                </div>

                <h3 style={{ fontSize: 28, fontWeight: 800, color: p.color, lineHeight: 1.1, marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: T.text, lineHeight: 1.55, marginBottom: 10, fontWeight: 500 }}>{p.headline}</p>
                <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.65, marginBottom: 16 }}>{p.desc}</p>

                {/* Phase metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                  {[
                    [p.deliverables, "Deliverables"],
                    [p.decisions, "Decisions"],
                    [p.gates, "Gates"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: p.color }}>{v}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Doc reference */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Risk Level</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, marginTop: 3 }}>{p.risk} · {p.confidence}</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.color, padding: "5px 10px", border: `1px solid ${p.color}44`, borderRadius: 3, background: p.color + "10" }}>
                    {p.doc} →
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Linked Documents Map ── */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24, marginBottom: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Document Map</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>How These 4 Documents Connect</h3>

          {/* Visual document graph */}
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
            {/* This document */}
            <div style={{ background: T.accentDim, border: `2px solid ${T.accent}`, borderRadius: 7, padding: 18, position: "sticky", top: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.accent, marginBottom: 6, letterSpacing: "0.15em", textTransform: "uppercase" }}>You are here</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Hub Document</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.dim, marginBottom: 12 }}>Hub-Phase-Rollout.md</div>
              <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.65 }}>
                Navigation, phase overview, transition gates, and cross-document references.
              </div>
            </div>

            {/* Linked docs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Phase-1-Validate.md",  color: T.p1,    role: "Deep-dive into Phase 1 — what to validate, golden set design, exit criteria",         scope: "Strategic", slug: "/tutorials/02-phase-1-validate" },
                { name: "Phase-2-Harden.md",     color: T.p2,    role: "Deep-dive into Phase 2 — calibration metrics, Kappa methodology, human override design", scope: "Strategic", slug: "/tutorials/03-phase-2-harden" },
                { name: "Phase-3-Scale.md",      color: T.p3,    role: "Deep-dive into Phase 3 — expansion criteria, CI/CD gating, feedback loops",            scope: "Strategic", slug: "/tutorials/04-phase-3-scale" },
                { name: "Comprehensive-Recs.md", color: T.accent, role: "Cross-phase comprehensive recommendations across all evaluation dimensions",           scope: "Reference", slug: "/tutorials/05-comprehensive-recs" },
              ].map(d => (
                <Link key={d.name} to={d.slug} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${d.color}`, borderRadius: 5, padding: "12px 16px", display: "grid", gridTemplateColumns: "200px 1fr 80px", gap: 14, alignItems: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = d.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: d.color }}>{d.name}</code>
                  <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{d.role}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted, textAlign: "right" }}>{d.scope}</span>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Core Principles ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Foundational Rules</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Principles That Cross All Phases</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {principles.map((pr, i) => (
              <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${pr.color}`, borderRadius: 5, padding: 18 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: pr.color, marginBottom: 6 }}>{pr.rule}</div>
                <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.65 }}>{pr.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase Transitions ── */}
        <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Critical Transitions</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Phase Gates — When to Move Forward</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {crossRefs.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 50px 130px 1fr", gap: 16, alignItems: "center", padding: "10px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 5 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.color, fontWeight: 600 }}>{c.from}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: c.color, textAlign: "center" }}>→</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.text, fontWeight: 600 }}>{c.to}</span>
                <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{c.trigger}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, padding: 14, background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: 5 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.accent, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Anti-Pattern Warning</div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.65 }}>
              Moving to Phase 2 before scores feel right to humans is the most common failure mode. Cohen's Kappa won't save you if the underlying rubric is off — recalibrate Phase 1 instead.
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 36px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted }}>SDLC COPILOT · HUB DOCUMENT · v1.0</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted }}>4 LINKED DOCUMENTS · STRATEGIC DEPTH</span>
      </div>
    </div>
  );
}
