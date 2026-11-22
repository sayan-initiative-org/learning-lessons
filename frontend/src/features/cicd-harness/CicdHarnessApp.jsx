import React, { useEffect, useState } from 'react';
import { C, MONO, SANS, SERIF } from './theme';
import { FrameworkBand } from './components/ui';
import Intro from './sections/Intro';
import PipelineAnatomy from './sections/PipelineAnatomy';
import DeploymentConfig from './sections/DeploymentConfig';
import ConfigEngine from './sections/ConfigEngine';
import HarnessEngineering from './sections/HarnessEngineering';
import HelmChart from './sections/HelmChart';
import KubernetesPractices from './sections/KubernetesPractices';
import ReleaseStrategy from './sections/ReleaseStrategy';
import SecuritySupplyChain from './sections/SecuritySupplyChain';
import Lab from './sections/Lab';
import KitAudit from './sections/KitAudit';
import Sources from './sections/Sources';

const NAV = [
  { id: 'intro', label: '00 · Orientation' },
  { id: 'pipeline', label: '01 · Pipeline Anatomy' },
  { id: 'deploy-config', label: '02 · Deployment Config' },
  { id: 'config-engine', label: '03 · The Config Engine', framework: true },
  { id: 'harness', label: '04 · Harness Engineering', framework: true },
  { id: 'helm', label: '05 · Helm Charts' },
  { id: 'kubernetes', label: '06 · Kubernetes Practices' },
  { id: 'release', label: '07 · Releases & Rollback' },
  { id: 'security', label: '08 · Pipeline Security' },
  { id: 'lab', label: '09 · Failure Lab' },
  { id: 'audit', label: '10 · Audit the Kit' },
  { id: 'sources', label: '11 · Cheat Sheet & Sources' },
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

export default function CicdHarnessApp() {
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
            Deep-dive study material · taught from a real kit
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
            CI/CD <span style={{ color: C.violet }}>Harness</span> Guide
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, margin: 0, maxWidth: 640 }}>
            From a merged pull request to a verified Kubernetes rollout: deployment config, the
            config engine, harness engineering, Helm, Kubernetes practice and pipeline security.
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
        className="cicd-grid"
      >
        <main style={{ maxWidth: 720, minWidth: 0 }}>
          <Intro />
          <PipelineAnatomy />
          <DeploymentConfig />

          <FrameworkBand>
            <ConfigEngine />
            <HarnessEngineering />
          </FrameworkBand>

          <HelmChart />
          <KubernetesPractices />
          <ReleaseStrategy />
          <SecuritySupplyChain />
          <Lab />
          <KitAudit />
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
            Kit snapshot: agentic-sdlc-kit, read 2026-11-01. Harness unit tests and offline
            preflight were run, and the chart was rendered with Helm 3.18.6 for dev, staging, prod
            and preview. Nothing was deployed to a real cluster, so cluster behaviour described here
            comes from the code and upstream docs.
          </footer>
        </main>

        {/* Sticky ToC — hidden on narrow screens via CSS below */}
        <aside className="cicd-toc">
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
                      ★ The Harness
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
          .cicd-grid { grid-template-columns: minmax(0,1fr) 240px !important; }
        }
        @media (max-width: 959px) {
          .cicd-toc { display: none; }
        }
      `}</style>
    </div>
  );
}
