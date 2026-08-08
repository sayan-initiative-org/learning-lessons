import React from 'react';
import { Section, P, Term, Callout, Card, Cols, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Intro() {
  return (
    <Section id="intro" kicker="Module 00 · Orientation" title="Why AI needs its own cost discipline">
      <P>
        Traditional software cost is mostly <Term color={C.blue}>fixed and predictable</Term> —
        seats, instances, licenses. AI cost is the opposite: <Term color={C.red}>variable,
        consumption-driven, and opaque</Term>. Every inference costs money, usage spikes without
        warning, and the bill hides inside token counts and GPU-hours that nobody tagged. You
        cannot govern what you cannot express per unit.
      </P>

      <Table
        head={['Dimension', 'Traditional SaaS', 'AI system']}
        rows={[
          ['Cost driver', 'Seats, instances', 'Tokens, inferences, GPU-hours'],
          ['Marginal cost', '≈ zero per user', 'Non-zero per request'],
          ['Predictability', 'High', 'Low — spikes, retries, prompt bloat'],
          ['Visibility', 'Line-item invoice', 'Buried in API / GPU bills'],
          ['Value linkage', 'Indirect', 'Can tie to cost-per-outcome'],
        ]}
        align="left"
      />

      <Callout tone="idea" title="The core insight">
        AI economics <em>are</em> unit economics. If you can't state cost{' '}
        <Term color={C.cyan}>per inference</Term>, <Term color={C.cyan}>per user</Term>, and{' '}
        <Term color={C.cyan}>per resolved outcome</Term>, you can't decide whether a use case is
        worth running — let alone whether to build it or buy it. This is exactly why{' '}
        <Term color={C.violet}>FinOps</Term>, a discipline built for variable cloud spend, maps
        almost perfectly onto AI.
      </Callout>

      <P>
        This study guide moves from <Term>strategy</Term> (how to evaluate a use case and decide
        build-vs-buy) into the <Term color={C.violet}>FinOps Framework</Term> itself — its
        principles, domains, capabilities, and the FinOps Foundation's dedicated{' '}
        <Term color={C.violet}>FinOps for AI</Term> guidance — then closes with the aligned
        business frameworks and the primary sources every claim is drawn from.
      </P>

      <div
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: C.muted,
          margin: '22px 0 10px',
          letterSpacing: 1,
        }}
      >
        THE STUDY TRACK
      </div>
      <Cols min={220}>
        {[
          ['01', 'Evaluate a Use Case', 'AI TCO stack, unit economics, quantifying value.', C.blue],
          ['02', 'Build vs Buy', 'The spectrum, decision factors, and the break-even math.', C.green],
          ['03', 'The FinOps Framework', 'Definition, 6 principles, 4 domains, capabilities, maturity, scopes.', C.violet],
          ['04', 'FinOps for AI', 'Verified AI cost drivers, allocation, token & unit economics.', C.cyan],
          ['05', 'Aligned Frameworks', 'TCO, TBM, core-vs-context, showback — and where each fits.', C.accent],
          ['06', 'Sources & Templates', 'The real finops.org pages, PDFs, and assets — cited.', C.red],
        ].map(([n, t, d, col]) => (
          <Card key={n} style={{ borderTop: `2px solid ${col}` }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: col, fontWeight: 700 }}>{n}</div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 15,
                fontWeight: 700,
                color: C.text,
                margin: '4px 0 6px',
              }}
            >
              {t}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted }}>
              {d}
            </div>
          </Card>
        ))}
      </Cols>
    </Section>
  );
}
