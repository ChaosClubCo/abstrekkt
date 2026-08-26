/**
 * Test fixtures for audit_logging module
 *
 * Provides mock data for testing audit log functionality
 */

import type {
  AuditLogEntry,
  AuditLogSearchParams,
  AuditLogSearchResult,
  AuditConfig,
  CreateAuditLogInput,
} from '../types';
import type { AuditStats } from '../api';

// =============================================================================
// Timestamp Fixtures
// =============================================================================

const now = new Date();
const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

// =============================================================================
// Audit Log Entry Fixtures
// =============================================================================

export function createMockAuditLogEntry(
  overrides: Partial<AuditLogEntry> = {}
): AuditLogEntry {
  return {
    id: `audit-${Math.random().toString(36).substring(7)}`,
    tenantId: 'tenant-123',
    userId: 'user-456',
    action: 'user.login',
    resource: 'auth',
    resourceId: null,
    metadata: {},
    ipAddress: '192.168.1.100',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    timestamp: oneHourAgo,
    ...overrides,
  };
}

// User action entries
export const mockUserLoginEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-login-1',
  action: 'user.login',
  resource: 'auth',
  metadata: { method: 'password' },
  timestamp: oneMinuteAgo,
});

export const mockUserLogoutEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-logout-1',
  action: 'user.logout',
  resource: 'auth',
  timestamp: thirtyMinutesAgo,
});

export const mockUserCreatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-user-created-1',
  action: 'user.created',
  resource: 'users',
  resourceId: 'user-789',
  metadata: { email: 'newuser@example.com', role: 'member' },
  timestamp: oneDayAgo,
});

export const mockUserUpdatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-user-updated-1',
  action: 'user.updated',
  resource: 'users',
  resourceId: 'user-456',
  metadata: { fields: ['name', 'email'] },
  timestamp: fiveHoursAgo,
});

export const mockUserDeletedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-user-deleted-1',
  action: 'user.deleted',
  resource: 'users',
  resourceId: 'user-old',
  timestamp: threeDaysAgo,
});

// Resource action entries
export const mockResourceCreatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-created-1',
  action: 'resource.created',
  resource: 'documents',
  resourceId: 'doc-123',
  metadata: { title: 'Project Plan', type: 'document' },
  timestamp: oneHourAgo,
});

export const mockResourceReadEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-read-1',
  action: 'resource.read',
  resource: 'documents',
  resourceId: 'doc-123',
  timestamp: thirtyMinutesAgo,
});

export const mockResourceUpdatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-updated-1',
  action: 'resource.updated',
  resource: 'documents',
  resourceId: 'doc-123',
  metadata: { changedFields: ['content', 'title'] },
  timestamp: fiveHoursAgo,
});

export const mockResourceDeletedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-deleted-1',
  action: 'resource.deleted',
  resource: 'documents',
  resourceId: 'doc-old',
  timestamp: oneDayAgo,
});

export const mockResourceExportedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-exported-1',
  action: 'resource.exported',
  resource: 'reports',
  resourceId: 'report-456',
  metadata: { format: 'pdf', size: 1024 },
  timestamp: threeDaysAgo,
});

export const mockResourceImportedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-resource-imported-1',
  action: 'resource.imported',
  resource: 'data',
  resourceId: 'import-789',
  metadata: { rowCount: 500, source: 'csv' },
  timestamp: oneWeekAgo,
});

// Team action entries
export const mockTeamCreatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-team-created-1',
  action: 'team.created',
  resource: 'teams',
  resourceId: 'team-123',
  metadata: { name: 'Engineering' },
  timestamp: oneWeekAgo,
});

export const mockTeamMemberAddedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-team-member-added-1',
  action: 'team.member_added',
  resource: 'teams',
  resourceId: 'team-123',
  metadata: { memberId: 'user-new', role: 'member' },
  timestamp: threeDaysAgo,
});

