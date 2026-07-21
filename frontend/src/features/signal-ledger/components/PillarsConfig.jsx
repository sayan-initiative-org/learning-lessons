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
        className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Configuration
      </p>
      <h2
        className="text-lg font-bold text-[#e6e7eb] mb-5"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        Pillars & Threshold
      </h2>

      {/* Pillars */}
      <div className="mb-6">
        <p className="text-sm font-bold text-[#e6e7eb] mb-1">Pillars</p>
        <p className="text-xs text-[#8a8f9c] mb-3">
          Your strategic commitments. Tasks with no pillar are automatic noise.
        </p>

        <div className="flex flex-col gap-1.5 mb-3">
          {pillars.map(p => (
            <div key={p} className="flex items-center justify-between border border-[#1f2330] bg-[#13161f] px-3 py-2">
              <span className="text-sm text-[#e6e7eb]">{p}</span>
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
              'flex-1 border border-[#1f2330] bg-[#13161f] text-[#e6e7eb] text-sm p-2',
              'focus:outline-none focus:border-[#e6e7eb] focus:ring-1 focus:ring-[#e6e7eb]',
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
                ? 'bg-[#e6e7eb] text-[#0b0d12] hover:bg-[#2447D6]'
                : 'bg-[#1f2330] text-[#8a8f9c] cursor-not-allowed',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Threshold */}
      <div className="mb-8">
        <p className="text-sm font-bold text-[#e6e7eb] mb-1">Signal threshold</p>
        <p className="text-xs text-[#8a8f9c] mb-3">
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
            className="w-48 accent-[#e6e7eb]"
            aria-label="Signal threshold"
          />
          <span
            className="text-lg font-bold text-[#e6e7eb] w-8"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {threshold}
          </span>
        </div>
        <p
          className="text-[10px] text-[#8a8f9c] mt-1"
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
              ? 'bg-[#e6e7eb] text-[#0b0d12] hover:bg-[#0B7A4B]'
              : 'bg-[#1f2330] text-[#8a8f9c] cursor-not-allowed',
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
              className="px-3 py-2 text-xs text-[#8a8f9c] border border-[#1f2330] hover:border-[#8a8f9c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 text-xs text-[#9A2C2C] border border-[#1f2330] hover:border-[#9A2C2C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A2C2C]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Reset all data
          </button>
        )}
      </div>
    </section>
  );
}
