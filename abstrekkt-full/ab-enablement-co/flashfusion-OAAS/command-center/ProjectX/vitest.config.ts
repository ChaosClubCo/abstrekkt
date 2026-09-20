/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./vitest.setup.ts'],

    // Global test APIs (describe, it, expect, etc.)
    globals: true,

    // Include patterns for all modules
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'packages/**/*.{test,spec}.{ts,tsx}',
      'modules/**/*.{test,spec}.{ts,tsx}',
      // Module directories
      'advanced_analytics/**/*.{test,spec}.{ts,tsx}',
      'ai_builder_demo/**/*.{test,spec}.{ts,tsx}',
      'ai_finetuning/**/*.{test,spec}.{ts,tsx}',
      'ai_tools_marketplace/**/*.{test,spec}.{ts,tsx}',
      'analytics_dashboard/**/*.{test,spec}.{ts,tsx}',
      'auth_module/**/*.{test,spec}.{ts,tsx}',
      'billing_management/**/*.{test,spec}.{ts,tsx}',
      'commerce_demo/**/*.{test,spec}.{ts,tsx}',
      'compliance_privacy/**/*.{test,spec}.{ts,tsx}',
      'comprehensive_search/**/*.{test,spec}.{ts,tsx}',
      'custom_domain_ssl/**/*.{test,spec}.{ts,tsx}',
      'data_import_export/**/*.{test,spec}.{ts,tsx}',
      'feedback_system/**/*.{test,spec}.{ts,tsx}',
      'health_status/**/*.{test,spec}.{ts,tsx}',
      'integrations_manager/**/*.{test,spec}.{ts,tsx}',
      'ip_whitelisting/**/*.{test,spec}.{ts,tsx}',
      'localization_support/**/*.{test,spec}.{ts,tsx}',
      'monitoring_dashboard/**/*.{test,spec}.{ts,tsx}',
      'notifications_module/**/*.{test,spec}.{ts,tsx}',
      'onboarding_assistant/**/*.{test,spec}.{ts,tsx}',
      'project_dashboard/**/*.{test,spec}.{ts,tsx}',
      'publish_demo/**/*.{test,spec}.{ts,tsx}',
      'realtime_chat_support/**/*.{test,spec}.{ts,tsx}',
      'roles_management/**/*.{test,spec}.{ts,tsx}',
      'secrets_management/**/*.{test,spec}.{ts,tsx}',
      'support_docs/**/*.{test,spec}.{ts,tsx}',
      'team_management/**/*.{test,spec}.{ts,tsx}',
      'template_marketplace/**/*.{test,spec}.{ts,tsx}',
      'testing_interface/**/*.{test,spec}.{ts,tsx}',
      'user_settings/**/*.{test,spec}.{ts,tsx}',
      'multi_tenancy/**/*.{test,spec}.{ts,tsx}',
      'audit_logging/**/*.{test,spec}.{ts,tsx}',
      'two_factor_auth/**/*.{test,spec}.{ts,tsx}',
      'email_templates/**/*.{test,spec}.{ts,tsx}',
      'webhook_manager/**/*.{test,spec}.{ts,tsx}',
      'feature_flags/**/*.{test,spec}.{ts,tsx}',
      'api_documentation/**/*.{test,spec}.{ts,tsx}',
      'background_jobs/**/*.{test,spec}.{ts,tsx}',
      'session_management/**/*.{test,spec}.{ts,tsx}',
      'api_rate_limiting/**/*.{test,spec}.{ts,tsx}',
      'file_management/**/*.{test,spec}.{ts,tsx}',
    ],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '.cache',
      '**/node_modules/**',
    ],

    // Coverage configuration with v8 provider
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // Include patterns for coverage
      include: [
        'src/**/*.{ts,tsx}',
        'packages/**/src/**/*.{ts,tsx}',
        'modules/**/src/**/*.{ts,tsx}',
        '**/src/**/*.{ts,tsx}',
      ],

      // Exclude patterns from coverage
      exclude: [
        'node_modules',
        'dist',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/index.ts',
        '**/__mocks__/**',
        '**/types/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        'scripts/**',
      ],

      // Coverage thresholds - 80% minimum
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Reporter configuration
    reporters: ['default'],

    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Watch mode exclude
    watchExclude: ['node_modules', 'dist'],

    // Pool options for better isolation
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },

    // CSS handling
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },

    // Deps optimization
    deps: {
      optimizer: {
        web: {
          include: ['@testing-library/react'],
        },
      },
    },
  },

  // Path aliases matching tsconfig
  resolve: {
    alias: {
      '@projectx/shared': resolve(__dirname, 'packages/shared/src'),
      '@': resolve(__dirname, 'src'),
    },
  },
});
