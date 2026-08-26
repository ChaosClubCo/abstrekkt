import { useState } from 'react';

export interface UserMetric {
  id: string;
  userId: string;
  event: string;
  timestamp: Date;
  feature: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  uniqueUsers: number;
  topFeatures: { feature: string; count: number }[];
}

/**
 * Hook to manage and summarize user behavioural analytics. In this demo,
 * random sample data is generated. In production, data would be fetched
 * from an analytics backend (e.g. database, event stream) and aggregated.
 */
export function useAdvancedAnalytics() {
  // Generate sample metrics for demonstration
  const sampleFeatures = ['builder', 'deploy', 'commerce', 'ai_fine_tune', 'search'];
  const sampleEvents = ['click', 'page_view', 'action', 'error'];

  const generateSampleData = (): UserMetric[] => {
    const metrics: UserMetric[] = [];
    for (let i = 0; i < 200; i++) {
      const userId = 'user_' + Math.ceil(Math.random() * 10);
      const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const feature = sampleFeatures[Math.floor(Math.random() * sampleFeatures.length)];
      const timestamp = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30); // within last 30 days
      metrics.push({ id: `${userId}_${i}`, userId, event, timestamp, feature });
    }
    return metrics;
  };

  const [metrics] = useState<UserMetric[]>(generateSampleData());
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * Compute summary statistics for the current date range.
   */
  const computeSummary = () => {
    const filtered = metrics.filter((m) => m.timestamp >= startDate && m.timestamp <= endDate);
    const uniqueUsers = new Set(filtered.map((m) => m.userId)).size;
    const totalEvents = filtered.length;
    const featureCounts: Record<string, number> = {};
    filtered.forEach((m) => {
      featureCounts[m.feature] = (featureCounts[m.feature] || 0) + 1;
    });
    const topFeatures = Object.entries(featureCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }));
    setSummary({ totalEvents, uniqueUsers, topFeatures });
    setLogs((prev) => [
      `[${new Date().toISOString()}] Computed analytics for range ${startDate.toISOString()} – ${endDate.toISOString()}`,
      ...prev,
    ]);
  };

  return {
    metrics,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    summary,
    computeSummary,
    logs,
  };
}