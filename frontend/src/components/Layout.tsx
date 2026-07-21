import { Link, NavLink, Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";

const BG = "#0b0d12";
const PANEL = "#13161f";
const LINE = "#1f2330";
const TEXT = "#e6e7eb";
const MUTED = "#8a8f9c";
const ACCENT = "#e8b75d";

const MENU = [
  { to: "/priorities", label: "Priorities Ledger" },
  { to: "/tutorials", label: "Tutorials" },
  { to: "/research", label: "Research Topics" },
];

export function Layout() {
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
          gap: 24,
        }}
      >
        <Link
          to="/priorities"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: ACCENT,
            textDecoration: "none",
            fontFamily: '"Fraunces", serif',
            fontSize: 17,
          }}
        >
          <BookOpen size={18} strokeWidth={1.5} />
          Learning Lessons
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
          {MENU.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? ACCENT : MUTED,
                textDecoration: "none",
                fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 6,
                background: isActive ? `${ACCENT}12` : "transparent",
                transition: "color 0.15s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
