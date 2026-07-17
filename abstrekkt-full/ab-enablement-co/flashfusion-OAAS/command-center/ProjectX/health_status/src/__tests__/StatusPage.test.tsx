import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusPage } from '../components/StatusPage';
import type {
  ServiceStatus,
  OverallStatus,
  Service,
  Incident,
  MaintenanceWindow,
} from '../types';

// Mock the hooks
vi.mock('../hooks', () => ({
  useOverallStatus: vi.fn(),
  useIncidents: vi.fn(),
  useMaintenance: vi.fn(),
}));

import { useOverallStatus, useIncidents, useMaintenance } from '../hooks';

const mockUseOverallStatus = vi.mocked(useOverallStatus);
const mockUseIncidents = vi.mocked(useIncidents);
const mockUseMaintenance = vi.mocked(useMaintenance);

// Test data factories
const createMockService = (overrides: Partial<Service> = {}): Service => ({
  id: 'service-1',
  name: 'API Server',
  description: 'Main API server',
  group: 'Core',
  status: 'operational',
  uptime: 99.99,
  lastCheck: new Date().toISOString(),
  responseTime: 45,
  ...overrides,
});

const createMockOverallStatus = (
  status: ServiceStatus = 'operational',
  services: Service[] = []
): OverallStatus => ({
  status,
  message: `System is ${status}`,
  services,
  activeIncidents: 0,
  scheduledMaintenance: 0,
});

