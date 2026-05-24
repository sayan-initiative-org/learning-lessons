// SdlcCopilotCTOPresentation.jsx
// Executive presentation: SDLC Copilot — for the Group CTO.
// Single-file React component. Aesthetic matches the project house style:
// warm-dark editorial with amber/gold accents (Fraunces + Geist + JetBrains Mono).
// Auto-discovered by the tutorial router under /tutorials/sdlc-copilot-cto-presentation.

import React, { useState, useEffect, useRef } from "react";

// ───────────────────────────────────────────────────────────────────────────────
// Theme tokens — kept in lock-step with the rest of the tutorial set
// ───────────────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0d0d0f",
  bgPanel:   "#15151a",
  bgSunken:  "#0a0a0c",
  border:    "#26262c",
  borderHi:  "#3a3a42",
  text:      "#f0ebe1",
  textMute:  "#8a857c",
  textDim:   "#5c5a55",
  gold:      "#d4a64a",
  terra:     "#c87553",
  sage:      "#7a9966",
  rust:      "#a85544",
  ink:       "#1a1a1f",
  steel:     "#6b8aa8",
};

// ───────────────────────────────────────────────────────────────────────────────
// Global styles
// ───────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .sdlc-root {
      font-family: 'Geist', system-ui, sans-serif;
      background: ${T.bg};
      color: ${T.text};
      font-feature-settings: "ss01", "cv11";
      letter-spacing: -0.005em;
    }
    .sdlc-root *::selection { background: ${T.gold}; color: ${T.bg}; }
    .display { font-family: 'Fraunces', serif; font-optical-sizing: auto;
               font-variation-settings: "opsz" 96, "SOFT" 50; letter-spacing: -0.03em; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .hairline { border-top: 1px solid ${T.border}; }
    .ring-gold:focus { outline: 1px solid ${T.gold}; outline-offset: 2px; }

    .nav-link {
      display:block; padding: 7px 14px; font-size: 13px; color:${T.textMute};
      border-left: 1px solid transparent; cursor:pointer; transition: all .15s;
      letter-spacing: 0.02em;
    }
    .nav-link:hover { color: ${T.text}; }
    .nav-link.active { color: ${T.gold}; border-left-color: ${T.gold}; background: ${T.ink}; }
    .nav-section { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
                   color:${T.textDim}; padding: 18px 14px 6px; }

    .prose p { line-height: 1.75; color: ${T.text}; opacity: .92; font-size: 15px; margin: 14px 0; }
    .prose strong { color: ${T.gold}; font-weight: 500; }
    .prose em { color: ${T.terra}; font-style: italic; }
    .prose code { font-family: 'JetBrains Mono', monospace; font-size: 13px;
                  background: ${T.ink}; padding: 1px 6px; border-radius: 3px;
                  color: ${T.sage}; border: 1px solid ${T.border}; }
    .prose ul { margin: 12px 0; padding-left: 0; list-style: none; }
    .prose li { padding: 5px 0 5px 22px; position: relative; line-height: 1.7;
                color: ${T.text}; opacity: .9; font-size: 15px; }
    .prose li::before { content: "→"; position: absolute; left: 0; color: ${T.gold}; }

    .h-eyebrow { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
                 color: ${T.terra}; margin-bottom: 10px; font-weight: 500; }
    .h1 { font-family: 'Fraunces', serif; font-size: 56px; line-height: 1; letter-spacing: -0.04em;
          font-weight: 400; font-variation-settings: "opsz" 144; }
    .h2 { font-family: 'Fraunces', serif; font-size: 38px; line-height: 1.05; letter-spacing: -0.03em;
          font-weight: 400; font-variation-settings: "opsz" 96; margin-bottom: 8px; }
    .h3 { font-family: 'Fraunces', serif; font-size: 24px; line-height: 1.2; letter-spacing: -0.02em;
          font-weight: 500; font-variation-settings: "opsz" 36; }
    .h4 { font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;
          color: ${T.text}; font-weight: 600; }

    .card { background: ${T.bgPanel}; border: 1px solid ${T.border}; border-radius: 4px;
            padding: 22px; transition: border-color .2s; }
    .card:hover { border-color: ${T.borderHi}; }
    .card-flat { background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px; padding: 18px; }

    .metric-num { font-family: 'Fraunces', serif; font-size: 52px; line-height: 1; font-weight: 400;
                  color: ${T.gold}; letter-spacing: -0.03em;
                  font-variation-settings: "opsz" 96; }
    .metric-lbl { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
                  color: ${T.textMute}; margin-top: 10px; }

    .pill { display: inline-block; padding: 3px 9px; font-size: 11px; letter-spacing: 0.05em;
            border: 1px solid ${T.border}; border-radius: 999px; color: ${T.textMute};
            font-family: 'JetBrains Mono', monospace; }
    .pill-gold { color: ${T.gold}; border-color: ${T.gold}55; background: ${T.gold}10; }
    .pill-terra { color: ${T.terra}; border-color: ${T.terra}55; background: ${T.terra}10; }
    .pill-sage { color: ${T.sage}; border-color: ${T.sage}55; background: ${T.sage}10; }
    .pill-steel { color: ${T.steel}; border-color: ${T.steel}55; background: ${T.steel}10; }

    table.compare { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.compare th, table.compare td {
      padding: 12px 14px; text-align: left; border-bottom: 1px solid ${T.border};
      vertical-align: top;
    }
    table.compare th { color: ${T.textMute}; font-weight: 500; font-size: 11px;
                       letter-spacing: 0.1em; text-transform: uppercase;
                       border-bottom-color: ${T.borderHi}; }
    table.compare td { color: ${T.text}; opacity: .9; }
    table.compare tr:hover td { background: ${T.bgPanel}40; }

    .anim-fade { animation: fadeIn .35s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .scroll-hide::-webkit-scrollbar { width: 6px; height: 6px; }
    .scroll-hide::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

    .quote {
      border-left: 2px solid ${T.gold}; padding: 6px 0 6px 20px;
      font-family: 'Fraunces', serif; font-size: 19px; line-height: 1.55;
      color: ${T.text}; opacity: .92; font-style: italic;
    }

    .ask-row {
      display: grid; grid-template-columns: 64px 1fr; gap: 18px;
      padding: 22px 0; border-bottom: 1px dashed ${T.border};
    }
    .ask-num {
      font-family: 'Fraunces', serif; font-size: 36px; color: ${T.gold};
      font-variation-settings: "opsz" 72; line-height: 1;
    }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────────
// SVG primitives (re-used for the architecture + workflow diagrams)
// ───────────────────────────────────────────────────────────────────────────────
const Node = ({ x, y, w = 130, h = 38, label, sub, fill = T.bgPanel, stroke = T.borderHi, color = T.text }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={stroke} />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle"
          fontSize="11" fontFamily="JetBrains Mono" fill={color}>{label}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle"
                   fontSize="9" fontFamily="JetBrains Mono" fill={T.textMute}>{sub}</text>}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, label, dashed = false, color = T.textMute }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const ang = Math.atan2(dy, dx);
  const ax = x2 - 8 * Math.cos(ang), ay = y2 - 8 * Math.sin(ang);
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay}
            stroke={color} strokeWidth="1" strokeDasharray={dashed ? "3 3" : "0"} />
      <polygon points={`${x2},${y2} ${ax - 4 * Math.sin(ang)},${ay + 4 * Math.cos(ang)} ${ax + 4 * Math.sin(ang)},${ay - 4 * Math.cos(ang)}`}
               fill={color} />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} textAnchor="middle"
                       fontSize="9" fontFamily="JetBrains Mono" fill={T.textDim}>{label}</text>}
    </g>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// Navigation
