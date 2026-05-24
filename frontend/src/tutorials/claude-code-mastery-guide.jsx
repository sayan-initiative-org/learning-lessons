import React, { useState } from 'react';
import {
  Terminal, Layers, ListChecks, Code2, BookMarked,
  Copy, Check, ChevronDown, AlertTriangle, CheckCircle2,
  FileText, Wrench, Server, Workflow, ShieldCheck,
  Boxes, Sparkles, ArrowRight, X, Compass, Zap, Brain
} from 'lucide-react';

const P = {
  bg: '#0a0e1a',
  bgSoft: '#10151f',
  card: '#161c2a',
  cardHi: '#1c2436',
  border: '#262e44',
  borderHi: '#3a4664',
  text: '#e8ecf3',
  textSoft: '#9aa3b8',
  textMute: '#6b7489',
  amber: '#ffae5c',
  amberSoft: 'rgba(255, 174, 92, 0.12)',
  amberLine: 'rgba(255, 174, 92, 0.32)',
  lime: '#86d96a',
  limeSoft: 'rgba(134, 217, 106, 0.12)',
  limeLine: 'rgba(134, 217, 106, 0.32)',
  cyan: '#5cc8ff',
  cyanSoft: 'rgba(92, 200, 255, 0.12)',
  cyanLine: 'rgba(92, 200, 255, 0.32)',
  rose: '#ff7a96',
  roseSoft: 'rgba(255, 122, 150, 0.12)',
  roseLine: 'rgba(255, 122, 150, 0.32)',
};

const fontStack = `'IBM Plex Sans', system-ui, sans-serif`;
const monoStack = `'JetBrains Mono', ui-monospace, monospace`;
const displayStack = `'Instrument Serif', Georgia, serif`;

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const colorMap = {
  amber: { c: P.amber, soft: P.amberSoft, line: P.amberLine },
  lime: { c: P.lime, soft: P.limeSoft, line: P.limeLine },
  cyan: { c: P.cyan, soft: P.cyanSoft, line: P.cyanLine },
  rose: { c: P.rose, soft: P.roseSoft, line: P.roseLine },
};

// ─── DATA ───────────────────────────────────────────────────────────

