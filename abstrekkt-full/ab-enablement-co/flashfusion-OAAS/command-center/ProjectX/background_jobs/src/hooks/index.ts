import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { JobFilters } from '../types';

export function useBackgroundJobs(filters?: JobFilters) {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['backgroundJobs', filters],
    queryFn: () => api.getJobs(filters),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const enqueueMutation = useMutation({
    mutationFn: api.enqueueJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundJobs'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: api.cancelJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundJobs'] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: api.retryJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundJobs'] });
    },
  });

  return {
    jobs,
    isLoading,
    error,
    enqueue: enqueueMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    retry: retryMutation.mutateAsync,
    isEnqueuing: enqueueMutation.isPending,
  };
}

export function useJobProgress(jobId: string) {
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.getJob(jobId),
    refetchInterval: (query) => {
      const job = query.state.data;
      // Stop polling when job is complete or failed
      if (job?.status === 'completed' || job?.status === 'failed' || job?.status === 'cancelled') {
        return false;
      }
      return 1000; // Poll every second
    },
    enabled: !!jobId,
  });

  return {
    job,
    progress: job?.progress ?? 0,
    status: job?.status,
    isLoading,
    isComplete: job?.status === 'completed',
    isFailed: job?.status === 'failed',
  };
}

export function useScheduledJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['scheduledJobs'],
    queryFn: api.getScheduledJobs,
  });

  const scheduleMutation = useMutation({
    mutationFn: api.scheduleJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledJobs'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.toggleScheduledJob(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledJobs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteScheduledJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledJobs'] });
    },
  });

  return {
    jobs,
    isLoading,
    schedule: scheduleMutation.mutateAsync,
    toggle: toggleMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}

export function useJobQueues() {
  const queryClient = useQueryClient();

  const { data: queues = [], isLoading } = useQuery({
    queryKey: ['jobQueues'],
    queryFn: api.getQueues,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const pauseMutation = useMutation({
    mutationFn: api.pauseQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobQueues'] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: api.resumeQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobQueues'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: ({ name, status }: { name: string; status?: string }) =>
      api.clearQueue(name, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobQueues'] });
      queryClient.invalidateQueries({ queryKey: ['backgroundJobs'] });
    },
  });

  return {
    queues,
    isLoading,
    pause: pauseMutation.mutateAsync,
    resume: resumeMutation.mutateAsync,
    clear: clearMutation.mutateAsync,
  };
}

export function useJobStats(queue?: string) {
  return useQuery({
    queryKey: ['jobStats', queue],
    queryFn: () => api.getJobStats(queue),
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
