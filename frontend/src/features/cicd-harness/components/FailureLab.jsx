import React, { useState } from 'react';
import { C, MONO, SANS } from '../theme';

const STEPS = ['build', 'preflight', 'helm', 'verify', 'diagnose', 'rollback'];

// Each `path` maps a step to pass / fail / run / skip. Outcomes follow the branches in
// scripts/harness/harness.py and .github/actions/helm-deploy/action.yml.
const SCENARIOS = [
  {
    id: 'tag',
    title: 'Tag is "latest"',
    setup: 'Someone edits the workflow and passes latest as the image tag.',
    path: { build: 'pass', preflight: 'fail', helm: 'skip', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'Release unchanged',
    live: 'Previous version keeps serving. The cluster was never touched.',
    happens: 'TAG_RE only accepts a git SHA, vX.Y.Z or pr-N-SHA, so preflight exits 1. Diagnose and rollback still run because the step failed, and rollback finds nothing failed to undo.',
    lesson: 'The cheapest failure is the one that happens before the first cluster write.',
  },
  {
    id: 'host',
    title: 'APP_HOST variable unset',
    setup: 'A new GitHub Environment was created without the APP_HOST variable.',
    path: { build: 'pass', preflight: 'fail', helm: 'skip', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'Release unchanged',
    live: 'Previous version keeps serving.',
    happens: 'The empty host fails HOST_RE, and the message asks directly: "is vars.APP_HOST set?"',
    lesson: 'A good check names the likely fix, not just the failed rule.',
  },
  {
    id: 'image',
    title: 'Image was never pushed',
    setup: 'The deployment asks for a tag that does not exist in GHCR.',
    path: { build: 'pass', preflight: 'pass', helm: 'fail', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'failed → rolled back',
    live: 'Previous version keeps serving. The pre-upgrade Job uses the same api image, so it fails before any pod rolls.',
    happens: 'Preflight only validates the tag format, not that it exists. The Job sits in ImagePullBackOff until activeDeadlineSeconds ends it. Expect diagnose to list both "Image cannot be pulled" and "Migration job failed".',
    lesson: 'Read every listed cause. The earliest one in the chain is usually the root.',
  },
  {
    id: 'migration',
    title: 'Migration fails',
    setup: 'alembic upgrade head throws on a constraint the data violates.',
    path: { build: 'pass', preflight: 'pass', helm: 'fail', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'failed → rolled back',
    live: 'Previous pods never stopped, because the hook runs before they roll.',
    happens: 'The Job fails with BackoffLimitExceeded. It stays around because hook-delete-policy only removes it on success, so diagnose can read its logs and warn "Do NOT downgrade in prod; ship a forward fix."',
    lesson: 'Keep the failed thing until you have read it. A partly applied migration needs a person to look.',
  },
  {
    id: 'oom',
    title: 'OOMKilled on start',
    setup: 'A new dependency pushes memory use past the 1Gi limit.',
    path: { build: 'pass', preflight: 'pass', helm: 'fail', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'failed → rolled back',
    live: 'Old pods keep serving, because maxUnavailable: 0 keeps them until new ones are Ready. Migrations have already applied.',
    happens: 'New pods never become Ready, so helm --wait times out at 10 minutes and marks the revision failed. Diagnose reports "Container crash-loops", not OOM: while a pod waits in CrashLoopBackOff, _waiting_reason returns that reason and never reads lastState, where OOMKilled lives. Check it with kubectl describe pod.',
    lesson: 'Rollback restores code, not schema. That is why migrations must stay compatible with the old version.',
  },
  {
    id: 'capacity',
    title: 'Cluster is out of capacity',
    setup: 'The surge pod asks for more CPU than any node has free.',
    path: { build: 'pass', preflight: 'pass', helm: 'fail', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'failed → rolled back',
    live: 'Old pods keep serving.',
    happens: 'The pod stays Pending with a FailedScheduling event. Diagnose collects Warning events and matches "Insufficient cpu".',
    lesson: 'Pods with no logs still have events. Evidence collection has to include both.',
  },
  {
    id: 'smoke',
    title: 'Smoke URL returns 502',
    setup: 'Pods are Ready, but a routing change breaks the public path.',
    path: { build: 'pass', preflight: 'pass', helm: 'pass', verify: 'fail', diagnose: 'run', rollback: 'noop' },
    status: 'deployed (not rolled back)',
    live: 'The NEW version stays live. The job is red and later environments do not run, but this one needs a person.',
    happens: 'verify prints NO-GO, but Helm recorded the revision as deployed. cmd_rollback acts only on failed, so it prints "leaving as is".',
    lesson: 'Know your rollback trigger. Here, helm success plus verify failure means no automatic rollback.',
  },
  {
    id: 'crash',
    title: 'Pods restart after Ready',
    setup: 'The app passes readiness, then crashes a minute later.',
    path: { build: 'pass', preflight: 'pass', helm: 'pass', verify: 'fail', diagnose: 'run', rollback: 'noop' },
    status: 'deployed (not rolled back)',
    live: 'The new version stays live and keeps restarting. Verify catches it only if it crashes within the verify window.',
    happens: 'The restarts check requires exactly 0. A crash after verify has passed is out of the harness\'s sight, which is the job of monitoring.',
    lesson: 'A harness verifies a moment. Alerts and SLOs cover everything after it.',
  },
  {
    id: 'es-sync',
    title: 'Secret store key is missing',
    setup: 'A new key is added to requiredKeys, but not to the store.',
    path: { build: 'pass', preflight: 'pass', helm: 'pass', verify: 'fail', diagnose: 'run', rollback: 'noop' },
    status: 'deployed (not rolled back)',
    live: 'Depends on the app. With no required key at startup, pods can look healthy while the Secret is stale.',
    happens: 'With External Secrets on, preflight passes by design because sync happens during deploy. The verify secret sync check then reports Ready=False, giving NO-GO.',
    lesson: 'Some checks can only run after the change. Say so explicitly and catch them in verify.',
  },
  {
    id: 'first-install',
    title: 'First install in a new namespace',
    setup: 'A new environment with External Secrets enabled gets its first deploy.',
    path: { build: 'pass', preflight: 'pass', helm: 'fail', verify: 'skip', diagnose: 'run', rollback: 'run' },
    status: 'failed, nothing to roll back to',
    live: 'Nothing is running yet.',
    happens: 'pre-install runs before chart resources exist, so the ExternalSecret that creates app-secrets is not there. The Job needs that Secret with optional: false and cannot start. With one revision, rollback leaves it alone. Derived from the render and Helm docs, not a live run.',
    lesson: 'Order matters. See the audit for the fix.',
  },
];

const STATE = {
  pass: { label: 'pass', color: C.green },
  fail: { label: 'fail', color: C.red },
  skip: { label: 'skipped', color: C.faint },
  run: { label: 'runs', color: C.accent },
  noop: { label: 'no-op', color: C.violet },
};

export default function FailureLab() {
  const [id, setId] = useState(SCENARIOS[0].id);
  const [revealed, setRevealed] = useState(false);
  const s = SCENARIOS.find((x) => x.id === id);

  const choose = (next) => {
    setId(next);
    setRevealed(false);
  };

  return (
    <div style={{ margin: '20px 0', border: `1px solid ${C.line}`, borderRadius: 10, background: C.panel }}>
      <div
        role="group"
        aria-label="Failure scenarios"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 12, borderBottom: `1px solid ${C.line}` }}
      >
        {SCENARIOS.map((x) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(x.id)}
              style={{
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${on ? C.accent : C.line}`,
                background: on ? `${C.accent}1a` : 'transparent',
                color: on ? C.text : C.muted,
                fontFamily: SANS,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              {x.title}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: C.accent }}>
          Scenario
        </div>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.6, color: C.text, margin: '6px 0 12px' }}>
          {s.setup}
        </p>

        {!revealed ? (
          <>
            <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.6, color: C.muted, margin: '0 0 12px' }}>
              Before you reveal it: which step stops this, what does Helm record, and which version
              is serving traffic afterwards?
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              style={{
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: 6,
                border: `1px solid ${C.accent}`,
                background: `${C.accent}1a`,
                color: C.accent,
                fontFamily: MONO,
                fontSize: 12,
              }}
            >
              Reveal what happens
            </button>
          </>
        ) : (
          <div aria-live="polite">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {STEPS.map((step) => {
                const st = STATE[s.path[step]];
                return (
                  <div
                    key={step}
                    style={{
                      flex: '1 1 84px',
                      border: `1px solid ${st.color}55`,
                      background: `${st.color}12`,
                      borderRadius: 6,
                      padding: '6px 8px',
                    }}
                  >
                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.text }}>{step}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10.5, color: st.color }}>{st.label}</div>
                  </div>
                );
              })}
            </div>
            <Row label="Helm status" value={s.status} />
            <Row label="Serving" value={s.live} />
            <Row label="Mechanism" value={s.happens} />
            <Row label="Takeaway" value={s.lesson} accent />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: C.muted }}>
        {label}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: accent ? C.green : C.text }}>{value}</div>
    </div>
  );
}
