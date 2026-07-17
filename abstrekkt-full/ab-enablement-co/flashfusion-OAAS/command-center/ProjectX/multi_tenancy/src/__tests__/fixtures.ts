/**
 * Test fixtures for multi_tenancy module
 *
 * Provides mock data for testing tenant-related functionality
 */

import type {
  Tenant,
  TenantMember,
  TenantInvitation,
  TenantPlan,
  TenantRole,
  TenantSettings,
  CreateTenantInput,
  UpdateTenantInput,
  InviteMemberInput,
  PlanLimits,
} from '../types';

// =============================================================================
// Tenant Fixtures
// =============================================================================

const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

export function createMockTenant(overrides: Partial<Tenant> = {}): Tenant {
  return {
    id: `tenant-${Math.random().toString(36).substring(7)}`,
    name: 'Test Workspace',
    slug: 'test-workspace',
    plan: 'free' as TenantPlan,
    settings: {},
    createdAt: oneWeekAgo,
    updatedAt: oneDayAgo,
    ...overrides,
  };
}

export const mockTenant: Tenant = createMockTenant({
  id: 'tenant-main',
  name: 'Main Workspace',
  slug: 'main-workspace',
  plan: 'pro',
  settings: {
    allowedDomains: ['example.com'],
    ssoEnabled: false,
    mfaRequired: false,
  },
  logoUrl: 'https://example.com/logo.png',
});

export const mockFreeTenant: Tenant = createMockTenant({
  id: 'tenant-free',
  name: 'Free Workspace',
  slug: 'free-workspace',
  plan: 'free',
  settings: {},
});

export const mockProTenant: Tenant = createMockTenant({
  id: 'tenant-pro',
  name: 'Pro Workspace',
  slug: 'pro-workspace',
  plan: 'pro',
  settings: {
    allowedDomains: ['company.com'],
    ssoEnabled: false,
    mfaRequired: true,
  },
  logoUrl: 'https://example.com/pro-logo.png',
});

export const mockEnterpriseTenant: Tenant = createMockTenant({
  id: 'tenant-enterprise',
  name: 'Enterprise Workspace',
  slug: 'enterprise-workspace',
  plan: 'enterprise',
  settings: {
    allowedDomains: ['enterprise.com', 'corp.enterprise.com'],
    ssoEnabled: true,
    mfaRequired: true,
    auditLogRetentionDays: 365,
    customBranding: {
      primaryColor: '#0066cc',
      logoUrl: 'https://enterprise.com/logo.png',
      faviconUrl: 'https://enterprise.com/favicon.ico',
    },
  },
  logoUrl: 'https://enterprise.com/logo.png',
});

export const mockTenants: Tenant[] = [
  mockTenant,
  mockFreeTenant,
  mockProTenant,
];

export const mockTenantsWithEnterprise: Tenant[] = [
  ...mockTenants,
  mockEnterpriseTenant,
];

// =============================================================================
// Tenant Member Fixtures
// =============================================================================

export function createMockMember(overrides: Partial<TenantMember> = {}): TenantMember {
  return {
    id: `member-${Math.random().toString(36).substring(7)}`,
    tenantId: 'tenant-main',
    userId: `user-${Math.random().toString(36).substring(7)}`,
    role: 'member' as TenantRole,
    joinedAt: oneWeekAgo,
    ...overrides,
  };
}

export const mockOwnerMember: TenantMember = createMockMember({
  id: 'member-owner',
  userId: 'user-owner',
  role: 'owner',
  user: {
    id: 'user-owner',
    email: 'owner@example.com',
    name: 'Workspace Owner',
  } as any,
  joinedAt: oneWeekAgo,
});

export const mockAdminMember: TenantMember = createMockMember({
  id: 'member-admin',
  userId: 'user-admin',
  role: 'admin',
  user: {
    id: 'user-admin',
    email: 'admin@example.com',
    name: 'Admin User',
  } as any,
  joinedAt: oneDayAgo,
});

export const mockRegularMember: TenantMember = createMockMember({
  id: 'member-regular',
  userId: 'user-regular',
  role: 'member',
  user: {
    id: 'user-regular',
    email: 'member@example.com',
    name: 'Regular Member',
  } as any,
  joinedAt: oneDayAgo,
});

export const mockViewerMember: TenantMember = createMockMember({
  id: 'member-viewer',
  userId: 'user-viewer',
  role: 'viewer',
  user: {
    id: 'user-viewer',
    email: 'viewer@example.com',
    name: 'Viewer User',
  } as any,
  joinedAt: now,
});

export const mockMembers: TenantMember[] = [
  mockOwnerMember,
  mockAdminMember,
  mockRegularMember,
  mockViewerMember,
];

export const mockMembersWithoutOwner: TenantMember[] = [
  mockAdminMember,
  mockRegularMember,
  mockViewerMember,
];

// =============================================================================
// Tenant Invitation Fixtures
// =============================================================================

export function createMockInvitation(overrides: Partial<TenantInvitation> = {}): TenantInvitation {
  return {
    id: `invitation-${Math.random().toString(36).substring(7)}`,
    tenantId: 'tenant-main',
    email: 'invitee@example.com',
    role: 'member' as TenantRole,
    token: `token-${Math.random().toString(36).substring(7)}`,
    expiresAt: oneWeekFromNow,
    createdAt: now,
    ...overrides,
  };
}

