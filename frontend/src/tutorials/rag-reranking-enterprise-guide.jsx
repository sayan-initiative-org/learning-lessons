import { useState } from "react";

const COLORS = {
  bg: "#0a0d14",
  surface: "#111827",
  card: "#161d2e",
  border: "#1e2a40",
  accent1: "#285BC5",
  accent2: "#4C12A1",
  accent3: "#06b6d4",
  accent4: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  text: "#e2e8f0",
  muted: "#64748b",
  subtle: "#94a3b8",
};

const styles = {
  app: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    background: COLORS.bg,
    minHeight: "100vh",
    color: COLORS.text,
    padding: "0",
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.accent2}22, ${COLORS.accent1}33)`,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "32px 40px 24px",
  },
  badge: {
    display: "inline-block",
    background: `${COLORS.accent1}22`,
    border: `1px solid ${COLORS.accent1}55`,
    color: COLORS.accent3,
    fontSize: "10px",
    padding: "3px 10px",
    borderRadius: "20px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px",
    background: `linear-gradient(90deg, #fff, ${COLORS.accent3})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: "13px",
    margin: 0,
    letterSpacing: "0.3px",
  },
  nav: {
    display: "flex",
    gap: "4px",
    padding: "16px 40px",
    background: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    flexWrap: "wrap",
  },
  navBtn: (active) => ({
    padding: "8px 18px",
    borderRadius: "6px",
    border: `1px solid ${active ? COLORS.accent1 : COLORS.border}`,
    background: active ? `${COLORS.accent1}22` : "transparent",
    color: active ? COLORS.accent3 : COLORS.muted,
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.5px",
    fontFamily: "inherit",
    fontWeight: active ? "600" : "400",
  }),
  content: {
    padding: "32px 40px",
    maxWidth: "1200px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 6px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sectionDesc: {
    color: COLORS.muted,
    fontSize: "12px",
    margin: "0 0 20px",
    lineHeight: "1.6",
    maxWidth: "700px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "16px",
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "12px",
    padding: "20px",
    transition: "border-color 0.2s",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardTag: (color) => ({
    fontSize: "9px",
    padding: "2px 8px",
    borderRadius: "12px",
    background: `${color}22`,
    border: `1px solid ${color}44`,
    color: color,
    letterSpacing: "1px",
  }),
  cardBody: {
    color: COLORS.subtle,
    fontSize: "12px",
    lineHeight: "1.7",
    margin: "0 0 12px",
  },
  formula: {
    background: "#0d1117",
    border: `1px solid ${COLORS.accent1}33`,
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "12px",
    color: COLORS.accent3,
    fontFamily: "inherit",
    margin: "10px 0",
    lineHeight: "1.8",
    overflowX: "auto",
  },
  code: {
    background: "#0d1117",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "11px",
    color: "#a5d6ff",
    fontFamily: "inherit",
    margin: "10px 0",
    lineHeight: "1.8",
    overflowX: "auto",
    whiteSpace: "pre",
  },
  procon: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  pro: {
    flex: 1,
    background: `${COLORS.accent4}11`,
    border: `1px solid ${COLORS.accent4}33`,
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "11px",
    color: COLORS.accent4,
  },
  con: {
    flex: 1,
    background: `${COLORS.danger}11`,
    border: `1px solid ${COLORS.danger}33`,
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "11px",
    color: "#fca5a5",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    marginTop: "16px",
  },
  th: {
    background: `${COLORS.accent1}22`,
    border: `1px solid ${COLORS.border}`,
    padding: "10px 14px",
    textAlign: "left",
    color: COLORS.accent3,
    fontWeight: "600",
    fontSize: "11px",
    letterSpacing: "0.5px",
  },
  td: {
    border: `1px solid ${COLORS.border}`,
    padding: "9px 14px",
    color: COLORS.subtle,
    verticalAlign: "top",
    lineHeight: "1.5",
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "8px",
  },
  pill: (color) => ({
    fontSize: "10px",
    padding: "3px 10px",
    borderRadius: "20px",
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color: color,
    letterSpacing: "0.5px",
  }),
  divider: {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "32px 0",
  },
  expandBtn: {
    background: "transparent",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.muted,
    padding: "5px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: "inherit",
    marginTop: "10px",
  },
  alertBox: (color) => ({
    background: `${color}11`,
    border: `1px solid ${color}44`,
    borderRadius: "8px",
    padding: "12px 16px",
    margin: "12px 0",
    fontSize: "12px",
    color: color,
    lineHeight: "1.6",
  }),
  stepNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent1})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  stepRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  layerBar: (color, pct) => ({
    height: "6px",
    borderRadius: "3px",
    background: `linear-gradient(90deg, ${color}, ${color}44)`,
    width: `${pct}%`,
    marginTop: "4px",
  }),
};

// ─── DATA ──────────────────────────────────────────────────────────────────

