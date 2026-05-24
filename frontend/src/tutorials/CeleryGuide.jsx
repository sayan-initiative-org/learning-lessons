import React, { useState, useEffect, useRef } from 'react';

/**
 * CeleryGuide.jsx
 * A self-contained, interactive reference for Celery & Celery Tasks.
 * - No external dependencies beyond React (no Tailwind / no UI lib required).
 * - All styles scoped inside .cg-root via a single <style> tag.
 * - Drop into any React project: <CeleryGuide />
 */

// ---------- Lightweight Python syntax highlighter ----------
const escapeHTML = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightPython = (code) => {
  let h = escapeHTML(code);
  // comments first
  h = h.replace(/(#.*$)/gm, '<span class="cg-syn-c">$1</span>');
  // triple+single quoted strings
  h = h.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    '<span class="cg-syn-s">$1</span>');
  // decorators
  h = h.replace(/(^|\n|\s)(@[\w.]+)/g, '$1<span class="cg-syn-d">$2</span>');
  // keywords
  h = h.replace(
    /\b(from|import|def|class|return|if|else|elif|try|except|finally|with|as|for|in|while|async|await|lambda|yield|raise|pass|self|None|True|False|and|or|not|is|global)\b/g,
    '<span class="cg-syn-k">$1</span>'
  );
  // builtins / framework hints
  h = h.replace(
    /\b(Celery|Task|chain|group|chord|signature|shared_task|app|task|delay|apply_async|crontab|beat_schedule|retry)\b/g,
    '<span class="cg-syn-b">$1</span>'
  );
  // numbers
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="cg-syn-n">$1</span>');
  return h;
};

// ---------- Code block component ----------
function CodeBlock({ code, lang = 'python', label, filename }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {}
  };
  return (
    <div className="cg-code">
      <div className="cg-code-bar">
        <span className="cg-code-dots">
          <i style={{ background: '#ff6058' }} />
          <i style={{ background: '#ffbe2f' }} />
          <i style={{ background: '#2bca44' }} />
        </span>
        <span className="cg-code-file">
          {filename || `${lang} snippet`}
          {label && <em>{label}</em>}
        </span>
        <button className="cg-code-copy" onClick={copy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre
        className="cg-code-body"
        dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
      />
    </div>
  );
}

// ---------- Architecture SVG ----------
function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 900 460" className="cg-svg" role="img" aria-label="Celery architecture diagram">
      <defs>
        <linearGradient id="cgNode" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1c2520" />
          <stop offset="100%" stopColor="#131814" />
        </linearGradient>
        <linearGradient id="cgBroker" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2b3a14" />
          <stop offset="100%" stopColor="#1a2410" />
        </linearGradient>
        <linearGradient id="cgWorker" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#11302b" />
          <stop offset="100%" stopColor="#0b211d" />
        </linearGradient>
        <marker id="cgArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#a9bd0d" />
        </marker>
        <marker id="cgArrowMuted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#5dd2c4" />
        </marker>
      </defs>

      {/* Producer */}
      <g>
        <rect x="30" y="180" width="180" height="100" rx="10" fill="url(#cgNode)" stroke="#2a342e" />
        <text x="120" y="215" textAnchor="middle" fill="#a9bd0d" fontSize="13" fontFamily="JetBrains Mono, monospace" fontWeight="700">PRODUCER</text>
        <text x="120" y="240" textAnchor="middle" fill="#e8f0ea" fontSize="14">Your App</text>
        <text x="120" y="260" textAnchor="middle" fill="#94a89a" fontSize="11">Django · Flask · FastAPI</text>
      </g>

      {/* Broker */}
      <g>
        <rect x="320" y="180" width="200" height="100" rx="10" fill="url(#cgBroker)" stroke="#3d4f1f" />
        <text x="420" y="215" textAnchor="middle" fill="#a9bd0d" fontSize="13" fontFamily="JetBrains Mono, monospace" fontWeight="700">MESSAGE BROKER</text>
        <text x="420" y="240" textAnchor="middle" fill="#e8f0ea" fontSize="14">Redis / RabbitMQ / SQS</text>
        <text x="420" y="260" textAnchor="middle" fill="#94a89a" fontSize="11">queues · routing · delivery</text>
      </g>

      {/* Workers */}
      <g>
        <rect x="640" y="70" width="220" height="80" rx="10" fill="url(#cgWorker)" stroke="#1d544b" />
        <text x="750" y="100" textAnchor="middle" fill="#5dd2c4" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700">WORKER #1</text>
        <text x="750" y="122" textAnchor="middle" fill="#94a89a" fontSize="11">prefork pool · 8 procs</text>

        <rect x="640" y="190" width="220" height="80" rx="10" fill="url(#cgWorker)" stroke="#1d544b" />
        <text x="750" y="220" textAnchor="middle" fill="#5dd2c4" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700">WORKER #2</text>
        <text x="750" y="242" textAnchor="middle" fill="#94a89a" fontSize="11">gevent · 100 greenlets</text>

        <rect x="640" y="310" width="220" height="80" rx="10" fill="url(#cgWorker)" stroke="#1d544b" />
        <text x="750" y="340" textAnchor="middle" fill="#5dd2c4" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700">WORKER #N</text>
        <text x="750" y="362" textAnchor="middle" fill="#94a89a" fontSize="11">solo · single thread</text>
      </g>

      {/* Beat */}
      <g>
        <rect x="30" y="330" width="180" height="80" rx="10" fill="url(#cgNode)" stroke="#2a342e" strokeDasharray="4 3" />
        <text x="120" y="360" textAnchor="middle" fill="#f5b042" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700">BEAT</text>
        <text x="120" y="382" textAnchor="middle" fill="#e8f0ea" fontSize="13">Scheduler</text>
        <text x="120" y="400" textAnchor="middle" fill="#94a89a" fontSize="10">crontab · interval</text>
      </g>

      {/* Result Backend */}
      <g>
        <rect x="320" y="330" width="200" height="80" rx="10" fill="url(#cgNode)" stroke="#2a342e" />
        <text x="420" y="360" textAnchor="middle" fill="#5dd2c4" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700">RESULT BACKEND</text>
        <text x="420" y="382" textAnchor="middle" fill="#e8f0ea" fontSize="13">Redis / DB / S3</text>
        <text x="420" y="400" textAnchor="middle" fill="#94a89a" fontSize="10">stores task state &amp; return value</text>
      </g>

      {/* Arrows */}
      <line x1="210" y1="230" x2="318" y2="230" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#cgArrow)" />
      <text x="262" y="220" textAnchor="middle" fill="#a9bd0d" fontSize="10" fontFamily="JetBrains Mono, monospace">.delay()</text>

      <line x1="520" y1="200" x2="636" y2="110" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#cgArrow)" />
      <line x1="520" y1="230" x2="636" y2="230" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#cgArrow)" />
      <line x1="520" y1="260" x2="636" y2="350" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#cgArrow)" />

      <line x1="750" y1="270" x2="520" y2="365" stroke="#5dd2c4" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#cgArrowMuted)" />
      <text x="635" y="305" textAnchor="middle" fill="#5dd2c4" fontSize="10" fontFamily="JetBrains Mono, monospace">result</text>

      <line x1="210" y1="370" x2="318" y2="370" stroke="#f5b042" strokeWidth="2" markerEnd="url(#cgArrow)" />
      <text x="262" y="362" textAnchor="middle" fill="#f5b042" fontSize="10" fontFamily="JetBrains Mono, monospace">periodic</text>
    </svg>
  );
}

