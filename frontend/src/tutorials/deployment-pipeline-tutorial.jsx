/**
 * Deployment Pipeline Tutorial
 *
 * Tab-based layout with 5 concern-grouped tabs:
 *   Overview | Database | Backend | Frontend | CI/CD & Ops
 *
 * Covers: GoDaddy · Cloudflare Pages · GitHub Actions · Neon · Fly.io · Docker
 * No external deps beyond React.
 */

import React, { useState } from "react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f0f13",
  surface: "#18181f",
  surfaceAlt: "#1e1e28",
  border: "#2a2a38",
  borderAccent: "#3d3d54",
  text: "#e8e8f0",
  textMuted: "#8888aa",
  textFaint: "#55556a",
  orange: "#f97316",
  orangeDim: "#431407",
  blue: "#60a5fa",
  blueDim: "#1e3a5f",
  green: "#4ade80",
  greenDim: "#14532d",
  purple: "#a78bfa",
  purpleDim: "#2e1065",
  yellow: "#facc15",
  yellowDim: "#422006",
  red: "#f87171",
  redDim: "#450a0a",
  cyan: "#22d3ee",
  cyanDim: "#083344",
};

// ─── Shared primitives ────────────────────────────────────────────────────────
const Badge = ({ label, color, bg }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.5,
      color,
      background: bg,
      border: `1px solid ${color}22`,
      fontFamily: "inherit",
    }}
  >
    {label}
  </span>
);

const Tag = ({ children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "1px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      color: C.textMuted,
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      fontFamily: "monospace",
    }}
  >
    {children}
  </span>
);

const Note = ({ type, children }) => {
  const map = {
    info:   { icon: "ℹ", color: C.blue,   bg: C.blueDim   },
    warn:   { icon: "⚠", color: C.yellow, bg: C.yellowDim },
    tip:    { icon: "✦", color: C.green,  bg: C.greenDim  },
    danger: { icon: "✕", color: C.red,    bg: C.redDim    },
  };
  const m = map[type];
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 8,
        background: m.bg + "55",
        border: `1px solid ${m.color}33`,
        margin: "16px 0",
      }}
    >
      <span style={{ color: m.color, fontWeight: 700, flexShrink: 0 }}>{m.icon}</span>
      <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
};

const CodeBlock = ({ lang, filename, children }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ margin: "16px 0", borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 14px",
          background: C.surfaceAlt,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "monospace" }}>{filename ?? lang}</span>
        <button
          onClick={copy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            color: copied ? C.green : C.textMuted,
            fontFamily: "inherit",
            padding: "2px 6px",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "16px",
          background: C.surface,
          overflowX: "auto",
          fontSize: 13,
          lineHeight: 1.7,
          color: C.text,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        }}
      >
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
};

