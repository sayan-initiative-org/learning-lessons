import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { GlobalStyles, T as TT } from "./_theme";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — remapped to warm-dark editorial palette (matches
// MlEngineerTransformation + standalone langraph modules). Legacy keys
// (bg2/bg3/bg4/blue/purple/teal/amber/coral/green/muted/dim) are kept as
// aliases so the section components below render in the new palette without
// rewriting every inline style.
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:      TT.bg,
  bg2:     TT.bgSunken,
  bg3:     TT.bgPanel,
  bg4:     TT.ink,
  border:  TT.border,
  border2: TT.borderHi,
  blue:    TT.steel,
  purple:  TT.plum,
  teal:    TT.sage,
  amber:   TT.gold,
  coral:   TT.rust,
  green:   TT.sage,
  text:    TT.text,
  muted:   TT.textMute,
  dim:     TT.textDim,
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS — thin wrappers around the shared _theme classes so the
// hub picks up the same look as the standalone modules.
// ─────────────────────────────────────────────────────────────────────────────

function CodeBlock({ file, lang = "python", children }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span>{file || lang}</span>
        <span className="codeblock-actions mono">
          <span style={{ color: T.dim }}>{lang}</span>
          <button className="codeblock-copy mono" onClick={handleCopy} aria-label="Copy code">
            {copied ? "✓ copied" : "copy"}
          </button>
        </span>
      </div>
      <pre className="scroll-hide">{children}</pre>
    </div>
  );
}

function Callout({ type = "insight", title, children }) {
  // Map legacy types onto the shared callout palette.
  const map = { insight: "info", tip: "tip", warn: "warn", danger: "danger", pattern: "pattern" };
  const cls = `callout callout-${map[type] || "info"}`;
  return (
    <div className={cls}>
      {title && <div className="callout-title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

function SectionHeader({ num, title, subtitle, color = T.amber }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
      <div className="mono" style={{ fontSize: 10.5, color, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
        Section {String(num).padStart(2, "0")} / 13
      </div>
      <h2 className="display h2" style={{ color: T.text }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, marginTop: 4, maxWidth: 720 }}>{subtitle}</p>}
    </div>
  );
}

function Grid({ cols = 3, children, gap = 14 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap, margin: "1rem 0" }}>
      {children}
    </div>
  );
}

