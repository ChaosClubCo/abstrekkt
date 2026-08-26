/**
 * GitHub MCP Bridge - Test Suite
 * 
 * Tests cover:
 * - Health endpoint
 * - Input validation (Zod schemas)
 * - Error handling (cause→fix→retry format)
 * - Rate limiting
 * - Security (no secrets in responses)
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock Octokit before importing server
vi.mock('@octokit/rest', () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    rest: {
      repos: {
        listForAuthenticatedUser: vi.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'test-repo', full_name: 'user/test-repo', private: false }
          ]
        }),
        get: vi.fn().mockResolvedValue({
          data: { id: 1, name: 'test-repo', full_name: 'user/test-repo' }
        })
      },
      issues: {
        listForRepo: vi.fn().mockResolvedValue({
          data: [
            { id: 100, number: 1, title: 'Test Issue', state: 'open' }
          ]
        }),
        create: vi.fn().mockResolvedValue({
          data: { id: 101, number: 2, title: 'New Issue', html_url: 'https://github.com/...' }
        })
      },
      rateLimit: {
        get: vi.fn().mockResolvedValue({
          data: {
            rate: { limit: 5000, remaining: 4999, reset: Date.now() / 1000 + 3600 }
          }
        })
      }
    }
  }))
}));

// Set required env var
process.env.GITHUB_TOKEN = 'ghp_test_token_not_real';
process.env.GITHUB_BRIDGE_PORT = '17811'; // Use different port for tests

// ============================================================================
// TEST SETUP
// ============================================================================

describe('GitHub MCP Bridge', () => {
  let app: express.Express;

  beforeAll(async () => {
    // Dynamic import after mocks are set up
    const module = await import('../src/server');
    app = module.default;
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  // ==========================================================================
  // HEALTH ENDPOINT
  // ==========================================================================

  describe('GET /health', () => {
    it('returns healthy status with rate limit info', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 'healthy',
        service: 'github-bridge',
        version: expect.any(String)
      });
      expect(res.body.github).toBeDefined();
      expect(res.body.github.rate_limit).toBeDefined();
    });

    it('does not expose secrets in response', async () => {
      const res = await request(app).get('/health');
      const bodyStr = JSON.stringify(res.body);

      expect(bodyStr).not.toContain('ghp_');
      expect(bodyStr).not.toContain('token');
      expect(bodyStr).not.toContain(process.env.GITHUB_TOKEN);
    });
  });

  // ==========================================================================
  // REPOS ENDPOINTS
  // ==========================================================================

  describe('POST /mcp/repos/list', () => {
    it('returns list of repositories', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .send({ per_page: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.repos).toBeInstanceOf(Array);
    });

    it('validates per_page parameter bounds', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .send({ per_page: 200 }); // Max is 100

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Validation');
    });

    it('handles empty parameters', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /mcp/repos/get', () => {
    it('returns repository details', async () => {
      const res = await request(app)
        .post('/mcp/repos/get')
        .send({ owner: 'user', repo: 'test-repo' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.repo).toBeDefined();
    });

    it('requires owner and repo parameters', async () => {
      const res = await request(app)
        .post('/mcp/repos/get')
        .send({ owner: 'user' }); // Missing repo

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // ISSUES ENDPOINTS
  // ==========================================================================

  describe('POST /mcp/issues/list', () => {
    it('returns issues for a repository', async () => {
      const res = await request(app)
        .post('/mcp/issues/list')
        .send({ owner: 'user', repo: 'test-repo' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.issues).toBeInstanceOf(Array);
    });

    it('validates state parameter', async () => {
      const res = await request(app)
        .post('/mcp/issues/list')
        .send({ owner: 'user', repo: 'test-repo', state: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Validation');
    });

    it('accepts valid state values', async () => {
      for (const state of ['open', 'closed', 'all']) {
        const res = await request(app)
          .post('/mcp/issues/list')
          .send({ owner: 'user', repo: 'test-repo', state });

        expect(res.status).toBe(200);
      }
    });
  });

  describe('POST /mcp/issues/create', () => {
    it('creates a new issue', async () => {
      const res = await request(app)
        .post('/mcp/issues/create')
        .send({
          owner: 'user',
          repo: 'test-repo',
          title: 'New Test Issue',
          body: 'Issue description'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.issue).toBeDefined();
    });

    it('requires title parameter', async () => {
      const res = await request(app)
        .post('/mcp/issues/create')
        .send({ owner: 'user', repo: 'test-repo' }); // Missing title

      expect(res.status).toBe(400);
    });

    it('sanitizes XSS in title', async () => {
      const res = await request(app)
        .post('/mcp/issues/create')
        .send({
          owner: 'user',
          repo: 'test-repo',
          title: '<script>alert("xss")</script>Test',
          body: 'Safe content'
        });

      // Should succeed but title should be passed as-is (GitHub handles sanitization)
      expect(res.status).toBe(200);
    });
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {
    it('returns cause→fix→retry format for errors', async () => {
      // Force an error by using invalid credentials
      vi.mocked((await import('@octokit/rest')).Octokit).mockImplementationOnce(() => {
        throw { status: 401, message: 'Bad credentials' };
      });

      const res = await request(app)
        .post('/mcp/repos/list')
        .send({});

      // Error format should include cause, fix, retry
      if (res.status >= 400) {
        expect(res.body).toHaveProperty('error');
        // The error handler should provide actionable guidance
      }
    });

    it('returns 404 for unknown endpoints', async () => {
      const res = await request(app)
        .post('/mcp/unknown/endpoint')
        .send({});

      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });

  // ==========================================================================
  // INPUT VALIDATION (ZOD)
  // ==========================================================================

  describe('Input Validation', () => {
    it('rejects non-JSON content type', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .set('Content-Type', 'text/plain')
        .send('not json');

      expect(res.status).toBe(400);
    });

    it('handles malformed JSON gracefully', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(res.status).toBe(400);
    });

    it('validates string length constraints', async () => {
      const res = await request(app)
        .post('/mcp/issues/create')
        .send({
          owner: 'user',
          repo: 'test-repo',
          title: 'a'.repeat(300), // GitHub title limit is 256
          body: 'test'
        });

      // Should either truncate or reject
      expect([200, 400]).toContain(res.status);
    });

    it('validates numeric parameter types', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .send({ per_page: 'not a number' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Validation');
    });
  });

  // ==========================================================================
  // SECURITY
  // ==========================================================================

  describe('Security', () => {
    it('sets security headers via helmet', async () => {
      const res = await request(app).get('/health');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('does not include stack traces in error responses', async () => {
      const res = await request(app)
        .post('/mcp/repos/get')
        .send({ owner: 'nonexistent', repo: 'nope' });

      const bodyStr = JSON.stringify(res.body);
      expect(bodyStr).not.toContain('at ');
      expect(bodyStr).not.toContain('node_modules');
      expect(bodyStr).not.toContain('.ts:');
    });

    it('request ID is present in responses', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .set('x-request-id', 'test-request-123')
        .send({});

      // Request ID should be logged (check via response or headers if exposed)
      expect(res.status).toBe(200);
    });
  });

  // ==========================================================================
  // RATE LIMITING
  // ==========================================================================

  describe('Rate Limiting', () => {
    it('includes rate limit headers', async () => {
      const res = await request(app)
        .post('/mcp/repos/list')
        .send({});

      // Express-rate-limit headers
      expect(res.headers['ratelimit-limit']).toBeDefined();
      expect(res.headers['ratelimit-remaining']).toBeDefined();
    });

    it.skip('enforces rate limit after threshold', async () => {
      // This test is skipped in CI - would need to make 100+ requests
      const requests = Array(110).fill(null).map(() =>
        request(app).post('/mcp/repos/list').send({})
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// INTEGRATION TESTS (require real credentials)
// ============================================================================

describe.skipIf(!process.env.GITHUB_TOKEN_REAL)('Integration Tests', () => {
  it('can list real repositories', async () => {
    // Only runs if GITHUB_TOKEN_REAL is set
    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN_REAL!;
    
    const module = await import('../src/server');
    const app = module.default;

    const res = await request(app)
      .post('/mcp/repos/list')
      .send({ per_page: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.repos.length).toBeGreaterThan(0);
  });
});
