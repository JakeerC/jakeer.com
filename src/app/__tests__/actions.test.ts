import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/content-projections", () => ({
  getWritingProjections: () => [
    {
      slug: "post-1",
      title: "Post One",
      description: "Desc",
      tags: ["react"],
      date: "2026-01-01",
      readTime: "5 min",
    },
  ],
  getSnippetProjections: () => [
    {
      slug: "hook-one",
      title: "Hook",
      description: "",
      tags: ["react"],
      category: "react",
      date: "",
      lang: "typescript",
      level: "BEGINNER",
    },
  ],
  getToolProjections: () => [
    {
      slug: "tool-1",
      name: "My Tool",
      description: "A tool",
      category: "Development",
      link: "https://example.com",
    },
  ],
  normalizeTagSlug: (t: string) => t.toLowerCase(),
}));

vi.mock("@/lib/mdx", () => ({
  getAllKnowledgeBases: () => [
    {
      slug: "react",
      label: "React",
      description: "React notes",
      icon: "React",
      color: "blue",
      displayOrder: 1,
      principles: [],
      topics: [
        {
          label: "Hooks",
          notes: [{ slug: "use-effect", title: "useEffect", minutes: 5 }],
        },
      ],
    },
  ],
}));

vi.mock("@/lib/constants", () => ({
  projects: [
    {
      name: "My Project",
      description: "A project",
      tags: ["react"],
      github: "",
      demo: "",
      status: "Active",
      features: [],
    },
  ],
}));

import { getSearchData } from "../actions";

describe("getSearchData", () => {
  it("returns results for all content kinds", async () => {
    const { results } = await getSearchData();
    const kinds = results.map((r) => r.kind);
    expect(kinds).toContain("writing");
    expect(kinds).toContain("snippet");
    expect(kinds).toContain("tool");
    expect(kinds).toContain("note");
    expect(kinds).toContain("project");
  });

  it("snippet href points to detail URL", async () => {
    const { results } = await getSearchData();
    const snippet = results.find((r) => r.kind === "snippet");
    expect(snippet?.href).toBe("/snippets/react/hook-one");
  });

  it("writing href includes slug", async () => {
    const { results } = await getSearchData();
    const writing = results.find((r) => r.kind === "writing");
    expect(writing?.href).toBe("/writing/post-1");
  });

  it("note href includes topic and slug", async () => {
    const { results } = await getSearchData();
    const note = results.find((r) => r.kind === "note");
    expect(note?.href).toBe("/notes/react/use-effect");
  });

  it("project href points to /projects", async () => {
    const { results } = await getSearchData();
    const project = results.find((r) => r.kind === "project");
    expect(project?.href).toBe("/projects");
  });
});
