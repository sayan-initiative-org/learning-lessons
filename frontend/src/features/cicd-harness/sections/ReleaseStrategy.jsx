import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function ReleaseStrategy() {
  return (
    <Section
      id="release"
      kicker="Module 07 · Releases & Rollback"
      title="Plan the way back before you go forward"
    >
      <P>
        A release is safe when going forward and going back are both routine. That takes human gates
        in the right places, a database strategy that tolerates two versions, and a practised rollback.
      </P>

      <H3>Gates with GitHub Environments</H3>
      <P>
        Each deploy job names an environment. Reviewers and wait timers belong to that environment, and
        its secrets are released only when the job is allowed to run. So{' '}
        <Code>KUBECONFIG</Code> for prod can't be read by a job that hasn't passed the gate.
      </P>
      <Pre label=".github/workflows/cd.yml">{`deploy-prod:
  needs: [resolve-release, deploy-staging]   # staging must pass
  environment: { name: prod, url: "https://\${{ vars.APP_HOST }}" }`}</Pre>
      <Callout tone="warn" title="These settings live outside the repo">
        Reviewers, wait timers and branch protection are repository settings, not files. A fresh fork
        of the kit has none of them, and <Code>environment:</Code> alone creates an environment with no
        protection. Treat a new repo as ungated until you've configured this.
      </Callout>

      <H3>Concurrency: one deploy at a time</H3>
      <P>
        A group allows one running and, by default, one pending run. A newer pending run replaces the
        older one, which is fine for "latest commit wins" and surprising if you expected a queue. GitHub
        now offers <Code>queue: max</Code> for keeping runs in order.
      </P>
      <Pre label=".github/workflows/cd.yml">{`concurrency:
  group: cd-\${{ github.event_name }}
  cancel-in-progress: false`}</Pre>
      <P>
        Because the group includes the event name, a <Code>release</Code> run and a manual redeploy sit
        in different groups, and both can deploy to staging at once. A group keyed to the environment on
        each deploy job, such as <Code>deploy-staging</Code>, would serialize them. Helm's own lock would
        make the second fail rather than corrupt anything, but it's still an avoidable red run.
      </P>

      <H3>Choosing a deployment strategy</H3>
      <Table
        head={['Strategy', 'How', 'Bad release affects', 'Cost']}
        rows={[
          ['Rolling', 'Replace pods gradually', 'Growing share during the roll', 'Built in'],
          ['Blue-green', 'Full second stack, then switch', 'All users after the switch, instant revert', 'Double capacity briefly'],
          ['Canary', 'Small traffic share, watch metrics, grow', 'A small percentage', 'Needs traffic split and metrics'],
          ['Flags', 'Ship dark, enable per cohort', 'Chosen cohort', 'Flag system, flag cleanup'],
        ]}
      />
      <P>
        The kit uses rolling updates plus flags, a good default for one team. Reach for canary when
        traffic is high enough for metrics to mean something within minutes. Tools like Argo Rollouts add
        it to Kubernetes.
      </P>

      <H3>Database changes: expand, migrate, contract</H3>
      <P>
        Pods roll gradually and the migration runs first, so <Term>old code runs against the new
        schema</Term>. A rename done in one step breaks that immediately. Split it across releases:
      </P>
      <Pre label="renaming users.name to users.full_name with no downtime">{`Release 1  EXPAND     add full_name (nullable)
                      code writes both columns, reads old
Release 2  MIGRATE    backfill in batches
                      code reads new, still writes both
Release 3  CONTRACT   stop writing old column
Release 4             drop name

Rollback is safe at every step: the previous version still works.`}</Pre>
      <Callout tone="warn" title="Migrations that lock">
        On large Postgres tables, some schema changes hold locks that block traffic. Set a{' '}
        <Code>lock_timeout</Code>, create indexes with <Code>CONCURRENTLY</Code>, and backfill outside
        the migration Job. Its 10-minute deadline is a safety net, not a plan.
      </Callout>

      <H3>Rollback playbook</H3>
      <Table
        head={['Situation', 'Do', 'Avoid']}
        rows={[
          ['Bad code, schema compatible', 'helm rollback, or redeploy the previous tag', 'Hotfix under pressure'],
          ['Migration failed before pods rolled', 'Old version still up. Forward-fix', 'alembic downgrade in prod'],
          ['Feature misbehaves', 'Turn off the flag', 'A full rollback for one feature'],
          ['Rollback itself fails', 'Stop. Read history and events', 'Repeated blind retries'],
        ]}
      />
      <P>
        Rollback restores the chart and image of an earlier revision. It does not restore data or schema.
        The kit's rule is forward-only in prod, enforced by a hook that blocks{' '}
        <Code>alembic downgrade</Code> for agents.
      </P>

      <H3>Preview environments</H3>
      <P>
        A PR labelled <Code>preview</Code> gets its own <Code>pr-&lt;n&gt;</Code> namespace with a
        throwaway Postgres, and the URL is posted on the PR. Closing the PR removes the namespace. It's
        how a stakeholder clicks a real build before merge. Three details make it safe:
      </P>
      <Table
        head={['Detail', 'Why']}
        rows={[
          ['Skips PRs from forks', 'Fork code must never run with cluster credentials'],
          ['Uses the same harness', 'Previews exercise the deploy path every day'],
          ['Teardown on close', 'Unused environments cost money and widen attack surface'],
        ]}
      />

      <H3>Push vs pull: where GitOps fits</H3>
      <P>
        The kit is <Term color={C.blue}>push-based</Term>: CI holds a credential and runs Helm. With{' '}
        <Term color={C.green}>GitOps</Term>, an agent in the cluster such as Argo CD or Flux pulls desired
        state from Git and reconciles continuously.
      </P>
      <Table
        head={['', 'Push (kit)', 'Pull (GitOps)']}
        rows={[
          ['Cluster credential', 'Held by CI', 'Stays inside the cluster'],
          ['Drift', 'Found on next deploy', 'Detected continuously'],
          ['Setup', 'Lower', 'Another system to run'],
          ['Pre and post steps', 'Natural in a workflow', 'Sync hooks and extra tooling'],
          ['Best for', 'Few services, one team', 'Many apps or clusters'],
        ]}
      />
      <P>
        Moving later is manageable. The chart and values stay, while preflight checks move to CI on the
        config repo, and verify runs after sync.
      </P>

      <H3>Measuring whether it's working</H3>
      <P>The DORA research measures software delivery with a small set of metrics:</P>
      <Table
        head={['Metric', 'Kit source']}
        rows={[
          ['Deployment frequency', 'CD runs per environment'],
          ['Change lead time', 'Commit time to prod deploy'],
          ['Change failure rate', 'Deploys that needed a rollback or fix'],
          ['Failed deployment recovery time', 'NO-GO to next GO'],
        ]}
      />
      <P>
        Harness output gives you more local signals too: which preflight checks fire most, and which{' '}
        <Code>CAUSES</Code> repeat. A repeating cause is a candidate for an earlier check.
      </P>

      <Recall
        items={[
          ['Why does dropping a column in the same release as the code change break a rolling update?', 'The migration runs first, while old pods still query that column. They fail until they are replaced.'],
          ['Does helm rollback undo a migration?', 'No. It restores Kubernetes objects only. The schema stays, which is why expand/contract matters.'],
          ['A manual redeploy runs while a release deploy is in progress. Does cd.yml\'s concurrency stop it?', 'No, they are in different groups because the group uses the event name. Both may reach staging, and Helm\'s lock fails one.'],
        ]}
      />
    </Section>
  );
}
