import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminClient } from '../AdminClient';
import * as actions from '../../actions';

vi.mock('../../actions', () => ({
  saveDraftAction: vi.fn(),
  createPRForContent: vi.fn(),
  mergePRAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })
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
  it('renders and handles save error', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(actions.saveDraftAction).mockRejectedValue(new Error('Test error'));

    render(<AdminClient initialData={null} />);

    const titleInput = screen.getByPlaceholderText('E.g. My New Post');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    const slugInput = screen.getByPlaceholderText('my-new-post');
    fireEvent.change(slugInput, { target: { value: 'test-title' } });

    const editor = screen.getByTestId('mock-editor');
    fireEvent.change(editor, { target: { value: 'test markdown content' } });

    const saveButton = screen.getByRole('button', { name: /Save/i });
    
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error saving: Test error');
    });
    
    alertMock.mockRestore();
  });
});
