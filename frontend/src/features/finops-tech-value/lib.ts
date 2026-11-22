import { useCallback, useEffect, useRef, useState } from "react";
import { LESSONS, type Lesson } from "./lessons";
import { QUIZ } from "./quiz";

export const CONF_LABELS = ["Not started", "Shaky", "Solid", "Can teach it"] as const;
export const INTERVALS = [1, 3, 7, 14];

export type Progress = {
  conf: number; // 0-3
  reviews: number;
  next: string | null; // YYYY-MM-DD
  notes: string;
  verified: boolean;
  attempts: number;
  correct: number;
};
export type ProgressMap = Record<string, Progress>;
export type Streak = { last: string | null; days: number };
export type PlanRow = { id: string; week: string; dates: string; focus: string; done: boolean };
export type PlanState = { rows: PlanRow[]; examDate: string };

export const EMPTY_PROGRESS: Progress = {
  conf: 0, reviews: 0, next: null, notes: "", verified: false, attempts: 0, correct: 0,
};

export const DEFAULT_PLAN: PlanState = {
  examDate: "2027-01-11",
  rows: [
    { id: "w1", week: "Week 1", dates: "21–27 Dec", focus: "Modules 1–2", done: false },
    { id: "w2", week: "Week 2", dates: "28 Dec–3 Jan", focus: "Modules 3–4", done: false },
    { id: "w3", week: "Week 3", dates: "4–10 Jan", focus: "Module 5 and Module 6", done: false },
    {
      id: "w4", week: "Week 4", dates: "11–17 Jan",
      focus: "Revision, scenario lab, exam drill, sit the exam", done: false,
    },
  ],
};

// Every storage access is guarded; the app keeps working with in-memory state.
export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full: ignore */
  }
}

export function useStored<T>(key: string, fallback: T): [T, (updater: (prev: T) => T) => void] {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));
  const latest = useRef(value);
  latest.current = value;
  const set = useCallback(
    (updater: (prev: T) => T) => {
      const next = updater(latest.current);
      latest.current = next;
      setValue(next);
      writeStore(key, next);
    },
    [key],
  );
  useEffect(() => {
    latest.current = value;
  }, [value]);
  return [value, set];
}

export const pad = (n: number) => String(n).padStart(2, "0");
export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export const todayStr = () => toDateStr(new Date());
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return toDateStr(new Date(y, m - 1, d + days));
}
export function daysBetween(fromStr: string, toStr: string): number {
  const [y1, m1, d1] = fromStr.split("-").map(Number);
  const [y2, m2, d2] = toStr.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export const getP = (map: ProgressMap, id: string): Progress => map[id] ?? EMPTY_PROGRESS;

// Shaky resets to day 1; otherwise the next gap is 1, 3, 7, then 14 days by reviews completed.
export function rate(p: Progress, conf: number, today: string): Progress {
  if (conf === 0) return { ...p, conf: 0, reviews: 0, next: null };
  if (conf === 1) return { ...p, conf: 1, reviews: 0, next: addDays(today, INTERVALS[0]) };
  const gap = INTERVALS[Math.min(p.reviews, INTERVALS.length - 1)];
  return { ...p, conf, reviews: p.reviews + 1, next: addDays(today, gap) };
}

export const isDue = (p: Progress, today: string) => p.conf > 0 && p.next !== null && p.next <= today;

export function bumpStreak(s: Streak, today: string): Streak {
  if (s.last === today) return s;
  return { last: today, days: s.last && daysBetween(s.last, today) === 1 ? s.days + 1 : 1 };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Question = {
  lessonId: string;
  stem: string;
  options: { text: string; correct: boolean; why: string }[];
};

export function buildQuestion(lesson: Lesson): Question {
  const spec = QUIZ[lesson.id];
  const opts = [
    { text: lesson.mustKnow[spec.correct], correct: true, why: spec.why[0] },
    { text: spec.trap, correct: false, why: spec.why[1] },
    { text: spec.wrong[0], correct: false, why: spec.why[2] },
    { text: spec.wrong[1], correct: false, why: spec.why[3] },
  ];
  return {
    lessonId: lesson.id,
    stem: `Which statement about "${lesson.title}" is correct?`,
    options: shuffle(opts),
  };
}

// Weighted sample without replacement; lessons rated below Solid get 3x weight.
export function pickDrill(progress: ProgressMap, count: number): Lesson[] {
  const pool = LESSONS.map((l) => ({ l, w: getP(progress, l.id).conf < 2 ? 3 : 1 }));
  const out: Lesson[] = [];
  while (out.length < count && pool.length) {
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length - 1; idx++) {
      r -= pool[idx].w;
      if (r < 0) break;
    }
    out.push(pool[idx].l);
    pool.splice(idx, 1);
  }
  return out;
}

export function lessonText(l: Lesson): string {
  return [l.id, l.title, l.coreIdea, ...l.mustKnow, l.examTrap, l.applyToEstate, l.interviewLine].join(" ").toLowerCase();
}
