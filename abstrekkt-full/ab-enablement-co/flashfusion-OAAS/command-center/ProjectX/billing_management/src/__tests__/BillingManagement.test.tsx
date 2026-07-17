import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillingManagement } from '../components/BillingManagement';

// Mock the hook
vi.mock('../hooks/useBillingManagement', () => ({
  useBillingManagement: vi.fn(),
}));

import { useBillingManagement } from '../hooks/useBillingManagement';

const mockUseBillingManagement = vi.mocked(useBillingManagement);

describe('BillingManagement', () => {
  const defaultMockReturn = {
    subscription: null,
    subscribe: vi.fn(),
    updatePaymentMethod: vi.fn(),
    cancelSubscription: vi.fn(),
    logs: [],
  };

  beforeEach(() => {
    mockUseBillingManagement.mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the title', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Billing Management Demo')).toBeInTheDocument();
    });

    it('should render Current Subscription section', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Current Subscription')).toBeInTheDocument();
    });

    it('should render Subscribe/Change Plan section', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Subscribe / Change Plan')).toBeInTheDocument();
    });

    it('should render Payment Method section', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    it('should render Logs section', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Logs')).toBeInTheDocument();
    });
  });

  describe('no subscription state', () => {
    it('should show "No subscription selected" when subscription is null', () => {
      render(<BillingManagement />);
      expect(screen.getByText('No subscription selected.')).toBeInTheDocument();
    });

    it('should not show cancel button when no subscription', () => {
      render(<BillingManagement />);
      expect(screen.queryByText('Cancel Subscription')).not.toBeInTheDocument();
    });
  });

  describe('plan selection', () => {
    it('should render plan select with all options', () => {
      render(<BillingManagement />);
      const select = screen.getByRole('combobox');

      expect(within(select).getByText('Free ($0)')).toBeInTheDocument();
      expect(within(select).getByText('Pro ($49)')).toBeInTheDocument();
      expect(within(select).getByText('Enterprise ($99)')).toBeInTheDocument();
    });

    it('should default to free plan', () => {
      render(<BillingManagement />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('free');
    });

    it('should allow changing plan selection', async () => {
      const user = userEvent.setup();
      render(<BillingManagement />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'pro');

      expect(select).toHaveValue('pro');
    });

    it('should call subscribe with correct plan and price for free', async () => {
      const subscribe = vi.fn();
      mockUseBillingManagement.mockReturnValue({ ...defaultMockReturn, subscribe });

      const user = userEvent.setup();
      render(<BillingManagement />);

      await user.click(screen.getByText('Subscribe'));

      expect(subscribe).toHaveBeenCalledWith('free', 0);
    });

    it('should call subscribe with correct plan and price for pro', async () => {
      const subscribe = vi.fn();
      mockUseBillingManagement.mockReturnValue({ ...defaultMockReturn, subscribe });

      const user = userEvent.setup();
      render(<BillingManagement />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'pro');
      await user.click(screen.getByText('Subscribe'));

      expect(subscribe).toHaveBeenCalledWith('pro', 49);
    });

    it('should call subscribe with correct plan and price for enterprise', async () => {
      const subscribe = vi.fn();
      mockUseBillingManagement.mockReturnValue({ ...defaultMockReturn, subscribe });

      const user = userEvent.setup();
      render(<BillingManagement />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'enterprise');
      await user.click(screen.getByText('Subscribe'));

      expect(subscribe).toHaveBeenCalledWith('enterprise', 99);
    });
  });

  describe('active subscription display', () => {
    it('should display subscription details when active', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);

      expect(screen.getByText('Plan: pro')).toBeInTheDocument();
      expect(screen.getByText('Status: active')).toBeInTheDocument();
      // Price is displayed as "Price: $49/month" - use getAllByText since $49 also appears in dropdown
      const priceMatches = screen.getAllByText(/\$49/);
      expect(priceMatches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/\/month/)).toBeInTheDocument();
    });

    it('should show cancel button for active subscription', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
    });

    it('should not show cancel button for canceled subscription', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'canceled',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      expect(screen.queryByText('Cancel Subscription')).not.toBeInTheDocument();
    });

    it('should display renewal date', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      expect(screen.getByText(/Renews:/)).toBeInTheDocument();
    });
  });

  describe('payment method', () => {
    it('should render payment method input', () => {
      render(<BillingManagement />);
      expect(screen.getByPlaceholderText('Enter card last 4 digits')).toBeInTheDocument();
    });

    it('should render Update Payment button', () => {
      render(<BillingManagement />);
      expect(screen.getByText('Update Payment')).toBeInTheDocument();
    });

    it('should call updatePaymentMethod with input value', async () => {
      const updatePaymentMethod = vi.fn();
      mockUseBillingManagement.mockReturnValue({ ...defaultMockReturn, updatePaymentMethod });

      const user = userEvent.setup();
      render(<BillingManagement />);

      const input = screen.getByPlaceholderText('Enter card last 4 digits');
      await user.type(input, '4242');
      await user.click(screen.getByText('Update Payment'));

      expect(updatePaymentMethod).toHaveBeenCalledWith('4242');
    });

    it('should allow updating with empty payment method', async () => {
      const updatePaymentMethod = vi.fn();
      mockUseBillingManagement.mockReturnValue({ ...defaultMockReturn, updatePaymentMethod });

      const user = userEvent.setup();
      render(<BillingManagement />);

      await user.click(screen.getByText('Update Payment'));

      expect(updatePaymentMethod).toHaveBeenCalledWith('');
    });
  });

  describe('cancel subscription', () => {
    it('should call cancelSubscription when cancel button is clicked', async () => {
      const cancelSubscription = vi.fn();
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        cancelSubscription,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      const user = userEvent.setup();
      render(<BillingManagement />);

      await user.click(screen.getByText('Cancel Subscription'));

      expect(cancelSubscription).toHaveBeenCalled();
    });
  });

  describe('logs display', () => {
    it('should show "No logs." when logs array is empty', () => {
      render(<BillingManagement />);
      expect(screen.getByText('No logs.')).toBeInTheDocument();
    });

    it('should display log entries', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        logs: [
          '[2024-01-15T10:00:00Z] Subscribed to pro plan',
          '[2024-01-15T09:00:00Z] Updated payment method: 4242',
        ],
      });

      render(<BillingManagement />);

      expect(screen.getByText('[2024-01-15T10:00:00Z] Subscribed to pro plan')).toBeInTheDocument();
      expect(screen.getByText('[2024-01-15T09:00:00Z] Updated payment method: 4242')).toBeInTheDocument();
    });

    it('should handle many log entries', () => {
      const manyLogs = Array.from({ length: 50 }, (_, i) => `Log entry ${i}`);
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        logs: manyLogs,
      });

      render(<BillingManagement />);

      expect(screen.getByText('Log entry 0')).toBeInTheDocument();
      expect(screen.getByText('Log entry 49')).toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('should have subscribe button with correct styling class', () => {
      render(<BillingManagement />);
      const subscribeButton = screen.getByText('Subscribe');
      expect(subscribeButton).toHaveClass('bg-blue-500');
    });

    it('should have update payment button with correct styling class', () => {
      render(<BillingManagement />);
      const updateButton = screen.getByText('Update Payment');
      expect(updateButton).toHaveClass('bg-green-500');
    });

    it('should have cancel button with correct styling class', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      const cancelButton = screen.getByText('Cancel Subscription');
      expect(cancelButton).toHaveClass('bg-red-500');
    });
  });

  describe('accessibility', () => {
    it('should have accessible form controls', () => {
      render(<BillingManagement />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('should have heading structure', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle subscription with zero price', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'free',
          price: 0,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      // Price is displayed as "$0/month" in the subscription section
      expect(screen.getByText('Plan: free')).toBeInTheDocument();
    });

    it('should handle subscription with trial status', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'pro',
          price: 49,
          status: 'trial',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      expect(screen.getByText('Status: trial')).toBeInTheDocument();
      // Trial is not 'active', so no cancel button
      expect(screen.queryByText('Cancel Subscription')).not.toBeInTheDocument();
    });

    it('should handle very long plan names', () => {
      mockUseBillingManagement.mockReturnValue({
        ...defaultMockReturn,
        subscription: {
          plan: 'super-enterprise-unlimited-premium-plus',
          price: 999,
          status: 'active',
          renewalDate: new Date('2024-02-15'),
        },
      });

      render(<BillingManagement />);
      expect(screen.getByText('Plan: super-enterprise-unlimited-premium-plus')).toBeInTheDocument();
    });
  });
});
