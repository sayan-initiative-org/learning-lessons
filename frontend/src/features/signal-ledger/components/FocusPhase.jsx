import React from 'react';

const STATUS_OPTIONS = [
  { value: 'done', label: '● Done', color: '#0B7A4B' },
  { value: 'partial', label: '◐ Partial', color: '#B96A12' },
  { value: 'untouched', label: '○ Untouched', color: '#9A2C2C' },
];

function PriorityCard({ rank, candidate, closeEntry, onStatusChange, onNoteChange }) {
  const status = closeEntry?.status ?? null;
  const note = closeEntry?.note ?? '';

  return (
    <div className="border border-[#1f2330] bg-[#13161f] p-4 mb-3">
      <div className="flex items-start gap-3 mb-3">
        <span
          className="text-xs font-bold text-[#8a8f9c] mt-0.5 flex-shrink-0 w-5"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          [{rank}]
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#e6e7eb]">{candidate?.text}</p>
          {candidate?.answers?.pillar && candidate.answers.pillar !== 'none' && (
            <p
              className="text-[10px] text-[#8a8f9c] mt-0.5"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {candidate.answers.pillar}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label={`Status for priority ${rank}`}>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={status === opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={[
              'px-3 py-1 text-xs border transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]',
              status === opt.value
                ? 'text-white border-transparent'
                : 'bg-[#13161f] border-[#1f2330] text-[#8a8f9c] hover:border-[#8a8f9c]',
            ].join(' ')}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              ...(status === opt.value ? { backgroundColor: opt.color } : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={note}
        onChange={e => onNoteChange(e.target.value)}
        placeholder="One-line note (optional)"
        className={[
          'w-full border border-[#1f2330] bg-[#0b0d12] text-[#e6e7eb] text-xs p-2',
          'placeholder:text-[#1f2330]',
          'focus:outline-none focus:border-[#8a8f9c] focus:ring-1 focus:ring-[#8a8f9c]',
        ].join(' ')}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        aria-label={`Close note for priority ${rank}`}
      />
    </div>
  );
}

export default function FocusPhase({ day, onStatusChange, onNoteChange, onClose }) {
  const candidates = day?.candidates ?? [];
  const top3Ids = day?.top3 ?? [];
  const closes = day?.closes ?? {};

  const top3 = top3Ids.map(id => candidates.find(c => c.id === id)).filter(Boolean);
  const allStatusSet = top3.every(c => closes[c.id]?.status);

  return (
    <section className="max-w-[860px] mx-auto px-4 py-6">
      <p
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Focus
      </p>
      <h2
        className="text-lg font-bold text-[#e6e7eb] mb-1"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        Today's {top3.length} priorities
      </h2>
      <p className="text-sm text-[#8a8f9c] mb-5">
        Close honestly — the ledger only works if it's true.
      </p>

      {top3.map((c, i) => (
        <PriorityCard
          key={c.id}
          rank={i + 1}
          candidate={c}
          closeEntry={closes[c.id] ?? null}
          onStatusChange={status =>
            onStatusChange(c.id, status, closes[c.id]?.note ?? '')
          }
          onNoteChange={note =>
            onNoteChange(c.id, closes[c.id]?.status ?? null, note)
          }
        />
      ))}

      <button
        type="button"
        disabled={!allStatusSet}
        onClick={onClose}
        className={[
          'mt-2 px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]',
          allStatusSet
            ? 'bg-[#e6e7eb] text-[#0b0d12] hover:bg-[#0B7A4B]'
            : 'bg-[#1f2330] text-[#8a8f9c] cursor-not-allowed',
        ].join(' ')}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Close the day →
      </button>

      {!allStatusSet && (
        <p className="text-xs text-[#8a8f9c] mt-2">
          Mark a status for each priority to close.
        </p>
      )}
    </section>
  );
}
