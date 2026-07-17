/**
 * GitHub MCP Bridge
 * 
 * HTTP bridge exposing GitHub API operations via MCP protocol.
 * Handles repos, issues, PRs, Actions workflows, and code search.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7811
 */

import express, { Request, Response, NextFunction } from 'express';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT = process.env.GITHUB_BRIDGE_PORT || 7811;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable required');
  console.error('📋 Cause: Missing GitHub Personal Access Token');
  console.error('🔧 Fix: Export GITHUB_TOKEN with repo,workflow scopes');
  console.error('🔄 Retry: export GITHUB_TOKEN=ghp_... && npm start');
  process.exit(1);
}

// ============================================================================
// LOGGING
// ============================================================================

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'github_token'],
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// ============================================================================
// GITHUB CLIENT
// ============================================================================

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: 'MCP-GitHub-Bridge/2.0.0',
  log: {
    debug: (msg: string) => logger.debug(msg),
    info: (msg: string) => logger.info(msg),
    warn: (msg: string) => logger.warn(msg),
    error: (msg: string) => logger.error(msg)
  }
});

// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================

const RepoParamsSchema = z.object({
  owner: z.string().min(1).max(39),
  repo: z.string().min(1).max(100)
});

const IssueCreateSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  title: z.string().min(1).max(256),
  body: z.string().max(65536).optional(),
  labels: z.array(z.string()).max(100).optional(),
  assignees: z.array(z.string()).max(10).optional()
});

const PRCreateSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  title: z.string().min(1).max(256),
  body: z.string().max(65536).optional(),
  head: z.string().min(1),
  base: z.string().min(1).default('main'),
  draft: z.boolean().default(false)
});

const WorkflowDispatchSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  workflow_id: z.union([z.string(), z.number()]),
  ref: z.string().min(1).default('main'),
  inputs: z.record(z.string()).optional()
});

const CodeSearchSchema = z.object({
  query: z.string().min(1).max(256),
  owner: z.string().optional(),
  repo: z.string().optional(),
  language: z.string().optional(),
  per_page: z.number().min(1).max(100).default(30)
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Rate limit exceeded',
    cause: 'Too many requests',
    fix: 'Wait 60 seconds before retrying',
    retry: true
  }
});
app.use(limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.headers['x-request-id'] = requestId as string;
  logger.info({ requestId, method: req.method, path: req.path }, 'Request received');
  next();
});

// ============================================================================
// HEALTH ENDPOINT
// ============================================================================

app.get('/health', async (req: Request, res: Response) => {
  try {
    const { data: rateLimit } = await octokit.rateLimit.get();
    const remaining = rateLimit.rate.remaining;
    const resetAt = new Date(rateLimit.rate.reset * 1000).toISOString();
    
    res.json({
      status: 'healthy',
      service: 'github-bridge',
      version: '2.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      github: {
        authenticated: true,
        rate_limit: {
          remaining,
          limit: rateLimit.rate.limit,
          reset_at: resetAt
        }
      }
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      cause: 'GitHub API connection failed',
      fix: 'Check GITHUB_TOKEN validity and network connectivity',
      retry: true
    });
  }
});

// ============================================================================
// MCP TOOL ENDPOINTS
// ============================================================================

/**
 * List repositories for authenticated user or org
 */
app.post('/mcp/repos/list', async (req: Request, res: Response) => {
  try {
    const { org, type = 'all', per_page = 30 } = req.body;
    
    let repos;
    if (org) {
      repos = await octokit.repos.listForOrg({ org, type, per_page });
    } else {
      repos = await octokit.repos.listForAuthenticatedUser({ type, per_page });
    }
    
    res.json({
      success: true,
      data: repos.data.map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        private: r.private,
        url: r.html_url,
        default_branch: r.default_branch,
        language: r.language,
        updated_at: r.updated_at
      })),
      count: repos.data.length
    });
  } catch (error: any) {
    handleError(res, error, 'repos/list');
  }
});

/**
 * Get repository details
 */
