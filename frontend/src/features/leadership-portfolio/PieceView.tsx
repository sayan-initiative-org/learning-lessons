import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { STAGES, type Piece } from "./data";
import {
  critKey, fmtDate, getStep, isPublished, pieceProgress, stepKey, taskKey, todayStr, type Store,
} from "./lib";
import { Bar, btn, Card, CheckRow, ExtLink, field, Ring, TypeBadge } from "./ui";

const TABS = [
  "Overview", "Topics", "References & research", "Step-by-step", "Best practices & pitfalls", "Interview use",
] as const;
type Tab = (typeof TABS)[number];

const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

function LinkField({ id, label, value, onChange, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void; hint: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">{label}</label>
      <input
        id={id}
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://"
        className={`${field} mt-1`}
      />
      <p className="mt-1 text-sm text-slate-300">
        {hint} {isUrl(value) && <ExtLink href={value.trim()}>Open link</ExtLink>}
      </p>
    </div>
  );
}

export function PieceView({ piece, store, setStore }: { piece: Piece; store: Store; setStore: (u: (p: Store) => Store) => void }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pr = pieceProgress(piece, store);

  const setCheck = (key: string, v: boolean) => setStore((s) => ({ ...s, checks: { ...s.checks, [key]: v } }));
  const setStep = (key: string, patch: Partial<{ done: boolean; note: string }>) =>
    setStore((s) => {
      const cur = getStep(s, key);
      const next = { ...cur, ...patch };
      if (patch.done !== undefined) next.date = patch.done ? todayStr() : null;
      return { ...s, steps: { ...s.steps, [key]: next } };
    });
  const setFile = (v: string) => setStore((s) => ({ ...s, files: { ...s.files, [piece.id]: v } }));
  const setLink = (v: string) => setStore((s) => ({ ...s, links: { ...s.links, [piece.id]: v } }));

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i + TABS.length - 1) % TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[n]);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-4">
        <Ring pct={pr.pct} size={64} label={`${pr.done} of ${pr.total} steps done`} />
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-slate-100"><span className="text-indigo-400">{piece.id}</span> {piece.title}</h2>
          <p className="text-sm text-slate-300">
            {piece.weeks.includes("–") ? "Weeks" : "Week"} {piece.weeks} · {pr.done} of {pr.total} steps done{isPublished(piece, store) ? " · Published" : ""}
          </p>
        </div>
      </header>

      <div role="tablist" aria-label={`${piece.id} sections`} className="flex gap-1 overflow-x-auto border-b border-slate-700 pb-px">
        {TABS.map((t, i) => (
          <button
            key={t}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`tab-${i}`}
            aria-selected={tab === t}
            aria-controls="tabpanel"
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={`shrink-0 rounded-t-md border px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              tab === t ? "border-slate-700 border-b-slate-900 bg-slate-900 text-indigo-200" : "border-transparent text-slate-200 hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="tabpanel" aria-labelledby={`tab-${TABS.indexOf(tab)}`} className="space-y-4">
        {tab === "Overview" && (
          <>
            <Card title="Overview">
              <dl className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                <dt className="font-semibold text-slate-200">Proves</dt><dd className="text-slate-100">{piece.proves}</dd>
                <dt className="font-semibold text-slate-200">Format</dt><dd className="text-slate-100">{piece.format}</dd>
                <dt className="font-semibold text-slate-200">Weeks</dt><dd className="text-slate-100">{piece.weeks}</dd>
                <dt className="font-semibold text-slate-200">Dates</dt><dd className="text-slate-100">{piece.dates}</dd>
              </dl>
            </Card>
            <Card title="Done criteria">
              <ul className="space-y-2">
                {piece.doneCriteria.map((c, i) => (
                  <li key={i}>
                    <CheckRow checked={!!store.checks[critKey(piece.id, i)]} onChange={(v) => setCheck(critKey(piece.id, i), v)}>{c}</CheckRow>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Finished file">
              <LinkField
                id="file-link"
                label="Link to the finished file"
                value={store.files[piece.id] ?? ""}
                onChange={setFile}
                hint="Paste the link to your master file."
              />
            </Card>
          </>
        )}

        {tab === "Topics" && (
          <Card title="Topics">
            <ul className="list-disc space-y-2 pl-5 text-slate-100">
              {piece.topics.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Card>
        )}

        {tab === "References & research" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {piece.references.map((r) => (
                <article key={r.url + r.title} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                  <TypeBadge type={r.type} />
                  <h3 className="mt-2 font-semibold text-slate-100">{r.title}</h3>
                  <p className="mt-1 text-slate-200">{r.keyPoint}</p>
                  <p className="mt-2 text-sm"><ExtLink href={r.url}>Open source</ExtLink></p>
                </article>
              ))}
            </div>
            <Card title="Research tasks">
              <ul className="space-y-2">
                {piece.researchTasks.map((t, i) => (
                  <li key={i}>
                    <CheckRow checked={!!store.checks[taskKey(piece.id, i)]} onChange={(v) => setCheck(taskKey(piece.id, i), v)}>{t}</CheckRow>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        {tab === "Step-by-step" && (
          <ol className="space-y-4">
            {STAGES.map(({ stage, text }, n) => {
              const steps = piece.steps.map((s, i) => ({ s, i })).filter((x) => x.s.stage === stage);
              if (steps.length === 0) return null;
              const done = steps.filter((x) => getStep(store, stepKey(piece.id, x.i)).done).length;
              return (
                <li key={stage} className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-100"><span className="text-indigo-400">{n + 1}.</span> {stage}</h3>
                    <span className="text-sm text-slate-300">{done} of {steps.length}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{text}</p>
                  <div className="mt-2"><Bar pct={done / steps.length} label={`${stage} progress`} /></div>
                  <ul className="mt-3 space-y-3">
                    {steps.map(({ s, i }) => {
                      const key = stepKey(piece.id, i);
                      const st = getStep(store, key);
                      return (
                        <li key={key} className="border-l-2 border-indigo-800 pl-3">
                          <CheckRow checked={st.done} onChange={(v) => setStep(key, { done: v })}>{s.action}</CheckRow>
                          {st.done && st.date && <p className="ml-8 text-xs text-slate-300">Done {fmtDate(st.date)}</p>}
                          <div className="ml-8 mt-1">
                            <label htmlFor={`note-${key}`} className="text-sm text-slate-200">
                              Notes {st.note ? "(saved)" : ""}
                            </label>
                            <textarea
                              id={`note-${key}`}
                              rows={2}
                              value={st.note}
                              onChange={(e) => setStep(key, { note: e.target.value })}
                              className={`${field} mt-1`}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}

        {tab === "Best practices & pitfalls" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Best practices">
              <ul className="list-disc space-y-2 pl-5 text-slate-100">
                {piece.bestPractices.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </Card>
            <Card title="Pitfalls">
              <ul className="list-disc space-y-2 pl-5 text-slate-100">
                {piece.pitfalls.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </Card>
          </div>
        )}

        {tab === "Interview use" && (
          <>
            <Card title="Interview use">
              <blockquote className="flex gap-3 border-l-4 border-indigo-400 pl-4 text-lg italic text-slate-100">
                <Quote size={16} className="mt-1 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>{piece.interviewUse}</span>
              </blockquote>
            </Card>
            <WalkthroughTimer />
            <Card title="Published link">
              <LinkField
                id="pub-link"
                label="Link to the published piece"
                value={store.links[piece.id] ?? ""}
                onChange={setLink}
                hint="Paste the link once it is live."
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function WalkthroughTimer() {
  const [secs, setSecs] = useState(120);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (secs <= 0) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, secs]);
  const mm = Math.floor(secs / 60);
  return (
    <Card title={`"Walk me through it": 2 minutes`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="min-w-[4.5rem] font-mono text-3xl text-slate-100" role="timer" aria-live="off">
          {mm}:{String(secs % 60).padStart(2, "0")}
        </span>
        <button type="button" className={btn} onClick={() => setRunning((r) => !r)} disabled={secs === 0}>
          {running ? "Pause" : secs === 120 ? "Start" : "Resume"}
        </button>
        <button type="button" className={btn} onClick={() => { setRunning(false); setSecs(120); }}>Reset</button>
      </div>
      {secs === 0 && <p className="mt-2 font-medium text-slate-100" aria-live="polite">Time's up. Did you lead with the decision?</p>}
    </Card>
  );
}
