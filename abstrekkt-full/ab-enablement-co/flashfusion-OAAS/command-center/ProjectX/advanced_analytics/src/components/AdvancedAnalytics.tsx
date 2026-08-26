import React from 'react';
import { useAdvancedAnalytics } from './useAdvancedAnalytics';

/**
 * Demo component displaying advanced analytics and user metrics for
 * FlashFusion. Users can select a date range and compute metrics such
 * as total events, unique users and top features used. Results are
 * displayed in a simple list. In production, you would replace this
 * with charts and more sophisticated dashboards.
 */
export const AdvancedAnalytics: React.FC = () => {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    summary,
    computeSummary,
    logs,
  } = useAdvancedAnalytics();

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Advanced Analytics Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Start date:
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          End date:
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <button onClick={computeSummary} style={{ marginLeft: '1rem' }}>Compute</button>
      </div>
      {summary ? (
        <div>
          <p>Total events: {summary.totalEvents}</p>
          <p>Unique users: {summary.uniqueUsers}</p>
          <h4>Top Features</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {summary.topFeatures.map((f) => (
              <li key={f.feature}>
                {f.feature}: {f.count}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Select a date range and click Compute to see results.</p>
      )}
      <div>
        <h4>Logs</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', fontSize: '0.8rem' }}>
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;