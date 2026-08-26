export type ServiceStatus =
  | 'operational'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage'
  | 'maintenance';

export type IncidentSeverity = 'minor' | 'major' | 'critical';

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface Service {
  id: string;
  name: string;
  description?: string;
  group?: string;
  status: ServiceStatus;
  uptime: number; // Percentage
  lastCheck: string;
  responseTime?: number; // ms
}

export interface ServiceGroup {
  name: string;
  services: Service[];
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  affectedServices: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  affectedServices: string[];
  scheduledStart: string;
  scheduledEnd: string;
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface UptimeData {
  date: string;
  uptime: number;
  incidents: number;
}

export interface HealthStatusConfig {
  orgSlug: string;
  orgName: string;
  logo?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
  services: Array<{
    id: string;
    name: string;
    group?: string;
  }>;
  healthChecks?: {
    interval: number;
    timeout: number;
    endpoints: Array<{
      service: string;
      url: string;
    }>;
  };
  notifications?: {
    email?: { enabled: boolean };
    sms?: { enabled: boolean };
    webhook?: { url: string };
  };
}

export interface Subscriber {
  id: string;
  email: string;
  phone?: string;
  services: string[]; // Empty = all services
  createdAt: string;
  confirmed: boolean;
}

export interface OverallStatus {
  status: ServiceStatus;
  message: string;
  services: Service[];
  activeIncidents: number;
  scheduledMaintenance: number;
}

export interface HealthCheckResult {
  serviceId: string;
  healthy: boolean;
  responseTime: number;
  timestamp: string;
  error?: string;
}

export interface CreateIncidentInput {
  title: string;
  severity: IncidentSeverity;
  affectedServices: string[];
  message: string;
}

export interface UpdateIncidentInput {
  status: IncidentStatus;
  message: string;
}

export interface CreateMaintenanceInput {
  title: string;
  description: string;
  affectedServices: string[];
  scheduledStart: string;
  scheduledEnd: string;
}