const rerankingStrategies = [
  {
    id: "rrf",
    name: "Reciprocal Rank Fusion",
    abbr: "RRF",
    tag: "FUSION",
    tagColor: COLORS.accent1,
    summary:
      "Combines multiple ranked lists by summing the reciprocal of each document's rank. Simple, parameter-free, and remarkably effective at merging BM25 + dense retrieval results.",
    formula: `RRF_score(d) = Σ 1 / (k + rank_i(d))

k = 60  (smoothing constant — prevents top-ranked docs from dominating)
rank_i(d) = position of document d in ranked list i
Σ = sum over all retrieval systems i`,
    code: `def rrf_fusion(ranked_lists: list[list[str]], k: int = 60) -> dict:
    scores = {}
    for ranked in ranked_lists:
        for rank, doc_id in enumerate(ranked, start=1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))

# Example: Merge BM25 + Dense retrieval
bm25_results   = ["doc_3", "doc_1", "doc_7", "doc_2"]
dense_results  = ["doc_1", "doc_5", "doc_3", "doc_9"]
fused = rrf_fusion([bm25_results, dense_results])
# doc_1: 1/61 + 1/62 = 0.0327  ← highest, correctly fused`,
    pros: ["No training required", "Robust to score magnitude differences", "Works across heterogeneous retrievers"],
    cons: ["Ignores absolute scores", "Fixed k=60 may not suit all domains", "No diversity signal"],
    when: "Hybrid retrieval (BM25 + vector), combining multiple embedding models, multi-index search",
    complexity: "O(N × R) — N docs, R retrievers",
  },
  {
    id: "mmr",
    name: "Maximal Marginal Relevance",
    abbr: "MMR",
    tag: "DIVERSITY",
    tagColor: COLORS.accent4,
    summary:
      "Balances relevance and novelty. Iteratively selects documents that are relevant to the query but dissimilar to already-selected documents. Solves the redundancy problem in retrieval.",
    formula: `MMR(d) = argmax [ λ·sim(d, q) − (1−λ)·max sim(d, dᵢ) ]
                d∉S

λ ∈ [0, 1]  — diversity-relevance trade-off
sim(d, q)   — cosine similarity to query
sim(d, dᵢ) — max similarity to already selected docs S
λ=1 → pure relevance | λ=0 → pure diversity`,
    code: `import numpy as np

def mmr_select(query_emb, doc_embs, doc_ids, top_k=5, lambda_=0.7):
    selected, candidates = [], list(range(len(doc_ids)))
    
    # Relevance scores: cos similarity to query
    rel = np.dot(doc_embs, query_emb) / (
        np.linalg.norm(doc_embs, axis=1) * np.linalg.norm(query_emb) + 1e-9
    )
    
    while len(selected) < top_k and candidates:
        if not selected:
            # First pick: most relevant
            best = candidates[np.argmax([rel[i] for i in candidates])]
        else:
            sel_embs = doc_embs[selected]
            mmr_scores = []
            for i in candidates:
                redundancy = np.max(np.dot(sel_embs, doc_embs[i]) / (
                    np.linalg.norm(sel_embs, axis=1) * np.linalg.norm(doc_embs[i]) + 1e-9
                ))
                mmr_scores.append(lambda_ * rel[i] - (1 - lambda_) * redundancy)
            best = candidates[np.argmax(mmr_scores)]
        selected.append(best)
        candidates.remove(best)
    
    return [doc_ids[i] for i in selected]`,
    pros: ["Eliminates redundant results", "Tunable λ for relevance/diversity", "Improves LLM context quality"],
    cons: ["O(k × N) per query — slower", "Requires dense embeddings", "λ needs domain tuning"],
    when: "Multi-document QA, research summarization, context window packing, avoiding echo-chamber results",
    complexity: "O(k × N) — quadratic in top-k selection",
  },
  {
    id: "elbow",
    name: "Elbow Distance / Score Threshold",
    abbr: "ELBOW",
    tag: "CUTOFF",
    tagColor: COLORS.warn,
    summary:
      "Detects the natural 'knee' in the relevance score distribution to dynamically determine how many documents to include. Prevents including low-quality tail documents that hurt generation.",
    formula: `Δᵢ = score(i) - score(i+1)   for i = 1 to N-1

Elbow position = argmax(Δᵢ)

Adaptive variant:
  cutoff = first i where: score(i) < α × score(1)
  α ∈ [0.5, 0.8] — relative threshold

Gap ratio variant:
  cutoff = first i where: Δᵢ > β × mean(Δ)`,
    code: `import numpy as np

def elbow_cutoff(scores: list[float], method="gap_ratio", alpha=0.6, beta=2.0):
    scores = np.array(scores)
    n = len(scores)
    
    if method == "relative_threshold":
        # Cut where score drops below α × top score
        cutoff = np.argmax(scores < alpha * scores[0])
        return cutoff if cutoff > 0 else n
    
    elif method == "gap_ratio":
        # Cut at largest score gap relative to mean gap
        gaps = np.diff(scores) * -1  # negative diff = how much each drops
        if gaps.max() == 0:
            return n
        mean_gap = gaps.mean()
        large_gaps = np.where(gaps > beta * mean_gap)[0]
        return int(large_gaps[0]) + 1 if len(large_gaps) else n
    
    elif method == "kneedle":
        # Kneedle algorithm: normalize, find max distance from diagonal
        x = np.linspace(0, 1, n)
        y = (scores - scores.min()) / (scores.max() - scores.min() + 1e-9)
        distances = np.abs(y - x)  # distance from diagonal
        return int(np.argmax(distances)) + 1

# Example
scores = [0.92, 0.87, 0.83, 0.81, 0.52, 0.48, 0.31]
k = elbow_cutoff(scores, method="gap_ratio")
# Returns 4 — drops sharply after 0.81 → 0.52`,
    pros: ["Dynamic, query-adaptive cutoff", "Prevents context pollution", "Works on any scoring function"],
    cons: ["Sensitive to score scale", "Can be noisy with close scores", "Requires calibration per dataset"],
    when: "Filtering retrieval before reranking, dynamic top-k selection, preventing LLM distraction from low-quality docs",
    complexity: "O(N) — linear scan of score array",
  },
  {
    id: "cross_encoder",
    name: "Cross-Encoder Reranking",
    abbr: "CE",
    tag: "NEURAL",
    tagColor: "#a78bfa",
    summary:
      "Jointly encodes the query and each candidate document through a transformer to produce a relevance score. More accurate than bi-encoder retrieval because it sees full query-document interaction at the token level.",
    formula: `score(q, d) = CrossEncoder(concat([CLS], q, [SEP], d, [SEP]))[0]

Architecture: BERT/RoBERTa/DeBERTa fine-tuned on MS MARCO
Output: Single relevance probability via classification head
Input limit: 512 tokens (q + d combined)`,
    code: `from sentence_transformers import CrossEncoder

# Production-grade cross-encoder
model = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2",  # fast
    # "cross-encoder/ms-marco-electra-base",  # accurate
    max_length=512
)

def cross_encoder_rerank(query: str, docs: list[dict], top_k: int = 5):
    pairs = [(query, doc["content"]) for doc in docs]
    scores = model.predict(pairs, show_progress_bar=False)
    
    # Attach scores and sort
    for doc, score in zip(docs, scores):
        doc["rerank_score"] = float(score)
    
    reranked = sorted(docs, key=lambda x: x["rerank_score"], reverse=True)
    return reranked[:top_k]

# Production pattern: retrieve 50, rerank to top 5
candidates = vector_db.search(query, top_k=50)
final_docs  = cross_encoder_rerank(query, candidates, top_k=5)`,
    pros: ["Highest accuracy of all methods", "Captures fine-grained query-doc interaction", "SOTA on BEIR benchmark"],
    cons: ["O(N) inference — slow at scale", "High GPU cost", "Not suitable for real-time without caching"],
    when: "Final-stage reranking after fast retrieval, precision-critical use cases (legal, medical, finance)",
    complexity: "O(N × T²) — N docs × transformer attention",
  },
  {
    id: "cohere_rerank",
    name: "Managed Reranking APIs",
    abbr: "API",
    tag: "MANAGED",
    tagColor: COLORS.accent3,
    summary:
      "Production-ready reranking via Cohere Rerank, Azure AI Search Semantic Ranker, or Jina Reranker. Handles batching, model updates, and SLA guarantees. Recommended for enterprise RAG.",
    formula: `Cohere Rerank v3.5:
  POST /rerank → relevance_score ∈ [0, 1]
  Model: command-r-08-2024 (English + multilingual)
  Max: 1000 docs per call, up to 10K tokens per doc

Azure Semantic Ranker:
  BM25 → ML re-score → semantic re-score (3-stage)
  
Jina Reranker v2:
  8192 token context, multilingual, self-hostable`,
    code: `import cohere

co = cohere.Client(api_key="...")

def cohere_rerank(query: str, docs: list[str], top_k: int = 5):
    response = co.rerank(
        model="rerank-v3.5",
        query=query,
        documents=docs,
        top_n=top_k,
        return_documents=True
    )
    return [
        {"content": r.document.text, "score": r.relevance_score}
        for r in response.results
    ]

# Cost: ~$0.10 per 1K searches (1 search = reranking up to 100 docs)
# Latency: ~200-400ms for 50 docs
# Pattern: retrieve 100 → rerank to top 10 → generate`,
    pros: ["No infra to manage", "Continuously updated models", "Handles batching + rate limiting"],
    cons: ["Per-call cost", "Data leaves your boundary (check compliance)", "Vendor lock-in"],
    when: "Enterprise RAG without ML infra, multi-language corpora, speed-to-production priority",
    complexity: "Managed — internal model latency ~200-500ms",
  },
  {
    id: "llm_judge",
    name: "LLM-as-Judge Reranking",
    abbr: "LLM-J",
    tag: "GENERATIVE",
    tagColor: "#f97316",
    summary:
      "Uses an LLM to score or directly rank candidate documents by their relevance to a query. More expensive but catches semantic nuances missed by embedding models. Best used at the final stage.",
    formula: `Pointwise: P(relevant | q, d) — score each doc independently
Pairwise:  P(A > B | q) — compare doc pairs  
Listwise:  rank(D | q) — rank entire list at once

Pairwise is most robust; listwise is fastest for small N`,
    code: `async def llm_rerank_pairwise(query, docs, llm, top_k=5):
    """Tournament-style pairwise comparison via LLM."""
    import itertools
    scores = {i: 0 for i in range(len(docs))}
    
    prompt = """Query: {q}
Document A: {a}
Document B: {b}
Which document better answers the query? Reply with 'A' or 'B' only."""
    
    pairs = list(itertools.combinations(range(min(len(docs), 10)), 2))
    
    for i, j in pairs:
        response = await llm.ainvoke(
            prompt.format(q=query, a=docs[i][:500], b=docs[j][:500])
        )
        winner = response.content.strip()
        if winner == "A": scores[i] += 1
        elif winner == "B": scores[j] += 1
    
    ranked = sorted(scores, key=scores.get, reverse=True)
    return [docs[i] for i in ranked[:top_k]]

# Listwise (faster, single call):
# "Rank these {N} documents for query: {q}. Output ranked IDs only."`,
    pros: ["Captures complex semantic relevance", "No training data needed", "Handles nuanced queries"],
    cons: ["Expensive (N×N calls for pairwise)", "Non-deterministic", "High latency"],
    when: "Low-volume but high-stakes queries, evaluation pipelines, offline reranking for dataset creation",
    complexity: "O(N²) pairwise or O(N) listwise",
  },
  {
    id: "score_norm",
    name: "Score Normalization & Combination",
    abbr: "NORM",
    tag: "FUSION",
    tagColor: "#ec4899",
    summary:
      "Before fusing scores from multiple retrievers, scores must be normalized to a common scale. Min-max, Z-score, and softmax normalization each have different properties and failure modes.",
    formula: `Min-Max:    norm(s) = (s - s_min) / (s_max - s_min)
Z-score:    norm(s) = (s - μ) / σ
Softmax:    norm(s) = exp(s/τ) / Σ exp(sⱼ/τ)  — τ=temperature
CombSUM:    final(d) = Σ norm_i(score_i(d))
CombMNZ:    final(d) = h(d) × Σ norm_i(score_i(d))
            h(d) = # of lists where d appears (hit count boost)`,
    code: `import numpy as np
from scipy.special import softmax as scipy_softmax

def normalize_scores(scores: np.ndarray, method="minmax"):
    if method == "minmax":
        mn, mx = scores.min(), scores.max()
        return (scores - mn) / (mx - mn + 1e-9)
    
    elif method == "zscore":
        return (scores - scores.mean()) / (scores.std() + 1e-9)
    
    elif method == "softmax":
        return scipy_softmax(scores / 0.1)  # τ=0.1 for sharper peaks

def combmnz(results: list[dict], normalize="minmax") -> dict:
    """CombMNZ: appearance count × normalized score sum."""
    all_docs = set(d for r in results for d in r)
    combined = {}
    for doc in all_docs:
        hit_count = sum(1 for r in results if doc in r)
        score_sum = sum(r.get(doc, 0) for r in results)
        combined[doc] = hit_count * score_sum  # CombMNZ
    return dict(sorted(combined.items(), key=lambda x: x[1], reverse=True))`,
    pros: ["Enables principled score fusion", "CombMNZ rewards appearing in multiple lists", "Simple to implement"],
    cons: ["Min-max sensitive to outliers", "Z-score loses relative score meaning", "Requires consistent scoring scale"],
    when: "Any multi-retriever system before applying RRF or cross-encoder",
    complexity: "O(N × R) — linear in docs and retrievers",
  },
  {
    id: "learned_sparse",
    name: "Learned Sparse Reranking (SPLADE)",
    abbr: "SPLADE",
    tag: "HYBRID",
    tagColor: "#8b5cf6",
    summary:
      "SPLADE (Sparse Lexical and Expansion model) learns sparse token-level representations via BERT. Combines BM25-style interpretability with neural semantic understanding. Excellent for hybrid retrieval.",
    formula: `w(t, d) = Σ log(1 + ReLU(h_j · E_t)) over tokens j
             
Expansion: query 'car' → activates 'vehicle', 'automobile', 'motor'
Regularizer: FLOPS = Σ mean(ReLU(w_t)) → sparse representations
Final score: BM25-style dot product over sparse vectors`,
    code: `from transformers import AutoModelForMaskedLM, AutoTokenizer
import torch

class SPLADEEncoder:
    def __init__(self, model_name="naver/splade-cocondenser-ensembledistil"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForMaskedLM.from_pretrained(model_name)
    
    @torch.no_grad()
    def encode(self, text: str) -> dict:
        tokens = self.tokenizer(text, return_tensors="pt",
                                max_length=512, truncation=True)
        output = self.model(**tokens)
        # Aggregate over tokens, apply log(1+ReLU)
        logits = output.logits[0]  # [seq_len, vocab]
        weights = torch.log(1 + torch.relu(logits)).max(dim=0).values
        # Return sparse representation as {token: weight}
        nonzero = weights.nonzero().squeeze(-1)
        return {
            self.tokenizer.convert_ids_to_tokens(int(i)): float(weights[i])
            for i in nonzero if float(weights[i]) > 0.01
        }

encoder = SPLADEEncoder()
q_sparse = encoder.encode("neural information retrieval")
# → {'information': 2.3, 'retrieval': 2.1, 'neural': 1.8, 'search': 1.4, ...}`,
    pros: ["Interpretable sparse vectors", "Better OOD generalization than BM25", "Excellent in hybrid setups"],
    cons: ["Requires inverted index infrastructure", "Slower than BM25 for indexing", "Model fine-tuning complex"],
    when: "When BM25 + dense hybrid isn't enough, enterprise search with interpretability requirements",
    complexity: "O(D × V) per document — V = vocab size",
  },
];