// ---------- Canvas primitive diagrams ----------
function ChainSVG() {
  return (
    <svg viewBox="0 0 380 80" className="cg-svg-mini">
      <defs>
        <marker id="aChain" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#a9bd0d" />
        </marker>
      </defs>
      {['A', 'B', 'C'].map((t, i) => (
        <g key={t}>
          <circle cx={50 + i * 130} cy={40} r={24} fill="#131814" stroke="#a9bd0d" strokeWidth="1.5" />
          <text x={50 + i * 130} y={45} textAnchor="middle" fill="#a9bd0d" fontFamily="JetBrains Mono, monospace" fontSize="14">{t}</text>
        </g>
      ))}
      <line x1="78" y1="40" x2="152" y2="40" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#aChain)" />
      <line x1="208" y1="40" x2="282" y2="40" stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#aChain)" />
    </svg>
  );
}

function GroupSVG() {
  return (
    <svg viewBox="0 0 380 180" className="cg-svg-mini">
      <defs>
        <marker id="aGrp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#5dd2c4" />
        </marker>
      </defs>
      <circle cx="50" cy="90" r="22" fill="#131814" stroke="#5dd2c4" strokeWidth="1.5" />
      <text x="50" y="95" textAnchor="middle" fill="#5dd2c4" fontFamily="JetBrains Mono, monospace" fontSize="13">in</text>
      {['A', 'B', 'C'].map((t, i) => (
        <g key={t}>
          <circle cx={240} cy={30 + i * 60} r={22} fill="#131814" stroke="#5dd2c4" strokeWidth="1.5" />
          <text x={240} y={35 + i * 60} textAnchor="middle" fill="#5dd2c4" fontFamily="JetBrains Mono, monospace" fontSize="14">{t}</text>
          <line x1="74" y1="90" x2="218" y2={30 + i * 60} stroke="#5dd2c4" strokeWidth="1.5" markerEnd="url(#aGrp)" />
        </g>
      ))}
      <text x="190" y="170" textAnchor="middle" fill="#94a89a" fontSize="11" fontFamily="JetBrains Mono, monospace">all execute in parallel</text>
    </svg>
  );
}

function ChordSVG() {
  return (
    <svg viewBox="0 0 380 200" className="cg-svg-mini">
      <defs>
        <marker id="aChd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#f5b042" />
        </marker>
      </defs>
      <circle cx="40" cy="100" r="22" fill="#131814" stroke="#f5b042" strokeWidth="1.5" />
      <text x="40" y="105" textAnchor="middle" fill="#f5b042" fontFamily="JetBrains Mono, monospace" fontSize="12">in</text>
      {['A', 'B', 'C'].map((t, i) => (
        <g key={t}>
          <circle cx={180} cy={40 + i * 60} r={22} fill="#131814" stroke="#f5b042" strokeWidth="1.5" />
          <text x={180} y={45 + i * 60} textAnchor="middle" fill="#f5b042" fontFamily="JetBrains Mono, monospace" fontSize="14">{t}</text>
          <line x1="64" y1="100" x2="158" y2={40 + i * 60} stroke="#f5b042" strokeWidth="1.5" markerEnd="url(#aChd)" />
          <line x1="202" y1={40 + i * 60} x2="296" y2="100" stroke="#f5b042" strokeWidth="1.5" markerEnd="url(#aChd)" />
        </g>
      ))}
      <rect x="296" y="78" width="60" height="44" rx="8" fill="#131814" stroke="#f5b042" strokeWidth="1.5" />
      <text x="326" y="105" textAnchor="middle" fill="#f5b042" fontFamily="JetBrains Mono, monospace" fontSize="13">cb</text>
      <text x="180" y="185" textAnchor="middle" fill="#94a89a" fontSize="11" fontFamily="JetBrains Mono, monospace">group then callback on all results</text>
    </svg>
  );
}

function LifecycleSVG() {
  const states = [
    { x: 40, label: 'PENDING', color: '#94a89a' },
    { x: 180, label: 'RECEIVED', color: '#5dd2c4' },
    { x: 320, label: 'STARTED', color: '#5dd2c4' },
    { x: 460, label: 'SUCCESS', color: '#a9bd0d' },
  ];
  return (
    <svg viewBox="0 0 720 220" className="cg-svg">
      <defs>
        <marker id="aLife" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#a9bd0d" />
        </marker>
        <marker id="aLifeRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#ef5b5b" />
        </marker>
        <marker id="aLifeAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#f5b042" />
        </marker>
      </defs>
      {states.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={70} width={120} height={50} rx={8} fill="#131814" stroke={s.color} strokeWidth="1.5" />
          <text x={s.x + 60} y={100} textAnchor="middle" fill={s.color} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">{s.label}</text>
          {i < states.length - 1 && (
            <line x1={s.x + 120} y1={95} x2={states[i + 1].x} y2={95} stroke="#a9bd0d" strokeWidth="2" markerEnd="url(#aLife)" />
          )}
        </g>
      ))}
      {/* Retry branch */}
      <rect x="320" y="160" width="120" height="46" rx="8" fill="#131814" stroke="#f5b042" strokeWidth="1.5" />
      <text x="380" y="188" textAnchor="middle" fill="#f5b042" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">RETRY</text>
      <line x1="380" y1="120" x2="380" y2="158" stroke="#f5b042" strokeWidth="2" markerEnd="url(#aLifeAmber)" />
      <path d="M 320 183 Q 250 183 250 130" stroke="#f5b042" strokeWidth="2" fill="none" markerEnd="url(#aLifeAmber)" />
      {/* Failure branch */}
      <rect x="580" y="160" width="120" height="46" rx="8" fill="#131814" stroke="#ef5b5b" strokeWidth="1.5" />
      <text x="640" y="188" textAnchor="middle" fill="#ef5b5b" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">FAILURE</text>
      <line x1="380" y1="120" x2="580" y2="180" stroke="#ef5b5b" strokeWidth="2" markerEnd="url(#aLifeRed)" />
      <text x="40" y="40" fill="#94a89a" fontSize="12" fontFamily="JetBrains Mono, monospace">task state transitions</text>
    </svg>
  );
}

// ---------- Section data ----------
const TABS = [
  { id: 'overview', label: '01 · Overview' },
  { id: 'arch', label: '02 · Architecture' },
  { id: 'when', label: '03 · When / Where' },
  { id: 'api', label: '04 · Task API' },
  { id: 'canvas', label: '05 · Canvas' },
  { id: 'features', label: '06 · Features' },
  { id: 'examples', label: '07 · Examples' },
  { id: 'practices', label: '08 · Best Practices' },
];

