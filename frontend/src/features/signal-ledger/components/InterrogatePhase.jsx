import React from 'react';
import { QUESTIONS } from '../lib/scoring.js';
import QuestionGroup from './QuestionGroup.jsx';
import WaveMeter from './WaveMeter.jsx';
import ChallengePanel from './ChallengePanel.jsx';

export default function InterrogatePhase({ day, config, onAnswer, onFinalize }) {
  // First candidate without a final verdict is the active subject
  const candidates = day?.candidates ?? [];
  const current = candidates.find(c => c.verdictFinal === null);
  const doneCount = candidates.filter(c => c.verdictFinal !== null).length;

  if (!current) return null;

  const answers = current.answers ?? {};
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const showChallenge = allAnswered && current.verdict && current.verdict !== 'signal';

  // Build pillar options from config
  const pillarOptions = [
    ...(config.pillars ?? []).map(p => ({ label: p, value: p, points: 30 })),
    { label: 'No pillar — honestly', value: 'none', points: 0 },
  ];

  return (
    <section className="max-w-[860px] mx-auto px-4 py-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[10px] tracking-widest text-[#8a8f9c] uppercase"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Interrogation — {doneCount}/{candidates.length} resolved
        </p>
        <div className="flex gap-1">
          {candidates.map(c => (
            <span
              key={c.id}
              className="w-2 h-2 inline-block"
              style={{
                backgroundColor:
                  c.verdictFinal === 'signal'
                    ? '#0B7A4B'
                    : c.verdictFinal
                    ? '#B96A12'
                    : c.id === current.id
                    ? '#2447D6'
                    : '#1f2330',
              }}
            />
          ))}
        </div>
      </div>

      {/* Task text */}
      <div className="border-l-2 border-[#2447D6] pl-4 mb-5">
        <p
          className="text-[10px] tracking-widest text-[#8a8f9c] mb-1 uppercase"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Task
        </p>
        <p className="text-base font-medium text-[#e6e7eb]">{current.text}</p>
      </div>

      <div className="grid md:grid-cols-[1fr_220px] gap-6">
        <div>
          {QUESTIONS.map(q => {
            const opts = q.dynamic ? pillarOptions : q.options;
            return (
              <QuestionGroup
                key={q.id}
                question={q.label}
                options={opts}
                selected={answers[q.id] ?? null}
                onChange={val => onAnswer(current.id, q.id, val)}
              />
            );
          })}

          {showChallenge && (
            <ChallengePanel
              verdict={current.verdict}
              onFinalize={(outcome, defense) => onFinalize(current.id, outcome, defense)}
            />
          )}
        </div>

        <div className="md:pt-0 pt-2">
          <WaveMeter score={current.score ?? 0} threshold={config.threshold} />
          <p
            className="text-[10px] text-[#8a8f9c] mt-2 text-center"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Threshold: {config.threshold}
          </p>
        </div>
      </div>
    </section>
  );
}
