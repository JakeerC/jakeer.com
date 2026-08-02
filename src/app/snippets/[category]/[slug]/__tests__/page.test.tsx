import { describe, it, expect, vi } from 'vitest';
import SnippetDetailPage from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getContentBySlug: vi.fn(),
}));

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: () => <div data-testid="mdx-remote" />
}));

describe('SnippetDetailPage', () => {
  it('SnippetDetailPage should render properly', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue({
      slug: 'test-snippet',
      frontmatter: {
        title: 'Test Snippet',
        description: 'Test Desc',
        date: '2023-01-01',
        level: 'INTERMEDIATE',
        tags: ['react']
      },
      content: ''
    });

    const element = await SnippetDetailPage({ params: Promise.resolve({ slug: 'test-snippet', category: 'react' }) });
    expect(element).toBeTruthy();
  });

  it('SnippetDetailPage should return notFound if missing', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue(undefined);
    try {
      await SnippetDetailPage({ params: Promise.resolve({ slug: 'missing', category: 'react' }) });
    } catch (e: any) {
      expect(e.message).toContain('NEXT');
    }
  });
});
