import { useState } from 'react';
import { nanoid } from 'nanoid';

/**
 * Representation of an AI model available in the platform.
 */
export interface AiModel {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'training' | 'error';
  accuracy?: number;
}

/**
 * Hook to manage AI model selection and fine‑tuning settings.
 * Provides functions to select a model, start a fine‑tuning job,
 * update hyperparameters, and monitor training progress. In
 * production this would integrate with your ML infrastructure to
 * trigger fine‑tuning jobs and receive status updates.
 */
export function useAiFinetuning() {
  // Predefined models (in practice these would be loaded from an API)
  const [models, setModels] = useState<AiModel[]>([
    { id: 'base', name: 'Base Model', description: 'General purpose code generation model.', status: 'ready', accuracy: 0.85 },
    { id: 'ui', name: 'UI Model', description: 'Specialized in generating UI layouts and components.', status: 'ready', accuracy: 0.9 },
  ]);
  const [selectedModelId, setSelectedModelId] = useState<string>('base');
  const [trainingJobs, setTrainingJobs] = useState<Record<string, { id: string; status: string; startedAt: string }>>({});
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * Select a model for use in the AI builder.
   */
  const selectModel = (id: string) => {
    setSelectedModelId(id);
    setLogs((prev) => [`[${new Date().toISOString()}] Selected model: ${id}`, ...prev]);
  };

  /**
   * Start a fine‑tuning job for a given model with optional hyperparameters.
   * This is a stub that simulates job creation. It sets the model status
   * to "training" and logs the action. It will automatically complete
   * after a timeout (simulated). In production, you would call a
   * training service and poll for status.
   */
  const startTraining = (modelId: string, hyperparams: Record<string, any>) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, status: 'training' } : m)));
    const jobId = nanoid();
    const startedAt = new Date().toISOString();
    setTrainingJobs((prev) => ({ ...prev, [jobId]: { id: jobId, status: 'running', startedAt } }));
    setLogs((prev) => [
      `[${startedAt}] Started training job ${jobId} for model ${modelId} with params ${JSON.stringify(hyperparams)}`,
      ...prev,
    ]);
    // simulate training completion after 3 seconds
    setTimeout(() => {
      setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, status: 'ready', accuracy: Math.min(1, (m.accuracy || 0.8) + 0.02) } : m)));
      setTrainingJobs((prev) => ({ ...prev, [jobId]: { ...prev[jobId], status: 'completed' } }));
      setLogs((prev) => [
        `[${new Date().toISOString()}] Training job ${jobId} completed successfully`,
        ...prev,
      ]);
    }, 3000);
  };

  return {
    models,
    selectedModelId,
    trainingJobs,
    logs,
    selectModel,
    startTraining,
  };
}