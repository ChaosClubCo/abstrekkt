import React from 'react';
import { useAiToolsMarketplace } from './useAiToolsMarketplace';

/**
 * Demo component for an AI tools marketplace. Displays a list of
 * available AI tools with their name, description, price, rating,
 * and install button. When a tool is installed, the button is
 * disabled and the log records the action.
 */
export const AiToolsMarketplace: React.FC = () => {
  const { tools, installTool, logs } = useAiToolsMarketplace();

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>AI Tools Marketplace Demo</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tools.map((tool) => (
          <div key={tool.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0' }}>{tool.name}</h3>
              <p style={{ margin: 0 }}>{tool.description}</p>
              <small>Rating: {tool.rating} / 5</small>
            </div>
            <div style={{ textAlign: 'right' }}>
              {tool.price > 0 ? <p>${tool.price.toFixed(2)}</p> : <p>Free</p>}
              <button onClick={() => installTool(tool.id)} disabled={tool.installed}>
                {tool.installed ? 'Installed' : 'Install'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
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

export default AiToolsMarketplace;