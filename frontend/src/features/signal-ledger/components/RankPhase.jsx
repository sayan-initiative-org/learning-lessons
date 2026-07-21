import React, { useState } from 'react';

const VERDICT_LABEL = { delegate: 'Delegated', defer: 'Deferred', drop: 'Dropped' };

export default function RankPhase({ day, config, onLock, onAddMore }) {
  const candidates = day?.candidates ?? [];
  const survivors = candidates.filter(c => c.verdictFinal === 'signal');
  const maxPick = Math.min(3, survivors.length);

  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= maxPick) return prev; // cap at maxPick
      return [...prev, id];
    });
  }

  const noise = candidates.filter(
    c => c.verdictFinal && c.verdictFinal !== 'signal',
  );

  return (
    <section className="max-w-[860px] mx-auto px-4 py-6">
      <p
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Rank
      </p>
      <h2
        className="text-lg font-bold text-[#e6e7eb] mb-1"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        Pick your {maxPick === 1 ? '1 priority' : `top ${maxPick}`}
      </h2>
      <p className="text-sm text-[#8a8f9c] mb-5">
        Selection order is priority order. Tap to rank; tap again to remove.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {survivors.map(c => {
          const rank = selected.indexOf(c.id);
          const isSelected = rank !== -1;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              aria-pressed={isSelected}
              className={[
                'flex items-center gap-3 border p-3 text-left transition-colors w-full',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]',
                isSelected
                  ? 'border-[#0B7A4B] bg-[#13161f]'
                  : 'border-[#1f2330] bg-[#13161f] hover:border-[#8a8f9c]',
              ].join(' ')}
            >
              <span
                className="w-6 h-6 flex items-center justify-center border text-xs font-bold flex-shrink-0"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  borderColor: isSelected ? '#0B7A4B' : '#1f2330',
                  color: isSelected ? '#0B7A4B' : '#1f2330',
                }}
              >
                {isSelected ? rank + 1 : '·'}
              </span>

              <span className="flex-1 text-sm text-[#e6e7eb]">{c.text}</span>

              <div className="flex items-center gap-2 flex-shrink-0">
                {c.defended && (
                  <span
                    className="text-[10px] border border-[#2447D6] text-[#2447D6] px-1.5 py-0.5 tracking-widest"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    DEFENDED
                  </span>
                )}
                {c.answers?.pillar && c.answers.pillar !== 'none' && (
                  <span
                    className="text-[10px] text-[#8a8f9c] border border-[#1f2330] px-1.5 py-0.5 truncate max-w-[120px]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    title={c.answers.pillar}
                  >
                    {c.answers.pillar.split(' ').slice(0, 3).join(' ')}
                  </span>
                )}
                <span
                  className="text-xs font-bold text-[#0B7A4B]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {c.score ?? 0}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {noise.length > 0 && (
        <div className="mb-6">
          <p
            className="text-[10px] tracking-widest text-[#8a8f9c] mb-2 uppercase"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Noise caught ({noise.length})
          </p>
          {noise.map(c => (
            <div
              key={c.id}
              className="text-xs text-[#8a8f9c] border-b border-[#1f2330] py-1.5 flex justify-between"
            >
              <span>{c.text}</span>
              <span
                className="text-[#B96A12]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {VERDICT_LABEL[c.verdictFinal] ?? c.verdictFinal}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={selected.length !== maxPick}
          onClick={() => onLock(selected)}
          className={[
            'px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]',
            selected.length === maxPick
              ? 'bg-[#e6e7eb] text-[#0b0d12] hover:bg-[#0B7A4B]'
              : 'bg-[#1f2330] text-[#8a8f9c] cursor-not-allowed',
          ].join(' ')}
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Lock {maxPick === 1 ? 'priority' : `top ${maxPick}`} →
        </button>

        <button
          type="button"
          onClick={onAddMore}
          className="px-4 py-2 text-xs text-[#8a8f9c] border border-[#1f2330] hover:border-[#8a8f9c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          + Add more tasks
        </button>
      </div>
    </section>
  );
}
