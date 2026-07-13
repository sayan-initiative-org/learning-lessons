export const QUESTIONS = [
  {
    id: 'pillar',
    label: 'Which pillar does this serve?',
    dynamic: true, // options injected from config.pillars at render time
  },
  {
    id: 'leverage',
    label: 'What kind of work is this?',
    options: [
      { label: 'Compounds — builds a lasting asset', value: 'compounds', points: 25 },
      { label: 'Maintains — keeps things running', value: 'maintains', points: 12 },
      { label: 'Neither', value: 'neither', points: 0 },
    ],
  },
  {
    id: 'consequence',
    label: 'If untouched for 7 days, what breaks?',
    options: [
      { label: 'Real break — revenue, trust, or health', value: 'real', points: 20 },
      { label: 'Mild friction — annoying but recoverable', value: 'friction', points: 10 },
      { label: 'Nothing', value: 'nothing', points: 0 },
    ],
  },
  {
    id: 'ownership',
    label: 'Who owns this?',
    options: [
      { label: 'Only me — no one else can', value: 'solo', points: 15 },
      { label: 'Could delegate', value: 'delegate', points: 5 },
      { label: "Someone else's job", value: 'other', points: 0 },
    ],
  },
  {
    id: 'urgency',
    label: 'Why today?',
    options: [
      { label: 'Hard deadline — external commitment', value: 'deadline', points: 10 },
      { label: 'Strategic momentum — now or lose it', value: 'momentum', points: 8 },
      { label: 'Someone asked', value: 'asked', points: 3 },
      { label: 'Anxiety', value: 'anxiety', points: 0 },
    ],
  },
];

const QUESTION_IDS = ['pillar', 'leverage', 'consequence', 'ownership', 'urgency'];

/**
 * Pure: compute score from an answers map.
 * answers = { pillar, leverage, consequence, ownership, urgency }
 * Returns 0–100.
 */
export function scoreOf(answers) {
  if (!answers) return 0;
  let score = 0;

  if (answers.pillar && answers.pillar !== 'none') score += 30;

  for (const q of QUESTIONS) {
    if (q.dynamic) continue;
    const opt = q.options?.find(o => o.value === answers[q.id]);
    if (opt) score += opt.points;
  }

  return score;
}

/**
 * Pure: derive verdict from answers + score.
 * No-pillar is always noise regardless of score.
 * Returns 'signal' | 'weak' | 'noise'.
 */
export function verdictOf(answers, score, threshold = 60) {
  if (!answers?.pillar || answers.pillar === 'none') return 'noise';
  if (score >= threshold) return 'signal';
  if (score >= 40) return 'weak';
  return 'noise';
}

/** True when all five question ids have been answered. */
export function isFullyAnswered(answers) {
  if (!answers) return false;
  return QUESTION_IDS.every(k => answers[k] !== undefined && answers[k] !== null);
}