const enterpriseSections = [
  {
    id: "arch",
    title: "🏗️ Production Architecture Layers",
    color: COLORS.accent1,
    content: {
      type: "layers",
      layers: [
        { name: "L1 — Gateway & Auth", desc: "Rate limiting, JWT/OIDC, tenant routing, API versioning, PII redaction at ingress", color: "#285BC5", pct: 100 },
        { name: "L2 — Orchestration", desc: "LangGraph / Haystack pipeline DAG, query understanding, intent classification, query rewriting, HyDE", color: "#4C12A1", pct: 90 },
        { name: "L3 — Retrieval Engine", desc: "Hybrid retrieval (BM25 + dense + SPLADE), multi-index routing, metadata filtering, query expansion", color: "#06b6d4", pct: 80 },
        { name: "L4 — Reranking Layer", desc: "RRF fusion → Cross-encoder → MMR diversity filter → Elbow cutoff → top-k selection", color: "#10b981", pct: 70 },
        { name: "L5 — Generation", desc: "Context assembly, prompt templating, LLM call with fallback chain, citation extraction", color: "#f59e0b", pct: 60 },
        { name: "L6 — Quality Gates", desc: "Faithfulness check, hallucination detector, output guardrails, confidence scoring", color: "#ef4444", pct: 50 },
        { name: "L7 — Observability", desc: "Trace logging (LangSmith/Phoenix), latency P95/P99, cost-per-query, eval triggers", color: "#ec4899", pct: 40 },
      ],
    },
  },
  {
    id: "retrieval_pipeline",
    title: "🔍 Enterprise Retrieval Pipeline Design",
    color: COLORS.accent3,
    content: {
      type: "steps",
      steps: [
        {
          title: "Query Understanding",
          detail: "Classify intent (factual / analytical / comparative). Apply HyDE (Hypothetical Document Embeddings) for abstract queries. Rewrite ambiguous queries. Detect language and route to appropriate index.",
        },
        {
          title: "Multi-Stage Retrieval",
          detail: "Stage 1 (recall): BM25 → top-100. Stage 2 (recall): Dense embeddings → top-100. Stage 3 (precision): SPLADE sparse → top-50. Merge with RRF. Total candidate pool: 150-250 docs.",
        },
        {
          title: "Metadata Pre-filtering",
          detail: "Apply structured filters BEFORE vector search: date range, department, document type, clearance level. Use Qdrant payload filters or Weaviate where clauses. Reduces search space and improves precision.",
        },
        {
          title: "Cross-Encoder Reranking",
          detail: "Apply CE reranker to top-50 candidates → score + sort. Use ms-marco-MiniLM-L-6 for speed, electra-base for accuracy. Budget: <200ms P95. Self-host on GPU or use Cohere Rerank API.",
        },
        {
          title: "MMR Diversity Pass",
          detail: "Apply MMR (λ=0.7) to reranked results to eliminate near-duplicate chunks. Critical for multi-document corpora where the same fact appears in many documents.",
        },
        {
          title: "Elbow Cutoff",
          detail: "Apply elbow/gap-ratio detection on final reranked scores. Drop documents below the natural score break. Prevents context contamination. Typically reduces from top-10 to 4-7 docs.",
        },
        {
          title: "Context Assembly",
          detail: "Pack remaining docs into context window respecting token budget. Add source metadata, chunk IDs for citation. Apply sentence-level compression if still over budget.",
        },
      ],
    },
  },
  {
    id: "eval",
    title: "📊 Evaluation Framework",
    color: COLORS.accent4,
    content: {
      type: "table",
      headers: ["Metric", "Tool", "Measures", "Target", "Hard-fail Threshold"],
      rows: [
        ["Faithfulness", "RAGAS / DeepEval", "Answer grounded in retrieved context", ">0.85", "<0.70"],
        ["Answer Relevancy", "RAGAS", "Answer relevant to the question", ">0.80", "<0.65"],
        ["Context Precision", "RAGAS", "Retrieved docs actually useful", ">0.75", "<0.60"],
        ["Context Recall", "RAGAS", "All relevant info retrieved", ">0.70", "<0.55"],
        ["Hallucination Rate", "LLM-as-Judge", "Ungrounded claims in output", "<5%", ">15%"],
        ["Retrieval MRR@10", "Custom eval", "Ranking quality", ">0.75", "<0.55"],
        ["Latency P95", "OpenTelemetry", "End-to-end response time", "<3s", ">8s"],
        ["Token Cost/Query", "Usage API", "Input+output tokens × price", "<$0.05", ">$0.20"],
        ["Toxicity", "Detoxify / Azure", "Harmful output", "<0.01", ">0.05"],
        ["Groundedness", "Azure AI Eval", "Claims tied to sources", ">0.90", "<0.75"],
      ],
    },
  },
  {
    id: "observability",
    title: "🔭 Observability Stack",
    color: "#8b5cf6",
    content: {
      type: "grid3",
      items: [
        {
          name: "Tracing",
          tools: "LangSmith, Arize Phoenix, Langfuse",
          detail: "Instrument every pipeline node with spans. Capture: query, retrieved docs, reranked docs, prompt, response, scores, latency. Use W3C trace context for distributed tracing across microservices.",
          color: "#8b5cf6",
        },
        {
          name: "Metrics",
          tools: "Prometheus + Grafana / Azure Monitor",
          detail: "Track: requests/sec, P50/P95/P99 latency, retrieval recall@k, reranking score distribution, LLM error rates, token throughput, cache hit rate. Alert on SLA breaches.",
          color: COLORS.accent1,
        },
        {
          name: "Evaluation Pipeline",
          tools: "DeepEval, RAGAS, Pytest",
          detail: "Run automated eval on golden dataset after every deployment. Compare against baseline. Hard-fail CI if faithfulness drops >5% or hallucination rate rises >2%. Weekly drift monitoring.",
          color: COLORS.accent4,
        },
        {
          name: "Log Aggregation",
          tools: "ELK Stack / Azure Log Analytics",
          detail: "Structured JSON logs with: trace_id, user_id (anonymized), query_hash, doc_ids retrieved, reranked, final_scores, generation_tokens. Enable full query reconstruction for debugging.",
          color: COLORS.accent3,
        },
        {
          name: "Cost Monitoring",
          tools: "Custom FinOps Dashboard",
          detail: "Per-query cost breakdown: embedding calls, reranker calls, LLM input tokens, LLM output tokens, vector DB RUs. Alert when cost-per-query exceeds budget. Identify expensive query patterns.",
          color: COLORS.warn,
        },
        {
          name: "Drift Detection",
          tools: "Evidently AI / WhyLabs",
          detail: "Monitor: embedding distribution shift, retrieval score drift, answer quality trend, user feedback signals. Trigger reindexing or model refresh when drift exceeds threshold.",
          color: "#ec4899",
        },
      ],
    },
  },
  {
    id: "security",
    title: "🔐 Security & Compliance",
    color: COLORS.danger,
    content: {
      type: "checklist",
      categories: [
        {
          name: "Data Governance",
          items: [
            "Implement document-level ACL in vector store (Qdrant payload, Weaviate RBAC)",
            "PII redaction before embedding (Presidio / Azure Purview)",
            "Tenant isolation: separate vector namespaces per org unit",
            "Document retention policies: TTL on vector embeddings",
            "Audit log every retrieval and generation call",
          ],
        },
        {
          name: "Prompt Security",
          items: [
            "Prompt injection detection on user input (Lakera Guard / Rebuff)",
            "Input validation: max query length, character allowlist",
            "Output filtering: block PII in generated responses",
            "Jailbreak detection: constitutional AI guardrail layer",
            "Rate limiting: per-user and per-tenant quotas",
          ],
        },
        {
          name: "Model & Infra",
          items: [
            "Private endpoints for LLM APIs (no public internet routing)",
            "Encryption at rest for vector store and document store",
            "VNet isolation for embedding and reranking model services",
            "Secrets management: Azure Key Vault / AWS Secrets Manager",
            "Model versioning and rollback capability",
          ],
        },
        {
          name: "Compliance",
          items: [
            "GDPR: right to erasure — implement delete-by-user-id in vector store",
            "SOC2 Type II: evidence collection for all AI system controls",
            "HIPAA: de-identification pipeline before RAG ingestion",
            "Data residency: region-locked vector stores and LLM endpoints",
            "AI Act (EU): human-in-the-loop for high-risk use cases",
          ],
        },
      ],
    },
  },
  {
    id: "cost",
    title: "💰 Cost Optimization Strategies",
    color: COLORS.warn,
    content: {
      type: "cost",
      strategies: [
        {
          name: "Semantic Caching",
          saving: "40-70%",
          detail: "Cache embeddings and responses for semantically similar queries. Use GPTCache or Redis with cosine similarity lookup. Set TTL based on document freshness requirements.",
          color: COLORS.accent4,
        },
        {
          name: "Model Routing / Cascade",
          saving: "30-50%",
          detail: "Route simple factual queries to smaller models (GPT-4o-mini / Haiku). Use large models only for complex reasoning. Confidence-based escalation: low confidence → upgrade model.",
          color: COLORS.accent1,
        },
        {
          name: "Prompt Caching",
          saving: "50-90% on system prompt",
          detail: "Use Anthropic/OpenAI prompt caching for static system prompts and retrieved context. Cache shared context across multi-turn conversations. Saves up to 90% on cached token costs.",
          color: "#8b5cf6",
        },
        {
          name: "Retrieval Budget Control",
          saving: "20-40%",
          detail: "Dynamic top-k based on query complexity (3 docs for simple, 10 for complex). Use Elbow cutoff to avoid sending unnecessary context. Sentence compression before context assembly.",
          color: COLORS.accent3,
        },
        {
          name: "Embedding Batching",
          saving: "60% on embedding cost",
          detail: "Batch offline document embedding jobs. Use async bulk ingestion. Cache query embeddings for common search patterns. Use smaller embedding models for indexing (text-embedding-3-small).",
          color: "#ec4899",
        },
        {
          name: "Tiered Storage",
          saving: "30-60% on storage",
          detail: "Hot tier: frequently accessed docs in full vector store. Warm tier: less-accessed docs with compressed embeddings. Cold tier: archive with keyword-only BM25. Access pattern-based promotion.",
          color: COLORS.warn,
        },
      ],
    },
  },
  {
    id: "ingestion",
    title: "📥 Document Ingestion Pipeline",
    color: COLORS.accent3,
    content: {
      type: "steps",
      steps: [
        {
          title: "Document Parsing & Extraction",
          detail: "Use Unstructured.io or Azure Document Intelligence for PDFs, DOCX, HTML, PPTX. Extract text with layout awareness (tables, headers, lists preserved). Extract images with alt-text via vision models.",
        },
        {
          title: "Chunking Strategy (Hierarchical)",
          detail: "Parent-child chunking: large parent chunks (1024 tokens) for context + small child chunks (256 tokens) for retrieval precision. Semantic chunking: split at sentence boundaries, not fixed tokens. Preserve document structure (section headers as metadata).",
        },
        {
          title: "Metadata Enrichment",
          detail: "Auto-extract: document_id, source_url, created_date, modified_date, author, department, document_type. LLM-generated metadata: summary, topics, entities, access_level. All searchable as filters.",
        },
        {
          title: "Embedding Generation",
          detail: "Multi-model: text-embedding-3-large for semantic, BM25 for keyword, SPLADE for sparse. Batch size optimization (512 docs/call). Store multiple embedding types per chunk. Version embeddings with model ID.",
        },
        {
          title: "Index Management",
          detail: "Separate indices by: domain (HR, Legal, Engineering), recency (hot/warm/cold), language, access tier. HNSW index parameters: ef_construction=200, m=16 for recall/speed balance. Rebuild index on model upgrade.",
        },
        {
          title: "Incremental Update & Versioning",
          detail: "Content-hash deduplication: skip unchanged documents. Soft delete + re-embed for updated docs. Change data capture (CDC) from source systems. Track chunk lineage for debugging retrieval failures.",
        },
      ],
    },
  },
  {
    id: "deployment",
    title: "🚀 Deployment & Scaling Patterns",
    color: "#ec4899",
    content: {
      type: "grid3",
      items: [
        {
          name: "Stateless API Design",
          tools: "FastAPI / Azure API Management",
          detail: "Every pipeline call must be stateless. Pass full conversation context in request. Use Redis for session state if multi-turn is required. Enables horizontal scaling without sticky sessions.",
          color: "#ec4899",
        },
        {
          name: "Async Pipeline Execution",
          tools: "Celery / Azure Service Bus",
          detail: "Long-running tasks (document ingestion, batch eval) go to message queue. Real-time queries use async FastAPI with connection pooling. Streaming responses via SSE for better UX.",
          color: COLORS.accent1,
        },
        {
          name: "Circuit Breakers",
          tools: "Resilience4j / Polly",
          detail: "Wrap LLM calls with circuit breaker: fail-fast after 3 timeouts, 30s recovery window. Fallback chain: primary LLM → cheaper LLM → cached response → graceful degradation message.",
          color: COLORS.danger,
        },
        {
          name: "Container & Orchestration",
          tools: "Docker + Kubernetes / AKS",
          detail: "GPU nodes for embedding/reranking models. HPA on CPU/request rate for API pods. Resource limits: 4 vCPU, 8GB RAM per API pod. GPU: 1x A10G per reranker instance. Use spot instances for ingestion jobs.",
          color: COLORS.accent4,
        },
        {
          name: "Blue-Green Deployment",
          tools: "Argo Rollouts / Azure Deployment Slots",
          detail: "Deploy new pipeline version alongside old. Shadow mode: run both, compare outputs, promote if eval metrics pass. Rollback in <60s. Canary: 5% → 20% → 100% traffic shift with automated checks.",
          color: COLORS.accent3,
        },
        {
          name: "Multi-Region Strategy",
          tools: "Azure Front Door / AWS Global Accelerator",
          detail: "Active-active for low latency (<100ms). Vector stores replicated across regions (read replicas). LLM endpoint routing: nearest region with capacity. Geo-fenced for data residency compliance.",
          color: "#8b5cf6",
        },
      ],
    },
  },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Tag({ label, color }) {
  return <span style={styles.cardTag(color)}>{label}</span>;
}

function StrategyCard({ s }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ ...styles.card, borderColor: expanded ? s.tagColor + "55" : COLORS.border }}>
      <div style={styles.cardTitle}>
        <span style={{ fontFamily: "monospace", fontSize: "13px", color: s.tagColor }}>{s.abbr}</span>
        {s.name}
        <Tag label={s.tag} color={s.tagColor} />
      </div>
      <p style={styles.cardBody}>{s.summary}</p>
      <div style={styles.formula}>
        <div style={{ fontSize: "9px", color: COLORS.muted, marginBottom: "6px", letterSpacing: "1px" }}>FORMULA / ALGORITHM</div>
        {s.formula}
      </div>
      {expanded && (
        <>
          <div style={styles.code}>{s.code}</div>
          <div style={styles.procon}>
            <div style={styles.pro}>
              <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "10px", letterSpacing: "1px" }}>✅ PROS</div>
              {s.pros.map((p, i) => <div key={i}>• {p}</div>)}
            </div>
            <div style={styles.con}>
              <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "10px", letterSpacing: "1px" }}>⚠️ CONS</div>
              {s.cons.map((c, i) => <div key={i}>• {c}</div>)}
            </div>
          </div>
          <div style={{ ...styles.alertBox(s.tagColor), marginTop: "10px" }}>
            <strong>When to use:</strong> {s.when}<br />
            <strong>Complexity:</strong> {s.complexity}
          </div>
        </>
      )}
      <button style={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
        {expanded ? "▲ Collapse" : "▼ Show Code & Details"}
      </button>
    </div>
  );
}

