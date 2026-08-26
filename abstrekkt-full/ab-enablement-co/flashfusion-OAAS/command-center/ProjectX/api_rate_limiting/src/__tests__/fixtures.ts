/**
 * Test fixtures for api_rate_limiting module
 *
 * Provides mock data for testing rate limiting functionality
 */

import type {
  RateLimitConfig,
  RateLimitStrategy,
  RateLimitScope,
  RateLimitUsage,
  PlanRateLimits,
  RateLimitStats,
  CreateRateLimitInput,
  UpdateRateLimitInput,
} from '../types';

// =============================================================================
// Time Constants
// =============================================================================

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

// =============================================================================
// Rate Limit Config Fixtures
// =============================================================================

export function createMockRateLimitConfig(
  overrides: Partial<RateLimitConfig> = {}
): RateLimitConfig {
  return {
    id: `rate-limit-${Math.random().toString(36).substring(7)}`,
    name: 'Default Rate Limit',
    endpoint: '/api/*',
    requests: 100,
    window: 60,
    strategy: 'sliding-window' as RateLimitStrategy,
    scope: 'per-user' as RateLimitScope,
    enabled: true,
    createdAt: oneDayAgo,
    updatedAt: oneHourAgo,
    ...overrides,
  };
}

export const mockRateLimitConfig: RateLimitConfig = createMockRateLimitConfig({
  id: 'rate-limit-1',
  name: 'API Rate Limit',
  endpoint: '/api/*',
  requests: 100,
  window: 60,
  strategy: 'sliding-window',
  scope: 'per-user',
});

export const mockFixedWindowConfig: RateLimitConfig = createMockRateLimitConfig({
  id: 'rate-limit-fixed',
  name: 'Fixed Window Limit',
  endpoint: '/api/auth/*',
  requests: 10,
  window: 300,
  strategy: 'fixed-window',
  scope: 'per-ip',
});

export const mockTokenBucketConfig: RateLimitConfig = createMockRateLimitConfig({
  id: 'rate-limit-token',
  name: 'Token Bucket Limit',
  endpoint: '/api/uploads',
  requests: 50,
  window: 3600,
  strategy: 'token-bucket',
  scope: 'per-api-key',
});

export const mockGlobalConfig: RateLimitConfig = createMockRateLimitConfig({
  id: 'rate-limit-global',
  name: 'Global Limit',
  endpoint: '/api/*',
  requests: 10000,
  window: 60,
  strategy: 'sliding-window',
  scope: 'global',
});

export const mockDisabledConfig: RateLimitConfig = createMockRateLimitConfig({
  id: 'rate-limit-disabled',
  name: 'Disabled Limit',
  endpoint: '/api/legacy',
  requests: 500,
  window: 60,
  enabled: false,
});

export const mockRateLimitConfigs: RateLimitConfig[] = [
  mockRateLimitConfig,
  mockFixedWindowConfig,
  mockTokenBucketConfig,
  mockGlobalConfig,
  mockDisabledConfig,
];

// =============================================================================
// Rate Limit Usage Fixtures
// =============================================================================

export function createMockRateLimitUsage(
  overrides: Partial<RateLimitUsage> = {}
): RateLimitUsage {
  return {
    configId: 'rate-limit-1',
    key: 'user-123',
    used: 50,
    limit: 100,
    remaining: 50,
    resetAt: oneHourFromNow,
    windowStart: now,
    ...overrides,
  };
}

export const mockUsageNormal: RateLimitUsage = createMockRateLimitUsage({
  configId: 'rate-limit-1',
  key: 'user-123',
  used: 50,
  limit: 100,
  remaining: 50,
  resetAt: oneHourFromNow,
});

export const mockUsageHigh: RateLimitUsage = createMockRateLimitUsage({
  configId: 'rate-limit-2',
  key: 'user-123',
  used: 90,
  limit: 100,
  remaining: 10,
  resetAt: twoHoursFromNow,
});

export const mockUsageExhausted: RateLimitUsage = createMockRateLimitUsage({
  configId: 'rate-limit-3',
  key: 'user-456',
  used: 100,
  limit: 100,
  remaining: 0,
  resetAt: oneHourFromNow,
});

export const mockUsageIpBased: RateLimitUsage = createMockRateLimitUsage({
  configId: 'rate-limit-fixed',
  key: '192.168.1.100',
  used: 5,
  limit: 10,
  remaining: 5,
  resetAt: oneHourFromNow,
});

export const mockRateLimitUsages: RateLimitUsage[] = [
  mockUsageNormal,
  mockUsageHigh,
  mockUsageExhausted,
];

