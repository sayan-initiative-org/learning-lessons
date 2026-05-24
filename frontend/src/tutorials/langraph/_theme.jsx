// _theme.jsx — shared design system for the LangGraph guide.
// Warm-dark editorial aesthetic (Fraunces + Geist + JetBrains Mono, amber/gold accents).
// Matches MlEngineerTransformation.jsx and the rest of the tutorial set.

import { useState } from "react";

// ───────────────────────────────────────────────────────────────────────────────
// Theme tokens — single source of truth for every LangGraph module
// ───────────────────────────────────────────────────────────────────────────────
export const T = {
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
  plum:      "#9b7bbf",
};

// Legacy color aliases — older module code used blue/purple/teal/amber etc.
// Map each to its closest token so existing call sites keep working.
export const LEGACY = {
  blue:   T.steel,
  purple: T.plum,
  teal:   T.sage,
  amber:  T.gold,
  coral:  T.terra,
  green:  T.sage,
  rust:   T.rust,
  ink:    T.ink,
};

// ───────────────────────────────────────────────────────────────────────────────
// Global styles — injected once per module via <GlobalStyles />
// ───────────────────────────────────────────────────────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .lg-root {
      font-family: 'Geist', system-ui, sans-serif;
      background: ${T.bg};
      color: ${T.text};
      font-feature-settings: "ss01", "cv11";
      letter-spacing: -0.005em;
      min-height: 100vh;
    }
    .lg-root *::selection { background: ${T.gold}; color: ${T.bg}; }

    .display { font-family: 'Fraunces', serif; font-optical-sizing: auto;
               font-variation-settings: "opsz" 96, "SOFT" 50; letter-spacing: -0.03em; }
    .mono    { font-family: 'JetBrains Mono', monospace; }

    .hairline { border-top: 1px solid ${T.border}; }

    .h-eyebrow { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
                 color: ${T.terra}; margin-bottom: 10px; font-weight: 500; }
    .h1 { font-family: 'Fraunces', serif; font-size: 44px; line-height: 1.02; letter-spacing: -0.04em;
          font-weight: 400; font-variation-settings: "opsz" 144; margin: 0 0 8px; }
    .h2 { font-family: 'Fraunces', serif; font-size: 30px; line-height: 1.05; letter-spacing: -0.03em;
          font-weight: 400; font-variation-settings: "opsz" 96; margin: 0 0 8px; }
    .h3 { font-family: 'Fraunces', serif; font-size: 20px; line-height: 1.2; letter-spacing: -0.02em;
          font-weight: 500; font-variation-settings: "opsz" 36; margin: 1.6rem 0 .55rem; }
    .h4 { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          color: ${T.text}; font-weight: 600; }

    .card { background: ${T.bgPanel}; border: 1px solid ${T.border}; border-radius: 4px;
            padding: 20px; transition: border-color .2s; }
    .card:hover { border-color: ${T.borderHi}; }
    .card-flat { background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px; padding: 16px; }

    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; font-size: 11px;
            letter-spacing: 0.05em; border: 1px solid ${T.border}; border-radius: 999px;
            color: ${T.textMute}; font-family: 'JetBrains Mono', monospace; line-height: 1.4; }
    .pill-gold  { color: ${T.gold};  border-color: ${T.gold}55;  background: ${T.gold}10; }
    .pill-terra { color: ${T.terra}; border-color: ${T.terra}55; background: ${T.terra}10; }
    .pill-sage  { color: ${T.sage};  border-color: ${T.sage}55;  background: ${T.sage}10; }
    .pill-steel { color: ${T.steel}; border-color: ${T.steel}55; background: ${T.steel}10; }
    .pill-rust  { color: ${T.rust};  border-color: ${T.rust}55;  background: ${T.rust}10; }
    .pill-plum  { color: ${T.plum};  border-color: ${T.plum}55;  background: ${T.plum}10; }

    .codeblock {
      background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.7;
      overflow: hidden; position: relative; margin: 1rem 0;
    }
    .codeblock-header {
      display:flex; justify-content:space-between; align-items:center;
      padding: 8px 14px; border-bottom: 1px solid ${T.border};
      font-size: 10.5px; color: ${T.textMute}; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .codeblock pre { padding: 14px 18px; margin: 0; color: ${T.text}; opacity: .9;
                     overflow-x: auto; white-space: pre; }
    .codeblock-actions { display: inline-flex; gap: 12px; align-items: center; }
    .codeblock-copy { background: none; border: none; color: ${T.textMute};
                      font-family: inherit; font-size: inherit; letter-spacing: inherit;
                      cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 0; }
    .codeblock-copy:hover { color: ${T.gold}; }

    .callout {
      border-left: 2px solid ${T.gold}; background: ${T.gold}08;
      border-radius: 0 4px 4px 0; padding: 12px 16px; margin: 1rem 0;
      font-size: 13.5px; line-height: 1.7; color: ${T.text}; opacity: .92;
    }
    .callout-tip     { border-left-color: ${T.sage};  background: ${T.sage}10; }
    .callout-warn    { border-left-color: ${T.terra}; background: ${T.terra}10; }
    .callout-danger  { border-left-color: ${T.rust};  background: ${T.rust}10; }
    .callout-pattern { border-left-color: ${T.plum};  background: ${T.plum}10; }
    .callout-info    { border-left-color: ${T.steel}; background: ${T.steel}10; }
    .callout-title { font-weight: 500; margin-bottom: 4px; color: ${T.text}; letter-spacing: 0.01em; }
    .callout code  { font-family: 'JetBrains Mono', monospace; color: ${T.gold};
                     background: ${T.ink}; padding: 1px 6px; border-radius: 3px;
                     border: 1px solid ${T.border}; font-size: 12px; }
    .callout strong { color: ${T.gold}; font-weight: 500; }
    .callout em     { color: ${T.terra}; font-style: italic; }

    table.compare { width: 100%; border-collapse: collapse; font-size: 13px; margin: 1rem 0; }
    table.compare th, table.compare td {
      padding: 10px 14px; text-align: left; border-bottom: 1px solid ${T.border};
      vertical-align: top;
    }
    table.compare th { color: ${T.textMute}; font-weight: 500; font-size: 10.5px;
                       letter-spacing: 0.12em; text-transform: uppercase;
                       border-bottom-color: ${T.borderHi}; }
    table.compare td { color: ${T.text}; opacity: .9; }
    table.compare td.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.gold}; }
    table.compare tr:hover td { background: ${T.bgPanel}40; }

    .anim-fade { animation: fadeIn .3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .scroll-hide::-webkit-scrollbar { width: 6px; height: 6px; }
    .scroll-hide::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

    .tab-btn { padding: 9px 0; font-size: 13px; color: ${T.textMute};
               border-bottom: 1px solid transparent; cursor: pointer; transition: all .15s;
               background: none; border-radius: 0; letter-spacing: 0.04em;
               margin-right: 24px; font-family: inherit; }
    .tab-btn:hover { color: ${T.text}; }
    .tab-btn.active { color: ${T.gold}; border-bottom-color: ${T.gold}; }

    /* sub-tab pills (per-module navigation) */
    .subtab {
      padding: 4px 14px; border-radius: 999px; font-size: 12.5px; font-family: inherit;
      cursor: pointer; background: transparent; color: ${T.textMute};
      border: 1px solid ${T.border}; transition: all .15s; letter-spacing: 0.02em;
    }
    .subtab:hover { color: ${T.text}; border-color: ${T.borderHi}; }
    .subtab.active { color: ${T.gold}; border-color: ${T.gold}55; background: ${T.gold}10; }

    .module-eyebrow {
      font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
      color: ${T.terra}; font-weight: 500; letter-spacing: 0.18em;
      text-transform: uppercase; margin-bottom: 8px;
    }

    .step-row { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px dashed ${T.border}; }
    .step-row:last-child { border-bottom: none; }
    .step-num { font-family: 'JetBrains Mono', monospace; color: ${T.gold};
                font-size: 11px; flex-shrink: 0; }
    .step-text { font-size: 13.5px; color: ${T.text}; opacity: .88; line-height: 1.65; }

    .nav-link {
      display: block; padding: 7px 14px; font-size: 13px; color: ${T.textMute};
      border-left: 1px solid transparent; cursor: pointer; transition: all .15s;
      letter-spacing: 0.02em; background: none; border: none; border-left: 1px solid transparent;
      width: 100%; text-align: left; font-family: inherit;
    }
    .nav-link:hover { color: ${T.text}; }
    .nav-link.active { color: ${T.gold}; border-left-color: ${T.gold}; background: ${T.ink}; }
    .nav-section { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
                   color: ${T.textDim}; padding: 18px 14px 6px; }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────────
// Shared building blocks
// ───────────────────────────────────────────────────────────────────────────────
export function CodeBlock({ file, lang = "python", children }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span>{file || lang}</span>
        <span className="codeblock-actions mono">
          <span style={{ color: T.textDim }}>{lang}</span>
          <button className="codeblock-copy mono" onClick={handleCopy} aria-label="Copy code">
            {copied ? "✓ copied" : "copy"}
          </button>
        </span>
      </div>
      <pre className="scroll-hide">{children}</pre>
    </div>
  );
}

