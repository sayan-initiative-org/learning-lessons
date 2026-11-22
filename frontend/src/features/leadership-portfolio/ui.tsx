import type { ReactNode } from "react";
import type { RefType } from "./data";
import { TYPE_LABEL } from "./lib";

export const btn =
  "rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50";
export const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";
export const linkCls =
  "break-words text-indigo-300 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

export function Card({ title, icon, children }: { title?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
      {title && (
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
          {icon && <span className="text-indigo-400" aria-hidden="true">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export function Ring({ pct, size = 56, label }: { pct: number; size?: number; label: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} role="img" aria-label={label} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#334155" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#818cf8" strokeWidth={6} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size * 0.26} fontWeight={600} fill="#f1f5f9">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export function Bar({ pct, label }: { pct: number; label: string }) {
  return (
    <div
      className="h-2 rounded-full bg-slate-700"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
    >
      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}

const TYPE_TONE: Record<RefType, string> = {
  framework: "bg-indigo-500/20 text-indigo-200",
  research: "bg-emerald-500/20 text-emerald-200",
  "vendor-survey": "bg-amber-500/20 text-amber-200",
  "how-to": "bg-sky-500/20 text-sky-200",
  finance: "bg-rose-500/20 text-rose-200",
};
export function TypeBadge({ type }: { type: RefType }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_TONE[type]}`}>{TYPE_LABEL[type]}</span>;
}

export function CheckRow({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-slate-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      />
      <span className={checked ? "text-slate-300 line-through decoration-slate-500" : ""}>{children}</span>
    </label>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {children}
    </a>
  );
}