app.post('/mcp/repos/get', async (req: Request, res: Response) => {
  try {
    const params = RepoParamsSchema.parse(req.body);
    const { data: repo } = await octokit.repos.get(params);
    
    res.json({
      success: true,
      data: {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        url: repo.html_url,
        clone_url: repo.clone_url,
        default_branch: repo.default_branch,
        language: repo.language,
        topics: repo.topics,
        open_issues_count: repo.open_issues_count,
        stargazers_count: repo.stargazers_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at
      }
    });
  } catch (error: any) {
    handleError(res, error, 'repos/get');
  }
});

/**
 * List issues for a repository
 */
app.post('/mcp/issues/list', async (req: Request, res: Response) => {
  try {
    const { owner, repo, state = 'open', labels, per_page = 30 } = req.body;
    RepoParamsSchema.parse({ owner, repo });
    
    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state,
      labels,
      per_page
    });
    
    res.json({
      success: true,
      data: issues.map(i => ({
        id: i.id,
        number: i.number,
        title: i.title,
        state: i.state,
        user: i.user?.login,
        labels: i.labels.map((l: any) => typeof l === 'string' ? l : l.name),
        assignees: i.assignees?.map(a => a.login),
        created_at: i.created_at,
        updated_at: i.updated_at,
        url: i.html_url
      })),
      count: issues.length
    });
  } catch (error: any) {
    handleError(res, error, 'issues/list');
  }
});

/**
 * Create a new issue
 */
app.post('/mcp/issues/create', async (req: Request, res: Response) => {
  try {
    const params = IssueCreateSchema.parse(req.body);
    const { data: issue } = await octokit.issues.create(params);
    
    logger.info({ issue_number: issue.number, repo: `${params.owner}/${params.repo}` }, 'Issue created');
    
    res.json({
      success: true,
      data: {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        url: issue.html_url
      }
    });
  } catch (error: any) {
    handleError(res, error, 'issues/create');
  }
});

/**
 * List pull requests
 */
app.post('/mcp/pulls/list', async (req: Request, res: Response) => {
  try {
    const { owner, repo, state = 'open', per_page = 30 } = req.body;
    RepoParamsSchema.parse({ owner, repo });
    
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state,
      per_page
    });
    
    res.json({
      success: true,
      data: pulls.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        user: pr.user?.login,
        head: pr.head.ref,
        base: pr.base.ref,
        draft: pr.draft,
        mergeable: pr.mergeable,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        url: pr.html_url
      })),
      count: pulls.length
    });
  } catch (error: any) {
    handleError(res, error, 'pulls/list');
  }
});

/**
 * Create a pull request
 */
app.post('/mcp/pulls/create', async (req: Request, res: Response) => {
  try {
    const params = PRCreateSchema.parse(req.body);
    const { data: pr } = await octokit.pulls.create(params);
    
    logger.info({ pr_number: pr.number, repo: `${params.owner}/${params.repo}` }, 'PR created');
    
    res.json({
      success: true,
      data: {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
        mergeable: pr.mergeable
      }
    });
  } catch (error: any) {
    handleError(res, error, 'pulls/create');
  }
});

/**
 * List workflow runs
 */
app.post('/mcp/actions/runs', async (req: Request, res: Response) => {
  try {
    const { owner, repo, workflow_id, status, per_page = 30 } = req.body;
    RepoParamsSchema.parse({ owner, repo });
    
    let runs;
    if (workflow_id) {
      runs = await octokit.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id,
        status,
        per_page
      });
    } else {
      runs = await octokit.actions.listWorkflowRunsForRepo({
        owner,
        repo,
        status,
        per_page
      });
    }
    
    res.json({
      success: true,
      data: runs.data.workflow_runs.map(run => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        workflow_id: run.workflow_id,
        head_branch: run.head_branch,
        head_sha: run.head_sha?.substring(0, 7),
        created_at: run.created_at,
        updated_at: run.updated_at,
        url: run.html_url
      })),
      count: runs.data.total_count
    });
  } catch (error: any) {
    handleError(res, error, 'actions/runs');
  }
});

/**
 * Trigger a workflow dispatch
 */
