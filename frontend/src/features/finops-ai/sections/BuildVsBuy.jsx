import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Table } from '../components/ui';
import { C } from '../theme';

export default function BuildVsBuy() {
  return (
    <Section
      id="build-vs-buy"
      kicker="Module 02 · Strategy"
      title="Build vs Buy — the decision"
    >
      <P>
        This is rarely binary. Think of a <Term>spectrum</Term>: most real systems live in the
        middle, wrapping a bought model in a built product and data moat.
      </P>
      <Pre label="the build ↔ buy spectrum">{`BUY ───────────────── HYBRID ───────────────── BUILD
Closed API          RAG / prompt-eng          Self-host open models,
(managed LLM,       on top of API,            fine-tune, own serving,
 SaaS AI)           fine-tune managed model   own GPU / infra
──────────────────────────────────────────────────────────
Fast · low capex    Balanced — most           Slow · high capex ·
High marginal cost  systems live here         low marginal cost
Lock-in risk                                  Talent-heavy · max control`}</Pre>

      <H3>Decision factors — score each use case</H3>
      <Table
        head={['Factor', 'Leans BUY', 'Leans BUILD']}
        rows={[
          ['Differentiation', "Context (not your moat)", 'Core — your competitive edge'],
          ['Volume / scale', 'Low or spiky', 'High, sustained'],
          ['Data sensitivity', 'Public / low-risk', "Regulated, can't leave premises"],
          ['Latency / control', 'Standard is fine', 'Tight latency / customization'],
          ['Talent', 'No ML team', 'Have ML / infra engineers'],
          ['Time-to-market', 'Need it now', 'Can invest for months'],
          ['Lock-in tolerance', 'Acceptable', 'Must avoid vendor lock-in'],
        ]}
        align="left"
      />
      <Callout tone="idea" title="Core vs Context (Geoffrey Moore)">
        <em>Build</em> what differentiates you (core); <em>buy</em> everything necessary but
        undifferentiated (context). Most companies should buy the model and build the{' '}
        <Term color={C.violet}>product experience and data moat</Term> around it.
      </Callout>

      <H3>The break-even math — the number that decides it</H3>
      <P>
        API pricing is <Term color={C.blue}>pure variable cost</Term>; self-hosting is{' '}
        <Term color={C.red}>high fixed cost + low marginal cost</Term>. Find the crossover volume
        where the two lines meet:
      </P>
      <Pre label="crossover / break-even">{`Buy (API):        Total = Volume × price_per_call
Build (self-host): Total = Fixed_build + (Volume × marginal_build)

                     Fixed_build
       V*  =  ───────────────────────────────
              price_buy  −  marginal_build

  Volume < V*  →  BUY  (can't amortize fixed GPU cost)
  Volume > V*  →  BUILD can win — IF utilization stays high`}</Pre>
      <Callout tone="warn" title="The utilization trap">
        Self-hosting only beats an API at <em>high, steady</em> utilization. A GPU running at 20%
        is more expensive than the API it replaced. Always model utilization, not peak throughput —
        idle accelerators quietly destroy the build case.
      </Callout>
    </Section>
  );
}
