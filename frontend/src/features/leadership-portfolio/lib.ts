import { useCallback, useRef, useState } from "react";
import { PIECES, START_DATE, TOTAL_WEEKS, type Piece, type Ref, type RefType } from "./data";

export type StepState = { done: boolean; note: string; date: string | null };
export type Store = {
  steps: Record<string, StepState>;
  checks: Record<string, boolean>;
  files: Record<string, string>;
  links: Record<string, string>;
};
export const EMPTY_STORE: Store = { steps: {}, checks: {}, files: {}, links: {} };

const KEY = "lps:v1";

// Every storage access is guarded; the app keeps working in memory if storage fails.
function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY_STORE, ...JSON.parse(raw) } : EMPTY_STORE;
  } catch {
    return EMPTY_STORE;
  }
}
function write(s: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable or full: ignore */
  }
}

export function useStore(): [Store, (u: (p: Store) => Store) => void] {
  const [store, setStore] = useState<Store>(read);
  const latest = useRef(store);
  const set = useCallback((u: (p: Store) => Store) => {
    const next = u(latest.current);
    latest.current = next;
    setStore(next);
    write(next);
  }, []);
  return [store, set];
}

export const stepKey = (pid: string, i: number) => `${pid}:s${i}`;
export const taskKey = (pid: string, i: number) => `${pid}:t${i}`;
export const critKey = (pid: string, i: number) => `${pid}:d${i}`;
export const getStep = (s: Store, key: string): StepState => s.steps[key] ?? { done: false, note: "", date: null };

export function pieceProgress(p: Piece, s: Store) {
  const done = p.steps.filter((_, i) => getStep(s, stepKey(p.id, i)).done).length;
  return { done, total: p.steps.length, pct: p.steps.length ? done / p.steps.length : 0 };
}

// A piece counts as published once every step in its Publish stage is done.
export function isPublished(p: Piece, s: Store) {
  const pub = p.steps.map((st, i) => ({ st, i })).filter((x) => x.st.stage === "Publish");
  return pub.length > 0 && pub.every((x) => getStep(s, stepKey(p.id, x.i)).done);
}

export const isArticle = (p: Piece) => p.id.startsWith("A");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
function parts(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}
export function fmtDate(s: string) {
  const { y, m, d } = parts(s);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export function daysBetween(a: string, b: string) {
  const x = parts(a), y = parts(b);
  return Math.round((Date.UTC(y.y, y.m - 1, y.d) - Date.UTC(x.y, x.m - 1, x.d)) / 86400000);
}
export function addDays(s: string, n: number) {
  const { y, m, d } = parts(s);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

// 0 = before week 1, TOTAL_WEEKS + 1 = after the last week.
export function currentWeek(today = todayStr()): number {
  const days = daysBetween(START_DATE, today);
  if (days < 0) return 0;
  return Math.min(Math.floor(days / 7) + 1, TOTAL_WEEKS + 1);
}
export function weekRange(w: number) {
  const start = addDays(START_DATE, (w - 1) * 7);
  const end = addDays(start, 6);
  const a = parts(start), b = parts(end);
  return `${a.d} ${MONTHS[a.m - 1]} – ${b.d} ${MONTHS[b.m - 1]}`;
}

// "1–3" or "3" -> [start, end]
export function weekSpan(weeks: string): [number, number] {
  const nums = weeks.split("–").map((n) => Number(n.trim()));
  return [nums[0], nums[nums.length - 1]];
}

export const TYPE_LABEL: Record<RefType, string> = {
  framework: "Framework",
  research: "Research",
  "vendor-survey": "Vendor survey",
  "how-to": "How-to",
  finance: "Finance",
};

export type LibraryRef = { url: string; ref: Ref; keyPoints: string[]; titles: string[]; pieces: string[] };

// One entry per URL; every title and key point that was given for it is kept.
export function buildLibrary(): LibraryRef[] {
  const map = new Map<string, LibraryRef>();
  for (const p of PIECES) {
    for (const r of p.references) {
      const e = map.get(r.url);
      if (!e) {
        map.set(r.url, { url: r.url, ref: r, keyPoints: [r.keyPoint], titles: [r.title], pieces: [p.id] });
      } else {
        if (!e.keyPoints.includes(r.keyPoint)) e.keyPoints.push(r.keyPoint);
        if (!e.titles.includes(r.title)) e.titles.push(r.title);
        if (!e.pieces.includes(p.id)) e.pieces.push(p.id);
      }
    }
  }
  return [...map.values()];
}
