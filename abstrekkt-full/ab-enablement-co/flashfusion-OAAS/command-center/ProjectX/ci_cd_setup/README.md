# CI/CD Setup Skeleton

This folder provides a basic **Continuous Integration (CI)** configuration for a
TypeScript/React project using [Vitest](https://vitest.dev/).  It includes
a Vitest configuration, a simple test file, and a GitHub Actions workflow
that installs dependencies and runs the test suite on every push or pull
request.

## Structure

```
ci_cd_setup/
├─ vitest.config.ts                 # Vitest config enabling jsdom environment and coverage
├─ tests/
│  └─ ci_demo.test.ts               # Sample test verifying the test runner
└─ .github/
   └─ workflows/
      └─ ci.yml                    # GitHub Actions workflow for CI
├─ README.md                        # This file
└─ PRODUCTION_PLAN.md               # Roadmap for expanding CI/CD
```

## How It Works

1. **Vitest Configuration** – `vitest.config.ts` sets up Vitest to run in a browser‑like
   environment (`jsdom`), enables global `describe` and `expect` functions and configures
   coverage reporting using c8.  Modify the `include` and `exclude` patterns to match
   your project’s file layout.
2. **Sample Test** – `tests/ci_demo.test.ts` contains a trivial test that always passes.
   Use this as a starting point for writing meaningful tests that cover your components
   and business logic.
3. **GitHub Actions Workflow** – `.github/workflows/ci.yml` triggers on pushes to
   `main`/`master` and on pull requests.  It checks out the code, sets up Node
   (using pnpm for faster installations), installs dependencies and runs `pnpm run test`.

To use this CI setup in your repository:

1. Copy the `ci_cd_setup` folder into the root of your repo.
2. Ensure that `vitest`, `@vitest/ui` and `pnpm` are listed as devDependencies in your
   `package.json`.  Add test scripts if they’re missing:

   ```json
   "scripts": {
     "test": "vitest"
   }
   ```
3. Commit the `.github/workflows/ci.yml` file.  GitHub will automatically run
   the workflow on subsequent pushes and pull requests.
4. Write additional tests in the `tests/` directory and run them locally with `pnpm test`.

## Next Steps

* **Linting and Formatting** – Add jobs in the workflow to run ESLint and Prettier.  Fail
  the build if code style violations are detected.
* **Type Checking** – Add a step that runs `pnpm run typecheck` to ensure TypeScript
  types are sound.  Configure [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) or
  [vue-tsc](https://github.com/vuejs/vue-tsc) as appropriate for your stack.
* **Build Artifacts** – If your project includes a build step (e.g. bundling for production),
  run `pnpm run build` and upload the artifact as a workflow output or cache it for later
  deploy steps.
* **Deployment** – Define a second job or a separate workflow that deploys successful builds
  to your hosting provider (e.g. Vercel, Netlify or AWS).  Use GitHub Secrets to store
  authentication tokens.
* **Integration Tests** – Integrate a browser automation tool (Cypress or Playwright) to run
  end‑to‑end tests against preview deployments.

This skeleton demonstrates the minimum viable CI configuration.  Expand and customise
it to match your project’s requirements and keep your codebase healthy and reliable.