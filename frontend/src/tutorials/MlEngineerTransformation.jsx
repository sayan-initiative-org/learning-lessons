// MlEngineerTransformation.jsx
// A comprehensive, interactive tutorial: from software engineer to ML practitioner.
// Single-file React component. Drop into src/tutorials/ — auto-discovered by the router.
// Aesthetic matches the project house style: warm-dark editorial with amber accents.

import React, { useState, useMemo, useEffect, useRef } from "react";

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

    .ml-root {
      font-family: 'Geist', system-ui, sans-serif;
      background: ${T.bg};
      color: ${T.text};
      font-feature-settings: "ss01", "cv11";
      letter-spacing: -0.005em;
    }
    .ml-root *::selection { background: ${T.gold}; color: ${T.bg}; }
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

    .codeblock {
      background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6;
      overflow-x: auto; position: relative;
    }
    .codeblock-header {
      display:flex; justify-content:space-between; align-items:center;
      padding: 8px 14px; border-bottom: 1px solid ${T.border};
      font-size: 11px; color: ${T.textMute}; letter-spacing: 0.06em; text-transform: uppercase;
    }
    .codeblock pre { padding: 14px 18px; margin: 0; }

    .tok-kw { color: ${T.terra}; }
    .tok-fn { color: ${T.gold}; }
    .tok-str { color: ${T.sage}; }
    .tok-com { color: ${T.textDim}; font-style: italic; }
    .tok-num { color: ${T.rust}; }
    .tok-cls { color: #c8aa6b; }

    .pill { display: inline-block; padding: 3px 9px; font-size: 11px; letter-spacing: 0.05em;
            border: 1px solid ${T.border}; border-radius: 999px; color: ${T.textMute};
            font-family: 'JetBrains Mono', monospace; }
    .pill-gold { color: ${T.gold}; border-color: ${T.gold}55; background: ${T.gold}10; }
    .pill-terra { color: ${T.terra}; border-color: ${T.terra}55; background: ${T.terra}10; }
    .pill-sage { color: ${T.sage}; border-color: ${T.sage}55; background: ${T.sage}10; }
    .pill-steel { color: ${T.steel}; border-color: ${T.steel}55; background: ${T.steel}10; }

    .tab-btn { padding: 8px 14px; font-size: 13px; color: ${T.textMute};
               border-bottom: 1px solid transparent; cursor: pointer; transition: all .15s;
               background: none; border-radius: 0; letter-spacing: 0.02em; }
    .tab-btn:hover { color: ${T.text}; }
    .tab-btn.active { color: ${T.gold}; border-bottom-color: ${T.gold}; }

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

    input[type=range].slider {
      -webkit-appearance: none; appearance: none; height: 2px; background: ${T.border};
      width: 100%; outline: none; border-radius: 2px;
    }
    input[type=range].slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; width: 14px; height: 14px;
      background: ${T.gold}; border-radius: 50%; cursor: pointer;
    }
    input[type=range].slider::-moz-range-thumb {
      width: 14px; height: 14px; background: ${T.gold}; border-radius: 50%;
      cursor: pointer; border: none;
    }

    .check {
      width: 16px; height: 16px; border: 1px solid ${T.border};
      border-radius: 3px; display: inline-flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; background: ${T.bgSunken}; transition: all .15s;
    }
    .check.done { background: ${T.gold}; border-color: ${T.gold}; }
    .check.done::after { content: "✓"; color: ${T.bg}; font-size: 11px; font-weight: 700; }

    .road-row { display: grid; grid-template-columns: 60px 1fr; gap: 14px;
                padding: 14px 0; border-bottom: 1px dashed ${T.border}; align-items: start; }
    .road-week { font-family: 'JetBrains Mono', monospace; font-size: 11px;
                 color: ${T.terra}; letter-spacing: 0.1em; padding-top: 3px; }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────────
