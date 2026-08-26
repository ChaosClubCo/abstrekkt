# Background Jobs Module

Queue management for async processing, scheduled tasks, and batch operations.

## Features

- **Job Queues**: Multiple named queues for different priorities
- **Scheduled Jobs**: Cron-style recurring jobs
- **Progress Tracking**: Real-time job progress updates
- **Retries**: Automatic retry with exponential backoff
- **Admin Dashboard**: Monitor and manage jobs

## Usage

```tsx
import {
  useBackgroundJobs,
  useJobQueue,
  JobDashboard,
  enqueueJob
} from '@projectx/background_jobs';

// Enqueue a job
await enqueueJob({
  name: 'send-bulk-emails',
  payload: { userIds: [1, 2, 3] },
  priority: 'high',
});

// Monitor jobs in your component
function JobsPage() {
  const { jobs, isLoading } = useBackgroundJobs();

  return <JobDashboard jobs={jobs} />;
}

// Track specific job progress
function ExportProgress({ jobId }) {
  const { job, progress } = useJobProgress(jobId);

  return (
    <ProgressBar
      value={progress}
      label={job?.status}
    />
  );
}
```

## Job Types

```typescript
// One-time job
await enqueueJob({
  name: 'generate-report',
  payload: { reportId: '123' },
});

// Scheduled job (cron)
await scheduleJob({
  name: 'daily-cleanup',
  cron: '0 0 * * *', // Every day at midnight
  payload: { retentionDays: 30 },
});

// Delayed job
await enqueueJob({
  name: 'send-reminder',
  payload: { userId: '123' },
  delay: 3600000, // 1 hour
});
```

## API

### Hooks

| Hook | Description |
|------|-------------|
| `useBackgroundJobs()` | List and manage all jobs |
| `useJobQueue(name)` | Jobs in a specific queue |
| `useJobProgress(id)` | Track job progress |
| `useScheduledJobs()` | List scheduled/recurring jobs |

### Functions

| Function | Description |
|----------|-------------|
| `enqueueJob(job)` | Add a job to the queue |
| `scheduleJob(job)` | Create a recurring job |
| `cancelJob(id)` | Cancel a pending job |
| `retryJob(id)` | Retry a failed job |
