export interface RateLimitConfig {
  id: string;
  name: string;
  endpoint: string; // Pattern like '/api/*' or '/api/users'
  requests: number;
  window: number; // seconds
  strategy: RateLimitStrategy;
  scope: RateLimitScope;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RateLimitStrategy = 'fixed-window' | 'sliding-window' | 'token-bucket';

export type RateLimitScope = 'global' | 'per-user' | 'per-ip' | 'per-api-key';

export interface RateLimitUsage {
  configId: string;
  key: string; // userId, IP, or API key
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  windowStart: Date;
}

export interface PlanRateLimits {
  plan: string;
  limits: {
    api: { requests: number; window: number };
    uploads: { requests: number; window: number };
    exports: { requests: number; window: number };
  };
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  topEndpoints: Array<{ endpoint: string; requests: number }>;
  topUsers: Array<{ userId: string; requests: number }>;
  hourlyBreakdown: Array<{ hour: string; requests: number; blocked: number }>;
}

export interface CreateRateLimitInput {
  name: string;
  endpoint: string;
  requests: number;
  window: number;
  strategy?: RateLimitStrategy;
  scope?: RateLimitScope;
}

export interface UpdateRateLimitInput {
  name?: string;
  endpoint?: string;
  requests?: number;
  window?: number;
  strategy?: RateLimitStrategy;
  scope?: RateLimitScope;
  enabled?: boolean;
}
