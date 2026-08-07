import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

vi.mock('next-themes', () => ({
  ThemeProvider: vi.fn(({ children }) => <div data-testid="next-themes-provider">{children}</div>),
}));

describe('ThemeProvider', () => {
  const originalEnv = process.env.NODE_ENV;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    console.error = originalConsoleError;
  });

  it('renders children within NextThemesProvider', () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider>
        <span>Test Child</span>
      </ThemeProvider>
    );

    expect(getByTestId('next-themes-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('silences the React 19 script tag warning', async () => {
    const mockConsoleError = vi.fn();
    console.error = mockConsoleError;
    
    // We need to isolate modules to re-evaluate the module level script that overrides console.error
    const { ThemeProvider: DynamicThemeProvider } = await import('../ThemeProvider');

    // Trigger the silenced error
    console.error('Warning: Encountered a script tag while rendering React component');
    
    expect(mockConsoleError).not.toHaveBeenCalled();

    // Trigger a non-silenced error
    console.error('Other error');
    expect(mockConsoleError).toHaveBeenCalledWith('Other error');
  });
});
