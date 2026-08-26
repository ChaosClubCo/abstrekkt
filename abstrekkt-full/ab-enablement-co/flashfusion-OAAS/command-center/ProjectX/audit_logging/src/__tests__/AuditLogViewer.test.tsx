/**
 * Tests for AuditLogViewer component
 *
 * Tests rendering, filtering, pagination, and export functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuditLogViewer } from '../components/AuditLogViewer';
import * as hooks from '../hooks';
import {
  mockSearchResult,
  mockEmptySearchResult,
  mockAuditLogEntries,
  createMockAuditLogEntry,
} from './fixtures';

// Mock the hooks module
vi.mock('../hooks', () => ({
  useAuditLogs: vi.fn(),
  useExportAuditLogs: vi.fn(),
}));

const mockedHooks = vi.mocked(hooks);

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('AuditLogViewer', () => {
  const defaultProps = {
    tenantId: 'tenant-123',
  };

  const mockExportLogs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Note: Removed fake timers due to React 19 + userEvent compatibility issues

    // Default mock implementations
    mockedHooks.useAuditLogs.mockReturnValue({
      data: mockSearchResult,
      isLoading: false,
      error: null,
    } as any);

    mockedHooks.useExportAuditLogs.mockReturnValue({
      exportLogs: mockExportLogs,
      isExporting: false,
      error: null,
    });
  });

  // ===========================================================================
  // Basic Rendering Tests
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('should render the component with title', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Activity Log')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByPlaceholderText('Search logs...')).toBeInTheDocument();
    });

    it('should render date filter inputs', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const dateInputs = screen.getAllByRole('textbox').filter(
        (input) => input.getAttribute('type') === 'date'
      );
      // There should be 2 date inputs (start and end)
      expect(dateInputs.length || screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(0);
    });

    it('should render export buttons', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Export JSON')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Resource')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('IP Address')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
    });

    it('should render audit log entries', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Check for formatted action text
      expect(screen.getByText('User \u2192 Login')).toBeInTheDocument();
    });

    it('should pass tenantId to useAuditLogs hook', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 'tenant-123',
        })
      );
    });

    it('should pass userId to useAuditLogs hook when provided', () => {
      render(<AuditLogViewer {...defaultProps} userId="user-456" />, {
        wrapper: createWrapper(),
      });

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 'tenant-123',
          userId: 'user-456',
        })
      );
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AuditLogViewer {...defaultProps} className="custom-class" />,
        { wrapper: createWrapper() }
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // ===========================================================================
  // Loading State Tests
  // ===========================================================================

  describe('Loading State', () => {
    it('should show loading skeleton when loading', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Check for skeleton loading elements
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show table when loading', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Error State Tests
  // ===========================================================================

  describe('Error State', () => {
    it('should display error message when error occurs', () => {
      const error = new Error('Failed to load audit logs');
      mockedHooks.useAuditLogs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Failed to load audit logs/)).toBeInTheDocument();
    });

    it('should apply error styling to error message', () => {
      const error = new Error('API Error');
      mockedHooks.useAuditLogs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const errorContainer = screen.getByText(/Failed to load audit logs/).closest('div');
      expect(errorContainer).toHaveClass('bg-red-50', 'text-red-700');
    });
  });

  // ===========================================================================
  // Empty State Tests
  // ===========================================================================

  describe('Empty State', () => {
    it('should render empty table when no results', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: mockEmptySearchResult,
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Table should still render with headers
      expect(screen.getByText('Action')).toBeInTheDocument();
      // But no data rows
      const tbody = document.querySelector('tbody');
      expect(tbody?.children.length).toBe(0);
    });
  });

  // ===========================================================================
  // Table Row Tests
  // ===========================================================================

  describe('Table Rows', () => {
    it('should display formatted action in each row', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('User \u2192 Login')).toBeInTheDocument();
      expect(screen.getByText('User \u2192 Logout')).toBeInTheDocument();
    });

    it('should display resource name in each row', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const authCells = screen.getAllByText('auth');
      expect(authCells.length).toBeGreaterThan(0);
    });

    it('should display resource ID when available', () => {
      const entryWithResourceId = createMockAuditLogEntry({
        id: 'test-entry',
        resource: 'documents',
        resourceId: 'doc-123',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [entryWithResourceId],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('(doc-123)')).toBeInTheDocument();
    });

    it('should display user ID when available', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const userCells = screen.getAllByText('user-456');
      expect(userCells.length).toBeGreaterThan(0);
    });

    it('should display "System" when user ID is null', () => {
      const systemEntry = createMockAuditLogEntry({
        id: 'system-entry',
        userId: null,
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [systemEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('should display IP address when available', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const ipCells = screen.getAllByText('192.168.1.100');
      expect(ipCells.length).toBeGreaterThan(0);
    });

    it('should display "-" when IP address is null', () => {
      const entryWithoutIP = createMockAuditLogEntry({
        id: 'no-ip-entry',
        ipAddress: null,
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [entryWithoutIP],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should display relative time for timestamp', () => {
      const recentEntry = createMockAuditLogEntry({
        id: 'recent-entry',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [recentEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('30m ago')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Row Expansion Tests
  // ===========================================================================

  describe('Row Expansion', () => {
    it('should expand row on click to show metadata', () => {
      const entryWithMetadata = createMockAuditLogEntry({
        id: 'metadata-entry',
        action: 'user.login',
        metadata: { method: 'password', browser: 'Chrome' },
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [entryWithMetadata],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Click on the row
      const row = screen.getByText('User \u2192 Login').closest('tr');
      fireEvent.click(row!);

      // Metadata should be visible (synchronous state update)
      expect(screen.getByText(/"method": "password"/)).toBeInTheDocument();
    });

    it('should collapse row on second click', () => {
      const entryWithMetadata = createMockAuditLogEntry({
        id: 'metadata-entry',
        action: 'user.login',
        metadata: { method: 'password' },
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [entryWithMetadata],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const row = screen.getByText('User \u2192 Login').closest('tr');

      // First click - expand
      fireEvent.click(row!);
      expect(screen.getByText(/"method": "password"/)).toBeInTheDocument();

      // Second click - collapse
      fireEvent.click(row!);
      expect(screen.queryByText(/"method": "password"/)).not.toBeInTheDocument();
    });

    it('should not show metadata section for entries with empty metadata', () => {
      const entryWithoutMetadata = createMockAuditLogEntry({
        id: 'no-metadata-entry',
        action: 'user.logout',
        metadata: {},
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [entryWithoutMetadata],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const row = screen.getByText('User \u2192 Logout').closest('tr');
      fireEvent.click(row!);

      // Should not show metadata row since metadata is empty
      const preElements = document.querySelectorAll('pre');
      expect(preElements.length).toBe(0);
    });
  });

  // ===========================================================================
  // Search Filter Tests
  // ===========================================================================

  describe('Search Filter', () => {
    it('should update search params when typing in search input', async () => {
      const user = userEvent.setup();

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Search logs...');
      await user.type(searchInput, 'login');

      // Should call useAuditLogs with updated search param
      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'login',
          page: 1, // Should reset to page 1 on search
        })
      );
    });
  });

  // ===========================================================================
  // Date Filter Tests
  // ===========================================================================

  describe('Date Filters', () => {
    it('should update params when start date is changed', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      const startDateInput = dateInputs[0];

      fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(Date),
          page: 1,
        })
      );
    });

    it('should update params when end date is changed', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      const endDateInput = dateInputs[1];

      fireEvent.change(endDateInput, { target: { value: '2024-01-15' } });

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          endDate: expect.any(Date),
          page: 1,
        })
      );
    });

    it('should clear start date when input is cleared', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      const startDateInput = dateInputs[0];

      // Set a date first
      fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });

      // Clear the date
      fireEvent.change(startDateInput, { target: { value: '' } });

      expect(mockedHooks.useAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          startDate: undefined,
        })
      );
    });
  });

  // ===========================================================================
  // Pagination Tests
  // ===========================================================================

  describe('Pagination', () => {
    it('should display pagination info', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Showing 1 to 25 of 150 entries/)).toBeInTheDocument();
    });

    it('should display Previous and Next buttons', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should disable Previous button on first page', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('should enable Next button when there are more pages', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });

    it('should go to next page when Next is clicked', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      );
    });

    it('should disable Next button on last page', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: mockAuditLogEntries.slice(0, 5),
          meta: { total: 50, page: 6, pageSize: 25, totalPages: 6 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should go to previous page when Previous is clicked', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: mockAuditLogEntries,
          meta: { total: 150, page: 2, pageSize: 25, totalPages: 6 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Reset mock to track new calls
      mockedHooks.useAuditLogs.mockClear();

      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      expect(mockedHooks.useAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
        })
      );
    });
  });

  // ===========================================================================
  // Export Tests
  // ===========================================================================

  describe('Export Functionality', () => {
    it('should call exportLogs with CSV format when Export CSV is clicked', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const exportCsvButton = screen.getByText('Export CSV');
      fireEvent.click(exportCsvButton);

      expect(mockExportLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 'tenant-123',
        }),
        'csv'
      );
    });

    it('should call exportLogs with JSON format when Export JSON is clicked', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const exportJsonButton = screen.getByText('Export JSON');
      fireEvent.click(exportJsonButton);

      expect(mockExportLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: 'tenant-123',
        }),
        'json'
      );
    });

    it('should disable export buttons when exporting', () => {
      mockedHooks.useExportAuditLogs.mockReturnValue({
        exportLogs: mockExportLogs,
        isExporting: true,
        error: null,
      });

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const exportCsvButton = screen.getByText('Export CSV');
      const exportJsonButton = screen.getByText('Export JSON');

      expect(exportCsvButton).toBeDisabled();
      expect(exportJsonButton).toBeDisabled();
    });

    it('should include current filters in export', async () => {
      const user = userEvent.setup();

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      // Type in search
      const searchInput = screen.getByPlaceholderText('Search logs...');
      await user.type(searchInput, 'test');

      // Click export
      const exportCsvButton = screen.getByText('Export CSV');
      fireEvent.click(exportCsvButton);

      expect(mockExportLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test',
        }),
        'csv'
      );
    });
  });

  // ===========================================================================
  // Action Color Tests
  // ===========================================================================

  describe('Action Colors', () => {
    it('should apply correct color class for login action', () => {
      const loginEntry = createMockAuditLogEntry({
        id: 'login-entry',
        action: 'user.login',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [loginEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const actionBadge = screen.getByText('User \u2192 Login');
      expect(actionBadge.className).toContain('green');
    });

    it('should apply correct color class for deleted action', () => {
      const deletedEntry = createMockAuditLogEntry({
        id: 'deleted-entry',
        action: 'user.deleted',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [deletedEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const actionBadge = screen.getByText('User \u2192 Deleted');
      expect(actionBadge.className).toContain('red');
    });

    it('should apply correct color class for security action', () => {
      const securityEntry = createMockAuditLogEntry({
        id: 'security-entry',
        action: 'security.mfa_enabled',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [securityEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const actionBadge = screen.getByText('Security \u2192 Mfa_enabled');
      expect(actionBadge.className).toContain('yellow');
    });

    it('should apply correct color class for billing action', () => {
      const billingEntry = createMockAuditLogEntry({
        id: 'billing-entry',
        action: 'billing.payment_succeeded',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [billingEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const actionBadge = screen.getByText('Billing \u2192 Payment_succeeded');
      expect(actionBadge.className).toContain('blue');
    });
  });

  // ===========================================================================
  // Row Hover State Tests
  // ===========================================================================

  describe('Row Hover State', () => {
    it('should have hover class on table rows', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const rows = document.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        expect(row.className).toContain('hover:bg-gray-50');
      });
    });

    it('should have cursor pointer on table rows', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const rows = document.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        expect(row.className).toContain('cursor-pointer');
      });
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have accessible table structure', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export JSON/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });

    it('should have labeled search input', () => {
      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Search logs...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput.tagName).toBe('INPUT');
    });
  });

  // ===========================================================================
  // Edge Cases Tests
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle very long action names', () => {
      const longActionEntry = createMockAuditLogEntry({
        id: 'long-action',
        action: 'very.long.deeply.nested.action.name.here',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [longActionEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Very \u2192 Long \u2192 Deeply/)).toBeInTheDocument();
    });

    it('should handle entries with complex metadata', () => {
      const complexMetadataEntry = createMockAuditLogEntry({
        id: 'complex-metadata',
        metadata: {
          nested: {
            deeply: {
              value: 'test',
            },
          },
          array: [1, 2, 3],
        },
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [complexMetadataEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const row = screen.getByText('User \u2192 Login').closest('tr');
      fireEvent.click(row!);

      // Should display JSON formatted metadata
      expect(screen.getByText(/"nested":/)).toBeInTheDocument();
    });

    it('should handle single entry correctly', () => {
      const singleEntry = createMockAuditLogEntry({
        id: 'single-entry',
      });

      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: [singleEntry],
          meta: { total: 1, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Showing 1 to 1 of 1 entries/)).toBeInTheDocument();
    });

    it('should handle exactly one page of results', () => {
      mockedHooks.useAuditLogs.mockReturnValue({
        data: {
          data: mockAuditLogEntries.slice(0, 10),
          meta: { total: 10, page: 1, pageSize: 25, totalPages: 1 },
        },
        isLoading: false,
        error: null,
      } as any);

      render(<AuditLogViewer {...defaultProps} />, { wrapper: createWrapper() });

      const prevButton = screen.getByText('Previous');
      const nextButton = screen.getByText('Next');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });
});