const CORE_CONCEPTS = [
  {
    name: 'Task',
    glyph: '⚡',
    short: 'Unit of work — a Python callable registered with Celery.',
    long:
      'A task is the smallest schedulable unit. Decorate a function with @app.task (or @shared_task in Django) and it becomes a deferrable, retry-able, signable callable. Tasks have an immutable name, options (retries, soft/hard limits), and can be composed into workflows.',
  },
  {
    name: 'Broker',
    glyph: '⇄',
    short: 'Message transport between producers and workers.',
    long:
      'Redis (most popular for simple ops), RabbitMQ (most robust, native AMQP routing), Amazon SQS (managed, FIFO support), and others. The broker holds task messages until a worker picks one up. Choice affects routing power, durability, and ops cost.',
  },
  {
    name: 'Worker',
    glyph: '⚙',
    short: 'A daemon that consumes and executes tasks.',
    long:
      'Workers run on one or more hosts. Each can use a pool — prefork (default, CPU-friendly), gevent / eventlet (I/O-bound), solo (single-thread), or threads. Concurrency, autoscale, queues, and prefetch tune throughput and fairness.',
  },
  {
    name: 'Result Backend',
    glyph: '◎',
    short: 'Stores task state and return values.',
    long:
      'Optional but required for AsyncResult.get(), chords, and chains that pass results. Redis, RPC (RabbitMQ), database (SQLAlchemy / Django ORM), Memcached, MongoDB, S3, Elasticsearch. Redis is the pragmatic default.',
  },
  {
    name: 'Beat',
    glyph: '⏱',
    short: 'Scheduler for periodic tasks (cron-like).',
    long:
      'A separate process that publishes tasks on a schedule (crontab, interval, or solar). Single instance only — use celery-redbeat or django-celery-beat for HA / DB-backed schedules.',
  },
  {
    name: 'Flower',
    glyph: '✿',
    short: 'Real-time web UI for monitoring workers and tasks.',
    long:
      'Inspect active/scheduled/reserved tasks, broker stats, worker pool size, restart workers, revoke tasks, view task arguments and tracebacks. Pairs well with Prometheus exporters in production.',
  },
];

const USE_CASES = [
  { tag: 'I/O', title: 'Email & notifications', desc: 'SMTP, transactional email APIs, push notifications, SMS. Slow third-party calls become fire-and-forget.' },
  { tag: 'ML', title: 'ML inference & training', desc: 'Async model training jobs, batched inference, embedding generation for RAG ingest, vector DB upserts.' },
  { tag: 'ETL', title: 'Data pipelines & ETL', desc: 'Periodic extract-transform-load, partition-level processing with groups, fan-out/fan-in via chord.' },
  { tag: 'MEDIA', title: 'Image / video / PDF processing', desc: 'Thumbnails, transcoding, OCR, watermarking. Long-running CPU tasks off the request path.' },
  { tag: 'WEB', title: 'Webhook dispatch & retries', desc: 'Outbound webhooks with exponential backoff, dead-letter queues, idempotent delivery.' },
  { tag: 'CRON', title: 'Periodic jobs', desc: 'Nightly reports, cache warmups, data refresh, billing runs, scheduled cleanups.' },
  { tag: 'API', title: 'Rate-limited 3P APIs', desc: 'Per-task rate limits keep you under quotas (Stripe, OpenAI, Twilio, internal APIs).' },
  { tag: 'RPT', title: 'Report generation', desc: 'PDFs, Excel exports, large CSV builds — email the link when done.' },
  { tag: 'AGENT', title: 'Agent / LLM workflows', desc: 'Long-running agentic chains, tool execution, retry on transient model errors, parallel sub-agents via group.' },
];

const NOT_FOR = [
  { title: 'Sub-100ms interactive responses', desc: 'Broker round-trip + scheduling overhead dominates. Call the function directly.' },
  { title: 'Sub-second strict deadlines', desc: 'Celery is at-least-once and best-effort latency, not a real-time scheduler.' },
  { title: 'Single-host trivial pipelines', desc: 'Plain threading / asyncio / multiprocessing is simpler if you have no cross-process needs.' },
  { title: 'Hard streaming workloads', desc: 'Use Kafka / Pulsar / Flink for event streams; Celery is task-oriented, not stream-oriented.' },
];

const API_OPTIONS = [
  ['name', 'override task name (default: module.func)'],
  ['bind=True', 'inject task instance as `self` — required for self.retry()'],
  ['max_retries', 'cap retries (default 3, set None for infinite)'],
  ['default_retry_delay', 'seconds between retries (default 180)'],
  ['autoretry_for', 'tuple of exceptions to auto-retry'],
  ['retry_backoff', 'exponential backoff (True or seconds base)'],
  ['retry_backoff_max', 'cap backoff window'],
  ['retry_jitter', 'add randomness to avoid thundering herd'],
  ['acks_late', 'ack after task finishes — survives worker crash'],
  ['reject_on_worker_lost', 'requeue if worker dies mid-task'],
  ['time_limit', 'hard kill after N seconds'],
  ['soft_time_limit', 'raise SoftTimeLimitExceeded for cleanup'],
  ['rate_limit', 'e.g. "10/m" — per-worker throttle'],
  ['queue', 'route to a named queue'],
  ['priority', '0–9 (RabbitMQ); higher runs first'],
  ['ignore_result', 'skip writing to result backend (perf)'],
  ['serializer', 'json (default), pickle, msgpack, yaml'],
];

const FEATURES = [
  { name: 'Retries with backoff', desc: 'Built-in exponential backoff, jitter, and cap. Either declarative (autoretry_for=) or imperative (self.retry()).' },
  { name: 'Workflows (Canvas)', desc: 'chain, group, chord, map, starmap, chunks — composable task graphs.' },
  { name: 'Periodic tasks (Beat)', desc: 'Crontab, interval, and solar schedules. DB-backed via django-celery-beat or HA via redbeat.' },
  { name: 'Routing', desc: 'Send tasks to specific queues by name, type, or argument. Workers consume only the queues you assign.' },
  { name: 'Priorities', desc: 'Per-task priority levels (RabbitMQ priority queues, Redis sorted-set hack).' },
  { name: 'Rate limiting', desc: 'Per-worker rate limits — "5/s", "30/m", "1000/h" — for quota-bound APIs.' },
  { name: 'Time limits', desc: 'Soft (signal you can catch for cleanup) and hard (SIGKILL the task).' },
  { name: 'Task revocation', desc: 'Cancel a queued or running task by id, optionally terminating the worker process.' },
  { name: 'Result tracking', desc: 'AsyncResult.get(), .state, .info — poll or wait on outcomes.' },
  { name: 'Signals', desc: 'Hooks for task_prerun, task_postrun, task_failure, worker_ready — wire metrics, tracing, audit logs.' },
  { name: 'Custom task classes', desc: 'Subclass Task to share on_success / on_failure / on_retry logic across many tasks.' },
  { name: 'Pool flexibility', desc: 'prefork (CPU), gevent / eventlet (massive I/O), solo (debugging), threads — match to workload.' },
];

