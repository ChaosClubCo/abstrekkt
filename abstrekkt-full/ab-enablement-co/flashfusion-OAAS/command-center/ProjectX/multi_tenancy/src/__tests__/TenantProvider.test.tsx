/**
 * Tests for TenantProvider context component
 *
 * Tests context initialization, localStorage persistence, and state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext } from 'react';
import { TenantProvider, TenantContext } from '../components/TenantProvider';
import * as api from '../api';
import type { TenantContextValue } from '../types';
import { mockTenant, mockTenants, createLocalStorageMock } from './fixtures';

// Mock the API module
vi.mock('../api');

const mockedApi = vi.mocked(api);

// Test component to access context
function TestConsumer({ onContextValue }: { onContextValue: (value: TenantContextValue | null) => void }) {
  const context = useContext(TenantContext);
  onContextValue(context);

  if (!context) {
    return <div>No context</div>;
  }

  return (
    <div>
      <div data-testid="tenant-name">{context.tenant?.name || 'No tenant'}</div>
      <div data-testid="is-loading">{context.isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error">{context.error?.message || 'No error'}</div>
      <button data-testid="set-tenant" onClick={() => context.setTenant(mockTenants[1])}>
        Set Tenant
      </button>
      <button data-testid="clear-tenant" onClick={() => context.clearTenant()}>
        Clear Tenant
      </button>
    </div>
  );
}

describe('TenantProvider', () => {
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
  // Context Initialization Tests
  // ===========================================================================

  describe('Context Initialization', () => {
    it('should provide context value to children', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      let capturedContext: TenantContextValue | null = null;

      render(
        <TenantProvider>
          <TestConsumer onContextValue={(value) => { capturedContext = value; }} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(capturedContext).not.toBeNull();
      });

      expect(capturedContext!.setTenant).toBeDefined();
      expect(capturedContext!.clearTenant).toBeDefined();
    });

    it('should start with loading state true', () => {
      mockedApi.getMyTenants.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTenants), 100))
      );

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      expect(screen.getByTestId('is-loading')).toHaveTextContent('Loading');
    });

    it('should set loading state to false after initialization', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });
    });

    it('should render children', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <div data-testid="child">Child content</div>
        </TenantProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child content');
    });
  });

  // ===========================================================================
  // Tenant Loading Tests
  // ===========================================================================

  describe('Tenant Loading', () => {
    it('should load tenant from defaultTenantId prop', async () => {
      mockedApi.getTenant.mockResolvedValue(mockTenant);

      render(
        <TenantProvider defaultTenantId="tenant-main">
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-name')).toHaveTextContent('Main Workspace');
      });

      expect(mockedApi.getTenant).toHaveBeenCalledWith('tenant-main');
    });

    it('should load tenant from localStorage if no defaultTenantId', async () => {
      localStorageMock.setItem('currentTenantId', 'tenant-main');
      mockedApi.getTenant.mockResolvedValue(mockTenant);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-name')).toHaveTextContent('Main Workspace');
      });

      expect(mockedApi.getTenant).toHaveBeenCalledWith('tenant-main');
    });

    it('should load first available tenant when no stored tenant ID', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-name')).toHaveTextContent(mockTenants[0].name);
      });

      expect(mockedApi.getMyTenants).toHaveBeenCalled();
    });

    it('should store first tenant ID in localStorage when auto-selecting', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      expect(localStorageMock.getItem('currentTenantId')).toBe(mockTenants[0].id);
    });

    it('should handle empty tenants list gracefully', async () => {
      mockedApi.getMyTenants.mockResolvedValue([]);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent('No tenant');
    });

    it('should prefer defaultTenantId over localStorage', async () => {
      localStorageMock.setItem('currentTenantId', 'tenant-from-storage');
      mockedApi.getTenant.mockResolvedValue(mockTenant);

      render(
        <TenantProvider defaultTenantId="tenant-main">
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-name')).toHaveTextContent('Main Workspace');
      });

      expect(mockedApi.getTenant).toHaveBeenCalledWith('tenant-main');
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should set error state when tenant loading fails', async () => {
      mockedApi.getTenant.mockRejectedValue(new Error('Failed to load tenant'));
      localStorageMock.setItem('currentTenantId', 'tenant-main');

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load tenant');
      });
    });

    it('should set error state when getMyTenants fails', async () => {
      mockedApi.getMyTenants.mockRejectedValue(new Error('Network error'));

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });

    it('should handle non-Error exceptions', async () => {
      mockedApi.getMyTenants.mockRejectedValue('String error');

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load tenant');
      });
    });

    it('should set loading to false even on error', async () => {
      mockedApi.getMyTenants.mockRejectedValue(new Error('Error'));

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });
    });

    it('should clear error on successful load', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('No error');
    });
  });

  // ===========================================================================
  // setTenant Tests
  // ===========================================================================

  describe('setTenant', () => {
    it('should update tenant state when setTenant is called', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      act(() => {
        screen.getByTestId('set-tenant').click();
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent(mockTenants[1].name);
    });

    it('should update localStorage when setTenant is called', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      act(() => {
        screen.getByTestId('set-tenant').click();
      });

      expect(localStorageMock.getItem('currentTenantId')).toBe(mockTenants[1].id);
    });
  });

  // ===========================================================================
  // clearTenant Tests
  // ===========================================================================

  describe('clearTenant', () => {
    it('should clear tenant state when clearTenant is called', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-name')).toHaveTextContent(mockTenants[0].name);
      });

      act(() => {
        screen.getByTestId('clear-tenant').click();
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent('No tenant');
    });

    it('should remove tenant ID from localStorage when clearTenant is called', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      // Verify localStorage has the tenant ID
      expect(localStorageMock.getItem('currentTenantId')).toBe(mockTenants[0].id);

      act(() => {
        screen.getByTestId('clear-tenant').click();
      });

      expect(localStorageMock.getItem('currentTenantId')).toBeNull();
    });
  });

  // ===========================================================================
  // Context Value Memoization Tests
  // ===========================================================================

  describe('Context Value Memoization', () => {
    it('should maintain stable setTenant reference', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const contextValues: TenantContextValue[] = [];

      const { rerender } = render(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              if (value) contextValues.push(value);
            }}
          />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(contextValues.length).toBeGreaterThan(0);
      });

      const initialSetTenant = contextValues[contextValues.length - 1].setTenant;

      // Force a rerender
      rerender(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              if (value) contextValues.push(value);
            }}
          />
        </TenantProvider>
      );

      const afterRerenderSetTenant = contextValues[contextValues.length - 1].setTenant;

      expect(initialSetTenant).toBe(afterRerenderSetTenant);
    });

    it('should maintain stable clearTenant reference', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      const contextValues: TenantContextValue[] = [];

      const { rerender } = render(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              if (value) contextValues.push(value);
            }}
          />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(contextValues.length).toBeGreaterThan(0);
      });

      const initialClearTenant = contextValues[contextValues.length - 1].clearTenant;

      // Force a rerender
      rerender(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              if (value) contextValues.push(value);
            }}
          />
        </TenantProvider>
      );

      const afterRerenderClearTenant = contextValues[contextValues.length - 1].clearTenant;

      expect(initialClearTenant).toBe(afterRerenderClearTenant);
    });
  });

  // ===========================================================================
  // Edge Cases Tests
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle rapid setTenant calls', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      let capturedContext: TenantContextValue | null = null;

      render(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              capturedContext = value;
            }}
          />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(capturedContext).not.toBeNull();
      });

      // Rapid calls
      act(() => {
        capturedContext!.setTenant(mockTenants[0]);
        capturedContext!.setTenant(mockTenants[1]);
        capturedContext!.setTenant(mockTenants[2]);
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent(mockTenants[2].name);
      expect(localStorageMock.getItem('currentTenantId')).toBe(mockTenants[2].id);
    });

    it('should handle setTenant followed by clearTenant', async () => {
      mockedApi.getMyTenants.mockResolvedValue(mockTenants);
      let capturedContext: TenantContextValue | null = null;

      render(
        <TenantProvider>
          <TestConsumer
            onContextValue={(value) => {
              capturedContext = value;
            }}
          />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(capturedContext).not.toBeNull();
      });

      act(() => {
        capturedContext!.setTenant(mockTenants[1]);
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent(mockTenants[1].name);

      act(() => {
        capturedContext!.clearTenant();
      });

      expect(screen.getByTestId('tenant-name')).toHaveTextContent('No tenant');
      expect(localStorageMock.getItem('currentTenantId')).toBeNull();
    });

    it('should handle invalid stored tenant ID gracefully', async () => {
      localStorageMock.setItem('currentTenantId', 'invalid-tenant-id');
      mockedApi.getTenant.mockRejectedValue(new Error('Tenant not found'));

      render(
        <TenantProvider>
          <TestConsumer onContextValue={() => {}} />
        </TenantProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('Not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('Tenant not found');
    });
  });

  // ===========================================================================
  // Context Outside Provider Tests
  // ===========================================================================

  describe('Context Outside Provider', () => {
    it('should return null context when not wrapped in TenantProvider', () => {
      let capturedContext: TenantContextValue | null = null;

      render(
        <TestConsumer
          onContextValue={(value) => {
            capturedContext = value;
          }}
        />
      );

      expect(capturedContext).toBeNull();
      expect(screen.getByText('No context')).toBeInTheDocument();
    });
  });
});
