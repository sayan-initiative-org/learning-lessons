import React, { useMemo } from 'react';

// Deterministic LCG seeded by score so the noise pattern is stable per score value.
function lcgRand(seed) {
  let s = (seed * 1664525 + 1013904223) & 0x7fffffff;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const W = 300;
const H = 72;
const CY = H / 2;
const AMPLITUDE = 18;
const N = 80;

export default function WaveMeter({ score = 0, threshold = 60 }) {
  const atOrAbove = score >= threshold;
  const strokeColor = atOrAbove ? '#0B7A4B' : '#B96A12';

  const pathD = useMemo(() => {
    const jitter = (100 - score) / 100;
    const rand = lcgRand(score);

    const pts = Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const x = t * W;
      const sine = Math.sin(t * Math.PI * 5) * AMPLITUDE;
      const noise = (rand() - 0.5) * 60 * jitter;
      const y = CY + sine + noise;
      return [x, Math.max(4, Math.min(H - 4, y))];
    });

    return pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ');
  }, [score]);

  const label = score === 0
    ? 'NOISE'
    : score >= threshold
    ? 'SIGNAL'
    : `SCORE ${score}/100`;

  return (
    <figure
      role="img"
      aria-label={`Signal clarity meter — ${label}`}
      className="border border-[#D9DDD3] bg-[#FDFDFB] p-2"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {/* baseline */}
        <line x1="0" y1={CY} x2={W} y2={CY} stroke="#D9DDD3" strokeWidth="0.5" />

        {/* threshold marker */}
        <line
          x1={(threshold / 100) * W}
          y1="0"
          x2={(threshold / 100) * W}
          y2={H}
          stroke="#D9DDD3"
          strokeWidth="0.75"
          strokeDasharray="3 3"
        />

        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.4s ease' }}
        />
      </svg>

      <div
        className="flex justify-between items-center pt-1 px-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        <span className="text-[10px] text-[#B96A12] tracking-widest">NOISE</span>
        <span
          className="text-xs font-bold tracking-widest"
          style={{ color: strokeColor }}
        >
          {label}
        </span>
        <span className="text-[10px] text-[#0B7A4B] tracking-widest">SIGNAL</span>
      </div>
    </figure>
  );
}
