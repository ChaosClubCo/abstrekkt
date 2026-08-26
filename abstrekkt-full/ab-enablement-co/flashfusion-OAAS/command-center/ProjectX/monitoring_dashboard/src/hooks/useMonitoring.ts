import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Metrics collected by the monitoring dashboard. Each field represents
 * a simplified view of system health. In production you may want to
 * collect additional metrics (e.g. latency percentiles, database
 * connections, queue depths) and group them by service or region.
 */
export interface Metrics {
  uptime: number; // percentage uptime (0–100)
  cpu: number; // CPU usage percentage
  memory: number; // memory usage percentage
  requestsPerMinute: number; // number of incoming requests per minute
  errorRate: number; // error rate percentage
}

export type Timeframe = '1m' | '1h' | '24h' | 'realtime';

/**
 * Hook return type exposing metrics, logs and control functions for
 * monitoring. It includes a way to start/stop the update loop and to
 * adjust the timeframe used for visualisation. Consumers should call
 * `startMonitoring()` when the dashboard is mounted and `stopMonitoring()`
 * when it unmounts to avoid running timers indefinitely.
 */
export interface UseMonitoringResult {
  metrics: Metrics;
  logs: string[];
  timeframe: Timeframe;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  setTimeframe: (tf: Timeframe) => void;
}

/**
 * useMonitoring manages fake metrics and logs that update on an interval.
 * This simulates pulling data from a monitoring backend.  When hooking
 * into a real metrics system (e.g. Prometheus, Datadog), replace the
 * random generation with HTTP or WebSocket calls.  Avoid keeping
 * long‑running intervals if the component is unmounted by cleaning
 * them up in `stopMonitoring()`.
 */
const useMonitoring = (): UseMonitoringResult => {
  const [metrics, setMetrics] = useState<Metrics>({
    uptime: 99.9,
    cpu: 25,
    memory: 40,
    requestsPerMinute: 120,
    errorRate: 0.1,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [timeframe, setTimeframeState] = useState<Timeframe>('realtime');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  /**
   * Updates metrics with small random fluctuations to mimic real data.
   */
  const updateMetrics = useCallback(() => {
    setMetrics((prev) => {
      const jitter = (val: number, maxDelta: number, min = 0, max = 100) => {
        const delta = (Math.random() - 0.5) * maxDelta * 2;
        const newVal = Math.min(max, Math.max(min, val + delta));
        return parseFloat(newVal.toFixed(2));
      };
      return {
        uptime: jitter(prev.uptime, 0.01, 99.5, 100),
        cpu: jitter(prev.cpu, 5, 0, 100),
        memory: jitter(prev.memory, 4, 0, 100),
        requestsPerMinute: Math.max(0, Math.round(prev.requestsPerMinute + (Math.random() - 0.5) * 10)),
        errorRate: parseFloat(jitter(prev.errorRate, 0.05, 0, 5).toFixed(2)),
      };
    });
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Updated metrics`,
    ]);
  }, []);

  /**
   * Starts the monitoring interval if not already running. Logs the start
   * time and begins periodic updates. If metrics were previously
   * initialised, they will continue to drift from their current values.
   */
  const startMonitoring = useCallback(() => {
    if (intervalRef.current !== null) return;
    setIsMonitoring(true);
    setLogs((prev) => [...prev, `Monitoring started for timeframe: ${timeframe}`]);
    updateMetrics();
    intervalRef.current = window.setInterval(updateMetrics, 2000);
  }, [updateMetrics, timeframe]);

  /**
   * Stops the monitoring loop if one is active. Clears the interval and
   * logs the stop event. Called when the dashboard unmounts or when
   * users explicitly stop monitoring.
   */
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
    setLogs((prev) => [...prev, 'Monitoring stopped']);
  }, []);

  /**
   * Updates the timeframe state. In a real implementation this would
   * trigger a request for historical data over the selected range or
   * adjust the polling frequency. Here we simply record the change.
   */
  const setTimeframe = useCallback((tf: Timeframe) => {
    setTimeframeState(tf);
    setLogs((prev) => [...prev, `Timeframe changed to ${tf}`]);
  }, []);

  // Clean up interval when the hook is unmounted
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { metrics, logs, timeframe, isMonitoring, startMonitoring, stopMonitoring, setTimeframe };
};

export default useMonitoring;