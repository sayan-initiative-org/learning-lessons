import React from "react";
import { Link } from "react-router-dom";
import { GitBranch, Layers, BookOpen, ArrowRight } from "lucide-react";
import { tutorials } from "../lib/tutorials";

const PANEL = "#13161f";
const LINE = "#1f2330";
const TEXT = "#e6e7eb";
const MUTED = "#8a8f9c";
const ACCENT = "#e8b75d";

const HUBS = [
  {
    slug: "langgraph-guide",
    title: "LangGraph",
    subtitle: "Foundations → Agents → Memory → Multi-Agent → Production",
    badge: "9 modules",
    Icon: GitBranch,
  },
  {
    slug: "evaluation-framework",
    title: "Evaluation Framework",
    subtitle: "Phase Rollout · Validate → Harden → Scale → Comprehensive Recs",
    badge: "5 documents",
    Icon: Layers,
  },
];

// Sub-collection members that belong inside a hub, not listed standalone
const HUB_SLUGS = new Set([
  "langgraph-guide",
  "evaluation-framework",
  "01-foundations",
  "02-agents-tools",
  "03-memory-persistence",
  "04-multi-agent",
  "05-parallel-patterns",
  "06-streaming-production",
  "07-rag-patterns",
  "08-sdlc-copilot-architecture",
  "09-quick-reference",
  "02-phase-1-validate",
  "03-phase-2-harden",
  "04-phase-3-scale",
  "05-comprehensive-recs",
]);

const standalones = tutorials.filter((t) => !HUB_SLUGS.has(t.slug));

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 16,
  margin: "0 0 40px",
};

export function TutorialsPage() {
  const total = HUBS.length + standalones.length;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px" }}>
      <header style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: 36,
            fontWeight: 300,
            color: TEXT,
            margin: 0,
          }}
        >
          Tutorials
        </h1>
        <p
          style={{
            fontFamily: '"Manrope", system-ui, sans-serif',
            fontSize: 14,
            color: MUTED,
            marginTop: 8,
          }}
        >
          {total} lesson{total !== 1 ? "s" : ""} — click to open
        </p>
      </header>

      {/* Collections */}
      <SectionLabel>Collections</SectionLabel>
      <div style={GRID}>
        {HUBS.map(({ slug, title, subtitle, badge, Icon }) => (
          <Link key={slug} to={`/tutorials/${slug}`} style={{ textDecoration: "none" }}>
            <Card accent>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon size={18} color={ACCENT} strokeWidth={1.5} />
                <Badge>{badge}</Badge>
              </div>
              <div
                style={{
                  fontFamily: '"Manrope", system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 500,
                  color: TEXT,
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: MUTED, lineHeight: 1.5, flex: 1 }}>
                {subtitle}
              </div>
              <ArrowRight size={16} color={MUTED} style={{ marginTop: 14 }} />
            </Card>
          </Link>
        ))}
      </div>

      {/* Standalone tutorials */}
      {standalones.length > 0 && (
        <>
          <SectionLabel>Standalone</SectionLabel>
          <div style={GRID}>
            {standalones.map((t) => (
              <Link key={t.slug} to={`/tutorials/${t.slug}`} style={{ textDecoration: "none" }}>
                <Card>
                  <BookOpen size={18} color={ACCENT} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                  <div
                    style={{
                      fontFamily: '"Manrope", system-ui, sans-serif',
                      fontSize: 15,
                      fontWeight: 500,
                      color: TEXT,
                      marginBottom: 6,
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: MUTED, lineHeight: 1.5, flex: 1 }}>
                    {t.summary}
                  </div>
                  <ArrowRight size={16} color={MUTED} style={{ marginTop: 14 }} />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9,
        fontWeight: 600,
        color: MUTED,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9,
        fontWeight: 600,
        color: ACCENT,
        background: `${ACCENT}18`,
        border: `1px solid ${ACCENT}44`,
        borderRadius: 3,
        padding: "1px 6px",
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px",
        background: PANEL,
        border: `1px solid ${LINE}`,
        borderTop: accent ? `2px solid ${ACCENT}` : `1px solid ${LINE}`,
        borderRadius: 10,
        transition: "border-color 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = ACCENT;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = LINE;
      }}
    >
      {children}
    </div>
  );
}
