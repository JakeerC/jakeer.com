import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechIcon from '../TechIcon';

describe('TechIcon', () => {
  it('renders known icon correctly', () => {
    const { container } = render(<TechIcon tag="React" />);
    // Check if an SVG is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders default icon for unknown tag', () => {
    const { container } = render(<TechIcon tag="Unknown Tech" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom size and margin-x class', () => {
    const { container } = render(<TechIcon tag="React" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveClass('mx-2');
  });
});
