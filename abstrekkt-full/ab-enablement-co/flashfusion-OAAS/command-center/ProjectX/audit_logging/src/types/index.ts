export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string | null;
  action: AuditAction;
  resource: string;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: Date;
}

export type AuditAction =
  // User actions
  | 'user.login'
  | 'user.logout'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.invited'
  | 'user.role_changed'
  // Resource actions
  | 'resource.created'
  | 'resource.read'
  | 'resource.updated'
  | 'resource.deleted'
  | 'resource.exported'
  | 'resource.imported'
  // Team actions
  | 'team.created'
  | 'team.updated'
  | 'team.deleted'
  | 'team.member_added'
  | 'team.member_removed'
  // Security actions
  | 'security.mfa_enabled'
  | 'security.mfa_disabled'
  | 'security.password_changed'
  | 'security.password_reset'
  | 'security.api_key_created'
  | 'security.api_key_revoked'
  | 'security.session_revoked'
  | 'security.suspicious_activity'
  // Billing actions
  | 'billing.subscription_created'
  | 'billing.subscription_updated'
  | 'billing.subscription_cancelled'
  | 'billing.payment_succeeded'
  | 'billing.payment_failed'
  // Admin actions
  | 'admin.settings_changed'
  | 'admin.export_requested'
  | 'admin.data_deleted'
  // Custom actions
  | string;

export interface CreateAuditLogInput {
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogFilters {
  tenantId?: string;
  userId?: string;
  action?: AuditAction | AuditAction[];
  resource?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface AuditLogSearchParams extends AuditLogFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'timestamp' | 'action' | 'resource';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogSearchResult {
  data: AuditLogEntry[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type ExportFormat = 'csv' | 'json';

export interface AuditConfig {
  retentionDays: number;
  autoTrack: AuditAction[];
  exclude: AuditAction[];
  includeRequestBody: boolean;
  sensitiveFields: string[];
}

export interface AuditContext {
  log: (entry: CreateAuditLogInput) => Promise<void>;
  isLogging: boolean;
}