const LAYERS = [
  {
    id: 'claude-md',
    name: 'CLAUDE.md',
    role: 'Constitution',
    icon: BookMarked,
    color: 'amber',
    desc: 'Project constants. Loaded every single session.',
    detail: 'Lives at repo root (project) or ~/.claude/ (user). Holds build/lint/test commands, conventions, no-touch zones. Keep it under ~500 tokens — drift increases when this file balloons. Long instructions belong in skills.',
    when: 'Always have one. The very first thing Claude reads.',
    scope: 'Always-on',
  },
  {
    id: 'skills',
    name: 'Skills',
    role: 'Playbooks',
    icon: Sparkles,
    color: 'lime',
    desc: 'On-demand workflow packages. Loaded only when invoked.',
    detail: 'Directory at .claude/skills/<name>/SKILL.md (project) or ~/.claude/skills/<name>/SKILL.md (user). YAML frontmatter with name (≤64 chars, lowercase/hyphens) and description (≤1024 chars). Body under 500 lines. Can bundle scripts/, references/, assets/ for progressive disclosure.',
    when: 'You catch yourself pasting the same playbook into chat 3+ times.',
    scope: 'On-demand',
  },
  {
    id: 'commands',
    name: 'Slash commands',
    role: 'Macros',
    icon: Terminal,
    color: 'lime',
    desc: 'Single-file prompt shortcuts you invoke deliberately.',
    detail: 'Files at .claude/commands/<name>.md. Use $ARGUMENTS for parameters. Tab-complete in terminal. Skills support the same frontmatter and are now recommended over commands for richer workflows.',
    when: 'Repeated one-shot prompts where invocation should be explicit and discoverable.',
    scope: 'Explicit',
  },
  {
    id: 'subagents',
    name: 'Subagents',
    role: 'Workers',
    icon: Workflow,
    color: 'cyan',
    desc: 'Context-isolated workers with their own window.',
    detail: 'Files at .claude/agents/<name>.md. Frontmatter: name, description, tools (allowlist, omit to inherit), model (sonnet/opus/haiku/inherit). Body becomes the system prompt. Built-ins: Explore (Haiku, read-only), Plan, General-purpose. Manage via /agents.',
    when: 'Heavy reads, parallel research, sandboxed tool calls, big outputs that would pollute main context.',
    scope: 'Spawned',
  },
  {
    id: 'hooks',
    name: 'Hooks',
    role: 'Guardrails',
    icon: ShieldCheck,
    color: 'rose',
    desc: 'Deterministic scripts on lifecycle events.',
    detail: 'Configured in .claude/settings.json (or in skill/subagent frontmatter for scoped hooks). Fire at 25 lifecycle points: PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, SubagentStop, PreCompact, and more. Exit code 2 blocks the action.',
    when: 'You need a guarantee, not a probability — formatting, blocking, logging, audit trails.',
    scope: 'Lifecycle',
  },
  {
    id: 'mcp',
    name: 'MCP servers',
    role: 'Capabilities',
    icon: Server,
    color: 'cyan',
    desc: 'External system integrations via Model Context Protocol.',
    detail: 'Added via `claude mcp add <name> -- <cmd>`. Tool search is default-on (Sonnet 4+/Opus 4+): MCP tools are deferred and discovered on demand. Server instructions in the tool description (≤2KB) help Claude know when to search.',
    when: 'Claude needs to read or write something outside the repo — GitHub, Postgres, JIRA, Context7, Sentry.',
    scope: 'External',
  },
  {
    id: 'plugins',
    name: 'Plugins',
    role: 'Distribution',
    icon: Boxes,
    color: 'amber',
    desc: 'Bundles of skills + agents + hooks + MCP for sharing.',
    detail: 'Package a reusable combo so teammates install it in one command. Best path when a setup should propagate across team or projects.',
    when: 'You have a working combo that should propagate. Don\'t package speculatively.',
    scope: 'Shared',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Install and verify',
    body: 'Get the CLI on your machine and confirm it can talk to Anthropic.',
    code: `npm install -g @anthropic-ai/claude-code
claude doctor      # health check
claude --version`,
    note: 'Requires Node.js. If doctor flags anything, fix it before going further — most pain downstream traces back to a half-configured install.',
  },
  {
    n: '02',
    title: 'Initialize the repo',
    body: 'Scaffold the .claude/ directory and a starter CLAUDE.md.',
    code: `cd path/to/your/project
claude
> /init`,
    note: 'The /init slash command auto-generates a starter CLAUDE.md by scanning your repo. Treat it as a draft, not the final form.',
  },
  {
    n: '03',
    title: 'Hand-write CLAUDE.md',
    body: 'Your agent\'s constitution. Build/lint/test commands, conventions, no-touch zones.',
    code: `# Project: sdlc-copilot

## Stack
- Python 3.11, LangGraph, Azure OpenAI, Redis, Neo4j
- Pytest + DeepEval + RAGAS for evals

## Commands
- Install:  uv pip install -e .
- Lint:     ruff check . --fix
- Test:     pytest -x --tb=short
- Eval:     python -m evals.run --suite golden

## Conventions
- Type hints everywhere; mypy --strict in CI
- No business logic in graph nodes — extract to services/
- Never commit .env, *.pkl, /artifacts/

## No-touch
- /migrations/  — generate via alembic only
- /eval_reports/ — append-only`,
    note: 'Keep it under ~500 tokens. The agent re-reads it every session, so density matters more than completeness. Move detail into skills.',
  },
  {
    n: '04',
    title: 'Plan your .claude/ layout',
    body: 'Decide upfront what lives where. Layout discipline scales; ad-hoc files don\'t.',
    code: `.claude/
├── settings.json          # hooks, permissions
├── CLAUDE.md              # already at repo root
├── skills/
│   ├── rag-eval/
│   │   ├── SKILL.md
│   │   ├── scripts/run.py
│   │   └── references/rubric.md
│   └── pr-checklist/
│       └── SKILL.md
├── agents/
│   ├── retrieval-reviewer.md
│   ├── eval-runner.md
│   └── prompt-auditor.md
├── commands/
│   ├── review-pr.md
│   └── ship.md
└── .mcp.json              # MCP server config`,
    note: 'Project scope wins over user scope on name collisions. Use user scope (~/.claude/) for things you want everywhere.',
  },
  {
    n: '05',
    title: 'Author your first skill',
    body: 'A skill is a folder with SKILL.md. Frontmatter tells Claude when to use it; body is the playbook.',
    code: `---
name: rag-eval
description: Run RAG evaluation suite with golden dataset, generate scored report. Use when the user asks to evaluate retrieval quality, run RAGAS, or check eval metrics.
allowed-tools: Read, Bash(python:*), Write
---

# RAG Evaluation

## When to invoke
User asks: "evaluate retrieval", "run RAGAS", "score this RAG", or commits to /chunking/.

## Steps
1. Read evals/golden/v3.jsonl — confirm 200+ rows
2. Run: \`python -m evals.run --suite golden --judge gpt-4o\`
3. Parse JSON output; flag any dim below 0.75
4. Write report to evals/reports/<date>.md using assets/report.template.md
5. Summarize: top 3 wins, top 3 regressions, recommended next action`,
    note: 'Body under 500 lines. Description (≤1024 chars) is what triggers invocation — be specific about triggers and outcomes.',
  },
  {
    n: '06',
    title: 'Add slash commands for explicit macros',
    body: 'Use for prompts you invoke deliberately by name.',
    code: `# .claude/commands/review-pr.md

Fetch the PR diff for $ARGUMENTS using \`gh pr diff $ARGUMENTS\`.

Review for:
- Logic errors and edge cases
- Security issues (auth, input validation, secrets)
- Missing error handling
- Test coverage gaps

Do NOT comment on style or naming — ruff handles those.

Output as a markdown checklist with severity labels.`,
    note: 'Invoke with /review-pr 1234. Slash commands shine when you want explicit, discoverable invocation in the terminal.',
  },
  {
    n: '07',
    title: 'Define subagents for context isolation',
    body: 'Spin up specialists that work in their own context window and return only the result.',
    code: `# .claude/agents/eval-runner.md

---
name: eval-runner
description: Use proactively to execute RAG eval suites and return only the failing dimensions with delta vs last run. Do not return full eval output.
tools: Read, Bash, Grep
model: sonnet
---

You are an evaluation runner. Your single job:

1. Run the requested eval suite via \`python -m evals.run --suite <name>\`.
2. Parse the JSON report.
3. Return ONLY: failing dimensions, score deltas vs last 3 runs, and one-line root-cause hypotheses.
4. Never return raw eval output — the main agent does not need it.

Output format:
\`\`\`
FAILED: <dim> | <score> | Δ <delta> | hypothesis: <one line>
\`\`\``,
    note: 'Subagent omits "full output" so main context stays clean. Use Haiku for cheap classifiers, Sonnet for review, Opus only when reasoning truly matters.',
  },
  {
    n: '08',
    title: 'Configure hooks for deterministic guardrails',
    body: 'Code that runs on lifecycle events. Not model judgement — actual scripts.',
    code: `// .claude/settings.json

{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/scripts/block-dangerous.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command",
            "command": "ruff format $CLAUDE_FILE_PATHS && ruff check --fix $CLAUDE_FILE_PATHS" }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          { "type": "command",
            "command": "git status --short && git log -5 --oneline" }
        ]
      }
    ]
  }
}`,
    note: 'Exit code 2 blocks the action and surfaces the message. PreToolUse for bash gates, PostToolUse for formatters, SessionStart for context priming.',
  },
  {
    n: '09',
    title: 'Wire MCP servers for external capabilities',
    body: 'Connect Claude to systems outside your repo. Tool search keeps context clean.',
    code: `# Add a Postgres MCP for live schema introspection
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres \\
  "postgresql://user:pass@localhost/sdlc_copilot"

# Add Context7 for live library docs
claude mcp add context7 -- npx -y @upstash/context7-mcp

# Add GitHub
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# Verify
claude mcp list`,
    note: 'Tool search is default-on for Sonnet 4+/Opus 4+: tools are deferred and only loaded when Claude searches for them. Add many servers without bloating context.',
  },
  {
    n: '10',
    title: 'Bundle into a plugin (when it\'s reusable)',
    body: 'Package a working combo so the team installs it in one command.',
    code: `# Plugin structure
my-team-plugin/
├── plugin.json
├── skills/
│   └── rag-eval/SKILL.md
├── agents/
│   └── eval-runner.md
├── hooks/
│   └── pre-commit.sh
└── mcp/
    └── postgres.json

# Install across team
claude plugin install ./my-team-plugin`,
    note: 'Only package after the combo has proved itself in your own workflow. Premature plugins fossilize bad patterns.',
  },
  {
    n: '11',
    title: 'Add observability',
    body: 'Audit trail for what the agent did, what it cost, and where it went wrong.',
    code: `// .claude/settings.json — observability hooks

{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          { "type": "command",
            "command": "echo \\"$(date -Iseconds) $CLAUDE_TOOL_NAME $CLAUDE_TOOL_DURATION_MS\\" >> .claude/audit.jsonl" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/scripts/log-subagent-cost.py" }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          { "type": "command",
            "command": "cp $CLAUDE_TRANSCRIPT_FILE .claude/transcripts/$(date +%Y%m%d-%H%M%S).jsonl" }
        ]
      }
    ]
  }
}`,
    note: 'Same instinct as Arize Phoenix — capture spans, durations, and outcomes. PreCompact is the cheap insurance policy against losing useful context.',
  },
  {
    n: '12',
    title: 'Iterate via the repeat-rule',
    body: 'Don\'t add skills/agents speculatively. Discipline beats sprawl.',
    code: `THE RULE OF 3
─────────────
Manual    1st time   → just do it
Manual    2nd time   → note it
Manual    3rd time   → THEN make it a skill / command / agent

Quarterly review:
  → Which skills triggered? (check audit.jsonl)
  → Which never triggered? → delete or fix description
  → Which agents ran out of context? → split or narrow
  → Which hooks fired noisily? → tighten matchers`,
    note: 'Skill sprawl quietly tanks performance. Every unused skill is description bloat the model has to ignore. Prune monthly.',
  },
];

