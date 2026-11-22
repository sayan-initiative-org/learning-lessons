import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Card, Cols, Recall } from '../components/ui';
import PipelineMap from '../components/PipelineMap';
import { C } from '../theme';

export default function Intro() {
  return (
    <Section
      id="intro"
      kicker="Module 00 · Orientation"
      title="A pipeline ships code. A harness makes shipping safe to repeat."
    >
      <P>
        Most CI/CD tutorials end when <Code>helm upgrade</Code> exits 0. Real delivery work starts
        around that command: was this input safe to deploy, did the release actually work, and if
        not, what broke and what is serving users now? The code that answers those questions is the{' '}
        <Term color={C.violet}>harness</Term>.
      </P>
      <P>
        This guide teaches from one working example, the <Code>agentic-sdlc-kit</Code> repo: a
        Next.js web app and FastAPI service shipped to Kubernetes with Helm and GitHub Actions. Every
        file named here is real, so you can open it next to the lesson.
      </P>

      <H3>Three meanings of "harness"</H3>
      <P>The word gets used loosely. This guide uses it in the first two senses below.</P>
      <Table
        head={['Term', 'What it is', 'In the kit']}
        rows={[
          ['Deployment harness', 'Code wrapped around a deploy that validates, verifies, explains and recovers', 'scripts/harness/harness.py'],
          ['Agent harness', 'Everything around an AI agent: tools, permissions, hooks, gates', '.claude/, CLAUDE.md, gate-guard.yml'],
          ['Harness (product)', 'A commercial CI/CD platform from Harness Inc.', 'Not used here, and not covered'],
        ]}
      />

      <H3>The whole system on one screen</H3>
      <P>Click through the stages. Each one shows its trigger, its file and what guards it.</P>
      <PipelineMap />

      <Pre label="what the harness adds around one deploy — .github/actions/helm-deploy/action.yml">{`            harness.json
                 │
                 ▼
  plan ─▶ preflight ─▶ helm upgrade --wait ─▶ verify ─▶ GO
             │                  │                │
             │ fail             │ fail           │ fail (NO-GO)
             ▼                  ▼                ▼
       nothing touched      diagnose ─▶      diagnose
                            rollback         rollback only if
                                             Helm says "failed"`}</Pre>

      <H3>How to study this</H3>
      <Cols>
        <Card>
          <Term color={C.blue}>Need the map?</Term>
          <P>Read modules 01 and 02, then jump to the Failure Lab to test your model.</P>
        </Card>
        <Card>
          <Term color={C.violet}>Building a harness?</Term>
          <P>Modules 03 and 04 are the core. Module 10 shows what the first version still misses.</P>
        </Card>
        <Card>
          <Term color={C.green}>Running Kubernetes?</Term>
          <P>Modules 05 to 07 cover the chart, the workload and releases.</P>
        </Card>
      </Cols>

      <Callout tone="info" title="What was and wasn't verified">
        The harness's 22 unit tests pass, and its commands were run offline for this guide. The chart
        was rendered with Helm 3.18.6 for every environment. No part of this ran against a live
        cluster, and the kit's own runbook says the same of the harness. Claims about cluster
        behaviour come from the code and upstream documentation, and those are labelled where it
        matters.
      </Callout>

      <Recall
        items={[
          ['Why isn\'t a green helm upgrade enough?', 'It proves Kubernetes accepted the release and pods became Ready. It does not prove the right image is running, public URLs work, secrets synced, or that pods aren\'t restarting. Verify checks exactly those.'],
          ['Which stages rebuild the image?', 'Only "Build once". Release adds a tag to the existing image, and staging and prod deploy that tag.'],
        ]}
      />
    </Section>
  );
}
