// MODULE 03 — MEMORY & PERSISTENCE
// Checkpointers · Threads · Cross-thread store · Time travel

import { useState } from "react";
import {
  T, ModulePage, ModuleHeader, Content, SubTabs,
  CodeBlock, Callout, H3, DataTable,
} from "./_theme.jsx";

const TABS = [
  { id: "layers",     label: "Memory Layers" },
  { id: "checkpoint", label: "Checkpointers" },
  { id: "threads",    label: "Threads" },
  { id: "store",      label: "Cross-thread Store" },
  { id: "timetravel", label: "Time Travel" },
];

const LAYERS = [
  { num: "L1", title: "In-context (token window)", color: T.gold,  desc: "Messages and state in the current LLM call. Ephemeral — exists only during node execution.", example: "state['messages'][-20:]" },
  { num: "L2", title: "Thread checkpoint",         color: T.sage,  desc: "Full state after each superstep, keyed by thread_id. Enables multi-turn sessions and HITL.", example: "MemorySaver / PostgresSaver" },
  { num: "L3", title: "Cross-thread store",        color: T.plum,  desc: "Shared KV store across threads. Persists user preferences, facts, and long-term memories.", example: "InMemoryStore / RedisStore" },
  { num: "L4", title: "External knowledge base",   color: T.terra, desc: "Vector store, relational DB, documents. Agent retrieves at need. Not part of graph state.", example: "Pinecone, pgvector, Qdrant" },
];

