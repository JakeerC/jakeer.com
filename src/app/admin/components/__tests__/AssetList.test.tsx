import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetList } from '../AssetList';
import { getAssetsAction } from '../../actions';

vi.mock('../../actions', () => ({
  getAssetsAction: vi.fn(),
}));

describe('AssetList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    window.alert = vi.fn();
  });

  const mockAssets = [
    { id: '1', name: 'apple.png', url: 'https://mock.com/apple.png', updated_at: '2023-01-01' },
    { id: '2', name: 'banana.jpg', url: 'https://mock.com/banana.jpg', updated_at: '2023-01-02' },
  ];

  it('renders loading state initially', () => {
    vi.mocked(getAssetsAction).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<AssetList />);
    expect(screen.getByText('Loading assets...')).toBeInTheDocument();
  });

  it('renders assets after fetching', async () => {
    vi.mocked(getAssetsAction).mockResolvedValue(mockAssets);
    render(<AssetList />);
    
    await waitFor(() => {
      expect(screen.getByText('apple.png')).toBeInTheDocument();
    });
    expect(screen.getByText('banana.jpg')).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    vi.mocked(getAssetsAction).mockResolvedValue([]);
    render(<AssetList />);
    
    await waitFor(() => {
      expect(screen.getByText('No assets found.')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    vi.mocked(getAssetsAction).mockRejectedValue(new Error('Failed fetching'));
    render(<AssetList />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed fetching')).toBeInTheDocument();
    });
  });

  it('filters assets based on search', async () => {
    vi.mocked(getAssetsAction).mockResolvedValue(mockAssets);
    render(<AssetList />);
    
    await waitFor(() => {
      expect(screen.getByText('apple.png')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search assets by name...');
    await userEvent.type(searchInput, 'apple');
    
    expect(screen.getByText('apple.png')).toBeInTheDocument();
    expect(screen.queryByText('banana.jpg')).not.toBeInTheDocument();
  });

  it('calls onSelect when an asset is clicked', async () => {
    vi.mocked(getAssetsAction).mockResolvedValue(mockAssets);
    const onSelect = vi.fn();
    render(<AssetList onSelect={onSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText('apple.png')).toBeInTheDocument();
    });
    
    const selectBtn = screen.getAllByRole('button', { name: /Select/i })[0];
    fireEvent.click(selectBtn);
    
    expect(onSelect).toHaveBeenCalledWith('https://mock.com/apple.png');
  });

  it('copies URL to clipboard when no onSelect is provided', async () => {
    vi.mocked(getAssetsAction).mockResolvedValue(mockAssets);
    render(<AssetList />);
    
    await waitFor(() => {
      expect(screen.getByText('apple.png')).toBeInTheDocument();
    });
    
    const copyBtn = screen.getAllByRole('button', { name: /Copy MD/i })[0];
    fireEvent.click(copyBtn);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('![Image](https://mock.com/apple.png)');
    expect(window.alert).toHaveBeenCalledWith('Image URL copied to clipboard!');
  });
});
