/**
 * Tests for WorkspaceSwitcher component
 *
 * Tests component rendering, workspace selection, and UI interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WorkspaceSwitcher } from '../components/WorkspaceSwitcher';
import { TenantContext } from '../components/TenantProvider';
import * as api from '../api';
import type { TenantContextValue } from '../types';
import {
  mockTenant,
  mockTenants,
  mockFreeTenant,
  createLocalStorageMock,
} from './fixtures';

// Mock the API module
vi.mock('../api');

const mockedApi = vi.mocked(api);

// Create a wrapper with QueryClientProvider and TenantContext for testing
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

describe('WorkspaceSwitcher', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    mockedApi.getMyTenants.mockResolvedValue(mockTenants);
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  // ===========================================================================
  // Loading State Tests
  // ===========================================================================

  describe('Loading State', () => {
    it('should display loading skeleton when loading', async () => {
      mockedApi.getMyTenants.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTenants), 100))
      );
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      // Should show loading skeleton with animate-pulse class
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('should not display switcher button when loading', async () => {
      mockedApi.getMyTenants.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTenants), 100))
      );
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      // Should not have any workspace button visible
      expect(screen.queryByText(mockTenant.name)).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Basic Rendering Tests
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('should display current workspace name in button', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });
    });

    it('should display first letter of workspace name when no logo', async () => {
      const tenantWithoutLogo = { ...mockTenant, logoUrl: undefined };
      const contextValue = createMockContextValue({ tenant: tenantWithoutLogo });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        // The first letter should be uppercase
        expect(screen.getByText('M')).toBeInTheDocument(); // M for "Main Workspace"
      });
    });

    it('should display workspace logo when available', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        const logo = screen.getByAltText(mockTenant.name);
        expect(logo).toHaveAttribute('src', mockTenant.logoUrl);
      });
    });

    it('should apply custom className', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher className="custom-class" />
        </Wrapper>
      );

      await waitFor(() => {
        const container = screen.getByText(mockTenant.name).closest('.relative');
        expect(container).toHaveClass('custom-class');
      });
    });
  });

  // ===========================================================================
  // Dropdown Toggle Tests
  // ===========================================================================

  describe('Dropdown Toggle', () => {
    it('should open dropdown when button is clicked', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Workspaces')).toBeInTheDocument();
    });

    it('should close dropdown when clicking outside', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      // Open dropdown
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Workspaces')).toBeInTheDocument();

      // Click outside (the overlay div)
      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay!);

      await waitFor(() => {
        expect(screen.queryByText('Workspaces')).not.toBeInTheDocument();
      });
    });

    it('should toggle dropdown state on button click', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      // Open
      fireEvent.click(button);
      expect(screen.getByText('Workspaces')).toBeInTheDocument();

      // Close
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByText('Workspaces')).not.toBeInTheDocument();
      });
    });

    it('should rotate chevron icon when dropdown is open', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      const svg = document.querySelector('svg');
      expect(svg).not.toHaveClass('rotate-180');

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(svg).toHaveClass('rotate-180');
      });
    });
  });

  // ===========================================================================
  // Workspace List Tests
  // ===========================================================================

  describe('Workspace List', () => {
    it('should display all workspaces in dropdown', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        // Use getAllByText since the current workspace name appears in both button and dropdown
        expect(screen.getAllByText(mockTenant.name).length).toBeGreaterThan(0);
      });

      fireEvent.click(screen.getByRole('button'));

      // Wait for workspaces to appear - use getAllByText for workspaces that may appear multiple times
      await waitFor(() => {
        mockTenants.forEach((tenant) => {
          const elements = screen.getAllByText(tenant.name);
          expect(elements.length).toBeGreaterThan(0);
        });
      });
    });

    it('should display plan name for each workspace', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getAllByText(mockTenant.name).length).toBeGreaterThan(0);
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        // Check for plan names (capitalized) - may appear multiple times
        expect(screen.getAllByText('pro plan').length).toBeGreaterThan(0);
        expect(screen.getAllByText('free plan').length).toBeGreaterThan(0);
      });
    });

    it('should highlight current workspace in dropdown', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        // Find the workspace item with the active style
        const workspaceItems = document.querySelectorAll('[class*="bg-blue-50"]');
        expect(workspaceItems.length).toBeGreaterThan(0);
      });
    });

    it('should display checkmark for current workspace', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        // Check for checkmark SVG (using path data)
        const checkmarks = document.querySelectorAll('[fill="currentColor"]');
        expect(checkmarks.length).toBeGreaterThan(0);
      });
    });
  });

  // ===========================================================================
  // Workspace Selection Tests
  // ===========================================================================

  describe('Workspace Selection', () => {
    it('should call setTenant when selecting a different workspace', async () => {
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(mockFreeTenant.name)).toBeInTheDocument();
      });

      // Click on a different workspace
      fireEvent.click(screen.getByText(mockFreeTenant.name));

      expect(setTenant).toHaveBeenCalledWith(mockFreeTenant);
    });

    it('should store tenant ID in localStorage when selecting', async () => {
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(mockFreeTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(mockFreeTenant.name));

      expect(localStorageMock.getItem('currentTenantId')).toBe(mockFreeTenant.id);
    });

    it('should close dropdown after selecting workspace', async () => {
      const setTenant = vi.fn();
      const contextValue = createMockContextValue({ setTenant });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText(mockFreeTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(mockFreeTenant.name));

      await waitFor(() => {
        expect(screen.queryByText('Workspaces')).not.toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Create Workspace Button Tests
  // ===========================================================================

  describe('Create Workspace Button', () => {
    it('should display "Create workspace" button in dropdown', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Create workspace')).toBeInTheDocument();
      });
    });

    it('should close dropdown when create workspace is clicked', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Create workspace')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create workspace'));

      await waitFor(() => {
        expect(screen.queryByText('Workspaces')).not.toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Workspace Logo Display Tests
  // ===========================================================================

  describe('Workspace Logo Display', () => {
    it('should display logo image when workspace has logoUrl', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const logos = screen.getAllByRole('img');
        // Should have at least one logo (the one in the button and in the dropdown)
        expect(logos.length).toBeGreaterThan(0);
      });
    });

    it('should display initial letter fallback when no logoUrl', async () => {
      const tenantWithoutLogo = { ...mockTenant, logoUrl: undefined };
      mockedApi.getMyTenants.mockResolvedValue([tenantWithoutLogo, mockFreeTenant]);
      const contextValue = createMockContextValue({ tenant: tenantWithoutLogo });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(tenantWithoutLogo.name)).toBeInTheDocument();
      });

      // Check for initial letter (uppercase first letter of workspace name)
      expect(screen.getByText('M')).toBeInTheDocument(); // M for "Main Workspace"
    });
  });

  // ===========================================================================
  // Edge Cases Tests
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty workspaces list', async () => {
      mockedApi.getMyTenants.mockResolvedValue([]);
      const contextValue = createMockContextValue({ tenant: null });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      // Should still render without crashing
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should handle null current workspace', async () => {
      const contextValue = createMockContextValue({ tenant: null });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      // Should not crash and render button
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should truncate long workspace names', async () => {
      const longNameTenant = {
        ...mockTenant,
        name: 'This is a very long workspace name that should be truncated',
      };
      mockedApi.getMyTenants.mockResolvedValue([longNameTenant]);
      const contextValue = createMockContextValue({ tenant: longNameTenant });
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        const nameElement = screen.getByText(longNameTenant.name);
        expect(nameElement).toHaveClass('truncate');
      });
    });

    it('should handle rapid dropdown toggle clicks', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should end up in a stable state (open after odd number of clicks)
      await waitFor(() => {
        expect(screen.getByText('Workspaces')).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Styling Tests
  // ===========================================================================

  describe('Styling', () => {
    it('should apply correct button styling', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('flex', 'items-center', 'gap-2');
      });
    });

    it('should apply correct dropdown styling', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const dropdown = screen.getByText('Workspaces').parentElement?.parentElement;
        expect(dropdown).toHaveClass('absolute', 'bg-white', 'border', 'rounded-lg', 'shadow-lg');
      });
    });

    it('should apply active state styling to current workspace', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const activeWorkspace = document.querySelector('.bg-blue-50');
        expect(activeWorkspace).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have accessible button with text', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(mockTenant.name);
      });
    });

    it('should have correct alt text for workspace logos', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        const logo = screen.getByAltText(mockTenant.name);
        expect(logo).toBeInTheDocument();
      });
    });

    it('should be keyboard navigable', async () => {
      const contextValue = createMockContextValue();
      const Wrapper = createWrapper(contextValue);

      render(
        <Wrapper>
          <WorkspaceSwitcher />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
      });

      const button = screen.getByRole('button');

      // Focus and activate with keyboard
      button.focus();
      expect(document.activeElement).toBe(button);

      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Workspaces')).toBeInTheDocument();
      });
    });
  });
});
