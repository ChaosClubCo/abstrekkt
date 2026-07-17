import type {
  Service,
  Incident,
  MaintenanceWindow,
  OverallStatus,
  UptimeData,
  Subscriber,
  CreateIncidentInput,
  UpdateIncidentInput,
  CreateMaintenanceInput,
  HealthCheckResult,
} from '../types';

const API_BASE = '/api/status';

// Public endpoints
export async function getOverallStatus(): Promise<OverallStatus> {
  const response = await fetch(`${API_BASE}`);
  if (!response.ok) throw new Error('Failed to fetch status');
  return response.json();
}

export async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE}/services`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}

export async function getService(serviceId: string): Promise<Service> {
  const response = await fetch(`${API_BASE}/services/${serviceId}`);
  if (!response.ok) throw new Error('Failed to fetch service');
  return response.json();
}

export async function getIncidents(options?: {
  status?: 'active' | 'resolved';
  limit?: number;
}): Promise<Incident[]> {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());

  const response = await fetch(`${API_BASE}/incidents?${params}`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}

export async function getIncident(incidentId: string): Promise<Incident> {
  const response = await fetch(`${API_BASE}/incidents/${incidentId}`);
  if (!response.ok) throw new Error('Failed to fetch incident');
  return response.json();
}

export async function getMaintenanceWindows(options?: {
  status?: 'scheduled' | 'in_progress' | 'completed';
}): Promise<MaintenanceWindow[]> {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);

  const response = await fetch(`${API_BASE}/maintenance?${params}`);
  if (!response.ok) throw new Error('Failed to fetch maintenance windows');
  return response.json();
}

export async function getUptimeHistory(options?: {
  serviceId?: string;
  days?: number;
}): Promise<UptimeData[]> {
  const params = new URLSearchParams();
  if (options?.serviceId) params.set('serviceId', options.serviceId);
  if (options?.days) params.set('days', options.days.toString());

  const response = await fetch(`${API_BASE}/uptime?${params}`);
  if (!response.ok) throw new Error('Failed to fetch uptime history');
  return response.json();
}

// Subscriber endpoints
export async function subscribe(email: string, services?: string[]): Promise<Subscriber> {
  const response = await fetch(`${API_BASE}/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, services }),
  });
  if (!response.ok) throw new Error('Failed to subscribe');
  return response.json();
}

export async function unsubscribe(token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/subscribers/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) throw new Error('Failed to unsubscribe');
}

// Admin endpoints
export async function updateServiceStatus(
  serviceId: string,
  status: Service['status']
): Promise<Service> {
  const response = await fetch(`${API_BASE}/admin/services/${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update service status');
  return response.json();
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const response = await fetch(`${API_BASE}/admin/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to create incident');
  return response.json();
}

export async function updateIncident(
  incidentId: string,
  input: UpdateIncidentInput
): Promise<Incident> {
  const response = await fetch(`${API_BASE}/admin/incidents/${incidentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to update incident');
  return response.json();
}

export async function resolveIncident(incidentId: string, message: string): Promise<Incident> {
  return updateIncident(incidentId, { status: 'resolved', message });
}

export async function createMaintenance(input: CreateMaintenanceInput): Promise<MaintenanceWindow> {
  const response = await fetch(`${API_BASE}/admin/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to create maintenance window');
  return response.json();
}

export async function updateMaintenance(
  maintenanceId: string,
  input: Partial<CreateMaintenanceInput>
): Promise<MaintenanceWindow> {
  const response = await fetch(`${API_BASE}/admin/maintenance/${maintenanceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to update maintenance window');
  return response.json();
}

export async function deleteMaintenance(maintenanceId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/maintenance/${maintenanceId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete maintenance window');
}

export async function runHealthCheck(serviceId?: string): Promise<HealthCheckResult[]> {
  const params = serviceId ? `?serviceId=${serviceId}` : '';
  const response = await fetch(`${API_BASE}/admin/health-check${params}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to run health check');
  return response.json();
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const response = await fetch(`${API_BASE}/admin/subscribers`);
  if (!response.ok) throw new Error('Failed to fetch subscribers');
  return response.json();
}
