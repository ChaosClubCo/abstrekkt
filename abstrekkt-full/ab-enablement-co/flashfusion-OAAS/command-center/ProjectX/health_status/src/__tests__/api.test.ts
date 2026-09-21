import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getOverallStatus,
  getServices,
  getService,
  getIncidents,
  getIncident,
  getMaintenanceWindows,
  getUptimeHistory,
  subscribe,
  unsubscribe,
  updateServiceStatus,
  createIncident,
  updateIncident,
  resolveIncident,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  runHealthCheck,
  getSubscribers,
} from '../api';
import type {
  Service,
  Incident,
  MaintenanceWindow,
  OverallStatus,
  UptimeData,
  Subscriber,
  HealthCheckResult,
} from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

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

describe('health_status API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getOverallStatus', () => {
    it('should fetch overall status from correct endpoint', async () => {
      const mockStatus = createMockOverallStatus();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      const result = await getOverallStatus();

      expect(mockFetch).toHaveBeenCalledWith('/api/status');
      expect(result).toEqual(mockStatus);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getOverallStatus()).rejects.toThrow('Failed to fetch status');
    });
  });

  describe('getServices', () => {
    it('should fetch services list from correct endpoint', async () => {
      const mockServices = [createMockService(), createMockService({ id: '2' })];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServices),
      });

      const result = await getServices();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/services');
      expect(result).toEqual(mockServices);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getServices()).rejects.toThrow('Failed to fetch services');
    });
  });

  describe('getService', () => {
    it('should fetch single service by ID', async () => {
      const mockService = createMockService();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockService),
      });

      const result = await getService('service-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/services/service-1');
      expect(result).toEqual(mockService);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getService('nonexistent')).rejects.toThrow('Failed to fetch service');
    });
  });

  describe('getIncidents', () => {
    it('should fetch incidents without options', async () => {
      const mockIncidents = [createMockIncident()];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIncidents),
      });

      const result = await getIncidents();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents?');
      expect(result).toEqual(mockIncidents);
    });

    it('should fetch active incidents with status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getIncidents({ status: 'active' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents?status=active');
    });

    it('should fetch resolved incidents with status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getIncidents({ status: 'resolved' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents?status=resolved');
    });

    it('should include limit parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getIncidents({ limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents?limit=10');
    });

    it('should include both status and limit parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getIncidents({ status: 'active', limit: 5 });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents?status=active&limit=5');
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getIncidents()).rejects.toThrow('Failed to fetch incidents');
    });
  });

  describe('getIncident', () => {
    it('should fetch single incident by ID', async () => {
      const mockIncident = createMockIncident();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIncident),
      });

      const result = await getIncident('incident-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/incidents/incident-1');
      expect(result).toEqual(mockIncident);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getIncident('nonexistent')).rejects.toThrow('Failed to fetch incident');
    });
  });

  describe('getMaintenanceWindows', () => {
    it('should fetch maintenance windows without options', async () => {
      const mockWindows = [createMockMaintenance()];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWindows),
      });

      const result = await getMaintenanceWindows();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/maintenance?');
      expect(result).toEqual(mockWindows);
    });

    it('should fetch scheduled maintenance with status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getMaintenanceWindows({ status: 'scheduled' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/maintenance?status=scheduled');
    });

    it('should fetch in_progress maintenance with status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getMaintenanceWindows({ status: 'in_progress' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/maintenance?status=in_progress');
    });

    it('should fetch completed maintenance with status filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getMaintenanceWindows({ status: 'completed' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/maintenance?status=completed');
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getMaintenanceWindows()).rejects.toThrow('Failed to fetch maintenance windows');
    });
  });

  describe('getUptimeHistory', () => {
    it('should fetch uptime history without options', async () => {
      const mockUptime: UptimeData[] = [
        { date: '2024-01-01', uptime: 99.99, incidents: 0 },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUptime),
      });

      const result = await getUptimeHistory();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/uptime?');
      expect(result).toEqual(mockUptime);
    });

    it('should include serviceId parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getUptimeHistory({ serviceId: 'service-1' });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/uptime?serviceId=service-1');
    });

    it('should include days parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getUptimeHistory({ days: 30 });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/uptime?days=30');
    });

    it('should include both serviceId and days parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getUptimeHistory({ serviceId: 'service-1', days: 7 });

      expect(mockFetch).toHaveBeenCalledWith('/api/status/uptime?serviceId=service-1&days=7');
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getUptimeHistory()).rejects.toThrow('Failed to fetch uptime history');
    });
  });

  describe('subscribe', () => {
    it('should subscribe with email only', async () => {
      const mockSubscriber = createMockSubscriber();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscriber),
      });

      const result = await subscribe('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', services: undefined }),
      });
      expect(result).toEqual(mockSubscriber);
    });

    it('should subscribe with email and services', async () => {
      const mockSubscriber = createMockSubscriber();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscriber),
      });

      await subscribe('test@example.com', ['service-1', 'service-2']);

      expect(mockFetch).toHaveBeenCalledWith('/api/status/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', services: ['service-1', 'service-2'] }),
      });
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(subscribe('test@example.com')).rejects.toThrow('Failed to subscribe');
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe with token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await unsubscribe('unsubscribe-token');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/subscribers/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'unsubscribe-token' }),
      });
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(unsubscribe('invalid-token')).rejects.toThrow('Failed to unsubscribe');
    });
  });

  describe('updateServiceStatus', () => {
    it('should update service status', async () => {
      const updatedService = createMockService({ status: 'degraded' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedService),
      });

      const result = await updateServiceStatus('service-1', 'degraded');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/services/service-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'degraded' }),
      });
      expect(result).toEqual(updatedService);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(updateServiceStatus('service-1', 'degraded')).rejects.toThrow(
        'Failed to update service status'
      );
    });
  });

  describe('createIncident', () => {
    it('should create incident with input', async () => {
      const mockIncident = createMockIncident();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIncident),
      });

      const input = {
        title: 'New Incident',
        severity: 'major' as const,
        affectedServices: ['service-1'],
        message: 'Something went wrong',
      };

      const result = await createIncident(input);

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockIncident);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        createIncident({
          title: 'Test',
          severity: 'minor',
          affectedServices: [],
          message: 'Test',
        })
      ).rejects.toThrow('Failed to create incident');
    });
  });

  describe('updateIncident', () => {
    it('should update incident with input', async () => {
      const updatedIncident = createMockIncident({ status: 'identified' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedIncident),
      });

      const input = {
        status: 'identified' as const,
        message: 'Issue identified',
      };

      const result = await updateIncident('incident-1', input);

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/incidents/incident-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(updatedIncident);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(updateIncident('incident-1', { status: 'identified' })).rejects.toThrow(
        'Failed to update incident'
      );
    });
  });

  describe('resolveIncident', () => {
    it('should resolve incident with message', async () => {
      const resolvedIncident = createMockIncident({ status: 'resolved' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(resolvedIncident),
      });

      const result = await resolveIncident('incident-1', 'Issue has been resolved');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/incidents/incident-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', message: 'Issue has been resolved' }),
      });
      expect(result).toEqual(resolvedIncident);
    });
  });

  describe('createMaintenance', () => {
    it('should create maintenance window', async () => {
      const mockMaintenance = createMockMaintenance();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMaintenance),
      });

      const input = {
        title: 'Scheduled Maintenance',
        description: 'Regular maintenance',
        affectedServices: ['service-1'],
        scheduledStart: '2024-02-01T02:00:00Z',
        scheduledEnd: '2024-02-01T04:00:00Z',
      };

      const result = await createMaintenance(input);

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockMaintenance);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        createMaintenance({
          title: 'Test',
          description: 'Test',
          affectedServices: [],
          scheduledStart: '',
          scheduledEnd: '',
        })
      ).rejects.toThrow('Failed to create maintenance window');
    });
  });

  describe('updateMaintenance', () => {
    it('should update maintenance window', async () => {
      const updatedMaintenance = createMockMaintenance({ status: 'in_progress' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedMaintenance),
      });

      const input = {
        title: 'Updated Maintenance',
      };

      const result = await updateMaintenance('maintenance-1', input);

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/maintenance/maintenance-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(updatedMaintenance);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(updateMaintenance('maintenance-1', {})).rejects.toThrow(
        'Failed to update maintenance window'
      );
    });
  });

  describe('deleteMaintenance', () => {
    it('should delete maintenance window', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await deleteMaintenance('maintenance-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/maintenance/maintenance-1', {
        method: 'DELETE',
      });
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteMaintenance('maintenance-1')).rejects.toThrow(
        'Failed to delete maintenance window'
      );
    });
  });

  describe('runHealthCheck', () => {
    it('should run health check without serviceId', async () => {
      const mockResults = createMockHealthCheckResult();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      const result = await runHealthCheck();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/health-check', {
        method: 'POST',
      });
      expect(result).toEqual(mockResults);
    });

    it('should run health check with serviceId', async () => {
      const mockResults = createMockHealthCheckResult();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      const result = await runHealthCheck('service-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/health-check?serviceId=service-1', {
        method: 'POST',
      });
      expect(result).toEqual(mockResults);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(runHealthCheck()).rejects.toThrow('Failed to run health check');
    });
  });

  describe('getSubscribers', () => {
    it('should fetch subscribers list', async () => {
      const mockSubscribers = [createMockSubscriber()];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubscribers),
      });

      const result = await getSubscribers();

      expect(mockFetch).toHaveBeenCalledWith('/api/status/admin/subscribers');
      expect(result).toEqual(mockSubscribers);
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getSubscribers()).rejects.toThrow('Failed to fetch subscribers');
    });
  });
});