const DECISIONS = [
  { q: 'You keep pasting the same multi-step playbook into chat', a: 'Skill', why: 'Loads on demand. Body up to 500 lines. Can bundle scripts and references.' },
  { q: 'You want one specific prompt with tab-complete in terminal', a: 'Slash command', why: 'Explicit invocation, $ARGUMENTS for params, discoverable via /.' },
  { q: 'A task produces huge output that would pollute main context', a: 'Subagent', why: 'Runs in its own context window. Returns only the distilled result.' },
  { q: 'You need to guarantee something happens (not just hope)', a: 'Hook', why: 'Deterministic shell or script. Exit code 2 can block. No model interpretation.' },
  { q: 'Claude needs to read or write a system outside the repo', a: 'MCP server', why: 'Postgres, GitHub, JIRA, Context7. Tool search keeps context clean.' },
  { q: 'You have a combo that should propagate to teammates', a: 'Plugin', why: 'Bundles skills + agents + hooks + MCP into one installable unit.' },
  { q: 'A rule applies to every session, every time', a: 'CLAUDE.md', why: 'Always-on. But keep it small — drift grows with size.' },
  { q: 'You need parallel research across 3 independent questions', a: 'Multiple subagents', why: 'Spawn in parallel, each in its own context. Main agent synthesizes.' },
];