const BEST_PRACTICES = [
  { title: 'Make every task idempotent', desc: 'Celery is at-least-once. Use natural keys, upserts, dedupe tables, or content hashes so retries never double-write.' },
  { title: 'Pass IDs, not objects', desc: 'Serialize a model PK / record ID and re-fetch inside the task. Avoid stale ORM instances, oversized payloads, and pickle-only types.' },
  { title: 'Always set time limits', desc: 'Pair soft_time_limit (graceful) with time_limit (hard). Without them, one bad task can pin a worker forever.' },
  { title: 'Use acks_late + reject_on_worker_lost for critical work', desc: 'Without these, a worker crash silently drops in-flight tasks. With them, the broker redelivers.' },
  { title: 'Split queues by latency class', desc: 'high (interactive), default, low (batch). Dedicated worker pools per queue prevent slow tasks from starving fast ones.' },
  { title: 'Tune prefetch_multiplier', desc: 'Default 4 hurts long tasks. Set to 1 for long-running work so the broker doesn\'t hand one worker all the messages.' },
  { title: 'Avoid result backend when you can', desc: 'ignore_result=True for fire-and-forget. Result backends are expensive and create coupling.' },
  { title: 'Prefer JSON serializer', desc: 'pickle works but is unsafe across versions and over untrusted brokers. JSON forces clean, portable contracts.' },
  { title: 'Wire observability early', desc: 'Flower + Prometheus exporter + structured logs + OpenTelemetry hooks. Debugging blind is painful at scale.' },
  { title: 'Plan a dead-letter strategy', desc: 'For exhausted retries, route to a DLQ and alert. Don\'t lose work silently.' },
  { title: 'Beat is a single point of failure', desc: 'Run exactly one instance. Use redbeat or DB-backed schedulers if you need HA or runtime schedule edits.' },
  { title: 'Test with eager mode carefully', desc: 'CELERY_TASK_ALWAYS_EAGER=True runs tasks inline — useful for unit tests but hides concurrency bugs.' },
];

// ---------- Code Snippets ----------
const SNIPPETS = {
  install: `# Install celery with the broker you want
pip install "celery[redis]"

# Or with RabbitMQ
pip install "celery[librabbitmq]"

# Optional extras
pip install flower               # web UI for monitoring
pip install django-celery-beat   # DB-backed periodic tasks (Django)`,

  basic: `# tasks.py
from celery import Celery

app = Celery(
    "myapp",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)

@app.task
def add(x, y):
    return x + y

@app.task(name="send_welcome_email")
def send_welcome_email(user_id):
    # fetch fresh state inside the task — never pass ORM objects
    from .models import User
    user = User.objects.get(pk=user_id)
    send_email(user.email, "Welcome!", template="welcome.html")`,

  invoke: `# Producer side — kick off tasks from your app
from .tasks import add, send_welcome_email

# Fire and forget (most common)
add.delay(2, 3)

# Same thing with explicit options
result = add.apply_async(args=(2, 3), countdown=10, queue="high")

# AsyncResult — wait or poll
print(result.id)            # uuid string
print(result.state)         # PENDING / STARTED / SUCCESS / FAILURE
value = result.get(timeout=30)`,

  retry: `from celery import shared_task
from celery.exceptions import SoftTimeLimitExceeded
import httpx

@shared_task(
    bind=True,
    autoretry_for=(httpx.HTTPError,),
    retry_backoff=2,          # 2s, 4s, 8s, 16s ...
    retry_backoff_max=300,
    retry_jitter=True,
    max_retries=6,
    acks_late=True,
    reject_on_worker_lost=True,
    soft_time_limit=25,
    time_limit=30,
)
def push_webhook(self, url, payload):
    try:
        r = httpx.post(url, json=payload, timeout=10)
        r.raise_for_status()
        return {"status": r.status_code}
    except SoftTimeLimitExceeded:
        # Cleanup hook — close connections, flush, then propagate
        raise
    except httpx.HTTPStatusError as e:
        if e.response.status_code in (408, 429, 500, 502, 503, 504):
            raise self.retry(exc=e)
        raise   # 4xx (non-retryable) — let it fail`,

  chain: `from celery import chain
from .tasks import fetch_pdf, extract_text, summarize, store_summary

# Sequential pipeline — each output feeds the next
workflow = chain(
    fetch_pdf.s("https://example.com/report.pdf"),
    extract_text.s(),
    summarize.s(model="gpt-4o-mini"),
    store_summary.s(user_id=42),
)
result = workflow.apply_async()
final = result.get()   # blocks until last task done`,

  group: `from celery import group
from .tasks import resize_image

# Parallel fan-out
job = group(
    resize_image.s(image_id=i, size=(800, 600))
    for i in image_ids
)
result = job.apply_async()
result.join()   # list of return values, in submission order`,

  chord: `from celery import chord
from .tasks import process_partition, write_report

# Fan-out + callback when ALL succeed
partitions = list(range(0, 100))
callback = write_report.s(report_id="2026-Q1")

result = chord(
    process_partition.s(p) for p in partitions
)(callback)

# write_report receives [r1, r2, ..., r100] as first arg`,

  beat: `# celery_app.py
from celery import Celery
from celery.schedules import crontab

app = Celery("myapp", broker="redis://localhost:6379/0")

app.conf.beat_schedule = {
    "nightly-rollup": {
        "task": "analytics.tasks.rollup_daily",
        "schedule": crontab(hour=2, minute=30),
        "kwargs": {"warehouse": "prod"},
    },
    "every-five-minutes": {
        "task": "health.tasks.ping_dependencies",
        "schedule": 300.0,        # seconds
    },
    "weekdays-business-hours": {
        "task": "ops.tasks.poll_queue_depth",
        "schedule": crontab(minute="*/5", hour="9-17", day_of_week="mon-fri"),
    },
}
app.conf.timezone = "Asia/Kolkata"`,

  routing: `# Route specific tasks to specific queues
app.conf.task_routes = {
    "billing.tasks.*":     {"queue": "high"},
    "ml.tasks.embed_*":    {"queue": "gpu"},
    "analytics.tasks.*":   {"queue": "batch"},
}

# Workers consume only assigned queues
# Terminal 1: celery -A myapp worker -Q high      --concurrency=8
# Terminal 2: celery -A myapp worker -Q gpu       --concurrency=2 --pool=solo
# Terminal 3: celery -A myapp worker -Q batch     --concurrency=4`,

  django: `# myproject/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
app = Celery("myproject")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()   # finds tasks.py in every installed app

# myproject/__init__.py
from .celery import app as celery_app
__all__ = ("celery_app",)

# settings.py
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/1"
CELERY_TASK_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TIMEZONE = "Asia/Kolkata"
CELERY_TASK_TIME_LIMIT = 600
CELERY_TASK_SOFT_TIME_LIMIT = 540

# myapp/tasks.py
from celery import shared_task

@shared_task(bind=True, autoretry_for=(Exception,), max_retries=3)
def reindex_search(self, document_id):
    ...`,

  fastapi: `# tasks.py
from celery import Celery

celery_app = Celery(
    "fastapi_app",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)

@celery_app.task
def heavy_job(payload: dict) -> dict:
    ...
    return {"ok": True}

# api.py
from fastapi import FastAPI
from .tasks import celery_app, heavy_job

api = FastAPI()

@api.post("/jobs")
def submit(body: dict):
    async_result = heavy_job.delay(body)
    return {"job_id": async_result.id}

@api.get("/jobs/{job_id}")
def status(job_id: str):
    res = celery_app.AsyncResult(job_id)
    return {"state": res.state, "result": res.result if res.ready() else None}`,

  signals: `from celery.signals import task_prerun, task_failure, task_success
import time, structlog

log = structlog.get_logger()

@task_prerun.connect
def _start(sender=None, task_id=None, task=None, **kw):
    task.__start = time.monotonic()

@task_success.connect
def _ok(sender=None, **kw):
    elapsed = time.monotonic() - getattr(sender, "__start", time.monotonic())
    log.info("task.success", name=sender.name, ms=int(elapsed * 1000))

@task_failure.connect
def _fail(sender=None, task_id=None, exception=None, **kw):
    log.error("task.failure", name=sender.name, id=task_id, error=str(exception))`,

  cli: `# Start a worker (development)
celery -A myapp worker --loglevel=info --concurrency=4

# Start a worker on specific queues with autoscale
celery -A myapp worker -Q high,default --autoscale=10,3 --loglevel=info

# Start beat (one instance only!)
celery -A myapp beat --loglevel=info

# Combined (development only — never run beat in -B in production)
celery -A myapp worker -B --loglevel=info

# Inspect running workers
celery -A myapp inspect active
celery -A myapp inspect registered
celery -A myapp inspect stats

# Purge all messages from default queue
celery -A myapp purge

# Revoke a task
celery -A myapp control revoke <task-id> --terminate

# Flower monitoring UI on port 5555
celery -A myapp flower --port=5555`,
};

