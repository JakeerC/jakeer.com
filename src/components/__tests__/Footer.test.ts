import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';

// Mock the site config so tests are predictable
vi.mock('@/lib/config', () => ({
  siteConfig: {
    initials: 'JC',
    tagline: 'Test Tagline',
    name: 'John Doe',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
    socials: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    },
  },
}));

describe('Footer', () => {
  it('renders the brand initials and tagline', () => {
    render(<Footer />);
    
    expect(screen.getByText('JC')).toBeInTheDocument();
    expect(screen.getByText('Test Tagline')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('About')).toHaveAttribute('href', '/about');
  });

  it('renders copyright with current year and name', () => {
    render(<Footer />);
    
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} John Doe. All rights reserved.`))).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test');
    
    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
  });
});
