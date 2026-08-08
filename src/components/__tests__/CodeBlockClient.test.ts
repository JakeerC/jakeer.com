import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CodeBlockClient from '../CodeBlockClient';

describe('CodeBlockClient', () => {
  const defaultProps = {
    code: 'console.log("hello");',
    lang: 'javascript',
    html: '<pre><code>console.log("hello");</code></pre>',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    const { container } = render(<CodeBlockClient {...defaultProps} />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(container.innerHTML).toContain('<pre><code>console.log("hello");</code></pre>');
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    vi.useFakeTimers();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
    render(<CodeBlockClient {...defaultProps} />);
    
    const copyButton = screen.getByLabelText('Copy code');
    
    // Use fireEvent instead of userEvent to avoid fake timers deadlock
    act(() => {
      copyButton.click();
    });
    
    // Wait for async writeText to be called (the component has `await navigator.clipboard.writeText(...)`)
    // Because writeText is a mocked async function, we need to flush promises
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(writeTextSpy).toHaveBeenCalledWith('console.log("hello");');
    expect(copyButton.style.color).toBe('rgb(34, 197, 94)'); // #22c55e converted to rgb by jsdom
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(copyButton.style.color).toBe('var(--text-muted)');
  });

  it('toggles text wrapping', async () => {
    const user = userEvent.setup();
    const { container } = render(<CodeBlockClient {...defaultProps} />);
    
    const wrapButton = screen.getByLabelText('Wrap text');
    const codeContainer = container.querySelector('.p-4') as HTMLElement;
    
    // Initial state: no wrapping
    expect(codeContainer.className).toContain('[&>pre]:!whitespace-pre');
    expect(codeContainer.className).not.toContain('[&>pre]:!whitespace-pre-wrap');
    
    await user.click(wrapButton);
    
    // State after click: wrapped
    expect(codeContainer.className).toContain('[&>pre]:!whitespace-pre-wrap');
    
    await user.click(wrapButton);
    
    // State after second click: unwrapped
    expect(codeContainer.className).toContain('[&>pre]:!whitespace-pre');
  });
});
