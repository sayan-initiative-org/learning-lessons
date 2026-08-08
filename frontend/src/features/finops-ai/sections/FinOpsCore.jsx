import React from 'react';
import { Section, H3, P, Term, Callout, Card, Cols, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

const PRINCIPLES = [
  ['1', 'Teams need to collaborate', 'Finance, tech, product & leaders work together at the speed and granularity each technology needs.'],
  ['2', 'Business value drives technology decisions', 'Unit-economic & value-based metrics beat aggregate spend for showing impact.'],
  ['3', 'Everyone takes ownership of their usage', 'Accountability is pushed to the edge — engineers own cost from design to operations.'],
  ['4', 'FinOps data is accessible, timely & accurate', 'Process and share cost data as soon as it is available; fast loops beat perfect month-end reports.'],
  ['5', 'FinOps is enabled centrally', 'A central function evangelizes best practice and handles rate optimization in a shared-accountability model.'],
  ['6', 'Take advantage of the variable cost model', 'Embrace consumption pricing, agile planning, and proactive architecture.'],
];

const DOMAINS = [
  ['Understand Usage & Cost', C.blue, 'Data Ingestion · Allocation · Reporting & Analytics · Anomaly Management'],
  ['Quantify Business Value', C.green, 'Planning & Estimating · Forecasting · Budgeting · KPIs & Benchmarking · Unit Economics'],
  ['Optimize Usage & Cost', C.cyan, 'Architecting & Workload Placement · Rate Optimization · Usage Optimization · Sustainability · Licensing & SaaS'],
  ['Manage the FinOps Practice', C.accent, 'Practice Operations · Governance/Policy/Risk · Assessment · Automation/Tools · Education & Enablement · Invoicing & Chargeback · Intersecting Disciplines · Executive Strategy Alignment'],
];

export default function FinOpsCore() {
  return (
    <Section
      id="finops-core"
      kicker="Module 03 · The Framework"
      title="The FinOps Framework, verified"
    >
      <Callout tone="info" title="Definition (FinOps Foundation, 2025)">
        “FinOps is an operational framework and cultural practice which maximizes the business
        value of <Term color={C.blue}>technology</Term>, enables timely data-driven decision
        making, and creates financial accountability through collaboration between{' '}
        <Term color={C.blue}>engineering, finance, and business</Term> teams.”
      </Callout>
      <P>
        Note the wording: <Term>“value of technology,”</Term> not “value of cloud.” In 2025 the
        Foundation deliberately broadened the definition beyond cloud — which is what lets the same
        discipline govern AI, SaaS, licensing, and data-center spend.
      </P>

      <H3>The 6 Principles</H3>
      <div style={{ display: 'grid', gap: 10, margin: '14px 0' }}>
        {PRINCIPLES.map(([n, t, d]) => (
          <Card key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.violet, minWidth: 22 }}>
              {n}
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.text }}>{t}</div>
              <div style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.55, color: C.muted, marginTop: 3 }}>
                {d}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <H3>The 4 Domains and their Capabilities</H3>
      <Callout tone="warn" title="Correction vs the old model">
        The pre-2024 <Term>Inform → Optimize → Operate</Term> lifecycle has been{' '}
        <em>superseded</em>. The current framework is organized around four{' '}
        <Term color={C.violet}>Domains</Term> — outcome headlines, not process phases:{' '}
        <Term>Understand · Quantify · Optimize · Manage</Term>.
      </Callout>
      <Cols min={240}>
        {DOMAINS.map(([name, col, caps]) => (
          <Card key={name} style={{ borderTop: `2px solid ${col}` }}>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: col, marginBottom: 6 }}>
              {name}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, lineHeight: 1.6, color: C.muted }}>
              {caps}
            </div>
          </Card>
        ))}
      </Cols>
      <P>
        <Term color={C.cyan}>Unit Economics</Term> sits under <em>Quantify Business Value</em> — it
        is the capability that powers the AI cost-per-outcome work in Module 04.
      </P>

      <H3>Maturity — Crawl / Walk / Run</H3>
      <Table
        head={['Stage', 'What it looks like']}
        rows={[
          ['Crawl', 'Reactive — problems addressed after they occur; basic metrics, thin adoption.'],
          ['Walk', 'Growing proactivity; personas build metrics for specific scopes; defined processes.'],
          ['Run', 'Cost factored into architecture up front; automated, unit-economics-driven decisions.'],
        ]}
        align="left"
      />
      <P>
        Maturity is <em>per capability</em>, not global. Adopt any capability at Crawl and mature
        it “as business value warrants” — you never need to be Run everywhere.
      </P>

      <H3>Scopes → Technology Categories</H3>
      <P>
        A <Term color={C.violet}>Scope</Term> is “a segment of technology-related spending to which
        practitioners apply FinOps concepts.” Scopes became a core element in{' '}
        <Term>2025</Term>; the <Term>2026</Term> update reframes them as{' '}
        <Term color={C.violet}>Technology Categories</Term> — Public Cloud, SaaS, Data Center,
        Licensing, and <Term color={C.cyan}>AI</Term>. Crucially, priorities differ per category:
        workload optimization dominates cloud but isn't even top-five for AI.
      </P>
    </Section>
  );
}
