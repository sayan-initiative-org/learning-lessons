import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function PipelineAnatomy() {
  return (
    <Section
      id="pipeline"
      kicker="Module 01 · Pipeline Anatomy"
      title="CI answers 'is it good?' CD answers 'is it running?'"
    >
      <P>
        <Term color={C.blue}>Continuous integration</Term> produces evidence about a change.{' '}
        <Term color={C.green}>Continuous delivery</Term> moves a built artifact towards users, with
        people choosing when. <Term color={C.accent}>Continuous deployment</Term> removes that human
        step. The kit is continuous delivery: every environment has a GitHub Environment gate.
      </P>

      <H3>Workflows in the kit</H3>
      <Table
        head={['Workflow', 'Trigger', 'Job']}
        rows={[
          ['ci.yml', 'PR, push to main', 'Lint, types, tests, migrations, contract, E2E, helm lint'],
          ['cd.yml', 'Push to main, release, manual', 'Build, promote, deploy through environments'],
          ['preview.yml', 'PR labelled preview', 'Temporary pr-<n> namespace, removed on close'],
          ['security.yml', 'PR, main, weekly cron', 'CodeQL, dependency audits, Trivy filesystem scan'],
          ['gate-guard.yml', 'Label added', 'Removes approved:* labels not set by a person with write access'],
          ['claude-review.yml', 'PR opened or updated', 'First-pass review. Comments only'],
        ]}
      />

      <H3>Fast feedback: only test what changed</H3>
      <P>
        A <Code>changes</Code> job detects which parts of the monorepo moved, and later jobs read its
        outputs. On pushes to main the guard is bypassed, so main always runs the full suite.
      </P>
      <Pre label=".github/workflows/ci.yml">{`changes:
  outputs:
    web: \${{ steps.f.outputs.web }}
    api: \${{ steps.f.outputs.api }}
    deploy: \${{ steps.f.outputs.deploy }}
  steps:
    - uses: dorny/paths-filter@v3
      with:
        filters: |
          web: ['apps/web/**', 'packages/**', 'pnpm-lock.yaml']
          api: ['apps/api/**']
          deploy: ['deploy/**']

api:
  needs: changes
  if: needs.changes.outputs.api == 'true' || github.event_name == 'push'`}</Pre>
      <Callout tone="warn" title="Filtering jobs vs filtering workflows">
        This design matters for required checks. A job skipped by its own <Code>if</Code> reports
        Success and does not block a merge. A workflow skipped by a path filter never reports, so a
        required check stays Pending forever. Filter at the job level, as the kit does.
      </Callout>

      <H3>The skipped-dependency trap</H3>
      <P>
        If <Code>e2e</Code> needs both <Code>api</Code> and <Code>web</Code>, and a web-only
        change skips <Code>api</Code>, then by default <Code>e2e</Code> would be skipped too. The kit
        overrides that, while still refusing to run after a real failure:
      </P>
      <Pre label="run if nothing failed, even if a dependency was skipped">{`e2e:
  needs: [api, web]
  if: \${{ !cancelled() && !contains(needs.*.result, 'failure') }}`}</Pre>

      <H3>Checks worth stealing</H3>
      <Table
        head={['Check', 'What it catches']}
        rows={[
          ['alembic upgrade → downgrade -1 → upgrade', 'Migrations that cannot apply, or cannot reverse, on a real Postgres service'],
          ['make client + git diff --exit-code', 'API changes committed without regenerating the TypeScript client'],
          ['helm lint + template for each env', 'A chart that renders for dev but breaks with prod values'],
          ['--frozen-lockfile, uv sync --frozen', 'Dependencies drifting from the committed lockfile'],
          ['--cov-fail-under=80', 'Coverage quietly decaying'],
        ]}
      />

      <H3>Build once, promote the same bytes</H3>
      <P>
        Rebuilding per environment means prod runs something staging never tested: a base image or
        dependency may have changed in between. The kit builds on merge to main, then adds a version
        tag to the existing image:
      </P>
      <Pre label=".github/workflows/cd.yml — promotion, not rebuild">{`sha=$(git rev-list -n 1 "\${{ steps.v.outputs.version }}")
for c in api web; do
  docker buildx imagetools create \\
    -t "$REGISTRY/$c:\${{ steps.v.outputs.version }}" \\
    "$REGISTRY/$c:$sha"
done`}</Pre>
      <P>
        <Code>imagetools create</Code> writes a new tag pointing at the same manifest, so the digest
        does not change. That is why configuration must come from outside the image, which is
        Module 02.
      </P>

      <H3>Make targets as a contract</H3>
      <P>
        The kit's Makefile says it is the "single command contract shared by humans, Claude Code
        agents and CI". The idea is strong: one command, one behaviour, everywhere. It only holds if
        CI really calls those targets. In practice <Code>ci.yml</Code> calls only{' '}
        <Code>make client</Code> and runs the tools directly elsewhere, so <Code>make verify</Code>{' '}
        and CI can drift. Module 10 shows the concrete cost: harness tests run locally, but not in CI.
      </P>

      <Recall
        items={[
          ['A workflow has "paths:" on its trigger and is a required check. A PR changes only docs. What happens?', 'The workflow never runs, so the required check stays Pending and the PR cannot merge. Move the filter to job-level conditions, or don\'t require that workflow.'],
          ['Why is cancel-in-progress true in CI but false in CD?', 'A cancelled test run costs nothing, because a newer commit replaces it. A cancelled deploy can leave a Helm release stuck mid-operation.'],
          ['Why not build a separate image with prod settings baked in?', 'Then prod runs bytes that staging never tested, and every config change needs a rebuild.'],
        ]}
      />
    </Section>
  );
}
