import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 09 — LangGraph Quick Reference Cheatsheet
// Every API, pattern, and decision you need in one page
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  bg:"#090C14",bg2:"#0F1321",bg3:"#151A2A",bg4:"#1C2235",
  border:"rgba(255,255,255,0.07)",border2:"rgba(255,255,255,0.13)",
  blue:"#5B8BF5",purple:"#9B6DFF",teal:"#2DD4BF",
  amber:"#F5A623",coral:"#F87171",green:"#34D399",
  text:"#E2E8F0",muted:"#64748B",dim:"#2E3A50",
};

function CodeSnip({ children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position:"relative",margin:"0.6rem 0" }}>
      <pre style={{ margin:0,padding:"0.75rem 1rem",background:"#0D1117",border:`1px solid ${T.border}`,borderRadius:8,overflowX:"auto",fontSize:12,lineHeight:1.7,fontFamily:"'Fira Code','JetBrains Mono',monospace",color:"#ABB2BF",whiteSpace:"pre" }}>
        {children}
      </pre>
      <button onClick={()=>{navigator.clipboard?.writeText(children);setCopied(true);setTimeout(()=>setCopied(false),1500);}}
        style={{ position:"absolute",top:6,right:6,background:copied?"rgba(45,212,191,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${T.border}`,borderRadius:4,padding:"2px 8px",fontSize:10,color:copied?T.teal:T.dim,cursor:"pointer",fontFamily:"monospace" }}>
        {copied?"✓":"copy"}
      </button>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",borderTop:`2px solid ${color}` }}>
      <div style={{ background:`${color}10`,padding:"0.6rem 1rem",borderBottom:`1px solid ${T.border}` }}>
        <span style={{ fontSize:12,fontWeight:700,color,fontFamily:"monospace",letterSpacing:"0.04em" }}>{title}</span>
      </div>
      <div style={{ padding:"0.75rem 1rem" }}>{children}</div>
    </div>
  );
}

function Row({ label, value, code }) {
  return (
    <div style={{ display:"flex",gap:10,padding:"5px 0",borderBottom:`1px solid ${T.border}`,alignItems:"flex-start" }}>
      <div style={{ fontSize:12,fontFamily:"monospace",color:T.muted,flexShrink:0,width:160 }}>{label}</div>
      <div style={{ fontSize:12.5,color:T.text }}>{value}</div>
      {code && <div style={{ fontSize:11,fontFamily:"monospace",color:T.teal,marginLeft:"auto",flexShrink:0 }}>{code}</div>}
    </div>
  );
}

function Badge({ color, children }) {
  return <span style={{ display:"inline-block",background:`${color}18`,border:`1px solid ${color}35`,color,borderRadius:12,padding:"2px 8px",fontSize:11,fontWeight:600,margin:"2px" }}>{children}</span>;
}

const CATEGORIES = [
  {id:"core",     label:"Core API"},
  {id:"state",    label:"State & Reducers"},
  {id:"edges",    label:"Edges & Routing"},
  {id:"memory",   label:"Memory"},
  {id:"parallel", label:"Parallel"},
  {id:"hitl",     label:"HITL"},
  {id:"streaming",label:"Streaming"},
  {id:"patterns", label:"Patterns"},
  {id:"errors",   label:"Errors & Gotchas"},
];

