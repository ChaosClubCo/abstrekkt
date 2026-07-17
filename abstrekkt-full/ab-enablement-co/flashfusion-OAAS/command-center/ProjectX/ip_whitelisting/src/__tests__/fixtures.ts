/**
 * Test fixtures for IP Whitelisting module
 *
 * Provides mock data for rules, configs, access results, and other entities
 */

import type {
  IPRule,
  IPWhitelistConfig,
  IPAccessResult,
  GeoLocation,
  AccessAttempt,
  GracePeriodRequest,
  SessionIPInfo,
  CreateRuleInput,
} from '../types';

// ============================================================================
// Mock IP Rules
// ============================================================================

export const mockIPRule: IPRule = {
  id: 'rule-1',
  tenantId: 'tenant-1',
  type: 'ip',
  value: '192.168.1.100',
  action: 'allow',
  label: 'Office IP',
  description: 'Main office IP address',
  enabled: true,
  createdAt: '2024-01-15T12:00:00.000Z',
  createdBy: 'user-1',
};

export const mockCIDRRule: IPRule = {
  id: 'rule-2',
  tenantId: 'tenant-1',
  type: 'cidr',
  value: '10.0.0.0/8',
  action: 'allow',
  label: 'Internal Network',
  description: 'Internal corporate network',
  enabled: true,
  createdAt: '2024-01-15T12:00:00.000Z',
  createdBy: 'user-1',
};

export const mockCountryRule: IPRule = {
  id: 'rule-3',
  tenantId: 'tenant-1',
  type: 'country',
  value: 'US',
  action: 'allow',
  label: 'United States',
  enabled: true,
  createdAt: '2024-01-15T12:00:00.000Z',
  createdBy: 'user-1',
};

export const mockASNRule: IPRule = {
  id: 'rule-4',
  tenantId: 'tenant-1',
  type: 'asn',
  value: 'AS12345',
  action: 'deny',
  label: 'Blocked ASN',
  enabled: true,
  createdAt: '2024-01-15T12:00:00.000Z',
  createdBy: 'user-1',
};

export const mockDisabledRule: IPRule = {
  id: 'rule-5',
  tenantId: 'tenant-1',
  type: 'ip',
  value: '203.0.113.50',
  action: 'deny',
  label: 'Temporarily Disabled',
  enabled: false,
  createdAt: '2024-01-15T12:00:00.000Z',
  createdBy: 'user-1',
};

export const mockRules: IPRule[] = [
  mockIPRule,
  mockCIDRRule,
  mockCountryRule,
  mockASNRule,
  mockDisabledRule,
];

// ============================================================================
// Mock GeoLocation
// ============================================================================

export const mockGeoLocation: GeoLocation = {
  country: 'United States',
  countryCode: 'US',
  region: 'California',
  city: 'San Francisco',
  latitude: 37.7749,
  longitude: -122.4194,
  asn: 'AS15169',
  org: 'Google LLC',
  isVPN: false,
  isDataCenter: false,
  isTor: false,
  isProxy: false,
};

export const mockVPNGeoLocation: GeoLocation = {
  country: 'Netherlands',
  countryCode: 'NL',
  region: 'North Holland',
  city: 'Amsterdam',
  isVPN: true,
  isDataCenter: true,
  isTor: false,
  isProxy: false,
};

// ============================================================================
// Mock Config
// ============================================================================

export const mockConfig: IPWhitelistConfig = {
  enabled: true,
  mode: 'allowlist',
  defaultAction: 'deny',
  enforceForAdmins: false,
  rules: mockRules,
  apiRules: {
    enabled: false,
    separateRules: false,
  },
  sessionBinding: {
    enabled: true,
    allowedChanges: 3,
    windowMinutes: 60,
  },
  vpnBlocking: {
    enabled: false,
    blockDataCenters: false,
    blockTor: true,
    blockProxies: true,
  },
  gracePeriod: {
    enabled: true,
    minutes: 30,
    requireApproval: true,
    maxActiveRequests: 5,
  },
};

export const mockDisabledConfig: IPWhitelistConfig = {
  ...mockConfig,
  enabled: false,
};

// ============================================================================
// Mock Access Results
// ============================================================================

export const mockAccessAllowed: IPAccessResult = {
  allowed: true,
  reason: 'IP address matches allow rule',
  matchedRule: mockIPRule,
  ipAddress: '192.168.1.100',
  geoLocation: mockGeoLocation,
  requiresApproval: false,
};

