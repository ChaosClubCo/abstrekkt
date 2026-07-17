import React, { useState } from 'react';
import { useCustomDomain } from './useCustomDomain';

/**
 * Demo component for managing custom domains and SSL certificates. Users
 * can add domains, start DNS verification, and enable SSL. The
 * component simulates asynchronous verification and logs actions.
 */
export const CustomDomainSSL: React.FC = () => {
  const { domains, addDomain, startVerification, enableSSL, logs } = useCustomDomain();
  const [domainInput, setDomainInput] = useState('');

  const handleAdd = () => {
    addDomain(domainInput);
    setDomainInput('');
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Custom Domains & SSL Management Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="yourdomain.com"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={handleAdd} disabled={!domainInput.trim()}>Add Domain</button>
      </div>
      <div>
        <h3>Domains</h3>
        {domains.length === 0 ? (
          <p>No custom domains added.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Domain</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>SSL</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: '0.5rem' }}>{d.domain}</td>
                  <td style={{ padding: '0.5rem' }}>{d.status}</td>
                  <td style={{ padding: '0.5rem' }}>{d.sslEnabled ? 'Enabled' : 'Disabled'}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {d.status === 'pending' && (
                      <button onClick={() => startVerification(d.id)}>
                        Verify
                      </button>
                    )}
                    {d.status === 'active' && !d.sslEnabled && (
                      <button onClick={() => enableSSL(d.id)}>
                        Enable SSL
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h4>Logs</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', fontSize: '0.8rem' }}>
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomDomainSSL;