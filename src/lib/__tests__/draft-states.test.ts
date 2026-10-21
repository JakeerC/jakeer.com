import { describe, it, expect } from "vitest";
import {
  DRAFT_STATUSES,
  VALID_TRANSITIONS,
  isValidTransition,
} from "../draft-states";

describe("draft-states state machine", () => {
  it("defines all expected draft statuses", () => {
    expect(DRAFT_STATUSES).toEqual([
      "draft",
      "branch_created",
      "pr_open",
      "merged",
      "archived",
      "failed",
    ]);
  });

  it("defines transition rules for every status in VALID_TRANSITIONS", () => {
    for (const status of DRAFT_STATUSES) {
      expect(Array.isArray(VALID_TRANSITIONS[status])).toBe(true);
    }
  });

  it("validates identity transitions (same state to same state)", () => {
    for (const status of DRAFT_STATUSES) {
      expect(isValidTransition(status, status)).toBe(true);
    }
  });

  it("allows valid forward transitions", () => {
    expect(isValidTransition("draft", "branch_created")).toBe(true);
    expect(isValidTransition("branch_created", "pr_open")).toBe(true);
    expect(isValidTransition("pr_open", "merged")).toBe(true);
    expect(isValidTransition("merged", "archived")).toBe(true);
  });

  it("allows recovery transitions from failed", () => {
    expect(isValidTransition("failed", "draft")).toBe(true);
    expect(isValidTransition("failed", "branch_created")).toBe(true);
    expect(isValidTransition("failed", "pr_open")).toBe(true);
    expect(isValidTransition("failed", "archived")).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(isValidTransition("draft", "merged")).toBe(false);
    expect(isValidTransition("merged", "pr_open")).toBe(false);
    expect(isValidTransition("archived", "merged")).toBe(false);
  });
});
