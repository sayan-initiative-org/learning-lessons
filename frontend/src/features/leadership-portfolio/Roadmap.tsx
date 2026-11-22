import { CalendarDays } from "lucide-react";
import { EXAM_WEEKS, PIECES, TOTAL_WEEKS, type Piece } from "./data";
import { currentWeek, isArticle, isPublished, pieceProgress, weekRange, weekSpan, type Store } from "./lib";
import { Card, Ring } from "./ui";

const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

// Greedy row packing so overlapping items in a lane stack instead of colliding.
function pack(items: Piece[]) {
  const rowEnds: number[] = [];
  return items.map((p) => {
    const [s, e] = weekSpan(p.weeks);
    let row = rowEnds.findIndex((end) => end < s);
    if (row === -1) {
      row = rowEnds.length;
      rowEnds.push(e);
    } else {
      rowEnds[row] = e;
    }
    return { p, s, e, row };
  });
}

function Lane({ label, rows, children, cur }: { label: string; rows: number; children: React.ReactNode; cur: number }) {
  return (
    <div
      className="grid border-t border-slate-700"
      style={{ gridTemplateColumns: "5.5rem repeat(12, minmax(0, 1fr))", gridTemplateRows: `repeat(${rows}, 2.5rem)` }}
    >
      <div className="flex items-center px-2 text-xs font-semibold uppercase tracking-wide text-slate-300" style={{ gridRow: `1 / span ${rows}`, gridColumn: 1 }}>
        {label}
      </div>
      {weeks.map((w) => (
        <div
          key={w}
          aria-hidden="true"
          style={{ gridRow: `1 / span ${rows}`, gridColumn: w + 1 }}
          className={`border-l border-slate-700 ${EXAM_WEEKS.includes(w) ? "bg-slate-700" : ""} ${w === cur ? "border-x-2 border-x-indigo-400 bg-indigo-950" : ""}`}
        />
      ))}
      {children}
    </div>
  );
}

export function Roadmap({ store, week, onOpen }: { store: Store; week: number; onOpen: (id: string) => void }) {
  const cur = currentWeek();
  const pieces = pack(PIECES.filter((p) => !isArticle(p)));
  const articles = pack(PIECES.filter(isArticle));
  const active = PIECES.filter((p) => {
    const [s, e] = weekSpan(p.weeks);
    return week >= s && week <= e;
  });

  const item = (x: { p: Piece; s: number; e: number; row: number }) => {
    const pr = pieceProgress(x.p, store);
    return (
      <button
        key={x.p.id}
        type="button"
        onClick={() => onOpen(x.p.id)}
        aria-label={`${x.p.id} ${x.p.title}, weeks ${x.p.weeks}, ${pr.done} of ${pr.total} steps done`}
        style={{ gridColumn: `${x.s + 1} / ${x.e + 2}`, gridRow: x.row + 1 }}
        className={`m-1 overflow-hidden truncate rounded-md border px-2 text-left text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
          isPublished(x.p, store)
            ? "border-green-600 bg-green-500/20 text-green-200"
            : "border-indigo-800 bg-slate-900 text-indigo-200 hover:bg-indigo-950"
        }`}
      >
        {x.p.id}
        <span className="ml-1 hidden font-normal sm:inline">{x.e > x.s ? x.p.title : ""}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-100">Roadmap</h2>

      <Card title="This week" icon={<CalendarDays size={16} />}>
        <p className="text-lg font-semibold text-slate-100">
          {week === 0 && `Starts soon: week 1 is ${weekRange(1)}.`}
          {week >= 1 && week <= TOTAL_WEEKS && `Week ${week} of ${TOTAL_WEEKS} · ${weekRange(week)}`}
          {week > TOTAL_WEEKS && "The 12-week plan has finished."}
        </p>
        {week >= 1 && week <= TOTAL_WEEKS && (
          <>
            {EXAM_WEEKS.includes(week) && (
              <p className="mt-1 rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100">
                Exam week: a light week for portfolio work.
              </p>
            )}
            <ul className="mt-2 space-y-1">
              {active.length === 0 && <li className="text-slate-300">No piece is scheduled this week.</li>}
              {active.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => onOpen(p.id)} className="text-left text-indigo-300 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                    {p.id} {p.title}
                  </button>
                  <span className="text-sm text-slate-300"> · {p.dates}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <section aria-label="12-week timeline">
        <p className="mb-2 text-sm text-slate-300">
          Scroll the timeline sideways on small screens. Shaded columns are exam (light) weeks; the outlined column is this week.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <div className="min-w-[760px]">
            <div className="grid" style={{ gridTemplateColumns: "5.5rem repeat(12, minmax(0, 1fr))" }}>
              <div />
              {weeks.map((w) => (
                <div
                  key={w}
                  title={weekRange(w)}
                  aria-current={w === cur ? "date" : undefined}
                  className={`border-l border-slate-700 py-1.5 text-center text-xs font-semibold ${
                    w === cur ? "bg-indigo-800 text-white" : EXAM_WEEKS.includes(w) ? "bg-slate-700 text-slate-100" : "text-slate-200"
                  }`}
                >
                  W{w}
                </div>
              ))}
            </div>
            <Lane label="Pieces" rows={2} cur={cur}>{pieces.map(item)}</Lane>
            <Lane label="Articles" rows={1} cur={cur}>{articles.map(item)}</Lane>
            <Lane label="Exams" rows={1} cur={cur}>
              {EXAM_WEEKS.map((w) => (
                <div
                  key={w}
                  style={{ gridColumn: w + 1, gridRow: 1 }}
                  className="m-1 flex items-center justify-center rounded-md bg-slate-600 px-1 text-xs font-semibold text-white"
                >
                  Exam
                </div>
              ))}
            </Lane>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {PIECES.map((p) => {
          const pr = pieceProgress(p, store);
          const pub = isPublished(p, store);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpen(p.id)}
              className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-left hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Ring pct={pr.pct} label={`${p.id}: ${pr.done} of ${pr.total} steps done`} />
              <span className="min-w-0">
                <span className="block font-semibold text-slate-100"><span className="text-indigo-400">{p.id}</span> {p.title}</span>
                <span className="block text-sm text-slate-300">{p.weeks.includes("–") ? "Weeks" : "Week"} {p.weeks} · {pr.done} of {pr.total} steps</span>
                {pub && <span className="mt-1 inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-200">Published</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
