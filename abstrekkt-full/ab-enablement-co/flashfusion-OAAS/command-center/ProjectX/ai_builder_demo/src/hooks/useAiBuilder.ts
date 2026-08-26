import { useCallback, useEffect, useRef, useState } from 'react';

interface AiBuilderState {
  currentStep: number;
  progress: number;
  logs: string[];
  startProcess: (description: string) => void;
  isRunning: boolean;
}

/**
 * useAiBuilder manages the state and behaviour of the AI Builder demo.
 * It simulates a multi‑step process by advancing through steps with
 * configurable delays.  Replace the setTimeouts with real API calls
 * for analysis, code generation, testing and deployment.
 */
export default function useAiBuilder(): AiBuilderState {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const descriptionRef = useRef('');

  const simulateStep = useCallback(
    async (stepIndex: number) => {
      const stepNames = ['Describe', 'Analyze', 'Generate', 'Test', 'Deploy'];
      if (stepIndex >= stepNames.length) {
        setLogs((prev) => [...prev, 'Process complete!']);
        setIsRunning(false);
        return;
      }
      const stepName = stepNames[stepIndex];
      try {
        setLogs((prev) => [...prev, `Starting ${stepName} step…`]);
        setCurrentStep(stepIndex);
        // In a real implementation, call your backend here.  For example:
        // const apiUrl = import.meta.env.VITE_AI_API_URL;
        // await fetch(`${apiUrl}/steps/${stepName.toLowerCase()}`, { method: 'POST', body: JSON.stringify({ description: descriptionRef.current }) });
        // Simulate variable duration per step (1–3 seconds)
        const durationMs = 1000 + Math.random() * 2000;
        const interval = 100; // progress update interval
        let elapsed = 0;
        await new Promise<void>((resolve) => {
          const intervalId = setInterval(() => {
            elapsed += interval;
            const stepProgress = Math.min((elapsed / durationMs) * 100, 100);
            setProgress(Math.round(stepProgress));
            if (stepProgress >= 100) {
              clearInterval(intervalId);
              resolve();
            }
          }, interval);
        });
        setLogs((prev) => [...prev, `${stepName} completed.`]);
        await simulateStep(stepIndex + 1);
      } catch (error: any) {
        console.error(error);
        setLogs((prev) => [
          ...prev,
          `${stepName} failed: ${error?.message || 'An unknown error occurred.'}`,
        ]);
        setIsRunning(false);
      }
    },
    []
  );

  const startProcess = useCallback(
    (description: string) => {
      if (isRunning) return;
      setLogs([`Received description: "${description}"`]);
      setIsRunning(true);
      descriptionRef.current = description;
      setProgress(0);
      setCurrentStep(0);
      // Kick off the first step
      // In a real implementation, you might validate the description or send
      // it to the backend before starting.  Environment variables (e.g.,
      // VITE_AI_API_URL) should be configured in a .env file for API endpoints.
      simulateStep(0);
    },
    [isRunning, simulateStep]
  );

  // Cleanup on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      setIsRunning(false);
    };
  }, []);

  return { currentStep, progress, logs, startProcess, isRunning };
}