import { useState } from "react";
import { BookMarked, CalendarRange, Library as LibraryIcon, ShieldCheck } from "lucide-react";
import { PIECES, TOTAL_WEEKS } from "./data";
import { currentWeek, isPublished, pieceProgress, useStore } from "./lib";
import { Roadmap } from "./Roadmap";
import { PieceView } from "./PieceView";
import { BestPractices, Library, PublicationRules } from "./Pages";

type View = { name: "roadmap" | "library" | "rules" | "practices" } | { name: "piece"; id: string };

const NAV = [
  { name: "roadmap", label: "Roadmap", icon: CalendarRange },
  { name: "library", label: "Research library", icon: LibraryIcon },
  { name: "rules", label: "Publication rules", icon: ShieldCheck },
  { name: "practices", label: "Best practices", icon: BookMarked },
] as const;

export default function LeadershipPortfolioApp() {
  const [view, setView] = useState<View>({ name: "roadmap" });
  const [store, setStore] = useStore();
  const week = currentWeek();
  const published = PIECES.filter((p) => isPublished(p, store)).length;
  const open = (id: string) => {
    setView({ name: "piece", id });
    window.scrollTo({ top: 0 });
  };
  const piece = view.name === "piece" ? PIECES.find((p) => p.id === view.id) : undefined;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-base text-slate-100">
      <header className="border-b border-slate-700 bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg font-semibold text-slate-100 sm:text-xl">Leadership Portfolio Studio</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-semibold text-indigo-200">
                {published} of {PIECES.length} published
              </span>
              <span className="rounded-full bg-slate-700 px-3 py-1 font-semibold text-slate-100">
                {week === 0 ? "Starts 23 Nov" : week > TOTAL_WEEKS ? "Plan complete" : `Week ${week} of ${TOTAL_WEEKS}`}
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
                  onClick={() => setView({ name })}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    active ? "border-indigo-800 bg-indigo-800 text-white" : "border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              );
            })}
          </nav>
          <nav className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Pieces">
            <span className="mr-1 text-sm text-slate-300">Pieces:</span>
            {PIECES.map((p) => {
              const active = view.name === "piece" && view.id === p.id;
              const pr = pieceProgress(p, store);
              return (
                <button
                  key={p.id}
                  type="button"
                  title={p.title}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${p.id} ${p.title}, ${pr.done} of ${pr.total} steps done`}
                  onClick={() => open(p.id)}
                  className={`rounded-md border px-2.5 py-1 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    active
                      ? "border-indigo-800 bg-indigo-800 text-white"
                      : isPublished(p, store)
                        ? "border-green-600 bg-green-500/20 text-green-200"
                        : "border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  {p.id}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view.name === "roadmap" && <Roadmap store={store} week={week} onOpen={open} />}
        {piece && <PieceView key={piece.id} piece={piece} store={store} setStore={setStore} />}
        {view.name === "library" && <Library />}
        {view.name === "rules" && <PublicationRules store={store} setStore={setStore} />}
        {view.name === "practices" && <BestPractices />}
      </main>
    </div>
  );
}
