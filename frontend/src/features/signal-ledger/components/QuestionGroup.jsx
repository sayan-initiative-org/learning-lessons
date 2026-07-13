import React from 'react';

export default function QuestionGroup({ question, options, selected, onChange }) {
  return (
    <fieldset className="mb-4">
      <legend
        className="text-xs font-bold tracking-wide text-[#1A2420] mb-2 block"
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
                  ? 'bg-[#1A2420] text-[#F4F5F1] border-[#1A2420]'
                  : 'bg-[#FDFDFB] text-[#1A2420] border-[#D9DDD3] hover:border-[#5A665F]',
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
