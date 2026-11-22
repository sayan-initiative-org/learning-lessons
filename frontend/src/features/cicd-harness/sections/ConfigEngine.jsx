import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function ConfigEngine() {
  return (
    <Section
      id="config-engine"
      kicker="Module 03 · The Config Engine"
      title="Describe environments as data, then derive everything from it"
    >
      <P>
        Pipelines often grow by copy and paste: one more job for each environment, with namespaces
        and secret names scattered across YAML. A <Term color={C.violet}>config engine</Term> reverses
        that. One declarative file states what exists, and a small program turns it into exact
        actions. Workflows stop holding facts and only pass the name of an environment.
      </P>
      <Pre label="the four stages of any config engine">{`  DECLARE            RESOLVE              VALIDATE            RENDER
  harness.json  ─▶   resolve_env()   ─▶   preflight      ─▶   helm args
  what exists        env → concrete       is it safe?         exact command`}</Pre>

      <H3>Stage 1: declare</H3>
      <Pre label="deploy/harness/harness.json (abridged)">{`{
  "chart": "deploy/helm/app",
  "release": "app",
  "workloads": ["app-api", "app-web"],
  "smokePaths": ["/healthz", "/api/readyz"],
  "environments": {
    "dev":     { "namespace": "app-dev",     "values": "values-dev.yaml" },
    "staging": { "namespace": "app-staging", "values": "values-staging.yaml" },
    "prod":    { "namespace": "app-prod",    "values": "values-prod.yaml" }
  },
  "previews": {
    "namespacePattern": "pr-{n}",
    "values": "values-dev.yaml",
    "checkSecrets": false
  },
  "secrets": {
    "name": "app-secrets",
    "requiredKeys": ["DATABASE_URL", "SECRET_KEY"],
    "externalSecrets": { "enabled": true, "storeName": "app-secret-store", ... }
  }
}`}</Pre>
      <P>
        Note what's absent: hosts and kubeconfigs stay in GitHub Environments, and secret values
        appear nowhere. <Code>requiredKeys</Code> holds <Term>names only</Term>, which is what makes
        the file safe to commit.
      </P>

      <H3>Stage 2: resolve</H3>
      <P>
        Resolution turns a name into concrete values, and refuses anything unknown. That refusal is
        the feature: a typo stops the deploy instead of creating a stray namespace.
      </P>
      <Pre label="scripts/harness/harness.py">{`def resolve_env(cfg, env):
    if env in cfg["environments"]:
        e = cfg["environments"][env]
        return {"namespace": e["namespace"], "values": e["values"], "check_secrets": True}
    m = re.fullmatch(r"pr-(\\d+)", env)
    if m:
        p = cfg["previews"]
        return {
            "namespace": p["namespacePattern"].format(n=m.group(1)),
            "values": p["values"],
            "check_secrets": p.get("checkSecrets", False),
        }
    raise SystemExit(f"unknown environment '{env}' ...")`}</Pre>

      <H3>Stage 3 and 4: validate, then render</H3>
      <P>
        Preflight is Module 04. Rendering is where the design pays off. Real output from the kit,
        formatted for reading:
      </P>
      <Pre label="$ python3 scripts/harness/harness.py plan --env prod">{`{
  "namespace": "app-prod",
  "values": "values-prod.yaml",
  "check_secrets": true,
  "release": "app",
  "helm_args": [
    "--set", "existingSecret=app-secrets",
    "--set", "externalSecrets.enabled=true",
    "--set-json", "externalSecrets.keys=[\\"DATABASE_URL\\", \\"SECRET_KEY\\"]",
    "--set", "externalSecrets.store.kind=ClusterSecretStore",
    "--set", "externalSecrets.store.name=app-secret-store",
    "--set", "externalSecrets.refreshInterval=1h"
  ]
}`}</Pre>
      <Pre label="$ python3 scripts/harness/harness.py plan --env pr-42">{`{
  "namespace": "pr-42",
  "values": "values-dev.yaml",
  "check_secrets": false,
  "release": "app",
  "helm_args": ["--set", "existingSecret=app-secrets"]
}`}</Pre>
      <P>
        Compare them. A preview uses a throwaway Postgres, so it gets no ExternalSecret, and no
        workflow needed an <Code>if</Code> for that. The chart's secret key list and the harness's
        checks both read <Code>requiredKeys</Code>, so <Term color={C.green}>they cannot disagree</Term>.
        That single-source property is the point of the engine.
      </P>

      <H3>How the workflow consumes the plan</H3>
      <P>
        Arguments travel as a JSON array, not a shell string. <Code>mapfile</Code> restores them with
        quoting intact, which is why a JSON value survives untouched.
      </P>
      <Pre label=".github/actions/helm-deploy/action.yml">{`plan=$(python3 scripts/harness/harness.py plan --env "\${{ inputs.env }}" --values "\${{ inputs.values }}")
echo "namespace=$(jq -r .namespace <<<"$plan")" >> "$GITHUB_OUTPUT"
echo "$plan" | jq -c .helm_args > "$RUNNER_TEMP/harness-helm-args.json"

# later, in the Helm step
mapfile -t chart_args < <(jq -r '.[]' "$RUNNER_TEMP/harness-helm-args.json")
helm upgrade --install app deploy/helm/app ... "\${chart_args[@]}" --wait --timeout 10m`}</Pre>

      <H3>What a change costs</H3>
      <Table
        head={['You want to', 'Change', 'Workflow edits']}
        rows={[
          ['Add a required secret', 'One key name in requiredKeys, plus the value in the store', 'None'],
          ['Add a smoke path', 'smokePaths', 'None'],
          ['Tune environment detail', 'values-<env>.yaml', 'None'],
          ['Add an environment', 'harness.json, a values file, a GitHub Environment', 'One deploy job in cd.yml'],
        ]}
      />
      <P>
        The last row shows the engine's boundary: job order and approvals still live in{' '}
        <Code>cd.yml</Code>. That's reasonable, because promotion order is pipeline logic, not
        environment data.
      </P>

      <H3>Design rules for your own engine</H3>
      <Table
        head={['Rule', 'Why', 'Kit example']}
        rows={[
          ['Facts in data, behaviour in code', 'Changing a fact needs no logic review', 'harness.json vs harness.py'],
          ['Fail closed on unknowns', 'Typos must not become new targets', 'resolve_env raises SystemExit'],
          ['Commit names, never values', 'The config stays safe to read and log', 'requiredKeys'],
          ['Pure resolve step', 'Testable without a cluster', 'plan makes no network call'],
          ['Test the config itself', 'Bad data fails in CI, not at deploy', 'test_values_files_exist_for_every_env'],
          ['Keep it small', 'A DSL is a product you must maintain', 'Standard library only'],
        ]}
      />

      <H3>A minimal engine you can write in an afternoon</H3>
      <Pre label="the smallest useful version">{`import json, sys

cfg = json.load(open("deploy/envs.json"))
env = sys.argv[1]
if env not in cfg["environments"]:
    sys.exit(f"unknown environment: {env}")

e = cfg["environments"][env]
print(json.dumps({
    "namespace": e["namespace"],
    "args": ["-f", "values.yaml", "-f", e["values"]],
}))`}</Pre>
      <P>
        Start here. Add a check only after a real failure teaches you that you need it. The kit's
        harness is about 460 lines, and each part maps to a failure you can name.
      </P>

      <H3>Build it or use a tool?</H3>
      <Table
        head={['Option', 'Good at', 'Consider it when']}
        rows={[
          ['Helm values only', 'Simple overlays', 'One service, few rules around deploys'],
          ['Small custom engine', 'Your exact rules, tiny surface', 'You need checks and diagnosis around Helm'],
          ['Kustomize', 'Patching plain YAML, no templates', 'You prefer overlays to templating'],
          ['Argo CD ApplicationSet', 'Generating deploys across clusters', 'Many apps or clusters, GitOps adopted'],
          ['CUE, Jsonnet', 'Typed or computed config', 'Config is big enough to need a language'],
        ]}
      />

      <Callout tone="warn" title="Where the kit's engine stops short">
        <Code>plan</Code> returns <Code>release</Code>, but the action still hardcodes{' '}
        <Code>app</Code> and <Code>deploy/helm/app</Code>, so those facts live in two places. Nothing
        validates <Code>harness.json</Code> against a schema either: a missing key becomes a{' '}
        <Code>KeyError</Code>. Both are worth fixing, and the chart can gain a{' '}
        <Code>values.schema.json</Code> the same way.
      </Callout>

      <Recall
        items={[
          ['Why pass helm args as a JSON array instead of a string?', 'A string would be re-split by the shell, breaking values with quotes or spaces such as the JSON key list. An array keeps each argument whole.'],
          ['Should the promotion order dev → staging → prod go in harness.json?', 'Not in this design. It is workflow logic tied to gates and job dependencies, so it stays in cd.yml. The engine owns what an environment is, not when it runs.'],
          ['What makes plan easy to test?', 'It only reads a file and prints JSON. No cluster, no network, no side effects.'],
        ]}
      />
    </Section>
  );
}
