export interface BackgroundJob {
  id: string;
  name: string;
  queue: string;
  status: JobStatus;
  priority: JobPriority;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  progress: number;
  attempts: number;
  maxAttempts: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
}

export type JobStatus =
  | 'pending'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'retrying';

export type JobPriority = 'low' | 'normal' | 'high' | 'critical';

export interface EnqueueJobInput {
  name: string;
  payload: Record<string, unknown>;
  queue?: string;
  priority?: JobPriority;
  delay?: number; // ms
  maxAttempts?: number;
}

export interface ScheduleJobInput {
  name: string;
  payload: Record<string, unknown>;
  cron: string;
  queue?: string;
  priority?: JobPriority;
  maxAttempts?: number;
}

export interface ScheduledJob {
  id: string;
  name: string;
  cron: string;
  queue: string;
  payload: Record<string, unknown>;
  enabled: boolean;
  lastRunAt?: Date;
  nextRunAt: Date;
  createdAt: Date;
}

export interface JobQueue {
  name: string;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  paused: boolean;
}

export interface JobFilters {
  status?: JobStatus | JobStatus[];
  queue?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface JobStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  avgDuration: number;
  throughput: number; // jobs/hour
}
