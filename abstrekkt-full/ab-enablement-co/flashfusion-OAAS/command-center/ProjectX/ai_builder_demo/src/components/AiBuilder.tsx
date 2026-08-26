import React, { useState } from 'react';
import useAiBuilder from './useAiBuilder';

/**
 * AiBuilder is a functional React component that guides the user through
 * a simplified AI‑powered creation workflow.  It displays five steps
 * (Describe, Analyze, Generate, Test, Deploy) and uses a custom hook
 * to manage progress, status and logs.  Replace the simulated logic
 * in useAiBuilder with real API calls to integrate this into your
 * application.
 */
const AiBuilder: React.FC = () => {
  const [description, setDescription] = useState('');
  const {
    currentStep,
    progress,
    logs,
    startProcess,
    isRunning,
  } = useAiBuilder();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please enter a description of your project.');
      return;
    }
    // Sanitize input before sending to backend (example only; implement robust sanitization)
    const sanitized = description.replace(/<[^>]*>/g, '').trim();
    startProcess(sanitized);
  };

  const steps = ['Describe', 'Analyze', 'Generate', 'Test', 'Deploy'];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h2>AI Builder Demo</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <label htmlFor="desc-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Describe your app idea:
        </label>
        <textarea
          id="desc-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
          disabled={isRunning}
        />
        <button type="submit" disabled={isRunning} style={{ marginTop: '0.75rem' }}>
          {isRunning ? 'Processing…' : 'Start'}
        </button>
      </form>
      <div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {steps.map((step, index) => (
            <li
              key={step}
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                marginBottom: '0.5rem',
                background:
                  index === currentStep ? '#e0f7fa' : index < currentStep ? '#a5d6a7' : '#fafafa',
              }}
            >
              {index + 1}. {step}
              {index === currentStep && (
                <span style={{ marginLeft: '0.5rem' }}>({progress}% complete)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Logs</h3>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            height: '200px',
            overflow: 'auto',
          }}
        >
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default AiBuilder;