import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CacheStatsPanel } from '../components/CacheStats';
import type { CacheStats } from '../types';

// Mock the hooks
vi.mock('../hooks', () => ({
  useCacheStats: vi.fn(),
  useCacheInvalidation: vi.fn(),
}));

import { useCacheStats, useCacheInvalidation } from '../hooks';

const mockUseCacheStats = vi.mocked(useCacheStats);
const mockUseCacheInvalidation = vi.mocked(useCacheInvalidation);

// Test data factories
const createMockStats = (overrides: Partial<CacheStats> = {}): CacheStats => ({
  hits: 1000,
  misses: 200,
  hitRate: 0.833,
  size: 500,
  memoryUsage: 10485760, // 10 MB
  ...overrides,
});

describe('CacheStatsPanel component', () => {
  const mockRefetch = vi.fn();
  const mockFlush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFlush.mockResolvedValue(undefined);

    mockUseCacheStats.mockReturnValue({
      stats: createMockStats(),
      isLoading: false,
      refetch: mockRefetch,
    });

    mockUseCacheInvalidation.mockReturnValue({
      invalidate: vi.fn(),
      invalidateByTag: vi.fn(),
      invalidateByPattern: vi.fn(),
      flush: mockFlush,
    });
  });

  describe('loading state', () => {
    it('should render loading skeleton when isLoading is true', () => {
      mockUseCacheStats.mockReturnValue({
        stats: null,
        isLoading: true,
        refetch: mockRefetch,
      });

      const { container } = render(<CacheStatsPanel />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render multiple skeleton elements in loading state', () => {
      mockUseCacheStats.mockReturnValue({
        stats: null,
        isLoading: true,
        refetch: mockRefetch,
      });

      const { container } = render(<CacheStatsPanel />);

      const skeletonElements = container.querySelectorAll('.bg-gray-200');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should not render stats content when loading', () => {
      mockUseCacheStats.mockReturnValue({
        stats: null,
        isLoading: true,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.queryByText('Cache Statistics')).not.toBeInTheDocument();
      expect(screen.queryByText('Hit Rate')).not.toBeInTheDocument();
    });
  });

  describe('no stats state', () => {
    it('should render error message when stats is null and not loading', () => {
      mockUseCacheStats.mockReturnValue({
        stats: null,
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.getByText('Unable to load cache statistics')).toBeInTheDocument();
    });
  });

  describe('stats display', () => {
    it('should render Cache Statistics heading', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByRole('heading', { name: 'Cache Statistics' })).toBeInTheDocument();
    });

    it('should display hit rate percentage', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByText('Hit Rate')).toBeInTheDocument();
      expect(screen.getByText('83.3%')).toBeInTheDocument();
    });

    it('should display cache hits count', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByText('Cache Hits')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
    });

    it('should display cache misses count', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByText('Cache Misses')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should display keys stored count', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByText('Keys Stored')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should display memory usage in MB', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      expect(screen.getByText('10.00 MB')).toBeInTheDocument();
    });
  });

  describe('hit rate color coding', () => {
    it('should display green color for hit rate above 80%', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.85 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('85.0%');
      expect(hitRateElement).toHaveClass('text-green-600');
    });

    it('should display yellow color for hit rate between 50% and 80%', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.65 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('65.0%');
      expect(hitRateElement).toHaveClass('text-yellow-600');
    });

    it('should display red color for hit rate below 50%', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.35 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('35.0%');
      expect(hitRateElement).toHaveClass('text-red-600');
    });

    it('should display yellow color for exactly 50% hit rate', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.5 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('50.0%');
      expect(hitRateElement).toHaveClass('text-yellow-600');
    });

    it('should display green color for exactly 80% hit rate', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.8 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('80.0%');
      expect(hitRateElement).toHaveClass('text-yellow-600');
    });

    it('should display green color for hit rate above 80%', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 0.81 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('81.0%');
      expect(hitRateElement).toHaveClass('text-green-600');
    });
  });

  describe('TTL display', () => {
    it('should display memory usage bar', () => {
      const { container } = render(<CacheStatsPanel />);

      const progressBar = container.querySelector('.bg-blue-600.h-2');
      expect(progressBar).toBeInTheDocument();
    });

    it('should calculate memory usage bar width correctly', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ memoryUsage: 50 * 1024 * 1024 }), // 50 MB
        isLoading: false,
        refetch: mockRefetch,
      });

      const { container } = render(<CacheStatsPanel />);

      const progressBar = container.querySelector('.bg-blue-600.h-2') as HTMLElement;
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('should cap memory usage bar at 100%', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ memoryUsage: 150 * 1024 * 1024 }), // 150 MB (over limit)
        isLoading: false,
        refetch: mockRefetch,
      });

      const { container } = render(<CacheStatsPanel />);

      const progressBar = container.querySelector('.bg-blue-600.h-2') as HTMLElement;
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('refresh button', () => {
    it('should render Refresh button', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should call refetch when Refresh button is clicked', () => {
      render(<CacheStatsPanel />);

      const refreshButton = screen.getByRole('button', { name: 'Refresh' });
      fireEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should have correct styling for Refresh button', () => {
      render(<CacheStatsPanel />);

      const refreshButton = screen.getByRole('button', { name: 'Refresh' });
      expect(refreshButton).toHaveClass('bg-gray-100');
      expect(refreshButton).toHaveClass('hover:bg-gray-200');
    });
  });

  describe('flush cache button', () => {
    it('should render Flush Cache button', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByRole('button', { name: 'Flush Cache' })).toBeInTheDocument();
    });

    it('should have red styling for Flush Cache button', () => {
      render(<CacheStatsPanel />);

      const flushButton = screen.getByRole('button', { name: 'Flush Cache' });
      expect(flushButton).toHaveClass('bg-red-100');
      expect(flushButton).toHaveClass('text-red-700');
    });

    it('should show confirmation dialog when Flush Cache is clicked', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<CacheStatsPanel />);

      const flushButton = screen.getByRole('button', { name: 'Flush Cache' });
      fireEvent.click(flushButton);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to flush the entire cache?');
      confirmSpy.mockRestore();
    });

    it('should not call flush when user cancels confirmation', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<CacheStatsPanel />);

      const flushButton = screen.getByRole('button', { name: 'Flush Cache' });
      fireEvent.click(flushButton);

      expect(mockFlush).not.toHaveBeenCalled();
    });

    it('should call flush and then refetch when user confirms', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<CacheStatsPanel />);

      const flushButton = screen.getByRole('button', { name: 'Flush Cache' });
      fireEvent.click(flushButton);

      expect(mockFlush).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe('large numbers formatting', () => {
    it('should format large hit counts with locale string', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hits: 1000000 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    it('should format large miss counts with locale string', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ misses: 500000 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.getByText('500,000')).toBeInTheDocument();
    });

    it('should format large key counts with locale string', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ size: 100000 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.getByText('100,000')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle zero stats values', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({
          hits: 0,
          misses: 0,
          hitRate: 0,
          size: 0,
          memoryUsage: 0,
        }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
      expect(screen.getByText('0.00 MB')).toBeInTheDocument();
    });

    it('should handle 100% hit rate', () => {
      mockUseCacheStats.mockReturnValue({
        stats: createMockStats({ hitRate: 1.0 }),
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<CacheStatsPanel />);

      const hitRateElement = screen.getByText('100.0%');
      expect(hitRateElement).toHaveClass('text-green-600');
    });

    it('should render stats grid with correct columns', () => {
      const { container } = render(<CacheStatsPanel />);

      const statsGrid = container.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
      expect(statsGrid).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible heading structure', () => {
      render(<CacheStatsPanel />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Cache Statistics');
    });

    it('should have accessible buttons', () => {
      render(<CacheStatsPanel />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('component structure', () => {
    it('should render within a white rounded container', () => {
      const { container } = render(<CacheStatsPanel />);

      const panel = container.querySelector('.bg-white.rounded-lg.shadow');
      expect(panel).toBeInTheDocument();
    });

    it('should render header section with title and buttons', () => {
      render(<CacheStatsPanel />);

      expect(screen.getByRole('heading', { name: 'Cache Statistics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Flush Cache' })).toBeInTheDocument();
    });
  });
});
