// MODULE 04 — MULTI-AGENT SYSTEMS
// Supervisor · Command swarm · Hierarchical · SDLC Copilot mapping

import { useState } from "react";
import {
  ModulePage, ModuleHeader, Content, SubTabs,
  CodeBlock, Callout, H3, DataTable,
} from "./_theme.jsx";

const TABS = [
  { id: "patterns",     label: "Pattern Comparison" },
  { id: "supervisor",   label: "Supervisor" },
  { id: "command",      label: "Command Swarm" },
  { id: "hierarchical", label: "Hierarchical" },
  { id: "sdlc",         label: "SDLC Copilot" },
];

export default function MultiAgent() {
  const [tab, setTab] = useState("patterns");

  return (
    <ModulePage>
      <ModuleHeader
        moduleNum={4}
        title="Multi-Agent Systems"
        subtitle="Supervisor, Command swarm, hierarchical subgraphs — and how each maps onto the SDLC Copilot architecture."
        pills={[
          { label: "Supervisor", kind: "gold" },
          { label: "Command swarm", kind: "sage" },
          { label: "Subgraphs", kind: "plum" },
          { label: "Send API", kind: "terra" },
        ]}
      />

      <Content>
        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "patterns" && (
          <div>
            <Callout type="info" title="Three core patterns">
              Choose based on how complex your routing logic is and how much latency you can afford. Supervisor is the
              default; reach for Command when latency matters; reach for hierarchical when modularity matters.
            </Callout>
            <DataTable
              headers={["Dimension", "Supervisor", "Command swarm", "Hierarchical"]}
              rows={[
                ["Routing logic",  "Central LLM decides",      "Each agent routes itself",   "Parent graph + subgraphs"],
                ["Latency",        "Extra LLM call per step",   "Lower — no supervisor call", "Variable"],
                ["Debuggability",  "✓ Easy — one router",       "⚠️ Distributed logic",        "✓ Modular"],
                ["Complex routing","✓ LLM is flexible",        "⚠️ Hard to maintain",         "✓ Nested supervisors"],
                ["Agent reuse",    "⚠️ Tightly coupled",         "✓ Independent agents",        "✓ Standalone subgraphs"],
                ["SDLC fit",       "✓ Best for 6-agent setup",  "⚠️ Overkill",                 "✓ Good for sub-pipelines"],
              ]}
            />
          </div>
        )}

        {tab === "supervisor" && (
          <div>
            <H3>Supervisor — central LLM router</H3>
            <CodeBlock file="supervisor.py">{`from pydantic import BaseModel
from typing import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

MEMBERS  = ["researcher", "writer", "critic"]
MAX_ITER = 6

# ── Structured output for deterministic routing ──────────────────
class RouterOutput(BaseModel):
    next:      Literal["researcher", "writer", "critic", "FINISH"]
    reasoning: str   # helps with debugging

llm = ChatOpenAI(model="gpt-4o").with_structured_output(RouterOutput)

SUPERVISOR_PROMPT = f"""
You are the orchestrator for a research-writing pipeline.
Available agents: {', '.join(MEMBERS)}

Routing rules:
- No research yet? → researcher
- Has research, no draft? → writer
- Has draft, no critique? → critic
- Critique says APPROVED or iteration >= {MAX_ITER}? → FINISH
- Critique says REJECTED? → writer (revise)
Never route same agent twice consecutively unless needed.
"""

def supervisor_node(state: AgentState) -> dict:
    iteration = state.get("iteration_count", 0)
    if iteration >= MAX_ITER:
        return {"next": "FINISH", "iteration_count": iteration}

    summary = (
        f"Iteration: {iteration}\\n"
        f"Has research: {'YES' if state.get('research_data') else 'NO'}\\n"
        f"Has draft: {'YES' if state.get('draft') else 'NO'}\\n"
        f"Last critique: {state.get('critique', 'none')[:120]}"
    )
    result: RouterOutput = llm.invoke([
        SystemMessage(content=SUPERVISOR_PROMPT),
        HumanMessage(content=summary)
    ])
    return {"next": result.next, "iteration_count": iteration + 1}

# ── Graph wiring ─────────────────────────────────────────────────
from langgraph.graph import StateGraph, END

builder = StateGraph(AgentState)
builder.add_node("supervisor", supervisor_node)
builder.add_node("researcher", researcher_node)
builder.add_node("writer",     writer_node)
builder.add_node("critic",     critic_node)
builder.set_entry_point("supervisor")

builder.add_conditional_edges(
    "supervisor",
    lambda s: s["next"],
    {"researcher": "researcher", "writer": "writer",
     "critic": "critic", "FINISH": END}
)
for m in MEMBERS:
    builder.add_edge(m, "supervisor")

graph = builder.compile(checkpointer=MemorySaver())`}</CodeBlock>
          </div>
        )}

        {tab === "command" && (
          <div>
            <H3>Command swarm — decentralized handoffs</H3>
            <Callout type="pattern" title="No supervisor LLM call">
              Agents emit <code>Command(goto=..., update=...)</code> to route directly to the next agent. Lower latency,
              tighter coupling — best when routing is deterministic.
            </Callout>
            <CodeBlock file="command_swarm.py">{`from langgraph.types import Command
from typing import Literal

# ── Agent returns Command to route and update state ──────────────
def researcher(state: AgentState) -> Command[Literal["writer", "supervisor"]]:
    research = rag_chain.invoke(state["question"])
    return Command(
        goto="writer",
        update={
            "research_data": research,
            "messages": [AIMessage(content=research, name="researcher")]
        }
    )

def writer(state: AgentState) -> Command[Literal["critic"]]:
    draft = llm.invoke(f"Write report using:\\n{state['research_data']}").content
    return Command(
        goto="critic",
        update={"draft": draft, "messages": [AIMessage(content=draft, name="writer")]}
    )

def critic(state: AgentState) -> Command[Literal["writer", "__end__"]]:
    feedback = evaluator_llm.invoke(f"Review:\\n{state['draft']}").content
    approved = "APPROVED" in feedback.upper()
    return Command(
        goto="__end__" if approved else "writer",
        update={
            "critique": feedback,
            "final_output": state["draft"] if approved else None
        }
    )

# ── Build swarm (no conditional_edges needed) ────────────────────
builder = StateGraph(AgentState)
for name, fn in [("researcher", researcher), ("writer", writer), ("critic", critic)]:
    builder.add_node(name, fn)
builder.set_entry_point("researcher")
graph = builder.compile()

# ── Handoffs via swarm (with central entry) ──────────────────────
# For open-ended swarms where ANY agent can start:
from langgraph.prebuilt import create_react_agent

transfer_to_writer = lambda: Command(goto="writer")
researcher_with_handoff = create_react_agent(
    llm, tools=[search, transfer_to_writer]
)`}</CodeBlock>
          </div>
        )}

        {tab === "hierarchical" && (
          <div>
            <H3>Hierarchical — subgraphs as nodes</H3>
            <CodeBlock file="hierarchical.py">{`# ── Sub-graph: a self-contained research pipeline ────────────────
class ResearchState(TypedDict):
    query:       str
    search_hits: list[str]
    summary:     str

def build_research_subgraph() -> CompiledGraph:
    def search_node(state: ResearchState) -> dict:
        hits = tavily.invoke(state["query"])
        return {"search_hits": hits}

    def summarize_node(state: ResearchState) -> dict:
        summary = llm.invoke(f"Summarize:\\n{state['search_hits']}").content
        return {"summary": summary}

    sb = StateGraph(ResearchState)
    sb.add_node("search",    search_node)
    sb.add_node("summarize", summarize_node)
    sb.set_entry_point("search")
    sb.add_edge("search",    "summarize")
    sb.add_edge("summarize", END)
    return sb.compile()

# ── Parent graph: subgraph is just another node ──────────────────
research_subgraph = build_research_subgraph()

class ParentState(TypedDict):
    user_query:    str
    research_data: str
    final_report:  str

def research_wrapper(state: ParentState) -> dict:
    """Bridge parent → subgraph state."""
    result = research_subgraph.invoke({"query": state["user_query"]})
    return {"research_data": result["summary"]}

def report_writer(state: ParentState) -> dict:
    report = llm.invoke(f"Write report from:\\n{state['research_data']}").content
    return {"final_report": report}

parent = StateGraph(ParentState)
parent.add_node("research", research_wrapper)  # subgraph as node
parent.add_node("writer",   report_writer)
parent.set_entry_point("research")
parent.add_edge("research", "writer")
parent.add_edge("writer",   END)
parent_graph = parent.compile()`}</CodeBlock>
          </div>
        )}

        {tab === "sdlc" && (
          <div>
            <Callout type="pattern" title="SDLC Copilot mapping">
              The 6-agent supervisor architecture, mapped to LangGraph multi-agent patterns. This is a direct blueprint.
            </Callout>
            <CodeBlock file="sdlc_copilot_architecture.py">{`# SDLC Copilot — 6-agent supervisor architecture
#
# Orchestrator (supervisor)
# ├── IntentAgent       — classify request type + extract params
# ├── ContextAgent      — BM25 + dense hybrid RAG retrieval
# ├── UserStoryAgent    — generate Epics + Stories (CRAG loop inside)
# ├── GherkinAgent      — BDD / Gherkin script generation
# ├── TestCaseAgent     — test case + acceptance criteria generation
# └── QualityGateAgent  — LLM-as-Judge 5-dimension evaluation

class SDLCState(TypedDict):
    messages:       Annotated[list[BaseMessage], add_messages]
    request_type:   str       # "user_story" | "gherkin" | "test_case"
    context:        str       # retrieved context from RAG
    epics:          list[str]
    user_stories:   list[str]
    gherkin_scripts:list[str]
    test_cases:     list[str]
    quality_scores: Annotated[list[float], operator.add]
    next:           str
    iteration:      int

class SDLCRouter(BaseModel):
    next: Literal["intent", "context", "user_story", "gherkin",
                  "test_case", "quality_gate", "FINISH"]
    reasoning: str

supervisor_llm = ChatOpenAI(model="gpt-4o").with_structured_output(SDLCRouter)

SDLC_SUPERVISOR_PROMPT = """
You orchestrate an SDLC artifact generation pipeline.
Routing:
- No intent yet? → intent
- No context? → context
- request_type='user_story' and no stories? → user_story
- request_type='gherkin' and has stories but no gherkin? → gherkin
- request_type='test_case' and has stories? → test_case
- Has artifacts, no quality eval? → quality_gate
- Quality ≥ 7.5 or iteration ≥ 4? → FINISH
- Quality < 7.5? → back to appropriate generator
"""

# ── Redis Blackboard (pub/sub inter-agent communication) ─────────
from langgraph.config import get_stream_writer

def user_story_agent(state: SDLCState) -> dict:
    writer = get_stream_writer()
    writer({"agent": "user_story", "status": "generating"})
    stories = generate_user_stories(state["context"], state["epics"])
    writer({"agent": "user_story", "status": "complete", "count": len(stories)})
    return {"user_stories": stories}

# ── Fan-out parallel quality evaluation ──────────────────────────
from langgraph.types import Send

def dispatch_quality_checks(state: SDLCState) -> list[Send]:
    dimensions = ["factuality", "completeness", "structure", "coherence", "relevance"]
    return [Send("eval_worker", {"dimension": d, "content": state["user_stories"]}) for d in dimensions]

def eval_worker(state: dict) -> dict:
    score = dimension_llm_judge(state["dimension"], state["content"])
    return {"quality_scores": [score]}   # operator.add fan-in`}</CodeBlock>
          </div>
        )}
      </Content>
    </ModulePage>
  );
}
