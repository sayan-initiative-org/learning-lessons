import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   MCP Deep Dive — Interactive Learning Guide
   Tailored to SDLC Copilot (FIS) · LangGraph · Azure Container Apps
   Baseline spec: 2025-11-25 (stable) · RC: 2026-07-28 (stateless core)
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --canvas:#F4F6F9;
  --surface:#FFFFFF;
  --surface-2:#FBFCFE;
  --ink:#10141C;
  --ink-soft:#525C6B;
  --ink-faint:#8A93A1;
  --line:#E3E7ED;
  --line-strong:#D2D8E0;
  --proto:#2D5BFF;        /* protocol / MCP structural accent */
  --proto-soft:#EAF0FF;
  --copilot:#C2703D;      /* SDLC Copilot accent */
  --copilot-soft:#FBEEE4;
  --ok:#1F9D6B;
  --warn:#C2410C;
  --code-bg:#0F141E;
  --code-bar:#1A2230;
  --code-line:#5A6B82;
  --code-text:#D7DEE9;
  --code-cmt:#6B7A90;
}

*{box-sizing:border-box}
.mcp-root{
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  color:var(--ink);
  background:var(--canvas);
  min-height:100vh;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.mcp-root ::selection{background:var(--proto);color:#fff}

.topbar-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--proto),var(--copilot));z-index:60;transition:width .15s ease}

/* layout */
.shell{display:flex;max-width:1280px;margin:0 auto}
.sidebar{
  width:264px;flex-shrink:0;position:sticky;top:0;height:100vh;
  border-right:1px solid var(--line);background:var(--surface);
  padding:26px 18px;overflow-y:auto;
}
.main{flex:1;min-width:0;padding:0 0 120px}

.brand{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.brand-mark{
  width:30px;height:30px;border-radius:7px;background:var(--ink);
  display:flex;align-items:center;justify-content:center;color:#fff;
  font-family:'JetBrains Mono',monospace;font-weight:600;font-size:13px;letter-spacing:-.5px;
}
.brand-name{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;letter-spacing:-.2px}
.brand-sub{font-size:11px;color:var(--ink-faint);margin:2px 0 22px;font-family:'JetBrains Mono',monospace;letter-spacing:.2px}

.nav-label{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--ink-faint);margin:0 0 10px 8px;font-weight:600}
.nav-item{
  display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  padding:9px 10px;border-radius:8px;border:none;background:transparent;cursor:pointer;
  font-family:inherit;font-size:13.5px;color:var(--ink-soft);margin-bottom:2px;transition:all .14s ease;
}
.nav-item:hover{background:var(--surface-2);color:var(--ink)}
.nav-item.active{background:var(--proto-soft);color:var(--proto);font-weight:500}
.nav-num{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ink-faint);width:18px}
.nav-item.active .nav-num{color:var(--proto)}

.side-foot{margin-top:24px;padding:14px 10px;border-top:1px solid var(--line);font-size:11.5px;color:var(--ink-faint);line-height:1.5}
.side-foot a{color:var(--proto);text-decoration:none}

/* mobile bar */
.mobilebar{display:none;position:sticky;top:0;z-index:50;background:var(--surface);border-bottom:1px solid var(--line);padding:12px 16px;align-items:center;justify-content:space-between}
.menu-btn{border:1px solid var(--line-strong);background:var(--surface);border-radius:8px;padding:7px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;cursor:pointer;color:var(--ink)}
.mobile-drawer{display:none}

/* hero */
.hero{padding:54px 52px 30px;border-bottom:1px solid var(--line);background:
  radial-gradient(900px 320px at 88% -10%, rgba(45,91,255,.06), transparent 60%),
  radial-gradient(700px 300px at 10% 0%, rgba(194,112,61,.05), transparent 55%);
}
.kicker{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.06em;color:var(--proto);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--proto)}
.hero h1{font-family:'Space Grotesk',sans-serif;font-size:42px;line-height:1.05;letter-spacing:-1.4px;margin:0 0 16px;font-weight:600;max-width:18ch}
.hero h1 em{font-style:normal;color:var(--proto)}
.hero p.lede{font-size:16.5px;color:var(--ink-soft);max-width:62ch;margin:0 0 24px}
.badges{display:flex;flex-wrap:wrap;gap:8px}

.pill{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:11.5px;padding:5px 10px;border-radius:999px;border:1px solid var(--line-strong);background:var(--surface);color:var(--ink-soft)}
.pill .pdot{width:6px;height:6px;border-radius:50%}
.pill.stable .pdot{background:var(--ok)}
.pill.rc .pdot{background:var(--copilot)}
.pill.proto{border-color:var(--proto);color:var(--proto);background:var(--proto-soft)}

/* section */
.section{padding:48px 52px;border-bottom:1px solid var(--line);scroll-margin-top:20px}
.sec-head{display:flex;align-items:baseline;gap:16px;margin-bottom:8px}
.sec-num{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--copilot);font-weight:500}
.sec-head h2{font-family:'Space Grotesk',sans-serif;font-size:28px;letter-spacing:-.8px;margin:0;font-weight:600}
.sec-kicker{color:var(--ink-soft);max-width:64ch;margin:0 0 30px;font-size:15px}

