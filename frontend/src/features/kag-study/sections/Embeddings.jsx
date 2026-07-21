import React from 'react';
import { Section, H3, P, Term, Code, Callout, Pre, Table } from '../components/ui';
import { C, MONO, SANS } from '../theme';

/* Small formula chip renderer (no LaTeX dep — plain styled math). */
function Formula({ children }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 14,
        color: C.cyan,
        background: '#0e1017',
        border: `1px solid ${C.line}`,
        borderRadius: 8,
        padding: '12px 16px',
        margin: '10px 0',
        overflowX: 'auto',
      }}
    >
      {children}
    </div>
  );
}

export default function Embeddings() {
  return (
    <Section id="embeddings" kicker="Module 02 · Representation" title="Knowledge Graph Embeddings">
      <P>
        A <Term color={C.cyan}>KG embedding (KGE)</Term> maps every entity and relation to a
        low-dimensional vector so that a <Term>scoring function</Term>{' '}
        <Code>f(h, r, t)</Code> is high for true triples and low for false ones. Train by
        contrasting observed triples against corrupted negatives; the learned space then
        supports link prediction and similarity — the geometric counterpart to symbolic
        reasoning.
      </P>

      <H3>Translational family: TransE and its heirs</H3>
      <P>
        <Term>TransE</Term> (Bordes et al., 2013) is the seminal model. Its intuition: a
        relation is a <em>translation vector</em> that carries the head to the tail.
      </P>
      <Formula>f(h, r, t) = − ‖ h + r − t ‖₁ ₀ᵣ ₂ &nbsp;&nbsp;⇒&nbsp;&nbsp; h + r ≈ t for true triples</Formula>
      <Callout tone="warn" title="TransE's blind spot">
        Because a relation is a single vector, TransE <em>cannot</em> model 1-to-N, N-to-1, or
        symmetric relations well — if <Code>(h, r, t₁)</Code> and <Code>(h, r, t₂)</Code> are
        both true, it forces <Code>t₁ ≈ t₂</Code>. The successor models exist to fix precisely
        this.
      </Callout>

      <P>
        <Term>TransR</Term> gives each relation its own space via a projection matrix{' '}
        <Code>Mᵣ</Code>, scoring distance <em>after</em> projecting entities into the
        relation-specific space:
      </P>
      <Formula>f(h, r, t) = − ‖ Mᵣh + r − Mᵣt ‖₂²</Formula>

      <H3>Semantic-matching family: DistMult, ComplEx, RotatE</H3>
      <P>
        Instead of translation, these score via a <em>bilinear / multiplicative</em>{' '}
        interaction — capturing compatibility rather than distance.
      </P>

      <Pre label="Scoring functions (vector form)">{`DistMult   f(h,r,t) = ⟨ h, r, t ⟩  = Σᵢ hᵢ · rᵢ · tᵢ
           # symmetric only → cannot tell (a,r,b) from (b,r,a)

ComplEx    f(h,r,t) = Re( ⟨ h, r, t̄ ⟩ ),   h,r,t ∈ ℂᵈ
           # complex embeddings + conjugate t̄
           # → models ASYMMETRIC relations

RotatE     f(h,r,t) = − ‖ h ∘ r − t ‖,   |rᵢ| = 1  (unit modulus)
           # relation = rotation in the complex plane
           # → models symmetry, inversion, AND composition`}</Pre>

      <Callout tone="idea" title="Why RotatE is the practitioner default">
        Modeling a relation as a <em>rotation</em> (multiplication by a unit-modulus complex
        number) is the first formulation that simultaneously captures{' '}
        <Term color={C.violet}>symmetry / antisymmetry</Term>,{' '}
        <Term color={C.violet}>inversion</Term> (<Code>r⁻¹</Code> is the conjugate rotation),
        and <Term color={C.violet}>composition</Term> (<Code>r₃ = r₁ ∘ r₂</Code> ⇔ angles add).
        Composition is what powers multi-hop inference.
      </Callout>

      <H3>Model comparison</H3>
      <Table
        head={['Model', 'Score f(h,r,t)', 'Space', 'Symmetry', 'Composition']}
        rows={[
          ['TransE', '−‖h+r−t‖', 'ℝᵈ', '✗', '✓'],
          ['TransR', '−‖Mᵣh+r−Mᵣt‖', 'ℝᵈ + Mᵣ', '~', '✓'],
          ['DistMult', '⟨h,r,t⟩', 'ℝᵈ', '✓ only', '✗'],
          ['ComplEx', 'Re⟨h,r,t̄⟩', 'ℂᵈ', '✓/✗', '✗'],
          ['RotatE', '−‖h∘r−t‖', 'ℂᵈ', '✓/✗', '✓'],
        ]}
      />

      <H3>Evaluation: link prediction metrics</H3>
      <P>
        KGE models are judged on ranking the true tail among all candidates. Standard metrics:
      </P>
      <Pre label="Ranking metrics (filtered setting)">{`MRR   = mean( 1 / rank_of_true_triple )      # Mean Reciprocal Rank
Hits@k = fraction of test triples ranked ≤ k  # typically k ∈ {1, 3, 10}

# "Filtered" = remove other known-true triples from the
# candidate list before ranking, so they don't count as errors.`}</Pre>
      <P>
        These embeddings are the <em>geometric</em> route to reasoning. KAG's insight is that
        geometry alone loses the <Term color={C.red}>logical rigor</Term> professional domains
        need — so it keeps the symbolic graph and adds a logical-form engine on top, rather
        than betting everything on the vector space. That's Modules 04–05.
      </P>
    </Section>
  );
}
