import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAnalytics from '../hooks/useAnalytics';

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should start with zero metrics', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.metrics.revenue).toBe(0);
      expect(result.current.metrics.activeUsers).toBe(0);
      expect(result.current.metrics.churnRate).toBe(0);
      expect(result.current.metrics.arpu).toBe(0);
      expect(result.current.metrics.growthRate).toBe(0);
    });

    it('should default to 30d timeframe', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(result.current.timeframe).toBe('30d');
    });

    it('should start fetching on mount', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(result.current.isFetching).toBe(true);
    });

    it('should have initial log entry for fetch', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(result.current.logs.length).toBeGreaterThanOrEqual(1);
      expect(result.current.logs[0]).toContain('Fetching analytics');
    });

    it('should expose all control functions', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.setTimeframe).toBe('function');
      expect(typeof result.current.fetchMetrics).toBe('function');
    });
  });

  describe('fetchMetrics', () => {
    it('should complete fetch after timeout', async () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.isFetching).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.isFetching).toBe(false);
    });

    it('should populate metrics after fetch', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.metrics.revenue).toBeGreaterThan(0);
      expect(result.current.metrics.activeUsers).toBeGreaterThan(0);
    });

    it('should add log entry when fetch completes', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.logs.some(log => log.includes('Analytics updated'))).toBe(true);
    });

    it('should trigger new fetch when fetchMetrics is called', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const initialLogCount = result.current.logs.length;

      act(() => {
        result.current.fetchMetrics();
      });

      expect(result.current.isFetching).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.logs.length).toBeGreaterThan(initialLogCount);
    });
  });

  describe('setTimeframe', () => {
    it('should update timeframe to 7d', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.setTimeframe('7d');
      });

      expect(result.current.timeframe).toBe('7d');
    });

    it('should update timeframe to 90d', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.setTimeframe('90d');
      });

      expect(result.current.timeframe).toBe('90d');
    });

    it('should add log entry for timeframe change', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.setTimeframe('7d');
      });

      expect(result.current.logs.some(log => log.includes('Timeframe changed to 7d'))).toBe(true);
    });

    it('should trigger refetch when timeframe changes', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.isFetching).toBe(false);

      act(() => {
        result.current.setTimeframe('7d');
      });

      // After changing timeframe, fetch should start again due to useEffect dependency
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.logs.filter(log => log.includes('Analytics updated')).length).toBeGreaterThan(0);
    });
  });

  describe('metrics scaling', () => {
    it('should generate positive revenue', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.metrics.revenue).toBeGreaterThan(0);
    });

    it('should generate positive active users', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.metrics.activeUsers).toBeGreaterThan(0);
    });

    it('should have churn rate between 0 and 100', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.metrics.churnRate).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.churnRate).toBeLessThanOrEqual(100);
    });

    it('should calculate ARPU from revenue and users', async () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.metrics.arpu).toBeGreaterThan(0);
    });
  });

  describe('cleanup', () => {
    it('should clear pending timeout on unmount', async () => {
      const { unmount } = renderHook(() => useAnalytics());

      // Should not throw when unmounting during fetch
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state between hook instances', async () => {
      const { result: result1 } = renderHook(() => useAnalytics());
      const { result: result2 } = renderHook(() => useAnalytics());

      act(() => {
        vi.advanceTimersByTime(1000);
        result1.current.setTimeframe('7d');
      });

      expect(result1.current.timeframe).toBe('7d');
      expect(result2.current.timeframe).toBe('30d');
    });
  });
});
