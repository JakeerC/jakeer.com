import { describe, it, expect, vi } from "vitest";

vi.mock("../content-projections", () => ({
  normalizeTagSlug: (t: string) => t.toLowerCase(),
}));

import { scoreRelated, getRelatedItems, type ContentIdentity, type RelatedItem } from "../related-content";

const makeCurrent = (overrides?: Partial<ContentIdentity>): ContentIdentity => ({
  kind: "writing",
  slug: "current",
  tags: ["react", "typescript"],
  ...overrides,
});

const makeCandidate = (
  slug: string,
  tags: string[],
  overrides?: Partial<ContentIdentity>,
): RelatedItem & ContentIdentity => ({
  kind: "writing",
  slug,
  title: `Title ${slug}`,
  href: `/writing/${slug}`,
  tags,
  date: "2026-01-01",
  score: 0,
  topic: undefined,
  subtopic: undefined,
  ...overrides,
});

describe("scoreRelated", () => {
  it("returns 0 for the same item", () => {
    const item = makeCurrent();
    const sameCandidate = makeCandidate("current", ["react", "typescript"]);
    expect(scoreRelated(item, sameCandidate)).toBe(0);
  });

  it("scores shared tags positively", () => {
    const current = makeCurrent({ tags: ["react"] });
    const candidate = makeCandidate("other", ["react"]);
    expect(scoreRelated(current, candidate)).toBeGreaterThan(0);
  });

  it("notes topic match boosts score", () => {
    const current = makeCurrent({ kind: "note", topic: "react", subtopic: "Hooks", tags: [] });
    const candidate = makeCandidate("other-note", [], { kind: "note", topic: "react", subtopic: "Hooks" });
    expect(scoreRelated(current, candidate)).toBeGreaterThan(0);
  });

  it("returns 0 for unrelated items", () => {
    const current = makeCurrent({ tags: ["react"] });
    const candidate = makeCandidate("other", ["java"]);
    expect(scoreRelated(current, candidate)).toBe(0);
  });
});

describe("getRelatedItems", () => {
  it("excludes current item", () => {
    const current = makeCurrent();
    const candidates = [
      makeCandidate("current", ["react", "typescript"]),
      makeCandidate("other", ["react"]),
    ];
    const result = getRelatedItems(current, candidates);
    expect(result.find((r) => r.slug === "current")).toBeUndefined();
  });

  it("respects limit", () => {
    const current = makeCurrent({ tags: ["react"] });
    const candidates = Array.from({ length: 10 }, (_, i) =>
      makeCandidate(`post-${i}`, ["react"]),
    );
    const result = getRelatedItems(current, candidates, 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("returns empty array when no related items", () => {
    const current = makeCurrent({ tags: ["obscure-tag"] });
    const candidates = [makeCandidate("other", ["unrelated"])];
    const result = getRelatedItems(current, candidates);
    expect(result).toEqual([]);
  });
});
