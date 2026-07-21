import React from 'react';

const TABS = [
  { id: 'today', label: 'TODAY' },
  { id: 'ledger', label: 'LEDGER' },
  { id: 'pillars', label: 'PILLARS' },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav
      className="border-b border-[#1f2330] bg-[#0b0d12]"
      aria-label="Main navigation"
    >
      <div className="max-w-[860px] mx-auto px-4 flex gap-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
            className={[
              'px-5 py-2.5 text-xs font-bold tracking-widest border-b-2 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6] focus-visible:ring-offset-1',
              active === tab.id
                ? 'border-[#e6e7eb] text-[#e6e7eb]'
                : 'border-transparent text-[#8a8f9c] hover:text-[#e6e7eb] hover:border-[#1f2330]',
            ].join(' ')}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
