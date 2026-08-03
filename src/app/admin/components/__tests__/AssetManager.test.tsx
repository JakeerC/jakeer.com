import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetManager } from '../AssetManager';
import { AssetList } from '../AssetList';
import { AssetUploader } from '../AssetUploader';
import * as actions from '../../actions';

vi.mock('../../actions', () => ({
  uploadAssetAction: vi.fn(),
  checkAssetExistsAction: vi.fn(),
  getAssetsAction: vi.fn(),
}));

describe('Asset Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AssetList', () => {
    it('renders loading state initially and then lists assets', async () => {
      vi.mocked(actions.getAssetsAction).mockResolvedValue([
        { id: '1', name: 'test-image.png', updated_at: '2023-01-01', url: 'https://test.com/img.png' }
      ] as any);

      render(<AssetList />);
      
      expect(screen.getByText('Loading assets...')).toBeDefined();
      
      await waitFor(() => {
        expect(screen.getByText('test-image.png')).toBeDefined();
      });
      expect(actions.getAssetsAction).toHaveBeenCalledTimes(1);
    });

    it('filters assets by search', async () => {
      vi.mocked(actions.getAssetsAction).mockResolvedValue([
        { id: '1', name: 'apple.png', updated_at: '2023-01-01', url: 'https://test.com/apple.png' },
        { id: '2', name: 'banana.png', updated_at: '2023-01-01', url: 'https://test.com/banana.png' }
      ] as any);

      render(<AssetList />);
      
      await waitFor(() => {
        expect(screen.getByText('apple.png')).toBeDefined();
        expect(screen.getByText('banana.png')).toBeDefined();
      });

      const searchInput = screen.getByPlaceholderText('Search assets by name...');
      fireEvent.change(searchInput, { target: { value: 'apple' } });

      await waitFor(() => {
        expect(screen.getByText('apple.png')).toBeDefined();
        expect(screen.queryByText('banana.png')).toBeNull();
      });
    });
  });

  describe('AssetUploader', () => {
    it('renders upload form', () => {
      render(<AssetUploader />);
      expect(screen.getByText('Select File (JPG, PNG, SVG)')).toBeDefined();
      expect(screen.getByText('Max file size: 5MB')).toBeDefined();
    });

    it('shows error for file exceeding size limit', async () => {
      render(<AssetUploader />);
      const fileInput = screen.getByLabelText(/Select File/i) || screen.getByText('Max file size: 5MB').parentElement?.querySelector('input');
      
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      fireEvent.change(fileInput!, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(screen.getByText('File exceeds 5MB size limit.')).toBeDefined();
      });
    });
  });

  describe('AssetManager', () => {
    it('switches between browse and upload tabs', async () => {
      vi.mocked(actions.getAssetsAction).mockResolvedValue([]);
      
      render(<AssetManager />);
      
      const browseTab = screen.getByRole('button', { name: /Browse Assets/i });
      const uploadTab = screen.getByRole('button', { name: /Upload New/i });
      
      // Defaults to browse
      expect(browseTab.className).toContain('primary');
      expect(screen.getByPlaceholderText('Search assets by name...')).toBeDefined();
      
      // Switch to upload
      fireEvent.click(uploadTab);
      await waitFor(() => {
        expect(uploadTab.className).toContain('primary');
        expect(screen.getByText('Upload Asset')).toBeDefined();
      });
    });
  });
});
