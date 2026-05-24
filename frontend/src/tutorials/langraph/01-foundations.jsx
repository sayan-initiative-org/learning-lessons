// MODULE 01 — FOUNDATIONS
// StateGraph · TypedDict · Reducers · Edges · Lifecycle

import { useState } from "react";
import {
  T, ModulePage, ModuleHeader, Content, SubTabs,
  CodeBlock, Callout, H3, DataTable,
} from "./_theme.jsx";

const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "state",     label: "State & Reducers" },
  { id: "nodes",     label: "Nodes" },
  { id: "edges",     label: "Edges" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "first",     label: "First Graph" },
];

const BUILDING_BLOCKS = [
  { icon: "📦", label: "State (TypedDict)",        color: T.gold,  desc: "The single source of truth. Every node reads from and writes a delta back to the shared TypedDict. Reducers control how deltas merge." },
  { icon: "⚙️", label: "Nodes (Python callables)", color: T.plum,  desc: "Any function, async coroutine, or class with __call__. Takes full state, returns a delta dict of changed fields only." },
  { icon: "🔀", label: "Edges (routing logic)",    color: T.sage,  desc: "Normal edges (A → B always), conditional edges (branch on state), and Send edges (dynamic parallel fan-out)." },
  { icon: "▶️", label: "Graph (compiled executor)", color: T.terra, desc: "builder.compile() produces an executable. The Pregel runtime handles scheduling, parallelism, and checkpointing." },
];

const EXECUTION_STEPS = [
  "START triggers entry node(s)",
  "Node runs → returns state delta",
  "Reducers merge delta into global state",
  "Conditional edges evaluate next node(s)",
  "Repeat until END (or interrupt)",
  "Checkpointer snapshots state after each superstep",
];