export const mockAccessDenied: IPAccessResult = {
  allowed: false,
  reason: 'IP address not in allowlist',
  ipAddress: '203.0.113.100',
  geoLocation: mockGeoLocation,
  requiresApproval: false,
};

export const mockAccessDeniedWithApproval: IPAccessResult = {
  allowed: false,
  reason: 'Access requires administrator approval',
  ipAddress: '198.51.100.50',
  geoLocation: mockGeoLocation,
  requiresApproval: true,
};

// ============================================================================
// Mock Access Attempts
// ============================================================================

export const mockAccessAttempts: AccessAttempt[] = [
  {
    id: 'attempt-1',
    tenantId: 'tenant-1',
    userId: 'user-1',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0',
    action: 'allow',
    reason: 'IP matches allow rule',
    matchedRule: 'rule-1',
    geoLocation: mockGeoLocation,
    timestamp: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'attempt-2',
    tenantId: 'tenant-1',
    userId: 'user-2',
    ipAddress: '203.0.113.100',
    userAgent: 'Mozilla/5.0',
    action: 'deny',
    reason: 'IP not in allowlist',
    geoLocation: mockGeoLocation,
    timestamp: '2024-01-15T11:00:00.000Z',
  },
];

// ============================================================================
// Mock Grace Period Requests
// ============================================================================

export const mockGracePeriodRequest: GracePeriodRequest = {
  id: 'grace-1',
  tenantId: 'tenant-1',
  userId: 'user-1',
  ipAddress: '198.51.100.50',
  geoLocation: mockGeoLocation,
  reason: 'Working from home today',
  status: 'pending',
  expiresAt: '2024-01-15T13:00:00.000Z',
  createdAt: '2024-01-15T12:00:00.000Z',
};

export const mockApprovedGraceRequest: GracePeriodRequest = {
  ...mockGracePeriodRequest,
  id: 'grace-2',
  status: 'approved',
  reviewedAt: '2024-01-15T12:05:00.000Z',
  reviewedBy: 'admin-1',
};

export const mockPendingGraceRequests: GracePeriodRequest[] = [
  mockGracePeriodRequest,
  {
    ...mockGracePeriodRequest,
    id: 'grace-3',
    userId: 'user-2',
    ipAddress: '203.0.113.50',
    reason: 'Business travel',
  },
];

// ============================================================================
// Mock Session IP Info
// ============================================================================

export const mockSessionIPInfo: SessionIPInfo = {
  currentIP: '192.168.1.100',
  originalIP: '192.168.1.100',
  changeCount: 0,
  isBound: false,
};

export const mockBoundSessionIPInfo: SessionIPInfo = {
  currentIP: '192.168.1.100',
  originalIP: '192.168.1.50',
  changeCount: 2,
  lastChangeAt: '2024-01-15T11:30:00.000Z',
  isBound: true,
};

// ============================================================================
// Mock My IP Response
// ============================================================================

export const mockMyIP = {
  ip: '192.168.1.100',
  geo: mockGeoLocation,
};

// ============================================================================
// Mock Create Rule Inputs
// ============================================================================

export const mockCreateRuleInput: CreateRuleInput = {
  type: 'ip',
  value: '192.168.1.200',
  action: 'allow',
  label: 'New Office IP',
};

export const mockCreateCIDRInput: CreateRuleInput = {
  type: 'cidr',
  value: '172.16.0.0/12',
  action: 'allow',
  label: 'VPN Range',
};

// ============================================================================
// IP Validation Test Data
// ============================================================================

export const validIPv4Addresses = [
  '192.168.1.1',
  '10.0.0.1',
  '172.16.0.1',
  '8.8.8.8',
  '255.255.255.255',
  '0.0.0.0',
];

export const validIPv6Addresses = [
  '::1',
  '2001:db8::1',
  'fe80::1',
  '::ffff:192.168.1.1',
];

export const validCIDRNotations = [
  '192.168.1.0/24',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '0.0.0.0/0',
  '192.168.1.100/32',
];

export const invalidIPAddresses = [
  '256.256.256.256',
  '192.168.1',
  '192.168.1.1.1',
  'not-an-ip',
  '192.168.1.1/33',
  '',
  '   ',
];

export const validCountryCodes = ['US', 'GB', 'DE', 'JP', 'AU'];

export const invalidCountryCodes = ['USA', 'United States', '123', ''];

export const validASNs = ['AS12345', 'AS1', 'AS4134567890'];

export const invalidASNs = ['12345', 'ASN12345', 'as12345', ''];
