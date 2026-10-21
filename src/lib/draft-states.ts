export type DraftStatus =
  | "draft"
  | "branch_created"
  | "pr_open"
  | "merged"
  | "archived"
  | "failed";

export const DRAFT_STATUSES: DraftStatus[] = [
  "draft",
  "branch_created",
  "pr_open",
  "merged",
  "archived",
  "failed",
];

export const VALID_TRANSITIONS: Record<DraftStatus, readonly DraftStatus[]> = {
  draft: ["branch_created", "archived", "failed"],
  branch_created: ["branch_created", "pr_open", "archived", "failed"],
  pr_open: ["pr_open", "merged", "failed", "archived"],
  merged: ["archived"],
  failed: ["draft", "branch_created", "pr_open", "archived"],
  archived: ["draft"],
};

export function isValidTransition(from: DraftStatus, to: DraftStatus): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
