import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatCounter from '../StatCounter';

describe('StatCounter', () => {
  beforeEach(() => {
    // Reset any mocks if necessary
    vi.clearAllMocks();
  });

  it('renders value and label', () => {
    render(<StatCounter value="100+" label="Projects" />);
    
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('initializes with opacity 0 before intersection', () => {
    // Note: the component sets visible to false initially
    const { container } = render(<StatCounter value="100+" label="Projects" />);
    
    // The parent div has the inline style
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ opacity: '0' });
    expect(wrapper).toHaveStyle({ transform: 'translateY(16px)' });
  });

  it('respects the delay prop', () => {
    const { container } = render(<StatCounter value="10" label="Years" delay={200} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transition).toContain('200ms');
  });

  it('becomes visible when intersecting', () => {
    let intersectionCallback: IntersectionObserverCallback | null = null;
    const mockDisconnect = vi.fn();
    const mockObserve = vi.fn();

    const originalIntersectionObserver = global.IntersectionObserver;

    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    }

    global.IntersectionObserver = MockIntersectionObserver as any;

    const { container } = render(<StatCounter value="100+" label="Projects" />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ opacity: '0' });

    // Trigger intersection
    if (intersectionCallback) {
      act(() => {
        intersectionCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      });
    }

    expect(wrapper).toHaveStyle({ opacity: '1' });
    expect(mockDisconnect).toHaveBeenCalled();

    global.IntersectionObserver = originalIntersectionObserver;
  });
});
