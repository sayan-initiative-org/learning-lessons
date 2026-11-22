import type { ReactNode } from "react";
import { useStored } from "./lib";

const DEFAULTS = {
  d: "30", u: "80",
  price: "120000", resid: "20000", life: "60",
  power: "600", cooling: "300", space: "400", support: "500", staff: "700",
  seats: "1000", active: "780", seatPrice: "12",
  credits: "4", hours: "400", credPrice: "3", idle: "30",
};
type CalcState = typeof DEFAULTS;

const num = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const pct = (s: string) => Math.min(100, num(s));
const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export function commitment(d: number, u: number) {
  const breakEven = 100 - d;
  const relCost = u > 0 ? ((100 - d) / u) * 100 : Infinity;
  return { breakEven, relCost, cheaper: u > breakEven };
}
export function capex(c: CalcState) {
  const life = num(c.life);
  const dep = life > 0 ? Math.max(0, num(c.price) - num(c.resid)) / life : 0;
  const run = num(c.power) + num(c.cooling) + num(c.space) + num(c.support) + num(c.staff);
  return { dep, run, total: dep + run };
}
export function reclaim(c: CalcState) {
  const seats = Math.max(0, num(c.seats) - num(c.active));
  return { seats, saving: seats * num(c.seatPrice) * 12 };
}
export function credits(c: CalcState) {
  const cost = num(c.credits) * num(c.hours) * num(c.credPrice);
  const saving = (cost * pct(c.idle)) / 100;
  return { cost, saving, after: cost - saving };
}

function Field({ id, label, unit, value, onChange }: {
  id: string; label: string; unit: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label} <span className="font-normal text-slate-600">({unit})</span>
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      />
    </div>
  );
}

function Calc({ title, children, result, verdict, example }: {
  title: string; children: ReactNode; result: ReactNode; verdict: string; example: string;
}) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
      <div className="mt-4 rounded-lg bg-indigo-50 p-3" aria-live="polite">
        <div className="text-slate-900">{result}</div>
        <p className="mt-1 text-sm font-medium text-indigo-900">{verdict}</p>
      </div>
      <p className="mt-3 text-sm text-slate-700">
        <span className="font-semibold">Worked example (default inputs): </span>
        {example}
      </p>
    </section>
  );
}

