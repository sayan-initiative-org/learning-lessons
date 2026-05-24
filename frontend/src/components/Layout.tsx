import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, ChevronLeft } from "lucide-react";

const BG = "#0b0d12";
const PANEL = "#13161f";
const LINE = "#1f2330";
const TEXT = "#e6e7eb";
const MUTED = "#8a8f9c";
const ACCENT = "#e8b75d";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: PANEL,
          borderBottom: `1px solid ${LINE}`,
          padding: "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {!isHome && (
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: MUTED,
              textDecoration: "none",
              fontSize: 13,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <ChevronLeft size={14} />
            All tutorials
          </Link>
        )}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: ACCENT,
            textDecoration: "none",
            fontFamily: '"Fraunces", serif',
            fontSize: 17,
            marginLeft: isHome ? 0 : "auto",
          }}
        >
          <BookOpen size={18} strokeWidth={1.5} />
          Learning Lessons
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
