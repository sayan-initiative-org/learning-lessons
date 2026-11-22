import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen, Building2, CheckCircle2, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, Gauge,
  HelpCircle, Link2, Mic, Quote, StickyNote, Timer, XCircle,
} from "lucide-react";
import type { Lesson } from "./lessons";
import { buildQuestion, CONF_LABELS, type Progress } from "./lib";

export function SectionCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
        <span className="text-indigo-700" aria-hidden="true">{icon}</span>
        {label}
      </h3>
      {children}
    </section>
  );
}

const ICON = 16;
export const btn =
  "rounded-md border border-slate-400 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50";

export function QuestionBlock({ lesson, onAnswer, onNext, nextLabel }: {
  lesson: Lesson;
  onAnswer: (correct: boolean) => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const [q, setQ] = useState(() => buildQuestion(lesson));
  const [picked, setPicked] = useState<number | null>(null);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(q.options[i].correct);
  };
  const retry = () => {
    setQ(buildQuestion(lesson));
    setPicked(null);
  };

  return (
    <div>
      <p className="font-medium text-slate-900">{q.stem}</p>
      <ul className="mt-3 space-y-2">
        {q.options.map((o, i) => {
          const answered = picked !== null;
          const tone = !answered
            ? "border-slate-400 bg-white hover:bg-slate-50"
            : o.correct
              ? "border-green-700 bg-green-50"
              : i === picked
                ? "border-red-700 bg-red-50"
                : "border-slate-300 bg-white";
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                onClick={() => choose(i)}
                className={`w-full rounded-lg border p-3 text-left text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${tone}`}
              >
                <span className="flex items-start gap-2">
                  {answered && (o.correct
                    ? <CheckCircle2 size={ICON} className="mt-1 shrink-0 text-green-800" aria-label="Correct" />
                    : <XCircle size={ICON} className="mt-1 shrink-0 text-red-800" aria-label="Incorrect" />)}
                  <span>{o.text}</span>
                </span>
                {answered && <span className="mt-2 block text-sm text-slate-800">{o.why}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
          <span className="sr-only">{q.options[picked].correct ? "Correct" : "Incorrect"}</span>
          {onNext ? (
            <button type="button" className={btn} onClick={onNext}>{nextLabel ?? "Next"}</button>
          ) : (
            <button type="button" className={btn} onClick={retry}>Try another version</button>
          )}
        </div>
      )}
    </div>
  );
}

export function LessonView({ lesson, p, moduleName, onUpdate, onRate, onAnswer, onPrev, onNext }: {
  lesson: Lesson;
  p: Progress;
  moduleName: string;
  onUpdate: (patch: Partial<Progress>) => void;
  onRate: (conf: number) => void;
  onAnswer: (correct: boolean) => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [secs, setSecs] = useState(30);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, secs]);

  const toggle = (i: number) =>
    setRevealed((r) => {
      const n = new Set(r);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lesson.interviewLine);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  return (
    <article className="space-y-4">
      <header>
        <p className="text-sm text-slate-700">Module {lesson.module} · {moduleName}</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          <span className="text-indigo-700">{lesson.id}</span> {lesson.title}
        </h2>
      </header>

      <SectionCard icon={<BookOpen size={ICON} />} label="Core idea">
        <p className="rounded-lg bg-indigo-50 p-4 text-xl leading-relaxed text-indigo-950">{lesson.coreIdea}</p>
      </SectionCard>

      <SectionCard icon={<Eye size={ICON} />} label="Must know">
        <p className="mb-3 text-sm text-slate-700">Say each fact from memory first, then reveal it.</p>
        <ul className="space-y-2">
          {lesson.mustKnow.map((f, i) => (
            <li key={i} className="rounded-lg border border-slate-300 p-3">
              {revealed.has(i) ? (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-900">{f}</span>
                  <button type="button" className={btn} onClick={() => toggle(i)} aria-label={`Hide fact ${i + 1}`}>
                    <EyeOff size={ICON} />
                  </button>
                </div>
              ) : (
                <button type="button" className={btn} onClick={() => toggle(i)} aria-expanded={false}>
                  Reveal fact {i + 1}
                </button>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={<HelpCircle size={ICON} />} label="Spot the trap">
        <QuestionBlock key={lesson.id} lesson={lesson} onAnswer={onAnswer} />
        {p.attempts > 0 && (
          <p className="mt-3 text-sm text-slate-700">Your record on this question: {p.correct} of {p.attempts} correct.</p>
        )}
      </SectionCard>

      <SectionCard icon={<Building2 size={ICON} />} label="Apply to your estate">
        <p className="text-slate-900">{lesson.applyToEstate}</p>
        <p className="mt-3 rounded-lg bg-slate-100 p-3 font-medium text-slate-900">What data would you need to decide this?</p>
      </SectionCard>

      <SectionCard icon={<Mic size={ICON} />} label="Interview line">
        <blockquote className="flex gap-3 border-l-4 border-indigo-700 pl-4 text-lg italic text-slate-900">
          <Quote size={ICON} className="mt-1 shrink-0 text-indigo-700" aria-hidden="true" />
          <span>{lesson.interviewLine}</span>
        </blockquote>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={btn}
            onClick={() => {
              setSecs(30);
              setRunning(true);
            }}
          >
            <span className="inline-flex items-center gap-1.5"><Timer size={ICON} /> Practise aloud (30s)</span>
          </button>
          <span className="min-w-[4.5rem] font-mono text-lg text-slate-900" role="timer" aria-live="off">
            0:{String(Math.max(secs, 0)).padStart(2, "0")}
          </span>
          <button type="button" className={btn} onClick={copy}>
            <span className="inline-flex items-center gap-1.5"><Copy size={ICON} /> Copy</span>
          </button>
          <span className="text-sm text-slate-700" aria-live="polite">
            {copied === "ok" ? "Copied" : copied === "fail" ? "Copy not available here" : ""}
          </span>
        </div>
        {!running && secs === 0 && <p className="mt-2 text-sm font-medium text-slate-900">Time's up. How did that sound?</p>}
      </SectionCard>

      <SectionCard icon={<StickyNote size={ICON} />} label="My notes">
        <label htmlFor="notes" className="sr-only">My notes for lesson {lesson.id}</label>
        <textarea
          id="notes"
          rows={5}
          value={p.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Your notes save automatically on this device."
          className="w-full rounded-md border border-slate-400 bg-white p-3 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        />
      </SectionCard>

      <SectionCard icon={<Link2 size={ICON} />} label="Sources">
        <ul className="space-y-1">
          {lesson.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-indigo-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={<Gauge size={ICON} />} label="Confidence">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Rate your confidence">
          {CONF_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={p.conf === i}
              onClick={() => onRate(i)}
              className={`rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                p.conf === i ? "border-indigo-800 bg-indigo-800 text-white" : "border-slate-400 bg-white text-slate-900 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-700">
          {p.next ? `Next review: ${p.next} (reviews completed: ${p.reviews}).` : "Rate this lesson to schedule a review on day 1, 3, 7 or 14."}
        </p>
        <label className="mt-3 flex items-center gap-2 text-slate-900">
          <input
            type="checkbox"
            checked={p.verified}
            onChange={(e) => onUpdate({ verified: e.target.checked })}
            className="h-5 w-5 accent-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          />
          Verified with course
        </label>
      </SectionCard>

      <nav className="flex justify-between gap-2" aria-label="Lesson navigation">
        <button type="button" className={btn} disabled={!onPrev} onClick={() => onPrev?.()}>
          <span className="inline-flex items-center gap-1"><ChevronLeft size={ICON} /> Previous</span>
        </button>
        <span className="self-center text-sm text-slate-700">Tip: use ← and → keys</span>
        <button type="button" className={btn} disabled={!onNext} onClick={() => onNext?.()}>
          <span className="inline-flex items-center gap-1">Next <ChevronRight size={ICON} /></span>
        </button>
      </nav>
    </article>
  );
}
