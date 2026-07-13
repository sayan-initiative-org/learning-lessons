import React from 'react';

const TABS = [
  { id: 'today', label: 'TODAY' },
  { id: 'ledger', label: 'LEDGER' },
  { id: 'pillars', label: 'PILLARS' },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav
      className="border-b border-[#D9DDD3] bg-[#F4F5F1]"
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
                ? 'border-[#1A2420] text-[#1A2420]'
                : 'border-transparent text-[#5A665F] hover:text-[#1A2420] hover:border-[#D9DDD3]',
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