const BEST = {
  do: [
    { t: 'Keep CLAUDE.md under 500 tokens', d: 'Density beats completeness. Drift increases with size.' },
    { t: 'Write skill descriptions as triggers', d: 'Description is the trigger. Be specific about when, what, and why.' },
    { t: 'Restrict subagent tools explicitly', d: 'Allowlist with tools field. Inherit-all is fine for prototypes, dangerous in prod.' },
    { t: 'Use cheaper models where reasoning is light', d: 'Haiku for classifiers, Sonnet for review, Opus when it actually matters.' },
    { t: 'Treat hooks as code, not config', d: 'Version them. Test them. They block real actions.' },
    { t: 'Log everything via PostToolUse', d: 'audit.jsonl is your single best debugging asset when things go sideways.' },
    { t: 'Prune skills quarterly', d: 'Unused skills are silent description bloat. Delete or fix.' },
    { t: 'Read the SKILL.md before invoking complex workflows', d: 'Even Claude does this — bundled scripts encode environmental constraints.' },
  ],
  dont: [
    { t: 'Don\'t put long reference material in CLAUDE.md', d: 'Move it to references/ inside a skill. Loads only when needed.' },
    { t: 'Don\'t create skills speculatively', d: 'Wait until you\'ve manually done the task 3 times. Premature skills fossilize bad patterns.' },
    { t: 'Don\'t spawn subagents for trivial tasks', d: 'Subagents are not free. Use them when context isolation genuinely matters.' },
    { t: 'Don\'t use hooks to replace logic that belongs in CLAUDE.md', d: 'Hooks are guardrails, not instructions. Don\'t over-engineer.' },
    { t: 'Don\'t skip /agents UI on first creation', d: 'It validates frontmatter and avoids YAML traps. Switch to files once you know the shape.' },
    { t: 'Don\'t leave MCP servers running you don\'t use', d: 'Even with tool search, every server adds startup latency and surface area.' },
    { t: 'Don\'t package plugins before they\'re battle-tested', d: 'A plugin is a contract with your team. Make sure it earns one.' },
    { t: 'Don\'t silence hooks that fire too often', d: 'Tighten the matcher instead. Noisy hooks usually mean wrong scope.' },
  ],
};