const Step = ({ num, label, provider, providerColor, providerBg, children }) => (
  <section style={{ marginBottom: 56 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: C.orangeDim,
          border: `2px solid ${C.orange}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 15,
          color: C.orange,
          fontFamily: "monospace",
          marginTop: 2,
        }}
      >
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{label}</h2>
          <Badge label={provider} color={providerColor} bg={providerBg} />
        </div>
      </div>
    </div>
    <div style={{ paddingLeft: 52 }}>{children}</div>
  </section>
);

const P = ({ children }) => (
  <p style={{ margin: "0 0 14px", fontSize: 14.5, lineHeight: 1.75, color: C.text }}>{children}</p>
);

const H3 = ({ children }) => (
  <h3
    style={{
      margin: "24px 0 10px",
      fontSize: 14,
      fontWeight: 600,
      color: C.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    }}
  >
    {children}
  </h3>
);

const Checklist = ({ items }) => (
  <ul style={{ margin: "10px 0 16px", padding: 0, listStyle: "none" }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", gap: 10, padding: "5px 0", fontSize: 14, color: C.text }}>
        <span style={{ color: C.green, flexShrink: 0, marginTop: 1 }}>✓</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Divider = () => (
  <div
    style={{
      height: 1,
      background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
      margin: "40px 0",
    }}
  />
);

// ─── Tab content sections ─────────────────────────────────────────────────────

const ArchDiagram = () => (
  <div
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 28,
      margin: "24px 0 40px",
      fontFamily: "monospace",
      fontSize: 13,
      color: C.text,
      overflowX: "auto",
    }}
  >
    <div style={{ color: C.textMuted, marginBottom: 16, fontSize: 12, letterSpacing: 0.5 }}>
      ARCHITECTURE OVERVIEW
    </div>
    <pre style={{ margin: 0, lineHeight: 2 }}>{`
  ┌──────────────────────────────────────────────────────────────────┐
  │                         DEVELOPER                                │
  │                    git push origin main                           │
  └────────────────────────────┬─────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    GitHub Actions    │  CI/CD
                    │  (.github/workflows) │
                    └──────┬──────────────┘
                           │
             ┌─────────────┴──────────────┐
             │                            │
    ┌────────▼─────────┐       ┌──────────▼──────────┐
    │   npm run build  │       │    Docker build      │
    │   (React + Vite) │       │  (FastAPI + Python)  │
    └────────┬─────────┘       └──────────┬───────────┘
             │                            │
    ┌────────▼─────────┐       ┌──────────▼───────────┐
    │ Cloudflare Pages │       │       Fly.io          │
    │  (Static CDN)    │       │  (API, bom region)    │
    │ techsangam.pages │       │ techsangam-api.fly.dev│
    └────────┬─────────┘       └──────────┬────────────┘
             │                            │
    ┌────────▼──────────────────────────  ▼────────────┐
    │                   GoDaddy / Cloudflare DNS        │
    │  techsangam.in  →  Cloudflare Pages              │
    │  api.techsangam.in (optional custom domain)      │
    └───────────────────────────┬───────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │     Neon Postgres       │
                    │  (Managed, serverless)  │
                    └────────────────────────┘
`.trim()}</pre>
  </div>
);

function TabOverview() {
  return (
    <>
      <Note type="info">
        This tutorial uses the exact configs powering a live production app.
        Every YAML block, Dockerfile, and toml file below is a real artifact —
        not pseudo-code. Swap <code>techsangam</code> / <code>techsangam-api</code>{" "}
        for your own app names throughout.
      </Note>

      <ArchDiagram />

      <Divider />

      {/* Step 1 — GoDaddy DNS */}
      <Step
        num={1}
        label="Buy & Configure Your Domain"
        provider="GoDaddy"
        providerColor={C.green}
        providerBg={C.greenDim}
      >
        <P>
          Purchase your domain on GoDaddy, then immediately transfer DNS
          management to Cloudflare. Cloudflare's name servers give you faster
          propagation, free DDoS protection, and a single pane of glass for
          all DNS records.
        </P>

        <H3>On GoDaddy</H3>
        <Checklist
          items={[
            "Log in → My Products → Domain → DNS → Nameservers",
            'Click "Change" → "Enter my own nameservers"',
            "Enter the two NS records Cloudflare gives you (step below)",
            "Save — propagation takes 10–60 minutes globally",
          ]}
        />

        <H3>On Cloudflare</H3>
        <P>
          Create a free Cloudflare account, add your domain, and pick "Free"
          plan. Cloudflare scans your existing DNS records and imports them.
          After GoDaddy propagation, your domain resolves through Cloudflare.
        </P>

        <Note type="tip">
          Set the TTL on every record you'll later change (A, CNAME) to
          "Auto" in Cloudflare — it defaults to 5 minutes, which is fine for
          fast rollbacks without requiring manual TTL management.
        </Note>

        <H3>DNS records to create in Cloudflare</H3>
        <CodeBlock lang="text" filename="Cloudflare DNS records">
{`# Frontend — Cloudflare Pages handles this automatically when you
# link the Pages project (it adds a CNAME for you).
# You only need this if you're adding a custom root domain:

Type   Name          Content                        Proxy
────────────────────────────────────────────────────────
CNAME  @             techsangam.pages.dev           ✓ (Proxied)
CNAME  www           techsangam.pages.dev           ✓ (Proxied)

# Backend — Fly.io gives you a wildcard cert.
# A custom subdomain is optional but clean:
CNAME  api           techsangam-api.fly.dev         ✗ (DNS only)
`}
        </CodeBlock>
      </Step>

      <Divider />

      {/* Key Takeaways */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 28,
          marginBottom: 48,
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: C.text }}>
          Key Takeaways
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              icon: "🔒",
              title: "Secrets never touch git",
              desc: "Production secrets live in Fly.io. Preview secrets live in GitHub Environment. Dev secrets live in .env (gitignored).",
            },
            {
              icon: "🔄",
              title: "Migrations are atomic with deploys",
              desc: "fly.toml release_command runs alembic before traffic shifts. A failed migration aborts the deploy — old version stays live.",
            },
            {
              icon: "🌿",
              title: "Every PR gets a full-stack preview",
              desc: "preview-backend.yml spins up a Fly.io app; preview-frontend.yml deploys a Cloudflare Pages branch wired to it. Deleted when PR closes.",
            },
            {
              icon: "📦",
              title: "Multi-stage Docker keeps images lean",
              desc: "Builder stage installs deps and compiles; runtime stage copies only the built artifacts. Result: a <300 MB image with no dev tools.",
            },
            {
              icon: "💸",
              title: "Scale-to-zero = zero idle cost",
              desc: "auto_stop_machines = 'stop' in fly.toml means idle machines turn off. Cold start adds ~300ms on first request — acceptable for early-stage apps.",
            },
            {
              icon: "↩️",
              title: "Rollback is always one command away",
              desc: "fly releases rollback vNN for backend. Cloudflare dashboard one-click for frontend. Test this before you need it.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost summary */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.greenDim}`,
          borderRadius: 12,
          padding: 28,
          marginBottom: 48,
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: C.text }}>
          Approximate Monthly Cost
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                {["Component", "Provider", "Tier", "Cost/mo"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      color: C.textMuted,
                      fontWeight: 600,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Domain",            "GoDaddy",           "Annual registration",                       "~$1.00 (amortised)"],
                ["DNS / CDN / DDoS",  "Cloudflare",        "Free",                                     "$0"],
                ["Frontend hosting",  "Cloudflare Pages",  "Free",                                     "$0"],
                ["Backend hosting",   "Fly.io",            "Scale-to-zero, shared-cpu-1x 256MB",       "~$0–3"],
                ["Database",          "Neon",              "Free tier (0.5 GiB, 100hr compute)",       "$0"],
                ["CI/CD",             "GitHub Actions",    "Free tier (2,000 min/mo)",                 "$0"],
                ["Total",             "",                  "",                                         "~$1–4 / mo"],
              ].map(([comp, provider, tier, cost], i) => (
                <tr key={i} style={{ background: i === 6 ? C.surfaceAlt : "transparent" }}>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, color: i === 6 ? C.green : C.text, fontWeight: i === 6 ? 700 : 400 }}>{comp}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, color: C.textMuted }}>{provider}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12 }}>{tier}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, color: i === 6 ? C.green : C.text, fontWeight: i === 6 ? 700 : 400, fontFamily: "monospace" }}>{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 12.5, color: C.textFaint, lineHeight: 1.6 }}>
          Scale-to-zero means Fly.io machines are off when idle — cost rises
          proportionally to traffic, not calendar time. Upgrade the Neon plan
          ($19/mo) when you exceed 0.5 GiB storage or need PITR beyond 7 days.
        </p>
      </div>
    </>
  );
}

