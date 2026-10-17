import React, { FormEvent, useState } from 'react';
import { writeConsoleToken } from './consoleToken';

type AccessGateProps = {
  mode: 'token' | 'unconfigured';
  message?: string;
  onUnlocked: () => void;
};

/**
 * Unlock form shown when the Control API proxy rejects the caller (401)
 * or when operator secrets are missing/revoked (503).
 */
export default function AccessGate({ mode, message, onUnlocked }: AccessGateProps) {
  const [token, setToken] = useState('');
  const unconfigured = mode === 'unconfigured';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unconfigured) return;
    writeConsoleToken(token);
    setToken('');
    onUnlocked();
  }

  return (
    <main className="appShell">
      <header className="topbar">
        <div>
          <div className="brand">LOXIHART</div>
          <div className="product">Pilot Console</div>
        </div>
        <span className="authority bad">Access locked</span>
      </header>
      <section className="accessGate">
        <p className="eyebrow">Restricted control plane</p>
        <h1>{unconfigured ? 'Proxy is fail-closed' : 'Unlock Pilot Console'}</h1>
        <p className="lede">
          {unconfigured
            ? 'LOXIHART_CONSOLE_TOKEN and LOXIHART_DEMO_TOKEN must be set to non-revoked secrets before this console can reach the Control API.'
            : 'This console no longer forwards unauthenticated Control API calls. Enter the operator console token for this environment.'}
        </p>
        {message ? <p className="notice error">{message}</p> : null}
        {unconfigured ? (
          <p className="fine">The leaked public demo token is rejected even if it is still present in environment variables.</p>
        ) : (
          <form className="accessForm" onSubmit={handleSubmit}>
            <label htmlFor="console-token">Console token</label>
            <input
              id="console-token"
              type="password"
              name="consoleToken"
              autoComplete="off"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
            />
            <button className="primary" type="submit">Unlock</button>
          </form>
        )}
      </section>
    </main>
  );
}