app.post('/mcp/actions/dispatch', async (req: Request, res: Response) => {
  try {
    const params = WorkflowDispatchSchema.parse(req.body);
    
    await octokit.actions.createWorkflowDispatch({
      owner: params.owner,
      repo: params.repo,
      workflow_id: params.workflow_id,
      ref: params.ref,
      inputs: params.inputs
    });
    
    logger.info({ 
      workflow_id: params.workflow_id, 
      repo: `${params.owner}/${params.repo}`,
      ref: params.ref 
    }, 'Workflow dispatched');
    
    res.json({
      success: true,
      message: `Workflow ${params.workflow_id} dispatched on ${params.ref}`,
      data: {
        workflow_id: params.workflow_id,
        ref: params.ref,
        inputs: params.inputs
      }
    });
  } catch (error: any) {
    handleError(res, error, 'actions/dispatch');
  }
});

/**
 * Search code
 */
app.post('/mcp/code/search', async (req: Request, res: Response) => {
  try {
    const params = CodeSearchSchema.parse(req.body);
    
    let query = params.query;
    if (params.owner && params.repo) {
      query += ` repo:${params.owner}/${params.repo}`;
    } else if (params.owner) {
      query += ` user:${params.owner}`;
    }
    if (params.language) {
      query += ` language:${params.language}`;
    }
    
    const { data: results } = await octokit.search.code({
      q: query,
      per_page: params.per_page
    });
    
    res.json({
      success: true,
      data: results.items.map(item => ({
        name: item.name,
        path: item.path,
        repo: item.repository.full_name,
        url: item.html_url,
        score: item.score
      })),
      total_count: results.total_count
    });
  } catch (error: any) {
    handleError(res, error, 'code/search');
  }
});

/**
 * Get file contents
 */
app.post('/mcp/contents/get', async (req: Request, res: Response) => {
  try {
    const { owner, repo, path, ref } = req.body;
    RepoParamsSchema.parse({ owner, repo });
    
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref
    });
    
    if (Array.isArray(data)) {
      // Directory listing
      res.json({
        success: true,
        type: 'directory',
        data: data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          url: item.html_url
        }))
      });
    } else {
      // File contents
      const content = data.encoding === 'base64' 
        ? Buffer.from(data.content, 'base64').toString('utf-8')
        : data.content;
      
      res.json({
        success: true,
        type: 'file',
        data: {
          name: data.name,
          path: data.path,
          size: data.size,
          sha: data.sha,
          content: content,
          url: data.html_url
        }
      });
    }
  } catch (error: any) {
    handleError(res, error, 'contents/get');
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(res: Response, error: any, operation: string) {
  const status = error.status || 500;
  const message = error.message || 'Unknown error';
  
  logger.error({ 
    operation, 
    status, 
    message,
    requestId: res.req?.headers['x-request-id']
  }, 'Operation failed');
  
  // Zod validation error
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: 'Invalid request parameters',
      fix: `Check parameter types and constraints: ${error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      retry: false,
      details: error.errors
    });
  }
  
  // GitHub API errors
  if (error.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      cause: 'Invalid or expired GitHub token',
      fix: 'Generate new token at github.com/settings/tokens with required scopes (repo, workflow)',
      retry: false
    });
  }
  
  if (error.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      cause: 'Rate limit exceeded or insufficient permissions',
      fix: 'Wait for rate limit reset or check token scopes',
      retry: true,
      retry_after: error.response?.headers?.['retry-after']
    });
  }
  
  if (error.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      cause: 'Resource does not exist or you lack access',
      fix: 'Verify owner/repo names and token permissions',
      retry: false
    });
  }
  
  // Generic error
  res.status(status).json({
    success: false,
    error: message,
    cause: 'GitHub API request failed',
    fix: 'Check request parameters and try again',
    retry: status >= 500
  });
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    cause: `No handler for ${req.method} ${req.path}`,
    fix: 'Check available endpoints at /health',
    retry: false
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ error: error.message, stack: error.stack }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    cause: 'Unexpected error occurred',
    fix: 'Check server logs for details',
    retry: true
  });
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 GitHub MCP Bridge started');
  logger.info({ endpoints: [
    'GET  /health',
    'POST /mcp/repos/list',
    'POST /mcp/repos/get',
    'POST /mcp/issues/list',
    'POST /mcp/issues/create',
    'POST /mcp/pulls/list',
    'POST /mcp/pulls/create',
    'POST /mcp/actions/runs',
    'POST /mcp/actions/dispatch',
    'POST /mcp/code/search',
    'POST /mcp/contents/get'
  ]}, 'Available endpoints');
});

export default app;
