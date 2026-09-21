import { useState } from 'react';

/**
 * Represents a single third‑party integration, such as GitHub, Slack or Jira.
 */
export interface Integration {
  /** Name of the provider (e.g. GitHub, Slack) */
  provider: string;
  /** Whether the integration is currently connected */
  connected: boolean;
  /** Optional API token or identifier for the integration */
  token?: string;
}

/**
 * Hook to manage a list of third‑party integrations. Provides methods to
 * connect, disconnect and remove integrations along with an event log.
 */
export function useIntegrationsManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * Connect to a provider using the supplied token. If the provider is
   * already listed, it updates the token and marks it as connected.
   * @param provider The provider name
   * @param token Authentication token or API key
   */
  const connectIntegration = (provider: string, token: string) => {
    setIntegrations((prev) => {
      const existing = prev.find((i) => i.provider === provider);
      if (existing) {
        return prev.map((i) =>
          i.provider === provider
            ? { ...i, connected: true, token }
            : i
        );
      }
      return [...prev, { provider, connected: true, token }];
    });
    setLogs((prev) => [
      `[${new Date().toISOString()}] Connected ${provider}`,
      ...prev,
    ]);
  };

  /**
   * Disconnect from a provider (but keep the integration on record). Does
   * not remove the stored token.
   * @param provider The provider to disconnect
   */
  const disconnectIntegration = (provider: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider ? { ...i, connected: false } : i
      )
    );
    setLogs((prev) => [
      `[${new Date().toISOString()}] Disconnected ${provider}`,
      ...prev,
    ]);
  };

  /**
   * Permanently remove an integration entry, deleting any stored token.
   * @param provider The provider to remove
   */
  const removeIntegration = (provider: string) => {
    setIntegrations((prev) => prev.filter((i) => i.provider !== provider));
    setLogs((prev) => [
      `[${new Date().toISOString()}] Removed ${provider}`,
      ...prev,
    ]);
  };

  return { integrations, connectIntegration, disconnectIntegration, removeIntegration, logs };
}