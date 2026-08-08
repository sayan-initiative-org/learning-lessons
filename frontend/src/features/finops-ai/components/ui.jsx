import React from 'react';
import { C, MONO, SANS, SERIF } from '../theme';

/* ---- Framework band --------------------------------------------------- */
/* Visually brackets the FinOps-for-AI modules (03–04) as the core of the
   study — everything before it is the strategy/costing groundwork. */
export function FrameworkBand({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        margin: '48px 0',
        padding: '4px 22px 8px',
        borderRadius: 16,
        background: `linear-gradient(180deg, ${C.violet}0f 0%, ${C.violet}06 40%, transparent 100%)`,
        border: `1px solid ${C.violet}33`,
        boxShadow: `0 0 0 1px ${C.violet}10, 0 20px 60px -30px ${C.violet}55`,
      }}
    >
      {/* Header ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '0 0 8px',
          padding: '16px 2px 14px',
          borderBottom: `1px dashed ${C.violet}33`,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: C.bg,
            background: C.violet,
            borderRadius: 5,
            padding: '4px 9px',
          }}
        >
          ★ The FinOps Framework
        </span>
        <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.4 }}>
          The operating discipline — everything above is the ground it stands on.
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---- Section shell ---------------------------------------------------- */
export function Section({ id, kicker, title, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: 72, marginBottom: 64 }}>
      {kicker && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 8,
          }}
        >
          {kicker}
        </div>
      )}
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 28,
          lineHeight: 1.15,
          color: C.text,
          margin: '0 0 20px',
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ---- Sub-heading ------------------------------------------------------ */
export function H3({ children }) {
  return (
    <h3
      style={{
        fontFamily: SANS,
        fontSize: 17,
        fontWeight: 700,
        color: C.text,
        margin: '32px 0 12px',
      }}
    >
      {children}
    </h3>
  );
}

/* ---- Body paragraph --------------------------------------------------- */
export function P({ children }) {
  return (
    <p
      style={{
        fontFamily: SANS,
        fontSize: 15,
        lineHeight: 1.7,
        color: C.text,
        margin: '0 0 14px',
      }}
    >
      {children}
    </p>
  );
}

/* ---- Inline emphasis tokens ------------------------------------------- */
export function Term({ children, color = C.accent }) {
  return <strong style={{ color, fontWeight: 700 }}>{children}</strong>;
}

export function Code({ children }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: 13,
        background: C.panel2,
        border: `1px solid ${C.line}`,
        borderRadius: 4,
        padding: '1px 6px',
        color: C.cyan,
      }}
    >
      {children}
    </code>
  );
}

/* ---- Callout / note --------------------------------------------------- */
export function Callout({ tone = 'info', title, children }) {
  const map = {
    info: C.blue,
    win: C.green,
    warn: C.red,
    idea: C.violet,
  };
  const col = map[tone] || C.blue;
  return (
    <div
      style={{
        borderLeft: `3px solid ${col}`,
        background: `${col}0d`,
        borderRadius: '0 8px 8px 0',
        padding: '12px 16px',
        margin: '16px 0',
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: col,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.65, color: C.text }}>
        {children}
      </div>
    </div>
  );
}

/* ---- Code / ascii block ----------------------------------------------- */
export function Pre({ label, children }) {
  return (
    <div style={{ margin: '16px 0' }}>
      {label && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: C.muted,
            background: C.panel2,
            border: `1px solid ${C.line}`,
            borderBottom: 'none',
            borderRadius: '8px 8px 0 0',
            padding: '6px 12px',
          }}
        >
          {label}
        </div>
      )}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          lineHeight: 1.6,
          color: C.text,
          background: '#0e1017',
          border: `1px solid ${C.line}`,
          borderRadius: label ? '0 0 8px 8px' : 8,
          padding: '14px 16px',
          overflowX: 'auto',
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/* ---- Card ------------------------------------------------------------- */
export function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Table ------------------------------------------------------------ */
export function Table({ head, rows, highlightLast, align = 'right' }) {
  return (
    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: MONO,
          fontSize: 13,
          minWidth: 480,
        }}
      >
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? 'left' : align,
                  color: C.accent,
                  fontWeight: 600,
                  padding: '8px 12px',
                  borderBottom: `1px solid ${C.line}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => {
            const hot = highlightLast && ri === rows.length - 1;
            return (
              <tr key={ri} style={{ background: hot ? `${C.green}0d` : 'transparent' }}>
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      textAlign: ci === 0 ? 'left' : align,
                      color: hot ? C.green : ci === 0 ? C.text : C.muted,
                      fontWeight: hot && ci > 0 ? 700 : 400,
                      padding: '7px 12px',
                      borderBottom: `1px solid ${C.line}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Two-column grid -------------------------------------------------- */
export function Cols({ children, min = 240 }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 14,
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
        margin: '16px 0',
      }}
    >
      {children}
    </div>
  );
}

/* ---- Reference / source link ------------------------------------------ */
export function Ref({ source, title, note, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'block',
        textDecoration: 'none',
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 10,
        transition: 'border-color .15s, background .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.blue;
        e.currentTarget.style.background = `${C.blue}0a`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.line;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>
        {title}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.muted, marginTop: 4 }}>
        {source}{note ? ` · ${note}` : ''}
      </div>
    </a>
  );
}
