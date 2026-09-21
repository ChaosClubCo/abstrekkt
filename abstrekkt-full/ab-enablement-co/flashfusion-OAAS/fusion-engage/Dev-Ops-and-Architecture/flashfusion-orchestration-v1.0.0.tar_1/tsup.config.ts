import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'node20',
    outDir: 'dist',
  },
  {
    entry: ['src/mcp/server.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'node20',
    outDir: 'dist/mcp',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