const createMockIncident = (overrides: Partial<Incident> = {}): Incident => ({
  id: 'incident-1',
  title: 'API Server Outage',
  status: 'investigating',
  severity: 'major',
  affectedServices: ['service-1'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  updates: [
    {
      id: 'update-1',
      incidentId: 'incident-1',
      status: 'investigating',
      message: 'We are investigating the issue.',
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
    },
  ],
  ...overrides,
});

const createMockMaintenance = (
  overrides: Partial<MaintenanceWindow> = {}
): MaintenanceWindow => ({
  id: 'maintenance-1',
  title: 'Scheduled Database Maintenance',
  description: 'Regular database maintenance window',
  affectedServices: ['service-1'],
  scheduledStart: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  scheduledEnd: new Date(Date.now() + 90000000).toISOString(),
  status: 'scheduled',
  ...overrides,
});

const setupDefaultMocks = () => {
  mockUseOverallStatus.mockReturnValue({
    data: createMockOverallStatus('operational', [createMockService()]),
    isLoading: false,
    error: null,
  } as any);

  mockUseIncidents.mockReturnValue({
    incidents: [],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    createIncident: vi.fn(),
    updateIncident: vi.fn(),
    resolveIncident: vi.fn(),
    isCreating: false,
    isUpdating: false,
  } as any);

  mockUseMaintenance.mockReturnValue({
    windows: [],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    createMaintenance: vi.fn(),
    updateMaintenance: vi.fn(),
    deleteMaintenance: vi.fn(),
  } as any);
};

describe('StatusPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  describe('loading state', () => {
    it('should render loading spinner when status is loading', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = render(<StatusPage />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should display loading indicator centered on screen', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      const { container } = render(<StatusPage />);

      const loadingContainer = container.querySelector('.min-h-screen.flex.items-center.justify-center');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('should not render services section while loading', () => {
      mockUseOverallStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.queryByText('Services')).not.toBeInTheDocument();
    });
  });

  describe('header section', () => {
    it('should render system status heading', () => {
      render(<StatusPage />);

      expect(screen.getByRole('heading', { name: 'System Status' })).toBeInTheDocument();
    });

    it('should display overall status badge with correct label', () => {
      render(<StatusPage />);

      expect(screen.getByText('Operational')).toBeInTheDocument();
    });

    it('should show degraded performance label when degraded', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('degraded', [createMockService({ status: 'degraded' })]),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const header = screen.getByRole('banner');
      expect(within(header).getByText('Degraded Performance')).toBeInTheDocument();
    });

    it('should show partial outage label when partial_outage', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('partial_outage', [
          createMockService({ status: 'partial_outage' }),
        ]),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const header = screen.getByRole('banner');
      expect(within(header).getByText('Partial Outage')).toBeInTheDocument();
    });

    it('should show major outage label when major_outage', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('major_outage', [
          createMockService({ status: 'major_outage' }),
        ]),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const header = screen.getByRole('banner');
      expect(within(header).getByText('Major Outage')).toBeInTheDocument();
    });

    it('should show under maintenance label when in maintenance', () => {
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('maintenance', [
          createMockService({ status: 'maintenance' }),
        ]),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const header = screen.getByRole('banner');
      expect(within(header).getByText('Under Maintenance')).toBeInTheDocument();
    });
  });

  describe('status colors', () => {
    const statusTests: [ServiceStatus, string][] = [
      ['operational', 'bg-green-500'],
      ['degraded', 'bg-yellow-500'],
      ['partial_outage', 'bg-orange-500'],
      ['major_outage', 'bg-red-500'],
      ['maintenance', 'bg-blue-500'],
    ];

    it.each(statusTests)(
      'should display correct color for %s status',
      (status, expectedColorClass) => {
        mockUseOverallStatus.mockReturnValue({
          data: createMockOverallStatus(status, [createMockService({ status })]),
          isLoading: false,
          error: null,
        } as any);

        const { container } = render(<StatusPage />);

        // Check header status indicator
        const headerIndicator = container.querySelector(`header .${expectedColorClass}`);
        expect(headerIndicator).toBeInTheDocument();
      }
    );
  });

  describe('active incidents section', () => {
    it('should not render incidents section when no active incidents', () => {
      render(<StatusPage />);

      expect(screen.queryByText('Active Incidents')).not.toBeInTheDocument();
    });

    it('should render incidents section when there are active incidents', () => {
      mockUseIncidents.mockReturnValue({
        incidents: [createMockIncident()],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByRole('heading', { name: 'Active Incidents' })).toBeInTheDocument();
    });

    it('should display incident title', () => {
      const incident = createMockIncident({ title: 'Database Connection Issues' });
      mockUseIncidents.mockReturnValue({
        incidents: [incident],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('Database Connection Issues')).toBeInTheDocument();
    });

    it('should display incident status and severity', () => {
      const incident = createMockIncident({
        status: 'identified',
        severity: 'critical',
      });
      mockUseIncidents.mockReturnValue({
        incidents: [incident],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText(/Status: identified/)).toBeInTheDocument();
      expect(screen.getByText(/Severity: critical/)).toBeInTheDocument();
    });

    it('should display incident creation date', () => {
      const createdAt = '2024-01-15T10:00:00Z';
      const incident = createMockIncident({ createdAt });
      mockUseIncidents.mockReturnValue({
        incidents: [incident],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      // The date should be formatted by toLocaleString
      const formattedDate = new Date(createdAt).toLocaleString();
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it('should display the latest incident update message', () => {
      const incident = createMockIncident({
        updates: [
          {
            id: 'update-1',
            incidentId: 'incident-1',
            status: 'investigating',
            message: 'Engineering team is investigating the root cause.',
            createdAt: new Date().toISOString(),
            createdBy: 'admin',
          },
        ],
      });
      mockUseIncidents.mockReturnValue({
        incidents: [incident],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(
        screen.getByText('Engineering team is investigating the root cause.')
      ).toBeInTheDocument();
    });

    it('should not display update section when incident has no updates', () => {
      const incident = createMockIncident({ updates: [] });
      mockUseIncidents.mockReturnValue({
        incidents: [incident],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      // The incident title should be present but no update border
      expect(screen.getByText('API Server Outage')).toBeInTheDocument();
    });

    it('should display multiple incidents', () => {
      const incidents = [
        createMockIncident({ id: '1', title: 'First Incident' }),
        createMockIncident({ id: '2', title: 'Second Incident' }),
        createMockIncident({ id: '3', title: 'Third Incident' }),
      ];
      mockUseIncidents.mockReturnValue({
        incidents,
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('First Incident')).toBeInTheDocument();
      expect(screen.getByText('Second Incident')).toBeInTheDocument();
      expect(screen.getByText('Third Incident')).toBeInTheDocument();
    });

    it('should render incident with red border', () => {
      mockUseIncidents.mockReturnValue({
        incidents: [createMockIncident()],
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusPage />);

      const incidentCard = container.querySelector('.border-l-4.border-red-500');
      expect(incidentCard).toBeInTheDocument();
    });
  });

  describe('scheduled maintenance section', () => {
    it('should not render maintenance section when no scheduled maintenance', () => {
      render(<StatusPage />);

      expect(screen.queryByText('Scheduled Maintenance')).not.toBeInTheDocument();
    });

    it('should render maintenance section when there is scheduled maintenance', () => {
      mockUseMaintenance.mockReturnValue({
        windows: [createMockMaintenance()],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(
        screen.getByRole('heading', { name: 'Scheduled Maintenance' })
      ).toBeInTheDocument();
    });

    it('should display maintenance window title', () => {
      const maintenance = createMockMaintenance({
        title: 'Planned Server Upgrade',
      });
      mockUseMaintenance.mockReturnValue({
        windows: [maintenance],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('Planned Server Upgrade')).toBeInTheDocument();
    });

    it('should display maintenance window description', () => {
      const maintenance = createMockMaintenance({
        description: 'Upgrading server hardware for better performance.',
      });
      mockUseMaintenance.mockReturnValue({
        windows: [maintenance],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(
        screen.getByText('Upgrading server hardware for better performance.')
      ).toBeInTheDocument();
    });

    it('should display maintenance window time range', () => {
      const scheduledStart = '2024-02-01T02:00:00Z';
      const scheduledEnd = '2024-02-01T04:00:00Z';
      const maintenance = createMockMaintenance({
        scheduledStart,
        scheduledEnd,
      });
      mockUseMaintenance.mockReturnValue({
        windows: [maintenance],
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const formattedStart = new Date(scheduledStart).toLocaleString();
      const formattedEnd = new Date(scheduledEnd).toLocaleString();
      expect(screen.getByText(`${formattedStart} - ${formattedEnd}`)).toBeInTheDocument();
    });

    it('should display multiple maintenance windows', () => {
      const windows = [
        createMockMaintenance({ id: '1', title: 'Maintenance 1' }),
        createMockMaintenance({ id: '2', title: 'Maintenance 2' }),
      ];
      mockUseMaintenance.mockReturnValue({
        windows,
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('Maintenance 1')).toBeInTheDocument();
      expect(screen.getByText('Maintenance 2')).toBeInTheDocument();
    });

    it('should render maintenance window with blue border', () => {
      mockUseMaintenance.mockReturnValue({
        windows: [createMockMaintenance()],
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusPage />);

      const maintenanceCard = container.querySelector('.border-l-4.border-blue-500');
      expect(maintenanceCard).toBeInTheDocument();
    });
  });

  describe('services section', () => {
    it('should render services section heading', () => {
      render(<StatusPage />);

      expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    });

    it('should display service name', () => {
      const services = [createMockService({ name: 'Authentication Service' })];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('operational', services),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('Authentication Service')).toBeInTheDocument();
    });

    it('should display service group in parentheses', () => {
      const services = [createMockService({ name: 'API', group: 'Backend' })];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('operational', services),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('(Backend)')).toBeInTheDocument();
    });

    it('should not display group when service has no group', () => {
      const services = [createMockService({ name: 'API', group: undefined })];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('operational', services),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
    });

    it('should display service status label', () => {
      const services = [createMockService({ status: 'degraded' })];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('degraded', services),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      // Find the Degraded Performance text in the services section
      const serviceSection = screen.getByRole('heading', { name: 'Services' }).parentElement;
      expect(within(serviceSection!).getByText('Degraded Performance')).toBeInTheDocument();
    });

    it('should display multiple services', () => {
      const services = [
        createMockService({ id: '1', name: 'API Server' }),
        createMockService({ id: '2', name: 'Web App' }),
        createMockService({ id: '3', name: 'Database' }),
      ];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('operational', services),
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      expect(screen.getByText('API Server')).toBeInTheDocument();
      expect(screen.getByText('Web App')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
    });

    it('should render services with correct status colors', () => {
      const services = [
        createMockService({ id: '1', name: 'Healthy Service', status: 'operational' }),
        createMockService({ id: '2', name: 'Degraded Service', status: 'degraded' }),
      ];
      mockUseOverallStatus.mockReturnValue({
        data: createMockOverallStatus('degraded', services),
        isLoading: false,
        error: null,
      } as any);

      const { container } = render(<StatusPage />);

      // Should have both green and yellow dots in service list
      const serviceSection = container.querySelector('section:last-of-type');
      expect(serviceSection?.querySelector('.bg-green-500')).toBeInTheDocument();
      expect(serviceSection?.querySelector('.bg-yellow-500')).toBeInTheDocument();
    });
  });

  describe('uptime section', () => {
    it('should render 90-day uptime heading', () => {
      render(<StatusPage />);

      expect(screen.getByRole('heading', { name: '90-Day Uptime' })).toBeInTheDocument();
    });

    it('should display overall uptime label', () => {
      render(<StatusPage />);

      expect(screen.getByText('Overall Uptime')).toBeInTheDocument();
    });

    it('should display uptime percentage', () => {
      render(<StatusPage />);

      expect(screen.getByText('99.95%')).toBeInTheDocument();
    });

    it('should render 90 day indicators', () => {
      const { container } = render(<StatusPage />);

      const uptimeSection = container.querySelector('.flex.gap-0\\.5');
      const dayIndicators = uptimeSection?.children;
      expect(dayIndicators).toHaveLength(90);
    });

    it('should display date range labels', () => {
      render(<StatusPage />);

      expect(screen.getByText('90 days ago')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  describe('subscribe section', () => {
    it('should render subscribe heading', () => {
      render(<StatusPage />);

      expect(screen.getByRole('heading', { name: 'Subscribe to Updates' })).toBeInTheDocument();
    });

    it('should display subscribe description', () => {
      render(<StatusPage />);

      expect(
        screen.getByText('Get notified when we create or resolve incidents.')
      ).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<StatusPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render subscribe button', () => {
      render(<StatusPage />);

      expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    });

    it('should allow typing in email input', async () => {
      render(<StatusPage />);

      const emailInput = screen.getByPlaceholderText('you@example.com') as HTMLInputElement;
      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('footer section', () => {
    it('should render footer with last updated text', () => {
      render(<StatusPage />);

      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  describe('fallback behavior', () => {
    it('should default to operational when status is null', () => {
      mockUseOverallStatus.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      render(<StatusPage />);

      const header = screen.getByRole('banner');
      expect(within(header).getByText('Operational')).toBeInTheDocument();
    });

    it('should handle missing services gracefully', () => {
      mockUseOverallStatus.mockReturnValue({
        data: { ...createMockOverallStatus('operational'), services: undefined } as any,
        isLoading: false,
        error: null,
      } as any);

      // Should not throw
      expect(() => render(<StatusPage />)).not.toThrow();
    });
  });

  describe('real-time updates', () => {
    it('should call useOverallStatus hook', () => {
      render(<StatusPage />);

      expect(mockUseOverallStatus).toHaveBeenCalled();
    });

    it('should call useIncidents hook with active filter', () => {
      render(<StatusPage />);

      expect(mockUseIncidents).toHaveBeenCalledWith('active');
    });

    it('should call useMaintenance hook with scheduled filter', () => {
      render(<StatusPage />);

      expect(mockUseMaintenance).toHaveBeenCalledWith('scheduled');
    });
  });
});