// ───────────────────────────────────────────────────────────────────────────────
const NAV = [
  { group: "Opening", items: [
    { id: "intro",      label: "The frame" },
    { id: "problem",    label: "The problem" },
  ]},
  { group: "Proof", items: [
    { id: "what",       label: "What it does" },
    { id: "metrics",    label: "Production metrics" },
    { id: "compress",   label: "PDLC compression" },
  ]},
  { group: "How it works", items: [
    { id: "arch",       label: "Architecture" },
    { id: "workflow",   label: "Unified LangGraph workflow" },
    { id: "agents",     label: "Six specialist agents" },
    { id: "retrieval",  label: "Hybrid retrieval" },
    { id: "quality",    label: "5-layer quality judge" },
  ]},
  { group: "Distribution", items: [
    { id: "mcp",        label: "MCP — callable capability" },
  ]},
  { group: "Forward", items: [
    { id: "roadmap",    label: "Roadmap" },
    { id: "thesis",     label: "Strategic thesis" },
    { id: "ask",        label: "The ask" },
  ]},
];

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Intro / verbal opener
// ───────────────────────────────────────────────────────────────────────────────
const Intro = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 01 — For the Group CTO · May 2026</div>
    <h1 className="display h1 mb-6">
      SDLC Copilot.<br/>
      <em style={{ color: T.gold }}>A callable platform for the requirements layer.</em>
    </h1>
    <p style={{ fontSize: 17, lineHeight: 1.7, color: T.text, opacity: .85, maxWidth: 760 }}>
      The Define and Test stages of every sprint eat <strong style={{color:T.gold}}>up to 40% of our delivery capacity</strong>
      &nbsp;— before a line of business code is written. SDLC Copilot fixes that layer with a multi-agent platform
      built on LangGraph: it ingests a brief — or an existing JIRA/TFS ticket — and produces INVEST-grade user stories,
      full acceptance criteria, test cases across <em>positive, negative, and edge</em> dimensions, and Cucumber-ready BDD scripts.
      Every artifact passes a <strong style={{color:T.gold}}>5-layer quality judge</strong> before it reaches a human.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
      {[
        { n: "01", t: "Production-grade",    b: "600+ stories and 4,500+ test cases accepted in production. Every artifact human-reviewed, traceable end-to-end." },
        { n: "02", t: "Built-in quality",    b: "5-layer LLM-as-Judge gates every output. Schema, faithfulness, correctness, coverage, style. The system cannot silently regress." },
        { n: "03", t: "Callable, not a UI",  b: "Test script generation is published as an MCP server. Claude Code, Cursor, CI pipelines, partner GCCs — all connect with zero integration work." },
      ].map((c) => (
        <div key={c.n} className="card">
          <div className="mono" style={{ color: T.gold, fontSize: 11, letterSpacing: ".15em" }}>{c.n}</div>
          <div className="h3 mt-3">{c.t}</div>
          <p className="mt-2" style={{ color: T.textMute, fontSize: 14, lineHeight: 1.6 }}>{c.b}</p>
        </div>
      ))}
    </div>

    <div className="mt-14">
      <div className="h-eyebrow">Verbal opener · 90 seconds</div>
      <div className="quote">
        “The Define and Test stages of every sprint eat 40% of our delivery capacity — before a single line of business
        code gets written. SDLC Copilot fixes that layer. Production today: 600+ user stories, 4,500+ test cases,
        ~65% compression on Define and Test combined. Every artifact human-reviewed, traceable, observable.
        And we’ve exposed test script generation as an MCP server — Claude Code, Cursor, CI pipelines, and any
        compliant client can call our agents without integration work. We become callable infrastructure, not a web app.”
      </div>
      <p style={{ color: T.textMute, fontSize: 13, marginTop: 12 }}>
        What I want from you in the next 15 minutes: endorsement to make this the default path Group-wide, and
        authorisation to open the MCP surface to partner GCCs.
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 2 — The Problem
// ───────────────────────────────────────────────────────────────────────────────
const Problem = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 02 — The leak</div>
    <h2 className="display h2">Forty percent of every sprint, before any code.</h2>
    <p className="prose">
      <p>
        The Define and Test stages of the PDLC are where delivery velocity consistently degrades. Four root causes
        compound across every team, every sprint:
      </p>
    </p>

    <table className="compare mt-6">
      <thead>
        <tr><th style={{ width: "30%" }}>Root cause</th><th>Cost</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Requirements drift</strong></td>
          <td>Business intent dilutes as it passes through BAs, leads, and developers. Each interpretation gap becomes a rework cycle late in the sprint.</td>
        </tr>
        <tr>
          <td><strong>Manual story authoring</strong></td>
          <td>Senior engineers spend <span className="pill pill-terra">8–12 hrs / sprint</span> writing User Stories, ACs, and BDD scripts by hand. High-cost, low-leverage work.</td>
        </tr>
        <tr>
          <td><strong>Test coverage gaps</strong></td>
          <td>Negative paths, edge cases, and regression scenarios are skipped under deadline pressure. Defects from the requirements layer account for <span className="pill pill-terra">30–40% of downstream bugs</span>.</td>
        </tr>
        <tr>
          <td><strong>Knowledge locked in JIRA</strong></td>
          <td>Past sprints contain the answers — domain context, prior decisions, reusable patterns — but no system reads them. Every new feature starts from a blank page.</td>
        </tr>
      </tbody>
    </table>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
      <div className="card-flat">
        <div className="metric-num">40%</div>
        <div className="metric-lbl">Sprint capacity in Define + Test</div>
      </div>
      <div className="card-flat">
        <div className="metric-num">2–3w</div>
        <div className="metric-lbl">Typical Define stage, mid-sized epic</div>
      </div>
      <div className="card-flat">
        <div className="metric-num">~3 FTE</div>
        <div className="metric-lbl">Senior engineers on authoring alone</div>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 3 — What it does
