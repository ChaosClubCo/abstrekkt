# AI Fine‑Tuning & Model Management

This module introduces a basic management interface for AI models and fine‑tuning within the FlashFusion platform. It provides a custom hook (`useAiFinetuning`) to manage available models, select the active model, start training jobs, and record logs. A demo component (`AiFinetuning.tsx`) exposes a simple UI where users can:

- View a list of available AI models with their current status and approximate accuracy.
- Select a model to use for generation tasks.
- Adjust simple hyperparameters (learning rate, epochs) and start a fine‑tuning job.
- See a list of training jobs with status and start time.
- Read a log of fine‑tuning actions.

This skeleton does **not** perform actual ML training; instead it simulates training by setting a model status to `training` and then back to `ready` after a timeout. Use this as a starting point to integrate your own ML training backend.

## Files

| File | Purpose |
|------|---------|
| `useAiFinetuning.ts` | Hook that holds available models, selected model, training jobs, and logs. Provides functions to select a model and start a training job with hyperparameters. |
| `AiFinetuning.tsx` | Demo React component using the hook. Renders model selection radio buttons, hyperparameter inputs, training job table, and log. |
| `README.md` | This file. Explains the module and usage. |
| `PRODUCTION_PLAN.md` | Outlines a roadmap for turning the demo into a production‑ready AI fine‑tuning and model management system. |

## Usage

1. Copy the `ai_finetuning` directory into your project.
2. Ensure you have installed the `nanoid` package.
3. Import and render the `AiFinetuning` component where you want to display the AI management panel:

```tsx
import AiFinetuning from './ai_finetuning/AiFinetuning';

function SettingsPage() {
  return <AiFinetuning />;
}
```

4. Replace the placeholder model list and simulated training logic in `useAiFinetuning` with calls to your AI/ML backend.
5. Add forms and UI controls for additional parameters (e.g. batch size, number of layers) as needed.

## Extending the Module

- **Model registry:** Fetch the list of available models from your backend or model registry (e.g. huggingface, internal model store). Include metadata such as version, size, supported languages, and dataset.
- **Training jobs:** Connect `startTraining` to your training orchestration service (e.g. AWS SageMaker, Vertex AI, or custom ML pipeline). Poll for job status and update the UI accordingly.
- **Metrics & evaluation:** Display training metrics (loss curves, accuracy) and evaluation results. Allow users to compare different model versions.
- **Prompt and embedding management:** Provide interfaces to manage prompt templates and embedding vectors used by your AI agents.
- **Access control:** Restrict model management actions to authorized users. Enforce quotas or limits on training jobs.

For more details on future work, see **PRODUCTION_PLAN.md**.