import { useCallback, useState } from 'react';

/**
 * Represents a simple user with email and optional name.  In a real
 * authentication system you would also store a user ID, roles and
 * access tokens.  Credentials are never persisted client side in
 * production; they are stored in secure cookies or browser storage via
 * HTTP‑only cookies or a trusted auth library.
 */
export interface User {
  email: string;
  name?: string;
}

/**
 * Hook return type for authentication.  Exposes the current user
 * (null if unauthenticated), a log of auth events and functions to
 * sign up, sign in and sign out.  In production these functions
 * perform API requests and handle tokens.
 */
export interface UseAuthResult {
  user: User | null;
  logs: string[];
  status: 'idle' | 'pending' | 'authenticated';
  signUp: (email: string, password: string, name: string) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

/**
 * useAuth implements a very simple authentication flow with simulated
 * network delays.  It validates inputs, sets a pending state while
 * “authenticating” and logs actions.  Password strength is not
 * enforced in this demo; in production enforce complexity and use
 * secure password hashing on the server.
 */
const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'pending' | 'authenticated'>('idle');

  const appendLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const validatePassword = (pw: string): boolean => {
    return pw.length >= 6; // minimal length check; replace with stronger validation
  };

  const signUp = useCallback((email: string, password: string, name: string) => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!validateEmail(trimmedEmail)) {
      appendLog('Invalid email address');
      return;
    }
    if (!validatePassword(password)) {
      appendLog('Password must be at least 6 characters long');
      return;
    }
    if (!trimmedName) {
      appendLog('Name is required for sign up');
      return;
    }
    setStatus('pending');
    appendLog('Signing up…');
    // Simulate async request
    setTimeout(() => {
      setUser({ email: trimmedEmail, name: trimmedName });
      setStatus('authenticated');
      appendLog(`Signed up successfully as ${trimmedEmail}`);
    }, 1000);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      appendLog('Invalid email address');
      return;
    }
    if (!validatePassword(password)) {
      appendLog('Password must be at least 6 characters long');
      return;
    }
    setStatus('pending');
    appendLog('Signing in…');
    // Simulated network call
    setTimeout(() => {
      // Accept any credentials for demo purposes
      setUser({ email: trimmedEmail });
      setStatus('authenticated');
      appendLog(`Signed in as ${trimmedEmail}`);
    }, 800);
  }, []);

  const signOut = useCallback(() => {
    if (user) {
      appendLog(`Signed out ${user.email}`);
    }
    setUser(null);
    setStatus('idle');
  }, [user]);

  return { user, logs, status, signUp, signIn, signOut };
};

export default useAuth;