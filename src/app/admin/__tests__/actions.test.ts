import { describe, it, expect, vi } from 'vitest';
import { saveDraftAction, createPRForContent } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } })
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 'test-id' } })
        })
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({})
      })
    })
  })
}));

const mockCreateRef = vi.fn();
const mockCreateBlob = vi.fn().mockResolvedValue({ data: { sha: 'blob-sha' } });
const mockCreateTree = vi.fn().mockResolvedValue({ data: { sha: 'tree-sha' } });
const mockCreateCommit = vi.fn().mockResolvedValue({ data: { sha: 'commit-sha' } });
const mockUpdateRef = vi.fn();
const mockCreatePull = vi.fn().mockResolvedValue({ data: { html_url: 'https://github.com/pr/1', number: 1 } });

vi.mock('octokit', () => {
  return {
    Octokit: class {
      rest = {
        repos: {
          get: vi.fn().mockResolvedValue({ data: { default_branch: 'main' } })
        },
        git: {
          getRef: vi.fn().mockResolvedValue({ data: { object: { sha: 'base-sha' } } }),
          createRef: mockCreateRef,
          createBlob: mockCreateBlob,
          createTree: mockCreateTree,
          createCommit: mockCreateCommit,
          updateRef: mockUpdateRef
        },
        pulls: {
          create: mockCreatePull
        }
      }
    }
  };
});

describe('admin actions', () => {
  it('saveDraftAction should push to github and save to supabase', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = await saveDraftAction({
      title: 'Test Post',
      slug: 'test-post',
      category: 'writing',
      markdown: 'Some content',
      metadata: {}
    });

    expect(result.branchName).toMatch(/content\/writing-test-post-/);
    expect(mockCreateTree).toHaveBeenCalledWith(expect.objectContaining({
      tree: expect.arrayContaining([
        expect.objectContaining({
          path: 'content/writing/test-post.mdx',
          type: 'blob'
        })
      ])
    }));
  });

  it('createPRForContent should create a PR', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = await createPRForContent('test-id', 'test-branch', 'Test Post', 'writing');

    expect(result.prUrl).toBe('https://github.com/pr/1');
    expect(result.prNumber).toBe(1);
    expect(mockCreatePull).toHaveBeenCalled();
  });
});
