import React from 'react';

export default function QuestionGroup({ question, options, selected, onChange }) {
  return (
    <fieldset className="mb-4">
      <legend
        className="text-xs font-bold tracking-wide text-[#e6e7eb] mb-2 block"
        style={{ fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif" }}
      >
        {question}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(opt.value)}
              className={[
                'px-3 py-1.5 text-xs border transition-colors text-left',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2447D6] focus-visible:ring-offset-1',
                isSelected
                  ? 'bg-[#e6e7eb] text-[#0b0d12] border-[#e6e7eb]'
                  : 'bg-[#13161f] text-[#e6e7eb] border-[#1f2330] hover:border-[#8a8f9c]',
              ].join(' ')}
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
