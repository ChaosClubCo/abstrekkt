import axios from 'axios';
import type {
  AuditLogEntry,
  CreateAuditLogInput,
  AuditLogSearchParams,
  AuditLogSearchResult,
  ExportFormat,
} from '../types';

const API_BASE = '/api/audit-logs';

/**
 * Create a new audit log entry
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLogEntry> {
  const response = await axios.post<AuditLogEntry>(API_BASE, input);
  return response.data;
}

/**
 * Search audit logs with filters
 */
export async function searchAuditLogs(
  params: AuditLogSearchParams
): Promise<AuditLogSearchResult> {
  const response = await axios.get<AuditLogSearchResult>(API_BASE, { params });
  return response.data;
}

/**
 * Get a single audit log entry
 */
export async function getAuditLog(id: string): Promise<AuditLogEntry> {
  const response = await axios.get<AuditLogEntry>(`${API_BASE}/${id}`);
  return response.data;
}

/**
 * Export audit logs
 */
export async function exportAuditLogs(
  params: AuditLogSearchParams,
  format: ExportFormat
): Promise<Blob> {
  const response = await axios.get(`${API_BASE}/export`, {
    params: { ...params, format },
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Get audit log statistics
 */
export async function getAuditStats(
  tenantId: string,
  startDate: Date,
  endDate: Date
): Promise<AuditStats> {
  const response = await axios.get<AuditStats>(`${API_BASE}/stats`, {
    params: { tenantId, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
  });
  return response.data;
}

export interface AuditStats {
  totalEvents: number;
  eventsByAction: Record<string, number>;
  eventsByResource: Record<string, number>;
  eventsByUser: Array<{ userId: string; count: number }>;
  timeline: Array<{ date: string; count: number }>;
}

/**
 * Get unique actions in audit logs
 */
export async function getUniqueActions(tenantId: string): Promise<string[]> {
  const response = await axios.get<string[]>(`${API_BASE}/actions`, {
    params: { tenantId },
  });
  return response.data;
}

/**
 * Get unique resources in audit logs
 */
export async function getUniqueResources(tenantId: string): Promise<string[]> {
  const response = await axios.get<string[]>(`${API_BASE}/resources`, {
    params: { tenantId },
  });
  return response.data;
}
