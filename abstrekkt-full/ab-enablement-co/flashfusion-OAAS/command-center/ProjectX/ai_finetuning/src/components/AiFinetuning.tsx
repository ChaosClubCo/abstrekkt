import React, { useState } from 'react';
import { useAiFinetuning } from './useAiFinetuning';

/**
 * Demo component for AI model selection and fine‑tuning management. Users
 * can choose which AI model to use for generation tasks, adjust
 * basic hyperparameters, and launch a training job. The component
 * displays current models with their status and accuracy, as well as
 * active training jobs and logs of actions performed.
 */
export const AiFinetuning: React.FC = () => {
  const { models, selectedModelId, trainingJobs, logs, selectModel, startTraining } = useAiFinetuning();
  const [learningRate, setLearningRate] = useState('0.001');
  const [epochs, setEpochs] = useState('3');

  const handleTrain = () => {
    const params: Record<string, any> = {
      learningRate: parseFloat(learningRate),
      epochs: parseInt(epochs, 10),
    };
    startTraining(selectedModelId, params);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, maxWidth: 700 }}>
      <h2>AI Fine‑Tuning & Model Management Demo</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Available Models</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {models.map((model) => (
              <li key={model.id} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input
                    type="radio"
                    name="selectedModel"
                    checked={selectedModelId === model.id}
                    onChange={() => selectModel(model.id)}
                  />{' '}
                  <strong>{model.name}</strong> – {model.description} (status: {model.status}, accuracy: {Math.round((model.accuracy || 0) * 100)}%)
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Hyperparameters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>
              Learning Rate:
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                max="1"
                value={learningRate}
                onChange={(e) => setLearningRate(e.target.value)}
              />
            </label>
            <label>
              Epochs:
              <input
                type="number"
                min="1"
                max="50"
                value={epochs}
                onChange={(e) => setEpochs(e.target.value)}
              />
            </label>
            <button onClick={handleTrain} disabled={models.find((m) => m.id === selectedModelId)?.status === 'training'}>
              Start Training
            </button>
          </div>
        </div>
      </div>
      <div>
        <h3>Training Jobs</h3>
        {Object.keys(trainingJobs).length === 0 ? (
          <p>No training jobs started yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Job ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Started At</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(trainingJobs).map((job) => (
                <tr key={job.id}>
                  <td style={{ padding: '0.5rem' }}>{job.id}</td>
                  <td style={{ padding: '0.5rem' }}>{job.status}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(job.startedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h4>Logs</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto' }}>
          {logs.map((log, i) => (
            <li key={i} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AiFinetuning;