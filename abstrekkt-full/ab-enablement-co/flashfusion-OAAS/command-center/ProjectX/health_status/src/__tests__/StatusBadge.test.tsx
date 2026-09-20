import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/StatusBadge';
import type { ServiceStatus, OverallStatus, Service } from '../types';

// Mock the useOverallStatus hook
vi.mock('../hooks', () => ({
  useOverallStatus: vi.fn(),
}));

import { useOverallStatus } from '../hooks';

const mockUseOverallStatus = vi.mocked(useOverallStatus);

// Helper to create mock status data
const createMockStatus = (status: ServiceStatus, services: Service[] = []): OverallStatus => ({
  status,
  message: `System is ${status}`,
  services,
  activeIncidents: 0,
  scheduledMaintenance: 0,
});

describe('StatusBadge component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // LOADING STATES (3 tests)
  // ============================================
  describe('loading state', () => {
    it('should render loading state with Loading... text', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isPending: true,
        isSuccess: false,
        status: 'pending',
        refetch: vi.fn(),
      } as any);

      render(<StatusBadge />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loading dot with animate-pulse class', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = render(<StatusBadge />);

      const dot = container.querySelector('.animate-pulse');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass('bg-gray-300');
    });

    it('should not show label in loading state when showLabel is false', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      render(<StatusBadge showLabel={false} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // STATUS INDICATORS - Healthy/Operational (3 tests)
  // ============================================
  describe('operational (healthy) status', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('operational'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should render operational status with green color and correct label', () => {
      const { container } = render(<StatusBadge />);

      expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
      const dot = container.querySelector('.bg-green-500');
      expect(dot).toBeInTheDocument();
    });

    it('should render as a link to /status page', () => {
      render(<StatusBadge />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/status');
    });

    it('should have hover transition styles for interactive feedback', () => {
      render(<StatusBadge />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:opacity-80');
      expect(link).toHaveClass('transition-opacity');
    });
  });

  // ============================================
  // STATUS INDICATORS - Degraded (2 tests)
  // ============================================
  describe('degraded status', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('degraded'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should render degraded status with yellow color', () => {
      const { container } = render(<StatusBadge />);

      expect(screen.getByText('Degraded Performance')).toBeInTheDocument();
      const dot = container.querySelector('.bg-yellow-500');
      expect(dot).toBeInTheDocument();
    });

    it('should show correct degraded styling for all sizes', () => {
      const { container, rerender } = render(<StatusBadge size="sm" />);
      expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();

      rerender(<StatusBadge size="lg" />);
      expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
    });
  });

  // ============================================
  // STATUS INDICATORS - Down/Outage (3 tests)
  // ============================================
  describe('outage statuses (down)', () => {
    it('should render partial outage status with orange color', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('partial_outage'),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusBadge />);

      expect(screen.getByText('Partial Outage')).toBeInTheDocument();
      const dot = container.querySelector('.bg-orange-500');
      expect(dot).toBeInTheDocument();
    });

    it('should render major outage status with red color', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('major_outage'),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusBadge />);

      expect(screen.getByText('Major Outage')).toBeInTheDocument();
      const dot = container.querySelector('.bg-red-500');
      expect(dot).toBeInTheDocument();
    });

    it('should render maintenance status with blue color', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('maintenance'),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusBadge />);

      expect(screen.getByText('Under Maintenance')).toBeInTheDocument();
      const dot = container.querySelector('.bg-blue-500');
      expect(dot).toBeInTheDocument();
    });
  });

  // ============================================
  // SIZE VARIANTS (3 tests)
  // ============================================
  describe('size variants', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('operational'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should render small size correctly', () => {
      const { container } = render(<StatusBadge size="sm" />);

      const dot = container.querySelector('.w-2.h-2');
      expect(dot).toBeInTheDocument();
      expect(screen.getByText('All Systems Operational')).toHaveClass('text-xs');
    });

    it('should render medium size correctly (default)', () => {
      const { container } = render(<StatusBadge />);

      const dot = container.querySelector('.w-3.h-3');
      expect(dot).toBeInTheDocument();
      expect(screen.getByText('All Systems Operational')).toHaveClass('text-sm');
    });

    it('should render large size correctly', () => {
      const { container } = render(<StatusBadge size="lg" />);

      const dot = container.querySelector('.w-4.h-4');
      expect(dot).toBeInTheDocument();
      expect(screen.getByText('All Systems Operational')).toHaveClass('text-base');
    });
  });

  // ============================================
  // SHOW LABEL PROP (3 tests)
  // ============================================
  describe('showLabel prop', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('operational'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should show label by default', () => {
      render(<StatusBadge />);

      expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
    });

    it('should hide label when showLabel is false', () => {
      render(<StatusBadge showLabel={false} />);

      expect(screen.queryByText('All Systems Operational')).not.toBeInTheDocument();
    });

    it('should still render the status dot when label is hidden', () => {
      const { container } = render(<StatusBadge showLabel={false} />);

      const dot = container.querySelector('.bg-green-500');
      expect(dot).toBeInTheDocument();
    });
  });

  // ============================================
  // CUSTOM CLASSNAME (2 tests)
  // ============================================
  describe('className prop', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('operational'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should apply custom className', () => {
      render(<StatusBadge className="custom-class" />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<StatusBadge className="my-custom-class" />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('inline-flex');
      expect(link).toHaveClass('items-center');
      expect(link).toHaveClass('my-custom-class');
    });
  });

  // ============================================
  // ERROR HANDLING / FALLBACK (3 tests)
  // ============================================
  describe('error handling and fallback behavior', () => {
    it('should default to operational when status data is null', () => {
      mockUseOverallStatus.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusBadge />);

      expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
      const dot = container.querySelector('.bg-green-500');
      expect(dot).toBeInTheDocument();
    });

    it('should default to operational when status data is undefined', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any);

      render(<StatusBadge />);

      expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
    });

    it('should handle error state gracefully and show default', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        isError: true,
      } as any);

      render(<StatusBadge />);

      // Should still render with default operational state
      expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
    });
  });

  // ============================================
  // ALL STATUS COLORS MAPPING (parameterized test)
  // ============================================
  describe('all status colors mapping', () => {
    const statusColorMap: [ServiceStatus, string, string][] = [
      ['operational', 'bg-green-500', 'All Systems Operational'],
      ['degraded', 'bg-yellow-500', 'Degraded Performance'],
      ['partial_outage', 'bg-orange-500', 'Partial Outage'],
      ['major_outage', 'bg-red-500', 'Major Outage'],
      ['maintenance', 'bg-blue-500', 'Under Maintenance'],
    ];

    it.each(statusColorMap)(
      'should render %s status with correct color and label',
      (status, expectedColor, expectedLabel) => {
        mockUseOverallStatus.mockReturnValue({
          data: createMockStatus(status),
          isLoading: false,
          error: null,
        } as any);

        const { container } = render(<StatusBadge />);

        expect(screen.getByText(expectedLabel)).toBeInTheDocument();
        const dot = container.querySelector(`.${expectedColor}`);
        expect(dot).toBeInTheDocument();
      }
    );
  });

  // ============================================
  // ACCESSIBILITY (2 tests)
  // ============================================
  describe('accessibility', () => {
    beforeEach(() => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('operational'),
        isLoading: false,
        error: null,
      } as any);
    });

    it('should render as an accessible link', () => {
      render(<StatusBadge />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should have visible status text for screen readers', () => {
      render(<StatusBadge />);

      expect(screen.getByText('All Systems Operational')).toBeVisible();
    });
  });

  // ============================================
  // COMBINED PROPS (2 tests)
  // ============================================
  describe('combined props', () => {
    it('should handle multiple props together', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('degraded'),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(
        <StatusBadge size="lg" showLabel={true} className="combined-test" />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('combined-test');
      expect(screen.getByText('Degraded Performance')).toHaveClass('text-base');
      const dot = container.querySelector('.w-4.h-4');
      expect(dot).toBeInTheDocument();
    });

    it('should handle large size with hidden label', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockStatus('major_outage'),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusBadge size="lg" showLabel={false} />);

      expect(screen.queryByText('Major Outage')).not.toBeInTheDocument();
      const dot = container.querySelector('.w-4.h-4');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass('bg-red-500');
    });
  });
});
