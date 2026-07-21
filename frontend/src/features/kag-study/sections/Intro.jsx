import React from 'react';
import { Section, P, Term, Callout, Card, Cols } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Intro() {
  return (
    <Section id="intro" kicker="Module 00 · Orientation" title="Why Knowledge-Augmented Generation?">
      <P>
        Large language models are fluent but <Term color={C.red}>unfaithful</Term>. They
        interpolate over training data, hallucinate specifics, and cannot reliably reason
        over private, structured, or fast-changing knowledge. The dominant patch —{' '}
        <Term>Retrieval-Augmented Generation (RAG)</Term> — retrieves text chunks by vector
        similarity and stuffs them into the prompt. It works for lookup, but it breaks on the
        problems that matter in professional domains: multi-hop reasoning, numerical and
        temporal logic, and expert rules.
      </P>

      <Callout tone="warn" title="The core failure of vanilla RAG">
        Vector similarity measures <em>textual resemblance</em>, not{' '}
        <em>logical relevance</em>. "Which drug interacts with warfarin and is safe in
        pregnancy?" needs a <em>join across facts</em>, not the paragraph that looks most like
        the question. RAG has no notion of entities, relations, or inference — so it degrades
        exactly where domain expertise lives.
      </Callout>

      <P>
        <Term color={C.blue}>Knowledge Graphs (KGs)</Term> encode facts as typed{' '}
        <Term>(subject, predicate, object)</Term> triples — a substrate you can traverse,
        constrain, and reason over symbolically. <Term color={C.violet}>KAG</Term> (Knowledge
        Augmented Generation), from Ant Group's OpenSPG team, is the framework that fuses the
        two: the symbolic precision of a KG with the fluency of an LLM, driven by a
        logical-form reasoning engine.
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
          ['01', 'KG Foundations', 'What a knowledge graph is, RDF triples, ontologies, the construction pipeline.', C.blue],
          ['02', 'KG Embeddings', 'TransE → RotatE → ComplEx. Scoring functions, link prediction, math.', C.cyan],
          ['03', 'From RAG to GraphRAG', "Microsoft's community-detection approach, global vs local search.", C.green],
          ['04', 'KAG Architecture', 'LLMFriSPG, mutual indexing, KAG-Builder / Solver / Model.', C.violet],
          ['05', 'Logical-Form Reasoning', 'The operator algebra and the reason-retrieve-generate loop.', C.accent],
          ['06', 'Benchmarks & Papers', 'HotpotQA / 2Wiki / MuSiQue numbers and the primary sources.', C.red],
        ].map(([n, t, d, col]) => (
          <Card key={n} style={{ borderTop: `2px solid ${col}` }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: col, fontWeight: 700 }}>
              {n}
            </div>
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
