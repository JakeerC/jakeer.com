import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';

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
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
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

// Mock CommandPalette so we don't need to render the whole dialog
vi.mock('../CommandPalette', () => ({
  default: ({ open, setOpen }: any) => (
    open ? <div data-testid="command-palette">Mock Command Palette</div> : null
  ),
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand initials', () => {
    render(<Navbar />);
    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('toggles dark mode', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Toggle theme button
    const toggleButton = screen.getByLabelText('Toggle dark mode');
    await user.click(toggleButton);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles neo style', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Toggle neo style button
    const toggleButton = screen.getByLabelText('Toggle neo style');
    await user.click(toggleButton);
    
    expect(mockSetTheme).toHaveBeenCalledWith('neo-light');
  });

  it('opens CommandPalette on search button click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    expect(screen.queryByTestId('command-palette')).not.toBeInTheDocument();
    
    const searchButton = screen.getByText('Search');
    await user.click(searchButton);
    
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
  });

  it('opens mobile menu on toggle button click', async () => {
    const user = userEvent.setup();
    // Simulate mobile viewport if possible, but testing library doesn't care about CSS hidden classes by default unless we check styles.
    // The button is always rendered, just hidden with CSS. We can click it.
    render(<Navbar />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    
    // Initially the mobile menu container shouldn't be there (conditionally rendered)
    expect(screen.queryByRole('list', { name: '' })?.parentElement?.className).not.toContain('md:hidden border-t');
    
    await user.click(menuButton);
    
    // Menu is open, we should see the mobile links
    // Since desktop and mobile links have the same text, we should find more of them
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(1);
  });
});