export function ScenarioLab() {
  const [c, setC] = useStored<CalcState>("finops-tv:calc", DEFAULTS);
  const set = (k: keyof CalcState) => (v: string) => setC((p) => ({ ...p, [k]: v }));

  const cm = commitment(pct(c.d), pct(c.u));
  const cx = capex(c);
  const rc = reclaim(c);
  const cr = credits(c);

  const dm = commitment(pct(DEFAULTS.d), pct(DEFAULTS.u));
  const dx = capex(DEFAULTS);
  const dr = reclaim(DEFAULTS);
  const dc = credits(DEFAULTS);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Scenario lab</h2>
        <p className="mt-1 text-slate-700">
          The exam uses multi-variable business cases. Change the inputs; results update live and are saved on this device.
          Amounts are in your own currency units.
        </p>
        <button
          type="button"
          onClick={() => setC(() => DEFAULTS)}
          className="mt-2 rounded-md border border-slate-400 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          Reset all inputs to defaults
        </button>
      </div>

      <Calc
        title="Commitment break-even"
        result={
          <>
            Break-even utilisation: <strong>{fmt(cm.breakEven)}%</strong>. Committed cost is{" "}
            <strong>{Number.isFinite(cm.relCost) ? fmt(cm.relCost) : "n/a"}%</strong> of on-demand per unit actually used.
          </>
        }
        verdict={
          cm.cheaper
            ? `Commitment is cheaper: ${fmt(pct(c.u))}% utilisation is above the ${fmt(cm.breakEven)}% break-even.`
            : pct(c.u) === cm.breakEven
              ? "Exactly at break-even: no saving, so stay on demand unless you need the certainty."
              : `Stay on demand: ${fmt(pct(c.u))}% utilisation is below the ${fmt(cm.breakEven)}% break-even.`
        }
        example={`With a ${DEFAULTS.d}% discount the break-even utilisation is ${fmt(dm.breakEven)}%; at ${DEFAULTS.u}% utilisation the commitment costs ${fmt(dm.relCost)}% of on-demand per used unit, so it is cheaper.`}
      >
        <Field id="cm-d" label="Discount d" unit="%" value={c.d} onChange={set("d")} />
        <Field id="cm-u" label="Expected utilisation u" unit="%" value={c.u} onChange={set("u")} />
      </Calc>

      <Calc
        title="CapEx to monthly operating-equivalent"
        result={
          <>
            Depreciation <strong>{fmt(cx.dep)}</strong> + run costs <strong>{fmt(cx.run)}</strong> ={" "}
            <strong>{fmt(cx.total)}</strong> per month.
          </>
        }
        verdict={`Compare ${fmt(cx.total)} per month, fully loaded, with the cloud monthly cost for the same workload.`}
        example={`(${fmt(num(DEFAULTS.price))} − ${fmt(num(DEFAULTS.resid))}) ÷ ${DEFAULTS.life} months = ${fmt(dx.dep)}; plus ${fmt(dx.run)} run costs = ${fmt(dx.total)} per month.`}
      >
        <Field id="cx-price" label="Purchase cost" unit="currency" value={c.price} onChange={set("price")} />
        <Field id="cx-resid" label="Residual value" unit="currency" value={c.resid} onChange={set("resid")} />
        <Field id="cx-life" label="Useful life" unit="months" value={c.life} onChange={set("life")} />
        <Field id="cx-power" label="Power" unit="currency / month" value={c.power} onChange={set("power")} />
        <Field id="cx-cool" label="Cooling" unit="currency / month" value={c.cooling} onChange={set("cooling")} />
        <Field id="cx-space" label="Space" unit="currency / month" value={c.space} onChange={set("space")} />
        <Field id="cx-support" label="Support" unit="currency / month" value={c.support} onChange={set("support")} />
        <Field id="cx-staff" label="Staff share" unit="currency / month" value={c.staff} onChange={set("staff")} />
      </Calc>

      <Calc
        title="SaaS licence reclaim"
        result={
          <>
            Reclaimable seats: <strong>{fmt(rc.seats)}</strong>. Annual saving: <strong>{fmt(rc.saving)}</strong>.
          </>
        }
        verdict={
          rc.seats > 0
            ? "Reclaim only with usage data and owner sign-off, then reassign or remove the seats."
            : "No inactive seats: nothing to reclaim at this price point."
        }
        example={`(${DEFAULTS.seats} − ${DEFAULTS.active}) × ${DEFAULTS.seatPrice} × 12 = ${fmt(dr.saving)} per year from ${fmt(dr.seats)} inactive seats.`}
      >
        <Field id="sr-seats" label="Licensed seats" unit="seats" value={c.seats} onChange={set("seats")} />
        <Field id="sr-active" label="Seats active in last 90 days" unit="seats" value={c.active} onChange={set("active")} />
        <Field id="sr-price" label="Price per seat" unit="currency / month" value={c.seatPrice} onChange={set("seatPrice")} />
      </Calc>

      <Calc
        title="Data platform credit cost"
        result={
          <>
            Monthly cost <strong>{fmt(cr.cost)}</strong>. Auto-suspend saves <strong>{fmt(cr.saving)}</strong>, leaving{" "}
            <strong>{fmt(cr.after)}</strong>.
          </>
        }
        verdict={
          cr.saving > 0
            ? `Auto-suspending idle compute removes ${fmt(pct(c.idle))}% of runtime hours from the bill.`
            : "No idle time entered: auto-suspend saves nothing at this idle %."
        }
        example={`${DEFAULTS.credits} credits/hour × ${DEFAULTS.hours} hours × ${DEFAULTS.credPrice} = ${fmt(dc.cost)}; if ${DEFAULTS.idle}% of runtime is idle, auto-suspend saves ${fmt(dc.saving)}, leaving ${fmt(dc.after)}.`}
      >
        <Field id="dp-credits" label="Credits per hour (set by warehouse/cluster size)" unit="credits/h" value={c.credits} onChange={set("credits")} />
        <Field id="dp-hours" label="Runtime hours" unit="hours / month" value={c.hours} onChange={set("hours")} />
        <Field id="dp-price" label="Price per credit" unit="currency" value={c.credPrice} onChange={set("credPrice")} />
        <Field id="dp-idle" label="Idle share of runtime" unit="%" value={c.idle} onChange={set("idle")} />
      </Calc>
      <p className="text-sm text-slate-700">
        Assumption: the idle % is the share of runtime hours that auto-suspend would fully switch off.
      </p>
    </div>
  );
}