function TabDatabase() {
  return (
    <Step
      num={2}
      label="Provision the Database"
      provider="Neon"
      providerColor={C.cyan}
      providerBg={C.cyanDim}
    >
      <P>
        Neon is serverless Postgres with a generous free tier, instant
        branching, and a connection pooler built in. You never manage a VM
        or a connection limit — it scales to zero between requests.
      </P>

      <H3>Create a project</H3>
      <Checklist
        items={[
          "neon.tech → New Project → name it (e.g. techsangam)",
          "Region: ap-south-1 (Mumbai) if your Fly.io region is bom",
          "Postgres version: 16 (latest stable)",
          "Save the connection string — you'll need it as DATABASE_URL",
        ]}
      />

      <H3>Connection string format</H3>
      <CodeBlock lang="text" filename=".env (never commit this)">
{`DATABASE_URL=postgresql+asyncpg://user:password@ep-xxxxx-yyyyy.ap-south-1.aws.neon.tech/neondb?sslmode=require

# Neon also exposes a pooled endpoint for high-concurrency workloads:
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxxxx-yyyyy-pooler.ap-south-1.aws.neon.tech/neondb?sslmode=require
`}
      </CodeBlock>

      <Note type="warn">
        The <code>+asyncpg</code> driver prefix is required for FastAPI's
        async SQLAlchemy engine. If you use a sync driver you'll block the
        event loop under load. Also ensure <code>sslmode=require</code> —
        Neon rejects unencrypted connections.
      </Note>

      <H3>Branching strategy</H3>
      <P>
        Neon's branching copies your schema instantly with no data movement.
        Use one branch per environment:
      </P>
      <Checklist
        items={[
          "main branch → production DATABASE_URL (in Fly secrets)",
          "preview branch → preview DATABASE_URL (in PREVIEW_DATABASE_URL secret)",
          "Each dev creates a personal branch for local work — free, instant, deletable",
        ]}
      />

      <H3>Running migrations</H3>
      <P>
        Migrations run automatically on every Fly.io deploy via the{" "}
        <code>release_command</code> in <code>fly.toml</code> (covered in
        the Backend tab). You never run <code>alembic upgrade head</code> by hand in
        production.
      </P>
      <CodeBlock lang="bash" filename="Local dev">
{`# Create a new migration after changing a SQLAlchemy model
alembic revision --autogenerate -m "add users table"

# Apply locally (uses DATABASE_URL from .env)
alembic upgrade head

# Roll back one step if something went wrong
alembic downgrade -1
`}
      </CodeBlock>
    </Step>
  );
}

