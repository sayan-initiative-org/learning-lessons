import React from "react";

// Vite glob — lazy import every .jsx / .tsx file under src/tutorials/
// The module must export a default React component.
const tutorialModules = import.meta.glob<{ default: React.ComponentType }>(
  "../tutorials/**/*.{jsx,tsx}"
);

export interface TutorialMeta {
  slug: string;
  title: string;
  // path key used for the glob record lookup
  moduleKey: string;
  load: () => Promise<{ default: React.ComponentType }>;
}

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
      moduleKey,
      load,
    };
  }
);

export function findTutorial(slug: string): TutorialMeta | undefined {
  return tutorials.find((t) => t.slug === slug);
}
