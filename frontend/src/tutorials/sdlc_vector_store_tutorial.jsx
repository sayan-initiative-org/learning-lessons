import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Clock,
  Filter,
  GitBranch,
  Code2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Library,
  FileText,
  Workflow,
  Boxes,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// SDLC Copilot — Vector Store Strategy: Interactive Tutorial
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#e8b75d";       // amber
const KB = "#a78bfa";           // KB violet
const SESSION = "#5eead4";      // session teal
const BG = "#0b0d12";
const PANEL = "#13161f";
const LINE = "#1f2330";
const TEXT = "#e6e7eb";
const MUTED = "#8a8f9c";

const fonts = {
  display: `"Fraunces", "Times New Roman", serif`,
  body: `"Manrope", system-ui, sans-serif`,
  mono: `"JetBrains Mono", ui-monospace, monospace`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable bits
// ─────────────────────────────────────────────────────────────────────────────

function Pill({ color, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: 999,
        background: `${color}1a`,
        color,
        fontFamily: fonts.mono,
        fontSize: 11,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        border: `1px solid ${color}33`,
      }}
    >
      {children}
    </span>
  );
}

function Code({ children, lang = "python" }) {
  // very lightweight token coloring
  const colorize = (line) => {
    if (lang === "python" || lang === "py") {
      return line
        .replace(
          /(#.*$)/g,
          `<span style="color:#5b6172;font-style:italic">$1</span>`
        )
        .replace(
          /\b(from|import|def|class|return|if|elif|else|for|in|while|with|as|try|except|raise|yield|lambda|async|await|None|True|False|self)\b/g,
          `<span style="color:#e8b75d">$1</span>`
        )
        .replace(
          /\b(str|int|float|list|dict|bool|tuple|set)\b/g,
          `<span style="color:#a78bfa">$1</span>`
        )
        .replace(
          /("[^"]*"|'[^']*')/g,
          `<span style="color:#5eead4">$1</span>`
        )
        .replace(
          /\b(\d+\.?\d*)\b/g,
          `<span style="color:#f7768e">$1</span>`
        );
    }
    if (lang === "yaml") {
      return line
        .replace(/(#.*$)/g, `<span style="color:#5b6172;font-style:italic">$1</span>`)
        .replace(/^(\s*[\w-]+):/g, `<span style="color:#e8b75d">$1</span>:`)
        .replace(/("[^"]*"|'[^']*')/g, `<span style="color:#5eead4">$1</span>`);
    }
    return line;
  };

  return (
    <pre
      style={{
        background: "#070910",
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: "16px 18px",
        overflowX: "auto",
        fontFamily: fonts.mono,
        fontSize: 13,
        lineHeight: 1.65,
        color: "#cdd2dc",
        margin: 0,
      }}
    >
      <code
        dangerouslySetInnerHTML={{
          __html: children
            .split("\n")
            .map((l) => colorize(l))
            .join("\n"),
        }}
      />
    </pre>
  );
}

function Card({ children, color = LINE, style }) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${color}`,
        borderRadius: 12,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function H({ children, kicker }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {kicker && (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: 8,
          }}
        >
          {kicker}
        </div>
      )}
      <h2
        style={{
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 32,
          margin: 0,
          lineHeight: 1.15,
          letterSpacing: -0.5,
          color: TEXT,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function P({ children }) {
  return (
    <p
      style={{
        fontFamily: fonts.body,
        fontSize: 15.5,
        lineHeight: 1.7,
        color: "#c8ccd6",
        margin: "0 0 14px 0",
      }}
    >
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Why two worlds
// ─────────────────────────────────────────────────────────────────────────────
function Step1() {
  return (
    <div>
      <H kicker="01 · The problem">Knowledge and Input are not the same animal</H>
      <P>
        Your SDLC Copilot constantly reads from two very different document
        worlds. The retrieval system has to respect that — or you'll spend the
        next six months debugging "why did the agent quote our 2019 deprecated
        coding standard instead of the design doc the user just uploaded?"
      </P>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 18,
        }}
      >
        <Card color={`${KB}44`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Pill color={KB}>
              <Library size={12} /> Knowledge Base
            </Pill>
            <Library size={20} style={{ color: KB }} />
          </div>
          <ul style={listStyle}>
            <li>Coding standards, ADRs, security policies, framework guides</li>
            <li>Org-wide, shared across thousands of tasks</li>
            <li>Updated weekly / monthly via batch pipeline</li>
            <li>Versioned, audited, often canonical</li>
            <li>Read-heavy. Embedding cost amortized.</li>
          </ul>
        </Card>
        <Card color={`${SESSION}44`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Pill color={SESSION}>
              <FileText size={12} /> Input Documents
            </Pill>
            <FileText size={20} style={{ color: SESSION }} />
          </div>
          <ul style={listStyle}>
            <li>Jira ticket, PRD, design spec, code diff — for THIS task</li>
            <li>Scoped to a thread / user / session</li>
            <li>Written on upload, read in the same conversation</li>
            <li>Often expires within hours or days</li>
            <li>Weighted higher than KB at retrieval time</li>
          </ul>
        </Card>
      </div>
      <div style={{ marginTop: 22 }}>
        <Card color={`${ACCENT}33`}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Sparkles size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: ACCENT,
                  marginBottom: 4,
                }}
              >
                The key insight
              </div>
              <div style={{ color: TEXT, fontSize: 15, lineHeight: 1.6, fontFamily: fonts.body }}>
                These aren't just "two types of documents." They have different{" "}
                <em>lifecycles, scopes, isolation requirements, and retrieval
                weights</em>. Conflating them is the most common production
                failure mode in RAG-backed agents.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Three architecture patterns
// ─────────────────────────────────────────────────────────────────────────────
function Step2() {
  return (
    <div>
      <H kicker="02 · Architecture choices">Three patterns, one decision</H>
      <P>
        Once you accept the two-worlds principle, you have three ways to
        physically organize the storage. They all work — the choice depends on
        your vector DB, your scale, and your tenancy needs.
      </P>

      <PatternCard
        letter="A"
        title="Separate Collections"
        recommended
        pros={[
          "Clean isolation: different schemas, different scaling",
          "Independent retention / TTL policies",
          "Cheaper KB rebuilds (don't touch session data)",
          "Easier compliance (delete a user's data without scanning KB)",
        ]}
        cons={[
          "Two queries at retrieval time (mitigated by async parallel)",
          "Slight infra overhead",
        ]}
        diagram={<DiagramA />}
      />

      <PatternCard
        letter="B"
        title="Single Collection + Metadata Filtering"
        pros={[
          "Simplest infra — one index",
          "Easy to start with (good for prototype)",
        ]}
        cons={[
          "Metadata filtering is slow at scale (post-filter recall problems)",
          "Mixed lifecycles complicate rebuilds and TTL",
          "Privacy: session data sits next to global data — needs careful ACL",
        ]}
        diagram={<DiagramB />}
      />

      <PatternCard
        letter="C"
        title="Namespaces / Multi-tenancy"
        pros={[
          "Best fit for Pinecone, Qdrant collections, Weaviate tenants",
          "One namespace per session_id, one for KB",
          "Instant tenant deletion — drop the namespace",
          "Native isolation, no filtering tax",
        ]}
        cons={[
          "Vendor-coupled",
          "Namespace explosion if sessions are very short-lived",
        ]}
        diagram={<DiagramC />}
      />

      <div style={{ marginTop: 22 }}>
        <Card color={`${ACCENT}33`}>
          <div style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 1.65, color: TEXT }}>
            <strong style={{ color: ACCENT }}>Recommendation for SDLC Copilot:</strong>{" "}
            Start with Pattern A (separate collections). When you scale past
            ~1000 concurrent sessions, evaluate Pattern C with Qdrant
            multi-tenant collections.
          </div>
        </Card>
      </div>
    </div>
  );
}

function PatternCard({ letter, title, pros, cons, diagram, recommended }) {
  return (
    <Card
      color={recommended ? `${ACCENT}66` : LINE}
      style={{ marginTop: 14 }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: recommended ? `${ACCENT}22` : "#1d2230",
            color: recommended ? ACCENT : MUTED,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {letter}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <h3
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 19,
                margin: 0,
                color: TEXT,
              }}
            >
              {title}
            </h3>
            {recommended && <Pill color={ACCENT}>recommended</Pill>}
          </div>
          {diagram && <div style={{ margin: "12px 0" }}>{diagram}</div>}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 8,
            }}
          >
            <div>
              <div style={subhead("#7ee787")}>Pros</div>
              <ul style={listStyle}>
                {pros.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <div style={subhead("#f7768e")}>Cons</div>
              <ul style={listStyle}>
                {cons.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const subhead = (c) => ({
  fontFamily: fonts.mono,
  fontSize: 10.5,
  letterSpacing: 1.4,
  textTransform: "uppercase",
  color: c,
  marginBottom: 6,
});

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  fontFamily: fonts.body,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#c8ccd6",
};

// Architecture mini-diagrams
function DiagramA() {
  return (
    <svg viewBox="0 0 360 90" style={{ width: "100%", height: 90 }}>
      <rect x="2" y="20" width="80" height="50" rx="8" fill={`${KB}22`} stroke={KB} />
      <text x="42" y="42" fontSize="11" fill={KB} fontFamily={fonts.mono} textAnchor="middle">
        kb_collection
      </text>
      <text x="42" y="58" fontSize="9" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        global
      </text>
      <rect x="278" y="20" width="80" height="50" rx="8" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="318" y="42" fontSize="11" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        sessions
      </text>
      <text x="318" y="58" fontSize="9" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        per-thread
      </text>
      <circle cx="180" cy="45" r="20" fill={`${ACCENT}22`} stroke={ACCENT} />
      <text x="180" y="48" fontSize="10" fill={ACCENT} fontFamily={fonts.mono} textAnchor="middle">
        agent
      </text>
      <path d="M 82 45 L 158 45" stroke={KB} strokeDasharray="3 3" fill="none" />
      <path d="M 202 45 L 278 45" stroke={SESSION} strokeDasharray="3 3" fill="none" />
    </svg>
  );
}

function DiagramB() {
  return (
    <svg viewBox="0 0 360 90" style={{ width: "100%", height: 90 }}>
      <rect x="90" y="20" width="180" height="50" rx="8" fill="#1d2230" stroke={LINE} />
      <text x="180" y="38" fontSize="11" fill={TEXT} fontFamily={fonts.mono} textAnchor="middle">
        one_collection
      </text>
      <text x="180" y="56" fontSize="9" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        filter: doc_type = kb | session
      </text>
      <circle cx="35" cy="45" r="18" fill={`${KB}22`} stroke={KB} />
      <text x="35" y="48" fontSize="9" fill={KB} fontFamily={fonts.mono} textAnchor="middle">
        kb
      </text>
      <circle cx="325" cy="45" r="18" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="325" y="48" fontSize="9" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        sess
      </text>
      <path d="M 53 45 L 90 45" stroke={KB} strokeDasharray="3 3" fill="none" />
      <path d="M 270 45 L 307 45" stroke={SESSION} strokeDasharray="3 3" fill="none" />
    </svg>
  );
}

function DiagramC() {
  return (
    <svg viewBox="0 0 360 90" style={{ width: "100%", height: 90 }}>
      <rect x="20" y="10" width="320" height="70" rx="8" fill="#1d2230" stroke={LINE} />
      <text x="180" y="24" fontSize="9" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        sdlc_copilot collection
      </text>
      <rect x="35" y="32" width="70" height="38" rx="5" fill={`${KB}22`} stroke={KB} />
      <text x="70" y="55" fontSize="10" fill={KB} fontFamily={fonts.mono} textAnchor="middle">
        ns:kb
      </text>
      <rect x="120" y="32" width="65" height="38" rx="5" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="152" y="55" fontSize="10" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        ns:s_a1
      </text>
      <rect x="200" y="32" width="65" height="38" rx="5" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="232" y="55" fontSize="10" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        ns:s_b2
      </text>
      <rect x="280" y="32" width="50" height="38" rx="5" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="305" y="55" fontSize="10" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        ns:…
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Chunking, embedding, metadata
// ─────────────────────────────────────────────────────────────────────────────
function Step3() {
  return (
    <div>
      <H kicker="03 · Chunking & metadata">Different docs, different chunk strategies</H>
      <P>
        Same embedding model on both sides (so similarity scores are comparable
        across stores), but the chunking and metadata schemas diverge sharply.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <Card color={`${KB}44`}>
          <Pill color={KB}>
            <Library size={12} /> KB chunking
          </Pill>
          <ul style={{ ...listStyle, marginTop: 12 }}>
            <li><strong>Chunk size:</strong> 800–1200 tokens</li>
            <li><strong>Overlap:</strong> 100–150 tokens at section boundaries</li>
            <li><strong>Strategy:</strong> semantic / hierarchical (respect H1/H2)</li>
            <li><strong>Enrichment:</strong> prepend section path as context</li>
            <li><strong>Dedup:</strong> hash-based, before embedding</li>
          </ul>
        </Card>
        <Card color={`${SESSION}44`}>
          <Pill color={SESSION}>
            <FileText size={12} /> Session chunking
          </Pill>
          <ul style={{ ...listStyle, marginTop: 12 }}>
            <li><strong>Chunk size:</strong> 300–500 tokens (finer-grained)</li>
            <li><strong>Overlap:</strong> 50 tokens</li>
            <li><strong>Strategy:</strong> structure-preserving (PRD sections, code blocks)</li>
            <li><strong>Bonus chunk:</strong> store a 1-paragraph LLM summary for whole-doc recall</li>
            <li><strong>No dedup</strong> — every upload is its own context</li>
          </ul>
        </Card>
      </div>

      <h3 style={{ ...metaTitle }}>Metadata schemas</h3>
      <P>
        Metadata is what makes retrieval actually work in a multi-agent system.
        Each agent (Requirements, Testing, Routing) filters on different fields.
      </P>

      <Code lang="python">{`# KB metadata schema
{
  "doc_type": "kb",
  "source": "engineering-handbook/security.md",
  "doc_id": "sec_v3",
  "version": "3.2.1",
  "section": "OAuth flow > token refresh",
  "sdlc_phase": ["requirements", "design", "testing"],
  "domain": "auth",
  "last_updated": "2026-03-14",
  "owner": "platform-security",
}

# Session metadata schema
{
  "doc_type": "session",
  "session_id": "sess_8f2a",     # MUST exist on every chunk
  "thread_id": "thr_91c0",
  "user_id": "u_4421",
  "agent_scope": ["requirements"], # which sub-agents can read this
  "source_name": "PRD_PaymentRefund_v2.pdf",
  "uploaded_at": "2026-05-19T10:14:00Z",
  "ttl_at": "2026-06-18T10:14:00Z", # 30-day expiry
  "sdlc_phase": "requirements",
}`}</Code>
    </div>
  );
}

const metaTitle = {
  fontFamily: fonts.display,
  fontSize: 22,
  fontWeight: 500,
  color: TEXT,
  margin: "26px 0 10px",
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
function Step4() {
  return (
    <div>
      <H kicker="04 · Lifecycle & retention">Two clocks, two policies</H>
      <P>
        KB ingestion is a batch CI/CD problem. Session ingestion is a
        request-response problem. Treating them with the same pipeline is a
        common anti-pattern.
      </P>

      <Card style={{ marginBottom: 14 }} color={`${KB}44`}>
        <Pill color={KB}>
          <Library size={12} /> KB lifecycle
        </Pill>
        <div style={{ marginTop: 12 }}>
          <Timeline
            stages={[
              { label: "Doc PR merged", color: KB },
              { label: "CI ingest job", color: KB },
              { label: "Embed + upsert with new version", color: KB },
              { label: "Old version soft-deleted (audit kept)", color: KB },
            ]}
          />
        </div>
        <ul style={{ ...listStyle, marginTop: 12 }}>
          <li>Trigger: git push on docs repo, scheduled crawl, or manual</li>
          <li>Versioned: keep <code style={mono}>version</code> field, supersede in-place</li>
          <li>Backfill-able: full rebuild possible without touching sessions</li>
        </ul>
      </Card>

      <Card color={`${SESSION}44`}>
        <Pill color={SESSION}>
          <FileText size={12} /> Session lifecycle
        </Pill>
        <div style={{ marginTop: 12 }}>
          <Timeline
            stages={[
              { label: "User uploads doc", color: SESSION },
              { label: "Chunk + embed on the fly", color: SESSION },
              { label: "Upsert with session_id + ttl_at", color: SESSION },
              { label: "TTL cleanup job nightly", color: SESSION },
            ]}
          />
        </div>
        <ul style={{ ...listStyle, marginTop: 12 }}>
          <li>Latency budget: &lt; 3s for typical PRD (chunk + embed + upsert)</li>
          <li>Two TTL strategies: time-based (30d) or explicit-on-close</li>
          <li>GDPR: deletion by <code style={mono}>user_id</code> filter — Pattern A/C makes this trivial</li>
        </ul>
      </Card>
    </div>
  );
}

const mono = {
  fontFamily: fonts.mono,
  background: "#1d2230",
  padding: "1px 6px",
  borderRadius: 4,
  fontSize: 12.5,
  color: ACCENT,
};

function Timeline({ stages }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {stages.map((s, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              padding: "6px 11px",
              borderRadius: 6,
              background: `${s.color}1a`,
              color: s.color,
              fontFamily: fonts.mono,
              fontSize: 11.5,
              border: `1px solid ${s.color}44`,
            }}
          >
            {s.label}
          </div>
          {i < stages.length - 1 && (
            <span style={{ color: MUTED, alignSelf: "center" }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Retrieval at query time
// ─────────────────────────────────────────────────────────────────────────────
function Step5() {
  return (
    <div>
      <H kicker="05 · Retrieval">Querying both worlds at run time</H>
      <P>
        At query time the agent doesn't care that KB and Session are in
        different stores. The retrieval node fans out, merges, reranks, returns
        a unified top-k.
      </P>

      <Card style={{ marginBottom: 14 }}>
        <FlowDiagram />
      </Card>

      <h3 style={metaTitle}>Merge strategy</h3>
      <P>
        Session docs are <em>more specific</em> than KB docs (they describe the
        task in front of the user). Default to weighting them higher. Two
        common approaches:
      </P>
      <ol style={{ ...listStyle, paddingLeft: 22 }}>
        <li>
          <strong>Weighted RRF (Reciprocal Rank Fusion)</strong> — simple,
          robust, no model needed.{" "}
          <code style={mono}>score = w_kb / (k + rank_kb) + w_sess / (k + rank_sess)</code>{" "}
          with <code style={mono}>w_sess ≈ 1.5 × w_kb</code>.
        </li>
        <li>
          <strong>Cross-encoder rerank</strong> — concatenate both result sets,
          run a reranker (e.g. <code style={mono}>bge-reranker-v2</code>),
          keep top-k. Higher quality, ~50–150ms extra.
        </li>
      </ol>

      <h3 style={metaTitle}>Filtering rules per agent</h3>
      <P>
        Each sub-agent in the SDLC Copilot filters differently. This is where
        metadata pays off.
      </P>
      <Code lang="python">{`# Requirements agent
kb_filter      = {"sdlc_phase": {"$contains": "requirements"}}
session_filter = {"session_id": SID, "agent_scope": {"$contains": "requirements"}}

# Testing & QA agent
kb_filter      = {"sdlc_phase": {"$contains": "testing"}, "domain": {"$in": ["qa", "testing"]}}
session_filter = {"session_id": SID, "agent_scope": {"$contains": "testing"}}

# Routing agent (read-only metadata recon)
kb_filter      = {"doc_type": "kb"}
session_filter = {"session_id": SID}`}</Code>
    </div>
  );
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 720 220" style={{ width: "100%", height: 220 }}>
      {/* Query node */}
      <rect x="20" y="90" width="120" height="44" rx="8" fill={`${ACCENT}22`} stroke={ACCENT} />
      <text x="80" y="117" fontSize="12" fill={ACCENT} fontFamily={fonts.mono} textAnchor="middle">
        agent query
      </text>

      {/* Arrows out */}
      <path d="M 140 105 Q 220 105 240 50" stroke={KB} fill="none" strokeWidth="1.5" />
      <path d="M 140 120 Q 220 120 240 175" stroke={SESSION} fill="none" strokeWidth="1.5" />

      {/* KB store */}
      <rect x="240" y="28" width="180" height="46" rx="8" fill={`${KB}22`} stroke={KB} />
      <text x="330" y="50" fontSize="12" fill={KB} fontFamily={fonts.mono} textAnchor="middle">
        kb_collection.search()
      </text>
      <text x="330" y="64" fontSize="10" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        filter by phase + domain
      </text>

      {/* Session store */}
      <rect x="240" y="152" width="180" height="46" rx="8" fill={`${SESSION}22`} stroke={SESSION} />
      <text x="330" y="174" fontSize="12" fill={SESSION} fontFamily={fonts.mono} textAnchor="middle">
        sessions.search()
      </text>
      <text x="330" y="188" fontSize="10" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        filter by session_id
      </text>

      {/* Merge */}
      <path d="M 420 50 Q 500 50 520 105" stroke={KB} fill="none" strokeWidth="1.5" />
      <path d="M 420 175 Q 500 175 520 120" stroke={SESSION} fill="none" strokeWidth="1.5" />

      <rect x="520" y="90" width="80" height="44" rx="8" fill="#1d2230" stroke={LINE} />
      <text x="560" y="110" fontSize="12" fill={TEXT} fontFamily={fonts.mono} textAnchor="middle">
        merge
      </text>
      <text x="560" y="124" fontSize="10" fill={MUTED} fontFamily={fonts.mono} textAnchor="middle">
        RRF / rerank
      </text>

      {/* To LLM */}
      <path d="M 600 112 L 660 112" stroke={ACCENT} fill="none" strokeWidth="1.5" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
        </marker>
      </defs>
      <rect x="660" y="90" width="50" height="44" rx="8" fill={`${ACCENT}22`} stroke={ACCENT} />
      <text x="685" y="117" fontSize="11" fill={ACCENT} fontFamily={fonts.mono} textAnchor="middle">
        LLM
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Code: end-to-end ingestion & retrieval
// ─────────────────────────────────────────────────────────────────────────────
function Step6() {
  const [tab, setTab] = useState("kb");
  return (
    <div>
      <H kicker="06 · The code">End-to-end with Qdrant + LangChain</H>
      <P>
        Qdrant is a good default — it supports named collections, payload
        filtering at index time, and namespace-style multi-tenancy. Same code
        pattern works on Chroma, Pinecone, Weaviate, or pgvector.
      </P>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          ["kb", "KB ingestion"],
          ["session", "Session upload"],
          ["retrieve", "Retrieval"],
          ["ttl", "TTL cleanup"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${tab === k ? ACCENT : LINE}`,
              background: tab === k ? `${ACCENT}1a` : PANEL,
              color: tab === k ? ACCENT : MUTED,
              fontFamily: fonts.mono,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "kb" && (
        <Code lang="python">{`from qdrant_client import QdrantClient
from qdrant_client.http import models as qm
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

client = QdrantClient(url="http://qdrant:6333")
embedder = OpenAIEmbeddings(model="text-embedding-3-small")  # 1536 dims

# 1) One-time: create the KB collection
client.recreate_collection(
    collection_name="sdlc_kb",
    vectors_config=qm.VectorParams(size=1536, distance=qm.Distance.COSINE),
)
# Index payload fields you'll filter on — without this, filters scan everything
for field in ["sdlc_phase", "domain", "version", "doc_id"]:
    client.create_payload_index("sdlc_kb", field_name=field,
                                field_schema=qm.PayloadSchemaType.KEYWORD)

# 2) Ingest one KB doc
def ingest_kb_doc(path: str, doc_id: str, version: str,
                  sdlc_phases: list, domain: str):
    text = open(path).read()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=120,
        separators=["\\n## ", "\\n### ", "\\n\\n", "\\n", " "],
    )
    chunks = splitter.split_text(text)
    vectors = embedder.embed_documents(chunks)

    points = [
        qm.PointStruct(
            id=f"{doc_id}:{version}:{i}",
            vector=v,
            payload={
                "doc_type": "kb",
                "doc_id": doc_id,
                "version": version,
                "sdlc_phase": sdlc_phases,
                "domain": domain,
                "source": path,
                "chunk_idx": i,
                "text": chunks[i],
            },
        )
        for i, v in enumerate(vectors)
    ]
    client.upsert("sdlc_kb", points=points)

    # supersede older versions of the same doc_id
    client.delete("sdlc_kb", points_selector=qm.FilterSelector(
        filter=qm.Filter(must=[
            qm.FieldCondition(key="doc_id", match=qm.MatchValue(value=doc_id)),
            qm.FieldCondition(key="version", match=qm.MatchExcept(**{"except": [version]})),
        ])
    ))`}</Code>
      )}

      {tab === "session" && (
        <Code lang="python">{`from datetime import datetime, timedelta, timezone

# Create once
client.recreate_collection(
    collection_name="sdlc_sessions",
    vectors_config=qm.VectorParams(size=1536, distance=qm.Distance.COSINE),
)
for field in ["session_id", "thread_id", "user_id", "agent_scope", "ttl_at"]:
    client.create_payload_index("sdlc_sessions", field_name=field,
                                field_schema=qm.PayloadSchemaType.KEYWORD)

def upload_session_doc(file_path: str, session_id: str, thread_id: str,
                       user_id: str, agent_scope: list, sdlc_phase: str,
                       ttl_days: int = 30):
    text = extract_text(file_path)  # PDF/Docx/MD parser of your choice
    # Smaller chunks — input docs are denser and we need fine-grained recall
    splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
    chunks = splitter.split_text(text)

    # Bonus: also store a doc-level summary chunk for whole-doc questions
    summary = summarize_with_llm(text, max_tokens=180)
    all_chunks = [summary] + chunks

    vectors = embedder.embed_documents(all_chunks)
    ttl_at = (datetime.now(timezone.utc) + timedelta(days=ttl_days)).isoformat()
    uploaded = datetime.now(timezone.utc).isoformat()

    points = [
        qm.PointStruct(
            id=f"{session_id}:{thread_id}:{i}",
            vector=v,
            payload={
                "doc_type": "session",
                "session_id": session_id,
                "thread_id": thread_id,
                "user_id": user_id,
                "agent_scope": agent_scope,
                "sdlc_phase": sdlc_phase,
                "source_name": file_path.split("/")[-1],
                "is_summary": i == 0,
                "uploaded_at": uploaded,
                "ttl_at": ttl_at,
                "text": all_chunks[i],
            },
        )
        for i, v in enumerate(vectors)
    ]
    client.upsert("sdlc_sessions", points=points)`}</Code>
      )}

      {tab === "retrieve" && (
        <Code lang="python">{`import asyncio

async def retrieve(query: str, session_id: str, agent: str,
                   sdlc_phase: str, k: int = 6):
    qvec = embedder.embed_query(query)

    kb_filter = qm.Filter(must=[
        qm.FieldCondition(key="doc_type", match=qm.MatchValue(value="kb")),
        qm.FieldCondition(key="sdlc_phase", match=qm.MatchValue(value=sdlc_phase)),
    ])
    sess_filter = qm.Filter(must=[
        qm.FieldCondition(key="session_id", match=qm.MatchValue(value=session_id)),
        qm.FieldCondition(key="agent_scope", match=qm.MatchValue(value=agent)),
    ])

    # Fan out — parallel async
    kb_task   = asyncio.to_thread(client.search, "sdlc_kb",       qvec, kb_filter,   limit=k)
    sess_task = asyncio.to_thread(client.search, "sdlc_sessions", qvec, sess_filter, limit=k)
    kb_hits, sess_hits = await asyncio.gather(kb_task, sess_task)

    # Reciprocal Rank Fusion, session-weighted
    K, w_kb, w_sess = 60, 1.0, 1.5
    scores = {}
    for rank, h in enumerate(kb_hits):
        scores[h.id] = (scores.get(h.id, (0, h))[0] + w_kb / (K + rank), h)
    for rank, h in enumerate(sess_hits):
        scores[h.id] = (scores.get(h.id, (0, h))[0] + w_sess / (K + rank), h)

    fused = sorted(scores.values(), key=lambda x: -x[0])[:k]
    return [h for _, h in fused]`}</Code>
      )}

      {tab === "ttl" && (
        <Code lang="python">{`# Cron job — every night at 03:00
def expire_old_session_chunks():
    now = datetime.now(timezone.utc).isoformat()
    client.delete(
        "sdlc_sessions",
        points_selector=qm.FilterSelector(
            filter=qm.Filter(must=[
                qm.FieldCondition(
                    key="ttl_at",
                    range=qm.Range(lt=now),  # ttl_at < now
                ),
            ])
        ),
    )

# Explicit cleanup on thread close (called by LangGraph on_finish hook)
def purge_thread(thread_id: str):
    client.delete(
        "sdlc_sessions",
        points_selector=qm.FilterSelector(
            filter=qm.Filter(must=[
                qm.FieldCondition(key="thread_id",
                                  match=qm.MatchValue(value=thread_id)),
            ])
        ),
    )

# GDPR — delete all of a user's data without touching KB
def forget_user(user_id: str):
    client.delete(
        "sdlc_sessions",
        points_selector=qm.FilterSelector(
            filter=qm.Filter(must=[
                qm.FieldCondition(key="user_id",
                                  match=qm.MatchValue(value=user_id)),
            ])
        ),
    )`}</Code>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — LangGraph integration
// ─────────────────────────────────────────────────────────────────────────────
function Step7() {
  return (
    <div>
      <H kicker="07 · LangGraph wiring">Plugging it into the SDLC Copilot graph</H>
      <P>
        Retrieval is a node. State carries the keys that scope it. Reducers
        accumulate retrieved context across agent hops without losing
        provenance.
      </P>

      <Code lang="python">{`from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from operator import add

class CopilotState(TypedDict):
    # Stable for the whole thread
    session_id: str
    thread_id: str
    user_id: str

    # Current routing
    sdlc_phase: Literal["requirements", "design", "testing", "deployment"]
    active_agent: str
    user_query: str

    # Accumulated retrieved context — reducer appends across hops
    retrieved: Annotated[list, add]
    answer: str

async def retrieval_node(state: CopilotState) -> dict:
    hits = await retrieve(
        query=state["user_query"],
        session_id=state["session_id"],
        agent=state["active_agent"],
        sdlc_phase=state["sdlc_phase"],
        k=6,
    )
    # Tag with provenance so the LLM/downstream can cite
    enriched = [{
        "text": h.payload["text"],
        "source": h.payload.get("source") or h.payload.get("source_name"),
        "doc_type": h.payload["doc_type"],
        "score": float(h.score),
    } for h in hits]
    return {"retrieved": enriched}

def build_graph():
    g = StateGraph(CopilotState)
    g.add_node("router",     router_node)
    g.add_node("retrieve",   retrieval_node)
    g.add_node("requirements_agent", requirements_agent)
    g.add_node("testing_agent",      testing_agent)

    g.add_edge(START, "router")
    g.add_conditional_edges("router", lambda s: s["active_agent"], {
        "requirements": "retrieve",
        "testing":      "retrieve",
    })
    # After retrieval, dispatch to the right agent
    g.add_conditional_edges("retrieve", lambda s: s["active_agent"], {
        "requirements": "requirements_agent",
        "testing":      "testing_agent",
    })
    g.add_edge("requirements_agent", END)
    g.add_edge("testing_agent",      END)
    return g.compile()`}</Code>

      <Card style={{ marginTop: 16 }} color={`${ACCENT}33`}>
        <div style={{ fontFamily: fonts.body, fontSize: 14.5, color: TEXT, lineHeight: 1.65 }}>
          <strong style={{ color: ACCENT }}>State management note:</strong>{" "}
          The <code style={mono}>session_id</code> stays in state for the whole
          thread — every retrieval hop scopes by it automatically. The{" "}
          <code style={mono}>retrieved</code> field uses the <code style={mono}>add</code>{" "}
          reducer so parallel sub-agents (fan-out) can each contribute context
          without overwriting one another. This is the same reducer pattern
          you've been using for parallel RAG.
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 — Check your understanding
// ─────────────────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: "A user uploads a 40-page PRD. The SDLC Copilot needs to answer questions about it for the next 3 days, then it should disappear. Where does it live?",
    options: [
      "kb_collection — it's a real document, so it belongs in the knowledge base",
      "sdlc_sessions with session_id + ttl_at = now + 3 days",
      "An in-memory cache; vector store is overkill",
      "kb_collection but with doc_type='temp' metadata",
    ],
    answer: 1,
    why:
      "Input docs are scoped to a session and have a finite lifetime. They go in the session store with ttl_at set; the nightly cleanup job purges them. Putting them in KB would pollute global retrieval for everyone else and bypass deletion guarantees.",
  },
  {
    q: "Your retrieval is returning generic KB chunks even when the user's just-uploaded design doc clearly contains the answer. What's the most likely fix?",
    options: [
      "Switch to a larger embedding model",
      "Increase chunk size for session docs",
      "Weight session results higher in the merge (w_sess > w_kb)",
      "Add more KB docs",
    ],
    answer: 2,
    why:
      "When the user has just uploaded a doc, that doc is more specific to the task than anything in KB. The fix is in the merge step — bump w_sess (RRF weight) or rerank session hits up. Reciprocal Rank Fusion with w_sess ≈ 1.5 × w_kb is a solid default.",
  },
  {
    q: "You're using Pattern B (single collection + doc_type metadata) and a user requests GDPR deletion. What's the gotcha?",
    options: [
      "Nothing — filter on user_id and delete",
      "You have to scan the whole collection to find their points; expensive at scale, and you risk false positives if KB chunks accidentally have a user_id field",
      "GDPR doesn't apply to vector stores",
      "You need to re-embed everything",
    ],
    answer: 1,
    why:
      "Pattern B's single-collection design means deletion is a metadata filter across the entire index. At scale that's slow, and any schema drift (a KB doc that picks up a stray user_id) creates real risk. Patterns A and C make GDPR trivial: scoped collection or namespace drop.",
  },
  {
    q: "Why store the same embedding model output for both KB and session chunks instead of optimising each with a different model?",
    options: [
      "It's cheaper at inference time",
      "Cosine similarity is only meaningful when vectors come from the same model — cross-store merge breaks otherwise",
      "Most vector DBs only support one model",
      "Embedding models are all interchangeable",
    ],
    answer: 1,
    why:
      "Vector spaces are model-specific. A score of 0.81 from model A is not comparable to 0.81 from model B. If you want RRF or rerank across KB and session hits, you need the same embedding space. (You can still vary chunk size and metadata freely — those don't affect comparability.)",
  },
  {
    q: "In LangGraph, where does session_id live so every retrieval hop can use it?",
    options: [
      "Hardcoded in each node",
      "A global Python variable",
      "In the graph's State — it's set once at thread start and read by every node",
      "Stored in the vector DB and looked up by query",
    ],
    answer: 2,
    why:
      "State is the persistent baton in LangGraph. session_id, thread_id, and user_id are written to State at thread start and read by every retrieval / agent node downstream. Nodes are stateless workers; the State carries scope.",
  },
];

function Step8() {
  const [picked, setPicked] = useState({});
  const correct = Object.entries(picked).filter(
    ([i, v]) => v === QUIZ[i].answer
  ).length;
  const done = Object.keys(picked).length === QUIZ.length;

  return (
    <div>
      <H kicker="08 · Active recall">Check your understanding</H>
      <P>
        Five questions across recall, application, and synthesis. Click an
        option to see whether it's right and why — no penalty for getting it
        wrong, that's the point.
      </P>

      {QUIZ.map((item, idx) => (
        <Card key={idx} style={{ marginBottom: 14 }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: ACCENT,
              letterSpacing: 1.4,
              marginBottom: 8,
            }}
          >
            Q{idx + 1}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 15.5,
              color: TEXT,
              marginBottom: 14,
              lineHeight: 1.6,
            }}
          >
            {item.q}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {item.options.map((opt, oi) => {
              const isPicked = picked[idx] === oi;
              const isCorrect = oi === item.answer;
              const reveal = picked[idx] !== undefined;
              let bg = PANEL;
              let bd = LINE;
              let col = "#c8ccd6";
              if (reveal && isCorrect) {
                bg = "#0f2018";
                bd = "#2ea071";
                col = "#7ee787";
              } else if (reveal && isPicked && !isCorrect) {
                bg = "#22141a";
                bd = "#a93d4f";
                col = "#f7768e";
              }
              return (
                <button
                  key={oi}
                  onClick={() => {
                    if (picked[idx] === undefined)
                      setPicked({ ...picked, [idx]: oi });
                  }}
                  disabled={picked[idx] !== undefined}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${bd}`,
                    background: bg,
                    color: col,
                    fontFamily: fonts.body,
                    fontSize: 14,
                    cursor: picked[idx] === undefined ? "pointer" : "default",
                    lineHeight: 1.5,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  {reveal && isCorrect && (
                    <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  )}
                  {reveal && isPicked && !isCorrect && (
                    <XCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  )}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {picked[idx] !== undefined && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: "#0f1320",
                border: `1px solid ${LINE}`,
                fontFamily: fonts.body,
                fontSize: 13.5,
                color: "#b8bcc7",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: ACCENT }}>Why: </strong>
              {item.why}
            </div>
          )}
        </Card>
      ))}

      {done && (
        <Card color={`${ACCENT}44`} style={{ marginTop: 8 }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 22,
              color: ACCENT,
              marginBottom: 4,
            }}
          >
            {correct} / {QUIZ.length} correct
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 14, color: TEXT, lineHeight: 1.6 }}>
            {correct === 5 &&
              "You've got the model. Time to wire this into the SDLC Copilot graph."}
            {correct >= 3 && correct < 5 &&
              "Solid. Re-read the steps for the questions you missed — the answers are subtle but they matter in production."}
            {correct < 3 &&
              "Worth a second pass. The 'why' notes under each question are the actual teaching content."}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { title: "The two worlds", icon: Boxes, component: Step1 },
  { title: "Architecture patterns", icon: Layers, component: Step2 },
  { title: "Chunking & metadata", icon: Filter, component: Step3 },
  { title: "Lifecycle", icon: Clock, component: Step4 },
  { title: "Retrieval", icon: GitBranch, component: Step5 },
  { title: "The code", icon: Code2, component: Step6 },
  { title: "LangGraph wiring", icon: Workflow, component: Step7 },
  { title: "Check yourself", icon: Database, component: Step8 },
];

export default function Tutorial() {
  const [step, setStep] = useState(0);
  const Comp = STEPS[step].component;
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(1200px 700px at 80% -10%, #1a1530 0%, transparent 60%), ${BG}`,
        color: TEXT,
        fontFamily: fonts.body,
        paddingBottom: 80,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header
        style={{
          padding: "26px 28px 0",
          maxWidth: 940,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 10.5,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 4,
              }}
            >
              SDLC Copilot · Tutorial
            </div>
            <h1
              style={{
                fontFamily: fonts.display,
                fontSize: 26,
                fontWeight: 500,
                margin: 0,
                letterSpacing: -0.6,
                color: TEXT,
              }}
            >
              Vector Store Strategy
            </h1>
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: MUTED,
            }}
          >
            STEP {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            height: 3,
            background: "#191e2b",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${ACCENT}, ${KB})`,
              transition: "width 0.4s cubic-bezier(.2,.7,.3,1)",
            }}
          />
        </div>

        {/* Step rail */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 6,
            marginTop: 16,
          }}
        >
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 11px",
                  borderRadius: 7,
                  border: `1px solid ${active ? ACCENT : LINE}`,
                  background: active ? `${ACCENT}1a` : "transparent",
                  color: active ? ACCENT : done ? TEXT : MUTED,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Icon size={12} />
                {s.title}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <main
        style={{
          maxWidth: 940,
          margin: "30px auto 0",
          padding: "0 28px",
        }}
      >
        <Comp />
      </main>

      {/* Footer nav */}
      <footer
        style={{
          maxWidth: 940,
          margin: "40px auto 0",
          padding: "0 28px",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={navBtn(step === 0)}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <button
          onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
          disabled={step === STEPS.length - 1}
          style={navBtn(step === STEPS.length - 1, true)}
        >
          Next <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}

function navBtn(disabled, primary) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 8,
    border: `1px solid ${primary ? ACCENT : LINE}`,
    background: primary ? `${ACCENT}1a` : PANEL,
    color: primary ? ACCENT : TEXT,
    fontFamily: fonts.mono,
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.35 : 1,
    letterSpacing: 0.5,
  };
}
