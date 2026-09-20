import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonitoringDashboard from '../components/MonitoringDashboard';

describe('MonitoringDashboard Component', () => {
  // Note: Removed global fake timers due to React 19 + userEvent compatibility issues
  // Individual tests that need fake timers will configure them locally

  describe('basic rendering', () => {
    it('should render the title', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Monitoring Dashboard Demo')).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText(/simulated metrics/i)).toBeInTheDocument();
    });

    it('should render timeframe select', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render start monitoring button', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByRole('button', { name: 'Start Monitoring' })).toBeInTheDocument();
    });

    it('should render log section', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Log')).toBeInTheDocument();
    });
  });

  describe('metric cards', () => {
    it('should display uptime metric', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('99.90%')).toBeInTheDocument();
    });

    it('should display CPU usage metric', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      expect(screen.getByText('25.00%')).toBeInTheDocument();
    });

    it('should display memory usage metric', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      expect(screen.getByText('40.00%')).toBeInTheDocument();
    });

    it('should display requests per minute metric', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Req/min')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
    });

    it('should display error rate metric', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByText('Error Rate')).toBeInTheDocument();
      expect(screen.getByText('0.10%')).toBeInTheDocument();
    });
  });

  describe('timeframe selection', () => {
    it('should render all timeframe options', () => {
      render(<MonitoringDashboard />);
      const select = screen.getByRole('combobox');

      expect(select).toContainHTML('Real‑time');
      expect(select).toContainHTML('Last 1 minute');
      expect(select).toContainHTML('Last hour');
      expect(select).toContainHTML('Last 24 hours');
    });

    it('should default to realtime', () => {
      render(<MonitoringDashboard />);
      expect(screen.getByRole('combobox')).toHaveValue('realtime');
    });

    it('should allow changing timeframe when not monitoring', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.selectOptions(screen.getByRole('combobox'), '1h');

      expect(screen.getByRole('combobox')).toHaveValue('1h');
    });

    it('should disable timeframe select when monitoring', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('start/stop monitoring', () => {
    it('should change button text to "Stop Monitoring" when started', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      expect(screen.getByRole('button', { name: 'Stop Monitoring' })).toBeInTheDocument();
    });

    it('should change button text back to "Start Monitoring" when stopped', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));
      await user.click(screen.getByRole('button', { name: 'Stop Monitoring' }));

      expect(screen.getByRole('button', { name: 'Start Monitoring' })).toBeInTheDocument();
    });

    it('should enable timeframe select when stopped', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));
      await user.click(screen.getByRole('button', { name: 'Stop Monitoring' }));

      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
  });

  describe('log display', () => {
    it('should show monitoring started log', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      expect(screen.getByText(/Monitoring started/)).toBeInTheDocument();
    });

    it('should show monitoring stopped log', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));
      await user.click(screen.getByRole('button', { name: 'Stop Monitoring' }));

      expect(screen.getByText(/Monitoring stopped/)).toBeInTheDocument();
    });

    it('should show timeframe change log', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.selectOptions(screen.getByRole('combobox'), '24h');

      expect(screen.getByText(/Timeframe changed to 24h/)).toBeInTheDocument();
    });

    it('should show metric update logs', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      expect(screen.getByText(/Updated metrics/)).toBeInTheDocument();
    });
  });

  describe('metric updates', () => {
    it('should update metrics periodically when monitoring', async () => {
      // This specific test uses fake timers with fireEvent (not userEvent)
      // because we need to control time to test periodic updates
      vi.useFakeTimers();

      render(<MonitoringDashboard />);

      // Use fireEvent (not userEvent) which works with fake timers in React 19
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Start Monitoring' }));
      });

      // Initial update happens immediately - logs are in a single <pre> element
      const logPre = screen.getByText(/Updated metrics/).closest('pre');
      expect(logPre).toBeInTheDocument();
      const initialMatches = (logPre?.textContent?.match(/Updated metrics/g) || []).length;
      expect(initialMatches).toBeGreaterThanOrEqual(1);

      // Advance past multiple intervals (2 seconds each)
      await act(async () => {
        vi.advanceTimersByTime(4500);
      });

      // Should have more updates after advancing time (check log text matches)
      const afterMatches = (logPre?.textContent?.match(/Updated metrics/g) || []).length;
      expect(afterMatches).toBeGreaterThan(initialMatches);

      vi.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('should have accessible form controls', () => {
      render(<MonitoringDashboard />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<MonitoringDashboard />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('alert indicators', () => {
    it('should display all metric values with percentages', () => {
      render(<MonitoringDashboard />);

      // Check that all percentage-based metrics show %
      expect(screen.getByText('99.90%')).toBeInTheDocument();
      expect(screen.getByText('25.00%')).toBeInTheDocument();
      expect(screen.getByText('40.00%')).toBeInTheDocument();
      expect(screen.getByText('0.10%')).toBeInTheDocument();
    });

    it('should display requests per minute without percentage', () => {
      render(<MonitoringDashboard />);

      // Req/min should be displayed as a number without %
      expect(screen.getByText('120')).toBeInTheDocument();
    });
  });

  describe('refresh behavior', () => {
    it('should update metrics immediately when monitoring starts', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      // Check that "Updated metrics" log appears
      expect(screen.getByText(/Updated metrics/)).toBeInTheDocument();
    });

    it('should allow restart after stop', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));
      await user.click(screen.getByRole('button', { name: 'Stop Monitoring' }));
      await user.click(screen.getByRole('button', { name: 'Start Monitoring' }));

      expect(screen.getByRole('button', { name: 'Stop Monitoring' })).toBeInTheDocument();
    });
  });

  describe('timeframe options', () => {
    it('should have correct option values', () => {
      render(<MonitoringDashboard />);

      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('realtime');
      expect(options[1]).toHaveValue('1m');
      expect(options[2]).toHaveValue('1h');
      expect(options[3]).toHaveValue('24h');
    });

    it('should log timeframe change for each selection', async () => {
      const user = userEvent.setup();
      render(<MonitoringDashboard />);

      await user.selectOptions(screen.getByRole('combobox'), '1m');
      expect(screen.getByText(/Timeframe changed to 1m/)).toBeInTheDocument();

      await user.selectOptions(screen.getByRole('combobox'), '1h');
      expect(screen.getByText(/Timeframe changed to 1h/)).toBeInTheDocument();
    });
  });

  describe('metric card display', () => {
    it('should display metric labels correctly', () => {
      render(<MonitoringDashboard />);

      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      expect(screen.getByText('Req/min')).toBeInTheDocument();
      expect(screen.getByText('Error Rate')).toBeInTheDocument();
    });

    it('should render all 5 metric cards', () => {
      render(<MonitoringDashboard />);

      // Count metric cards by checking for the labels
      const labels = ['Uptime', 'CPU Usage', 'Memory Usage', 'Req/min', 'Error Rate'];
      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });
});
