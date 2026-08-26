import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as api from '../api';
import {
  mockJob,
  mockJobs,
  mockScheduledJob,
  mockScheduledJobs,
  mockQueues,
  mockStats,
  mockEnqueueInput,
  mockScheduleInput,
} from './fixtures';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Background Jobs API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getJobs', () => {
    it('should fetch jobs without filters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockJobs });

      const result = await api.getJobs();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs', { params: undefined });
      expect(result).toEqual(mockJobs);
    });

    it('should fetch jobs with status filter', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockJob] });

      const result = await api.getJobs({ status: 'completed' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs', { params: { status: 'completed' } });
      expect(result).toEqual([mockJob]);
    });

    it('should fetch jobs with queue filter', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockJobs });

      await api.getJobs({ queue: 'emails' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs', { params: { queue: 'emails' } });
    });

    it('should fetch jobs with multiple filters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await api.getJobs({ status: 'running', queue: 'default', name: 'process' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs', {
        params: { status: 'running', queue: 'default', name: 'process' },
      });
    });
  });

  describe('getJob', () => {
    it('should fetch a single job by ID', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockJob });

      const result = await api.getJob('job_001');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs/job_001');
      expect(result).toEqual(mockJob);
    });
  });

  describe('enqueueJob', () => {
    it('should enqueue a new job', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockJob });

      const result = await api.enqueueJob(mockEnqueueInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs', mockEnqueueInput);
      expect(result).toEqual(mockJob);
    });

    it('should enqueue job with minimal input', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockJob });

      await api.enqueueJob({ name: 'simple-job', payload: {} });

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs', { name: 'simple-job', payload: {} });
    });
  });

  describe('cancelJob', () => {
    it('should cancel a job', async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await api.cancelJob('job_002');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs/job_002/cancel');
    });
  });

  describe('retryJob', () => {
    it('should retry a failed job', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { ...mockJob, status: 'pending', attempts: 2 } });

      const result = await api.retryJob('job_003');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs/job_003/retry');
      expect(result.status).toBe('pending');
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteJob('job_001');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/jobs/job_001');
    });
  });

  describe('getScheduledJobs', () => {
    it('should fetch all scheduled jobs', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockScheduledJobs });

      const result = await api.getScheduledJobs();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs/scheduled');
      expect(result).toEqual(mockScheduledJobs);
    });
  });

  describe('scheduleJob', () => {
    it('should schedule a new job', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockScheduledJob });

      const result = await api.scheduleJob(mockScheduleInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs/scheduled', mockScheduleInput);
      expect(result).toEqual(mockScheduledJob);
    });
  });

  describe('toggleScheduledJob', () => {
    it('should enable a scheduled job', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockScheduledJob, enabled: true } });

      const result = await api.toggleScheduledJob('sched_001', true);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/jobs/scheduled/sched_001', { enabled: true });
      expect(result.enabled).toBe(true);
    });

    it('should disable a scheduled job', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockScheduledJob, enabled: false } });

      const result = await api.toggleScheduledJob('sched_001', false);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/jobs/scheduled/sched_001', { enabled: false });
      expect(result.enabled).toBe(false);
    });
  });

  describe('deleteScheduledJob', () => {
    it('should delete a scheduled job', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteScheduledJob('sched_001');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/jobs/scheduled/sched_001');
    });
  });

  describe('getQueues', () => {
    it('should fetch all queues', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockQueues });

      const result = await api.getQueues();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs/queues');
      expect(result).toEqual(mockQueues);
    });
  });

  describe('pauseQueue', () => {
    it('should pause a queue', async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await api.pauseQueue('default');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs/queues/default/pause');
    });
  });

  describe('resumeQueue', () => {
    it('should resume a queue', async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await api.resumeQueue('reports');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/jobs/queues/reports/resume');
    });
  });

  describe('clearQueue', () => {
    it('should clear all jobs from a queue', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.clearQueue('default');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/jobs/queues/default', { params: { status: undefined } });
    });

    it('should clear jobs with specific status from a queue', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.clearQueue('default', 'failed');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/jobs/queues/default', { params: { status: 'failed' } });
    });
  });

  describe('getJobStats', () => {
    it('should fetch global job stats', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      const result = await api.getJobStats();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs/stats', { params: { queue: undefined } });
      expect(result).toEqual(mockStats);
    });

    it('should fetch stats for a specific queue', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      await api.getJobStats('emails');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/jobs/stats', { params: { queue: 'emails' } });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from API', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(api.getJobs()).rejects.toThrow('Network error');
    });

    it('should propagate errors for single job fetch', async () => {
      const error = new Error('Not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(api.getJob('invalid')).rejects.toThrow('Not found');
    });

    it('should propagate errors for job mutations', async () => {
      const error = new Error('Server error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(api.enqueueJob(mockEnqueueInput)).rejects.toThrow('Server error');
    });
  });
});
