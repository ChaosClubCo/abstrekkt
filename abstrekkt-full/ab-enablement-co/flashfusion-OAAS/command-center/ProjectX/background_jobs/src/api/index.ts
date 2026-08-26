import axios from 'axios';
import type {
  BackgroundJob,
  EnqueueJobInput,
  ScheduleJobInput,
  ScheduledJob,
  JobQueue,
  JobFilters,
  JobStats,
} from '../types';

const API_BASE = '/api/jobs';

// Job management
export async function getJobs(filters?: JobFilters): Promise<BackgroundJob[]> {
  const response = await axios.get<BackgroundJob[]>(API_BASE, { params: filters });
  return response.data;
}

export async function getJob(id: string): Promise<BackgroundJob> {
  const response = await axios.get<BackgroundJob>(`${API_BASE}/${id}`);
  return response.data;
}

export async function enqueueJob(input: EnqueueJobInput): Promise<BackgroundJob> {
  const response = await axios.post<BackgroundJob>(API_BASE, input);
  return response.data;
}

export async function cancelJob(id: string): Promise<void> {
  await axios.post(`${API_BASE}/${id}/cancel`);
}

export async function retryJob(id: string): Promise<BackgroundJob> {
  const response = await axios.post<BackgroundJob>(`${API_BASE}/${id}/retry`);
  return response.data;
}

export async function deleteJob(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}

// Scheduled jobs
export async function getScheduledJobs(): Promise<ScheduledJob[]> {
  const response = await axios.get<ScheduledJob[]>(`${API_BASE}/scheduled`);
  return response.data;
}

export async function scheduleJob(input: ScheduleJobInput): Promise<ScheduledJob> {
  const response = await axios.post<ScheduledJob>(`${API_BASE}/scheduled`, input);
  return response.data;
}

export async function toggleScheduledJob(id: string, enabled: boolean): Promise<ScheduledJob> {
  const response = await axios.patch<ScheduledJob>(`${API_BASE}/scheduled/${id}`, { enabled });
  return response.data;
}

export async function deleteScheduledJob(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/scheduled/${id}`);
}

// Queue management
export async function getQueues(): Promise<JobQueue[]> {
  const response = await axios.get<JobQueue[]>(`${API_BASE}/queues`);
  return response.data;
}

export async function pauseQueue(name: string): Promise<void> {
  await axios.post(`${API_BASE}/queues/${name}/pause`);
}

export async function resumeQueue(name: string): Promise<void> {
  await axios.post(`${API_BASE}/queues/${name}/resume`);
}

export async function clearQueue(name: string, status?: string): Promise<void> {
  await axios.delete(`${API_BASE}/queues/${name}`, { params: { status } });
}

// Stats
export async function getJobStats(queue?: string): Promise<JobStats> {
  const response = await axios.get<JobStats>(`${API_BASE}/stats`, { params: { queue } });
  return response.data;
}