function TabBackend() {
  return (
    <>
      {/* Step 3 — Docker */}
      <Step
        num={3}
        label="Containerise the Backend"
        provider="Docker"
        providerColor={C.blue}
        providerBg={C.blueDim}
      >
        <P>
          The backend is a multi-stage Docker build: a <em>builder</em> stage
          compiles Python wheels and installs dependencies into{" "}
          <code>/install</code>; the lean <em>runtime</em> stage copies only
          those artifacts, runs as a non-root user, and exposes a health
          check. The final image stays well under 300 MB.
        </P>

        <CodeBlock lang="dockerfile" filename="backend/Dockerfile">
{`# syntax=docker/dockerfile:1.7

FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Install build-time system deps (libpq-dev for psycopg2 wheel)
RUN apt-get update \\
    && apt-get install -y --no-install-recommends build-essential libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN python -m pip install --upgrade pip \\
    && python -m pip install --prefix=/install .

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PYTHONPATH=/app \\
    PORT=8000 \\
    LOG_LEVEL=ERROR \\
    LOG_JSON=true \\
    LOG_CONSOLE=false

# Runtime system deps only (libpq5 is the shared library, not the dev headers)
RUN apt-get update \\
    && apt-get install -y --no-install-recommends curl libpq5 \\
    && rm -rf /var/lib/apt/lists/* \\
    && groupadd --system --gid 1001 app \\
    && useradd --system --uid 1001 --gid app --home /app --shell /bin/false app

WORKDIR /app

COPY --from=builder /install /usr/local
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini ./
COPY templates/ ./templates/

RUN chown -R app:app /app

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \\
    CMD curl --fail --silent http://127.0.0.1:8000/health || exit 1

CMD ["uvicorn", "app.main:app", \\
     "--host", "0.0.0.0", \\
     "--port", "8000", \\
     "--proxy-headers", \\
     "--forwarded-allow-ips", "*"]
`}
        </CodeBlock>

        <H3>Key decisions explained</H3>
        <Checklist
          items={[
            "--proxy-headers + --forwarded-allow-ips * : lets Fly.io's proxy pass real client IPs to your app",
            "Non-root user (uid 1001): container escapes to host with fewer privileges if broken",
            "libpq5 not libpq-dev in runtime: saves ~40 MB — you only need the shared lib, not the headers",
            "start-period 20s: gives uvicorn and alembic time to boot before the health check kicks in",
          ]}
        />

        <H3>Build and test locally</H3>
        <CodeBlock lang="bash" filename="Local Docker build">
{`cd backend

# Build the image
docker build -t techsangam-api:local .

# Run with env vars (never bake them into the image)
docker run --rm -p 8000:8000 \\
  -e DATABASE_URL="postgresql+asyncpg://..." \\
  -e JWT_SECRET="dev-secret-change-me" \\
  -e ADMIN_TOKEN="dev-admin-token" \\
  techsangam-api:local

# Check it
curl http://localhost:8000/health
# → {"status":"ok"}
`}
        </CodeBlock>

        <Note type="tip">
          Keep a <code>docker-compose.yml</code> in the repo root for local
          development. It wires the API container to a local Postgres
          container so devs can run everything with{" "}
          <code>docker compose up</code> — no Neon account needed locally.
        </Note>

        <CodeBlock lang="yaml" filename="docker-compose.yml (local dev only)">
{`version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: techsangam
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://dev:dev@db:5432/techsangam
      JWT_SECRET: dev-secret-not-for-prod
      ADMIN_TOKEN: dev-admin-token
      SUPER_ADMIN_EMAIL: admin@example.com
      SUPER_ADMIN_PASSWORD: admin123
      LOG_LEVEL: DEBUG
      LOG_JSON: "false"
      LOG_CONSOLE: "true"
    depends_on:
      - db

volumes:
  pg_data:
`}
        </CodeBlock>
      </Step>

      <Divider />

      {/* Step 5 — Fly.io */}
      <Step
        num={5}
        label="Deploy the Backend to Fly.io"
        provider="Fly.io"
        providerColor={C.orange}
        providerBg={C.orangeDim}
      >
        <P>
          Fly.io runs your Docker container globally, handles TLS
          termination, and supports scale-to-zero — so idle machines cost
          nothing. The <code>fly.toml</code> is the single source of truth
          for how the app runs in production.
        </P>

        <H3>Install flyctl</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# macOS
brew install flyctl

# Linux / WSL
curl -L https://fly.io/install.sh | sh

# Authenticate
fly auth login
`}
        </CodeBlock>

        <H3>Create the app (one-time)</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`cd backend

# Creates the app in Fly.io (no deploy yet)
fly apps create techsangam-api --org personal

# Set production secrets (stored encrypted in Fly — never in git)
fly secrets set \\
  DATABASE_URL="postgresql+asyncpg://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" \\
  JWT_SECRET="$(openssl rand -hex 32)" \\
  ADMIN_TOKEN="$(openssl rand -hex 24)" \\
  SUPER_ADMIN_EMAIL="admin@yourdomain.com" \\
  SUPER_ADMIN_PASSWORD="$(openssl rand -base64 20)" \\
  CORS_ORIGINS='["https://yourdomain.com","https://www.yourdomain.com"]'

# Deploy manually the first time
fly deploy --remote-only
`}
        </CodeBlock>

        <H3>fly.toml — full production config</H3>
        <CodeBlock lang="toml" filename="backend/fly.toml">
{`# fly.toml — configuration for techsangam-api on Fly.io
app = 'techsangam-api'
primary_region = 'bom'          # Mumbai — closest to Indian users

[build]
  dockerfile = 'Dockerfile'

[deploy]
  strategy = 'rolling'          # zero-downtime rolling deploy
  release_command = 'python -m alembic upgrade head'
  # release_command runs migrations before traffic shifts to the new version.
  # If it fails, the deploy is aborted — old version keeps serving.

[env]
  PORT = '8000'

[[services]]
  protocol      = 'tcp'
  internal_port = 8000

  auto_stop_machines  = 'stop'   # scale to zero when idle → saves cost
  auto_start_machines = true     # cold-start on first request (~300ms)
  min_machines_running = 0       # zero idle cost
  processes = ['app']

  [[services.ports]]
    port     = 80
    handlers = ['http']
    force_https = true           # redirect all HTTP → HTTPS

  [[services.ports]]
    port     = 443
    handlers = ['tls', 'http']

  [services.concurrency]
    type       = 'requests'
    hard_limit = 50              # shed traffic if overwhelmed
    soft_limit = 25              # start queuing at soft limit

  [[services.http_checks]]
    interval     = '30s'
    timeout      = '5s'
    grace_period = '20s'         # wait 20s after boot before checking
    method       = 'get'
    path         = '/health'
    protocol     = 'http'

[[vm]]
  size      = 'shared-cpu-1x'
  memory    = '256mb'           # right-sized for FastAPI; bump to 512 if needed
  cpu_kind  = 'shared'
  cpus      = 1
  memory_mb = 256
`}
        </CodeBlock>

        <H3>Verify the deployment</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Check app status
fly status --app techsangam-api

# Tail live logs
fly logs --app techsangam-api

# Open in browser
fly open --app techsangam-api

# Hit the health endpoint
curl https://techsangam-api.fly.dev/health
# → {"status":"ok"}

# Roll back to previous release if something is broken
fly releases list --app techsangam-api
fly releases rollback v12 --app techsangam-api
`}
        </CodeBlock>

        <Note type="tip">
          The <code>release_command</code> pattern is the safest way to run
          migrations on Fly.io. It runs in a temporary one-off machine with
          access to your secrets, before the new version receives any traffic.
          If the migration fails, the deploy stops and Fly.io keeps the old
          machines running.
        </Note>
      </Step>
    </>
  );
}

