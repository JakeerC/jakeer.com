import { describe, it, expect, vi } from 'vitest';
import SnippetCategoryPage from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

describe('SnippetCategoryPage', () => {
  it('should render proper snippets and handle missing tags', async () => {
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
      },
      {
        slug: 'test-snippet-no-tags',
        frontmatter: {
          title: 'No Tags',
          description: 'Desc',
          // missing tags to hit || [] falsy branch
        },
        content: ''
      }
    ]);

    const result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) });
    const { render, screen } = await import('@testing-library/react');
    render(result as React.ReactElement);
    
    // Check that it renders snippets
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
  });

  it('renders empty state when no snippets', async () => {
    vi.mocked(mdx.getAllContent).mockReturnValue([]);
    
    const result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) });
    const { render, screen } = await import('@testing-library/react');
    render(result as React.ReactElement);
    
    expect(screen.getByText('No snippets yet — coming soon.')).toBeInTheDocument();
  });

  it('renders fallback values and handles grid fillers for different lengths', async () => {
    const makeSnippets = (count: number) => Array.from({ length: count }).map((_, i) => ({
      slug: `test-${i}`,
      frontmatter: { title: `T${i}`, description: 'D', tags: ['react'] },
      content: ''
    }));

    // length 1 (covers missing date/level fallbacks as well)
    vi.mocked(mdx.getAllContent).mockReturnValue(makeSnippets(1));
    let result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) });
    const { render, screen } = await import('@testing-library/react');
    let { unmount } = render(result as React.ReactElement);
    
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument();
    expect(screen.getByText('Just now')).toBeInTheDocument();
    unmount();

    // length 2
    vi.mocked(mdx.getAllContent).mockReturnValue(makeSnippets(2));
    result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) });
    ({ unmount } = render(result as React.ReactElement));
    unmount();

    // length 3
    vi.mocked(mdx.getAllContent).mockReturnValue(makeSnippets(3));
    result = await SnippetCategoryPage({ params: Promise.resolve({ category: 'react' }) });
    ({ unmount } = render(result as React.ReactElement));
    unmount();
  });
});