const CHEATSHEET = [
  {
    cat: 'Install & init',
    rows: [
      ['npm i -g @anthropic-ai/claude-code', 'Install CLI'],
      ['claude doctor', 'Health check'],
      ['claude /init', 'Scaffold .claude/'],
    ],
  },
  {
    cat: 'Session',
    rows: [
      ['/clear', 'Clear conversation'],
      ['/compact', 'Compress context'],
      ['/context', 'Show context window usage'],
      ['/rewind', 'Revert to previous state'],
    ],
  },
  {
    cat: 'Skills & agents',
    rows: [
      ['/skill-name', 'Invoke skill explicitly'],
      ['/agents', 'Manage subagents (UI)'],
      ['/hooks', 'List configured hooks'],
    ],
  },
  {
    cat: 'MCP',
    rows: [
      ['claude mcp add <n> -- <cmd>', 'Add server'],
      ['claude mcp list', 'List servers'],
      ['claude mcp remove <n>', 'Remove server'],
    ],
  },
  {
    cat: 'Debug',
    rows: [
      ['/doctor', 'Diagnose install'],
      ['/debug', 'Verbose tool trace'],
      ['/hooks', 'Read-only hooks browser'],
    ],
  },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────

function Pill({ children, color = 'cyan', tone = 'soft' }) {
  const c = colorMap[color] || colorMap.cyan;
  return (
    <span style={{
      fontFamily: monoStack,
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 3,
      background: tone === 'soft' ? c.soft : 'transparent',
      border: tone === 'soft' ? 'none' : `1px solid ${c.line}`,
      color: c.c,
    }}>{children}</span>
  );
}

function CodeBlock({ code, lang = 'bash', id }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{
      position: 'relative',
      background: P.bg,
      border: `1px solid ${P.border}`,
      borderRadius: 4,
      marginTop: 12,
      marginBottom: 4,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderBottom: `1px solid ${P.border}`,
        background: P.bgSoft,
      }}>
        <span style={{
          fontFamily: monoStack,
          fontSize: 10,
          letterSpacing: '0.1em',
          color: P.textMute,
          textTransform: 'uppercase',
        }}>{lang}</span>
        <button onClick={handleCopy} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: copied ? P.lime : P.textSoft,
          fontFamily: monoStack,
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '2px 6px',
        }}>
          {copied ? <Check size={12}/> : <Copy size={12}/>}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '14px 16px',
        overflowX: 'auto',
        fontFamily: monoStack,
        fontSize: 12.5,
        lineHeight: 1.65,
        color: P.text,
      }}>{code}</pre>
    </div>
  );
}

function SectionHeader({ eyebrow, title, kicker }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: monoStack,
        fontSize: 11,
        letterSpacing: '0.18em',
        color: P.amber,
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily: displayStack,
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 400,
        lineHeight: 1.05,
        margin: 0,
        marginBottom: kicker ? 16 : 0,
        color: P.text,
        letterSpacing: '-0.01em',
      }}>{title}</h2>
      {kicker && (
        <p style={{
          fontFamily: fontStack,
          fontSize: 15,
          lineHeight: 1.6,
          color: P.textSoft,
          maxWidth: 680,
          margin: 0,
        }}>{kicker}</p>
      )}
    </div>
  );
}

