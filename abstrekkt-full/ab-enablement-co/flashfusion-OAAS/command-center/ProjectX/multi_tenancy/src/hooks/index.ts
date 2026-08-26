import { useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TenantContext } from '../components/TenantProvider';
import * as api from '../api';
import type {
  Tenant,
  UpdateTenantInput,
  InviteMemberInput,
  TenantMember,
} from '../types';

/**
 * Access the current tenant context
 */
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

/**
 * List and manage user's workspaces
 */
export function useWorkspaces() {
  const queryClient = useQueryClient();
  const { tenant, setTenant } = useTenant();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: api.getMyTenants,
  });

  const createMutation = useMutation({
    mutationFn: api.createTenant,
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setTenant(newTenant);
    },
  });

  const switchWorkspace = useCallback(
    (workspace: Tenant) => {
      setTenant(workspace);
      // Store in localStorage for persistence
      localStorage.setItem('currentTenantId', workspace.id);
    },
    [setTenant]
  );

  return {
    workspaces,
    currentWorkspace: tenant,
    isLoading,
    switchWorkspace,
    createWorkspace: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

/**
 * Manage tenant settings
 */
export function useTenantSettings() {
  const queryClient = useQueryClient();
  const { tenant, setTenant } = useTenant();

  const updateMutation = useMutation({
    mutationFn: (input: UpdateTenantInput) => {
      if (!tenant) throw new Error('No tenant selected');
      return api.updateTenant(tenant.id, input);
    },
    onSuccess: (updatedTenant) => {
      setTenant(updatedTenant);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  return {
    settings: tenant?.settings,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

/**
 * Manage tenant members
 */
export function useTenantMembers() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();
  const tenantId = tenant?.id;

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['tenantMembers', tenantId],
    queryFn: () => (tenantId ? api.getTenantMembers(tenantId) : Promise.resolve([])),
    enabled: !!tenantId,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: TenantMember['role'] }) => {
      if (!tenantId) throw new Error('No tenant selected');
      return api.updateMemberRole(tenantId, memberId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantMembers', tenantId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => {
      if (!tenantId) throw new Error('No tenant selected');
      return api.removeMember(tenantId, memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantMembers', tenantId] });
    },
  });

  return {
    members,
    isLoading,
    updateRole: updateRoleMutation.mutateAsync,
    removeMember: removeMutation.mutateAsync,
  };
}

/**
 * Manage workspace invitations
 */
export function useInvitations() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();
  const tenantId = tenant?.id;

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ['invitations', tenantId],
    queryFn: () => (tenantId ? api.getInvitations(tenantId) : Promise.resolve([])),
    enabled: !!tenantId,
  });

  const inviteMutation = useMutation({
    mutationFn: (input: InviteMemberInput) => {
      if (!tenantId) throw new Error('No tenant selected');
      return api.inviteMember(tenantId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (invitationId: string) => {
      if (!tenantId) throw new Error('No tenant selected');
      return api.cancelInvitation(tenantId, invitationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
    },
  });

  return {
    invitations,
    isLoading,
    invite: inviteMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
  };
}

/**
 * Hook for accepting invitations
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const { setTenant } = useTenant();

  const mutation = useMutation({
    mutationFn: api.acceptInvitation,
    onSuccess: (tenant) => {
      setTenant(tenant);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  return {
    accept: mutation.mutateAsync,
    isAccepting: mutation.isPending,
    error: mutation.error,
  };
}
