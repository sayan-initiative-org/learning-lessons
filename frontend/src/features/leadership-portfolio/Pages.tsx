import { useMemo, useState } from "react";
import { BarChart3, Search } from "lucide-react";
import {
  BEST_PRACTICE_GROUPS, KEY_STATS, PIECES, PUBLICATION_RULES, RESEARCH_CHECKED, STAGES, type RefType,
} from "./data";
import { buildLibrary, TYPE_LABEL, type Store } from "./lib";
import { Card, CheckRow, ExtLink, field, TypeBadge } from "./ui";

export function Library() {
  const all = useMemo(buildLibrary, []);
  const [type, setType] = useState<"" | RefType>("");
  const [piece, setPiece] = useState("");
  const [q, setQ] = useState("");

  const shown = all.filter((e) => {
    if (type && e.ref.type !== type) return false;
    if (piece && !e.pieces.includes(piece)) return false;
    if (q.trim()) {
      const hay = [...e.titles, ...e.keyPoints, e.url].join(" ").toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold text-slate-100">Research library</h2>
      <p className="text-sm text-slate-200">
        Sources and statistics last re-checked on {RESEARCH_CHECKED}. Re-check anything time-sensitive before you publish.
      </p>

      <Card title="Key statistics" icon={<BarChart3 size={16} />}>
        <ul className="space-y-3">
          {KEY_STATS.map((s) => (
            <li key={s.url + s.stat} className="rounded-lg border border-slate-700 p-3">
              <p className="text-slate-100">{s.stat}</p>
              <p className="mt-1 text-sm text-slate-200">
                Source: {s.source} · <ExtLink href={s.url}>{s.url}</ExtLink>
              </p>
              <p className="mt-1 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-200">
                Verify before quoting
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <label htmlFor="lib-search" className="sr-only">Search references</label>
          <Search size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" aria-hidden="true" />
          <input id="lib-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search references" className={`${field} pl-10`} />
        </div>
        <div>
          <label htmlFor="lib-type" className="sr-only">Filter by type</label>
          <select id="lib-type" value={type} onChange={(e) => setType(e.target.value as "" | RefType)} className={field}>
            <option value="">All types</option>
            {(Object.keys(TYPE_LABEL) as RefType[]).map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lib-piece" className="sr-only">Filter by piece</label>
          <select id="lib-piece" value={piece} onChange={(e) => setPiece(e.target.value)} className={field}>
            <option value="">All pieces</option>
            {PIECES.map((p) => <option key={p.id} value={p.id}>{p.id} {p.title}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-300" aria-live="polite">{shown.length} of {all.length} references</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((e) => (
          <article key={e.url} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <TypeBadge type={e.ref.type} />
            <h3 className="mt-2 font-semibold text-slate-100">{e.titles[0]}</h3>
            {e.titles.length > 1 && <p className="text-sm text-slate-300">Also cited as: {e.titles.slice(1).join("; ")}</p>}
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-200">
              {e.keyPoints.map((k) => <li key={k}>{k}</li>)}
            </ul>
            <p className="mt-2 text-sm text-slate-300">Used in: {e.pieces.join(", ")}</p>
            <p className="mt-1 text-sm"><ExtLink href={e.url}>Open source</ExtLink></p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function PublicationRules({ store, setStore }: { store: Store; setStore: (u: (p: Store) => Store) => void }) {
  const done = PUBLICATION_RULES.filter((_, i) => store.checks[`rule:${i}`]).length;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-100">Publication rules</h2>
      <p className="text-slate-300">Confirm each rule before anything goes public. {done} of {PUBLICATION_RULES.length} confirmed.</p>
      <Card>
        <ul className="space-y-3">
          {PUBLICATION_RULES.map((r, i) => (
            <li key={i}>
              <CheckRow
                checked={!!store.checks[`rule:${i}`]}
                onChange={(v) => setStore((s) => ({ ...s, checks: { ...s.checks, [`rule:${i}`]: v } }))}
              >
                {r}
              </CheckRow>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function BestPractices() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold text-slate-100">Best practices</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {BEST_PRACTICE_GROUPS.map((g) => (
          <Card key={g.theme} title={g.theme}>
            <ul className="space-y-3">
              {g.items.map((it) => (
                <li key={it.lead} className="text-slate-100">
                  <strong>{it.lead}:</strong> {it.body}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card title="The 8-stage pipeline (applies to every piece)">
        <ol className="space-y-2">
          {STAGES.map((s, i) => (
            <li key={s.stage} className="text-slate-100">
              <span className="text-indigo-400">{i + 1}.</span> <strong>{s.stage}:</strong> {s.text}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
