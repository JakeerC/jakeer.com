import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { NotesSidebar } from '../NotesSidebar';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/notes/system-design/cap-theorem',
}));

describe('NotesSidebar', () => {
  const mockKnowledgeBase = {
    slug: 'system-design',
    label: 'System Design',
  };

  const mockTopics = [
    {
      label: 'Fundamentals',
      notes: [
        { slug: 'cap-theorem', title: 'CAP Theorem' },
        { slug: 'latency', title: 'Latency Numbers' },
      ],
    },
  ];

  it('renders knowledge base label and overview link', () => {
    render(React.createElement(NotesSidebar, { knowledgeBase: mockKnowledgeBase, topics: mockTopics }));
    expect(screen.getByText('System Design Notes')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders topics and notes correctly', () => {
    render(React.createElement(NotesSidebar, { knowledgeBase: mockKnowledgeBase, topics: mockTopics }));
    expect(screen.getByText('Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('CAP Theorem')).toBeInTheDocument();
    expect(screen.getByText('Latency Numbers')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(React.createElement(NotesSidebar, { knowledgeBase: mockKnowledgeBase, topics: mockTopics }));
    const toggleButton = screen.getByRole('button', { name: /Topics Menu/i });
    
    // Sidebar should be hidden on mobile initially (hidden lg:block)
    const aside = screen.getByRole('complementary'); // aside element
    expect(aside).toHaveClass('hidden');

    // Click toggle
    fireEvent.click(toggleButton);
    expect(aside).toHaveClass('block');

    // Click toggle again
    fireEvent.click(toggleButton);
    expect(aside).toHaveClass('hidden');
  });
});
