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
  it('should render ToolsClient with formatted tools', () => {
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
      }
    ]);

    const result = ToolsPage() as any;
    expect(result.props.tools).toHaveLength(1);
    expect(result.props.tools[0]).toEqual({
      slug: 'tool-1',
      name: 'Tool 1',
      description: 'Desc 1',
      category: 'Dev',
      link: 'https://tool1.com'
    });
  });
});
