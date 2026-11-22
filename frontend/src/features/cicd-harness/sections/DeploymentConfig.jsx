import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function DeploymentConfig() {
  return (
    <Section
      id="deploy-config"
      kicker="Module 02 · Deployment Config"
      title="One image, many environments: where each setting belongs"
    >
      <P>
        Build-once only works if everything environment-specific lives outside the image. Good
        deployment config comes down to one question for each setting:{' '}
        <Term>who owns it, and when does it change?</Term>
      </P>

      <H3>The layers</H3>
      <Table
        head={['Layer', 'Holds', 'Changes when', 'Kit location']}
        rows={[
          ['Image', 'Code, dependencies, runtime user', 'Every merge', 'apps/*/Dockerfile'],
          ['Chart defaults', 'Probes, security, safe defaults', 'Platform work', 'values.yaml'],
          ['Env overlay', 'Replicas, HPA, log level, flags', 'Env tuning', 'values-<env>.yaml'],
          ['Deploy-time', 'Image tag, public host', 'Every deploy', 'helm --set from CD'],
          ['Harness config', 'Env map, secret key names, smoke paths', 'Topology changes', 'harness.json'],
          ['Platform', 'KUBECONFIG, APP_HOST, reviewers', 'Rarely', 'GitHub Environments'],
          ['Secret store', 'Secret values', 'Rotation', 'External store, never Git'],
        ]}
      />

      <H3>How Helm merges values</H3>
      <P>
        Later sources win. Maps merge key by key, while <Term color={C.red}>lists are replaced
        whole</Term>. <Code>--set</Code> beats every <Code>-f</Code> file.
      </P>
      <Pre label="precedence, weakest to strongest">{`values.yaml  <  -f values-prod.yaml  <  --set image.tag=v1.2.0`}</Pre>
      <Pre label="deep merge in action">{`# values.yaml
components:
  web:
    env:
      API_BASE_URL: http://app-api:8000
      ENABLE_PROTOTYPES: "false"

# values-dev.yaml
components:
  web:
    env: { ENABLE_PROTOTYPES: "true" }

# Result in dev: API_BASE_URL survives, only the flag changes.`}</Pre>
      <Callout tone="idea" title="Keep overlays small">
        The kit's <Code>values-dev.yaml</Code> is 8 lines and <Code>values-prod.yaml</Code> is 16.
        Each overlay is effectively a diff against the defaults, so reviewing "how is prod different?"
        takes seconds. If an overlay repeats a default, delete the line.
      </Callout>

      <H3>Environment differences, by design</H3>
      <P>Staging should resemble prod in shape, even if not in size.</P>
      <Table
        head={['Setting', 'dev', 'staging', 'prod']}
        rows={[
          ['Replicas / HPA', '1 / off', 'HPA 2–4', 'HPA 3–12 api, 3–10 web'],
          ['api memory limit', '512Mi', '512Mi', '1Gi'],
          ['PodDisruptionBudget', 'off', 'minAvailable 1', 'minAvailable 2'],
          ['NetworkPolicy', 'off', 'on', 'on'],
          ['Feature flags default', 'on', 'on', 'off'],
          ['Prototypes', 'on', 'off', 'off'],
        ]}
      />
      <Callout tone="win" title="Feature flags decouple deploy from release">
        <Code>FEATURE_FLAGS_DEFAULT: "off"</Code> in prod means unfinished code can ship dark. Deploying
        puts code on servers. Releasing puts a behaviour in front of users. Treating those as separate
        decisions makes both safer.
      </Callout>

      <H3>Tags: mutable names vs immutable facts</H3>
      <P>
        Preflight rejects <Code>latest</Code> outright. A mutable tag makes three questions
        unanswerable: what is running, what ran yesterday, and what would a rollback restore?
      </P>
      <Pre label="scripts/harness/harness.py — accepted tag forms">{`TAG_RE = re.compile(
  r"^([0-9a-f]{7,40}|v\\d+\\.\\d+\\.\\d+([-+][\\w.]+)?|pr-\\d+-[0-9a-f]{7,40})$"
)
# abc1234  v1.2.0  pr-42-abc1234   → accepted
# latest   v1.2    ABC1234         → rejected`}</Pre>
      <P>
        A SHA tag is still technically movable in a registry. For stronger guarantees, deploy by
        digest (<Code>image@sha256:…</Code>), and make tags immutable in the registry if it supports
        that.
      </P>

      <H3>Images designed for this model</H3>
      <P>Both Dockerfiles use the same pattern. Read them for these details:</P>
      <Table
        head={['Practice', 'Why', 'Where']}
        rows={[
          ['Multi-stage build', 'Compilers and dev dependencies never reach production', 'FROM … AS builder'],
          ['Copy lockfile first', 'Dependency layers stay cached across code changes', 'COPY pyproject.toml uv.lock'],
          ['Numeric USER 10001', 'Kubernetes can verify runAsNonRoot from a number', 'USER 10001'],
          ['Exec-form CMD', 'The app is PID 1 and receives SIGTERM directly', 'CMD ["uvicorn", …]'],
          ['Next.js standalone', 'Ships only traced files, not all of node_modules', 'output: "standalone"'],
        ]}
      />
      <Callout tone="warn" title="Runtime config vs build-time config">
        Next.js inlines <Code>NEXT_PUBLIC_*</Code> variables into the client bundle at build time.
        Anything environment-specific set that way breaks build-once. The kit avoids it with
        server-side <Code>API_BASE_URL</Code>, read at runtime.
      </Callout>

      <H3>Config drift</H3>
      <P>
        Drift is any gap between what Git says and what is running. A hotfix with{' '}
        <Code>kubectl edit</Code> is the classic cause, and the next deploy may silently undo it. The
        rule that prevents it: change Git, then deploy. Module 07 covers GitOps, which detects drift
        continuously.
      </P>

      <Recall
        items={[
          ['An overlay sets imagePullSecrets to one entry; the default has two. How many apply?', 'One. Lists are replaced whole, not merged.'],
          ['Where does a new smoke path go?', 'In harness.json, under smokePaths. It is deployment topology, not chart config, and no workflow changes.'],
          ['Why USER 10001 instead of USER app?', 'With a name, the kubelet cannot verify the user is non-root, and runAsNonRoot fails. The chart also sets runAsUser explicitly.'],
        ]}
      />
    </Section>
  );
}