// ───────────────────────────────────────────────────────────────────────────────
const WhatItDoes = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 03 — The platform</div>
    <h2 className="display h2">Three capability surfaces. One graph.</h2>
    <p className="prose">
      <p>
        SDLC Copilot is a <strong>purpose-built multi-agent platform</strong> for the requirements and test authoring
        layer of the PDLC. Built on LangGraph with Azure OpenAI, it ingests product intent — from free-text briefs or
        existing JIRA/TFS tickets — and produces production-ready artifacts with a built-in quality gate and a
        human-in-the-loop refinement interface.
      </p>
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="card">
        <div className="pill pill-gold">Generate</div>
        <div className="h3 mt-3">From-scratch authoring</div>
        <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
          User Stories (INVEST-grade), Epics, Acceptance Criteria, Test Cases (positive / negative / edge), and
          Cucumber/Gherkin BDD scripts.
        </p>
      </div>
      <div className="card">
        <div className="pill pill-terra">Refine</div>
        <div className="h3 mt-3">Conversational improvement</div>
        <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
          A refinement BOT adds missing scenarios, rewrites steps, or regenerates selections against any existing
          artifact. Same workflow handles greenfield and edits.
        </p>
      </div>
      <div className="card">
        <div className="pill pill-sage">Connect</div>
        <div className="h3 mt-3">Native ingestion + MCP</div>
        <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
          JIRA / TFS ingestion, Redis blackboard memory, MCP server surface for external callers, span-level
          observability via Phoenix + LangSmith.
        </p>
      </div>
    </div>

    <div className="mt-10">
      <div className="h-eyebrow">Stack</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {[
          ["LangGraph", "gold"],
          ["Azure OpenAI", "gold"],
          ["BM25 + E5/BGE-M3 + RRF", "sage"],
          ["Cross-Encoder Rerank", "sage"],
          ["Redis Blackboard", "steel"],
          ["Arize Phoenix", "terra"],
          ["LangSmith", "terra"],
          ["DeepEval + RAGAS + Pytest", "terra"],
          ["MCP Server", "gold"],
        ].map(([label, kind]) => (
          <span key={label} className={`pill pill-${kind}`}>{label}</span>
        ))}
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Production metrics
// ───────────────────────────────────────────────────────────────────────────────
const Metrics = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 04 — Proof in production</div>
    <h2 className="display h2">Not projections — shipped work.</h2>
    <p className="prose">
      <p>
        Every artifact in the numbers below passed human review before being accepted into the backlog or test suite.
        Every artifact is traceable in Arize Phoenix and LangSmith with full span-level observability.
      </p>
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div className="card-flat">
        <div className="metric-num">600+</div>
        <div className="metric-lbl">User stories accepted</div>
      </div>
      <div className="card-flat">
        <div className="metric-num">4,500+</div>
        <div className="metric-lbl">Test cases produced</div>
      </div>
      <div className="card-flat">
        <div className="metric-num">6</div>
        <div className="metric-lbl">Specialist agents in production</div>
      </div>
      <div className="card-flat">
        <div className="metric-num">~65%</div>
        <div className="metric-lbl">Define + Test compression</div>
      </div>
    </div>

    <div className="mt-10 card">
      <div className="h4">The compounding dynamic</div>
      <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.7, marginTop: 10 }}>
        The 600 stories and 4,500 test cases are themselves <strong style={{color:T.gold}}>retrieval signal</strong>.
        Newer generations retrieve from older ones via the hybrid BM25 + dense + RRF stack. Quality improves not
        because we tuned a model, but because the corpus grows and the retrieval stack has more signal to work with.
        <em style={{color:T.terra}}>The system gets sharper, not just bigger.</em>
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 5 — PDLC compression
// ───────────────────────────────────────────────────────────────────────────────
const Compression = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 05 — Stage compression</div>
    <h2 className="display h2">Concentrated. Attributable. Measurable.</h2>
    <p className="prose">
      <p>
        The ~65% compression is concentrated in two stages. <strong>Copilot does not touch Build, Design, or Release.</strong>
        That means the benefit is easy to measure, easy to isolate, and carries no risk of introducing AI into
        code-generation or deployment gates.
      </p>
    </p>

    <table className="compare mt-6">
      <thead>
        <tr>
          <th>Stage</th>
          <th>Before Copilot</th>
          <th>With Copilot</th>
          <th>Delta</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Define</td><td>12 days</td><td>4 days</td><td><span className="pill pill-gold">−67%</span></td></tr>
        <tr><td>Design</td><td>5 days</td><td>5 days</td><td><span className="pill">—</span></td></tr>
        <tr><td>Build</td><td>14 days</td><td>14 days</td><td><span className="pill">—</span></td></tr>
        <tr><td>Test</td><td>10 days</td><td>4 days</td><td><span className="pill pill-gold">−60%</span></td></tr>
        <tr><td>Release</td><td>3 days</td><td>3 days</td><td><span className="pill">—</span></td></tr>
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>44 days</strong></td>
          <td><strong>30 days</strong></td>
          <td><span className="pill pill-gold">~32% end-to-end</span></td>
        </tr>
      </tbody>
    </table>
    <p style={{ color: T.textDim, fontSize: 12, marginTop: 12, fontStyle: "italic" }}>
      Figures based on median mid-sized epic. Define + Test combined: 22 days → 8 days = 64% reduction.
    </p>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 6 — Architecture
