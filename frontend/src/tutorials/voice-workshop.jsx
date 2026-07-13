import React, { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  THE VOICE WORKSHOP
 *  A writing-skill development system built around one goal:
 *  a distinctive written voice, published 2–3× / week across
 *  LinkedIn · Medium · Newsletter.
 * ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.vv, .vv * { box-sizing: border-box; }
.vv {
  --ink:#171A24; --ink2:#20242F; --ink3:#282D3A;
  --paper:#F3EEE3; --paper2:#E7DFCF;
  --red:#C0362C; --red-soft:#D8695F;
  --brass:#B08A3E; --brass-soft:#CBA85E;
  --muted:#8A8F9C; --stone:#3A3F4C; --line:#333846;
  font-family:'Spectral', Georgia, serif;
  color:var(--paper);
  background:var(--ink);
  min-height:100vh;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.vv .mono { font-family:'IBM Plex Mono', ui-monospace, monospace; }
.vv .disp { font-family:'Fraunces', Georgia, serif; }

.vv .wrap { max-width:940px; margin:0 auto; padding:0 18px 96px; }

/* header */
.vv .top { padding:34px 0 20px; border-bottom:1px solid var(--line); }
.vv .brandrow { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
.vv .pilcrow {
  font-family:'Fraunces',serif; font-size:34px; line-height:1;
  color:var(--red); transform:translateY(2px);
}
.vv h1.disp { font-size:clamp(28px,7vw,44px); font-weight:600; letter-spacing:-0.02em; margin:0; color:var(--paper); }
.vv .kicker { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:var(--brass-soft); margin:0 0 6px; }
.vv .lede { color:var(--muted); font-size:15.5px; max-width:640px; margin:12px 0 0; font-style:italic; }
.vv .goalstrip { display:flex; gap:8px; flex-wrap:wrap; margin-top:18px; }
.vv .goalchip {
  font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.04em;
  padding:6px 11px; border:1px solid var(--line); border-radius:2px;
  color:var(--paper); background:var(--ink2);
}
.vv .goalchip b { color:var(--brass-soft); font-weight:600; }

/* tabs */
.vv .tabs {
  display:flex; gap:2px; overflow-x:auto; margin-top:22px;
  border-bottom:1px solid var(--line); scrollbar-width:none;
}
.vv .tabs::-webkit-scrollbar { display:none; }
.vv .tab {
  flex:0 0 auto; background:none; border:none; cursor:pointer;
  color:var(--muted); font-family:'IBM Plex Mono',monospace; font-size:12.5px;
  letter-spacing:0.03em; padding:12px 14px; border-bottom:2px solid transparent;
  display:flex; align-items:center; gap:7px; white-space:nowrap;
}
.vv .tab:hover { color:var(--paper); }
.vv .tab .mk { color:var(--red-soft); font-family:'Fraunces',serif; font-size:15px; }
.vv .tab[aria-selected="true"] { color:var(--paper); border-bottom-color:var(--red); }
.vv .tab:focus-visible { outline:2px solid var(--brass); outline-offset:2px; }

/* panels + cards */
.vv .panel { padding-top:26px; animation:fade .35s ease; }
@keyframes fade { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;} }
@media (prefers-reduced-motion: reduce){ .vv .panel{animation:none;} }

.vv .section-h { font-family:'Fraunces',serif; font-size:23px; font-weight:600; color:var(--paper); margin:2px 0 4px; letter-spacing:-0.01em; }
.vv .section-sub { color:var(--muted); font-size:14.5px; margin:0 0 20px; max-width:600px; }
.vv .section-sub em { color:var(--brass-soft); font-style:italic; }

.vv .card {
  background:var(--paper); color:var(--ink); border-radius:3px;
  padding:20px 20px 20px 26px; margin-bottom:16px; position:relative;
  box-shadow:0 1px 0 var(--paper2), 0 10px 30px -18px rgba(0,0,0,.6);
}
/* red ruled margin, like notebook paper */
.vv .card::before {
  content:""; position:absolute; left:14px; top:12px; bottom:12px;
  width:1.5px; background:var(--red-soft); opacity:.5;
}
.vv .card h3 { font-family:'Fraunces',serif; font-size:17px; font-weight:600; margin:0 0 4px; color:var(--ink); }
.vv .card p { margin:0; font-size:14.5px; color:#3a3a3a; }
.vv .card .lbl { font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--red); margin-bottom:8px; }

.vv label.fieldlbl { display:block; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--red); margin:0 0 6px; }
.vv .hint { font-size:12.5px; color:#6a6459; font-style:italic; margin:4px 0 0; }
.vv textarea, .vv input[type="text"], .vv select {
  width:100%; background:#FBF8F1; border:1px solid var(--paper2); border-radius:2px;
  font-family:'Spectral',serif; font-size:14.5px; color:var(--ink); padding:10px 12px; resize:vertical;
}
.vv textarea:focus, .vv input:focus, .vv select:focus { outline:2px solid var(--brass); outline-offset:1px; border-color:var(--brass); }

/* buttons */
.vv .btn {
  font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.04em;
  border:1px solid var(--red); background:var(--red); color:#fff;
  padding:9px 15px; border-radius:2px; cursor:pointer; transition:.15s;
}
.vv .btn:hover { background:#a82c23; }
.vv .btn.ghost { background:transparent; color:var(--red); }
.vv .btn.ghost:hover { background:rgba(192,54,44,.08); }
.vv .btn.dark { background:var(--ink); border-color:var(--ink); color:var(--paper); }
.vv .btn.dark:hover { background:#000; }
.vv .btn:focus-visible { outline:2px solid var(--brass); outline-offset:2px; }
.vv .btn:disabled { opacity:.4; cursor:default; }

/* checklist */
.vv .task { display:flex; gap:11px; align-items:flex-start; padding:9px 0; border-bottom:1px dashed var(--paper2); cursor:pointer; }
.vv .task:last-child { border-bottom:none; }
.vv .box {
  flex:0 0 auto; width:20px; height:20px; border:1.5px solid var(--ink); border-radius:2px;
  display:flex; align-items:center; justify-content:center; margin-top:1px;
  font-family:'Fraunces',serif; color:var(--red); font-size:15px; line-height:1; background:#fff;
}
.vv .task.done .box { background:var(--red); border-color:var(--red); color:#fff; }
.vv .task.done .tasktxt { text-decoration:line-through; color:#9a938a; }
.vv .tasktxt { font-size:14px; color:var(--ink); }
.vv .tasktxt b { color:var(--red); font-weight:600; }

/* phase meta */
.vv .phase-meta { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:2px; }
.vv .phase-num { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--red); letter-spacing:0.1em; }
.vv .phase-name { font-family:'Fraunces',serif; font-size:19px; font-weight:600; color:var(--ink); }
.vv .phase-weeks { font-family:'IBM Plex Mono',monospace; font-size:11px; color:#8a8378; }
.vv .phase-tag { font-size:13px; color:#5a5449; font-style:italic; margin:2px 0 14px; }

/* progress */
.vv .prog-outer { height:7px; background:var(--ink3); border-radius:4px; overflow:hidden; border:1px solid var(--line); }
.vv .prog-inner { height:100%; background:linear-gradient(90deg,var(--brass),var(--brass-soft)); transition:width .4s ease; }
.vv .prog-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.vv .prog-row .mono { font-size:11px; color:var(--muted); letter-spacing:0.06em; }
.vv .prog-row .pct { color:var(--brass-soft); }

/* dark info cards on ink */
.vv .icard { background:var(--ink2); border:1px solid var(--line); border-radius:3px; padding:16px 18px; margin-bottom:12px; }
.vv .icard h4 { font-family:'Fraunces',serif; font-size:16px; margin:0 0 6px; color:var(--paper); font-weight:600; }
.vv .icard .plat { font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--brass-soft); }
.vv .icard p { margin:6px 0 0; font-size:14px; color:#c7c9d1; }
.vv .icard p b { color:var(--paper); }

/* rhythm grid */
.vv .rhythm { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; margin:6px 0 4px; }
.vv .day { background:var(--ink2); border:1px solid var(--line); border-radius:3px; padding:10px 8px; text-align:center; }
.vv .day .d { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; color:var(--muted); text-transform:uppercase; }
.vv .day .act { font-size:12px; color:var(--paper); margin-top:6px; line-height:1.35; }
.vv .day .act .ship { color:var(--red-soft); font-weight:600; }
@media (max-width:560px){ .vv .rhythm{ grid-template-columns:repeat(2,1fr);} }

/* drills */
.vv .drill-head { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:14px; }
.vv .drill-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media (max-width:640px){ .vv .drill-grid{ grid-template-columns:1fr;} }
.vv .drill { background:var(--paper); color:var(--ink); border-radius:3px; padding:16px 16px 14px; position:relative; }
.vv .drill.spot { outline:2px solid var(--brass); box-shadow:0 0 0 4px rgba(176,138,62,.18); }
.vv .drill .dn { font-family:'Fraunces',serif; font-weight:600; font-size:15.5px; margin-bottom:5px; color:var(--ink); }
.vv .drill .dmove { font-size:13.5px; color:#3a3a3a; }
.vv .drill .dwhy { font-size:12.5px; color:#6a6459; font-style:italic; margin-top:6px; }
.vv .drill .drow { display:flex; justify-content:space-between; align-items:center; margin-top:11px; }
.vv .reps { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--red); }
.vv .repbtn { font-family:'IBM Plex Mono',monospace; font-size:11px; border:1px solid var(--ink); background:#fff; color:var(--ink); border-radius:2px; padding:5px 9px; cursor:pointer; }
.vv .repbtn:hover { background:var(--ink); color:#fff; }

/* rubric */
.vv .rub { margin-bottom:13px; }
.vv .rub .rlbl { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
.vv .rub .rname { font-size:14px; color:var(--paper); }
.vv .rub .rname span { color:var(--muted); font-size:12px; font-style:italic; }
.vv .rub .rval { font-family:'IBM Plex Mono',monospace; font-size:13px; color:var(--brass-soft); }
.vv input[type="range"]{ width:100%; accent-color:var(--red); height:22px; }
.vv .score-big { font-family:'Fraunces',serif; font-size:44px; font-weight:600; color:var(--brass-soft); line-height:1; }
.vv .score-big small { font-size:18px; color:var(--muted); }

/* log */
.vv .logform { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px; }
@media (max-width:560px){ .vv .logform{ grid-template-columns:1fr;} }
.vv .logitem { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 12px; background:var(--ink2); border:1px solid var(--line); border-radius:2px; margin-bottom:6px; }
.vv .logitem .lt { font-size:14px; color:var(--paper); }
.vv .logitem .lm { font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--muted); letter-spacing:0.05em; margin-top:2px; }
.vv .logitem .lm b { color:var(--brass-soft); }
.vv .del { background:none; border:none; color:var(--muted); cursor:pointer; font-family:'IBM Plex Mono',monospace; font-size:11px; }
.vv .del:hover { color:var(--red-soft); }

/* stat row */
.vv .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
.vv .stat { background:var(--ink2); border:1px solid var(--line); border-radius:3px; padding:14px; text-align:center; }
.vv .stat .n { font-family:'Fraunces',serif; font-size:30px; font-weight:600; color:var(--paper); line-height:1; }
.vv .stat .n.hit { color:var(--brass-soft); }
.vv .stat .k { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-top:6px; }

.vv .spark { margin-top:6px; }
.vv .empty { color:var(--muted); font-style:italic; font-size:13.5px; padding:6px 0; }

.vv .foot { margin-top:34px; padding-top:18px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
.vv .foot .mono { font-size:11px; color:var(--muted); letter-spacing:0.04em; }
.vv .savenote { font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--brass-soft); }

.vv .marginalia { font-family:'Fraunces',serif; font-style:italic; color:var(--red-soft); font-size:15px; border-left:2px solid var(--red-soft); padding-left:12px; margin:0 0 18px; }
`;

/* ---------------- data ---------------- */

const PHASES = [
  {
    num: "01", name: "Excavate", weeks: "Weeks 1–2",
    tag: "Find the voice you already have before inventing one.",
    tasks: [
      "Pull your 8 strongest published pieces. Extract recurring moves into the Compass.",
      "Read-aloud edit one old piece — mark where it sounds like you vs. like anyone.",
      "Write your Voice Charter: 3 signatures, 5 anti-patterns, 1 point-of-view line.",
      "Score one recent piece on the Desk rubric — that's your baseline.",
    ],
  },
  {
    num: "02", name: "Amplify", weeks: "Weeks 3–6",
    tag: "Deliberate reps — one voice constraint per piece.",
    tasks: [
      "Publish 2–3× / week. Each piece runs ONE rotating drill from the library.",
      "Keep a swipe file of lines that land — yours and others'.",
      "Weekly: score one piece, find the lowest dimension, target it next week.",
      "End of week 6: re-read week-3 posts. Note what already sounds more like you.",
    ],
  },
  {
    num: "03", name: "Calibrate", weeks: "Weeks 7–10",
    tag: "Same voice, three rooms — LinkedIn, Medium, Newsletter.",
    tasks: [
      "Adapt register per platform without diluting voice (see Cadence · calibration).",
      "Run the repurpose engine: 1 anchor idea → 3 native formats, voice intact.",
      "Recruit 2–3 trusted readers. Ask one question only: what sounded like me?",
      "Kill your two most-used crutch phrases across all three platforms.",
    ],
  },
  {
    num: "04", name: "Systematize", weeks: "Weeks 11–12",
    tag: "Make the voice durable and the cadence automatic.",
    tasks: [
      "Write Voice Style Guide v2 — update the Compass with what actually worked.",
      "Lock the weekly ritual so shipping doesn't need willpower.",
      "Review your rubric trend on the Desk. Pick ONE focus for next quarter.",
      "Draft a 'greatest hits' list — the 3 pieces most unmistakably yours.",
    ],
  },
];

const DRILLS = [
  { id:"d1", n:"Read-aloud scalpel", m:"Read the draft aloud. Cut anything you'd never actually say.", w:"Voice lives in spoken rhythm; the ear catches what the eye forgives." },
  { id:"d2", n:"The contrarian hinge", m:"Start from what everyone agrees on. Find the exact point you disagree. Write from there.", w:"A real stance is the fastest route to a voice nobody can copy." },
  { id:"d3", n:"Concrete swap", m:"Replace every abstraction with a specific instance from your real work.", w:"“Better evals” → “a 5-layer judge that caught a miss we'd already shipped.” Detail is identity." },
  { id:"d4", n:"One-sentence paragraphs", m:"Write a whole piece where no paragraph exceeds one sentence.", w:"Exposes your natural cadence and teaches punch." },
  { id:"d5", n:"Kill the warm-up", m:"Delete your first paragraph. Begin on the second.", w:"The first para is usually you clearing your throat. The real opening waits underneath." },
  { id:"d6", n:"Steal the skeleton", m:"Take a structure you admire, throw away its words, fill it with your material.", w:"You learn shape without borrowing skin." },
  { id:"d7", n:"Signature close", m:"Draft 5 different last lines. Keep the one only you'd write.", w:"A recurring way of landing becomes a fingerprint readers wait for." },
  { id:"d8", n:"The analogy engine", m:"Carry the whole argument on one analogy from a world you own — cricket, architecture, finance.", w:"Your reference set is unrepeatable; lean on it." },
  { id:"d9", n:"Fingerprint highlight", m:"Highlight the 3 sentences in your last piece only you could've written. Next piece: aim for 6.", w:"Makes the invisible thing measurable." },
  { id:"d10", n:"Fixed-form sprint", m:"200 words, 20 minutes, one idea, ship it.", w:"Speed pushes voice past the internal editor." },
];

const RUBRIC = [
  ["Distinct opening", "would this stop the scroll?"],
  ["Point of view", "is there a real argument?"],
  ["Concreteness", "specifics over abstractions"],
  ["Rhythm & variation", "sentence-length music"],
  ["Fingerprint", "sentences only you could write"],
  ["Economy", "throat-clearing removed"],
  ["Signature close", "does it land, not trail off?"],
  ["Reader payoff", "something they can't feed-scroll for"],
];

const SEED_ANTI = "• “In today's fast-paced world…”\n• “It's important to note that…”\n• Throat-clearing intros before the real point\n• Hedging: arguably, somewhat, in many ways\n• Abstractions with no concrete instance\n• Broetry line-breaks with no substance underneath";

const PLATFORMS = ["LinkedIn", "Medium", "Newsletter", "Blog", "Other"];

/* ---------------- storage ---------------- */

const KEY = "voiceworkshop:v1";
const hasStore = typeof window !== "undefined" && window.storage;

const emptyState = () => ({
  charter: { signatures: "", antipatterns: SEED_ANTI, pov: "" },
  checks: {},                       // `${phaseIdx}-${taskIdx}` -> true
  drills: {},                       // id -> count
  rubric: [3,3,3,3,3,3,3,3],
  history: [],                      // {date, total}
  log: [],                          // {id, date, platform, title, score}
});

/* ---------------- helpers ---------------- */

const todayISO = () => new Date().toISOString().slice(0,10);

function weekKey(d){
  const dt = new Date(d + "T00:00:00");
  const day = (dt.getDay()+6)%7;           // Mon=0
  dt.setDate(dt.getDate()-day);
  return dt.toISOString().slice(0,10);
}
function cadenceStreak(log){
  const weeks = {};
  log.forEach(l => { const k = weekKey(l.date); weeks[k]=(weeks[k]||0)+1; });
  let streak = 0;
  let cursor = weekKey(todayISO());
  while (true){
    if ((weeks[cursor]||0) >= 2){ streak++; }
    else if (cursor !== weekKey(todayISO())) break;   // allow current week to still be building
    else break;
    // step back one week
    const d = new Date(cursor+"T00:00:00"); d.setDate(d.getDate()-7);
    cursor = d.toISOString().slice(0,10);
  }
  return streak;
}
function thisWeekCount(log){
  const wk = weekKey(todayISO());
  return log.filter(l => weekKey(l.date) === wk).length;
}

/* ---------------- component ---------------- */

export default function VoiceWorkshop(){
  const [tab, setTab] = useState("compass");
  const [state, setState] = useState(emptyState());
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [spotlight, setSpotlight] = useState(null);
  const firstSave = useRef(true);

  // load
  useEffect(() => {
    let alive = true;
    (async () => {
      if (hasStore){
        try {
          const r = await window.storage.get(KEY);
          if (alive && r && r.value){
            const parsed = JSON.parse(r.value);
            setState({ ...emptyState(), ...parsed });
          }
        } catch(e){ /* no saved state yet */ }
      }
      if (alive) setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  // save (debounced)
  useEffect(() => {
    if (!loaded) return;
    if (firstSave.current){ firstSave.current = false; return; }
    const t = setTimeout(async () => {
      if (hasStore){
        try { await window.storage.set(KEY, JSON.stringify(state), false); setSaved(true); setTimeout(()=>setSaved(false),1400); }
        catch(e){ /* ignore */ }
      }
    }, 500);
    return () => clearTimeout(t);
  }, [state, loaded]);

  const patch = useCallback((fn) => setState(s => { const n = structuredClone(s); fn(n); return n; }), []);

  const resetAll = () => {
    if (!window.confirm("Clear all your workshop progress? This can't be undone.")) return;
    setState(emptyState());
    if (hasStore){ try { window.storage.delete(KEY, false); } catch(e){} }
  };

  if (!loaded){
    return (
      <div className="vv"><style>{CSS}</style>
        <div className="wrap"><div className="top"><p className="empty" style={{color:"var(--muted)"}}>Opening the workshop…</p></div></div>
      </div>
    );
  }

  /* derived */
  const totalTasks = PHASES.reduce((a,p)=>a+p.tasks.length,0);
  const doneTasks = Object.values(state.checks).filter(Boolean).length;
  const arcPct = Math.round((doneTasks/totalTasks)*100);
  const rubricTotal = state.rubric.reduce((a,b)=>a+b,0);
  const totalReps = Object.values(state.drills).reduce((a,b)=>a+b,0);
  const streak = cadenceStreak(state.log);
  const twc = thisWeekCount(state.log);

  const drawDrill = () => {
    const pick = DRILLS[Math.floor(Math.random()*DRILLS.length)];
    setSpotlight(pick.id);
    setTimeout(()=>{ const el=document.getElementById("drill-"+pick.id); if(el) el.scrollIntoView({behavior:"smooth",block:"center"}); },40);
  };

  const saveAssessment = () => {
    patch(n => { n.history.push({ date: todayISO(), total: rubricTotal }); });
  };
  const addLog = (platform, title, score) => {
    if (!title.trim()) return;
    patch(n => { n.log.unshift({ id: Date.now()+"", date: todayISO(), platform, title: title.trim(), score: score? Number(score): null }); });
  };
  const delLog = (id) => patch(n => { n.log = n.log.filter(l=>l.id!==id); });

  const TABS = [
    ["compass", "¶", "Compass"],
    ["arc", "§", "The Arc"],
    ["cadence", "⁋", "Cadence"],
    ["drills", "‡", "Drills"],
    ["desk", "✎", "The Desk"],
  ];

  return (
    <div className="vv"><style>{CSS}</style>
      <div className="wrap">

        {/* header */}
        <header className="top">
          <p className="kicker">A writing-craft system · Banerjee Speaks</p>
          <div className="brandrow">
            <span className="pilcrow">¶</span>
            <h1 className="disp">The Voice Workshop</h1>
          </div>
          <p className="lede">Voice isn't a style you put on. It's the residue of choices you make, consistently, in public. This is the desk where you make them.</p>
          <div className="goalstrip">
            <span className="goalchip">GOAL · <b>a distinctive voice</b></span>
            <span className="goalchip">CADENCE · <b>2–3× / week</b></span>
            <span className="goalchip">FORUMS · <b>LinkedIn · Medium · Newsletter</b></span>
            <span className="goalchip">ARC · <b>12 weeks</b></span>
          </div>

          <nav className="tabs" role="tablist" aria-label="Workshop sections">
            {TABS.map(([id,mk,label]) => (
              <button key={id} role="tab" aria-selected={tab===id}
                className="tab" onClick={()=>setTab(id)}>
                <span className="mk" aria-hidden="true">{mk}</span>{label}
              </button>
            ))}
          </nav>
        </header>

        {/* COMPASS */}
        {tab==="compass" && (
          <section className="panel" role="tabpanel">
            <h2 className="section-h">Voice Compass</h2>
            <p className="section-sub">Name what's already distinct in how you write, and what you'll hunt and delete. Everything here is <em>yours to edit</em> and it saves as you type.</p>

            <div className="card">
              <div className="lbl">Fingerprint test — do this first</div>
              <p>Read three of your published pieces aloud. Highlight every sentence <b>only you</b> could have written. That set — the reference, the rhythm, the angle — is your voice. The whole plan is just: do more of that, on purpose.</p>
            </div>

            <div className="card">
              <label className="fieldlbl" htmlFor="sig">Signature moves — the things you already do that others don't</label>
              <textarea id="sig" rows={4} value={state.charter.signatures}
                placeholder="e.g. practitioner-first proof from real systems · a contrarian hinge in the first 2 lines · analogies from cricket & architecture · numbers with a story attached…"
                onChange={e=>patch(n=>{n.charter.signatures=e.target.value;})}/>
              <p className="hint">Aim for 3–5. Pulled from the fingerprint test, not invented.</p>
            </div>

            <div className="card">
              <label className="fieldlbl" htmlFor="anti">Kill-list — the generic tics you'll hunt every draft</label>
              <textarea id="anti" rows={6} value={state.charter.antipatterns}
                onChange={e=>patch(n=>{n.charter.antipatterns=e.target.value;})}/>
              <p className="hint">Pre-seeded. Add your own crutch phrases as you catch them.</p>
            </div>

            <div className="card">
              <label className="fieldlbl" htmlFor="pov">Point of view — one sentence</label>
              <textarea id="pov" rows={2} value={state.charter.pov}
                placeholder="I write as a ___ for ___, and the thing I keep arguing is ___."
                onChange={e=>patch(n=>{n.charter.pov=e.target.value;})}/>
              <p className="hint">A voice without a recurring argument is just a tone. This line is your spine.</p>
            </div>
          </section>
        )}

        {/* ARC */}
        {tab==="arc" && (
          <section className="panel" role="tabpanel">
            <h2 className="section-h">The Arc</h2>
            <p className="section-sub">Twelve weeks, four movements. You don't study your way to a voice — you <em>rep</em> your way there, then systematize what worked.</p>

            <div className="prog-row">
              <span className="mono">Overall progress · {doneTasks}/{totalTasks} tasks</span>
              <span className="mono pct">{arcPct}%</span>
            </div>
            <div className="prog-outer" style={{marginBottom:22}}><div className="prog-inner" style={{width:arcPct+"%"}}/></div>

            {PHASES.map((p,pi) => {
              const done = p.tasks.filter((_,ti)=>state.checks[`${pi}-${ti}`]).length;
              return (
                <div className="card" key={pi}>
                  <div className="phase-meta">
                    <span className="phase-num">{p.num}</span>
                    <span className="phase-name">{p.name}</span>
                    <span className="phase-weeks">· {p.weeks} · {done}/{p.tasks.length}</span>
                  </div>
                  <p className="phase-tag">{p.tag}</p>
                  {p.tasks.map((t,ti) => {
                    const on = !!state.checks[`${pi}-${ti}`];
                    return (
                      <div key={ti} className={"task"+(on?" done":"")}
                        onClick={()=>patch(n=>{n.checks[`${pi}-${ti}`]=!on;})}
                        role="checkbox" aria-checked={on} tabIndex={0}
                        onKeyDown={e=>{ if(e.key===" "||e.key==="Enter"){ e.preventDefault(); patch(n=>{n.checks[`${pi}-${ti}`]=!on;}); }}}>
                        <span className="box">{on?"✓":""}</span>
                        <span className="tasktxt">{t}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </section>
        )}

        {/* CADENCE */}
        {tab==="cadence" && (
          <section className="panel" role="tabpanel">
            <h2 className="section-h">The Cadence Engine</h2>
            <p className="section-sub">How to hold 2–3 pieces a week without burning out: <em>one anchor, two extracts</em>, on fixed days.</p>

            <p className="marginalia">One idea a week does most of the work. Everything else is angles on it.</p>

            <div className="icard">
              <h4>The weekly shape</h4>
              <p><b>1 anchor</b> — a Medium longform <i>or</i> the Newsletter issue: the deep argument. <b>1–2 satellites</b> — LinkedIn posts, one carved out of the anchor, one standalone reaction.</p>
            </div>

            <div className="rhythm">
              <div className="day"><div className="d">Mon</div><div className="act">Capture + outline the anchor</div></div>
              <div className="day"><div className="d">Tue</div><div className="act"><span className="ship">Ship</span> LinkedIn #1</div></div>
              <div className="day"><div className="d">Wed</div><div className="act">Draft the anchor</div></div>
              <div className="day"><div className="d">Thu</div><div className="act"><span className="ship">Ship</span> anchor · Medium / Newsletter</div></div>
              <div className="day"><div className="d">Fri</div><div className="act"><span className="ship">Ship</span> LinkedIn #2 · derived</div></div>
            </div>
            <p className="hint" style={{color:"var(--muted)",marginBottom:22}}>A rhythm, not a law. Move the days — keep the shape.</p>

            <h3 className="section-h" style={{fontSize:19}}>One idea → three native shapes</h3>
            <p className="section-sub">Repurposing isn't copy-paste. Each platform gets the idea in its own body.</p>

            <div className="icard">
              <span className="plat">LinkedIn</span>
              <p>One sharp claim, one proof, one line that makes them stop. <b>120–200 words.</b> The first line is the whole game — no throat-clearing. Your depth is the edge over broetry.</p>
            </div>
            <div className="icard">
              <span className="plat">Medium</span>
              <p>The full argument. Thesis up front, three movements, concrete cases from your real work, a close that reframes. <b>800–1500 words.</b> This is where nuance is your moat.</p>
            </div>
            <div className="icard">
              <span className="plat">Newsletter</span>
              <p>Intimate and useful. Direct address, a recurring segment, and something they can't get on the feed — a teardown, a template, a behind-the-build. <b>Earn the inbox.</b></p>
            </div>

            <h3 className="section-h" style={{fontSize:19,marginTop:20}}>Voice calibration — same you, three registers</h3>
            <div className="icard"><p><b>LinkedIn:</b> compression + confidence. Cut the ramp-up; the edge shows in line one.</p></div>
            <div className="icard"><p><b>Medium:</b> room to be nuanced and to argue at length. Let the reasoning breathe.</p></div>
            <div className="icard"><p><b>Newsletter:</b> warmth + candor. You're a guest in their inbox — be specific, be human.</p></div>
          </section>
        )}

        {/* DRILLS */}
        {tab==="drills" && (
          <section className="panel" role="tabpanel">
            <h2 className="section-h">Voice Drills</h2>
            <p className="section-sub">Ten craft moves that build a distinctive voice. In the Amplify phase, <em>run one per piece</em>. Mark reps to see where you're actually practising.</p>

            <div className="drill-head">
              <button className="btn" onClick={drawDrill}>⤳ Draw a drill</button>
              <span className="mono" style={{fontSize:11,color:"var(--muted)"}}>Total reps logged · <b style={{color:"var(--brass-soft)"}}>{totalReps}</b></span>
            </div>

            <div className="drill-grid">
              {DRILLS.map(d => (
                <div id={"drill-"+d.id} key={d.id} className={"drill"+(spotlight===d.id?" spot":"")}>
                  <div className="dn">{d.n}</div>
                  <div className="dmove">{d.m}</div>
                  <div className="dwhy">{d.w}</div>
                  <div className="drow">
                    <span className="reps">{state.drills[d.id]||0} reps</span>
                    <button className="repbtn" onClick={()=>patch(n=>{n.drills[d.id]=(n.drills[d.id]||0)+1;})}>+ log a rep</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DESK */}
        {tab==="desk" && (
          <section className="panel" role="tabpanel">
            <h2 className="section-h">The Desk</h2>
            <p className="section-sub">Where reps become measurable. Score a piece against the voice rubric, then log what you shipped and watch the streak build.</p>

            <div className="stats">
              <div className="stat"><div className={"n"+(twc>=2?" hit":"")}>{twc}</div><div className="k">shipped this week</div></div>
              <div className="stat"><div className="n">{state.log.length}</div><div className="k">total published</div></div>
              <div className="stat"><div className={"n"+(streak>0?" hit":"")}>{streak}</div><div className="k">week cadence streak</div></div>
            </div>

            {/* rubric */}
            <div className="card" style={{background:"var(--ink2)",color:"var(--paper)"}}>
              <div className="lbl" style={{color:"var(--red-soft)"}}>Voice rubric · score a piece 1–5</div>
              <div style={{display:"flex",alignItems:"baseline",gap:12,margin:"6px 0 16px"}}>
                <span className="score-big">{rubricTotal}<small> / 40</small></span>
                <span className="mono" style={{fontSize:12,color:"var(--muted)"}}>
                  {rubricTotal>=32?"unmistakably yours":rubricTotal>=24?"getting distinct":rubricTotal>=16?"still generic in places":"warming up"}
                </span>
              </div>
              {RUBRIC.map((r,i) => (
                <div className="rub" key={i}>
                  <div className="rlbl">
                    <span className="rname">{r[0]} <span>· {r[1]}</span></span>
                    <span className="rval">{state.rubric[i]}</span>
                  </div>
                  <input type="range" min="1" max="5" value={state.rubric[i]}
                    aria-label={r[0]}
                    onChange={e=>patch(n=>{ n.rubric[i]=Number(e.target.value); })}/>
                </div>
              ))}
              <button className="btn" style={{marginTop:6}} onClick={saveAssessment}>Save this assessment</button>
            </div>

            {/* trend */}
            {state.history.length>0 && (
              <div className="card" style={{background:"var(--ink2)",color:"var(--paper)"}}>
                <div className="lbl" style={{color:"var(--red-soft)"}}>Voice trend · last {Math.min(state.history.length,12)} assessments</div>
                <Spark data={state.history.slice(-12).map(h=>h.total)} />
              </div>
            )}

            {/* log */}
            <div className="card" style={{background:"var(--ink2)",color:"var(--paper)"}}>
              <div className="lbl" style={{color:"var(--red-soft)"}}>Publishing log</div>
              <LogForm onAdd={addLog} />
              {state.log.length===0
                ? <p className="empty">Nothing logged yet. Ship something and record it here — the streak starts at 2 pieces in a week.</p>
                : state.log.slice(0,12).map(l => (
                  <div className="logitem" key={l.id}>
                    <div>
                      <div className="lt">{l.title}</div>
                      <div className="lm"><b>{l.platform}</b> · {l.date}{l.score?` · voice ${l.score}/40`:""}</div>
                    </div>
                    <button className="del" onClick={()=>delLog(l.id)} aria-label="Delete entry">remove</button>
                  </div>
                ))}
            </div>
          </section>
        )}

        <footer className="foot">
          <span className="mono">¶ Progress saves automatically {saved && <span className="savenote">· saved</span>}</span>
          <button className="btn ghost" onClick={resetAll}>Reset workshop</button>
        </footer>
      </div>
    </div>
  );
}

/* ---------- sub-components ---------- */

function LogForm({ onAdd }){
  const [platform, setPlatform] = useState("LinkedIn");
  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  return (
    <div>
      <div className="logform">
        <input type="text" placeholder="Title of the piece" value={title} onChange={e=>setTitle(e.target.value)} aria-label="Title"/>
        <select value={platform} onChange={e=>setPlatform(e.target.value)} aria-label="Platform">
          {PLATFORMS.map(p=><option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="logform">
        <input type="text" inputMode="numeric" placeholder="Voice score /40 (optional)" value={score}
          onChange={e=>setScore(e.target.value.replace(/[^0-9]/g,"").slice(0,2))} aria-label="Voice score"/>
        <button className="btn dark" onClick={()=>{ onAdd(platform,title,score); setTitle(""); setScore(""); }}>+ Log published piece</button>
      </div>
    </div>
  );
}

function Spark({ data }){
  if(!data.length) return null;
  const w=280, h=64, pad=6;
  const max=40, min=8;
  const step = data.length>1 ? (w-pad*2)/(data.length-1) : 0;
  const pts = data.map((v,i)=>{
    const x = pad + i*step;
    const y = h-pad - ((v-min)/(max-min))*(h-pad*2);
    return [x, Math.max(pad, Math.min(h-pad,y))];
  });
  const path = pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  return (
    <svg className="spark" width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Voice score trend">
      <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="#333846" strokeWidth="1"/>
      <path d={path} fill="none" stroke="#CBA85E" strokeWidth="2"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#C0362C"/>)}
    </svg>
  );
}