function TabFrontend() {
  return (
    <Step
      num={6}
      label="Deploy the Frontend to Cloudflare Pages"
      provider="Cloudflare Pages"
      providerColor={C.yellow}
      providerBg={C.yellowDim}
    >
      <P>
        Cloudflare Pages hosts your React build as a global static CDN.
        Every deploy is atomic, every branch gets its own preview URL, and
        custom domains with HTTPS are free. The build runs in GitHub Actions
        (not Cloudflare's own build pipeline) so you get full control over
        the build environment.
      </P>

      <H3>Create a Pages project (one-time)</H3>
      <Checklist
        items={[
          "Cloudflare Dashboard → Pages → Create a project",
          'Choose "Direct Upload" (we deploy from GitHub Actions, not Cloudflare\'s git integration)',
          "Project name: techsangam",
          "That's it — no further config needed in the dashboard",
        ]}
      />

      <H3>Frontend Vite build</H3>
      <CodeBlock lang="bash" filename="frontend/package.json scripts">
{`"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives"
}
`}
      </CodeBlock>

      <CodeBlock lang="typescript" filename="frontend/vite.config.ts">
{`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output to dist/ — this is what Cloudflare Pages serves
    outDir: 'dist',
    sourcemap: false,      // disable in production; enable for debugging
    rollupOptions: {
      output: {
        // Split vendor chunks so users only re-download what changed
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  // API base URL injected at build time via environment variable
  // VITE_API_URL=https://techsangam-api.fly.dev/api npm run build
})
`}
      </CodeBlock>

      <Note type="info">
        Any variable prefixed <code>VITE_</code> is embedded into the build
        bundle at compile time. <code>VITE_API_URL</code> is the only
        runtime config the frontend needs — it points to the Fly.io API.
        Never put secrets in <code>VITE_</code> vars; they end up in the
        browser bundle.
      </Note>

      <H3>Connect the custom domain</H3>
      <Checklist
        items={[
          "Cloudflare Pages → your project → Custom domains → Set up a custom domain",
          "Enter your apex domain (e.g. techsangam.in)",
          "Cloudflare automatically adds the CNAME to your DNS — no manual record needed",
          "HTTPS cert is provisioned automatically (Cloudflare's Universal SSL)",
        ]}
      />
    </Step>
  );
}

function TabCiCdOps() {
  return (
    <>
      {/* Step 4 — GitHub repo + secrets */}
      <Step
        num={4}
        label="Configure GitHub Repository & Secrets"
        provider="GitHub"
        providerColor={C.purple}
        providerBg={C.purpleDim}
      >
        <P>
          All secrets live in GitHub — never in code or committed files. The
          CI workflows pick them up as environment variables at runtime. You
          manage them once; every workflow inherits them.
        </P>

        <H3>Repository structure</H3>
        <CodeBlock lang="text" filename="Repo layout">
{`techsangam/                      ← monorepo root
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml   ← production backend deploy (on push to main)
│       ├── deploy-frontend.yml  ← production frontend deploy (on push to main)
│       ├── pr-backend.yml       ← test suite on every PR
│       ├── preview-backend.yml  ← ephemeral Fly.io app per PR
│       └── preview-frontend.yml ← ephemeral Cloudflare Pages branch per PR
├── backend/
│   ├── Dockerfile
│   ├── fly.toml
│   ├── pyproject.toml
│   ├── alembic/
│   └── app/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
`}
        </CodeBlock>

        <H3>Required GitHub Secrets</H3>
        <P>
          Navigate to your repo → Settings → Secrets and variables → Actions.
          Add these under the <strong>techsangam</strong> environment (create
          it first under Environments):
        </P>

        <CodeBlock lang="text" filename="GitHub → Settings → Secrets (environment: techsangam)">
{`# Fly.io
FLY_API_TOKEN                 # flyctl auth token — from: fly auth token

# Cloudflare
CLOUDFLARE_API_TOKEN          # CF token with Pages:Edit permission
CLOUDFLARE_ACCOUNT_ID         # Cloudflare dashboard → right sidebar

# App runtime
VITE_API_URL                  # https://techsangam-api.fly.dev/api (or custom domain)

# Production DB + auth (Fly.io secrets — set separately, see Backend tab)
# These are also needed here for the preview env:
PREVIEW_DATABASE_URL          # Neon preview branch connection string
PREVIEW_JWT_SECRET            # random 64-char hex: openssl rand -hex 32
PREVIEW_ADMIN_TOKEN           # random string for legacy admin endpoints
PREVIEW_SUPER_ADMIN_EMAIL     # preview admin email
PREVIEW_SUPER_ADMIN_PASSWORD  # preview admin password
`}
        </CodeBlock>

        <Note type="warn">
          Production secrets (<code>DATABASE_URL</code>,{" "}
          <code>JWT_SECRET</code>, etc.) are set directly in Fly.io via{" "}
          <code>flyctl secrets set</code> — they are <em>not</em> stored in
          GitHub. Only preview environment secrets go in GitHub. This keeps
          your production credentials off GitHub's servers entirely.
        </Note>
      </Step>

      <Divider />

      {/* Step 7 — GitHub Actions CI/CD */}
      <Step
        num={7}
        label="GitHub Actions — CI/CD Pipelines"
        provider="GitHub Actions"
        providerColor={C.purple}
        providerBg={C.purpleDim}
      >
        <P>
          Five workflows cover the full lifecycle: PR checks, preview
          environments, and production deploys. Together they ensure no
          broken code reaches main and every PR gets a live testable URL.
        </P>

        <H3>Workflow 1 — Backend tests on every PR</H3>
        <CodeBlock lang="yaml" filename=".github/workflows/pr-backend.yml">
{`name: Backend PR checks

on:
  pull_request:
    paths:
      - "backend/**"
      - ".github/workflows/pr-backend.yml"

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip              # cache the pip download dir between runs

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Run pytest
        run: pytest -q
        env:
          # In-memory SQLite — no real DB needed for unit/integration tests
          DATABASE_URL: "sqlite+aiosqlite:///:memory:"
          ADMIN_TOKEN: "test-legacy-admin-token"
          JWT_SECRET: "test-secret-please-do-not-use-in-prod"
          SUPER_ADMIN_EMAIL: "ci-admin@example.com"
          SUPER_ADMIN_PASSWORD: "ci-test-password-not-for-prod"
`}
        </CodeBlock>

        <H3>Workflow 2 — Preview backend (ephemeral Fly.io app per PR)</H3>
        <CodeBlock lang="yaml" filename=".github/workflows/preview-backend.yml">
{`name: Preview backend (per-PR)

on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
    paths:
      - "backend/**"
      - ".github/workflows/preview-backend.yml"

permissions:
  contents: read
  pull-requests: write          # needed to post the comment

concurrency:
  group: preview-backend-\${{ github.event.pull_request.number }}
  cancel-in-progress: true      # cancel the old run if a new push arrives

jobs:
  preview:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    env:
      FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}
      PR_APP: techsangam-api-pr-\${{ github.event.pull_request.number }}
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Create app if missing
        run: |
          flyctl apps list --json | grep -q "\\"$PR_APP\\"" \\
            || flyctl apps create "$PR_APP" --org personal

      - name: Set preview secrets
        working-directory: backend
        run: |
          flyctl secrets set --app "$PR_APP" --stage \\
            DATABASE_URL='\${{ secrets.PREVIEW_DATABASE_URL }}' \\
            JWT_SECRET='\${{ secrets.PREVIEW_JWT_SECRET }}' \\
            ADMIN_TOKEN='\${{ secrets.PREVIEW_ADMIN_TOKEN }}' \\
            SUPER_ADMIN_EMAIL='\${{ secrets.PREVIEW_SUPER_ADMIN_EMAIL }}' \\
            SUPER_ADMIN_PASSWORD='\${{ secrets.PREVIEW_SUPER_ADMIN_PASSWORD }}' \\
            CORS_ORIGINS='["https://*.pages.dev","http://localhost:5173"]'

      - name: Deploy preview
        working-directory: backend
        run: flyctl deploy --app "$PR_APP" --remote-only --wait-timeout 300

      - name: Comment preview URL on PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: preview-backend
          message: |
            Backend preview deployed

            - **App**: \`\${{ env.PR_APP }}\`
            - **URL**: https://\${{ env.PR_APP }}.fly.dev
            - **Health**: https://\${{ env.PR_APP }}.fly.dev/health

            This preview will be destroyed when the PR is closed.

  destroy:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    env:
      FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}
      PR_APP: techsangam-api-pr-\${{ github.event.pull_request.number }}
    steps:
      - uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Destroy preview app
        run: flyctl apps destroy "$PR_APP" --yes || true

      - name: Update PR comment
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: preview-backend
          message: |
            Backend preview \`\${{ env.PR_APP }}\` was destroyed.
`}
        </CodeBlock>

        <H3>Workflow 3 — Preview frontend (Cloudflare Pages branch per PR)</H3>
        <CodeBlock lang="yaml" filename=".github/workflows/preview-frontend.yml">
{`name: Preview frontend (per-PR)

on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - "frontend/**"
      - ".github/workflows/preview-frontend.yml"

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: preview-frontend-\${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      PREVIEW_API_URL: https://techsangam-api-pr-\${{ github.event.pull_request.number }}.fly.dev/api
      BRANCH_NAME: pr-\${{ github.event.pull_request.number }}
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - run: npm ci

      - name: Build (preview)
        run: npm run build
        env:
          VITE_API_URL: \${{ env.PREVIEW_API_URL }}
          # Frontend preview points to the PR's backend preview —
          # so you can test the full stack on every PR.

      - name: Publish preview to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy frontend/dist --project-name=techsangam --branch=\${{ env.BRANCH_NAME }}
          workingDirectory: \${{ github.workspace }}

      - name: Comment preview URL on PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: preview-frontend
          message: |
            Frontend preview deployed

            - **Branch**: \`\${{ env.BRANCH_NAME }}\`
            - **API target**: \`\${{ env.PREVIEW_API_URL }}\`
            - Cloudflare Pages will post the preview URL as a deployment status.
`}
        </CodeBlock>

        <H3>Workflow 4 — Production backend deploy (on push to main)</H3>
        <CodeBlock lang="yaml" filename=".github/workflows/deploy-backend.yml">
{`name: Deploy backend

on:
  push:
    branches: [main]
    paths:
      - "backend/**"
      - ".github/workflows/deploy-backend.yml"
  workflow_dispatch:          # allow manual trigger from the Actions UI

concurrency:
  group: deploy-backend-\${{ github.ref }}
  cancel-in-progress: false   # NEVER cancel an in-flight production deploy

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Run pytest
        run: pytest -q
        env:
          DATABASE_URL: "sqlite+aiosqlite:///:memory:"
          ADMIN_TOKEN: "test-legacy-admin-token"
          JWT_SECRET: "test-secret-please-do-not-use-in-prod"
          SUPER_ADMIN_EMAIL: "ci-admin@example.com"
          SUPER_ADMIN_PASSWORD: "ci-test-password-not-for-prod"

  deploy:
    needs: test               # never deploy if tests fail
    runs-on: ubuntu-latest
    environment: techsangam   # gates on the GitHub Environment's protection rules
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy to Fly.io
        working-directory: backend
        run: flyctl deploy --remote-only --wait-timeout 300
        # --remote-only: build the Docker image on Fly's builders, not the runner.
        # This is faster and avoids shipping large layers over GitHub's network.
        env:
          FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}
`}
        </CodeBlock>

        <H3>Workflow 5 — Production frontend deploy (on push to main)</H3>
        <CodeBlock lang="yaml" filename=".github/workflows/deploy-frontend.yml">
{`name: Deploy frontend

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"
      - ".github/workflows/deploy-frontend.yml"
  workflow_dispatch:

concurrency:
  group: deploy-frontend-\${{ github.ref }}
  cancel-in-progress: true    # safe to cancel — static builds are idempotent

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: techsangam
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: \${{ secrets.VITE_API_URL }}

      - name: Publish to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy \${{ github.workspace }}/frontend/dist --project-name=techsangam --branch=main
`}
        </CodeBlock>

        <Note type="tip">
          The <code>concurrency</code> block on the backend deploy uses{" "}
          <code>cancel-in-progress: false</code> — you never want to kill a
          production deploy mid-flight. The frontend deploy uses{" "}
          <code>cancel-in-progress: true</code> because a static upload is
          atomic and safe to restart.
        </Note>
      </Step>

      <Divider />

      {/* Step 8 — Day-2 operations */}
      <Step
        num={8}
        label="Day-2 Operations"
        provider="Ops"
        providerColor={C.textMuted}
        providerBg={C.surfaceAlt}
      >
        <P>
          Getting to production is the beginning. Here's the muscle memory
          every operator needs for the first year.
        </P>

        <H3>Rolling back a bad backend deploy</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# List all releases
fly releases list --app techsangam-api

# Roll back to a specific version (e.g. v23)
fly releases rollback v23 --app techsangam-api

# Confirm it's live
curl https://techsangam-api.fly.dev/health
`}
        </CodeBlock>

        <H3>Rolling back a bad frontend deploy</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Cloudflare Pages — go to Dashboard → Pages → Deployments
# Find the last good deployment → three-dot menu → "Rollback to this deployment"
# Takes < 30 seconds, zero downtime.

# Or via Wrangler CLI:
npx wrangler pages deployment list --project-name=techsangam
npx wrangler pages deployment rollback <DEPLOYMENT_ID> --project-name=techsangam
`}
        </CodeBlock>

        <H3>Updating production secrets</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Rotate a secret (triggers a rolling restart automatically)
fly secrets set JWT_SECRET="$(openssl rand -hex 32)" --app techsangam-api

# Remove a secret
fly secrets unset OLD_SECRET_NAME --app techsangam-api

# List current secrets (values are redacted)
fly secrets list --app techsangam-api
`}
        </CodeBlock>

        <H3>Scaling the backend</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Check current VM size
fly scale show --app techsangam-api

# Bump memory (e.g. for a memory-hungry ML model)
fly scale memory 512 --app techsangam-api

# Run 2 machines for high-availability (adds ~$3-5/mo)
fly scale count 2 --app techsangam-api

# Return to scale-to-zero (1 machine, idle = off)
fly scale count 0 --app techsangam-api
# Also update fly.toml: min_machines_running = 0
`}
        </CodeBlock>

        <H3>Monitoring & logs</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Tail live logs from all machines
fly logs --app techsangam-api

# SSH into a running machine (debugging)
fly ssh console --app techsangam-api

# Check machine health
fly machines list --app techsangam-api

# Cloudflare Pages analytics
# Dashboard → Pages → Analytics → traffic, errors, cache hit rates
`}
        </CodeBlock>

        <Note type="warn">
          Fly.io's free tier gives you 3 shared-cpu-1x machines at 256 MB.
          The moment you add a second production machine, you're on the paid
          plan (~$5/mo per machine). For a solo app, scale-to-zero with a
          single machine is perfectly reliable for low-to-medium traffic.
        </Note>

        <H3>Neon database operations</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Connect directly to production DB (psql)
psql "postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Create a dev branch from production (instant, no data copied)
# → Neon Console → Branches → Create Branch → from: main

# Restore to a point in time (Neon free tier: 7 days PITR)
# → Neon Console → Branches → Restore to timestamp

# Check connection count (free tier: 100 max connections)
SELECT count(*) FROM pg_stat_activity;
`}
        </CodeBlock>

        <H3>Checking your CORS config</H3>
        <CodeBlock lang="bash" filename="Terminal">
{`# Verify the backend is returning CORS headers for your domain
curl -I https://techsangam-api.fly.dev/health \\
  -H "Origin: https://techsangam.in"

# You should see:
# access-control-allow-origin: https://techsangam.in
`}
        </CodeBlock>
      </Step>
    </>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview",    color: C.orange,  component: TabOverview  },
  { id: "database",  label: "Database",    color: C.cyan,    component: TabDatabase  },
  { id: "backend",   label: "Backend",     color: C.blue,    component: TabBackend   },
  { id: "frontend",  label: "Frontend",    color: C.yellow,  component: TabFrontend  },
  { id: "cicd",      label: "CI/CD & Ops", color: C.purple,  component: TabCiCdOps  },
];

