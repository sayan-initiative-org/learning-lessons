import React from 'react';

export default function HeaderBar({ streak }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <header className="bg-[#13161f] border-b-2 border-[#e6e7eb]">
      <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-bold tracking-widest text-[#e6e7eb] select-none"
          style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
        >
          SIGNAL<span className="text-[#2447D6]">/</span>LEDGER
        </h1>

        <div
          className="flex items-center gap-4 text-xs text-[#8a8f9c]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span>{date}</span>
          {streak > 0 && (
            <span
              className="border border-[#1f2330] px-2 py-0.5 text-[#e6e7eb]"
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
