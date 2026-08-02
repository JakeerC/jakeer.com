import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CodeBlock from '../CodeBlock';

// Mock shiki so we don't need to load webassembly/languages during tests
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockImplementation((code: string) => Promise.resolve(`<pre><code>${code}</code></pre>`)),
}));

// Mock CodeBlockClient to just render its props so we can verify them
vi.mock('../CodeBlockClient', () => ({
  default: ({ code, lang, html }: { code: string; lang: string; html: string }) => (
    <div data-testid="code-block-client">
      <div data-testid="prop-code">{code}</div>
      <div data-testid="prop-lang">{lang}</div>
      <div data-testid="prop-html">{html}</div>
    </div>
  ),
}));

describe('CodeBlock', () => {
  it('renders correctly', async () => {
    // In React 18 / Next.js Server Components, async components return a promise
    // We need to await it before rendering
    const code = 'const x = 1;';
    const lang = 'typescript';
    
    // Call the async function component directly
    const element = await CodeBlock({ code, lang });
    
    render(element as React.ReactElement);
    
    expect(screen.getByTestId('prop-code')).toHaveTextContent(code);
    expect(screen.getByTestId('prop-lang')).toHaveTextContent(lang);
    expect(screen.getByTestId('prop-html')).toHaveTextContent(`<pre><code>${code}</code></pre>`);
  });
});
