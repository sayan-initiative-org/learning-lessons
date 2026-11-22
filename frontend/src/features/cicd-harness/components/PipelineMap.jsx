import React, { useState } from 'react';
import { C, MONO, SANS } from '../theme';

const STAGES = [
  {
    id: 'pr',
    name: 'Pull request',
    trigger: 'pull_request',
    color: C.blue,
    what: 'CI runs lint, types, tests, migrations up/down/up, the API-client contract check, E2E and helm lint. A Claude review comments, but only people approve.',
    file: '.github/workflows/ci.yml, claude-review.yml, security.yml',
    guard: 'Branch protection, CODEOWNERS, required checks',
  },
  {
    id: 'build',
    name: 'Build once',
    trigger: 'push to main',
    color: C.cyan,
    what: 'Builds api and web images tagged with the git SHA, with SBOM and provenance attached, then scans them with Trivy. This image is what later environments receive.',
    file: '.github/workflows/cd.yml → build',
    guard: 'Trivy fails on fixable HIGH/CRITICAL',
  },
  {
    id: 'dev',
    name: 'Dev',
    trigger: 'after build',
    color: C.green,
    what: 'The composite action runs the full harness against app-dev: plan, preflight, helm upgrade --wait, verify. On failure it diagnoses and rolls back.',
    file: '.github/actions/helm-deploy/action.yml',
    guard: 'GitHub Environment "dev" reviewer',
  },
  {
    id: 'release',
    name: 'Release',
    trigger: 'release published',
    color: C.accent,
    what: 'No rebuild. imagetools adds the vX.Y.Z tag to the image already built for that commit, so the digest stays the same.',
    file: '.github/workflows/cd.yml → resolve-release',
    guard: 'A person publishes the GitHub release',
  },
  {
    id: 'staging',
    name: 'Staging',
    trigger: 'after resolve-release',
    color: C.violet,
    what: 'The same harness, now with HPA, PodDisruptionBudget and NetworkPolicy switched on. A NO-GO here stops prod, because deploy-prod depends on this job.',
    file: 'cd.yml → deploy-staging, values-staging.yaml',
    guard: 'GitHub Environment "staging" reviewer',
  },
  {
    id: 'prod',
    name: 'Prod',
    trigger: 'after staging',
    color: C.red,
    what: 'The same harness with the same tag. Hooks block agents from deploying here, so production only moves through this workflow.',
    file: 'cd.yml → deploy-prod, values-prod.yaml',
    guard: 'Reviewers, wait timer, guard-bash hook',
  },
];

export default function PipelineMap() {
  const [selected, setSelected] = useState('build');
  const stage = STAGES.find((s) => s.id === selected);

  return (
    <div
      style={{
        margin: '20px 0',
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        background: C.panel,
        overflow: 'hidden',
      }}
    >
      <div
        role="group"
        aria-label="Pipeline stages"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 12, borderBottom: `1px solid ${C.line}` }}
      >
        {STAGES.map((s, i) => {
          const on = s.id === selected;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(s.id)}
              style={{
                flex: '1 1 96px',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: 6,
                border: `1px solid ${on ? s.color : C.line}`,
                background: on ? `${s.color}1a` : 'transparent',
                color: on ? C.text : C.muted,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'block', fontFamily: MONO, fontSize: 10, color: s.color }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.name}
            </button>
          );
        })}
      </div>
      <div style={{ padding: '14px 16px' }} aria-live="polite">
        <div style={{ fontFamily: MONO, fontSize: 11.5, color: stage.color, marginBottom: 6 }}>
          trigger: {stage.trigger}
        </div>
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.65, color: C.text, margin: '0 0 10px' }}>
          {stage.what}
        </p>
        <div style={{ fontFamily: MONO, fontSize: 11.5, lineHeight: 1.6, color: C.muted }}>
          <div>file: {stage.file}</div>
          <div>guard: {stage.guard}</div>
        </div>
      </div>
    </div>
  );
}
