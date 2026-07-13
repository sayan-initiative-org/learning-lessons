import type { LucideIcon } from "lucide-react";

const PANEL = "#13161f";
const LINE = "#1f2330";
const TEXT = "#e6e7eb";
const MUTED = "#8a8f9c";
const ACCENT = "#e8b75d";

interface Props {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
}

export function PlaceholderPage({ title, subtitle, Icon }: Props) {
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
          {title}
        </h1>
        <p
          style={{
            fontFamily: '"Manrope", system-ui, sans-serif',
            fontSize: 14,
            color: MUTED,
            marginTop: 8,
          }}
        >
          {subtitle}
        </p>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: "64px 24px",
          background: PANEL,
          border: `1px dashed ${LINE}`,
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <Icon size={28} color={ACCENT} strokeWidth={1.5} />
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: MUTED, margin: 0 }}>
          Nothing here yet — coming soon.
        </p>
      </div>
    </div>
  );
}
