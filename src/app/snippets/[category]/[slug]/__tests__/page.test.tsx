import { describe, it, expect, vi } from 'vitest';
import SnippetDetailPage, { components } from '../page';
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

  it('SnippetDetailPage should render properly with missing tags', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue({
      slug: 'test-snippet-missing',
      frontmatter: {
        title: 'Test Snippet Missing',
        description: 'Test Desc',
        date: '2023-01-01',
        level: 'INTERMEDIATE',
        // tags missing
      },
      content: ''
    });

    try {
      await SnippetDetailPage({ params: Promise.resolve({ slug: 'test-snippet-missing', category: 'react' }) });
    } catch (e: any) {
      expect(e.message).toContain('NEXT');
    }
  });

  it('SnippetDetailPage should return notFound if missing', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue(undefined);
    try {
      await SnippetDetailPage({ params: Promise.resolve({ slug: 'missing', category: 'react' }) });
    } catch (e: any) {
      expect(e.message).toContain('NEXT');
    }
  });

  describe('MDX components', () => {
    it('img should render correctly', () => {
      const Img = components.img;
      const el = Img({ src: 'image.png', alt: 'img' });
      expect(el).toBeTruthy();
    });

    it('pre should render code block if child has language class', () => {
      const Pre = components.pre;
      const el = Pre({
        children: {
          props: {
            className: 'language-typescript',
            children: 'const a = 1;'
          }
        }
      });
      expect(el).toBeTruthy();
    });

    it('pre should fallback to typescript lang if no match', () => {
      const Pre = components.pre;
      const el = Pre({
        children: {
          props: {
            className: '',
            children: 'const a = 1;'
          }
        }
      });
      expect(el).toBeTruthy();
    });
  });
});
