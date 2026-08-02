import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminClient } from '../AdminClient';
import * as actions from '../../actions';

vi.mock('../../actions', () => ({
  submitContentToGitHub: vi.fn(),
}));

// Mock dynamic import for Editor
vi.mock('next/dynamic', () => ({
  default: () => {
    return function MockEditor({ onChange }: any) {
      return <input data-testid="mock-editor" onChange={e => onChange(e.target.value)} />;
    };
  }
}));

describe('AdminClient', () => {
  it('renders and handles submission error', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(actions.submitContentToGitHub).mockRejectedValue(new Error('Test error'));

    render(<AdminClient session={{}} />);

    const titleInput = screen.getByPlaceholderText('E.g. My New Post');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    const slugInput = screen.getByPlaceholderText('my-new-post');
    fireEvent.change(slugInput, { target: { value: 'test-title' } });

    const editor = screen.getByTestId('mock-editor');
    fireEvent.change(editor, { target: { value: 'test markdown content' } });

    const submitButton = screen.getByRole('button', { name: /Publish to GitHub/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error creating PR: Test error');
    });
    
    alertMock.mockRestore();
  });
});