export default function Foundations() {
  const [tab, setTab] = useState("overview");

  return (
    <ModulePage>
      <ModuleHeader
        moduleNum={1}
        title="Foundations & Core Concepts"
        subtitle="StateGraph · TypedDict · Reducers · Nodes · Edges · Lifecycle — the four building blocks every LangGraph system rests on."
        pills={[
          { label: "StateGraph", kind: "gold" },
          { label: "TypedDict", kind: "plum" },
          { label: "Reducers", kind: "sage" },
          { label: "Pregel runtime", kind: "terra" },
        ]}
      />

      <Content>
        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "overview" && (
          <div>
            <Callout type="info" title="What LangGraph is">
              LangGraph is a <strong>cyclic state machine runtime</strong> built on the Pregel distributed graph model.
              Unlike LangChain chains (linear DAG), LangGraph supports loops, shared typed state, and first-class
              human-in-the-loop — the three things production agents need.
            </Callout>

            <H3>The four building blocks</H3>
            <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${T.border}`, borderRadius: 4, background: T.bgPanel }}>
              {BUILDING_BLOCKS.map((b, i) => (
                <div key={b.label} style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: i < BUILDING_BLOCKS.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: b.color, marginBottom: 3 }}>{b.label}</div>
                    <div style={{ fontSize: 13, color: T.textMute, lineHeight: 1.65 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <H3>How execution works</H3>
            <div className="card-flat">
              {EXECUTION_STEPS.map((step, i) => (
                <div key={i} style={{ fontSize: 13.5, padding: "8px 0", display: "flex", gap: 12, borderBottom: i < EXECUTION_STEPS.length - 1 ? `1px dashed ${T.border}` : "none" }}>
                  <span className="mono" style={{ color: T.gold, fontSize: 11, flexShrink: 0, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ color: T.text, opacity: .88 }}>{step}</span>
                </div>
              ))}
            </div>

            <Callout type="pattern" title="The Pregel superstep model">
              In each step, all active nodes run (possibly in parallel), their outputs are collected, reducers merge
              everything into state, then the runtime decides which nodes run next. This is why fan-out and fan-in
              are automatic — you describe the graph, not the scheduling.
            </Callout>
          </div>
        )}

        {tab === "state" && (
          <div>
            <H3>State — TypedDict + reducers</H3>
            <CodeBlock file="state_basics.py">{`from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
import operator

# ── Minimal state (chatbot) ──────────────────────────────────────
class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    # add_messages reducer: APPENDS new messages, deduplicates by ID

# ── Full agent state ─────────────────────────────────────────────
class AgentState(TypedDict):
    messages:      Annotated[list[BaseMessage], add_messages]   # append + dedupe
    results:       Annotated[list[str], operator.add]           # list concat (fan-in)
    status:        str    # no annotation = last write wins
    iteration:     int
    final_output:  str
    next:          str    # routing field for supervisor`}</CodeBlock>

            <H3>Built-in reducers</H3>
            <DataTable
              headers={["Reducer", "Behavior", "Typical use"]}
              rows={[
                ["add_messages",    "Append + deduplicate by ID", "Chat message history"],
                ["operator.add",    "Concatenate lists",          "Parallel worker results (fan-in)"],
                ["(none)",          "Last write wins",            "Status, count, routing field"],
                ["custom fn(a,b)→c","Any merge logic",            "Domain objects, max, deep merge"],
              ]}
            />

            <H3>Custom reducers</H3>
            <CodeBlock file="custom_reducer.py">{`# ── Custom merge reducer ─────────────────────────────────────────
def merge_metadata(existing: dict, new: dict) -> dict:
    """Deep-merge two metadata dicts."""
    return {**existing, **new}

def keep_max_score(a: float, b: float) -> float:
    """In parallel eval: keep highest score across workers."""
    return max(a, b)

class AdvancedState(TypedDict):
    metadata:   Annotated[dict,  merge_metadata]
    best_score: Annotated[float, keep_max_score]

# ── Input/output schema: control what enters/exits graph ─────────
class InputSchema(TypedDict):
    user_query: str

class OutputSchema(TypedDict):
    final_answer: str
    confidence: float

builder = StateGraph(InternalState, input=InputSchema, output=OutputSchema)`}</CodeBlock>

            <Callout type="tip" title="Reducer rule of thumb">
              Always use <code>Annotated[type, reducer]</code> for lists that multiple nodes write to. Without a reducer,
              the last node to finish wins — data from other nodes is silently lost.
            </Callout>
          </div>
        )}

        {tab === "nodes" && (
          <div>
            <H3>Nodes — Python callables</H3>
            <CodeBlock file="nodes.py">{`from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage
from langchain_core.runnables import RunnableConfig

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── Sync node (simple) ───────────────────────────────────────────
def basic_node(state: AgentState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}   # return ONLY changed fields

# ── Async node (preferred in production) ─────────────────────────
async def async_node(state: AgentState) -> dict:
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

# ── Node with config (multi-tenant) ──────────────────────────────
def configurable_node(state: AgentState, config: RunnableConfig) -> dict:
    cfg   = config.get("configurable", {})
    model = cfg.get("model", "gpt-4o-mini")
    llm   = ChatOpenAI(model=model)
    return {"messages": [llm.invoke(state["messages"])]}

# ── Node that uses multiple state fields ─────────────────────────
def writer_node(state: AgentState) -> dict:
    research = state.get("research_data", "No research yet")
    critique = state.get("critique",      "No prior critique")
    prompt = (f"Research findings:\\n{research}\\n\\n"
              f"Prior critique:\\n{critique}\\n\\n"
              f"Write a comprehensive report.")
    response = llm.invoke(prompt)
    return {
        "final_output": response.content,
        "status":       "draft_complete",
        "messages":     [AIMessage(content=response.content, name="writer")]
    }

# ── Passthrough node (useful for HITL breakpoints) ───────────────
def human_review(state: AgentState) -> dict:
    # Graph pauses here when interrupt_before=["human_review"]
    return {}  # no state change — just a pause point`}</CodeBlock>

            <Callout type="info" title="Delta-only returns">
              A node returns <strong>only the fields it changed</strong> — not the full state. LangGraph merges the
              delta using reducers. Returning <code>{`{}`}</code> (empty dict) is valid — it means
              "I ran, no state change."
            </Callout>
          </div>
        )}

        {tab === "edges" && (
          <div>
            <H3>Edge types</H3>
            <DataTable
              headers={["Type", "API", "Use case"]}
              rows={[
                ["Normal",          "add_edge(a, b)",                          "Always A → B"],
                ["Conditional",     "add_conditional_edges(a, fn, map)",       "Branch based on state value"],
                ["Entry",           "set_entry_point(node)",                   "First node to run after START"],
                ["Send (parallel)", "add_conditional_edges with Send[]",       "Dynamic N-way fan-out"],
              ]}
            />
            <CodeBlock file="edges.py">{`from langgraph.graph import StateGraph, END
from langgraph.types import Send

builder = StateGraph(AgentState)

# ── Normal edge ──────────────────────────────────────────────────
builder.add_edge("researcher", "supervisor")   # researcher → supervisor always

# ── Conditional edge: route based on state ───────────────────────
def route_supervisor(state: AgentState) -> str:
    dest = state["next"]
    return END if dest == "FINISH" else dest

builder.add_conditional_edges(
    source="supervisor",
    path=route_supervisor,
    path_map={"researcher": "researcher", "writer": "writer", END: END}
)

# ── Entry point ──────────────────────────────────────────────────
builder.set_entry_point("supervisor")   # START → supervisor

# ── Send edge: dynamic fan-out ───────────────────────────────────
def dispatch(state: AgentState) -> list[Send]:
    return [Send("worker", {"item": x}) for x in state["items"]]

builder.add_conditional_edges("__start__", dispatch, ["worker"])`}</CodeBlock>
          </div>
        )}

        {tab === "lifecycle" && (
          <div>
            <H3>Graph lifecycle — 6 steps</H3>
            <CodeBlock file="lifecycle.py">{`# ── Step 1: Define state schema ──────────────────────────────────
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    status:   str

# ── Step 2: Write node functions ─────────────────────────────────
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini")

def my_agent(state: AgentState) -> dict:
    return {"messages": [llm.invoke(state["messages"])]}

# ── Step 3: Instantiate StateGraph builder ───────────────────────
from langgraph.graph import StateGraph, END
builder = StateGraph(AgentState)

# ── Step 4: Register nodes and edges ─────────────────────────────
builder.add_node("agent", my_agent)
builder.set_entry_point("agent")
builder.add_edge("agent", END)

# ── Step 5: Compile (with optional checkpointer) ─────────────────
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(
    checkpointer=MemorySaver(),
    interrupt_before=[],
    interrupt_after=[],
)

# ── Step 6: Invoke / Stream / Inspect ────────────────────────────
from langchain_core.messages import HumanMessage

config = {"configurable": {"thread_id": "session-001"}}

result = graph.invoke({"messages": [HumanMessage(content="Hello!")]}, config=config)

for chunk in graph.stream({"messages": [HumanMessage(content="Hello!")]}, config):
    print(chunk)

snapshot = graph.get_state(config)
print(snapshot.values)   # current state dict
print(snapshot.next)     # which nodes run next (if paused)`}</CodeBlock>

            <Callout type="pattern" title="Compile-time options that matter">
              <code>checkpointer</code> enables persistence and HITL · <code>interrupt_before</code>/<code>interrupt_after</code>{" "}
              set fixed breakpoints · <code>recursion_limit</code> (default 25) caps loop iterations.
            </Callout>
          </div>
        )}

        {tab === "first" && (
          <div>
            <Callout type="tip" title="Copy-paste runnable">
              This block runs with <code>pip install langgraph langchain-openai</code> and an <code>OPENAI_API_KEY</code> env var.
            </Callout>
            <CodeBlock file="first_graph.py">{`# pip install langgraph langchain-openai python-dotenv
from dotenv import load_dotenv; load_dotenv()

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, BaseMessage

class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def chatbot(state: State) -> dict:
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node("chatbot", chatbot)
builder.set_entry_point("chatbot")
builder.add_edge("chatbot", END)
graph = builder.compile(checkpointer=MemorySaver())

cfg = {"configurable": {"thread_id": "demo"}}

def chat(msg: str) -> str:
    r = graph.invoke({"messages": [HumanMessage(content=msg)]}, cfg)
    return r["messages"][-1].content

print(chat("What is LangGraph?"))
print(chat("Give me a 3-line Python example."))
print(chat("What did I ask first?"))

# Upgrade to ReAct agent with tools
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.tools import tool

@tool
def search(query: str) -> str:
    """Search the web for current info."""
    return f"Results for: {query}"

llm_t = ChatOpenAI(model="gpt-4o-mini").bind_tools([search])
def bot_with_tools(s): return {"messages": [llm_t.invoke(s["messages"])]}

b2 = StateGraph(State)
b2.add_node("bot",   bot_with_tools)
b2.add_node("tools", ToolNode([search]))
b2.set_entry_point("bot")
b2.add_conditional_edges("bot", tools_condition)
b2.add_edge("tools", "bot")
g2 = b2.compile(checkpointer=MemorySaver())`}</CodeBlock>
          </div>
        )}
      </Content>
    </ModulePage>
  );
}
