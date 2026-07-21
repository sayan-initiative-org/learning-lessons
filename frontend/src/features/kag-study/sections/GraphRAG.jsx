import React from 'react';
import { Section, H3, P, Term, Code, Callout, Pre, Cols, Card, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function GraphRAG() {
  return (
    <Section id="graphrag" kicker="Module 03 · The bridge" title="From RAG to GraphRAG">
      <P>
        Before KAG, the most influential attempt to graft graph structure onto retrieval was{' '}
        <Term color={C.green}>GraphRAG</Term> (Microsoft Research, "From Local to Global",
        2024). It's the essential comparison point — understanding what GraphRAG does, and
        where it stops, is how you understand what KAG adds.
      </P>

      <H3>The pipeline</H3>
      <Pre label="GraphRAG indexing dataflow">{`documents
   │  chunk
   ▼
text units ──► LLM extracts (entity, relation) ──► entity graph
                                                        │ Leiden
                                                        ▼
                                              hierarchical communities
                                                        │ LLM
                                                        ▼
                                            community summaries (per level)`}</Pre>

      <P>
        The key move is <Term color={C.violet}>community detection</Term>. GraphRAG runs the{' '}
        <Term>Leiden algorithm</Term> — a refinement of Louvain that guarantees
        well-connected communities — <em>recursively</em>, producing a hierarchy: the whole
        corpus at the top, tightly-knit topical clusters at the leaves. Every community gets
        an LLM-written <Term>summary</Term>.
      </P>

      <Callout tone="info" title="Leiden over Louvain">
        Louvain can produce internally-<em>disconnected</em> communities — a known defect.
        Leiden adds a refinement phase that guarantees every community is connected and
        converges to a stable partition, which is why GraphRAG (and most modern graph-RAG
        systems) standardize on it.
      </Callout>

      <H3>Two query modes</H3>
      <Cols min={260}>
        <Card style={{ borderTop: `2px solid ${C.cyan}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.cyan, letterSpacing: 1 }}>
            LOCAL SEARCH
          </div>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text, margin: '5px 0' }}>
            Entity-centric
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: C.muted }}>
            Anchor on specific entities, fan out to neighbors and associated text units.
            Answers <em>"what does X do?"</em> — precise, bounded questions.
          </div>
        </Card>
        <Card style={{ borderTop: `2px solid ${C.green}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.green, letterSpacing: 1 }}>
            GLOBAL SEARCH
          </div>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text, margin: '5px 0' }}>
            Corpus-level sensemaking
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: C.muted }}>
            Map-reduce over <em>community summaries</em>: each summary answers partially, then
            results are aggregated. Answers <em>"what are the main themes?"</em> — questions
            no single chunk contains.
          </div>
        </Card>
      </Cols>

      <H3>What GraphRAG proved</H3>
      <P>
        On global "sensemaking" questions over million-token corpora, GraphRAG substantially
        beat vanilla vector RAG on <Term color={C.green}>comprehensiveness</Term> and{' '}
        <Term color={C.green}>diversity</Term> of answers (win rates in the ~72–83% range) —
        because a summary of a community is a better unit of retrieval than a random similar
        chunk.
      </P>

      <Callout tone="warn" title="…and where it stops">
        GraphRAG excels at <em>summarization / sensemaking</em>. It does <strong>not</strong>{' '}
        do rigorous, verifiable, multi-hop <em>logical</em> reasoning — there's no operator
        algebra, no numerical/temporal logic, no guarantee the answer follows a checkable
        inference path. For <Term color={C.red}>professional QA</Term> (law, medicine,
        e-government) where the answer must be defensible, that gap is the opening KAG fills.
      </Callout>

      <Table
        head={['Dimension', 'Vector RAG', 'GraphRAG', 'KAG']}
        rows={[
          ['Retrieval unit', 'Text chunk', 'Community summary', 'KG + chunk (mutual index)'],
          ['Structure', 'None', 'Entity graph', 'Ontology-constrained SPG'],
          ['Reasoning', 'None', 'Summarization', 'Logical-form operators'],
          ['Best at', 'Lookup', 'Sensemaking', 'Multi-hop pro QA'],
        ]}
        highlightLast
      />
    </Section>
  );
}
