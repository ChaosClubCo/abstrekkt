import type {
  IPRule,
  IPWhitelistConfig,
  AccessAttempt,
  IPAccessResult,
  GracePeriodRequest,
  CreateRuleInput,
  UpdateRuleInput,
  AccessAttemptQuery,
  GeoLocation,
  SessionIPInfo,
} from '../types';

const API_BASE = '/api/ip-whitelist';

// Check access
export async function checkIPAccess(): Promise<IPAccessResult> {
  const response = await fetch(`${API_BASE}/check`);
  if (!response.ok) throw new Error('Failed to check IP access');
  return response.json();
}

export async function checkIPAccessForAddress(ipAddress: string): Promise<IPAccessResult> {
  const response = await fetch(`${API_BASE}/check/${ipAddress}`);
  if (!response.ok) throw new Error('Failed to check IP access');
  return response.json();
}

// Get config
export async function getConfig(): Promise<IPWhitelistConfig> {
  const response = await fetch(`${API_BASE}/config`);
  if (!response.ok) throw new Error('Failed to fetch IP whitelist config');
  return response.json();
}

export async function updateConfig(config: Partial<IPWhitelistConfig>): Promise<IPWhitelistConfig> {
  const response = await fetch(`${API_BASE}/config`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to update IP whitelist config');
  return response.json();
}

// Rules management
export async function getRules(): Promise<IPRule[]> {
  const response = await fetch(`${API_BASE}/rules`);
  if (!response.ok) throw new Error('Failed to fetch IP rules');
  return response.json();
}

export async function createRule(input: CreateRuleInput): Promise<IPRule> {
  const response = await fetch(`${API_BASE}/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to create IP rule');
  return response.json();
}

export async function updateRule(ruleId: string, input: UpdateRuleInput): Promise<IPRule> {
  const response = await fetch(`${API_BASE}/rules/${ruleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to update IP rule');
  return response.json();
}

export async function deleteRule(ruleId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/rules/${ruleId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete IP rule');
}

export async function toggleRule(ruleId: string, enabled: boolean): Promise<IPRule> {
  return updateRule(ruleId, { enabled });
}

// Access attempts
export async function getAccessAttempts(query?: AccessAttemptQuery): Promise<AccessAttempt[]> {
  const params = new URLSearchParams();
  if (query?.userId) params.set('userId', query.userId);
  if (query?.ipAddress) params.set('ipAddress', query.ipAddress);
  if (query?.action) params.set('action', query.action);
  if (query?.startDate) params.set('startDate', query.startDate);
  if (query?.endDate) params.set('endDate', query.endDate);
  if (query?.limit) params.set('limit', query.limit.toString());
  if (query?.offset) params.set('offset', query.offset.toString());

  const response = await fetch(`${API_BASE}/access-attempts?${params}`);
  if (!response.ok) throw new Error('Failed to fetch access attempts');
  return response.json();
}

// Geolocation
export async function getGeoLocation(ipAddress?: string): Promise<GeoLocation> {
  const url = ipAddress ? `${API_BASE}/geo/${ipAddress}` : `${API_BASE}/geo`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch geolocation');
  return response.json();
}

// Grace period requests
export async function getGracePeriodRequests(status?: string): Promise<GracePeriodRequest[]> {
  const params = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE}/grace-period${params}`);
  if (!response.ok) throw new Error('Failed to fetch grace period requests');
  return response.json();
}

export async function createGracePeriodRequest(reason: string): Promise<GracePeriodRequest> {
  const response = await fetch(`${API_BASE}/grace-period`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) throw new Error('Failed to create grace period request');
  return response.json();
}

export async function reviewGracePeriodRequest(
  requestId: string,
  action: 'approve' | 'deny'
): Promise<GracePeriodRequest> {
  const response = await fetch(`${API_BASE}/grace-period/${requestId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error('Failed to review grace period request');
  return response.json();
}

// Session binding
export async function getSessionIPInfo(): Promise<SessionIPInfo> {
  const response = await fetch(`${API_BASE}/session-ip`);
  if (!response.ok) throw new Error('Failed to fetch session IP info');
  return response.json();
}

export async function bindSessionToIP(): Promise<SessionIPInfo> {
  const response = await fetch(`${API_BASE}/session-ip/bind`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to bind session to IP');
  return response.json();
}

// Validation
export async function validateCIDR(cidr: string): Promise<{ valid: boolean; error?: string }> {
  const response = await fetch(`${API_BASE}/validate/cidr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cidr }),
  });
  return response.json();
}

export async function getMyIP(): Promise<{ ip: string; geo: GeoLocation }> {
  const response = await fetch(`${API_BASE}/my-ip`);
  if (!response.ok) throw new Error('Failed to fetch current IP');
  return response.json();
}
