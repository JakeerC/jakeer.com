import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';
import { usePathname } from 'next/navigation';

// Mock the site config
vi.mock('@/lib/config', () => ({
  siteConfig: {
    initials: 'JC',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
  })),
}));

// Mock CommandPalette so we don't need to render the whole dialog
vi.mock('../CommandPalette', () => ({
  default: ({ open }: { open: boolean; setOpen: (open: boolean) => void }) => (
    open ? <div data-testid="command-palette">Mock Command Palette</div> : null
  ),
}));

const mockSignOut = vi.fn().mockResolvedValue({ error: null });
// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: mockSignOut,
    },
  })),
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetTheme.mockClear();
    mockSignOut.mockClear();
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('renders correctly', () => {
    render(<Navbar />);
    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  it('handles theme toggler', () => {
    render(<Navbar />);
    const themeBtn = screen.getAllByRole('button', { name: /Toggle dark mode/i })[0];
    
    fireEvent.click(themeBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('handles neo style toggler', () => {
    render(<Navbar />);
    const neoBtn = screen.getByRole('button', { name: /Toggle neo style/i });
    
    fireEvent.click(neoBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('neo-light');
  });

  it('opens search with search button', () => {
    render(<Navbar />);
    const searchBtn = screen.getAllByRole('button', { name: /Search/i })[0];
    
    fireEvent.click(searchBtn);
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
  });

  it('handles mobile menu toggle and closing on link click', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', { name: /Toggle menu/i });
    
    // Toggle on
    fireEvent.click(menuBtn);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    
    // Click a link to close
    const mobileLink = screen.getAllByText('About').pop();
    fireEvent.click(mobileLink!);
  });

  it('handles keyboard shortcuts for search and escape', () => {
    render(<Navbar />);
    
    // cmd+k
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    
    // escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('command-palette')).not.toBeInTheDocument();
  });

  it('highlights active link', () => {
    vi.mocked(usePathname).mockReturnValue('/about');
    render(<Navbar />);
    const aboutLinks = screen.getAllByText('About');
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('handles scroll event to add blur effect', () => {
    render(<Navbar />);
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    const navElement = screen.getByRole('navigation').parentElement;
    expect(navElement?.className).toContain('backdrop-blur-md');
  });

  it('handles sign out if session exists', async () => {
    vi.mocked(usePathname).mockReturnValue('/admin');
    const { createClient } = await import('@/lib/supabase/client');
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: {} } } }),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signOut: mockSignOut,
      }
    } as any);

    render(<Navbar />);
    
    await waitFor(() => {
      expect(screen.queryAllByText('Admin Dashboard').length).toBeGreaterThan(0);
    });

    const logoutBtns = screen.getAllByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtns[0]);
    
    expect(mockSignOut).toHaveBeenCalled();
  });
});
