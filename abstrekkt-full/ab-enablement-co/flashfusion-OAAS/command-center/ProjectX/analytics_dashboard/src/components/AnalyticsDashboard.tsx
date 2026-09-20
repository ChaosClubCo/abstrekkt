import React from 'react';
import useAnalytics, { AnalyticsTimeframe } from '../hooks/useAnalytics';

/**
 * AnalyticsDashboard displays key business metrics (revenue, active users,
 * churn rate, ARPU and growth rate) for a selected timeframe.  Users can
 * refresh the data on demand and view a log of fetch operations.  In
 * production connect this component to your analytics backend to fetch
 * real metrics.
 */
const AnalyticsDashboard: React.FC = () => {
  const { metrics, logs, timeframe, isFetching, setTimeframe, fetchMetrics } = useAnalytics();

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value as AnalyticsTimeframe);
  };

  const growthIcon = metrics.growthRate > 0 ? '↑' : metrics.growthRate < 0 ? '↓' : '→';
  const growthColor = metrics.growthRate > 0 ? 'green' : metrics.growthRate < 0 ? 'red' : 'gray';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h2>Analytics Dashboard Demo</h2>
      <p>Observe revenue and user metrics over different timeframes.</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          Timeframe:
          <select value={timeframe} onChange={handleTimeframeChange} disabled={isFetching}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </label>
        <button type="button" onClick={fetchMetrics} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <MetricCard label="Revenue (MRR)" value={`$${metrics.revenue.toLocaleString()}`} />
        <MetricCard label="Active Users" value={metrics.activeUsers.toLocaleString()} />
        <MetricCard label="Churn Rate" value={`${metrics.churnRate.toFixed(2)}%`} />
        <MetricCard label="ARPU" value={`$${metrics.arpu.toFixed(2)}`} />
        <MetricCard
          label="Growth"
          value={`${metrics.growthRate.toFixed(2)}% ${growthIcon}`}
          valueColor={growthColor}
        />
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Log</h3>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '0.5rem',
            height: '180px',
            overflow: 'auto',
            fontSize: '0.8rem',
          }}
        >
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, valueColor = '#333' }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '4px',
        padding: '0.75rem',
      }}
    >
      <div style={{ fontSize: '0.85rem', color: '#555' }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: valueColor }}>{value}</div>
    </div>
  );
};

export default AnalyticsDashboard;