export function Callout({ type = "info", title, children }) {
  const cls = `callout callout-${type}`;
  return (
    <div className={cls}>
      {title && <div className="callout-title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

export function H3({ children, tag, color }) {
  return (
    <h3 className="h3" style={{ color: color || T.text, display: "flex", alignItems: "center", gap: 10 }}>
      <span>{children}</span>
      {tag && (
        <span className="mono pill pill-gold" style={{ fontSize: 10 }}>{tag}</span>
      )}
    </h3>
  );
}

// SectionHeader for the hub-level section pages (S01..S13 in LangGraphGuide.jsx)
export function SectionHeader({ num, title, subtitle, color = T.gold }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
      <div className="mono" style={{ fontSize: 10.5, color, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
        Section {String(num).padStart(2, "0")} / 13
      </div>
      <h2 className="display h2" style={{ color: T.text }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: T.textMute, lineHeight: 1.65, marginTop: 4, maxWidth: 720 }}>{subtitle}</p>}
    </div>
  );
}

// ModuleHeader for standalone modules (01-foundations..09-quick-reference)
export function ModuleHeader({ moduleNum, totalModules = 13, title, subtitle, pills }) {
  return (
    <header style={{ borderBottom: `1px solid ${T.border}`, padding: "36px 40px 28px", background: T.bg }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="module-eyebrow">Module {String(moduleNum).padStart(2, "0")} / {totalModules}</div>
        <h1 className="display h1">{title}</h1>
        {subtitle && <p style={{ color: T.textMute, fontSize: 14, lineHeight: 1.65, maxWidth: 680, marginTop: 4 }}>{subtitle}</p>}
        {pills && pills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
            {pills.map((p, i) => (
              <span key={i} className={`pill ${p.kind ? `pill-${p.kind}` : "pill-gold"}`}>{p.label}</span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export function SubTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`subtab ${active === t.id ? "active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Grid({ cols = 3, gap = 14, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap, margin: "1rem 0" }}>
      {children}
    </div>
  );
}

export function Card({ title, subtitle, accent = T.gold, eyebrow, icon, children }) {
  return (
    <div className="card" style={{ borderTop: `2px solid ${accent}` }}>
      {icon && <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>}
      {eyebrow && <div className="mono" style={{ color: accent, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>{eyebrow}</div>}
      {title && <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.text, marginBottom: 4 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 13, color: T.textMute, lineHeight: 1.6 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

export function DataTable({ headers, rows, monoFirst = true }) {
  return (
    <table className="compare">
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={monoFirst && j === 0 ? "mono" : undefined}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Pill({ kind = "gold", children }) {
  return <span className={`pill pill-${kind}`}>{children}</span>;
}

// Common page wrapper for standalone modules.
export function ModulePage({ children }) {
  return (
    <div className="lg-root">
      <GlobalStyles />
      {children}
    </div>
  );
}

// Content column — used inside each module after ModuleHeader
export function Content({ children, maxWidth = 900 }) {
  return (
    <div style={{ maxWidth, margin: "0 auto", padding: "32px 40px 80px" }}>
      <div className="anim-fade">{children}</div>
    </div>
  );
}
