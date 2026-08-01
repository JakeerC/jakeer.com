import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tag } from '../Tag';

describe('Tag', () => {
  it('renders correctly with default props', () => {
    render(<Tag>React</Tag>);
    const tag = screen.getByText('React');
    expect(tag).toBeInTheDocument();
    // Default variant is 'default', size is 'md'
    expect(tag).toHaveClass('bg-[var(--tag-bg)]', 'border-[var(--tag-border)]');
    expect(tag).toHaveClass('px-2.5', 'py-1', 'text-[11px]');
  });

  it('applies the provided variant class', () => {
    render(<Tag variant="accent">Typescript</Tag>);
    const tag = screen.getByText('Typescript');
    expect(tag).toHaveClass('bg-[var(--accent)]');
  });

  it('applies the provided size class', () => {
    render(<Tag size="lg">Large Tag</Tag>);
    const tag = screen.getByText('Large Tag');
    expect(tag).toHaveClass('px-3', 'py-1.5', 'text-xs');
  });

  it('renders left icon', () => {
    const LeftIcon = <svg data-testid="left-icon" />;
    
    render(
      <Tag leftIcon={LeftIcon}>
        With Icon
      </Tag>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });
});
