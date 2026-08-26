import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackSystem } from '../components/FeedbackSystem';

vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => `feedback-id-${Math.random().toString(36).substr(2, 9)}`),
}));

describe('FeedbackSystem Component', () => {
  // Note: Removed fake timers due to React 19 + userEvent compatibility issues

  describe('basic rendering', () => {
    it('should render the title', () => {
      render(<FeedbackSystem />);
      expect(screen.getByText('Feedback & Review Demo')).toBeInTheDocument();
    });

    it('should render rating select', () => {
      render(<FeedbackSystem />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render comment textarea', () => {
      render(<FeedbackSystem />);
      expect(screen.getByPlaceholderText('Leave a comment...')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<FeedbackSystem />);
      expect(screen.getByRole('button', { name: 'Submit Feedback' })).toBeInTheDocument();
    });

    it('should render "No feedback yet" when empty', () => {
      render(<FeedbackSystem />);
      expect(screen.getByText('No feedback yet.')).toBeInTheDocument();
    });

    it('should render logs section', () => {
      render(<FeedbackSystem />);
      expect(screen.getByText('Logs')).toBeInTheDocument();
    });
  });

  describe('rating selection', () => {
    it('should default to rating 5', () => {
      render(<FeedbackSystem />);
      expect(screen.getByRole('combobox')).toHaveValue('5');
    });

    it('should render all rating options', () => {
      render(<FeedbackSystem />);
      const select = screen.getByRole('combobox');

      for (let i = 1; i <= 5; i++) {
        expect(select).toContainHTML(`<option value="${i}">${i}</option>`);
      }
    });

    it('should allow changing rating', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      await user.selectOptions(screen.getByRole('combobox'), '3');

      expect(screen.getByRole('combobox')).toHaveValue('3');
    });
  });

  describe('submit feedback', () => {
    it('should submit feedback with comment', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Great product!');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      expect(screen.getByText('Great product!')).toBeInTheDocument();
    });

    it('should display rating with feedback', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      await user.selectOptions(screen.getByRole('combobox'), '4');
      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Nice!');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      expect(screen.getByText('4 / 5')).toBeInTheDocument();
    });

    it('should clear form after submission', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      await user.selectOptions(screen.getByRole('combobox'), '3');
      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      // Comment should be cleared
      expect(textarea).toHaveValue('');
      // Rating should reset to 5
      expect(screen.getByRole('combobox')).toHaveValue('5');
    });

    it('should disable submit when comment is empty', () => {
      render(<FeedbackSystem />);

      const button = screen.getByRole('button', { name: 'Submit Feedback' });
      expect(button).toBeDisabled();
    });

    it('should disable submit when comment is whitespace only', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, '   ');

      const button = screen.getByRole('button', { name: 'Submit Feedback' });
      expect(button).toBeDisabled();
    });

    it('should enable submit when comment has content', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test comment');

      const button = screen.getByRole('button', { name: 'Submit Feedback' });
      expect(button).not.toBeDisabled();
    });
  });

  describe('feedback display', () => {
    it('should display feedback timestamp', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      // Should display timestamp (ISO format or localized - check for date-like patterns)
      // Use getAllByText since multiple elements may match (e.g., logs and display)
      const timestamps = screen.getAllByText(/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[\/\-,]\d{1,2}[\/\-,]\d{2,4}/);
      expect(timestamps.length).toBeGreaterThanOrEqual(1);
    });

    it('should remove "No feedback yet" after submission', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      expect(screen.queryByText('No feedback yet.')).not.toBeInTheDocument();
    });
  });

  describe('delete feedback', () => {
    it('should render delete button for each feedback item', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should remove feedback when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'To be deleted');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
      expect(screen.getByText('No feedback yet.')).toBeInTheDocument();
    });
  });

  describe('multiple feedback items', () => {
    it('should handle multiple feedback submissions', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');

      // First feedback
      await user.type(textarea, 'First feedback');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      // Second feedback
      await user.selectOptions(screen.getByRole('combobox'), '3');
      await user.type(textarea, 'Second feedback');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      expect(screen.getByText('First feedback')).toBeInTheDocument();
      expect(screen.getByText('Second feedback')).toBeInTheDocument();
    });

    it('should only delete the clicked feedback', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');

      await user.type(textarea, 'First');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      await user.type(textarea, 'Second');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      // Get all delete buttons and click the first one
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('logs display', () => {
    it('should show log when feedback is added', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test feedback');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));

      const logsSection = screen.getByText('Logs').parentElement;
      expect(logsSection).toHaveTextContent('Added feedback');
    });

    it('should show log when feedback is deleted', async () => {
      const user = userEvent.setup();
      render(<FeedbackSystem />);

      const textarea = screen.getByPlaceholderText('Leave a comment...');
      await user.type(textarea, 'Test');
      await user.click(screen.getByRole('button', { name: 'Submit Feedback' }));
      await user.click(screen.getByRole('button', { name: 'Delete' }));

      const logsSection = screen.getByText('Logs').parentElement;
      expect(logsSection).toHaveTextContent('Removed feedback');
    });
  });

  describe('accessibility', () => {
    it('should have accessible form controls', () => {
      render(<FeedbackSystem />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Feedback' })).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<FeedbackSystem />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
