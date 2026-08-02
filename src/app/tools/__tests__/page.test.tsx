import { describe, it, expect, vi } from 'vitest';
import ToolsPage from '../page';
import * as mdx from '@/lib/mdx';

vi.mock('@/lib/mdx', () => ({
  getAllContent: vi.fn(),
}));

vi.mock('../ToolsClient', () => ({
  default: (props: any) => <div data-testid="tools-client" data-tools={JSON.stringify(props.tools)} />
}));

describe('ToolsPage', () => {
  it('should render ToolsClient with formatted tools and handle missing frontmatter fields', () => {
    vi.mocked(mdx.getAllContent).mockReturnValue([
      {
        slug: 'tool-1',
        frontmatter: {
          name: 'Tool 1',
          description: 'Desc 1',
          category: 'Dev',
          link: 'https://tool1.com'
        },
        content: ''
      },
      {
        slug: 'tool-2',
        frontmatter: {
          title: 'Tool 2 Title',
          // missing description, category, link to hit falsy branches
        },
        content: ''
      },
      {
        slug: 'tool-3',
        frontmatter: {
          // missing name and title entirely
        },
        content: ''
      }
    ]);

    const result = ToolsPage() as any;
    expect(result.props.tools).toHaveLength(3);
    
    // Check first item (all fields present)
    expect(result.props.tools[0]).toEqual({
      slug: 'tool-1',
      name: 'Tool 1',
      description: 'Desc 1',
      category: 'Dev',
      link: 'https://tool1.com'
    });

    // Check second item (title fallback, default category)
    expect(result.props.tools[1]).toEqual({
      slug: 'tool-2',
      name: 'Tool 2 Title',
      description: '',
      category: 'Development',
      link: ''
    });

    // Check third item (empty fallbacks)
    expect(result.props.tools[2]).toEqual({
      slug: 'tool-3',
      name: '',
      description: '',
      category: 'Development',
      link: ''
    });
  });
});
