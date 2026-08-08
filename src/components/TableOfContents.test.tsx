import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TableOfContents from './TableOfContents';
import React from 'react';

// Mock IntersectionObserver
const observeMock = vi.fn();
const disconnectMock = vi.fn();

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe = observeMock;
  unobserve = vi.fn();
  disconnect = disconnectMock;
}

global.IntersectionObserver = MockIntersectionObserver as any;

describe('TableOfContents Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing if less than 2 headings are found', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="single-heading">Single Heading</h2>
      </article>
    `;
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with multiple headings', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="heading-one">Heading One</h2>
        <h2 id="heading-two">Heading Two</h2>
        <h3 id="heading-three">Heading Three</h3>
      </article>
    `;

    render(<TableOfContents />);

    // Since it renders both desktop and mobile panels (mobile panel might be hidden until open, but the desktop is there)
    const headingsOne = screen.getAllByText('Heading One');
    expect(headingsOne.length).toBeGreaterThan(0);

    const headingsTwo = screen.getAllByText('Heading Two');
    expect(headingsTwo.length).toBeGreaterThan(0);

    const headingsThree = screen.getAllByText('Heading Three');
    expect(headingsThree.length).toBeGreaterThan(0);

    // Progress should be visible for h2 elements (2 out of 2)
    // The default active is the first one, or 1/2
    const progressText = screen.getAllByText(/1\/2/);
    expect(progressText.length).toBeGreaterThan(0);
  });

  it('opens and closes mobile panel on button click', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="one">One</h2>
        <h2 id="two">Two</h2>
      </article>
    `;

    render(<TableOfContents />);
    
    // Find the mobile fab button (it has aria-label="Table of Contents")
    const fabButton = screen.getByLabelText('Table of Contents');
    expect(fabButton).toBeDefined();

    // Initially mobile panel isn't rendered
    expect(screen.queryByLabelText('Close Table of Contents')).toBeNull();

    // Click fab to open
    act(() => {
      fireEvent.click(fabButton);
    });

    // Mobile panel should be visible now
    const closeBtn = screen.getByLabelText('Close Table of Contents');
    expect(closeBtn).toBeDefined();

    // Click to close
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByLabelText('Close Table of Contents')).toBeNull();
  });

  it('closes mobile panel when clicking a link', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="one">One</h2>
        <h2 id="two">Two</h2>
      </article>
    `;

    render(<TableOfContents />);
    
    // Open panel
    const fabButton = screen.getByLabelText('Table of Contents');
    act(() => {
      fireEvent.click(fabButton);
    });

    expect(screen.getByLabelText('Close Table of Contents')).toBeDefined();

    // Click a link inside the mobile panel
    const link = screen.getAllByText('One')[1]; 
    
    act(() => {
      fireEvent.click(link);
    });

    // Panel should close
    expect(screen.queryByLabelText('Close Table of Contents')).toBeNull();
  });

  it('updates activeId on intersection and calculates correct progress', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="h2-one">H2 One</h2>
        <h3 id="h3-one">H3 One</h3>
        <h2 id="h2-two">H2 Two</h2>
      </article>
    `;

    render(<TableOfContents />);

    // Get the mocked observer instance's callback
    // We can get it by spying on the MockIntersectionObserver constructor, but it's easier:
    // Actually our MockIntersectionObserver saves it to `this.callback` but we don't have a direct reference to the instance.
    // Let's redefine the mock just for this test so we can access the callback.
    let observerCallback: IntersectionObserverCallback | null = null;
    global.IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as any;

    render(<TableOfContents />);

    expect(observerCallback).toBeDefined();

    // Simulate h3-one intersecting
    act(() => {
      if (observerCallback) {
        observerCallback([{ isIntersecting: true, target: { id: 'h3-one' } }] as any, {} as any);
      }
    });

    // When h3-one is active, it should map back to the first h2 (H2 One)
    // So progress should be 1/2
    const progressText1 = screen.getAllByText(/1\/2/);
    expect(progressText1.length).toBeGreaterThan(0);

    // Simulate h2-two intersecting
    act(() => {
      if (observerCallback) {
        observerCallback([{ isIntersecting: true, target: { id: 'h2-two' } }] as any, {} as any);
      }
    });

    // Progress should be 2/2
    const progressText2 = screen.getAllByText(/2\/2/);
    expect(progressText2.length).toBeGreaterThan(0);
  });

  it('closes mobile panel when clicking the backdrop', () => {
    document.body.innerHTML = `
      <article>
        <h2 id="one">One</h2>
        <h2 id="two">Two</h2>
      </article>
    `;

    render(<TableOfContents />);
    
    // Open panel
    const fabButton = screen.getByLabelText('Table of Contents');
    act(() => {
      fireEvent.click(fabButton);
    });

    // The backdrop is the first div with bg-black/40 (you can also add testid if needed, but we can query by className or structure)
    // It's the previous sibling of the panel. The panel has the close button.
    const closeBtn = screen.getByLabelText('Close Table of Contents');
    const panel = closeBtn.parentElement;
    const backdrop = panel?.previousSibling as Element;

    act(() => {
      if (backdrop) {
        fireEvent.click(backdrop);
      }
    });

    // Panel should close
    expect(screen.queryByLabelText('Close Table of Contents')).toBeNull();
  });
});
