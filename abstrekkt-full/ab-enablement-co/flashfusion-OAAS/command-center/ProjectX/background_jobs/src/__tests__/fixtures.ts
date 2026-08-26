import type {
  BackgroundJob,
  ScheduledJob,
  JobQueue,
  JobStats,
  EnqueueJobInput,
  ScheduleJobInput,
} from '../types';

export const mockJob: BackgroundJob = {
  id: 'job_001',
  name: 'process-images',
  queue: 'default',
  status: 'completed',
  priority: 'normal',
  payload: { imageId: 'img_123', size: 'thumbnail' },
  result: { url: 'https://example.com/thumb.jpg' },
  progress: 100,
  attempts: 1,
  maxAttempts: 3,
  scheduledAt: new Date('2024-01-15T09:00:00Z'),
  startedAt: new Date('2024-01-15T09:00:01Z'),
  completedAt: new Date('2024-01-15T09:00:05Z'),
  createdAt: new Date('2024-01-15T08:59:00Z'),
};

export const mockRunningJob: BackgroundJob = {
  id: 'job_002',
  name: 'send-emails',
  queue: 'emails',
  status: 'running',
  priority: 'high',
  payload: { campaignId: 'camp_123', recipients: 1000 },
  progress: 45,
  attempts: 1,
  maxAttempts: 3,
  startedAt: new Date('2024-01-15T10:00:00Z'),
  createdAt: new Date('2024-01-15T09:55:00Z'),
};

export const mockFailedJob: BackgroundJob = {
  id: 'job_003',
  name: 'generate-report',
  queue: 'reports',
  status: 'failed',
  priority: 'low',
  payload: { reportType: 'monthly', month: '2024-01' },
  error: 'Connection timeout',
  progress: 0,
  attempts: 3,
  maxAttempts: 3,
  failedAt: new Date('2024-01-15T08:30:00Z'),
  createdAt: new Date('2024-01-15T08:00:00Z'),
};

export const mockJobs: BackgroundJob[] = [mockJob, mockRunningJob, mockFailedJob];

export const mockScheduledJob: ScheduledJob = {
  id: 'sched_001',
  name: 'daily-cleanup',
  cron: '0 3 * * *',
  queue: 'maintenance',
  payload: { daysToKeep: 30 },
  enabled: true,
  lastRunAt: new Date('2024-01-15T03:00:00Z'),
  nextRunAt: new Date('2024-01-16T03:00:00Z'),
  createdAt: new Date('2024-01-01T00:00:00Z'),
};

export const mockScheduledJobs: ScheduledJob[] = [
  mockScheduledJob,
  {
    id: 'sched_002',
    name: 'weekly-report',
    cron: '0 9 * * MON',
    queue: 'reports',
    payload: { format: 'pdf' },
    enabled: false,
    nextRunAt: new Date('2024-01-22T09:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
];

export const mockQueue: JobQueue = {
  name: 'default',
  pending: 10,
  running: 2,
  completed: 1500,
  failed: 5,
  paused: false,
};

export const mockQueues: JobQueue[] = [
  mockQueue,
  {
    name: 'emails',
    pending: 100,
    running: 5,
    completed: 5000,
    failed: 25,
    paused: false,
  },
  {
    name: 'reports',
    pending: 0,
    running: 1,
    completed: 200,
    failed: 10,
    paused: true,
  },
];

export const mockStats: JobStats = {
  total: 10000,
  pending: 150,
  running: 8,
  completed: 9800,
  failed: 42,
  avgDuration: 5.2,
  throughput: 120,
};

export const mockEnqueueInput: EnqueueJobInput = {
  name: 'process-order',
  payload: { orderId: 'order_123' },
  queue: 'orders',
  priority: 'high',
  maxAttempts: 5,
};

export const mockScheduleInput: ScheduleJobInput = {
  name: 'send-digest',
  payload: { type: 'daily' },
  cron: '0 8 * * *',
  queue: 'notifications',
  priority: 'normal',
};
