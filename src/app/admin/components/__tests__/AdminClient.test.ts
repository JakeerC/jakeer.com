import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminClient } from '../AdminClient';
import * as actions from '../../actions';

vi.mock('../../actions', () => ({
  saveDraftAction: vi.fn(),
  createPRForContent: vi.fn(),
  mergePRAction: vi.fn(),
  archiveDraftAction: vi.fn(),
  unarchiveDraftAction: vi.fn(),
  deleteDraftAction: vi.fn(),
}));

vi.mock('../AssetManager', () => ({
  AssetManager: vi.fn(),
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
  it('handles archive, unarchive, and delete actions', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    vi.mocked(actions.archiveDraftAction).mockResolvedValue(true as any);
    vi.mocked(actions.unarchiveDraftAction).mockResolvedValue(true as any);
    vi.mocked(actions.deleteDraftAction).mockResolvedValue(true as any);

    // Fresh render - archived
    const { unmount } = render(<AdminClient initialData={{ id: '123' }} />);
    const archiveBtn = screen.getByRole('button', { name: /Archive/i });
    fireEvent.click(archiveBtn);
    expect(confirmMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Archived successfully!');
    });
    
    unmount();
    
    render(<AdminClient initialData={{ id: '123', is_archived: true }} />);
    
    const unarchiveBtn = screen.getByRole('button', { name: /Unarchive/i });
    fireEvent.click(unarchiveBtn);
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Unarchived successfully!');
    });

    const deleteBtn = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Deleted successfully!');
    });

    alertMock.mockRestore();
    confirmMock.mockRestore();
  });
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
    
    // Change category (it's the first select)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'snippets' } });
    
    // Should now show snippets fields
    expect(screen.getByText('Language')).toBeInTheDocument();
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

  it('can open and close asset drawer and select an asset', async () => {
    // Mock navigator.clipboard
    const originalClipboard = navigator.clipboard;
    const mockWriteText = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock AssetManager to fire onSelect
    const { AssetManager } = await import('../AssetManager');
    vi.mocked(AssetManager).mockImplementation(({ onSelect }: any) => (
      <button onClick={() => onSelect('/test.jpg')}>Mock Asset Select</button>
    ));

    render(<AdminClient initialData={null} />);
    
    // Open drawer
    const openAssetBtns = screen.getAllByRole('button', { name: /Upload Asset/i });
    fireEvent.click(openAssetBtns[openAssetBtns.length - 1]);
    
    // Click our mock
    fireEvent.click(screen.getByText('Mock Asset Select'));
    
    expect(mockWriteText).toHaveBeenCalledWith('![Image](/test.jpg)');
    expect(alertMock).toHaveBeenCalled();
    
    // Close drawer
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('×')).not.toBeInTheDocument();
    
    alertMock.mockRestore();
    Object.assign(navigator, { clipboard: originalClipboard });
  });
});
