"use server";

import {
  getWritingProjections,
  getSnippetProjections,
  getToolProjections,
  normalizeTagSlug,
} from "@/lib/content-projections";
import { getAllKnowledgeBases } from "@/lib/mdx";
import { projects } from "@/lib/constants";

export type SearchResult =
  | { kind: "writing"; slug: string; title: string; description: string; href: string; tags: string[] }
  | { kind: "snippet"; slug: string; title: string; description: string; href: string; tags: string[]; category: string }
  | { kind: "note"; slug: string; title: string; description: string; href: string; tags: string[]; topic: string; subtopic: string }
  | { kind: "tool"; slug: string; title: string; description: string; href: string; external: true; link: string }
  | { kind: "project"; slug: string; title: string; description: string; href: string; tags: string[] };

export interface SearchData {
  results: SearchResult[];
}

export async function getSearchData(): Promise<SearchData> {
  const writingResults: SearchResult[] = getWritingProjections().map((p) => ({
    kind: "writing" as const,
    slug: p.slug,
    title: p.title,
    description: p.description,
    href: `/writing/${p.slug}`,
    tags: p.tags,
  }));

  const snippetResults: SearchResult[] = getSnippetProjections().map((s) => ({
    kind: "snippet" as const,
    slug: s.slug,
    title: s.title,
    description: s.description,
    href: `/snippets/${normalizeTagSlug(s.tags[0] ?? "general")}/${s.slug}`,
    tags: s.tags,
    category: s.category,
  }));

  const toolResults: SearchResult[] = getToolProjections().map((t) => ({
    kind: "tool" as const,
    slug: t.slug,
    title: t.name,
    description: t.description,
    href: t.link,
    external: true as const,
    link: t.link,
  }));

  const kbs = getAllKnowledgeBases();
  const noteResults: SearchResult[] = [];
  for (const kb of kbs) {
    for (const topic of kb.topics) {
      for (const note of topic.notes) {
        noteResults.push({
          kind: "note" as const,
          slug: note.slug,
          title: note.title,
          description: "",
          href: `/notes/${kb.slug}/${note.slug}`,
          tags: [],
          topic: kb.slug,
          subtopic: topic.label,
        });
      }
    }
  }

  const projectResults: SearchResult[] = projects.map((p) => ({
    kind: "project" as const,
    slug: p.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
    title: p.name,
    description: p.description,
    href: "/projects",
    tags: p.tags,
  }));

  return {
    results: [
      ...writingResults,
      ...snippetResults,
      ...toolResults,
      ...noteResults,
      ...projectResults,
    ],
  };
}
