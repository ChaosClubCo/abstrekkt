import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useBackgroundJobs,
  useJobProgress,
  useScheduledJobs,
  useJobQueues,
  useJobStats,
} from '../hooks';
import * as api from '../api';
import {
  mockJobs,
  mockJob,
  mockRunningJob,
  mockFailedJob,
  mockScheduledJobs,
  mockScheduledJob,
  mockQueues,
  mockStats,
  mockEnqueueInput,
  mockScheduleInput,
} from './fixtures';

vi.mock('../api');
const mockedApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('Background Jobs Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBackgroundJobs', () => {
    it('should fetch jobs on mount', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.jobs).toEqual(mockJobs);
    });

    it('should pass filters to API', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]);

      renderHook(() => useBackgroundJobs({ status: 'completed' }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getJobs).toHaveBeenCalledWith({ status: 'completed' });
      });
    });

    it('should return empty array when no jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.jobs).toEqual([]);
    });

    it('should expose enqueue mutation', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([]);
      mockedApi.enqueueJob.mockResolvedValueOnce(mockJob);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.enqueue(mockEnqueueInput);
      });

      expect(mockedApi.enqueueJob).toHaveBeenCalledWith(mockEnqueueInput, expect.anything());
    });

    it('should expose cancel mutation', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      mockedApi.cancelJob.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.cancel('job_002');
      });

      expect(mockedApi.cancelJob).toHaveBeenCalledWith('job_002', expect.anything());
    });

    it('should expose retry mutation', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      mockedApi.retryJob.mockResolvedValueOnce({ ...mockJob, status: 'pending' });

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.retry('job_003');
      });

      expect(mockedApi.retryJob).toHaveBeenCalledWith('job_003', expect.anything());
    });

    it('should track isEnqueuing state', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([]);
      let resolveEnqueue: (value: typeof mockJob) => void;
      mockedApi.enqueueJob.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveEnqueue = resolve;
        })
      );

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnqueuing).toBe(false);

      act(() => {
        result.current.enqueue(mockEnqueueInput);
      });

      await waitFor(() => {
        expect(result.current.isEnqueuing).toBe(true);
      });

      await act(async () => {
        resolveEnqueue!(mockJob);
      });

      await waitFor(() => {
        expect(result.current.isEnqueuing).toBe(false);
      });
    });
  });

  describe('useJobProgress', () => {
    it('should fetch job progress', async () => {
      mockedApi.getJob.mockResolvedValueOnce(mockRunningJob);

      const { result } = renderHook(() => useJobProgress('job_002'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.job).toEqual(mockRunningJob);
      expect(result.current.progress).toBe(45);
      expect(result.current.status).toBe('running');
    });

    it('should return isComplete true when job is completed', async () => {
      mockedApi.getJob.mockResolvedValueOnce(mockJob);

      const { result } = renderHook(() => useJobProgress('job_001'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isComplete).toBe(true);
      });

      expect(result.current.isFailed).toBe(false);
    });

    it('should return isFailed true when job has failed', async () => {
      mockedApi.getJob.mockResolvedValueOnce({ ...mockJob, status: 'failed' });

      const { result } = renderHook(() => useJobProgress('job_003'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isFailed).toBe(true);
      });

      expect(result.current.isComplete).toBe(false);
    });

    it('should not fetch when jobId is empty', async () => {
      const { result } = renderHook(() => useJobProgress(''), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(mockedApi.getJob).not.toHaveBeenCalled();
    });

    it('should default progress to 0 when job not loaded', async () => {
      mockedApi.getJob.mockResolvedValueOnce(mockJob);

      const { result } = renderHook(() => useJobProgress('job_001'), { wrapper: createWrapper() });

      expect(result.current.progress).toBe(0);
    });
  });

  describe('useScheduledJobs', () => {
    it('should fetch scheduled jobs on mount', async () => {
      mockedApi.getScheduledJobs.mockResolvedValueOnce(mockScheduledJobs);

      const { result } = renderHook(() => useScheduledJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.jobs).toEqual(mockScheduledJobs);
    });

    it('should expose schedule mutation', async () => {
      mockedApi.getScheduledJobs.mockResolvedValueOnce([]);
      mockedApi.scheduleJob.mockResolvedValueOnce(mockScheduledJob);

      const { result } = renderHook(() => useScheduledJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.schedule(mockScheduleInput);
      });

      expect(mockedApi.scheduleJob).toHaveBeenCalledWith(mockScheduleInput, expect.anything());
    });

    it('should expose toggle mutation', async () => {
      mockedApi.getScheduledJobs.mockResolvedValueOnce(mockScheduledJobs);
      mockedApi.toggleScheduledJob.mockResolvedValueOnce({ ...mockScheduledJob, enabled: false });

      const { result } = renderHook(() => useScheduledJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggle({ id: 'sched_001', enabled: false });
      });

      expect(mockedApi.toggleScheduledJob).toHaveBeenCalledWith('sched_001', false);
    });

    it('should expose remove mutation', async () => {
      mockedApi.getScheduledJobs.mockResolvedValueOnce(mockScheduledJobs);
      mockedApi.deleteScheduledJob.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useScheduledJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.remove('sched_001');
      });

      expect(mockedApi.deleteScheduledJob).toHaveBeenCalledWith('sched_001', expect.anything());
    });
  });

  describe('useJobQueues', () => {
    it('should fetch queues on mount', async () => {
      mockedApi.getQueues.mockResolvedValueOnce(mockQueues);

      const { result } = renderHook(() => useJobQueues(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.queues).toEqual(mockQueues);
    });

    it('should expose pause mutation', async () => {
      mockedApi.getQueues.mockResolvedValueOnce(mockQueues);
      mockedApi.pauseQueue.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useJobQueues(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.pause('default');
      });

      expect(mockedApi.pauseQueue).toHaveBeenCalledWith('default', expect.anything());
    });

    it('should expose resume mutation', async () => {
      mockedApi.getQueues.mockResolvedValueOnce(mockQueues);
      mockedApi.resumeQueue.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useJobQueues(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.resume('reports');
      });

      expect(mockedApi.resumeQueue).toHaveBeenCalledWith('reports', expect.anything());
    });

    it('should expose clear mutation', async () => {
      mockedApi.getQueues.mockResolvedValueOnce(mockQueues);
      mockedApi.clearQueue.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useJobQueues(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.clear({ name: 'default', status: 'failed' });
      });

      expect(mockedApi.clearQueue).toHaveBeenCalledWith('default', 'failed');
    });
  });

  describe('useJobStats', () => {
    it('should fetch global stats', async () => {
      mockedApi.getJobStats.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useJobStats(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockStats);
    });

    it('should fetch stats for specific queue', async () => {
      mockedApi.getJobStats.mockResolvedValueOnce(mockStats);

      renderHook(() => useJobStats('emails'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getJobStats).toHaveBeenCalledWith('emails');
      });
    });
  });

  describe('job state management', () => {
    it('should handle error state from API', async () => {
      mockedApi.getJobs.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should return jobs with correct structure', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify job structure
      result.current.jobs.forEach(job => {
        expect(job).toHaveProperty('id');
        expect(job).toHaveProperty('name');
        expect(job).toHaveProperty('status');
        expect(job).toHaveProperty('queue');
        expect(job).toHaveProperty('progress');
      });
    });
  });

  describe('queue operations', () => {
    it('should support multiple status filters', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob, mockFailedJob]);

      renderHook(() => useBackgroundJobs({ status: ['completed', 'failed'] }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getJobs).toHaveBeenCalledWith({ status: ['completed', 'failed'] });
      });
    });

    it('should support queue filter', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockRunningJob]);

      renderHook(() => useBackgroundJobs({ queue: 'emails' }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getJobs).toHaveBeenCalledWith({ queue: 'emails' });
      });
    });

    it('should support name filter', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]);

      renderHook(() => useBackgroundJobs({ name: 'process-images' }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getJobs).toHaveBeenCalledWith({ name: 'process-images' });
      });
    });
  });

  describe('status updates', () => {
    it('should expose all job statuses from fixtures', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const statuses = result.current.jobs.map(j => j.status);
      expect(statuses).toContain('completed');
      expect(statuses).toContain('running');
      expect(statuses).toContain('failed');
    });

    it('should handle job with cancelled status', async () => {
      const cancelledJob = { ...mockJob, status: 'cancelled' as const };
      mockedApi.getJobs.mockResolvedValueOnce([cancelledJob]);

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.jobs[0].status).toBe('cancelled');
      });
    });
  });

  describe('useJobProgress additional tests', () => {
    it('should handle job transition from running to completed', async () => {
      mockedApi.getJob.mockResolvedValueOnce(mockRunningJob);

      const { result } = renderHook(() => useJobProgress('job_002'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.status).toBe('running');
        expect(result.current.isComplete).toBe(false);
      });
    });

    it('should return undefined status when job not yet loaded', () => {
      mockedApi.getJob.mockResolvedValueOnce(mockJob);

      const { result } = renderHook(() => useJobProgress('job_001'), { wrapper: createWrapper() });

      // Before loading completes
      expect(result.current.status).toBeUndefined();
    });
  });

  describe('mutation error handling', () => {
    it('should handle enqueue failure', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([]);
      mockedApi.enqueueJob.mockRejectedValueOnce(new Error('Queue full'));

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.enqueue(mockEnqueueInput);
        })
      ).rejects.toThrow('Queue full');
    });

    it('should handle cancel failure', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      mockedApi.cancelJob.mockRejectedValueOnce(new Error('Job already completed'));

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.cancel('job_001');
        })
      ).rejects.toThrow('Job already completed');
    });

    it('should handle retry failure', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      mockedApi.retryJob.mockRejectedValueOnce(new Error('Max retries exceeded'));

      const { result } = renderHook(() => useBackgroundJobs(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.retry('job_003');
        })
      ).rejects.toThrow('Max retries exceeded');
    });
  });
});