export default function QuickReference() {
  const [cat, setCat] = useState("core");

  return (
    <div style={{ minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Segoe UI','SF Pro Display',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:T.bg2,borderBottom:`1px solid ${T.border}`,padding:"1.2rem 2rem" }}>
        <div style={{ fontSize:10,color:T.amber,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>LangGraph Guide · Module 09</div>
        <h1 style={{ fontSize:"1.6rem",fontWeight:700,color:T.text,margin:"0 0 4px" }}>Quick Reference Cheatsheet</h1>
        <p style={{ color:T.muted,fontSize:13.5,margin:0 }}>Every API call, pattern, and decision you need — one page, no scrolling through docs</p>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"1.5rem 2rem" }}>
        {/* Category nav */}
        <div style={{ display:"flex",gap:5,marginBottom:"1.5rem",flexWrap:"wrap" }}>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)}
              style={{ padding:"4px 14px",borderRadius:20,fontSize:12.5,fontWeight:500,cursor:"pointer",background:cat===c.id?`${T.amber}20`:"transparent",color:cat===c.id?T.amber:T.muted,border:`1px solid ${cat===c.id?`${T.amber}50`:T.border}`,transition:"all 0.15s",fontFamily:"inherit" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* ─── CORE API ─── */}
        {cat==="core"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Build a graph" color={T.blue}>
              <CodeSnip>{`from langgraph.graph import StateGraph, END

builder = StateGraph(MyState)
builder.add_node("node_a", fn_a)
builder.add_node("node_b", fn_b)
builder.set_entry_point("node_a")
builder.add_edge("node_a", "node_b")
builder.add_edge("node_b", END)
graph = builder.compile()`}</CodeSnip>
            </Section>

            <Section title="Invoke & stream" color={T.blue}>
              <CodeSnip>{`config = {"configurable": {"thread_id": "t1"}}

# Sync invoke
result = graph.invoke(input_dict, config)

# Async invoke
result = await graph.ainvoke(input_dict, config)

# Stream updates
for chunk in graph.stream(input_dict, config,
                           stream_mode="updates"):
    print(chunk)

# Async stream
async for chunk in graph.astream(input_dict, config):
    print(chunk)`}</CodeSnip>
            </Section>

            <Section title="Node function signature" color={T.purple}>
              <CodeSnip>{`# Sync node
def my_node(state: MyState) -> dict:
    return {"field": new_value}

# Async node (preferred for production)
async def my_async_node(state: MyState) -> dict:
    result = await llm.ainvoke(state["messages"])
    return {"messages": [result]}

# Node with config (multi-tenant)
def configurable_node(state: MyState,
                       config: RunnableConfig) -> dict:
    uid = config["configurable"].get("user_id")
    return {"output": f"Hello {uid}"}`}</CodeSnip>
            </Section>

            <Section title="Graph inspection" color={T.teal}>
              <CodeSnip>{`# Get current state
snap = graph.get_state(config)
snap.values        # current state dict
snap.next          # tuple of next nodes
snap.config        # checkpoint config

# Full state history (all checkpoints)
history = list(graph.get_state_history(config))

# Update state mid-execution
graph.update_state(config,
    values={"status": "approved"},
    as_node="reviewer")

# Get graph structure
graph.get_graph().print_ascii()`}</CodeSnip>
            </Section>
          </div>
        )}

        {/* ─── STATE & REDUCERS ─── */}
        {cat==="state"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="State definition" color={T.purple}>
              <CodeSnip>{`from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
import operator

class AgentState(TypedDict):
    # Reducers on Annotated fields
    messages: Annotated[list, add_messages]   # append+dedup
    results:  Annotated[list, operator.add]   # concat lists
    count:    int                              # last-write-wins
    status:   str                              # last-write-wins`}</CodeSnip>
            </Section>

            <Section title="All reducer patterns" color={T.purple}>
              <Row label="add_messages" value="Append + dedup by ID. Chat history." />
              <Row label="operator.add" value="List concat. Fan-in parallel results." />
              <Row label="(none)" value="Last-write wins. Status, flags, strings." />
              <Row label="custom fn(a,b)" value="Your merge logic. Dicts, scores, etc." />
              <Row label="operator.or_" value="Set union merge." />
            </Section>

            <Section title="Input / Output schemas" color={T.blue}>
              <CodeSnip>{`class Input(TypedDict):
    user_query: str

class Output(TypedDict):
    answer: str
    score:  float

# Internal state can have 20 fields
# caller only sees Input → Output
builder = StateGraph(InternalState,
                     input=Input,
                     output=Output)`}</CodeSnip>
            </Section>

            <Section title="Multi-tenant config" color={T.teal}>
              <CodeSnip>{`def node(state, config: RunnableConfig) -> dict:
    cfg   = config.get("configurable", {})
    uid   = cfg.get("user_id", "anon")
    model = cfg.get("model", "gpt-4o-mini")
    return {"output": f"User: {uid}"}

# Call with per-user config
graph.invoke(state, config={
    "configurable": {
        "thread_id": "sess-001",   # persistence key
        "user_id":   "sayan",
        "model":     "gpt-4o",
    }
})`}</CodeSnip>
            </Section>
          </div>
        )}

        {/* ─── EDGES ─── */}
        {cat==="edges"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Normal edge" color={T.blue}>
              <CodeSnip>{`# Always A → B
builder.add_edge("node_a", "node_b")
builder.add_edge("last_node", END)

# Entry point = START → node
builder.set_entry_point("first_node")`}</CodeSnip>
            </Section>

            <Section title="Conditional edge" color={T.blue}>
              <CodeSnip>{`def route(state: MyState) -> str:
    if state["score"] >= 8: return "done"
    if state["retries"] > 3: return "fallback"
    return "retry"

builder.add_conditional_edges(
    source="evaluator",
    path=route,
    path_map={
        "done":     "finalizer",
        "retry":    "generator",
        "fallback": "fallback_node",
        # or use END instead of a string
    }
)`}</CodeSnip>
            </Section>

            <Section title="Command (agent handoff)" color={T.purple}>
              <CodeSnip>{`from langgraph.types import Command
from typing import Literal

def researcher(state) -> Command[Literal["writer","__end__"]]:
    # do work ...
    return Command(
        goto="writer",
        update={
            "research": "findings...",
            "messages": [AIMessage(content="Done")]
        }
    )

# No add_conditional_edges needed
# Each agent self-routes via Command`}</CodeSnip>
            </Section>

            <Section title="Common routing patterns" color={T.teal}>
              <Row label="tools_condition" value="→ 'tools' if tool_calls, else END" code="prebuilt" />
              <Row label="lambda s: s['next']" value="Route by state field value" />
              <Row label="Command(goto=...)" value="Decentralized swarm handoff" />
              <Row label="Send(node, state)" value="Parallel fan-out dispatch" />
            </Section>
          </div>
        )}

        {/* ─── MEMORY ─── */}
        {cat==="memory"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Checkpointers" color={T.teal}>
              <CodeSnip>{`# Dev: in-memory (resets on restart)
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(checkpointer=MemorySaver())

# Local: SQLite
from langgraph.checkpoint.sqlite import SqliteSaver
with SqliteSaver.from_conn_string("app.db") as saver:
    graph = builder.compile(checkpointer=saver)

# Production: PostgreSQL
from langgraph.checkpoint.postgres import PostgresSaver
with PostgresSaver.from_conn_string(DB_URI) as saver:
    saver.setup()   # creates tables once
    graph = builder.compile(checkpointer=saver)`}</CodeSnip>
            </Section>

            <Section title="Time travel" color={T.teal}>
              <CodeSnip>{`# All checkpoints in a thread
history = list(graph.get_state_history(config))

# history[0] = most recent
past = history[3].config   # 4 steps ago

# Rewind: fork from past checkpoint
graph.update_state(past,
    {"critique": "APPROVED"},
    as_node="critic")
graph.invoke(None, config=past)   # resume from fork`}</CodeSnip>
            </Section>

            <Section title="Cross-thread store" color={T.amber}>
              <CodeSnip>{`from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
graph = builder.compile(
    checkpointer=MemorySaver(),
    store=store
)

# In a node: write user prefs across threads
def node(state, config, store):
    uid = config["configurable"]["user_id"]
    store.put((uid, "prefs"), "model",
              {"value": "gpt-4o"})
    pref = store.get((uid, "prefs"), "model")
    return {"model": pref.value["value"]}`}</CodeSnip>
            </Section>

            <Section title="Memory layers" color={T.amber}>
              <Row label="In-context"    value="Messages in state. Resets per thread." />
              <Row label="Thread memory" value="Checkpointer. Per-conversation history." />
              <Row label="Cross-thread"  value="InMemoryStore. User prefs, facts." />
              <Row label="External KB"   value="Vector store. Long-term knowledge base." />
            </Section>
          </div>
        )}

        {/* ─── PARALLEL ─── */}
        {cat==="parallel"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Send API — fan-out" color={T.green}>
              <CodeSnip>{`from langgraph.types import Send

# Dispatcher: one Send per item → N parallel workers
def dispatcher(state: MyState) -> list[Send]:
    return [
        Send("worker", {"item": x, "idx": i})
        for i, x in enumerate(state["items"])
    ]

# Wire: conditional_edges on __start__
builder.add_conditional_edges(
    "__start__",
    dispatcher,
    ["worker"]   # allowed destination nodes
)`}</CodeSnip>
            </Section>

            <Section title="Fan-in with reducer" color={T.green}>
              <CodeSnip>{`import operator

class MapReduceState(TypedDict):
    items:   list[str]
    results: Annotated[list[str], operator.add]
    final:   str   # last-write-wins

# Worker writes ONE item to 'results' list
def worker(state: dict) -> dict:
    processed = process(state["item"])
    return {"results": [processed]}
    # operator.add merges all [processed] lists

# Aggregator runs AFTER all workers finish
def aggregate(state: MapReduceState) -> dict:
    return {"final": "\\n".join(state["results"])}`}</CodeSnip>
            </Section>

            <Section title="Parallel evaluation pattern" color={T.amber}>
              <CodeSnip>{`# Run 3 LLM judges in parallel on the same content
class EvalState(TypedDict):
    content: str
    scores:  Annotated[list[float], operator.add]
    verdict: str

def judge_clarity(state):    return {"scores":[score_fn(state,"clarity")]}
def judge_completeness(state):return {"scores":[score_fn(state,"completeness")]}
def judge_relevance(state):  return {"scores":[score_fn(state,"relevance")]}

# All 3 run in parallel (static fan-out)
builder.set_entry_point("judge_clarity")
builder.set_entry_point("judge_completeness")
builder.set_entry_point("judge_relevance")`}</CodeSnip>
            </Section>

            <Section title="Parallel tips" color={T.teal}>
              <Row label="Use ainvoke()" value="Async I/O → true parallel LLM calls" />
              <Row label="operator.add" value="Fan-in reducer for list results" />
              <Row label="Send limit" value="No hard cap, but batch if N > 50" />
              <Row label="Worker state" value="Can be a subset dict, not full state" />
              <Row label="Error in worker" value="Other workers still complete" />
            </Section>
          </div>
        )}

        {/* ─── HITL ─── */}
        {cat==="hitl"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Compile-time breakpoints" color={T.coral}>
              <CodeSnip>{`graph = builder.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["writer"],    # pause before
    interrupt_after=["researcher"], # pause after
)

# Invoke → pauses at breakpoint
result = graph.invoke(state, config)
# result["__interrupt__"] set if paused

# Inspect
snap = graph.get_state(config)
print(snap.next)          # ("writer",) = paused here

# Resume (no changes)
graph.invoke(None, config)

# Resume (with edits)
graph.update_state(config, {"draft": "Edited draft"})
graph.invoke(None, config)`}</CodeSnip>
            </Section>

            <Section title="Dynamic interrupt()" color={T.coral}>
              <CodeSnip>{`from langgraph.types import interrupt, Command

def review_node(state) -> dict:
    draft = generate_draft(state)

    # Conditional HITL: only if score is borderline
    if 6.0 <= state["score"] < 8.0:
        human_input = interrupt({
            "draft": draft,
            "question": "Approve or edit?"
        })
        if human_input != "APPROVE":
            draft = apply_edits(draft, human_input)

    return {"final": draft}

# Resume with Command
graph.invoke(
    Command(resume="APPROVE"),
    config
)`}</CodeSnip>
            </Section>

            <Section title="HITL checklist" color={T.amber}>
              <Row label="Checkpointer" value="Required! interrupt() raises without one." />
              <Row label="interrupt_before" value="Fixed gate: always pauses before node X" />
              <Row label="interrupt_after" value="Fixed gate: always pauses after node X" />
              <Row label="interrupt()" value="Dynamic: pause conditionally inside a node" />
              <Row label="Command(resume)" value="Pass human feedback when resuming" />
              <Row label="update_state" value="Edit state without resuming yet" />
            </Section>

            <Section title="HITL approval workflow" color={T.purple}>
              <CodeSnip>{`# Pattern: PO approves user stories before test gen

graph = builder.compile(
    checkpointer=PostgresSaver(...),
    interrupt_before=["test_case_agent"]
)

config = {"configurable": {"thread_id": "sprint-1"}}

# Step 1: Generate stories, pause before test gen
result = graph.invoke({"epics": epics}, config)

# Step 2: PO reviews stories in UI, then:
if po_approved:
    graph.invoke(None, config)          # proceed
else:
    graph.update_state(config, {        # send back
        "current_agent": "user_story_agent",
        "critique": po_feedback
    })
    graph.invoke(None, config)`}</CodeSnip>
            </Section>
          </div>
        )}

        {/* ─── STREAMING ─── */}
        {cat==="streaming"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="4 streaming modes" color={T.amber}>
              <Row label="values"   value="Full state after each superstep" />
              <Row label="updates"  value="State delta from each node" />
              <Row label="messages" value="Token-by-token LLM output" />
              <Row label="custom"   value="User events via stream_writer" />
              <CodeSnip>{`# Mode: updates (see what each node changed)
for chunk in graph.stream(inp, cfg,
                           stream_mode="updates"):
    for node, delta in chunk.items():
        print(f"{node}: {list(delta.keys())}")`}</CodeSnip>
            </Section>

            <Section title="Token streaming (messages mode)" color={T.amber}>
              <CodeSnip>{`for msg, meta in graph.stream(inp, cfg,
                              stream_mode="messages"):
    if msg.content and not isinstance(msg, HumanMessage):
        print(msg.content, end="", flush=True)

# Async + astream_events (most powerful)
async for evt in graph.astream_events(inp, cfg, version="v2"):
    if evt["event"] == "on_chat_model_stream":
        tok = evt["data"]["chunk"].content
        if tok: print(tok, end="", flush=True)
    elif evt["event"] == "on_tool_start":
        print(f"\\n[{evt['name']}]")`}</CodeSnip>
            </Section>

            <Section title="Custom events (stream_mode='custom')" color={T.purple}>
              <CodeSnip>{`from langgraph.config import get_stream_writer

def my_node(state) -> dict:
    writer = get_stream_writer()
    writer({"status":"retrieving","query":state["q"]})
    docs = retrieve(state["q"])
    writer({"status":"done","n":len(docs)})
    return {"docs": docs}

for evt in graph.stream(inp, cfg, stream_mode="custom"):
    print(evt)   # {"status": "retrieving", ...}`}</CodeSnip>
            </Section>

            <Section title="FastAPI SSE" color={T.teal}>
              <CodeSnip>{`from fastapi.responses import StreamingResponse
import json

@app.post("/stream")
async def stream(body: dict):
    async def gen():
        async for evt in graph.astream_events(
            {"messages":[HumanMessage(body["msg"])]},
            config={"configurable":{"thread_id":body["tid"]}},
            version="v2"
        ):
            if evt["event"]=="on_chat_model_stream":
                tok=evt["data"]["chunk"].content
                if tok: yield f"data:{json.dumps({'t':tok})}\\n\\n"
        yield "data:[DONE]\\n\\n"
    return StreamingResponse(gen(), media_type="text/event-stream")`}</CodeSnip>
            </Section>
          </div>
        )}

        {/* ─── PATTERNS ─── */}
        {cat==="patterns"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="Pattern selector" color={T.blue}>
              <Row label="Single agent loop"    value="create_react_agent + ToolNode" />
              <Row label="Quality retry loop"   value="Reflexion (generate→judge→revise)" />
              <Row label="RAG + web fallback"   value="CRAG (retrieve→grade→web→gen)" />
              <Row label="Better retrieval"     value="HyDE (gen fake doc → embed → search)" />
              <Row label="Multi-agent routing"  value="Supervisor (central LLM router)" />
              <Row label="Direct handoffs"      value="Command swarm (decentralized)" />
              <Row label="Complex task"         value="Plan-Execute (plan→step→replan)" />
              <Row label="Parallel processing"  value="Send API fan-out + reducer fan-in" />
              <Row label="Human approval"       value="interrupt() + Command(resume)" />
            </Section>

            <Section title="create_react_agent" color={T.teal}>
              <CodeSnip>{`from langgraph.prebuilt import create_react_agent

graph = create_react_agent(
    llm,
    tools=tools,
    checkpointer=MemorySaver(),
    state_modifier="You are an expert.",
)
# Gives: ReAct loop + memory + streaming + tracing`}</CodeSnip>
            </Section>

            <Section title="Reflexion loop wiring" color={T.purple}>
              <CodeSnip>{`# generate → critique → route
def route(state):
    if state["score"] >= 8:   return END
    if state["rev"] >= 3:     return END
    return "generate"   # loop back

builder.add_edge("generate", "critique")
builder.add_conditional_edges("critique", route)`}</CodeSnip>
            </Section>

            <Section title="Supervisor wiring" color={T.amber}>
              <CodeSnip>{`# All agents return to supervisor
# Supervisor routes to next or FINISH

builder.add_conditional_edges("supervisor",
    lambda s: s["next"],
    {"agent_a":"agent_a","agent_b":"agent_b",END:END})

for agent in ["agent_a", "agent_b"]:
    builder.add_edge(agent, "supervisor")`}</CodeSnip>
            </Section>
          </div>
        )}

        {/* ─── ERRORS ─── */}
        {cat==="errors"&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <Section title="GraphRecursionError" color={T.coral}>
              <CodeSnip>{`from langgraph.errors import GraphRecursionError

# Always set recursion_limit
try:
    result = graph.invoke(state, config={
        "recursion_limit": 25,          # default is 25
        "configurable": {"thread_id": "t1"}
    })
except GraphRecursionError:
    # Graceful degradation
    partial = graph.get_state(config)
    return partial.values.get("draft", "Partial result")`}</CodeSnip>
            </Section>

            <Section title="Retry with tenacity" color={T.coral}>
              <CodeSnip>{`from tenacity import (
    retry, wait_exponential,
    stop_after_attempt,
    retry_if_exception_type
)

@retry(
    wait=wait_exponential(min=2, max=30),
    stop=stop_after_attempt(4),
    retry=retry_if_exception_type(Exception)
)
async def safe_llm_call(messages):
    return await llm.ainvoke(messages)`}</CodeSnip>
            </Section>

            <Section title="Common gotchas" color={T.amber}>
              <Row label="No checkpointer" value="interrupt() raises error. Always attach one for HITL." />
              <Row label="Missing reducer" value="Parallel workers OVERWRITE each other. Use operator.add." />
              <Row label="invoke(None)" value="Resumes from interrupt. Don't pass new state." />
              <Row label="MemorySaver" value="In-process only. Use Postgres for multi-worker prod." />
              <Row label="State delta" value="Nodes return ONLY changed fields, not full state." />
              <Row label="END constant" value="Import from langgraph.graph, not string '__end__'." />
            </Section>

            <Section title="Debug tools" color={T.green}>
              <CodeSnip>{`# Print graph structure
graph.get_graph().print_ascii()

# Get which nodes run next
snap = graph.get_state(config)
print("Next nodes:", snap.next)

# Full checkpoint history
for h in graph.get_state_history(config):
    print(h.config["configurable"]["checkpoint_id"],
          h.next)

# LangSmith: set env vars
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__...
# LANGCHAIN_PROJECT=my-agent-debug`}</CodeSnip>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
