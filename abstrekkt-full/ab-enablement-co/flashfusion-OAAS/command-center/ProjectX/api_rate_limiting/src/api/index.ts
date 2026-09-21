import axios from 'axios';
import type {
  RateLimitConfig,
  RateLimitUsage,
  PlanRateLimits,
  RateLimitStats,
  CreateRateLimitInput,
  UpdateRateLimitInput,
} from '../types';

const API_BASE = '/api/rate-limits';

// Rate limit configuration
export async function getRateLimits(): Promise<RateLimitConfig[]> {
  const response = await axios.get<RateLimitConfig[]>(API_BASE);
  return response.data;
}

export async function getRateLimit(id: string): Promise<RateLimitConfig> {
  const response = await axios.get<RateLimitConfig>(`${API_BASE}/${id}`);
  return response.data;
}

export async function createRateLimit(input: CreateRateLimitInput): Promise<RateLimitConfig> {
  const response = await axios.post<RateLimitConfig>(API_BASE, input);
  return response.data;
}

export async function updateRateLimit(
  id: string,
  input: UpdateRateLimitInput
): Promise<RateLimitConfig> {
  const response = await axios.patch<RateLimitConfig>(`${API_BASE}/${id}`, input);
  return response.data;
}

export async function deleteRateLimit(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}

export async function toggleRateLimit(id: string, enabled: boolean): Promise<RateLimitConfig> {
  return updateRateLimit(id, { enabled });
}

// Usage tracking
export async function getCurrentUsage(): Promise<RateLimitUsage[]> {
  const response = await axios.get<RateLimitUsage[]>(`${API_BASE}/usage`);
  return response.data;
}

export async function getUserUsage(userId: string): Promise<RateLimitUsage[]> {
  const response = await axios.get<RateLimitUsage[]>(`${API_BASE}/usage/${userId}`);
  return response.data;
}

// Plan limits
export async function getPlanLimits(): Promise<PlanRateLimits[]> {
  const response = await axios.get<PlanRateLimits[]>(`${API_BASE}/plans`);
  return response.data;
}

export async function updatePlanLimits(
  plan: string,
  limits: PlanRateLimits['limits']
): Promise<PlanRateLimits> {
  const response = await axios.patch<PlanRateLimits>(`${API_BASE}/plans/${plan}`, { limits });
  return response.data;
}

// Stats
export async function getRateLimitStats(timeRange?: string): Promise<RateLimitStats> {
  const response = await axios.get<RateLimitStats>(`${API_BASE}/stats`, {
    params: { timeRange },
  });
  return response.data;
}

// Reset usage (admin)
export async function resetUsage(key: string): Promise<void> {
  await axios.post(`${API_BASE}/reset`, { key });
}