export const mockPendingInvitation: TenantInvitation = createMockInvitation({
  id: 'invitation-pending',
  email: 'pending@example.com',
  role: 'member',
  token: 'token-pending-123',
});

export const mockAdminInvitation: TenantInvitation = createMockInvitation({
  id: 'invitation-admin',
  email: 'newadmin@example.com',
  role: 'admin',
  token: 'token-admin-456',
});

export const mockExpiredInvitation: TenantInvitation = createMockInvitation({
  id: 'invitation-expired',
  email: 'expired@example.com',
  role: 'member',
  token: 'token-expired-789',
  expiresAt: oneDayAgo,
});

export const mockAcceptedInvitation: TenantInvitation = createMockInvitation({
  id: 'invitation-accepted',
  email: 'accepted@example.com',
  role: 'member',
  token: 'token-accepted-000',
  acceptedAt: oneDayAgo,
});

export const mockInvitations: TenantInvitation[] = [
  mockPendingInvitation,
  mockAdminInvitation,
];

export const mockAllInvitations: TenantInvitation[] = [
  mockPendingInvitation,
  mockAdminInvitation,
  mockExpiredInvitation,
  mockAcceptedInvitation,
];

// =============================================================================
// Input Fixtures
// =============================================================================

export const mockCreateTenantInput: CreateTenantInput = {
  name: 'New Workspace',
  slug: 'new-workspace',
  plan: 'free',
};

export const mockCreateTenantInputMinimal: CreateTenantInput = {
  name: 'Minimal Workspace',
};

export const mockCreateTenantInputPro: CreateTenantInput = {
  name: 'Pro Workspace',
  slug: 'pro-workspace',
  plan: 'pro',
};

export const mockUpdateTenantInput: UpdateTenantInput = {
  name: 'Updated Workspace Name',
  settings: {
    mfaRequired: true,
  },
};

export const mockUpdateTenantSettingsOnly: UpdateTenantInput = {
  settings: {
    allowedDomains: ['newdomain.com'],
    ssoEnabled: true,
  },
};

export const mockUpdateTenantLogoOnly: UpdateTenantInput = {
  logoUrl: 'https://example.com/new-logo.png',
};

export const mockInviteMemberInput: InviteMemberInput = {
  email: 'newinvite@example.com',
  role: 'member',
};

export const mockInviteAdminInput: InviteMemberInput = {
  email: 'newadmin@example.com',
  role: 'admin',
};

export const mockInviteViewerInput: InviteMemberInput = {
  email: 'newviewer@example.com',
  role: 'viewer',
};

// =============================================================================
// API Response Fixtures
// =============================================================================

export const mockSlugAvailableResponse = { available: true };
export const mockSlugUnavailableResponse = { available: false };

export const mockApiError = {
  message: 'Tenant not found',
  code: 'TENANT_NOT_FOUND',
  status: 404,
};

export const mockNetworkError = new Error('Network error');

export const mockUnauthorizedError = {
  message: 'Unauthorized',
  code: 'UNAUTHORIZED',
  status: 401,
};

export const mockForbiddenError = {
  message: 'Forbidden - Insufficient permissions',
  code: 'FORBIDDEN',
  status: 403,
};

export const mockValidationError = {
  message: 'Validation error',
  code: 'VALIDATION_ERROR',
  status: 400,
  errors: ['Slug is already taken', 'Name must be at least 3 characters'],
};

export const mockConflictError = {
  message: 'Slug already exists',
  code: 'CONFLICT',
  status: 409,
};

// =============================================================================
// Settings Fixtures
// =============================================================================

export const mockDefaultSettings: TenantSettings = {};

export const mockBasicSettings: TenantSettings = {
  allowedDomains: ['example.com'],
  ssoEnabled: false,
  mfaRequired: false,
};

export const mockEnterpriseSettings: TenantSettings = {
  allowedDomains: ['enterprise.com', 'corp.enterprise.com'],
  ssoEnabled: true,
  mfaRequired: true,
  auditLogRetentionDays: 365,
  customBranding: {
    primaryColor: '#0066cc',
    logoUrl: 'https://enterprise.com/logo.png',
    faviconUrl: 'https://enterprise.com/favicon.ico',
  },
};

// =============================================================================
// Plan Limits Fixtures (matching PLAN_LIMITS from types)
// =============================================================================

export const mockFreePlanLimits: PlanLimits = {
  maxMembers: 5,
  maxProjects: 3,
  maxStorage: 1,
  features: ['basic_analytics', 'email_support'],
};

export const mockProPlanLimits: PlanLimits = {
  maxMembers: 25,
  maxProjects: 50,
  maxStorage: 50,
  features: ['advanced_analytics', 'priority_support', 'api_access', 'custom_domain'],
};

export const mockEnterprisePlanLimits: PlanLimits = {
  maxMembers: -1,
  maxProjects: -1,
  maxStorage: -1,
  features: ['sso', 'audit_logs', 'sla', 'dedicated_support', 'custom_integrations'],
};

// =============================================================================
// LocalStorage Mock Helpers
// =============================================================================

export function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
}