// ───────────────────────────────────────────────────────────────────────────────
const ArchSVG = () => (
  <svg viewBox="0 0 720 360" width="100%" style={{ background: T.bgSunken, border: `1px solid ${T.border}`, borderRadius: 4 }}>
    {/* Five layer stack */}
    <text x="20" y="34" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} letterSpacing="0.18em">L1 · INTERFACE</text>
    <Node x={140} y={20} label="Web UI"            sub="product teams" />
    <Node x={290} y={20} label="Refinement BOT"    sub="conversational" />
    <Node x={440} y={20} label="MCP Server"        sub="external callers" stroke={T.gold} color={T.gold} />

    <text x="20" y="98" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} letterSpacing="0.18em">L2 · ORCHESTRATION</text>
    <Node x={200} y={86} label="Intent Identifier" sub="parse brief / ticket" />
    <Node x={400} y={86} label="DAG Task Planner"  sub="agent graph" />

    <text x="20" y="166" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} letterSpacing="0.18em">L3 · AGENTS</text>
    <Node x={150} y={154} label="User Story"  sub="CRAG + Reflexion" w={110} />
    <Node x={280} y={154} label="Test Case"   sub="CRAG + Reflexion" w={110} />
    <Node x={410} y={154} label="BDD Script"  sub="CRAG + Reflexion" w={110} />
    <Node x={540} y={154} label="+3 more"     sub="Epic / AC / Intent" w={110} fill={T.bgSunken} />

    <text x="20" y="234" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} letterSpacing="0.18em">L4 · KNOWLEDGE</text>
    <Node x={130} y={222} label="BM25"           sub="lexical" w={90} />
    <Node x={240} y={222} label="Dense"          sub="E5 / BGE-M3" w={90} />
    <Node x={350} y={222} label="RRF Fusion"     sub="rank blend" w={100} />
    <Node x={470} y={222} label="Cross-Encoder"  sub="rerank top-k" w={110} />

    <text x="20" y="302" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} letterSpacing="0.18em">L5 · MEMORY/OBS</text>
    <Node x={150} y={290} label="Redis Blackboard" sub="ACL-scoped pub/sub" w={140} />
    <Node x={310} y={290} label="Phoenix"          sub="span traces" w={100} />
    <Node x={430} y={290} label="LangSmith"        sub="prompt replay" w={120} />

    {/* Vertical connectors */}
    <Arrow x1={500} y1={50} x2={500} y2={84} dashed />
    <Arrow x1={500} y1={120} x2={300} y2={152} dashed />
    <Arrow x1={400} y1={188} x2={400} y2={220} dashed />
    <Arrow x1={400} y1={256} x2={400} y2={288} dashed />
  </svg>
);

