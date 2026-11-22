import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function HarnessEngineering() {
  return (
    <Section
      id="harness"
      kicker="Module 04 · Harness Engineering"
      title="Engineer the deploy like a product: fail early, prove it, explain it"
    >
      <P>
        Harness engineering is building the system around a risky operation so that the operation
        becomes predictable. The operation here is <Code>helm upgrade</Code>. It is one line, and the
        harness around it is 460 lines plus 22 tests, because that is where failures get prevented,
        detected and explained.
      </P>

      <H3>Five verbs</H3>
      <Table
        head={['Verb', 'When', 'Question it answers', 'Touches cluster?']}
        rows={[
          ['plan', 'First', 'What exactly will we do?', 'No'],
          ['preflight', 'Before Helm', 'Is it safe to start?', 'Reads only'],
          ['verify', 'After Helm', 'Did it really work?', 'Reads only'],
          ['diagnose', 'On failure', 'What broke, and why?', 'Reads only'],
          ['rollback', 'On failure', 'Can we return to a known state?', 'Writes (CI only)'],
        ]}
      />
      <Callout tone="idea" title="Mental model">
        Each verb moves a failure to a cheaper place. Preflight turns a broken deploy into a red
        check. Verify turns a silent outage into a NO-GO. Diagnose turns an hour of{' '}
        <Code>kubectl</Code> into a job summary.
      </Callout>

      <H3>Preflight: fail before anything changes</H3>
      <P>Order checks from cheapest to most expensive, and run all of them so one report shows every problem.</P>
      <Table
        head={['Check', 'Catches']}
        rows={[
          ['Image tag format', 'latest, or an empty variable'],
          ['Public host format', 'Unset vars.APP_HOST'],
          ['Values files exist', 'Typo in harness.json'],
          ['No literal secrets', 'password: hunter2 committed to values'],
          ['helm template renders', 'Template errors, missing required values'],
          ['Cluster reachable', 'Expired or wrong KUBECONFIG'],
          ['Required secret keys', 'A key missing from the live Secret'],
        ]}
      />
      <Pre label="$ harness.py preflight --env prod --tag latest --host '' --offline  (exit 1)">{`### Preflight \`prod\`

| | Check | Detail |
|---|---|---|
| ❌ | image tag | \`latest\` is not a git SHA, vX.Y.Z or pr-N-SHA |
| ❌ | public host | \`\` is not a valid hostname (is vars.APP_HOST set?) |
| ✅ | values files | present |
| ✅ | no literal secrets in values | clean |
| ➖ | cluster reachable | offline |
| ➖ | secrets present | offline |`}</Pre>
      <P>
        Three states matter here. <Term color={C.green}>PASS</Term> and{' '}
        <Term color={C.red}>FAIL</Term> are obvious. <Term color={C.muted}>SKIP</Term> is honest about
        what wasn't checked, so a missing tool never reads as a pass. The whole result model is ten
        lines:
      </P>
      <Pre label="scripts/harness/harness.py">{`class Report:
    def __init__(self):
        self.rows = []  # (status, check, detail)

    def add(self, ok, check, detail=""):
        self.rows.append(("PASS" if ok else "SKIP" if ok is None else "FAIL", check, detail))

    @property
    def failed(self):
        return any(s == "FAIL" for s, _, _ in self.rows)`}</Pre>

      <H3>Verify: test the outcome, not the command</H3>
      <P>
        <Code>helm upgrade --wait</Code> exiting 0 means Kubernetes reached the desired state. Verify
        checks what users and operators care about, independently:
      </P>
      <Table
        head={['Check', 'A false green it prevents']}
        rows={[
          ['Rollout complete', 'Deployment stuck partway'],
          ['All pods Ready', 'Some replicas unhealthy'],
          ['Zero restarts', 'Readiness passed, then the app crashed'],
          ['Image tag equals target', 'The old version is still running'],
          ['Secret sync Ready', 'ExternalSecret failing behind healthy pods'],
          ['Smoke URLs return 2xx, with retries', 'Pods fine, but ingress or TLS broken'],
        ]}
      />
      <P>
        Smoke checks use the public URL on purpose. They travel the same path as a user: DNS, TLS,
        ingress, service, pod. Retries (10 attempts, 6 seconds apart) absorb ingress reloads without
        hiding a real failure.
      </P>

      <H3>Diagnose: turn symptoms into a cause</H3>
      <P>
        At 3 a.m. nobody wants to remember which <Code>kubectl</Code> flag shows the crashed
        container's logs. Diagnose gathers history, pod state, Warning events, logs and migration
        output, then runs an ordered table of patterns over all of it:
      </P>
      <Pre label="CAUSES: (pattern, cause, what to do)">{`(re.compile(r"ImagePullBackOff|ErrImagePull|manifest unknown|..."),
 "Image cannot be pulled",
 "The tag was not pushed (did the build job finish?) or the registry rejects the pull. ..."),

(re.compile(r"BackoffLimitExceeded|DeadlineExceeded"),
 "Migration job failed",
 "... Read the migration log below. Do NOT downgrade in prod; ship a forward fix."),`}</Pre>
      <P>Three small decisions make this trustworthy:</P>
      <Table
        head={['Decision', 'Why']}
        rows={[
          ['Always returns exit 0', 'A diagnosis tool must never mask the original failure'],
          ['Lists every matching cause', 'Failures chain, and one match can mislead'],
          ['Says "no known pattern" when unsure', 'It is pattern matching, not proof'],
        ]}
      />
      <Callout tone="win" title="Why the kit avoids --atomic">
        <Code>helm --atomic</Code> rolls back automatically, but removes the failed pods first, along
        with the evidence. The kit does it in order: fail, diagnose, then roll back. It gets the same
        safety with an explanation attached.
      </Callout>

      <H3>Rollback: narrow on purpose</H3>
      <Pre label="scripts/harness/harness.py — cmd_rollback">{`if len(history) < 2 or history[-1].get("status") != "failed":
    print("... nothing to roll back to; leaving as is")
    return 0
target = history[-2]["revision"]
run(["helm", "-n", ns, "rollback", rel, str(target), "--wait", "--timeout", "5m"], timeout=330)`}</Pre>
      <P>
        It acts only when Helm recorded a failure, and is safe to run twice. The consequence is
        easy to miss: <Term color={C.red}>a verify NO-GO after Helm succeeded does not roll back</Term>,
        because the revision is <Code>deployed</Code>. The job goes red and a person decides. Whether
        that's right depends on your risk appetite, but it should be a choice you know you made. The
        Failure Lab lets you trace this.
      </P>

      <H3>Build properties to copy</H3>
      <Table
        head={['Property', 'Implementation']}
        rows={[
          ['No dependencies', 'Python standard library, so nothing to install on a runner'],
          ['Never raises on tool failure', 'run() converts missing binaries and timeouts to return codes'],
          ['One test seam', 'Tests replace run() and kubectl_json(), no cluster required'],
          ['Machine and human output', 'Exit code for CI, markdown table for GITHUB_STEP_SUMMARY'],
          ['Secrets stay out', 'Go-template emits key names only; all logs pass through redact()'],
          ['Same tool locally', 'make deploy-verify runs what CI runs'],
        ]}
      />

      <H3>Testing a harness without a cluster</H3>
      <P>
        Everything external goes through <Code>run()</Code>, so tests can script the outside world.
        This one proves two behaviours at once: the cause is found, and the password never reaches
        the report.
      </P>
      <Pre label="scripts/harness/test_harness.py">{`def fake_run(cmd, timeout=60):
    if cmd[0] == "kubectl" and "logs" in cmd:
        return 0, "boom DATABASE_URL=postgres://app:topsecret@db/app"
    return 0, "1 deployed"

...
self.assertIn("Container crash-loops", text)
self.assertNotIn("topsecret", text)`}</Pre>
      <Callout tone="info" title="Test what must never happen">
        Good harness tests guard negatives: secret values never requested, healthy releases never
        rolled back, migration advice never suggests a downgrade. A regression in any of those is
        worse than a missing feature.
      </Callout>

      <H3>The same idea, around AI agents</H3>
      <P>
        Agent harness engineering applies this thinking to AI: improve outcomes by changing the
        system around the model. An agent that can run commands needs the same layers as a risky
        deploy. The kit stacks them:
      </P>
      <Table
        head={['Layer', 'Mechanism', 'Stops']}
        rows={[
          ['Context', 'CLAUDE.md, skills, agents', 'Wrong conventions, repeated mistakes'],
          ['Permissions', 'allow and ask lists in settings.json', 'Unreviewed push, helm upgrade, rollback'],
          ['Hooks', 'guard-bash.sh exits 2 to block a call', 'Merges, force pushes, prod commands'],
          ['Read-only tools', 'make deploy-preflight, verify, diagnose', 'Agents get insight, not write access'],
          ['Repo gates', 'gate-guard.yml removes bot-set labels', 'Faked human approvals'],
          ['Platform gates', 'Environment reviewers, branch protection', 'Anything the layers above miss'],
        ]}
      />
      <P>
        Note that <Code>rollback</Code> has no Make target at all. Agents can diagnose a production
        problem, but can't act on it. That's a capability removed by design, not a rule the agent is
        asked to follow.
      </P>
      <Callout tone="warn" title="Hooks are not a security boundary">
        <Code>guard-bash.sh</Code> blocks a command only if its text contains <Code>prod</Code>, so{' '}
        <Code>helm upgrade app . -n $NS</Code> would pass the filter. Pattern matching stops accidents.
        The real boundary is that no agent holds a production credential: <Code>KUBECONFIG</Code> lives
        in a GitHub Environment behind reviewers.
      </Callout>

      <Recall
        items={[
          ['Why does diagnose return 0 even when it finds problems?', 'The deploy step already failed. If diagnose altered the exit code, it could hide or replace the original failure. It reports, it doesn\'t decide.'],
          ['What\'s the risk of treating a skipped check as passed?', 'A missing helm binary would look like a valid chart. SKIP keeps the gap visible in the report.'],
          ['You add a check that needs the deployed ExternalSecret. Preflight or verify?', 'Verify. The object does not exist until the deploy creates it, which is why preflight deliberately skips this when External Secrets is on.'],
          ['An agent proposes adding a make deploy-rollback target. Good idea?', 'No. The runbook guarantees the rollback step exists only in CI so agents can\'t trigger it. A Make target would remove that capability boundary.'],
        ]}
      />
    </Section>
  );
}
