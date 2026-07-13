import React, { useState, useEffect } from 'react';

export default function PillarsConfig({ config, onUpdate, onResetAll }) {
  const [pillars, setPillars] = useState(config.pillars);
  const [threshold, setThreshold] = useState(config.threshold);
  const [newPillar, setNewPillar] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPillars(config.pillars);
    setThreshold(config.threshold);
    setDirty(false);
  }, [config]);

  function addPillar() {
    const t = newPillar.trim();
    if (!t || pillars.includes(t)) return;
    const next = [...pillars, t];
    setPillars(next);
    setNewPillar('');
    setDirty(true);
  }

  function removePillar(p) {
    setPillars(prev => prev.filter(x => x !== p));
    setDirty(true);
  }

  function handleThreshold(e) {
    setThreshold(Number(e.target.value));
    setDirty(true);
  }

  function save() {
    onUpdate({ pillars, threshold });
    setDirty(false);
  }

  return (
    <section className="max-w-[860px] mx-auto px-4 py-6">
      <p
        className="text-[10px] tracking-widest text-[#5A665F] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Configuration
      </p>
      <h2
        className="text-lg font-bold text-[#1A2420] mb-5"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        Pillars & Threshold
      </h2>

      {/* Pillars */}
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1A2420] mb-1">Pillars</p>
        <p className="text-xs text-[#5A665F] mb-3">
          Your strategic commitments. Tasks with no pillar are automatic noise.
        </p>

        <div className="flex flex-col gap-1.5 mb-3">
          {pillars.map(p => (
            <div key={p} className="flex items-center justify-between border border-[#D9DDD3] bg-[#FDFDFB] px-3 py-2">
              <span className="text-sm text-[#1A2420]">{p}</span>
              <button
                type="button"
                onClick={() => removePillar(p)}
                className="text-xs text-[#9A2C2C] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A2C2C] ml-4"
                aria-label={`Remove pillar: ${p}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newPillar}
            onChange={e => setNewPillar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPillar()}
            placeholder="New pillar name"
            className={[
              'flex-1 border border-[#D9DDD3] bg-[#FDFDFB] text-[#1A2420] text-sm p-2',
              'focus:outline-none focus:border-[#1A2420] focus:ring-1 focus:ring-[#1A2420]',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          />
          <button
            type="button"
            onClick={addPillar}
            disabled={!newPillar.trim()}
            className={[
              'px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]',
              newPillar.trim()
                ? 'bg-[#1A2420] text-[#F4F5F1] hover:bg-[#2447D6]'
                : 'bg-[#D9DDD3] text-[#5A665F] cursor-not-allowed',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Threshold */}
      <div className="mb-8">
        <p className="text-sm font-bold text-[#1A2420] mb-1">Signal threshold</p>
        <p className="text-xs text-[#5A665F] mb-3">
          Tasks scoring at or above this pass directly to rank. Default: 60.
          Range: 40 – 80.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={40}
            max={80}
            step={5}
            value={threshold}
            onChange={handleThreshold}
            className="w-48 accent-[#1A2420]"
            aria-label="Signal threshold"
          />
          <span
            className="text-lg font-bold text-[#1A2420] w-8"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {threshold}
          </span>
        </div>
        <p
          className="text-[10px] text-[#5A665F] mt-1"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Signal ≥ {threshold} · Weak 40–{threshold - 1} · Noise &lt; 40 or no pillar
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={save}
          className={[
            'px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]',
            dirty
              ? 'bg-[#1A2420] text-[#F4F5F1] hover:bg-[#0B7A4B]'
              : 'bg-[#D9DDD3] text-[#5A665F] cursor-not-allowed',
          ].join(' ')}
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Save changes
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9A2C2C]">Wipe all history?</span>
            <button
              type="button"
              onClick={() => { onResetAll(); setConfirmReset(false); }}
              className="px-3 py-2 text-xs font-bold text-white bg-[#9A2C2C] hover:bg-red-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A2C2C]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 text-xs text-[#5A665F] border border-[#D9DDD3] hover:border-[#5A665F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 text-xs text-[#9A2C2C] border border-[#D9DDD3] hover:border-[#9A2C2C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A2C2C]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Reset all data
          </button>
        )}
      </div>
    </section>
  );
}
