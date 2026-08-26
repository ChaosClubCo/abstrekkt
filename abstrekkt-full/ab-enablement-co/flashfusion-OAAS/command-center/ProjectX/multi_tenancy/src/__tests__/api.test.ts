/**
 * Tests for multi_tenancy API functions
 *
 * Tests all API calls to the tenant management endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  createTenant,
  getTenant,
  getTenantBySlug,
  updateTenant,
  deleteTenant,
  getMyTenants,
  getTenantMembers,
  updateMemberRole,
  removeMember,
  inviteMember,
  getInvitations,
  cancelInvitation,
  acceptInvitation,
  checkSlugAvailability,
} from '../api';
import {
  mockTenant,
  mockTenants,
  mockMembers,
  mockInvitations,
  mockPendingInvitation,
  mockCreateTenantInput,
  mockUpdateTenantInput,
  mockInviteMemberInput,
  mockRegularMember,
} from './fixtures';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Multi-Tenancy API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // createTenant Tests
  // ===========================================================================

  describe('createTenant', () => {
    it('should send POST request to correct endpoint with tenant data', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTenant });

      const result = await createTenant(mockCreateTenantInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/tenants', mockCreateTenantInput);
      expect(result).toEqual(mockTenant);
    });

    it('should return created tenant with all properties', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTenant });

      const result = await createTenant(mockCreateTenantInput);

      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.slug).toBeDefined();
      expect(result.plan).toBeDefined();
      expect(result.settings).toBeDefined();
    });

    it('should handle minimal input (name only)', async () => {
      const minimalInput = { name: 'Minimal Workspace' };
      mockedAxios.post.mockResolvedValue({ data: { ...mockTenant, name: 'Minimal Workspace' } });

      await createTenant(minimalInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/tenants', minimalInput);
    });

    it('should throw error on validation failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Validation error: name is required'));

      await expect(createTenant({ name: '' })).rejects.toThrow('Validation error');
    });

    it('should throw error when slug is already taken', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Slug already exists'));

      await expect(createTenant(mockCreateTenantInput)).rejects.toThrow('Slug already exists');
    });

    it('should handle network errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(createTenant(mockCreateTenantInput)).rejects.toThrow('Network error');
    });
  });

  // ===========================================================================
  // getTenant Tests
  // ===========================================================================

  describe('getTenant', () => {
    it('should fetch tenant from correct endpoint with tenant ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenant });

      const result = await getTenant('tenant-main');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/tenant-main');
      expect(result).toEqual(mockTenant);
    });

    it('should return tenant with all expected properties', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenant });

      const result = await getTenant('tenant-main');

      expect(result.id).toBe('tenant-main');
      expect(result.name).toBe('Main Workspace');
      expect(result.slug).toBe('main-workspace');
      expect(result.plan).toBe('pro');
    });

    it('should throw error when tenant not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Tenant not found'));

      await expect(getTenant('invalid-tenant')).rejects.toThrow('Tenant not found');
    });

    it('should handle 404 response', async () => {
      const error = {
        response: { status: 404, data: { message: 'Tenant not found' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getTenant('invalid-tenant')).rejects.toEqual(error);
    });

    it('should handle unauthorized access', async () => {
      const error = {
        response: { status: 403, data: { message: 'Access denied' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getTenant('tenant-main')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // getTenantBySlug Tests
  // ===========================================================================

  describe('getTenantBySlug', () => {
    it('should fetch tenant from correct endpoint with slug', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenant });

      const result = await getTenantBySlug('main-workspace');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/by-slug/main-workspace');
      expect(result).toEqual(mockTenant);
    });

    it('should return matching tenant by slug', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenant });

      const result = await getTenantBySlug('main-workspace');

      expect(result.slug).toBe('main-workspace');
    });

    it('should throw error when slug not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Tenant not found'));

      await expect(getTenantBySlug('nonexistent-slug')).rejects.toThrow('Tenant not found');
    });

    it('should handle special characters in slug', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenant });

      await getTenantBySlug('my-workspace-123');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/by-slug/my-workspace-123');
    });
  });

  // ===========================================================================
  // updateTenant Tests
  // ===========================================================================

  describe('updateTenant', () => {
    it('should send PATCH request to correct endpoint with update data', async () => {
      const updatedTenant = { ...mockTenant, name: 'Updated Workspace Name' };
      mockedAxios.patch.mockResolvedValue({ data: updatedTenant });

      const result = await updateTenant('tenant-main', mockUpdateTenantInput);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/tenants/tenant-main',
        mockUpdateTenantInput
      );
      expect(result).toEqual(updatedTenant);
    });

    it('should return updated tenant', async () => {
      const updatedTenant = { ...mockTenant, name: 'Updated Workspace Name' };
      mockedAxios.patch.mockResolvedValue({ data: updatedTenant });

      const result = await updateTenant('tenant-main', mockUpdateTenantInput);

      expect(result.name).toBe('Updated Workspace Name');
    });

    it('should allow partial updates - name only', async () => {
      const nameUpdate = { name: 'New Name' };
      mockedAxios.patch.mockResolvedValue({ data: { ...mockTenant, name: 'New Name' } });

      await updateTenant('tenant-main', nameUpdate);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/tenants/tenant-main', nameUpdate);
    });

    it('should allow partial updates - settings only', async () => {
      const settingsUpdate = { settings: { mfaRequired: true } };
      mockedAxios.patch.mockResolvedValue({
        data: { ...mockTenant, settings: { ...mockTenant.settings, mfaRequired: true } },
      });

      await updateTenant('tenant-main', settingsUpdate);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/tenants/tenant-main', settingsUpdate);
    });

    it('should allow partial updates - logoUrl only', async () => {
      const logoUpdate = { logoUrl: 'https://example.com/new-logo.png' };
      mockedAxios.patch.mockResolvedValue({ data: { ...mockTenant, ...logoUpdate } });

      await updateTenant('tenant-main', logoUpdate);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/tenants/tenant-main', logoUpdate);
    });

    it('should throw error when tenant not found', async () => {
      mockedAxios.patch.mockRejectedValue(new Error('Tenant not found'));

      await expect(updateTenant('invalid-tenant', mockUpdateTenantInput)).rejects.toThrow(
        'Tenant not found'
      );
    });

    it('should throw error on validation failure', async () => {
      mockedAxios.patch.mockRejectedValue(new Error('Validation error'));

      await expect(updateTenant('tenant-main', { name: '' })).rejects.toThrow('Validation error');
    });

    it('should handle permission denied', async () => {
      const error = {
        response: { status: 403, data: { message: 'Permission denied' } },
      };
      mockedAxios.patch.mockRejectedValue(error);

      await expect(updateTenant('tenant-main', mockUpdateTenantInput)).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // deleteTenant Tests
  // ===========================================================================

  describe('deleteTenant', () => {
    it('should send DELETE request to correct endpoint', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      await deleteTenant('tenant-main');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/tenants/tenant-main');
    });

    it('should not return any data on successful deletion', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      const result = await deleteTenant('tenant-main');

      expect(result).toBeUndefined();
    });

    it('should throw error when tenant not found', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Tenant not found'));

      await expect(deleteTenant('invalid-tenant')).rejects.toThrow('Tenant not found');
    });

    it('should throw error when user lacks permission', async () => {
      const error = {
        response: { status: 403, data: { message: 'Only owner can delete tenant' } },
      };
      mockedAxios.delete.mockRejectedValue(error);

      await expect(deleteTenant('tenant-main')).rejects.toEqual(error);
    });

    it('should handle 400 Bad Request', async () => {
      const error = {
        response: { status: 400, data: { message: 'Cannot delete tenant with active members' } },
      };
      mockedAxios.delete.mockRejectedValue(error);

      await expect(deleteTenant('tenant-main')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // getMyTenants Tests
  // ===========================================================================

  describe('getMyTenants', () => {
    it('should fetch tenants from correct endpoint', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenants });

      const result = await getMyTenants();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/my');
      expect(result).toEqual(mockTenants);
    });

    it('should return array of tenants', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockTenants });

      const result = await getMyTenants();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(mockTenants.length);
    });

    it('should handle empty tenants list', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getMyTenants();

      expect(result).toEqual([]);
    });

    it('should throw error on unauthorized access', async () => {
      const error = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getMyTenants()).rejects.toEqual(error);
    });

    it('should handle network error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(getMyTenants()).rejects.toThrow('Network error');
    });
  });

  // ===========================================================================
  // getTenantMembers Tests
  // ===========================================================================

  describe('getTenantMembers', () => {
    it('should fetch members from correct endpoint with tenant ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockMembers });

      const result = await getTenantMembers('tenant-main');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/tenant-main/members');
      expect(result).toEqual(mockMembers);
    });

    it('should return array of members', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockMembers });

      const result = await getTenantMembers('tenant-main');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(mockMembers.length);
    });

    it('should include member roles in response', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockMembers });

      const result = await getTenantMembers('tenant-main');

      const roles = result.map((m) => m.role);
      expect(roles).toContain('owner');
      expect(roles).toContain('admin');
      expect(roles).toContain('member');
      expect(roles).toContain('viewer');
    });

    it('should throw error when tenant not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Tenant not found'));

      await expect(getTenantMembers('invalid-tenant')).rejects.toThrow('Tenant not found');
    });

    it('should handle empty members list', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getTenantMembers('tenant-main');

      expect(result).toEqual([]);
    });
  });

  // ===========================================================================
  // updateMemberRole Tests
  // ===========================================================================

  describe('updateMemberRole', () => {
    it('should send PATCH request to correct endpoint with role', async () => {
      const updatedMember = { ...mockRegularMember, role: 'admin' as const };
      mockedAxios.patch.mockResolvedValue({ data: updatedMember });

      const result = await updateMemberRole('tenant-main', 'member-regular', 'admin');

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/tenants/tenant-main/members/member-regular',
        { role: 'admin' }
      );
      expect(result).toEqual(updatedMember);
    });

    it('should return updated member with new role', async () => {
      const updatedMember = { ...mockRegularMember, role: 'admin' as const };
      mockedAxios.patch.mockResolvedValue({ data: updatedMember });

      const result = await updateMemberRole('tenant-main', 'member-regular', 'admin');

      expect(result.role).toBe('admin');
    });

    it('should allow role changes to viewer', async () => {
      const updatedMember = { ...mockRegularMember, role: 'viewer' as const };
      mockedAxios.patch.mockResolvedValue({ data: updatedMember });

      const result = await updateMemberRole('tenant-main', 'member-regular', 'viewer');

      expect(result.role).toBe('viewer');
    });

    it('should throw error when member not found', async () => {
      mockedAxios.patch.mockRejectedValue(new Error('Member not found'));

      await expect(updateMemberRole('tenant-main', 'invalid-member', 'admin')).rejects.toThrow(
        'Member not found'
      );
    });

    it('should throw error when trying to change owner role', async () => {
      mockedAxios.patch.mockRejectedValue(new Error('Cannot change owner role'));

      await expect(updateMemberRole('tenant-main', 'member-owner', 'admin')).rejects.toThrow(
        'Cannot change owner role'
      );
    });

    it('should handle permission denied', async () => {
      const error = {
        response: { status: 403, data: { message: 'Insufficient permissions' } },
      };
      mockedAxios.patch.mockRejectedValue(error);

      await expect(updateMemberRole('tenant-main', 'member-regular', 'admin')).rejects.toEqual(
        error
      );
    });
  });

  // ===========================================================================
  // removeMember Tests
  // ===========================================================================

  describe('removeMember', () => {
    it('should send DELETE request to correct endpoint', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      await removeMember('tenant-main', 'member-regular');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        '/api/tenants/tenant-main/members/member-regular'
      );
    });

    it('should not return any data on successful removal', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      const result = await removeMember('tenant-main', 'member-regular');

      expect(result).toBeUndefined();
    });

    it('should throw error when member not found', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Member not found'));

      await expect(removeMember('tenant-main', 'invalid-member')).rejects.toThrow(
        'Member not found'
      );
    });

    it('should throw error when trying to remove owner', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Cannot remove owner'));

      await expect(removeMember('tenant-main', 'member-owner')).rejects.toThrow(
        'Cannot remove owner'
      );
    });

    it('should handle permission denied', async () => {
      const error = {
        response: { status: 403, data: { message: 'Insufficient permissions' } },
      };
      mockedAxios.delete.mockRejectedValue(error);

      await expect(removeMember('tenant-main', 'member-regular')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // inviteMember Tests
  // ===========================================================================

  describe('inviteMember', () => {
    it('should send POST request to correct endpoint with invitation data', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockPendingInvitation });

      const result = await inviteMember('tenant-main', mockInviteMemberInput);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/tenants/tenant-main/invitations',
        mockInviteMemberInput
      );
      expect(result).toEqual(mockPendingInvitation);
    });

    it('should return created invitation', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockPendingInvitation });

      const result = await inviteMember('tenant-main', mockInviteMemberInput);

      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.role).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    it('should allow inviting with different roles', async () => {
      const adminInvite = { email: 'admin@example.com', role: 'admin' as const };
      mockedAxios.post.mockResolvedValue({
        data: { ...mockPendingInvitation, email: 'admin@example.com', role: 'admin' },
      });

      const result = await inviteMember('tenant-main', adminInvite);

      expect(result.role).toBe('admin');
    });

    it('should throw error when email already invited', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Email already invited'));

      await expect(inviteMember('tenant-main', mockInviteMemberInput)).rejects.toThrow(
        'Email already invited'
      );
    });

    it('should throw error when email already a member', async () => {
      mockedAxios.post.mockRejectedValue(new Error('User is already a member'));

      await expect(inviteMember('tenant-main', mockInviteMemberInput)).rejects.toThrow(
        'User is already a member'
      );
    });

    it('should throw error when plan limit reached', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Member limit reached for this plan'));

      await expect(inviteMember('tenant-main', mockInviteMemberInput)).rejects.toThrow(
        'Member limit reached'
      );
    });

    it('should handle validation error for invalid email', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invalid email format'));

      await expect(
        inviteMember('tenant-main', { email: 'invalid-email', role: 'member' })
      ).rejects.toThrow('Invalid email');
    });
  });

  // ===========================================================================
  // getInvitations Tests
  // ===========================================================================

  describe('getInvitations', () => {
    it('should fetch invitations from correct endpoint with tenant ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockInvitations });

      const result = await getInvitations('tenant-main');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/tenant-main/invitations');
      expect(result).toEqual(mockInvitations);
    });

    it('should return array of invitations', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockInvitations });

      const result = await getInvitations('tenant-main');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(mockInvitations.length);
    });

    it('should handle empty invitations list', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getInvitations('tenant-main');

      expect(result).toEqual([]);
    });

    it('should throw error when tenant not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Tenant not found'));

      await expect(getInvitations('invalid-tenant')).rejects.toThrow('Tenant not found');
    });

    it('should handle permission denied', async () => {
      const error = {
        response: { status: 403, data: { message: 'Insufficient permissions' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getInvitations('tenant-main')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // cancelInvitation Tests
  // ===========================================================================

  describe('cancelInvitation', () => {
    it('should send DELETE request to correct endpoint', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      await cancelInvitation('tenant-main', 'invitation-pending');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        '/api/tenants/tenant-main/invitations/invitation-pending'
      );
    });

    it('should not return any data on successful cancellation', async () => {
      mockedAxios.delete.mockResolvedValue({ data: undefined });

      const result = await cancelInvitation('tenant-main', 'invitation-pending');

      expect(result).toBeUndefined();
    });

    it('should throw error when invitation not found', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Invitation not found'));

      await expect(cancelInvitation('tenant-main', 'invalid-invitation')).rejects.toThrow(
        'Invitation not found'
      );
    });

    it('should throw error when invitation already accepted', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Invitation already accepted'));

      await expect(cancelInvitation('tenant-main', 'invitation-accepted')).rejects.toThrow(
        'Invitation already accepted'
      );
    });

    it('should handle permission denied', async () => {
      const error = {
        response: { status: 403, data: { message: 'Insufficient permissions' } },
      };
      mockedAxios.delete.mockRejectedValue(error);

      await expect(cancelInvitation('tenant-main', 'invitation-pending')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // acceptInvitation Tests
  // ===========================================================================

  describe('acceptInvitation', () => {
    it('should send POST request to correct endpoint with token', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTenant });

      const result = await acceptInvitation('token-pending-123');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/invitations/accept', {
        token: 'token-pending-123',
      });
      expect(result).toEqual(mockTenant);
    });

    it('should return the tenant after accepting invitation', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTenant });

      const result = await acceptInvitation('token-pending-123');

      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
    });

    it('should throw error when token is invalid', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invalid invitation token'));

      await expect(acceptInvitation('invalid-token')).rejects.toThrow('Invalid invitation token');
    });

    it('should throw error when invitation expired', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invitation has expired'));

      await expect(acceptInvitation('expired-token')).rejects.toThrow('Invitation has expired');
    });

    it('should throw error when invitation already accepted', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invitation already accepted'));

      await expect(acceptInvitation('accepted-token')).rejects.toThrow(
        'Invitation already accepted'
      );
    });

    it('should throw error when user already a member', async () => {
      mockedAxios.post.mockRejectedValue(new Error('User is already a member'));

      await expect(acceptInvitation('token-pending-123')).rejects.toThrow(
        'User is already a member'
      );
    });
  });

  // ===========================================================================
  // checkSlugAvailability Tests
  // ===========================================================================

  describe('checkSlugAvailability', () => {
    it('should fetch slug availability from correct endpoint', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });

      const result = await checkSlugAvailability('new-workspace');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/check-slug/new-workspace');
      expect(result).toBe(true);
    });

    it('should return true when slug is available', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });

      const result = await checkSlugAvailability('available-slug');

      expect(result).toBe(true);
    });

    it('should return false when slug is taken', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: false } });

      const result = await checkSlugAvailability('main-workspace');

      expect(result).toBe(false);
    });

    it('should handle special characters in slug', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });

      await checkSlugAvailability('my-workspace-123');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tenants/check-slug/my-workspace-123');
    });

    it('should handle network error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(checkSlugAvailability('new-slug')).rejects.toThrow('Network error');
    });
  });

  // ===========================================================================
  // Error Response Format Tests
  // ===========================================================================

  describe('Error Response Handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad Request', errors: ['Invalid tenant ID'] },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getTenant('')).rejects.toEqual(error);
    });

    it('should handle 401 Unauthorized errors', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getMyTenants()).rejects.toEqual(error);
    });

    it('should handle 403 Forbidden errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden - Insufficient permissions' },
        },
      };
      mockedAxios.patch.mockRejectedValue(error);

      await expect(updateTenant('tenant-main', mockUpdateTenantInput)).rejects.toEqual(error);
    });

    it('should handle 404 Not Found errors', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Tenant not found' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getTenant('invalid-id')).rejects.toEqual(error);
    });

    it('should handle 409 Conflict errors', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Slug already exists' },
        },
      };
      mockedAxios.post.mockRejectedValue(error);

      await expect(createTenant(mockCreateTenantInput)).rejects.toEqual(error);
    });

    it('should handle 500 Internal Server Error', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getMyTenants()).rejects.toEqual(error);
    });

    it('should handle network timeout errors', async () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getMyTenants()).rejects.toEqual(error);
    });

    it('should handle network connection errors', async () => {
      const error = {
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND api.example.com',
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getMyTenants()).rejects.toEqual(error);
    });
  });
});
