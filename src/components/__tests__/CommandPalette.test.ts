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
  useTheme: vi.fn(() => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  })),
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

  it('triggers commands on selection', async () => {
    const setOpen = vi.fn();
    
    // Mock clipboard and window.open
    const originalClipboard = navigator.clipboard;
    const originalOpen = window.open;
    
    const mockWriteText = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
    
    const mockWindowOpen = vi.fn();
    window.open = mockWindowOpen;

    render(<CommandPalette open={true} setOpen={setOpen} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
    
    const clickOption = (text: string) => {
      const el = screen.getByText(text);
      el.click();
    };

    // Test writing
    clickOption('Test Post');
    expect(mockPush).toHaveBeenCalledWith('/writing/test-post');
    expect(setOpen).toHaveBeenCalledWith(false);

    // Test tools
    clickOption('Test Tool');
    expect(mockWindowOpen).toHaveBeenCalledWith('https://test.com', '_blank');

    // Test snippets
    clickOption('Test Snippet');
    expect(mockPush).toHaveBeenCalledWith('/snippets/react');

    // Test Actions
    clickOption('Go to Home');
    expect(mockPush).toHaveBeenCalledWith('/');
    
    clickOption('Go to Blogs');
    expect(mockPush).toHaveBeenCalledWith('/writing');
    
    clickOption('Go to Snippets');
    expect(mockPush).toHaveBeenCalledWith('/snippets');
    
    clickOption('Go to Tools');
    expect(mockPush).toHaveBeenCalledWith('/tools');

    clickOption('Switch to Dark Mode');
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    
    clickOption('Copy Current URL');
    expect(mockWriteText).toHaveBeenCalled();

    clickOption('mcp');
    // Just verifying it doesn't crash
    
    // Restore mocks
    Object.assign(navigator, { clipboard: originalClipboard });
    window.open = originalOpen;
  });

  it('handles switch to light mode when theme is dark', async () => {
    // Override the mock for this specific test
    const { useTheme } = await import('next-themes');
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    } as any);

    const setOpen = vi.fn();
    render(<CommandPalette open={true} setOpen={setOpen} />);
    
    const el = screen.getByText('Switch to Light Mode');
    el.click();
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
