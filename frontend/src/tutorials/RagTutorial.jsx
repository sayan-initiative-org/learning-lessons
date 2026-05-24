// RagTutorial.jsx
// A comprehensive, interactive tutorial on Retrieval-Augmented Generation.
// Aesthetic: Editorial technical journal — warm near-black, cream, amber/terracotta accents.
// Drop into any React 18+ project. Single-file, no external UI deps required.
// Tailwind core utilities are used for layout; custom CSS is injected for typography & theming.

import React, { useState, useMemo, useEffect } from "react";

// ───────────────────────────────────────────────────────────────────────────────
// Theme tokens
// ───────────────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0d0d0f",
  bgPanel:   "#15151a",
  bgSunken:  "#0a0a0c",
  border:    "#26262c",
  borderHi:  "#3a3a42",
  text:      "#f0ebe1",
  textMute:  "#8a857c",
  textDim:   "#5c5a55",
  gold:      "#d4a64a",
  terra:     "#c87553",
  sage:      "#7a9966",
  rust:      "#a85544",
  ink:       "#1a1a1f",
};

// ───────────────────────────────────────────────────────────────────────────────
// Global styles (fonts + base)
// ───────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .rag-root {
      font-family: 'Geist', system-ui, sans-serif;
      background: ${T.bg};
      color: ${T.text};
      font-feature-settings: "ss01", "cv11";
      letter-spacing: -0.005em;
    }
    .rag-root *::selection { background: ${T.gold}; color: ${T.bg}; }
    .display { font-family: 'Fraunces', serif; font-optical-sizing: auto;
               font-variation-settings: "opsz" 96, "SOFT" 50; letter-spacing: -0.03em; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .grain::before {
      content:""; position:absolute; inset:0; pointer-events:none; opacity:.04;
      background-image: radial-gradient(${T.text} 1px, transparent 1px);
      background-size: 3px 3px; mix-blend-mode: overlay;
    }
    .hairline { border-top: 1px solid ${T.border}; }
    .ring-gold:focus { outline: 1px solid ${T.gold}; outline-offset: 2px; }

    .nav-link {
      display:block; padding: 7px 14px; font-size: 13px; color:${T.textMute};
      border-left: 1px solid transparent; cursor:pointer; transition: all .15s;
      letter-spacing: 0.02em;
    }
    .nav-link:hover { color: ${T.text}; }
    .nav-link.active { color: ${T.gold}; border-left-color: ${T.gold}; background: ${T.ink}; }
    .nav-section { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
                   color:${T.textDim}; padding: 18px 14px 6px; }

    .prose p { line-height: 1.75; color: ${T.text}; opacity: .92; font-size: 15px; margin: 14px 0; }
    .prose strong { color: ${T.gold}; font-weight: 500; }
    .prose em { color: ${T.terra}; font-style: italic; }
    .prose code { font-family: 'JetBrains Mono', monospace; font-size: 13px;
                  background: ${T.ink}; padding: 1px 6px; border-radius: 3px;
                  color: ${T.sage}; border: 1px solid ${T.border}; }
    .prose ul { margin: 12px 0; padding-left: 0; list-style: none; }
    .prose li { padding: 5px 0 5px 22px; position: relative; line-height: 1.7;
                color: ${T.text}; opacity: .9; font-size: 15px; }
    .prose li::before { content: "→"; position: absolute; left: 0; color: ${T.gold}; }

    .h-eyebrow { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
                 color: ${T.terra}; margin-bottom: 10px; font-weight: 500; }
    .h1 { font-family: 'Fraunces', serif; font-size: 56px; line-height: 1; letter-spacing: -0.04em;
          font-weight: 400; font-variation-settings: "opsz" 144; }
    .h2 { font-family: 'Fraunces', serif; font-size: 38px; line-height: 1.05; letter-spacing: -0.03em;
          font-weight: 400; font-variation-settings: "opsz" 96; margin-bottom: 8px; }
    .h3 { font-family: 'Fraunces', serif; font-size: 24px; line-height: 1.2; letter-spacing: -0.02em;
          font-weight: 500; font-variation-settings: "opsz" 36; }
    .h4 { font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;
          color: ${T.text}; font-weight: 600; }

    .card { background: ${T.bgPanel}; border: 1px solid ${T.border}; border-radius: 4px;
            padding: 22px; transition: border-color .2s; }
    .card:hover { border-color: ${T.borderHi}; }
    .card-flat { background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px; padding: 18px; }

    .codeblock {
      background: ${T.bgSunken}; border: 1px solid ${T.border}; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6;
      overflow-x: auto; position: relative;
    }
    .codeblock-header {
      display:flex; justify-content:space-between; align-items:center;
      padding: 8px 14px; border-bottom: 1px solid ${T.border};
      font-size: 11px; color: ${T.textMute}; letter-spacing: 0.06em; text-transform: uppercase;
    }
    .codeblock pre { padding: 14px 18px; margin: 0; }

    .tok-kw { color: ${T.terra}; }
    .tok-fn { color: ${T.gold}; }
    .tok-str { color: ${T.sage}; }
    .tok-com { color: ${T.textDim}; font-style: italic; }
    .tok-num { color: ${T.rust}; }
    .tok-cls { color: #c8aa6b; }

    .pill { display: inline-block; padding: 3px 9px; font-size: 11px; letter-spacing: 0.05em;
            border: 1px solid ${T.border}; border-radius: 999px; color: ${T.textMute};
            font-family: 'JetBrains Mono', monospace; }
    .pill-gold { color: ${T.gold}; border-color: ${T.gold}55; background: ${T.gold}10; }
    .pill-terra { color: ${T.terra}; border-color: ${T.terra}55; background: ${T.terra}10; }
    .pill-sage { color: ${T.sage}; border-color: ${T.sage}55; background: ${T.sage}10; }

    .tab-btn { padding: 8px 14px; font-size: 13px; color: ${T.textMute};
               border-bottom: 1px solid transparent; cursor: pointer; transition: all .15s;
               background: none; border-radius: 0; letter-spacing: 0.02em; }
    .tab-btn:hover { color: ${T.text}; }
    .tab-btn.active { color: ${T.gold}; border-bottom-color: ${T.gold}; }

    table.compare { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.compare th, table.compare td {
      padding: 12px 14px; text-align: left; border-bottom: 1px solid ${T.border};
      vertical-align: top;
    }
    table.compare th { color: ${T.textMute}; font-weight: 500; font-size: 11px;
                       letter-spacing: 0.1em; text-transform: uppercase;
                       border-bottom-color: ${T.borderHi}; }
    table.compare td { color: ${T.text}; opacity: .9; }
    table.compare tr:hover td { background: ${T.bgPanel}40; }

    .anim-fade { animation: fadeIn .35s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

    .scroll-hide::-webkit-scrollbar { width: 6px; }
    .scroll-hide::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

    input[type=range].slider {
      -webkit-appearance: none; appearance: none; height: 2px; background: ${T.border};
      width: 100%; outline: none; border-radius: 2px;
    }
    input[type=range].slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; width: 14px; height: 14px;
      background: ${T.gold}; border-radius: 50%; cursor: pointer;
    }
    input[type=range].slider::-moz-range-thumb {
      width: 14px; height: 14px; background: ${T.gold}; border-radius: 50%;
      cursor: pointer; border: none;
    }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────────
// Tiny syntax highlighter — sufficient for Python/JS pedagogical snippets.
// ───────────────────────────────────────────────────────────────────────────────
const highlight = (code) => {
  const kws = ["def","return","import","from","class","if","else","elif","for","while","async","await","with","as","in","not","and","or","yield","lambda","try","except","raise","pass","True","False","None","self","const","let","function","new","await","async","await","export","default"];
  const lines = code.split("\n");
  return lines.map((line, i) => {
    let out = line
      .replace(/(#.*$)/g, '<span class="tok-com">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
    kws.forEach((k) => {
      out = out.replace(new RegExp(`\\b${k}\\b`, "g"), `<span class="tok-kw">${k}</span>`);
    });
    out = out.replace(/\b([A-Z][a-zA-Z0-9]+)\b/g, '<span class="tok-cls">$1</span>');
    out = out.replace(/\b([a-z_][a-z0-9_]*)\s*\(/gi, '<span class="tok-fn">$1</span>(');
    return <div key={i} dangerouslySetInnerHTML={{ __html: out || "&nbsp;" }} />;
  });
};

const CodeBlock = ({ lang = "python", title, children }) => (
  <div className="codeblock my-5">
    <div className="codeblock-header">
      <span>{title || lang}</span>
      <span style={{ color: T.textDim }}>{lang}</span>
    </div>
    <pre className="scroll-hide">{highlight(children)}</pre>
  </div>
);

// ───────────────────────────────────────────────────────────────────────────────
// Section navigation
// ───────────────────────────────────────────────────────────────────────────────
const NAV = [
  { group: "Beginnings", items: [
    { id: "intro",        label: "Introduction" },
    { id: "foundations",  label: "Naive RAG" },
  ]},
  { group: "Architecture", items: [
    { id: "advanced",     label: "Advanced RAG" },
    { id: "modular",      label: "Modular RAG" },
    { id: "variants",     label: "RAG Variants" },
    { id: "agentic",      label: "Agentic RAG" },
  ]},
  { group: "Frontier", items: [
    { id: "frontier",     label: "New Mechanisms" },
  ]},
  { group: "Components", items: [
    { id: "tech",         label: "Tech Stack" },
    { id: "chunking",     label: "Chunking" },
    { id: "hybrid",       label: "Hybrid Retrieval" },
    { id: "reranking",    label: "Reranking" },
    { id: "evaluation",   label: "Evaluation" },
  ]},
  { group: "Practice", items: [
    { id: "practices",    label: "Best Practices" },
    { id: "production",   label: "Production Pipeline" },
    { id: "case-study",   label: "Case Study" },
  ]},
];

// ───────────────────────────────────────────────────────────────────────────────
// Reusable diagram helpers (SVG)
// ───────────────────────────────────────────────────────────────────────────────
const Node = ({ x, y, w = 110, h = 36, label, sub, fill = T.bgPanel, stroke = T.borderHi, color = T.text }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={stroke} />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle"
          fontSize="11" fontFamily="JetBrains Mono" fill={color}>{label}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle"
                   fontSize="9" fontFamily="JetBrains Mono" fill={T.textMute}>{sub}</text>}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, label, dashed = false, color = T.textMute }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const ang = Math.atan2(dy, dx);
  const ax = x2 - 8 * Math.cos(ang), ay = y2 - 8 * Math.sin(ang);
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay}
            stroke={color} strokeWidth="1" strokeDasharray={dashed ? "3 3" : "0"} />
      <polygon points={`${x2},${y2} ${ax - 4 * Math.sin(ang)},${ay + 4 * Math.cos(ang)} ${ax + 4 * Math.sin(ang)},${ay - 4 * Math.cos(ang)}`}
               fill={color} />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} textAnchor="middle"
                       fontSize="9" fontFamily="JetBrains Mono" fill={T.textDim}>{label}</text>}
    </g>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Introduction
// ───────────────────────────────────────────────────────────────────────────────
const Intro = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 01 — Introduction</div>
    <h1 className="display h1 mb-6">A field guide to<br/><em style={{ color: T.gold }}>Retrieval-Augmented Generation.</em></h1>
    <p style={{ fontSize: 17, lineHeight: 1.7, color: T.text, opacity: .85, maxWidth: 720 }}>
      Retrieval-Augmented Generation is the practice of <strong style={{color:T.gold}}>grounding language models in
      external knowledge</strong> at inference time. It exists because parametric memory is expensive to update,
      hallucination-prone, and impossible to attribute. RAG trades a single forward pass for a pipeline — and that
      pipeline is where most of the interesting engineering lives.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
      {[
        { n: "01", t: "Grounding", b: "Tie generations to retrievable evidence. Hallucinations become falsifiable instead of invisible." },
        { n: "02", t: "Freshness", b: "Update the corpus, not the weights. Knowledge cutoffs become a configuration problem." },
        { n: "03", t: "Attribution", b: "Every claim links to a source. Auditability is a first-class property of the system." },
      ].map((c) => (
        <div key={c.n} className="card">
          <div className="mono" style={{ color: T.gold, fontSize: 11, letterSpacing: ".15em" }}>{c.n}</div>
          <div className="h3 mt-3">{c.t}</div>
          <p className="mt-2" style={{ color: T.textMute, fontSize: 14, lineHeight: 1.6 }}>{c.b}</p>
        </div>
      ))}
    </div>

    <div className="mt-14">
      <div className="h-eyebrow">The four generations</div>
      <h2 className="display h2 mb-4">How RAG evolved.</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
        {[
          { era: "2020 – 2022", name: "Naive RAG", desc: "Embed, retrieve top-k, stuff into a prompt. Works for demos, breaks under production load." },
          { era: "2023", name: "Advanced RAG", desc: "Pre-, intra-, and post-retrieval optimisations. Rewrite, rerank, compress, route." },
          { era: "2024", name: "Modular RAG", desc: "Composable building blocks. Memory, fusion, planners — assembled per use case." },
          { era: "2024 – 2026", name: "Agentic RAG", desc: "Retrieval becomes a planned action. Multi-agent, self-correcting, tool-using." },
        ].map((g, i) => (
          <div key={i} className="card-flat">
            <div className="mono" style={{ color: T.terra, fontSize: 10, letterSpacing: ".15em" }}>{g.era}</div>
            <div style={{ fontFamily: "Fraunces", fontSize: 22, marginTop: 6, fontWeight: 500 }}>{g.name}</div>
            <p style={{ color: T.textMute, fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>{g.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="prose mt-14">
      <div className="h-eyebrow">When NOT to use RAG</div>
      <h3 className="display h3 mb-3">RAG is not always the answer.</h3>
      <ul>
        <li>If the knowledge fits comfortably in the context window and rarely changes, consider <em>Cache-Augmented Generation</em> instead.</li>
        <li>If the task requires deep reasoning over a small, stable domain, <em>fine-tuning</em> often produces better latency and consistency.</li>
        <li>If the data is highly structured (transactions, time-series), a <em>text-to-SQL</em> agent will outperform vector search.</li>
        <li>If you need to teach a new <em>style</em> or <em>format</em>, RAG won't help — it adds knowledge, not behaviour.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Naive RAG (Foundations)
// ───────────────────────────────────────────────────────────────────────────────
const Foundations = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 02 — Foundations</div>
    <h2 className="display h2 mb-4">Naive RAG, dissected.</h2>
    <p className="prose"><p>
      The canonical pipeline has five stages. Each looks innocuous on paper and quietly accumulates failure modes
      in production. Understanding what each stage <em>actually</em> does is the prerequisite for everything that follows.
    </p></p>

    <svg viewBox="0 0 880 200" style={{ width: "100%", marginTop: 20 }}>
      {[
        { x: 20,  label: "Load",      sub: "ingest" },
        { x: 180, label: "Chunk",     sub: "split" },
        { x: 340, label: "Embed",     sub: "encode" },
        { x: 500, label: "Index",     sub: "store" },
        { x: 660, label: "Retrieve",  sub: "search" },
      ].map((n) => <Node key={n.label} x={n.x} y={80} w={140} h={50} label={n.label} sub={n.sub} />)}
      {[160, 320, 480, 640].map((x) => <Arrow key={x} x1={x} y1={105} x2={x + 20} y2={105} />)}
      <text x={730} y={155} fontSize="10" fontFamily="JetBrains Mono" fill={T.terra}>→ Generate</text>
    </svg>

    <div className="prose">
      <h4 className="h4 mt-10">1 — Loading</h4>
      <p>
        Ingest PDFs, HTML, code, transcripts. The biggest mistake here is treating extraction as solved:
        <code>PyPDF</code> destroys tables, <code>BeautifulSoup</code> swallows code blocks, OCR confuses
        <code>0</code> and <code>O</code>. Production-grade loaders preserve structure — they emit
        <em>semantic units</em>, not flat text.
      </p>

      <h4 className="h4 mt-8">2 — Chunking</h4>
      <p>
        The act of splitting a document into retrievable units. Chunk too small and you lose context;
        chunk too large and you blur the embedding signal. <strong>This single decision dictates more of your
        retrieval quality than your choice of embedding model.</strong> Treated in depth in the Chunking section.
      </p>

      <h4 className="h4 mt-8">3 — Embedding</h4>
      <p>
        Each chunk becomes a vector — a fixed-length numerical fingerprint of meaning. Modern embedding models
        (<code>BGE-M3</code>, <code>E5-Mistral</code>, <code>text-embedding-3-large</code>, <code>Cohere v3</code>)
        ship multiple dimensions, asymmetric encoders for query vs passage, and explicit
        <code>query: </code> / <code>passage: </code> prefixes that materially change recall.
      </p>

      <h4 className="h4 mt-8">4 — Indexing</h4>
      <p>
        A vector store organises millions of embeddings for sub-100ms nearest-neighbour search. The dominant
        algorithm is <strong>HNSW</strong> (Hierarchical Navigable Small World) — a multi-layer graph offering
        logarithmic search. Its three knobs (<code>M</code>, <code>efConstruction</code>, <code>efSearch</code>)
        govern the recall-vs-latency frontier.
      </p>

      <h4 className="h4 mt-8">5 — Retrieval + Generation</h4>
      <p>
        Encode the query, fetch top-k chunks by cosine or dot-product similarity, splice them into a prompt
        with a strict citation contract, and let the LLM compose. The contract — what the model is allowed to
        do when context is empty, contradictory, or insufficient — is where most production teams fail silently.
      </p>
    </div>

    <CodeBlock lang="python" title="The minimum viable RAG (LangChain idiomatic)">
{`from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

# 1 — Load
docs = PyPDFLoader("manual.pdf").load()

# 2 — Chunk
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
chunks = splitter.split_documents(docs)

# 3 + 4 — Embed and index
vs = FAISS.from_documents(chunks, OpenAIEmbeddings(model="text-embedding-3-large"))

# 5 — Retrieve + generate
qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o", temperature=0),
    retriever=vs.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True,
)
answer = qa.invoke({"query": "What is the warranty period?"})`}
    </CodeBlock>

    <div className="card mt-8" style={{ borderLeft: `3px solid ${T.terra}` }}>
      <div className="h-eyebrow" style={{ color: T.terra }}>Failure Modes in the Wild</div>
      <ul className="prose mt-2">
        <li><strong>Lost in the middle.</strong> LLMs over-attend to the start and end of context; relevant chunks placed mid-prompt are ignored.</li>
        <li><strong>Top-k tyranny.</strong> A fixed k either over-fetches noise or under-fetches the needle.</li>
        <li><strong>Single-shot retrieval.</strong> Complex questions require decomposition, not a single embedding lookup.</li>
        <li><strong>Semantic ≠ Lexical.</strong> Embedding search misses exact terms; product codes, function names, IDs vanish.</li>
        <li><strong>The empty-context trap.</strong> When retrieval returns nothing relevant, the model confidently hallucinates.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Advanced RAG
// ───────────────────────────────────────────────────────────────────────────────
const Advanced = () => {
  const [tab, setTab] = useState("pre");
  const tabs = [
    { id: "pre",  label: "Pre-retrieval" },
    { id: "ret",  label: "Retrieval" },
    { id: "post", label: "Post-retrieval" },
  ];

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 03 — Advanced</div>
      <h2 className="display h2 mb-4">Three places to intervene.</h2>
      <p className="prose"><p>
        Advanced RAG is a vocabulary of techniques layered onto the naive pipeline, organised by <em>where in the flow
        they act</em>. Every production system uses a handful — none use them all.
      </p></p>

      <div className="flex gap-2 mt-8 border-b" style={{ borderColor: T.border }}>
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "pre" && (
          <div className="anim-fade">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { t: "Query Rewriting", d: "Reformulate vague or pronoun-heavy queries using LLM prompts. Crucial for conversational RAG." },
                { t: "Query Expansion", d: "Generate synonyms, related entities, or sub-questions to broaden recall before retrieval." },
                { t: "HyDE", d: "Generate a hypothetical answer first; embed that. The fake answer is semantically closer to real passages than the question." },
                { t: "Step-back Prompting", d: "Abstract the query upward (\"What governs X?\") to retrieve principles before specifics." },
                { t: "Multi-Query (RAG-Fusion)", d: "Generate N paraphrases, retrieve N result sets, fuse via Reciprocal Rank Fusion." },
                { t: "Routing", d: "Classify intent, pick the right index (docs, code, tickets) or the right retrieval strategy entirely." },
              ].map((x) => (
                <div key={x.t} className="card">
                  <span className="pill pill-gold">{x.t}</span>
                  <p style={{ color: T.text, opacity: .85, fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>{x.d}</p>
                </div>
              ))}
            </div>

            <CodeBlock lang="python" title="HyDE — Hypothetical Document Embeddings">
{`# Instead of embedding the question, embed a hypothetical answer.
# Counterintuitive but it works because fake-answer-space is closer to passage-space
# than question-space is.

def hyde_retrieve(query, llm, embed_model, vector_store, k=5):
    hypothesis = llm.invoke(
        f"Write a concise paragraph that would directly answer: {query}\\n"
        f"Do not hedge. Do not say you are unsure. Write as if you know."
    )
    embedding = embed_model.embed(hypothesis)
    return vector_store.similarity_search_by_vector(embedding, k=k)`}
            </CodeBlock>
          </div>
        )}

        {tab === "ret" && (
          <div className="anim-fade">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { t: "Hybrid Search", d: "BM25 (lexical) + dense (semantic) results fused. Recovers exact-match recall that embeddings drop." },
                { t: "Metadata Filtering", d: "Pre-filter by tenant, date, type. Drastically narrows the search space and is your access-control surface." },
                { t: "Parent-Child Retrieval", d: "Index small chunks for precision; return large parents for context. Solves the chunk-size dilemma." },
                { t: "Sentence-Window", d: "Retrieve by sentence, return the surrounding ± N sentence window." },
                { t: "Self-Query", d: "LLM extracts structured filters from the question (e.g. 'docs from 2024') and applies them at the query layer." },
                { t: "Auto-Merging", d: "If multiple children of the same parent get hit, return the parent instead. Compresses k without losing context." },
              ].map((x) => (
                <div key={x.t} className="card">
                  <span className="pill pill-sage">{x.t}</span>
                  <p style={{ color: T.text, opacity: .85, fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "post" && (
          <div className="anim-fade">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { t: "Cross-Encoder Reranking", d: "Score every (query, chunk) pair with a model that reads both jointly. 100× slower than embeddings, 30-40% better precision." },
                { t: "RRF Fusion", d: "Reciprocal Rank Fusion: combine multiple ranked lists score-free. The most-used fusion algorithm in production." },
                { t: "MMR", d: "Maximal Marginal Relevance trades relevance against novelty — kills duplicate chunks before they hit the prompt." },
                { t: "Contextual Compression", d: "Use an LLM to extract only the sentences relevant to the query from each chunk. Shrinks prompt, sharpens signal." },
                { t: "LLM-as-Judge Reranking", d: "Ask an LLM to score chunks 0-10 against the query. Slow, expensive, often best in quality." },
                { t: "Result Caching", d: "Cache (query → ranked chunks) for hot queries. Bigger wins than caching at the LLM layer." },
              ].map((x) => (
                <div key={x.t} className="card">
                  <span className="pill pill-terra">{x.t}</span>
                  <p style={{ color: T.text, opacity: .85, fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Modular RAG
// ───────────────────────────────────────────────────────────────────────────────
const Modular = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 04 — Modular</div>
    <h2 className="display h2 mb-4">RAG as composable modules.</h2>
    <p className="prose"><p>
      Modular RAG, formalised in <em>Gao et al. (2024)</em>, reframes the system as a set of interchangeable
      modules connected by a configurable flow. The same pipeline can serve a customer-support bot, a legal
      contract analyser, and a code search engine — only the modules and the wiring change.
    </p></p>

    <svg viewBox="0 0 900 360" style={{ width: "100%", marginTop: 20 }}>
      {/* Indexing column */}
      <text x="100" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} textAnchor="middle">INDEXING</text>
      <Node x="40"  y="40" w="120" h="32" label="Loader" />
      <Node x="40"  y="80" w="120" h="32" label="Chunker" />
      <Node x="40"  y="120" w="120" h="32" label="Embedder" />
      <Node x="40"  y="160" w="120" h="32" label="Indexer" />

      {/* Pre-retrieval column */}
      <text x="280" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold} textAnchor="middle">PRE-RETRIEVAL</text>
      <Node x="220" y="40"  w="120" h="32" label="Router" />
      <Node x="220" y="80"  w="120" h="32" label="Rewriter" />
      <Node x="220" y="120" w="120" h="32" label="Expander" />
      <Node x="220" y="160" w="120" h="32" label="HyDE" />

      {/* Retrieval column */}
      <text x="460" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.sage} textAnchor="middle">RETRIEVAL</text>
      <Node x="400" y="40"  w="120" h="32" label="Dense" />
      <Node x="400" y="80"  w="120" h="32" label="Sparse (BM25)" />
      <Node x="400" y="120" w="120" h="32" label="Graph" />
      <Node x="400" y="160" w="120" h="32" label="SQL/KG" />

      {/* Post-retrieval column */}
      <text x="640" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} textAnchor="middle">POST-RETRIEVAL</text>
      <Node x="580" y="40"  w="120" h="32" label="Reranker" />
      <Node x="580" y="80"  w="120" h="32" label="Fusion (RRF)" />
      <Node x="580" y="120" w="120" h="32" label="Compressor" />
      <Node x="580" y="160" w="120" h="32" label="Citation" />

      {/* Generation column */}
      <text x="820" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold} textAnchor="middle">GENERATION</text>
      <Node x="760" y="40"  w="120" h="32" label="Generator" />
      <Node x="760" y="80"  w="120" h="32" label="Critic" />
      <Node x="760" y="120" w="120" h="32" label="Verifier" />
      <Node x="760" y="160" w="120" h="32" label="Memory" />

      {/* Flow */}
      <text x="450" y="240" fontSize="11" fontFamily="Fraunces" fontStyle="italic" fill={T.textMute} textAnchor="middle">
        ↓ The flow controller decides which modules to use and in what order ↓
      </text>

      <Node x="40"  y="280" w="800" h="50" label="Flow Controller — sequential | branching | conditional | loop"
            fill={T.ink} stroke={T.gold} color={T.gold}/>
    </svg>

    <div className="prose mt-6">
      <h4 className="h4 mt-8">Flow patterns</h4>
      <ul>
        <li><strong>Sequential</strong> — classic linear pipeline. Predictable, debuggable, the default.</li>
        <li><strong>Conditional</strong> — branch on query type (factual vs analytical, internal vs public).</li>
        <li><strong>Branching + Fusion</strong> — run multiple retrievers in parallel, fuse with RRF.</li>
        <li><strong>Loop (iterative)</strong> — re-retrieve based on intermediate findings. Foundation of agentic RAG.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 5 — RAG Variants (HyDE, CRAG, Self-RAG, RAPTOR, GraphRAG, HippoRAG)
// ───────────────────────────────────────────────────────────────────────────────
const VariantCard = ({ name, year, by, what, when, code }) => (
  <div className="card" style={{ marginBottom: 18 }}>
    <div className="flex justify-between items-baseline">
      <div>
        <span className="display" style={{ fontSize: 26, fontWeight: 500 }}>{name}</span>
        <span style={{ color: T.textMute, fontSize: 12, marginLeft: 12 }} className="mono">{year} · {by}</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <div className="h-eyebrow">What it does</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .9 }}>{what}</p>
      </div>
      <div>
        <div className="h-eyebrow" style={{ color: T.sage }}>When to use</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .9 }}>{when}</p>
      </div>
    </div>
    {code && <CodeBlock lang="python" title="Pseudocode">{code}</CodeBlock>}
  </div>
);

const Variants = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 05 — Variants</div>
    <h2 className="display h2 mb-4">A taxonomy of named patterns.</h2>
    <p className="prose"><p>
      Most named "RAG-prefixed" methods are recipes that combine a few of the techniques you've already seen.
      What follows is the canon you should be able to reach for by name.
    </p></p>

    <VariantCard
      name="HyDE"
      year="2022"
      by="Gao et al."
      what="Generate a hypothetical answer to the query, embed that answer, and search with it. The hypothesis lives in the same distributional space as your passages, sidestepping the question-vs-passage asymmetry that plagues short queries."
      when="Short, underspecified queries. Domains where queries look nothing like passages (FAQ where users ask 'how do I…' but docs say 'configure X by…')."
      code={`def hyde(query, llm, embedder, store, k=5):
    hyp = llm.invoke(f"Write a passage that answers: {query}")
    return store.search_by_vector(embedder.embed(hyp), k=k)`}
    />

    <VariantCard
      name="CRAG"
      year="2024"
      by="Yan et al. (Corrective RAG)"
      what="A lightweight evaluator scores retrieval quality as Correct / Ambiguous / Incorrect. Correct → use as-is. Ambiguous → augment with web search. Incorrect → discard, escalate to web. The system corrects its own retrieval before generation."
      when="Open-domain QA, support bots, anywhere retrieval recall is uneven and you have a fallback knowledge source."
      code={`def crag(query, retriever, evaluator, web_search, llm):
    docs = retriever.get(query)
    verdict = evaluator.score(query, docs)  # CORRECT | AMBIGUOUS | INCORRECT
    if verdict == "INCORRECT":
        docs = web_search.fetch(query)
    elif verdict == "AMBIGUOUS":
        docs += web_search.fetch(query)
    refined = compress(docs, query)
    return llm.generate(query, refined)`}
    />

    <VariantCard
      name="Self-RAG"
      year="2023"
      by="Asai et al."
      what="The LLM emits reflection tokens during generation — [Retrieve?], [Relevant?], [Supported?], [Useful?]. It decides on-the-fly whether to retrieve, then judges what it retrieved, then judges its own output against retrieved evidence. Self-supervised quality control."
      when="High-stakes generation (medical, legal). When you need provable grounding, not just retrieved context."
    />

    <VariantCard
      name="RAPTOR"
      year="2024"
      by="Sarthi et al."
      what="Recursive Abstractive Processing for Tree-Organized Retrieval. Cluster chunks, summarize each cluster, then cluster the summaries — recursively. The result is a multi-resolution tree. Queries retrieve at the right level of abstraction, from leaf detail to global theme."
      when="Long documents (books, transcripts, codebases). Questions that require synthesis across the whole corpus, not lookup of one passage."
      code={`def raptor_build(chunks, embed, summarize, depth=4):
    layer = chunks
    tree = [layer]
    for _ in range(depth):
        clusters = gmm_cluster(embed(layer))
        layer = [summarize(c) for c in clusters]
        tree.append(layer)
        if len(layer) <= 4: break
    return tree  # index every layer, retrieve across them`}
    />

    <VariantCard
      name="GraphRAG"
      year="2024"
      by="Microsoft Research"
      what="Build a knowledge graph from the corpus during indexing: extract entities, relations, communities. Queries traverse the graph for entity-centric questions, or hit community summaries for thematic questions. Defeats vector search on the question 'what are the main themes in this corpus?'"
      when="Entity-rich domains: financial filings, scientific literature, organisational knowledge. Questions that span many documents."
    />

    <VariantCard
      name="HippoRAG"
      year="2024"
      by="Gutiérrez et al."
      what="Inspired by hippocampal memory indexing. Build a knowledge graph from passages, then use Personalized PageRank over the graph at query time to do multi-hop retrieval in a single shot — no iterative LLM calls. Cheaper and faster than agentic multi-hop."
      when="Multi-hop QA where iterative retrieval is too slow. Production systems that need agent-grade reasoning at retriever latency."
    />

    <VariantCard
      name="Adaptive RAG"
      year="2024"
      by="Jeong et al."
      what="A classifier decides query complexity: no-retrieval (model knows it) → single-hop → multi-hop. Routes to the cheapest strategy that works. Halves latency on easy queries without sacrificing accuracy on hard ones."
      when="Heterogeneous traffic where most queries are easy and a long tail is hard. Anywhere blanket use of multi-hop is wasteful."
    />

    <VariantCard
      name="Speculative RAG"
      year="2024"
      by="Wang et al."
      what="A small fast model drafts answers from retrieved chunks in parallel; a large model verifies and picks the best. Parallel drafting cuts wall-clock latency dramatically while keeping flagship-model quality on the verification path."
      when="Latency-bound workloads where you cannot afford a single-pass large-model call. Production chat where p95 matters."
    />
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 6 — Agentic RAG
// ───────────────────────────────────────────────────────────────────────────────
const Agentic = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 06 — Agentic</div>
    <h2 className="display h2 mb-4">When retrieval becomes a planned action.</h2>
    <p className="prose"><p>
      Agentic RAG abandons the fixed pipeline. Retrieval is one of many tools the agent can call, and it decides
      when, how often, and with what query — based on what it knows so far. The line between "RAG" and "tool-using
      agent" dissolves; what remains is the discipline of grounding every claim in evidence.
    </p></p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="card">
        <div className="h-eyebrow" style={{ color: T.gold }}>Single-agent ReAct</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .9 }}>
          One agent loops over <code style={{background:T.ink, padding:'1px 6px', color:T.sage, fontFamily:'JetBrains Mono', fontSize:12, border:`1px solid ${T.border}`}}>Thought → Action → Observation</code>.
          Each iteration may call <em>retrieve</em>, <em>search_web</em>, <em>query_sql</em>, or finalise. The cheapest agentic pattern; works
          for queries needing 1-3 retrieval rounds.
        </p>
      </div>
      <div className="card">
        <div className="h-eyebrow" style={{ color: T.terra }}>Multi-agent orchestration</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .9 }}>
          A planner decomposes the query into a DAG of sub-tasks; specialist agents (researcher, analyst, writer, critic) execute their
          slices in parallel; a synthesiser merges and checks the output. The pattern behind serious deep-research systems.
        </p>
      </div>
    </div>

    <svg viewBox="0 0 880 320" style={{ width: "100%", marginTop: 26 }}>
      <Node x="380" y="20"  w="120" h="40" label="Planner" sub="DAG builder" fill={T.ink} stroke={T.gold} color={T.gold}/>

      <Node x="60"  y="120" w="140" h="50" label="Researcher" sub="dense + web" />
      <Node x="240" y="120" w="140" h="50" label="Analyst"    sub="SQL / tools" />
      <Node x="420" y="120" w="140" h="50" label="Synthesiser" sub="writer agent" />
      <Node x="600" y="120" w="140" h="50" label="Critic"     sub="LLM judge" />
      <Node x="760" y="120" w="100" h="50" label="Memory"     sub="blackboard" />

      <Arrow x1="440" y1="60"  x2="130" y2="120" />
      <Arrow x1="440" y1="60"  x2="310" y2="120" />
      <Arrow x1="440" y1="60"  x2="490" y2="120" />
      <Arrow x1="440" y1="60"  x2="670" y2="120" />
      <Arrow x1="440" y1="60"  x2="810" y2="120" dashed />

      <Node x="320" y="230" w="240" h="50" label="Final answer + provenance graph"
            fill={T.ink} stroke={T.terra} color={T.terra}/>
      <Arrow x1="130" y1="170" x2="380" y2="230" dashed />
      <Arrow x1="310" y1="170" x2="410" y2="230" dashed />
      <Arrow x1="490" y1="170" x2="450" y2="230" />
      <Arrow x1="670" y1="170" x2="490" y2="230" dashed />
    </svg>

    <div className="prose mt-6">
      <h4 className="h4 mt-8">The agentic primitives</h4>
      <ul>
        <li><strong>Intent identification</strong> — classify the query (factual, exploratory, comparative, action-taking) before planning.</li>
        <li><strong>Task decomposition</strong> — break the question into ordered sub-questions, often as a DAG with explicit dependencies.</li>
        <li><strong>Tool registry</strong> — each retrieval source (vector store, BM25, SQL, web, internal API) registered with a schema and cost.</li>
        <li><strong>Blackboard memory</strong> — shared state (Redis is the production default) where agents publish findings and subscribe to dependencies.</li>
        <li><strong>Reflexion loop</strong> — generate, critique, revise. Bounded retries with a quality floor.</li>
        <li><strong>Guard rails</strong> — termination criteria, max-iterations, cost ceilings, and ACL-enforced retrieval scopes.</li>
      </ul>
    </div>

    <CodeBlock lang="python" title="LangGraph — minimal agentic RAG loop">
{`from langgraph.graph import StateGraph, END

def plan(state): ...        # decompose query → sub_queries
def retrieve(state): ...    # fetch evidence for current sub_query
def critic(state): ...      # judge: SUFFICIENT | NEED_MORE | REPLAN
def synthesise(state): ...  # compose answer with citations

g = StateGraph(AgentState)
g.add_node("plan",       plan)
g.add_node("retrieve",   retrieve)
g.add_node("critic",     critic)
g.add_node("synthesise", synthesise)

g.set_entry_point("plan")
g.add_edge("plan", "retrieve")
g.add_edge("retrieve", "critic")

g.add_conditional_edges("critic", lambda s: s["verdict"], {
    "SUFFICIENT": "synthesise",
    "NEED_MORE":  "retrieve",
    "REPLAN":     "plan",
})
g.add_edge("synthesise", END)

app = g.compile()`}
    </CodeBlock>

    <div className="card mt-6" style={{ borderLeft: `3px solid ${T.gold}` }}>
      <div className="h-eyebrow" style={{ color: T.gold }}>Agentic ≠ Better by default</div>
      <p className="prose mt-2"><p>
        Agentic systems are <em>slower</em> (multi-turn), <em>costlier</em> (multi-LLM-call), and <em>harder to debug</em>
        than well-engineered pipelines. Reach for agency only when query complexity genuinely demands planning — and even then,
        bound the iterations and trace every decision. <strong>Most "agentic" use-cases are actually solved by Adaptive
        RAG or a well-orchestrated Modular pipeline.</strong>
      </p></p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 7 — Frontier mechanisms (Paging / MemGPT, CAG, late chunking, ColPali)
// ───────────────────────────────────────────────────────────────────────────────
const Frontier = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 07 — Frontier</div>
    <h2 className="display h2 mb-4">New mechanisms worth tracking.</h2>
    <p className="prose"><p>
      The last eighteen months produced a wave of ideas that don't fit neatly into the pre/intra/post taxonomy.
      Two themes dominate: <em>treating context as a memory hierarchy</em> (paging-style ideas) and <em>moving
      retrieval into the model's representation layer</em> (late interaction, late chunking, multi-vector).
    </p></p>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Memory Paging</span>
        <span className="pill pill-gold">MemGPT-style</span>
      </div>
      <p className="prose mt-3"><p>
        MemGPT (Packer et al., 2023) ported operating-system <em>virtual memory</em> to LLM context. The context
        window becomes <strong>main memory</strong>; an external store (vector DB + key-value file system) becomes
        <strong> disk</strong>; and the model itself issues page-in / page-out function calls to swap content
        between them. The model decides what's hot and what's cold — instead of a fixed top-k stuffing every turn.
      </p></p>

      <svg viewBox="0 0 880 220" style={{ width: "100%", marginTop: 10 }}>
        <text x="120" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold} textAnchor="middle">MAIN CONTEXT (hot)</text>
        <Node x="40"  y="40" w="170" h="40" label="System instructions" />
        <Node x="40"  y="86" w="170" h="40" label="Working memory" />
        <Node x="40"  y="132" w="170" h="40" label="FIFO message queue" />

        <text x="450" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra} textAnchor="middle">FUNCTION INTERFACE</text>
        <Node x="280" y="40"  w="170" h="40" label="memory_insert()" />
        <Node x="280" y="86"  w="170" h="40" label="memory_search()" />
        <Node x="280" y="132" w="170" h="40" label="page_out()" />

        <text x="700" y="22" fontSize="10" fontFamily="JetBrains Mono" fill={T.sage} textAnchor="middle">EXTERNAL STORE (cold)</text>
        <Node x="550" y="40"  w="200" h="40" label="Archival vector DB" />
        <Node x="550" y="86"  w="200" h="40" label="Recall storage" />
        <Node x="550" y="132" w="200" h="40" label="Persistent KV docs" />

        <Arrow x1="210" y1="60"  x2="280" y2="60"  />
        <Arrow x1="210" y1="106" x2="280" y2="106" />
        <Arrow x1="210" y1="152" x2="280" y2="152" />
        <Arrow x1="450" y1="60"  x2="550" y2="60"  />
        <Arrow x1="450" y1="106" x2="550" y2="106" />
        <Arrow x1="450" y1="152" x2="550" y2="152" />
      </svg>

      <p className="prose"><p>
        Why this matters: the model gets <em>effectively unbounded</em> memory without the quadratic cost of an actual
        million-token window. <strong>Paging is becoming the dominant pattern for long-running agents</strong> —
        assistants, copilots, and any system with cross-session continuity.
      </p></p>
    </div>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Cache-Augmented Generation</span>
        <span className="pill pill-terra">CAG</span>
      </div>
      <p className="prose mt-3"><p>
        Chan et al. (2024) made a provocative claim: <em>if your knowledge fits in a long context window, don't
        retrieve — preload it once and cache the KV state.</em> Every subsequent query reuses the precomputed
        attention cache. No retrieval latency, no ranking noise, no chunking decisions.
      </p></p>
      <table className="compare mt-3">
        <thead><tr><th></th><th>Traditional RAG</th><th>CAG</th></tr></thead>
        <tbody>
          <tr><td>Knowledge size</td><td>Unbounded</td><td>Bounded by context window</td></tr>
          <tr><td>Latency</td><td>Retrieve + generate</td><td>Generate only (warm cache)</td></tr>
          <tr><td>Freshness</td><td>Reindex chunks</td><td>Rebuild cache from scratch</td></tr>
          <tr><td>Best for</td><td>Large, evolving corpora</td><td>Stable, bounded knowledge bases</td></tr>
        </tbody>
      </table>
      <p className="prose"><p>
        Hybrid systems are emerging: <strong>CAG for the static core</strong> (product docs, policies),
        <strong> RAG for the long tail</strong> (tickets, threads, the open web). Worth designing for from day one.
      </p></p>
    </div>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Late Chunking</span>
        <span className="pill pill-sage">Jina, 2024</span>
      </div>
      <p className="prose mt-3"><p>
        Conventional chunking is destructive: you split, then embed each piece in isolation, losing the
        document-wide context. <em>Late chunking</em> inverts this. Encode the <strong>whole document</strong> with
        a long-context embedding model first, then split the token-level outputs and pool them into chunk
        embeddings <em>after</em> the model has seen everything.
      </p></p>
      <CodeBlock lang="python" title="Late chunking — pseudocode">
{`# Traditional: lose surrounding context
chunks = split(doc, 512)
embeds = [model.encode(c) for c in chunks]

# Late chunking: split AFTER seeing the whole doc
token_embeds = model.encode_tokens(doc)         # one pass, document-aware
chunks       = split_by_boundary(doc, 512)
embeds       = [mean_pool(token_embeds[start:end])
                for (start, end) in chunks]`}
      </CodeBlock>
      <p className="prose"><p>
        Result: 5-15% recall lift on long-document benchmarks for the cost of a single long-context forward pass.
        Requires a model with a real long context (Jina v3, Voyage 3, BGE-M3).
      </p></p>
    </div>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Multi-Vector & Late Interaction</span>
        <span className="pill pill-gold">ColBERT · ColPali</span>
      </div>
      <p className="prose mt-3"><p>
        Single-vector embeddings compress an entire passage to one point. <strong>ColBERT</strong> keeps one vector
        <em> per token</em>; matching becomes a MaxSim operation across all token pairs. The cost is a 100-300×
        index size; the win is dramatic recall on rare terms and codes.
      </p></p>
      <p className="prose"><p>
        <strong>ColPali</strong> (Faysse et al., 2024) extends this to vision: it embeds <em>document pages as
        images</em> via a vision-language model, skipping OCR entirely. For documents where layout, charts and
        tables carry meaning — financial filings, scientific papers, slide decks — ColPali beats text-extraction
        pipelines on retrieval quality and ingestion cost.
      </p></p>
    </div>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Matryoshka Embeddings</span>
        <span className="pill pill-sage">MRL, 2022</span>
      </div>
      <p className="prose mt-3"><p>
        Train embeddings so that prefixes of the vector are themselves valid embeddings. Index at <code>1536</code>,
        but search at <code>256</code> for a 6× speed-up, escalating to the full vector only for top candidates.
        OpenAI's <code>text-embedding-3-*</code> family ships with this property; the production pattern is
        <em> coarse-to-fine retrieval</em>.
      </p></p>
    </div>

    <div className="card mt-6">
      <div className="flex items-baseline gap-3">
        <span className="display" style={{ fontSize: 30, fontWeight: 500 }}>Other patterns to track</span>
      </div>
      <ul className="prose">
        <li><strong>LongRAG.</strong> Use very long retrieval units (4-8k tokens) with long-context generators. Reduces chunk count and lost-in-the-middle effects.</li>
        <li><strong>RAG-Token vs RAG-Sequence.</strong> Retrieve per generated token (RETRO-style) vs per sequence. Token-level is approaching production viability for code completion.</li>
        <li><strong>Hypothetical Question Embedding (HyQE).</strong> Mirror of HyDE — index hypothetical <em>questions</em> against each chunk; match user query to question, not passage.</li>
        <li><strong>Active Retrieval.</strong> Trigger mid-generation retrieval when the model's next-token confidence dips. FLARE is the canonical reference.</li>
        <li><strong>Reflexive memory consolidation.</strong> Periodically summarise stale memory back into compact form — analogous to sleep consolidation in biological systems.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 8 — Tech stack
// ───────────────────────────────────────────────────────────────────────────────
const Tech = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 08 — Stack</div>
    <h2 className="display h2 mb-4">What you actually deploy.</h2>

    <h3 className="display h3 mt-8 mb-3">Vector databases</h3>
    <table className="compare">
      <thead>
        <tr><th>Engine</th><th>Type</th><th>Strengths</th><th>Trade-offs</th></tr>
      </thead>
      <tbody>
        <tr><td><span className="pill pill-gold">Pinecone</span></td><td>Managed SaaS</td><td>Zero-ops, serverless, hybrid native</td><td>Cost at scale, vendor lock-in</td></tr>
        <tr><td><span className="pill pill-gold">Weaviate</span></td><td>OSS + managed</td><td>Hybrid, modules, GraphQL</td><td>Memory hungry</td></tr>
        <tr><td><span className="pill pill-gold">Qdrant</span></td><td>OSS + managed</td><td>Rust, payload filtering, quantisation</td><td>Newer ecosystem</td></tr>
        <tr><td><span className="pill pill-gold">Milvus</span></td><td>OSS, CNCF</td><td>Massive scale, GPU index builds</td><td>Operational complexity</td></tr>
        <tr><td><span className="pill pill-gold">pgvector</span></td><td>Postgres ext.</td><td>Lives next to your data, ACID</td><td>HNSW recall ceilings, scale limits</td></tr>
        <tr><td><span className="pill pill-gold">Chroma</span></td><td>OSS embedded</td><td>Dev-friendly, simple API</td><td>Not for production scale</td></tr>
        <tr><td><span className="pill pill-gold">LanceDB</span></td><td>OSS, embedded</td><td>Columnar (Lance fmt), multi-modal</td><td>Younger, less ecosystem</td></tr>
        <tr><td><span className="pill pill-gold">Vespa</span></td><td>OSS</td><td>Search + ML serving, ColBERT native</td><td>Yahoo-grade learning curve</td></tr>
      </tbody>
    </table>

    <h3 className="display h3 mt-12 mb-3">ANN indexes</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[
        { n: "HNSW", d: "Hierarchical Navigable Small World. Multi-layer graph. Default for most workloads. Knobs: M, efConstruction, efSearch." },
        { n: "IVF-PQ", d: "Inverted File + Product Quantisation. Compresses vectors to bytes. Lower recall, dramatic memory savings." },
        { n: "ScaNN", d: "Google's anisotropic quantisation. Optimised for high-dim cosine. Best recall-at-budget for IVF-class indexes." },
        { n: "DiskANN", d: "Microsoft, SSD-resident. Billion-scale on a single machine. Higher latency than RAM-resident HNSW." },
        { n: "Flat (brute)", d: "Exact search. Use for <100k vectors or as ground truth in evals." },
        { n: "Vamana", d: "Graph index underlying DiskANN. Higher recall ceiling than HNSW at large scale." },
      ].map((x) => (
        <div key={x.n} className="card-flat">
          <div className="mono" style={{ color: T.gold, fontSize: 12, letterSpacing: ".1em" }}>{x.n}</div>
          <p style={{ color: T.text, opacity: .85, fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>{x.d}</p>
        </div>
      ))}
    </div>

    <h3 className="display h3 mt-12 mb-3">Embedding models</h3>
    <table className="compare">
      <thead>
        <tr><th>Model</th><th>Dim</th><th>Context</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>text-embedding-3-large</td><td>3072 (MRL)</td><td>8k</td><td>OpenAI's flagship; Matryoshka-trained.</td></tr>
        <tr><td>text-embedding-3-small</td><td>1536 (MRL)</td><td>8k</td><td>5× cheaper, ~90% of large's quality.</td></tr>
        <tr><td>voyage-3-large</td><td>1024</td><td>32k</td><td>State of the art on most retrieval benchmarks.</td></tr>
        <tr><td>Cohere embed-v3</td><td>1024</td><td>512</td><td>Strong multilingual; explicit input_type modes.</td></tr>
        <tr><td>BGE-M3</td><td>1024</td><td>8k</td><td>OSS, multilingual, hybrid (dense + sparse + multi-vector) in one model.</td></tr>
        <tr><td>E5-Mistral-7B</td><td>4096</td><td>32k</td><td>Decoder-based, best-in-class OSS quality, heavy.</td></tr>
        <tr><td>Jina v3</td><td>1024 (MRL)</td><td>8k</td><td>First-class late chunking support, task-specific LoRAs.</td></tr>
        <tr><td>NV-Embed-v2</td><td>4096</td><td>32k</td><td>Top of MTEB leaderboard, GPU-heavy.</td></tr>
      </tbody>
    </table>

    <h3 className="display h3 mt-12 mb-3">Rerankers</h3>
    <table className="compare">
      <thead><tr><th>Model</th><th>Class</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Cohere Rerank 3.5</td><td>Cross-encoder API</td><td>Best-in-class managed, multilingual.</td></tr>
        <tr><td>BGE-reranker-v2-m3</td><td>OSS cross-encoder</td><td>Self-hostable, strong baseline.</td></tr>
        <tr><td>ColBERT-v2 / Jina-ColBERT</td><td>Late interaction</td><td>Native multi-vector retrieval, no separate rerank.</td></tr>
        <tr><td>Voyage Rerank-2</td><td>Cross-encoder API</td><td>Domain-tuned variants for code, finance.</td></tr>
        <tr><td>RankGPT / RankLLM</td><td>LLM-as-judge</td><td>Highest quality, highest cost. Listwise prompting.</td></tr>
        <tr><td>MixedBread mxbai-rerank</td><td>OSS</td><td>Lightweight, fast, surprisingly competitive.</td></tr>
      </tbody>
    </table>

    <h3 className="display h3 mt-12 mb-3">Orchestration & observability</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="card-flat">
        <div className="h-eyebrow" style={{ color: T.terra }}>Orchestration</div>
        <ul className="prose">
          <li><strong>LangChain / LangGraph</strong> — most ecosystem, graph-based agents.</li>
          <li><strong>LlamaIndex</strong> — strongest indexing primitives, query engines.</li>
          <li><strong>Haystack 2.x</strong> — pipeline-oriented, deeply typed.</li>
          <li><strong>DSPy</strong> — programmatic prompting, automatic optimisation.</li>
          <li><strong>Custom (FastAPI + Redis)</strong> — what serious teams ship to production.</li>
        </ul>
      </div>
      <div className="card-flat">
        <div className="h-eyebrow" style={{ color: T.sage }}>Observability</div>
        <ul className="prose">
          <li><strong>Arize Phoenix</strong> — OSS, OpenTelemetry-native, span-level RAG tracing.</li>
          <li><strong>LangSmith</strong> — LangChain ecosystem, debugging-first.</li>
          <li><strong>Langfuse</strong> — OSS, eval + analytics + cost in one.</li>
          <li><strong>TruLens</strong> — feedback functions, eval-as-code.</li>
          <li><strong>Helicone / Weave</strong> — request-level analytics, prompt tracking.</li>
        </ul>
      </div>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 9 — Chunking
// ───────────────────────────────────────────────────────────────────────────────
const Chunking = () => {
  const [size, setSize] = useState(400);
  const [overlap, setOverlap] = useState(60);
  const text = "Retrieval-Augmented Generation is the practice of grounding language models in external knowledge at inference time. The naive pipeline embeds chunks, retrieves top-k by similarity, and lets the LLM compose. Production systems extend this with rewriting, fusion, reranking, and self-correction. Modern systems also introduce memory paging, where the model itself decides what to page in and out of context. Chunking quality dominates retrieval quality more than any other single decision.";

  const chunks = useMemo(() => {
    const out = [];
    let i = 0;
    while (i < text.length) {
      out.push(text.slice(i, i + size));
      i += size - overlap;
      if (out.length > 20) break;
    }
    return out;
  }, [size, overlap, text]);

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 09 — Chunking</div>
      <h2 className="display h2 mb-4">The single decision that dominates recall.</h2>
      <p className="prose"><p>
        Every chunking strategy is a trade-off between <em>signal density</em> (small chunks have purer embeddings)
        and <em>context preservation</em> (large chunks keep ideas intact). Match the strategy to the content type
        — never one-size-fits-all across a heterogeneous corpus.
      </p></p>

      <h3 className="display h3 mt-8 mb-2">The four tiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { tier: "TIER 1", name: "Fixed-size / Naive", best: "Quick demos, uniform text", worst: "Code, structured docs, dialogues", how: "Split every N characters/tokens with overlap. Recursive variants try paragraph → sentence → token boundaries." },
          { tier: "TIER 2", name: "Structural", best: "Markdown, HTML, code, source files", worst: "Plain prose without markup", how: "Respect document structure: split on headings, paragraphs, AST nodes. Each chunk is a semantic unit by construction." },
          { tier: "TIER 3", name: "Semantic", best: "Long narrative documents", worst: "Latency-sensitive ingestion", how: "Embed every sentence, detect distribution shifts, split where similarity drops. Cost: 1 embed per sentence at index time." },
          { tier: "TIER 4", name: "Agentic", best: "High-value content, low ingestion volume", worst: "Massive ingestion at low cost", how: "An LLM reads the document and proposes chunk boundaries based on argument structure, topic shifts, intended use cases." },
        ].map((c) => (
          <div key={c.tier} className="card">
            <div className="flex items-baseline justify-between">
              <span className="mono" style={{ color: T.terra, fontSize: 11, letterSpacing: ".15em" }}>{c.tier}</span>
              <span className="display" style={{ fontSize: 22, fontWeight: 500 }}>{c.name}</span>
            </div>
            <p style={{ fontSize: 14, color: T.text, opacity: .9, lineHeight: 1.65, marginTop: 14 }}>{c.how}</p>
            <div className="hairline mt-3 pt-3">
              <div style={{ fontSize: 12, color: T.sage }}>Best: {c.best}</div>
              <div style={{ fontSize: 12, color: T.rust, marginTop: 4 }}>Worst: {c.worst}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="display h3 mt-12 mb-2">Interactive: chunking the same passage</h3>
      <p className="prose" style={{ marginBottom: 18 }}><p>
        Move the sliders. Notice how a small chunk with low overlap fragments coherent ideas; a large chunk with
        heavy overlap inflates the index without adding signal. The sweet spot is content-dependent.
      </p></p>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="mono" style={{ fontSize: 11, color: T.textMute, letterSpacing: ".1em" }}>
              CHUNK SIZE: <span style={{ color: T.gold }}>{size}</span> chars
            </label>
            <input type="range" min="80" max="800" value={size} onChange={(e) => setSize(+e.target.value)} className="slider" />
          </div>
          <div>
            <label className="mono" style={{ fontSize: 11, color: T.textMute, letterSpacing: ".1em" }}>
              OVERLAP: <span style={{ color: T.gold }}>{overlap}</span> chars
            </label>
            <input type="range" min="0" max="200" value={overlap} onChange={(e) => setOverlap(+e.target.value)} className="slider" />
          </div>
        </div>
        <div className="hairline pt-4">
          <div className="mono" style={{ fontSize: 11, color: T.textMute, letterSpacing: ".1em", marginBottom: 10 }}>
            {chunks.length} CHUNKS PRODUCED
          </div>
          <div className="grid gap-2">
            {chunks.map((c, i) => (
              <div key={i} style={{
                fontSize: 12, color: T.text, opacity: .92, padding: "8px 12px",
                background: T.bgSunken, borderLeft: `2px solid ${i % 2 ? T.gold : T.terra}`,
                fontFamily: "JetBrains Mono", lineHeight: 1.5
              }}>
                <span style={{ color: T.textDim, marginRight: 8 }}>[{String(i + 1).padStart(2, '0')}]</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CodeBlock lang="python" title="Semantic chunking — production implementation">
{`from typing import List
import numpy as np

def semantic_chunks(text: str, embed, threshold_percentile: float = 95) -> List[str]:
    sentences = split_into_sentences(text)
    embeds = np.array([embed(s) for s in sentences])

    # Cosine distance between consecutive sentences
    sims = [np.dot(embeds[i], embeds[i+1]) /
            (np.linalg.norm(embeds[i]) * np.linalg.norm(embeds[i+1]))
            for i in range(len(sentences) - 1)]
    distances = 1 - np.array(sims)

    # Boundaries where distance exceeds the percentile threshold
    cutoff = np.percentile(distances, threshold_percentile)
    boundaries = [0] + [i + 1 for i, d in enumerate(distances) if d > cutoff] + [len(sentences)]

    return [" ".join(sentences[boundaries[i]:boundaries[i+1]])
            for i in range(len(boundaries) - 1)]`}
      </CodeBlock>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 10 — Hybrid retrieval + RRF
// ───────────────────────────────────────────────────────────────────────────────
const Hybrid = () => {
  // Interactive RRF demo
  const [k, setK] = useState(60);
  const dense = useMemo(() => [
    { id: "A", title: "Hybrid retrieval combines BM25 with dense embeddings" },
    { id: "B", title: "Dense embeddings excel at semantic similarity" },
    { id: "C", title: "Reranking improves precision in the top-k" },
    { id: "D", title: "BM25 catches exact terms like product codes" },
    { id: "E", title: "RRF fuses ranks score-free" },
  ], []);
  const sparse = useMemo(() => [
    { id: "D", title: "BM25 catches exact terms like product codes" },
    { id: "A", title: "Hybrid retrieval combines BM25 with dense embeddings" },
    { id: "F", title: "TF-IDF is the historical baseline" },
    { id: "E", title: "RRF fuses ranks score-free" },
    { id: "C", title: "Reranking improves precision in the top-k" },
  ], []);

  const fused = useMemo(() => {
    const scores = {};
    [dense, sparse].forEach((list) => {
      list.forEach((doc, rank) => {
        scores[doc.id] = (scores[doc.id] || 0) + 1 / (k + rank + 1);
      });
    });
    const all = [...new Map([...dense, ...sparse].map(d => [d.id, d])).values()];
    return all.map(d => ({ ...d, score: scores[d.id] }))
              .sort((a, b) => b.score - a.score);
  }, [dense, sparse, k]);

  const Col = ({ title, list, color }) => (
    <div>
      <div className="h-eyebrow" style={{ color }}>{title}</div>
      <div className="grid gap-1.5 mt-2">
        {list.map((d, i) => (
          <div key={d.id} style={{
            fontFamily: "JetBrains Mono", fontSize: 12, padding: "8px 10px",
            background: T.bgSunken, border: `1px solid ${T.border}`, borderLeft: `2px solid ${color}`,
            color: T.text, opacity: .92
          }}>
            <span style={{ color: T.textDim }}>#{i + 1}</span>
            <span style={{ color, marginLeft: 8 }}>[{d.id}]</span>
            <span style={{ marginLeft: 10 }}>{d.title}</span>
            {d.score !== undefined && (
              <span style={{ color: T.gold, marginLeft: 8 }}>· {d.score.toFixed(4)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 10 — Hybrid</div>
      <h2 className="display h2 mb-4">Lexical + semantic, fused.</h2>
      <p className="prose"><p>
        Dense embeddings understand meaning; BM25 understands exact terms. They fail on different queries —
        product codes, function names, acronyms vanish from dense indexes; concept queries miss BM25.
        <strong> Hybrid is not a "nice-to-have"</strong>; it is the production default. The fusion algorithm
        of choice is Reciprocal Rank Fusion (RRF) — score-free, hyperparameter-light, surprisingly hard to beat.
      </p></p>

      <div className="card mt-6 mono" style={{ fontSize: 14, padding: 24, textAlign: "center", color: T.gold }}>
        score(d) = Σ<sub style={{fontSize:10}}>retrievers</sub> &nbsp;1 / (k + rank<sub style={{fontSize:10}}>r</sub>(d))
      </div>
      <p className="prose" style={{ textAlign: "center", color: T.textMute, fontSize: 13 }}>
        k is the only hyperparameter. 60 is the canonical default (Cormack et al., 2009).
      </p>

      <div className="card mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Col title="DENSE (cosine)" list={dense} color={T.sage} />
          <Col title="SPARSE (BM25)" list={sparse} color={T.terra} />
        </div>
        <div className="hairline pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="mono" style={{ fontSize: 11, color: T.textMute, letterSpacing: ".1em" }}>
              k = <span style={{ color: T.gold }}>{k}</span>
            </span>
            <input type="range" min="1" max="200" value={k} onChange={(e) => setK(+e.target.value)}
                   className="slider" style={{ width: 200 }} />
          </div>
          <Col title="FUSED RANKING (RRF)" list={fused} color={T.gold} />
        </div>
      </div>

      <CodeBlock lang="python" title="Reciprocal Rank Fusion — reference implementation">
{`from collections import defaultdict

def rrf(rankings: list[list[str]], k: int = 60) -> list[tuple[str, float]]:
    scores = defaultdict(float)
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking):
            scores[doc_id] += 1.0 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Production usage with metadata pre-filter
dense_ids  = vector_store.search(query_vec, k=50, filter={"tenant": tid})
sparse_ids = bm25_index.search(query_str, k=50, filter={"tenant": tid})
fused      = rrf([dense_ids, sparse_ids], k=60)[:20]`}
      </CodeBlock>

      <div className="prose mt-6">
        <h4 className="h4 mt-6">Beyond RRF</h4>
        <ul>
          <li><strong>Weighted RRF.</strong> Multiply each retriever's contribution by a per-retriever weight when one source is meaningfully more reliable.</li>
          <li><strong>Linear combination.</strong> Normalise scores (min-max or z-score) and weight-sum. Sensitive to score distributions; needs calibration.</li>
          <li><strong>Learned fusion.</strong> Train a small ranker on click-through or eval data. The endgame for high-traffic systems.</li>
          <li><strong>Convex combination via CombSUM/CombMNZ.</strong> Classic IR fusion, useful when retriever scores are well-calibrated.</li>
        </ul>
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 11 — Reranking
// ───────────────────────────────────────────────────────────────────────────────
const Reranking = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 11 — Reranking</div>
    <h2 className="display h2 mb-4">The cheapest precision lift available.</h2>
    <p className="prose"><p>
      Retrieve broadly with cheap methods, rerank the top 50-100 with an expensive cross-encoder. This two-stage
      pattern is universal — it is the single intervention with the best quality-per-engineering-hour return.
    </p></p>

    <svg viewBox="0 0 880 160" style={{ width: "100%", marginTop: 10 }}>
      <Node x="40"  y="50" w="160" h="50" label="Query" sub="user input" />
      <Node x="240" y="50" w="160" h="50" label="Retriever" sub="hybrid · top-100" />
      <Node x="440" y="50" w="160" h="50" label="Reranker" sub="cross-encoder · top-10" />
      <Node x="640" y="50" w="160" h="50" label="Generator" sub="LLM" fill={T.ink} stroke={T.gold} color={T.gold}/>
      <Arrow x1="200" y1="75" x2="240" y2="75" />
      <Arrow x1="400" y1="75" x2="440" y2="75" label="100 → 10" />
      <Arrow x1="600" y1="75" x2="640" y2="75" />
    </svg>

    <h3 className="display h3 mt-10 mb-3">Classes of reranker</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { n: "Cross-encoders", d: "Read (query, document) as one sequence; output a relevance score. Far more accurate than embeddings — and 100-1000× slower per pair. Examples: BGE-reranker, Cohere Rerank, MS-MARCO MiniLM." },
        { n: "Late-interaction (ColBERT)", d: "Token-level multi-vectors; MaxSim aggregation. A middle ground: better than dense, cheaper than full cross-encoder, no separate rerank step needed." },
        { n: "LLM-as-Judge (RankGPT)", d: "Listwise prompting — give the LLM the candidates and ask it to rank. Highest quality, highest cost, hardest to scale. Reserve for offline pipelines or low-QPS surfaces." },
        { n: "MMR (diversity)", d: "Not a reranker per se — a post-hoc selector that balances relevance against novelty. Drop in after the reranker to deduplicate near-identical chunks." },
      ].map((x) => (
        <div key={x.n} className="card">
          <span className="pill pill-terra">{x.n}</span>
          <p style={{ color: T.text, opacity: .9, fontSize: 14, lineHeight: 1.65, marginTop: 12 }}>{x.d}</p>
        </div>
      ))}
    </div>

    <CodeBlock lang="python" title="Two-stage retrieval with cross-encoder rerank">
{`from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")

def retrieve_and_rerank(query, vector_store, bm25, top_k=10, fetch=100):
    # Stage 1 — wide hybrid retrieval
    dense  = vector_store.similarity_search(query, k=fetch)
    sparse = bm25.search(query, k=fetch)
    fused  = rrf([dense, sparse])[:fetch]

    # Stage 2 — cross-encoder rerank on the fused top-N
    pairs  = [(query, doc.text) for doc in fused]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(fused, scores), key=lambda x: x[1], reverse=True)

    return [doc for doc, _ in ranked[:top_k]]`}
    </CodeBlock>

    <div className="card mt-6" style={{ borderLeft: `3px solid ${T.gold}` }}>
      <div className="h-eyebrow" style={{ color: T.gold }}>Practical guidance</div>
      <ul className="prose">
        <li>Retrieve broad (50-100), rerank to 5-15. Generating with fewer, more relevant chunks beats generating with many noisy ones.</li>
        <li>Latency budget? Quantise the reranker (INT8) and batch the (query, doc) pairs aggressively. 100 pairs in &lt;200ms on a single GPU is achievable.</li>
        <li>For multi-tenant systems, pre-filter on metadata <em>before</em> retrieval. Rerank costs scale with candidates.</li>
        <li>Always run MMR (λ ≈ 0.7) <em>after</em> rerank if your corpus contains near-duplicates (legal, support tickets).</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 12 — Evaluation
// ───────────────────────────────────────────────────────────────────────────────
const Evaluation = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 12 — Evaluation</div>
    <h2 className="display h2 mb-4">If you cannot measure it, you do not have it.</h2>
    <p className="prose"><p>
      RAG evaluation splits naturally in two: <strong>retrieval quality</strong> (did we find the right context?)
      and <strong>generation quality</strong> (did we produce a faithful, useful answer?). Both must be measured
      independently — a system can fail on either axis while looking fine on aggregate.
    </p></p>

    <h3 className="display h3 mt-10 mb-3">Retrieval metrics</h3>
    <table className="compare">
      <thead><tr><th>Metric</th><th>What it measures</th><th>Use when</th></tr></thead>
      <tbody>
        <tr><td>Hit Rate @ k</td><td>Did any retrieved chunk contain the answer?</td><td>Binary ground truth available</td></tr>
        <tr><td>MRR</td><td>Average reciprocal rank of the first relevant hit</td><td>You care about top-1 quality</td></tr>
        <tr><td>NDCG @ k</td><td>Graded relevance, position-discounted</td><td>Multiple chunks have varying relevance</td></tr>
        <tr><td>Context Precision</td><td>Of retrieved chunks, how many are relevant?</td><td>Optimising for prompt density</td></tr>
        <tr><td>Context Recall</td><td>Of all relevant chunks in the corpus, how many were retrieved?</td><td>Comprehensiveness matters</td></tr>
      </tbody>
    </table>

    <h3 className="display h3 mt-12 mb-3">Generation metrics</h3>
    <table className="compare">
      <thead><tr><th>Metric</th><th>What it measures</th><th>Use when</th></tr></thead>
      <tbody>
        <tr><td>Faithfulness</td><td>Are claims grounded in retrieved context?</td><td>Always — this is the headline RAG metric</td></tr>
        <tr><td>Answer Relevance</td><td>Does the answer address the question?</td><td>Detecting topic drift and over-generation</td></tr>
        <tr><td>Answer Correctness</td><td>Match to ground-truth answer</td><td>You have labelled QA pairs</td></tr>
        <tr><td>Hallucination Rate</td><td>Fraction of claims unsupported by context</td><td>High-stakes domains</td></tr>
        <tr><td>Citation Accuracy</td><td>Does the cited source actually support the claim?</td><td>Auditability requirements</td></tr>
      </tbody>
    </table>

    <h3 className="display h3 mt-12 mb-3">The LLM-as-Judge framework</h3>
    <p className="prose"><p>
      Most RAG metrics require human-quality scoring at machine scale. The dominant solution is <em>LLM-as-Judge</em>:
      structured prompts that ask a strong model to score each axis on a fixed rubric. Done well, it correlates 0.7-0.9
      with human ratings; done badly, it produces beautiful nonsense.
    </p></p>

    <CodeBlock lang="python" title="RAGAS — multi-metric evaluation">
{`from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall, answer_correctness,
)

dataset = {
    "question":     [...],   # user queries
    "answer":       [...],   # RAG system outputs
    "contexts":     [...],   # retrieved chunks per query
    "ground_truth": [...],   # gold answers (for correctness/recall)
}

result = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision,
             context_recall, answer_correctness],
)

# Anything below ~0.7 on faithfulness is a production red flag.
print(result.to_pandas())`}
    </CodeBlock>

    <div className="card mt-6" style={{ borderLeft: `3px solid ${T.terra}` }}>
      <div className="h-eyebrow" style={{ color: T.terra }}>Multi-layer evaluation in production</div>
      <p className="prose"><p>
        A mature setup runs evaluation at five layers — <em>component</em> (retriever, reranker, generator separately),
        <em> pipeline</em> (end-to-end on golden questions), <em>shadow</em> (mirror live traffic through candidate
        configs offline), <em>online</em> (real users, feedback signals), <em>regression</em> (continuous CI gate on
        golden sets). Each layer catches different failure modes; skipping any of them lets a class of bug into production.
      </p></p>
    </div>

    <h3 className="display h3 mt-12 mb-3">Golden datasets</h3>
    <p className="prose"><p>
      The cheapest mistake in evaluation is using too few questions. The most expensive is using the wrong ones.
      A working golden set has 100-500 questions per major capability, stratified by difficulty, with explicit
      annotated <em>relevant chunks</em> and <em>gold answers</em>. Generate them with LLM bootstrap, then have
      humans review — synthetic-only golden sets calibrate against your own model's blind spots.
    </p></p>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 13 — Best practices
// ───────────────────────────────────────────────────────────────────────────────
const Practices = () => {
  const sections = [
    {
      title: "Indexing",
      items: [
        "Preserve document structure during loading — tables, code blocks, lists are signal, not noise.",
        "Pick chunking strategy per content type, not per corpus. Code, prose, and tables need different treatment.",
        "Always store rich metadata (source, date, author, section, tenant). Pre-filtering beats post-ranking on cost and latency.",
        "Use Matryoshka embeddings + coarse-to-fine retrieval for sub-100ms latency at >10M vectors.",
        "Idempotent reindexing pipelines. Re-running ingestion should never duplicate or corrupt.",
      ],
    },
    {
      title: "Retrieval",
      items: [
        "Hybrid (dense + BM25) by default. Pure dense or pure sparse is a niche choice.",
        "Always rerank. A cross-encoder on the top-50 is the single best precision intervention available.",
        "Tune k empirically per task. Common defaults (k=5) are often wrong by 2-3× either direction.",
        "Use parent-child / auto-merging when your content has natural hierarchy (sections, pages, threads).",
        "For multi-tenant: filter first, then search. Never trust the LLM to enforce ACLs after retrieval.",
      ],
    },
    {
      title: "Generation",
      items: [
        "Strict citation contract. The model must cite every factual claim or refuse to make it.",
        "Explicit empty-context handling. Define what the model says when retrieval returns nothing useful.",
        "Temperature 0 for factual; temperature 0.3-0.7 only for creative reformulation tasks.",
        "Stream tokens to the UI. Perceived latency drops by 60-80% with streaming, even at the same total time.",
        "Cap context to ~70% of the model's window. Lost-in-the-middle is real; the last 30% buys you reliability.",
      ],
    },
    {
      title: "Operations",
      items: [
        "Trace every request end-to-end. Span retrieval, rerank, prompt build, generation, post-processing — separately.",
        "Cost ceilings per request and per user. The cheapest way to break a RAG bill is an unbounded agentic loop.",
        "Cache at the (query, filters) level, not at the LLM level. Retrieval is far more cacheable than generation.",
        "Reindex regularly, not opportunistically. Stale chunks accumulate silently.",
        "Run continuous eval on a fixed golden set in CI. Block merges that regress beyond a tolerance.",
      ],
    },
    {
      title: "Safety & Trust",
      items: [
        "Treat retrieved content as untrusted input. Prompt-inject defense applies to indexed documents too.",
        "Provenance for every claim. Surface citations to users — they catch failures you won't.",
        "Sensitive content redaction at ingestion, not at generation. Defense in depth, not last-mile fix.",
        "Refusal pathways for off-policy queries. A good RAG knows when not to answer.",
        "Versioned prompts and indexes. Rollback must be cheap.",
      ],
    },
  ];

  return (
    <section className="anim-fade">
      <div className="h-eyebrow">§ 13 — Best Practices</div>
      <h2 className="display h2 mb-4">Hard-won principles.</h2>
      <p className="prose"><p>
        Most of these come from production scars. They are listed not because they are clever but because the
        teams that ignored them paid for it later.
      </p></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {sections.map((s) => (
          <div key={s.title} className="card">
            <div className="h3 display mb-3" style={{ color: T.gold }}>{s.title}</div>
            <ul className="prose">
              {s.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 14 — Production pipeline
// ───────────────────────────────────────────────────────────────────────────────
const Production = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 14 — Production</div>
    <h2 className="display h2 mb-4">An end-to-end production architecture.</h2>
    <p className="prose"><p>
      The diagram below shows the topology of a serious production RAG. It separates the <em>indexing</em> plane
      (offline, batch, eventually consistent) from the <em>serving</em> plane (online, low-latency, strongly available),
      with eval and observability cross-cutting both.
    </p></p>

    <svg viewBox="0 0 940 540" style={{ width: "100%", marginTop: 20 }}>
      {/* Indexing plane */}
      <rect x="20" y="10" width="900" height="200" rx="4" fill="none" stroke={T.border} strokeDasharray="3 4"/>
      <text x="40" y="32" fontSize="10" fontFamily="JetBrains Mono" fill={T.terra}>INDEXING PLANE — offline, batch</text>

      <Node x="40"  y="50"  w="140" h="50" label="Sources" sub="docs · APIs · DBs" />
      <Node x="200" y="50"  w="140" h="50" label="Loader" sub="parse · extract" />
      <Node x="360" y="50"  w="140" h="50" label="Cleaner" sub="dedupe · redact" />
      <Node x="520" y="50"  w="140" h="50" label="Chunker" sub="strategy router" />
      <Node x="680" y="50"  w="140" h="50" label="Enricher" sub="metadata · ACL" />

      <Node x="120" y="135" w="140" h="50" label="Embedder" sub="batch GPU" />
      <Node x="280" y="135" w="140" h="50" label="Sparse indexer" sub="BM25 · SPLADE" />
      <Node x="440" y="135" w="140" h="50" label="Vector store" sub="HNSW · IVF" />
      <Node x="600" y="135" w="140" h="50" label="KG store" sub="entities · relations" />
      <Node x="760" y="135" w="140" h="50" label="Cache" sub="hot queries" />

      <Arrow x1="180" y1="75" x2="200" y2="75" />
      <Arrow x1="340" y1="75" x2="360" y2="75" />
      <Arrow x1="500" y1="75" x2="520" y2="75" />
      <Arrow x1="660" y1="75" x2="680" y2="75" />
      <Arrow x1="750" y1="100" x2="190" y2="135" dashed />
      <Arrow x1="750" y1="100" x2="350" y2="135" dashed />
      <Arrow x1="750" y1="100" x2="510" y2="135" dashed />
      <Arrow x1="750" y1="100" x2="670" y2="135" dashed />

      {/* Serving plane */}
      <rect x="20" y="230" width="900" height="200" rx="4" fill="none" stroke={T.border} strokeDasharray="3 4"/>
      <text x="40" y="252" fontSize="10" fontFamily="JetBrains Mono" fill={T.gold}>SERVING PLANE — online, low-latency</text>

      <Node x="40"  y="270" w="140" h="50" label="User query" sub="API · UI · agent" fill={T.ink} stroke={T.gold} color={T.gold}/>
      <Node x="200" y="270" w="140" h="50" label="Router" sub="intent · tenant" />
      <Node x="360" y="270" w="140" h="50" label="Rewriter" sub="HyDE · expand" />
      <Node x="520" y="270" w="140" h="50" label="Retriever" sub="hybrid fusion" />
      <Node x="680" y="270" w="140" h="50" label="Reranker" sub="cross-encoder" />

      <Node x="120" y="355" w="140" h="50" label="Compressor" sub="contextual" />
      <Node x="280" y="355" w="140" h="50" label="Prompt builder" sub="template · cite" />
      <Node x="440" y="355" w="140" h="50" label="LLM" sub="streaming gen" />
      <Node x="600" y="355" w="140" h="50" label="Verifier" sub="faithfulness" />
      <Node x="760" y="355" w="140" h="50" label="Response" sub="cite · attribute" fill={T.ink} stroke={T.terra} color={T.terra}/>

      <Arrow x1="180" y1="295" x2="200" y2="295" />
      <Arrow x1="340" y1="295" x2="360" y2="295" />
      <Arrow x1="500" y1="295" x2="520" y2="295" />
      <Arrow x1="660" y1="295" x2="680" y2="295" />
      <Arrow x1="750" y1="320" x2="190" y2="355" dashed />
      <Arrow x1="260" y1="380" x2="280" y2="380" />
      <Arrow x1="420" y1="380" x2="440" y2="380" />
      <Arrow x1="580" y1="380" x2="600" y2="380" />
      <Arrow x1="740" y1="380" x2="760" y2="380" />

      {/* Cross-cutting plane */}
      <rect x="20" y="450" width="900" height="80" rx="4" fill="none" stroke={T.border} strokeDasharray="3 4"/>
      <text x="40" y="472" fontSize="10" fontFamily="JetBrains Mono" fill={T.sage}>CROSS-CUTTING</text>
      <Node x="40"  y="485" w="160" h="35" label="Observability" sub="traces · metrics" />
      <Node x="220" y="485" w="160" h="35" label="Eval harness" sub="online + offline" />
      <Node x="400" y="485" w="160" h="35" label="Feedback loop" sub="ratings · clicks" />
      <Node x="580" y="485" w="160" h="35" label="Cost guard" sub="ceilings · alerts" />
      <Node x="760" y="485" w="160" h="35" label="Secrets · ACL" sub="multi-tenant" />
    </svg>

    <h3 className="display h3 mt-10 mb-2">Latency budget (target: P95 &lt; 1500 ms)</h3>
    <table className="compare">
      <thead><tr><th>Stage</th><th>Budget</th><th>Optimisation</th></tr></thead>
      <tbody>
        <tr><td>Query rewriting (optional)</td><td>50-150 ms</td><td>Small model (Haiku, gpt-4o-mini); skip on simple queries</td></tr>
        <tr><td>Embedding the query</td><td>20-50 ms</td><td>Co-located embedder; batched in async paths</td></tr>
        <tr><td>Hybrid retrieval</td><td>30-80 ms</td><td>Pre-filter on metadata; HNSW efSearch tuned; parallel sparse + dense</td></tr>
        <tr><td>Reranking</td><td>80-200 ms</td><td>Quantised cross-encoder; batched GPU; cap top-50</td></tr>
        <tr><td>Prompt build + compression</td><td>50-150 ms</td><td>Cache template fragments; compress only on overflow</td></tr>
        <tr><td>Generation (first token)</td><td>400-800 ms</td><td>Streaming to UI; model size matched to task</td></tr>
        <tr><td>Verifier (optional)</td><td>50-150 ms</td><td>Run async, gate only critical responses</td></tr>
      </tbody>
    </table>

    <div className="card mt-8" style={{ borderLeft: `3px solid ${T.sage}` }}>
      <div className="h-eyebrow" style={{ color: T.sage }}>The maturity model</div>
      <ul className="prose">
        <li><strong>Level 1 — Prototype.</strong> Single index, no rerank, no eval. Works in a demo, fails on real traffic.</li>
        <li><strong>Level 2 — MVP.</strong> Hybrid retrieval, basic eval, manual prompts. Goes live; gets feedback.</li>
        <li><strong>Level 3 — Production.</strong> Reranking, observability, CI eval gates, cost ceilings, multi-tenant.</li>
        <li><strong>Level 4 — Scaled.</strong> Adaptive routing, shadow traffic, online learning, automated reindexing.</li>
        <li><strong>Level 5 — Autonomous.</strong> Agentic loops with bounded autonomy, automated prompt optimisation (DSPy), continuous self-eval.</li>
      </ul>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// SECTION 15 — Case study (SDLC Copilot)
// ───────────────────────────────────────────────────────────────────────────────
const CaseStudy = () => (
  <section className="anim-fade">
    <div className="h-eyebrow">§ 15 — Case Study</div>
    <h2 className="display h2 mb-4">SDLC Copilot — a worked example.</h2>
    <p className="prose"><p>
      To make this concrete, here is an architecture that ties every concept above together: a multi-agent
      system that ingests historical sprint artefacts and generates User Stories, Epics, Test Cases and Gherkin
      scripts on demand. It is a faithful reference for any team building enterprise RAG on top of LangGraph,
      Redis, and Azure OpenAI.
    </p></p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
      {[
        { label: "Agents", value: "6", sub: "Intent · Planner · Researcher · Writer · Critic · Synthesiser" },
        { label: "Retrieval", value: "Hybrid", sub: "BM25 + dense + RRF + cross-encoder rerank" },
        { label: "Orchestration", value: "DAG", sub: "LangGraph + Redis blackboard + ACL enforcement" },
      ].map((m, i) => (
        <div key={i} className="card-flat">
          <div style={{ fontSize: 11, color: T.textMute, letterSpacing: ".15em" }} className="mono">{m.label.toUpperCase()}</div>
          <div className="display" style={{ fontSize: 36, fontWeight: 500, color: T.gold, marginTop: 4 }}>{m.value}</div>
          <div style={{ color: T.text, opacity: .8, fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{m.sub}</div>
        </div>
      ))}
    </div>

    <h3 className="display h3 mt-12 mb-3">The pipeline, top to bottom</h3>
    <ol className="prose" style={{ paddingLeft: 20 }}>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>1 — Intent Identifier.</strong> Classifies the incoming request as <code>generate_user_story</code>,
        <code>generate_test_case</code>, <code>refine_epic</code>, etc. Routes to the appropriate planner sub-graph.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>2 — DAG Task Planner.</strong> Decomposes the goal into a directed graph of subtasks with explicit
        dependencies. Nodes carry inputs, outputs, retry policy, and cost ceiling.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>3 — Agent Registry.</strong> Six specialist agents register with capability descriptors. The
        Planner binds nodes to agents based on capability match and current load.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>4 — Redis Blackboard.</strong> Shared memory with ACL enforcement. Agents publish findings;
        downstream agents subscribe by topic and dependency. Pub/sub is the orchestration bus.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>5 — CRAG Retrieval Loop.</strong> Each Researcher node does hybrid retrieval, evaluates the
        retrieved set (Correct / Ambiguous / Incorrect), and falls back to broader retrieval or web search if needed.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>6 — Reflexion Quality Loop.</strong> Writer generates → Critic scores against a 12-dimension
        rubric → Writer revises. Bounded at three iterations with a quality floor.
      </li>
      <li style={{ paddingLeft: 0 }}>
        <strong style={{color:T.gold}}>7 — Synthesiser + Citation Builder.</strong> Merges agent outputs; attaches a provenance graph
        linking every claim to a source chunk.
      </li>
    </ol>

    <h3 className="display h3 mt-12 mb-3">Retrieval architecture</h3>
    <svg viewBox="0 0 880 250" style={{ width: "100%" }}>
      <Node x="40"  y="40" w="160" h="50" label="Sprint corpus" sub="Jira · Confluence · Git" />
      <Node x="40"  y="110" w="160" h="50" label="Chunker (Tier 3)" sub="semantic + section-aware" />
      <Node x="40"  y="180" w="160" h="50" label="BGE-M3 embed" sub="dense + sparse + multi" />

      <Node x="280" y="40" w="160" h="50" label="HNSW dense" sub="M=32 · ef=128" />
      <Node x="280" y="110" w="160" h="50" label="BM25 sparse" sub="OpenSearch" />
      <Node x="280" y="180" w="160" h="50" label="ACL filter" sub="tenant · project" />

      <Node x="520" y="40" w="160" h="50" label="RRF fusion" sub="k=60" />
      <Node x="520" y="110" w="160" h="50" label="Cross-encoder" sub="bge-reranker-v2" />
      <Node x="520" y="180" w="160" h="50" label="MMR" sub="λ = 0.7" />

      <Node x="720" y="100" w="140" h="60" label="Agent context" sub="top-12 chunks" fill={T.ink} stroke={T.gold} color={T.gold} />

      <Arrow x1="200" y1="65"  x2="280" y2="65" />
      <Arrow x1="200" y1="135" x2="280" y2="135" />
      <Arrow x1="440" y1="65"  x2="520" y2="65" />
      <Arrow x1="440" y1="135" x2="520" y2="135" />
      <Arrow x1="680" y1="65"  x2="720" y2="120" />
      <Arrow x1="680" y1="135" x2="720" y2="130" />
      <Arrow x1="680" y1="205" x2="720" y2="140" />
    </svg>

    <h3 className="display h3 mt-12 mb-3">Evaluation harness</h3>
    <p className="prose"><p>
      Five layers of LLM-as-Judge across twelve dimensions: <em>retrieval recall, retrieval precision,
      groundedness, factuality, completeness, INVEST compliance, acceptance criteria quality, Gherkin syntax,
      story-test alignment, redundancy, hallucination, traceability</em>. Composite scoring with weights tuned
      against a 400-question golden set. Results gate every deployment.
    </p></p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
      {[
        { label: "PDLC Stage", value: "Define", impact: "~65% time reduction", color: T.gold },
        { label: "PDLC Stage", value: "Test", impact: "~65% time reduction", color: T.gold },
        { label: "PDLC Stage", value: "Build", impact: "~15% time reduction", color: T.terra },
      ].map((m, i) => (
        <div key={i} className="card-flat">
          <div style={{ fontSize: 11, color: T.textMute, letterSpacing: ".15em" }} className="mono">{m.label.toUpperCase()}</div>
          <div className="display" style={{ fontSize: 28, fontWeight: 500, color: m.color, marginTop: 4 }}>{m.value}</div>
          <div style={{ color: T.text, opacity: .85, fontSize: 13, marginTop: 6 }}>{m.impact}</div>
        </div>
      ))}
    </div>

    <div className="card mt-10" style={{ borderLeft: `3px solid ${T.gold}` }}>
      <div className="h-eyebrow" style={{ color: T.gold }}>Lessons from the build</div>
      <ul className="prose">
        <li><strong>Agentic ≠ free.</strong> Reflexion loops doubled quality on the worst 10% of outputs and tripled the average cost. Bound them aggressively.</li>
        <li><strong>Sparse mattered more than expected.</strong> Engineering teams ask about exact function names, IDs and JIRA keys constantly. Dense alone missed 30% of them.</li>
        <li><strong>ACL at the retriever, not the prompt.</strong> Tenant filtering pushed into the vector store cut latency and eliminated an entire class of leakage bugs.</li>
        <li><strong>HyDE worked best on User Stories.</strong> Vague feature requests look nothing like detailed acceptance criteria; the hypothesis bridges the gap.</li>
        <li><strong>Eval gates beat alarms.</strong> Continuous regression on the golden set caught five silent regressions in the first quarter — none were caught by online metrics.</li>
      </ul>
    </div>

    <div className="mt-12 hairline pt-8">
      <p className="prose" style={{ color: T.textMute, fontSize: 13, textAlign: "center" }}>
        End of guide · <span className="display" style={{ color: T.gold, fontStyle: "italic" }}>The map is not the territory; ship something and listen.</span>
      </p>
    </div>
  </section>
);

// ───────────────────────────────────────────────────────────────────────────────
// Section renderer
// ───────────────────────────────────────────────────────────────────────────────
const SECTIONS = {
  intro: Intro,
  foundations: Foundations,
  advanced: Advanced,
  modular: Modular,
  variants: Variants,
  agentic: Agentic,
  frontier: Frontier,
  tech: Tech,
  chunking: Chunking,
  hybrid: Hybrid,
  reranking: Reranking,
  evaluation: Evaluation,
  practices: Practices,
  production: Production,
  "case-study": CaseStudy,
};

// ───────────────────────────────────────────────────────────────────────────────
// Root component
// ───────────────────────────────────────────────────────────────────────────────
export default function RagTutorial() {
  const [active, setActive] = useState("intro");
  const Section = SECTIONS[active];
  const allIds = NAV.flatMap((g) => g.items.map((i) => i.id));
  const idx = allIds.indexOf(active);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [active]);

  return (
    <div className="rag-root min-h-screen relative" style={{ background: T.bg }}>
      <GlobalStyles />
      <div className="grain" />

      <div className="flex mx-auto" style={{ maxWidth: 1400 }}>
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-0 self-start h-screen overflow-y-auto scroll-hide"
               style={{ width: 260, borderRight: `1px solid ${T.border}`, padding: "32px 0 24px" }}>
          <div style={{ padding: "0 22px 18px" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".2em", color: T.terra }}>FIELD GUIDE</div>
            <div className="display" style={{ fontSize: 22, fontWeight: 500, marginTop: 6, lineHeight: 1.1 }}>
              Retrieval-Augmented<br/><em style={{ color: T.gold }}>Generation</em>
            </div>
            <div className="mono" style={{ fontSize: 10, color: T.textDim, marginTop: 8 }}>v1 · 15 chapters</div>
          </div>
          <nav>
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="nav-section">{g.group}</div>
                {g.items.map((it) => (
                  <div key={it.id}
                       className={`nav-link ${active === it.id ? "active" : ""}`}
                       onClick={() => setActive(it.id)}>
                    {it.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 md:px-12 lg:px-16 py-12" style={{ maxWidth: 920 }}>
          <Section />

          {/* Pager */}
          <div className="hairline mt-20 pt-6 flex justify-between items-center">
            <button
              disabled={idx <= 0}
              onClick={() => setActive(allIds[idx - 1])}
              style={{
                opacity: idx <= 0 ? 0.3 : 1, cursor: idx <= 0 ? "not-allowed" : "pointer",
                background: "none", border: `1px solid ${T.border}`, padding: "10px 18px",
                color: T.text, fontSize: 13, letterSpacing: ".05em", fontFamily: "JetBrains Mono",
              }}>
              ← Previous
            </button>
            <span className="mono" style={{ color: T.textDim, fontSize: 11, letterSpacing: ".15em" }}>
              {String(idx + 1).padStart(2, '0')} / {String(allIds.length).padStart(2, '0')}
            </span>
            <button
              disabled={idx >= allIds.length - 1}
              onClick={() => setActive(allIds[idx + 1])}
              style={{
                opacity: idx >= allIds.length - 1 ? 0.3 : 1,
                cursor: idx >= allIds.length - 1 ? "not-allowed" : "pointer",
                background: T.gold, border: `1px solid ${T.gold}`, padding: "10px 18px",
                color: T.bg, fontSize: 13, letterSpacing: ".05em", fontFamily: "JetBrains Mono",
                fontWeight: 600,
              }}>
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
