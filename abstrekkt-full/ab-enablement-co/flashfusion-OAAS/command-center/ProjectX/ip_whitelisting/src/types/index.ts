export type RuleType = 'ip' | 'cidr' | 'country' | 'asn';

export type RuleAction = 'allow' | 'deny';

export type WhitelistMode = 'allowlist' | 'blocklist';

export interface IPRule {
  id: string;
  tenantId: string;
  type: RuleType;
  value: string;
  action: RuleAction;
  label?: string;
  description?: string;
  enabled: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface IPWhitelistConfig {
  enabled: boolean;
  mode: WhitelistMode;
  defaultAction: RuleAction;
  enforceForAdmins: boolean;
  rules: IPRule[];
  apiRules?: {
    enabled: boolean;
    separateRules: boolean;
    rules?: IPRule[];
  };
  sessionBinding?: SessionBindingConfig;
  vpnBlocking?: VPNBlockingConfig;
  gracePeriod?: GracePeriodConfig;
}

export interface SessionBindingConfig {
  enabled: boolean;
  allowedChanges: number;
  windowMinutes: number;
}

export interface VPNBlockingConfig {
  enabled: boolean;
  blockDataCenters: boolean;
  blockTor: boolean;
  blockProxies: boolean;
  allowedVPNs?: string[]; // Allowed VPN ASNs
}

export interface GracePeriodConfig {
  enabled: boolean;
  minutes: number;
  requireApproval: boolean;
  maxActiveRequests: number;
}

export interface AccessAttempt {
  id: string;
  tenantId: string;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  action: RuleAction;
  reason: string;
  matchedRule?: string;
  geoLocation?: GeoLocation;
  timestamp: string;
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  org?: string;
  isVPN?: boolean;
  isDataCenter?: boolean;
  isTor?: boolean;
  isProxy?: boolean;
}

export interface IPAccessResult {
  allowed: boolean;
  reason: string;
  matchedRule?: IPRule;
  ipAddress: string;
  geoLocation?: GeoLocation;
  requiresApproval?: boolean;
}

export interface GracePeriodRequest {
  id: string;
  tenantId: string;
  userId: string;
  ipAddress: string;
  geoLocation?: GeoLocation;
  reason: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  expiresAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface CreateRuleInput {
  type: RuleType;
  value: string;
  action: RuleAction;
  label?: string;
  description?: string;
  expiresAt?: string;
}

export interface UpdateRuleInput {
  value?: string;
  action?: RuleAction;
  label?: string;
  description?: string;
  enabled?: boolean;
  expiresAt?: string;
}

export interface AccessAttemptQuery {
  userId?: string;
  ipAddress?: string;
  action?: RuleAction;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface SessionIPInfo {
  currentIP: string;
  originalIP: string;
  changeCount: number;
  lastChangeAt?: string;
  isBound: boolean;
}
