import { useState, useEffect, useCallback } from 'react';
import { LocalStorageAdapter } from '../lib/storageAdapter.js';
import { scoreOf, verdictOf, isFullyAnswered } from '../lib/scoring.js';

const today = () => new Date().toLocaleDateString('en-CA');

const DEFAULT_CONFIG = {
  pillars: [
    'SDLC Copilot delivery',
    'AI FinOps Practice (P&L)',
    'Banerjee Speaks / CTO brand',
    'Health & fitness',
  ],
  threshold: 60,
};

function makeCandidate(text) {
  return {
    id: crypto.randomUUID(),
    text,
    answers: null,
    score: null,
    verdict: null,
    verdictFinal: null,
    defense: null,
    defended: false,
  };
}

/**
 * Derived phase — never stored, always recomputed from day shape.
 * Resuming mid-flow is automatic.
 */
function derivePhase(day) {
  if (!day?.candidates?.length) return 'capture';
  const allVerdicted = day.candidates.every(c => c.verdictFinal !== null);
  if (!allVerdicted) return 'interrogate';
  if (!day.top3?.length) return 'rank';
  if (!day.closedAt) return 'focus';
  return 'closed';
}

export function useLedger(adapter = LocalStorageAdapter) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [historyDays, setHistoryDays] = useState([]);

  const showToast = useCallback((msg, type = 'error') => {
    setToast({ msg, type });
    const id = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cfg = (await adapter.get('config')) ?? DEFAULT_CONFIG;
      setConfig(cfg);
      const d = await adapter.get(`day:${today()}`);
      setDay(d ?? null);
      setLoading(false);
    })();
  }, [adapter]);

  // ---------------------------------------------------------------------------
  // Internal save helper — optimistic update + rollback on failure
  // ---------------------------------------------------------------------------
  const persistDay = useCallback(
    async (newDay, prev) => {
      setDay(newDay);
      try {
        await adapter.set(`day:${newDay.date}`, newDay);
      } catch (err) {
        setDay(prev);
        showToast(`Save failed — ${err?.message ?? 'storage error'}. Try again.`);
      }
    },
    [adapter, showToast],
  );

  const persistConfig = useCallback(
    async (newCfg, prev) => {
      setConfig(newCfg);
      try {
        await adapter.set('config', newCfg);
      } catch (err) {
        setConfig(prev);
        showToast(`Config save failed — ${err?.message ?? 'storage error'}.`);
      }
    },
    [adapter, showToast],
  );

  // ---------------------------------------------------------------------------
  // Actions — useLedger is the ONLY place that touches storage
  // ---------------------------------------------------------------------------

  const submitCapture = useCallback(
    async (text) => {
      const lines = text
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
      const prev = day;
      const existing = day?.candidates ?? [];
      const existingTexts = new Set(existing.map(c => c.text));
      const fresh = lines.filter(l => !existingTexts.has(l)).map(makeCandidate);
      if (!fresh.length) return;
      const newDay = {
        date: today(),
        top3: null,
        lockedAt: null,
        closes: {},
        closedAt: null,
        ...(day ?? {}),
        candidates: [...existing, ...fresh],
      };
      await persistDay(newDay, prev);
    },
    [day, persistDay],
  );

  const answerQuestion = useCallback(
    async (candidateId, questionId, value) => {
      const prev = day;
      const candidates = day.candidates.map(c => {
        if (c.id !== candidateId) return c;
        const answers = { ...(c.answers ?? {}), [questionId]: value };
        const score = scoreOf(answers);
        const fullyAnswered = isFullyAnswered(answers);
        const verdict = fullyAnswered ? verdictOf(answers, score, config.threshold) : null;
        // auto-finalize only on signal; weak/noise awaits ChallengePanel
        const verdictFinal =
          fullyAnswered && verdict === 'signal' ? 'signal' : null;
        return { ...c, answers, score, verdict, verdictFinal };
      });
      await persistDay({ ...day, candidates }, prev);
    },
    [day, config.threshold, persistDay],
  );

  const finalizeVerdict = useCallback(
    async (candidateId, outcome, defense = null) => {
      const prev = day;
      const candidates = day.candidates.map(c => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          verdictFinal: outcome,
          defense,
          defended: outcome === 'signal' && c.verdict !== 'signal',
        };
      });
      await persistDay({ ...day, candidates }, prev);
    },
    [day, persistDay],
  );

  const lockTop3 = useCallback(
    async (ids) => {
      const prev = day;
      await persistDay(
        { ...day, top3: ids, lockedAt: new Date().toISOString() },
        prev,
      );
    },
    [day, persistDay],
  );

  const setCloseStatus = useCallback(
    async (taskId, status, note) => {
      const prev = day;
      const closes = { ...(day.closes ?? {}), [taskId]: { status, note: note ?? '' } };
      await persistDay({ ...day, closes }, prev);
    },
    [day, persistDay],
  );

  const closeDay = useCallback(async () => {
    const prev = day;
    await persistDay({ ...day, closedAt: new Date().toISOString() }, prev);
  }, [day, persistDay]);

  const updateConfig = useCallback(
    async (updates) => {
      const prev = config;
      await persistConfig({ ...config, ...updates }, prev);
    },
    [config, persistConfig],
  );

  const resetAll = useCallback(async () => {
    const keys = await adapter.list('day:');
    await Promise.all([...keys.map(k => adapter.delete(k)), adapter.delete('config')]);
    setDay(null);
    setConfig(DEFAULT_CONFIG);
    setHistoryDays([]);
  }, [adapter]);

  const loadHistory = useCallback(async () => {
    const keys = await adapter.list('day:');
    const days = await Promise.all(keys.map(k => adapter.get(k)));
    setHistoryDays(
      days
        .filter(Boolean)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 21),
    );
  }, [adapter]);

  return {
    config,
    day,
    loading,
    toast,
    phase: derivePhase(day),
    historyDays,
    loadHistory,
    actions: {
      submitCapture,
      answerQuestion,
      finalizeVerdict,
      lockTop3,
      setCloseStatus,
      closeDay,
      updateConfig,
      resetAll,
    },
  };
}
