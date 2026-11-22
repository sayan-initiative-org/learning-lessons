import React from 'react';
import { Section, H3, P, Callout, Pre, Code } from '../components/ui';
import FailureLab from '../components/FailureLab';

export default function Lab() {
  return (
    <Section
      id="lab"
      kicker="Module 09 · Failure Lab"
      title="Predict the failure, then check yourself"
    >
      <P>
        Deployment knowledge only counts when something breaks. Each scenario follows the real branches
        in <Code>harness.py</Code> and the deploy action. Make a prediction before you reveal the answer,
        especially for the two kinds of ending: <em>rolled back</em> and <em>still live</em>.
      </P>
      <FailureLab />

      <H3>Hands-on exercises</H3>
      <P>
        These need only Python and a Helm binary, with no cluster. Run them from the root of{' '}
        <Code>agentic-sdlc-kit</Code>.
      </P>

      <H3>Exercise 1: run the safety net</H3>
      <Pre label="expect: Ran 22 tests ... OK">{`python3 -m unittest discover -s scripts/harness`}</Pre>

      <H3>Exercise 2: read a plan</H3>
      <Pre label="spot what differs, and explain why">{`python3 scripts/harness/harness.py plan --env staging | python3 -m json.tool
python3 scripts/harness/harness.py plan --env pr-7    | python3 -m json.tool
python3 scripts/harness/harness.py plan --env qa      # should refuse`}</Pre>

      <H3>Exercise 3: make preflight fail on purpose</H3>
      <Pre label="exit code 1 and two ❌ rows">{`python3 scripts/harness/harness.py preflight \\
  --env prod --tag latest --host '' --offline
echo "exit=$?"`}</Pre>
      <P>
        Now plant a secret in a scratch values file. Preflight reads values from the chart folder, so
        put the copy there, and delete it afterwards.
      </P>
      <Pre label="one ❌ row for the literal secret, then a surprise">{`cp deploy/helm/app/values-dev.yaml deploy/helm/app/values-scratch.yaml
echo 'password: hunter2' >> deploy/helm/app/values-scratch.yaml
python3 scripts/harness/harness.py preflight --env dev --tag v1.0.0 \\
  --host dev.example.com --values values-scratch.yaml --offline

# Swap that line for an inline map and run it again. This one passes.
sed -i.bak '$d' deploy/helm/app/values-scratch.yaml
echo 'extra: { SECRET_KEY: hunter2 }' >> deploy/helm/app/values-scratch.yaml
python3 scripts/harness/harness.py preflight --env dev --tag v1.0.0 \\
  --host dev.example.com --values values-scratch.yaml --offline

rm deploy/helm/app/values-scratch.yaml deploy/helm/app/values-scratch.yaml.bak`}</Pre>
      <P>Module 10 explains why the second one slips through.</P>

      <H3>Exercise 4: render a chart and read the result</H3>
      <Pre label="compare what environments actually produce">{`cd deploy/helm/app
for env in dev staging prod; do
  echo "== $env"
  helm template app . -f values.yaml -f values-$env.yaml --set image.tag=v1.0.0 \\
    | grep '^kind:' | sort | uniq -c
done

# Prove required works
helm template app . -f values.yaml

# Confirm replicas is absent when the HPA is on
helm template app . -f values.yaml -f values-prod.yaml --set image.tag=v1.0.0 \\
  | grep -c 'replicas:'`}</Pre>

      <H3>Exercise 5: teach the harness a new failure</H3>
      <P>Follow the runbook's rule: add a pattern, and add a test first.</P>
      <Pre label="scripts/harness/test_harness.py, in ClassifyTests — write this first and watch it fail">{`def test_certificate_failure(self):
    self.assertIn(
        "TLS certificate problem",
        self.causes("x509: certificate has expired or is not yet valid"),
    )`}</Pre>
      <Pre label="scripts/harness/harness.py — then add a row to CAUSES">{`(re.compile(r"(?i)x509:|certificate has expired|tls: handshake failure"),
 "TLS certificate problem",
 "Check cert-manager, the ingress tlsSecret and certificate expiry."),`}</Pre>

      <H3>Exercise 6: fix a real gap</H3>
      <P>
        Choose a finding from Module 10, write the failing test first, and fix it. Good starters are the
        redaction gap and the OOM misclassification, since both need only Python.
      </P>

      <Callout tone="idea" title="Going further: a real cluster">
        <Code>kind create cluster</Code> gives you a local cluster where you can run the failures for
        real: set an impossible memory request, or a tag that doesn't exist, then run{' '}
        <Code>make deploy-diagnose env=dev</Code>. Use a throwaway cluster only, and check your kubeconfig
        context first. Running it would also close the gap the runbook admits: the harness has never been
        exercised on a real cluster.
      </Callout>
    </Section>
  );
}
