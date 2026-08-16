import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormattingHelp } from '../FormattingHelp';

// Mock CodeBlockClient to avoid complex rendering of shiki simulated html
vi.mock('../../../../components/CodeBlockClient', () => ({
  default: ({ code, lang }: any) => (
    <div data-testid="code-block-client" data-lang={lang}>
      {code}
    </div>
  )
}));

describe('FormattingHelp', () => {
  it('renders all sections', () => {
    render(<FormattingHelp />);
    
    // Check main headers
    expect(screen.getByText('Custom JSX Components')).toBeInTheDocument();
    expect(screen.getByText('Standard Markdown')).toBeInTheDocument();
  });

  it('renders custom JSX component examples', () => {
    render(<FormattingHelp />);
    
    // Check component titles
    expect(screen.getAllByText('Callout Block').length).toBeGreaterThan(0);
    expect(screen.getByText('Sparky Text')).toBeInTheDocument();
    expect(screen.getByText('More Info (Tooltip)')).toBeInTheDocument();
    expect(screen.getByText('Swirly Underline')).toBeInTheDocument();
    expect(screen.getByText('Highlight Text')).toBeInTheDocument();
    
    // Check that custom components render their actual output
    expect(screen.getByText('This is an important note!')).toBeInTheDocument();
    expect(screen.getByText('magical')).toBeInTheDocument();
    expect(screen.getByText('virtual DOM')).toBeInTheDocument();
    expect(screen.getByText('this part')).toBeInTheDocument();
    expect(screen.getByText('measure')).toBeInTheDocument();
  });

  it('renders standard markdown examples', () => {
    render(<FormattingHelp />);
    
    // Check markdown section titles
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Code Blocks')).toBeInTheDocument();
    expect(screen.getByText('Links & Formatting')).toBeInTheDocument();
  });

  it('renders CodeBlockClient for all code snippets', () => {
    render(<FormattingHelp />);
    
    const codeBlocks = screen.getAllByTestId('code-block-client');
    expect(codeBlocks.length).toBeGreaterThan(0);
    
    // Verify some expected code snippets are passed
    const allCodeText = codeBlocks.map(block => block.textContent).join(' ');
    
    expect(allCodeText).toContain('<Callout type="info" title="Pro Tip">');
    expect(allCodeText).toContain('<SparkyText>magical</SparkyText>');
    expect(allCodeText).toContain('<SwirlyUnderline>this part</SwirlyUnderline>');
    expect(allCodeText).toContain('![Alt text description](/assets/123-image.png)');
  });
});
