import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';

describe('useAdvancedAnalytics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have sample metrics data', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      expect(result.current.metrics).toBeDefined();
      expect(result.current.metrics.length).toBe(200);
    });

    it('should have default start date (7 days ago)', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      const expectedStart = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      expect(result.current.startDate.getTime()).toBe(expectedStart.getTime());
    });

    it('should have end date as today', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      expect(result.current.endDate.getTime()).toBe(new Date().getTime());
    });

    it('should start with null summary', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      expect(result.current.summary).toBeNull();
    });

    it('should start with empty logs', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      expect(result.current.logs).toEqual([]);
    });

    it('should expose all required functions', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      expect(typeof result.current.setStartDate).toBe('function');
      expect(typeof result.current.setEndDate).toBe('function');
      expect(typeof result.current.computeSummary).toBe('function');
    });
  });

  describe('metrics structure', () => {
    it('should have id for each metric', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      result.current.metrics.forEach(metric => {
        expect(metric.id).toBeDefined();
        expect(typeof metric.id).toBe('string');
      });
    });

    it('should have userId for each metric', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      result.current.metrics.forEach(metric => {
        expect(metric.userId).toBeDefined();
        expect(metric.userId).toMatch(/^user_\d+$/);
      });
    });

    it('should have valid event types', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      const validEvents = ['click', 'page_view', 'action', 'error'];
      result.current.metrics.forEach(metric => {
        expect(validEvents).toContain(metric.event);
      });
    });

    it('should have valid features', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      const validFeatures = ['builder', 'deploy', 'commerce', 'ai_fine_tune', 'search'];
      result.current.metrics.forEach(metric => {
        expect(validFeatures).toContain(metric.feature);
      });
    });

    it('should have timestamp as Date object', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      result.current.metrics.forEach(metric => {
        expect(metric.timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('setStartDate', () => {
    it('should update start date', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      const newDate = new Date('2024-01-01');

      act(() => {
        result.current.setStartDate(newDate);
      });

      expect(result.current.startDate).toEqual(newDate);
    });
  });

  describe('setEndDate', () => {
    it('should update end date', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());
      const newDate = new Date('2024-01-20');

      act(() => {
        result.current.setEndDate(newDate);
      });

      expect(result.current.endDate).toEqual(newDate);
    });
  });

  describe('computeSummary', () => {
    it('should compute summary when called', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.summary).not.toBeNull();
    });

    it('should have totalEvents in summary', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.summary?.totalEvents).toBeDefined();
      expect(typeof result.current.summary?.totalEvents).toBe('number');
    });

    it('should have uniqueUsers in summary', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.summary?.uniqueUsers).toBeDefined();
      expect(typeof result.current.summary?.uniqueUsers).toBe('number');
    });

    it('should have topFeatures in summary', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.summary?.topFeatures).toBeDefined();
      expect(Array.isArray(result.current.summary?.topFeatures)).toBe(true);
    });

    it('should limit topFeatures to 5', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.summary?.topFeatures.length).toBeLessThanOrEqual(5);
    });

    it('should sort topFeatures by count descending', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      const features = result.current.summary?.topFeatures || [];
      for (let i = 1; i < features.length; i++) {
        expect(features[i - 1].count).toBeGreaterThanOrEqual(features[i].count);
      }
    });

    it('should add log entry when computing', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0]).toContain('Computed analytics');
    });

    it('should include date range in log', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      expect(result.current.logs[0]).toContain(result.current.startDate.toISOString());
      expect(result.current.logs[0]).toContain(result.current.endDate.toISOString());
    });

    it('should filter metrics by date range', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      // Set a very restrictive date range
      act(() => {
        result.current.setStartDate(new Date('2024-01-15T09:59:00Z'));
        result.current.setEndDate(new Date('2024-01-15T10:01:00Z'));
        result.current.computeSummary();
      });

      // With such a small window, we should get very few or no events
      expect(result.current.summary?.totalEvents).toBeLessThan(200);
    });

    it('should recompute when called again', () => {
      const { result } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result.current.computeSummary();
      });

      const firstTotal = result.current.summary?.totalEvents;

      // Split act blocks to ensure state update flushes before computeSummary reads it
      act(() => {
        result.current.setStartDate(new Date('2020-01-01'));
      });

      act(() => {
        result.current.computeSummary();
      });

      // With a much wider range, we should get all events
      expect(result.current.summary?.totalEvents).toBe(200);
      expect(result.current.logs).toHaveLength(2);
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state between hook instances', () => {
      const { result: result1 } = renderHook(() => useAdvancedAnalytics());
      const { result: result2 } = renderHook(() => useAdvancedAnalytics());

      act(() => {
        result1.current.computeSummary();
      });

      expect(result1.current.summary).not.toBeNull();
      expect(result2.current.summary).toBeNull();
    });
  });
});
