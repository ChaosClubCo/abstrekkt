import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Represents high‑level analytics metrics that product owners often track.
 * Revenue is represented as monthly recurring revenue (MRR) in USD.
 * Active users counts users engaged in a given timeframe.  Churn
 * measures the percentage of users who cancelled their subscription
 * within the timeframe.  ARPU (average revenue per user) is derived
 * from revenue and active users.  The growth rate indicates the
 * percentage change in revenue compared to the previous period.
 */
export interface AnalyticsMetrics {
  revenue: number; // MRR in USD
  activeUsers: number;
  churnRate: number; // percentage
  arpu: number; // average revenue per user
  growthRate: number; // percentage
}

export type AnalyticsTimeframe = '7d' | '30d' | '90d';

export interface UseAnalyticsResult {
  metrics: AnalyticsMetrics;
  logs: string[];
  timeframe: AnalyticsTimeframe;
  isFetching: boolean;
  setTimeframe: (tf: AnalyticsTimeframe) => void;
  fetchMetrics: () => void;
}

/**
 * useAnalytics simulates fetching analytics metrics.  When the timeframe
 * changes or fetchMetrics is called, it generates numbers based on
 * simple random functions.  Replace the random generation with real
 * calls to your analytics backend (e.g. Mixpanel, Amplitude or your
 * own data warehouse).  Use environment variables to configure API
 * endpoints and authentication.
 */
const useAnalytics = (): UseAnalyticsResult => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    revenue: 0,
    activeUsers: 0,
    churnRate: 0,
    arpu: 0,
    growthRate: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [timeframe, setTimeframeState] = useState<AnalyticsTimeframe>('30d');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const fetchRef = useRef<number | null>(null);

  const appendLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const generateMetrics = useCallback(() => {
    // Simulate different scales based on timeframe
    const scale = timeframe === '7d' ? 1 : timeframe === '30d' ? 3 : 6;
    const revenue = Math.round(5000 * scale + Math.random() * 2000);
    const activeUsers = Math.round(200 * scale + Math.random() * 80);
    const churnRate = parseFloat((Math.random() * 5).toFixed(2));
    const arpu = parseFloat((revenue / activeUsers).toFixed(2));
    const growthRate = parseFloat(((Math.random() * 10) - 2).toFixed(2));
    setMetrics({ revenue, activeUsers, churnRate, arpu, growthRate });
  }, [timeframe]);

  const fetchMetrics = useCallback(() => {
    setIsFetching(true);
    appendLog(`Fetching analytics for ${timeframe} timeframe`);
    if (fetchRef.current !== null) {
      clearTimeout(fetchRef.current);
    }
    fetchRef.current = window.setTimeout(() => {
      generateMetrics();
      appendLog('Analytics updated');
      setIsFetching(false);
    }, 800);
  }, [timeframe, generateMetrics]);

  useEffect(() => {
    // Initial fetch
    fetchMetrics();
    return () => {
      if (fetchRef.current !== null) {
        clearTimeout(fetchRef.current);
      }
    };
  }, [fetchMetrics]);

  const setTimeframe = useCallback((tf: AnalyticsTimeframe) => {
    setTimeframeState(tf);
    appendLog(`Timeframe changed to ${tf}`);
  }, []);

  return { metrics, logs, timeframe, isFetching, setTimeframe, fetchMetrics };
};

export default useAnalytics;