function LayerCard({ layer, expanded, onToggle, idx }) {
  const c = colorMap[layer.color];
  const Icon = layer.icon;
  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded ? P.cardHi : P.card,
        border: `1px solid ${expanded ? c.line : P.border}`,
        borderLeft: `3px solid ${c.c}`,
        borderRadius: 4,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 200ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          background: c.soft,
          padding: 9,
          borderRadius: 4,
          flexShrink: 0,
        }}>
          <Icon size={18} color={c.c} strokeWidth={1.5}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{
                fontFamily: monoStack,
                fontSize: 10,
                color: P.textMute,
              }}>0{idx + 1}</span>
              <h3 style={{
                fontFamily: displayStack,
                fontSize: 24,
                fontWeight: 400,
                margin: 0,
                color: P.text,
                letterSpacing: '-0.005em',
              }}>{layer.name}</h3>
              <span style={{
                fontFamily: fontStack,
                fontSize: 13,
                color: c.c,
                fontStyle: 'italic',
              }}>— {layer.role}</span>
            </div>
            <Pill color={layer.color} tone="outline">{layer.scope}</Pill>
          </div>
          <p style={{
            fontFamily: fontStack,
            fontSize: 14,
            lineHeight: 1.55,
            color: P.textSoft,
            margin: '8px 0 0 0',
          }}>{layer.desc}</p>
          {expanded && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${P.border}` }}>
              <p style={{
                fontFamily: fontStack,
                fontSize: 14,
                lineHeight: 1.65,
                color: P.text,
                margin: '0 0 14px 0',
              }}>{layer.detail}</p>
              <div style={{
                background: P.bg,
                padding: '12px 14px',
                borderRadius: 4,
                borderLeft: `2px solid ${c.c}`,
              }}>
                <div style={{
                  fontFamily: monoStack,
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: c.c,
                  marginBottom: 6,
                }}>Use when</div>
                <div style={{
                  fontFamily: fontStack,
                  fontSize: 13.5,
                  color: P.text,
                  lineHeight: 1.55,
                }}>{layer.when}</div>
              </div>
            </div>
          )}
        </div>
        <ChevronDown
          size={18}
          color={P.textMute}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 200ms',
            flexShrink: 0,
            marginTop: 6,
          }}
        />
      </div>
    </div>
  );
}

function StepCard({ step, expanded, onToggle, isLast }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 56, paddingBottom: isLast ? 0 : 24 }}>
      {/* vertical line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: 19,
          top: 40,
          bottom: 0,
          width: 1,
          background: P.border,
        }}/>
      )}
      {/* number node */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: 4,
        background: expanded ? P.amber : P.bgSoft,
        border: `1px solid ${expanded ? P.amber : P.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: monoStack,
        fontSize: 13,
        fontWeight: 600,
        color: expanded ? P.bg : P.amber,
        transition: 'all 200ms',
      }}>{step.n}</div>

      <div
        onClick={onToggle}
        style={{
          background: P.card,
          border: `1px solid ${expanded ? P.amberLine : P.border}`,
          borderRadius: 4,
          padding: '14px 18px',
          cursor: 'pointer',
          transition: 'all 200ms',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <h3 style={{
            fontFamily: displayStack,
            fontSize: 21,
            fontWeight: 400,
            margin: 0,
            color: P.text,
            lineHeight: 1.25,
          }}>{step.title}</h3>
          <ChevronDown
            size={16}
            color={P.textMute}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 200ms',
              flexShrink: 0,
              marginTop: 6,
            }}
          />
        </div>
        <p style={{
          fontFamily: fontStack,
          fontSize: 13.5,
          lineHeight: 1.55,
          color: P.textSoft,
          margin: '6px 0 0 0',
        }}>{step.body}</p>
        {expanded && (
          <div style={{ marginTop: 4 }}>
            <CodeBlock code={step.code} lang={step.n === '01' || step.n === '02' || step.n === '09' || step.n === '10' ? 'bash' : step.n === '08' || step.n === '11' ? 'json' : step.n === '03' || step.n === '12' ? 'text' : 'markdown'}/>
            <div style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              marginTop: 14,
              padding: '12px 14px',
              background: P.amberSoft,
              borderLeft: `2px solid ${P.amber}`,
              borderRadius: 3,
            }}>
              <Zap size={14} color={P.amber} style={{ marginTop: 3, flexShrink: 0 }}/>
              <div style={{
                fontFamily: fontStack,
                fontSize: 13,
                lineHeight: 1.55,
                color: P.text,
              }}>{step.note}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionRow({ d, idx }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: 18,
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: idx === DECISIONS.length - 1 ? 'none' : `1px solid ${P.border}`,
    }}>
      <div style={{
        fontFamily: fontStack,
        fontSize: 14,
        lineHeight: 1.5,
        color: P.text,
      }}>
        <span style={{
          fontFamily: monoStack,
          fontSize: 10,
          color: P.textMute,
          marginRight: 10,
        }}>IF</span>
        {d.q}
      </div>
      <ArrowRight size={16} color={P.amber} style={{ flexShrink: 0 }}/>
      <div>
        <div style={{
          fontFamily: displayStack,
          fontSize: 20,
          color: P.amber,
          fontStyle: 'italic',
          marginBottom: 4,
        }}>{d.a}</div>
        <div style={{
          fontFamily: fontStack,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: P.textSoft,
        }}>{d.why}</div>
      </div>
    </div>
  );
}