export default function MemoryPersistence() {
  const [tab, setTab] = useState("layers");

  return (
    <ModulePage>
      <ModuleHeader
        moduleNum={3}
        title="Memory & Persistence"
        subtitle="Four memory layers · checkpointers · thread-scoped state · cross-thread stores · time travel through the checkpoint history."
        pills={[
          { label: "MemorySaver", kind: "gold" },
          { label: "PostgresSaver", kind: "sage" },
          { label: "InMemoryStore", kind: "plum" },
          { label: "time travel", kind: "terra" },
        ]}
      />

      <Content>
        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "layers" && (
          <div>
            <Callout type="info" title="Four memory layers">
              LangGraph distinguishes <strong>four memory layers</strong> with different scopes and lifetimes.
              Understanding which layer to use for which data is the difference between a leaky prototype and a
              production agent.
            </Callout>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "1rem 0" }}>
              {LAYERS.map((l) => (
                <div key={l.num} className="card" style={{ borderTop: `2px solid ${l.color}` }}>
                  <div className="mono" style={{ color: l.color, fontSize: 11, letterSpacing: "0.18em", marginBottom: 4 }}>{l.num}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: T.text, marginBottom: 6 }}>{l.title}</div>
                  <p style={{ fontSize: 13, color: T.textMute, lineHeight: 1.6, marginBottom: 10 }}>{l.desc}</p>
                  <code className="mono" style={{ fontSize: 11, color: l.color, background: T.ink, border: `1px solid ${T.border}`, padding: "3px 7px", borderRadius: 3 }}>{l.example}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "checkpoint" && (
          <div>
            <H3>Checkpointer options</H3>
            <DataTable
              headers={["Checkpointer", "Use case", "Concurrency", "Install"]}
              rows={[
                ["MemorySaver",   "Dev & testing only",        "✗ Single process", "Built-in"],
                ["SqliteSaver",   "Local / single-user app",   "⚠️ Limited",        "pip install langgraph-checkpoint-sqlite"],
                ["PostgresSaver", "Production multi-user",     "✓ Full ACID",      "pip install langgraph-checkpoint-postgres"],
                ["RedisSaver",    "High-throughput pub/sub",   "✓ Distributed",    "pip install langgraph-checkpoint-redis"],
              ]}
            />
            <CodeBlock file="checkpointers.py">{`# ── MemorySaver (dev only — resets on process restart) ───────────
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(checkpointer=MemorySaver())

# ── SqliteSaver (local apps, single user) ────────────────────────
from langgraph.checkpoint.sqlite import SqliteSaver
with SqliteSaver.from_conn_string("checkpoints.db") as saver:
    graph = builder.compile(checkpointer=saver)

# ── Async SqliteSaver (production async apps) ────────────────────
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
async with AsyncSqliteSaver.from_conn_string("checkpoints.db") as saver:
    graph = builder.compile(checkpointer=saver)
    result = await graph.ainvoke(state, config)

# ── PostgresSaver (production multi-user) ────────────────────────
from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://user:pass@localhost:5432/langgraph"
with PostgresSaver.from_conn_string(DB_URI) as saver:
    saver.setup()   # creates tables (run once)
    graph = builder.compile(checkpointer=saver)

# ── Connection pool for high concurrency ─────────────────────────
from psycopg_pool import ConnectionPool

pool = ConnectionPool(DB_URI, max_size=20, kwargs={"autocommit": True})
with PostgresSaver(pool) as saver:
    saver.setup()
    graph = builder.compile(checkpointer=saver)`}</CodeBlock>
          </div>
        )}

        {tab === "threads" && (
          <div>
            <Callout type="info" title="thread_id = the key to multi-turn memory">
              Every <code>invoke()</code> or <code>stream()</code> with the same <code>thread_id</code> continues that
              conversation. Different <code>thread_id</code>s are completely isolated sessions.
            </Callout>
            <CodeBlock file="threads.py">{`# ── Thread isolation ─────────────────────────────────────────────
config_alice = {"configurable": {"thread_id": "alice-session-1"}}
config_bob   = {"configurable": {"thread_id": "bob-session-1"}}

# Alice and Bob have completely separate state/history
graph.invoke({"messages": [HumanMessage(content="I'm Alice")]}, config_alice)
graph.invoke({"messages": [HumanMessage(content="I'm Bob")]},   config_bob)

# In turn 2, each remembers only their own prior messages
graph.invoke({"messages": [HumanMessage(content="Who am I?")]}, config_alice)
# → "You're Alice"
graph.invoke({"messages": [HumanMessage(content="Who am I?")]}, config_bob)
# → "You're Bob"

# ── Message trimming (prevent token overflow) ────────────────────
from langchain_core.messages import trim_messages

def trim_node(state: AgentState) -> dict:
    trimmed = trim_messages(
        state["messages"],
        max_tokens=4000,
        strategy="last",          # keep most recent
        token_counter=llm,
        include_system=True,
        allow_partial=False,
    )
    return {"messages": trimmed}

# ── Check state between turns ────────────────────────────────────
snapshot = graph.get_state(config_alice)
print(snapshot.values)
print(snapshot.next)
print(snapshot.metadata)
print(snapshot.config)`}</CodeBlock>
          </div>
        )}

        {tab === "store" && (
          <div>
            <Callout type="pattern" title="The Store — cross-thread memory">
              A namespaced KV store that persists data across sessions. Use it for user preferences, long-term facts,
              and memories that should outlive a single conversation.
            </Callout>
            <CodeBlock file="cross_thread_store.py">{`from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import MemorySaver

# ── Setup ────────────────────────────────────────────────────────
store = InMemoryStore()   # or RedisStore, PostgresStore for production

graph = builder.compile(
    checkpointer=MemorySaver(),
    store=store               # attach store to graph
)

# ── Write to store inside a node ─────────────────────────────────
from langchain_core.runnables import RunnableConfig

def memory_writer_node(state: AgentState, config: RunnableConfig, store: InMemoryStore) -> dict:
    user_id = config["configurable"]["user_id"]
    store.put(
        namespace=(user_id, "preferences"),
        key="model_choice",
        value={"model": "gpt-4o", "temperature": 0, "updated": "2025-01"}
    )
    return {}

# ── Read from store inside a node ────────────────────────────────
def personalized_node(state: AgentState, config: RunnableConfig, store: InMemoryStore) -> dict:
    user_id = config["configurable"]["user_id"]

    item = store.get(namespace=(user_id, "preferences"), key="model_choice")
    preferred_model = item.value.get("model", "gpt-4o-mini") if item else "gpt-4o-mini"

    all_prefs = store.list_namespaces(match=(user_id,))
    results   = store.search(namespace=(user_id, "memories"), query="project preferences")

    llm = ChatOpenAI(model=preferred_model)
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# ── Namespace design ─────────────────────────────────────────────
# Good namespaces:
# (user_id, "preferences")    → user settings
# (user_id, "memories")       → episodic memories
# (user_id, "facts")          → extracted facts about the user
# (org_id,  "knowledge")      → org-wide shared knowledge`}</CodeBlock>
          </div>
        )}

        {tab === "timetravel" && (
          <div>
            <Callout type="info" title="Time travel — Git for agent state">
              Every checkpoint is a complete snapshot of graph state. You can rewind to any past checkpoint, inspect
              it, modify it, and branch from there.
            </Callout>
            <CodeBlock file="time_travel.py">{`# ── Get complete state history ───────────────────────────────────
config  = {"configurable": {"thread_id": "session-001"}}
history = list(graph.get_state_history(config))
# history[0]  = most recent snapshot
# history[-1] = initial state
# Each snapshot: StateSnapshot(values, next, config, metadata, created_at)

for snap in history:
    print(snap.config["configurable"]["checkpoint_id"])
    print(snap.values.get("status"))
    print(f"  → next: {snap.next}")

# ── Rewind to a specific checkpoint ──────────────────────────────
target_checkpoint = history[3]   # 4th most recent
past_state = graph.get_state(target_checkpoint.config)
print("State at that point:", past_state.values)

# ── Continue from past checkpoint (replay) ───────────────────────
result = graph.invoke(None, config=target_checkpoint.config)

# ── Fork: edit state at a past checkpoint then continue ──────────
# Example: critic said REJECTED, but we want to mark it APPROVED
graph.update_state(
    target_checkpoint.config,
    values={"critique": "APPROVED — ignore prior rejection",
            "status":   "approved"},
    as_node="critic"   # pretend critic node made this update
)
new_result = graph.invoke(None, config=target_checkpoint.config)

# ── Update current state (mid-execution correction) ──────────────
current = graph.get_state(config)
graph.update_state(
    config,
    values={"next": "writer"},   # force route to writer
    as_node="supervisor"
)
graph.invoke(None, config)  # continue with modified routing`}</CodeBlock>

            <Callout type="tip" title="Audit trail">
              Time travel requires a checkpointer. The <code>checkpoint_id</code> is embedded in the config — you can
              serialize it and replay weeks later, enabling full auditability of agent decisions.
            </Callout>
          </div>
        )}
      </Content>
    </ModulePage>
  );
}
