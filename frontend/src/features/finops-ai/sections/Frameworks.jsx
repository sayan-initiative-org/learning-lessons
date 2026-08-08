import React from 'react';
import { Section, P, Term, Callout, Table } from '../components/ui';
import { C } from '../theme';

export default function Frameworks() {
  return (
    <Section
      id="frameworks"
      kicker="Module 05 · Aligned Frameworks"
      title="The frameworks that plug in around FinOps"
    >
      <P>
        FinOps is the operating discipline, but several established business frameworks feed it.
        These are <Term color={C.red}>not</Term> FinOps Foundation content — they come from
        elsewhere and are merged here because they answer the strategy questions FinOps assumes you
        have already resolved.
      </P>

      <Table
        head={['Framework', 'What it is', 'Where it fits']}
        rows={[
          ['TCO', 'Full lifecycle cost — direct + indirect + hidden', 'Module 01 — evaluating a use case'],
          ['Unit Economics', 'Cost & value per unit of consumption / outcome', 'The FinOps ↔ AI bridge (03, 04)'],
          ['TBM', 'Standard taxonomy mapping IT spend to business services', 'CFO/CIO reporting alongside FinOps'],
          ['Cloud Value Framework', 'Balances cost vs agility, speed, resilience', 'Justifying AI spend beyond raw cost'],
          ['Core vs Context', 'Build what differentiates; buy what doesn’t', 'Module 02 — build-vs-buy'],
          ['Break-even analysis', 'Fixed-vs-variable crossover point', 'The buy→build tipping number'],
          ['Cost of Delay', 'Economic cost of shipping later', 'Weighs against building in-house'],
          ['Showback / Chargeback', 'Attribute (or bill) spend to the team that caused it', 'Drives ownership (Understand domain)'],
          ['ROI / NPV / Payback', 'Standard investment appraisal', 'The funding gate for a use case'],
        ]}
        align="left"
      />

      <Callout tone="idea" title="How they compose">
        <Term color={C.green}>TCO</Term> + <Term color={C.green}>value type</Term> qualify a use
        case → <Term color={C.green}>Core-vs-Context</Term> +{' '}
        <Term color={C.green}>break-even</Term> decide build-vs-buy →{' '}
        <Term color={C.violet}>FinOps</Term> (Understand → Quantify → Optimize → Manage) runs it
        continuously, with <Term color={C.cyan}>unit economics</Term> as the north-star metric
        throughout.
      </Callout>

      <P>
        Attribution matters: <Term>Core vs Context</Term> is Geoffrey Moore's;{' '}
        <Term>TBM</Term> comes from the TBM Council (a separate body from the FinOps Foundation);
        break-even, Cost of Delay, and ROI/NPV are general managerial finance. Only the FinOps
        pieces in Modules 03–04 are FinOps Foundation canon.
      </P>
    </Section>
  );
}
