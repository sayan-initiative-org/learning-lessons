import React from 'react';
import { Section, H3, P, Term, Code, Callout, Pre, Card, Cols } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Reasoning() {
  return (
    <Section
      id="reasoning"
      kicker="Module 05 · The engine"
      title="Logical-Form-Guided Hybrid Reasoning"
    >
      <P>
        This is the heart of KAG (Pillar 3) and what most cleanly separates it from GraphRAG.
        Instead of "retrieve chunks, then hope the LLM reasons," KAG{' '}
        <Term color={C.accent}>compiles the question into a formal plan</Term> — a sequence of
        typed operators — and executes it, mixing three reasoning modes: LLM reasoning,
        knowledge (graph) reasoning, and mathematical/logical reasoning.
      </P>

      <H3>The operator algebra</H3>
      <P>
        A question is decomposed into <Term color={C.violet}>logical-form expressions</Term>{' '}
        built from five operator families:
      </P>
      <Cols min={230}>
        {[
          ['Retrieval', C.cyan, 'SPO triple query with constraints', 'Retrieval(s=s₁:Type[name], p=p₁:edge, o=o₁:Type[name])'],
          ['Sort', C.blue, 'Rank / top-k over a result set', 'Sort(set=A, key=…, dir=max, limit=n)'],
          ['Math', C.green, 'Counts, sums, set ops (LaTeX)', 'Math(expr = |A ∩ B|)'],
          ['Deduce', C.violet, 'Entailment / comparison inference', 'Deduce(left=A, right=B, op=entailment|>|<|=)'],
          ['Output', C.accent, 'Emit the final grounded answer', 'Output(answer)'],
        ].map(([name, col, desc, sig]) => (
          <Card key={name} style={{ borderTop: `2px solid ${col}` }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: col, fontWeight: 700 }}>
              {name}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, margin: '4px 0 8px', lineHeight: 1.45 }}>
              {desc}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10.5,
                color: C.text,
                background: '#0e1017',
                border: `1px solid ${C.line}`,
                borderRadius: 5,
                padding: '6px 8px',
                overflowX: 'auto',
              }}
            >
              {sig}
            </div>
          </Card>
        ))}
      </Cols>

      <Callout tone="idea" title="Symbolic + neural, per step">
        Each operator can be executed <em>symbolically</em> (a real graph query, real
        arithmetic) or, if the graph can't answer, <em>fall back to the LLM</em> — but the
        <strong> plan itself is explicit and inspectable</strong>. That is why KAG's answers
        are defensible in a way a single similarity search never is.
      </Callout>

      <H3>Worked example — a multi-hop question</H3>
      <P>
        <em>"How many years after the plague first appeared in Venice did the city build its
        first lazaretto?"</em> — a question needing two retrievals, a subtraction, and an
        output. KAG plans it before generating a word:
      </P>
      <Pre label="Decomposed logical form">{`# Step 1 — when did plague first appear in Venice?
Retrieval( s=s1:Event[first plague in Venice],
           p=p1:hasYear, o=o1:Year )        → o1 = 1348

# Step 2 — when was Venice's first lazaretto built?
Retrieval( s=s2:Facility[first lazaretto, loc=Venice],
           p=p2:builtInYear, o=o2:Year )    → o2 = 1423

# Step 3 — arithmetic over retrieved facts
Math( expr = o2 − o1 )                       → 75

# Step 4 — emit grounded answer
Output( "75 years" )`}</Pre>

      <H3>The reason–retrieve–generate loop</H3>
      <P>
        KAG doesn't assume the first plan is complete. It runs an{' '}
        <Term color={C.accent}>iterative solver</Term> (Algorithm 1 in the paper): decompose →
        execute → store intermediate results in memory → a <Term>judge</Term> checks whether
        the question is answered → if not, generate <em>supplementary</em> sub-questions and
        loop.
      </P>
      <Pre label="Solver loop (paraphrased)">{`memory ← ∅
plan   ← logicalForm(question)
repeat
    for op in plan:
        result ← execute(op)         # graph query | math | LLM
        memory ← memory ∪ result
    if judge(question, memory) == SATISFIED:
        break
    plan ← logicalForm(question, followUpFrom=memory)   # decompose deeper
until satisfied or max_iters
answer ← generate(question, memory)   # grounded on retrieved facts only`}</Pre>

      <Callout tone="win" title="Why this beats naive RAG on hard questions">
        Naive RAG makes <em>one</em> retrieval and hopes the answer is inside it. KAG makes the
        <strong> dependency structure explicit</strong>: it knows step 3 needs the outputs of
        steps 1 and 2, retrieves each precisely, computes symbolically, and only then
        generates — grounding the output on <em>verified intermediate facts</em> rather than on
        a lucky chunk.
      </Callout>
    </Section>
  );
}
