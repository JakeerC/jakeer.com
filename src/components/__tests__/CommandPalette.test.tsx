import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommandPalette from '../CommandPalette';

// Mock the router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  }),
}));

// Mock the action
vi.mock('@/app/actions', () => ({
  getSearchData: vi.fn().mockResolvedValue({
    posts: [{ slug: 'test-post', title: 'Test Post', excerpt: 'Excerpt' }],
    snippets: [{ title: 'Test Snippet', category: 'React', description: 'Desc' }],
    tools: [{ slug: 'test-tool', name: 'Test Tool', link: 'https://test.com', description: 'Desc' }],
  }),
}));

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', async () => {
    const setOpen = vi.fn();
    render(<CommandPalette open={true} setOpen={setOpen} />);
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search blogs, snippets, tools, anything...')).toBeInTheDocument();
    
    // Wait for the data to be loaded and rendered
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('Test Tool')).toBeInTheDocument();
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    });
  });

  it('does not render when closed', async () => {
    const setOpen = vi.fn();
    render(<CommandPalette open={false} setOpen={setOpen} />);
    
    // Dialog shouldn't show its content
    expect(screen.queryByPlaceholderText('Search blogs, snippets, tools, anything...')).not.toBeInTheDocument();
    
    // Wait for the data fetch to complete to avoid act warning
    await act(async () => {
      await Promise.resolve(); // flush promises
    });
  });
});
