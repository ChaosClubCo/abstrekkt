#!/usr/bin/env node
/**
 * MCP Server for Orchestration Library
 * Exposes orchestration capabilities via Model Context Protocol
 */
import {
  getRoleByName,
  getRolesByType,
  getPromptTemplate,
  generatePrompt,
  validateRACIChart,
  RoleType,
} from '../index.js';
import {
  logger,
  metrics,
  getHealthCheck,
  shutdownManager,
  withTiming,
} from '../observability/index.js';
import {
  globalRateLimiter,
  expensiveOpRateLimiter,
  RateLimitError,
} from '../security/rate-limiter.js';
import { globalCircuitBreaker } from '../security/circuit-breaker.js';

// MCP Protocol types (simplified)
interface MCPRequest {
  method: string;
  params?: any;
}

interface MCPResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * MCP Server implementation
 */
class OrchestrationMCPServer {
  private handlers: Map<string, (params: any) => Promise<any>> = new Map();

  constructor() {
    this.registerTools();
    logger.info('MCP Server initialized');
  }

  private registerTools(): void {
    // Tool: list_roles
    this.handlers.set('list_roles', async (params) => {
      metrics.recordToolCall('list_roles');
      
      const type = params?.type;
      if (type && !Object.values(RoleType).includes(type)) {
        metrics.recordValidationError();
        throw new Error(`Invalid role type: ${type}`);
      }

      return type ? getRolesByType(type) : getRolesByType(RoleType.COORDINATOR);
    });

    // Tool: get_role
    this.handlers.set('get_role', async (params) => {
      metrics.recordToolCall('get_role');
      
      const { name } = params;
      if (!name) {
        metrics.recordValidationError();
        throw new Error('Role name is required');
      }

      const role = getRoleByName(name);
      if (!role) {
        throw new Error(`Role not found: ${name}`);
      }

      return role;
    });

    // Tool: generate_prompt (expensive operation)
    this.handlers.set('generate_prompt', async (params) => {
      metrics.recordToolCall('generate_prompt');
      
      // Rate limit expensive operations
      const rateLimitCheck = await expensiveOpRateLimiter.check({ operation: 'generate_prompt' });
      if (!rateLimitCheck.allowed) {
        throw new RateLimitError(
          rateLimitCheck.retryAfter!,
          `Rate limit exceeded. Retry after ${rateLimitCheck.retryAfter}s`
        );
      }

      const { templateId, variables } = params;
      if (!templateId || !variables) {
        metrics.recordValidationError();
        throw new Error('templateId and variables are required');
      }

      return generatePrompt({ templateId, variables });
    });

    // Tool: validate_raci
    this.handlers.set('validate_raci', async () => {
      metrics.recordToolCall('validate_raci');
      return validateRACIChart();
    });

    // Tool: get_metrics
    this.handlers.set('get_metrics', async () => {
      metrics.recordToolCall('get_metrics');
      return metrics.getMetrics();
    });

    // Tool: health_check
    this.handlers.set('health_check', async () => {
      return getHealthCheck();
    });
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      // Global rate limiting
      const rateLimitCheck = await globalRateLimiter.check({});
      if (!rateLimitCheck.allowed) {
        return {
          error: {
            code: 429,
            message: 'Too Many Requests',
            data: { retryAfter: rateLimitCheck.retryAfter },
          },
        };
      }

      // Get handler
      const handler = this.handlers.get(request.method);
      if (!handler) {
        return {
          error: {
            code: -32601,
            message: `Method not found: ${request.method}`,
          },
        };
      }

      // Execute with circuit breaker and timing
      const result = await withTiming(() =>
        globalCircuitBreaker.execute(() => handler(request.params || {}))
      );

      return { result };
    } catch (error: any) {
      logger.error({ error, method: request.method }, 'Request failed');
      
      if (error instanceof RateLimitError) {
        return {
          error: {
            code: 429,
            message: error.message,
            data: { retryAfter: error.retryAfter },
          },
        };
      }

      metrics.recordSystemError();
      return {
        error: {
          code: -32603,
          message: error.message || 'Internal error',
        },
      };
    }
  }

  async start(): Promise<void> {
    logger.info('MCP Server starting');

    // Register shutdown handler
    shutdownManager.register(async () => {
      logger.info('MCP Server shutting down');
    });

    // Stdio-based MCP protocol (JSON-RPC over stdin/stdout)
    process.stdin.setEncoding('utf-8');
    
    let buffer = '';
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const request = JSON.parse(line) as MCPRequest;
          const response = await this.handleRequest(request);
          process.stdout.write(JSON.stringify(response) + '\n');
        } catch (error) {
          logger.error({ error }, 'Failed to parse request');
        }
      }
    });

    process.stdin.on('end', () => {
      shutdownManager.shutdown('STDIN_END');
    });

    logger.info('MCP Server started');
  }
}

// Start server
const server = new OrchestrationMCPServer();
server.start().catch((error) => {
  logger.error({ error }, 'Failed to start server');
  process.exit(1);
});
