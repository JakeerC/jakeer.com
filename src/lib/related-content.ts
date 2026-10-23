import { normalizeTagSlug } from "./content-projections";

export interface RelatedItem {
  kind: "writing" | "snippet" | "note";
  slug: string;
  title: string;
  href: string;
  tags: string[];
  date?: string;
  score: number;
}

export interface ContentIdentity {
  kind: "writing" | "snippet" | "note";
  slug: string;
  tags: string[];
  topic?: string;
  subtopic?: string;
  date?: string;
}

/** Score candidate vs current. Returns 0 if same item. */
export function scoreRelated(
  current: ContentIdentity,
  candidate: ContentIdentity & Pick<RelatedItem, "slug" | "kind">,
): number {
  if (candidate.kind === current.kind && candidate.slug === current.slug) return 0;

  const currentTags = current.tags.map(normalizeTagSlug);
  const candidateTags = candidate.tags.map(normalizeTagSlug);

  let score = 0;
  for (const tag of currentTags) {
    if (candidateTags.includes(tag)) score += 2;
  }

  if (current.topic && candidate.topic) {
    if (current.topic === candidate.topic) score += 3;
    if (current.subtopic && current.subtopic === candidate.subtopic) score += 2;
  }

  return score;
}

/** Get up to `limit` related items sorted by score desc → date desc → title asc. */
export function getRelatedItems(
  current: ContentIdentity,
  candidates: Array<RelatedItem & ContentIdentity>,
  limit = 4,
): RelatedItem[] {
  return candidates
    .map((c) => ({ ...c, score: scoreRelated(current, c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
