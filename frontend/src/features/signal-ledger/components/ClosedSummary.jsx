import React from 'react';

const GLYPH = { done: '●', partial: '◐', untouched: '○' };
const GLYPH_COLOR = { done: '#0B7A4B', partial: '#B96A12', untouched: '#9A2C2C' };

export default function ClosedSummary({ day }) {
  const candidates = day?.candidates ?? [];
  const top3Ids = day?.top3 ?? [];
  const closes = day?.closes ?? {};
  const top3 = top3Ids.map(id => candidates.find(c => c.id === id)).filter(Boolean);

  const done = top3.filter(c => closes[c.id]?.status === 'done').length;
  const noiseCount = candidates.filter(
    c => c.verdictFinal && c.verdictFinal !== 'signal',
  ).length;

  const closedAtDisplay = day?.closedAt
    ? new Date(day.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section className="max-w-[860px] mx-auto px-4 py-8">
      <p
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Day closed {closedAtDisplay ? `at ${closedAtDisplay}` : ''}
      </p>
      <h2
        className="text-2xl font-bold text-[#e6e7eb] mb-1"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        {done}/{top3.length} signals landed
      </h2>
      {noiseCount > 0 && (
        <p className="text-sm text-[#8a8f9c] mb-6">
          {noiseCount} noise item{noiseCount !== 1 ? 's' : ''} caught before they cost you focus.
        </p>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {top3.map((c, i) => {
          const entry = closes[c.id];
          const status = entry?.status ?? 'untouched';
          return (
            <div
              key={c.id}
              className="flex items-start gap-3 border border-[#1f2330] bg-[#13161f] p-3"
            >
              <span
                className="text-lg flex-shrink-0 mt-0.5"
                style={{ color: GLYPH_COLOR[status] }}
                aria-label={status}
              >
                {GLYPH[status]}
              </span>
              <div className="flex-1">
                <p className="text-sm text-[#e6e7eb]">{c.text}</p>
                {entry?.note && (
                  <p className="text-xs text-[#8a8f9c] mt-0.5 italic">{entry.note}</p>
                )}
              </div>
              <span
                className="text-[10px] text-[#8a8f9c] flex-shrink-0 mt-0.5"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                [{i + 1}]
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#8a8f9c] mt-6 border-t border-[#1f2330] pt-4">
        Check the Ledger tab to see trends across days.
      </p>
    </section>
  );
}
