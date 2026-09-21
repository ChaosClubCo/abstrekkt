# AI Builder Demo Skeleton

This directory contains a lightweight demo skeleton for an **AI‑powered creation workflow** as envisioned for the FlashFusion platform.  The goal of this demo is to showcase the basic flow from plain‑language idea to generated application using a React UI and a simulated backend.  It does **not** implement any proprietary AI logic; instead it provides a clean, modular structure for future integration.

## Structure

```
ai_builder_demo/
├─ README.md              # This documentation file
├─ AiBuilder.tsx          # React component implementing the stepper UI
└─ useAiBuilder.ts        # Custom hook encapsulating state and actions
```

## How It Works

1. **User Input** – The user provides a project description in natural language via a text area.
2. **Step Navigation** – The component displays a series of steps (`Describe`, `Analyze`, `Generate`, `Test`, `Deploy`), similar to the FlashFusion workflow.  Only the current step is active.
3. **Simulation** – When the user starts the process, the `useAiBuilder` hook simulates progress by advancing steps with delays.  In a real implementation, each step would call backend services (e.g., LLM analysis, code generation) via API endpoints defined in environment variables.
4. **Logs** – The hook exposes log messages and progress indicators so the UI can display meaningful feedback.

## Usage

To use this demo skeleton in a React project:

1. **Install dependencies** – Ensure your project uses React and TypeScript.  If you are starting from scratch, scaffold a project with Vite:

   ```bash
   pnpm create vite my-project --template react-ts
   cd my-project
   pnpm install
   ```

2. **Copy files** – Place `AiBuilder.tsx` and `useAiBuilder.ts` into your `src/` directory (e.g., `src/components/` and `src/hooks/`).  Update imports accordingly.

3. **Import the component** – Add the `AiBuilder` component to your page:

   ```tsx
   import AiBuilder from './components/AiBuilder';

   export default function Home() {
     return <AiBuilder />;
   }
   ```

4. **Configure environment** – In a real application, the hook would call your backend.  Set environment variables (e.g., `VITE_AI_API_URL`) in a `.env` file and read them inside the hook.

5. **Extend** – Replace the simulated delays with actual API calls.  Handle errors gracefully and display user‑friendly messages when something goes wrong.

## Security & Quality Considerations

* **Input Validation** – Sanitize and validate the user’s description before sending it to the backend to prevent injection attacks.
* **Secrets Management** – Store API keys and secrets in environment variables (`.env`) and never commit them to version control.
* **Error Handling** – Use `try/catch` blocks around API calls in the hook and return meaningful errors to the UI.
* **Modularity** – Keep the hook focused on state management and side effects; separate API logic into its own functions if it grows.

## Next Steps

This skeleton is a starting point.  The following improvements are recommended:

* Connect each step to real backend services (LLM analysis, code generation, UI design, testing, deployment).
* Add authentication via OAuth or JWT to protect your APIs.
* Implement a persistent task queue to handle long‑running generation jobs.
* Add unit tests using Vitest and Testing Library.
* Apply styling with a design system (e.g., Tailwind CSS or Chakra UI) to match your brand.