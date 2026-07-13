import React from 'react';

export default function HeaderBar({ streak }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <header className="bg-[#FDFDFB] border-b-2 border-[#1A2420]">
      <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-bold tracking-widest text-[#1A2420] select-none"
          style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
        >
          SIGNAL<span className="text-[#2447D6]">/</span>LEDGER
        </h1>

        <div
          className="flex items-center gap-4 text-xs text-[#5A665F]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span>{date}</span>
          {streak > 0 && (
            <span
              className="border border-[#D9DDD3] px-2 py-0.5 text-[#1A2420]"
              title="Closing streak — consecutive days closed"
            >
              {streak}d streak
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
