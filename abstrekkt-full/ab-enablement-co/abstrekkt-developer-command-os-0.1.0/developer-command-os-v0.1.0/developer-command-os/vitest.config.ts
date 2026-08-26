import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/types.ts',
        'src/index.ts',
        'src/cli.ts',
        'src/registry/commands.generated.ts'
      ],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 }
    }
  }
});