h3.blk{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:-.3px;margin:34px 0 12px;font-weight:600;display:flex;align-items:center;gap:9px}
h3.blk .tick{width:4px;height:18px;border-radius:2px;background:var(--proto)}
h3.blk.amber .tick{background:var(--copilot)}
.prose{font-size:15px;color:var(--ink-soft);max-width:70ch;margin:0 0 14px}
.prose strong{color:var(--ink);font-weight:600}
.prose code,.icode{font-family:'JetBrains Mono',monospace;font-size:12.8px;background:#EEF1F6;border:1px solid var(--line);border-radius:5px;padding:1px 6px;color:#2A3340}

/* callouts */
.callout{border:1px solid var(--line);border-left-width:3px;border-radius:10px;padding:14px 16px;margin:18px 0;background:var(--surface);font-size:14px;color:var(--ink-soft);max-width:74ch}
.callout .ctitle{font-weight:600;color:var(--ink);font-size:13px;margin-bottom:4px;display:flex;align-items:center;gap:7px;font-family:'Space Grotesk',sans-serif}
.callout.key{border-left-color:var(--proto);background:var(--proto-soft)}
.callout.warn{border-left-color:var(--warn);background:#FEF3EC}
.callout.note{border-left-color:var(--ink-faint)}
.callout .tag{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;padding:2px 6px;border-radius:4px;background:var(--ink);color:#fff}
.callout.key .tag{background:var(--proto)}
.callout.warn .tag{background:var(--warn)}

/* code */
.code{border-radius:11px;overflow:hidden;margin:18px 0;border:1px solid #20293A;background:var(--code-bg);max-width:840px}
.code__bar{display:flex;align-items:center;justify-content:space-between;background:var(--code-bar);padding:8px 14px;border-bottom:1px solid #232d40}
.code__lang{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8FA0B8;letter-spacing:.04em;text-transform:uppercase}
.code__copy{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8FA0B8;background:transparent;border:1px solid #2C3850;border-radius:6px;padding:3px 9px;cursor:pointer;transition:all .14s}
.code__copy:hover{color:#fff;border-color:#3C4C6C}
.code__body{margin:0;padding:15px 16px;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:12.7px;line-height:1.7;color:var(--code-text)}
.code__body .ln{display:block;white-space:pre}
.cmt{color:var(--code-cmt);font-style:italic}

/* grids & cards */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0;max-width:880px}
.grid-tools{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0;max-width:880px}
.card{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:16px 18px}
.card h4{font-family:'Space Grotesk',sans-serif;font-size:15px;margin:0 0 6px;font-weight:600}
.card p{font-size:13.5px;color:var(--ink-soft);margin:0}

.tool-card{border:1px solid var(--line);border-radius:12px;background:var(--surface);overflow:hidden;transition:border-color .15s,box-shadow .15s}
.tool-card:hover{border-color:var(--line-strong);box-shadow:0 6px 20px -12px rgba(16,20,28,.18)}
.tool-card .tc-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer}
.tc-name{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;color:var(--ink)}
.tc-badge{font-family:'JetBrains Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;padding:3px 7px;border-radius:5px}
.tc-badge.read{background:#E8F4EE;color:var(--ok)}
.tc-badge.write{background:var(--copilot-soft);color:var(--copilot)}
.tc-body{padding:0 16px 15px;border-top:1px solid var(--line);font-size:13px;color:var(--ink-soft)}
.tc-body .lbl{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-faint);display:block;margin:11px 0 3px}
.chev{transition:transform .2s;color:var(--ink-faint);font-size:13px}
.chev.open{transform:rotate(90deg)}

/* principle list */
.principle{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--line);max-width:80ch}
.principle:last-child{border-bottom:none}
.p-idx{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--copilot);flex-shrink:0;width:26px;padding-top:2px}
.p-body h4{font-family:'Space Grotesk',sans-serif;font-size:15.5px;margin:0 0 5px;font-weight:600}
.p-body p{font-size:14px;color:var(--ink-soft);margin:0 0 6px}
.p-apply{font-size:12.5px;color:var(--copilot);background:var(--copilot-soft);border-radius:7px;padding:7px 11px;display:inline-block}
.p-apply b{font-weight:600}

/* table */
.tbl{width:100%;max-width:860px;border-collapse:collapse;margin:18px 0;font-size:13px}
.tbl th{text-align:left;font-family:'JetBrains Mono',monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-faint);padding:9px 12px;border-bottom:1px solid var(--line-strong);font-weight:600}
.tbl td{padding:11px 12px;border-bottom:1px solid var(--line);color:var(--ink-soft);vertical-align:top}
.tbl td:first-child{color:var(--ink);font-family:'JetBrains Mono',monospace;font-size:12px}
.tbl tr:hover td{background:var(--surface-2)}

/* protocol stepper (signature) */
.flow{border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:22px;margin:20px 0;max-width:840px}
.flow-track{position:relative;display:grid;grid-template-columns:1fr 120px 1fr;align-items:center;margin:8px 0 18px}
.lane{border:1px solid var(--line-strong);border-radius:10px;padding:14px 12px;text-align:center;background:var(--surface-2)}
.lane .lname{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px}
.lane .lsub{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--ink-faint);margin-top:2px}
.wire{position:relative;height:48px}
.wire-line{position:absolute;top:50%;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,var(--line-strong) 0 6px,transparent 6px 12px)}
.frame{position:absolute;top:50%;transform:translateY(-50%);width:52px;height:30px;border-radius:7px;background:var(--proto);box-shadow:0 4px 14px -4px rgba(45,91,255,.55);display:flex;align-items:center;justify-content:center;transition:left .5s cubic-bezier(.65,.05,.36,1);}
.frame.toServer{left:0}
.frame.toClient{left:calc(100% - 52px)}
.frame.copilot{background:var(--copilot);box-shadow:0 4px 14px -4px rgba(194,112,61,.55)}
.frame svg{color:#fff}
.flow-detail{background:var(--code-bg);border-radius:10px;padding:13px 15px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--code-text);min-height:64px}
.flow-detail .fm{color:#7DB1FF}
.flow-detail .fd{color:var(--code-cmt);margin-top:6px;font-size:11.5px;font-style:italic}
.flow-ctrl{display:flex;align-items:center;gap:10px;margin-top:14px}
.fbtn{font-family:'JetBrains Mono',monospace;font-size:12px;border:1px solid var(--line-strong);background:var(--surface);border-radius:8px;padding:7px 14px;cursor:pointer;color:var(--ink);transition:all .14s}
.fbtn:hover{border-color:var(--proto);color:var(--proto)}
.fbtn.primary{background:var(--proto);color:#fff;border-color:var(--proto)}
.fbtn:disabled{opacity:.4;cursor:not-allowed}
.fstep{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--ink-faint);margin-left:auto}

/* toggle */
.toggle-row{display:inline-flex;border:1px solid var(--line-strong);border-radius:9px;overflow:hidden;margin:6px 0 16px}
.toggle-row button{font-family:'JetBrains Mono',monospace;font-size:12px;padding:8px 16px;border:none;background:var(--surface);cursor:pointer;color:var(--ink-soft)}
.toggle-row button.on{background:var(--ink);color:#fff}

/* sequence */
.seq{max-width:760px;margin:18px 0}
.seq-step{display:flex;gap:14px;padding:11px 0}
.seq-rail{flex-shrink:0;width:30px;display:flex;flex-direction:column;align-items:center}
.seq-node{width:24px;height:24px;border-radius:50%;border:2px solid var(--proto);color:var(--proto);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;background:var(--surface)}
.seq-conn{flex:1;width:2px;background:var(--line-strong);margin-top:3px}
.seq-step:last-child .seq-conn{display:none}
.seq-body .actor{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--copilot);text-transform:uppercase;letter-spacing:.05em}
.seq-body .what{font-size:14px;color:var(--ink);margin-top:1px}

@media (max-width:900px){
  .sidebar{display:none}
  .mobilebar{display:flex}
  .hero{padding:34px 22px 24px}
  .hero h1{font-size:31px}
  .section{padding:36px 22px}
  .grid2,.grid-tools{grid-template-columns:1fr}
  .flow-track{grid-template-columns:1fr 70px 1fr}
  .mobile-drawer.open{display:block;position:fixed;inset:0;z-index:55;background:var(--surface);padding:20px;overflow-y:auto}
}
@media (prefers-reduced-motion:reduce){
  *{transition:none!important;scroll-behavior:auto!important}
}
`;

/* ---------- syntax-light code block ---------- */
function tokenize(line, lang) {
  const hashLangs = ["python", "bash", "sh", "yaml", "dockerfile", "http", "toml", "ini"];
  const tok = hashLangs.includes(lang) ? "#" : "//";
  let idx = -1;
  if (tok === "#") {
    idx = line.indexOf("#");
  } else {
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === "/" && line[i + 1] === "/" && line[i - 1] !== ":") { idx = i; break; }
    }
  }
  if (idx < 0) return [<span key="c">{line || " "}</span>];
  return [
    <span key="c">{line.slice(0, idx)}</span>,
    <span key="m" className="cmt">{line.slice(idx)}</span>,
  ];
}

function Code({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const copy = () => {
    try { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch (e) {}
  };
  return (
    <div className="code">
      <div className="code__bar">
        <span className="code__lang">{lang}</span>
        <button className="code__copy" onClick={copy}>{copied ? "copied ✓" : "copy"}</button>
      </div>
      <pre className="code__body"><code>
        {lines.map((l, i) => <span className="ln" key={i}>{tokenize(l, lang)}</span>)}
      </code></pre>
    </div>
  );
}

function Callout({ kind = "note", tag, title, children }) {
  return (
    <div className={`callout ${kind}`}>
      <div className="ctitle">{tag && <span className="tag">{tag}</span>}{title}</div>
      <div>{children}</div>
    </div>
  );
}

function ToolCard({ name, sig, write, desc, schema }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tool-card">
      <div className="tc-head" onClick={() => setOpen(!open)}>
        <span className="tc-name">{name}<span style={{ color: "var(--ink-faint)" }}>{sig}</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span className={`tc-badge ${write ? "write" : "read"}`}>{write ? "write" : "read-only"}</span>
          <span className={`chev ${open ? "open" : ""}`}>▶</span>
        </span>
      </div>
      {open && (
        <div className="tc-body">
          <span className="lbl">description — the routing prompt the model reads</span>
          {desc}
          <span className="lbl">input schema (sketch)</span>
          <span className="icode">{schema}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- signature: protocol flow stepper ---------- */
const FLOW = [
  { dir: "toServer", method: "initialize", note: "Client opens the connection, advertises protocolVersion + capabilities + clientInfo.", kind: "proto" },
  { dir: "toClient", method: "→ result + Mcp-Session-Id", note: "Server replies with its capabilities + serverInfo and (2025-11-25) issues a session id.", kind: "proto" },
  { dir: "toServer", method: "notifications/initialized", note: "Client confirms the handshake. The session is now live.", kind: "proto" },
  { dir: "toServer", method: "tools/list", note: "Client fetches the tool catalog: name, description, inputSchema for each tool.", kind: "proto" },
  { dir: "toClient", method: "→ tool definitions", note: "Definitions are converted to the model's native tool-use format and injected into context. The model now KNOWS the tools.", kind: "proto" },
  { dir: "toServer", method: "tools/call", note: "Model emitted a tool_use block → client issues the call with name + arguments matching inputSchema.", kind: "copilot" },
  { dir: "toClient", method: "→ tool_result (content[], isError)", note: "Server validates, runs the handler (your LangGraph node), returns content. Client feeds it back as tool_result; the model continues.", kind: "copilot" },
];

function ProtocolFlow() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = FLOW[i];
  useEffect(() => {
    if (!playing) return;
    if (i >= FLOW.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI((p) => Math.min(p + 1, FLOW.length - 1)), 1400);
    return () => clearTimeout(t);
  }, [playing, i]);
  return (
    <div className="flow">
      <div className="flow-track">
        <div className="lane"><div className="lname">Host / Client</div><div className="lsub">Claude · M365 Copilot</div></div>
        <div className="wire">
          <div className="wire-line" />
          <div className={`frame ${step.dir} ${step.kind === "copilot" ? "copilot" : ""}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              {step.dir === "toServer" ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
            </svg>
          </div>
        </div>
        <div className="lane"><div className="lname">MCP Server</div><div className="lsub">SDLC Copilot · ACA</div></div>
      </div>
      <div className="flow-detail">
        <span className="fm">{step.method}</span>
        <div className="fd">{step.note}</div>
      </div>
      <div className="flow-ctrl">
        <button className="fbtn" onClick={() => { setPlaying(false); setI((p) => Math.max(0, p - 1)); }} disabled={i === 0}>‹ prev</button>
        <button className="fbtn primary" onClick={() => { if (i >= FLOW.length - 1) setI(0); setPlaying(true); }}>{playing ? "playing…" : "▶ play handshake"}</button>
        <button className="fbtn" onClick={() => { setPlaying(false); setI((p) => Math.min(FLOW.length - 1, p + 1)); }} disabled={i === FLOW.length - 1}>next ›</button>
        <span className="fstep">{String(i + 1).padStart(2, "0")} / {String(FLOW.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ---------- sections data ---------- */
const SECTIONS = [
  { id: "deep-dive", num: "01", title: "Implementation Deep Dive" },
  { id: "best-practices", num: "02", title: "Best Practices" },
  { id: "setup", num: "03", title: "Setup" },
  { id: "debugging", num: "04", title: "Debugging" },
  { id: "sdlc", num: "05", title: "SDLC Copilot Tooling" },
  { id: "deploy", num: "06", title: "Build & Deployment" },
];

const TOOLS = [
  { name: "plan_workflow", sig: "(intent, refs?)", write: false, desc: "Route a request to the right generation or refinement nodes. Use as the first call when the user's intent is ambiguous or spans multiple artifact types — it resolves whether to generate vs refine, and which of stories / test cases / scripts to touch.", schema: "{ intent: string, ticket_refs?: string[] }" },
  { name: "fetch_jira_context", sig: "(ticket_keys)", write: false, desc: "Pull existing JIRA tickets, descriptions, and acceptance criteria to ground generation. Use when the user references a ticket key or asks to work from an existing story rather than from free text.", schema: "{ ticket_keys: string[] }" },
  { name: "fetch_tfs_context", sig: "(work_item_ids)", write: false, desc: "Pull Azure DevOps / TFS work items as grounding context. Use when the team's source of truth is TFS rather than JIRA.", schema: "{ work_item_ids: number[] }" },
  { name: "generate_user_stories", sig: "(epic, depth?)", write: true, desc: "Generate INVEST-compliant user stories with acceptance criteria from an epic or feature description. Use when the user asks to draft, create, or expand stories from a requirement — not when stories already exist.", schema: "{ epic_summary: string, acceptance_depth?: 'lite'|'standard'|'deep' }" },
  { name: "refine_user_stories", sig: "(ids, instruction)", write: true, desc: "Refine existing stories — tighten acceptance criteria, add missing scenarios, or regenerate. This is the Refinement BOT surface: use when the user references stories that already exist and wants them improved.", schema: "{ story_ids: string[], instruction: string }" },
  { name: "generate_test_cases", sig: "(story_ids)", write: true, desc: "Derive functional + edge-case test cases from accepted stories. Use after stories are settled and the user wants coverage.", schema: "{ story_ids: string[], style?: 'gherkin'|'tabular' }" },
  { name: "refine_test_cases", sig: "(ids, instruction)", write: true, desc: "Add missing scenarios, negative paths, or boundary cases to existing test cases. Use when the user reviews generated cases and wants gaps closed.", schema: "{ case_ids: string[], instruction: string }" },
  { name: "generate_test_scripts", sig: "(case_ids, fw)", write: true, desc: "Produce automation-ready test scripts from test cases for a target framework. Use when the user wants executable scripts, not just cases.", schema: "{ case_ids: string[], framework: 'playwright'|'selenium'|'rest-assured' }" },
  { name: "refine_test_scripts", sig: "(ids, instruction)", write: true, desc: "Fix, extend, or re-target generated scripts (selectors, assertions, data). Use when scripts exist but need correction or hardening.", schema: "{ script_ids: string[], instruction: string }" },
];

const PRINCIPLES = [
  { t: "Treat the description as a prompt, not a label", p: "The description field is the only thing the model reads to decide selection. It is doing the routing. Write explicit 'use when…' and 'do not use when…' clauses, name the inputs in plain terms, and disambiguate near-neighbours.", a: "Your generate vs refine pairs collide constantly — the description is what stops the model regenerating when the user wanted a tweak." },
  { t: "Design tool boundaries around user intent, not your internals", p: "One tool = one decision the model can reason about. Don't expose a graph's internal nodes as nine micro-tools; expose the nine intents a user actually has. Too many tools dilutes selection accuracy.", a: "Your 9-tool catalog maps to intents (generate/refine × US/TC/TS + context + planner), not to LangGraph nodes." },
  { t: "Make schemas strict and self-describing", p: "Use JSON Schema with enums, required fields, and descriptions per property. The model fills arguments from the schema — vague schemas produce malformed calls. The 2026-07-28 RC adopts full JSON Schema 2020-12 for tools.", a: "Enum the framework and depth params so the model can't invent 'cypress' when you only support three." },
  { t: "Return structured errors, never silent failures", p: "Set isError and return a message the model can act on ('ticket PROJ-12 not found — ask the user to confirm the key'). The model recovers from good errors and loops forever on bad ones.", a: "A 404 from JIRA should become an actionable tool_result, not an exception that kills the turn." },
  { t: "Annotate intent — and trust annotations only from trusted servers", p: "readOnlyHint / destructiveHint / idempotentHint / openWorldHint let the host gate consent. They are hints from the server and must be treated as untrusted unless the server itself is trusted.", a: "Your read-only context fetchers vs write-y generators should carry honest annotations for M365 Copilot's consent UI." },
  { t: "Push state to explicit handles, not the transport", p: "Don't lean on session state. Mint a handle (a run_id, a draft_id) from one tool and have the model pass it back to the next. The 2026-07-28 stateless core makes this the default pattern — and it scales horizontally for free.", a: "A generate_* call returns a draft_id; refine_* takes it back. No sticky sessions on ACA." },
  { t: "Never pass the user's token through — exchange it", p: "Token passthrough is forbidden in the spec to prevent confused-deputy attacks. Validate the inbound token's audience, then exchange via OBO for a least-privilege downstream token.", a: "Inbound Azure AD token → OBO → scoped JIRA/TFS/backend token. Validate aud and iss before trusting anything." },
  { t: "Sanitize tool outputs — they re-enter the model's context", p: "A JIRA description or TFS comment can carry a prompt injection. Tool results are untrusted content. Strip / fence external text before it flows back as tool_result.", a: "Ticket bodies you fetch are attacker-influenced surfaces; treat fetched context as data, not instructions." },
  { t: "Paginate and signal change", p: "List operations should paginate; emit notifications/tools/list_changed when your catalog shifts so clients refresh. Avoid dumping unbounded results into context.", a: "If you gate tools by user role, fire list_changed when entitlements change." },
  { t: "Instrument every call as a span", p: "Wrap each tools/call in a trace with cost + latency + outcome, dimensioned by product / group / use case. This is the same observability spine as your FinOps work.", a: "Phoenix / LangSmith spans per tool call → cost attribution by use case, end to end." },
];

const DEBUG = [
  ["Tool never appears", "Client cached an old tools/list, or schema failed validation", "Restart client / re-run Inspector; validate inputSchema is valid JSON Schema"],
  ["Garbled / no response (stdio)", "Something wrote to stdout and corrupted the JSON-RPC stream", "Route ALL logging to stderr; never print() on a stdio server"],
  ["Model never picks the tool", "Description too vague or overlaps a neighbour", "Rewrite description with explicit 'use when' / 'do not use'; differentiate pairs"],
  ["Malformed arguments", "inputSchema lacks enums / required / per-prop descriptions", "Tighten schema; add constraints so the model can't improvise"],
  ["401 on remote call", "Missing / wrong-audience bearer token", "Check WWW-Authenticate; validate token aud + iss match your API registration"],
  ["403 calling JIRA/TFS", "OBO not configured or downstream scope missing", "Verify OBO consent + the downstream .default scope is granted"],
  ["Works local, fails on ACA", "Sticky-session assumption across replicas", "Make handlers stateless (explicit handles) or pin --min-replicas during debug"],
  ["Elicitation hangs", "Server prompting outside an active request", "Server-initiated requests must occur while processing a client request (2026-07-28 makes this required)"],
];

export default function App() {
  const [active, setActive] = useState("deep-dive");
  const [progress, setProgress] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [topo, setTopo] = useState("session");
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(100, Math.max(0, sc * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => { const el = refs.current[s.id]; if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    setDrawer(false);
    const el = refs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const Nav = () => (
    <>
      <div className="brand">
        <div className="brand-mark">{"{}"}</div>
        <div>
          <div className="brand-name">MCP, end to end</div>
        </div>
      </div>
      <div className="brand-sub">deep dive · SDLC Copilot edition</div>
      <div className="nav-label">Contents</div>
      {SECTIONS.map((s) => (
        <button key={s.id} className={`nav-item ${active === s.id ? "active" : ""}`} onClick={() => go(s.id)}>
          <span className="nav-num">{s.num}</span>{s.title}
        </button>
      ))}
      <div className="side-foot">
        Baseline: <b>2025-11-25</b> (stable).<br />
        Flagged throughout: <b>2026-07-28</b> RC — stateless core.<br />
        <span style={{ color: "var(--ink-faint)" }}>Source: modelcontextprotocol.io</span>
      </div>
    </>
  );

  return (
    <div className="mcp-root">
      <style>{CSS}</style>
      <div className="topbar-progress" style={{ width: `${progress}%` }} />

      <div className="mobilebar">
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600 }}>MCP, end to end</span>
        <button className="menu-btn" onClick={() => setDrawer(!drawer)}>{drawer ? "close ✕" : "menu ☰"}</button>
      </div>
      <div className={`mobile-drawer ${drawer ? "open" : ""}`}><Nav /></div>

      <div className="shell">
        <aside className="sidebar"><Nav /></aside>
        <main className="main">

          {/* HERO */}
          <header className="hero">
            <div className="kicker"><span className="dot" />Model Context Protocol · practitioner guide</div>
            <h1>The protocol that lets a model <em>discover</em> and <em>call</em> your tools.</h1>
            <p className="lede">
              MCP is a JSON-RPC wire protocol between a host's client and your server. The model never executes anything —
              it <strong>recognises</strong> tools from their schemas, emits intent, and the client <strong>invokes</strong> them.
              This guide walks that mechanism end to end and grounds every part in exposing SDLC Copilot's LangGraph workflows
              as a nine-tool catalog on Azure Container Apps.
            </p>
            <div className="badges">
              <span className="pill stable"><span className="pdot" />spec 2025-11-25 · stable</span>
              <span className="pill rc"><span className="pdot" />2026-07-28 · stateless RC</span>
              <span className="pill proto">JSON-RPC 2.0</span>
              <span className="pill">Streamable HTTP · stdio</span>
              <span className="pill">OAuth 2.1 · Azure AD OBO</span>
            </div>
          </header>

          {/* 01 DEEP DIVE */}
          <section className="section" id="deep-dive" ref={(el) => (refs.current["deep-dive"] = el)}>
            <div className="sec-head"><span className="sec-num">01</span><h2>Implementation Deep Dive</h2></div>
            <p className="sec-kicker">
              The whole protocol is three roles passing JSON-RPC messages over a transport. Get the lifecycle and the
              discovery→execution split clear and everything else is detail.
            </p>

            <h3 className="blk"><span className="tick" />The three roles</h3>
            <p className="prose">
              A <strong>host</strong> (Claude Desktop, M365 Copilot, your agent runtime) embeds one <strong>client</strong> per
              server. Each client holds a 1:1 connection to one <strong>server</strong> — your process that exposes capabilities.
              The model lives in the host; it sees tool schemas but issues no network calls itself. The client is the only thing
              that actually talks to your server.
            </p>

            <h3 className="blk"><span className="tick" />What a server exposes</h3>
            <div className="grid2">
              <div className="card"><h4>Tools</h4><p>Model-callable functions (<span className="icode">tools/list</span>, <span className="icode">tools/call</span>). This is where SDLC Copilot lives.</p></div>
              <div className="card"><h4>Resources</h4><p>Readable context addressed by URI (<span className="icode">resources/read</span>) — files, records, docs the model can pull.</p></div>
              <div className="card"><h4>Prompts</h4><p>Reusable templated workflows the user can invoke (<span className="icode">prompts/get</span>).</p></div>
              <div className="card"><h4>Client-side (server→client)</h4><p>Elicitation (ask the user mid-call) and sampling. <span className="icode">Roots / sampling / logging</span> are deprecated in the 2026-07-28 RC.</p></div>
            </div>

            <h3 className="blk"><span className="tick" />The lifecycle, frame by frame</h3>
            <p className="prose">
              Step through the handshake. Watch where the model gains knowledge of your tools (step 5) versus where execution
              actually happens (step 6–7). Blue frames are protocol setup; copper frames are the call your model triggered.
            </p>
            <ProtocolFlow />

            <Callout kind="key" tag="key insight" title="Recognition and execution are different phases">
              At <span className="icode">tools/list</span> the model only <em>learns</em> the tools exist — schemas land in its
              context. Nothing runs. Execution is a separate round trip: the model emits a <span className="icode">tool_use</span>,
              the client issues <span className="icode">tools/call</span>, your handler runs, and the result returns as a
              <span className="icode"> tool_result</span>. The model is a planner; the client is the executor.
            </Callout>

            <h3 className="blk"><span className="tick" />Anatomy of a tool definition</h3>
            <p className="prose">Three fields drive everything. The <strong>description</strong> drives selection; the <strong>inputSchema</strong> drives argument filling.</p>
            <Code lang="python" code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("sdlc-copilot")

@mcp.tool()
def generate_user_stories(epic_summary: str,
                          acceptance_depth: str = "standard") -> str:
    """Generate INVEST-compliant user stories from an epic summary.

    Use when the user asks to draft, create, or expand stories from a
    requirement or feature description. Do NOT use when stories already
    exist and the user wants them refined (use refine_user_stories).
    """
    return run_story_graph(epic_summary, acceptance_depth)  # -> LangGraph

if __name__ == "__main__":
    mcp.run()   # stdio transport by default`} />

            <h3 className="blk"><span className="tick" />Transports — and the stateless shift</h3>
            <div className="toggle-row">
              <button className={topo === "session" ? "on" : ""} onClick={() => setTopo("session")}>2025-11-25 · session</button>
              <button className={topo === "stateless" ? "on" : ""} onClick={() => setTopo("stateless")}>2026-07-28 · stateless</button>
            </div>
            {topo === "session" ? (
              <>
                <p className="prose">
                  Today's stable transport for remote servers is <strong>Streamable HTTP</strong>: a single
                  <span className="icode"> /mcp</span> endpoint. The client <span className="icode">initialize</span>s, the server
                  returns an <span className="icode">Mcp-Session-Id</span>, and every later request carries it — which pins the
                  client to whichever replica issued the session. <span className="icode">stdio</span> remains the transport for
                  local subprocess servers.
                </p>
                <Code lang="http" code={`POST /mcp HTTP/1.1
Mcp-Session-Id: 1868a90c-3a3f-4f5b          # pins to one replica
Content-Type: application/json

{"jsonrpc":"2.0","id":2,"method":"tools/call",
 "params":{"name":"generate_user_stories",
           "arguments":{"epic_summary":"..."}}}`} />
              </>
            ) : (
              <>
                <p className="prose">
                  The 2026-07-28 RC removes the handshake and the session. Protocol version, client info, and capabilities ride in
                  <span className="icode"> _meta</span> on every request; <span className="icode">Mcp-Method</span> /
                  <span className="icode"> Mcp-Name</span> headers make traffic routable and cacheable. Any request can land on any
                  replica — so a plain round-robin load balancer replaces sticky sessions and shared session stores.
                </p>
                <Code lang="http" code={`POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: generate_user_stories            # routable, cacheable
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/call",
 "params":{"name":"generate_user_stories","arguments":{"epic_summary":"..."},
           "_meta":{"io.modelcontextprotocol/clientInfo":{"name":"m365","version":"1"}}}}`} />
              </>
            )}
            <Callout kind="note" tag="why you care" title="This is a deployment decision, not trivia">
              Build handlers stateless now (thread explicit handles like <span className="icode">draft_id</span> instead of relying
              on session memory) and your ACA revision scales horizontally under either spec — you won't refactor when the RC lands.
            </Callout>
          </section>

          {/* 02 BEST PRACTICES */}
          <section className="section" id="best-practices" ref={(el) => (refs.current["best-practices"] = el)}>
            <div className="sec-head"><span className="sec-num">02</span><h2>Best Practices</h2></div>
            <p className="sec-kicker">
              Ten principles that separate a demo server from one that routes correctly, scales, and stays secure under real
              traffic. The copper note on each is how it lands for SDLC Copilot specifically.
            </p>
            {PRINCIPLES.map((p, i) => (
              <div className="principle" key={i}>
                <div className="p-idx">{String(i + 1).padStart(2, "0")}</div>
                <div className="p-body">
                  <h4>{p.t}</h4>
                  <p>{p.p}</p>
                  <span className="p-apply"><b>SDLC Copilot →</b> {p.a}</span>
                </div>
              </div>
            ))}
          </section>

          {/* 03 SETUP */}
          <section className="section" id="setup" ref={(el) => (refs.current["setup"] = el)}>
            <div className="sec-head"><span className="sec-num">03</span><h2>Setup</h2></div>
            <p className="sec-kicker">From zero to a server a client can connect to — local stdio first, then remote Streamable HTTP.</p>

            <h3 className="blk"><span className="tick" />1 · Install the SDK</h3>
            <Code lang="bash" code={`# Python (FastMCP ships in the official mcp package)
uv add "mcp[cli]"

# TypeScript
npm install @modelcontextprotocol/sdk`} />

            <h3 className="blk"><span className="tick" />2 · Define and register tools</h3>
            <p className="prose">The decorator turns the function signature into the <span className="icode">inputSchema</span> and the docstring into the description. Annotate read vs write intent.</p>
            <Code lang="python" code={`@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
def fetch_jira_context(ticket_keys: list[str]) -> dict:
    """Pull existing JIRA tickets + acceptance criteria as grounding context.
    Use when the user references a ticket key or wants to work from an
    existing story rather than free text."""
    return {"tickets": jira_client.batch_get(ticket_keys)}`} />

            <h3 className="blk"><span className="tick" />3 · Run it locally and inspect</h3>
            <p className="prose">The MCP Inspector is a web UI that speaks the protocol — list tools, call them, and watch raw JSON-RPC without wiring up a full host.</p>
            <Code lang="bash" code={`npx @modelcontextprotocol/inspector uv run server.py`} />

            <h3 className="blk"><span className="tick" />4 · Register with a client (stdio)</h3>
            <Code lang="json" code={`{
  "mcpServers": {
    "sdlc-copilot": {
      "command": "uv",
      "args": ["run", "server.py"]
    }
  }
}`} />

            <h3 className="blk"><span className="tick" />5 · Serve remotely (Streamable HTTP)</h3>
            <Code lang="python" code={`# FastMCP exposes an ASGI app for Streamable HTTP at POST /mcp
app = mcp.streamable_http_app()
# uvicorn server:app --host 0.0.0.0 --port 8000`} />
            <Code lang="json" code={`{
  "mcpServers": {
    "sdlc-copilot": {
      "url": "https://sdlc-copilot-mcp.<region>.azurecontainerapps.io/mcp"
    }
  }
}`} />
          </section>

          {/* 04 DEBUGGING */}
          <section className="section" id="debugging" ref={(el) => (refs.current["debugging"] = el)}>
            <div className="sec-head"><span className="sec-num">04</span><h2>Debugging</h2></div>
            <p className="sec-kicker">Most MCP bugs are one of a handful of failure modes. Know the symptom→cause→fix map and you'll resolve them in minutes.</p>

            <Callout kind="warn" tag="golden rule" title="On a stdio server, stdout belongs to the protocol">
              The JSON-RPC stream IS stdout. A stray <span className="icode">print()</span> corrupts it and the client goes silent.
              Route every log line to <span className="icode">stderr</span>.
            </Callout>
            <Code lang="python" code={`import logging, sys
logging.basicConfig(stream=sys.stderr, level=logging.INFO)  # never stdout`} />

            <h3 className="blk"><span className="tick" />Symptom → cause → fix</h3>
            <table className="tbl">
              <thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead>
              <tbody>{DEBUG.map((r, i) => (<tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>))}</tbody>
            </table>

            <h3 className="blk"><span className="tick" />Probe a remote server with curl</h3>
            <p className="prose">Before blaming the client, confirm the server answers the handshake. A 401 here is an auth problem; a clean result means the issue is downstream.</p>
            <Code lang="bash" code={`curl -i https://sdlc-copilot-mcp.<region>.azurecontainerapps.io/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{
        "protocolVersion":"2025-11-25","capabilities":{},
        "clientInfo":{"name":"curl","version":"1.0"}}}'`} />

            <Callout kind="note" tag="auth" title="Read the WWW-Authenticate header">
              A 401 from a remote MCP server returns the authorization server metadata in <span className="icode">WWW-Authenticate</span>.
              That tells you exactly which issuer and audience the client must satisfy — start your token debugging there.
            </Callout>
          </section>

          {/* 05 SDLC COPILOT */}
          <section className="section" id="sdlc" ref={(el) => (refs.current["sdlc"] = el)}>
            <div className="sec-head"><span className="sec-num">05</span><h2>Exposing SDLC Copilot as MCP Tools</h2></div>
            <p className="sec-kicker">
              The centrepiece. One MCP server, a nine-tool catalog, each tool a thin adapter over the unified LangGraph workflow.
              The tools are the model-facing seam; the graph, JIRA/TFS context, and the Refinement BOT sit behind them.
            </p>

            <h3 className="blk amber"><span className="tick" />The nine-tool catalog</h3>
            <p className="prose">Expand any tool to see the description (its routing prompt) and input schema. Note the read/write split — that's what drives the consent UX in M365 Copilot.</p>
            <div className="grid-tools">
              {TOOLS.map((t) => <ToolCard key={t.name} {...t} />)}
            </div>

            <h3 className="blk amber"><span className="tick" />A tool is a thin adapter over the graph</h3>
            <p className="prose">
              The MCP layer stays dumb: validate, exchange the token, invoke the LangGraph workflow, shape the result. All the
              intelligence — conditional edges, generate vs refine routing, the Context Planner — lives in the graph, untouched by
              the protocol.
            </p>
            <Code lang="python" code={`@mcp.tool(annotations={"readOnlyHint": False})
async def refine_user_stories(story_ids: list[str], instruction: str,
                              ctx: Context) -> dict:
    """Refine existing stories — tighten acceptance criteria, add missing
    scenarios, or regenerate. The Refinement BOT surface. Use when the user
    references stories that already exist and wants them improved."""

    # 1. exchange the inbound user token (never pass it through)
    downstream = obo_exchange(ctx.request_context.headers["authorization"])

    # 2. fetch existing artifacts as grounding context (on behalf of user)
    existing = await fetch_jira(story_ids, token=downstream)

    # 3. invoke the unified LangGraph workflow — conditional edge picks refine
    result = await refinement_graph.ainvoke(
        {"stories": existing, "instruction": instruction, "mode": "refine"})

    # 4. shape a structured, model-actionable result
    return {"stories": result["stories"], "changelog": result["diff"],
            "draft_id": result["run_id"]}   # explicit handle for next call`} />

            <h3 className="blk amber"><span className="tick" />The full request path</h3>
            <p className="prose">From an M365 Copilot prompt to artifacts and back — the planner routes intent, the graph does the work, OBO scopes every downstream call.</p>
            <div className="seq">
              {[
                ["M365 Copilot", "User: \u201Crefine the acceptance criteria on PROJ-214\u201D — orchestrator selects a tool from the catalog"],
                ["MCP server (ACA)", "Validate inbound Azure AD token (aud, iss); OBO-exchange for a scoped backend token"],
                ["plan_workflow", "Context Planner resolves intent → refine, artifact → user story"],
                ["fetch_jira_context", "Pull PROJ-214 description + acceptance criteria as grounding"],
                ["LangGraph workflow", "Conditional edge routes to the refine node; Refinement BOT tightens AC, adds scenarios"],
                ["tool_result", "Structured stories + changelog + draft_id returned; Copilot renders, model can chain the next call"],
              ].map((s, i) => (
                <div className="seq-step" key={i}>
                  <div className="seq-rail"><div className="seq-node">{i + 1}</div><div className="seq-conn" /></div>
                  <div className="seq-body"><div className="actor">{s[0]}</div><div className="what">{s[1]}</div></div>
                </div>
              ))}
            </div>

            <h3 className="blk amber"><span className="tick" />Surfacing to M365 Copilot</h3>
            <div className="grid2">
              <div className="card"><h4>Declarative agent</h4><p>Reference the single MCP server from an agent manifest. The catalog flows in; the orchestrator handles selection. Cleanest path for a maintained tool surface.</p></div>
              <div className="card"><h4>Copilot Studio</h4><p>Add the MCP server as a tool source for a custom agent — good when you need Studio's topic/flow authoring around the tools.</p></div>
            </div>
            <Callout kind="key" tag="leverage" title="One seam, every surface">
              Because the catalog is exposed once via MCP, the same nine tools light up Claude, M365 Copilot, Copilot Studio, and
              any future MCP host with zero per-surface integration work. That is the whole argument for the MCP-first strategy.
            </Callout>
          </section>

          {/* 06 DEPLOY */}
          <section className="section" id="deploy" ref={(el) => (refs.current["deploy"] = el)}>
            <div className="sec-head"><span className="sec-num">06</span><h2>Build & Deployment</h2></div>
            <p className="sec-kicker">Containerise the Streamable HTTP server, ship it to Azure Container Apps behind Azure AD, and wire CI/CD so every merge is a new revision.</p>

            <h3 className="blk"><span className="tick" />1 · Containerise</h3>
            <Code lang="dockerfile" code={`FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen --no-dev
COPY . .
EXPOSE 8000
CMD ["uv","run","uvicorn","server:app","--host","0.0.0.0","--port","8000"]`} />

            <h3 className="blk"><span className="tick" />2 · Deploy to Azure Container Apps</h3>
            <Code lang="bash" code={`az containerapp create \\
  --name sdlc-copilot-mcp --resource-group rg-sdlc \\
  --environment cae-sdlc \\
  --image acrsdlc.azurecr.io/sdlc-copilot-mcp:$(git rev-parse --short HEAD) \\
  --target-port 8000 --ingress external \\
  --min-replicas 1 --max-replicas 10 \\
  --env-vars AAD_TENANT_ID=secretref:tenant AAD_CLIENT_ID=secretref:client`} />

            <h3 className="blk"><span className="tick" />3 · Scaling depends on your session model</h3>
            <div className="toggle-row">
              <button className={topo === "session" ? "on" : ""} onClick={() => setTopo("session")}>session (today)</button>
              <button className={topo === "stateless" ? "on" : ""} onClick={() => setTopo("stateless")}>stateless (RC)</button>
            </div>
            {topo === "session" ? (
              <p className="prose">
                Under 2025-11-25, the <span className="icode">Mcp-Session-Id</span> pins a client to one replica. To scale past one
                instance you need <strong>session affinity</strong> at ACA ingress or a shared session store. Easy to miss — it's
                the classic "works on one replica, breaks at scale" bug.
              </p>
            ) : (
              <p className="prose">
                Under 2026-07-28, any request lands on any replica. ACA's default round-robin just works — no affinity, no shared
                store. Set <span className="icode">--min-replicas 0</span> for scale-to-zero on bursty internal traffic and let it
                scale out on concurrency.
              </p>
            )}

            <h3 className="blk"><span className="tick" />4 · Azure AD + OBO</h3>
            <p className="prose">Register the MCP server as an API app, validate inbound tokens, and exchange via the on-behalf-of flow for least-privilege downstream access. Never forward the user's token unchanged.</p>
            <Code lang="python" code={`# Exchange the inbound user token for a scoped downstream token (MSAL)
result = msal_app.acquire_token_on_behalf_of(
    user_assertion=inbound_user_token,
    scopes=["api://sdlc-backend/.default"])   # least privilege
downstream_token = result["access_token"]`} />

            <h3 className="blk"><span className="tick" />5 · CI/CD with GitHub Actions</h3>
            <Code lang="yaml" code={`name: deploy-mcp
on:
  push: { branches: [main] }
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with: { creds: \${{ secrets.AZURE_CREDENTIALS }} }
      - name: Build image in ACR
        run: az acr build -r acrsdlc -t sdlc-copilot-mcp:\${{ github.sha }} .
      - name: Roll a new revision
        run: |
          az containerapp update -n sdlc-copilot-mcp -g rg-sdlc \\
            --image acrsdlc.azurecr.io/sdlc-copilot-mcp:\${{ github.sha }}`} />

            <Callout kind="note" tag="observability" title="Close the loop with FinOps">
              Emit a span per <span className="icode">tools/call</span> tagged with product / group / use case, plus cost + latency.
              That feeds the same Phoenix / LangSmith spine as the rest of SDLC Copilot, so MCP traffic shows up in cost attribution
              instead of being a blind spot.
            </Callout>

            {/* close-out */}
            <h3 className="blk"><span className="tick" />Where this goes next</h3>
            <p className="prose">
              The honest near-term watch item is the <strong>2026-07-28 stateless core</strong> (breaking changes; final ships
              July 28, 2026) and the <strong>Tasks</strong> extension for long-running generation — relevant the moment a full
              test-suite generation outlives a single request. Design the handlers stateless now and adopting either is a config
              change, not a rewrite.
            </p>
            <Callout kind="key" tag="if you remember one thing" title="Tools are a seam, not a feature">
              The model's job is to plan; the client's job is to execute; your server's job is to expose intent-shaped tools and do
              the work behind them. Keep the MCP layer thin and honest, push the intelligence into the graph, and the same nine
              tools serve every host you'll ever target.
            </Callout>
          </section>

        </main>
      </div>
    </div>
  );
}
