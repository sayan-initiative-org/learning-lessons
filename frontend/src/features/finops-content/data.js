import { C } from './theme';

// 29 LinkedIn content angles derived from the "AI Strategy, Cost & FinOps"
// study module, grouped into five segments. Each post: hook, angle (premise),
// and q (the engagement question that drives comments).
export const SEGMENTS = [
  {
    id: 'money',
    label: 'Money Matters',
    emoji: '💰',
    color: C.cyan,
    blurb: 'Unit economics & the true cost of AI',
    posts: [
      {
        n: 1,
        hook: "Your AI bill isn't your AI cost.",
        angle: 'The API invoice is the tip. Data, talent, human-in-the-loop, and guardrails are the iceberg — often the bigger spend. Walk through the 7-layer AI TCO stack.',
        q: "What's the hidden AI cost that blindsided your team's budget?",
      },
      {
        n: 2,
        hook: '$0.005 per call sounds like nothing. Multiply it by 240,000.',
        angle: "That's $1,200 — and that's one workflow, one day. Small unit costs hide big totals. Make the case for cost-per-call as a first-class metric.",
        q: 'Do you know your cost-per-call — or just your monthly total?',
      },
      {
        n: 3,
        hook: "Cost per token is a beginner's metric.",
        angle: 'The real ladder: cost per token → cost per inference → cost per outcome (per resolved ticket, per agent action, per case deflected). Where is your org on it?',
        q: "Can you state what one 'successful outcome' costs you in AI spend?",
      },
      {
        n: 4,
        hook: '98% of FinOps teams now manage AI spend. Two years ago it was 31%.',
        angle: 'AI went from experiment to line item faster than any tech category in memory. Most governance hasn’t caught up.',
        q: "Does your finance team have visibility into AI spend — or is it still 'miscellaneous cloud'?",
      },
      {
        n: 5,
        hook: "You can't govern what you can't express per unit.",
        angle: 'The one-line thesis of FinOps for AI. If cost isn’t attributable to a team, a use case, and an outcome, it’s ungoverned.',
        q: 'Who owns the AI bill in your org — engineering, finance, or nobody?',
      },
      {
        n: 6,
        hook: "Token yield rate: the metric nobody's tracking yet.",
        angle: 'Not every generated token contributes to a usable result. The share that does is your real efficiency number. Raw token counts lie.',
        q: 'Are you measuring tokens generated — or tokens that actually mattered?',
      },
    ],
  },
  {
    id: 'buildbuy',
    label: 'Build vs Buy',
    emoji: '🏗️',
    color: C.green,
    blurb: 'The decision, the math, the traps',
    posts: [
      {
        n: 7,
        hook: 'The build-vs-buy question has a number. Most teams never calculate it.',
        angle: 'The break-even volume: V* = Fixed_build ÷ (price_buy − marginal_build). Below it, buy. Above it, maybe build.',
        q: 'Have you ever run the break-even math — or decided on vibes?',
      },
      {
        n: 8,
        hook: 'A GPU at 20% utilization is more expensive than the API it replaced.',
        angle: 'Self-hosting only wins at high, steady utilization. Idle accelerators quietly destroy the business case.',
        q: "If you self-host, what's your real GPU utilization — honestly?",
      },
      {
        n: 9,
        hook: 'Build what makes you different. Buy everything else.',
        angle: "Geoffrey Moore's core-vs-context, applied to AI: buy the model, build the data moat and product around it.",
        q: 'Is your AI actually your moat — or a feature you could rent?',
      },
      {
        n: 10,
        hook: "Most 'we built our own LLM' stories should have been 'we bought one.'",
        angle: 'The prestige of building vs the economics of buying. When does in-house actually pay off?',
        q: 'What made you choose build over buy — and would you decide the same today?',
      },
      {
        n: 11,
        hook: "There's no build vs buy. There's a spectrum.",
        angle: 'Closed API → RAG/fine-tune → full self-host. Most real systems live in the messy middle.',
        q: 'Where on the buy↔build spectrum does your flagship AI feature sit?',
      },
      {
        n: 12,
        hook: "Vendor lock-in is a cost. You're just not putting it on the invoice.",
        angle: 'Switching cost, pricing power, roadmap dependency — the buy side has a bill too.',
        q: 'How much lock-in are you comfortable trading for speed?',
      },
    ],
  },
  {
    id: 'usecase',
    label: 'Use Case Derivation',
    emoji: '🎯',
    color: C.blue,
    blurb: 'Which use cases deserve to exist',
    posts: [
      {
        n: 13,
        hook: "Not every AI use case deserves to exist. Here's the test.",
        angle: 'Value per outcome must clear fully-loaded cost + margin. If it can’t, it’s a demo, not a product.',
        q: "What's a flashy AI use case you killed because the economics didn't work?",
      },
      {
        n: 14,
        hook: 'Four kinds of AI value. Only one needs to make money.',
        angle: 'Revenue-generating, cost-avoiding, risk-reducing, strategic/experimental — each has a different ROI bar. Confusing them wastes budgets.',
        q: 'Which value type is your biggest AI bet — and are you holding it to the right bar?',
      },
      {
        n: 15,
        hook: "'Strategic' is where AI budgets go to die.",
        angle: "Experimental use cases are fine — if you cap the budget explicitly. 'Strategic' without a ceiling is just unaccountable spend.",
        q: "Do your 'strategic' AI projects have a hard budget cap, or an open tab?",
      },
      {
        n: 16,
        hook: 'The best AI use case is boring, high-volume, and measurable.',
        angle: 'Cost-per-outcome only works when there’s an outcome you can count. Glamorous ≠ viable.',
        q: "What's the most 'boring' AI use case that's quietly printing ROI for you?",
      },
      {
        n: 17,
        hook: 'Inference is the cost you see. Talent is the cost that kills the project.',
        angle: 'Use case viability often dies on the people line, not the compute line.',
        q: "What's harder to fund for your AI roadmap — the GPUs or the engineers?",
      },
    ],
  },
  {
    id: 'invest',
    label: 'Investments & Governance',
    emoji: '📈',
    color: C.accent,
    blurb: 'How AI money is decided and governed',
    posts: [
      {
        n: 18,
        hook: "Your cloud FinOps playbook won't work for AI. Here's why.",
        angle: 'Workload optimization dominates cloud — it’s not even top-5 for AI. Different cost drivers, different levers.',
        q: "Are you applying cloud cost habits to AI and wondering why they don't stick?",
      },
      {
        n: 19,
        hook: 'Forecast AI spend like the weather, not the tides.',
        angle: 'High variance in early stages means shorter forecasting windows and funding you revisit often — not annual budgets set in stone.',
        q: 'How far ahead can you actually forecast your AI spend with a straight face?',
      },
      {
        n: 20,
        hook: 'Every serious AI org needs an AI Investment Council.',
        angle: 'A body that approves, tracks, and kills AI projects against defined outcomes and risk profiles. Governance is the differentiator now.',
        q: 'Who decides which AI projects live or die in your company — and on what criteria?',
      },
      {
        n: 21,
        hook: 'FinOps stopped being about cloud. That should worry you.',
        angle: "The definition officially shifted from 'value of cloud' to 'value of technology.' AI, SaaS, licensing — all in scope now.",
        q: 'Is your cost discipline keeping pace with where your spend actually is?',
      },
      {
        n: 22,
        hook: 'Cutting AI cost is easy. Cutting it without hurting quality is the job.',
        angle: 'Right-sizing models, routing, caching, prompt compression — every lever has a quality trade-off. Measure with cost-per-outcome or you’re flying blind.',
        q: 'Which optimization lever gave you savings you later regretted?',
      },
    ],
  },
  {
    id: 'maturity',
    label: 'Enterprise AI Maturity',
    emoji: '🏛️',
    color: C.violet,
    blurb: 'Mistakes, waste & self-sabotage at scale',
    posts: [
      {
        n: 23,
        hook: "Your company has 40 AI pilots and 2 in production. That's not innovation — that's a graveyard.",
        angle: 'POC purgatory is the default enterprise failure mode: proofs-of-concept that never cross into production because nobody defined the outcome or the unit economics up front.',
        q: 'How many AI pilots has your org started — and how many actually shipped?',
      },
      {
        n: 24,
        hook: 'Enterprises are buying AI platforms before they have a use case. That’s backwards.',
        angle: 'A seven-figure platform commitment, then a scramble to justify it. Value should drive the tool, not the reverse. Crawl-stage maturity dressed up as strategy.',
        q: 'Did your AI stack get chosen for a problem — or in search of one?',
      },
      {
        n: 25,
        hook: 'Big companies are running Run-stage AI spend on Crawl-stage governance.',
        angle: "Millions in AI consumption, tagged as 'miscellaneous cloud,' with no allocation, no owner, no cost-per-outcome. The spend matured; the discipline didn't.",
        q: 'If I asked your CFO what AI cost per business outcome last quarter, would there be an answer?',
      },
      {
        n: 26,
        hook: 'Enterprises measure AI by activity, not outcomes — and wonder why the ROI never shows up.',
        angle: "Number of pilots, tokens consumed, teams 'using AI' — vanity metrics. None tell you if a dollar of value was created.",
        q: "What's the difference between 'we're using AI' and 'AI is paying off' in your org?",
      },
      {
        n: 27,
        hook: "The most expensive AI mistake isn't a failed project. It's the one you can't bring yourself to kill.",
        angle: 'Sunk-cost escalation: the flagship initiative that’s over budget, under-delivering, and politically untouchable. Without a council empowered to stop projects, good money chases bad.',
        q: 'Who in your company has the authority to kill an AI project — and do they actually use it?',
      },
      {
        n: 28,
        hook: "Enterprises try to 'transform with AI' in one big bang. Maturity doesn't work that way.",
        angle: 'Crawl → Walk → Run is per-capability and incremental. The org chasing enterprise-wide transformation in a year ends up with expensive theater and no compounding capability.',
        q: 'Is your AI roadmap a moonshot — or a series of proven, widening bets?',
      },
      {
        n: 29,
        hook: 'You centralized AI to control it. Now it’s a bottleneck everyone routes around.',
        angle: 'Over-centralize and shadow AI spend explodes. Under-federate and there’s no accountability. FinOps says: enable centrally, own at the edge.',
        q: 'In your org, is AI a central team’s fiefdom, a free-for-all, or a shared-accountability model?',
      },
    ],
  },
];

export const ALL_POSTS = SEGMENTS.flatMap((s) =>
  s.posts.map((p) => ({ ...p, segId: s.id, segLabel: s.label, color: s.color, emoji: s.emoji }))
);
