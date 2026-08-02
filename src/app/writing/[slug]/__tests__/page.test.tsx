import { describe, it, expect, vi } from 'vitest';
import ArticlePage, { generateMetadata } from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getContentBySlug: vi.fn(),
}));

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: () => <div data-testid="mdx-remote" />
}));

describe('ArticlePage', () => {
  it('generateMetadata should return metadata', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue({
      slug: 'test-post',
      frontmatter: {
        title: 'Test Post',
        description: 'Test Desc',
      },
      content: ''
    });

    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) });
    expect(meta).toEqual({ title: 'Test Post', description: 'Test Desc' });
  });

  it('generateMetadata should return Not Found if post missing', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue(undefined);
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'missing' }) });
    expect(meta).toEqual({ title: 'Not Found' });
  });

  it('ArticlePage should render properly', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue({
      slug: 'test-post',
      frontmatter: {
        title: 'Test Post',
        description: 'Test Desc',
        date: '2023-01-01',
        readTime: '10 min',
        tags: ['react']
      },
      content: ''
    });

    const element = await ArticlePage({ params: Promise.resolve({ slug: 'test-post' }) });
    expect(element).toBeTruthy();
  });
});