function PracticeCard({ item, kind }) {
  const isDo = kind === 'do';
  const Icon = isDo ? CheckCircle2 : X;
  const c = isDo ? P.lime : P.rose;
  const soft = isDo ? P.limeSoft : P.roseSoft;
  return (
    <div style={{
      background: P.card,
      border: `1px solid ${P.border}`,
      borderLeft: `3px solid ${c}`,
      borderRadius: 4,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{
        background: soft,
        padding: 6,
        borderRadius: 3,
        flexShrink: 0,
      }}>
        <Icon size={14} color={c} strokeWidth={2}/>
      </div>
      <div>
        <div style={{
          fontFamily: fontStack,
          fontSize: 14,
          fontWeight: 500,
          color: P.text,
          marginBottom: 4,
          lineHeight: 1.4,
        }}>{item.t}</div>
        <div style={{
          fontFamily: fontStack,
          fontSize: 12.5,
          lineHeight: 1.55,
          color: P.textSoft,
        }}>{item.d}</div>
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────

export default function ClaudeCodeMasteryGuide() {
  const [tab, setTab] = useState('mental-model');
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [expandedStep, setExpandedStep] = useState('01');

  const tabs = [
    { id: 'mental-model', label: 'Mental Model', icon: Layers },
    { id: 'setup', label: '12-Step Setup', icon: ListChecks },
    { id: 'decisions', label: 'Decision Tree', icon: Compass },
    { id: 'practice', label: 'Best Practices', icon: ShieldCheck },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: Terminal },
  ];

  return (
    <div style={{
      background: P.bg,
      minHeight: '100vh',
      color: P.text,
      fontFamily: fontStack,
      position: 'relative',
    }}>
      <link rel="stylesheet" href={FONT_LINK} />

      {/* subtle grain overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle at 1px 1px, ${P.borderHi}15 1px, transparent 0)`,
        backgroundSize: '32px 32px',
        opacity: 0.4,
      }}/>

      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* HEADER */}
        <header style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
            fontFamily: monoStack,
            fontSize: 11,
            letterSpacing: '0.2em',
            color: P.amber,
            textTransform: 'uppercase',
          }}>
            <div style={{ width: 24, height: 1, background: P.amber }}/>
            Field Manual · v1
          </div>
          <h1 style={{
            fontFamily: displayStack,
            fontSize: 'clamp(44px, 8vw, 76px)',
            fontWeight: 400,
            lineHeight: 0.98,
            margin: 0,
            color: P.text,
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}>
            Claude Code,<br/>
            <span style={{ fontStyle: 'italic', color: P.amber }}>fully wired.</span>
          </h1>
          <p style={{
            fontFamily: fontStack,
            fontSize: 17,
            lineHeight: 1.55,
            color: P.textSoft,
            maxWidth: 640,
            margin: 0,
          }}>
            A practitioner's guide to setting up Claude Code the way it was designed to work — skills, subagents, hooks, MCP, plugins. Mental model first, twelve concrete setup steps second, decision logic third.
          </p>
          <div style={{
            display: 'flex',
            gap: 24,
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${P.border}`,
            flexWrap: 'wrap',
          }}>
            {[
              { k: '7', v: 'Extensibility layers' },
              { k: '12', v: 'Setup steps' },
              { k: '25', v: 'Hook lifecycle points' },
              { k: '∞', v: 'Skill ideas you\'ll abandon' },
            ].map((s, i) => (
              <div key={i} style={{ minWidth: 110 }}>
                <div style={{
                  fontFamily: displayStack,
                  fontSize: 36,
                  color: P.amber,
                  lineHeight: 1,
                }}>{s.k}</div>
                <div style={{
                  fontFamily: monoStack,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  color: P.textMute,
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}>{s.v}</div>
              </div>
            ))}
          </div>
        </header>

        {/* TAB NAV */}
        <nav style={{
          display: 'flex',
          gap: 4,
          marginBottom: 40,
          padding: 4,
          background: P.bgSoft,
          border: `1px solid ${P.border}`,
          borderRadius: 4,
          flexWrap: 'wrap',
        }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: active ? P.card : 'transparent',
                  border: active ? `1px solid ${P.border}` : '1px solid transparent',
                  borderRadius: 3,
                  cursor: 'pointer',
                  fontFamily: monoStack,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? P.amber : P.textSoft,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 150ms',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                <Icon size={13} strokeWidth={1.8}/>
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* TAB CONTENT */}
        {tab === 'mental-model' && (
          <section>
            <SectionHeader
              eyebrow="Layer 01"
              title="The seven primitives."
              kicker="Claude Code isn't one assistant talking through one long prompt — it's a layered system. Each primitive does a different job. Internalize the mapping below and almost every setup question answers itself. Tap any card to expand."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LAYERS.map((layer, i) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  idx={i}
                  expanded={expandedLayer === layer.id}
                  onToggle={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                />
              ))}
            </div>

            {/* The "tie it together" mental model */}
            <div style={{
              marginTop: 40,
              padding: 28,
              background: P.card,
              border: `1px solid ${P.border}`,
              borderLeft: `3px solid ${P.amber}`,
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: monoStack,
                fontSize: 10,
                letterSpacing: '0.18em',
                color: P.amber,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>The mapping that ties it together</div>
              <div style={{
                fontFamily: displayStack,
                fontSize: 22,
                lineHeight: 1.5,
                color: P.text,
                fontStyle: 'italic',
              }}>
                CLAUDE.md = constants · Skills = playbooks · Commands = macros · Subagents = workers · Hooks = guardrails · MCP = capabilities · Plugins = distribution.
              </div>
              <div style={{
                fontFamily: fontStack,
                fontSize: 14,
                lineHeight: 1.6,
                color: P.textSoft,
                marginTop: 14,
              }}>
                If you internalize this sentence, everything else in this guide falls out.
              </div>
            </div>
          </section>
        )}

        {tab === 'setup' && (
          <section>
            <SectionHeader
              eyebrow="Layer 02"
              title="Twelve steps, in order."
              kicker="A practical setup sequence. Anthropic doesn't ship a canonical framework — this is the order practitioners converge on. Tap any step to see the actual code, file, or config."
            />
            <div>
              {STEPS.map((step, i) => (
                <StepCard
                  key={step.n}
                  step={step}
                  isLast={i === STEPS.length - 1}
                  expanded={expandedStep === step.n}
                  onToggle={() => setExpandedStep(expandedStep === step.n ? null : step.n)}
                />
              ))}
            </div>
          </section>
        )}

        {tab === 'decisions' && (
          <section>
            <SectionHeader
              eyebrow="Layer 03"
              title="When to reach for what."
              kicker="The single most common Claude Code mistake is using the wrong primitive for the job — a hook where a skill belongs, a skill where a command would do, a subagent where a single prompt would suffice. Use this matrix as the tiebreaker."
            />
            <div style={{
              background: P.card,
              border: `1px solid ${P.border}`,
              borderRadius: 4,
              padding: '8px 24px',
            }}>
              {DECISIONS.map((d, i) => (
                <DecisionRow key={i} d={d} idx={i}/>
              ))}
            </div>

            <div style={{
              marginTop: 28,
              padding: '18px 22px',
              background: P.bgSoft,
              border: `1px dashed ${P.borderHi}`,
              borderRadius: 4,
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <Brain size={20} color={P.cyan} style={{ marginTop: 2, flexShrink: 0 }}/>
              <div>
                <div style={{
                  fontFamily: displayStack,
                  fontSize: 20,
                  color: P.text,
                  marginBottom: 6,
                  fontStyle: 'italic',
                }}>The deeper rule</div>
                <div style={{
                  fontFamily: fontStack,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: P.textSoft,
                }}>
                  Move from <span style={{ color: P.lime }}>most certain → least certain</span>. Hooks (deterministic code) and CLAUDE.md (always loaded) sit at the certain end. Subagents and skills sit in the middle — Claude judges when to invoke them. MCP and plugins sit at the open end — capability surfaces the model navigates. Bias toward certainty whenever the cost of being wrong is high.
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'practice' && (
          <section>
            <SectionHeader
              eyebrow="Layer 04"
              title="Practitioner heuristics."
              kicker="The patterns that separate a working setup from one that quietly degrades over months. Read both columns — the don'ts contain more signal than the dos."
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 28,
            }}>
              <div>
                <div style={{
                  fontFamily: monoStack,
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  color: P.lime,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <CheckCircle2 size={14}/>
                  Do
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {BEST.do.map((item, i) => (
                    <PracticeCard key={i} item={item} kind="do"/>
                  ))}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: monoStack,
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  color: P.rose,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <AlertTriangle size={14}/>
                  Don't
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {BEST.dont.map((item, i) => (
                    <PracticeCard key={i} item={item} kind="dont"/>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'cheatsheet' && (
          <section>
            <SectionHeader
              eyebrow="Layer 05"
              title="Quick reference."
              kicker="The commands you'll reach for most. Pin this tab during your first week."
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {CHEATSHEET.map((group, i) => (
                <div key={i} style={{
                  background: P.card,
                  border: `1px solid ${P.border}`,
                  borderRadius: 4,
                  padding: '18px 20px',
                }}>
                  <div style={{
                    fontFamily: monoStack,
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: P.amber,
                    textTransform: 'uppercase',
                    marginBottom: 14,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${P.border}`,
                  }}>{group.cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {group.rows.map((row, j) => (
                      <div key={j}>
                        <code style={{
                          fontFamily: monoStack,
                          fontSize: 12.5,
                          color: P.cyan,
                          display: 'block',
                          marginBottom: 3,
                          wordBreak: 'break-all',
                        }}>{row[0]}</code>
                        <div style={{
                          fontFamily: fontStack,
                          fontSize: 12.5,
                          color: P.textSoft,
                          lineHeight: 1.45,
                        }}>{row[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 36,
              padding: '20px 22px',
              background: P.card,
              border: `1px solid ${P.border}`,
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: monoStack,
                fontSize: 10,
                letterSpacing: '0.18em',
                color: P.lime,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>Sources for going deeper</div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                {[
                  ['Claude Code Overview', 'docs.claude.com/en/docs/claude-code/overview'],
                  ['Skills authoring guide', 'docs.claude.com/en/api/agent-skills'],
                  ['Subagents reference', 'docs.claude.com/en/docs/claude-code/sub-agents'],
                  ['Hooks reference', 'docs.claude.com/en/docs/claude-code/hooks'],
                  ['MCP setup', 'docs.claude.com/en/docs/claude-code/mcp'],
                ].map(([t, u], i) => (
                  <li key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingBottom: 8,
                    borderBottom: i === 4 ? 'none' : `1px solid ${P.border}`,
                  }}>
                    <span style={{ fontFamily: fontStack, fontSize: 14, color: P.text }}>{t}</span>
                    <span style={{
                      fontFamily: monoStack,
                      fontSize: 11.5,
                      color: P.textMute,
                    }}>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer style={{
          marginTop: 80,
          paddingTop: 32,
          borderTop: `1px solid ${P.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{
            fontFamily: monoStack,
            fontSize: 10,
            letterSpacing: '0.15em',
            color: P.textMute,
            textTransform: 'uppercase',
          }}>End of manual · keep iterating</div>
          <div style={{
            fontFamily: displayStack,
            fontSize: 18,
            color: P.textSoft,
            fontStyle: 'italic',
          }}>Pattern → primitive → ship.</div>
        </footer>
      </div>
    </div>
  );
}
