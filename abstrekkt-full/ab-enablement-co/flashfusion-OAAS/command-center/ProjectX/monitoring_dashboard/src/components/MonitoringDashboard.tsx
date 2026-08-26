import React, { useState } from 'react';
import useMonitoring, { Timeframe } from '../hooks/useMonitoring';

/**
 * MonitoringDashboard is a simple UI that displays real‑time metrics
 * about an application or service. Users can choose the timeframe
 * they wish to observe (real‑time, last minute, hour or day), start
 * and stop monitoring and view a rolling log of metric updates. In
 * production this component would be fed by a monitoring backend such
 * as Prometheus or Datadog via a WebSocket or HTTP polling client.
 */
const MonitoringDashboard: React.FC = () => {
  const {
    metrics,
    logs,
    timeframe,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    setTimeframe,
  } = useMonitoring();

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value as Timeframe);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h2>Monitoring Dashboard Demo</h2>
      <p>
        This demo displays simulated metrics to illustrate how you might
        implement a live monitoring dashboard. Select a timeframe to filter
        data and start monitoring to begin streaming updates.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          Timeframe:
          <select value={timeframe} onChange={handleTimeframeChange} disabled={isMonitoring}>
            <option value="realtime">Real‑time</option>
            <option value="1m">Last 1 minute</option>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
          </select>
        </label>
        <button onClick={isMonitoring ? stopMonitoring : startMonitoring}>
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <MetricCard label="Uptime" value={`${metrics.uptime.toFixed(2)}%`} />
        <MetricCard label="CPU Usage" value={`${metrics.cpu.toFixed(2)}%`} />
        <MetricCard label="Memory Usage" value={`${metrics.memory.toFixed(2)}%`} />
        <MetricCard label="Req/min" value={metrics.requestsPerMinute.toString()} />
        <MetricCard label="Error Rate" value={`${metrics.errorRate.toFixed(2)}%`} />
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
}

/**
 * Small presentational component to display a single metric. Keeping this
 * component separate improves readability and makes it easier to apply
 * consistent styling or extend the layout later.
 */
const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => {
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
      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</div>
    </div>
  );
};

export default MonitoringDashboard;