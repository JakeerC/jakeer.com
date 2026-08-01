import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechIcon from '../TechIcon';

describe('TechIcon', () => {
  it('renders known icon correctly', () => {
    const { container } = render(<TechIcon tag="React" />);
    // Check if an SVG is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders fallback icon for unknown tag', () => {
    const { container } = render(<TechIcon tag="Unknown Tech" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<TechIcon tag="React" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('width', '24');
  });

  it('applies smaller size for fallback icon', () => {
    const { container } = render(<TechIcon tag="Unknown Tech" size={24} />);
    const svg = container.querySelector('svg');
    // Fallback logic uses size - 2
    expect(svg).toHaveAttribute('height', '22');
    expect(svg).toHaveAttribute('width', '22');
  });
});
