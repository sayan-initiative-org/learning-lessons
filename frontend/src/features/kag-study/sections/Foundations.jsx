import React from 'react';
import { Section, H3, P, Term, Code, Callout, Pre, Card, Cols, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

export default function Foundations() {
  return (
    <Section id="foundations" kicker="Module 01 · Foundations" title="Knowledge Graphs, from the ground up">
      <P>
        A <Term color={C.blue}>knowledge graph</Term> is a directed, labeled multigraph whose
        nodes are <em>entities</em> (real-world things) and whose edges are <em>relations</em>{' '}
        between them. The atomic unit is the <Term>triple</Term> — formally a statement in{' '}
        <Term>RDF</Term> (Resource Description Framework):
      </P>

      <Pre label="RDF triple — subject, predicate, object">{`( :Warfarin  :interactsWith  :Aspirin )
( :Warfarin  :isA           :Anticoagulant )
( :Aspirin   :contraindicatedIn :Pregnancy )

# The same graph in Turtle syntax:
:Warfarin  a :Drug ;
           :interactsWith :Aspirin ;
           :isA :Anticoagulant .`}</Pre>

      <P>
        Because every edge is typed, a KG is <em>queryable and traversable</em>. The two facts
        above chain into a path — <Code>Warfarin → interactsWith → Aspirin →
        contraindicatedIn → Pregnancy</Code> — that answers a question no single sentence
        states. This is <Term color={C.violet}>multi-hop reasoning</Term>, and it is exactly
        what flat vector retrieval cannot do.
      </P>

      <H3>Ontology: the schema layer</H3>
      <P>
        An <Term>ontology</Term> is the KG's schema — it declares which entity{' '}
        <em>types</em> (classes) and <em>relation types</em> (properties) are legal, plus
        constraints (domain/range, cardinality, hierarchy). It turns an arbitrary graph into a{' '}
        <em>constrained, machine-checkable</em> knowledge base. KAG builds on{' '}
        <Term>SPG</Term> (Semantic-enhanced Programmable Graph), Ant Group's ontology
        framework, which separates an <Term>instance layer</Term> (𝒯) from a{' '}
        <Term>concept layer</Term> (𝒞).
      </P>

      <Callout tone="info" title="Instance vs concept">
        <em>"Aspirin"</em> is an <strong>instance</strong>. <em>"NSAID → Analgesic →
        Drug"</em> is a <strong>concept taxonomy</strong>. The <Code>belongTo</Code> relation
        links an instance to its concept, and <Code>isA</Code> chains concepts into a
        hierarchy. This split is what lets KAG later say "cataract patient <em>isA</em>{' '}
        visually-impaired person" and retrieve documents pure vector search would miss.
      </Callout>

      <H3>The construction pipeline</H3>
      <P>
        Turning raw documents into a KG is a classic three-stage pipeline —{' '}
        <Term>ontology engineering → knowledge extraction → knowledge fusion</Term>. Modern
        systems (KAG included) drive most stages with an LLM under ontological constraints.
      </P>

      <Cols min={200}>
        {[
          ['1 · NER', 'Named-Entity Recognition', 'Detect entity mentions (people, orgs, drugs, dates) and their types from unstructured text.', C.blue],
          ['2 · RE', 'Relation Extraction', 'Identify semantic links between entities to form (s, p, o) triples.', C.cyan],
          ['3 · EL', 'Entity Linking / Resolution', 'Map surface mentions to canonical IDs; merge duplicates ("J. Smith" = "John Smith").', C.violet],
          ['4 · Fusion', 'Ontology Mapping & Fusion', 'Align extracted triples to the ontology; disambiguate synonyms; resolve conflicts.', C.green],
        ].map(([tag, t, d, col]) => (
          <Card key={tag} style={{ borderLeft: `3px solid ${col}` }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: col, letterSpacing: 1 }}>
              {tag}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.text, margin: '3px 0 5px' }}>
              {t}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: C.muted }}>
              {d}
            </div>
          </Card>
        ))}
      </Cols>

      <H3>Where the incompleteness problem bites</H3>
      <P>
        Real KGs are <Term color={C.red}>massively incomplete</Term> — Wikidata and Freebase
        are missing most true facts. So a central task is{' '}
        <Term>link prediction</Term>: given <Code>(h, r, ?)</Code>, score candidate tails. You
        can do this symbolically (rule mining) or by learning vector representations — which is
        the entire point of the next module, <Term color={C.cyan}>KG embeddings</Term>.
      </P>

      <Table
        head={['Concept', 'What it is', 'KAG use']}
        rows={[
          ['Triple', '(s, p, o) atomic fact', 'Unit of KGfr / KGcs'],
          ['Ontology', 'Type + relation schema', 'SPG / LLMFriSPG'],
          ['Instance layer 𝒯', 'Concrete entities', 'Extracted from chunks'],
          ['Concept layer 𝒞', 'Taxonomies (isA)', 'Semantic alignment'],
          ['Link prediction', 'Fill missing (h, r, ?)', 'Graph completion'],
        ]}
      />
    </Section>
  );
}
