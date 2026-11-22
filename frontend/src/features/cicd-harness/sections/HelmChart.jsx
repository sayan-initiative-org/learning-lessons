import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function HelmChart() {
  return (
    <Section
      id="helm"
      kicker="Module 05 · Helm Charts"
      title="A chart is a function: values go in, manifests come out"
    >
      <P>
        Helm has three nouns. A <Term color={C.cyan}>chart</Term> is the template package. A{' '}
        <Term color={C.blue}>release</Term> is one installed instance of it. A{' '}
        <Term color={C.accent}>revision</Term> is one numbered version of that release, stored by Helm
        in the cluster. Every upgrade or rollback adds a revision, which is why{' '}
        <Code>helm history</Code> can act as a deployment log.
      </P>
      <Pre label="deploy/helm/app">{`Chart.yaml              name, version, appVersion
values.yaml             defaults for every environment
values-{dev,staging,prod}.yaml
templates/
  _helpers.tpl          reusable named templates
  deployments.yaml      Deployment, Service, HPA, PDB per component
  migrate-job.yaml      Alembic hook
  externalsecret.yaml   optional secret sync
  ingress.yaml          /api → api, / → web
  networkpolicy.yaml    who may connect to whom
  postgres-ephemeral.yaml   previews only`}</Pre>

      <H3>One template, many workloads</H3>
      <P>
        Rather than duplicate files for web and api, <Code>deployments.yaml</Code> loops over{' '}
        <Code>components</Code>. Rendered for prod, that one file produces 2 Deployments, 2 Services,
        2 HPAs and 2 PodDisruptionBudgets.
      </P>
      <Pre label="templates/deployments.yaml">{`{{- range $name, $c := .Values.components }}
{{- if $c.enabled }}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-{{ $name }}
  labels:
    {{- include "app.labels" $ | nindent 4 }}`}</Pre>
      <Table
        head={['Syntax', 'Meaning']}
        rows={[
          ['$', 'The root context. Inside range, the dot changes, so use $ to reach .Values'],
          ['{{-', 'Trims the whitespace before it, keeping output tidy'],
          ['nindent 4', 'Newline plus 4 spaces, for correct YAML nesting'],
          ['toYaml', 'Turns a values object into YAML, as with resources'],
          ['with', 'Renders a block only if the value is set, and rescopes the dot'],
          ['| quote', 'Quotes a value, so "true" stays a string in env'],
        ]}
      />

      <H3>Patterns worth knowing</H3>
      <Pre label="required: fail at render time, not at runtime — _helpers.tpl">{`{{- define "app.image" -}}
{{- $root := index . 0 -}}{{- $name := index . 1 -}}
{{- printf "%s/%s:%s" $root.Values.image.repository $name
      (required "image.tag is required" $root.Values.image.tag) -}}
{{- end -}}

# Output with no tag:
# Error: execution error at (app/templates/migrate-job.yaml:26:20): image.tag is required`}</Pre>
      <Pre label="don't fight the autoscaler — templates/deployments.yaml">{`spec:
  {{- if not $c.hpa.enabled }}
  replicas: {{ $c.replicas }}
  {{- end }}`}</Pre>
      <P>
        With an HPA on, the Deployment must not set <Code>replicas</Code>. Otherwise every deploy
        resets the count, undoing the autoscaler during a traffic peak. The prod render confirms the
        field is absent.
      </P>
      <Callout tone="warn" title="Selectors are immutable">
        A Deployment's <Code>selector</Code> can't change after creation. Keep it to stable labels. The
        kit uses only <Code>app.kubernetes.io/name</Code> there, while version labels go on metadata.
        Adding a version to a selector would break the next upgrade.
      </Callout>

      <H3>Hooks: running work at the right moment</H3>
      <P>
        A hook is a resource with an annotation that runs at a lifecycle point. The kit's migration
        Job runs with the <Term>new</Term> image before pods roll:
      </P>
      <Pre label="templates/migrate-job.yaml, rendered for prod">{`kind: Job
metadata:
  name: app-migrate-1          # includes .Release.Revision
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "0"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  backoffLimit: 1              # a failed migration shouldn't loop
  activeDeadlineSeconds: 600
  template:
    spec:
      restartPolicy: Never`}</Pre>
      <Table
        head={['Setting', 'Effect']}
        rows={[
          ['before-hook-creation', 'Clears a leftover Job so the new one can start'],
          ['hook-succeeded', 'Removes it on success, but keeps failures for debugging'],
          ['A failed pre-upgrade hook', 'Stops the upgrade. Old pods keep running'],
          ['post-install (ephemeral DB)', 'Previews migrate after the throwaway Postgres exists'],
        ]}
      />
      <Callout tone="warn" title="Hook ordering bites first installs">
        Helm docs: <Code>pre-install</Code> executes "after templates are rendered, but before any
        resources are created". So a pre-install hook can't depend on a normal resource from the same
        chart. The kit's preview path handles this for Postgres by switching to{' '}
        <Code>post-install</Code>, but the ExternalSecret path has the same problem unhandled. See
        Module 10.
      </Callout>

      <H3>The validation ladder</H3>
      <P>Each rung needs more access and catches more. The kit stops at rung 2.</P>
      <Table
        head={['Rung', 'Command', 'Catches', 'Needs']}
        rows={[
          ['1', 'helm lint', 'Structure and basic mistakes', 'Nothing'],
          ['2', 'helm template', 'Template errors, required values', 'Nothing'],
          ['3', 'kubeconform or similar', 'Fields invalid for your K8s version', 'Schemas'],
          ['4', 'helm upgrade --dry-run=server', 'Admission, missing CRDs, API removals', 'Cluster'],
          ['5', 'helm diff (plugin)', 'Exactly what will change', 'Cluster'],
          ['6', 'helm test', 'A running release works', 'Live release'],
        ]}
      />
      <Callout tone="info" title="Rendering is not acceptance">
        <Code>helm template</Code> is text generation. It will happily render an API version the
        cluster no longer serves. That is exactly the gap behind the kit's ExternalSecret version
        issue in Module 10.
      </Callout>

      <H3>Release states you'll meet</H3>
      <Table
        head={['Status', 'Means', 'Do']}
        rows={[
          ['deployed', 'Current and healthy as far as Helm knows', 'Nothing'],
          ['failed', 'Upgrade or hook failed', 'Diagnose, then roll back'],
          ['superseded', 'An older revision', 'A valid rollback target'],
          ['pending-upgrade', 'An upgrade began and never finished', 'See below'],
        ]}
      />
      <P>
        A runner killed mid-deploy can leave <Code>pending-upgrade</Code>, and later upgrades then fail
        with "another operation is in progress". Inspect with <Code>helm history</Code>, make sure
        nothing is actually running, then roll back to the last good revision. This is why CD sets{' '}
        <Code>cancel-in-progress: false</Code>.
      </P>

      <H3>Helm 4 is here</H3>
      <P>
        Helm 3 got its last feature release in September 2026, and security fixes end on 10 February
        2027. Charts deployable with Helm 3 are intended to work with Helm 4, but behaviour changes:
      </P>
      <Table
        head={['Change', 'Impact on a pipeline']}
        rows={[
          ['Server-side apply by default for new releases', 'Existing releases keep client-side apply unless changed'],
          ['--wait uses kstatus', 'Readiness tracking improves, and needs watch permission'],
          ['--atomic → --rollback-on-failure', 'Old flag still works, deprecated'],
          ['--force → --force-replace', 'Check scripts that use it'],
          ['--dry-run takes none, client or server', 'Use the explicit form'],
        ]}
      />
      <Callout tone="warn" title="Pin your tools">
        <Code>azure/setup-helm</Code> defaults to <Code>latest</Code>, and the kit's action sets no
        version, so CI's Helm major version can change without a commit. Pin it, and upgrade on purpose.
      </Callout>

      <Recall
        items={[
          ['Inside a range, .Values returns nothing. Why?', 'The dot was rebound to the loop item. Use $.Values to reach the root.'],
          ['Why is the Job named app-migrate-{{ .Release.Revision }}?', 'Jobs are largely immutable, so each revision needs its own object. A unique name also makes logs easy to match to a revision.'],
          ['A migration hook fails. What does users\' traffic see?', 'No change. The hook runs before pods roll, so the old version keeps serving, though the database may be partly migrated.'],
          ['Which rung catches a CRD that isn\'t installed?', 'Rung 4, server dry-run. Lint and template never talk to the cluster.'],
        ]}
      />
    </Section>
  );
}
