import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { NotesTopicCard } from '../NotesTopicCard';

// Mock TechIcon since we just want to test the wrapper
vi.mock('../TechIcon', () => ({
  default: ({ name }: { name: string }) => React.createElement('div', { 'data-testid': 'tech-icon' }, name)
}));

describe('NotesTopicCard', () => {
  const defaultProps = {
    slug: 'system-design',
    label: 'System Design',
    description: 'Learn about system design.',
    icon: 'LuNetwork',
    color: '#ff0055',
    noteCount: 4,
    totalReadingTime: 28,
  };

  it('renders correctly with given props', () => {
    render(React.createElement(NotesTopicCard, defaultProps));
    
    // Check title and description
    expect(screen.getByText('System Design')).toBeInTheDocument();
    expect(screen.getByText('Learn about system design.')).toBeInTheDocument();
    
    // Check meta info
    expect(screen.getByText('4 notes · 28 min')).toBeInTheDocument();
  });

  it('has correct link href based on slug', () => {
    render(React.createElement(NotesTopicCard, defaultProps));
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/notes/system-design');
  });

  it('renders the TechIcon with the correct name', () => {
    render(React.createElement(NotesTopicCard, defaultProps));
    expect(screen.getByTestId('tech-icon')).toHaveTextContent('LuNetwork');
  });
});
