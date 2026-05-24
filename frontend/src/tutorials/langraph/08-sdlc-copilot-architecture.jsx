import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 08 — SDLC Copilot Architecture in LangGraph
// Orchestration · 6 Specialist Agents · Redis Blackboard · Eval Framework
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  bg:"#090C14",bg2:"#0F1321",bg3:"#151A2A",bg4:"#1C2235",
  border:"rgba(255,255,255,0.07)",border2:"rgba(255,255,255,0.13)",
  blue:"#5B8BF5",purple:"#9B6DFF",teal:"#2DD4BF",
  amber:"#F5A623",coral:"#F87171",green:"#34D399",
  text:"#E2E8F0",muted:"#64748B",dim:"#2E3A50",
};

function CodeBlock({ file, lang = "python", children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ margin:"1rem 0",borderRadius:10,overflow:"hidden",border:`1px solid ${T.border}` }}>
      <div style={{ background:"#111827",padding:"6px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}` }}>
        <span style={{ fontSize:11,fontFamily:"monospace",color:T.muted }}>{file}</span>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <span style={{ fontSize:10,color:T.purple,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase" }}>{lang}</span>
          <button onClick={() => { navigator.clipboard?.writeText(children); setCopied(true); setTimeout(()=>setCopied(false),1800); }}
            style={{ background:copied?"rgba(45,212,191,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 10px",fontSize:10,color:copied?T.teal:T.muted,cursor:"pointer",fontFamily:"monospace" }}>
            {copied?"✓ copied":"copy"}
          </button>
        </div>
      </div>
      <pre style={{ margin:0,padding:"1rem 1.25rem",background:"#0D1117",overflowX:"auto",fontSize:12.5,lineHeight:1.78,fontFamily:"'Fira Code','JetBrains Mono',monospace",color:"#ABB2BF",whiteSpace:"pre" }}>{children}</pre>
    </div>
  );
}

function Callout({ type="insight", title, children }) {
  const s={insight:{bg:"rgba(91,139,245,0.07)",border:T.blue,text:"#A5BFFC",icon:"💡"},tip:{bg:"rgba(45,212,191,0.07)",border:T.teal,text:"#6EE7D8",icon:"✅"},warn:{bg:"rgba(245,166,35,0.07)",border:T.amber,text:"#FDE68A",icon:"⚠️"},pattern:{bg:"rgba(155,109,255,0.07)",border:T.purple,text:"#C4B5FD",icon:"🏗️"}}[type];
  return (
    <div style={{ background:s.bg,borderLeft:`3px solid ${s.border}`,borderRadius:"0 8px 8px 0",padding:"0.85rem 1.1rem",margin:"1rem 0",fontSize:13.5,color:s.text,lineHeight:1.7 }}>
      {title&&<div style={{fontWeight:600,marginBottom:4}}>{s.icon} {title}</div>}
      {children}
    </div>
  );
}

function H3({ children, color }) {
  return <h3 style={{ fontSize:"1rem",fontWeight:600,color:color||T.text,margin:"1.5rem 0 0.5rem" }}>{children}</h3>;
}

function AgentCard({ name, role, pattern, retrieval, accent, sdlcStage }) {
  return (
    <div style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,padding:"1rem",borderTop:`2px solid ${accent}` }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
        <div style={{ fontSize:13,fontWeight:700,color:accent,fontFamily:"monospace" }}>{name}</div>
        <div style={{ background:`${accent}18`,border:`1px solid ${accent}35`,color:accent,borderRadius:12,padding:"2px 8px",fontSize:10,fontWeight:600 }}>{sdlcStage}</div>
      </div>
      <div style={{ fontSize:12.5,color:T.text,marginBottom:6 }}>{role}</div>
      <div style={{ fontSize:11,color:T.muted,marginBottom:4 }}>
        <span style={{ color:T.dim }}>Pattern: </span>{pattern}
      </div>
      <div style={{ fontSize:11,color:T.muted }}>
        <span style={{ color:T.dim }}>Retrieval: </span>{retrieval}
      </div>
    </div>
  );
}

const TABS = ["architecture","state","orchestrator","agents","blackboard","evaluation"];

export default function SDLCCopilotGuide() {
  const [tab, setTab] = useState("architecture");

  return (
    <div style={{ minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Segoe UI','SF Pro Display',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:T.bg2,borderBottom:`1px solid ${T.border}`,padding:"1.5rem 2rem" }}>
        <div style={{ fontSize:10,color:T.purple,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>LangGraph Guide · Module 08</div>
        <h1 style={{ fontSize:"1.8rem",fontWeight:700,color:T.text,margin:"0 0 6px" }}>SDLC Copilot Architecture</h1>
        <p style={{ color:T.muted,fontSize:14,margin:0 }}>Full LangGraph mapping: 6 specialist agents · DAG orchestration · Redis Blackboard · 5-layer evaluation</p>
      </div>

      <div style={{ maxWidth:960,margin:"0 auto",padding:"2rem" }}>
        {/* Tab nav */}
        <div style={{ display:"flex",gap:6,marginBottom:"1.5rem",flexWrap:"wrap" }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:"5px 16px",borderRadius:20,fontSize:13,fontWeight:500,cursor:"pointer",background:tab===t?`${T.purple}20`:"transparent",color:tab===t?T.purple:T.muted,border:`1px solid ${tab===t?`${T.purple}50`:T.border}`,transition:"all 0.15s",fontFamily:"inherit",textTransform:"capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {/* ─── ARCHITECTURE OVERVIEW ─── */}
        {tab==="architecture"&&(
          <div>
            <H3 color={T.purple}>System architecture map</H3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.5rem" }}>
              <div style={{ gridColumn:"1 / -1",background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,padding:"1.1rem",borderTop:`2px solid ${T.purple}` }}>
                <div style={{ fontSize:12,fontWeight:600,color:T.purple,marginBottom:8,fontFamily:"monospace" }}>OrchestratorGraph (parent)</div>
                <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
                  {["intent_identifier","task_planner","agent_registry","supervisor","error_handler"].map(n=>(
                    <div key={n} style={{ background:T.bg4,border:`1px solid ${T.purple}30`,borderRadius:6,padding:"4px 10px",fontSize:11,color:T.purple,fontFamily:"monospace" }}>{n}</div>
                  ))}
                </div>
              </div>
              {[
                {name:"UserStoryAgent",color:T.blue,   pdlcStage:"Define",  pattern:"CRAG + Reflexion"},
                {name:"EpicAgent",     color:T.purple, pdlcStage:"Define",  pattern:"Supervisor sub-graph"},
                {name:"TestCaseAgent", color:T.teal,   pdlcStage:"Test",    pattern:"Plan-Execute + Self-RAG"},
                {name:"GherkinAgent",  color:T.amber,  pdlcStage:"Test",    pattern:"Template + LLM-fill"},
                {name:"QualityGate",   color:T.green,  pdlcStage:"Review",  pattern:"LLM-as-Judge (5 dims)"},
                {name:"DocAgent",      color:T.coral,  pdlcStage:"Design",  pattern:"RAG + structured output"},
              ].map(a=>(
                <div key={a.name} style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,padding:"0.9rem",borderLeft:`2px solid ${a.color}` }}>
                  <div style={{ fontSize:12,fontWeight:700,color:a.color,fontFamily:"monospace",marginBottom:4 }}>{a.name}</div>
                  <div style={{ fontSize:11,color:T.muted,marginBottom:3 }}>PDLC: <span style={{ color:T.text }}>{a.pdlcStage}</span></div>
                  <div style={{ fontSize:11,color:T.muted }}>Pattern: <span style={{ color:T.text }}>{a.pattern}</span></div>
                </div>
              ))}
            </div>
            <Callout type="insight" title="LangGraph primitives used">
              <strong>Orchestrator:</strong> StateGraph + Supervisor pattern + structured RouterOutput<br/>
              <strong>Each agent:</strong> Compiled subgraph → treated as single node in parent<br/>
              <strong>Parallel execution:</strong> Send API for fan-out across multiple EPICs<br/>
              <strong>State:</strong> Redis-backed PostgresSaver for multi-user persistence<br/>
              <strong>HITL:</strong> interrupt() before finalizing User Stories for PO approval
            </Callout>
          </div>
        )}

        {/* ─── STATE ─── */}
        {tab==="state"&&(
          <div>
            <H3 color={T.blue}>Unified SDLC State</H3>
            <CodeBlock file="sdlc_state.py">
{`from typing import TypedDict, Annotated, Optional
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
import operator

class SDLCState(TypedDict):
    # ── Input ─────────────────────────────────────────────────────
    project_name:     str
    project_context:  str           # raw PRD / SRS text
    epics:            list[str]     # list of Epic titles

    # ── Orchestration ─────────────────────────────────────────────
    intent:           str           # "generate_stories" | "generate_tests" | ...
    task_plan:        list[str]     # ordered agent invocation plan
    current_agent:    str           # which agent is active
    iteration_count:  int           # supervisor loop counter

    # ── Agent outputs (fan-in with operator.add) ──────────────────
    user_stories:     Annotated[list[dict], operator.add]   # parallel fan-in
    test_cases:       Annotated[list[dict], operator.add]   # parallel fan-in
    gherkin_scripts:  Annotated[list[str],  operator.add]   # parallel fan-in

    # ── Quality control ────────────────────────────────────────────
    quality_scores:   dict          # {story_id: {dim: score}}
    failed_stories:   list[str]     # story IDs needing revision
    final_approved:   list[dict]    # PO-approved stories

    # ── RAG context ───────────────────────────────────────────────
    retrieved_docs:   list[str]     # context from knowledge base
    critique:         str           # latest quality critique

    # ── Messaging (full history) ──────────────────────────────────
    messages:         Annotated[list[BaseMessage], add_messages]

    # ── Error tracking ────────────────────────────────────────────
    errors:           list[str]
    retry_count:      int`}
            </CodeBlock>
          </div>
        )}

        {/* ─── ORCHESTRATOR ─── */}
        {tab==="orchestrator"&&(
          <div>
            <H3 color={T.purple}>Orchestrator — Intent → Task Plan → Supervisor</H3>
            <CodeBlock file="orchestrator.py">
{`from pydantic import BaseModel, Field
from typing import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

# ── Step 1: Intent Identifier ─────────────────────────────────────
class IntentOutput(BaseModel):
    intent:  Literal["generate_stories","generate_tests","generate_gherkin","full_pipeline"]
    epics:   list[str] = Field(description="List of EPIC titles extracted")
    context: str       = Field(description="Cleaned project context")

intent_llm = ChatOpenAI(model="gpt-4o").with_structured_output(IntentOutput)

def intent_identifier(state: SDLCState) -> dict:
    result = intent_llm.invoke(
        f"Analyze this project context and extract intent + epics:\\n{state['project_context']}"
    )
    return {"intent": result.intent, "epics": result.epics, "project_context": result.context}

# ── Step 2: Task Planner ──────────────────────────────────────────
PIPELINE_PLANS = {
    "full_pipeline":     ["user_story_agent","quality_gate","test_case_agent","gherkin_agent","doc_agent"],
    "generate_stories":  ["user_story_agent","quality_gate"],
    "generate_tests":    ["test_case_agent","gherkin_agent"],
    "generate_gherkin":  ["gherkin_agent"],
}

def task_planner(state: SDLCState) -> dict:
    plan = PIPELINE_PLANS.get(state["intent"], ["user_story_agent"])
    return {"task_plan": plan, "current_agent": plan[0], "iteration_count": 0}

# ── Step 3: Supervisor Router ─────────────────────────────────────
class RouterOutput(BaseModel):
    next:      str = Field(description="Next agent or FINISH")
    reasoning: str

MAX_ITER = 12
router_llm = ChatOpenAI(model="gpt-4o").with_structured_output(RouterOutput)

SUPERVISOR_PROMPT = """
You are the SDLC Copilot orchestrator. You manage:
user_story_agent, quality_gate, test_case_agent, gherkin_agent, doc_agent.

Current plan: {plan}
Completed steps: {done}
Quality failures: {failures}
Iteration: {iter}/{max}

Rules:
- Follow the task plan in order
- If quality_gate FAILS stories → route back to user_story_agent (max 2 retries)
- If iteration >= {max} → FINISH regardless
- Output FINISH when plan is complete and quality passed
"""

def supervisor(state: SDLCState) -> dict:
    iter_count = state.get("iteration_count", 0)
    if iter_count >= MAX_ITER:
        return {"current_agent": "FINISH"}

    plan     = state.get("task_plan", [])
    failures = state.get("failed_stories", [])
    done     = [a for a in plan if a != state.get("current_agent")]

    result = router_llm.invoke([
        SystemMessage(content=SUPERVISOR_PROMPT.format(
            plan=plan, done=done, failures=len(failures),
            iter=iter_count, max=MAX_ITER
        ))
    ])
    return {"current_agent": result.next, "iteration_count": iter_count + 1}

def route_supervisor(state: SDLCState) -> str:
    nxt = state.get("current_agent", "FINISH")
    return nxt if nxt != "FINISH" else "__end__"

# ── Build orchestrator graph ──────────────────────────────────────
from langgraph.graph import StateGraph, END

orch = StateGraph(SDLCState)
orch.add_node("intent_identifier", intent_identifier)
orch.add_node("task_planner",      task_planner)
orch.add_node("supervisor",        supervisor)
orch.add_node("user_story_agent",  user_story_subgraph)   # compiled subgraph
orch.add_node("quality_gate",      quality_gate_subgraph)
orch.add_node("test_case_agent",   test_case_subgraph)
orch.add_node("gherkin_agent",     gherkin_subgraph)
orch.add_node("doc_agent",         doc_subgraph)

orch.set_entry_point("intent_identifier")
orch.add_edge("intent_identifier", "task_planner")
orch.add_edge("task_planner", "supervisor")
orch.add_conditional_edges("supervisor", route_supervisor)
for agent in ["user_story_agent","quality_gate","test_case_agent","gherkin_agent","doc_agent"]:
    orch.add_edge(agent, "supervisor")

orchestrator = orch.compile(checkpointer=PostgresSaver(...))`}
            </CodeBlock>
          </div>
        )}

        {/* ─── AGENTS ─── */}
        {tab==="agents"&&(
          <div>
            <H3 color={T.teal}>UserStoryAgent — CRAG + Reflexion subgraph</H3>
            <CodeBlock file="user_story_agent.py">
{`from langgraph.types import Send
import operator

class UserStoryState(TypedDict):
    epic:         str
    context:      str
    documents:    list[str]
    web_search:   str
    draft_story:  dict
    critique:     str
    score:        float
    revision:     int
    final_story:  dict

MAX_REVISIONS  = 3
QUALITY_THRESH = 7.5

# ── CRAG retrieval ────────────────────────────────────────────────
def retrieve_requirements(state: UserStoryState) -> dict:
    docs = hybrid_retriever.retrieve(state["epic"], top_k=6)
    return {"documents": docs}

def grade_and_fallback(state: UserStoryState) -> dict:
    graded, do_web = [], "no"
    for doc in state["documents"]:
        r = grader.invoke(f"Epic: {state['epic']}\\nDoc: {doc[:400]}\\nRelevant?")
        if r.binary_score == "yes": graded.append(doc)
        else: do_web = "yes"
    return {"documents": graded, "web_search": do_web}

def web_augment(state: UserStoryState) -> dict:
    results = tavily.invoke(f"{state['epic']} requirements specification")
    return {"documents": state["documents"] + [r["content"] for r in results]}

# ── Generate + Reflexion loop ──────────────────────────────────────
def generate_story(state: UserStoryState) -> dict:
    prior_critique = f"\\nPrior critique: {state['critique']}" if state.get("critique") else ""
    context = "\\n".join(state["documents"])
    prompt  = f"""Generate a user story for EPIC: {state['epic']}
Context: {context}{prior_critique}
Format: {{title, as_a, i_want, so_that, acceptance_criteria: [list]}}
Return JSON only."""
    story = story_llm.invoke(prompt)   # structured output → dict
    return {"draft_story": story, "revision": state.get("revision", 0) + 1}

def critique_story(state: UserStoryState) -> dict:
    result = judge_llm.invoke(
        f"Score 1-10 and critique this user story:\\n{state['draft_story']}\\nReturn JSON: {{score, critique}}"
    )
    return {"critique": result.critique, "score": result.score}

def route_reflexion(state: UserStoryState) -> str:
    if state["score"] >= QUALITY_THRESH:           return "finalize"
    if state.get("revision", 0) >= MAX_REVISIONS:  return "finalize"
    return "generate_story"   # loop back

def finalize_story(state: UserStoryState) -> dict:
    return {"final_story": {**state["draft_story"], "quality_score": state["score"]}}

# ── Subgraph build ────────────────────────────────────────────────
sub = StateGraph(UserStoryState)
sub.add_node("retrieve",      retrieve_requirements)
sub.add_node("grade",         grade_and_fallback)
sub.add_node("web_augment",   web_augment)
sub.add_node("generate_story",generate_story)
sub.add_node("critique_story",critique_story)
sub.add_node("finalize",      finalize_story)
sub.set_entry_point("retrieve")
sub.add_edge("retrieve", "grade")
sub.add_conditional_edges("grade",
    lambda s: "web_augment" if s["web_search"]=="yes" else "generate_story")
sub.add_edge("web_augment", "generate_story")
sub.add_edge("generate_story", "critique_story")
sub.add_conditional_edges("critique_story", route_reflexion,
    {"generate_story":"generate_story","finalize":"finalize"})
sub.add_edge("finalize", END)
user_story_subgraph = sub.compile()

# ── Fan-out from orchestrator: one Send per EPIC ──────────────────
def dispatch_story_agents(state: SDLCState) -> list[Send]:
    return [
        Send("user_story_agent", {"epic": epic, "context": state["project_context"]})
        for epic in state["epics"]
    ]
# All UserStoryAgents run in PARALLEL. Results fan-in via operator.add`}
            </CodeBlock>

            <H3 color={T.green}>QualityGate — 5-dimension LLM-as-Judge</H3>
            <CodeBlock file="quality_gate.py">
{`from pydantic import BaseModel, Field

class QualityScore(BaseModel):
    clarity:            int = Field(ge=1, le=10, description="Is the story clear and unambiguous?")
    completeness:       int = Field(ge=1, le=10, description="Does it have all INVEST criteria?")
    acceptance_quality: int = Field(ge=1, le=10, description="Are ACs testable and specific?")
    business_value:     int = Field(ge=1, le=10, description="Is business value clear?")
    technical_feasibility:int= Field(ge=1, le=10, description="Is it implementable as stated?")
    verdict:            str = Field(description="APPROVED | REVISION_NEEDED | REJECTED")
    feedback:           str = Field(description="Specific actionable feedback")

judge = ChatOpenAI(model="gpt-4o").with_structured_output(QualityScore)

def quality_gate_node(state: SDLCState) -> dict:
    scores = {}
    failed = []

    for story in state.get("user_stories", []):
        result = judge.invoke(
            f"Evaluate this user story against INVEST criteria:\\n{story}\\n\\nScore each dimension."
        )
        composite = (
            result.clarity            * 0.25 +
            result.completeness       * 0.25 +
            result.acceptance_quality * 0.25 +
            result.business_value     * 0.15 +
            result.technical_feasibility * 0.10
        )
        story_id = story.get("id", "unknown")
        scores[story_id] = {
            "composite": composite,
            "dimensions": result.dict(),
            "verdict": result.verdict,
        }
        if result.verdict != "APPROVED":
            failed.append(story_id)

    return {
        "quality_scores":  scores,
        "failed_stories":  failed,
        "final_approved":  [s for s in state["user_stories"] if s.get("id") not in failed],
        "critique":        "Quality gate complete. Failed: " + str(len(failed)),
    }`}
            </CodeBlock>
          </div>
        )}

        {/* ─── BLACKBOARD ─── */}
        {tab==="blackboard"&&(
          <div>
            <H3 color={T.amber}>Redis Blackboard — shared agent memory</H3>
            <CodeBlock file="blackboard.py">
{`import json
import redis
from datetime import timedelta
from enum import Enum

class AgentRole(str, Enum):
    ORCHESTRATOR = "orchestrator"
    USER_STORY   = "user_story_agent"
    QUALITY_GATE = "quality_gate"
    TEST_CASE    = "test_case_agent"
    GHERKIN      = "gherkin_agent"
    DOC          = "doc_agent"

# ACL: which agents can read / write each namespace
BLACKBOARD_ACL = {
    "epics":         {"read": [AgentRole.USER_STORY, AgentRole.ORCHESTRATOR], "write": [AgentRole.ORCHESTRATOR]},
    "user_stories":  {"read": [AgentRole.QUALITY_GATE, AgentRole.TEST_CASE, AgentRole.GHERKIN], "write": [AgentRole.USER_STORY]},
    "quality_scores":{"read": [AgentRole.ORCHESTRATOR, AgentRole.USER_STORY], "write": [AgentRole.QUALITY_GATE]},
    "test_cases":    {"read": [AgentRole.GHERKIN, AgentRole.DOC], "write": [AgentRole.TEST_CASE]},
}

class Blackboard:
    def __init__(self, session_id: str, redis_url: str = "redis://localhost:6379"):
        self.r          = redis.from_url(redis_url)
        self.session_id = session_id
        self.prefix     = f"sdlc:{session_id}"

    def _key(self, namespace: str) -> str:
        return f"{self.prefix}:{namespace}"

    def write(self, namespace: str, data: dict, agent: AgentRole, ttl_hours: int = 24):
        acl = BLACKBOARD_ACL.get(namespace, {})
        if agent not in acl.get("write", []):
            raise PermissionError(f"{agent} cannot write to '{namespace}'")
        self.r.setex(
            self._key(namespace),
            timedelta(hours=ttl_hours),
            json.dumps({"agent": agent, "data": data})
        )

    def read(self, namespace: str, agent: AgentRole) -> dict | None:
        acl = BLACKBOARD_ACL.get(namespace, {})
        if agent not in acl.get("read", []):
            raise PermissionError(f"{agent} cannot read '{namespace}'")
        raw = self.r.get(self._key(namespace))
        return json.loads(raw)["data"] if raw else None

    def publish(self, channel: str, message: dict):
        """Pub/sub for agent coordination events."""
        self.r.publish(f"{self.prefix}:events:{channel}", json.dumps(message))

    def subscribe(self, channel: str):
        pub = self.r.pubsub()
        pub.subscribe(f"{self.prefix}:events:{channel}")
        return pub

# ── Use in LangGraph node ─────────────────────────────────────────
def user_story_node_with_blackboard(state: SDLCState, config) -> dict:
    session_id = config["configurable"]["thread_id"]
    bb = Blackboard(session_id)

    # Read EPICs written by orchestrator
    epics = bb.read("epics", AgentRole.USER_STORY)

    # ... generate stories ...

    # Write results to blackboard for downstream agents
    bb.write("user_stories", {"stories": generated_stories}, AgentRole.USER_STORY)
    bb.publish("story_generation_complete", {"count": len(generated_stories)})
    return {"user_stories": generated_stories}`}
            </CodeBlock>
            <Callout type="pattern" title="Blackboard vs LangGraph state">
              <strong>LangGraph state</strong>: per-thread, checkpoint-safe, used for orchestration control flow and small payloads.<br/>
              <strong>Redis Blackboard</strong>: cross-agent, TTL-managed, used for large artifacts (full story lists, test suites). Agents subscribe via pub/sub for real-time coordination.
            </Callout>
          </div>
        )}

        {/* ─── EVALUATION ─── */}
        {tab==="evaluation"&&(
          <div>
            <H3 color={T.coral}>5-Layer Evaluation Framework</H3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem" }}>
              {[
                {layer:"L1",title:"Retrieval Quality",dims:"Precision@K, Recall@K, MRR, NDCG",color:T.blue,tool:"RAGAS"},
                {layer:"L2",title:"Faithfulness",dims:"Hallucination rate, context grounding",color:T.purple,tool:"DeepEval"},
                {layer:"L3",title:"Story Quality",dims:"INVEST: clarity, completeness, ACs",color:T.teal,tool:"LLM-as-Judge"},
                {layer:"L4",title:"Agentic",dims:"Goal completion, retry rate, tool use",color:T.amber,tool:"Custom"},
                {layer:"L5",title:"Latency / Cost",dims:"p95 latency, tokens/story, $/run",color:T.green,tool:"Phoenix + LS"},
              ].map(l=>(
                <div key={l.layer} style={{ background:T.bg3,border:`1px solid ${T.border}`,borderRadius:10,padding:"0.9rem",borderLeft:`2px solid ${l.color}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <div style={{ fontSize:11,fontFamily:"monospace",fontWeight:700,color:l.color }}>{l.layer}</div>
                    <div style={{ fontSize:10,background:`${l.color}18`,border:`1px solid ${l.color}35`,color:l.color,borderRadius:10,padding:"2px 7px",fontWeight:600 }}>{l.tool}</div>
                  </div>
                  <div style={{ fontSize:13,fontWeight:600,color:T.text,marginBottom:4 }}>{l.title}</div>
                  <div style={{ fontSize:11.5,color:T.muted }}>{l.dims}</div>
                </div>
              ))}
            </div>
            <CodeBlock file="eval_framework.py">
{`from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    ContextualRecallMetric,
    HallucinationMetric,
)
from deepeval.test_case import LLMTestCase
from ragas import evaluate as ragas_evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall

# ── Layer 1: RAGAS retrieval metrics ──────────────────────────────
def eval_retrieval(dataset):
    return ragas_evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])

# ── Layer 3: Story quality (LLM-as-Judge) ─────────────────────────
from pydantic import BaseModel, Field

class INVESTScore(BaseModel):
    independent:  int = Field(ge=1, le=10)
    negotiable:   int = Field(ge=1, le=10)
    valuable:     int = Field(ge=1, le=10)
    estimable:    int = Field(ge=1, le=10)
    small:        int = Field(ge=1, le=10)
    testable:     int = Field(ge=1, le=10)
    overall:      float
    verdict:      str

invest_judge = ChatOpenAI(model="gpt-4o").with_structured_output(INVESTScore)

def score_user_story(story: dict) -> INVESTScore:
    return invest_judge.invoke(
        f"Score this user story against INVEST criteria (1-10 each):\\n{story}"
    )

# ── Layer 4: Agentic metrics (custom) ─────────────────────────────
def eval_agent_run(run_trace: dict) -> dict:
    return {
        "goal_completion":  run_trace["final_approved"] > 0,
        "retry_rate":       run_trace["iteration_count"] / run_trace["epic_count"],
        "stories_per_epic": len(run_trace["user_stories"]) / len(run_trace["epics"]),
        "quality_pass_pct": (1 - len(run_trace["failed_stories"]) / max(len(run_trace["user_stories"]), 1)) * 100,
    }

# ── Layer 5: LangSmith cost tracking ──────────────────────────────
# Auto-tracked via LANGCHAIN_TRACING_V2=true
# Access via: ls_client.list_runs(project_name="sdlc-copilot-prod")
# Filter by metadata: {"epic_count": N, "env": "production"}

# ── CI/CD eval gate ────────────────────────────────────────────────
def ci_eval_gate(test_suite):
    results = evaluate(test_suite)
    thresholds = {
        "answer_relevancy": 0.80,
        "faithfulness":     0.85,
        "invest_score":     7.5,
    }
    for metric, threshold in thresholds.items():
        score = results.get(metric, 0)
        if score < threshold:
            raise AssertionError(f"EVAL GATE FAILED: {metric}={score:.2f} < {threshold}")
    print("✅ All eval gates passed")`}
            </CodeBlock>
          </div>
        )}
      </div>
    </div>
  );
}
