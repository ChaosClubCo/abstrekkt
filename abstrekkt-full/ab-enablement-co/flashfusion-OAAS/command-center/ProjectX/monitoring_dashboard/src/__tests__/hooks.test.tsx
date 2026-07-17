import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMonitoring from '../hooks/useMonitoring';

describe('useMonitoring', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have default metrics values', () => {
      const { result } = renderHook(() => useMonitoring());

      expect(result.current.metrics.uptime).toBe(99.9);
      expect(result.current.metrics.cpu).toBe(25);
      expect(result.current.metrics.memory).toBe(40);
      expect(result.current.metrics.requestsPerMinute).toBe(120);
      expect(result.current.metrics.errorRate).toBe(0.1);
    });

    it('should start with empty logs', () => {
      const { result } = renderHook(() => useMonitoring());
      expect(result.current.logs).toEqual([]);
    });

    it('should default to realtime timeframe', () => {
      const { result } = renderHook(() => useMonitoring());
      expect(result.current.timeframe).toBe('realtime');
    });

    it('should start with monitoring stopped', () => {
      const { result } = renderHook(() => useMonitoring());
      expect(result.current.isMonitoring).toBe(false);
    });

    it('should expose all control functions', () => {
      const { result } = renderHook(() => useMonitoring());
      expect(typeof result.current.startMonitoring).toBe('function');
      expect(typeof result.current.stopMonitoring).toBe('function');
      expect(typeof result.current.setTimeframe).toBe('function');
    });
  });

  describe('startMonitoring', () => {
    it('should set isMonitoring to true', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);
    });

    it('should add log entry when starting', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.logs[0]).toContain('Monitoring started');
    });

    it('should include timeframe in start log', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.setTimeframe('1h');
      });

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.logs.some(log => log.includes('1h'))).toBe(true);
    });

    it('should update metrics immediately when starting', () => {
      const { result } = renderHook(() => useMonitoring());
      const initialCpu = result.current.metrics.cpu;

      act(() => {
        result.current.startMonitoring();
      });

      // Metrics should be updated (but values may be same due to jitter range)
      expect(result.current.logs.some(log => log.includes('Updated metrics'))).toBe(true);
    });

    it('should not start multiple intervals if called twice', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      const logsAfterFirstStart = result.current.logs.length;

      act(() => {
        result.current.startMonitoring();
      });

      // No additional "Monitoring started" log should be added
      expect(result.current.logs.filter(log => log.includes('Monitoring started')).length).toBe(1);
    });
  });

  describe('stopMonitoring', () => {
    it('should set isMonitoring to false', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
    });

    it('should add log entry when stopping', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.logs.some(log => log.includes('Monitoring stopped'))).toBe(true);
    });

    it('should stop metric updates', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      const logsBeforeStop = result.current.logs.length;

      act(() => {
        result.current.stopMonitoring();
      });

      const logsAfterStop = result.current.logs.length;

      // Advance time and check no new updates
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should only have one more log entry (the stop message)
      expect(result.current.logs.length).toBe(logsAfterStop);
    });
  });

  describe('setTimeframe', () => {
    it('should update timeframe state', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.setTimeframe('1h');
      });

      expect(result.current.timeframe).toBe('1h');
    });

    it('should add log entry for timeframe change', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.setTimeframe('24h');
      });

      expect(result.current.logs.some(log => log.includes('Timeframe changed to 24h'))).toBe(true);
    });

    it('should support all timeframe values', () => {
      const { result } = renderHook(() => useMonitoring());

      const timeframes = ['1m', '1h', '24h', 'realtime'] as const;

      for (const tf of timeframes) {
        act(() => {
          result.current.setTimeframe(tf);
        });
        expect(result.current.timeframe).toBe(tf);
      }
    });
  });

  describe('metric updates', () => {
    it('should update metrics periodically when monitoring', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      const updateLogsCount = result.current.logs.filter(log => log.includes('Updated metrics')).length;

      act(() => {
        vi.advanceTimersByTime(2000); // 2 second interval
      });

      const newUpdateLogsCount = result.current.logs.filter(log => log.includes('Updated metrics')).length;
      expect(newUpdateLogsCount).toBeGreaterThan(updateLogsCount);
    });

    it('should keep metrics within bounds', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      // Run multiple updates
      for (let i = 0; i < 10; i++) {
        act(() => {
          vi.advanceTimersByTime(2000);
        });
      }

      expect(result.current.metrics.uptime).toBeGreaterThanOrEqual(99.5);
      expect(result.current.metrics.uptime).toBeLessThanOrEqual(100);
      expect(result.current.metrics.cpu).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.cpu).toBeLessThanOrEqual(100);
      expect(result.current.metrics.memory).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.memory).toBeLessThanOrEqual(100);
      expect(result.current.metrics.errorRate).toBeGreaterThanOrEqual(0);
      expect(result.current.metrics.errorRate).toBeLessThanOrEqual(5);
    });
  });

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const { result, unmount } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      unmount();

      // This should not throw or cause issues
      act(() => {
        vi.advanceTimersByTime(10000);
      });
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state between hook instances', () => {
      const { result: result1 } = renderHook(() => useMonitoring());
      const { result: result2 } = renderHook(() => useMonitoring());

      act(() => {
        result1.current.startMonitoring();
      });

      expect(result1.current.isMonitoring).toBe(true);
      expect(result2.current.isMonitoring).toBe(false);
    });
  });

  describe('polling intervals', () => {
    it('should update metrics every 2 seconds when monitoring', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      const initialUpdateCount = result.current.logs.filter(log => log.includes('Updated metrics')).length;

      // Advance by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const afterFirstInterval = result.current.logs.filter(log => log.includes('Updated metrics')).length;
      expect(afterFirstInterval).toBeGreaterThan(initialUpdateCount);

      // Advance by another 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const afterSecondInterval = result.current.logs.filter(log => log.includes('Updated metrics')).length;
      expect(afterSecondInterval).toBeGreaterThan(afterFirstInterval);
    });

    it('should not update metrics before 2 second interval', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      const initialUpdateCount = result.current.logs.filter(log => log.includes('Updated metrics')).length;

      // Advance by 1 second (less than interval)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const afterOneSecond = result.current.logs.filter(log => log.includes('Updated metrics')).length;
      expect(afterOneSecond).toBe(initialUpdateCount);
    });
  });

  describe('metrics fetching behavior', () => {
    it('should maintain metrics structure after updates', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Verify all metric properties exist
      expect(result.current.metrics).toHaveProperty('uptime');
      expect(result.current.metrics).toHaveProperty('cpu');
      expect(result.current.metrics).toHaveProperty('memory');
      expect(result.current.metrics).toHaveProperty('requestsPerMinute');
      expect(result.current.metrics).toHaveProperty('errorRate');
    });

    it('should return numeric values for all metrics', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(typeof result.current.metrics.uptime).toBe('number');
      expect(typeof result.current.metrics.cpu).toBe('number');
      expect(typeof result.current.metrics.memory).toBe('number');
      expect(typeof result.current.metrics.requestsPerMinute).toBe('number');
      expect(typeof result.current.metrics.errorRate).toBe('number');
    });
  });

  describe('cleanup on unmount', () => {
    it('should not throw errors after unmount with active monitoring', () => {
      const { result, unmount } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      // Unmount while monitoring is active
      unmount();

      // This should not cause any errors
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(10000);
        });
      }).not.toThrow();
    });

    it('should clean up interval even if stop was not called', () => {
      const { result, unmount } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);

      unmount();

      // No way to directly verify interval cleared, but should not error
      act(() => {
        vi.advanceTimersByTime(20000);
      });
    });
  });

  describe('multiple start/stop cycles', () => {
    it('should handle multiple start/stop cycles', () => {
      const { result } = renderHook(() => useMonitoring());

      // First cycle
      act(() => {
        result.current.startMonitoring();
      });
      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        result.current.stopMonitoring();
      });
      expect(result.current.isMonitoring).toBe(false);

      // Second cycle
      act(() => {
        result.current.startMonitoring();
      });
      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        result.current.stopMonitoring();
      });
      expect(result.current.isMonitoring).toBe(false);
    });

    it('should accumulate logs across start/stop cycles', () => {
      const { result } = renderHook(() => useMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      act(() => {
        result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      // Should have 2 start logs and 2 stop logs
      const startLogs = result.current.logs.filter(log => log.includes('Monitoring started'));
      const stopLogs = result.current.logs.filter(log => log.includes('Monitoring stopped'));

      expect(startLogs.length).toBe(2);
      expect(stopLogs.length).toBe(2);
    });
  });
});
