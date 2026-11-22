import React from 'react';
import { Section, H3, P, Callout, Pre, Code, Table } from '../components/ui';

export default function KitAudit() {
  return (
    <Section
      id="audit"
      kicker="Module 10 · Audit the Kit"
      title="A strong first version still has gaps. Learn to find them."
    >
      <P>
        Reviewing a pipeline is its own skill, so here is a real audit of the kit from 1 November 2026.
        The design is sound. These are the gaps that remain, and each one teaches a principle from an
        earlier module. Nothing has been changed in the kit itself.
      </P>
      <Callout tone="info" title="How to read the evidence">
        <strong>Ran</strong> means reproduced by running the code or rendering the chart.{' '}
        <strong>Read</strong> means confirmed in the source. <strong>Docs</strong> means it follows from
        upstream documentation, without a cluster test.
      </Callout>

      <H3>Fix first</H3>
      <Table
        head={['#', 'Finding', 'Effect', 'Evidence']}
        rows={[
          ['1', 'ExternalSecret uses API version v1beta1', 'External Secrets 0.17+ stopped serving it, so Helm would fail on a current operator. harness.json has this path on', 'Read, Docs'],
          ['2', 'First install deadlocks with External Secrets on', 'The pre-install Job needs a Secret that only exists after the hook', 'Ran (render), Docs'],
          ['3', 'CD does not wait for CI', 'cd.yml starts on the same push to main, so a failing main can still build and deploy', 'Read'],
          ['4', 'Failed image scan does not block promotion', 'The image is pushed before Trivy runs, and release can later tag that SHA', 'Read'],
          ['5', 'No action pinned to a SHA', '0 of 15 external actions pinned, including trivy-action, whose tags were hijacked', 'Ran'],
          ['6', 'Script injection in resolve-release', 'Tag name is expanded into a shell script. v1$(id) is a valid tag', 'Ran, Read'],
          ['7', 'redact() misses SECRET_KEY=value', 'One of the kit\'s two required keys can pass into a report in clear text', 'Ran'],
          ['8', 'ingress-nginx is retired', 'No security patches since March 2026', 'Docs'],
        ]}
      />

      <H3>Fix next</H3>
      <Table
        head={['#', 'Finding', 'Effect', 'Evidence']}
        rows={[
          ['9', 'Harness tests never run in CI', 'ci.yml has no such step, and its deploy filter excludes scripts/ and .github/', 'Ran'],
          ['10', 'Values scan has false negatives', 'Misses inline env: { SECRET_KEY: x } and a password inside a DATABASE_URL value', 'Ran'],
          ['11', 'Crash-looping OOM is misclassified', 'Reports "crash-loops", since _waiting_reason skips lastState while waiting', 'Ran'],
          ['12', 'Verify NO-GO never rolls back', 'The runbook documents it, but it is easy to miss. Decide if it is what you want', 'Ran (test)'],
          ['13', 'Helm version floats', 'setup-helm defaults to latest, so a new major can arrive without a commit', 'Read'],
          ['14', 'Concurrency keyed to event', 'A release and a manual redeploy can overlap on one environment', 'Read'],
          ['15', 'Secret rotation has no restart path', 'envFrom values stay stale until the next rollout', 'Read, Docs'],
          ['16', 'Workload hardening gaps', 'No startup probe, preStop, topology spread or token opt-out', 'Ran (render)'],
        ]}
      />

      <H3>Tidy up</H3>
      <Table
        head={['#', 'Finding', 'Evidence']}
        rows={[
          ['17', 'action.yml hardcodes release and chart, though plan knows them', 'Read'],
          ['18', 'No JSON schema for harness.json, no values.schema.json', 'Read'],
          ['19', 'Runbook says preflight fails on a missing secret, but with External Secrets on it passes by design', 'Read'],
          ['20', 'k8s-helm-deploy skill says PDB minAvailable 1, while prod uses 2', 'Read'],
          ['21', 'E2E writes api.log but never uploads it', 'Read'],
        ]}
      />

      <H3>Worked fixes</H3>
      <P>
        <strong>#7 Redaction.</strong> The pattern requires the keyword to be followed directly by{' '}
        <Code>=</Code>, so <Code>SECRET_KEY=</Code> slips through. Allow word characters around it. This
        version was tested against the failing input and still leaves <Code>LOG_LEVEL=info</Code> alone.
        It also masks harmless values such as <Code>secretName: app-tls</Code>, which is the right
        direction for a redactor to err.
      </P>
      <Pre label="replacement pattern, plus a test to add">{`(re.compile(r"(?i)(\\"?[\\w-]*(?:password|passwd|secret|token|api[_-]?key|authorization|private[_-]?key)[\\w-]*\\"?\\s*[:=]\\s*)\\"?[^\\s\\",}]+\\"?"), r"\\1***"),

def test_redact_prefixed_and_suffixed_keys(self):
    out = harness.redact("SECRET_KEY=abcd client_secret: xyz")
    self.assertNotIn("abcd", out)
    self.assertNotIn("xyz", out)`}</Pre>

      <P>
        <strong>#11 OOM classification.</strong> Always include the last termination reason:
      </P>
      <Pre label="scripts/harness/harness.py — tested standalone: now reports both Out of memory and crash-loops">{`def _waiting_reason(cs):
    st = cs.get("state", {})
    last = cs.get("lastState", {}).get("terminated", {}).get("reason", "") if cs.get("restartCount") else ""
    waiting = st.get("waiting", {}).get("reason", "")
    return " ".join(x for x in (waiting, last) if x)`}</Pre>

      <P>
        <strong>#1 API version.</strong> Check your operator version, then change one line. Add a server
        dry-run so the next mismatch fails in preflight:
      </P>
      <Pre label="templates/externalsecret.yaml, and a stronger preflight">{`apiVersion: external-secrets.io/v1

# Talks to the API server without changing anything
helm upgrade --install app deploy/helm/app ... --dry-run=server`}</Pre>
      <Callout tone="warn" title="Try this on a test environment first">
        A server dry-run depends on what already exists in the cluster, so a namespace that hasn't been
        created yet can fail it. Keep preflight quick and read-only as you add this.
      </Callout>

      <P>
        <strong>#2 First install.</strong> A <Code>pre-install</Code> hook can't wait on an ordinary chart
        resource. Making the ExternalSecret a hook too isn't enough, because Helm only waits for Jobs and
        Pods among hooks, not for a custom resource to become Ready. The cleaner option is a bootstrap step
        before Helm:
      </P>
      <Pre label="illustrative step before helm upgrade, on first install">{`# Move the ExternalSecret out of the release, for example into a small
# bootstrap chart, install that, then wait for it:
kubectl -n "$NS" wait externalsecret/app-secrets \\
  --for=condition=Ready --timeout=120s`}</Pre>

      <P>
        <strong>#3 and #9 CI as a real gate.</strong> Make CI reusable, then have CD depend on it, and add
        the harness to CI:
      </P>
      <Pre label=".github/workflows — a sketch">{`# ci.yml
on:
  workflow_call:     # add alongside the existing triggers

# cd.yml
jobs:
  ci:
    if: github.event_name == 'push'
    uses: ./.github/workflows/ci.yml
  build:
    needs: ci

# ci.yml, a new always-on job
harness:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@<sha>
    - run: make test-harness

# And widen the filter for the helm job
deploy: ['deploy/**', 'scripts/harness/**', '.github/actions/**']`}</Pre>

      <P>
        <strong>#4 Scan before push.</strong> Build locally with <Code>load: true</Code>, scan, and push
        only on success. Alternatively, keep the order and have <Code>resolve-release</Code> refuse any
        digest without a passing scan attestation.
      </P>

      <H3>The audit method</H3>
      <P>You can apply these questions to any pipeline:</P>
      <Table
        head={['Ask', 'Finds']}
        rows={[
          ['What does each job actually depend on?', '#3, #4'],
          ['What input can be attacker-controlled?', '#5, #6'],
          ['What do the tests assert against real data shapes?', '#7, #10, #11'],
          ['Which tool only sees text, never the cluster?', '#1'],
          ["What's the very first run like, with nothing in place?", '#2'],
          ['What does the rollback actually trigger on?', '#12'],
          ['Is anything unpinned or past end of life?', '#8, #13'],
        ]}
      />
    </Section>
  );
}
