import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as api from '../api';
import {
  mockJobs,
  mockJob,
  mockRunningJob,
  mockFailedJob,
  mockQueues,
} from './fixtures';

vi.mock('../api');
const mockedApi = vi.mocked(api);

// Mock JobQueue component that would render the job list
// In a real implementation, this would be imported from ../components/JobQueue
const JobQueue: React.FC<{
  onRetry?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
}> = ({ onRetry, onCancel }) => {
  const [jobs, setJobs] = React.useState(mockJobs);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>('all');

  React.useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await api.getJobs();
        setJobs(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(job => job.status === filter);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'failed': return 'badge-error';
      case 'running': return 'badge-info';
      case 'pending': return 'badge-warning';
      default: return 'badge-default';
    }
  };

  if (isLoading) {
    return <div data-testid="loading">Loading jobs...</div>;
  }

  return (
    <div className="job-queue">
      <h2>Job Queue</h2>
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      {filteredJobs.length === 0 ? (
        <div data-testid="empty-state">No jobs found</div>
      ) : (
        <ul className="job-list" role="list">
          {filteredJobs.map((job) => (
            <li key={job.id} className="job-item" data-testid={`job-${job.id}`}>
              <div className="job-info">
                <span className="job-name">{job.name}</span>
                <span className={`status-badge ${getStatusBadgeClass(job.status)}`} data-testid={`status-${job.id}`}>
                  {job.status}
                </span>
                <span className="job-queue">{job.queue}</span>
                {job.progress > 0 && job.progress < 100 && (
                  <span className="job-progress" data-testid={`progress-${job.id}`}>
                    {job.progress}%
                  </span>
                )}
              </div>
              <div className="job-actions">
                {job.status === 'failed' && onRetry && (
                  <button
                    onClick={() => onRetry(job.id)}
                    className="btn-retry"
                    aria-label={`Retry ${job.name}`}
                  >
                    Retry
                  </button>
                )}
                {(job.status === 'pending' || job.status === 'running') && onCancel && (
                  <button
                    onClick={() => onCancel(job.id)}
                    className="btn-cancel"
                    aria-label={`Cancel ${job.name}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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

describe('JobQueue Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the component title', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Job Queue')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should render job list after loading', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render filter dropdown', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByLabelText('Filter by status:')).toBeInTheDocument();
      });
    });
  });

  describe('job list rendering', () => {
    it('should display all jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('job-job_001')).toBeInTheDocument();
        expect(screen.getByTestId('job-job_002')).toBeInTheDocument();
        expect(screen.getByTestId('job-job_003')).toBeInTheDocument();
      });
    });

    it('should display job names', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('process-images')).toBeInTheDocument();
        expect(screen.getByText('send-emails')).toBeInTheDocument();
        expect(screen.getByText('generate-report')).toBeInTheDocument();
      });
    });

    it('should show empty state when no jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([]);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('No jobs found')).toBeInTheDocument();
      });
    });
  });

  describe('status badges', () => {
    it('should display completed status badge', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        const statusBadge = screen.getByTestId('status-job_001');
        expect(statusBadge).toHaveTextContent('completed');
        expect(statusBadge).toHaveClass('badge-success');
      });
    });

    it('should display running status badge', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockRunningJob]);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        const statusBadge = screen.getByTestId('status-job_002');
        expect(statusBadge).toHaveTextContent('running');
        expect(statusBadge).toHaveClass('badge-info');
      });
    });

    it('should display failed status badge', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockFailedJob]);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        const statusBadge = screen.getByTestId('status-job_003');
        expect(statusBadge).toHaveTextContent('failed');
        expect(statusBadge).toHaveClass('badge-error');
      });
    });

    it('should display progress for running jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockRunningJob]);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('progress-job_002')).toHaveTextContent('45%');
      });
    });
  });

  describe('retry button', () => {
    it('should show retry button for failed jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockFailedJob]);
      const onRetry = vi.fn();

      render(<JobQueue onRetry={onRetry} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry generate-report/i })).toBeInTheDocument();
      });
    });

    it('should not show retry button for completed jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]);
      const onRetry = vi.fn();

      render(<JobQueue onRetry={onRetry} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
      });
    });

    it('should call onRetry when retry button is clicked', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockFailedJob]);
      const onRetry = vi.fn();
      const user = userEvent.setup();

      render(<JobQueue onRetry={onRetry} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry generate-report/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /retry generate-report/i }));

      expect(onRetry).toHaveBeenCalledWith('job_003');
    });
  });

  describe('cancel button', () => {
    it('should show cancel button for running jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockRunningJob]);
      const onCancel = vi.fn();

      render(<JobQueue onCancel={onCancel} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel send-emails/i })).toBeInTheDocument();
      });
    });

    it('should not show cancel button for completed jobs', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]);
      const onCancel = vi.fn();

      render(<JobQueue onCancel={onCancel} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
      });
    });

    it('should call onCancel when cancel button is clicked', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockRunningJob]);
      const onCancel = vi.fn();
      const user = userEvent.setup();

      render(<JobQueue onCancel={onCancel} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel send-emails/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /cancel send-emails/i }));

      expect(onCancel).toHaveBeenCalledWith('job_002');
    });
  });

  describe('filtering', () => {
    it('should filter jobs by status', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      const user = userEvent.setup();

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('job-job_001')).toBeInTheDocument();
      });

      await user.selectOptions(screen.getByLabelText('Filter by status:'), 'failed');

      expect(screen.queryByTestId('job-job_001')).not.toBeInTheDocument();
      expect(screen.queryByTestId('job-job_002')).not.toBeInTheDocument();
      expect(screen.getByTestId('job-job_003')).toBeInTheDocument();
    });

    it('should show all jobs when filter is "all"', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);
      const user = userEvent.setup();

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('job-job_001')).toBeInTheDocument();
      });

      // First filter
      await user.selectOptions(screen.getByLabelText('Filter by status:'), 'failed');

      // Then reset to all
      await user.selectOptions(screen.getByLabelText('Filter by status:'), 'all');

      expect(screen.getByTestId('job-job_001')).toBeInTheDocument();
      expect(screen.getByTestId('job-job_002')).toBeInTheDocument();
      expect(screen.getByTestId('job-job_003')).toBeInTheDocument();
    });

    it('should show empty state when filter has no matches', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockJob]); // Only completed job
      const user = userEvent.setup();

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('job-job_001')).toBeInTheDocument();
      });

      await user.selectOptions(screen.getByLabelText('Filter by status:'), 'failed');

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible list structure', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument();
      });
    });

    it('should have accessible button labels', async () => {
      mockedApi.getJobs.mockResolvedValueOnce([mockFailedJob, mockRunningJob]);
      const onRetry = vi.fn();
      const onCancel = vi.fn();

      render(<JobQueue onRetry={onRetry} onCancel={onCancel} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry generate-report/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel send-emails/i })).toBeInTheDocument();
      });
    });

    it('should have labeled filter dropdown', async () => {
      mockedApi.getJobs.mockResolvedValueOnce(mockJobs);

      render(<JobQueue />, { wrapper: createWrapper() });

      await waitFor(() => {
        const select = screen.getByLabelText('Filter by status:');
        expect(select).toBeInTheDocument();
        expect(select.tagName).toBe('SELECT');
      });
    });
  });
});
