import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import FaqItem from '../FaqItem';

describe('FaqItem', () => {
  it('renders question and not answer initially', () => {
    render(<FaqItem q="What is Vitest?" a="A testing framework" />);
    
    expect(screen.getByText('What is Vitest?')).toBeInTheDocument();
    expect(screen.queryByText('A testing framework')).not.toBeInTheDocument();
  });

  it('toggles answer visibility on click', async () => {
    const user = userEvent.setup();
    render(<FaqItem q="What is Vitest?" a="A testing framework" />);
    
    const button = screen.getByRole('button', { name: 'What is Vitest?' });
    
    // Open
    await user.click(button);
    expect(screen.getByText('A testing framework')).toBeInTheDocument();
    
    // Close
    await user.click(button);
    expect(screen.queryByText('A testing framework')).not.toBeInTheDocument();
  });
});
