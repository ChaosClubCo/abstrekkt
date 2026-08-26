import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

/**
 * Auth component toggles between sign‑up and sign‑in forms.  It uses
 * the useAuth hook to manage authentication state and logs.  Error
 * messages are appended to the log rather than displayed inline for
 * simplicity; customise this behaviour in a real application.
 */
const Auth: React.FC = () => {
  const { user, logs, status, signUp, signIn, signOut } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      signUp(email, password, name);
    } else {
      signIn(email, password);
    }
  };

  if (user) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
        <h2>Welcome, {user.name || user.email}</h2>
        <p>You are signed in.</p>
        <button type="button" onClick={signOut} disabled={status === 'pending'}>
          Sign Out
        </button>
        <div style={{ marginTop: '1rem' }}>
          <h3>Log</h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '0.5rem',
              height: '160px',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}
          >
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h2>{mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === 'pending'}
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'pending'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status === 'pending'}
        />
        <button type="submit" disabled={status === 'pending'}>
          {status === 'pending' ? 'Please wait…' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <div style={{ marginTop: '0.5rem' }}>
        <button type="button" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} disabled={status === 'pending'}>
          {mode === 'signup' ? 'Have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h3>Log</h3>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '0.5rem',
            height: '160px',
            overflow: 'auto',
            fontSize: '0.8rem',
          }}
        >
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default Auth;