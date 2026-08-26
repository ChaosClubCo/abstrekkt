import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as api from '../api';
import {
  useOverallStatus,
  useServices,
  useService,
  useIncidents,
  useIncident,
  useMaintenance,
  useUptimeHistory,
  useSubscribe,
  useHealthCheck,
  useSubscribers,
} from '../hooks';
import type {
  OverallStatus,
  Service,
  Incident,
  MaintenanceWindow,
  UptimeData,
  Subscriber,
  HealthCheckResult,
} from '../types';

// Mock the API module
vi.mock('../api');

const mockedApi = vi.mocked(api);

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

const createMockOverallStatus = (): OverallStatus => ({
  status: 'operational',
  message: 'All systems operational',
  services: [createMockService()],
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
  updates: [],
  ...overrides,
});

const createMockMaintenance = (
  overrides: Partial<MaintenanceWindow> = {}
): MaintenanceWindow => ({
  id: 'maintenance-1',
  title: 'Database Maintenance',
  description: 'Regular maintenance',
  affectedServices: ['service-1'],
  scheduledStart: new Date().toISOString(),
  scheduledEnd: new Date().toISOString(),
  status: 'scheduled',
  ...overrides,
});

const createMockUptimeData = (): UptimeData[] => [
  { date: '2024-01-01', uptime: 99.99, incidents: 0 },
  { date: '2024-01-02', uptime: 99.95, incidents: 1 },
];

const createMockSubscriber = (): Subscriber => ({
  id: 'subscriber-1',
  email: 'test@example.com',
  services: [],
  createdAt: new Date().toISOString(),
  confirmed: true,
});

const createMockHealthCheckResult = (): HealthCheckResult[] => [
  {
    serviceId: 'service-1',
    healthy: true,
    responseTime: 45,
    timestamp: new Date().toISOString(),
  },
];