// ---------- Section Card ----------
function Card({ children, accent }) {
  return (
    <div className="cg-card" style={accent ? { borderLeftColor: accent } : undefined}>
      {children}
    </div>
  );
}

// ---------- Accordion ----------
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="cg-acc">
      {items.map((it, i) => (
        <div key={i} className={`cg-acc-item ${open === i ? 'is-open' : ''}`}>
          <button className="cg-acc-head" onClick={() => setOpen(open === i ? null : i)}>
            <span className="cg-acc-title">{it.title}</span>
            <span className="cg-acc-icon">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="cg-acc-body">{it.body}</div>}
        </div>
      ))}
    </div>
  );
}

// ---------- Main Component ----------
export default function CeleryGuide() {
  const [tab, setTab] = useState('overview');

  // smooth scroll into view when tab changes
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <>
      <style>{CSS}</style>
      <div className="cg-root">
        {/* HEADER */}
        <header className="cg-header">
          <div className="cg-brand">
            <div className="cg-logo">
              <svg viewBox="0 0 40 40" width="34" height="34">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#a9bd0d" strokeWidth="1.5" />
                <path d="M20 6 L20 34 M6 20 L34 20" stroke="#a9bd0d" strokeWidth="1.2" />
                <circle cx="20" cy="20" r="4" fill="#a9bd0d" />
              </svg>
            </div>
            <div>
              <div className="cg-eyebrow">distributed task queue · python</div>
              <h1 className="cg-h1">Celery <span>Field Manual</span></h1>
            </div>
          </div>
          <div className="cg-meta">
            <div><span>STATUS</span>production-grade · since 2009</div>
            <div><span>BROKER</span>Redis · RabbitMQ · SQS</div>
            <div><span>LICENSE</span>BSD-3-Clause</div>
          </div>
        </header>

        {/* TAB BAR */}
        <nav className="cg-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`cg-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="cg-main" ref={ref}>
          {tab === 'overview' && (
            <section>
              <h2 className="cg-h2">What is Celery?</h2>
              <p className="cg-lead">
                Celery is a distributed task queue for Python. You hand it a callable;
                it ships that callable to a worker process — running anywhere on your
                network — that executes it asynchronously, with retries, scheduling,
                routing, and rich workflow composition. It decouples slow, unreliable,
                or scheduled work from the request path.
              </p>

              <div className="cg-stats">
                <div><b>15+</b><span>years in production</span></div>
                <div><b>9</b><span>built-in serializers</span></div>
                <div><b>6+</b><span>broker transports</span></div>
                <div><b>4</b><span>worker pool types</span></div>
              </div>

              <h3 className="cg-h3">Core concepts</h3>
              <div className="cg-grid">
                {CORE_CONCEPTS.map((c) => (
                  <Card key={c.name} accent="#a9bd0d">
                    <div className="cg-concept-head">
                      <span className="cg-glyph">{c.glyph}</span>
                      <h4>{c.name}</h4>
                    </div>
                    <p className="cg-mute">{c.short}</p>
                    <details>
                      <summary>more</summary>
                      <p>{c.long}</p>
                    </details>
                  </Card>
                ))}
              </div>

              <h3 className="cg-h3">Why people reach for Celery</h3>
              <ul className="cg-bullets">
                <li>Get long, unreliable, or scheduled work out of the request path.</li>
                <li>Parallelize across machines without rewriting your code as a distributed system.</li>
                <li>Survive worker crashes via at-least-once delivery, acks_late, and retries with backoff.</li>
                <li>Compose multi-step workflows declaratively with chains, groups, and chords.</li>
                <li>Tame quota-bound external APIs with per-task rate limits and dedicated queues.</li>
                <li>Schedule cron-like jobs alongside on-demand tasks in the same system.</li>
              </ul>
            </section>
          )}

          {tab === 'arch' && (
            <section>
              <h2 className="cg-h2">Architecture</h2>
              <p className="cg-lead">
                Celery is a producer → broker → consumer architecture. Your app
                serializes a task message and pushes it to a broker; one or more
                workers pull messages, execute them, and optionally publish results
                to a result backend.
              </p>

              <Card>
                <ArchitectureDiagram />
              </Card>

              <div className="cg-twocol">
                <Card>
                  <h4 className="cg-h4">Brokers</h4>
                  <table className="cg-table">
                    <thead>
                      <tr><th>Broker</th><th>Best for</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Redis</td><td>Default choice. Simple, fast, ops-cheap, also doubles as result backend.</td></tr>
                      <tr><td>RabbitMQ</td><td>Richest routing (topic, headers, priority queues), strongest delivery guarantees.</td></tr>
                      <tr><td>Amazon SQS</td><td>Fully managed, FIFO + dead-letter queues. No persistence concerns.</td></tr>
                      <tr><td>Google Pub/Sub</td><td>Managed, geo-replicated, GCP-native.</td></tr>
                      <tr><td>Azure Service Bus</td><td>Azure-native, with sessions and DLQ built in.</td></tr>
                    </tbody>
                  </table>
                </Card>

                <Card>
                  <h4 className="cg-h4">Result backends</h4>
                  <table className="cg-table">
                    <thead>
                      <tr><th>Backend</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Redis</td><td>Fast, expiry built-in. Most common.</td></tr>
                      <tr><td>RPC (AMQP)</td><td>One-shot reply over the broker; ephemeral.</td></tr>
                      <tr><td>Database</td><td>Durable, queryable, slower. Good for audit trails.</td></tr>
                      <tr><td>Cache (Memcached)</td><td>Low-latency, no persistence.</td></tr>
                      <tr><td>MongoDB / S3 / ES</td><td>For specialized storage, large payloads, search.</td></tr>
                    </tbody>
                  </table>
                </Card>
              </div>

              <h3 className="cg-h3">Worker pool models</h3>
              <div className="cg-grid">
                <Card><h4>prefork</h4><p className="cg-mute">Default. Forks N OS processes. CPU-bound work, true parallelism, sidesteps the GIL.</p></Card>
                <Card><h4>gevent / eventlet</h4><p className="cg-mute">Hundreds of greenlets per worker. I/O-bound (HTTP, DB, S3). Cheap concurrency.</p></Card>
                <Card><h4>threads</h4><p className="cg-mute">Native thread pool. Fine for light I/O. Subject to the GIL for CPU work.</p></Card>
                <Card><h4>solo</h4><p className="cg-mute">Single thread, no concurrency. Useful for debugging and GPU-pinned ML tasks.</p></Card>
              </div>

              <h3 className="cg-h3">Task lifecycle</h3>
              <Card><LifecycleSVG /></Card>
            </section>
          )}

          {tab === 'when' && (
            <section>
              <h2 className="cg-h2">When &amp; where to use it</h2>
              <p className="cg-lead">
                Reach for Celery whenever work is slow, scheduled, retry-prone,
                bursty, quota-limited, or needs to scale across machines —
                anywhere it would harm your user experience or reliability to
                run inline.
              </p>

              <h3 className="cg-h3">Common use cases</h3>
              <div className="cg-grid">
                {USE_CASES.map((u) => (
                  <Card key={u.title}>
                    <div className="cg-tag">{u.tag}</div>
                    <h4>{u.title}</h4>
                    <p className="cg-mute">{u.desc}</p>
                  </Card>
                ))}
              </div>

              <h3 className="cg-h3">When NOT to use Celery</h3>
              <div className="cg-twocol">
                {NOT_FOR.map((u) => (
                  <Card key={u.title} accent="#ef5b5b">
                    <h4>{u.title}</h4>
                    <p className="cg-mute">{u.desc}</p>
                  </Card>
                ))}
              </div>

              <h3 className="cg-h3">Decision shortcut</h3>
              <Card>
                <ul className="cg-decision">
                  <li><b>Will this take &gt; 1 second?</b> → Strong candidate.</li>
                  <li><b>Can it fail transiently?</b> → Strong candidate (retries).</li>
                  <li><b>Should it run on a schedule?</b> → Beat.</li>
                  <li><b>Does it depend on another job&apos;s output?</b> → chain.</li>
                  <li><b>Do many independent jobs need to run, then aggregate?</b> → chord.</li>
                  <li><b>Is it &lt; 100ms and always cheap?</b> → Skip Celery. Call inline.</li>
                </ul>
              </Card>
            </section>
          )}

          {tab === 'api' && (
            <section>
              <h2 className="cg-h2">Task API reference</h2>
              <p className="cg-lead">
                A task is any callable decorated with <code>@app.task</code> (or
                <code> @shared_task</code> in Django, which avoids importing
                the app instance). Options on the decorator define retry,
                timing, routing, and serialization behavior.
              </p>

              <CodeBlock filename="tasks.py · install" code={SNIPPETS.install} />
              <CodeBlock filename="tasks.py · basic task" code={SNIPPETS.basic} />
              <CodeBlock filename="producer.py · calling tasks" code={SNIPPETS.invoke} />

              <h3 className="cg-h3">delay() vs apply_async()</h3>
              <Card>
                <table className="cg-table">
                  <thead><tr><th></th><th>delay()</th><th>apply_async()</th></tr></thead>
                  <tbody>
                    <tr><td>signature</td><td><code>add.delay(2, 3)</code></td><td><code>add.apply_async(args=(2, 3), countdown=10)</code></td></tr>
                    <tr><td>options</td><td>none</td><td>countdown, eta, expires, queue, priority, link, link_error, headers, ...</td></tr>
                    <tr><td>use when</td><td>quick fire-and-forget</td><td>need scheduling, routing, callbacks, or links</td></tr>
                  </tbody>
                </table>
              </Card>

              <h3 className="cg-h3">Decorator options</h3>
              <Card>
                <table className="cg-table cg-table-tight">
                  <thead><tr><th>Option</th><th>Meaning</th></tr></thead>
                  <tbody>
                    {API_OPTIONS.map(([k, v]) => (
                      <tr key={k}><td><code>{k}</code></td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <h3 className="cg-h3">Retries — declarative &amp; imperative</h3>
              <CodeBlock filename="tasks.py · retries" code={SNIPPETS.retry} />

              <h3 className="cg-h3">CLI cheat sheet</h3>
              <CodeBlock filename="shell · celery cli" lang="bash" code={SNIPPETS.cli} />
            </section>
          )}

          {tab === 'canvas' && (
            <section>
              <h2 className="cg-h2">Canvas — workflow primitives</h2>
              <p className="cg-lead">
                Canvas lets you compose tasks into directed graphs. Built from
                <em> signatures</em> (a frozen call with args/kwargs/options).
                Use <code>task.s(...)</code> for a signature; the three primary
                primitives are <b>chain</b>, <b>group</b>, and <b>chord</b>.
              </p>

              <div className="cg-canvas">
                <Card>
                  <div className="cg-canvas-head">
                    <h3>chain</h3>
                    <span className="cg-pill cg-pill-green">sequential</span>
                  </div>
                  <ChainSVG />
                  <p className="cg-mute">Output of each task becomes the first argument of the next. Use for pipelines.</p>
                  <CodeBlock filename="workflow · chain" code={SNIPPETS.chain} />
                </Card>

                <Card>
                  <div className="cg-canvas-head">
                    <h3>group</h3>
                    <span className="cg-pill cg-pill-cyan">parallel</span>
                  </div>
                  <GroupSVG />
                  <p className="cg-mute">Run N tasks in parallel. The group result is a list of individual results.</p>
                  <CodeBlock filename="workflow · group" code={SNIPPETS.group} />
                </Card>

                <Card>
                  <div className="cg-canvas-head">
                    <h3>chord</h3>
                    <span className="cg-pill cg-pill-amber">fan-out / fan-in</span>
                  </div>
                  <ChordSVG />
                  <p className="cg-mute">A group followed by a callback that receives the list of all results. Requires a result backend.</p>
                  <CodeBlock filename="workflow · chord" code={SNIPPETS.chord} />
                </Card>
              </div>

              <h3 className="cg-h3">Other canvas helpers</h3>
              <div className="cg-grid">
                <Card><h4>map</h4><p className="cg-mute"><code>task.map([1,2,3])</code> — apply a task to each item. Sequential.</p></Card>
                <Card><h4>starmap</h4><p className="cg-mute"><code>task.starmap([(1,2),(3,4)])</code> — like map, but argument tuples are unpacked.</p></Card>
                <Card><h4>chunks</h4><p className="cg-mute"><code>task.chunks(big_iterable, n)</code> — split into batches sized N to reduce broker overhead.</p></Card>
                <Card><h4>partial / immutable signatures</h4><p className="cg-mute"><code>.s()</code> partial · <code>.si()</code> immutable (ignores upstream result). Pin args precisely.</p></Card>
              </div>
            </section>
          )}

          {tab === 'features' && (
            <section>
              <h2 className="cg-h2">Features at a glance</h2>
              <p className="cg-lead">
                Every feature below is built in. Most are toggled by decorator
                options or settings — you rarely need third-party plugins for
                production basics.
              </p>
              <div className="cg-grid">
                {FEATURES.map((f) => (
                  <Card key={f.name}>
                    <h4>{f.name}</h4>
                    <p className="cg-mute">{f.desc}</p>
                  </Card>
                ))}
              </div>

              <h3 className="cg-h3">Periodic tasks (Beat)</h3>
              <CodeBlock filename="celery_app.py · beat schedule" code={SNIPPETS.beat} />

              <h3 className="cg-h3">Routing &amp; queues</h3>
              <CodeBlock filename="settings · routing" code={SNIPPETS.routing} />

              <h3 className="cg-h3">Signals for observability</h3>
              <CodeBlock filename="signals.py" code={SNIPPETS.signals} />
            </section>
          )}

          {tab === 'examples' && (
            <section>
              <h2 className="cg-h2">Framework integration</h2>
              <p className="cg-lead">
                Two reference setups: Django (autodiscover-based) and FastAPI
                (manual wiring). Both follow the same pattern — define the app,
                register tasks, call <code>.delay()</code> from your views.
              </p>

              <h3 className="cg-h3">Django</h3>
              <CodeBlock filename="Django · full integration" code={SNIPPETS.django} />

              <h3 className="cg-h3">FastAPI</h3>
              <CodeBlock filename="FastAPI · submit + poll pattern" code={SNIPPETS.fastapi} />

              <h3 className="cg-h3">Run it</h3>
              <Card>
                <ol className="cg-steps">
                  <li>Start your broker: <code>docker run -p 6379:6379 redis</code></li>
                  <li>Start a worker: <code>celery -A myapp worker -l info</code></li>
                  <li>(Optional) Start beat: <code>celery -A myapp beat -l info</code></li>
                  <li>(Optional) Start flower: <code>celery -A myapp flower</code> → http://localhost:5555</li>
                  <li>Run your app and call <code>task.delay(...)</code></li>
                </ol>
              </Card>
            </section>
          )}

          {tab === 'practices' && (
            <section>
              <h2 className="cg-h2">Production best practices</h2>
              <p className="cg-lead">
                Hard-won field lessons. Most production Celery incidents trace
                back to violating one of these. Wire them in from day one.
              </p>
              <Accordion
                items={BEST_PRACTICES.map((p) => ({
                  title: p.title,
                  body: <p>{p.desc}</p>,
                }))}
              />

              <h3 className="cg-h3">Common pitfalls</h3>
              <div className="cg-grid">
                <Card accent="#ef5b5b"><h4>Passing ORM objects</h4><p className="cg-mute">They serialize poorly, may be stale by the time the worker runs them, and break when the message survives a DB migration. Pass the PK.</p></Card>
                <Card accent="#ef5b5b"><h4>Forgetting time limits</h4><p className="cg-mute">A single runaway task can pin a worker thread forever. Default behavior is no limit. Always set one.</p></Card>
                <Card accent="#ef5b5b"><h4>Sharing a single queue for everything</h4><p className="cg-mute">Long batch jobs starve short interactive ones. Split by latency class.</p></Card>
                <Card accent="#ef5b5b"><h4>Running beat in -B</h4><p className="cg-mute">Fine in dev. In production this couples beat lifecycle to one worker. Run beat as its own process.</p></Card>
                <Card accent="#ef5b5b"><h4>Ignoring acks_late</h4><p className="cg-mute">Default is ack-early — if the worker dies, the task is lost. For critical work, ack on success.</p></Card>
                <Card accent="#ef5b5b"><h4>Using pickle on untrusted brokers</h4><p className="cg-mute">Remote code execution via deserialization. Stick to JSON unless the broker is fully isolated.</p></Card>
              </div>

              <h3 className="cg-h3">When Celery isn&apos;t enough</h3>
              <Card>
                <p className="cg-mute">
                  Consider alternatives when your workload exceeds Celery&apos;s sweet spot:
                </p>
                <ul className="cg-bullets">
                  <li><b>Dramatiq / RQ</b> — simpler, smaller surface area for less complex needs.</li>
                  <li><b>Temporal / Cadence</b> — durable, deterministic workflows with built-in versioning.</li>
                  <li><b>Apache Airflow / Prefect / Dagster</b> — data engineering DAGs with rich lineage UI.</li>
                  <li><b>Kafka / Pulsar + consumers</b> — true streaming, high-throughput event processing.</li>
                  <li><b>AWS Step Functions / GCP Workflows</b> — managed serverless orchestration.</li>
                </ul>
              </Card>
            </section>
          )}
        </main>

        <footer className="cg-footer">
          <div>celery · field manual · interactive reference</div>
          <div className="cg-foot-meta">
            <span>v2026.05</span><span>·</span><span>portable jsx</span>
          </div>
        </footer>
      </div>
    </>
  );
}

// ---------- Styles ----------
const CSS = `
.cg-root {
  --bg: #0a0d0a;
  --surface: #131814;
  --elevated: #1a201d;
  --border: #2a342e;
  --border-strong: #3a4640;
  --text: #e8f0ea;
  --text-mute: #94a89a;
  --green: #a9bd0d;
  --cyan: #5dd2c4;
  --amber: #f5b042;
  --red: #ef5b5b;
  --font-sans: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  --font-display: 'Fraunces', Georgia, serif;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  min-height: 100vh;
  line-height: 1.55;
  font-feature-settings: 'ss01', 'cv11';
  -webkit-font-smoothing: antialiased;
}
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,800&display=swap');

.cg-root { background-image:
  radial-gradient(ellipse at top, rgba(169,189,13,0.04), transparent 60%),
  radial-gradient(ellipse at bottom, rgba(93,210,196,0.03), transparent 60%);
}
.cg-root * { box-sizing: border-box; }
.cg-root code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: rgba(169,189,13,0.08);
  color: var(--green);
  padding: 1px 6px;
  border-radius: 4px;
}
.cg-root a { color: var(--cyan); }

/* HEADER */
.cg-header {
  padding: 40px 56px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cg-brand { display: flex; align-items: center; gap: 18px; }
.cg-logo {
  width: 56px; height: 56px;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  display: grid; place-items: center;
  background: var(--surface);
}
.cg-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--text-mute);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.cg-h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(34px, 4.5vw, 56px);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1;
}
.cg-h1 span {
  color: var(--green);
  font-style: italic;
  font-weight: 600;
  font-size: 0.72em;
  margin-left: 8px;
}
.cg-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text);
}
.cg-meta > div {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(19,24,20,0.6);
}
.cg-meta span {
  color: var(--text-mute);
  margin-right: 10px;
  letter-spacing: 0.1em;
}

/* TABS */
.cg-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 16px 56px;
  border-bottom: 1px solid var(--border);
  background: rgba(10,13,10,0.6);
  backdrop-filter: blur(6px);
  position: sticky; top: 0; z-index: 5;
}
.cg-tab {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-mute);
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cg-tab:hover { color: var(--text); background: rgba(169,189,13,0.05); }
.cg-tab.is-active {
  color: var(--green);
  background: rgba(169,189,13,0.08);
  border-color: rgba(169,189,13,0.3);
}

/* MAIN */
.cg-main {
  padding: 48px 56px 80px;
  max-width: 1240px;
  margin: 0 auto;
}
.cg-main section { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.cg-h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 40px);
  margin: 0 0 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.cg-h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 22px;
  margin: 44px 0 16px;
  color: var(--text);
  letter-spacing: -0.005em;
}
.cg-h3::before {
  content: '§';
  color: var(--green);
  margin-right: 10px;
  font-style: italic;
  opacity: 0.6;
}
.cg-h4 { font-size: 15px; margin: 0 0 8px; font-weight: 600; letter-spacing: 0.01em; }
.cg-lead {
  font-size: 17px;
  color: var(--text);
  max-width: 78ch;
  margin: 0 0 28px;
  opacity: 0.92;
}
.cg-mute { color: var(--text-mute); font-size: 14px; margin: 6px 0; }

/* STATS */
.cg-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 24px 0 36px;
}
.cg-stats > div {
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  display: flex; flex-direction: column; gap: 4px;
}
.cg-stats b {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
  color: var(--green);
  line-height: 1;
}
.cg-stats span { font-family: var(--font-mono); font-size: 11px; color: var(--text-mute); letter-spacing: 0.08em; text-transform: uppercase; }

/* GRID & CARD */
.cg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.cg-twocol {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 14px;
}
.cg-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--border-strong);
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.cg-card:hover { border-color: var(--border-strong); }
.cg-card h4 { margin: 0 0 6px; font-weight: 600; font-size: 15px; }
.cg-card details { margin-top: 8px; font-size: 14px; }
.cg-card details summary {
  cursor: pointer;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cg-card details summary::marker { content: ''; }
.cg-card details summary::before { content: '↳ '; opacity: 0.7; }
.cg-card details p { color: var(--text-mute); margin: 8px 0 0; font-size: 14px; }

.cg-concept-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.cg-glyph {
  font-size: 22px;
  color: var(--green);
  width: 36px; height: 36px;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  display: grid; place-items: center;
  background: rgba(169,189,13,0.05);
}

.cg-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--green);
  background: rgba(169,189,13,0.1);
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

/* BULLETS / DECISIONS */
.cg-bullets, .cg-decision, .cg-steps {
  margin: 12px 0;
  padding-left: 0;
  list-style: none;
}
.cg-bullets li, .cg-decision li, .cg-steps li {
  padding-left: 28px;
  position: relative;
  margin: 10px 0;
  font-size: 15px;
}
.cg-bullets li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--green);
  font-family: var(--font-mono);
}
.cg-decision li::before {
  content: '◆';
  position: absolute;
  left: 4px;
  color: var(--cyan);
  font-size: 10px;
  top: 6px;
}
.cg-steps { counter-reset: step; }
.cg-steps li {
  counter-increment: step;
  padding-left: 38px;
}
.cg-steps li::before {
  content: counter(step, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 2px;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* TABLE */
.cg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.cg-table th, .cg-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.cg-table th {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-mute);
  text-transform: uppercase;
  font-weight: 500;
}
.cg-table tbody tr:last-child td { border-bottom: none; }
.cg-table tbody tr:hover { background: rgba(169,189,13,0.03); }
.cg-table-tight td, .cg-table-tight th { padding: 7px 12px; font-size: 13px; }
.cg-table-tight td:first-child { white-space: nowrap; }

/* CODE BLOCK */
.cg-code {
  margin: 18px 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: #0d110e;
}
.cg-code-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--elevated);
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
}
.cg-code-dots { display: inline-flex; gap: 6px; }
.cg-code-dots i {
  display: inline-block;
  width: 11px; height: 11px;
  border-radius: 50%;
}
.cg-code-file {
  flex: 1;
  color: var(--text-mute);
}
.cg-code-file em {
  color: var(--green);
  font-style: normal;
  margin-left: 10px;
}
.cg-code-copy {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-mute);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  transition: all 0.15s;
}
.cg-code-copy:hover { color: var(--green); border-color: var(--green); }
.cg-code-body {
  margin: 0;
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  color: var(--text);
  overflow-x: auto;
  white-space: pre;
  tab-size: 4;
}
.cg-syn-k { color: #f0a8d0; }
.cg-syn-s { color: #c4d96a; }
.cg-syn-c { color: #5e6e63; font-style: italic; }
.cg-syn-d { color: var(--amber); }
.cg-syn-b { color: var(--cyan); }
.cg-syn-n { color: #d4906a; }

/* SVG */
.cg-svg { width: 100%; height: auto; display: block; }
.cg-svg-mini { width: 100%; max-width: 380px; height: auto; display: block; margin: 8px auto 16px; }

/* CANVAS GRID */
.cg-canvas {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
.cg-canvas-head {
  display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
}
.cg-canvas-head h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 22px;
  margin: 0;
}
.cg-pill {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}
.cg-pill-green { color: var(--green); background: rgba(169,189,13,0.1); border: 1px solid rgba(169,189,13,0.3); }
.cg-pill-cyan { color: var(--cyan); background: rgba(93,210,196,0.1); border: 1px solid rgba(93,210,196,0.3); }
.cg-pill-amber { color: var(--amber); background: rgba(245,176,66,0.1); border: 1px solid rgba(245,176,66,0.3); }

/* ACCORDION */
.cg-acc { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
.cg-acc-item {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
  transition: border-color 0.2s;
}
.cg-acc-item.is-open { border-color: rgba(169,189,13,0.4); }
.cg-acc-head {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text);
  padding: 14px 18px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 500;
}
.cg-acc-head:hover { background: rgba(169,189,13,0.04); }
.cg-acc-title { display: flex; align-items: center; gap: 12px; }
.cg-acc-title::before {
  content: '';
  width: 6px; height: 6px;
  background: var(--green);
  border-radius: 50%;
  display: inline-block;
}
.cg-acc-icon {
  font-family: var(--font-mono);
  color: var(--green);
  font-size: 18px;
  width: 20px; text-align: center;
}
.cg-acc-body {
  padding: 0 18px 16px 36px;
  color: var(--text-mute);
  font-size: 14.5px;
  line-height: 1.6;
}
.cg-acc-body p { margin: 0; }

/* FOOTER */
.cg-footer {
  border-top: 1px solid var(--border);
  padding: 24px 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-mute);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cg-foot-meta { display: flex; gap: 10px; }

/* RESPONSIVE */
@media (max-width: 720px) {
  .cg-header, .cg-tabs, .cg-main, .cg-footer { padding-left: 24px; padding-right: 24px; }
  .cg-tabs { gap: 2px; }
  .cg-tab { padding: 6px 10px; font-size: 11px; }
  .cg-canvas { grid-template-columns: 1fr; }
}
`;
