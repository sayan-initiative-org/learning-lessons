import React, { useState } from 'react';
import { C, MONO, SANS, SERIF } from './theme';
import { SEGMENTS, ALL_POSTS } from './data';

// Text copied to clipboard when a card's Copy button is pressed.
function postToText(p) {
  return `${p.hook}\n\n${p.angle}\n\n👉 ${p.q}\n\n#FinOps #AI #AIStrategy #CloudCost #BuildVsBuy`;
}

function CopyButton({ post }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(postToText(post));
    } catch {
      // Fallback for browsers/contexts without the async clipboard API
      const ta = document.createElement('textarea');
      ta.value = postToText(post);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      onClick={onCopy}
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: copied ? C.green : C.muted,
        background: 'transparent',
        border: `1px solid ${copied ? C.green : C.line}`,
        borderRadius: 5,
        padding: '4px 9px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'color .15s, border-color .15s',
      }}
      aria-label={`Copy post ${post.n} to clipboard`}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function PostCard({ post }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderLeft: `3px solid ${post.color}`,
        borderRadius: 10,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* top row: number + segment tag + copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: post.color }}>
          #{post.n}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9.5,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: C.faint,
          }}
        >
          {post.emoji} {post.segLabel}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <CopyButton post={post} />
        </div>
      </div>

      {/* hook */}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.35,
          color: C.text,
          marginBottom: 8,
        }}
      >
        {post.hook}
      </div>

      {/* angle / premise */}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: C.muted,
          marginBottom: 14,
          flex: 1,
        }}
      >
        {post.angle}
      </div>

      {/* engagement question */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          borderTop: `1px dashed ${C.line}`,
          paddingTop: 12,
        }}
      >
        <span style={{ color: post.color, fontWeight: 700, lineHeight: 1.5 }}>→</span>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 13.5,
            lineHeight: 1.5,
            color: C.text,
            fontStyle: 'italic',
          }}
        >
          {post.q}
        </span>
      </div>
    </div>
  );
}

function Pill({ active, color, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        color: active ? C.bg : C.muted,
        background: active ? color : 'transparent',
        border: `1px solid ${active ? color : C.line}`,
        borderRadius: 999,
        padding: '7px 14px',
        cursor: 'pointer',
        transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

export default function ContentAnglesApp() {
  const [seg, setSeg] = useState('all');
  const posts = seg === 'all' ? ALL_POSTS : ALL_POSTS.filter((p) => p.segId === seg);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.panel, padding: '28px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: C.accent,
            }}
          >
            Companion to “AI Strategy, Cost &amp; FinOps” · content angles
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 34,
              fontWeight: 500,
              color: C.text,
              margin: '8px 0 6px',
            }}
          >
            LinkedIn <span style={{ color: C.cyan }}>Content Angles</span>
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, margin: 0, maxWidth: 660 }}>
            {ALL_POSTS.length} post ideas across {SEGMENTS.length} themes — engineered to trigger
            questions on AI investment, use-case derivation, Build-vs-Buy, and money. Each is a
            hook, a premise, and a question. Hit <em>Copy</em> to grab a post-ready draft.
          </p>
        </div>
      </div>

      {/* Filter + grid */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px 96px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          <Pill active={seg === 'all'} color={C.text} onClick={() => setSeg('all')}>
            All · {ALL_POSTS.length}
          </Pill>
          {SEGMENTS.map((s) => (
            <Pill key={s.id} active={seg === s.id} color={s.color} onClick={() => setSeg(s.id)}>
              {s.emoji} {s.label} · {s.posts.length}
            </Pill>
          ))}
        </div>

        {/* Active segment blurb */}
        {seg !== 'all' && (
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.faint, margin: '0 0 18px' }}>
            {SEGMENTS.find((s) => s.id === seg)?.blurb}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          }}
        >
          {posts.map((p) => (
            <PostCard key={p.n} post={p} />
          ))}
        </div>

        <footer
          style={{
            borderTop: `1px solid ${C.line}`,
            marginTop: 40,
            paddingTop: 20,
            fontFamily: MONO,
            fontSize: 12,
            color: C.faint,
          }}
        >
          Angles derived from the FinOps-for-AI study module (grounded in finops.org primary
          sources). Copy pulls a hook + premise + question + starter hashtags — edit to your voice
          before posting.
        </footer>
      </div>
    </div>
  );
}
