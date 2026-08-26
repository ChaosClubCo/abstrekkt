import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../components/Auth';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => {
  return {
    default: vi.fn(),
  };
});

// Import the mocked module
import useAuth from '../hooks/useAuth';

const mockUseAuth = vi.mocked(useAuth);

describe('Auth component', () => {
  const defaultMockReturn = {
    user: null,
    logs: [],
    status: 'idle' as const,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ ...defaultMockReturn });
  });

  describe('sign-in form (default view)', () => {
    it('should render sign-in form by default', () => {
      render(<Auth />);

      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should not show name field in sign-in mode', () => {
      render(<Auth />);

      expect(screen.queryByPlaceholderText('Full name')).not.toBeInTheDocument();
    });

    it('should show toggle button to switch to sign up', () => {
      render(<Auth />);

      expect(
        screen.getByRole('button', { name: "Don't have an account? Sign Up" })
      ).toBeInTheDocument();
    });

    it('should call signIn with email and password on form submission', async () => {
      const signIn = vi.fn();
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, signIn });

      render(<Auth />);

      await userEvent.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should call signIn on form submit via enter key', async () => {
      const signIn = vi.fn();
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, signIn });

      render(<Auth />);

      const emailInput = screen.getByPlaceholderText('Email address');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');

      fireEvent.submit(emailInput.closest('form')!);

      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  describe('sign-up form (toggled view)', () => {
    it('should render sign-up form when toggled', async () => {
      render(<Auth />);

      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('should show toggle button to switch back to sign in', async () => {
      render(<Auth />);

      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      expect(
        screen.getByRole('button', { name: 'Have an account? Sign In' })
      ).toBeInTheDocument();
    });

    it('should call signUp with name, email, and password on form submission', async () => {
      const signUp = vi.fn();
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, signUp });

      render(<Auth />);

      // Toggle to sign up mode
      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      await userEvent.type(screen.getByPlaceholderText('Full name'), 'Test User');
      await userEvent.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      expect(signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });

    it('should toggle back to sign-in form', async () => {
      render(<Auth />);

      // Toggle to sign up
      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();

      // Toggle back to sign in
      fireEvent.click(screen.getByRole('button', { name: 'Have an account? Sign In' }));
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading text on submit button when pending', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });

      render(<Auth />);

      expect(screen.getByRole('button', { name: 'Please wait…' })).toBeInTheDocument();
    });

    it('should disable email input when pending', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });

      render(<Auth />);

      expect(screen.getByPlaceholderText('Email address')).toBeDisabled();
    });

    it('should disable password input when pending', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });

      render(<Auth />);

      expect(screen.getByPlaceholderText('Password')).toBeDisabled();
    });

    it('should disable submit button when pending', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });

      render(<Auth />);

      expect(screen.getByRole('button', { name: 'Please wait…' })).toBeDisabled();
    });

    it('should disable toggle button when pending', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });

      render(<Auth />);

      expect(
        screen.getByRole('button', { name: "Don't have an account? Sign Up" })
      ).toBeDisabled();
    });

    it('should disable name input in sign-up mode when pending', async () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'idle' });
      const { rerender } = render(<Auth />);

      // Toggle to sign up first while idle
      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      // Now set to pending
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, status: 'pending' });
      rerender(<Auth />);

      expect(screen.getByPlaceholderText('Full name')).toBeDisabled();
    });
  });

  describe('authenticated view (user info)', () => {
    const authenticatedUser = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should display user info when logged in', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: authenticatedUser,
        status: 'authenticated',
      });

      render(<Auth />);

      expect(screen.getByRole('heading', { name: 'Welcome, Test User' })).toBeInTheDocument();
      expect(screen.getByText('You are signed in.')).toBeInTheDocument();
    });

    it('should display email if name is not available', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: { email: 'test@example.com' },
        status: 'authenticated',
      });

      render(<Auth />);

      expect(screen.getByRole('heading', { name: 'Welcome, test@example.com' })).toBeInTheDocument();
    });

    it('should display sign out button when logged in', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: authenticatedUser,
        status: 'authenticated',
      });

      render(<Auth />);

      expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    });

    it('should not show the sign-in form when logged in', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: authenticatedUser,
        status: 'authenticated',
      });

      render(<Auth />);

      expect(screen.queryByPlaceholderText('Email address')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
    });
  });

  describe('sign out functionality', () => {
    const authenticatedUser = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should call signOut when sign out button is clicked', async () => {
      const signOut = vi.fn();
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: authenticatedUser,
        status: 'authenticated',
        signOut,
      });

      render(<Auth />);

      fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

      expect(signOut).toHaveBeenCalledTimes(1);
    });

    it('should disable sign out button when pending', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: authenticatedUser,
        status: 'pending',
      });

      render(<Auth />);

      expect(screen.getByRole('button', { name: 'Sign Out' })).toBeDisabled();
    });
  });

  describe('log display', () => {
    it('should display logs in sign-in view', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        logs: ['First log entry', 'Second log entry'],
      });

      render(<Auth />);

      expect(screen.getByText('Log')).toBeInTheDocument();
      const logContainer = screen.getByText(/First log entry/);
      expect(logContainer).toBeInTheDocument();
      expect(screen.getByText(/Second log entry/)).toBeInTheDocument();
    });

    it('should display logs in authenticated view', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: { email: 'test@example.com', name: 'Test' },
        status: 'authenticated',
        logs: ['Signed in as test@example.com'],
      });

      render(<Auth />);

      expect(screen.getByText('Log')).toBeInTheDocument();
      expect(screen.getByText(/Signed in as test@example.com/)).toBeInTheDocument();
    });

    it('should display empty log area when no logs', () => {
      mockUseAuth.mockReturnValue({ ...defaultMockReturn, logs: [] });

      render(<Auth />);

      expect(screen.getByText('Log')).toBeInTheDocument();
      // The pre element should exist but be empty
      const preElement = screen.getByText('Log').nextElementSibling;
      expect(preElement?.tagName).toBe('PRE');
    });

    it('should join multiple logs with newlines', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        logs: ['Log 1', 'Log 2', 'Log 3'],
      });

      render(<Auth />);

      // The logs should be joined with newlines
      const preElement = screen.getByText(/Log 1/);
      expect(preElement.textContent).toBe('Log 1\nLog 2\nLog 3');
    });
  });

  describe('form field interactions', () => {
    it('should update email field value as user types', async () => {
      render(<Auth />);

      const emailInput = screen.getByPlaceholderText('Email address') as HTMLInputElement;
      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field value as user types', async () => {
      render(<Auth />);

      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
      await userEvent.type(passwordInput, 'mypassword');

      expect(passwordInput.value).toBe('mypassword');
    });

    it('should update name field value as user types in sign-up mode', async () => {
      render(<Auth />);

      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      const nameInput = screen.getByPlaceholderText('Full name') as HTMLInputElement;
      await userEvent.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');
    });

    it('should have correct input types', () => {
      render(<Auth />);

      expect(screen.getByPlaceholderText('Email address')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('should have text type for name field', async () => {
      render(<Auth />);

      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      expect(screen.getByPlaceholderText('Full name')).toHaveAttribute('type', 'text');
    });
  });

  describe('form state preservation on toggle', () => {
    it('should preserve email when toggling between modes', async () => {
      render(<Auth />);

      const emailInput = screen.getByPlaceholderText('Email address') as HTMLInputElement;
      await userEvent.type(emailInput, 'test@example.com');

      // Toggle to sign up
      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      const emailInputAfterToggle = screen.getByPlaceholderText('Email address') as HTMLInputElement;
      expect(emailInputAfterToggle.value).toBe('test@example.com');
    });

    it('should preserve password when toggling between modes', async () => {
      render(<Auth />);

      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
      await userEvent.type(passwordInput, 'mypassword');

      // Toggle to sign up
      fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));

      const passwordInputAfterToggle = screen.getByPlaceholderText('Password') as HTMLInputElement;
      expect(passwordInputAfterToggle.value).toBe('mypassword');
    });
  });

  describe('button behavior', () => {
    it('should have submit type for the form submit button', () => {
      render(<Auth />);

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should have button type for the toggle button', () => {
      render(<Auth />);

      const toggleButton = screen.getByRole('button', { name: "Don't have an account? Sign Up" });
      expect(toggleButton).toHaveAttribute('type', 'button');
    });

    it('should have button type for the sign out button', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockReturn,
        user: { email: 'test@example.com' },
        status: 'authenticated',
      });

      render(<Auth />);

      const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
      expect(signOutButton).toHaveAttribute('type', 'button');
    });
  });
});
