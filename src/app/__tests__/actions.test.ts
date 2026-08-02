import { describe, it, expect, vi } from 'vitest';
import { getSearchData } from '../actions';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

describe('actions', () => {
  it('getSearchData should return properly formatted data and handle missing fields', async () => {
    vi.mocked(mdx.getAllContent).mockImplementation((type) => {
      if (type === 'writing') {
        return [
          { slug: 'post-1', frontmatter: { title: 'Post 1', description: 'Desc 1' }, content: '' },
          { slug: 'post-2', frontmatter: {}, content: '' }
        ];
      }
      if (type === 'snippets') {
        return [
          { slug: 'snippet-1', frontmatter: { title: 'Snippet 1', description: 'Snippet Desc 1', tags: ['react', 'nextjs'] }, content: '' },
          { slug: 'snippet-2', frontmatter: { title: 'Snippet 2', description: 'Snippet Desc 2' }, content: '' },
          { slug: 'snippet-3', frontmatter: { tags: [] }, content: '' }
        ];
      }
      if (type === 'tools') {
        return [
          { slug: 'tool-1', frontmatter: { name: 'Tool 1', description: 'Tool Desc 1', link: 'https://tool.com' }, content: '' },
          { slug: 'tool-2', frontmatter: { title: 'Tool 2 Title' }, content: '' },
          { slug: 'tool-3', frontmatter: {}, content: '' }
        ];
      }
      return [];
    });

    const data = await getSearchData();
    expect(data.posts).toHaveLength(2);
    expect(data.posts[0]).toEqual({ slug: 'post-1', title: 'Post 1', excerpt: 'Desc 1' });
    expect(data.posts[1]).toEqual({ slug: 'post-2', title: '', excerpt: '' });

    expect(data.snippets).toHaveLength(3);
    expect(data.snippets[0]).toEqual({ slug: 'snippet-1', title: 'Snippet 1', description: 'Snippet Desc 1', category: 'react' });
    expect(data.snippets[1]).toEqual({ slug: 'snippet-2', title: 'Snippet 2', description: 'Snippet Desc 2', category: 'general' });
    expect(data.snippets[2]).toEqual({ slug: 'snippet-3', title: '', description: '', category: 'general' });

    expect(data.tools).toHaveLength(3);
    expect(data.tools[0]).toEqual({ slug: 'tool-1', name: 'Tool 1', description: 'Tool Desc 1', link: 'https://tool.com' });
    expect(data.tools[1]).toEqual({ slug: 'tool-2', name: 'Tool 2 Title', description: '', link: '' });
    expect(data.tools[2]).toEqual({ slug: 'tool-3', name: '', description: '', link: '' });
  });
});
