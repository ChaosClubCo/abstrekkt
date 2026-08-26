import { defineConfig } from 'vitest/config';

// This configuration file sets up Vitest for unit testing React and
// TypeScript code.  It uses the jsdom environment to simulate a browser,
// enables globals like `describe` and `expect` automatically, and
// configures coverage reporting via c8.  Adjust the include/exclude
// patterns as needed to match your project's structure.

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    reporters: 'default',
    coverage: {
      provider: 'c8',
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/build/**',
      ],
    },
  },
});