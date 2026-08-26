import React, { useState } from 'react';
import { useIntegrationsManager } from './useIntegrationsManager';

/**
 * List of supported providers. In a production app this could be driven by
 * configuration from the backend rather than hardcoded.
 */
const providers = ['GitHub', 'Slack', 'Notion', 'Jira', 'Linear'];

/**
 * Demo component for managing third‑party integrations. Allows users to
 * connect to a provider by supplying an API token, disconnect an existing
 * integration, or remove it entirely. Logs actions for debugging and demo
 * purposes.
 */
export const IntegrationsManager: React.FC = () => {
  const {
    integrations,
    connectIntegration,
    disconnectIntegration,
    removeIntegration,
    logs,
  } = useIntegrationsManager();
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0]);
  const [token, setToken] = useState<string>('');

  /**
   * Handle connecting to the selected provider. Requires a non‑empty token.
   */
  const handleConnect = () => {
    const trimmed = token.trim();
    if (!trimmed) return;
    connectIntegration(selectedProvider, trimmed);
    setToken('');
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-2">Integrations Manager Demo</h2>
      <div className="flex gap-2 mb-2">
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="flex-1 border rounded p-1"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter API token"
          className="flex-1 border rounded p-1"
        />
        <button
          onClick={handleConnect}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Connect
        </button>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-1">Connected Integrations</h3>
        {integrations.length === 0 && (
          <p className="text-sm text-gray-500">No integrations configured.</p>
        )}
        <ul className="space-y-2">
          {integrations.map((i) => (
            <li
              key={i.provider}
              className="p-2 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{i.provider}</p>
                <p className="text-sm">
                  {i.connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => disconnectIntegration(i.provider)}
                  className="text-yellow-600 hover:underline text-sm"
                >
                  {i.connected ? 'Disconnect' : 'Reconnect'}
                </button>
                <button
                  onClick={() => removeIntegration(i.provider)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-1">Logs</h3>
        {logs.length === 0 && (
          <p className="text-sm text-gray-500">No logs.</p>
        )}
        <ul className="text-xs max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
          {logs.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};