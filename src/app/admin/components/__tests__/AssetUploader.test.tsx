import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetUploader } from '../AssetUploader';
import { uploadAssetAction, checkAssetExistsAction } from '../../actions';

vi.mock('../../actions', () => ({
  uploadAssetAction: vi.fn(),
  checkAssetExistsAction: vi.fn(),
}));

describe('AssetUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mocked-url');
    global.URL.revokeObjectURL = vi.fn();
    window.alert = vi.fn();
    window.confirm = vi.fn();
  });

  it('renders correctly', () => {
    render(<AssetUploader />);
    expect(screen.getByText(/Select File/i)).toBeInTheDocument();
  });

  it('handles file selection and shows preview', async () => {
    render(<AssetUploader />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    
    await userEvent.upload(input, file);
    
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    expect(screen.getByDisplayValue('hello.png')).toBeInTheDocument();
  });

  it('handles file size limit', async () => {
    render(<AssetUploader />);
    
    const file = new File(['a'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    
    await userEvent.upload(input, file);
    
    expect(screen.getByText('File exceeds 5MB size limit.')).toBeInTheDocument();
  });

  it('handles successful upload', async () => {
    const onUploadComplete = vi.fn();
    vi.mocked(checkAssetExistsAction).mockResolvedValue(false);
    vi.mocked(uploadAssetAction).mockResolvedValue({ success: true, url: 'https://mock.com/image.png', path: 'image.png' });
    
    render(<AssetUploader onUploadComplete={onUploadComplete} />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    
    await userEvent.upload(input, file);
    
    const uploadBtn = screen.getByRole('button', { name: /Upload Asset/i });
    fireEvent.click(uploadBtn);
    
    expect(screen.getByRole('button', { name: /Uploading/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(uploadAssetAction).toHaveBeenCalled();
    });
    
    expect(screen.getByText(/successfully uploaded/i)).toBeInTheDocument();
    expect(onUploadComplete).toHaveBeenCalledWith('https://mock.com/image.png');
  });

  it('handles duplicate file overwrite', async () => {
    vi.mocked(checkAssetExistsAction).mockResolvedValue(true);
    vi.mocked(uploadAssetAction).mockResolvedValue({ success: true, url: 'https://mock.com/hello.png', path: 'hello.png' });
    vi.mocked(window.confirm).mockReturnValue(true); // User says yes to overwrite
    
    render(<AssetUploader />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    await userEvent.upload(input, file);
    
    const uploadBtn = screen.getByRole('button', { name: /Upload Asset/i });
    fireEvent.click(uploadBtn);
    
    await waitFor(() => {
      expect(uploadAssetAction).toHaveBeenCalled();
    });
    
    // Check if it was called with formData where overwrite is true
    const callArgs = vi.mocked(uploadAssetAction).mock.calls[0][0];
    expect(callArgs.get('overwrite')).toBe('true');
  });

  it('handles duplicate file append suffix', async () => {
    vi.mocked(checkAssetExistsAction).mockResolvedValue(true);
    vi.mocked(uploadAssetAction).mockResolvedValue({ success: true, url: 'https://mock.com/hello-123.png', path: 'hello-123.png' });
    vi.mocked(window.confirm).mockReturnValue(false); // User says no, append suffix
    
    render(<AssetUploader />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    await userEvent.upload(input, file);
    
    const uploadBtn = screen.getByRole('button', { name: /Upload Asset/i });
    fireEvent.click(uploadBtn);
    
    await waitFor(() => {
      expect(uploadAssetAction).toHaveBeenCalled();
    });
    
    // Check if it was called with new filename
    const callArgs = vi.mocked(uploadAssetAction).mock.calls[0][0];
    expect(callArgs.get('fileName')).toMatch(/hello-\d+\.png/);
  });

  it('handles upload error', async () => {
    vi.mocked(checkAssetExistsAction).mockResolvedValue(false);
    vi.mocked(uploadAssetAction).mockRejectedValue(new Error('Upload failed'));
    
    render(<AssetUploader />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Select File/i);
    
    await userEvent.upload(input, file);
    
    const uploadBtn = screen.getByRole('button', { name: /Upload Asset/i });
    fireEvent.click(uploadBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
  });
});
