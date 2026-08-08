import React, { useEffect, useState } from 'react';
import { C, MONO, SANS, SERIF } from './theme';
import { FrameworkBand } from './components/ui';
import Intro from './sections/Intro';
import CostEval from './sections/CostEval';
import BuildVsBuy from './sections/BuildVsBuy';
import FinOpsCore from './sections/FinOpsCore';
import FinOpsForAI from './sections/FinOpsForAI';
import Frameworks from './sections/Frameworks';
import Sources from './sections/Sources';

const NAV = [
  { id: 'intro', label: '00 · Orientation' },
  { id: 'cost-eval', label: '01 · Evaluate a Use Case' },
  { id: 'build-vs-buy', label: '02 · Build vs Buy' },
  { id: 'finops-core', label: '03 · The FinOps Framework', framework: true },
  { id: 'finops-for-ai', label: '04 · FinOps for AI', framework: true },
  { id: 'frameworks', label: '05 · Aligned Frameworks' },
  { id: 'sources', label: '06 · Sources & Templates' },
];

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-64px 0px -70% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export default function FinOpsAiApp() {
  const active = useScrollSpy(NAV.map((n) => n.id));

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>
      {/* Study banner */}
      <div
        style={{
          borderBottom: `1px solid ${C.line}`,
          background: C.panel,
          padding: '28px 24px',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: C.accent,
            }}
          >
            Deep-dive study material · sources verified
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 34,
              fontWeight: 500,
              color: C.text,
              margin: '8px 0 6px',
            }}
          >
            AI Strategy, Cost & <span style={{ color: C.violet }}>FinOps</span>
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, margin: 0, maxWidth: 640 }}>
            Evaluating AI use cases, the Build-vs-Buy decision, and the FinOps Framework — grounded
            in the FinOps Foundation's primary pages, including FinOps for AI.
          </p>
        </div>
      </div>

      {/* Content + sidebar */}
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 32,
          padding: '32px 24px 96px',
        }}
        className="finops-grid"
      >
        <main style={{ maxWidth: 720 }}>
          <Intro />
          <CostEval />
          <BuildVsBuy />

          <FrameworkBand>
            <FinOpsCore />
            <FinOpsForAI />
          </FrameworkBand>

          <Frameworks />
          <Sources />

          <footer
            style={{
              borderTop: `1px solid ${C.line}`,
              paddingTop: 20,
              fontFamily: MONO,
              fontSize: 12,
              color: C.faint,
            }}
          >
            Compiled from FinOps Foundation primary sources (finops.org): the Framework, Principles,
            Domains &amp; Capabilities pages, FinOps for AI, the Unit Economics capability, and the
            Token Economics insight — verified at build time. Statistics are the Foundation's
            reported figures; verify against your own data.
          </footer>
        </main>

        {/* Sticky ToC — hidden on narrow screens via CSS below */}
        <aside className="finops-toc">
          <nav
            style={{
              position: 'sticky',
              top: 72,
              borderLeft: `1px solid ${C.line}`,
              paddingLeft: 18,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: C.faint,
                marginBottom: 12,
              }}
            >
              Contents
            </div>
            {NAV.map((n, i) => {
              const isActive = active === n.id;
              const startsGroup = n.framework && !NAV[i - 1]?.framework;
              const activeCol = n.framework ? C.violet : C.accent;
              return (
                <React.Fragment key={n.id}>
                  {startsGroup && (
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: C.violet,
                        margin: '14px 0 6px',
                      }}
                    >
                      ★ The Framework
                    </div>
                  )}
                  <a
                    href={`#${n.id}`}
                    style={{
                      display: 'block',
                      fontFamily: SANS,
                      fontSize: 13,
                      lineHeight: 1.4,
                      textDecoration: 'none',
                      color: isActive ? activeCol : n.framework ? `${C.violet}cc` : C.muted,
                      fontWeight: isActive ? 700 : n.framework ? 600 : 400,
                      padding: '6px 0',
                      borderLeft: `2px solid ${isActive ? activeCol : 'transparent'}`,
                      marginLeft: -20,
                      paddingLeft: 18,
                      transition: 'color .15s',
                    }}
                  >
                    {n.label}
                  </a>
                </React.Fragment>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* Layout: 2-col on wide, single-col (no ToC) on narrow */}
      <style>{`
        @media (min-width: 960px) {
          .finops-grid { grid-template-columns: minmax(0,1fr) 240px !important; }
        }
        @media (max-width: 959px) {
          .finops-toc { display: none; }
        }
      `}</style>
    </div>
  );
}
