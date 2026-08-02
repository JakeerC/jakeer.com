import { describe, it, expect, vi } from 'vitest';
import { submitContentToGitHub } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } })
    }
  })
}));

const mockCreateRef = vi.fn();
const mockCreateBlob = vi.fn().mockResolvedValue({ data: { sha: 'blob-sha' } });
const mockCreateTree = vi.fn().mockResolvedValue({ data: { sha: 'tree-sha' } });
const mockCreateCommit = vi.fn().mockResolvedValue({ data: { sha: 'commit-sha' } });
const mockUpdateRef = vi.fn();
const mockCreatePull = vi.fn().mockResolvedValue({ data: { html_url: 'https://github.com/pr/1' } });

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
  it('submitContentToGitHub should create a PR for a writing post', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = await submitContentToGitHub({
      title: 'Test Post',
      slug: 'test-post',
      category: 'writing',
      markdown: 'Some content',
      images: []
    });

    expect(result.prUrl).toBe('https://github.com/pr/1');
    expect(mockCreateTree).toHaveBeenCalledWith(expect.objectContaining({
      tree: expect.arrayContaining([
        expect.objectContaining({
          path: 'content/writing/test-post.mdx',
          type: 'blob'
        })
      ])
    }));
  });

  it('submitContentToGitHub should create a PR for a snippet with images', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = await submitContentToGitHub({
      title: 'Test Snippet',
      slug: 'test-snippet',
      category: 'snippets',
      markdown: 'Some content',
      images: [{ filename: 'test.png', base64Data: 'base64data' }]
    });

    expect(result.prUrl).toBe('https://github.com/pr/1');
    expect(mockCreateTree).toHaveBeenCalledWith(expect.objectContaining({
      tree: expect.arrayContaining([
        expect.objectContaining({
          path: 'content/snippets/test-snippet.mdx',
          type: 'blob'
        }),
        expect.objectContaining({
          path: 'public/assets/test.png',
          type: 'blob'
        })
      ])
    }));
    expect(mockCreateBlob).toHaveBeenCalledWith(expect.objectContaining({
      content: 'base64data',
      encoding: 'base64'
    }));
  });

  it('submitContentToGitHub should create a PR for a tool', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    const result = await submitContentToGitHub({
      title: 'Test Tool',
      slug: 'test-tool',
      category: 'tools',
      markdown: 'Some content',
      images: []
    });

    expect(result.prUrl).toBe('https://github.com/pr/1');
    expect(mockCreateTree).toHaveBeenCalledWith(expect.objectContaining({
      tree: expect.arrayContaining([
        expect.objectContaining({
          path: 'content/tools/test-tool.mdx',
          type: 'blob'
        })
      ])
    }));
  });
});
