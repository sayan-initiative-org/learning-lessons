import { useEffect, useState } from "react";
import { Calculator, CalendarDays, ClipboardCheck, Flame, Layers, LayoutDashboard, RotateCw } from "lucide-react";
import { LESSONS, MODULE_NAMES } from "./lessons";
import {
  bumpStreak, DEFAULT_PLAN, getP, rate, todayStr, useStored,
  type PlanState, type Progress, type ProgressMap, type Streak,
} from "./lib";
import { LessonView, btn } from "./LessonView";
import { ScenarioLab } from "./Calculators";
import { Dashboard, ExamDrill, ModuleView, ReviewMode, StudyPlan } from "./Views";

type View =
  | { name: "dashboard" }
  | { name: "module"; m: number }
  | { name: "lesson"; id: string }
  | { name: "lab" }
  | { name: "review" }
  | { name: "drill" }
  | { name: "plan" };

const NAV = [
  { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { name: "lab", label: "Scenario lab", icon: Calculator },
  { name: "review", label: "1-minute review", icon: RotateCw },
  { name: "drill", label: "Exam drill", icon: ClipboardCheck },
  { name: "plan", label: "Study plan", icon: CalendarDays },
] as const;

export default function FinOpsTechValueApp() {
  const [view, setView] = useState<View>({ name: "dashboard" });
  const [progress, setProgress] = useStored<ProgressMap>("finops-tv:progress", {});
  const [streak, setStreak] = useStored<Streak>("finops-tv:streak", { last: null, days: 0 });
  const [plan, setPlan] = useStored<PlanState>("finops-tv:plan", DEFAULT_PLAN);

  const study = () => setStreak((s) => bumpStreak(s, todayStr()));
  const update = (id: string, patch: Partial<Progress>) =>
    setProgress((prev) => ({ ...prev, [id]: { ...getP(prev, id), ...patch } }));
  const rateLesson = (id: string, conf: number) => {
    setProgress((prev) => ({ ...prev, [id]: rate(getP(prev, id), conf, todayStr()) }));
    study();
  };
  const answer = (id: string, correct: boolean) => {
    setProgress((prev) => {
      const p = getP(prev, id);
      return { ...prev, [id]: { ...p, attempts: p.attempts + 1, correct: p.correct + (correct ? 1 : 0) } };
    });
    study();
  };

  const idx = view.name === "lesson" ? LESSONS.findIndex((l) => l.id === view.id) : -1;
  const goLesson = (i: number) => {
    if (i >= 0 && i < LESSONS.length) {
      setView({ name: "lesson", id: LESSONS[i].id });
      window.scrollTo({ top: 0 });
    }
  };

  useEffect(() => {
    if (view.name !== "lesson") return;
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "ArrowLeft") goLesson(idx - 1);
      if (e.key === "ArrowRight") goLesson(idx + 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const solid = LESSONS.filter((l) => getP(progress, l.id).conf >= 2).length;
  const openLesson = (id: string) => {
    setView({ name: "lesson", id });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-base text-slate-900">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">FinOps Technology Value: Learning Lessons</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-950">
                <Layers size={14} className="mr-1 inline" aria-hidden="true" />
                {solid} / {LESSONS.length} Solid or better
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-950">
                <Flame size={14} className="mr-1 inline" aria-hidden="true" />
                {streak.days} day streak
              </span>
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-2" aria-label="Sections">
            {NAV.map(({ name, label, icon: Icon }) => {
              const active = view.name === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setView({ name } as View)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    active ? "border-indigo-800 bg-indigo-800 text-white" : "border-slate-400 bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {(view.name === "module" || view.name === "lesson") && (
          <button
            type="button"
            className={`${btn} mb-4`}
            onClick={() =>
              setView(view.name === "lesson"
                ? { name: "module", m: LESSONS[idx].module }
                : { name: "dashboard" })}
          >
            ← {view.name === "lesson" ? `Module ${LESSONS[idx].module} · ${MODULE_NAMES[LESSONS[idx].module]}` : "Dashboard"}
          </button>
        )}

        {view.name === "dashboard" && (
          <Dashboard
            progress={progress}
            onModule={(m) => setView({ name: "module", m })}
            onLesson={openLesson}
            onReview={() => setView({ name: "review" })}
          />
        )}
        {view.name === "module" && <ModuleView m={view.m} progress={progress} onLesson={openLesson} />}
        {view.name === "lesson" && idx >= 0 && (
          <LessonView
            key={view.id}
            lesson={LESSONS[idx]}
            p={getP(progress, view.id)}
            moduleName={MODULE_NAMES[LESSONS[idx].module]}
            onUpdate={(patch) => update(view.id, patch)}
            onRate={(c) => rateLesson(view.id, c)}
            onAnswer={(c) => answer(view.id, c)}
            onPrev={idx > 0 ? () => goLesson(idx - 1) : null}
            onNext={idx < LESSONS.length - 1 ? () => goLesson(idx + 1) : null}
          />
        )}
        {view.name === "lab" && <ScenarioLab />}
        {view.name === "review" && (
          <ReviewMode progress={progress} onRate={rateLesson} onExit={() => setView({ name: "dashboard" })} />
        )}
        {view.name === "drill" && <ExamDrill progress={progress} onAnswer={answer} onLesson={openLesson} />}
        {view.name === "plan" && <StudyPlan plan={plan} setPlan={setPlan} />}

        <p className="mt-8 text-sm text-slate-700">
          Preparation content from public sources. Exam details come from a third-party guide; verify everything against
          the official course.
        </p>
      </main>
    </div>
  );
}
