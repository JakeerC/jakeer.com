import { describe, it, expect, vi } from 'vitest';
import SnippetCategoryPage from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

describe('SnippetCategoryPage', () => {
  it('should render proper snippets', async () => {
    vi.mocked(mdx.getAllContent).mockReturnValue([
      {
        slug: 'test-snippet',
        frontmatter: {
          title: 'Test Snippet',
          description: 'Desc',
          tags: ['react'],
          level: 'ADVANCED',
          date: '2023-01-01'
        },
        content: ''
      }
    ]);

    const result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) }) as any;
    expect(result).toBeTruthy();
  });
});
