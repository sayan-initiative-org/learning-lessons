import React, { useEffect, useState } from 'react';
import { C, MONO, SANS, SERIF } from './theme';
import { FrameworkBand } from './components/ui';
import Intro from './sections/Intro';
import Foundations from './sections/Foundations';
import Embeddings from './sections/Embeddings';
import GraphRAG from './sections/GraphRAG';
import Architecture from './sections/Architecture';
import Reasoning from './sections/Reasoning';
import Benchmarks from './sections/Benchmarks';

const NAV = [
  { id: 'intro', label: '00 · Orientation' },
  { id: 'foundations', label: '01 · KG Foundations' },
  { id: 'embeddings', label: '02 · KG Embeddings' },
  { id: 'graphrag', label: '03 · GraphRAG' },
  { id: 'architecture', label: '04 · KAG Architecture', framework: true },
  { id: 'reasoning', label: '05 · Logical-Form Reasoning', framework: true },
  { id: 'benchmarks', label: '06 · Benchmarks & Papers' },
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

export default function KagStudyApp() {
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
            Deep-dive study material · research-grade
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
            Knowledge-Augmented Generation <span style={{ color: C.violet }}>(KAG)</span>
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, margin: 0, maxWidth: 640 }}>
            From knowledge-graph foundations and embeddings to Ant Group's logical-form
            reasoning framework — grounded in the primary papers.
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
        className="kag-grid"
      >
        <main style={{ maxWidth: 720 }}>
          <Intro />
          <Foundations />
          <Embeddings />
          <GraphRAG />

          <FrameworkBand>
            <Architecture />
            <Reasoning />
          </FrameworkBand>

          <Benchmarks />

          <footer
            style={{
              borderTop: `1px solid ${C.line}`,
              paddingTop: 20,
              fontFamily: MONO,
              fontSize: 12,
              color: C.faint,
            }}
          >
            Compiled from primary sources: arXiv:2409.13731 (KAG), arXiv:2404.16130 (GraphRAG),
            OpenSPG/KAG, and the cited KGE papers. Figures are the authors' reported results —
            verify against your own corpus.
          </footer>
        </main>

        {/* Sticky ToC — hidden on narrow screens via CSS below */}
        <aside className="kag-toc">
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
          .kag-grid { grid-template-columns: minmax(0,1fr) 240px !important; }
        }
        @media (max-width: 959px) {
          .kag-toc { display: none; }
        }
      `}</style>
    </div>
  );
}