export const mockTeamMemberRemovedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-team-member-removed-1',
  action: 'team.member_removed',
  resource: 'teams',
  resourceId: 'team-123',
  metadata: { memberId: 'user-old' },
  timestamp: twoWeeksAgo,
});

// Security action entries
export const mockMfaEnabledEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-mfa-enabled-1',
  action: 'security.mfa_enabled',
  resource: 'security',
  resourceId: 'user-456',
  metadata: { method: 'totp' },
  timestamp: oneDayAgo,
});

export const mockMfaDisabledEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-mfa-disabled-1',
  action: 'security.mfa_disabled',
  resource: 'security',
  resourceId: 'user-456',
  timestamp: threeDaysAgo,
});

export const mockPasswordChangedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-password-changed-1',
  action: 'security.password_changed',
  resource: 'security',
  resourceId: 'user-456',
  timestamp: fiveHoursAgo,
});

export const mockApiKeyCreatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-api-key-created-1',
  action: 'security.api_key_created',
  resource: 'api_keys',
  resourceId: 'key-123',
  metadata: { name: 'Production API Key', scopes: ['read', 'write'] },
  timestamp: oneWeekAgo,
});

export const mockApiKeyRevokedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-api-key-revoked-1',
  action: 'security.api_key_revoked',
  resource: 'api_keys',
  resourceId: 'key-old',
  timestamp: twoWeeksAgo,
});

export const mockSessionRevokedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-session-revoked-1',
  action: 'security.session_revoked',
  resource: 'sessions',
  resourceId: 'session-abc',
  metadata: { reason: 'suspicious_activity' },
  timestamp: oneDayAgo,
});

export const mockSuspiciousActivityEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-suspicious-1',
  action: 'security.suspicious_activity',
  resource: 'security',
  metadata: { type: 'multiple_failed_logins', count: 5 },
  timestamp: fiveHoursAgo,
  ipAddress: '203.0.113.50',
});

// Billing action entries
export const mockSubscriptionCreatedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-subscription-created-1',
  action: 'billing.subscription_created',
  resource: 'billing',
  resourceId: 'sub-123',
  metadata: { plan: 'pro', interval: 'monthly' },
  timestamp: oneWeekAgo,
});

export const mockSubscriptionCancelledEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-subscription-cancelled-1',
  action: 'billing.subscription_cancelled',
  resource: 'billing',
  resourceId: 'sub-old',
  metadata: { reason: 'user_requested' },
  timestamp: twoWeeksAgo,
});

export const mockPaymentSucceededEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-payment-succeeded-1',
  action: 'billing.payment_succeeded',
  resource: 'billing',
  resourceId: 'payment-456',
  metadata: { amount: 99.99, currency: 'USD' },
  timestamp: threeDaysAgo,
});

export const mockPaymentFailedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-payment-failed-1',
  action: 'billing.payment_failed',
  resource: 'billing',
  resourceId: 'payment-failed-1',
  metadata: { amount: 99.99, currency: 'USD', reason: 'card_declined' },
  timestamp: oneDayAgo,
});

// Admin action entries
export const mockSettingsChangedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-settings-changed-1',
  action: 'admin.settings_changed',
  resource: 'settings',
  metadata: { setting: 'allow_signups', oldValue: true, newValue: false },
  timestamp: fiveHoursAgo,
});

export const mockExportRequestedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-export-requested-1',
  action: 'admin.export_requested',
  resource: 'admin',
  metadata: { type: 'full_backup', format: 'zip' },
  timestamp: oneDayAgo,
});

export const mockDataDeletedEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-data-deleted-1',
  action: 'admin.data_deleted',
  resource: 'admin',
  metadata: { scope: 'user_data', userId: 'user-removed' },
  timestamp: twoWeeksAgo,
});

// Entry without user ID (system action)
export const mockSystemActionEntry: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-system-1',
  userId: null,
  action: 'resource.updated',
  resource: 'system',
  metadata: { task: 'scheduled_cleanup' },
  timestamp: oneHourAgo,
  ipAddress: null,
  userAgent: null,
});

