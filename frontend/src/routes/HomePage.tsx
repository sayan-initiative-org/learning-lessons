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

export function HomePage() {
  const total = HUBS.length + standalones.length;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
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
      <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {HUBS.map(({ slug, title, subtitle, badge, Icon }) => (
          <li key={slug}>
            <Link to={`/tutorials/${slug}`} style={{ textDecoration: "none" }}>
              <HoverCard accent>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Icon size={18} color={ACCENT} strokeWidth={1.5} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 15, fontWeight: 500, color: TEXT }}>
                        {title}
                      </span>
                      <Badge>{badge}</Badge>
                    </div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: MUTED }}>
                      {subtitle}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color={MUTED} />
              </HoverCard>
            </Link>
          </li>
        ))}
      </ul>

      {/* Standalone tutorials */}
      {standalones.length > 0 && (
        <>
          <SectionLabel>Standalone</SectionLabel>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {standalones.map((t) => (
              <li key={t.slug}>
                <Link to={`/tutorials/${t.slug}`} style={{ textDecoration: "none" }}>
                  <HoverCard>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <BookOpen size={18} color={ACCENT} strokeWidth={1.5} />
                      <span style={{ fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 15, fontWeight: 500, color: TEXT }}>
                        {t.title}
                      </span>
                    </div>
                    <ArrowRight size={16} color={MUTED} />
                  </HoverCard>
                </Link>
              </li>
            ))}
          </ul>
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
        marginBottom: 10,
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

function HoverCard({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
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