// ─── Tab nav ──────────────────────────────────────────────────────────────────
const TabNav = ({ active, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: 2,
      padding: "0 24px",
      borderBottom: `1px solid ${C.border}`,
      overflowX: "auto",
      scrollbarWidth: "none",
    }}
  >
    {TABS.map((tab) => {
      const isActive = tab.id === active;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            background: "none",
            border: "none",
            borderBottom: isActive ? `2px solid ${tab.color}` : "2px solid transparent",
            padding: "14px 18px 12px",
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? tab.color : C.textMuted,
            whiteSpace: "nowrap",
            fontFamily: "inherit",
            transition: "color 0.15s, border-color 0.15s",
            marginBottom: -1,
          }}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

// ─── Pipeline flow indicator ──────────────────────────────────────────────────
const PipelineFlow = ({ active }) => {
  const steps = [
    { id: "overview",  short: "DNS Setup"  },
    { id: "database",  short: "Database"   },
    { id: "backend",   short: "Backend"    },
    { id: "frontend",  short: "Frontend"   },
    { id: "cicd",      short: "CI/CD"      },
  ];
  const activeIdx = steps.findIndex((s) => s.id === active);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "12px 24px",
        background: C.surfaceAlt,
        borderBottom: `1px solid ${C.border}`,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {steps.map((step, i) => {
        const isDone   = i < activeIdx;
        const isCurrent = i === activeIdx;
        const color = isCurrent
          ? TABS[i].color
          : isDone
          ? C.green
          : C.textFaint;
        return (
          <React.Fragment key={step.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: isCurrent ? color + "22" : isDone ? C.greenDim : C.surface,
                  border: `1.5px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11.5, color, fontWeight: isCurrent ? 600 : 400 }}>
                {step.short}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: "1 0 16px",
                  height: 1,
                  background: i < activeIdx ? C.green : C.border,
                  margin: "0 6px",
                  minWidth: 16,
                  maxWidth: 48,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function DeploymentPipelineTutorial() {
  const [activeTab, setActiveTab] = useState("overview");
  const ActiveContent = TABS.find((t) => t.id === activeTab).component;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Geist', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(180deg, ${C.orangeDim}44 0%, transparent 100%)`,
          borderBottom: `1px solid ${C.border}`,
          padding: "48px 24px 36px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: 16 }}>
            <Badge label="DevOps" color={C.orange} bg={C.orangeDim} />
            {" "}
            <Badge label="Tutorial" color={C.blue} bg={C.blueDim} />
          </div>
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 42px)",
              fontWeight: 800,
              margin: "0 0 14px",
              lineHeight: 1.15,
              background: `linear-gradient(135deg, ${C.text} 0%, ${C.orange} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Full-Stack Deployment Pipeline
          </h1>
          <p
            style={{
              fontSize: 16,
              color: C.textMuted,
              margin: "0 0 24px",
              lineHeight: 1.6,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            React + FastAPI from a GoDaddy domain through Cloudflare, GitHub
            Actions, Fly.io, and Neon — every config file included.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {["GoDaddy", "Cloudflare Pages", "GitHub Actions", "Fly.io", "Neon Postgres", "Docker"].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav + pipeline flow */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.bg }}>
        <TabNav active={activeTab} onChange={setActiveTab} />
        <PipelineFlow active={activeTab} />
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
        <ActiveContent />

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "16px 0 0" }}>
          <p style={{ fontSize: 12.5, color: C.textFaint }}>
            All configs in this tutorial are from a production deployment. Last updated May 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
