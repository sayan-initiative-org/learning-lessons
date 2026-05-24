import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight, Zap, AlertTriangle, CheckCircle2, XCircle, Sparkles,
  Database, Brain, Search, Filter, Layers, GitBranch, Clock, DollarSign,
  ChevronDown, ChevronRight, Play, Pause, RotateCcw, Target, Workflow,
  AlertCircle, TrendingUp, Shield, Cpu, FileCode, BookOpen, Gauge
} from 'lucide-react';

export default function HyDEInteractive() {
  const [activeTab, setActiveTab] = useState('mechanism');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [answers, setAnswers] = useState({});
  const [demoQuery, setDemoQuery] = useState('login broken after deploy');

  // Auto-advance demo
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setStep(s => (s + 1) % 5);
    }, 1800);
    return () => clearTimeout(t);
  }, [playing, step]);

  const toggleCard = (id) => setExpandedCards(p => ({ ...p, [id]: !p[id] }));

  const tabs = [
    { id: 'mechanism', label: 'How It Works', icon: Brain },
    { id: 'decision', label: 'When To Use', icon: Target },
    { id: 'sdlc', label: 'SDLC Copilot Fit', icon: Workflow },
    { id: 'stack', label: 'Recommended Stack', icon: Layers },
    { id: 'roadmap', label: 'Rollout', icon: GitBranch },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
        }
        .pulse-amber { animation: pulse-glow 2s infinite; }
        @keyframes flow-dash {
          to { stroke-dashoffset: -20; }
        }
        .flow-line { animation: flow-dash 1.5s linear infinite; }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Grain overlay */}
      <div className="fixed inset-0 grain pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <header className="mb-10 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500/80 mb-3">
            <Sparkles size={12} /> Retrieval Architecture · Decision Playbook
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-tight leading-none mb-4">
            <span className="text-zinc-100">HyDE</span>
            <span className="text-zinc-500 italic font-normal"> —</span>
            <span className="text-amber-500 italic"> when hallucinations</span>
            <span className="text-zinc-100"> help retrieval</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">
            An interactive guide to Hypothetical Document Embeddings, tailored for SDLC Copilot's
            multi-agent retrieval stack. Decide what to deploy, what to skip, and what to layer on top.
          </p>
        </header>

        {/* Tab nav */}
        <nav className="flex flex-wrap gap-1 mb-8 border-b border-zinc-800">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  active
                    ? 'text-amber-500 border-amber-500'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* ============================================================ */}
        {/* TAB 1: HOW IT WORKS                                          */}
        {/* ============================================================ */}
        {activeTab === 'mechanism' && (
          <section className="space-y-10">

            {/* Comparison flow */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard RAG */}
              <div className="border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Standard RAG</h3>
                  <span className="text-xs text-zinc-600">Direct embedding</span>
                </div>
                <div className="space-y-3">
                  <FlowNode label="User query" sub='"login broken after deploy"' tone="neutral" />
                  <FlowArrow />
                  <FlowNode label="Embed query directly" sub="text-embedding-3-large" tone="neutral" />
                  <FlowArrow />
                  <FlowNode label="ANN search" sub="cosine over corpus" tone="neutral" />
                  <FlowArrow />
                  <FlowNode label="Top-K chunks" sub="possibly off-target" tone="warn" />
                </div>
                <div className="mt-6 p-3 bg-zinc-950 border-l-2 border-zinc-700 text-xs text-zinc-400 leading-relaxed">
                  Query embedding lives in <span className="text-zinc-200">interrogative-short-text</span> space.
                  Document embeddings live in <span className="text-zinc-200">expository-prose</span> space.
                  The asymmetry is the problem.
                </div>
              </div>

              {/* HyDE flow */}
              <div className="border border-amber-500/30 bg-amber-500/[0.03] p-6 relative">
                <div className="absolute -top-px -right-px bg-amber-500 text-zinc-950 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5">
                  HyDE
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-amber-500">HyDE RAG</h3>
                  <span className="text-xs text-amber-500/70">Hallucinate → embed → search</span>
                </div>
                <div className="space-y-3">
                  <FlowNode label="User query" sub='"login broken after deploy"' tone="neutral" />
                  <FlowArrow accent />
                  <FlowNode
                    label="LLM hallucinates an answer"
                    sub='"Auth tokens may invalidate post-deploy when JWT signing keys rotate. Check Redis session cache for orphaned entries..."'
                    tone="accent"
                  />
                  <FlowArrow accent />
                  <FlowNode label="Embed hypothetical doc" sub="same encoder" tone="accent" />
                  <FlowArrow accent />
                  <FlowNode label="ANN search" sub="now in doc-space" tone="accent" />
                  <FlowArrow accent />
                  <FlowNode label="Top-K chunks" sub="closer to real answers" tone="good" />
                </div>
                <div className="mt-6 p-3 bg-amber-500/5 border-l-2 border-amber-500 text-xs text-zinc-300 leading-relaxed">
                  The hypothetical doc is <span className="text-amber-400 italic">structurally</span> closer
                  to real corpus content than the query was — even if its facts are wrong.
                  Retrieval only cares about <span className="text-amber-400">semantic neighborhood</span>.
                </div>
              </div>
            </div>

            {/* Why it works */}
            <div className="border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="font-display text-2xl font-medium mb-2">Why it works — the embedding-space gap</h3>
              <p className="text-zinc-400 text-sm mb-6 max-w-3xl">
                Embedding models trained on (query, document) contrastive pairs learn an asymmetric space.
                Queries cluster in one region, documents in another. HyDE moves your search vector across
                the gap.
              </p>

              <div className="relative h-64 bg-zinc-950 border border-zinc-800 overflow-hidden">
                {/* Cluster visualization */}
                <div className="absolute inset-0 flex items-center justify-around p-8">
                  {/* Query cluster */}
                  <div className="relative">
                    <div className="text-xs font-mono text-zinc-500 mb-2 text-center">QUERY SPACE</div>
                    <div className="relative w-32 h-32 rounded-full border border-cyan-500/20 bg-cyan-500/[0.04]">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-cyan-400"
                          style={{
                            top: `${20 + Math.sin(i) * 30}%`,
                            left: `${30 + Math.cos(i) * 30}%`,
                          }}
                        />
                      ))}
                      <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30 pulse-amber" />
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400/60 text-center mt-2">user query</div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center">
                    <svg width="120" height="40" viewBox="0 0 120 40" className="overflow-visible">
                      <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
                        </marker>
                      </defs>
                      <path
                        d="M 10 20 Q 60 5, 110 20"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        markerEnd="url(#arrow)"
                        className="flow-line"
                      />
                    </svg>
                    <div className="text-[10px] font-mono text-amber-500 mt-1">HyDE bridge</div>
                  </div>

                  {/* Document cluster */}
                  <div className="relative">
                    <div className="text-xs font-mono text-zinc-500 mb-2 text-center">DOCUMENT SPACE</div>
                    <div className="relative w-32 h-32 rounded-full border border-zinc-700 bg-zinc-800/30">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-zinc-400"
                          style={{
                            top: `${15 + Math.sin(i * 1.3) * 35}%`,
                            left: `${25 + Math.cos(i * 1.3) * 35}%`,
                          }}
                        />
                      ))}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-500/30 pulse-amber" />
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 text-center mt-2">target chunk</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive demo */}
            <div className="border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl font-medium">Try it — step through a real query</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setStep(0); setPlaying(false); }}
                    className="p-2 text-zinc-500 hover:text-zinc-200 border border-zinc-800"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono uppercase tracking-wider"
                  >
                    {playing ? <Pause size={12} /> : <Play size={12} />}
                    {playing ? 'Pause' : 'Auto-play'}
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm font-mono text-zinc-100 mb-6 focus:border-amber-500 outline-none"
                placeholder="Type a query..."
              />

              <div className="flex items-center gap-1 mb-6">
                {[0, 1, 2, 3, 4].map(i => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1 flex-1 transition-all ${step >= i ? 'bg-amber-500' : 'bg-zinc-800'}`}
                  />
                ))}
              </div>

              <DemoStep step={step} query={demoQuery} />
            </div>

          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 2: DECISION                                              */}
        {/* ============================================================ */}
        {activeTab === 'decision' && (
          <section className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2">Answer 5 questions, get a decision</h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                This engine encodes the production lessons from Gao et al. (2022), the
                Adaptive-HyDE paper (2025), and the knowledge-leakage critique (2025).
                No fluff — your answers drive a specific recommendation.
              </p>
            </div>

            <DecisionEngine answers={answers} setAnswers={setAnswers} />
          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SDLC COPILOT FIT                                      */}
        {/* ============================================================ */}
        {activeTab === 'sdlc' && (
          <section className="space-y-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-500/80 mb-2">
                Stack analysis · your system
              </div>
              <h2 className="font-display text-3xl font-medium mb-3">
                Does HyDE fit SDLC Copilot?
              </h2>
              <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
                SDLC Copilot generates User Stories, Epics, Test Cases, and Gherkin/BDD scripts
                from product documents. Queries flow from agents — not end-users — through
                a LangGraph orchestrator. Hybrid BM25 + dense + RRF + cross-encoder already exists.
                That changes everything about whether HyDE earns its keep.
              </p>
            </div>

            <SDLCAnalysis />
          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 4: STACK                                                 */}
        {/* ============================================================ */}
        {activeTab === 'stack' && (
          <section className="space-y-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-500/80 mb-2">
                Production retrieval blueprint
              </div>
              <h2 className="font-display text-3xl font-medium mb-3">
                What to deploy, ranked by ROI
              </h2>
              <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
                For your specific stack — Azure OpenAI, LangGraph, hybrid retrieval already
                in place — here is the prioritized sequence of additions. Start at the top.
              </p>
            </div>

            <StackRecommendations expandedCards={expandedCards} toggleCard={toggleCard} />
          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 5: ROADMAP                                               */}
        {/* ============================================================ */}
        {activeTab === 'roadmap' && (
          <section className="space-y-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-500/80 mb-2">
                12-week rollout
              </div>
              <h2 className="font-display text-3xl font-medium mb-3">
                Production-grade deployment sequence
              </h2>
              <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
                Concrete weekly milestones with eval gates. Each phase must hit its metric
                before promotion. No "ship and hope."
              </p>
            </div>

            <Roadmap />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 text-xs text-zinc-600 font-mono">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>SDLC Copilot · retrieval architecture playbook · v1.0</div>
            <div>arxiv refs: 2212.10496 · 2303.07678 · 2410.20050 · 2507.16754 · 2504.14175</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ============================================================ */
/* COMPONENTS                                                   */
/* ============================================================ */

function FlowNode({ label, sub, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-zinc-700 bg-zinc-900/50',
    accent: 'border-amber-500/40 bg-amber-500/[0.05]',
    warn: 'border-orange-500/30 bg-orange-500/[0.04]',
    good: 'border-emerald-500/30 bg-emerald-500/[0.04]',
  };
  return (
    <div className={`border ${tones[tone]} px-4 py-3`}>
      <div className="text-sm font-medium text-zinc-200">{label}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1 italic font-mono leading-relaxed">{sub}</div>}
    </div>
  );
}

function FlowArrow({ accent }) {
  return (
    <div className="flex justify-center">
      <ChevronDown size={14} className={accent ? 'text-amber-500/60' : 'text-zinc-600'} />
    </div>
  );
}

function DemoStep({ step, query }) {
  const hypotheticalDoc = useMemo(() => {
    // Simple "fake" HyDE generation for demo
    const q = query.toLowerCase();
    if (q.includes('login') || q.includes('auth')) {
      return "Authentication failures following deployments typically stem from JWT signing key rotation, expired session caches in Redis, or invalidated OAuth tokens. Check the auth-service logs for 401 responses and verify the SIGNING_SECRET environment variable matches across instances. Common fix: redeploy session-cache or invalidate stored tokens.";
    }
    if (q.includes('test') || q.includes('gherkin')) {
      return "Gherkin scenarios use Given-When-Then syntax to express acceptance criteria. A well-formed scenario starts with the system context, describes the user action, and asserts the observable outcome. Best practices: one behavior per scenario, declarative not imperative steps, parameterize with Examples tables for data-driven cases.";
    }
    return `A technical documentation excerpt addressing "${query}": this section describes the relevant subsystem behavior, the symptoms users observe, the diagnostic steps to take, and the standard remediation procedure with code snippets and configuration examples.`;
  }, [query]);

  const steps = [
    {
      title: 'Step 0 — Raw query received',
      desc: 'Short, often vague. Sparse semantic content.',
      content: (
        <div className="font-mono text-sm text-zinc-300 bg-zinc-950 border border-zinc-800 p-4">
          <span className="text-zinc-600">{`> `}</span>{query}
        </div>
      ),
    },
    {
      title: 'Step 1 — LLM generates hypothetical answer',
      desc: 'Azure OpenAI gpt-4o-mini · temp=0.7 · ~300ms',
      content: (
        <div className="font-mono text-xs text-amber-200/90 bg-amber-500/[0.04] border border-amber-500/20 p-4 leading-relaxed">
          <div className="text-amber-500/60 text-[10px] uppercase tracking-widest mb-2">Hypothetical document (may contain hallucinated facts)</div>
          {hypotheticalDoc}
        </div>
      ),
    },
    {
      title: 'Step 2 — Embed the hypothetical doc',
      desc: 'Same encoder as your corpus (text-embedding-3-large, 3072d)',
      content: (
        <div className="font-mono text-xs text-zinc-500 bg-zinc-950 border border-zinc-800 p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3"
                style={{
                  background: `rgb(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 80 + 100)}, ${Math.floor(Math.random() * 60 + 30)})`,
                }}
              />
            ))}
          </div>
          [0.0234, -0.1892, 0.4471, ..., 0.0913]  <span className="text-amber-500/60">(3072 dimensions)</span>
        </div>
      ),
    },
    {
      title: 'Step 3 — Hybrid retrieval with the new vector',
      desc: 'Your existing BM25 + dense + RRF stack, just with a better vector',
      content: (
        <div className="space-y-2">
          {[
            { score: 0.91, text: 'auth-service.md · §3.4 Token Rotation During Deployments' },
            { score: 0.87, text: 'runbook-redis-cache.md · Invalidating Session Entries' },
            { score: 0.82, text: 'jira-ticket-AUTH-3142 · Post-deploy 401 errors fixed by...' },
            { score: 0.74, text: 'oncall-playbook.md · §7 Auth Incidents' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-2">
              <span className="font-mono text-xs text-emerald-400">{r.score.toFixed(2)}</span>
              <span className="text-xs text-zinc-300 truncate">{r.text}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Step 4 — Generate answer with ORIGINAL query',
      desc: '⚠️ The hypothetical doc was used only for retrieval. The answer LLM never sees it.',
      content: (
        <div className="space-y-3">
          <div className="font-mono text-xs text-zinc-500 bg-zinc-950 border border-zinc-800 p-3">
            <span className="text-cyan-400">prompt:</span> Answer using only the retrieved context.<br/>
            <span className="text-cyan-400">query:</span> {query}<br/>
            <span className="text-cyan-400">context:</span> [top-4 chunks above]
          </div>
          <div className="text-xs text-emerald-300 bg-emerald-500/[0.04] border border-emerald-500/20 p-3">
            ✓ Final answer is grounded in real retrieved chunks, not the hallucinated hypothetical.
          </div>
        </div>
      ),
    },
  ];

  const s = steps[step];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">{s.title}</div>
        <div className="text-sm text-zinc-400">{s.desc}</div>
      </div>
      <div>{s.content}</div>
    </div>
  );
}

/* ===================== DECISION ENGINE ===================== */

function DecisionEngine({ answers, setAnswers }) {
  const questions = [
    {
      id: 'encoder',
      q: 'Are you using a modern asymmetric embedding model trained for query/doc matching?',
      sub: 'e.g., text-embedding-3-large, BGE-M3, e5-mistral, Voyage-3, Cohere Embed v3',
      options: [
        { v: 'yes', label: 'Yes, fine-tuned asymmetric', impact: -2 },
        { v: 'partial', label: 'Yes but general-purpose', impact: 0 },
        { v: 'no', label: 'Older/unsupervised model', impact: +2 },
      ],
    },
    {
      id: 'queries',
      q: 'What do your queries look like most of the time?',
      options: [
        { v: 'short', label: 'Short, vague, conversational', impact: +2 },
        { v: 'mixed', label: 'Mix of short and structured', impact: +1 },
        { v: 'structured', label: 'Long, structured, agent-generated', impact: -1 },
        { v: 'ids', label: 'Mostly identifiers/codes/IDs', impact: -3 },
      ],
    },
    {
      id: 'latency',
      q: 'What is your end-to-end latency budget (P95)?',
      options: [
        { v: 'tight', label: '< 500ms (real-time UX)', impact: -3 },
        { v: 'normal', label: '500ms – 2s (chat-style)', impact: 0 },
        { v: 'loose', label: '> 2s (batch / background agent)', impact: +2 },
      ],
    },
    {
      id: 'domain',
      q: 'How specialized / proprietary is your corpus?',
      options: [
        { v: 'public', label: 'General/public knowledge', impact: -1 },
        { v: 'specialized', label: 'Specialized vocabulary, but LLM has seen the domain', impact: +1 },
        { v: 'private', label: 'Proprietary internal docs (LLM has never seen)', impact: +2 },
      ],
    },
    {
      id: 'risk',
      q: 'How sensitive is your domain to retrieval-grounded hallucination?',
      sub: '(hallucinated hypothetical → fetches confirming-but-wrong docs)',
      options: [
        { v: 'low', label: 'Low (developer tools, internal Q&A)', impact: +1 },
        { v: 'medium', label: 'Medium (customer support, knowledge bases)', impact: 0 },
        { v: 'high', label: 'High (legal, medical, financial compliance)', impact: -3 },
      ],
    },
  ];

  const total = Object.values(answers).reduce((s, a) => s + (a?.impact ?? 0), 0);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  let verdict = null;
  if (allAnswered) {
    if (total >= 4) verdict = { tone: 'good', title: 'Deploy adaptive HyDE', body: 'Your conditions strongly favor HyDE. Use confidence-gated routing — fire HyDE only on low-confidence retrievals to control cost.' };
    else if (total >= 1) verdict = { tone: 'warn', title: 'Worth A/B testing', body: 'Marginal signal. Build a 200-query golden set and run HyDE vs your current pipeline. Stratify by query type — gains likely concentrated in the long tail.' };
    else if (total >= -2) verdict = { tone: 'warn', title: 'Probably not worth it', body: 'Your stack already does most of what HyDE provides. Better ROI from cross-encoder upgrades, query decomposition, or multi-index routing.' };
    else verdict = { tone: 'bad', title: 'Skip HyDE entirely', body: 'Your conditions actively disfavor HyDE — latency cost or hallucination risk outweighs any retrieval lift. Invest in other parts of the pipeline.' };
  }

  return (
    <div className="space-y-6">
      {questions.map(q => (
        <div key={q.id} className="border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm font-medium text-zinc-200 mb-1">{q.q}</div>
          {q.sub && <div className="text-xs text-zinc-500 mb-3 italic">{q.sub}</div>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
            {q.options.map(o => {
              const selected = answers[q.id]?.v === o.v;
              return (
                <button
                  key={o.v}
                  onClick={() => setAnswers(p => ({ ...p, [q.id]: o }))}
                  className={`text-left text-xs px-3 py-2 border transition-all ${
                    selected
                      ? 'border-amber-500 bg-amber-500/10 text-amber-100'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {verdict && (
        <div className={`border-2 p-6 ${
          verdict.tone === 'good' ? 'border-emerald-500/50 bg-emerald-500/[0.04]' :
          verdict.tone === 'warn' ? 'border-amber-500/50 bg-amber-500/[0.04]' :
          'border-red-500/50 bg-red-500/[0.04]'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`mt-1 ${
              verdict.tone === 'good' ? 'text-emerald-400' :
              verdict.tone === 'warn' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {verdict.tone === 'good' ? <CheckCircle2 size={28} /> :
               verdict.tone === 'warn' ? <AlertTriangle size={28} /> : <XCircle size={28} />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">
                Recommendation · score {total > 0 ? '+' : ''}{total}
              </div>
              <h3 className="font-display text-2xl font-medium mb-2">{verdict.title}</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{verdict.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== SDLC ANALYSIS ===================== */

function SDLCAnalysis() {
  const agents = [
    {
      name: 'Intent Identification Agent',
      hyde: 'partial',
      verdict: 'Use as gating signal, not consumer',
      detail: 'Confidence score from intent classifier should decide whether HyDE fires downstream. Don\'t generate hypotheticals here — generate them after this agent classifies the intent.',
    },
    {
      name: 'Retrieval Agent',
      hyde: 'yes',
      verdict: 'Primary HyDE host',
      detail: 'This is where adaptive HyDE belongs. Already does BM25 + dense + RRF — add a confidence gate and fire HyDE only when top-k cosine scores < threshold OR score gap is narrow.',
    },
    {
      name: 'User Story Agent',
      hyde: 'no',
      verdict: 'Use Query Decomposition instead',
      detail: 'User Story generation is structured — INVEST criteria, persona, acceptance criteria. Decompose into sub-queries (persona context, similar past stories, acceptance patterns), not hallucinate one big hypothetical.',
    },
    {
      name: 'Epic Agent',
      hyde: 'partial',
      verdict: 'Step-Back prompting > HyDE',
      detail: 'Epic-level queries are abstract by nature. Step-Back prompting (generate a more abstract reformulation) outperforms HyDE for high-level conceptual retrieval. Cheaper too.',
    },
    {
      name: 'Test Case Agent',
      hyde: 'yes',
      verdict: 'HyDE shines here',
      detail: 'Test case retrieval from natural-language requirements has a major query/doc asymmetry — short requirement vs verbose test case. Classic HyDE win condition.',
    },
    {
      name: 'Gherkin/BDD Agent',
      hyde: 'yes',
      verdict: 'HyDE with strict prompt',
      detail: 'Force the HyDE prompt to generate Given-When-Then format. Hypothetical Gherkin embeds much closer to real Gherkin in your corpus than a plain-English query does.',
    },
    {
      name: 'Knowledge Base Agent',
      hyde: 'partial',
      verdict: 'HyQE (inverted) preferred',
      detail: 'For static historical Jira tickets/Confluence pages, generate hypothetical queries per document at indexing time (HyQE). Pay LLM cost once instead of every query.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500" />Strong fit</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500" />Conditional</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500" />Skip / use alternative</div>
      </div>

      {agents.map((a, i) => {
        const color = a.hyde === 'yes' ? 'emerald' : a.hyde === 'partial' ? 'amber' : 'red';
        return (
          <div key={i} className={`border-l-2 border-${color}-500 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition-colors`}
               style={{ borderLeftColor: color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#ef4444' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1">SDLC Copilot subagent</div>
                <h4 className="font-display text-xl font-medium">{a.name}</h4>
              </div>
              <div className={`text-xs font-mono uppercase tracking-wider px-3 py-1 ${
                color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}>
                {a.verdict}
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{a.detail}</p>
          </div>
        );
      })}

      {/* Key insight */}
      <div className="border border-amber-500/40 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-6 mt-8">
        <div className="flex items-start gap-4">
          <Sparkles size={20} className="text-amber-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-display text-xl font-medium mb-2">The SDLC Copilot insight</h4>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              HyDE is not one decision. It's an agent-level decision. Your hierarchical orchestrator
              + sub-agent architecture is the ideal place to make HyDE selective rather than global —
              fire it where queries are vague (Test Case, Gherkin, Retrieval), skip it where they're
              structured (User Story decomposition, Intent classification).
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The five-layer LLM-as-Judge evaluation framework you've already built is exactly what
              you need to gate the rollout. Run HyDE through it agent-by-agent. Keep what improves
              the 12-dimension scores. Discard the rest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== STACK RECOMMENDATIONS ===================== */

function StackRecommendations({ expandedCards, toggleCard }) {
  const items = [
    {
      id: 'cross-encoder',
      priority: 1,
      title: 'Cross-Encoder Re-ranking (verify you have it)',
      effort: 'Low',
      impact: 'High',
      cost: '~$50/M queries',
      latency: '+100ms',
      summary: 'Single biggest retrieval lever. If not deployed, do this before anything else.',
      detail: `Cross-encoders (BGE-reranker-v2-m3, Cohere Rerank v3, Voyage Rerank-2) score every (query, chunk) pair jointly. Adds ~100ms but moves Recall@5 by 5-15 points in most enterprise setups. Use Azure-hosted or self-host on a T4/A10. This is table stakes — HyDE on top of a poor re-ranker is wasted effort.`,
      arxiv: null,
    },
    {
      id: 'adaptive-hyde',
      priority: 2,
      title: 'Adaptive HyDE (confidence-gated)',
      effort: 'Medium',
      impact: 'Medium-High on long-tail queries',
      cost: '+$30-100/M queries (gpt-4o-mini)',
      latency: '+400ms when fired',
      summary: 'Fire HyDE only when initial retrieval is uncertain. Skips it on ~70% of traffic.',
      detail: `Gate logic: if top_score < 0.78 OR (top_score - top10_score) < 0.15, invoke HyDE; else use direct retrieval. Use gpt-4o-mini or Claude Haiku for hypothetical generation — flagship models add too much latency. Cache hypothetical docs by query hash. Multi-sample N=3 at temp 0.7, average embeddings.`,
      arxiv: 'arXiv:2507.16754 — Adaptive HyDE for Developer Support',
    },
    {
      id: 'query-decomp',
      priority: 3,
      title: 'Query Decomposition for multi-artifact tasks',
      effort: 'Medium',
      impact: 'High for Epic/Story agents',
      cost: '+$50-150/M',
      latency: '+600ms (parallelizable)',
      summary: 'Break "generate user story for X" into structured sub-queries — fan out, fuse results.',
      detail: `Decompose into: (a) similar past stories, (b) persona/role context, (c) related epics, (d) acceptance criteria patterns. Run sub-queries in parallel via LangGraph. Fuse with RRF. This dominates HyDE for structured generation tasks because the asymmetry isn't query/doc — it's task complexity vs. single-shot retrieval.`,
      arxiv: null,
    },
    {
      id: 'hyqe',
      priority: 4,
      title: 'HyQE — Index-time hypothetical queries',
      effort: 'High',
      impact: 'Medium, but amortized',
      cost: 'One-time indexing cost',
      latency: '0ms at query time',
      summary: 'For static Jira/Confluence history: generate hypothetical queries per document at index time.',
      detail: `Inverts the HyDE pattern. For each historical Jira ticket / Confluence page, prompt an LLM to generate 3-5 questions it would answer, embed those, and index alongside the doc embedding. At query time, match user queries against the hypothetical queries (which look like queries) instead of documents (which don't). No query-time LLM cost. Best for static corpora — rebuild on doc changes.`,
      arxiv: 'arXiv:2410.15262 — HyQE',
    },
    {
      id: 'step-back',
      priority: 5,
      title: 'Step-Back Prompting for Epic/abstract queries',
      effort: 'Low',
      impact: 'Medium for Epic Agent specifically',
      cost: '+$20/M',
      latency: '+300ms',
      summary: 'Cheaper alternative to HyDE for high-level conceptual queries.',
      detail: `Instead of hallucinating an answer, prompt the LLM to generate a more abstract version of the query. "How do we handle authentication at scale?" → "What are the general patterns for distributed authentication systems?" The abstract query retrieves architectural docs that the specific query would miss. Useful for Epic and architectural retrieval.`,
      arxiv: null,
    },
    {
      id: 'role-prefix',
      priority: 6,
      title: 'Role-aware query prefixing (you already do this)',
      effort: 'Done',
      impact: 'Already captured',
      cost: '$0',
      latency: '0ms',
      summary: 'INSTRUCTOR-style query prefixes are already in your stack. Keep auditing them.',
      detail: `Verify prefixes match document genre at index time too. "Represent the user story for retrieval:" should be paired with "Represent the user story for matching:" on the document side. Asymmetric prefixes (different on query vs document) often outperform symmetric ones.`,
      arxiv: null,
    },
    {
      id: 'eval-loop',
      priority: 7,
      title: 'Continuous eval with your 5-layer judge',
      effort: 'Plumbing',
      impact: 'Critical for keeping the above honest',
      cost: 'Internal',
      latency: 'Offline',
      summary: 'Wire every retrieval change through your existing DeepEval + RAGAS + Pytest layers.',
      detail: `Your 12-dimension scoring rubric and golden datasets are the only reliable signal that any of these techniques actually help. Run nightly regression: any retrieval-stage change must clear a delta gate on Recall@10, Context Precision, and downstream Faithfulness. Use Arize Phoenix to track span-level retrieval traces — flag drift in hypothetical-doc similarity scores.`,
      arxiv: null,
    },
  ];

  return (
    <div className="space-y-3">
      {items.map(item => {
        const isOpen = expandedCards[item.id];
        return (
          <div key={item.id} className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
            <button
              onClick={() => toggleCard(item.id)}
              className="w-full text-left p-5 flex items-start gap-4"
            >
              <div className="font-display text-3xl font-medium text-amber-500 leading-none w-10 flex-shrink-0">
                {String(item.priority).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <h4 className="font-display text-xl font-medium text-zinc-100">{item.title}</h4>
                  <ChevronRight size={16} className={`text-zinc-500 transition-transform mt-1 ${isOpen ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-sm text-zinc-400 mb-3">{item.summary}</p>
                <div className="flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  <span>Effort · <span className="text-zinc-300">{item.effort}</span></span>
                  <span>Impact · <span className="text-zinc-300">{item.impact}</span></span>
                  <span>Cost · <span className="text-zinc-300">{item.cost}</span></span>
                  <span>Latency · <span className="text-zinc-300">{item.latency}</span></span>
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pl-19 border-t border-zinc-800/50">
                <div className="ml-14 pt-4">
                  <p className="text-sm text-zinc-300 leading-relaxed mb-3">{item.detail}</p>
                  {item.arxiv && (
                    <div className="text-xs font-mono text-amber-500/70 flex items-center gap-2">
                      <BookOpen size={12} />
                      {item.arxiv}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom line */}
      <div className="mt-8 border border-zinc-700 bg-zinc-900/60 p-6">
        <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-3">The 80/20</div>
        <h4 className="font-display text-2xl font-medium mb-3">
          If you only do three things
        </h4>
        <ol className="space-y-3 text-sm text-zinc-300">
          <li className="flex gap-3"><span className="text-amber-500 font-mono">01</span>Confirm cross-encoder re-ranking is in your retrieval agent. This dominates HyDE's effect size.</li>
          <li className="flex gap-3"><span className="text-amber-500 font-mono">02</span>Deploy <span className="text-amber-400">adaptive HyDE</span> on Test Case and Gherkin agents only. Skip the rest.</li>
          <li className="flex gap-3"><span className="text-amber-500 font-mono">03</span>Run HyQE offline on your historical Jira/Confluence corpus — one-time indexing cost, zero query-time cost.</li>
        </ol>
      </div>
    </div>
  );
}

/* ===================== ROADMAP ===================== */

function Roadmap() {
  const phases = [
    {
      weeks: 'Weeks 1-2',
      title: 'Baseline lock',
      tone: 'cyan',
      items: [
        'Freeze current retrieval pipeline (BM25 + dense + RRF + cross-encoder)',
        'Build golden set: 200 queries per sub-agent (Story, Test Case, Gherkin, Epic)',
        'Run baseline eval: Recall@10, MRR, nDCG@10, Faithfulness',
        'Gate: baseline metrics documented in versioned JSON',
      ],
    },
    {
      weeks: 'Weeks 3-4',
      title: 'Cross-encoder audit',
      tone: 'cyan',
      items: [
        'Verify BGE-reranker-v2-m3 or equivalent is deployed and active',
        'A/B: with vs without re-ranker on golden set',
        'Gate: re-ranker adds ≥ +5 Recall@5 OR document why not',
      ],
    },
    {
      weeks: 'Weeks 5-6',
      title: 'HyDE prototype on Test Case agent',
      tone: 'amber',
      items: [
        'Custom HyDE prompt: "Write a test case in Gherkin format that would verify: {requirement}"',
        'Implement on Test Case sub-agent only via LangGraph node',
        'Multi-sample N=3, temp=0.7, gpt-4o-mini for generation',
        'Gate: Recall@10 lift ≥ +3 points on Test Case golden set',
      ],
    },
    {
      weeks: 'Weeks 7-8',
      title: 'Adaptive gating + Gherkin agent rollout',
      tone: 'amber',
      items: [
        'Add confidence gate: fire HyDE only when top score < 0.78',
        'Extend to Gherkin/BDD agent with format-locked prompt',
        'Add semantic caching layer (Redis with vector similarity ε=0.05)',
        'Gate: P95 latency increase ≤ 600ms, cost increase ≤ $100/M queries',
      ],
    },
    {
      weeks: 'Weeks 9-10',
      title: 'HyQE offline pipeline',
      tone: 'amber',
      items: [
        'Build doc → hypothetical-queries generator (5 queries per Jira ticket / Confluence page)',
        'Index hypothetical queries alongside document embeddings',
        'Switch Knowledge Base agent to query-vs-query matching',
        'Gate: Recall@10 lift on historical-context queries; zero query-time LLM cost',
      ],
    },
    {
      weeks: 'Weeks 11-12',
      title: 'Production hardening',
      tone: 'emerald',
      items: [
        'Wire full retrieval path through 5-layer DeepEval + RAGAS + Pytest harness',
        'Arize Phoenix span-level monitoring: log hypothetical docs, similarity drift',
        'Fallback chains: HyDE fails → direct retrieval → cached response',
        'Documentation: ADR for each retrieval stage; runbook for retrieval incidents',
        'Gate: 7 days of green eval scores, error rate < 0.5%, manual review of 50 production traces',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />

        {phases.map((p, i) => {
          const tones = {
            cyan: { dot: 'bg-cyan-500', border: 'border-cyan-500/30', label: 'text-cyan-400' },
            amber: { dot: 'bg-amber-500', border: 'border-amber-500/30', label: 'text-amber-400' },
            emerald: { dot: 'bg-emerald-500', border: 'border-emerald-500/30', label: 'text-emerald-400' },
          };
          const t = tones[p.tone];
          return (
            <div key={i} className="relative pl-12 pb-8">
              <div className={`absolute left-2 top-2 w-5 h-5 ${t.dot} ring-4 ring-zinc-950`} />
              <div className={`border-l-2 ${t.border} bg-zinc-900/40 p-5`}
                   style={{ borderLeftColor: p.tone === 'cyan' ? '#06b6d4' : p.tone === 'amber' ? '#f59e0b' : '#10b981' }}>
                <div className={`text-xs font-mono uppercase tracking-widest ${t.label} mb-1`}>{p.weeks}</div>
                <h4 className="font-display text-2xl font-medium mb-4">{p.title}</h4>
                <ul className="space-y-2">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                      <CheckCircle2 size={14} className="text-zinc-600 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-emerald-500/30 bg-emerald-500/[0.03] p-6 mt-4">
        <div className="flex items-start gap-4">
          <Shield size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-display text-xl font-medium mb-2">Production readiness checklist</h4>
            <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm text-zinc-300">
              {[
                'Golden set versioned and reviewed quarterly',
                'Eval gates in CI for every retrieval change',
                'Arize Phoenix span monitoring on hypothetical generation',
                'Cost dashboard tracking $/query trend',
                'P95/P99 latency SLOs with alerting',
                'Fallback chain tested via chaos injection',
                'ADR for each retrieval-stage decision',
                'Quarterly re-eval: does HyDE still beat current encoder?',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
