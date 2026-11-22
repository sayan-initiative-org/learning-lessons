import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, ClipboardCheck, RotateCw, Search } from "lucide-react";
import { LESSONS, MODULE_NAMES, type Lesson } from "./lessons";
import {
  CONF_LABELS, daysBetween, getP, isDue, lessonText, pickDrill, todayStr,
  type PlanState, type ProgressMap,
} from "./lib";
import { btn, QuestionBlock, SectionCard } from "./LessonView";

const CONF_TONE = [
  "bg-slate-200 text-slate-900",
  "bg-amber-100 text-amber-950",
  "bg-blue-100 text-blue-950",
  "bg-green-100 text-green-950",
];

export function ConfBadge({ conf }: { conf: number }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CONF_TONE[conf]}`}>{CONF_LABELS[conf]}</span>;
}

function LessonCard({ l, progress, onOpen }: { l: Lesson; progress: ProgressMap; onOpen: (id: string) => void }) {
  const p = getP(progress, l.id);
  return (
    <button
      type="button"
      onClick={() => onOpen(l.id)}
      className="w-full rounded-xl border border-slate-300 bg-white p-4 text-left hover:border-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-slate-900"><span className="text-indigo-700">{l.id}</span> {l.title}</span>
        {p.verified && <BadgeCheck size={18} className="shrink-0 text-green-800" aria-label="Verified with course" />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700">
        <ConfBadge conf={p.conf} />
        <span>{p.next ? `Next review ${p.next}` : "No review scheduled"}</span>
      </div>
    </button>
  );
}

export function Dashboard({ progress, onModule, onLesson, onReview }: {
  progress: ProgressMap;
  onModule: (m: number) => void;
  onLesson: (id: string) => void;
  onReview: () => void;
}) {
  const [query, setQuery] = useState("");
  const today = todayStr();
  const due = LESSONS.filter((l) => isDue(getP(progress, l.id), today));
  const verified = LESSONS.filter((l) => getP(progress, l.id).verified).length;
  const q = query.trim().toLowerCase();
  const hits = q ? LESSONS.filter((l) => lessonText(l).includes(q)) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-950">
          {verified} of {LESSONS.length} verified
        </p>
      </div>

      <div className="relative">
        <label htmlFor="search" className="sr-only">Search all lesson text</label>
        <Search size={18} className="pointer-events-none absolute left-3 top-3 text-slate-600" aria-hidden="true" />
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all lesson text"
          className="w-full rounded-md border border-slate-400 bg-white py-2.5 pl-10 pr-3 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        />
      </div>

      {q && (
        <SectionCard icon={<Search size={16} />} label={`Search results (${hits.length})`}>
          {hits.length === 0 ? (
            <p className="text-slate-700">No lessons match.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {hits.map((l) => <LessonCard key={l.id} l={l} progress={progress} onOpen={onLesson} />)}
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard icon={<CalendarDays size={16} />} label="Due for review today">
        {due.length === 0 ? (
          <p className="text-slate-700">Nothing due. Rate lessons to start the review schedule.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {due.map((l) => (
                <li key={l.id}>
                  <button type="button" className="text-left text-indigo-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" onClick={() => onLesson(l.id)}>
                    {l.id} {l.title}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className={`${btn} mt-3`} onClick={onReview}>Start 1-minute review</button>
          </>
        )}
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_NAMES.map((name, m) => {
          const ls = LESSONS.filter((l) => l.module === m);
          const rated = ls.filter((l) => getP(progress, l.id).conf > 0).length;
          const avg = ls.reduce((s, l) => s + getP(progress, l.id).conf, 0) / ls.length;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onModule(m)}
              className="rounded-xl border border-slate-300 bg-white p-4 text-left hover:border-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <div className="text-sm text-slate-700">Module {m}</div>
              <div className="font-semibold text-slate-900">{name}</div>
              <div className="mt-2 text-sm text-slate-800">{rated} of {ls.length} lessons rated</div>
              <div
                className="mt-2 h-2 rounded-full bg-slate-200"
                role="progressbar"
                aria-label={`Average confidence, module ${m}`}
                aria-valuemin={0}
                aria-valuemax={3}
                aria-valuenow={Number(avg.toFixed(1))}
              >
                <div className="h-2 rounded-full bg-indigo-700" style={{ width: `${(avg / 3) * 100}%` }} />
              </div>
              <div className="mt-1 text-xs text-slate-700">Average confidence {avg.toFixed(1)} / 3</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ModuleView({ m, progress, onLesson }: { m: number; progress: ProgressMap; onLesson: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Module {m} · {MODULE_NAMES[m]}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {LESSONS.filter((l) => l.module === m).map((l) => (
          <LessonCard key={l.id} l={l} progress={progress} onOpen={onLesson} />
        ))}
      </div>
    </div>
  );
}

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT");
}

export function ReviewMode({ progress, onRate, onExit }: {
  progress: ProgressMap;
  onRate: (id: string, conf: number) => void;
  onExit: () => void;
}) {
  const queue = useMemo(() => {
    const today = todayStr();
    const due = LESSONS.filter((l) => isDue(getP(progress, l.id), today)).slice(0, 10);
    if (due.length) return { list: due, isDue: true };
    const low = [...LESSONS].sort((a, b) => getP(progress, a.id).conf - getP(progress, b.id).conf).slice(0, 5);
    return { list: low, isDue: false };
    // Built once per visit so rating a card does not reshuffle the deck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = queue.list[i];

  const rateCard = (conf: number) => {
    if (!card) return;
    onRate(card.id, conf);
    setI((n) => n + 1);
    setFlipped(false);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const onButton = (e.target as HTMLElement | null)?.tagName === "BUTTON";
      if (e.key === " " && !onButton) {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (["1", "2", "3", "4"].includes(e.key) && card) {
        rateCard(Number(e.key) - 1);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">1-minute review</h2>
      <p className="text-slate-700">
        {queue.isDue ? "Lessons due for review today." : "Nothing is due, so these are your lowest-confidence lessons."}
      </p>
      {!card ? (
        <SectionCard icon={<ClipboardCheck size={16} />} label="Done">
          <p className="text-slate-900">Review complete: {queue.list.length} cards.</p>
          <button type="button" className={`${btn} mt-3`} onClick={onExit}>Back to dashboard</button>
        </SectionCard>
      ) : (
        <>
          <p className="text-sm text-slate-700">Card {i + 1} of {queue.list.length}</p>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="min-h-[12rem] w-full rounded-xl border border-slate-400 bg-white p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label={flipped ? "Answer side. Press Space or activate to flip back" : "Question side. Press Space or activate to flip"}
          >
            {flipped ? (
              <div aria-live="polite">
                <p className="text-lg text-indigo-950">{card.coreIdea}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-900">
                  {card.mustKnow.map((f, k) => <li key={k}>{f}</li>)}
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-700">{card.id}</p>
                <p className="text-xl font-semibold text-slate-900">{card.title}</p>
                <p className="mt-3 text-sm text-slate-700">Recall the core idea, then flip (Space).</p>
              </div>
            )}
          </button>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Rate confidence">
            {CONF_LABELS.map((label, k) => (
              <button key={label} type="button" className={btn} onClick={() => rateCard(k)}>
                <span className="font-mono text-slate-700">{k + 1}</span> {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ExamDrill({ progress, onAnswer, onLesson }: {
  progress: ProgressMap;
  onAnswer: (id: string, correct: boolean) => void;
  onLesson: (id: string) => void;
}) {
  const [qs, setQs] = useState<Lesson[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const start = () => {
    setQs(pickDrill(progress, 12));
    setIdx(0);
    setResults([]);
  };

  if (!qs) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Exam drill</h2>
        <p className="text-slate-700">12 random Spot the trap questions, weighted towards lessons rated below Solid.</p>
        <button type="button" className={btn} onClick={start}>Start drill</button>
      </div>
    );
  }

  if (idx >= qs.length) {
    const score = results.filter(Boolean).length;
    const revisit = qs.filter((_, k) => !results[k]);
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Drill complete</h2>
        <p className="text-xl text-slate-900">Score: {score} / {qs.length}</p>
        <SectionCard icon={<RotateCw size={16} />} label="Lessons to revisit">
          {revisit.length === 0 ? (
            <p className="text-slate-900">None. Every answer was correct.</p>
          ) : (
            <ul className="space-y-2">
              {revisit.map((l) => (
                <li key={l.id}>
                  <button type="button" className="text-left text-indigo-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" onClick={() => onLesson(l.id)}>
                    {l.id} {l.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <button type="button" className={btn} onClick={start}>Run another drill</button>
      </div>
    );
  }

  const l = qs[idx];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Exam drill</h2>
      <p className="text-sm text-slate-700">Question {idx + 1} of {qs.length}</p>
      <SectionCard icon={<ClipboardCheck size={16} />} label={`Lesson ${l.id}`}>
        <QuestionBlock
          key={idx}
          lesson={l}
          onAnswer={(c) => {
            setResults((r) => [...r, c]);
            onAnswer(l.id, c);
          }}
          onNext={() => setIdx((n) => n + 1)}
          nextLabel={idx === qs.length - 1 ? "See score" : "Next question"}
        />
      </SectionCard>
    </div>
  );
}

const cell =
  "w-full rounded-md border border-slate-400 bg-white px-2 py-1.5 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600";

export function StudyPlan({ plan, setPlan }: { plan: PlanState; setPlan: (u: (p: PlanState) => PlanState) => void }) {
  const left = daysBetween(todayStr(), plan.examDate);
  const countdown =
    left > 0 ? `${left} day${left === 1 ? "" : "s"} until exam week starts`
      : left === 0 ? "Exam week starts today"
        : `Exam week started ${-left} day${left === -1 ? "" : "s"} ago`;
  const edit = (id: string, patch: Partial<PlanState["rows"][number]>) =>
    setPlan((p) => ({ ...p, rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Study plan</h2>
      <div className="rounded-xl bg-indigo-50 p-4" aria-live="polite">
        <p className="text-xl font-semibold text-indigo-950">{countdown}</p>
        <label htmlFor="exam-date" className="mt-2 block text-sm text-slate-800">Exam week start date</label>
        <input
          id="exam-date"
          type="date"
          value={plan.examDate}
          onChange={(e) => e.target.value && setPlan((p) => ({ ...p, examDate: e.target.value }))}
          className={`${cell} mt-1 max-w-[14rem]`}
        />
      </div>
      <div className="hidden grid-cols-[6rem_9rem_1fr_4rem] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-700 sm:grid">
        <span>Week</span><span>Dates</span><span>Focus</span><span>Done</span>
      </div>
      <ul className="space-y-3">
        {plan.rows.map((r) => (
          <li key={r.id} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-300 bg-white p-3 sm:grid-cols-[6rem_9rem_1fr_4rem] sm:items-center">
            <label className="text-sm text-slate-700 sm:sr-only" htmlFor={`${r.id}-w`}>Week</label>
            <input id={`${r.id}-w`} className={cell} value={r.week} onChange={(e) => edit(r.id, { week: e.target.value })} />
            <label className="text-sm text-slate-700 sm:sr-only" htmlFor={`${r.id}-d`}>Dates</label>
            <input id={`${r.id}-d`} className={cell} value={r.dates} onChange={(e) => edit(r.id, { dates: e.target.value })} />
            <label className="text-sm text-slate-700 sm:sr-only" htmlFor={`${r.id}-f`}>Focus</label>
            <input id={`${r.id}-f`} className={cell} value={r.focus} onChange={(e) => edit(r.id, { focus: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-slate-900">
              <input
                type="checkbox"
                checked={r.done}
                onChange={(e) => edit(r.id, { done: e.target.checked })}
                className="h-5 w-5 accent-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              />
              <span className="sm:sr-only">Done</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
