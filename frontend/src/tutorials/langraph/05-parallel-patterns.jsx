// MODULE 05 — PARALLEL EXECUTION & AGENTIC PATTERNS
// Send API · Fan-out/fan-in · CRAG · Reflexion · Plan-Execute · HITL

import { useState } from "react";
import {
  ModulePage, ModuleHeader, Content, SubTabs,
  CodeBlock, Callout, H3,
} from "./_theme.jsx";

const TABS = [
  { id: "fanout",    label: "Fan-out / Fan-in" },
  { id: "mapreduce", label: "Map-Reduce" },
  { id: "crag",      label: "CRAG" },
  { id: "reflexion", label: "Reflexion" },
  { id: "plan",      label: "Plan-Execute" },
  { id: "hitl",      label: "HITL" },
];

export default function ParallelPatterns() {
  const [tab, setTab] = useState("fanout");

  return (
    <ModulePage>
      <ModuleHeader
        moduleNum={5}
        title="Parallel Execution & Agentic Patterns"
        subtitle="Send API · Fan-out/Fan-in · CRAG · Reflexion · Plan-Execute · Human-in-the-Loop — the production-ready agent patterns."
        pills={[
          { label: "Send API", kind: "gold" },
          { label: "CRAG", kind: "plum" },
          { label: "Reflexion", kind: "sage" },
          { label: "HITL", kind: "terra" },
        ]}
      />

      <Content>
        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "fanout" && (
          <div>
            <Callout type="info" title="Fan-out / Fan-in">
              <strong>Fan-out</strong>: one dispatcher emits N <code>Send()</code> objects → N worker instances run in
              parallel. <strong>Fan-in</strong>: a reducer on the state field merges all N results automatically when
              every worker finishes.
            </Callout>
            <CodeBlock file="fanout_fanin.py">{`from langgraph.types import Send
from typing import Annotated
import operator

class FanState(TypedDict):
    items:   list[str]
    results: Annotated[list[str], operator.add]   # fan-in reducer
    summary: str

# ── Dispatcher: fan-out via Send ─────────────────────────────────
def dispatcher(state: FanState) -> list[Send]:
    """One Send per item = one parallel worker per item."""
    return [
        Send("process_item", {"item": item, "idx": i})
        for i, item in enumerate(state["items"])
    ]

# ── Worker: runs N times in parallel ─────────────────────────────
def process_item(state: dict) -> dict:
    result = llm.invoke(f"Process: {state['item']}").content
    return {"results": [result]}

# ── Aggregator: runs after ALL workers finish ────────────────────
def aggregate(state: FanState) -> dict:
    summary = llm.invoke(f"Summarize:\\n" + "\\n".join(state["results"])).content
    return {"summary": summary}

# ── Graph ────────────────────────────────────────────────────────
builder = StateGraph(FanState)
builder.add_node("process_item", process_item)
builder.add_node("aggregate",    aggregate)
builder.add_conditional_edges("__start__", dispatcher, ["process_item"])
builder.add_edge("process_item", "aggregate")
builder.add_edge("aggregate",    END)
graph = builder.compile()`}</CodeBlock>

            <Callout type="tip" title="Automatic synchronization">
              The aggregator only runs <strong>after every worker finishes</strong>. LangGraph handles this — no manual
              synchronization needed. The <code>operator.add</code> reducer collects all partial results as they
              complete.
            </Callout>
          </div>
        )}

        {tab === "mapreduce" && (
          <div>
            <H3>Map-reduce document processing</H3>
            <CodeBlock file="map_reduce.py">{`# Full production map-reduce: process N documents in parallel
from langgraph.types import Send
import operator

class MapReduceState(TypedDict):
    documents:    list[str]
    summaries:    Annotated[list[str], operator.add]
    final_report: str

def dispatch_summarizers(state: MapReduceState) -> list[Send]:
    return [Send("summarize", {"doc": doc, "doc_id": i})
            for i, doc in enumerate(state["documents"])]

def summarize(state: dict) -> dict:
    summary = llm.invoke(
        f"Summarize in 3 sentences:\\n{state['doc']}"
    ).content
    return {"summaries": [f"[{state['doc_id']}] {summary}"]}

def create_report(state: MapReduceState) -> dict:
    joined  = "\\n\\n".join(state["summaries"])
    report  = llm.invoke(
        f"Create an executive report from these summaries:\\n{joined}"
    ).content
    return {"final_report": report}

# ── Parallel quality evaluation (SDLC pattern) ───────────────────
EVAL_DIMS = ["factuality", "completeness", "relevance", "coherence", "structure"]

class EvalState(TypedDict):
    content: str
    scores:  Annotated[list[float], operator.add]
    verdict: str

def dispatch_evals(state: EvalState) -> list[Send]:
    return [Send("eval_dim", {"dim": d, "content": state["content"]}) for d in EVAL_DIMS]

def eval_dim(state: dict) -> dict:
    score = float(judge_llm.invoke(
        f"Score the {state['dim']} of this content 1-10:\\n{state['content']}"
    ).content.strip())
    return {"scores": [score]}

def render_verdict(state: EvalState) -> dict:
    avg = sum(state["scores"]) / len(state["scores"])
    return {"verdict": "PASS" if avg >= 7.0 else "FAIL"}`}</CodeBlock>
          </div>
        )}

        {tab === "crag" && (
          <div>
            <H3>CRAG — Corrective RAG</H3>
            <Callout type="pattern" title="The flow">
              Retrieve → grade relevance → if any doc is irrelevant → web-search fallback → generate. Forces the agent
              to recognize when its context isn't good enough.
            </Callout>
            <CodeBlock file="crag.py">{`from typing import Literal
from pydantic import BaseModel

class RelevanceScore(BaseModel):
    binary_score: Literal["yes", "no"]
    reasoning: str

grader = ChatOpenAI(model="gpt-4o").with_structured_output(RelevanceScore)

class CRAGState(TypedDict):
    question:   str
    documents:  list[str]
    web_search: str
    generation: str

def retrieve(state: CRAGState) -> dict:
    docs = vector_store.similarity_search(state["question"], k=4)
    return {"documents": [d.page_content for d in docs]}

def grade_documents(state: CRAGState) -> dict:
    filtered  = []
    needs_web = "no"
    for doc in state["documents"]:
        score = grader.invoke(
            f"Is this document relevant to: '{state['question']}'?\\n\\n{doc[:500]}"
        )
        if score.binary_score == "yes":
            filtered.append(doc)
        else:
            needs_web = "yes"
    return {"documents": filtered, "web_search": needs_web}

def web_search_node(state: CRAGState) -> dict:
    web_results = tavily.invoke({"query": state["question"]})
    return {"documents": state["documents"] + [web_results["results"][0]["content"]]}

def generate(state: CRAGState) -> dict:
    context = "\\n\\n---\\n\\n".join(state["documents"])
    answer  = rag_chain.invoke({"question": state["question"], "context": context})
    return {"generation": answer}

def route_after_grade(state: CRAGState) -> Literal["web_search_node", "generate"]:
    return "web_search_node" if state["web_search"] == "yes" else "generate"

builder = StateGraph(CRAGState)
builder.add_node("retrieve",        retrieve)
builder.add_node("grade_documents", grade_documents)
builder.add_node("web_search_node", web_search_node)
builder.add_node("generate",        generate)
builder.set_entry_point("retrieve")
builder.add_edge("retrieve",        "grade_documents")
builder.add_conditional_edges("grade_documents", route_after_grade)
builder.add_edge("web_search_node", "generate")
builder.add_edge("generate",        END)`}</CodeBlock>
          </div>
        )}

        {tab === "reflexion" && (
          <div>
            <H3>Reflexion — self-critique loop</H3>
            <CodeBlock file="reflexion.py">{`from pydantic import BaseModel, Field

class CritiqueResult(BaseModel):
    score:     float = Field(ge=0, le=10)
    critique:  str
    approved:  bool

critique_llm = ChatOpenAI(model="gpt-4o").with_structured_output(CritiqueResult)

class ReflexionState(TypedDict):
    task:      str
    draft:     str
    critique:  str
    score:     float
    revision:  int
    final:     str

MAX_REVISIONS     = 3
QUALITY_THRESHOLD = 8.0

def generate_draft(state: ReflexionState) -> dict:
    has_prior = state.get("critique")
    prompt = (
        f"Task: {state['task']}\\n"
        + (f"Previous draft:\\n{state['draft']}\\nCritique:\\n{state['critique']}\\nImprove it."
           if has_prior else "Write a comprehensive response.")
    )
    draft = llm.invoke(prompt).content
    return {"draft": draft, "revision": state.get("revision", 0) + 1}

def critique_draft(state: ReflexionState) -> dict:
    result: CritiqueResult = critique_llm.invoke(
        f"Evaluate this response for task '{state['task']}':\\n{state['draft']}"
    )
    return {
        "critique": result.critique,
        "score":    result.score,
        "final":    state["draft"] if result.approved else ""
    }

def should_continue(state: ReflexionState) -> Literal["generate_draft", "__end__"]:
    if state["score"] >= QUALITY_THRESHOLD: return "__end__"
    if state["revision"] >= MAX_REVISIONS:  return "__end__"
    return "generate_draft"

builder = StateGraph(ReflexionState)
builder.add_node("generate_draft", generate_draft)
builder.add_node("critique_draft", critique_draft)
builder.set_entry_point("generate_draft")
builder.add_edge("generate_draft", "critique_draft")
builder.add_conditional_edges("critique_draft", should_continue)`}</CodeBlock>
          </div>
        )}

        {tab === "plan" && (
          <div>
            <H3>Plan-and-Execute</H3>
            <CodeBlock file="plan_execute.py">{`from pydantic import BaseModel

class Plan(BaseModel):
    steps: list[str]

class Response(BaseModel):
    response: str

planner    = ChatOpenAI(model="gpt-4o").with_structured_output(Plan)
executor   = ChatOpenAI(model="gpt-4o-mini")
replan_llm = ChatOpenAI(model="gpt-4o-mini")

class PlanState(TypedDict):
    task:        str
    plan:        list[str]
    past_steps:  list[tuple[str, str]]
    response:    str

def planner_node(state: PlanState) -> dict:
    p: Plan = planner.invoke(
        f"Create a 3-6 step plan to: {state['task']}\\n"
        "Each step should be a concrete, executable action."
    )
    return {"plan": p.steps}

def executor_node(state: PlanState) -> dict:
    step   = state["plan"][0]
    ctx    = "\\n".join(f"Step: {s}\\nResult: {r}" for s, r in state["past_steps"])
    result = executor.invoke(
        f"Task: {state['task']}\\nPrevious steps:\\n{ctx}\\nExecute: {step}"
    ).content
    return {
        "past_steps": state["past_steps"] + [(step, result)],
        "plan":       state["plan"][1:]
    }

def should_continue(state: PlanState) -> Literal["executor_node", "final_response", "planner_node"]:
    if not state["plan"]:
        return "final_response"
    decision = replan_llm.invoke(
        f"Remaining plan: {state['plan']}\\nResults so far: {state['past_steps'][-2:]}\\n"
        "Does the plan need adjustment? Reply REPLAN or CONTINUE"
    ).content
    return "planner_node" if "REPLAN" in decision else "executor_node"

def final_response(state: PlanState) -> dict:
    all_results = "\\n".join(f"- {s}: {r}" for s, r in state["past_steps"])
    answer = executor.invoke(f"Synthesize these results for task '{state['task']}':\\n{all_results}").content
    return {"response": answer}`}</CodeBlock>
          </div>
        )}

        {tab === "hitl" && (
          <div>
            <H3>Human-in-the-Loop — interrupt patterns</H3>
            <CodeBlock file="hitl.py">{`from langgraph.types import interrupt, Command
from langchain_core.runnables import RunnableConfig

# ── Pattern A: Compile-time interrupt_before ─────────────────────
graph = builder.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["writer"]
)
config = {"configurable": {"thread_id": "review-001"}}
result = graph.invoke({"messages": [HumanMessage("Write a contract")]}, config)
# → Graph is paused before writer

state = graph.get_state(config)
print("Next node:", state.next)
print("Draft so far:", state.values.get("research_summary"))

# Approve — resume with no changes
graph.invoke(None, config)

# Edit state — then resume
graph.update_state(config, {"research_summary": "REVISED: ..."})
graph.invoke(None, config)

# Reject — skip writer, route to END
graph.update_state(config, {"next": "FINISH"}, as_node="supervisor")
graph.invoke(None, config)

# ── Pattern B: Dynamic interrupt() inside node ───────────────────
def smart_writer(state: AgentState) -> dict:
    draft = generate_draft(state)

    if state.get("risk_level", "low") == "high":
        feedback = interrupt({
            "draft":     draft,
            "risk":      state["risk_level"],
            "question":  "High-risk content. Type APPROVE or provide edits."
        })
        if feedback and feedback != "APPROVE":
            draft = apply_edits(draft, feedback)

    return {"draft": draft}

# ── Resume with Command ──────────────────────────────────────────
result = graph.invoke(state, config)
# result["__interrupt__"][0].value = {"draft": ..., "risk": ..., "question": ...}

graph.invoke(Command(resume="APPROVE"), config)
# — or —
graph.invoke(Command(resume="Please add a clause about liability"), config)`}</CodeBlock>

            <Callout type="warn" title="Checkpointer required">
              HITL requires a <strong>checkpointer</strong> — there must be somewhere to save paused state. Without one,
              <code>interrupt()</code> raises <code>ValueError</code>.
            </Callout>
          </div>
        )}
      </Content>
    </ModulePage>
  );
}
