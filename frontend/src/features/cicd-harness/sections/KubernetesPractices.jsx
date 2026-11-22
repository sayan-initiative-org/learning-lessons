import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code, Table, Recall } from '../components/ui';
import { C } from '../theme';

export default function KubernetesPractices() {
  return (
    <Section
      id="kubernetes"
      kicker="Module 06 · Kubernetes Practices"
      title="Tell Kubernetes the truth about your app, and it will keep it running"
    >
      <P>
        Kubernetes makes decisions from what you declare: how to tell a healthy pod, how much it needs,
        how many must stay up. Most production incidents here trace back to a declaration that was
        missing or untrue.
      </P>

      <H3>Probes: three different questions</H3>
      <Table
        head={['Probe', 'Question', 'If it fails', 'Kit path']}
        rows={[
          ['Startup', 'Has it finished starting?', 'Keeps waiting, then restarts', 'Not set'],
          ['Readiness', 'Can it take traffic now?', 'Removed from Service, not restarted', '/api/readyz'],
          ['Liveness', 'Is it stuck beyond recovery?', 'Container restarted', '/api/healthz'],
        ]}
      />
      <Callout tone="warn" title="Never check dependencies in liveness">
        If liveness checked the database, one database blip would restart every pod, turning a small
        outage into a big one. The kit gets this right: <Code>/api/healthz</Code> has no dependencies,
        and <Code>/api/readyz</Code> checks the database. Even readiness needs thought, because if the
        database fails, all pods leave the Service at once. That's usually correct, but do it knowingly.
      </Callout>
      <P>
        Slow starters need a startup probe rather than a long <Code>initialDelaySeconds</Code>. Kubernetes
        holds liveness and readiness until it succeeds, so size it to cover the worst case:{' '}
        <Code>failureThreshold × periodSeconds</Code>. The kit uses a 10 second liveness delay, which
        a slow cold start could exceed.
      </P>
      <Pre label="add to the chart">{`startupProbe:
  httpGet: { path: /api/healthz, port: http }
  periodSeconds: 5
  failureThreshold: 24     # allows 2 minutes to start`}</Pre>

      <H3>Rolling updates, step by step</H3>
      <P>
        The kit sets <Code>maxSurge: 1, maxUnavailable: 0</Code>: add one new pod, wait until Ready,
        remove one old pod. Capacity never drops below the desired count.
      </P>
      <Pre label="3 replicas, maxSurge 1, maxUnavailable 0">{`start    [v1] [v1] [v1]
surge    [v1] [v1] [v1] [v2…]     new pod starting
ready    [v1] [v1] [v1] [v2 ✓]    readiness passes
remove   [v1] [v1]      [v2 ✓]    one old pod terminates
...repeat until
done                    [v2 ✓] [v2 ✓] [v2 ✓]`}</Pre>
      <P>
        During the roll, <Term>both versions serve traffic</Term>, and both share one database. That's
        why migrations must stay backward compatible. If a new pod never becomes Ready, the rollout just
        stops with old pods serving. The cluster needs room for the surge pod, too.
      </P>

      <H3>Graceful shutdown: the 502 nobody expects</H3>
      <P>
        Pod termination and removal from load balancing happen at the same time, not in sequence. A
        pod can receive SIGTERM while traffic is still being routed to it, which appears as a short
        burst of errors on every deploy.
      </P>
      <Pre label="what happens when a pod is deleted">{`pod marked Terminating
   ├─▶ EndpointSlice update ─▶ proxies and ingress stop routing (takes a moment)
   └─▶ preStop hook ─▶ SIGTERM ─▶ app drains ─▶ exit
                                   grace period covers all of this (default 30s)
                                   then SIGKILL`}</Pre>
      <Pre label="fix: delay shutdown so routing catches up (not in the chart yet)">{`spec:
  terminationGracePeriodSeconds: 45
  containers:
    - lifecycle:
        preStop:
          exec: { command: ["sleep", "10"] }`}</Pre>
      <P>
        The preStop time counts against the grace period, so raise the period to match. The app must
        also handle SIGTERM by finishing in-flight requests. The kit's exec-form <Code>CMD</Code> makes
        sure the app receives the signal.
      </P>

      <H3>Resources: requests and limits are different things</H3>
      <Table
        head={['', 'Request', 'Limit']}
        rows={[
          ['Used by', 'The scheduler, to pick a node', 'The kubelet and kernel, at runtime'],
          ['CPU', 'Guaranteed share', 'Throttled, app gets slower'],
          ['Memory', 'Guaranteed reservation', 'Container is OOMKilled'],
        ]}
      />
      <P>
        Set requests from measured usage. Too low and nodes get overpacked. Too high and you pay for
        idle capacity. HPA CPU targets are a percentage of the <Term>request</Term>, so wrong requests
        also mean wrong scaling. Kubernetes 1.35 made in-place pod resize stable, so CPU and memory can
        change without recreating the pod, if your cluster supports it.
      </P>

      <H3>Availability: HPA, PDB and spread</H3>
      <Table
        head={['Object', 'Protects against', 'Kit']}
        rows={[
          ['HorizontalPodAutoscaler', 'Traffic exceeding capacity', 'On in staging and prod'],
          ['PodDisruptionBudget', 'Voluntary evictions such as node drains', 'minAvailable 2 in prod'],
          ['topologySpreadConstraints', 'One node or zone taking out all replicas', 'Not set'],
        ]}
      />
      <Callout tone="warn" title="PDB arithmetic">
        A PDB covers voluntary disruptions only, not crashes. Keep <Code>minAvailable</Code> below
        replica count: with 1 replica and <Code>minAvailable: 1</Code>, a node drain blocks forever.
        Prod's 2-of-3 and staging's 1-of-2 both leave room. Dev turns the PDB off, which fits one replica.
      </Callout>
      <Pre label="spread replicas across zones">{`topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels: { app.kubernetes.io/name: app-api }`}</Pre>

      <H3>Security context: the kit's strongest area</H3>
      <Pre label="deploy/helm/app/values.yaml">{`podSecurityContext:
  runAsNonRoot: true
  runAsUser: 10001
  fsGroup: 10001
  seccompProfile: { type: RuntimeDefault }

containerSecurityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities: { drop: ["ALL"] }`}</Pre>
      <P>
        This aligns with the Pod Security Standards <Code>restricted</Code> profile. A read-only root
        filesystem blocks a whole class of attacks, and is the reason the chart mounts{' '}
        <Code>emptyDir</Code> volumes at <Code>/tmp</Code> and at <Code>.next/cache</Code>: apps need
        somewhere writable, and now it's explicit. One easy addition remains. Pods get a service
        account token by default, and neither workload needs the Kubernetes API, so set{' '}
        <Code>automountServiceAccountToken: false</Code>.
      </P>

      <H3>Network policy</H3>
      <P>
        Pods accept traffic from anywhere in the cluster by default. The kit's policies allow only web
        and the ingress controller to reach api, and only the ingress controller to reach web. Three
        caveats apply: your CNI must enforce NetworkPolicy, or the object is silently ignored; egress
        remains open; and the chart names the <Code>ingress-nginx</Code> namespace directly.
      </P>

      <H3>Traffic: ingress-nginx has been retired</H3>
      <Callout tone="warn" title="Time-sensitive">
        The Kubernetes project retired ingress-nginx in March 2026: no more releases, bug fixes or
        security patches. Existing installs keep running, but unpatched. The kit's chart uses{' '}
        <Code>className: nginx</Code>. Check for it with{' '}
        <Code>kubectl get pods -A -l app.kubernetes.io/name=ingress-nginx</Code>. The project points to
        Gateway API, and warns that no alternative is a drop-in replacement, so plan engineering time.
      </Callout>

      <H3>Scorecard for the kit's workloads</H3>
      <Table
        head={['Practice', 'Status']}
        rows={[
          ['Liveness and readiness, separated', 'Done'],
          ['Requests and limits on every container', 'Done'],
          ['Non-root, read-only FS, dropped capabilities, seccomp', 'Done'],
          ['Zero-unavailable rolling update', 'Done'],
          ['HPA without fixed replicas', 'Done'],
          ['PDB, NetworkPolicy in staging and prod', 'Done (ingress only)'],
          ['Startup probe', 'Missing'],
          ['preStop delay and grace period', 'Missing'],
          ['Topology spread', 'Missing'],
          ['Disable service account token', 'Missing'],
          ['Supported ingress controller', 'Needs migration'],
          ['Metrics, alerts, dashboards in the kit', 'Out of scope, needed in production'],
        ]}
      />

      <Recall
        items={[
          ['Readiness fails on one pod. What happens to it?', 'It stops getting traffic but keeps running, with no restart. It rejoins when readiness passes again.'],
          ['You see brief 502s only during deploys. First suspect?', 'Shutdown ordering. Add a preStop delay and make sure the app drains on SIGTERM.'],
          ['An app is slow under load but never restarts. Memory or CPU limit?', 'Likely CPU throttling. CPU limits slow a container down, while memory limits kill it.'],
          ['Why does a read-only root filesystem need emptyDir mounts?', 'Runtimes need temp space. Explicit writable mounts keep that small and known.'],
        ]}
      />
    </Section>
  );
}