// Syntax highlighter (Python / JS pedagogical snippets)
// ───────────────────────────────────────────────────────────────────────────────
const highlight = (code) => {
  const kws = ["def","return","import","from","class","if","else","elif","for","while","async","await","with","as","in","not","and","or","yield","lambda","try","except","raise","pass","True","False","None","self","const","let","function","new","export","default","print"];
  const lines = code.split("\n");
  return lines.map((line, i) => {
    let out = line
      .replace(/(#.*$)/g, '<span class="tok-com">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
    kws.forEach((k) => {
      out = out.replace(new RegExp(`\\b${k}\\b`, "g"), `<span class="tok-kw">${k}</span>`);
    });
    out = out.replace(/\b([A-Z][a-zA-Z0-9]+)\b/g, '<span class="tok-cls">$1</span>');
    out = out.replace(/\b([a-z_][a-z0-9_]*)\s*\(/gi, '<span class="tok-fn">$1</span>(');
    return <div key={i} dangerouslySetInnerHTML={{ __html: out || "&nbsp;" }} />;
  });
};

const CodeBlock = ({ lang = "python", title, children }) => (
  <div className="codeblock my-5">
    <div className="codeblock-header">
      <span>{title || lang}</span>
      <span style={{ color: T.textDim }}>{lang}</span>
    </div>
    <pre className="scroll-hide">{highlight(children)}</pre>
  </div>
);

// ───────────────────────────────────────────────────────────────────────────────
// SVG primitives
// ───────────────────────────────────────────────────────────────────────────────
const Node = ({ x, y, w = 110, h = 36, label, sub, fill = T.bgPanel, stroke = T.borderHi, color = T.text }) => (
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
  { group: "Orientation", items: [
    { id: "intro",        label: "Why this exists" },
    { id: "mental-model", label: "The mental model shift" },
  ]},
  { group: "Foundations", items: [
    { id: "math",         label: "The math you need" },
    { id: "data",         label: "Data, not algorithms" },
    { id: "classical",    label: "Classical ML" },
  ]},
  { group: "Deep Learning", items: [
    { id: "neural",       label: "Neural networks" },
    { id: "training",     label: "The training loop" },
    { id: "optim",        label: "Optimization & regularization" },
  ]},
  { group: "Architectures", items: [
    { id: "cnn",          label: "CNNs — vision" },
    { id: "rnn",          label: "RNNs & LSTMs" },
    { id: "transformer",  label: "Transformers" },
  ]},
  { group: "Use Cases", items: [
    { id: "usecase",      label: "Use-case-driven training" },
    { id: "playground",   label: "Hyperparameter playground" },
  ]},
  { group: "Production", items: [
    { id: "mlops",        label: "MLOps & lifecycle" },
    { id: "pitfalls",     label: "Pitfalls & failure modes" },
  ]},
  { group: "The Plan", items: [
    { id: "roadmap",      label: "16-week roadmap" },
    { id: "checklist",    label: "Mastery checklist" },
    { id: "resources",    label: "Resources" },
  ]},
];

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Intro
// ───────────────────────────────────────────────────────────────────────────────
const Intro = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 01 — Orientation</div>
    <h1 className="display h1 mb-6">
      From engineer to<br/>
      <em style={{ color: T.gold }}>machine-learning practitioner.</em>
    </h1>
    <p style={{ fontSize: 17, lineHeight: 1.7, color: T.text, opacity: .85, maxWidth: 720 }}>
      You already know how to ship software. You know how to read a stack trace, design an API,
      and reason about latency. <strong style={{color:T.gold}}>Machine learning is a different kind of engineering</strong> —
      one where the program is not written by hand but inferred from data, where bugs hide in distributions
      rather than logic, and where the most important question is rarely <em>"does it run?"</em> but
      <em> "is it actually learning the thing we asked it to?"</em>
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
      {[
        { n: "01", t: "Comprehensive", b: "Math foundations through production MLOps — no hand-waving, no missing rungs on the ladder." },
        { n: "02", t: "Use-case grounded", b: "Every concept lands in a concrete problem: vision, NLP, tabular, time-series, recsys." },
        { n: "03", t: "Sequenced", b: "A 16-week plan with weekly outcomes, not a reading list. You finish knowing what to build next." },
      ].map((c) => (
        <div key={c.n} className="card">
          <div className="mono" style={{ color: T.gold, fontSize: 11, letterSpacing: ".15em" }}>{c.n}</div>
          <div className="h3 mt-3">{c.t}</div>
          <p className="mt-2" style={{ color: T.textMute, fontSize: 14, lineHeight: 1.6 }}>{c.b}</p>
        </div>
      ))}
    </div>

    <div className="mt-14">
      <div className="h-eyebrow">Who this is for</div>
      <h2 className="display h2 mb-4">The transformation.</h2>
      <p className="prose">
        <p>
          You are a backend, frontend, infra, or full-stack engineer. You have written code that someone
          uses. You have, perhaps, integrated an LLM API and felt the gap between <em>calling a model</em>
          and <em>building one</em>. This guide closes that gap. It will not turn you into a research scientist
          in three months — that goal is wrong on its face — but it will make you the kind of engineer who can
          read a paper, reproduce a result, train a model end-to-end, and ship it without filing a ticket
          with the ML team.
        </p>
      </p>
    </div>

    <div className="mt-12 card-flat" style={{ borderLeft: `2px solid ${T.gold}` }}>
      <div className="h4 mb-2" style={{ color: T.gold }}>The honest contract</div>
      <p style={{ fontSize: 14, color: T.textMute, lineHeight: 1.7, margin: 0 }}>
        ML is mostly data work, plus a layer of math, plus a thin shell of model code, wrapped in a thick
        shell of evaluation. If you came here expecting to spend most of your time stacking layers in a
        notebook, that expectation is the first thing this guide will dismantle.
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Mental model shift
// ───────────────────────────────────────────────────────────────────────────────
const MentalModel = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 02 — Mental model</div>
    <h2 className="display h2 mb-6">Software vs. machine learning.</h2>

    <table className="compare mt-6">
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Traditional software</th>
          <th>Machine learning</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>How behavior is specified</td><td>Explicit rules in code</td><td>Inferred from labeled examples</td></tr>
        <tr><td>Source of correctness</td><td>Tests and types</td><td>Held-out distribution metrics</td></tr>
        <tr><td>Primary failure mode</td><td>Logic bugs, crashes</td><td>Silent miscalibration, drift, bias</td></tr>
        <tr><td>Unit of iteration</td><td>Function, commit</td><td>Experiment, dataset version, checkpoint</td></tr>
        <tr><td>"Done"</td><td>Acceptance criteria pass</td><td>Beats baseline on the metric that matters</td></tr>
        <tr><td>Debugging tool</td><td>Debugger, logs</td><td>Loss curves, confusion matrix, ablations</td></tr>
        <tr><td>Reproducibility risk</td><td>Low — same input, same output</td><td>High — seeds, hardware, data shuffles all matter</td></tr>
      </tbody>
    </table>

    <div className="prose mt-10">
      <h3 className="display h3 mb-3">The four words that change everything.</h3>
      <p>
        Almost every confusion a transitioning engineer has can be traced to one of four words being used in
        a way they don't expect: <strong>model</strong>, <strong>training</strong>, <strong>loss</strong>,
        and <strong>gradient</strong>. Internalise these and the rest is mechanics.
      </p>

      <ul>
        <li><strong>Model</strong> — a parameterised function <code>f(x; θ)</code>. The "code" is the architecture; the "state" is the parameters θ.</li>
        <li><strong>Training</strong> — searching the space of θ to minimise a scalar measure of wrongness over a dataset.</li>
        <li><strong>Loss</strong> — that scalar measure. It is the only thing the optimiser sees. If your loss is wrong, your model is wrong, full stop.</li>
        <li><strong>Gradient</strong> — the derivative of the loss with respect to each parameter. It tells you which direction to nudge θ to reduce loss.</li>
      </ul>
    </div>

    <div className="mt-10">
      <div className="h-eyebrow">The loop, abstractly</div>
      <svg viewBox="0 0 880 180" style={{ width: "100%", marginTop: 12 }}>
        <Node x={20}  y={70} w={130} h={50} label="Sample batch" sub="x, y" />
        <Node x={180} y={70} w={130} h={50} label="Forward pass" sub="ŷ = f(x; θ)" />
        <Node x={340} y={70} w={130} h={50} label="Compute loss" sub="L(ŷ, y)" />
        <Node x={500} y={70} w={130} h={50} label="Backprop" sub="∂L/∂θ" />
        <Node x={660} y={70} w={130} h={50} label="Update θ" sub="θ ← θ − η∇L" />
        {[150,310,470,630].map(x => <Arrow key={x} x1={x} y1={95} x2={x+30} y2={95} />)}
        <path d={`M 725 120 Q 725 160 400 160 Q 85 160 85 120`} fill="none" stroke={T.terra} strokeDasharray="3 3" />
        <text x={400} y={172} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill={T.terra}>repeat until convergence</text>
      </svg>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Math
// NOTE: deliberately NOT named `Math` to avoid shadowing the global Math object.
// ───────────────────────────────────────────────────────────────────────────────
const MathSection = () => {
  const [tab, setTab] = useState("linalg");
  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 03 — Foundations</div>
      <h2 className="display h2 mb-6">The math you actually need.</h2>
      <p className="prose">
        <p>
          You don't need a PhD. You need <strong>fluency in four areas</strong>: linear algebra, calculus,
          probability, and information theory — at the depth where you can read an equation in a paper and
          recognise what it computes. "Read", not "derive from scratch".
        </p>
      </p>

      <div className="flex gap-1 mt-6 mb-4 border-b" style={{ borderColor: T.border }}>
        {[
          ["linalg", "Linear algebra"],
          ["calc",   "Calculus"],
          ["prob",   "Probability"],
          ["info",   "Information theory"],
        ].map(([id, label]) => (
          <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "linalg" && (
        <div className="prose">
          <h4 className="h4">Why it matters</h4>
          <p>
            Every neural network is a stack of <strong>matrix multiplications interleaved with nonlinearities</strong>.
            Vectors are how examples live, matrices are how parameters live, tensors are how batches live.
          </p>
          <ul>
            <li>Vector / matrix / tensor — shape, broadcasting, transpose</li>
            <li>Matrix multiplication — what dimensions need to align and why</li>
            <li>Dot product as similarity — the engine of attention and embeddings</li>
            <li>Eigenvalues, SVD — only enough to understand PCA and low-rank adapters (LoRA)</li>
            <li>Norms (L1, L2, L∞) — they show up as regularisers and distance metrics</li>
          </ul>
          <CodeBlock lang="python" title="Linear algebra is shape arithmetic">{`import numpy as np

X = np.random.randn(32, 784)       # 32 examples, each a flat 28x28 image
W = np.random.randn(784, 128)      # weight matrix: input_dim x hidden_dim
b = np.zeros(128)                  # bias broadcasts across batch

H = X @ W + b                      # (32, 128) — a hidden representation
print(H.shape)                     # the whole game is making shapes line up`}</CodeBlock>
        </div>
      )}

      {tab === "calc" && (
        <div className="prose">
          <h4 className="h4">Why it matters</h4>
          <p>
            Training is <strong>gradient descent</strong>. Gradient descent is calculus. You need the
            chain rule in your bones — backprop is literally the chain rule applied programmatically.
          </p>
          <ul>
            <li>Derivative as slope, gradient as multi-dimensional slope</li>
            <li>Chain rule — <code>(f∘g)'(x) = f'(g(x)) · g'(x)</code> — backprop in one line</li>
            <li>Partial derivatives — when a loss depends on millions of parameters</li>
            <li>Jacobians and Hessians — read them, don't compute them by hand</li>
            <li>Convexity vs non-convexity — why deep learning has no global optimum guarantee</li>
          </ul>
        </div>
      )}

      {tab === "prob" && (
        <div className="prose">
          <h4 className="h4">Why it matters</h4>
          <p>
            ML outputs are <strong>probability distributions</strong> over outcomes. Classifiers don't
            return labels — they return P(class | input). Generative models sample from learned distributions.
            If you can't reason about distributions, you can't reason about model behaviour.
          </p>
          <ul>
            <li>Random variables, expectation, variance</li>
            <li>Joint / conditional / marginal distributions</li>
            <li>Bayes' rule — the engine of every "given the data, what's likely?" question</li>
            <li>Common distributions: Gaussian, Bernoulli, Categorical, Dirichlet</li>
            <li>Sampling vs. maximum likelihood vs. MAP estimation</li>
          </ul>
        </div>
      )}

      {tab === "info" && (
        <div className="prose">
          <h4 className="h4">Why it matters</h4>
          <p>
            <strong>Cross-entropy is the most-used loss in all of ML.</strong> If you don't know what entropy
            is measuring, you're calling <code>nn.CrossEntropyLoss()</code> as a magic spell.
          </p>
          <ul>
            <li>Entropy <code>H(p) = -Σ p(x) log p(x)</code> — the surprisal of a distribution</li>
            <li>Cross-entropy <code>H(p, q)</code> — surprisal of q under truth p, the workhorse loss</li>
            <li>KL divergence <code>KL(p‖q) = H(p, q) − H(p)</code> — how far q is from p</li>
            <li>Mutual information — how much knowing one variable reduces uncertainty in another</li>
          </ul>
        </div>
      )}
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Data
// ───────────────────────────────────────────────────────────────────────────────
const Data = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 04 — Foundations</div>
    <h2 className="display h2 mb-4">Data is the model.</h2>
    <p className="prose">
      <p>
        Andrew Ng popularised the slogan "data-centric AI" because the field had spent a decade obsessing over
        architectures while quietly relying on whoever cleaned the dataset. The slogan is correct.
        <strong> Two engineers running the same architecture on different versions of the same dataset will get
        materially different models.</strong> The dataset is the source of truth; the architecture is just
        a function approximator chasing it.
      </p>
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>The data pipeline</div>
        <ul className="prose">
          <li><strong>Collection</strong> — where does the signal come from? Logs, crowdwork, synthesis, scraping.</li>
          <li><strong>Labeling</strong> — who decides ground truth? Inter-annotator agreement &lt; 0.7 means your task is ambiguous.</li>
          <li><strong>Cleaning</strong> — deduplicate, drop NaNs, fix encoding, handle outliers honestly.</li>
          <li><strong>Splitting</strong> — train / val / test. The split must reflect the deployment distribution, not a random shuffle.</li>
          <li><strong>Augmentation</strong> — synthesise plausible variants. Multiplies effective dataset size for free.</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-2" style={{ color: T.terra }}>The cardinal sins</div>
        <ul className="prose">
          <li><strong>Label leakage</strong> — features that encode the label. Your model "learns" something trivial and fails in prod.</li>
          <li><strong>Train/test contamination</strong> — the same record appears in both splits. Metrics become fiction.</li>
          <li><strong>Temporal leakage</strong> — using future information to predict the past in a time-series setup.</li>
          <li><strong>Distribution shift</strong> — production data drifts from training data and nobody is watching the metrics.</li>
          <li><strong>Class imbalance ignored</strong> — 99% negative class, model predicts always-negative, accuracy is 99%, recall is 0%.</li>
        </ul>
      </div>
    </div>

    <div className="prose mt-10">
      <h3 className="display h3 mb-3">The split that matters.</h3>
      <p>
        <strong>Train</strong> is what the model fits to. <strong>Validation</strong> is what you tune
        hyperparameters and architecture against — it is touched many times. <strong>Test</strong> is touched
        exactly once, at the end, to report the number you publish. If you tune against test, you have
        overfit to test, and your reported number is a lie.
      </p>
    </div>

    <CodeBlock lang="python" title="A defensible split">{`from sklearn.model_selection import train_test_split

# 1. Hold out test FIRST. Never touch it again until publication.
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

# 2. Then split train/val from what remains.
X_train, X_val, y_train, y_val = train_test_split(
    X_trainval, y_trainval, test_size=0.176, random_state=42, stratify=y_trainval
)
# Final ratios: 70 / 15 / 15 — train / val / test
# stratify=y preserves class proportions across splits — non-negotiable for imbalanced data`}</CodeBlock>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Classical ML
// ───────────────────────────────────────────────────────────────────────────────
const Classical = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 05 — Foundations</div>
    <h2 className="display h2 mb-6">Classical ML — still the right answer most of the time.</h2>
    <p className="prose">
      <p>
        The industry's quiet truth: <strong>for tabular data, gradient-boosted trees beat deep learning</strong>,
        full stop. XGBoost, LightGBM, and CatBoost win Kaggle competitions on structured data with monotonous
        regularity. Reach for a neural network only when your inputs are perceptual (images, audio, text) or
        when you have tens of millions of labelled examples to justify the capacity.
      </p>
    </p>

    <table className="compare mt-6">
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>When to use</th>
          <th>Strength</th>
          <th>Weakness</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Linear / Logistic regression</td><td>Baselines, interpretable models</td><td>Fast, calibrated, explainable</td><td>Can't capture non-linearities</td></tr>
        <tr><td>k-Nearest Neighbors</td><td>Small datasets, sanity baseline</td><td>Zero training, simple</td><td>Slow at inference, curse of dimensionality</td></tr>
        <tr><td>Decision Tree</td><td>Rule extraction</td><td>Interpretable, no scaling needed</td><td>Overfits easily</td></tr>
        <tr><td>Random Forest</td><td>Robust default for tabular</td><td>Low variance, handles mixed types</td><td>Large memory, slow inference</td></tr>
        <tr><td>Gradient Boosting (XGB/LGBM)</td><td>Most tabular problems in production</td><td>State-of-the-art for tabular</td><td>Tuning has many knobs</td></tr>
        <tr><td>SVM</td><td>Small high-dimensional datasets</td><td>Strong margin theory</td><td>Doesn't scale past ~100k samples</td></tr>
        <tr><td>K-Means / DBSCAN</td><td>Unsupervised clustering</td><td>Simple, fast</td><td>K-Means assumes spherical clusters</td></tr>
        <tr><td>PCA</td><td>Dimensionality reduction</td><td>Removes correlated noise</td><td>Linear only — kills non-linear structure</td></tr>
      </tbody>
    </table>

    <div className="prose mt-10">
      <h3 className="display h3 mb-3">The bias-variance trade-off.</h3>
      <p>
        Every model lives somewhere on the spectrum between <strong>underfitting</strong> (high bias, can't
        capture the pattern) and <strong>overfitting</strong> (high variance, memorises noise as signal).
        The art of ML is sitting at the sweet spot — and the only way to find it is to watch
        train loss and validation loss diverge.
      </p>
    </div>

    <svg viewBox="0 0 720 240" style={{ width: "100%", marginTop: 16 }}>
      <line x1="60" y1="200" x2="660" y2="200" stroke={T.border} />
      <line x1="60" y1="40"  x2="60"  y2="200" stroke={T.border} />
      <text x="360" y="225" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono" fill={T.textMute}>Model capacity →</text>
      <text x="20" y="120" fontSize="11" fontFamily="JetBrains Mono" fill={T.textMute} transform="rotate(-90 20 120)">Error</text>
      {/* train curve - monotonically decreasing */}
      <path d="M 60 80 Q 360 130 660 175" fill="none" stroke={T.sage} strokeWidth="1.8" />
      {/* val curve - U-shape */}
      <path d="M 60 90 Q 280 60 360 95 Q 500 145 660 60" fill="none" stroke={T.gold} strokeWidth="1.8" />
      <text x="670" y="178" fontSize="10" fontFamily="JetBrains Mono" fill={T.sage}>train</text>
      <text x="670" y="60" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold}>val</text>
      <line x1="360" y1="40" x2="360" y2="200" stroke={T.terra} strokeDasharray="3 3" />
      <text x="360" y="35" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra}>sweet spot</text>
      <text x="150" y="220" fontSize="10" fontFamily="JetBrains Mono" fill={T.textDim}>underfit</text>
      <text x="540" y="220" fontSize="10" fontFamily="JetBrains Mono" fill={T.textDim}>overfit</text>
    </svg>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 6 — Neural Networks
// ───────────────────────────────────────────────────────────────────────────────
const Neural = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 06 — Deep learning</div>
    <h2 className="display h2 mb-6">Neural networks, first principles.</h2>
    <p className="prose">
      <p>
        A neural network is a <strong>differentiable function composed from differentiable building blocks</strong>.
        That's the whole secret. Each layer is a small function. Stack them, and the chain rule lets you compute
        derivatives end-to-end. Differentiability is what lets gradient descent work. Everything else — depth,
        width, attention, residual connections — is engineering refinement on top of that one mathematical fact.
      </p>
    </p>

    <div className="mt-8">
      <div className="h-eyebrow">An MLP, drawn</div>
      <svg viewBox="0 0 720 280" style={{ width: "100%" }}>
        {/* layer 1 - input */}
        {[60, 110, 160, 210].map((y, i) => (
          <circle key={`i${i}`} cx="100" cy={y} r="10" fill={T.bgPanel} stroke={T.borderHi} />
        ))}
        {/* layer 2 - hidden */}
        {[40, 85, 130, 175, 220, 265].map((y, i) => (
          <circle key={`h1${i}`} cx="300" cy={y} r="10" fill={T.bgPanel} stroke={T.gold} />
        ))}
        {/* layer 3 - hidden */}
        {[40, 85, 130, 175, 220, 265].map((y, i) => (
          <circle key={`h2${i}`} cx="480" cy={y} r="10" fill={T.bgPanel} stroke={T.gold} />
        ))}
        {/* layer 4 - output */}
        {[100, 170].map((y, i) => (
          <circle key={`o${i}`} cx="660" cy={y} r="10" fill={T.bgPanel} stroke={T.terra} />
        ))}
        {/* connections (sparse for clarity) */}
        {[60, 110, 160, 210].flatMap((y1) =>
          [40, 85, 130, 175, 220, 265].map((y2, j) => (
            <line key={`c1-${y1}-${j}`} x1="110" y1={y1} x2="290" y2={y2} stroke={T.border} strokeWidth="0.5" />
          ))
        )}
        {[40, 85, 130, 175, 220, 265].flatMap((y1) =>
          [40, 85, 130, 175, 220, 265].map((y2, j) => (
            <line key={`c2-${y1}-${j}`} x1="310" y1={y1} x2="470" y2={y2} stroke={T.border} strokeWidth="0.5" />
          ))
        )}
        {[40, 85, 130, 175, 220, 265].flatMap((y1) =>
          [100, 170].map((y2, j) => (
            <line key={`c3-${y1}-${j}`} x1="490" y1={y1} x2="650" y2={y2} stroke={T.border} strokeWidth="0.5" />
          ))
        )}
        <text x="100" y="250" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill={T.textMute}>Input</text>
        <text x="300" y="290" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill={T.textMute}>Hidden 1</text>
        <text x="480" y="290" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill={T.textMute}>Hidden 2</text>
        <text x="660" y="210" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill={T.textMute}>Output</text>
      </svg>
    </div>

    <div className="prose mt-8">
      <h3 className="display h3 mb-3">Activation functions — the source of all power.</h3>
      <p>
        Without a nonlinearity between layers, a 100-layer network collapses to a single linear map. The
        nonlinearity (ReLU, GELU, SiLU, tanh) is what lets depth do work. Modern default:
        <strong> ReLU for hidden layers, softmax on classifier output, no activation on regression output.</strong>
      </p>
    </div>

    <CodeBlock lang="python" title="A working MLP in 12 lines of PyTorch">{`import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )
    def forward(self, x):
        return self.net(x)

model = MLP(784, 256, 10)        # 28x28 image → 10 classes
out = model(torch.randn(32, 784))
print(out.shape)                  # torch.Size([32, 10]) — logits, not probabilities`}</CodeBlock>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 7 — Training loop
// ───────────────────────────────────────────────────────────────────────────────
const Training = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 07 — Deep learning</div>
    <h2 className="display h2 mb-6">The training loop — explicit and complete.</h2>
    <p className="prose">
      <p>
        Frameworks hide this loop behind <code>trainer.fit()</code>. <strong>Read it explicitly once and you
        will understand every framework you ever touch.</strong>
      </p>
    </p>

    <CodeBlock lang="python" title="A complete training loop, no abstractions">{`import torch
from torch.utils.data import DataLoader

model      = MLP(784, 256, 10)
optimizer  = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)
loss_fn    = torch.nn.CrossEntropyLoss()
scheduler  = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)
device     = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

for epoch in range(10):
    # ─── TRAIN ──────────────────────────────────────────
    model.train()
    train_loss = 0.0
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)

        optimizer.zero_grad()           # 1. clear stale gradients
        logits = model(x)               # 2. forward pass
        loss   = loss_fn(logits, y)     # 3. scalar loss
        loss.backward()                 # 4. backprop — fills .grad on every parameter
        optimizer.step()                # 5. apply gradient step
        train_loss += loss.item()

    scheduler.step()                    # 6. decay the learning rate

    # ─── VALIDATE ───────────────────────────────────────
    model.eval()
    correct = total = 0
    with torch.no_grad():               # disable grad tracking — saves memory & compute
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            pred = model(x).argmax(dim=1)
            correct += (pred == y).sum().item()
            total   += y.size(0)

    print(f"epoch={epoch} loss={train_loss/len(train_loader):.4f} val_acc={correct/total:.4f}")`}</CodeBlock>

    <div className="prose mt-8">
      <h3 className="display h3 mb-3">Six lines, six concepts.</h3>
      <ol style={{ counterReset: "step", listStyle: "none", padding: 0 }}>
        {[
          ["zero_grad()", "PyTorch accumulates gradients. If you forget this, every step uses the sum of all past gradients. This is the #1 newcomer bug."],
          ["forward", "Compute predictions. This builds the computation graph that backprop will walk."],
          ["loss", "Reduce predictions + targets to a single scalar. Backprop only works on scalars."],
          ["loss.backward()", "Walk the graph in reverse, applying the chain rule, filling .grad on every leaf tensor."],
          ["optimizer.step()", "Apply the update rule. AdamW: weight decay + adaptive learning rates per parameter."],
          ["scheduler.step()", "Anneal the learning rate. Cosine schedule is a strong default."],
        ].map(([name, desc], i) => (
          <li key={i} style={{ padding: "10px 0", borderBottom: `1px dashed ${T.border}`, display: "grid", gridTemplateColumns: "180px 1fr", gap: 20 }}>
            <code style={{ color: T.gold, fontSize: 13 }}>{name}</code>
            <span style={{ fontSize: 14, color: T.textMute, lineHeight: 1.65 }}>{desc}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 8 — Optimization & Regularization
// ───────────────────────────────────────────────────────────────────────────────
const Optim = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 08 — Deep learning</div>
    <h2 className="display h2 mb-6">Optimisers, schedules, regularisers.</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>Optimisers</div>
        <ul className="prose">
          <li><strong>SGD + momentum</strong> — venerable, well-understood. Used in modern CV training.</li>
          <li><strong>Adam / AdamW</strong> — adaptive learning rates per parameter. AdamW decouples weight decay correctly. <em>Default for most transformer / language work.</em></li>
          <li><strong>Lion, Sophia</strong> — newer optimisers, sometimes faster on LLM-scale training. Worth knowing exist.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.terra }}>Learning rate schedules</div>
        <ul className="prose">
          <li><strong>Constant</strong> — fine for short runs and simple problems.</li>
          <li><strong>Step decay</strong> — drop LR by 10× every N epochs. Classic CV recipe.</li>
          <li><strong>Cosine annealing</strong> — smooth decay to zero. Strong default.</li>
          <li><strong>Warmup + cosine</strong> — ramp up over first 1–5% of steps, then cosine. Essential for transformers.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.sage }}>Regularisation</div>
        <ul className="prose">
          <li><strong>Weight decay (L2)</strong> — penalise large weights. Set via <code>weight_decay</code> in AdamW.</li>
          <li><strong>Dropout</strong> — randomly zero activations during training. Ensemble effect, fights overfitting.</li>
          <li><strong>Early stopping</strong> — halt when validation loss stops improving. Free regulariser.</li>
          <li><strong>Data augmentation</strong> — the most powerful regulariser there is.</li>
          <li><strong>Label smoothing</strong> — soften one-hot targets, prevent overconfidence.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.steel }}>Stability techniques</div>
        <ul className="prose">
          <li><strong>Gradient clipping</strong> — cap <code>‖∇‖</code> to prevent exploding gradients (essential for RNNs, helpful for transformers).</li>
          <li><strong>Batch / layer / group normalisation</strong> — stabilise activations across the layer stack.</li>
          <li><strong>Residual connections</strong> — let gradients flow past nonlinearities. Without these, networks past ~20 layers don't train.</li>
          <li><strong>Mixed precision (bf16/fp16)</strong> — half-precision compute, full-precision accumulators. 2× speed, ~half memory.</li>
        </ul>
      </div>
    </div>

    <div className="prose mt-10">
      <h3 className="display h3 mb-3">Learning rate is the only hyperparameter that always matters.</h3>
      <p>
        If you tune <em>one</em> thing, tune learning rate. Too high and loss diverges into NaN. Too low and
        training plateaus before convergence. Sweep across <code>[1e-5, 1e-4, 3e-4, 1e-3, 3e-3]</code> and
        look at the loss curves — the difference will be obvious.
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 9 — CNNs
// ───────────────────────────────────────────────────────────────────────────────
const CNN = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 09 — Architectures</div>
    <h2 className="display h2 mb-6">Convolutional networks — for things that have a grid.</h2>
    <p className="prose">
      <p>
        A CNN exploits two structural facts about images: <strong>local correlation</strong> (nearby pixels are
        related) and <strong>translation equivariance</strong> (a cat is a cat whether centred or in the corner).
        Convolutions encode both. That is why a CNN with 100k parameters can outperform an MLP with 10M on
        vision tasks — it has the right inductive bias baked in.
      </p>
    </p>

    <div className="mt-8">
      <svg viewBox="0 0 720 220" style={{ width: "100%" }}>
        <Node x={20}  y={90} w={110} h={50} label="Input" sub="3×224×224" />
        <Node x={160} y={90} w={110} h={50} label="Conv + ReLU" sub="64 filters" />
        <Node x={300} y={90} w={110} h={50} label="MaxPool" sub="↓ 2×" />
        <Node x={440} y={90} w={110} h={50} label="Conv blocks" sub="× N, deeper" />
        <Node x={580} y={90} w={110} h={50} label="GAP + FC" sub="logits" />
        {[130, 270, 410, 550].map((x) => <Arrow key={x} x1={x} y1={115} x2={x + 30} y2={115} />)}
      </svg>
    </div>

    <div className="prose mt-6">
      <h4 className="h4">Core operations</h4>
      <ul>
        <li><strong>Convolution</strong> — slide a small filter (e.g. 3×3) across the input, computing dot products at each position. Each filter detects one local pattern.</li>
        <li><strong>Pooling</strong> — downsample to introduce translation invariance and reduce spatial resolution.</li>
        <li><strong>Stride and padding</strong> — control output size; "same" padding preserves spatial dims, stride 2 halves them.</li>
        <li><strong>Global Average Pooling (GAP)</strong> — collapse spatial dims before the classifier head. Replaces giant dense layers.</li>
      </ul>

      <h3 className="display h3 mt-10 mb-3">The lineage worth knowing.</h3>
      <ul>
        <li><strong>LeNet (1998)</strong> — proved CNNs work for digits.</li>
        <li><strong>AlexNet (2012)</strong> — kicked off the deep learning era on ImageNet.</li>
        <li><strong>VGG (2014)</strong> — depth via small 3×3 conv stacks.</li>
        <li><strong>ResNet (2015)</strong> — residual connections enable 100+ layer networks. Still the default backbone.</li>
        <li><strong>EfficientNet (2019)</strong> — compound scaling of depth/width/resolution.</li>
        <li><strong>ConvNeXt (2022)</strong> — modernised CNN matching transformer performance on vision.</li>
        <li><strong>Vision Transformer (ViT, 2020)</strong> — proved attention can replace convolution given enough data.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 10 — RNNs
// ───────────────────────────────────────────────────────────────────────────────
const RNN = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 10 — Architectures</div>
    <h2 className="display h2 mb-6">RNNs &amp; LSTMs — sequence modelling before transformers.</h2>
    <p className="prose">
      <p>
        A recurrent network processes a sequence one element at a time, carrying a hidden state from step to
        step. <strong>The hidden state is the model's memory.</strong> In theory it can remember anything; in
        practice, gradients vanish or explode across long sequences, which is why LSTMs and GRUs were invented —
        explicit gating mechanisms that let information flow across many steps without degrading.
      </p>
    </p>

    <p className="prose">
      <p>
        Why learn them in 2026, when transformers dominate? Two reasons. First, <strong>they remain the right
        tool for low-latency streaming inference</strong> (every step is O(1), not O(n²) like attention).
        Second, <strong>state-space models</strong> (Mamba, S4, RWKV) — the most credible challenger to transformers —
        are direct descendants of RNN ideas with modern conditioning.
      </p>
    </p>

    <CodeBlock lang="python" title="The RNN cell, demystified">{`# A vanilla RNN cell — one step
# h_t = tanh(W_xh @ x_t + W_hh @ h_{t-1} + b)
import torch.nn as nn

cell = nn.RNNCell(input_size=64, hidden_size=128)
h = torch.zeros(batch, 128)
for t in range(seq_len):
    h = cell(x[:, t, :], h)   # h carries history across the sequence`}</CodeBlock>

    <div className="prose mt-6">
      <h4 className="h4">When to reach for an RNN family</h4>
      <ul>
        <li>Streaming inference where you can't wait for a full sequence.</li>
        <li>Very long sequences where transformer attention is prohibitive.</li>
        <li>Embedded / edge inference where transformer memory doesn't fit.</li>
        <li>Time-series forecasting where the autoregressive nature is a natural fit.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 11 — Transformers
// ───────────────────────────────────────────────────────────────────────────────
const Transformer = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 11 — Architectures</div>
    <h2 className="display h2 mb-6">Transformers — the architecture that ate the field.</h2>
    <p className="prose">
      <p>
        Introduced in <em>Attention is All You Need</em> (2017), the transformer replaced recurrence with
        a single, parallelisable operation: <strong>self-attention</strong>. Every token attends to every other
        token in the sequence, weighted by learned similarity. This unlocked GPT, BERT, ViT, AlphaFold, and
        almost every model you have heard of since 2020.
      </p>
    </p>

    <div className="mt-8">
      <div className="h-eyebrow">A transformer block</div>
      <svg viewBox="0 0 720 280" style={{ width: "100%" }}>
        <Node x={40}  y={20}  w={180} h={36} label="Input embeddings" sub="+ positional encoding" />
        <Node x={40}  y={90}  w={180} h={36} label="LayerNorm" />
        <Node x={40}  y={140} w={180} h={36} label="Multi-head attention" stroke={T.gold} />
        <Node x={40}  y={190} w={180} h={36} label="LayerNorm" />
        <Node x={40}  y={240} w={180} h={36} label="Feed-forward MLP" stroke={T.gold} />

        <text x={250} y={155} fontSize="11" fontFamily="JetBrains Mono" fill={T.terra}>+ residual</text>
        <text x={250} y={255} fontSize="11" fontFamily="JetBrains Mono" fill={T.terra}>+ residual</text>

        <Node x={420} y={60} w={260} h={70} label="Attention(Q, K, V)" sub="softmax(QKᵀ / √dₖ) · V" stroke={T.gold} fill={T.bgSunken} />
        <Node x={420} y={170} w={260} h={70} label="Each head learns a relation" sub="syntax, coref, position, etc." stroke={T.borderHi} fill={T.bgSunken} />
      </svg>
    </div>

    <div className="prose mt-6">
      <h3 className="display h3 mb-3">What attention is, in one sentence.</h3>
      <p>
        For each token, compute a weighted average of all other tokens' values, where the weights are the
        softmax of <em>how similar its query is to each token's key</em>. That's it. The Q/K/V are just three
        learned linear projections of the same input.
      </p>

      <h4 className="h4 mt-8">Why it won</h4>
      <ul>
        <li><strong>Parallelism</strong> — unlike RNNs, every token's representation is computed simultaneously. Trains 100× faster on the same hardware.</li>
        <li><strong>Long-range dependency</strong> — direct connection between any two positions, no signal decay through hidden states.</li>
        <li><strong>Scalability</strong> — performance keeps improving with more parameters, more data, more compute. Scaling laws are empirical and remarkably consistent.</li>
        <li><strong>Modality-agnostic</strong> — same architecture handles text, images (ViT), audio, video, proteins.</li>
      </ul>

      <h4 className="h4 mt-8">The three families</h4>
      <ul>
        <li><strong>Encoder-only</strong> (BERT, ViT, embedding models) — bidirectional attention. Best for classification, retrieval, representation learning.</li>
        <li><strong>Decoder-only</strong> (GPT, LLaMA, Claude) — causal attention. Best for generation, chat, code.</li>
        <li><strong>Encoder-decoder</strong> (T5, BART, original transformer) — best for seq2seq: translation, summarisation, structured generation.</li>
      </ul>
    </div>

    <CodeBlock lang="python" title="Scaled dot-product attention from scratch">{`import torch
import torch.nn.functional as F

def attention(Q, K, V, mask=None):
    # Q, K, V: (batch, heads, seq, d_k)
    d_k    = Q.size(-1)
    scores = (Q @ K.transpose(-2, -1)) / (d_k ** 0.5)   # (b, h, s, s)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    weights = F.softmax(scores, dim=-1)
    return weights @ V                                   # (b, h, s, d_k)`}</CodeBlock>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 12 — Use-case-driven training
// ───────────────────────────────────────────────────────────────────────────────
const UseCase = () => {
  const [tab, setTab] = useState("nlp");
  const cases = {
    nlp: {
      title: "Natural language",
      pill: "TEXT",
      pillClass: "pill-gold",
      data: "Text corpora — books, web, dialogue, code. Tokenise with BPE or SentencePiece.",
      arch: "Decoder-only transformer for generation; encoder-only for classification/retrieval.",
      loss: "Cross-entropy over next-token distribution (generative) or class logits (discriminative).",
      eval: "Perplexity, BLEU, ROUGE for generation; accuracy, F1 for classification; MRR, NDCG for retrieval.",
      tip: "Start from a pretrained checkpoint (HuggingFace) and fine-tune. Training from scratch is rarely justified.",
      snippet: `from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments

tok   = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=2
)

def encode(examples):
    return tok(examples["text"], padding="max_length", truncation=True, max_length=256)

ds_train = ds_train.map(encode, batched=True)
ds_val   = ds_val.map(encode, batched=True)

args = TrainingArguments(
    output_dir="out", learning_rate=2e-5, per_device_train_batch_size=16,
    num_train_epochs=3, eval_strategy="epoch", fp16=True
)
Trainer(model=model, args=args, train_dataset=ds_train, eval_dataset=ds_val).train()`
    },
    vision: {
      title: "Computer vision",
      pill: "IMG",
      pillClass: "pill-terra",
      data: "Labelled images. Augment aggressively: random crops, flips, colour jitter, RandAugment, Mixup, CutMix.",
      arch: "ResNet or ConvNeXt for production; ViT when you have >1M labelled images or strong pretraining.",
      loss: "Cross-entropy for classification; focal loss for detection imbalance; IoU/Dice for segmentation.",
      eval: "Top-1/Top-5 accuracy (classification); mAP (detection); mIoU (segmentation).",
      tip: "Always start from ImageNet/JFT pretraining. Fine-tuning beats from-scratch by huge margins on small datasets.",
      snippet: `import torchvision.models as M
import torch.nn as nn

backbone = M.resnet50(weights=M.ResNet50_Weights.IMAGENET1K_V2)
backbone.fc = nn.Linear(backbone.fc.in_features, NUM_CLASSES)

# Freeze early layers, train head + last block
for p in backbone.parameters():       p.requires_grad = False
for p in backbone.layer4.parameters(): p.requires_grad = True
for p in backbone.fc.parameters():     p.requires_grad = True

optimizer = torch.optim.AdamW(
    [p for p in backbone.parameters() if p.requires_grad], lr=1e-4
)`
    },
    tabular: {
      title: "Tabular data",
      pill: "TAB",
      pillClass: "pill-sage",
      data: "Rows and columns. Handle missing values explicitly. Encode categoricals (target encoding, embeddings, or native categorical support).",
      arch: "Gradient-boosted trees (XGBoost / LightGBM / CatBoost). Reach for neural nets only with >1M rows AND complex interactions.",
      loss: "Built into the boosting library — logloss, MSE, quantile, etc.",
      eval: "AUC-ROC, AUC-PR for classification; RMSE, MAE for regression. Always report on a temporally-held-out test set if time is involved.",
      tip: "Feature engineering still beats model engineering for tabular data. Spend time on features.",
      snippet: `import lightgbm as lgb

train_ds = lgb.Dataset(X_train, label=y_train, categorical_feature=cat_cols)
val_ds   = lgb.Dataset(X_val,   label=y_val,   reference=train_ds)

params = dict(
    objective="binary", metric="auc",
    learning_rate=0.05, num_leaves=63, feature_fraction=0.8,
    bagging_fraction=0.8, bagging_freq=5, lambda_l2=1.0,
)
model = lgb.train(
    params, train_ds, num_boost_round=5000, valid_sets=[val_ds],
    callbacks=[lgb.early_stopping(100), lgb.log_evaluation(100)],
)`
    },
    ts: {
      title: "Time-series",
      pill: "TIME",
      pillClass: "pill-steel",
      data: "Strictly ordered observations. NEVER shuffle. Split chronologically — train past, validate near-future, test farther future.",
      arch: "Classical: ARIMA, Prophet. Modern: gradient-boosted trees with lag/rolling features (often wins). Deep: Temporal Fusion Transformer, N-BEATS, PatchTST.",
      loss: "MSE, MAE, MAPE, quantile loss (for prediction intervals).",
      eval: "Walk-forward cross-validation. Single train/test split lies about future performance.",
      tip: "Feature engineering — lags, rolling means, calendar features, holidays, exogenous variables — usually matters more than model choice.",
      snippet: `# Walk-forward validation for time-series
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5, test_size=30)   # rolling 30-day test windows
scores = []
for train_idx, test_idx in tscv.split(X):
    model.fit(X[train_idx], y[train_idx])
    scores.append(mean_absolute_error(y[test_idx], model.predict(X[test_idx])))
print(f"MAE: {np.mean(scores):.3f} ± {np.std(scores):.3f}")`
    },
    rec: {
      title: "Recommenders",
      pill: "REC",
      pillClass: "pill-gold",
      data: "User × item interaction logs. Implicit feedback (clicks, watches) usually dominates explicit (ratings). Beware popularity bias.",
      arch: "Two-tower for retrieval (one tower per side, dot-product similarity). Cross-features in the ranking model. SASRec / BERT4Rec for sequential.",
      loss: "Sampled softmax or BPR for retrieval; logistic / pairwise ranking for ranking model.",
      eval: "Recall@K, NDCG@K, MRR offline; A/B test online — offline metrics frequently lie about user behaviour.",
      tip: "Architecture is a two-stage funnel: retrieval (millions → hundreds) then ranking (hundreds → tens). Don't try to do both in one model.",
      snippet: `# Two-tower retrieval, conceptually
class TwoTower(nn.Module):
    def __init__(self, n_users, n_items, dim=64):
        super().__init__()
        self.user_emb = nn.Embedding(n_users, dim)
        self.item_emb = nn.Embedding(n_items, dim)
    def forward(self, user_ids, item_ids):
        u = self.user_emb(user_ids)
        i = self.item_emb(item_ids)
        return (u * i).sum(dim=-1)         # dot-product similarity

# Training: positive pairs from logs, negatives sampled from the catalogue
# Inference: precompute item vectors → ANN index (FAISS / ScaNN)`
    },
  };

  const c = cases[tab];

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 12 — Use cases</div>
      <h2 className="display h2 mb-6">Training is shaped by the use case.</h2>
      <p className="prose">
        <p>
          The same word "training" means radically different things in different domains. The dataset
          format, the architecture, the loss, the evaluation protocol — all change. Below is the cheat sheet
          for the five recurring shapes of ML problem.
        </p>
      </p>

      <div className="flex gap-1 mt-6 mb-6 border-b overflow-x-auto" style={{ borderColor: T.border }}>
        {Object.entries(cases).map(([k, v]) => (
          <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
            <span className={`pill ${v.pillClass} mr-2`}>{v.pill}</span>{v.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[
          ["Data",         c.data],
          ["Architecture", c.arch],
          ["Loss",         c.loss],
          ["Evaluation",   c.eval],
        ].map(([k, v]) => (
          <div key={k} className="card-flat">
            <div className="h4 mb-2" style={{ color: T.gold }}>{k}</div>
            <p style={{ fontSize: 14, color: T.text, opacity: .9, lineHeight: 1.65, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6" style={{ borderLeft: `2px solid ${T.terra}` }}>
        <div className="h4 mb-2" style={{ color: T.terra }}>Practical tip</div>
        <p style={{ fontSize: 14, color: T.textMute, lineHeight: 1.7, margin: 0 }}>{c.tip}</p>
      </div>

      <CodeBlock lang="python" title={`Reference snippet — ${c.title.toLowerCase()}`}>{c.snippet}</CodeBlock>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 13 — Hyperparameter playground (interactive)
// ───────────────────────────────────────────────────────────────────────────────
const Playground = () => {
  const [lr, setLr]           = useState(3);     // exponent: 1eN
  const [batch, setBatch]     = useState(32);
  const [dropout, setDropout] = useState(20);    // percent
  const [decay, setDecay]     = useState(2);     // exponent
  const [arch, setArch]       = useState("balanced");

  // Toy "training curve" — synthesised from the knobs for didactic feel only
  const curve = useMemo(() => {
    const lrV = Math.pow(10, -lr);
    const dropV = dropout / 100;
    const wdV = Math.pow(10, -decay);
    const archMul = { tiny: 1.3, balanced: 1.0, wide: 0.85 }[arch];

    // Lower lr → slower descent; very high lr → divergence
    const divergence = lrV > 5e-3 ? 1 : 0;
    const overfitPenalty = Math.max(0, 0.4 - dropV) * 0.6;
    const wdEffect = Math.min(0.15, wdV * 5);
    const points = [];
    for (let epoch = 0; epoch <= 20; epoch++) {
      const t = epoch / 20;
      const trainLoss = divergence
        ? 1.0 + epoch * 0.3
        : (2.0 * Math.exp(-t * 4 * archMul) + 0.08);
      const valLoss = divergence
        ? 1.0 + epoch * 0.35
        : (2.0 * Math.exp(-t * 3 * archMul) + 0.08
            + overfitPenalty * Math.max(0, t - 0.45)
            - wdEffect * Math.max(0, t - 0.5));
      points.push({ epoch, trainLoss, valLoss });
    }
    return points;
  }, [lr, batch, dropout, decay, arch]);

  const maxLoss = Math.max(...curve.flatMap(p => [p.trainLoss, p.valLoss]));
  const scaleY  = (v) => 180 - (v / Math.max(maxLoss, 0.01)) * 150;
  const scaleX  = (e) => 60 + (e / 20) * 600;
  const trainPath = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.epoch)} ${scaleY(p.trainLoss)}`).join(" ");
  const valPath   = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.epoch)} ${scaleY(p.valLoss)}`).join(" ");

  const finalGap = curve[curve.length - 1].valLoss - curve[curve.length - 1].trainLoss;
  let diagnosis;
  if (curve[curve.length - 1].trainLoss > 1.5)      diagnosis = { text: "Diverged — lower the learning rate.",         color: T.rust };
  else if (finalGap > 0.4)                          diagnosis = { text: "Overfitting — add dropout or weight decay.",   color: T.terra };
  else if (curve[curve.length - 1].trainLoss > 0.6) diagnosis = { text: "Underfitting — train longer or grow the model.", color: T.steel };
  else                                              diagnosis = { text: "Healthy training — both losses converge.",     color: T.sage };

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 13 — Interactive</div>
      <h2 className="display h2 mb-6">Hyperparameter playground.</h2>
      <p className="prose">
        <p>
          Move the knobs. The loss curves below are a didactic toy — not a real model — but they encode the
          qualitative behaviour you actually see in training: divergence at high learning rate, overfitting
          at low dropout, the regularising effect of weight decay. <strong>Build the intuition here, then
          earn it for real in a notebook.</strong>
        </p>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <div className="h4 mb-4" style={{ color: T.gold }}>Knobs</div>

          <div className="mb-5">
            <div className="flex justify-between text-xs mono" style={{ color: T.textMute }}>
              <span>Learning rate</span><span style={{ color: T.gold }}>1e-{lr}</span>
            </div>
            <input type="range" min="1" max="6" value={lr} onChange={(e) => setLr(+e.target.value)} className="slider mt-2" />
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs mono" style={{ color: T.textMute }}>
              <span>Batch size</span><span style={{ color: T.gold }}>{batch}</span>
            </div>
            <input type="range" min="8" max="256" step="8" value={batch} onChange={(e) => setBatch(+e.target.value)} className="slider mt-2" />
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs mono" style={{ color: T.textMute }}>
              <span>Dropout</span><span style={{ color: T.gold }}>{dropout}%</span>
            </div>
            <input type="range" min="0" max="60" value={dropout} onChange={(e) => setDropout(+e.target.value)} className="slider mt-2" />
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs mono" style={{ color: T.textMute }}>
              <span>Weight decay</span><span style={{ color: T.gold }}>1e-{decay}</span>
            </div>
            <input type="range" min="1" max="5" value={decay} onChange={(e) => setDecay(+e.target.value)} className="slider mt-2" />
          </div>

          <div className="mb-2">
            <div className="text-xs mono mb-2" style={{ color: T.textMute }}>Architecture size</div>
            <div className="flex gap-2">
              {["tiny", "balanced", "wide"].map(a => (
                <button key={a} onClick={() => setArch(a)}
                  className="mono"
                  style={{
                    flex: 1, padding: "8px 0", fontSize: 11,
                    background: arch === a ? T.gold : "transparent",
                    color: arch === a ? T.bg : T.textMute,
                    border: `1px solid ${arch === a ? T.gold : T.border}`,
                    borderRadius: 3, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".1em",
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="h4 mb-4" style={{ color: T.gold }}>Loss curves</div>
          <svg viewBox="0 0 720 220" style={{ width: "100%" }}>
            <line x1="60" y1="30"  x2="60"  y2="180" stroke={T.border} />
            <line x1="60" y1="180" x2="660" y2="180" stroke={T.border} />
            <text x="50" y="35" textAnchor="end" fontSize="9" fontFamily="JetBrains Mono" fill={T.textDim}>loss</text>
            <text x="660" y="200" textAnchor="end" fontSize="9" fontFamily="JetBrains Mono" fill={T.textDim}>epoch →</text>
            <path d={trainPath} fill="none" stroke={T.sage} strokeWidth="1.8" />
            <path d={valPath}   fill="none" stroke={T.gold} strokeWidth="1.8" />
            <text x="660" y={scaleY(curve[curve.length - 1].trainLoss) - 4} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill={T.sage}>train</text>
            <text x="660" y={scaleY(curve[curve.length - 1].valLoss)   + 14} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold}>val</text>
          </svg>
          <div className="mt-4" style={{ padding: "10px 14px", border: `1px solid ${diagnosis.color}55`, borderRadius: 4, background: `${diagnosis.color}10` }}>
            <span className="mono" style={{ fontSize: 12, color: diagnosis.color }}>diagnosis →</span>
            <span style={{ fontSize: 13, color: T.text, marginLeft: 10 }}>{diagnosis.text}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 14 — MLOps
// ───────────────────────────────────────────────────────────────────────────────
const MLOps = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 14 — Production</div>
    <h2 className="display h2 mb-6">MLOps — the part nobody tells you about.</h2>
    <p className="prose">
      <p>
        A model in a Jupyter notebook is not a product. <strong>The path from notebook to production is
        longer than the path from data to notebook.</strong> MLOps is the discipline of making that path
        repeatable: versioning data, tracking experiments, packaging models, serving them at latency,
        monitoring them for drift, and retraining when reality moves.
      </p>
    </p>

    <div className="mt-8">
      <svg viewBox="0 0 880 200" style={{ width: "100%" }}>
        <Node x={20}  y={80} w={120} h={50} label="Data version" sub="DVC, LakeFS" />
        <Node x={170} y={80} w={120} h={50} label="Experiment" sub="W&B, MLflow" />
        <Node x={320} y={80} w={120} h={50} label="Train pipeline" sub="Airflow, Kubeflow" />
        <Node x={470} y={80} w={120} h={50} label="Registry" sub="versioned artifacts" />
        <Node x={620} y={80} w={120} h={50} label="Serve" sub="Triton, BentoML, vLLM" />
        <Node x={770} y={80} w={100} h={50} label="Monitor" sub="drift, latency" stroke={T.gold} />
        {[140, 290, 440, 590, 740].map(x => <Arrow key={x} x1={x} y1={105} x2={x + 30} y2={105} />)}
        <path d={`M 820 130 Q 820 175 410 175 Q 80 175 80 130`} fill="none" stroke={T.terra} strokeDasharray="3 3" />
        <text x={450} y={188} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill={T.terra}>continuous retraining loop</text>
      </svg>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>Reproducibility</div>
        <ul className="prose">
          <li>Pin everything: code, data, env, seed, hardware.</li>
          <li>Version data with DVC, LakeFS, or content-hashed object storage.</li>
          <li>Log every run to W&amp;B / MLflow / Comet — config, metrics, model, system info.</li>
          <li>An experiment you can't reproduce did not happen.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>Serving</div>
        <ul className="prose">
          <li>Convert to ONNX / TorchScript / TensorRT for production inference.</li>
          <li>Batch requests at the server (1ms batching window often wins big).</li>
          <li>Quantise (INT8, FP8, FP4) to cut latency and cost.</li>
          <li>Use vLLM / TGI / TensorRT-LLM for LLM serving — they exist for good reason.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>Monitoring</div>
        <ul className="prose">
          <li>Latency, throughput, error rate — table stakes.</li>
          <li>Input drift — KS test, PSI on feature distributions vs training.</li>
          <li>Output drift — prediction distribution over time.</li>
          <li>Performance drift — when labels arrive late, recompute the production metric.</li>
        </ul>
      </div>
      <div className="card">
        <div className="h4 mb-2" style={{ color: T.gold }}>Continuous training</div>
        <ul className="prose">
          <li>Trigger retraining on a schedule, on drift, or on data-volume threshold.</li>
          <li>Champion / challenger: train a new candidate, shadow it against prod, promote on win.</li>
          <li>Always keep a rollback path. Model regressions happen.</li>
        </ul>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 15 — Pitfalls
// ───────────────────────────────────────────────────────────────────────────────
const Pitfalls = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 15 — Production</div>
    <h2 className="display h2 mb-6">Failure modes — the war stories you don't have yet.</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        ["Training accuracy 99%, production accuracy 60%",
          "Data leakage or distribution mismatch. Audit the split, check timestamps, check feature provenance."],
        ["Loss is NaN after a few steps",
          "Learning rate too high, exploding gradients, division by zero in custom layer, or fp16 underflow. Lower LR, add grad clip, switch to bf16."],
        ["Validation loss never decreases",
          "Bug in data loading (mislabelled, or train and val are swapped), wrong loss function, frozen parameters you forgot to unfreeze."],
        ["Train loss decreases, val loss increases",
          "Classic overfitting. Add regularisation, augment data, reduce capacity, or stop earlier."],
        ["Model works in notebook, fails on server",
          "Preprocessing mismatch. The model never sees the same inputs in production. Always ship the full preprocessing pipeline with the model."],
        ["Inference is too slow",
          "Profile first. Common wins: batch requests, ONNX/TensorRT, quantisation, distillation. Don't optimise blind."],
        ["A/B test shows no lift despite better offline metrics",
          "Offline metric ≠ business metric. Selection bias in your offline evaluation. Trust online over offline."],
        ["Production metrics decay over weeks",
          "Distribution drift. Set up monitoring, schedule periodic retraining."],
        ["Model is biased against subgroup X",
          "Disaggregate metrics by subgroup from day one. If you didn't measure it, you didn't care about it. Investigate dataset composition, sampling, label sources."],
        ["You can't reproduce your own result from last week",
          "No seed, no logged config, no data version. Adopt MLflow / W&B yesterday."],
      ].map(([sym, fix], i) => (
        <div key={i} className="card-flat" style={{ borderLeft: `2px solid ${T.terra}` }}>
          <div className="h4 mb-2" style={{ color: T.terra, fontSize: 12 }}>SYMPTOM</div>
          <div style={{ color: T.text, fontSize: 14, marginBottom: 10, fontFamily: "Fraunces", fontStyle: "italic" }}>{sym}</div>
          <div className="h4 mb-1" style={{ color: T.sage, fontSize: 12 }}>LIKELY CAUSE / FIX</div>
          <div style={{ color: T.textMute, fontSize: 13, lineHeight: 1.6 }}>{fix}</div>
        </div>
      ))}
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 16 — Roadmap
// ───────────────────────────────────────────────────────────────────────────────
const Roadmap = () => {
  const weeks = [
    { w: "W01", phase: "Foundations", title: "Python for ML",
      goals: ["NumPy, Pandas, Matplotlib fluency", "Vectorised thinking — no for-loops over arrays", "Jupyter / VS Code notebook workflow"],
      build: "Reproduce a published EDA on the Titanic or Ames Housing dataset." },
    { w: "W02", phase: "Foundations", title: "Math refresh",
      goals: ["Linear algebra: matmul, broadcasting, SVD intuition", "Calculus: chain rule, partial derivatives", "Probability: distributions, Bayes, MLE"],
      build: "Implement gradient descent for linear regression in pure NumPy — no scikit-learn." },
    { w: "W03", phase: "Foundations", title: "Classical ML I",
      goals: ["Linear / logistic regression, k-NN, decision trees", "Train / val / test discipline", "Cross-validation, stratified splits"],
      build: "Solve a Kaggle Getting Started competition; submit; iterate until top 30%." },
    { w: "W04", phase: "Foundations", title: "Classical ML II",
      goals: ["Random Forests, Gradient Boosting (XGB / LGBM)", "Feature engineering for tabular data", "Bias / variance diagnosis from learning curves"],
      build: "Beat your W03 score using LightGBM + engineered features." },
    { w: "W05", phase: "Deep learning", title: "Neural net foundations",
      goals: ["MLP from scratch in NumPy", "Backprop derived by hand for one layer", "PyTorch basics: tensors, autograd, modules"],
      build: "Train an MLP on MNIST in PyTorch — >97% test accuracy." },
    { w: "W06", phase: "Deep learning", title: "Training dynamics",
      goals: ["Optimisers (SGD, AdamW), LR schedules", "Batch norm, dropout, weight decay", "Reading loss curves like a doctor reads an X-ray"],
      build: "Sweep 5 learning rates, 3 schedules. Plot. Write a one-page report on what you saw." },
    { w: "W07", phase: "Architectures", title: "CNNs for vision",
      goals: ["Convolution, pooling, receptive fields", "ResNet architecture and residual connections", "Transfer learning from ImageNet"],
      build: "Fine-tune ResNet50 on a custom 10-class image dataset (e.g. food101 subset). Hit >85% accuracy." },
    { w: "W08", phase: "Architectures", title: "RNNs & sequence models",
      goals: ["RNN, LSTM, GRU mechanics", "Teacher forcing, beam search", "Why attention replaced recurrence"],
      build: "Train a character-level LSTM to generate Shakespeare-ish text." },
    { w: "W09", phase: "Architectures", title: "Transformers",
      goals: ["Self-attention from scratch", "Encoder / decoder / encoder-decoder differences", "Positional encodings, multi-head attention"],
      build: "Implement attention from scratch. Train a tiny transformer on a toy seq2seq task (number reversal, sort)." },
    { w: "W10", phase: "Use cases", title: "NLP fine-tuning",
      goals: ["HuggingFace Transformers + Datasets", "Fine-tune BERT for classification", "Tokenisation, padding, attention masks"],
      build: "Fine-tune DistilBERT on a sentiment dataset (SST-2 or your own). >90% accuracy." },
    { w: "W11", phase: "Use cases", title: "Vision deep-dive",
      goals: ["Augmentation strategies (Mixup, CutMix, RandAugment)", "Object detection or segmentation primer", "Mixed-precision training"],
      build: "Train a segmentation model on a small custom dataset using a pre-built U-Net or DeepLab." },
    { w: "W12", phase: "Use cases", title: "Time-series & recsys",
      goals: ["Walk-forward CV for time-series", "Two-tower retrieval for recommenders", "When NOT to use deep learning"],
      build: "Pick ONE: a forecasting project with LightGBM + lag features, OR a two-tower recommender on MovieLens." },
    { w: "W13", phase: "Production", title: "Experiment tracking & reproducibility",
      goals: ["W&B or MLflow set up end-to-end", "DVC or content-hashed data versioning", "Seeded, deterministic training"],
      build: "Retrofit one of your prior projects with full experiment tracking and data versioning." },
    { w: "W14", phase: "Production", title: "Serving",
      goals: ["Export to ONNX / TorchScript", "Containerise inference (Docker + FastAPI / BentoML)", "Latency / throughput benchmarking"],
      build: "Serve your W10 NLP model behind a FastAPI endpoint. Measure p50 / p99 latency under load." },
    { w: "W15", phase: "Production", title: "Monitoring & LLMOps",
      goals: ["Drift detection (KS test, PSI)", "Prompt eval frameworks for LLM features", "Cost / latency / quality triangle for LLM apps"],
      build: "Add drift monitoring to your served model. Build a small LLM-powered feature with eval harness." },
    { w: "W16", phase: "Capstone", title: "End-to-end project",
      goals: ["Take ONE problem you care about", "Data → model → eval → serve → monitor → iterate", "Document like you'll be hit by a bus"],
      build: "Ship something. A live demo with a real user. The portfolio piece you point to in interviews." },
  ];

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 16 — The plan</div>
      <h2 className="display h2 mb-4">A 16-week sequential roadmap.</h2>
      <p className="prose">
        <p>
          One week at a time. Four phases. Each week has a learning goal and one <em>build</em> —
          something concrete you ship, commit, and can talk about. Adjust the calendar; do not adjust the
          sequence. The prerequisites are real.
        </p>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-8">
        {[
          { phase: "Weeks 01–04", name: "Foundations",   desc: "Python, math, classical ML. The floor under everything." },
          { phase: "Weeks 05–06", name: "Deep learning", desc: "Neural nets and the training loop, from first principles." },
          { phase: "Weeks 07–12", name: "Architectures + use cases", desc: "CNNs, RNNs, transformers — and how each lands in a real problem domain." },
          { phase: "Weeks 13–16", name: "Production",    desc: "Tracking, serving, monitoring. The half no curriculum teaches." },
        ].map((p, i) => (
          <div key={i} className="card-flat">
            <div className="mono" style={{ color: T.terra, fontSize: 10, letterSpacing: ".15em" }}>{p.phase}</div>
            <div style={{ fontFamily: "Fraunces", fontSize: 20, marginTop: 6, fontWeight: 500 }}>{p.name}</div>
            <p style={{ color: T.textMute, fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {weeks.map((w, i) => (
          <div key={i} className="road-row">
            <div className="road-week">{w.w}</div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className={`pill pill-gold`} style={{ fontSize: 10 }}>{w.phase}</span>
                <span style={{ fontFamily: "Fraunces", fontSize: 18, fontWeight: 500 }}
                      dangerouslySetInnerHTML={{ __html: w.title }} />
              </div>
              <ul style={{ marginTop: 8, padding: 0, listStyle: "none" }}>
                {w.goals.map((g, j) => (
                  <li key={j} style={{ paddingLeft: 18, position: "relative", fontSize: 13, lineHeight: 1.6, color: T.text, opacity: 0.85, padding: "3px 0 3px 18px" }}>
                    <span style={{ position: "absolute", left: 0, color: T.gold }}>·</span>{g}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 8, padding: "8px 12px", background: `${T.sage}10`, borderLeft: `2px solid ${T.sage}`, fontSize: 13, color: T.text }}>
                <span className="mono" style={{ color: T.sage, fontSize: 11, marginRight: 8 }}>BUILD →</span>
                {w.build}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 17 — Mastery checklist (interactive)
// ───────────────────────────────────────────────────────────────────────────────
const Checklist = () => {
  const buckets = useMemo(() => ([
    { name: "Math", items: [
      "I can read matrix shapes off a forward pass without thinking",
      "I can derive the chain rule for a 2-layer network on paper",
      "I can explain cross-entropy as KL divergence vs. one-hot",
      "I can describe what softmax does and why we use logits",
    ]},
    { name: "Classical ML", items: [
      "I have trained linear regression, logistic regression, and a decision tree from scratch",
      "I have used XGBoost / LightGBM end-to-end on a real dataset",
      "I can diagnose underfitting vs. overfitting from a learning curve",
      "I have built a stratified train / val / test split and explained why",
    ]},
    { name: "Deep learning", items: [
      "I have written a complete PyTorch training loop without reference",
      "I have implemented backprop for one layer in NumPy",
      "I can name three optimisers and when to use each",
      "I have used mixed precision, grad clipping, and a LR scheduler",
    ]},
    { name: "Architectures", items: [
      "I have fine-tuned a pretrained CNN on a custom dataset",
      "I have implemented self-attention from scratch",
      "I can explain the difference between encoder-only and decoder-only transformers",
      "I have trained an RNN/LSTM and understand why gradients vanish",
    ]},
    { name: "Use cases", items: [
      "I have shipped a text classifier with HuggingFace",
      "I have done image classification with transfer learning",
      "I have run a tabular project where LightGBM beat my neural net",
      "I have done walk-forward CV on a time-series problem",
    ]},
    { name: "Production", items: [
      "I have logged experiments to W&B or MLflow",
      "I have versioned a dataset (DVC, LakeFS, or hashed storage)",
      "I have served a model behind an HTTP endpoint and measured p99 latency",
      "I have set up drift monitoring on a production feature distribution",
    ]},
  ]), []);

  const [checked, setChecked] = useState(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("ml-checklist") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("ml-checklist", JSON.stringify(checked)); } catch { /* ignore */ }
    }
  }, [checked]);

  const toggle = (key) => setChecked(c => ({ ...c, [key]: !c[key] }));
  const total = buckets.reduce((s, b) => s + b.items.length, 0);
  const done  = Object.values(checked).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 17 — Self-assessment</div>
      <h2 className="display h2 mb-4">Mastery checklist.</h2>
      <p className="prose">
        <p>
          Tick what you've actually <em>done</em>, not what you've read about. Progress saves to your browser.
          At 80%+, you are a competent practitioner. Below 50%, you are still in the foundations phase —
          and that is fine, this checklist is for the year, not the week.
        </p>
      </p>

      <div className="card mt-6" style={{ background: T.bgSunken }}>
        <div className="flex items-center justify-between mb-3">
          <span className="mono" style={{ color: T.textMute, fontSize: 12 }}>progress</span>
          <span className="mono" style={{ color: T.gold, fontSize: 16 }}>{done} / {total} · {pct}%</span>
        </div>
        <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: T.gold, transition: "width .25s ease" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {buckets.map((b) => (
          <div key={b.name} className="card">
            <div className="h4 mb-3" style={{ color: T.gold }}>{b.name}</div>
            <div>
              {b.items.map((item, i) => {
                const key = `${b.name}::${i}`;
                const done = !!checked[key];
                return (
                  <div key={i} onClick={() => toggle(key)}
                       style={{ display: "flex", gap: 10, padding: "8px 0", cursor: "pointer", alignItems: "flex-start" }}>
                    <span className={`check ${done ? "done" : ""}`} style={{ marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: done ? T.textDim : T.text, opacity: done ? .6 : .9, textDecoration: done ? "line-through" : "none", lineHeight: 1.55 }}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 18 — Resources
// ───────────────────────────────────────────────────────────────────────────────
const Resources = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 18 — Going further</div>
    <h2 className="display h2 mb-6">Resources, curated and ranked.</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Books — read in order</div>
        <ul className="prose">
          <li><strong>Hands-On ML with Scikit-Learn, Keras &amp; TensorFlow</strong> — Aurélien Géron. The best practitioner intro, full stop.</li>
          <li><strong>Deep Learning</strong> — Goodfellow, Bengio, Courville. Reference more than cover-to-cover.</li>
          <li><strong>Designing Machine Learning Systems</strong> — Chip Huyen. Production reality, no hand-waving.</li>
          <li><strong>The Elements of Statistical Learning</strong> — Hastie et al. Free PDF. The statistical foundations.</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Courses</div>
        <ul className="prose">
          <li><strong>fast.ai</strong> — code-first, top-down, opinionated. Best on-ramp.</li>
          <li><strong>Andrej Karpathy — Neural Networks: Zero to Hero</strong> — build everything from scratch on YouTube.</li>
          <li><strong>CS231n</strong> (Stanford, vision) and <strong>CS224n</strong> (Stanford, NLP) — lectures on YouTube.</li>
          <li><strong>Hugging Face course</strong> — practical transformers, free.</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Papers worth reading once</div>
        <ul className="prose">
          <li><strong>ImageNet Classification with Deep CNNs</strong> (Krizhevsky 2012) — AlexNet.</li>
          <li><strong>Deep Residual Learning</strong> (He 2015) — ResNet.</li>
          <li><strong>Attention is All You Need</strong> (Vaswani 2017) — transformer.</li>
          <li><strong>BERT</strong> (Devlin 2018), <strong>GPT-3</strong> (Brown 2020), <strong>Chinchilla</strong> (Hoffmann 2022).</li>
          <li><strong>Scaling Laws for Neural Language Models</strong> (Kaplan 2020).</li>
          <li><strong>LoRA</strong> (Hu 2021), <strong>DPO</strong> (Rafailov 2023).</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Tools to learn (in order)</div>
        <ul className="prose">
          <li><strong>NumPy, Pandas, Matplotlib</strong> — the basement.</li>
          <li><strong>scikit-learn</strong> — every classical ML primitive lives here.</li>
          <li><strong>PyTorch</strong> — the framework. Learn this; don't start with TensorFlow.</li>
          <li><strong>HuggingFace Transformers / Datasets</strong> — pretrained-model gravity well.</li>
          <li><strong>Weights &amp; Biases or MLflow</strong> — experiment tracking.</li>
          <li><strong>FastAPI + Docker</strong> — model serving.</li>
          <li><strong>vLLM / TGI</strong> — LLM-specific serving.</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Communities</div>
        <ul className="prose">
          <li><strong>Papers with Code</strong> — paper + repo, ranked by benchmark.</li>
          <li><strong>r/MachineLearning</strong>, <strong>r/LocalLLaMA</strong> — signal-to-noise varies, but pulse-of-the-field.</li>
          <li><strong>Hugging Face Hub</strong> — model zoo + spaces.</li>
          <li><strong>Kaggle</strong> — best place to practise on real data with leaderboard pressure.</li>
        </ul>
      </div>

      <div className="card">
        <div className="h4 mb-3" style={{ color: T.gold }}>Newsletters</div>
        <ul className="prose">
          <li><strong>The Batch</strong> (DeepLearning.AI) — accessible weekly digest.</li>
          <li><strong>Import AI</strong> (Jack Clark) — policy + technical.</li>
          <li><strong>Latent Space</strong> — practitioner-grade depth on AI engineering.</li>
          <li><strong>Sebastian Raschka's Magazine</strong> — deep technical walk-throughs.</li>
        </ul>
      </div>
    </div>

    <div className="card mt-10" style={{ background: `${T.gold}08`, border: `1px solid ${T.gold}55` }}>
      <div className="h-eyebrow" style={{ color: T.gold }}>The closing word</div>
      <p style={{ fontSize: 16, lineHeight: 1.75, color: T.text, opacity: .92, margin: 0 }}>
        ML is a craft. Reading is necessary; building is what makes it stick. Every week of the roadmap has a
        build for a reason — that's the part you'll remember a year from now. The papers and books are scaffolding
        for the builds. <em style={{ color: T.terra }}>Ship something every week, even if it's small. Especially if it's small.</em>
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// Section registry
// ───────────────────────────────────────────────────────────────────────────────
const SECTIONS = {
  intro:        Intro,
  "mental-model": MentalModel,
  math:         MathSection,
  data:         Data,
  classical:    Classical,
  neural:       Neural,
  training:     Training,
  optim:        Optim,
  cnn:          CNN,
  rnn:          RNN,
  transformer:  Transformer,
  usecase:      UseCase,
  playground:   Playground,
  mlops:        MLOps,
  pitfalls:     Pitfalls,
  roadmap:      Roadmap,
  checklist:    Checklist,
  resources:    Resources,
};

// ───────────────────────────────────────────────────────────────────────────────
// Shell
// ───────────────────────────────────────────────────────────────────────────────
export default function MlEngineerTransformation() {
  const [active, setActive] = useState("intro");
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [active]);

  const Section = SECTIONS[active] || Intro;

  return (
    <div className="ml-root" style={{ minHeight: "100vh" }}>
      <GlobalStyles />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{
          background: T.bgSunken, borderRight: `1px solid ${T.border}`,
          padding: "28px 0", position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        }} className="scroll-hide">
          <div style={{ padding: "0 18px 16px" }}>
            <div className="mono" style={{ color: T.terra, fontSize: 10, letterSpacing: ".2em" }}>FIELD GUIDE</div>
            <div className="display" style={{ color: T.text, fontSize: 20, marginTop: 6, lineHeight: 1.15 }}>
              ML for the<br/><em style={{ color: T.gold }}>transitioning engineer</em>
            </div>
          </div>
          <div className="hairline" />
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-section">{g.group}</div>
              {g.items.map((it) => (
                <div key={it.id}
                     className={`nav-link ${active === it.id ? "active" : ""}`}
                     onClick={() => setActive(it.id)}>
                  {it.label}
                </div>
              ))}
            </div>
          ))}
          <div style={{ padding: "18px", marginTop: 24, fontSize: 10, color: T.textDim, fontFamily: "JetBrains Mono", letterSpacing: ".05em" }}>
            v1.0 · 18 sections · ~90 min read
          </div>
        </aside>

        {/* Main */}
        <main ref={mainRef} style={{ overflowY: "auto", height: "100vh" }} className="scroll-hide">
          <div style={{ maxWidth: 920, margin: "0 auto", padding: "60px 56px 120px" }}>
            <Section />
          </div>
        </main>
      </div>
    </div>
  );
}
