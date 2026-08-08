import React from 'react';
import { Section, H3, P, Term, Ref, Callout } from '../components/ui';
import { C } from '../theme';

export default function Sources() {
  return (
    <Section
      id="sources"
      kicker="Module 06 · Sources & Templates"
      title="Primary sources & real templates"
    >
      <P>
        Every FinOps claim in this guide is drawn from the FinOps Foundation's own pages, verified
        at build time. The items below are <Term color={C.green}>real, public assets</Term> you can
        open and reuse — not a synthesis.
      </P>

      <H3>Downloadable templates & playbooks</H3>
      <Ref
        source="finops.org · PDF"
        note="the full official framework"
        title="FinOps Framework 2025 (PDF)"
        href="https://www.finops.org/wp-content/uploads/2025/05/English-FinOps-Framework-2025.pdf"
      />
      <Ref
        source="finops.org · working group"
        note="practitioner guide to LLM / GenAI cost"
        title="FinOps for AI — Overview"
        href="https://www.finops.org/wg/finops-for-ai-overview/"
      />
      <Ref
        source="finops.org · insight"
        note="the AI unit-economics playbook"
        title="Token Economics: The Atomic Unit of AI Value"
        href="https://www.finops.org/insights/token-economics-the-atomic-unit-of-ai-value/"
      />
      <Ref
        source="finops.org · capability"
        note="definition + metrics + formulas"
        title="Unit Economics capability"
        href="https://www.finops.org/framework/capabilities/unit-economics/"
      />
      <Ref
        source="finops.org · PDF"
        note="a full worked playbook to model your own on"
        title="U.S. Public Sector FinOps Playbook (PDF)"
        href="https://www.finops.org/wp-content/uploads/2022/10/FinOps-Foundation_US-Gov-Playbook.pdf"
      />

      <H3>Framework reference pages</H3>
      <Ref source="finops.org" title="FinOps for AI — Technology Category" href="https://www.finops.org/framework/technology-categories/ai/" />
      <Ref source="finops.org" title="FinOps Principles" href="https://www.finops.org/framework/principles/" />
      <Ref source="finops.org" title="FinOps Domains" href="https://www.finops.org/framework/domains/" />
      <Ref source="finops.org" title="FinOps Capabilities" href="https://www.finops.org/framework/capabilities/" />
      <Ref source="finops.org" title="What is FinOps?" href="https://www.finops.org/introduction/what-is-finops/" />
      <Ref source="finops.org" title="2025 Framework — the addition of Scopes" href="https://www.finops.org/insights/2025-finops-framework/" />
      <Ref source="finops.org" title="2026 Framework — Technology Categories" href="https://www.finops.org/insights/2026-finops-framework/" />

      <Callout tone="info" title="On the external frameworks">
        Core-vs-Context (Geoffrey Moore), TBM (TBM Council), break-even, Cost of Delay, and
        ROI/NPV in Module 05 are established business frameworks from outside the FinOps
        Foundation — attributed there, and merged for teaching.
      </Callout>
    </Section>
  );
}
