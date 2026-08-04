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

  it('handles successful save, create PR, and publish', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(actions.saveDraftAction).mockResolvedValue({ id: '123', branchName: 'draft-branch' } as any);
    vi.mocked(actions.createPRForContent).mockResolvedValue({ prNumber: 42, prUrl: 'https://github.com/pr/42' } as any);
    vi.mocked(actions.mergePRAction).mockResolvedValue(true as any);

    render(<AdminClient initialData={null} />);

    // Validation fail
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);
    expect(alertMock).toHaveBeenCalledWith('Please fill in title, slug, and content.');

    fireEvent.change(screen.getByPlaceholderText('E.g. My New Post'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('my-new-post'), { target: { value: 'test' } });
    fireEvent.change(screen.getByTestId('mock-editor'), { target: { value: 'content' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Saved successfully! Draft pushed to Github branch.');
    });

    const createPRButton = screen.getByRole('button', { name: /Create PR/i });
    expect(createPRButton).not.toBeDisabled();
    
    fireEvent.click(createPRButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Pull Request created successfully!');
    });

    const publishButton = screen.getByRole('button', { name: /Publish/i });
    expect(publishButton).not.toBeDisabled();

    fireEvent.click(publishButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Published successfully!');
    });
    
    alertMock.mockRestore();
  });

  it('handles PR creation error', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(actions.createPRForContent).mockRejectedValue(new Error('PR fail'));

    render(<AdminClient initialData={{ id: '123', branch_name: 'draft' }} />);

    const createPRButton = screen.getByRole('button', { name: /Create PR/i });
    fireEvent.click(createPRButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error creating PR: PR fail');
    });
    
    alertMock.mockRestore();
  });

  it('handles publish error', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(actions.mergePRAction).mockRejectedValue(new Error('Publish fail'));

    render(<AdminClient initialData={{ id: '123', pr_number: 42 }} />);

    const publishButton = screen.getByRole('button', { name: /Publish/i });
    fireEvent.click(publishButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error publishing: Publish fail');
    });
    
    alertMock.mockRestore();
  });

  it('allows changing category and toggling full width', () => {
    render(<AdminClient initialData={null} />);
    
    const fullWidthBtn = screen.getByRole('button', { name: /Full Width/i });
    fireEvent.click(fullWidthBtn);
    expect(screen.getByRole('button', { name: /Collapse Width/i })).toBeInTheDocument();
  });

  it('renders snippet and tool category specific fields', () => {
    render(<AdminClient initialData={{ category: 'snippets' }} />);
    // Snippets should have Language and Level
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();

    // Rerender with tools
    render(<AdminClient initialData={{ category: 'tools' }} />);
    // Tools should have Tool Category and External Link
    expect(screen.getByText('Tool Category')).toBeInTheDocument();
    expect(screen.getByText('External Link')).toBeInTheDocument();
  });

  it('can open and close asset drawer', () => {
    render(<AdminClient initialData={null} />);
    
    // Open drawer
    const openAssetBtns = screen.getAllByRole('button', { name: /Upload Asset/i });
    fireEvent.click(openAssetBtns[openAssetBtns.length - 1]);
    expect(screen.getByText('×')).toBeInTheDocument();
    
    // Close drawer
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });
});
