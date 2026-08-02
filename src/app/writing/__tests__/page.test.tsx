import { describe, it, expect, vi } from 'vitest';
import WritingPage from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

vi.mock('../WritingClient', () => ({
  default: (props: any) => <div data-testid="writing-client" data-posts={JSON.stringify(props.posts)} />
}));

describe('WritingPage', () => {
  it('should render WritingClient with formatted posts', () => {
    vi.mocked(mdx.getAllContent).mockReturnValue([
      {
        slug: 'post-1',
        frontmatter: {
          title: 'Post 1',
          description: 'Desc 1',
          date: '2023-01-01',
          readTime: '5 min read',
          tags: ['react'],
          featured: true
        },
        content: ''
      }
    ]);

    const result = WritingPage() as any;
    expect(result.props.posts).toHaveLength(1);
    expect(result.props.posts[0]).toEqual({
      slug: 'post-1',
      title: 'Post 1',
      excerpt: 'Desc 1',
      date: '2023-01-01',
      readTime: '5 min read',
      tags: ['react'],
      featured: true
    });
  });
});
