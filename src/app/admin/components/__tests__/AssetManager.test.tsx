import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetManager } from '../AssetManager';

// We mock the child components so we can test interaction specifically
vi.mock('../AssetList', () => ({
  AssetList: ({ onSelect }: any) => (
    <div data-testid="asset-list">
      Asset List Mock
      {onSelect && (
        <button onClick={() => onSelect('https://mock.com/selected.png')}>Mock Select</button>
      )}
    </div>
  )
}));

vi.mock('../AssetUploader', () => ({
  AssetUploader: ({ onUploadComplete }: any) => (
    <div data-testid="asset-uploader">
      Asset Uploader Mock
      <button onClick={() => onUploadComplete('https://mock.com/uploaded.png')}>Mock Upload Complete</button>
    </div>
  )
}));

describe('AssetManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders browse tab by default', () => {
    render(<AssetManager />);
    expect(screen.getByTestId('asset-list')).toBeInTheDocument();
    expect(screen.queryByTestId('asset-uploader')).not.toBeInTheDocument();
  });

  it('switches between browse and upload tabs', async () => {
    render(<AssetManager />);
    
    const browseTab = screen.getByRole('button', { name: /Browse Assets/i });
    const uploadTab = screen.getByRole('button', { name: /Upload New/i });
    
    // Switch to upload
    fireEvent.click(uploadTab);
    expect(screen.getByTestId('asset-uploader')).toBeInTheDocument();
    
    // Switch back to browse
    fireEvent.click(browseTab);
    expect(screen.getByTestId('asset-list')).toBeInTheDocument();
  });

  it('calls onSelect when asset is selected from list', () => {
    const onSelect = vi.fn();
    render(<AssetManager onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Mock Select'));
    expect(onSelect).toHaveBeenCalledWith('https://mock.com/selected.png');
  });

  it('calls onSelect and does not switch tab when upload completes with onSelect prop', () => {
    const onSelect = vi.fn();
    render(<AssetManager onSelect={onSelect} />);
    
    // Switch to upload
    fireEvent.click(screen.getByRole('button', { name: /Upload New/i }));
    
    // Trigger upload complete
    fireEvent.click(screen.getByText('Mock Upload Complete'));
    
    expect(onSelect).toHaveBeenCalledWith('https://mock.com/uploaded.png');
    // It should stay on upload tab because onSelect is provided
    expect(screen.getByTestId('asset-uploader')).toBeInTheDocument();
  });

  it('switches back to browse tab when upload completes without onSelect prop', () => {
    render(<AssetManager />);
    
    // Switch to upload
    fireEvent.click(screen.getByRole('button', { name: /Upload New/i }));
    
    // Trigger upload complete
    fireEvent.click(screen.getByText('Mock Upload Complete'));
    
    // It should switch back to browse
    expect(screen.getByTestId('asset-list')).toBeInTheDocument();
  });
});
