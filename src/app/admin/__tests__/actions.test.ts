import { describe, it, expect, vi } from "vitest";
// Imports are at the bottom

const { mockSelect, mockOrder, mockSingle, mockEq, mockOr, mockNot, mockDelete, mockUpdate, mockUpload, mockList, mockGetPublicUrl } =
  vi.hoisted(() => ({
    mockSelect: vi.fn(),
    mockOrder: vi.fn(),
    mockSingle: vi.fn(),
    mockEq: vi.fn(),
    mockOr: vi.fn(),
    mockNot: vi.fn(),
    mockDelete: vi.fn(),
    mockUpdate: vi.fn(),
    mockUpload: vi.fn(),
    mockList: vi.fn(),
    mockGetPublicUrl: vi.fn(),
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
    storage: {
      from: vi.fn().mockReturnValue({
        upload: mockUpload,
        list: mockList,
        getPublicUrl: mockGetPublicUrl,
      })
    }
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
const mockUpdatePull = vi.fn().mockResolvedValue({ data: { state: "closed" } });
const mockDeleteRef = vi.fn().mockResolvedValue({ data: {} });
const mockGetPull = vi.fn().mockResolvedValue({ data: { state: "closed", merged: false } });

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
          deleteRef: mockDeleteRef,
        },
        pulls: {
          get: mockGetPull,
          create: mockCreatePull,
          merge: mockMergePull,
          update: mockUpdatePull,
        },
      };
    },
  };
});

import {
  getDrafts,
  saveDraftAction,
  createPRForContent,
  mergePRAction,
  archiveDraftAction,
  unarchiveDraftAction,
  deleteDraftAction,
  syncDraftsAction,
  checkAssetExistsAction,
  uploadAssetAction,
  getAssetsAction,
} from "../actions";

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const chainableQuery: any = {
      order: mockOrder,
      eq: mockEq,
      or: mockOr,
      not: mockNot,
      single: mockSingle,
    };
    chainableQuery.then = (resolve: any) => resolve({ data: [] });
    
    mockSelect.mockReturnValue(chainableQuery);
    mockOrder.mockReturnValue(chainableQuery);
    mockEq.mockReturnValue(chainableQuery);
    mockOr.mockReturnValue(chainableQuery);
    mockNot.mockReturnValue(chainableQuery);
    
    mockSingle.mockResolvedValue({ data: { id: "test-id" } });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
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
    const chainableQuery = mockSelect();
    chainableQuery.then = (res: any) => res({ data: [{ id: "1" }], error: null });
    
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

  it("checkAssetExistsAction should return true if asset exists", async () => {
    mockList.mockResolvedValueOnce({ data: [{ name: "test.png" }], error: null });
    const exists = await checkAssetExistsAction("test.png");
    expect(mockList).toHaveBeenCalledWith("", { search: "test.png" });
    expect(exists).toBe(true);
  });

  it("checkAssetExistsAction should return false if asset does not exist", async () => {
    mockList.mockResolvedValueOnce({ data: [], error: null });
    const exists = await checkAssetExistsAction("test.png");
    expect(exists).toBe(false);
  });

  it("uploadAssetAction should upload file and return public URL", async () => {
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", "test.png");
    formData.append("overwrite", "false");

    mockUpload.mockResolvedValueOnce({ data: { path: "test.png" }, error: null });
    mockGetPublicUrl.mockReturnValueOnce({ data: { publicUrl: "https://url.com/test.png" } });

    const result = await uploadAssetAction(formData);
    
    expect(mockUpload).toHaveBeenCalledWith("test.png", file, { upsert: false });
    expect(result.success).toBe(true);
    expect(result.url).toBe("https://url.com/test.png");
  });

  it("getAssetsAction should return list of assets", async () => {
    mockList.mockResolvedValueOnce({ 
      data: [{ id: "1", name: "test.png", updated_at: "2023-01-01" }], 
      error: null 
    });
    mockGetPublicUrl.mockReturnValueOnce({ data: { publicUrl: "https://url.com/test.png" } });

    const assets = await getAssetsAction();
    
    expect(mockList).toHaveBeenCalled();
    expect(assets).toHaveLength(1);
    expect(assets[0].name).toBe("test.png");
    expect(assets[0].url).toBe("https://url.com/test.png");
  });

  it("getAssetsAction should handle missing updated_at and sort correctly", async () => {
    mockList.mockResolvedValueOnce({ 
      data: [
        { id: "1", name: "first.png", updated_at: null },
        { id: "2", name: "second.png", updated_at: "2023-01-01" }
      ], 
      error: null 
    });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: "https://url.com/mock.png" } });

    const assets = await getAssetsAction();
    
    expect(assets).toHaveLength(2);
    // "second.png" should come first because it has a valid date, whereas "first.png" defaults to epoch 0
    expect(assets[0].name).toBe("second.png");
    expect(assets[1].name).toBe("first.png");
  });

  it("archiveDraftAction should archive and close PR if exists", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    mockSingle.mockResolvedValueOnce({ data: { pr_number: 42 }, error: null });
    
    const result = await archiveDraftAction("test-id");
    
    expect(mockUpdatePull).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 42, state: "closed" })
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ is_archived: true })
    );
    expect(result.success).toBe(true);
  });

  it("unarchiveDraftAction should set is_archived to false", async () => {
    
    const result = await unarchiveDraftAction("test-id");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ is_archived: false })
    );
    expect(result.success).toBe(true);
  });

  it("deleteDraftAction should delete branch and draft", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    mockSingle.mockResolvedValueOnce({ data: { branch_name: "test-branch" }, error: null });
    
    const result = await deleteDraftAction("test-id");
    
    expect(mockDeleteRef).toHaveBeenCalledWith(
      expect.objectContaining({ ref: "heads/test-branch" })
    );
    expect(mockDelete).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it("syncDraftsAction should update is_archived for closed PRs", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    
    // Mock getDrafts to return a draft with a PR number
    mockSelect.mockReturnValueOnce({
      or: vi.fn().mockReturnValue({
        not: vi.fn().mockResolvedValue({
          data: [{ id: "test-id", pr_number: 42 }],
          error: null
        })
      })
    });

    const result = await syncDraftsAction();
    
    expect(mockGetPull).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 42 })
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ is_archived: true })
    );
    expect(result.success).toBe(true);
  });
});

