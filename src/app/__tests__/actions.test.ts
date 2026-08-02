import { describe, it, expect, vi } from 'vitest';
import { getSearchData } from '../actions';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

describe('actions', () => {
  it('getSearchData should return properly formatted data', async () => {
    vi.mocked(mdx.getAllContent).mockImplementation((type) => {
      if (type === 'writing') {
        return [
          { slug: 'post-1', frontmatter: { title: 'Post 1', description: 'Desc 1' }, content: '' }
        ];
      }
      if (type === 'snippets') {
        return [
          { slug: 'snippet-1', frontmatter: { title: 'Snippet 1', description: 'Snippet Desc 1', tags: ['react', 'nextjs'] }, content: '' },
          { slug: 'snippet-2', frontmatter: { title: 'Snippet 2', description: 'Snippet Desc 2' }, content: '' }
        ];
      }
      if (type === 'tools') {
        return [
          { slug: 'tool-1', frontmatter: { name: 'Tool 1', description: 'Tool Desc 1', link: 'https://tool.com' }, content: '' }
        ];
      }
      return [];
    });

    const data = await getSearchData();
    expect(data.posts).toHaveLength(1);
    expect(data.posts[0]).toEqual({ slug: 'post-1', title: 'Post 1', excerpt: 'Desc 1' });

    expect(data.snippets).toHaveLength(2);
    expect(data.snippets[0]).toEqual({ slug: 'snippet-1', title: 'Snippet 1', description: 'Snippet Desc 1', category: 'react' });
    expect(data.snippets[1]).toEqual({ slug: 'snippet-2', title: 'Snippet 2', description: 'Snippet Desc 2', category: 'general' });

    expect(data.tools).toHaveLength(1);
    expect(data.tools[0]).toEqual({ slug: 'tool-1', name: 'Tool 1', description: 'Tool Desc 1', link: 'https://tool.com' });
  });
});
