import React from "react";

// Vite glob — lazy import every .jsx / .tsx file under src/tutorials/
// The module must export a default React component.
const tutorialModules = import.meta.glob<{ default: React.ComponentType }>(
  "../tutorials/**/*.{jsx,tsx}"
);

export interface TutorialMeta {
  slug: string;
  title: string;
  summary: string;
  // path key used for the glob record lookup
  moduleKey: string;
  load: () => Promise<{ default: React.ComponentType }>;
}

// One-line summaries keyed by slug. Missing entries fall back to a generic line.
const SUMMARIES: Record<string, string> = {
  "celeryguide": "Distributed task queues with Celery — workers, brokers, and retries.",
  "mlengineertransformation": "The path from software engineer to ML engineer, step by step.",
  "ragtutorial": "Retrieval-augmented generation from first principles.",
  "sdlc-copilot-mcp-integration": "Wiring an SDLC copilot to tools via the Model Context Protocol.",
  "sdlccopilotctopresentation": "A CTO-level pitch for an SDLC copilot platform.",
  "claude-code-mastery-guide": "Getting the most out of Claude Code — workflows and patterns.",
  "deployment-pipeline-tutorial": "Building a CI/CD deployment pipeline end to end.",
  "hyde-interactive": "Hypothetical Document Embeddings for better retrieval, interactively.",
  "mcp-deep-dive-guide": "A deep dive into the Model Context Protocol and its architecture.",
  "rag-reranking-enterprise-guide": "Enterprise RAG with reranking for higher-precision retrieval.",
  "sdlc-vector-store-tutorial": "Standing up a vector store for SDLC knowledge and search.",
  "voice-workshop": "Building voice-driven interfaces — capture, transcribe, respond.",
  "kag-knowledge-augmented-generation": "Beyond RAG: knowledge graphs, embeddings, and Ant Group's logical-form KAG framework.",
};

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function titleify(raw: string): string {
  return raw
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build the registry once at module-load time (pure, side-effect free)
export const tutorials: TutorialMeta[] = Object.entries(tutorialModules)
  .filter(([moduleKey]) => !moduleKey.split("/").pop()!.startsWith("_"))
  .map(
  ([moduleKey, load]) => {
    const filename = moduleKey.split("/").pop()!.replace(/\.(jsx|tsx)$/, "");
    // Assign stable slugs for known hub files instead of auto-deriving
    let slug: string;
    if (filename === "LangGraphGuide") {
      slug = "langgraph-guide";
    } else if (filename === "01-Hub-Phase-Rollout") {
      slug = "evaluation-framework";
    } else {
      slug = slugify(filename);
    }
    return {
      slug,
      title: titleify(filename),
      summary: SUMMARIES[slug] ?? "Interactive walkthrough — open to explore.",
      moduleKey,
      load,
    };
  }
);

export function findTutorial(slug: string): TutorialMeta | undefined {
  return tutorials.find((t) => t.slug === slug);
}