function LayerViz({ layers }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {layers.map((l, i) => (
        <div key={i} style={{ ...styles.card, padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: l.color }}>{l.name}</div>
            <span style={{ fontSize: "10px", color: COLORS.muted }}>Layer {i + 1}</span>
          </div>
          <div style={styles.layerBar(l.color, l.pct)} />
          <div style={{ color: COLORS.subtle, fontSize: "11px", marginTop: "6px", lineHeight: "1.6" }}>{l.desc}</div>
        </div>
      ))}
    </div>
  );
}

function StepsViz({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={styles.stepRow}>
          <div style={styles.stepNum}>{i + 1}</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>{s.title}</div>
            <div style={{ color: COLORS.subtle, fontSize: "12px", lineHeight: "1.7" }}>{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Grid3({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ ...styles.card, borderLeft: `3px solid ${item.color}` }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: item.color, marginBottom: "3px" }}>{item.name}</div>
          <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "8px", letterSpacing: "0.5px" }}>{item.tools}</div>
          <div style={{ fontSize: "12px", color: COLORS.subtle, lineHeight: "1.7" }}>{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function TableViz({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? `${COLORS.accent1}08` : "transparent" }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  ...styles.td,
                  color: j === 0 ? "#fff" : j === 3 ? COLORS.accent4 : j === 4 ? "#fca5a5" : COLORS.subtle,
                  fontWeight: j === 0 ? "600" : "400",
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChecklistViz({ categories }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
      {categories.map((cat, i) => (
        <div key={i} style={styles.card}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "10px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "8px" }}>
            {cat.name}
          </div>
          {cat.items.map((item, j) => (
            <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "12px", color: COLORS.subtle, lineHeight: "1.5" }}>
              <span style={{ color: COLORS.accent4, flexShrink: 0, marginTop: "1px" }}>◆</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CostViz({ strategies }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
      {strategies.map((s, i) => (
        <div key={i} style={{ ...styles.card, borderTop: `3px solid ${s.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{s.name}</div>
            <div style={{ ...styles.cardTag(s.color), fontSize: "11px", padding: "3px 10px" }}>
              {s.saving}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: COLORS.subtle, lineHeight: "1.7" }}>{s.detail}</div>
        </div>
      ))}
    </div>
  );
}

function EnterpriseSectionRenderer({ section }) {
  const c = section.content;
  if (c.type === "layers") return <LayerViz layers={c.layers} />;
  if (c.type === "steps") return <StepsViz steps={c.steps} />;
  if (c.type === "table") return <TableViz headers={c.headers} rows={c.rows} />;
  if (c.type === "grid3") return <Grid3 items={c.items} />;
  if (c.type === "checklist") return <ChecklistViz categories={c.categories} />;
  if (c.type === "cost") return <CostViz strategies={c.strategies} />;
  return null;
}

function DecisionMatrix() {
  const matrix = [
    { scenario: "Hybrid retrieval (BM25 + dense)", rec: "RRF", why: "No score alignment needed; purely rank-based fusion", color: COLORS.accent1 },
    { scenario: "Multi-document QA with redundancy risk", rec: "MMR", why: "Ensures diverse, non-redundant context coverage", color: COLORS.accent4 },
    { scenario: "Unknown quality of top-K results", rec: "Elbow Cutoff", why: "Dynamic filtering prevents context contamination", color: COLORS.warn },
    { scenario: "Precision-critical (legal, medical)", rec: "Cross-Encoder", why: "Highest accuracy; sees full query-doc interaction", color: "#a78bfa" },
    { scenario: "Multilingual enterprise corpus", rec: "Cohere Rerank API", why: "Native multilingual support, managed SLA", color: COLORS.accent3 },
    { scenario: "Score fusion across heterogeneous systems", rec: "CombMNZ + Norm", why: "Rewards appearing in multiple retrieval results", color: "#ec4899" },
    { scenario: "Low-volume but high-stakes queries", rec: "LLM-as-Judge", why: "Captures nuance no embedding model handles", color: "#f97316" },
    { scenario: "Production hybrid (best overall)", rec: "RRF → CE → MMR → Elbow", why: "Pipeline: recall → precision → diversity → cutoff", color: "#285BC5" },
  ];

  return (
    <div>
      <div style={{ ...styles.alertBox(COLORS.accent1), marginBottom: "16px" }}>
        <strong>Golden Rule:</strong> Reranking is always a pipeline, not a single step.
        Use fast methods for recall (RRF), accurate methods for precision (CE), diversity methods for quality (MMR), and threshold methods for noise control (Elbow).
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {matrix.map((m, i) => (
          <div key={i} style={{ ...styles.card, padding: "12px 16px", display: "flex", gap: "16px", alignItems: "flex-start", borderLeft: `3px solid ${m.color}` }}>
            <div style={{ flex: 2, fontSize: "12px", color: COLORS.subtle }}>{m.scenario}</div>
            <div style={{ flex: 1, fontSize: "12px", fontWeight: "700", color: m.color }}>{m.rec}</div>
            <div style={{ flex: 2, fontSize: "11px", color: COLORS.muted }}>{m.why}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "strategies", label: "Reranking Strategies" },
  { id: "decision", label: "Decision Matrix" },
  { id: "pipeline", label: "Pipeline Flow" },
  { id: "enterprise", label: "Enterprise Production Guide" },
];

export default function App() {
  const [tab, setTab] = useState("strategies");
  const [entSection, setEntSection] = useState("arch");

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.badge}>RAG ENGINEERING GUIDE</div>
        <h1 style={styles.title}>Reranking Strategies & Enterprise RAG Productionalization</h1>
        <p style={styles.subtitle}>
          A practitioner's reference — from RRF/MMR/Elbow theory to enterprise-grade production deployment
        </p>
      </div>

      <div style={styles.nav}>
        {TABS.map((t) => (
          <button key={t.id} style={styles.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {/* ─── RERANKING STRATEGIES ─── */}
        {tab === "strategies" && (
          <div>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span style={{ color: COLORS.accent3 }}>⬡</span>
                8 Core Reranking Strategies
              </div>
              <p style={styles.sectionDesc}>
                Reranking is the precision layer in RAG. Initial retrieval maximizes recall; reranking maximizes precision.
                Each strategy addresses a different failure mode — understand when to apply each.
              </p>
              <div style={styles.grid}>
                {rerankingStrategies.map((s) => (
                  <StrategyCard key={s.id} s={s} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── DECISION MATRIX ─── */}
        {tab === "decision" && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={{ color: COLORS.warn }}>⬡</span>
              When to Use Which Strategy
            </div>
            <p style={styles.sectionDesc}>
              Choose reranking strategies based on your use case, scale, and latency budget. Most production systems use a pipeline of 2-4 strategies.
            </p>
            <DecisionMatrix />
          </div>
        )}

        {/* ─── PIPELINE FLOW ─── */}
        {tab === "pipeline" && (
          <div>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span style={{ color: COLORS.accent4 }}>⬡</span>
                The Complete Reranking Pipeline
              </div>
              <p style={styles.sectionDesc}>
                Production RAG doesn't use a single reranker. It chains methods to achieve the right recall-precision-diversity balance at each stage.
              </p>
              <div style={styles.card}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { label: "User Query", detail: "Raw query input", icon: "→", color: COLORS.muted },
                    { label: "Query Understanding", detail: "Intent classification, HyDE, query rewriting", icon: "↓", color: COLORS.accent3 },
                    { label: "Stage 1 — Recall", detail: "BM25 (top-100) + Dense (top-100) + SPLADE (top-50) → 150-250 candidates", icon: "↓", color: COLORS.accent1 },
                    { label: "Stage 2 — RRF Fusion", detail: "Reciprocal Rank Fusion merges all retrieval lists → top-50", icon: "↓", color: COLORS.accent1 },
                    { label: "Stage 3 — Score Normalization", detail: "Min-max normalize scores across retrievers. Apply CombMNZ.", icon: "↓", color: "#ec4899" },
                    { label: "Stage 4 — Cross-Encoder", detail: "CE reranker scores top-50 → sorts by true relevance → top-20", icon: "↓", color: "#a78bfa" },
                    { label: "Stage 5 — MMR Diversity", detail: "λ=0.7, filter near-duplicates → top-10 diverse results", icon: "↓", color: COLORS.accent4 },
                    { label: "Stage 6 — Elbow Cutoff", detail: "Gap-ratio detection → dynamic top-k (typically 4-7 docs)", icon: "↓", color: COLORS.warn },
                    { label: "Context Assembly + Generation", detail: "Token-budget packing → prompt → LLM → response with citations", icon: "↓", color: COLORS.muted },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "12px 4px", borderBottom: i < 8 ? `1px dashed ${COLORS.border}` : "none" }}>
                      <div style={{ width: "30px", textAlign: "center", fontSize: "18px", color: step.color }}>{step.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: step.color }}>{step.label}</div>
                        <div style={{ fontSize: "11px", color: COLORS.muted, marginTop: "2px" }}>{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <div style={styles.sectionTitle}>
                  <span style={{ color: "#ec4899" }}>⬡</span> Latency Budget Breakdown
                </div>
                <div style={{ ...styles.card, marginTop: "12px" }}>
                  {[
                    { stage: "Query embedding", budget: "20-40ms", model: "text-embedding-3-small" },
                    { stage: "BM25 retrieval", budget: "5-15ms", model: "Elasticsearch / OpenSearch" },
                    { stage: "Dense vector search", budget: "10-30ms", model: "Qdrant HNSW" },
                    { stage: "RRF fusion", budget: "<1ms", model: "In-memory" },
                    { stage: "Cross-encoder reranking (50 docs)", budget: "80-200ms", model: "MiniLM-L-6 on GPU" },
                    { stage: "MMR + Elbow cutoff", budget: "5-15ms", model: "In-memory numpy" },
                    { stage: "LLM generation (streaming)", budget: "500-2000ms", model: "GPT-4o / Claude Sonnet" },
                    { stage: "Total P95 budget", budget: "< 3000ms", model: "Target SLA", bold: true },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "9px 0",
                      borderBottom: i < 7 ? `1px solid ${COLORS.border}` : "none",
                      fontWeight: row.bold ? "700" : "400",
                      borderTop: row.bold ? `1px solid ${COLORS.accent4}44` : "none",
                    }}>
                      <span style={{ fontSize: "12px", color: row.bold ? "#fff" : COLORS.subtle }}>{row.stage}</span>
                      <span style={{ fontSize: "12px", color: row.bold ? COLORS.accent4 : COLORS.warn, fontFamily: "monospace" }}>{row.budget}</span>
                      <span style={{ fontSize: "11px", color: COLORS.muted, width: "200px", textAlign: "right" }}>{row.model}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── ENTERPRISE GUIDE ─── */}
        {tab === "enterprise" && (
          <div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
              {enterpriseSections.map((s) => (
                <button
                  key={s.id}
                  style={{
                    ...styles.navBtn(entSection === s.id),
                    borderColor: entSection === s.id ? s.color : COLORS.border,
                    color: entSection === s.id ? s.color : COLORS.muted,
                    background: entSection === s.id ? `${s.color}18` : "transparent",
                  }}
                  onClick={() => setEntSection(s.id)}
                >
                  {s.title.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            {enterpriseSections.filter((s) => s.id === entSection).map((section) => (
              <div key={section.id} style={styles.section}>
                <div style={styles.sectionTitle}>
                  <span style={{ color: section.color }}>⬡</span>
                  {section.title}
                </div>
                <hr style={{ ...styles.divider, marginTop: "12px", marginBottom: "20px" }} />
                <EnterpriseSectionRenderer section={section} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "48px", padding: "20px", borderTop: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: "11px", textAlign: "center", letterSpacing: "0.5px" }}>
          RAG Engineering Guide · Reranking Strategies + Enterprise Productionalization · Built for SDLC Copilot & Enterprise AI Systems
        </div>
      </div>
    </div>
  );
}
