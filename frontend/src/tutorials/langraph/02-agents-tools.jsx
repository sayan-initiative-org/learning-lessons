// MODULE 02 — AGENTS & TOOLS
// ReAct · ToolNode · 4 tool patterns · prebuilt vs custom

import { useState } from "react";
import {
  T, ModulePage, ModuleHeader, Content, SubTabs,
  CodeBlock, Callout, H3,
} from "./_theme.jsx";

const TABS = [
  { id: "react",    label: "ReAct Loop" },
  { id: "prebuilt", label: "create_react_agent" },
  { id: "custom",   label: "Custom ReAct" },
  { id: "tools",    label: "Tool Patterns" },
  { id: "toolnode", label: "ToolNode" },
];

const REACT_STEPS = [
  "agent node: LLM sees messages + tools → produces AIMessage with optional tool_calls",
  "tools_condition: checks if last message has tool_calls",
  "If YES → ToolNode executes each tool call → returns ToolMessages",
  "ToolMessages appended to state → loop back to agent node",
  "If NO tool_calls → route to END (final answer reached)",
];

export default function AgentsTools() {
  const [tab, setTab] = useState("react");

  return (
    <ModulePage>
      <ModuleHeader
        moduleNum={2}
        title="Agents & Tools"
        subtitle="The ReAct loop · ToolNode · the four tool-definition patterns · when to reach for the prebuilt agent vs build your own."
        pills={[
          { label: "ReAct", kind: "gold" },
          { label: "ToolNode", kind: "sage" },
          { label: "tools_condition", kind: "plum" },
          { label: "bind_tools", kind: "terra" },
        ]}
      />

      <Content>
        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "react" && (
          <div>
            <Callout type="info" title="The ReAct loop">
              <strong>Reasoning + Acting.</strong> The standard agent pattern: LLM thinks → decides to call a tool → tool runs →
              LLM sees result → thinks again → either calls another tool or produces a final answer.
            </Callout>

            <H3>How the loop runs</H3>
            <div className="card-flat">
              {REACT_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < REACT_STEPS.length - 1 ? `1px dashed ${T.border}` : "none" }}>
                  <span className="mono" style={{ color: T.gold, fontSize: 11, flexShrink: 0, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13.5, color: T.text, opacity: .88, lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>

            <CodeBlock file="react_loop_explained.py">{`# The ReAct graph structure visualized as code
#
#   START → agent ──(has tool_calls?)─── tools → (back to) agent
#                ──(no tool_calls)─── END
#
# This is an infinite loop that terminates when the LLM
# decides NOT to call any tools (produces a final text response).

from langgraph.prebuilt import tools_condition   # the routing function
from langgraph.prebuilt import ToolNode          # the tool executor node

# tools_condition implementation (simplified):
# def tools_condition(state):
#     last = state["messages"][-1]
#     if hasattr(last, "tool_calls") and last.tool_calls:
#         return "tools"
#     return END`}</CodeBlock>
          </div>
        )}

        {tab === "prebuilt" && (
          <div>
            <H3>create_react_agent — one-liner agent</H3>
            <CodeBlock file="prebuilt_agent.py">{`from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage

llm   = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [TavilySearchResults(max_results=5)]

# ── Minimal ──────────────────────────────────────────────────────
graph = create_react_agent(llm, tools=tools)

# ── With persistence ─────────────────────────────────────────────
graph = create_react_agent(
    llm,
    tools=tools,
    checkpointer=SqliteSaver.from_conn_string("agent.db"),
)

# ── With system prompt ───────────────────────────────────────────
graph = create_react_agent(
    llm,
    tools=tools,
    state_modifier=(
        "You are an AI/ML expert assistant. "
        "Always cite sources. Think step by step before answering."
    ),
    checkpointer=SqliteSaver.from_conn_string("agent.db"),
)

# ── With pre/post hooks (state_modifier as function) ─────────────
from langchain_core.messages import SystemMessage

def add_system_prompt(state):
    return [SystemMessage(content="Be concise.")] + state["messages"]

graph = create_react_agent(llm, tools=tools, state_modifier=add_system_prompt)

# ── Run ──────────────────────────────────────────────────────────
config = {"configurable": {"thread_id": "research-001"}}
result = graph.invoke(
    {"messages": [HumanMessage(content="What are India's top AI startups in 2025?")]},
    config=config
)
print(result["messages"][-1].content)`}</CodeBlock>

            <Callout type="tip" title="What you get for free">
              Auto tool-calling loop · memory via checkpointer · streaming · LangSmith tracing · configurable system
              prompt. Use it unless you need custom logic between tool call and agent response.
            </Callout>
          </div>
        )}

        {tab === "custom" && (
          <div>
            <H3>Custom ReAct — full control</H3>
            <CodeBlock file="custom_react.py">{`from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, BaseMessage
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

SYSTEM = """You are an expert AI agent. Before acting:
1. Identify the user's goal
2. Determine which tool (if any) to use
3. Execute the tool and evaluate the result
4. Only respond when you have enough information."""

def build_react_agent(tools: list, model: str = "gpt-4o"):
    llm = ChatOpenAI(model=model, temperature=0).bind_tools(tools)

    def agent_node(state: AgentState) -> dict:
        msgs = [SystemMessage(content=SYSTEM)] + state["messages"]
        return {"messages": [llm.invoke(msgs)]}

    builder = StateGraph(AgentState)
    builder.add_node("agent", agent_node)
    builder.add_node("tools", ToolNode(tools))
    builder.set_entry_point("agent")
    builder.add_conditional_edges("agent", tools_condition)
    builder.add_edge("tools", "agent")
    return builder.compile()

# ── Extend: add a validator between tools and agent ─────────────
def build_validated_react(tools: list):
    llm = ChatOpenAI(model="gpt-4o").bind_tools(tools)

    def agent_node(state): return {"messages": [llm.invoke(state["messages"])]}

    def validate_tool_output(state: AgentState) -> dict:
        last = state["messages"][-1]    # ToolMessage
        if "error" in last.content.lower():
            from langchain_core.messages import AIMessage
            return {"messages": [AIMessage(content="Tool failed. Try a different approach.")]}
        return {}

    builder = StateGraph(AgentState)
    builder.add_node("agent",    agent_node)
    builder.add_node("tools",    ToolNode(tools))
    builder.add_node("validate", validate_tool_output)   # custom step
    builder.set_entry_point("agent")
    builder.add_conditional_edges("agent", tools_condition)
    builder.add_edge("tools",    "validate")
    builder.add_edge("validate", "agent")
    return builder.compile()`}</CodeBlock>
          </div>
        )}

        {tab === "tools" && (
          <div>
            <H3>Four tool-definition patterns</H3>
            <CodeBlock file="tool_patterns.py">{`from langchain_core.tools import tool, BaseTool, InjectedToolArg
from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field
from typing import Annotated

# ── Pattern 1: @tool decorator — simplest ────────────────────────
@tool
def search_kb(query: str, top_k: int = 5) -> list[str]:
    """Search the internal knowledge base.

    Args:
        query: Natural language search query.
        top_k: Number of results to return.
    """
    return ["result_1", "result_2"]

# ── Pattern 2: Pydantic schema — complex inputs ──────────────────
class CodeReviewInput(BaseModel):
    code:     str   = Field(description="Python code to review")
    language: str   = Field(default="python", description="Programming language")
    focus:    str   = Field(description="Review focus: security | performance | style")

@tool(args_schema=CodeReviewInput)
def review_code(code: str, language: str, focus: str) -> str:
    """Review code for quality and issues."""
    return f"Review [{focus}]: No critical issues found in {language} code."

# ── Pattern 3: InjectedState — access graph state inside tool ─────
@tool
def get_context_from_state(
    question: str,
    state: Annotated[dict, InjectedToolArg]  # not shown to LLM
) -> str:
    """Answer using context already computed in the graph."""
    context = state.get("research_data", "No context available")
    return f"From graph state: {context}"

# ── Pattern 4: RunnableConfig — know which user is calling ───────
@tool
def personalized_lookup(
    query: str,
    config: Annotated[RunnableConfig, InjectedToolArg]
) -> str:
    """Lookup personalized to the current user/session."""
    cfg     = config.get("configurable", {})
    user_id = cfg.get("user_id", "anonymous")
    return f"Results for user {user_id}: {query}"

tools = [search_kb, review_code, get_context_from_state, personalized_lookup]`}</CodeBlock>

            <Callout type="pattern" title="SDLC Copilot leverage">
              Patterns 3 (<code>InjectedState</code>) and 4 (<code>RunnableConfig</code>) are powerful: tools can read
              what previous agents already computed (project context, prior stories) without the LLM having to pass it
              explicitly.
            </Callout>
          </div>
        )}

        {tab === "toolnode" && (
          <div>
            <H3>ToolNode — the prebuilt executor</H3>
            <CodeBlock file="toolnode.py">{`from langgraph.prebuilt import ToolNode
from langchain_core.messages import ToolMessage

# ── Standard ToolNode ────────────────────────────────────────────
tool_node = ToolNode(tools=[search_kb, review_code])
# Automatically:
# 1. Reads tool_calls from last AIMessage
# 2. Executes each tool in parallel (if multiple calls)
# 3. Returns list of ToolMessages with results

# ── With error handling ──────────────────────────────────────────
tool_node = ToolNode(
    tools=tools,
    handle_tool_errors=True   # exceptions → ToolMessage with error text
)

# ── Custom tool executor (pre/post logic) ────────────────────────
def custom_tool_node(state: AgentState) -> dict:
    last_msg  = state["messages"][-1]
    results   = []
    for call in last_msg.tool_calls:
        tool = {t.name: t for t in tools}[call["name"]]
        try:
            result = tool.invoke(call["args"])
            if isinstance(result, str) and len(result) > 2000:
                result = result[:2000] + "... [truncated]"
        except Exception as e:
            result = f"Tool error: {e}"
        results.append(ToolMessage(
            content=str(result),
            tool_call_id=call["id"],
            name=call["name"]
        ))
    return {"messages": results}

# ── tools_condition helper ───────────────────────────────────────
from langgraph.prebuilt import tools_condition
builder.add_conditional_edges("agent", tools_condition)`}</CodeBlock>

            <Callout type="tip" title="Parallel tool execution">
              When an LLM emits multiple <code>tool_calls</code> in a single AIMessage, ToolNode runs all of them
              concurrently via <code>asyncio.gather</code>. Latency drops sharply for multi-tool agents.
            </Callout>
          </div>
        )}
      </Content>
    </ModulePage>
  );
}
