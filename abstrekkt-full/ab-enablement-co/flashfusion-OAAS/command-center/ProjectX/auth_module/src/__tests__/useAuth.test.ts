import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '../hooks/useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have null user initially', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
    });

    it('should have empty logs initially', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.logs).toEqual([]);
    });

    it('should have idle status initially', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.status).toBe('idle');
    });

    it('should expose signUp, signIn, and signOut functions', () => {
      const { result } = renderHook(() => useAuth());
      expect(typeof result.current.signUp).toBe('function');
      expect(typeof result.current.signIn).toBe('function');
      expect(typeof result.current.signOut).toBe('function');
    });
  });

  describe('signUp flow', () => {
    it('should set pending status during sign up', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', 'Test User');
      });

      expect(result.current.status).toBe('pending');
      expect(result.current.logs).toContain('Signing up…');
    });

    it('should successfully sign up with valid credentials', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', 'Test User');
      });

      // Advance timer to complete the async operation
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.user).toEqual({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(result.current.status).toBe('authenticated');
      expect(result.current.logs).toContain('Signed up successfully as test@example.com');
    });

    it('should trim email and name during sign up', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('  test@example.com  ', 'password123', '  Test User  ');
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.user).toEqual({
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should reject invalid email during sign up', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('invalid-email', 'password123', 'Test User');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.logs).toContain('Invalid email address');
    });

    it('should reject email without domain', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@', 'password123', 'Test User');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.logs).toContain('Invalid email address');
    });

    it('should reject email without TLD', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example', 'password123', 'Test User');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.logs).toContain('Invalid email address');
    });

    it('should reject short password during sign up', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', '12345', 'Test User');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.logs).toContain('Password must be at least 6 characters long');
    });

    it('should accept password with exactly 6 characters', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', '123456', 'Test User');
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.user).not.toBeNull();
      expect(result.current.status).toBe('authenticated');
    });

    it('should reject empty name during sign up', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', '');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.logs).toContain('Name is required for sign up');
    });

    it('should reject whitespace-only name during sign up', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', '   ');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.logs).toContain('Name is required for sign up');
    });

    it('should validate email before password', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('invalid', '123', 'Test User');
      });

      // Should fail on email first, not password
      expect(result.current.logs).toContain('Invalid email address');
      expect(result.current.logs).not.toContain('Password must be at least 6 characters long');
    });
  });

  describe('signIn flow', () => {
    it('should set pending status during sign in', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      expect(result.current.status).toBe('pending');
      expect(result.current.logs).toContain('Signing in…');
    });

    it('should successfully sign in with valid credentials', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user).toEqual({
        email: 'test@example.com',
      });
      expect(result.current.status).toBe('authenticated');
      expect(result.current.logs).toContain('Signed in as test@example.com');
    });

    it('should trim email during sign in', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('  test@example.com  ', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user?.email).toBe('test@example.com');
    });

    it('should not include name when signing in (only sign up provides name)', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user?.name).toBeUndefined();
    });

    it('should reject invalid email during sign in', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('not-an-email', 'password123');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.logs).toContain('Invalid email address');
    });

    it('should reject short password during sign in', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'short');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.logs).toContain('Password must be at least 6 characters long');
    });

    it('should have shorter delay than sign up (800ms vs 1000ms)', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      // After 800ms, sign in should complete
      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.status).toBe('authenticated');
    });
  });

  describe('signOut flow', () => {
    it('should clear user on sign out', async () => {
      const { result } = renderHook(() => useAuth());

      // First sign in
      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user).not.toBeNull();

      // Then sign out
      act(() => {
        result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it('should set status to idle on sign out', async () => {
      const { result } = renderHook(() => useAuth());

      // First sign in
      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.status).toBe('authenticated');

      // Then sign out
      act(() => {
        result.current.signOut();
      });

      expect(result.current.status).toBe('idle');
    });

    it('should log sign out with user email', async () => {
      const { result } = renderHook(() => useAuth());

      // First sign in
      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Then sign out
      act(() => {
        result.current.signOut();
      });

      expect(result.current.logs).toContain('Signed out test@example.com');
    });

    it('should not log anything when signing out without being logged in', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signOut();
      });

      // Should not have any sign out log message since user was null
      const signOutLogs = result.current.logs.filter((log) => log.includes('Signed out'));
      expect(signOutLogs).toHaveLength(0);
    });

    it('should allow signing in again after sign out', async () => {
      const { result } = renderHook(() => useAuth());

      // First sign in
      act(() => {
        result.current.signIn('first@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Sign out
      act(() => {
        result.current.signOut();
      });

      // Sign in again with different email
      act(() => {
        result.current.signIn('second@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user?.email).toBe('second@example.com');
      expect(result.current.status).toBe('authenticated');
    });
  });

  describe('error handling', () => {
    it('should accumulate multiple error logs', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('invalid', 'password123');
      });

      act(() => {
        result.current.signIn('test@example.com', 'short');
      });

      act(() => {
        result.current.signUp('invalid', 'password123', 'Name');
      });

      expect(result.current.logs).toContain('Invalid email address');
      expect(result.current.logs).toContain('Password must be at least 6 characters long');
      expect(result.current.logs.filter((l) => l === 'Invalid email address')).toHaveLength(2);
    });

    it('should not change status on validation error', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('invalid', 'password123');
      });

      expect(result.current.status).toBe('idle');
    });

    it('should preserve logs across successful operations', async () => {
      const { result } = renderHook(() => useAuth());

      // First a failed attempt
      act(() => {
        result.current.signIn('invalid', 'password123');
      });

      // Then a successful one
      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.logs).toContain('Invalid email address');
      expect(result.current.logs).toContain('Signing in…');
      expect(result.current.logs).toContain('Signed in as test@example.com');
    });
  });

  describe('loading states', () => {
    it('should be idle before any action', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.status).toBe('idle');
    });

    it('should be pending during sign up async operation', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', 'Test User');
      });

      expect(result.current.status).toBe('pending');

      // Advance partway through
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.status).toBe('pending');
    });

    it('should be pending during sign in async operation', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      expect(result.current.status).toBe('pending');

      // Advance partway through
      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.status).toBe('pending');
    });

    it('should transition to authenticated after successful sign up', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp('test@example.com', 'password123', 'Test User');
      });

      expect(result.current.status).toBe('pending');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.status).toBe('authenticated');
    });

    it('should transition to authenticated after successful sign in', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      expect(result.current.status).toBe('pending');

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.status).toBe('authenticated');
    });

    it('should return to idle after sign out', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test@example.com', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.status).toBe('authenticated');

      act(() => {
        result.current.signOut();
      });

      expect(result.current.status).toBe('idle');
    });
  });

  describe('email validation edge cases', () => {
    it('should accept valid complex email addresses', async () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('user.name+tag@subdomain.example.co.uk', 'password123');
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(result.current.user?.email).toBe('user.name+tag@subdomain.example.co.uk');
    });

    it('should reject email with spaces', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('test @example.com', 'password123');
      });

      expect(result.current.logs).toContain('Invalid email address');
    });

    it('should reject empty email', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signIn('', 'password123');
      });

      expect(result.current.logs).toContain('Invalid email address');
    });
  });
});