// Entry with sensitive metadata
export const mockEntryWithSensitiveData: AuditLogEntry = createMockAuditLogEntry({
  id: 'audit-sensitive-1',
  action: 'user.updated',
  resource: 'users',
  resourceId: 'user-456',
  metadata: {
    password: 'secret123',
    token: 'abc-xyz-token',
    apiKey: 'sk-12345',
    normalField: 'visible',
  },
  timestamp: fiveHoursAgo,
});

// =============================================================================
// Collections of Entries
// =============================================================================

export const mockAuditLogEntries: AuditLogEntry[] = [
  mockUserLoginEntry,
  mockUserLogoutEntry,
  mockUserCreatedEntry,
  mockResourceCreatedEntry,
  mockResourceUpdatedEntry,
  mockMfaEnabledEntry,
  mockPasswordChangedEntry,
  mockSubscriptionCreatedEntry,
  mockSettingsChangedEntry,
  mockSessionRevokedEntry,
];

export const mockSecurityEntries: AuditLogEntry[] = [
  mockMfaEnabledEntry,
  mockMfaDisabledEntry,
  mockPasswordChangedEntry,
  mockApiKeyCreatedEntry,
  mockApiKeyRevokedEntry,
  mockSessionRevokedEntry,
  mockSuspiciousActivityEntry,
];

export const mockBillingEntries: AuditLogEntry[] = [
  mockSubscriptionCreatedEntry,
  mockSubscriptionCancelledEntry,
  mockPaymentSucceededEntry,
  mockPaymentFailedEntry,
];

// =============================================================================
// Search Result Fixtures
// =============================================================================

export const mockSearchResult: AuditLogSearchResult = {
  data: mockAuditLogEntries,
  meta: {
    total: 150,
    page: 1,
    pageSize: 25,
    totalPages: 6,
  },
};

export const mockEmptySearchResult: AuditLogSearchResult = {
  data: [],
  meta: {
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 0,
  },
};

export const mockSecondPageResult: AuditLogSearchResult = {
  data: mockSecurityEntries,
  meta: {
    total: 150,
    page: 2,
    pageSize: 25,
    totalPages: 6,
  },
};

// =============================================================================
// Audit Stats Fixtures
// =============================================================================

export const mockAuditStats: AuditStats = {
  totalEvents: 1500,
  eventsByAction: {
    'user.login': 450,
    'user.logout': 400,
    'resource.created': 200,
    'resource.updated': 150,
    'resource.read': 100,
    'security.mfa_enabled': 50,
    'billing.payment_succeeded': 75,
    'admin.settings_changed': 25,
  },
  eventsByResource: {
    auth: 850,
    documents: 300,
    users: 150,
    settings: 100,
    billing: 100,
  },
  eventsByUser: [
    { userId: 'user-456', count: 500 },
    { userId: 'user-789', count: 300 },
    { userId: 'user-101', count: 200 },
    { userId: 'user-102', count: 150 },
    { userId: 'user-103', count: 100 },
  ],
  timeline: [
    { date: '2024-01-15', count: 150 },
    { date: '2024-01-14', count: 175 },
    { date: '2024-01-13', count: 125 },
    { date: '2024-01-12', count: 200 },
    { date: '2024-01-11', count: 180 },
    { date: '2024-01-10', count: 160 },
    { date: '2024-01-09', count: 140 },
  ],
};

export const mockEmptyAuditStats: AuditStats = {
  totalEvents: 0,
  eventsByAction: {},
  eventsByResource: {},
  eventsByUser: [],
  timeline: [],
};

// =============================================================================
// Unique Actions/Resources Fixtures
// =============================================================================

export const mockUniqueActions: string[] = [
  'user.login',
  'user.logout',
  'user.created',
  'user.updated',
  'user.deleted',
  'resource.created',
  'resource.read',
  'resource.updated',
  'resource.deleted',
  'security.mfa_enabled',
  'security.password_changed',
  'billing.subscription_created',
  'admin.settings_changed',
];

