import React from 'react';
import { Section, H3, P, Term, Callout, Pre, Code } from '../components/ui';
import { C } from '../theme';

export default function CostEval() {
  return (
    <Section
      id="cost-eval"
      kicker="Module 01 · Cost Evaluation"
      title="Evaluating an AI use case — cost & value"
    >
      <P>
        Every AI use case passes through a two-sided test: what it costs to <em>own</em>, and what
        value it <em>returns</em>. Most teams model only the API bill and are blindsided by the
        rest.
      </P>

      <H3>The AI Total Cost of Ownership (TCO) stack</H3>
      <P>
        Inference is the <Term color={C.accent}>visible</Term> cost. Data, talent, and
        human-in-the-loop are usually the <Term color={C.red}>dominant</Term> cost. Model the whole
        stack, top to bottom:
      </P>
      <Pre label="AI TCO — layers teams forget are above the ones they see">{`  7. Governance / risk / guardrails / compliance   ← often ignored
  6. Observability, evals, monitoring (MLOps)
  5. Human-in-the-loop (review, labeling, QA)
  4. Inference / serving  (tokens OR GPU-hours)    ← the "obvious" cost
  3. Retrieval infra (vector DB, embeddings)
  2. Fine-tuning / adaptation (compute + data)
  1. Data (acquisition, labeling, pipelines)
  ─────────────────────────────────────────────
  + Talent (ML / AI engineers — often the biggest line)
  + Opportunity cost of time-to-market`}</Pre>

      <H3>Unit economics — the core of the evaluation</H3>
      <P>
        Reduce everything to a <Term color={C.cyan}>cost per unit of value</Term>. A use case is
        viable only when value per outcome clears the fully-loaded cost plus your target margin:
      </P>
      <Pre label="viability test">{`cost_per_inference = (in_tokens × in_price) + (out_tokens × out_price)

Viable  ⟺  Value_per_outcome  >  Cost_per_outcome + target_margin`}</Pre>
      <P>
        We formalize the token → inference → outcome ladder in Module 04, using the FinOps
        Foundation's own <Code>cost per API call</Code> and token-economics definitions.
      </P>

      <H3>Quantify the value (don't skip this)</H3>
      <P>Classify what the use case actually returns — the value type sets the ROI bar:</P>
      <Callout tone="win" title="Four value types">
        <Term color={C.green}>Revenue-generating</Term> (new product, upsell) →
        incremental revenue &nbsp;·&nbsp; <Term color={C.green}>Cost-avoiding</Term>
        {' '}(automation, deflection) → hours/FTE saved &nbsp;·&nbsp;{' '}
        <Term color={C.green}>Risk-reducing</Term> (fraud, compliance) → loss avoided
        {' '}&nbsp;·&nbsp; <Term color={C.green}>Strategic / experimental</Term> → accept a
        lower ROI bar, but <em>cap the budget explicitly</em>.
      </Callout>
      <P>
        FinOps is emphatic on this point: cost is meaningless without value. The whole{' '}
        <Term color={C.violet}>Quantify Business Value</Term> domain (Module 03) exists to force
        this linkage before spend scales.
      </P>
    </Section>
  );
}
