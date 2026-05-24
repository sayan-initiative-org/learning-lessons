import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────
// MODULE 06 — STREAMING, PRODUCTION & OBSERVABILITY
// 4 streaming modes · async · retry · LangSmith · Phoenix · checklist
// ─────────────────────────────────────────────────────────────────────

const T = {
  bg: "#090C14", bg2: "#0F1321", bg3: "#151A2A", bg4: "#1C2235",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.13)",
  blue: "#5B8BF5", purple: "#9B6DFF", teal: "#2DD4BF",
  amber: "#F5A623", coral: "#F87171", green: "#34D399",
  text: "#E2E8F0", muted: "#64748B", dim: "#2E3A50",
};

function Code({ file, lang = "python", children }) {
  const [c, setC] = useState(false);
  return (
    <div style={{ margin: "1rem 0", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <div style={{ background: "#111827", padding: "6px 14px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: T.muted }}>{file}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 10, color: T.teal, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>{lang}</span>
          <button onClick={() => { navigator.clipboard?.writeText(children); setC(true); setTimeout(() => setC(false), 1800); }}
            style={{ background: c ? "rgba(45,212,191,.12)" : "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 5, padding: "2px 10px", fontSize: 10, color: c ? T.teal : T.muted, cursor: "pointer" }}>
            {c ? "✓" : "copy"}
          </button>
        </div>
      </div>
      <pre style={{ margin: 0, padding: "1rem 1.25rem", background: "#0D1117", overflowX: "auto", fontSize: 12.5, lineHeight: 1.78, fontFamily: "'Fira Code', monospace", color: "#ABB2BF", whiteSpace: "pre" }}>{children}</pre>
    </div>
  );
}

function Note({ type = "info", children }) {
  const s = { info: { bg: "rgba(91,139,245,.07)", bdr: T.blue, col: "#A5BFFC", icon: "💡" }, tip: { bg: "rgba(45,212,191,.07)", bdr: T.teal, col: "#6EE7D8", icon: "✅" }, warn: { bg: "rgba(245,166,35,.07)", bdr: T.amber, col: "#FDE68A", icon: "⚠️" }, pattern: { bg: "rgba(155,109,255,.07)", bdr: T.purple, col: "#C4B5FD", icon: "🏗️" } }[type];
  return <div style={{ background: s.bg, borderLeft: `3px solid ${s.bdr}`, borderRadius: "0 8px 8px 0", padding: ".85rem 1.1rem", margin: "1rem 0", fontSize: 13.5, color: s.col, lineHeight: 1.7 }}>{s.icon} {children}</div>;
}

function H({ children }) { return <h3 style={{ fontSize: "1rem", fontWeight: 600, color: T.text, margin: "1.6rem 0 .5rem" }}>{children}</h3>; }

const TABS = [
  { id: "streaming",   label: "Streaming Modes" },
  { id: "async",       label: "Async & Retry" },
  { id: "observ",      label: "Observability" },
  { id: "deploy",      label: "Deployment" },
  { id: "checklist",   label: "Prod Checklist" },
];

export default function StreamingProduction() {
  const [tab, setTab] = useState("streaming");
  const [checklist, setChecklist] = useState({});

  const checkItems = [
    { id: "recursion",  text: "Set recursion_limit=25 in every invoke/stream call" },
    { id: "async",      text: "Use async nodes (ainvoke, astream) for all LLM calls" },
    { id: "postgres",   text: "Swap MemorySaver → PostgresSaver for multi-user prod" },
    { id: "retry",      text: "Wrap LLM calls with tenacity retry (wait_exponential)" },
    { id: "maxiter",    text: "Add MAX_ITERATIONS guard in every supervisor node" },
    { id: "trim",       text: "Trim messages to last N before LLM context to avoid overflow" },
    { id: "langsmith",  text: "Enable LangSmith tracing with metadata + tags per run" },
    { id: "errhandle",  text: "Catch GraphRecursionError with graceful partial result" },
    { id: "hitl",       text: "Add HITL breakpoints before all irreversible external actions" },
    { id: "judge",      text: "Run LLM-as-Judge on every production output (score ≥ 7.5)" },
    { id: "thread",     text: "Use meaningful thread_id format: userId-sessionId-timestamp" },
    { id: "platform",   text: "Create langgraph.json for LangGraph Platform deployment" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: T.bg2, borderBottom: `1px solid ${T.border}`, padding: "1.5rem 2rem .75rem" }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: T.teal, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>MODULE 06 / 13</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 6px" }}>Streaming, Production & Observability</h1>
        <p style={{ color: T.muted, fontSize: 13.5, margin: 0 }}>4 streaming modes · Async/await · Retry logic · LangSmith · Arize Phoenix · Prod checklist</p>
      </div>
      <div style={{ background: T.bg2, borderBottom: `1px solid ${T.border}`, padding: "0 2rem", display: "flex", gap: 2, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? T.teal : "transparent"}`, color: tab === t.id ? T.teal : T.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem" }}>

        {tab === "streaming" && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: "1rem" }}>
                <thead><tr>{["Mode", "stream_mode=", "Emits", "Use case"].map((h, i) => <th key={i} style={{ background: T.bg4, padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.border2}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["values",   '"values"',   "Full state after each superstep",     "See complete state evolution"],
                    ["updates",  '"updates"',  "State delta from each node only",     "Debug: what each node changed"],
                    ["messages", '"messages"', "Token-by-token LLM output",           "Live chat UI streaming"],
                    ["custom",   '"custom"',   "stream_writer() events from nodes",   "Progress bars, tool status"],
                  ].map((r, i) => <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>{r.map((c, j) => <td key={j} style={{ padding: "8px 12px", color: j < 2 ? T.text : T.muted, fontFamily: j < 2 ? "monospace" : "inherit", fontSize: j < 2 ? 12 : 13 }}>{c}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <Code file="streaming_modes.py">{`from langchain_core.messages import HumanMessage

input_state = {"messages": [HumanMessage(content="Analyze AI trends")]}
config      = {"configurable": {"thread_id": "stream-demo"}}

# ── Mode 1: values ────────────────────────────────────────────────
for state in graph.stream(input_state, config, stream_mode="values"):
    print(state.keys())            # full AgentState dict at this step

# ── Mode 2: updates ───────────────────────────────────────────────
for chunk in graph.stream(input_state, config, stream_mode="updates"):
    for node_name, delta in chunk.items():
        print(f"{node_name} wrote: {list(delta.keys())}")

# ── Mode 3: messages (token streaming) ───────────────────────────
for msg, meta in graph.stream(input_state, config, stream_mode="messages"):
    if msg.content and meta.get("langgraph_node") == "writer":
        print(msg.content, end="", flush=True)

# ── Mode 4: custom events ─────────────────────────────────────────
from langgraph.config import get_stream_writer

def research_node(state):
    writer = get_stream_writer()
    writer({"stage": "searching", "query": state["question"]})
    results = tavily.invoke(state["question"])
    writer({"stage": "done", "count": len(results)})
    return {"research_data": str(results)}

for event in graph.stream(input_state, config, stream_mode="custom"):
    print(event)   # {"stage": "searching", "query": "..."}

# ── Async streaming (production) ─────────────────────────────────
async def stream_agent(query: str):
    async for event in graph.astream_events(
        {"messages": [HumanMessage(content=query)]},
        config=config, version="v2"
    ):
        if event["event"] == "on_chat_model_stream":
            print(event["data"]["chunk"].content, end="", flush=True)
        elif event["event"] == "on_tool_start":
            print(f"\\n🔧 [{event['name']}] running...")
        elif event["event"] == "on_tool_end":
            print("✓ done")`}</Code>
          </div>
        )}

        {tab === "async" && (
          <div>
            <H>Async-first nodes</H>
            <Code file="async_nodes.py">{`import asyncio
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# ── Async node (always use in production) ────────────────────────
async def async_agent(state: AgentState) -> dict:
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

# ── Concurrent user sessions ──────────────────────────────────────
async def handle_multiple_users(queries: list[str]):
    tasks = [
        graph.ainvoke(
            {"messages": [HumanMessage(content=q)]},
            config={"configurable": {"thread_id": f"user-{i}"}}
        )
        for i, q in enumerate(queries)
    ]
    return await asyncio.gather(*tasks)   # all run in parallel`}</Code>

            <H>Retry with tenacity</H>
            <Code file="retry.py">{`from tenacity import (
    retry, wait_exponential, stop_after_attempt,
    retry_if_exception_type, before_sleep_log
)
import logging, openai

logger = logging.getLogger(__name__)

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=30),
    stop=stop_after_attempt(4),
    retry=retry_if_exception_type((openai.RateLimitError, openai.APITimeoutError)),
    before_sleep=before_sleep_log(logger, logging.WARNING)
)
async def resilient_llm_call(messages: list) -> str:
    response = await llm.ainvoke(messages)
    return response.content

# ── Handle GraphRecursionError gracefully ─────────────────────────
from langgraph.errors import GraphRecursionError

async def safe_invoke(state: dict, config: dict) -> dict:
    try:
        return await graph.ainvoke(
            state,
            config={**config, "recursion_limit": 25}
        )
    except GraphRecursionError:
        # Return partial results instead of crashing
        partial = graph.get_state(config)
        return {
            "status": "max_iterations_reached",
            "partial_result": partial.values.get("draft", ""),
            "iteration_count": partial.values.get("iteration", 0)
        }`}</Code>
          </div>
        )}

        {tab === "observ" && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: "1.25rem" }}>
                <thead><tr>{["Tool", "Best for", "Setup"].map((h, i) => <th key={i} style={{ background: T.bg4, padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.border2}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["LangSmith",     "Production tracing, datasets, evals, CI gates", "Set 2 env vars — auto-traces everything"],
                    ["Arize Phoenix", "Dev visual tracing, span inspection", "launch_app() + LangChainInstrumentor"],
                    ["Langfuse",      "Self-hosted, GDPR, cost tracking", "pip install langfuse + env vars"],
                    ["W&B Weave",     "Experiment tracking, model comparison", "weave.init() + @weave.op decorator"],
                  ].map((r, i) => <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>{r.map((c, j) => <td key={j} style={{ padding: "8px 12px", color: j === 0 ? T.text : T.muted, fontFamily: j === 0 ? "monospace" : "inherit", fontSize: j === 0 ? 12 : 13 }}>{c}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <Code file="observability.py">{`# ── LangSmith (recommended for production) ────────────────────────
# Set env vars — that's all. Everything auto-traces.
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__...
# LANGCHAIN_PROJECT=sdlc-copilot-prod

# Rich metadata for filtering in LangSmith UI
config = {
    "configurable": {"thread_id": "prod-001"},
    "metadata": {
        "user_id":    "sayan@company.com",
        "env":        "production",
        "version":    "v2.3",
        "request_type": "user_story"
    },
    "tags": ["supervisor", "multi-agent", "rag", "sdlc"]
}

# ── Arize Phoenix (local visual dev tracing) ──────────────────────
import phoenix as px
from openinference.instrumentation.langchain import LangChainInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from openinference.instrumentation import TraceConfig

def setup_phoenix_tracing():
    px.launch_app()   # starts UI at http://localhost:6006
    provider = TracerProvider()
    LangChainInstrumentor().instrument(
        tracer_provider=provider,
        config=TraceConfig(max_string_length=512)
    )
    print("Phoenix tracing active at http://localhost:6006")

# ── LangSmith custom traceable function ───────────────────────────
from langsmith import traceable

@traceable(name="hybrid-rag-retrieval", tags=["retrieval", "bm25", "dense"])
def retrieve_with_tracing(query: str, top_k: int = 5) -> list[str]:
    bm25_results  = bm25_index.search(query, k=top_k)
    dense_results = vector_store.similarity_search(query, k=top_k)
    return rrf_merge(bm25_results, dense_results, top_k=top_k)`}</Code>
          </div>
        )}

        {tab === "deploy" && (
          <div>
            <H>FastAPI SSE streaming endpoint</H>
            <Code file="api_server.py">{`from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
import asyncio, json

app = FastAPI()

@app.post("/agent/stream")
async def stream_agent(body: dict):
    thread_id    = body.get("thread_id", f"anon-{id(body)}")
    message      = body["message"]
    config       = {"configurable": {"thread_id": thread_id}}

    async def event_generator():
        try:
            async for event in graph.astream_events(
                {"messages": [HumanMessage(content=message)]},
                config=config, version="v2"
            ):
                if event["event"] == "on_chat_model_stream":
                    token = event["data"]["chunk"].content
                    if token:
                        yield f"data: {json.dumps({'type': 'token', 'content': token})}\\n\\n"
                elif event["event"] == "on_tool_start":
                    yield f"data: {json.dumps({'type': 'tool_start', 'name': event['name']})}\\n\\n"
                elif event["event"] == "on_tool_end":
                    yield f"data: {json.dumps({'type': 'tool_end', 'name': event['name']})}\\n\\n"
            yield f"data: {json.dumps({'type': 'done'})}\\n\\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\\n\\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})`}</Code>

            <H>LangGraph Platform config</H>
            <Code file="langgraph.json" lang="json">{`{
  "dependencies": ["."],
  "graphs": {
    "supervisor":  "./src/agents/supervisor/graph.py:build_supervisor_graph",
    "research":    "./src/agents/research/graph.py:build_research_graph",
    "sdlc_copilot":"./src/sdlc/graph.py:build_sdlc_graph"
  },
  "env": ".env",
  "python_version": "3.11",
  "pip_config_file": "pyproject.toml",
  "store": {
    "type": "postgres",
    "connection_string": "${DATABASE_URL}"
  },
  "checkpointer": {
    "type": "postgres",
    "connection_string": "${DATABASE_URL}"
  }
}`}</Code>
          </div>
        )}

        {tab === "checklist" && (
          <div>
            <Note type="pattern">Interactive production checklist — check off items as you build your LangGraph system.</Note>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: T.muted }}>{Object.values(checklist).filter(Boolean).length} / {checkItems.length} completed</span>
              <div style={{ marginLeft: 12, height: 6, width: 140, background: T.bg4, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(Object.values(checklist).filter(Boolean).length / checkItems.length) * 100}%`, background: T.teal, borderRadius: 3, transition: "width .3s" }} />
              </div>
            </div>
            <div>
              {checkItems.map(item => (
                <div key={item.id} onClick={() => setChecklist(p => ({ ...p, [item.id]: !p[item.id] }))}
                  style={{ display: "flex", gap: 12, padding: "11px 12px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", borderRadius: 6, background: checklist[item.id] ? "rgba(45,212,191,.05)" : "transparent", transition: "all .15s" }}>
                  <div style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 4, background: checklist[item.id] ? T.teal : "transparent", border: `2px solid ${checklist[item.id] ? T.teal : T.dim}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.bg, fontWeight: 700, transition: "all .15s" }}>
                    {checklist[item.id] ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 13.5, color: checklist[item.id] ? T.muted : T.text, textDecoration: checklist[item.id] ? "line-through" : "none", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
