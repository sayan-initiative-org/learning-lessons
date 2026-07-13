import React, { useState } from 'react';

const DISPOSALS = [
  { value: 'delegate', label: 'Delegate', color: '#2447D6' },
  { value: 'defer', label: 'Defer', color: '#B96A12' },
  { value: 'drop', label: 'Drop', color: '#9A2C2C' },
];

export default function ChallengePanel({ verdict, onFinalize }) {
  const [defending, setDefending] = useState(false);
  const [defense, setDefense] = useState('');

  function handleDefend() {
    if (!defense.trim()) return;
    onFinalize('signal', defense.trim());
  }

  return (
    <div className="border border-[#B96A12] bg-[#FDFDFB] p-4 mt-4">
      <p
        className="text-[10px] tracking-widest text-[#B96A12] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {verdict === 'noise' ? 'Noise caught' : 'Weak signal'}
      </p>
      <p className="text-sm text-[#1A2420] mb-4">
        Which goal does it move this week? Defend it in one sentence, or dispose of it.
        Either way, it goes on record.
      </p>

      {defending ? (
        <div>
          <textarea
            autoFocus
            value={defense}
            onChange={e => setDefense(e.target.value)}
            placeholder="One sentence — what does this move?"
            rows={2}
            className={[
              'w-full border border-[#D9DDD3] bg-[#F4F5F1] text-[#1A2420] text-sm p-2 mb-2 resize-none',
              'focus:outline-none focus:border-[#0B7A4B] focus:ring-1 focus:ring-[#0B7A4B]',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!defense.trim()}
              onClick={handleDefend}
              className={[
                'px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]',
                defense.trim()
                  ? 'bg-[#0B7A4B] text-white hover:bg-[#0a6a40]'
                  : 'bg-[#D9DDD3] text-[#5A665F] cursor-not-allowed',
              ].join(' ')}
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Defend & keep
            </button>
            <button
              type="button"
              onClick={() => setDefending(false)}
              className="px-3 py-1.5 text-xs text-[#5A665F] border border-[#D9DDD3] hover:border-[#5A665F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDefending(true)}
            className="px-4 py-1.5 text-xs font-bold tracking-widest border border-[#0B7A4B] text-[#0B7A4B] hover:bg-[#0B7A4B] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Defend & keep
          </button>
          {DISPOSALS.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => onFinalize(d.value, null)}
              className="px-4 py-1.5 text-xs font-bold tracking-widest border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                borderColor: d.color,
                color: d.color,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = d.color;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = d.color;
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
