import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  const defaultProps = {
    label: 'Test Label',
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders required props correctly', () => {
    render(<PageHeader {...defaultProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders stats if provided', () => {
    const stats = [
      { label: 'Users', value: '1M+' },
      { label: 'Revenue', value: '$5M' },
    ];
    
    render(<PageHeader {...defaultProps} stats={stats} />);
    
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1M+')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$5M')).toBeInTheDocument();
  });

  it('does not render stats container if stats is empty', () => {
    const { container } = render(<PageHeader {...defaultProps} stats={[]} />);
    // Since stats container uses text-right/justify-end, we can check if anything has it
    expect(container.querySelector('.md\\:text-right')).not.toBeInTheDocument();
  });
});
