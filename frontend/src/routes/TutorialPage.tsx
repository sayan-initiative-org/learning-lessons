import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { findTutorial } from "../lib/tutorials";
import { AlertTriangle, Loader2 } from "lucide-react";

const ACCENT = "#e8b75d";
const MUTED = "#8a8f9c";
const LINE = "#1f2330";

export function TutorialPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? findTutorial(slug) : undefined;

  // Lazy-load the tutorial component on demand. Memoized because hash links re-render
  // this route: a new lazy() would re-suspend, collapse the page and lose the scroll.
  const TutorialComponent = useMemo(() => (meta ? lazy(meta.load) : null), [meta]);

  if (!TutorialComponent) {
    return <NotFound slug={slug} />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      {/* Error boundary wraps the tutorial so a broken tutorial doesn't crash the shell */}
      <TutorialErrorBoundary slug={slug!}>
        <TutorialComponent />
        <ScrollToHashOnLoad />
      </TutorialErrorBoundary>
    </Suspense>
  );
}

// The browser can't jump to a #section on page load because the tutorial isn't rendered yet.
function ScrollToHashOnLoad() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, []);

  return null;
}

// ─── Loading ────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: "60vh",
        color: MUTED,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13,
      }}
    >
      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
      Loading tutorial…
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Not Found ───────────────────────────────────────────────────────────────

function NotFound({ slug }: { slug: string | undefined }) {
  return (
    <div
      style={{
        maxWidth: 540,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <AlertTriangle size={32} color={ACCENT} strokeWidth={1.5} style={{ marginBottom: 16 }} />
      <p style={{ color: MUTED, fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14 }}>
        No tutorial found for slug <code style={{ fontFamily: '"JetBrains Mono", monospace', color: ACCENT }}>{slug}</code>.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "8px 16px",
          border: `1px solid ${LINE}`,
          borderRadius: 6,
          color: MUTED,
          textDecoration: "none",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
        }}
      >
        ← Back to all tutorials
      </Link>
    </div>
  );
}

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface BoundaryProps {
  slug: string;
  children: React.ReactNode;
}
interface BoundaryState {
  error: Error | null;
}

class TutorialErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <ErrorState error={this.state.error} slug={this.props.slug} />;
    }
    return this.props.children;
  }
}

function ErrorState({ error, slug }: { error: Error; slug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ maxWidth: 680, margin: "60px auto", padding: "0 24px" }}>
      <div
        style={{
          border: `1px solid #f97316`,
          borderRadius: 10,
          padding: "24px 28px",
          background: "#f9731610",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <AlertTriangle size={18} color="#f97316" />
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: "#f97316" }}>
            Tutorial crashed — {slug}
          </span>
        </div>
        <p style={{ color: MUTED, fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13, margin: "0 0 12px" }}>
          {error.message}
        </p>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            color: MUTED,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {open ? "▲ hide stack" : "▼ show stack"}
        </button>
        {open && (
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: "#0b0d12",
              borderRadius: 6,
              fontSize: 11,
              color: MUTED,
              overflowX: "auto",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  );
}