function Card({ title, subtitle, accent = T.amber, icon, children }) {
  return (
    <div className="card" style={{ borderTop: `2px solid ${accent}` }}>
      {icon && <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>}
      {title && <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: T.text, marginBottom: 4 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

function Badge({ color = T.amber, children }) {
  return (
    <span className="pill mono" style={{ color, borderColor: `${color}55`, background: `${color}10` }}>
      {children}
    </span>
  );
}

function DataTable({ headers, rows }) {
  return (
    <table className="compare">
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={j === 0 ? "mono" : undefined}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function H3({ children, tag }) {
  return (
    <h3 className="h3" style={{ color: T.text, display: "flex", alignItems: "center", gap: 10 }}>
      <span>{children}</span>
      {tag && (
        <span className="mono pill" style={{ fontSize: 10, color: T.amber, borderColor: `${T.amber}55`, background: `${T.amber}10` }}>{tag}</span>
      )}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 01 — INTRODUCTION
// ─────────────────────────────────────────────────────────────────────────────
function S01() {
  return (
    <div>
      <SectionHeader num={1} title="Introduction & Philosophy" subtitle="What LangGraph is, why it exists, and when to choose it." />

      <Grid cols={2}>
        <Card icon="🔄" title="Cycles over pipelines" accent={T.blue} subtitle="Real agents loop — retry, reflect, correct. LangGraph is built around cyclic state machines, not linear chains." />
        <Card icon="🧠" title="Explicit shared state" accent={T.purple} subtitle="Every node reads from and writes to a typed TypedDict state. No hidden context, no magic — just clear data flow." />
        <Card icon="🎛️" title="Control first" accent={T.teal} subtitle="Breakpoints, HITL, time travel, and streaming are first-class features. You own every step of agent execution." />
        <Card icon="🏭" title="Production ready" accent={T.amber} subtitle="Built-in checkpointers, async support, multi-tenant threads, and LangGraph Platform for cloud deployment." />
      </Grid>

      <H3>LangGraph vs the alternatives</H3>
      <DataTable
        headers={["Feature", "LangChain chains", "LangGraph ✨", "AutoGen/CrewAI"]}
        rows={[
          ["Execution model",    "Linear DAG",      "Cyclic state machine",  "Role-based"],
          ["Loops / cycles",     "❌ No",            "✅ Yes (native)",       "✅ Limited"],
          ["Typed state",        "Pass-through",    "✅ TypedDict",          "❌ Dict only"],
          ["Human-in-the-loop",  "❌ Manual",        "✅ First-class",        "⚠️ Workaround"],
          ["Multi-agent",        "❌ Complex",       "✅ Native supervisor",  "✅ Built-in"],
          ["Persistence",        "❌ Stateless",     "✅ Checkpointers",      "❌ Stateless"],
          ["Streaming",          "⚠️ Partial",       "✅ 4 modes",            "⚠️ Basic"],
          ["Time travel",        "❌ No",            "✅ Checkpoint rewind",  "❌ No"],
          ["Fan-out parallel",   "❌ No",            "✅ Send API",           "❌ No"],
        ]}
      />

      <Callout type="insight" title="The mental model">
        LangGraph is a <strong>stateful actor system</strong>. Each node is an actor: reads shared state → does work → writes back a delta. Edges are wiring. The <strong>Pregel runtime</strong> schedules nodes, handles parallelism, and manages checkpointing. You write business logic; LangGraph handles the execution engine.
      </Callout>

      <H3>The Pregel runtime</H3>
      <p style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.75, margin: "0.5rem 0 1rem" }}>
        LangGraph is built on the <strong style={{ color: T.text }}>Pregel</strong> distributed graph computation model (from Google's 2010 paper). Each "superstep" runs all active nodes, collects their state updates, applies reducers, then decides which nodes run next. This is what makes parallel fan-out and convergent fan-in work automatically.
      </p>

      <Callout type="tip" title="When to use LangGraph">
        ✅ Multi-step reasoning loops &nbsp;·&nbsp; ✅ Multi-agent coordination &nbsp;·&nbsp; ✅ Human approval workflows &nbsp;·&nbsp; ✅ CRAG / Reflexion / Plan-Execute &nbsp;·&nbsp; ✅ Stateful long-running sessions &nbsp;·&nbsp; ✅ Retry/self-correction loops
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 02 — CORE CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────
function S02() {
  const [tab, setTab] = useState("state");
  const tabs = ["state", "nodes", "edges", "lifecycle"];
  return (
    <div>
      <SectionHeader num={2} title="Core Concepts" subtitle="State, Nodes, Edges, and the graph lifecycle — the four building blocks of every LangGraph system." color={T.purple} />

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", background: tab === t ? `${T.purple}20` : "transparent", color: tab === t ? T.purple : T.muted, border: `1px solid ${tab === t ? `${T.purple}50` : T.border}`, transition: "all 0.15s" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "state" && (
        <div>
          <H3>State — the single source of truth</H3>
          <p style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.75 }}>
            The graph state is a <code style={{ fontFamily: "monospace", color: T.purple, background: T.bg4, padding: "1px 5px", borderRadius: 4 }}>TypedDict</code> shared by all nodes. Each node receives the full state and returns a <em>delta</em> — only the fields it changed. Reducers control how deltas merge into state.
          </p>
          <CodeBlock file="state.py">
{`from typing import TypedDict, Annotated, Literal
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

# ── Basic state ──────────────────────────────────────────────────
class SimpleState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    # add_messages = reducer: new msgs are APPENDED, not overwritten

# ── Advanced state with custom reducers ──────────────────────────
import operator

class AdvancedState(TypedDict):
    messages:  Annotated[list[BaseMessage], add_messages]
    results:   Annotated[list[str], operator.add]   # append list
    count:     int                                   # overwrite
    status:    str                                   # overwrite
    final:     str                                   # overwrite

# ── Input / Output schema separation ────────────────────────────
class InputSchema(TypedDict):
    user_query: str

class OutputSchema(TypedDict):
    final_answer: str
    confidence: float

# Used in: builder = StateGraph(AgentState, input=InputSchema, output=OutputSchema)`}
          </CodeBlock>
          <DataTable
            headers={["Reducer", "Behavior", "Use case"]}
            rows={[
              ["add_messages", "Appends, dedupes by ID", "Chat message history"],
              ["operator.add", "Concatenates lists", "Parallel worker results"],
              ["(none)", "Last write wins (overwrite)", "Status flags, counts, strings"],
              ["custom fn", "Your merge logic", "Complex domain objects"],
            ]}
          />
        </div>
      )}

      {tab === "nodes" && (
        <div>
          <H3>Nodes — units of work</H3>
          <p style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.75 }}>
            A node is any Python callable: a function, lambda, or class with <code style={{ fontFamily: "monospace", color: T.purple, background: T.bg4, padding: "1px 5px", borderRadius: 4 }}>__call__</code>. It receives the full state and returns a dict of fields to update.
          </p>
          <CodeBlock file="nodes.py">
{`from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# ── Simplest node: pure function ─────────────────────────────────
def my_node(state: AgentState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}   # only return changed fields

# ── Async node (preferred for production) ───────────────────────
async def my_async_node(state: AgentState) -> dict:
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

# ── Node with config (multi-tenant, per-user settings) ───────────
from langchain_core.runnables import RunnableConfig

def configurable_node(state: AgentState, config: RunnableConfig) -> dict:
    user_id  = config["configurable"].get("user_id", "default")
    llm_name = config["configurable"].get("model", "gpt-4o")
    llm = ChatOpenAI(model=llm_name)
    response = llm.invoke(state["messages"])
    return {"messages": [AIMessage(content=response.content)]}

# ── Node that reads multiple state fields ────────────────────────
def writer_node(state: AgentState) -> dict:
    research = state.get("research_data", "")
    critique = state.get("critique", "No prior critique")
    prompt = f"Research: {research}\\n\\nCritique: {critique}\\nWrite final doc."
    response = llm.invoke(prompt)
    return {
        "final_output": response.content,
        "messages": [AIMessage(content=response.content, name="writer")]
    }

# ── Special node: __start__ and __end__ ─────────────────────────
# builder.set_entry_point("my_node")  →  adds START → my_node edge
# builder.add_edge("last_node", END)  →  adds last_node → END edge`}
          </CodeBlock>
        </div>
      )}

      {tab === "edges" && (
        <div>
          <H3>Edges — routing and control flow</H3>
          <p style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.75 }}>
            Edges connect nodes. LangGraph has four edge types covering every routing pattern you'll need.
          </p>
          <DataTable
            headers={["Edge type", "API", "When to use"]}
            rows={[
              ["Normal edge",       "add_edge(a, b)",                          "Always go A → B"],
              ["Conditional edge",  "add_conditional_edges(a, fn, map)",       "Branch based on state"],
              ["Entry point",       "set_entry_point(node)",                   "First node to run"],
              ["Send (parallel)",   "add_conditional_edges with Send objects", "Dynamic fan-out"],
            ]}
          />
          <CodeBlock file="edges.py">
{`from langgraph.graph import StateGraph, END
from langgraph.types import Send

builder = StateGraph(AgentState)

# ── Normal edge: A always flows to B ────────────────────────────
builder.add_edge("node_a", "node_b")

# ── Conditional edge: branch based on state value ───────────────
def route_after_supervisor(state: AgentState) -> str:
    next_node = state["next"]
    if next_node == "FINISH": return END
    return next_node   # "researcher" | "writer" | "critic"

builder.add_conditional_edges(
    source="supervisor",
    path=route_after_supervisor,
    path_map={
        "researcher": "researcher",
        "writer":     "writer",
        "critic":     "critic",
        END:          END,
    }
)

# ── Entry / finish ───────────────────────────────────────────────
builder.set_entry_point("supervisor")         # START → supervisor
builder.add_edge("researcher", "supervisor")  # always return to supervisor

# ── Parallel fan-out via Send ────────────────────────────────────
def dispatch(state: AgentState) -> list[Send]:
    return [Send("worker", {"item": x}) for x in state["items"]]

builder.add_conditional_edges("__start__", dispatch, ["worker"])
builder.add_edge("worker", "aggregator")`}
          </CodeBlock>
        </div>
      )}

      {tab === "lifecycle" && (
        <div>
          <H3>Graph lifecycle — 6 steps</H3>
          <CodeBlock file="lifecycle.py">
{`# ── Step 1: Define state ────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    next: str

# ── Step 2: Define nodes ─────────────────────────────────────────
def my_node(state: AgentState) -> dict: ...

# ── Step 3: Build the graph ──────────────────────────────────────
builder = StateGraph(AgentState)
builder.add_node("my_node", my_node)
builder.set_entry_point("my_node")
builder.add_edge("my_node", END)

# ── Step 4: Compile ──────────────────────────────────────────────
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(checkpointer=MemorySaver())

# ── Step 5: Invoke / Stream ──────────────────────────────────────
config = {"configurable": {"thread_id": "user-001"}}
result = graph.invoke({"messages": [HumanMessage(content="Hi")]}, config)

# ── Step 6: Inspect state ────────────────────────────────────────
state_snapshot = graph.get_state(config)
print(state_snapshot.values)          # current state
print(state_snapshot.next)            # which nodes run next
history = list(graph.get_state_history(config))  # all checkpoints`}
          </CodeBlock>
          <Callout type="pattern" title="Compile-time options">
            <code style={{ fontFamily: "monospace", color: T.teal }}>builder.compile(</code><br/>
            &nbsp;&nbsp;<code style={{ fontFamily: "monospace", color: T.text }}>checkpointer=MemorySaver(),</code>&nbsp;&nbsp;← enables persistence + HITL<br/>
            &nbsp;&nbsp;<code style={{ fontFamily: "monospace", color: T.text }}>interrupt_before=["writer"],</code>&nbsp;← pause before this node<br/>
            &nbsp;&nbsp;<code style={{ fontFamily: "monospace", color: T.text }}>interrupt_after=["critic"],</code>&nbsp;&nbsp;← pause after this node<br/>
            <code style={{ fontFamily: "monospace", color: T.teal }}>)</code>
          </Callout>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 03 — FIRST GRAPH
// ─────────────────────────────────────────────────────────────────────────────
function S03() {
  return (
    <div>
      <SectionHeader num={3} title="Your First Graph" subtitle="A complete, runnable chatbot with memory — the canonical LangGraph starting point." color={T.teal} />

      <CodeBlock file="chatbot.py">
{`# pip install langgraph langchain-openai python-dotenv
from dotenv import load_dotenv; load_dotenv()

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, BaseMessage

# ── 1. State ─────────────────────────────────────────────────────
class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

# ── 2. LLM node ──────────────────────────────────────────────────
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def chatbot(state: ChatState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# ── 3. Build graph ────────────────────────────────────────────────
builder = StateGraph(ChatState)
builder.add_node("chatbot", chatbot)
builder.set_entry_point("chatbot")
builder.add_edge("chatbot", END)

# ── 4. Compile with MemorySaver (in-memory persistence) ──────────
graph = builder.compile(checkpointer=MemorySaver())

# ── 5. Multi-turn conversation ───────────────────────────────────
config = {"configurable": {"thread_id": "session-001"}}

def chat(user_msg: str):
    result = graph.invoke(
        {"messages": [HumanMessage(content=user_msg)]},
        config=config
    )
    return result["messages"][-1].content

print(chat("What is LangGraph?"))
print(chat("Give me a code example."))   # knows context from turn 1
print(chat("What did I ask you first?")) # still remembers`}
      </CodeBlock>

      <Callout type="tip" title="Key insight: add_messages reducer">
        Each <code style={{ fontFamily: "monospace" }}>graph.invoke()</code> call APPENDS the new human + AI messages to the thread's message list. LangGraph's <strong>MemorySaver</strong> checkpoints state after every node — so the second call already has the full conversation history from turn 1.
      </Callout>

      <H3>Add tools — upgrade to a ReAct agent</H3>
      <CodeBlock file="chatbot_with_tools.py">
{`from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    return f"Weather in {city}: 28°C, partly cloudy"

@tool
def search_web(query: str) -> str:
    """Search the web for information."""
    return f"Top result for '{query}': relevant information here"

tools = [get_weather, search_web]
llm_with_tools = llm.bind_tools(tools)

def chatbot_with_tools(state: ChatState) -> dict:
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# ── Graph with tool routing ───────────────────────────────────────
builder = StateGraph(ChatState)
builder.add_node("chatbot", chatbot_with_tools)
builder.add_node("tools", ToolNode(tools))           # prebuilt tool executor
builder.set_entry_point("chatbot")

# tools_condition: "tools" if last msg has tool_calls, else END
builder.add_conditional_edges("chatbot", tools_condition)
builder.add_edge("tools", "chatbot")   # loop back after tool use

graph = builder.compile(checkpointer=MemorySaver())`}
      </CodeBlock>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 04 — AGENTS & TOOLS
// ─────────────────────────────────────────────────────────────────────────────
function S04() {
  const [tab, setTab] = useState("prebuilt");
  return (
    <div>
      <SectionHeader num={4} title="Agents & Tools" subtitle="ReAct agents, ToolNode, tool definition patterns, and the prebuilt vs custom trade-off." color={T.amber} />

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
        {["prebuilt", "custom", "tools", "toolnode"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", background: tab === t ? `${T.amber}20` : "transparent", color: tab === t ? T.amber : T.muted, border: `1px solid ${tab === t ? `${T.amber}50` : T.border}`, transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "prebuilt" && (
        <div>
          <H3>create_react_agent — fastest path</H3>
          <CodeBlock file="prebuilt_agent.py">
{`from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults

llm   = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [TavilySearchResults(max_results=5)]

# One-liner agent with full ReAct loop + memory
graph = create_react_agent(
    llm,
    tools=tools,
    checkpointer=SqliteSaver.from_conn_string("agent.db"),
    state_modifier="You are a research expert. Be thorough and cite sources.",
)

config = {"configurable": {"thread_id": "research-001"}}
result = graph.invoke(
    {"messages": [HumanMessage(content="What are India's top AI companies in 2025?")]},
    config=config
)
print(result["messages"][-1].content)`}
          </CodeBlock>
          <Callout type="insight" title="What create_react_agent gives you">
            ✅ Automatic tool-calling loop &nbsp;·&nbsp; ✅ MemorySaver / custom checkpointer &nbsp;·&nbsp; ✅ System prompt injection &nbsp;·&nbsp; ✅ Streaming support &nbsp;·&nbsp; ✅ Full LangSmith tracing
          </Callout>
        </div>
      )}

      {tab === "custom" && (
        <div>
          <H3>Custom ReAct from scratch</H3>
          <CodeBlock file="custom_react.py">
{`from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

SYSTEM_PROMPT = """You are an expert AI agent. Think step by step.
Use tools when you need external data. Reason before acting."""

def build_custom_react(tools: list, model: str = "gpt-4o"):
    llm = ChatOpenAI(model=model, temperature=0).bind_tools(tools)

    def agent_node(state):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
        return {"messages": [llm.invoke(messages)]}

    builder = StateGraph(AgentState)
    builder.add_node("agent", agent_node)
    builder.add_node("tools", ToolNode(tools))
    builder.set_entry_point("agent")
    builder.add_conditional_edges("agent", tools_condition)
    builder.add_edge("tools", "agent")
    return builder.compile()

# Advantage over prebuilt: add custom nodes between tool and agent
# e.g., add a "grader" node to validate tool outputs before looping`}
          </CodeBlock>
        </div>
      )}

      {tab === "tools" && (
        <div>
          <H3>4 tool definition patterns</H3>
          <CodeBlock file="tool_patterns.py">
{`from langchain_core.tools import tool, BaseTool, InjectedToolArg
from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field
from typing import Annotated

# ── Pattern 1: @tool decorator (most common) ─────────────────────
@tool
def search_documents(query: str, top_k: int = 5) -> list[str]:
    """Search internal knowledge base. Returns top_k relevant docs."""
    # ... vector search logic
    return ["doc1", "doc2"]

# ── Pattern 2: Pydantic schema (best for complex inputs) ─────────
class DatabaseQueryInput(BaseModel):
    table:  str   = Field(description="Table to query")
    filter: str   = Field(description="SQL WHERE clause")
    limit:  int   = Field(default=10, description="Max rows")

@tool(args_schema=DatabaseQueryInput)
def query_database(table: str, filter: str, limit: int) -> str:
    """Execute a read-only database query."""
    return f"SELECT * FROM {table} WHERE {filter} LIMIT {limit}"

# ── Pattern 3: InjectedState (read graph state inside tool) ──────
@tool
def get_user_context(
    question: str,
    state: Annotated[AgentState, InjectedToolArg]   # injected — not LLM param
) -> str:
    """Answer using context already in graph state."""
    return f"Context from state: {state.get('research_data', '')}"

# ── Pattern 4: Tool with RunnableConfig (access thread_id etc) ────
@tool
def personalized_response(
    query: str,
    config: Annotated[RunnableConfig, InjectedToolArg]
) -> str:
    """Tool that knows which user is calling it."""
    user_id = config["configurable"].get("user_id", "anonymous")
    return f"Personalized response for {user_id}: {query}"`}
          </CodeBlock>
        </div>
      )}

      {tab === "toolnode" && (
        <div>
          <H3>ToolNode — prebuilt tool executor</H3>
          <CodeBlock file="toolnode.py">
{`from langgraph.prebuilt import ToolNode

# ── Standard ToolNode ─────────────────────────────────────────────
tool_node = ToolNode(tools=[search_documents, query_database])
# Automatically:
# 1. Parses tool_calls from last AIMessage
# 2. Executes each tool (parallel if multiple calls)
# 3. Returns ToolMessages with results

# ── ToolNode with error handling ──────────────────────────────────
tool_node = ToolNode(
    tools=tools,
    handle_tool_errors=True  # catches exceptions, returns error as ToolMessage
)

# ── Custom tool executor (if you need pre/post processing) ────────
def custom_tool_node(state: AgentState) -> dict:
    last_message = state["messages"][-1]
    tool_results = []
    for tool_call in last_message.tool_calls:
        tool = next(t for t in tools if t.name == tool_call["name"])
        try:
            result = tool.invoke(tool_call["args"])
        except Exception as e:
            result = f"Tool error: {str(e)}"
        tool_results.append(
            ToolMessage(content=str(result), tool_call_id=tool_call["id"])
        )
    return {"messages": tool_results}

# ── tools_condition helper ────────────────────────────────────────
# Returns "tools" if last message has tool_calls, else END
builder.add_conditional_edges("agent", tools_condition)`}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 05 — STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function S05() {
  return (
    <div>
      <SectionHeader num={5} title="State Management" subtitle="Reducers, schema separation, configurable state, and private node state patterns." color={T.purple} />

      <H3>Reducer patterns</H3>
      <CodeBlock file="reducers.py">
{`import operator
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

# ── Built-in reducers ────────────────────────────────────────────
class State(TypedDict):
    # add_messages: appends, deduplicates by message ID
    messages: Annotated[list, add_messages]

    # operator.add: concatenates lists (fan-in pattern)
    results: Annotated[list[str], operator.add]

    # No annotation = last write wins (overwrite)
    status:  str
    count:   int

# ── Custom reducer function ──────────────────────────────────────
def merge_dicts(existing: dict, new: dict) -> dict:
    """Deep merge two dicts — useful for metadata accumulation."""
    return {**existing, **new}

class AdvancedState(TypedDict):
    metadata: Annotated[dict, merge_dicts]

# ── Reducer for max value ────────────────────────────────────────
def keep_max(a: float, b: float) -> float:
    return max(a, b)

class EvalState(TypedDict):
    best_score: Annotated[float, keep_max]  # parallel workers, keep best`}
      </CodeBlock>

      <H3>Input / Output schema separation</H3>
      <CodeBlock file="schema_separation.py">
{`# Use when: you want to control exactly what enters and exits the graph

class InputSchema(TypedDict):
    user_query: str
    context:    str

class InternalState(TypedDict):
    """Full working state — invisible outside the graph."""
    user_query:    str
    context:       str
    research_data: str
    draft:         str
    critique:      str
    iteration:     int
    messages:      Annotated[list, add_messages]

class OutputSchema(TypedDict):
    """Only these fields returned to caller."""
    final_answer: str
    confidence:   float

builder = StateGraph(InternalState, input=InputSchema, output=OutputSchema)
# graph.invoke(InputSchema dict) → returns OutputSchema dict`}
      </CodeBlock>

      <H3>Configurable state — multi-tenant</H3>
      <CodeBlock file="configurable.py">
{`from langchain_core.runnables import RunnableConfig
from typing import Literal

# ── Per-user configuration via config dict ───────────────────────
def agent_node(state: AgentState, config: RunnableConfig) -> dict:
    cfg         = config.get("configurable", {})
    user_id     = cfg.get("user_id", "default")
    model_name  = cfg.get("model", "gpt-4o-mini")
    temperature = cfg.get("temperature", 0)
    system_msg  = cfg.get("system_prompt", "You are a helpful assistant.")

    llm = ChatOpenAI(model=model_name, temperature=temperature)
    # ... use llm

# ── Invoke with per-user config ──────────────────────────────────
graph.invoke(
    {"messages": [HumanMessage(content="Hello")]},
    config={
        "configurable": {
            "thread_id":     "user-42-session-1",   # persistence key
            "user_id":       "sayan@example.com",
            "model":         "gpt-4o",
            "temperature":   0,
            "system_prompt": "You are an SDLC expert agent."
        }
    }
)

# ── Using Pydantic for configurable schema (typed config) ────────
from langgraph.graph import RunnableCallable
from pydantic import BaseModel

class AgentConfig(BaseModel):
    model: Literal["gpt-4o", "gpt-4o-mini"] = "gpt-4o-mini"
    temperature: float = 0
    user_id: str = "anonymous"

# Access via config["configurable"] in node functions`}
      </CodeBlock>

      <Callout type="pattern" title="Private node state">
        For data only one node needs (e.g., intermediate embeddings), pass it as the node's function argument instead of storing in shared state. This keeps your <code style={{ fontFamily: "monospace" }}>AgentState</code> clean and avoids polluting other nodes' context.
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 06 — MEMORY & PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────
function S06() {
  return (
    <div>
      <SectionHeader num={6} title="Memory & Persistence" subtitle="Checkpointers, threads, cross-thread memory, and time travel." color={T.teal} />

      <DataTable
        headers={["Checkpointer", "Use case", "Concurrency", "Setup"]}
        rows={[
          ["MemorySaver",    "Dev / testing",         "❌ Single thread",  "Zero — in-memory"],
          ["SqliteSaver",    "Local / single-user",   "⚠️ Limited",       "SQLite file"],
          ["PostgresSaver",  "Production multi-user", "✅ Full ACID",      "Postgres connection"],
          ["RedisSaver",     "High-throughput",       "✅ Pub/sub ready",  "Redis connection"],
        ]}
      />

      <CodeBlock file="persistence.py">
{`# ── In-memory (dev only) ─────────────────────────────────────────
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(checkpointer=MemorySaver())

# ── SQLite (local apps) ───────────────────────────────────────────
from langgraph.checkpoint.sqlite import SqliteSaver
with SqliteSaver.from_conn_string("checkpoints.db") as saver:
    graph = builder.compile(checkpointer=saver)

# ── PostgreSQL (production) ───────────────────────────────────────
from langgraph.checkpoint.postgres import PostgresSaver
DB_URI = "postgresql://user:pass@localhost:5432/langgraph"
with PostgresSaver.from_conn_string(DB_URI) as saver:
    saver.setup()  # creates tables on first run
    graph = builder.compile(checkpointer=saver)

# ── Thread-scoped state: each thread_id = isolated conversation ───
config_user_1 = {"configurable": {"thread_id": "user-001"}}
config_user_2 = {"configurable": {"thread_id": "user-002"}}
# user-001 and user-002 have completely separate state histories`}
      </CodeBlock>

      <H3>Time travel — rewind and branch</H3>
      <CodeBlock file="time_travel.py">
{`# ── Get full state history (all checkpoints in a thread) ─────────
config  = {"configurable": {"thread_id": "session-001"}}
history = list(graph.get_state_history(config))

# history[0] = most recent, history[-1] = initial state
for snapshot in history:
    print(snapshot.config["configurable"]["checkpoint_id"])
    print(snapshot.values.keys())   # state fields at this checkpoint

# ── Rewind to a past checkpoint ──────────────────────────────────
past_config = history[2].config   # 3 steps ago
past_state  = graph.get_state(past_config)

# ── Fork from a past checkpoint (branching) ──────────────────────
# Override a field at the past checkpoint
graph.update_state(
    past_config,
    values={"critique": "Actually, APPROVED — skip revision"},
    as_node="critic"   # pretend critic node wrote this
)
# Continue from this new branch
new_result = graph.invoke(None, config=past_config)`}
      </CodeBlock>

      <H3>Cross-thread memory — InMemoryStore</H3>
      <CodeBlock file="cross_thread_memory.py">
{`from langgraph.store.memory import InMemoryStore

# ── Long-term user memory (persists across threads) ───────────────
store = InMemoryStore()

graph = builder.compile(
    checkpointer=MemorySaver(),
    store=store               # enables cross-thread shared memory
)

# ── Write to store from inside a node ────────────────────────────
from langgraph.types import RunnableConfig
from langchain_core.runnables import get_store_from_config

def memory_node(state, config: RunnableConfig, store: InMemoryStore):
    user_id = config["configurable"]["user_id"]
    # Namespace: (user_id, "preferences")
    store.put((user_id, "prefs"), "favorite_model", {"model": "gpt-4o"})
    existing = store.get((user_id, "prefs"), "favorite_model")
    return {"messages": [AIMessage(content=f"Remembered: {existing}")]}`}
      </CodeBlock>

      <Callout type="tip" title="Thread vs store memory">
        <strong>Thread memory</strong> (checkpointer): scoped to one conversation thread — messages, intermediate results, agent state.<br />
        <strong>Store memory</strong>: shared across threads — user preferences, long-term facts, knowledge that persists beyond a session.
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 07 — HUMAN IN THE LOOP
// ─────────────────────────────────────────────────────────────────────────────
function S07() {
  return (
    <div>
      <SectionHeader num={7} title="Human-in-the-Loop" subtitle="Breakpoints, dynamic interrupts, state editing, and approval workflows." color={T.coral} />

      <Grid cols={2}>
        <Card title="interrupt_before / after" accent={T.coral} subtitle="Compile-time: always pause before/after a specific node. Good for fixed approval gates." />
        <Card title="interrupt()" accent={T.amber} subtitle="Runtime: pause inside a node conditionally. Good for dynamic HITL based on state." />
      </Grid>

      <H3>Compile-time breakpoints</H3>
      <CodeBlock file="hitl_breakpoints.py">
{`# ── Pause BEFORE writer runs ──────────────────────────────────────
graph = builder.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["writer"]   # always pause here
)

config = {"configurable": {"thread_id": "approval-001"}}

# First invoke: runs up to writer, then pauses
result = graph.invoke({"messages": [HumanMessage(content="Write a report")]}, config)
# result["__interrupt__"] = InterruptValue (graph is paused)

# ── Inspect state before approving ───────────────────────────────
state = graph.get_state(config)
print("About to run:", state.next)          # ("writer",)
print("Draft so far:", state.values.get("draft_content"))

# ── Option A: approve and resume ─────────────────────────────────
graph.invoke(None, config)    # resume with no changes

# ── Option B: edit state then resume ──────────────────────────────
graph.update_state(config, {"draft_content": "Modified draft..."})
graph.invoke(None, config)

# ── Option C: reject — override to skip writer ───────────────────
graph.update_state(config, {"next": "FINISH"}, as_node="supervisor")
graph.invoke(None, config)`}
      </CodeBlock>

      <H3>Dynamic interrupt() inside a node</H3>
      <CodeBlock file="dynamic_interrupt.py">
{`from langgraph.types import interrupt, Command

# ── interrupt() pauses mid-node and returns value to caller ───────
def writer_node(state: AgentState) -> dict:
    draft = generate_draft(state)

    # Conditionally ask for human input
    if state.get("requires_approval", False):
        human_feedback = interrupt({
            "draft":    draft,
            "question": "Please review. Type APPROVE or provide edits."
        })
        # Graph is now paused. human_feedback is None until resumed.
        if human_feedback and human_feedback != "APPROVE":
            draft = apply_feedback(draft, human_feedback)

    return {"draft_content": draft, "final_output": draft}

# ── Caller flow ───────────────────────────────────────────────────
config = {"configurable": {"thread_id": "dynamic-001"}}

# First call: runs until interrupt(), pauses
result = graph.invoke(state, config)
# result["__interrupt__"][0].value = {"draft": "...", "question": "..."}

# Human reviews, then resumes with Command
resume_result = graph.invoke(
    Command(resume="APPROVE"),   # or Command(resume="Please add a conclusion")
    config
)`}
      </CodeBlock>

      <Callout type="warn" title="Requires checkpointer">
        HITL only works when a checkpointer is attached. Without one, <code style={{ fontFamily: "monospace" }}>interrupt()</code> raises an error because there's nowhere to save the paused state.
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 08 — MULTI-AGENT
// ─────────────────────────────────────────────────────────────────────────────
function S08() {
  const [tab, setTab] = useState("supervisor");
  return (
    <div>
      <SectionHeader num={8} title="Multi-Agent Systems" subtitle="Supervisor pattern, Command-based swarm, hierarchical agents, and when to use each." color={T.blue} />

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
        {["supervisor", "command", "hierarchical"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", background: tab === t ? `${T.blue}20` : "transparent", color: tab === t ? T.blue : T.muted, border: `1px solid ${tab === t ? `${T.blue}50` : T.border}`, transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "supervisor" && (
        <div>
          <H3>Supervisor pattern — central LLM router</H3>
          <CodeBlock file="supervisor.py">
{`from pydantic import BaseModel
from typing import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

MEMBERS  = ["researcher", "writer", "critic"]
OPTIONS  = MEMBERS + ["FINISH"]
MAX_ITER = 6

class RouterOutput(BaseModel):
    next: Literal["researcher", "writer", "critic", "FINISH"]
    reasoning: str

llm = ChatOpenAI(model="gpt-4o").with_structured_output(RouterOutput)

SUPERVISOR_PROMPT = f"""
You orchestrate {MEMBERS}. Routing rules:
- Start: researcher → gather facts
- After research: writer → produce draft
- After draft: critic → review quality
- If critic says APPROVED or iteration >= {MAX_ITER}: FINISH
- If critique fails: back to writer
Never route same agent twice in a row unless needed.
"""

def supervisor_node(state: AgentState) -> dict:
    iteration = state.get("iteration_count", 0)
    if iteration >= MAX_ITER:
        return {"next": "FINISH", "iteration_count": iteration}

    result: RouterOutput = llm.invoke([
        SystemMessage(content=SUPERVISOR_PROMPT),
        HumanMessage(content=f"Iteration {iteration}. Research: {'YES' if state.get('research_data') else 'NO'}. Draft: {'YES' if state.get('draft') else 'NO'}. Critique: {state.get('critique', 'none')[:100]}")
    ])
    return {"next": result.next, "iteration_count": iteration + 1}

# ── Graph wiring ──────────────────────────────────────────────────
builder = StateGraph(AgentState)
builder.add_node("supervisor", supervisor_node)
builder.add_node("researcher", researcher_node)
builder.add_node("writer",     writer_node)
builder.add_node("critic",     critic_node)
builder.set_entry_point("supervisor")
builder.add_conditional_edges("supervisor",
    lambda s: s["next"],
    {"researcher": "researcher", "writer": "writer", "critic": "critic", "FINISH": END}
)
for m in MEMBERS:
    builder.add_edge(m, "supervisor")   # all agents return to supervisor`}
          </CodeBlock>
        </div>
      )}

      {tab === "command" && (
        <div>
          <H3>Command swarm — decentralized handoffs</H3>
          <CodeBlock file="command_swarm.py">
{`from langgraph.types import Command
from typing import Literal

# ── Agents emit Command to route directly ─────────────────────────
def researcher(state: AgentState) -> Command[Literal["writer", "supervisor"]]:
    # ... do research
    result = "Research complete: key findings..."
    return Command(
        goto="writer",     # direct handoff — no supervisor roundtrip
        update={
            "research_data": result,
            "messages": [AIMessage(content=result, name="researcher")]
        }
    )

def writer(state: AgentState) -> Command[Literal["critic", "__end__"]]:
    # ... write draft
    draft = "Draft document..."
    return Command(
        goto="critic",
        update={"draft": draft, "messages": [AIMessage(content=draft, name="writer")]}
    )

def critic(state: AgentState) -> Command[Literal["writer", "__end__"]]:
    # ... critique
    feedback = "APPROVED — quality is good"
    approved = "APPROVED" in feedback
    return Command(
        goto="__end__" if approved else "writer",
        update={"critique": feedback}
    )

# ── Build swarm graph ─────────────────────────────────────────────
builder = StateGraph(AgentState)
builder.add_node("researcher", researcher)
builder.add_node("writer",     writer)
builder.add_node("critic",     critic)
builder.set_entry_point("researcher")
# No add_conditional_edges needed — Command handles all routing`}
          </CodeBlock>
          <Callout type="insight" title="Supervisor vs Command">
            <strong>Supervisor:</strong> central LLM decides routing → easier to debug, better for complex routing logic.<br/>
            <strong>Command:</strong> each agent routes itself → lower latency (no supervisor call), better when routing is deterministic.
          </Callout>
        </div>
      )}

      {tab === "hierarchical" && (
        <div>
          <H3>Hierarchical agents — subgraphs as nodes</H3>
          <CodeBlock file="hierarchical.py">
{`# ── Sub-agent graph (self-contained) ─────────────────────────────
def build_research_subgraph():
    sub_builder = StateGraph(ResearchState)
    sub_builder.add_node("search",    search_node)
    sub_builder.add_node("summarize", summarize_node)
    sub_builder.set_entry_point("search")
    sub_builder.add_edge("search", "summarize")
    sub_builder.add_edge("summarize", END)
    return sub_builder.compile()

research_subgraph = build_research_subgraph()

# ── Parent graph treats subgraph as a single node ─────────────────
parent_builder = StateGraph(ParentState)
parent_builder.add_node("research", research_subgraph)  # entire sub-graph!
parent_builder.add_node("writer",   writer_node)
parent_builder.set_entry_point("research")
parent_builder.add_edge("research", "writer")
parent_graph = parent_builder.compile()

# ── State mapping: parent state → subgraph input ──────────────────
# LangGraph auto-maps fields with matching names between
# ParentState and ResearchState. For custom mapping, use a wrapper:
def research_wrapper(parent_state: ParentState) -> dict:
    return research_subgraph.invoke({
        "query": parent_state["user_query"],  # map parent → sub
        "depth": parent_state.get("depth", 2)
    })`}
          </CodeBlock>
          <Callout type="pattern" title="SDLC Copilot mapping">
            Your orchestrator is the parent graph. Each specialist (UserStoryAgent, GherkinAgent, TestCaseAgent) is a subgraph compiled independently. The supervisor routes to subgraphs just like routing to regular nodes.
          </Callout>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 09 — PARALLEL EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
function S09() {
  return (
    <div>
      <SectionHeader num={9} title="Parallel Execution" subtitle="Send API, fan-out / fan-in, map-reduce, and static parallel branches." color={T.green} />

      <Callout type="pattern" title="The core idea">
        <strong>Fan-out</strong>: one dispatcher creates N <code style={{ fontFamily: "monospace" }}>Send()</code> objects → N workers run simultaneously.<br/>
        <strong>Fan-in</strong>: N workers write to a <code style={{ fontFamily: "monospace" }}>Annotated[list, operator.add]</code> field → automatically merged when all finish.
      </Callout>

      <H3>Send API — dynamic map-reduce</H3>
      <CodeBlock file="parallel_send.py">
{`from langgraph.types import Send
from typing import Annotated
import operator

# ── State with list reducer for fan-in ────────────────────────────
class MapReduceState(TypedDict):
    documents: list[str]                             # input
    summaries: Annotated[list[str], operator.add]    # fan-in reducer
    final_report: str                                # aggregated

# ── Dispatcher: creates one Send per document ─────────────────────
def dispatch_summarizers(state: MapReduceState) -> list[Send]:
    """Fan-out: one worker per document."""
    return [
        Send("summarize_worker", {"doc": doc, "doc_id": i})
        for i, doc in enumerate(state["documents"])
    ]

# ── Worker: processes ONE item per invocation ──────────────────────
def summarize_worker(state: dict) -> dict:
    """Runs N times in parallel — one per Send."""
    doc    = state["doc"]
    doc_id = state["doc_id"]
    summary = llm.invoke(f"Summarize in 2 sentences: {doc}").content
    return {"summaries": [f"[Doc {doc_id}] {summary}"]}   # list → add reducer

# ── Aggregator: runs after ALL workers finish ──────────────────────
def aggregate_summaries(state: MapReduceState) -> dict:
    combined = "\\n\\n".join(state["summaries"])
    report   = llm.invoke(f"Create a final report from these summaries:\\n{combined}").content
    return {"final_report": report}

# ── Graph wiring ──────────────────────────────────────────────────
builder = StateGraph(MapReduceState)
builder.add_node("summarize_worker", summarize_worker)
builder.add_node("aggregate",        aggregate_summaries)

# conditional_edges on __start__ with Send = dynamic fan-out
builder.add_conditional_edges("__start__", dispatch_summarizers, ["summarize_worker"])
builder.add_edge("summarize_worker", "aggregate")
builder.add_edge("aggregate", END)
graph = builder.compile()`}
      </CodeBlock>

      <H3>Static parallel branches</H3>
      <CodeBlock file="static_parallel.py">
{`# ── Static fan-out: always run A and B in parallel ───────────────
builder.add_node("branch_a", node_a)
builder.add_node("branch_b", node_b)
builder.add_node("merge",    merge_node)

builder.set_entry_point("branch_a")
builder.set_entry_point("branch_b")  # both start simultaneously
builder.add_edge("branch_a", "merge")
builder.add_edge("branch_b", "merge")
# merge runs only after BOTH branch_a AND branch_b complete

# ── Practical use: evaluate multiple criteria in parallel ─────────
class EvalState(TypedDict):
    content:   str
    scores:    Annotated[list[float], operator.add]   # each eval adds a score
    passed:    bool

def eval_factuality(state):
    score = llm_judge(state["content"], "factuality")
    return {"scores": [score]}

def eval_structure(state):
    score = llm_judge(state["content"], "structure")
    return {"scores": [score]}

def eval_relevance(state):
    score = llm_judge(state["content"], "relevance")
    return {"scores": [score]}

def final_verdict(state):
    avg = sum(state["scores"]) / len(state["scores"])
    return {"passed": avg >= 7.0}`}
      </CodeBlock>

      <Callout type="tip" title="Performance note">
        Parallel execution in LangGraph is <strong>async by default</strong> when you use <code style={{ fontFamily: "monospace" }}>ainvoke()</code>. For CPU-bound tools, use <code style={{ fontFamily: "monospace" }}>asyncio.gather</code> inside workers. N parallel LLM calls instead of sequential = N× latency reduction.
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10 — STREAMING
// ─────────────────────────────────────────────────────────────────────────────
function S10() {
  return (
    <div>
      <SectionHeader num={10} title="Streaming" subtitle="Four streaming modes, token-level streaming, custom events, and async patterns." color={T.amber} />

      <DataTable
        headers={["Mode", "What it emits", "Use case"]}
        rows={[
          ["values",   "Full state after each superstep",         "See complete state evolution"],
          ["updates",  "State delta from each node",              "See what each node changed"],
          ["messages", "Token-by-token LLM output",               "Live chat UI streaming"],
          ["custom",   "User-emitted events via stream_writer",   "Progress, tool status, debug"],
        ]}
      />

      <CodeBlock file="streaming.py">
{`# ── Mode 1: values — full state after each step ──────────────────
for state in graph.stream(input, config, stream_mode="values"):
    print(state.keys())               # full AgentState after each node

# ── Mode 2: updates — delta per node ─────────────────────────────
for chunk in graph.stream(input, config, stream_mode="updates"):
    for node_name, update in chunk.items():
        print(f"{node_name}: {list(update.keys())}")

# ── Mode 3: messages — token streaming ───────────────────────────
for msg, metadata in graph.stream(input, config, stream_mode="messages"):
    if msg.content and not isinstance(msg, HumanMessage):
        print(msg.content, end="", flush=True)

# ── Mode 4: custom events ─────────────────────────────────────────
from langgraph.config import get_stream_writer

def research_node(state: AgentState) -> dict:
    writer = get_stream_writer()
    writer({"status": "searching", "query": "AI startups India"})
    results = tavily_search.invoke("AI startups India 2025")
    writer({"status": "done", "result_count": len(results)})
    return {"research_data": str(results)}

for event in graph.stream(input, config, stream_mode="custom"):
    print(event)   # {"status": "searching", "query": "..."}

# ── Async streaming (preferred for production) ───────────────────
async def stream_agent(query: str):
    async for event in graph.astream_events(
        {"messages": [HumanMessage(content=query)]},
        config=config,
        version="v2"
    ):
        kind = event["event"]
        if kind == "on_chat_model_stream":
            token = event["data"]["chunk"].content
            if token: print(token, end="", flush=True)
        elif kind == "on_tool_start":
            print(f"\\n[Tool: {event['name']}]")
        elif kind == "on_tool_end":
            print(f"[Tool done]")`}
      </CodeBlock>

      <H3>FastAPI SSE endpoint</H3>
      <CodeBlock file="streaming_api.py" lang="python">
{`from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
import asyncio, json

app = FastAPI()

@app.post("/chat/stream")
async def stream_chat(body: dict):
    thread_id = body.get("thread_id", "default")
    message   = body["message"]
    config    = {"configurable": {"thread_id": thread_id}}

    async def event_generator():
        async for event in graph.astream_events(
            {"messages": [HumanMessage(content=message)]},
            config=config, version="v2"
        ):
            if event["event"] == "on_chat_model_stream":
                token = event["data"]["chunk"].content
                if token:
                    yield f"data: {json.dumps({'token': token})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")`}
      </CodeBlock>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11 — AGENTIC PATTERNS
// ─────────────────────────────────────────────────────────────────────────────
function S11() {
  const [pat, setPat] = useState("crag");
  const patterns = ["crag", "reflexion", "plan-execute", "llm-judge"];
  return (
    <div>
      <SectionHeader num={11} title="Agentic Patterns" subtitle="CRAG, Reflexion, Plan-and-Execute, and LLM-as-Judge — battle-tested patterns for production agents." color={T.purple} />

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {patterns.map(p => (
          <button key={p} onClick={() => setPat(p)} style={{ padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", background: pat === p ? `${T.purple}20` : "transparent", color: pat === p ? T.purple : T.muted, border: `1px solid ${pat === p ? `${T.purple}50` : T.border}`, transition: "all 0.15s" }}>
            {p}
          </button>
        ))}
      </div>

      {pat === "crag" && (
        <div>
          <H3>CRAG — Corrective RAG</H3>
          <p style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.75 }}>Retrieves documents, grades their relevance, falls back to web search if quality is low, then generates.</p>
          <CodeBlock file="crag.py">
{`from typing import Literal

class CRAGState(TypedDict):
    question:  str
    documents: list[str]
    web_search: str    # "yes" | "no"
    generation: str

# ── Nodes ─────────────────────────────────────────────────────────
def retrieve(state): return {"documents": vector_store.retrieve(state["question"])}

def grade_documents(state):
    graded = []
    do_web = "no"
    for doc in state["documents"]:
        score = grader_llm.invoke(f"Is this doc relevant to '{state['question']}'? {doc}")
        if score.binary_score == "yes":
            graded.append(doc)
        else:
            do_web = "yes"   # at least one bad doc → trigger web search
    return {"documents": graded, "web_search": do_web}

def web_search(state):
    results = tavily.invoke(state["question"])
    return {"documents": state["documents"] + [results]}

def generate(state):
    answer = rag_chain.invoke({"question": state["question"], "context": state["documents"]})
    return {"generation": answer}

# ── Routing ───────────────────────────────────────────────────────
def route_after_grading(state) -> Literal["web_search", "generate"]:
    return "web_search" if state["web_search"] == "yes" else "generate"

builder = StateGraph(CRAGState)
builder.add_node("retrieve",        retrieve)
builder.add_node("grade_documents", grade_documents)
builder.add_node("web_search",      web_search)
builder.add_node("generate",        generate)
builder.set_entry_point("retrieve")
builder.add_edge("retrieve", "grade_documents")
builder.add_conditional_edges("grade_documents", route_after_grading)
builder.add_edge("web_search", "generate")
builder.add_edge("generate", END)`}
          </CodeBlock>
        </div>
      )}

      {pat === "reflexion" && (
        <div>
          <H3>Reflexion — self-critique loop</H3>
          <CodeBlock file="reflexion.py">
{`class ReflexionState(TypedDict):
    task:      str
    draft:     str
    critique:  str
    revision:  int
    score:     float
    final:     str

MAX_REVISIONS = 3
QUALITY_THRESHOLD = 8.0

def generate_draft(state):
    if state.get("critique"):
        prompt = f"Task: {state['task']}\\nPrior draft: {state['draft']}\\nCritique: {state['critique']}\\nImprove it."
    else:
        prompt = f"Task: {state['task']}\\nWrite a comprehensive response."
    draft = llm.invoke(prompt).content
    return {"draft": draft, "revision": state.get("revision", 0) + 1}

def critique_draft(state):
    result = critique_llm.invoke(
        f"Score 1-10 and critique:\\n{state['draft']}\\nReturn JSON: {{score, critique}}"
    )
    return {"critique": result.critique, "score": result.score}

def route_reflexion(state) -> Literal["generate_draft", "__end__"]:
    if state["score"] >= QUALITY_THRESHOLD: return "__end__"
    if state["revision"] >= MAX_REVISIONS:  return "__end__"
    return "generate_draft"   # loop back

builder = StateGraph(ReflexionState)
builder.add_node("generate_draft", generate_draft)
builder.add_node("critique_draft", critique_draft)
builder.set_entry_point("generate_draft")
builder.add_edge("generate_draft", "critique_draft")
builder.add_conditional_edges("critique_draft", route_reflexion)`}
          </CodeBlock>
        </div>
      )}

      {pat === "plan-execute" && (
        <div>
          <H3>Plan-and-Execute</H3>
          <CodeBlock file="plan_execute.py">
{`class PlanExecuteState(TypedDict):
    task:         str
    plan:         list[str]   # ordered steps
    past_steps:   list[tuple] # (step, result)
    response:     str

def planner(state):
    plan = planner_llm.invoke(
        f"Break this task into 3-6 sequential steps:\\n{state['task']}"
    ).steps
    return {"plan": plan}

def executor(state):
    current_step = state["plan"][0]
    result = executor_llm.invoke(
        f"Task: {state['task']}\\nExecute this step: {current_step}\\n"
        f"Previous: {state['past_steps']}"
    ).content
    return {
        "past_steps": state["past_steps"] + [(current_step, result)],
        "plan": state["plan"][1:]   # pop completed step
    }

def replan_or_finish(state) -> Literal["executor", "final_response"]:
    if not state["plan"]: return "final_response"
    # Check if replanning needed based on execution results
    should_replan = replan_llm.invoke(
        f"Plan remaining: {state['plan']}\\nResults so far: {state['past_steps']}\\nReplan? yes/no"
    ).decision
    return "planner" if should_replan == "yes" else "executor"

def final_response(state):
    answer = synthesizer.invoke(f"Synthesize: {state['past_steps']}")
    return {"response": answer.content}`}
          </CodeBlock>
        </div>
      )}

      {pat === "llm-judge" && (
        <div>
          <H3>LLM-as-Judge evaluation</H3>
          <CodeBlock file="llm_judge.py">
{`from pydantic import BaseModel, Field

class JudgeScore(BaseModel):
    factual_accuracy: int = Field(ge=1, le=10)
    completeness:     int = Field(ge=1, le=10)
    coherence:        int = Field(ge=1, le=10)
    relevance:        int = Field(ge=1, le=10)
    reasoning: str

judge_llm = ChatOpenAI(model="gpt-4o").with_structured_output(JudgeScore)

def evaluate_output(output: str, question: str, reference: str = None) -> JudgeScore:
    ref_ctx = f"\\nReference answer: {reference}" if reference else ""
    score = judge_llm.invoke(
        f"Evaluate this response to '{question}':{ref_ctx}\\n\\nResponse:\\n{output}\\n\\n"
        "Score each dimension 1-10."
    )
    composite = (score.factual_accuracy * 0.35 +
                 score.completeness     * 0.25 +
                 score.coherence        * 0.20 +
                 score.relevance        * 0.20)
    print(f"Composite: {composite:.1f}/10 | {score.reasoning[:80]}")
    return score

# ── Use as graph node ─────────────────────────────────────────────
def judge_node(state: AgentState) -> dict:
    score = evaluate_output(state["final_output"], state["question"])
    composite = (score.factual_accuracy + score.completeness) / 2
    return {
        "judge_score": composite,
        "needs_revision": composite < 7.0
    }`}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12 — PRODUCTION
// ─────────────────────────────────────────────────────────────────────────────
function S12() {
  return (
    <div>
      <SectionHeader num={12} title="Production Guide" subtitle="Async patterns, retry logic, LangGraph Platform, observability, and the production checklist." color={T.teal} />

      <H3>Async-first — always</H3>
      <CodeBlock file="async_production.py">
{`import asyncio
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# ── Async node (use for every LLM call in production) ────────────
async def async_agent_node(state: AgentState) -> dict:
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}

# ── Handle multiple concurrent users ─────────────────────────────
async def run_concurrent_sessions(queries: list[str]):
    configs  = [{"configurable": {"thread_id": f"user-{i}"}} for i in range(len(queries))]
    tasks    = [
        graph.ainvoke({"messages": [HumanMessage(content=q)]}, config=c)
        for q, c in zip(queries, configs)
    ]
    results  = await asyncio.gather(*tasks)
    return results`}
      </CodeBlock>

      <H3>Retry with exponential backoff</H3>
      <CodeBlock file="retry.py">
{`from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from langchain_core.exceptions import LangChainException

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=30),
    stop=stop_after_attempt(4),
    retry=retry_if_exception_type((LangChainException, Exception))
)
async def resilient_llm_call(messages: list) -> str:
    response = await llm.ainvoke(messages)
    return response.content

# ── Handle GraphRecursionError ────────────────────────────────────
from langgraph.errors import GraphRecursionError

try:
    result = graph.invoke(state, config={"recursion_limit": 25})
except GraphRecursionError:
    # Graceful degradation
    partial = graph.get_state(config)
    return partial.values.get("draft", "Partial result available")`}
      </CodeBlock>

      <H3>Observability setup</H3>
      <CodeBlock file="observability.py">
{`# ── LangSmith (set env vars, auto-traces everything) ─────────────
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__...
# LANGCHAIN_PROJECT=my-agent-prod

# Tag runs for filtering in LangSmith UI
config = {
    "configurable": {"thread_id": "prod-001"},
    "metadata": {"user_id": "sayan", "env": "production", "version": "v2.1"},
    "tags": ["supervisor", "multi-agent", "rag"]
}

# ── Arize Phoenix (local visual tracing, great for dev) ───────────
import phoenix as px
from openinference.instrumentation.langchain import LangChainInstrumentor
from opentelemetry.sdk.trace import TracerProvider

def setup_phoenix():
    px.launch_app()   # UI at http://localhost:6006
    LangChainInstrumentor().instrument(tracer_provider=TracerProvider())

# ── Custom span logging ───────────────────────────────────────────
from langsmith import traceable

@traceable(name="custom-rag-retrieval", tags=["retrieval"])
def retrieve_with_tracing(query: str, top_k: int = 5):
    results = vector_store.similarity_search(query, k=top_k)
    return [r.page_content for r in results]`}
      </CodeBlock>

      <H3>LangGraph Platform config</H3>
      <CodeBlock file="langgraph.json" lang="json">
{`{
  "dependencies": ["."],
  "graphs": {
    "supervisor": "./supervisor/graph.py:build_supervisor_graph",
    "research":   "./research/graph.py:build_research_graph"
  },
  "env": ".env",
  "python_version": "3.11",
  "pip_config_file": "pyproject.toml"
}`}
      </CodeBlock>

      <H3>Production checklist</H3>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          ["✅", "Set recursion_limit=25 in every invoke/stream call"],
          ["✅", "Use async nodes (ainvoke, astream) for all LLM calls"],
          ["✅", "Swap MemorySaver → PostgresSaver for multi-user prod"],
          ["✅", "Add tenacity retry wrapper to all LLM-calling functions"],
          ["✅", "Set MAX_ITERATIONS guard in supervisor node"],
          ["✅", "Trim messages to last N before passing to supervisor"],
          ["✅", "Enable LangSmith tracing with env + metadata tags"],
          ["✅", "Catch GraphRecursionError with graceful degradation"],
          ["✅", "Add HITL breakpoints before irreversible actions"],
          ["✅", "Run LLM-as-Judge on every production output"],
        ].map(([icon, text], i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 13.5, color: T.muted }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13 — LEARNING ROADMAP
// ─────────────────────────────────────────────────────────────────────────────
function S13() {
  const phases = [
    { num: 1, weeks: "W1–2", title: "Foundations", color: T.blue, milestone: "Multi-turn chatbot with memory",
      topics: ["StateGraph, TypedDict, Annotated", "add_messages reducer", "MemorySaver checkpointer", "set_entry_point, add_edge, add_conditional_edges", "ToolNode + tools_condition"],
      resources: ["LangGraph docs: Concepts", "Official tutorial: Build a chatbot", "create_react_agent quickstart"] },
    { num: 2, weeks: "W3–4", title: "Control Flow & State", color: T.purple, milestone: "CRAG pipeline with web search fallback",
      topics: ["Custom reducers (operator.add, custom fn)", "Input/Output schema separation", "Configurable state (multi-tenant)", "Conditional edges + routing functions", "CRAG pattern implementation"],
      resources: ["How-to: State management", "How-to: Subgraphs", "Tutorial: CRAG"] },
    { num: 3, weeks: "W5–6", title: "Memory & HITL", color: T.teal, milestone: "Approval workflow with time travel",
      topics: ["SqliteSaver / PostgresSaver", "Thread scoped vs cross-thread memory", "interrupt_before / interrupt_after", "Dynamic interrupt() + Command(resume=...)", "update_state + time travel"],
      resources: ["How-to: Add persistence", "How-to: Human-in-the-loop", "Conceptual guide: Persistence"] },
    { num: 4, weeks: "W7–8", title: "Multi-Agent & Parallel", color: T.amber, milestone: "Supervisor + map-reduce pipeline",
      topics: ["Supervisor pattern with structured output routing", "Command swarm / handoffs", "Hierarchical agents (subgraphs as nodes)", "Send API fan-out / fan-in", "Parallel evaluation with operator.add"],
      resources: ["Tutorial: Multi-agent supervisor", "How-to: Command + swarm", "How-to: Map-reduce with Send"] },
    { num: 5, weeks: "W9–10", title: "Production & Observability", color: T.coral, milestone: "FastAPI + streaming + LangSmith traced",
      topics: ["Async nodes (ainvoke, astream)", "Retry + error handling (tenacity)", "astream_events + SSE FastAPI endpoint", "LangSmith metadata + tags + datasets", "LangGraph Platform (langgraph.json, CLI)"],
      resources: ["How-to: Streaming", "LangGraph Platform docs", "LangSmith evaluation guide"] },
  ];
  return (
    <div>
      <SectionHeader num={13} title="10-Week Learning Roadmap" subtitle="A structured 5-phase path from first graph to production-grade multi-agent systems." color={T.blue} />
      {phases.map((p) => (
        <div key={p.num} style={{ marginBottom: "1.25rem", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: `${p.color}15`, borderBottom: `1px solid ${T.border}`, padding: "0.9rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: p.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>Phase {p.num} · {p.weeks}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 2 }}>{p.title}</div>
            </div>
            <div style={{ background: `${p.color}20`, border: `1px solid ${p.color}40`, color: p.color, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 600, maxWidth: 200, textAlign: "right" }}>
              🎯 {p.milestone}
            </div>
          </div>
          <div style={{ padding: "1rem 1.1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 1.5rem" }}>
            <div>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Topics</div>
              {p.topics.map((t, i) => (
                <div key={i} style={{ fontSize: 12.5, color: T.muted, padding: "3px 0", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: p.color, flexShrink: 0 }}>→</span>{t}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Resources</div>
              {p.resources.map((r, i) => (
                <div key={i} style={{ fontSize: 12.5, color: T.muted, padding: "3px 0", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: p.color, flexShrink: 0 }}>📖</span>{r}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Callout type="insight" title="For SDLC Copilot developers">
        You're already at Phase 4+. Focus on: <strong>Section 09</strong> (parallel fan-out for multi-epic processing), <strong>Section 07</strong> (HITL for story approval gates), and <strong>Section 11</strong> (LLM-as-Judge for your 5-layer eval framework).
      </Callout>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "s01", label: "Introduction",        color: T.blue,   component: S01 },
  { id: "s02", label: "Core Concepts",       color: T.purple, component: S02 },
  { id: "s03", label: "First Graph",         color: T.teal,   component: S03 },
  { id: "s04", label: "Agents & Tools",      color: T.amber,  component: S04 },
  { id: "s05", label: "State Management",    color: T.purple, component: S05 },
  { id: "s06", label: "Memory & Persistence",color: T.teal,   component: S06 },
  { id: "s07", label: "Human-in-the-Loop",   color: T.coral,  component: S07 },
  { id: "s08", label: "Multi-Agent",         color: T.blue,   component: S08 },
  { id: "s09", label: "Parallel Execution",  color: T.green,  component: S09 },
  { id: "s10", label: "Streaming",           color: T.amber,  component: S10 },
  { id: "s11", label: "Agentic Patterns",    color: T.purple, component: S11 },
  { id: "s12", label: "Production Guide",    color: T.teal,   component: S12 },
  { id: "s13", label: "Learning Roadmap",    color: T.blue,   component: S13 },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function LangGraphGuide() {
  const [active, setActive]   = useState("s01");
  const [search, setSearch]   = useState("");
  const [sideOpen, setSide]   = useState(true);

  const current  = SECTIONS.find(s => s.id === active) || SECTIONS[0];
  const Component = current.component;

  const filtered = SECTIONS.filter(s =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  const activeIdx = SECTIONS.findIndex(s => s.id === active);
  const prev = activeIdx > 0 ? SECTIONS[activeIdx - 1] : null;
  const next = activeIdx < SECTIONS.length - 1 ? SECTIONS[activeIdx + 1] : null;

  return (
    <div className="lg-root" style={{ minHeight: "100vh" }}>
      <GlobalStyles />

      <div style={{ display: "grid", gridTemplateColumns: sideOpen ? "240px 1fr" : "1fr", minHeight: "100vh" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        {sideOpen && (
          <aside
            className="scroll-hide"
            style={{
              background: T.bg2, borderRight: `1px solid ${T.border}`,
              padding: "28px 0", position: "sticky", top: 0, height: "100vh",
              overflowY: "auto", display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ padding: "0 18px 16px" }}>
              <div className="mono" style={{ color: TT.terra, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase" }}>LangGraph</div>
              <div className="display" style={{ color: T.text, fontSize: 20, marginTop: 6, lineHeight: 1.15 }}>
                Complete<br/><em style={{ color: TT.gold, fontStyle: "italic" }}>field guide</em>
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 6, letterSpacing: "0.02em" }}>13 sections · Agentic AI</div>
            </div>
            <div className="hairline" />

            <div style={{ padding: "12px 14px 8px" }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search sections…"
                style={{
                  width: "100%", background: TT.bgSunken, border: `1px solid ${T.border}`,
                  borderRadius: 4, padding: "6px 10px", fontSize: 12, color: T.text,
                  outline: "none", fontFamily: "inherit",
                }}
              />
            </div>

            <nav style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map(s => {
                const idx = SECTIONS.findIndex(x => x.id === s.id);
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span className="mono" style={{ fontSize: 10, color: isActive ? TT.gold : TT.textDim, letterSpacing: "0.08em" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{ padding: "18px", marginTop: 12, fontSize: 10, color: T.dim, fontFamily: "JetBrains Mono", letterSpacing: ".05em", borderTop: `1px solid ${T.border}` }}>
              <Link to="/" style={{ color: T.muted, textDecoration: "none", display: "block", marginBottom: 8 }}>← All tutorials</Link>
              Pregel · StateGraph · LangChain
            </div>
          </aside>
        )}

        {/* ── MAIN ───────────────────────────────────────────────── */}
        <main style={{ overflowY: "auto", height: "100vh", display: "flex", flexDirection: "column" }} className="scroll-hide">
          {/* Topbar */}
          <div style={{
            background: T.bg2, borderBottom: `1px solid ${T.border}`,
            padding: "12px 28px", display: "flex", alignItems: "center", gap: 14,
            flexShrink: 0, position: "sticky", top: 0, zIndex: 10,
          }}>
            <button
              onClick={() => setSide(v => !v)}
              className="mono"
              style={{
                background: "transparent", border: `1px solid ${T.border}`, borderRadius: 3,
                padding: "4px 10px", color: T.muted, cursor: "pointer", fontSize: 11,
              }}
              aria-label="Toggle sidebar"
            >
              {sideOpen ? "◀" : "▶"}
            </button>
            <span className="mono" style={{ fontSize: 10, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>LangGraph Guide</span>
            <span style={{ color: T.dim }}>›</span>
            <span style={{ fontSize: 12.5, color: current.color, fontWeight: 500, letterSpacing: "0.01em" }}>{current.label}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  title={s.label}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: active === s.id ? s.color : TT.borderHi,
                    border: "none", cursor: "pointer", transition: "all 0.15s", padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content column — matches ML Engineer width + padding */}
          <div style={{ maxWidth: 920, width: "100%", margin: "0 auto", padding: "60px 56px 120px" }}>
            <div className="anim-fade" key={active}>
              <Component />
            </div>

            {/* Prev / Next */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.border}`, gap: 12 }}>
              {prev ? (
                <button
                  onClick={() => setActive(prev.id)}
                  style={{
                    background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 3,
                    padding: "10px 18px", color: T.muted, cursor: "pointer",
                    fontSize: 13, fontFamily: "inherit", textAlign: "left",
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, color: TT.textDim, letterSpacing: "0.12em", marginBottom: 2 }}>← PREV</div>
                  {prev.label}
                </button>
              ) : <div />}
              {next ? (
                <button
                  onClick={() => setActive(next.id)}
                  style={{
                    background: `${current.color}10`, border: `1px solid ${current.color}55`, borderRadius: 3,
                    padding: "10px 18px", color: current.color, cursor: "pointer",
                    fontSize: 13, fontFamily: "inherit", fontWeight: 500, textAlign: "right",
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, color: TT.textDim, letterSpacing: "0.12em", marginBottom: 2 }}>NEXT →</div>
                  {next.label}
                </button>
              ) : <div />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
