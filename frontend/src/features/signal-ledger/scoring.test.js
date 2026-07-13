/**
 * Unit tests for scoring.js — plain assertions, no framework imports needed.
 * Run with: npx vitest src/features/signal-ledger/scoring.test.js
 */
import { describe, it, expect } from 'vitest';
import { scoreOf, verdictOf, isFullyAnswered, QUESTIONS } from './lib/scoring.js';

const MAX_ANSWERS = {
  pillar: 'SDLC Copilot delivery', // +30
  leverage: 'compounds',            // +25
  consequence: 'real',              // +20
  ownership: 'solo',                // +15
  urgency: 'deadline',              // +10
};

describe('scoreOf', () => {
  it('returns 0 for null answers', () => {
    expect(scoreOf(null)).toBe(0);
  });

  it('returns 0 for empty answers object', () => {
    expect(scoreOf({})).toBe(0);
  });

  it('awards +30 for a real pillar', () => {
    expect(scoreOf({ pillar: 'AI FinOps Practice (P&L)' })).toBe(30);
  });

  it('awards 0 for no-pillar answer', () => {
    expect(scoreOf({ pillar: 'none' })).toBe(0);
  });

  it('computes maximum possible score of 100', () => {
    expect(scoreOf(MAX_ANSWERS)).toBe(100);
  });

  it('awards correct points for each leverage option', () => {
    expect(scoreOf({ leverage: 'compounds' })).toBe(25);
    expect(scoreOf({ leverage: 'maintains' })).toBe(12);
    expect(scoreOf({ leverage: 'neither' })).toBe(0);
  });

  it('awards correct points for each urgency option', () => {
    expect(scoreOf({ urgency: 'deadline' })).toBe(10);
    expect(scoreOf({ urgency: 'momentum' })).toBe(8);
    expect(scoreOf({ urgency: 'asked' })).toBe(3);
    expect(scoreOf({ urgency: 'anxiety' })).toBe(0);
  });

  it('sums across all answered questions', () => {
    // pillar(30) + maintains(12) + friction(10) + delegate(5) + asked(3) = 60
    const answers = {
      pillar: 'Health & fitness',
      leverage: 'maintains',
      consequence: 'friction',
      ownership: 'delegate',
      urgency: 'asked',
    };
    expect(scoreOf(answers)).toBe(60);
  });
});

describe('verdictOf', () => {
  it('returns noise when answers is null', () => {
    expect(verdictOf(null, 0, 60)).toBe('noise');
  });

  it('returns noise when pillar is "none"', () => {
    expect(verdictOf({ pillar: 'none' }, 95, 60)).toBe('noise');
  });

  it('returns noise when pillar is missing', () => {
    expect(verdictOf({}, 90, 60)).toBe('noise');
  });

  it('returns signal at exactly the threshold', () => {
    expect(verdictOf({ pillar: 'X' }, 60, 60)).toBe('signal');
  });

  it('returns signal above the threshold', () => {
    expect(verdictOf({ pillar: 'X' }, 100, 60)).toBe('signal');
  });

  it('returns weak between 40 and threshold-1', () => {
    expect(verdictOf({ pillar: 'X' }, 59, 60)).toBe('weak');
    expect(verdictOf({ pillar: 'X' }, 40, 60)).toBe('weak');
  });

  it('returns noise below 40', () => {
    expect(verdictOf({ pillar: 'X' }, 39, 60)).toBe('noise');
    expect(verdictOf({ pillar: 'X' }, 0, 60)).toBe('noise');
  });

  it('respects a custom threshold', () => {
    expect(verdictOf({ pillar: 'X' }, 70, 75)).toBe('weak');
    expect(verdictOf({ pillar: 'X' }, 75, 75)).toBe('signal');
  });
});

describe('isFullyAnswered', () => {
  it('returns false for null', () => {
    expect(isFullyAnswered(null)).toBe(false);
  });

  it('returns false when any question is missing', () => {
    const partial = { pillar: 'X', leverage: 'compounds', consequence: 'real', ownership: 'solo' };
    expect(isFullyAnswered(partial)).toBe(false);
  });

  it('returns true when all five questions are answered', () => {
    expect(isFullyAnswered(MAX_ANSWERS)).toBe(true);
  });
});

describe('QUESTIONS structure', () => {
  it('exports exactly 5 question definitions', () => {
    expect(QUESTIONS).toHaveLength(5);
  });

  it('has the pillar question marked dynamic', () => {
    const pillarQ = QUESTIONS.find(q => q.id === 'pillar');
    expect(pillarQ?.dynamic).toBe(true);
  });

  it('non-dynamic questions each have at least 2 options', () => {
    QUESTIONS.filter(q => !q.dynamic).forEach(q => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });
});
