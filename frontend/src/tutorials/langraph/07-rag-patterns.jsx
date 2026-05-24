import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 07 — RAG Patterns in LangGraph
// Naive RAG · CRAG · HyDE · Self-RAG · Hybrid BM25+Dense · Agentic RAG
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
          <span style={{ fontSize:10,color:T.teal,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase" }}>{lang}</span>
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

function Flow({ steps, color }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:0,flexWrap:"wrap",margin:"0.75rem 0 1rem" }}>
      {steps.map((step,i) => (
        <div key={i} style={{ display:"flex",alignItems:"center" }}>
          <div style={{ background:`${color}15`,border:`1px solid ${color}35`,borderRadius:8,padding:"5px 11px",fontSize:12,color,fontWeight:500,whiteSpace:"nowrap" }}>{step}</div>
          {i<steps.length-1&&<div style={{ color:T.dim,fontSize:14,padding:"0 3px" }}>→</div>}
        </div>
      ))}
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div style={{ overflowX:"auto",margin:"1rem 0" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead><tr>{headers.map((h,i)=><th key={i} style={{ background:T.bg4,padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:`1px solid ${T.border2}` }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=><tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>{row.map((cell,j)=><td key={j} style={{ padding:"8px 12px",color:j===0?T.text:T.muted,fontFamily:j===0?"monospace":"inherit",fontSize:j===0?12:13 }}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

const PATTERNS = [
  { id:"naive",   label:"Naive RAG",   color:T.muted  },
  { id:"crag",    label:"CRAG",        color:T.blue   },
  { id:"hyde",    label:"HyDE",        color:T.purple },
  { id:"selfrag", label:"Self-RAG",    color:T.teal   },
  { id:"hybrid",  label:"Hybrid",      color:T.amber  },
  { id:"agentic", label:"Agentic RAG", color:T.green  },
];

export default function RAGPatternsGuide() {
  const [active, setActive] = useState("crag");
  const pat = PATTERNS.find(p=>p.id===active);

  return (
    <div style={{ minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Segoe UI','SF Pro Display',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:T.bg2,borderBottom:`1px solid ${T.border}`,padding:"1.5rem 2rem" }}>
        <div style={{ fontSize:10,color:T.teal,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>LangGraph Guide · Module 07</div>
        <h1 style={{ fontSize:"1.8rem",fontWeight:700,color:T.text,margin:"0 0 6px" }}>RAG Patterns in LangGraph</h1>
        <p style={{ color:T.muted,fontSize:14,margin:0 }}>CRAG · HyDE · Self-RAG · Hybrid BM25+Dense · Agentic RAG — every retrieval pattern you need for production agents</p>
      </div>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"2rem" }}>

        <DataTable
          headers={["Pattern","Core idea","Latency vs Naive","Best for"]}
          rows={[
            ["Naive RAG",   "Retrieve top-K → generate",              "1×",      "Simple Q&A, stable corpora"],
            ["CRAG",        "Grade docs → web fallback if poor",       "1.3×",    "Mixed-quality corpora, grounded answers"],
            ["HyDE",        "Generate hypothetical doc → embed → search","1.5×",  "Short queries, dense retrieval boost"],
            ["Self-RAG",    "Retrieve + critique + re-retrieve loop",  "2–5×",    "Factual accuracy critical"],
            ["Hybrid",      "BM25 + dense + RRF fusion",               "1×",      "Enterprise search, keyword + semantic"],
            ["Agentic RAG", "LLM decides when/how to retrieve",        "variable","Multi-hop, complex reasoning"],
          ]}
        />

        {/* Pattern nav */}
        <div style={{ display:"flex",gap:6,margin:"1.5rem 0 1.25rem",flexWrap:"wrap" }}>
          {PATTERNS.map(p=>(
            <button key={p.id} onClick={()=>setActive(p.id)}
              style={{ padding:"5px 16px",borderRadius:20,fontSize:13,fontWeight:500,cursor:"pointer",background:active===p.id?`${p.color}20`:"transparent",color:active===p.id?p.color:T.muted,border:`1px solid ${active===p.id?`${p.color}50`:T.border}`,transition:"all 0.15s",fontFamily:"inherit" }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* ─── NAIVE ─── */}
        {active==="naive"&&(
          <div>
            <H3 color={T.muted}>Naive RAG — the baseline</H3>
            <Flow steps={["Query","Embed","Vector search","Top-K docs","Prompt","LLM"]} color={T.muted} />
            <CodeBlock file="naive_rag.py">
{`from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma

class RAGState(TypedDict):
    question:  str
    documents: list[str]
    answer:    str

embeddings   = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")
llm          = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def retrieve(state: RAGState) -> dict:
    docs = vector_store.similarity_search(state["question"], k=5)
    return {"documents": [d.page_content for d in docs]}

def generate(state: RAGState) -> dict:
    context = "\\n\\n---\\n\\n".join(state["documents"])
    prompt  = f"""Answer ONLY from context. If unsure, say "I don't know."

Context:
{context}

Question: {state["question"]}"""
    answer = llm.invoke(prompt).content
    return {"answer": answer}

builder = StateGraph(RAGState)
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.set_entry_point("retrieve")
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", END)
graph = builder.compile()`}
            </CodeBlock>
            <Callout type="warn" title="Naive RAG failure modes">
              ❌ No quality check — irrelevant docs silently hallucinate answers<br/>
              ❌ Keyword mismatch: "model drift" ≠ "model degradation in production"<br/>
              ❌ No fallback when knowledge base lacks the answer
            </Callout>
          </div>
        )}

        {/* ─── CRAG ─── */}
        {active==="crag"&&(
          <div>
            <H3 color={T.blue}>CRAG — Corrective RAG</H3>
            <Flow steps={["Query","Retrieve","Grade each doc","All OK?","YES→Generate","NO→Web search→Generate"]} color={T.blue} />
            <CodeBlock file="crag.py">
{`from typing import TypedDict, Literal
from pydantic import BaseModel, Field
from langchain_community.tools.tavily_search import TavilySearchResults

class CRAGState(TypedDict):
    question:   str
    documents:  list[str]
    web_search: str          # "yes" | "no"
    generation: str

# ── Relevance grader (structured output) ──────────────────────────
class GradeDoc(BaseModel):
    binary_score: Literal["yes", "no"] = Field(description="Relevant to question?")

grader = ChatOpenAI(model="gpt-4o-mini", temperature=0).with_structured_output(GradeDoc)

tavily = TavilySearchResults(max_results=3)

# ── Node: retrieve ─────────────────────────────────────────────────
def retrieve(state: CRAGState) -> dict:
    docs = vector_store.similarity_search(state["question"], k=4)
    return {"documents": [d.page_content for d in docs]}

# ── Node: grade every retrieved document ──────────────────────────
def grade_documents(state: CRAGState) -> dict:
    graded_docs = []
    do_web_search = "no"

    for doc in state["documents"]:
        result = grader.invoke(
            f"Question: {state['question']}\\nDocument: {doc[:600]}\\nRelevant?"
        )
        if result.binary_score == "yes":
            graded_docs.append(doc)
        else:
            do_web_search = "yes"   # at least one bad doc → trigger web search

    return {"documents": graded_docs, "web_search": do_web_search}

# ── Node: web search fallback ──────────────────────────────────────
def web_search(state: CRAGState) -> dict:
    results = tavily.invoke(state["question"])
    web_content = "\\n".join(r["content"] for r in results)
    return {"documents": state["documents"] + [web_content]}

# ── Node: generate ─────────────────────────────────────────────────
def generate(state: CRAGState) -> dict:
    context = "\\n\\n".join(state["documents"])
    answer  = llm.invoke(
        f"Context:\\n{context}\\n\\nAnswer: {state['question']}"
    ).content
    return {"generation": answer}

# ── Routing after grading ─────────────────────────────────────────
def route_after_grading(state: CRAGState) -> Literal["web_search", "generate"]:
    return "web_search" if state["web_search"] == "yes" else "generate"

# ── Graph ──────────────────────────────────────────────────────────
builder = StateGraph(CRAGState)
builder.add_node("retrieve",        retrieve)
builder.add_node("grade_documents", grade_documents)
builder.add_node("web_search",      web_search)
builder.add_node("generate",        generate)
builder.set_entry_point("retrieve")
builder.add_edge("retrieve", "grade_documents")
builder.add_conditional_edges("grade_documents", route_after_grading)
builder.add_edge("web_search", "generate")
builder.add_edge("generate", END)
graph = builder.compile()`}
            </CodeBlock>
            <Callout type="pattern" title="CRAG in SDLC Copilot">
              Use CRAG in your UserStoryAgent retrieval loop: grade retrieved requirement docs for relevance to the current Epic → if graded poor, fall back to a broader BM25 keyword search before story generation.
            </Callout>
          </div>
        )}

        {/* ─── HyDE ─── */}
        {active==="hyde"&&(
          <div>
            <H3 color={T.purple}>HyDE — Hypothetical Document Embeddings</H3>
            <Flow steps={["Query","LLM generates fake answer","Embed fake answer","Vector search","Real docs retrieved","Generate final"]} color={T.purple} />
            <Callout type="insight" title="Why HyDE works">
              Short user queries embed poorly. A <em>hypothetical answer</em> is in the same embedding space as real answer docs. Embedding the fake answer bridges the query–document gap in dense retrieval.
            </Callout>
            <CodeBlock file="hyde.py">
{`class HyDEState(TypedDict):
    question:            str
    hypothetical_answer: str
    documents:           list[str]
    final_answer:        str

# ── Node: generate hypothetical answer ───────────────────────────
def generate_hypothetical(state: HyDEState) -> dict:
    """Generate a plausible but UNVERIFIED answer to the question.
    This expands the query semantically for better retrieval."""
    prompt = f"""Write a detailed, technically accurate answer to this question.
This is for retrieval purposes only — accuracy is less important than detail.

Question: {state['question']}

Hypothetical Answer:"""
    hyp = llm.invoke(prompt).content
    return {"hypothetical_answer": hyp}

# ── Node: retrieve using hypothetical answer embedding ────────────
def retrieve_with_hyde(state: HyDEState) -> dict:
    # Embed the hypothetical answer (not the original query!)
    docs = vector_store.similarity_search(
        query=state["hypothetical_answer"],   # ← key: embed the fake answer
        k=5
    )
    return {"documents": [d.page_content for d in docs]}

# ── Node: generate final answer using real retrieved docs ──────────
def generate_final(state: HyDEState) -> dict:
    context = "\\n\\n".join(state["documents"])
    answer  = llm.invoke(
        f"Context (verified):\\n{context}\\n\\nQuestion: {state['question']}\\nAnswer:"
    ).content
    return {"final_answer": answer}

# ── Graph ──────────────────────────────────────────────────────────
builder = StateGraph(HyDEState)
builder.add_node("generate_hypothetical", generate_hypothetical)
builder.add_node("retrieve",              retrieve_with_hyde)
builder.add_node("generate_final",        generate_final)
builder.set_entry_point("generate_hypothetical")
builder.add_edge("generate_hypothetical", "retrieve")
builder.add_edge("retrieve", "generate_final")
builder.add_edge("generate_final", END)

# ── Combine HyDE + CRAG for best of both worlds ───────────────────
# generate_hypothetical → retrieve_with_hyde → grade_documents
#   → web_search (if needed) → generate_final`}
            </CodeBlock>
          </div>
        )}

        {/* ─── SELF-RAG ─── */}
        {active==="selfrag"&&(
          <div>
            <H3 color={T.teal}>Self-RAG — critique and re-retrieve</H3>
            <Flow steps={["Query","Retrieve","Grade docs","Generate","Grade answer","Hallucination?","Useful?","Output or retry"]} color={T.teal} />
            <CodeBlock file="self_rag.py">
{`from typing import Literal

class SelfRAGState(TypedDict):
    question:   str
    documents:  list[str]
    generation: str
    retries:    int

MAX_RETRIES = 3

# ── Graders (structured outputs) ──────────────────────────────────
class HallucinationGrade(BaseModel):
    binary_score: Literal["yes","no"] = Field(description="Grounded in docs?")

class AnswerGrade(BaseModel):
    binary_score: Literal["yes","no"] = Field(description="Resolves the question?")

hal_grader    = llm.with_structured_output(HallucinationGrade)
answer_grader = llm.with_structured_output(AnswerGrade)

# ── Nodes ──────────────────────────────────────────────────────────
def retrieve(state):
    docs = vector_store.similarity_search(state["question"], k=5)
    return {"documents": [d.page_content for d in docs], "retries": state.get("retries", 0)}

def generate(state):
    context = "\\n\\n".join(state["documents"])
    answer  = llm.invoke(f"Context:\\n{context}\\n\\nQuestion: {state['question']}").content
    return {"generation": answer}

# ── Routing: check for hallucination ──────────────────────────────
def route_hallucination(state) -> Literal["useful", "not_supported", "re_retrieve"]:
    retries = state.get("retries", 0)
    if retries >= MAX_RETRIES:
        return "useful"   # give up gracefully

    # Grade 1: is the answer grounded in docs?
    hal_result = hal_grader.invoke(
        f"Documents:\\n{''.join(state['documents'][:2])}\\nAnswer:\\n{state['generation']}\\nGrounded?"
    )
    if hal_result.binary_score == "no":
        return "not_supported"   # hallucinating → regenerate

    # Grade 2: does it actually answer the question?
    ans_result = answer_grader.invoke(
        f"Question: {state['question']}\\nAnswer: {state['generation']}\\nAnswers question?"
    )
    return "useful" if ans_result.binary_score == "yes" else "re_retrieve"

# ── Graph ──────────────────────────────────────────────────────────
builder = StateGraph(SelfRAGState)
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.set_entry_point("retrieve")
builder.add_edge("retrieve", "generate")
builder.add_conditional_edges(
    "generate",
    route_hallucination,
    {
        "useful":         END,              # passed both checks
        "not_supported":  "generate",       # hallucinating → try again
        "re_retrieve":    "retrieve",       # off-topic → retrieve again
    }
)`}
            </CodeBlock>
            <Callout type="warn" title="Self-RAG cost">
              Each iteration costs 2–3 LLM calls (generate + 2 graders). Cap retries at 3. Use a cheaper model (gpt-4o-mini) for graders and a stronger model only for final generation.
            </Callout>
          </div>
        )}

        {/* ─── HYBRID ─── */}
        {active==="hybrid"&&(
          <div>
            <H3 color={T.amber}>Hybrid Retrieval — BM25 + Dense + RRF</H3>
            <Flow steps={["Query","BM25 (sparse)","Dense embed","RRF fusion","Cross-encoder rerank","Top docs","Generate"]} color={T.amber} />
            <CodeBlock file="hybrid_retrieval.py">
{`from rank_bm25 import BM25Okapi
from langchain_openai import OpenAIEmbeddings
import numpy as np

# ── Reciprocal Rank Fusion (RRF) ───────────────────────────────────
def rrf_fusion(bm25_results: list, dense_results: list, k: int = 60) -> list:
    """Merge BM25 and dense retrieval results using RRF scoring."""
    scores = {}
    for rank, doc_id in enumerate(bm25_results):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
    for rank, doc_id in enumerate(dense_results):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)

class HybridRetriever:
    def __init__(self, documents: list[str]):
        self.docs       = documents
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        tokenized       = [d.split() for d in documents]
        self.bm25       = BM25Okapi(tokenized)
        self.doc_vecs   = np.array(self.embeddings.embed_documents(documents))

    def retrieve(self, query: str, top_k: int = 5) -> list[str]:
        # ── BM25 sparse ranking ──────────────────────────────────
        bm25_scores = self.bm25.get_scores(query.split())
        bm25_ranked = np.argsort(bm25_scores)[::-1][:top_k * 2].tolist()

        # ── Dense semantic ranking ───────────────────────────────
        q_vec        = np.array(self.embeddings.embed_query(query))
        cosine_sims  = self.doc_vecs @ q_vec / (
            np.linalg.norm(self.doc_vecs, axis=1) * np.linalg.norm(q_vec) + 1e-9
        )
        dense_ranked = np.argsort(cosine_sims)[::-1][:top_k * 2].tolist()

        # ── RRF fusion ────────────────────────────────────────────
        fused = rrf_fusion(bm25_ranked, dense_ranked)
        return [self.docs[i] for i in fused[:top_k]]

# ── Use in LangGraph node ─────────────────────────────────────────
hybrid = HybridRetriever(your_documents)

def hybrid_retrieve(state: dict) -> dict:
    docs = hybrid.retrieve(state["question"], top_k=6)
    return {"documents": docs}

# ── Optional: cross-encoder reranking after fusion ─────────────────
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank(query: str, docs: list[str], top_k: int = 4) -> list[str]:
    pairs  = [(query, doc) for doc in docs]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, _ in ranked[:top_k]]`}
            </CodeBlock>
            <Callout type="pattern" title="SDLC Copilot: Hybrid retrieval stack">
              Your existing BM25 + dense + RRF stack is already the right pattern. Add the cross-encoder reranker as a post-fusion node in the retrieval subgraph to push precision from ~80% to ~92% on requirement doc retrieval.
            </Callout>
          </div>
        )}

        {/* ─── AGENTIC RAG ─── */}
        {active==="agentic"&&(
          <div>
            <H3 color={T.green}>Agentic RAG — LLM-driven retrieval decisions</H3>
            <Flow steps={["Query","Route: direct/vector/web","Retrieve (if needed)","Grade relevance","Generate","Grade output","Done or retry"]} color={T.green} />
            <CodeBlock file="agentic_rag.py">
{`from typing import Literal

class AgenticRAGState(TypedDict):
    question:   str
    documents:  list[str]
    datasource: str   # "vector_store" | "web_search" | "direct"
    generation: str

# ── Router: decide retrieval strategy ─────────────────────────────
class RouteQuery(BaseModel):
    datasource: Literal["vector_store", "web_search", "direct"]
    reasoning:  str

router_llm = ChatOpenAI(model="gpt-4o").with_structured_output(RouteQuery)

ROUTER_PROMPT = """Route the user question to the best data source.
- vector_store: questions about our internal docs, product, requirements, specs
- web_search: current events, recent news, real-time data
- direct: greetings, math, general knowledge the LLM knows well

Question: {question}"""

def route_question(state: AgenticRAGState) -> dict:
    result = router_llm.invoke(ROUTER_PROMPT.format(question=state["question"]))
    return {"datasource": result.datasource}

def route_to_source(state: AgenticRAGState) -> Literal["vector_store","web_search","generate"]:
    return state["datasource"] if state["datasource"] != "direct" else "generate"

# ── Retrieval nodes ───────────────────────────────────────────────
def vector_retrieve(state: AgenticRAGState) -> dict:
    docs = vector_store.similarity_search(state["question"], k=5)
    return {"documents": [d.page_content for d in docs]}

def web_retrieve(state: AgenticRAGState) -> dict:
    results = tavily.invoke(state["question"])
    return {"documents": [r["content"] for r in results]}

# ── Generate ──────────────────────────────────────────────────────
def generate(state: AgenticRAGState) -> dict:
    if state.get("documents"):
        context = "\\n\\n".join(state["documents"])
        prompt  = f"Context:\\n{context}\\n\\nQuestion: {state['question']}"
    else:
        prompt  = state["question"]   # direct answer, no context
    return {"generation": llm.invoke(prompt).content}

# ── Agentic RAG graph ─────────────────────────────────────────────
builder = StateGraph(AgenticRAGState)
builder.add_node("route_question", route_question)
builder.add_node("vector_store",   vector_retrieve)
builder.add_node("web_search",     web_retrieve)
builder.add_node("generate",       generate)

builder.set_entry_point("route_question")
builder.add_conditional_edges("route_question", route_to_source,
    {"vector_store":"vector_store","web_search":"web_search","generate":"generate"})
builder.add_edge("vector_store", "generate")
builder.add_edge("web_search",   "generate")
builder.add_edge("generate", END)
graph = builder.compile()`}
            </CodeBlock>
            <Callout type="insight" title="Agentic RAG vs CRAG">
              <strong>CRAG</strong>: always retrieves, then decides if retrieved docs are good enough.<br/>
              <strong>Agentic RAG</strong>: decides <em>whether and where</em> to retrieve before doing so. Lower cost on direct-answer questions, smarter routing overall.
            </Callout>
          </div>
        )}
      </div>
    </div>
  );
}
