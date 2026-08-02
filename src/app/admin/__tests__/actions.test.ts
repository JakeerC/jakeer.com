import { describe, it, expect, vi } from "vitest";
// Imports are at the bottom

const { mockSelect, mockOrder, mockSingle, mockEq, mockDelete, mockUpdate } =
  vi.hoisted(() => ({
    mockSelect: vi.fn(),
    mockOrder: vi.fn(),
    mockSingle: vi.fn(),
    mockEq: vi.fn(),
    mockDelete: vi.fn(),
    mockUpdate: vi.fn(),
  }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi
        .fn()
        .mockResolvedValue({ data: { user: { id: "test-user" } } }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      }),
      update: mockUpdate,
      select: mockSelect,
      delete: mockDelete,
    }),
  }),
}));

const mockCreateRef = vi.fn();
const mockCreateBlob = vi.fn().mockResolvedValue({ data: { sha: "blob-sha" } });
const mockCreateTree = vi.fn().mockResolvedValue({ data: { sha: "tree-sha" } });
const mockCreateCommit = vi
  .fn()
  .mockResolvedValue({ data: { sha: "commit-sha" } });
const mockUpdateRef = vi.fn();
const mockCreatePull = vi
  .fn()
  .mockResolvedValue({
    data: { html_url: "https://github.com/pr/1", number: 1 },
  });
const mockMergePull = vi.fn().mockResolvedValue({ data: { merged: true } });

vi.mock("octokit", () => {
  return {
    Octokit: class {
      rest = {
        repos: {
          get: vi.fn().mockResolvedValue({ data: { default_branch: "main" } }),
        },
        git: {
          getRef: vi
            .fn()
            .mockResolvedValue({ data: { object: { sha: "base-sha" } } }),
          createRef: mockCreateRef,
          createBlob: mockCreateBlob,
          createTree: mockCreateTree,
          createCommit: mockCreateCommit,
          updateRef: mockUpdateRef,
        },
        pulls: {
          create: mockCreatePull,
          merge: mockMergePull,
        },
      };
    },
  };
});

import {
  getDrafts,
  getDraftById,
  saveDraftAction,
  createPRForContent,
  mergePRAction,
} from "../actions";

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockResolvedValue({ data: { id: "test-id" } });
    mockUpdate.mockReturnValue({ eq: mockEq.mockResolvedValue({}) });
    mockSelect.mockReturnValue({
      order: mockOrder.mockResolvedValue({ data: [] }),
      eq: mockEq.mockReturnValue({
        single: mockSingle.mockResolvedValue({ data: {} }),
      }),
    });
    mockDelete.mockReturnValue({ eq: mockEq.mockResolvedValue({}) });
  });

  it("saveDraftAction should push to github and save to supabase", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    const result = await saveDraftAction({
      title: "Test Post",
      slug: "test-post",
      category: "writing",
      markdown: "Some content",
      metadata: {},
    });

    expect(result.branchName).toMatch(/content\/writing-test-post-/);
    expect(mockCreateTree).toHaveBeenCalledWith(
      expect.objectContaining({
        tree: expect.arrayContaining([
          expect.objectContaining({
            path: "content/writing/test-post.mdx",
            type: "blob",
          }),
        ]),
      }),
    );
  });

  it("saveDraftAction with id updates existing draft", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    const result = await saveDraftAction({
      id: "existing-id",
      title: "Test Post",
      slug: "test-post",
      category: "snippets",
      markdown: "Some content",
      branchName: "existing-branch",
      metadata: { images: [{ filename: "test.png", base64Data: "abc" }] },
    });

    expect(result.id).toBe("existing-id");
    expect(result.branchName).toBe("existing-branch");
    expect(mockEq).toHaveBeenCalledWith("id", "existing-id");
  });

  it("saveDraftAction with tools category", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    await saveDraftAction({
      title: "Test Tool",
      slug: "test-tool",
      category: "tools",
      markdown: "Some content",
      metadata: {},
    });

    expect(mockCreateTree).toHaveBeenCalledWith(
      expect.objectContaining({
        tree: expect.arrayContaining([
          expect.objectContaining({
            path: "content/tools/test-tool.mdx",
            type: "blob",
          }),
        ]),
      }),
    );
  });

  it("createPRForContent should create a PR", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    const result = await createPRForContent(
      "test-id",
      "test-branch",
      "Test Post",
      "writing",
    );

    expect(result.prUrl).toBe("https://github.com/pr/1");
    expect(result.prNumber).toBe(1);
    expect(mockCreatePull).toHaveBeenCalled();
  });

  it("getDrafts should return drafts", async () => {
    mockOrder.mockResolvedValueOnce({ data: [{ id: "1" }] });
    const data = await getDrafts();
    expect(data).toHaveLength(1);
  });

  it("mergePRAction should merge and delete draft", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    const result = await mergePRAction("1", 42);
    expect(mockMergePull).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 42 }),
    );
    expect(mockEq).toHaveBeenCalledWith("id", "1");
    expect(result.success).toBe(true);
  });
});
