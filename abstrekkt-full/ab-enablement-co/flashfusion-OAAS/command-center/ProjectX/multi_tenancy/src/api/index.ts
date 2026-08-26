import axios from 'axios';
import type {
  Tenant,
  TenantMember,
  TenantInvitation,
  CreateTenantInput,
  UpdateTenantInput,
  InviteMemberInput,
} from '../types';

const API_BASE = '/api/tenants';

// Tenant CRUD operations
export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  const response = await axios.post<Tenant>(API_BASE, input);
  return response.data;
}

export async function getTenant(tenantId: string): Promise<Tenant> {
  const response = await axios.get<Tenant>(`${API_BASE}/${tenantId}`);
  return response.data;
}

export async function getTenantBySlug(slug: string): Promise<Tenant> {
  const response = await axios.get<Tenant>(`${API_BASE}/by-slug/${slug}`);
  return response.data;
}

export async function updateTenant(tenantId: string, input: UpdateTenantInput): Promise<Tenant> {
  const response = await axios.patch<Tenant>(`${API_BASE}/${tenantId}`, input);
  return response.data;
}

export async function deleteTenant(tenantId: string): Promise<void> {
  await axios.delete(`${API_BASE}/${tenantId}`);
}

// User's tenants
export async function getMyTenants(): Promise<Tenant[]> {
  const response = await axios.get<Tenant[]>(`${API_BASE}/my`);
  return response.data;
}

// Tenant members
export async function getTenantMembers(tenantId: string): Promise<TenantMember[]> {
  const response = await axios.get<TenantMember[]>(`${API_BASE}/${tenantId}/members`);
  return response.data;
}

export async function updateMemberRole(
  tenantId: string,
  memberId: string,
  role: TenantMember['role']
): Promise<TenantMember> {
  const response = await axios.patch<TenantMember>(
    `${API_BASE}/${tenantId}/members/${memberId}`,
    { role }
  );
  return response.data;
}

export async function removeMember(tenantId: string, memberId: string): Promise<void> {
  await axios.delete(`${API_BASE}/${tenantId}/members/${memberId}`);
}

// Invitations
export async function inviteMember(
  tenantId: string,
  input: InviteMemberInput
): Promise<TenantInvitation> {
  const response = await axios.post<TenantInvitation>(
    `${API_BASE}/${tenantId}/invitations`,
    input
  );
  return response.data;
}

export async function getInvitations(tenantId: string): Promise<TenantInvitation[]> {
  const response = await axios.get<TenantInvitation[]>(`${API_BASE}/${tenantId}/invitations`);
  return response.data;
}

export async function cancelInvitation(tenantId: string, invitationId: string): Promise<void> {
  await axios.delete(`${API_BASE}/${tenantId}/invitations/${invitationId}`);
}

export async function acceptInvitation(token: string): Promise<Tenant> {
  const response = await axios.post<Tenant>('/api/invitations/accept', { token });
  return response.data;
}

// Slug validation
export async function checkSlugAvailability(slug: string): Promise<boolean> {
  const response = await axios.get<{ available: boolean }>(`${API_BASE}/check-slug/${slug}`);
  return response.data.available;
}