const Architecture = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 06 — Architecture at a glance</div>
    <h2 className="display h2">Five layers. Agentic, not monolithic.</h2>

    <div className="mt-6">
      <ArchSVG />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {[
        { t: "Agentic, not monolithic", b: "Each agent owns one artifact type and one quality bar. Failures are isolated and attributable." },
        { t: "DAG over chains",         b: "Parallel agent execution where artifacts are independent; sequential where one depends on another." },
        { t: "Memory is shared",        b: "Redis blackboard means context flows across agents without re-passing through the LLM context window." },
        { t: "MCP-first surface",       b: "Any compliant client calls our agents without a bespoke SDK or integration agreement." },
        { t: "Evaluation is built-in",  b: "A 5-layer LLM-as-Judge gates every output. The system cannot silently regress." },
        { t: "ACL-scoped memory",       b: "Redis keys are tenant-scoped. Cross-tenant leakage is architecturally impossible." },
      ].map((p) => (
        <div key={p.t} className="card-flat">
          <div className="h4">{p.t}</div>
          <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>{p.b}</p>
        </div>
      ))}
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 7 — Unified LangGraph workflow
// ───────────────────────────────────────────────────────────────────────────────
const WorkflowSVG = () => (
  <svg viewBox="0 0 760 420" width="100%" style={{ background: T.bgSunken, border: `1px solid ${T.border}`, borderRadius: 4 }}>
    {/* Two intake sources */}
    <Node x={60}  y={20} label="JIRA / TFS Ticket" sub="existing" w={160} />
    <Node x={540} y={20} label="Free-text Brief"   sub="greenfield"  w={160} />

    {/* Intent → Planner */}
    <Node x={300} y={88}  label="Intent Identifier" w={160} />
    <Node x={300} y={146} label="DAG Task Planner"  w={160} />

    {/* Three parallel agents */}
    <Node x={80}  y={216} label="User Story Agent" w={160} stroke={T.gold} color={T.gold} />
    <Node x={300} y={216} label="Test Case Agent"  w={160} stroke={T.gold} color={T.gold} />
    <Node x={520} y={216} label="BDD Script Agent" w={160} stroke={T.gold} color={T.gold} />

    {/* Judge */}
    <Node x={300} y={290} label="5-Layer Judge" sub="schema · faith · correctness · coverage · style" w={160} stroke={T.terra} color={T.terra} />

    {/* Outcomes */}
    <Node x={60}  y={360} label="Refinement BOT" sub="conditional edge" w={200} stroke={T.sage} color={T.sage} />
    <Node x={500} y={360} label="Return to user"  sub="score ≥ threshold" w={200} stroke={T.sage} color={T.sage} />

    {/* Arrows */}
    <Arrow x1={140} y1={58}  x2={340} y2={86} />
    <Arrow x1={620} y1={58}  x2={420} y2={86} />
    <Arrow x1={380} y1={126} x2={380} y2={144} />
    <Arrow x1={380} y1={186} x2={160} y2={214} />
    <Arrow x1={380} y1={186} x2={380} y2={214} />
    <Arrow x1={380} y1={186} x2={600} y2={214} />
    <Arrow x1={160} y1={254} x2={380} y2={288} />
    <Arrow x1={380} y1={254} x2={380} y2={288} />
    <Arrow x1={600} y1={254} x2={380} y2={288} />
    <Arrow x1={340} y1={328} x2={160} y2={358} label="score < threshold" color={T.terra} />
    <Arrow x1={420} y1={328} x2={600} y2={358} label="score ≥ threshold" color={T.sage} />
    {/* Refinement loopback */}
    <Arrow x1={80} y1={384} x2={20}  y2={384} dashed color={T.sage} />
    <line  x1={20} y1={384} x2={20}  y2={232} stroke={T.sage} strokeDasharray="3 3" strokeWidth="1" />
    <Arrow x1={20} y1={232} x2={78}  y2={232} dashed color={T.sage} label="surgical regen" />
  </svg>
);

const Workflow = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 07 — Unified LangGraph workflow</div>
    <h2 className="display h2">One graph. Conditional edges do the work.</h2>
    <p className="prose">
      <p>
        Initial generation and refinement share the same topology — there is no separate “edit mode”.
        The Refinement BOT is <strong>not a separate product</strong>; it’s a conditional edge triggered by a judge-score
        miss or a user request. It can regenerate a single failing test case without re-running the full chain.
      </p>
    </p>

    <div className="mt-6">
      <WorkflowSVG />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="card">
        <div className="h4">From-scratch flow</div>
        <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>
          A free-text brief lands in the Intent Identifier, gets planned into a DAG, and fans out to the User Story,
          Test Case, and BDD Script agents in parallel. Each agent runs a <strong style={{color:T.gold}}>CRAG retrieval loop</strong>
          and a <strong style={{color:T.gold}}>Reflexion retry loop</strong> against the judge before yielding output.
        </p>
      </div>
      <div className="card">
        <div className="h4">JIRA / TFS refinement flow</div>
        <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>
          An existing ticket is pulled via the JIRA/TFS connector and used as retrieval context. Two effects: <em>consistency</em>
          (new stories match existing terminology and AC structure) and <em>deduplication</em> (no regeneration of functionally
          identical artifacts).
        </p>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 8 — Six specialist agents
