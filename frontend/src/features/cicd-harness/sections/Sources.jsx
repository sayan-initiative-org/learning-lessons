import React from 'react';
import { Section, H3, P, Pre, Code, Table, Ref } from '../components/ui';

export default function Sources() {
  return (
    <Section
      id="sources"
      kicker="Module 11 · Cheat Sheet & Sources"
      title="Keep this open during a deploy"
    >
      <H3>Harness commands</H3>
      <Pre label="all read-only against the cluster">{`make test-harness
make deploy-preflight env=dev tag=<sha> host=dev.app.example.com
make deploy-preflight env=dev tag=<sha> host=dev.app.example.com offline=1
make deploy-verify    env=staging tag=v1.2.0 host=staging.app.example.com
make deploy-diagnose  env=staging
python3 scripts/harness/harness.py plan --env prod`}</Pre>

      <H3>First response when a deploy fails</H3>
      <Pre label="in order">{`1. Job summary       Preflight, Verify, Diagnosis tables
2. What's serving?   helm -n app-<env> history app --max 5
3. Pods              kubectl -n app-<env> get pods
4. Why not running?  kubectl -n app-<env> describe pod <pod>     # Events at the bottom
5. Why crashed?      kubectl -n app-<env> logs <pod> --previous
6. Recent warnings   kubectl -n app-<env> get events --field-selector type=Warning
7. Migration         kubectl -n app-<env> logs job/app-migrate-<revision>
8. Routing           kubectl -n app-<env> get endpointslices,ingress`}</Pre>

      <H3>Pod status decoder</H3>
      <Table
        head={['Status', 'Usually', 'Look at']}
        rows={[
          ['ImagePullBackOff', 'Tag missing or no pull access', 'Tag, imagePullSecrets'],
          ['CreateContainerConfigError', 'Referenced Secret or key missing', 'kubectl get secret, ExternalSecret'],
          ['CrashLoopBackOff', 'Process exits on start', 'logs --previous, exit code'],
          ['OOMKilled', 'Memory limit exceeded', 'describe pod → Last State'],
          ['Pending', 'No node fits', 'Events, requests, taints'],
          ['Running, not Ready', 'Readiness failing', 'Probe path, app logs'],
        ]}
      />

      <H3>Production readiness checklist</H3>
      <Table
        head={['Area', 'Check']}
        rows={[
          ['Pipeline', 'CD runs only after CI passes. One image, promoted by digest'],
          ['Config', 'Values overlays are small, and secret values aren\'t in Git'],
          ['Harness', 'Preflight, verify, diagnose exist, and their tests run in CI'],
          ['Chart', 'Rendered for each env, schema-validated, server dry-run on staging'],
          ['Workload', 'Three probe types, requests and limits, graceful shutdown'],
          ['Availability', 'HPA, PDB and topology spread'],
          ['Security', 'Actions pinned, least-privilege tokens, OIDC, non-root'],
          ['Data', 'Migrations are expand/contract and lock-safe'],
          ['Recovery', 'Rollback practised, and owner named'],
          ['Operate', 'Alerts and SLOs cover what verify can\'t see'],
        ]}
      />

      <H3>Kit files</H3>
      <P>
        All in <Code>agentic-sdlc-kit</Code>: <Code>deploy/harness/harness.json</Code>,{' '}
        <Code>scripts/harness/harness.py</Code>, <Code>.github/actions/helm-deploy/action.yml</Code>,{' '}
        <Code>.github/workflows/</Code>, <Code>deploy/helm/app/</Code>,{' '}
        <Code>docs/runbooks/deploy-harness.md</Code>.
      </P>

      <H3>Sources</H3>
      <P>Checked on 2026-11-01. Version-sensitive topics change quickly, so re-check before relying on them.</P>
      <Ref source="Kubernetes Blog" title="Ingress NGINX Retirement: What You Need to Know" note="Nov 2025" href="https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/" />
      <Ref source="Kubernetes Docs" title="Pod Lifecycle" note="termination flow" href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/" />
      <Ref source="Kubernetes Docs" title="Container Lifecycle Hooks" note="preStop" href="https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/" />
      <Ref source="Kubernetes Docs" title="Liveness, Readiness and Startup Probes" href="https://kubernetes.io/docs/concepts/workloads/pods/probes/" />
      <Ref source="Kubernetes Docs" title="Pod Security Standards" href="https://kubernetes.io/docs/concepts/security/pod-security-standards/" />
      <Ref source="Kubernetes Blog" title="In-Place Pod Resize Graduates to Stable" note="v1.35" href="https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/" />
      <Ref source="Helm Docs" title="Chart Hooks" note="hook order and delete policies" href="https://helm.sh/docs/topics/charts_hooks/" />
      <Ref source="Helm Blog" title="Helm 3 End of Life" note="support dates, Helm 4" href="https://helm.sh/blog/helm-v3-end-of-life" />
      <Ref source="GitHub Docs" title="Secure use reference" note="SHA pinning, least privilege" href="https://docs.github.com/en/actions/reference/security/secure-use" />
      <Ref source="GitHub Docs" title="Script injections" href="https://docs.github.com/en/actions/concepts/security/script-injections" />
      <Ref source="GitHub Docs" title="OpenID Connect" href="https://docs.github.com/en/actions/concepts/security/openid-connect" />
      <Ref source="GitHub Docs" title="Securely using pull_request_target" href="https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target" />
      <Ref source="GitHub Docs" title="Troubleshooting required status checks" href="https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks" />
      <Ref source="GitHub Docs" title="Concurrency" note="pending runs, queue: max" href="https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency" />
      <Ref source="Aqua Security" title="Trivy supply chain attack: what you need to know" note="CVE-2026-33634" href="https://www.aquasec.com/blog/trivy-supply-chain-attack-what-you-need-to-know" />
      <Ref source="Vendor analysis (Wiz)" title="Trivy Compromised" note="incident timeline" href="https://www.wiz.io/blog/trivy-compromised-teampcp-supply-chain-attack" />
      <Ref source="Issue quoting the ESO upgrade note" title="External Secrets 0.17 stops serving v1beta1" note="secondary source, confirm in upstream release notes" href="https://gitlab.com/sylva-projects/sylva-core/-/issues/2506" />
      <Ref source="O'Reilly Radar" title="Agent Harness Engineering" note="secondary overview" href="https://www.oreilly.com/radar/agent-harness-engineering/" />
      <Ref source="DORA" title="DORA's software delivery metrics" href="https://dora.dev/guides/dora-metrics/" />
    </Section>
  );
}
