import React from 'react';
import { Section, H3, P, Term, Code, Callout, Pre, Cols, Card, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Architecture() {
  return (
    <Section id="architecture" kicker="Module 04 · The framework" title="KAG Architecture">
      <P>
        <Term color={C.violet}>KAG</Term> — "KAG: Boosting LLMs in Professional Domains via
        Knowledge Augmented Generation" (Liang et al., Ant Group + Zhejiang University, 2024) —
        enhances LLMs and KGs <em>bidirectionally</em> across five pillars. Two big engines
        wrap them: <Term>KAG-Builder</Term> (offline index) and{' '}
        <Term>KAG-Solver</Term> (online reasoning), with an optional fine-tuned{' '}
        <Term>KAG-Model</Term>.
      </P>

      <Pre label="System overview">{`          ┌────────────────── KAG-Builder (offline) ──────────────────┐
docs ───► │ LLMFriSPG representation · mutual indexing · alignment     │──► indexed KG + chunks
          └────────────────────────────────────────────────────────────┘
                                       │
          ┌────────────────── KAG-Solver (online) ────────────────────┐
query ──► │ logical-form decompose → hybrid reason ⇄ retrieve → generate│──► grounded answer
          └────────────────────────────────────────────────────────────┘
                                       ▲
                             KAG-Model (fine-tuned LLM:
                             NER, EL, logical-form gen)`}</Pre>

      <H3>Pillar 1 — LLMFriSPG: LLM-friendly knowledge representation</H3>
      <P>
        KAG upgrades SPG into <Term color={C.accent}>LLMFriSPG</Term>, a three-layer hierarchy
        aligned with the <Term>DIKW</Term> (Data → Information → Knowledge → Wisdom) pyramid.
        The point: don't force everything into rigid schema, and don't leave everything as raw
        text — keep a <em>spectrum</em>.
      </P>
      <Cols min={210}>
        <Card style={{ borderLeft: `3px solid ${C.green}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.green }}>KG_cs — Knowledge</div>
          <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted, marginTop: 4 }}>
            Schema-constrained, expert-validated structured knowledge. High accuracy,
            pre-defined properties <Code>pᵗᶜ</Code>. The rigorous core.
          </div>
        </Card>
        <Card style={{ borderLeft: `3px solid ${C.blue}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.blue }}>KG_fr — Information</div>
          <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted, marginTop: 4 }}>
            Free-form entities/relations from IE. Cheap, high-coverage, ad-hoc properties{' '}
            <Code>pᵗᶠ</Code>. Fills completeness gaps.
          </div>
        </Card>
        <Card style={{ borderLeft: `3px solid ${C.cyan}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.cyan }}>RC — Raw Chunks</div>
          <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.55, color: C.muted, marginTop: 4 }}>
            Semantically-segmented source text with traceable context. The evidentiary
            fallback the LLM can always read verbatim.
          </div>
        </Card>
      </Cols>
      <Callout tone="info" title="Built-in properties">
        Every node carries system properties — <Code>description</Code>, <Code>summary</Code>,{' '}
        <Code>supporting_chunks</Code>, <Code>belongTo</Code>. On a <em>type</em>,{' '}
        <Code>description</Code> is a global definition; on an <em>instance</em>, it's local
        detail. These are what make the graph legible to an LLM at generation time.
      </Callout>

      <H3>Pillar 2 — Mutual indexing (graph ⇄ text)</H3>
      <P>
        The bridge between structure and evidence. Extraction produces entities/events/relations;
        each entity stores a <Code>description</Code>, <Code>summary</Code>, and edges back to
        its <Code>supporting_chunks</Code>. Those edges form a{' '}
        <Term color={C.violet}>graph-structured inverted index</Term>: from any node you reach
        its source text, and from any chunk you reach its entities.
      </P>
      <Pre label="Mutual index — bidirectional links">{`chunk[articleID#paraCode#idInPara]  ──supporting_chunks──►  Entity
        ▲   mainText, summary                                  │ description, summary,
        └──────────────────  belongTo / summary  ◄─────────────┘ semanticType, spgClass`}</Pre>
      <P>
        Retrieval can therefore be <em>hybrid</em>: exact structured lookup on the graph{' '}
        <em>and</em> text recall on the chunks, each recovering what the other misses.
      </P>

      <H3>Pillar 4 — Knowledge alignment via semantic reasoning</H3>
      <P>
        Extraction is noisy — synonyms fragment, instances float free of concepts. KAG repairs
        this with six semantic relations that run both offline (index-time) and online
        (retrieval-time).
      </P>
      <Table
        head={['Relation', 'Meaning', 'Example']}
        rows={[
          ['synonym', 'equivalent meaning', 'MI ≡ heart attack'],
          ['isA', 'hypernym', 'Car isA Vehicle'],
          ['isPartOf', 'composition', 'Wheel isPartOf Car'],
          ['contains', 'containment', 'Body contains Organ'],
          ['belongTo', 'instance → concept', 'Aspirin belongTo NSAID'],
          ['causes', 'causation', 'Smoking causes Cancer'],
        ]}
      />
      <Callout tone="idea" title="The alignment payoff">
        Offline, KAG fuses synonyms, links instances to concepts, and completes{' '}
        <Code>isA</Code> chains (Chamber → Legislative Body → Government Agency → Organization).
        Online, if exact type-matching fails, it falls back to semantic reasoning —{' '}
        <em>"cataract patient isA visually-impaired person"</em> — retrieving accessibility
        documents that share <strong>no lexical overlap</strong> with the query. This is the
        move vector similarity structurally cannot make.
      </Callout>

      <H3>Pillar 5 — KAG-Model</H3>
      <P>
        A single LLM fine-tuned to serve every capability the pipeline needs — NER, entity
        linking, relation extraction, and crucially <Term color={C.accent}>logical-form
        generation</Term> — so the framework doesn't stitch together many brittle prompts. The
        logical-form engine (Pillar 3) gets its own module next.
      </P>
    </Section>
  );
}
