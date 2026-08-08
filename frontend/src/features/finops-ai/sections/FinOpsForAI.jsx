import React from 'react';
import { Section, H3, P, Term, Callout, Card, Cols, Pre, Table, Code } from '../components/ui';
import { C, MONO, SANS } from '../theme';

const DRIVERS = [
  ['Tokens', 'The fundamental metering unit for LLM services (~2,048 tokens ≈ 1,500 words).', C.cyan],
  ['API calls', 'Tracked per invocation across managed services.', C.blue],
  ['GPUs / TPUs', 'Hardware consumed during both training and inference.', C.red],
  ['Data ingestion', 'Often uncertain and hard to evaluate up front.', C.accent],
  ['Model training', 'Variable with model complexity and performance targets.', C.violet],
];

export default function FinOpsForAI() {
  return (
    <Section
      id="finops-for-ai"
      kicker="Module 04 · Technology Category"
      title="FinOps for AI"
    >
      <P>
        The FinOps Foundation treats AI as a differentiated category because of four properties:{' '}
        <Term color={C.red}>cost complexity</Term>, a <Term>faster development cycle</Term>,{' '}
        <Term color={C.red}>spend unpredictability</Term>, and a greater need for{' '}
        <Term>policy & governance</Term>. Adoption is now mainstream:{' '}
        <Term color={C.green}>98% of FinOps teams manage AI spend</Term> — up from just 31% two
        years earlier.
      </P>

      <H3>Verified AI cost drivers</H3>
      <Cols min={220}>
        {DRIVERS.map(([t, d, col]) => (
          <Card key={t} style={{ borderLeft: `3px solid ${col}` }}>
            <div style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 700, color: col }}>{t}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted, marginTop: 4 }}>
              {d}
            </div>
          </Card>
        ))}
      </Cols>

      <H3>Allocation & forecasting reality</H3>
      <Callout tone="warn" title="Why AI breaks classic FinOps habits">
        Attribution is hard in <Term>multi-tenant / multi-agent</Term> setups where many projects
        share the same services. Forecast variance is high in early (Crawl/Walk) stages — so the
        Foundation recommends <Term color={C.accent}>shorter forecasting windows</Term> and
        revisiting project funding <em>more frequently</em> until accuracy improves. And note:
        classic <em>rightsizing</em> barely applies — the AI levers are usage optimization, rate
        optimization, and workload placement.
      </Callout>

      <H3>Governance: the AI Investment Council</H3>
      <P>
        The recommended governance body is an <Term color={C.violet}>AI Investment Council</Term>{' '}
        (or equivalent) that approves, evaluates, and tracks AI projects against defined outcomes,
        risk profiles, delivery models, and strategic objectives — creating clear expectations
        before spend scales.
      </P>

      <H3>The unit-economics ladder (the real template)</H3>
      <P>
        This is the Foundation's own maturation path for AI unit economics — it slots directly onto
        the viability test from Module 01:
      </P>
      <Pre label="cost-per-token → cost-per-outcome">{`CRAWL   cost per TOKEN          raw metering — where everyone starts
   │                            (driven by hardware gen, facility
   │                             efficiency, architecture, software stack)
   ▼
WALK    cost per INFERENCE       total inference spend ÷ request volume
        training cost ÷ perf     (accounts for system prompts, context, retries)
   │
   ▼
RUN     cost per OUTCOME         filtered by "token yield rate" — the share of
        → cost per assist         generated tokens that reach a usable result
        → cost per agent action
        → cost per case deflected
        → time-to-close`}</Pre>

      <Callout tone="info" title="Verified formulas — Unit Economics capability">
        <div style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.9, color: C.text }}>
          Cost per API call = Total API Costs ÷ Number of API Calls
          <br />
          &nbsp;&nbsp;e.g. $1,200 ÷ 240,000 = <Term color={C.cyan}>$0.005 / call</Term>
          <br />
          AI ROI = (Financial Benefits − Costs) ÷ Costs × 100
        </div>
      </Callout>

      <H3>Optimization levers unique to AI</H3>
      <Table
        head={['Lever', 'What it does']}
        rows={[
          ['Model right-sizing', 'Use the cheapest model that still passes evals.'],
          ['Prompt / context compression', 'Fewer input tokens per call.'],
          ['Caching', 'Reuse results for repeated / similar requests.'],
          ['Routing / cascades', 'Small model first; escalate to large only when needed.'],
          ['Batching & quantization', 'Raise throughput per GPU-hour.'],
          ['Buy vs self-host', 'The break-even decision from Module 02.'],
        ]}
        align="left"
      />
      <P>
        Track each lever's effect with a <Code>cost per outcome</Code> metric — not raw spend — so
        an optimization that cuts tokens but hurts quality shows up honestly.
      </P>
    </Section>
  );
}