// ───────────────────────────────────────────────────────────────────────────────
const Agents = () => {
  const agents = [
    { n: "01", name: "Intent Identifier",      role: "Parses brief / ticket into a normalised intent object: artifact targets, domain context, JIRA references. The only agent that does no generation." },
    { n: "02", name: "User Story Agent",       role: "Generates INVEST-grade User Stories with Given/When/Then acceptance criteria. Retrieves against the historical corpus (600+ stories) and existing epic tickets." },
    { n: "03", name: "Epic Decomposer",        role: "Takes a high-level brief and decomposes into capability-level Epics with parent-child linking. No sprawling 200-point ‘do everything’ epics." },
    { n: "04", name: "Acceptance Criteria",    role: "Given/When/Then criteria mapped to stories. Covers happy path, alternative flows, boundary conditions. Feeds Agent 05 directly." },
    { n: "05", name: "Test Case Agent",        role: "Generates test cases across three dimensions — positive, negative, edge. Each case carries traceability back to story and AC." },
    { n: "06", name: "BDD Script Agent",       role: "Emits Cucumber-ready Gherkin feature files from Test Cases. Validates syntax before returning. This is the agent exposed via MCP." },
  ];
  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 08 — The six agents</div>
      <h2 className="display h2">Each owns one artifact type and one quality bar.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {agents.map((a) => (
          <div key={a.n} className="card">
            <div className="flex items-baseline gap-3">
              <span className="mono" style={{ color: T.gold, fontSize: 11, letterSpacing: ".15em" }}>{a.n}</span>
              <div className="h3">{a.name}</div>
            </div>
            <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>{a.role}</p>
          </div>
        ))}
      </div>
      <p className="prose mt-6">
        <p>
          Every generation agent runs two loops internally — a <strong>CRAG (Corrective RAG)</strong> retrieval loop
          (re-retrieves or web-searches if context scores below threshold) and a <strong>Reflexion</strong> retry loop
          (regenerates with critique attached if the judge scores below threshold). Both terminate after three attempts;
          failures escalate to the Error Handler.
        </p>
      </p>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 9 — Hybrid retrieval
// ───────────────────────────────────────────────────────────────────────────────
const Retrieval = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 09 — Hybrid retrieval</div>
    <h2 className="display h2">No naive vector search. Six stages, each earning its place.</h2>

    <table className="compare mt-6">
      <thead>
        <tr><th>Stage</th><th>Method</th><th>Role</th></tr>
      </thead>
      <tbody>
        <tr><td>1. Query Expansion</td><td>Intent + entity extraction</td><td>Broadens recall surface</td></tr>
        <tr><td>2. BM25 Lexical</td><td>Sparse keyword index</td><td>Exact ticket IDs, acronyms, jargon</td></tr>
        <tr><td>3. Dense Embedding</td><td>E5 / BGE-M3 (asymmetric prefix)</td><td>Semantic intent and paraphrase</td></tr>
        <tr><td>4. RRF Fusion</td><td>Reciprocal Rank Fusion</td><td>Tunable, model-agnostic rank blend</td></tr>
        <tr><td>5. Cross-Encoder Rerank</td><td>Joint attention over query+doc</td><td>Top-k precision lifting</td></tr>
        <tr><td>6. Agent Context</td><td>Top 5–8 chunks to LLM</td><td>Final context window population</td></tr>
      </tbody>
    </table>

    <div className="card mt-8">
      <div className="h4">Why each stage exists</div>
      <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75, marginTop: 12 }}>
        <strong>BM25 first.</strong> A pure embedding model misses exact ticket IDs, story keys, and acronyms. Lexical
        recall catches what semantic similarity cannot.
      </p>
      <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75 }}>
        <strong>Dense second.</strong> Handles paraphrase. <em>“Customer cannot log in”</em> should retrieve
        <em> “authentication failure on sign-in”</em> — BM25 alone cannot do this.
      </p>
      <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75 }}>
        <strong>RRF fusion.</strong> Blends ranked lists without a hand-tuned interpolation weight. Model-agnostic and
        graceful when one retriever underperforms.
      </p>
      <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75 }}>
        <strong>Cross-encoder rerank.</strong> Reads query and document jointly — sharper than independent bi-encoder
        similarity. Applied only to the top 20–30 candidates, lifting top-1 precision before the LLM sees its context.
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 10 — 5-layer quality judge
// ───────────────────────────────────────────────────────────────────────────────
const Quality = () => {
  const layers = [
    { L: "L1", t: "Schema & Structure",      b: "INVEST conformance, Gherkin parseability. Structural validation before any semantic evaluation." },
    { L: "L2", t: "Faithfulness to Source",  b: "Stays grounded in retrieved context. Hallucination and fabrication detection." },
    { L: "L3", t: "Functional Correctness",  b: "Do the ACs validate the stated feature? Would the tests actually catch the failure modes they claim to?" },
    { L: "L4", t: "Coverage & Completeness", b: "Negative paths, edge cases, regression scenarios present. No obvious omission patterns." },
    { L: "L5", t: "Style & Reusability",     b: "Tone, vocabulary, granularity matching house standards. Generated artifacts feel hand-written." },
  ];
  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 10 — Quality framework</div>
      <h2 className="display h2">A 5-layer judge gates every artifact.</h2>
      <p className="prose">
        <p>
          Below-threshold outputs auto-route back to the originating agent with the judge’s critique attached.
          <strong> The system cannot silently regress.</strong>
        </p>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-8">
        {layers.map((l) => (
          <div key={l.L} className="card-flat">
            <div className="mono" style={{ color: T.gold, fontSize: 12, letterSpacing: ".12em" }}>{l.L}</div>
            <div className="h4 mt-2">{l.t}</div>
            <p style={{ color: T.textMute, fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>{l.b}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="h-eyebrow">Tooling</div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="pill pill-terra">DeepEval — functional rubrics</span>
          <span className="pill pill-terra">RAGAS — retrieval faithfulness</span>
          <span className="pill pill-terra">Pytest — CI regression gate</span>
          <span className="pill pill-steel">Arize Phoenix — span traces</span>
          <span className="pill pill-steel">LangSmith — replay debugging</span>
        </div>
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 11 — MCP
// ───────────────────────────────────────────────────────────────────────────────
const MCP = () => {
  const tools = [
    { name: "generate_test_script",    desc: "Emits a Gherkin/BDD feature file from a User Story ID or plain-text story." },
    { name: "generate_test_from_jira", desc: "Pulls a JIRA / TFS ticket by ID and returns a Cucumber-ready feature file." },
    { name: "refine_test_script",      desc: "Natural-language refinement — add scenarios, rewrite steps, add edge cases." },
    { name: "validate_script",         desc: "Runs a script through the 5-layer judge, returns a quality score with dimension breakdown." },
  ];
  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 11 — MCP · the distribution layer</div>
      <h2 className="display h2">Test script generation as a callable capability.</h2>
      <p className="prose">
        <p>
          SDLC Copilot publishes an <strong>MCP (Model Context Protocol)</strong> server. Any compliant host — IDE,
          CI/CD pipeline, agent framework, or partner system — invokes our agents without a bespoke SDK or integration
          agreement. <em>We become callable infrastructure, not a web app.</em>
        </p>
      </p>

      <div className="mt-8">
        <div className="h4">Published tools</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {tools.map((t) => (
            <div key={t.name} className="card-flat">
              <span className="mono" style={{ color: T.gold, fontSize: 13 }}>{t.name}</span>
              <p style={{ color: T.textMute, fontSize: 13.5, lineHeight: 1.65, marginTop: 8 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h4">Caller ecosystem</div>
        <div className="flex flex-wrap gap-2 mt-3">
          {["Claude Code", "Cursor", "VS Code", "JetBrains", "CI/CD pipelines", "JIRA / TFS", "Partner GCCs", "Portfolio companies", "Any MCP-compliant client"].map((c) => (
            <span key={c} className="pill pill-gold">{c}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        <div className="card">
          <div className="pill pill-gold">Property 01</div>
          <div className="h3 mt-3">Zero integration cost</div>
          <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
            MCP is an open protocol. No SDK to ship, no client library to version-manage across teams. Any compliant
            host connects in minutes.
          </p>
        </div>
        <div className="card">
          <div className="pill pill-gold">Property 02</div>
          <div className="h3 mt-3">Quality travels with every call</div>
          <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
            Every <code style={{ color: T.sage }}>generate_test_script</code> response is gated by the 5-layer judge
            before return. Consumers cannot retrieve an unvalidated script — quality is enforced at the protocol
            boundary.
          </p>
        </div>
        <div className="card">
          <div className="pill pill-gold">Property 03</div>
          <div className="h3 mt-3">Footprint at zero marginal cost</div>
          <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
            Each new MCP-speaking host extends our reach with no engineering effort from us. The more surfaces that
            speak MCP, the larger our distribution becomes.
          </p>
        </div>
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 12 — Roadmap
// ───────────────────────────────────────────────────────────────────────────────
const Roadmap = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 12 — Roadmap</div>
    <h2 className="display h2">Now · Next · After.</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="card">
        <span className="pill pill-sage">Now · Production hardening</span>
        <ul className="prose mt-4">
          <li>Refinement BOT GA across active product squads</li>
          <li>MCP server in internal registry, four tools published</li>
          <li>5-layer judge gating every artifact in production</li>
          <li>Full observability via Phoenix + LangSmith</li>
        </ul>
      </div>
      <div className="card">
        <span className="pill pill-gold">Next · Q3–Q4 2026</span>
        <ul className="prose mt-4">
          <li><strong>HyDE</strong> — hypothetical document embeddings for cold-start queries</li>
          <li><strong>Self-RAG controller</strong> — per-token decide-whether-to-retrieve</li>
          <li><strong>Agentic chunking</strong> — context-aware chunking for Design Docs and SoWs</li>
        </ul>
      </div>
      <div className="card">
        <span className="pill pill-terra">After · 2027 H1</span>
        <ul className="prose mt-4">
          <li><strong>Design Doc Agent</strong> — SoWs, design documents, RFP responses</li>
          <li><strong>Sprint Retrospective Agent</strong> — mines JIRA for blockers and estimation drift</li>
          <li><strong>Code-stub generation from ACs</strong> — bridge Copilot into Build</li>
        </ul>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 13 — Strategic thesis
// ───────────────────────────────────────────────────────────────────────────────
const Thesis = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 13 — Strategic thesis</div>
    <h2 className="display h2">Two compounding dynamics.</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="card">
        <div className="h4" style={{ color: T.gold }}>Corpus dynamic</div>
        <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75, marginTop: 10 }}>
          Every artifact we generate becomes retrieval context for the next generation. Newer sprints retrieve from
          older ones. <strong>Quality improves not because we tuned a model, but because the corpus grows.</strong>
        </p>
      </div>
      <div className="card">
        <div className="h4" style={{ color: T.gold }}>Distribution dynamic</div>
        <p style={{ color: T.text, opacity: .88, fontSize: 15, lineHeight: 1.75, marginTop: 10 }}>
          The MCP surface means SDLC Copilot is a <em>callable capability</em>. As the MCP ecosystem grows — IDEs,
          pipelines, partner systems — our footprint expands without engineering effort.
        </p>
      </div>
    </div>

    <p className="prose mt-8">
      <p>
        The two benefits are <strong>independent</strong>. Teams benefit from speed today regardless of whether the MCP
        surface is enabled. The MCP surface extends reach regardless of whether teams care about PDLC compression.
        <em> Both compound.</em>
      </p>
    </p>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 14 — The ask
// ───────────────────────────────────────────────────────────────────────────────
const Ask = () => {
  const asks = [
    { n: "01", t: "Endorse the platform",      b: "Position SDLC Copilot as the default requirements + test authoring path for all Group product teams. Production-ready today; human-in-the-loop guardrails are in place." },
    { n: "02", t: "Fund Phase 2 retrieval",    b: "Greenlight HyDE + Self-RAG + Agentic Chunking for Q3–Q4 2026, plus the Design Doc Agent. Scoped, sequenced, and gated by the same eval framework already in production." },
    { n: "03", t: "Open the MCP surface",      b: "Authorise publication of the MCP server to partner GCCs and selected portfolio companies as a Group-wide differentiator. The surface already exists — this is an architectural decision, not an engineering one." },
  ];
  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 14 — The ask</div>
      <h2 className="display h2">Three commitments to move from program to platform.</h2>

      <div className="mt-8">
        {asks.map((a) => (
          <div key={a.n} className="ask-row">
            <div className="ask-num">{a.n}</div>
            <div>
              <div className="h3">{a.t}</div>
              <p style={{ color: T.textMute, fontSize: 14.5, lineHeight: 1.7, marginTop: 8 }}>{a.b}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 quote">
        “Two compounding dynamics: the corpus grows, so retrieval gets sharper. The MCP surface spreads, so reach
        grows without engineering effort. Both compound independently. That’s why this is worth treating as Group
        infrastructure.”
      </div>

      <div className="hairline mt-16" />
      <p style={{ color: T.textDim, fontSize: 12, marginTop: 18, fontFamily: "JetBrains Mono", letterSpacing: "0.06em" }}>
        SDLC COPILOT PROGRAM · PREPARED FOR THE GROUP CTO · MAY 2026
      </p>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION REGISTRY
// ───────────────────────────────────────────────────────────────────────────────
const SECTIONS = {
  intro:     { C: Intro,        title: "The frame" },
  problem:   { C: Problem,      title: "The problem" },
  what:      { C: WhatItDoes,   title: "What it does" },
  metrics:   { C: Metrics,      title: "Production metrics" },
  compress:  { C: Compression,  title: "PDLC compression" },
  arch:      { C: Architecture, title: "Architecture" },
  workflow:  { C: Workflow,     title: "Unified LangGraph workflow" },
  agents:    { C: Agents,       title: "Six specialist agents" },
  retrieval: { C: Retrieval,    title: "Hybrid retrieval" },
  quality:   { C: Quality,      title: "5-layer quality judge" },
  mcp:       { C: MCP,          title: "MCP — callable capability" },
  roadmap:   { C: Roadmap,      title: "Roadmap" },
  thesis:    { C: Thesis,       title: "Strategic thesis" },
  ask:       { C: Ask,          title: "The ask" },
};

// ───────────────────────────────────────────────────────────────────────────────
// Shell
// ───────────────────────────────────────────────────────────────────────────────
const SdlcCopilotCTOPresentation = () => {
  const [active, setActive] = useState("intro");
  const refs = useRef({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = refs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const Current = SECTIONS[active]?.C ?? Intro;

  return (
    <div className="sdlc-root" style={{ minHeight: "100vh" }}>
      <GlobalStyles />
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", maxWidth: 1400, margin: "0 auto" }}>
        {/* Sidebar */}
        <aside style={{
          position: "sticky", top: 0, alignSelf: "start", height: "100vh",
          borderRight: `1px solid ${T.border}`, padding: "32px 8px 32px 24px",
          overflowY: "auto",
        }} className="scroll-hide">
          <div style={{ padding: "0 14px 18px" }}>
            <div className="mono" style={{ color: T.gold, fontSize: 10, letterSpacing: "0.22em" }}>SDLC COPILOT</div>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.1, marginTop: 6, color: T.text }}>
              CTO Presentation
            </div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 6, letterSpacing: "0.06em" }}>
              May 2026 · Group CTO
            </div>
          </div>
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-section">{g.group}</div>
              {g.items.map((it) => (
                <div
                  key={it.id}
                  className={`nav-link ${active === it.id ? "active" : ""}`}
                  onClick={() => scrollTo(it.id)}
                >
                  {it.label}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Main column */}
        <main style={{ padding: "56px 64px 120px", maxWidth: 980 }}>
          {Object.entries(SECTIONS).map(([id, { C }]) => (
            <div
              key={id}
              id={id}
              ref={(el) => (refs.current[id] = el)}
              style={{ marginBottom: 96, scrollMarginTop: 40 }}
            >
              <C />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SdlcCopilotCTOPresentation;
