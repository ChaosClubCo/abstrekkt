import type { User } from '@projectx/shared';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  settings: TenantSettings;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TenantPlan = 'free' | 'pro' | 'enterprise';

export interface TenantSettings {
  allowedDomains?: string[];
  ssoEnabled?: boolean;
  mfaRequired?: boolean;
  auditLogRetentionDays?: number;
  customBranding?: {
    primaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
}

export interface TenantMember {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  user?: User;
  joinedAt: Date;
}

export type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
}

export interface CreateTenantInput {
  name: string;
  slug?: string;
  plan?: TenantPlan;
}

export interface UpdateTenantInput {
  name?: string;
  settings?: Partial<TenantSettings>;
  logoUrl?: string;
}

export interface InviteMemberInput {
  email: string;
  role: TenantRole;
}

export interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

export interface PlanLimits {
  maxMembers: number;
  maxProjects: number;
  maxStorage: number; // in GB
  features: string[];
}

export const PLAN_LIMITS: Record<TenantPlan, PlanLimits> = {
  free: {
    maxMembers: 5,
    maxProjects: 3,
    maxStorage: 1,
    features: ['basic_analytics', 'email_support'],
  },
  pro: {
    maxMembers: 25,
    maxProjects: 50,
    maxStorage: 50,
    features: ['advanced_analytics', 'priority_support', 'api_access', 'custom_domain'],
  },
  enterprise: {
    maxMembers: -1, // unlimited
    maxProjects: -1,
    maxStorage: -1,
    features: ['sso', 'audit_logs', 'sla', 'dedicated_support', 'custom_integrations'],
  },
};
