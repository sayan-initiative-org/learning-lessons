import React from 'react';
import { Section, H3, P, Term, Callout, Table, Ref, Cols, Card } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Benchmarks() {
  return (
    <Section id="benchmarks" kicker="Module 06 · Evidence" title="Benchmarks & Primary Sources">
      <P>
        KAG is evaluated on three standard <Term color={C.violet}>multi-hop QA</Term>{' '}
        benchmarks against a NaiveRAG baseline and <Term>HippoRAG</Term> (a strong
        graph-augmented retriever). Numbers below are from the paper's main results table
        (v3). Higher is better; F1 and Exact-Match are percentages.
      </P>

      <H3>Multi-hop QA — F1 / EM</H3>
      <Table
        head={['Dataset · Metric', 'NaiveRAG', 'HippoRAG', 'KAG']}
        rows={[
          ['HotpotQA · F1', '63.8', '68.97', '82.73'],
          ['HotpotQA · EM', '48.73', '56.82', '69.82'],
          ['2WikiMultiHop · F1', '56.84', '59.0', '78.87'],
          ['2WikiMultiHop · EM', '45.65', '47.48', '67.71'],
          ['MuSiQue · F1', '64.2', '68.93', '77.43'],
          ['MuSiQue · EM', '48.95', '53.11', '61.94'],
        ]}
        highlightLast
      />

      <Cols min={200}>
        {[
          ['+19.6%', 'HotpotQA F1', 'relative to HippoRAG', C.green],
          ['+33.5%', '2WikiMultiHop F1', 'the biggest jump — hardest hops', C.accent],
          ['+12.5%', 'MuSiQue F1', 'relative to HippoRAG', C.blue],
        ].map(([n, t, d, col]) => (
          <Card key={t} style={{ textAlign: 'center', borderTop: `2px solid ${col}` }}>
            <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: col }}>{n}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, marginTop: 2 }}>
              {t}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 3 }}>{d}</div>
          </Card>
        ))}
      </Cols>

      <H3>Retrieval quality — Recall@5</H3>
      <Table
        head={['Dataset', 'HippoRAG', 'KAG']}
        rows={[
          ['HotpotQA', '88.34', '94.61'],
          ['2WikiMultiHop', '85.16', '89.87'],
        ]}
        highlightLast
      />

      <Callout tone="win" title="Beyond the leaderboard">
        The paper's real claim is <em>professional</em> deployment: KAG was put into production
        at Ant Group for <Term color={C.green}>E-Government</Term> and{' '}
        <Term color={C.green}>E-Health</Term> Q&amp;A, reporting significant gains in
        professionalism / correctness over RAG — the domains where a wrong-but-fluent answer is
        unacceptable.
      </Callout>

      <Callout tone="warn" title="Read the numbers critically">
        These are the authors' own reported figures. Benchmark leadership on HotpotQA-style
        sets doesn't guarantee wins on your corpus: KAG's edge comes from{' '}
        <em>ontology quality + clean extraction</em>, which is engineering-heavy. On simple
        lookup, the overhead may not pay off — KAG targets hard, multi-hop, rule-bound
        questions.
      </Callout>

      <H3>Primary sources — read these next</H3>
      <Ref
        title="KAG: Boosting LLMs in Professional Domains via Knowledge Augmented Generation"
        authors="Liang, Sun, Gui, … Chen, Zhou (Ant Group · Zhejiang Univ.)"
        venue="arXiv:2409.13731 (2024)"
        href="https://arxiv.org/abs/2409.13731"
      />
      <Ref
        title="OpenSPG / KAG — reference implementation & docs"
        authors="OpenSPG team, Ant Group"
        venue="github.com/OpenSPG/KAG"
        href="https://github.com/OpenSPG/KAG"
      />
      <Ref
        title="From Local to Global: A Graph RAG Approach to Query-Focused Summarization"
        authors="Edge, Trinh, … Larson (Microsoft Research)"
        venue="arXiv:2404.16130 (2024)"
        href="https://arxiv.org/abs/2404.16130"
      />
      <Ref
        title="Translating Embeddings for Modeling Multi-relational Data (TransE)"
        authors="Bordes, Usunier, García-Durán, Weston, Yakhnenko"
        venue="NeurIPS 2013"
        href="https://proceedings.neurips.cc/paper/2013/hash/1cecc7a77928ca8133fa24680a88d2f9-Abstract.html"
      />
      <Ref
        title="RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space"
        authors="Sun, Deng, Nie, Tang"
        venue="ICLR 2019 · arXiv:1902.10197"
        href="https://arxiv.org/abs/1902.10197"
      />
      <Ref
        title="Complex Embeddings for Simple Link Prediction (ComplEx)"
        authors="Trouillon, Welbl, Riedel, Gaussier, Bouchard"
        venue="ICML 2016 · arXiv:1606.06357"
        href="https://arxiv.org/abs/1606.06357"
      />
      <Ref
        title="Construction of Knowledge Graphs: State and Challenges"
        authors="Hofer, Obraczka, Saeedi, Köpcke, Rahm"
        venue="arXiv:2302.11509 (2023)"
        href="https://arxiv.org/abs/2302.11509"
      />
    </Section>
  );
}
