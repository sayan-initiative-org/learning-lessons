import React, { useState } from 'react';

export default function CapturePhase({ onSubmit }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <section className="max-w-[860px] mx-auto px-4 py-8">
      <p
        className="text-xs tracking-widest text-[#5A665F] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Brain dump
      </p>
      <h2
        className="text-lg font-bold text-[#1A2420] mb-1"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        What's on your mind for today?
      </h2>
      <p className="text-sm text-[#5A665F] mb-5">
        One task per line. No filtering — filtering happens in the interrogation, not in your head.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Write everything down.\nReview pull request for auth module\nPrepare Q3 investor update\nCall dentist`}
          rows={10}
          className={[
            'w-full border border-[#D9DDD3] bg-[#FDFDFB] text-[#1A2420] text-sm p-3',
            'placeholder:text-[#D9DDD3] resize-y',
            'focus:outline-none focus:border-[#1A2420] focus:ring-1 focus:ring-[#1A2420]',
          ].join(' ')}
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          aria-label="Today's tasks — one per line"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#5A665F]">
            {text.split('\n').filter(l => l.trim()).length} task
            {text.split('\n').filter(l => l.trim()).length !== 1 ? 's' : ''}
          </p>
          <button
            type="submit"
            disabled={!text.trim()}
            className={[
              'px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]',
              text.trim()
                ? 'bg-[#1A2420] text-[#F4F5F1] hover:bg-[#0B7A4B]'
                : 'bg-[#D9DDD3] text-[#5A665F] cursor-not-allowed',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Begin interrogation →
          </button>
        </div>
      </form>
    </section>
  );
}
