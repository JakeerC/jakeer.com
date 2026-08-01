import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ArticleCard from '../ArticleCard';

describe('ArticleCard', () => {
  const defaultProps = {
    index: 1,
    slug: 'my-first-article',
    title: 'My First Article',
    excerpt: 'This is the excerpt for my first article.',
    date: '2023-01-01',
    readTime: '5 min read',
  };

  it('renders correctly with given props', () => {
    render(<ArticleCard {...defaultProps} />);
    
    // Check index (padded)
    expect(screen.getByText('01')).toBeInTheDocument();
    
    // Check title and excerpt
    expect(screen.getByText('My First Article')).toBeInTheDocument();
    expect(screen.getByText('This is the excerpt for my first article.')).toBeInTheDocument();
    
    // Check meta info
    expect(screen.getByText(/2023-01-01 · 5 min read/)).toBeInTheDocument();
  });

  it('has correct link href based on slug', () => {
    render(<ArticleCard {...defaultProps} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/writing/my-first-article');
  });

  it('pads single digit index properly', () => {
    render(<ArticleCard {...defaultProps} index={5} />);
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('does not pad multi-digit index', () => {
    render(<ArticleCard {...defaultProps} index={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