export const mockEmptyUsage: RateLimitUsage[] = [];

// =============================================================================
// Plan Rate Limits Fixtures
// =============================================================================

export const mockFreePlanLimits: PlanRateLimits = {
  plan: 'free',
  limits: {
    api: { requests: 100, window: 3600 },
    uploads: { requests: 10, window: 86400 },
    exports: { requests: 5, window: 86400 },
  },
};

export const mockProPlanLimits: PlanRateLimits = {
  plan: 'pro',
  limits: {
    api: { requests: 1000, window: 3600 },
    uploads: { requests: 100, window: 86400 },
    exports: { requests: 50, window: 86400 },
  },
};

export const mockEnterprisePlanLimits: PlanRateLimits = {
  plan: 'enterprise',
  limits: {
    api: { requests: 10000, window: 3600 },
    uploads: { requests: 1000, window: 86400 },
    exports: { requests: 500, window: 86400 },
  },
};

export const mockPlanRateLimits: PlanRateLimits[] = [
  mockFreePlanLimits,
  mockProPlanLimits,
  mockEnterprisePlanLimits,
];

// =============================================================================
// Rate Limit Stats Fixtures
// =============================================================================

export const mockRateLimitStats: RateLimitStats = {
  totalRequests: 15000,
  blockedRequests: 250,
  topEndpoints: [
    { endpoint: '/api/users', requests: 5000 },
    { endpoint: '/api/data', requests: 4000 },
    { endpoint: '/api/auth', requests: 3000 },
    { endpoint: '/api/uploads', requests: 2000 },
    { endpoint: '/api/exports', requests: 1000 },
  ],
  topUsers: [
    { userId: 'user-001', requests: 3000 },
    { userId: 'user-002', requests: 2500 },
    { userId: 'user-003', requests: 2000 },
    { userId: 'user-004', requests: 1500 },
    { userId: 'user-005', requests: 1000 },
  ],
  hourlyBreakdown: [
    { hour: '00:00', requests: 500, blocked: 10 },
    { hour: '01:00', requests: 300, blocked: 5 },
    { hour: '02:00', requests: 200, blocked: 3 },
    { hour: '03:00', requests: 150, blocked: 2 },
    { hour: '04:00', requests: 100, blocked: 1 },
  ],
};

export const mockEmptyStats: RateLimitStats = {
  totalRequests: 0,
  blockedRequests: 0,
  topEndpoints: [],
  topUsers: [],
  hourlyBreakdown: [],
};

export const mockHighBlockRateStats: RateLimitStats = {
  totalRequests: 10000,
  blockedRequests: 5000,
  topEndpoints: [{ endpoint: '/api/auth', requests: 8000 }],
  topUsers: [{ userId: 'user-attacker', requests: 9000 }],
  hourlyBreakdown: [{ hour: '12:00', requests: 10000, blocked: 5000 }],
};

// =============================================================================
// Input Fixtures
// =============================================================================

export const mockCreateRateLimitInput: CreateRateLimitInput = {
  name: 'New Rate Limit',
  endpoint: '/api/new',
  requests: 200,
  window: 120,
  strategy: 'sliding-window',
  scope: 'per-user',
};

export const mockCreateRateLimitInputMinimal: CreateRateLimitInput = {
  name: 'Minimal Rate Limit',
  endpoint: '/api/minimal',
  requests: 50,
  window: 60,
};

export const mockUpdateRateLimitInput: UpdateRateLimitInput = {
  name: 'Updated Rate Limit',
  requests: 150,
};

export const mockUpdateRateLimitInputFull: UpdateRateLimitInput = {
  name: 'Fully Updated Limit',
  endpoint: '/api/updated',
  requests: 250,
  window: 180,
  strategy: 'token-bucket',
  scope: 'per-api-key',
  enabled: true,
};

// =============================================================================
// API Error Fixtures
// =============================================================================

export const mockApiError = {
  message: 'Rate limit not found',
  code: 'RATE_LIMIT_NOT_FOUND',
  status: 404,
};

export const mockValidationError = {
  message: 'Validation error: requests must be positive',
  code: 'VALIDATION_ERROR',
  status: 400,
};

export const mockNetworkError = new Error('Network error');

export const mockUnauthorizedError = {
  message: 'Unauthorized',
  code: 'UNAUTHORIZED',
  status: 401,
};

export const mockForbiddenError = {
  message: 'Forbidden: Admin access required',
  code: 'FORBIDDEN',
  status: 403,
};
