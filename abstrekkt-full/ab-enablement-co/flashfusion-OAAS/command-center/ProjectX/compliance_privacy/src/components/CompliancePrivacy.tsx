import React from 'react';
import { useCompliancePrivacy } from './useCompliancePrivacy';

/**
 * Demo component for compliance and privacy tooling. Allows users to
 * manage analytics and marketing preferences, request a data export,
 * and request account deletion. Logs actions for demonstration.
 */
export const CompliancePrivacy: React.FC = () => {
  const {
    preferences,
    exporting,
    deleting,
    togglePreference,
    requestDataExport,
    requestAccountDeletion,
    logs,
  } = useCompliancePrivacy();

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Compliance & Privacy Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Preferences</h3>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={preferences.analytics}
            onChange={() => togglePreference('analytics')}
          />
          Accept analytics cookies
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={() => togglePreference('marketing')}
          />
          Receive marketing emails
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Data Requests</h3>
        <button onClick={requestDataExport} disabled={exporting} style={{ marginRight: '0.5rem' }}>
          {exporting ? 'Processing...' : 'Request Data Export'}
        </button>
        <button onClick={requestAccountDeletion} disabled={deleting} style={{ color: 'red' }}>
          {deleting ? 'Processing...' : 'Request Account Deletion'}
        </button>
      </div>
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

export default CompliancePrivacy;