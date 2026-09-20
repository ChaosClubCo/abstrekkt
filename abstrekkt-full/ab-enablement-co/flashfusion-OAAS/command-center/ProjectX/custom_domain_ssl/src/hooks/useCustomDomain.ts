import { useState } from 'react';
import { nanoid } from 'nanoid';

export interface DomainConfig {
  id: string;
  domain: string;
  status: 'pending' | 'verifying' | 'active' | 'error';
  sslEnabled: boolean;
}

/**
 * Hook to manage custom domains and SSL configuration. Provides
 * functions to add a domain, start verification and enable SSL.
 * Maintains logs for demonstration. In production this would
 * interact with your DNS provider and certificate manager (e.g.
 * Let’s Encrypt, AWS ACM).
 */
export function useCustomDomain() {
  const [domains, setDomains] = useState<DomainConfig[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addDomain = (domain: string) => {
    if (!domain.trim()) return;
    const config: DomainConfig = {
      id: nanoid(),
      domain: domain.trim(),
      status: 'pending',
      sslEnabled: false,
    };
    setDomains((prev) => [...prev, config]);
    setLogs((prev) => [`[${new Date().toISOString()}] Added domain: ${domain.trim()}`, ...prev]);
  };

  const startVerification = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'verifying' } : d))
    );
    const domain = domains.find((d) => d.id === id);
    setLogs((prev) => [`[${new Date().toISOString()}] Started verification for ${domain?.domain}`, ...prev]);
    // Simulate verification after 2 seconds
    setTimeout(() => {
      setDomains((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'active' } : d))
      );
      setLogs((prev) => [`[${new Date().toISOString()}] Domain ${domain?.domain} verified`, ...prev]);
    }, 2000);
  };

  const enableSSL = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, sslEnabled: true } : d))
    );
    const domain = domains.find((d) => d.id === id);
    setLogs((prev) => [`[${new Date().toISOString()}] Enabled SSL for ${domain?.domain}`, ...prev]);
  };

  return {
    domains,
    addDomain,
    startVerification,
    enableSSL,
    logs,
  };
}