// Helper to create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('health_status hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useOverallStatus', () => {
    it('should fetch overall status on mount', async () => {
      const mockStatus = createMockOverallStatus();
      mockedApi.getOverallStatus.mockResolvedValue(mockStatus);

      const { result } = renderHook(() => useOverallStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getOverallStatus).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockStatus);
    });

    it('should return loading state initially', () => {
      mockedApi.getOverallStatus.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useOverallStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to fetch status');
      mockedApi.getOverallStatus.mockRejectedValue(error);

      const { result } = renderHook(() => useOverallStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useServices', () => {
    it('should fetch services list', async () => {
      const mockServices = [createMockService(), createMockService({ id: '2', name: 'Web App' })];
      mockedApi.getServices.mockResolvedValue(mockServices);

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.services).toEqual(mockServices);
    });

    it('should return empty array when no services', async () => {
      mockedApi.getServices.mockResolvedValue([]);

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.services).toEqual([]);
    });

    it('should expose updateServiceStatus function', async () => {
      mockedApi.getServices.mockResolvedValue([createMockService()]);
      mockedApi.updateServiceStatus.mockResolvedValue(
        createMockService({ status: 'degraded' })
      );

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.updateServiceStatus).toBe('function');
    });

    it('should call updateServiceStatus API when updating', async () => {
      mockedApi.getServices.mockResolvedValue([createMockService()]);
      mockedApi.updateServiceStatus.mockResolvedValue(
        createMockService({ status: 'degraded' })
      );

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.updateServiceStatus('service-1', 'degraded');
      });

      expect(mockedApi.updateServiceStatus).toHaveBeenCalledWith('service-1', 'degraded');
    });

    it('should expose refetch function', async () => {
      mockedApi.getServices.mockResolvedValue([createMockService()]);

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should track updating state', async () => {
      mockedApi.getServices.mockResolvedValue([createMockService()]);

      const { result } = renderHook(() => useServices(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('useService', () => {
    it('should fetch single service by ID', async () => {
      const mockService = createMockService();
      mockedApi.getService.mockResolvedValue(mockService);

      const { result } = renderHook(() => useService('service-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getService).toHaveBeenCalledWith('service-1');
      expect(result.current.data).toEqual(mockService);
    });

    it('should not fetch when serviceId is empty', async () => {
      const { result } = renderHook(() => useService(''), {
        wrapper: createWrapper(),
      });

      // Query should be disabled
      expect(result.current.isFetching).toBe(false);
      expect(mockedApi.getService).not.toHaveBeenCalled();
    });
  });

  describe('useIncidents', () => {
    it('should fetch incidents without filter', async () => {
      const mockIncidents = [createMockIncident()];
      mockedApi.getIncidents.mockResolvedValue(mockIncidents);

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockedApi.getIncidents).toHaveBeenCalledWith({ status: undefined });
      expect(result.current.incidents).toEqual(mockIncidents);
    });

    it('should fetch active incidents when status is active', async () => {
      mockedApi.getIncidents.mockResolvedValue([createMockIncident()]);

      renderHook(() => useIncidents('active'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getIncidents).toHaveBeenCalledWith({ status: 'active' })
      );
    });

    it('should fetch resolved incidents when status is resolved', async () => {
      mockedApi.getIncidents.mockResolvedValue([
        createMockIncident({ status: 'resolved' }),
      ]);

      renderHook(() => useIncidents('resolved'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getIncidents).toHaveBeenCalledWith({ status: 'resolved' })
      );
    });

    it('should expose createIncident function', async () => {
      mockedApi.getIncidents.mockResolvedValue([]);
      mockedApi.createIncident.mockResolvedValue(createMockIncident());

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.createIncident).toBe('function');
    });

    it('should call createIncident API', async () => {
      mockedApi.getIncidents.mockResolvedValue([]);
      mockedApi.createIncident.mockResolvedValue(createMockIncident());

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const input = {
        title: 'New Incident',
        severity: 'major' as const,
        affectedServices: ['service-1'],
        message: 'Something went wrong',
      };

      await act(async () => {
        await result.current.createIncident(input);
      });

      expect(mockedApi.createIncident).toHaveBeenCalledWith(input);
    });

    it('should expose updateIncident function', async () => {
      mockedApi.getIncidents.mockResolvedValue([]);
      mockedApi.updateIncident.mockResolvedValue(createMockIncident());

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.updateIncident).toBe('function');
    });

    it('should expose resolveIncident function', async () => {
      mockedApi.getIncidents.mockResolvedValue([]);
      mockedApi.resolveIncident.mockResolvedValue(
        createMockIncident({ status: 'resolved' })
      );

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.resolveIncident).toBe('function');
    });

    it('should track creating state', async () => {
      mockedApi.getIncidents.mockResolvedValue([]);

      const { result } = renderHook(() => useIncidents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isCreating).toBe(false);
    });
  });

  describe('useIncident', () => {
    it('should fetch single incident by ID', async () => {
      const mockIncident = createMockIncident();
      mockedApi.getIncident.mockResolvedValue(mockIncident);

      const { result } = renderHook(() => useIncident('incident-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getIncident).toHaveBeenCalledWith('incident-1');
      expect(result.current.data).toEqual(mockIncident);
    });

    it('should not fetch when incidentId is empty', async () => {
      const { result } = renderHook(() => useIncident(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedApi.getIncident).not.toHaveBeenCalled();
    });
  });

  describe('useMaintenance', () => {
    it('should fetch maintenance windows without filter', async () => {
      const mockWindows = [createMockMaintenance()];
      mockedApi.getMaintenanceWindows.mockResolvedValue(mockWindows);

      const { result } = renderHook(() => useMaintenance(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockedApi.getMaintenanceWindows).toHaveBeenCalledWith({ status: undefined });
      expect(result.current.windows).toEqual(mockWindows);
    });

    it('should fetch scheduled maintenance when status is scheduled', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([createMockMaintenance()]);

      renderHook(() => useMaintenance('scheduled'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getMaintenanceWindows).toHaveBeenCalledWith({ status: 'scheduled' })
      );
    });

    it('should fetch in-progress maintenance', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([
        createMockMaintenance({ status: 'in_progress' }),
      ]);

      renderHook(() => useMaintenance('in_progress'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getMaintenanceWindows).toHaveBeenCalledWith({
          status: 'in_progress',
        })
      );
    });

    it('should fetch completed maintenance', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([
        createMockMaintenance({ status: 'completed' }),
      ]);

      renderHook(() => useMaintenance('completed'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getMaintenanceWindows).toHaveBeenCalledWith({
          status: 'completed',
        })
      );
    });

    it('should expose createMaintenance function', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([]);
      mockedApi.createMaintenance.mockResolvedValue(createMockMaintenance());

      const { result } = renderHook(() => useMaintenance(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.createMaintenance).toBe('function');
    });

    it('should expose updateMaintenance function', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([]);
      mockedApi.updateMaintenance.mockResolvedValue(createMockMaintenance());

      const { result } = renderHook(() => useMaintenance(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.updateMaintenance).toBe('function');
    });

    it('should expose deleteMaintenance function', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([]);
      mockedApi.deleteMaintenance.mockResolvedValue(undefined);

      const { result } = renderHook(() => useMaintenance(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(typeof result.current.deleteMaintenance).toBe('function');
    });

    it('should call deleteMaintenance API', async () => {
      mockedApi.getMaintenanceWindows.mockResolvedValue([createMockMaintenance()]);
      mockedApi.deleteMaintenance.mockResolvedValue(undefined);

      const { result } = renderHook(() => useMaintenance(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.deleteMaintenance('maintenance-1');
      });

      expect(mockedApi.deleteMaintenance).toHaveBeenCalledWith('maintenance-1');
    });
  });

  describe('useUptimeHistory', () => {
    it('should fetch uptime history with default 90 days', async () => {
      const mockUptime = createMockUptimeData();
      mockedApi.getUptimeHistory.mockResolvedValue(mockUptime);

      const { result } = renderHook(() => useUptimeHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getUptimeHistory).toHaveBeenCalledWith({
        serviceId: undefined,
        days: 90,
      });
      expect(result.current.data).toEqual(mockUptime);
    });

    it('should fetch uptime history for specific service', async () => {
      mockedApi.getUptimeHistory.mockResolvedValue(createMockUptimeData());

      renderHook(() => useUptimeHistory('service-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getUptimeHistory).toHaveBeenCalledWith({
          serviceId: 'service-1',
          days: 90,
        })
      );
    });

    it('should fetch uptime history with custom days', async () => {
      mockedApi.getUptimeHistory.mockResolvedValue(createMockUptimeData());

      renderHook(() => useUptimeHistory(undefined, 30), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getUptimeHistory).toHaveBeenCalledWith({
          serviceId: undefined,
          days: 30,
        })
      );
    });

    it('should fetch uptime history with service and custom days', async () => {
      mockedApi.getUptimeHistory.mockResolvedValue(createMockUptimeData());

      renderHook(() => useUptimeHistory('service-1', 7), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockedApi.getUptimeHistory).toHaveBeenCalledWith({
          serviceId: 'service-1',
          days: 7,
        })
      );
    });
  });

  describe('useSubscribe', () => {
    it('should expose subscribe function', async () => {
      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.subscribe).toBe('function');
    });

    it('should call subscribe API with email', async () => {
      mockedApi.subscribe.mockResolvedValue(createMockSubscriber());

      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.subscribe('test@example.com');
      });

      expect(mockedApi.subscribe).toHaveBeenCalledWith('test@example.com', undefined);
    });

    it('should call subscribe API with email and services', async () => {
      mockedApi.subscribe.mockResolvedValue(createMockSubscriber());

      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.subscribe('test@example.com', ['service-1', 'service-2']);
      });

      expect(mockedApi.subscribe).toHaveBeenCalledWith('test@example.com', [
        'service-1',
        'service-2',
      ]);
    });

    it('should track subscribing state', async () => {
      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubscribing).toBe(false);
    });

    it('should track success state', async () => {
      mockedApi.subscribe.mockResolvedValue(createMockSubscriber());

      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSuccess).toBe(false);

      await act(async () => {
        await result.current.subscribe('test@example.com');
      });

      expect(result.current.isSuccess).toBe(true);
    });

    it('should track error state', async () => {
      const error = new Error('Subscription failed');
      mockedApi.subscribe.mockRejectedValue(error);

      const { result } = renderHook(() => useSubscribe(), {
        wrapper: createWrapper(),
      });

      expect(result.current.error).toBeNull();

      try {
        await act(async () => {
          await result.current.subscribe('invalid-email');
        });
      } catch {
        // Expected error
      }

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useHealthCheck', () => {
    it('should expose runHealthCheck function', async () => {
      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.runHealthCheck).toBe('function');
    });

    it('should call runHealthCheck API without serviceId', async () => {
      const mockResults = createMockHealthCheckResult();
      mockedApi.runHealthCheck.mockResolvedValue(mockResults);

      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.runHealthCheck();
      });

      expect(mockedApi.runHealthCheck).toHaveBeenCalledWith(undefined);
    });

    it('should call runHealthCheck API with serviceId', async () => {
      const mockResults = createMockHealthCheckResult();
      mockedApi.runHealthCheck.mockResolvedValue(mockResults);

      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.runHealthCheck('service-1');
      });

      expect(mockedApi.runHealthCheck).toHaveBeenCalledWith('service-1');
    });

    it('should track running state', async () => {
      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('should return results after running', async () => {
      const mockResults = createMockHealthCheckResult();
      mockedApi.runHealthCheck.mockResolvedValue(mockResults);

      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.runHealthCheck();
      });

      expect(result.current.results).toEqual(mockResults);
    });

    it('should track error state', async () => {
      const error = new Error('Health check failed');
      mockedApi.runHealthCheck.mockRejectedValue(error);

      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      try {
        await act(async () => {
          await result.current.runHealthCheck();
        });
      } catch {
        // Expected error
      }

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useSubscribers', () => {
    it('should fetch subscribers list', async () => {
      const mockSubscribers = [createMockSubscriber()];
      mockedApi.getSubscribers.mockResolvedValue(mockSubscribers);

      const { result } = renderHook(() => useSubscribers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedApi.getSubscribers).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockSubscribers);
    });

    it('should return loading state initially', () => {
      mockedApi.getSubscribers.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSubscribers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch subscribers');
      mockedApi.getSubscribers.mockRejectedValue(error);

      const { result } = renderHook(() => useSubscribers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeTruthy();
    });
  });
});
