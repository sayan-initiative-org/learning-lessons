import React, { useEffect } from 'react';

const GLYPH = { done: '●', partial: '◐', untouched: '○' };
const GLYPH_COLOR = { done: '#0B7A4B', partial: '#B96A12', untouched: '#9A2C2C' };
const DISPOSAL_LABEL = { delegate: 'delegated', defer: 'deferred', drop: 'dropped' };

function stat(label, value, mono = true) {
  return (
    <div className="border border-[#1f2330] bg-[#13161f] p-4">
      <p
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold text-[#e6e7eb]"
        style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : undefined }}
      >
        {value}
      </p>
    </div>
  );
}

function streak(days) {
  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
  const closed = new Set(
    days.filter(d => d.closedAt).map(d => d.date),
  );
  if (!closed.has(today) && !closed.has(yesterday)) return 0;
  let count = 0;
  let cur = new Date();
  while (true) {
    const key = cur.toLocaleDateString('en-CA');
    if (!closed.has(key)) break;
    count++;
    cur = new Date(cur.getTime() - 86400000);
  }
  return count;
}

export default function LedgerView({ historyDays, onLoad }) {
  useEffect(() => { onLoad(); }, [onLoad]);

  const closedDays = historyDays.filter(d => d.closedAt);

  // Completion %
  const totalTop3 = closedDays.reduce((s, d) => s + (d.top3?.length ?? 0), 0);
  const totalDone = closedDays.reduce((s, d) => {
    const closes = d.closes ?? {};
    return s + (d.top3 ?? []).filter(id => closes[id]?.status === 'done').length;
  }, 0);
  const completionPct = totalTop3 > 0 ? Math.round((totalDone / totalTop3) * 100) : 0;

  // Noise caught
  const noiseCaught = historyDays.reduce((s, d) =>
    s + (d.candidates ?? []).filter(c => c.verdictFinal && c.verdictFinal !== 'signal').length, 0);

  // Pillar distribution across locked top-3
  const pillarCounts = {};
  closedDays.forEach(d => {
    (d.top3 ?? []).forEach(id => {
      const c = (d.candidates ?? []).find(x => x.id === id);
      const pillar = c?.answers?.pillar;
      if (pillar && pillar !== 'none') {
        pillarCounts[pillar] = (pillarCounts[pillar] ?? 0) + 1;
      }
    });
  });
  const pillarEntries = Object.entries(pillarCounts).sort((a, b) => b[1] - a[1]);
  const maxPillar = pillarEntries[0]?.[1] ?? 1;

  const currentStreak = streak(historyDays);

  if (!historyDays.length) {
    return (
      <section className="max-w-[860px] mx-auto px-4 py-10 text-center">
        <p className="text-[#8a8f9c] text-sm">No closed days yet. Start today.</p>
      </section>
    );
  }

  return (
    <section className="max-w-[860px] mx-auto px-4 py-6">
      <p
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-4 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Last {historyDays.length} days
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stat('Completion', `${completionPct}%`)}
        {stat('Noise caught', noiseCaught)}
        {stat('Closing streak', `${currentStreak}d`)}
        {stat('Days closed', closedDays.length)}
      </div>

      {/* Pillar distribution */}
      {pillarEntries.length > 0 && (
        <div className="mb-8">
          <p
            className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Where your top-3 energy went
          </p>
          <p className="text-xs text-[#8a8f9c] mb-3 italic">
            A starving pillar here is a strategy problem, not a time problem.
          </p>
          <div className="flex flex-col gap-2">
            {pillarEntries.map(([pillar, count]) => (
              <div key={pillar} className="flex items-center gap-3">
                <span
                  className="text-xs text-[#e6e7eb] w-48 truncate flex-shrink-0"
                  title={pillar}
                >
                  {pillar}
                </span>
                <div className="flex-1 bg-[#0b0d12] h-4 relative">
                  <div
                    className="h-4 bg-[#0B7A4B] transition-all"
                    style={{ width: `${(count / maxPillar) * 100}%` }}
                  />
                </div>
                <span
                  className="text-xs text-[#8a8f9c] w-6 text-right flex-shrink-0"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day rows */}
      <div className="flex flex-col gap-3">
        {historyDays.map(d => {
          const top3 = (d.top3 ?? []).map(id => (d.candidates ?? []).find(c => c.id === id)).filter(Boolean);
          const closes = d.closes ?? {};
          const noise = (d.candidates ?? []).filter(c => c.verdictFinal && c.verdictFinal !== 'signal');
          const isClosed = !!d.closedAt;

          return (
            <div key={d.date} className="border border-[#1f2330] bg-[#13161f] p-4">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold text-[#e6e7eb]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {d.date}
                </span>
                <span
                  className={[
                    'text-[10px] tracking-widest px-1.5 py-0.5 border',
                    isClosed
                      ? 'border-[#0B7A4B] text-[#0B7A4B]'
                      : 'border-[#B96A12] text-[#B96A12]',
                  ].join(' ')}
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {isClosed ? 'CLOSED' : 'OPEN'}
                </span>
              </div>

              {top3.map((c, i) => {
                const entry = closes[c.id];
                const status = entry?.status ?? 'untouched';
                return (
                  <div key={c.id} className="flex items-start gap-2 mb-1.5">
                    <span
                      className="flex-shrink-0 text-sm mt-0.5"
                      style={{ color: isClosed ? GLYPH_COLOR[status] : '#1f2330' }}
                      aria-label={isClosed ? status : 'pending'}
                    >
                      {isClosed ? GLYPH[status] : '○'}
                    </span>
                    <span className="text-xs text-[#e6e7eb] flex-1">{c.text}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {c.defended && (
                        <span
                          className="text-[9px] border border-[#2447D6] text-[#2447D6] px-1"
                          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                          DEF
                        </span>
                      )}
                      {c.answers?.pillar && c.answers.pillar !== 'none' && (
                        <span
                          className="text-[9px] border border-[#1f2330] text-[#8a8f9c] px-1 max-w-[100px] truncate"
                          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          title={c.answers.pillar}
                        >
                          {c.answers.pillar.split(' ').slice(0, 2).join(' ')}
                        </span>
                      )}
                    </div>
                    {entry?.note && (
                      <p className="text-[10px] text-[#8a8f9c] ml-5 italic">{entry.note}</p>
                    )}
                  </div>
                );
              })}

              {noise.length > 0 && (
                <p
                  className="text-[10px] text-[#8a8f9c] mt-2 border-t border-[#1f2330] pt-2"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Noise caught:{' '}
                  {noise.map((c, i) => (
                    <span key={c.id}>
                      {c.text} ({DISPOSAL_LABEL[c.verdictFinal] ?? c.verdictFinal})
                      {i < noise.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
