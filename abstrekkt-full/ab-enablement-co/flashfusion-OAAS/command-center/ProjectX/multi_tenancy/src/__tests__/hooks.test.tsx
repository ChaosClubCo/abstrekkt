/**
 * Tests for multi_tenancy hooks
 *
 * Tests useTenant, useWorkspaces, useTenantSettings, useTenantMembers,
 * useInvitations, and useAcceptInvitation hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  useTenant,
  useWorkspaces,
  useTenantSettings,
  useTenantMembers,
  useInvitations,
  useAcceptInvitation,
} from '../hooks';
import { TenantContext } from '../components/TenantProvider';
import * as api from '../api';
import type { TenantContextValue, Tenant } from '../types';
import {
  mockTenant,
  mockTenants,
  mockMembers,
  mockInvitations,
  mockPendingInvitation,
  mockCreateTenantInput,
  mockUpdateTenantInput,
  mockInviteMemberInput,
  createLocalStorageMock,
} from './fixtures';

// Mock the API module
vi.mock('../api');

const mockedApi = vi.mocked(api);

// Create a wrapper with QueryClientProvider and TenantContext for testing hooks
function createWrapper(contextValue: TenantContextValue) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>
      </QueryClientProvider>
    );
  };
}

// Create default mock context value
function createMockContextValue(overrides: Partial<TenantContextValue> = {}): TenantContextValue {
  return {
    tenant: mockTenant,
    isLoading: false,
    error: null,
    setTenant: vi.fn(),
    clearTenant: vi.fn(),
    ...overrides,
  };
}

describe('useTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Context Access Tests
  // ===========================================================================

  describe('Context Access', () => {
    it('should return tenant context when used within TenantProvider', () => {
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenant(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.tenant).toEqual(mockTenant);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return loading state from context', () => {
      const contextValue = createMockContextValue({ isLoading: true, tenant: null });

      const { result } = renderHook(() => useTenant(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.tenant).toBeNull();
    });

    it('should return error state from context', () => {
      const error = new Error('Failed to load tenant');
      const contextValue = createMockContextValue({ error, tenant: null });

      const { result } = renderHook(() => useTenant(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.error).toEqual(error);
    });

    it('should throw error when used outside TenantProvider', () => {
      const queryClient = new QueryClient();

      expect(() => {
        renderHook(() => useTenant(), {
          wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          ),
        });
      }).toThrow('useTenant must be used within a TenantProvider');
    });

    it('should provide setTenant function', () => {
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useTenant(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.setTenant).toBe(setTenant);
    });

    it('should provide clearTenant function', () => {
      const clearTenant = vi.fn();
      const contextValue = createMockContextValue({ clearTenant });

      const { result } = renderHook(() => useTenant(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.clearTenant).toBe(clearTenant);
    });
  });
});

describe('useWorkspaces', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch workspaces on mount', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.workspaces).toEqual(mockTenants);
      expect(mockedApi.getMyTenants).toHaveBeenCalledTimes(1);
    });

    it('should return empty array initially while loading', () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.workspaces).toEqual([]);
    });

    it('should return current workspace from context', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentWorkspace).toEqual(mockTenant);
    });
  });

  // ===========================================================================
  // Switch Workspace Tests
  // ===========================================================================

  describe('Switch Workspace', () => {
    it('should call setTenant when switching workspace', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.switchWorkspace(mockTenants[1]);
      });

      expect(setTenant).toHaveBeenCalledWith(mockTenants[1]);
    });

    it('should store tenant ID in localStorage when switching', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.switchWorkspace(mockTenants[1]);
      });

      expect(localStorageMock.getItem('currentTenantId')).toBe(mockTenants[1].id);
    });
  });

  // ===========================================================================
  // Create Workspace Tests
  // ===========================================================================

  describe('Create Workspace', () => {
    it('should create workspace and update context on success', async () => {
      const newTenant = { ...mockTenant, id: 'new-tenant', name: 'New Workspace' };
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      mockedApi.createTenant.mockResolvedValue(newTenant);
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createWorkspace(mockCreateTenantInput);
      });

      // React Query passes mutation context as second arg, check first arg
      expect(mockedApi.createTenant).toHaveBeenCalled();
      expect(mockedApi.createTenant.mock.calls[0][0]).toEqual(mockCreateTenantInput);
      expect(setTenant).toHaveBeenCalledWith(newTenant);
    });

    it('should set isCreating to true during creation', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      let resolveCreate: (value: Tenant) => void;
      const createPromise = new Promise<Tenant>((resolve) => {
        resolveCreate = resolve;
      });
      mockedApi.createTenant.mockReturnValue(createPromise);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.createWorkspace(mockCreateTenantInput);
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(true);
      });

      await act(async () => {
        resolveCreate!(mockTenant);
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });

    it('should handle create workspace errors', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      mockedApi.createTenant.mockRejectedValue(new Error('Create failed'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useWorkspaces(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.createWorkspace(mockCreateTenantInput);
        })
      ).rejects.toThrow('Create failed');
    });
  });
});

describe('useTenantSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Settings Access Tests
  // ===========================================================================

  describe('Settings Access', () => {
    it('should return current tenant settings', () => {
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.settings).toEqual(mockTenant.settings);
    });

    it('should return undefined settings when no tenant', () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.settings).toBeUndefined();
    });
  });

  // ===========================================================================
  // Update Settings Tests
  // ===========================================================================

  describe('Update Settings', () => {
    it('should update tenant settings successfully', async () => {
      const updatedTenant = {
        ...mockTenant,
        settings: { ...mockTenant.settings, mfaRequired: true },
      };
      mockedApi.updateTenant.mockResolvedValue(updatedTenant);
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      await act(async () => {
        await result.current.updateSettings(mockUpdateTenantInput);
      });

      expect(mockedApi.updateTenant).toHaveBeenCalledWith(mockTenant.id, mockUpdateTenantInput);
      expect(setTenant).toHaveBeenCalledWith(updatedTenant);
    });

    it('should throw error when no tenant selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.updateSettings(mockUpdateTenantInput);
        })
      ).rejects.toThrow('No tenant selected');
    });

    it('should set isUpdating to true during update', async () => {
      let resolveUpdate: (value: Tenant) => void;
      const updatePromise = new Promise<Tenant>((resolve) => {
        resolveUpdate = resolve;
      });
      mockedApi.updateTenant.mockReturnValue(updatePromise);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      act(() => {
        result.current.updateSettings(mockUpdateTenantInput);
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      await act(async () => {
        resolveUpdate!(mockTenant);
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });

    it('should handle update errors', async () => {
      mockedApi.updateTenant.mockRejectedValue(new Error('Update failed'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantSettings(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.updateSettings(mockUpdateTenantInput);
        })
      ).rejects.toThrow('Update failed');
    });
  });
});

describe('useTenantMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch members on mount when tenant is selected', async () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.members).toEqual(mockMembers);
      expect(mockedApi.getTenantMembers).toHaveBeenCalledWith(mockTenant.id);
    });

    it('should not fetch members when no tenant is selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedApi.getTenantMembers).not.toHaveBeenCalled();
      expect(result.current.members).toEqual([]);
    });

    it('should return empty array initially while loading', () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.members).toEqual([]);
    });
  });

  // ===========================================================================
  // Update Role Tests
  // ===========================================================================

  describe('Update Role', () => {
    it('should update member role successfully', async () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      mockedApi.updateMemberRole.mockResolvedValue({ ...mockMembers[2], role: 'admin' });
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateRole({ memberId: 'member-regular', role: 'admin' });
      });

      expect(mockedApi.updateMemberRole).toHaveBeenCalledWith(
        mockTenant.id,
        'member-regular',
        'admin'
      );
    });

    it('should throw error when no tenant selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.updateRole({ memberId: 'member-regular', role: 'admin' });
        })
      ).rejects.toThrow('No tenant selected');
    });

    it('should handle update role errors', async () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      mockedApi.updateMemberRole.mockRejectedValue(new Error('Permission denied'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.updateRole({ memberId: 'member-regular', role: 'admin' });
        })
      ).rejects.toThrow('Permission denied');
    });
  });

  // ===========================================================================
  // Remove Member Tests
  // ===========================================================================

  describe('Remove Member', () => {
    it('should remove member successfully', async () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      mockedApi.removeMember.mockResolvedValue(undefined);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.removeMember('member-regular');
      });

      expect(mockedApi.removeMember).toHaveBeenCalledWith(mockTenant.id, 'member-regular');
    });

    it('should throw error when no tenant selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.removeMember('member-regular');
        })
      ).rejects.toThrow('No tenant selected');
    });

    it('should handle remove member errors', async () => {
      mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
      mockedApi.removeMember.mockRejectedValue(new Error('Cannot remove owner'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useTenantMembers(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.removeMember('member-owner');
        })
      ).rejects.toThrow('Cannot remove owner');
    });
  });
});

describe('useInvitations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch invitations on mount when tenant is selected', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.invitations).toEqual(mockInvitations);
      expect(mockedApi.getInvitations).toHaveBeenCalledWith(mockTenant.id);
    });

    it('should not fetch invitations when no tenant is selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedApi.getInvitations).not.toHaveBeenCalled();
      expect(result.current.invitations).toEqual([]);
    });

    it('should return empty array initially while loading', () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.invitations).toEqual([]);
    });
  });

  // ===========================================================================
  // Invite Member Tests
  // ===========================================================================

  describe('Invite Member', () => {
    it('should invite member successfully', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      mockedApi.inviteMember.mockResolvedValue(mockPendingInvitation);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.invite(mockInviteMemberInput);
      });

      expect(mockedApi.inviteMember).toHaveBeenCalledWith(mockTenant.id, mockInviteMemberInput);
    });

    it('should set isInviting to true during invitation', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);

      let resolveInvite: (value: typeof mockPendingInvitation) => void;
      const invitePromise = new Promise<typeof mockPendingInvitation>((resolve) => {
        resolveInvite = resolve;
      });
      mockedApi.inviteMember.mockReturnValue(invitePromise);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.invite(mockInviteMemberInput);
      });

      await waitFor(() => {
        expect(result.current.isInviting).toBe(true);
      });

      await act(async () => {
        resolveInvite!(mockPendingInvitation);
      });

      await waitFor(() => {
        expect(result.current.isInviting).toBe(false);
      });
    });

    it('should throw error when no tenant selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.invite(mockInviteMemberInput);
        })
      ).rejects.toThrow('No tenant selected');
    });

    it('should handle invite errors', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      mockedApi.inviteMember.mockRejectedValue(new Error('Email already invited'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.invite(mockInviteMemberInput);
        })
      ).rejects.toThrow('Email already invited');
    });
  });

  // ===========================================================================
  // Cancel Invitation Tests
  // ===========================================================================

  describe('Cancel Invitation', () => {
    it('should cancel invitation successfully', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      mockedApi.cancelInvitation.mockResolvedValue(undefined);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.cancel('invitation-pending');
      });

      expect(mockedApi.cancelInvitation).toHaveBeenCalledWith(mockTenant.id, 'invitation-pending');
    });

    it('should throw error when no tenant selected', async () => {
      const contextValue = createMockContextValue({ tenant: null });

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.cancel('invitation-pending');
        })
      ).rejects.toThrow('No tenant selected');
    });

    it('should handle cancel errors', async () => {
      mockedApi.getInvitations.mockResolvedValue(mockInvitations);
      mockedApi.cancelInvitation.mockRejectedValue(new Error('Invitation not found'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useInvitations(), {
        wrapper: createWrapper(contextValue),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.cancel('invalid-invitation');
        })
      ).rejects.toThrow('Invitation not found');
    });
  });
});

describe('useAcceptInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Accept Invitation Tests
  // ===========================================================================

  describe('Accept Invitation', () => {
    it('should accept invitation successfully', async () => {
      mockedApi.acceptInvitation.mockResolvedValue(mockTenant);
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });

      const { result } = renderHook(() => useAcceptInvitation(), {
        wrapper: createWrapper(contextValue),
      });

      await act(async () => {
        await result.current.accept('valid-token');
      });

      // React Query passes mutation context as second arg, check first arg
      expect(mockedApi.acceptInvitation).toHaveBeenCalled();
      expect(mockedApi.acceptInvitation.mock.calls[0][0]).toBe('valid-token');
      expect(setTenant).toHaveBeenCalledWith(mockTenant);
    });

    it('should set isAccepting to true during acceptance', async () => {
      let resolveAccept: (value: Tenant) => void;
      const acceptPromise = new Promise<Tenant>((resolve) => {
        resolveAccept = resolve;
      });
      mockedApi.acceptInvitation.mockReturnValue(acceptPromise);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useAcceptInvitation(), {
        wrapper: createWrapper(contextValue),
      });

      act(() => {
        result.current.accept('valid-token');
      });

      await waitFor(() => {
        expect(result.current.isAccepting).toBe(true);
      });

      await act(async () => {
        resolveAccept!(mockTenant);
      });

      await waitFor(() => {
        expect(result.current.isAccepting).toBe(false);
      });
    });

    it('should handle accept errors and throw them', async () => {
      const error = new Error('Invalid token');
      mockedApi.acceptInvitation.mockRejectedValue(error);
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useAcceptInvitation(), {
        wrapper: createWrapper(contextValue),
      });

      // Using mutateAsync should throw the error
      await expect(
        act(async () => {
          await result.current.accept('invalid-token');
        })
      ).rejects.toThrow('Invalid token');
    });

    it('should handle expired invitation error', async () => {
      mockedApi.acceptInvitation.mockRejectedValue(new Error('Invitation has expired'));
      const contextValue = createMockContextValue();

      const { result } = renderHook(() => useAcceptInvitation(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(
        act(async () => {
          await result.current.accept('expired-token');
        })
      ).rejects.toThrow('Invitation has expired');
    });
  });
});

// ===========================================================================
// Integration Tests
// ===========================================================================

describe('Hook Integration', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('should allow concurrent use of multiple hooks', async () => {
    mockedApi.getMyTenants.mockResolvedValue(mockTenants);
    mockedApi.getTenantMembers.mockResolvedValue(mockMembers);
    mockedApi.getInvitations.mockResolvedValue(mockInvitations);
    const contextValue = createMockContextValue();
    const wrapper = createWrapper(contextValue);

    const { result: workspacesResult } = renderHook(() => useWorkspaces(), { wrapper });
    const { result: membersResult } = renderHook(() => useTenantMembers(), { wrapper });
    const { result: invitationsResult } = renderHook(() => useInvitations(), { wrapper });

    await waitFor(() => {
      expect(workspacesResult.current.isLoading).toBe(false);
      expect(membersResult.current.isLoading).toBe(false);
      expect(invitationsResult.current.isLoading).toBe(false);
    });

    expect(workspacesResult.current.workspaces).toHaveLength(mockTenants.length);
    expect(membersResult.current.members).toHaveLength(mockMembers.length);
    expect(invitationsResult.current.invitations).toHaveLength(mockInvitations.length);
  });

  it('should handle mixed success and failure states', async () => {
    mockedApi.getMyTenants.mockResolvedValue(mockTenants);
    mockedApi.getTenantMembers.mockRejectedValue(new Error('Members error'));
    const contextValue = createMockContextValue();
    const wrapper = createWrapper(contextValue);

    const { result: workspacesResult } = renderHook(() => useWorkspaces(), { wrapper });
    const { result: membersResult } = renderHook(() => useTenantMembers(), { wrapper });

    await waitFor(() => {
      expect(workspacesResult.current.isLoading).toBe(false);
      expect(membersResult.current.isLoading).toBe(false);
    });

    // Workspaces should succeed
    expect(workspacesResult.current.workspaces).toHaveLength(mockTenants.length);

    // Members should fail but not affect other hooks
    expect(membersResult.current.members).toEqual([]);
  });
});
