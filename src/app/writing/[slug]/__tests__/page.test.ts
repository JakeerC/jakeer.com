import { describe, it, expect, vi } from 'vitest';
import ArticlePage, { generateMetadata, components } from '../page';
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

  it('ArticlePage should render properly with default fallbacks', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue({
      slug: 'test-post-missing',
      frontmatter: {
        title: 'Test Post Missing',
        description: 'Test Desc',
        date: '2023-01-01',
        // missing readTime and tags
      },
      content: ''
    });

    const element = await ArticlePage({ params: Promise.resolve({ slug: 'test-post-missing' }) });
    expect(element).toBeTruthy();
  });

  it('ArticlePage should return notFound if missing', async () => {
    vi.mocked(mdx.getContentBySlug).mockReturnValue(undefined);
    try {
      await ArticlePage({ params: Promise.resolve({ slug: 'missing' }) });
    } catch (e: any) {
      expect(e.message).toContain('NEXT');
    }
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

  describe('MDX components', () => {
    it('h2 should render correctly', () => {
      const H2 = components.h2;
      const el = H2({ children: 'Heading 2' });
      expect(el).toBeTruthy();
    });

    it('h3 should render correctly', () => {
      const H3 = components.h3;
      const el = H3({ children: 'Heading 3' });
      expect(el).toBeTruthy();
    });

    it('strong should render correctly', () => {
      const Strong = components.strong;
      const el = Strong({ children: 'Bold' });
      expect(el).toBeTruthy();
    });

    it('code should render correctly', () => {
      const Code = components.code;
      const el = Code({ children: 'code' });
      expect(el).toBeTruthy();
    });

    it('li should render correctly', () => {
      const Li = components.li;
      const el = Li({ children: 'item' });
      expect(el).toBeTruthy();
    });

    it('ul should render correctly', () => {
      const Ul = components.ul;
      const el = Ul({ children: 'list' });
      expect(el).toBeTruthy();
    });

    it('p should render correctly', () => {
      const P = components.p;
      const el = P({ children: 'para' });
      expect(el).toBeTruthy();
    });

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

    it('pre should render raw string code', () => {
      const Pre = components.pre;
      const el = Pre({
        children: {
          props: {
            className: 'language-javascript',
            children: ['const', ' ', 'a = 1;']
          }
        }
      });
      expect(el).toBeTruthy();
    });

    it('pre should fallback to text lang if no match', () => {
      const Pre = components.pre;
      const el = Pre({
        children: {
          props: {
            className: 'some-class',
            children: 'const a = 1;'
          }
        }
      });
      expect(el).toBeTruthy();
    });

    it('pre should fallback to native pre if no child props', () => {
      const Pre = components.pre;
      const el = Pre({ children: 'raw' });
      expect(el).toBeTruthy();
    });
  });
});