export const mockUniqueResources: string[] = [
  'auth',
  'users',
  'documents',
  'teams',
  'settings',
  'billing',
  'api_keys',
  'sessions',
  'security',
  'admin',
];

// =============================================================================
// Search Params Fixtures
// =============================================================================

export const mockDefaultSearchParams: AuditLogSearchParams = {
  tenantId: 'tenant-123',
  page: 1,
  pageSize: 25,
  sortBy: 'timestamp',
  sortOrder: 'desc',
};

export const mockFilteredSearchParams: AuditLogSearchParams = {
  tenantId: 'tenant-123',
  userId: 'user-456',
  action: 'user.login',
  resource: 'auth',
  startDate: oneWeekAgo,
  endDate: now,
  page: 1,
  pageSize: 25,
  sortBy: 'timestamp',
  sortOrder: 'desc',
};

export const mockMultiActionSearchParams: AuditLogSearchParams = {
  tenantId: 'tenant-123',
  action: ['user.login', 'user.logout', 'user.created'],
  page: 1,
  pageSize: 50,
  sortBy: 'action',
  sortOrder: 'asc',
};

// =============================================================================
// Create Audit Log Input Fixtures
// =============================================================================

export const mockCreateLoginInput: CreateAuditLogInput = {
  action: 'user.login',
  resource: 'auth',
  metadata: { method: 'password' },
};

export const mockCreateResourceInput: CreateAuditLogInput = {
  action: 'resource.created',
  resource: 'documents',
  resourceId: 'doc-new',
  metadata: { title: 'New Document', type: 'text' },
};

export const mockCreateInputWithSensitiveData: CreateAuditLogInput = {
  action: 'user.updated',
  resource: 'users',
  resourceId: 'user-456',
  metadata: {
    password: 'newpassword123',
    token: 'refresh-token-xyz',
    email: 'user@example.com',
  },
};

// =============================================================================
// Config Fixtures
// =============================================================================

export const mockAuditConfig: AuditConfig = {
  retentionDays: 90,
  autoTrack: [
    'user.login',
    'user.logout',
    'user.created',
    'user.updated',
    'user.deleted',
    'resource.created',
    'resource.updated',
    'resource.deleted',
    'security.mfa_enabled',
    'security.password_changed',
    'billing.subscription_created',
    'billing.subscription_cancelled',
  ],
  exclude: ['resource.read'],
  includeRequestBody: false,
  sensitiveFields: [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'creditCard',
    'ssn',
    'socialSecurity',
  ],
};

export const mockStrictAuditConfig: AuditConfig = {
  retentionDays: 365,
  autoTrack: [],
  exclude: [],
  includeRequestBody: true,
  sensitiveFields: ['password', 'token', 'apiKey', 'secret', 'creditCard'],
};

// =============================================================================
// Error Fixtures
// =============================================================================

export const mockApiError = {
  message: 'Audit log not found',
  code: 'AUDIT_LOG_NOT_FOUND',
  status: 404,
};

export const mockNetworkError = new Error('Network error');

export const mockUnauthorizedError = {
  message: 'Unauthorized',
  code: 'UNAUTHORIZED',
  status: 401,
};

export const mockValidationError = {
  message: 'Validation error',
  code: 'VALIDATION_ERROR',
  status: 400,
  errors: ['action is required', 'resource is required'],
};

// =============================================================================
// Export Blob Fixture
// =============================================================================

export function createMockBlob(content: string, type: string): Blob {
  return new Blob([content], { type });
}

export const mockCsvExportContent = `id,tenantId,userId,action,resource,resourceId,timestamp
audit-login-1,tenant-123,user-456,user.login,auth,,2024-01-15T10:00:00Z
audit-logout-1,tenant-123,user-456,user.logout,auth,,2024-01-15T09:30:00Z`;

export const mockJsonExportContent = JSON.stringify(mockAuditLogEntries, null, 2);
