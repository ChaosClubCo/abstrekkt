/**
 * @module mcp/server
 * @description MCP Server exposing 11 orchestration tools with observability
 * @security Input validation via Zod, structured error handling
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Data imports
import {
  ROLE_MATRIX,
  getRoleByName,
  getRolesByLayer,
  getAllRoleNames,
} from '../data/roles.js';
import {
  RACI_CHART,
  getRACIForPhase,
  getAccountableForPhase,
  getResponsibleForPhase,
} from '../data/raci.js';
import {
  generatePrompt,
  getTemplateForRole,
} from '../data/prompts.js';
import {
  ROADMAP,
  getMilestonesByPhase,
  getMilestonesByStatus,
  getCriticalPath,
} from '../data/roadmap.js';
import { BOARD_SETUP } from '../data/board.js';
import { getJobDescriptionForRole } from '../data/jobs.js';
import { PRESENTATION_TEMPLATES, getPresentationById } from '../data/presentations.js';

// Schema imports
import {
  MCPListRolesInputSchema,
  MCPGetRoleInputSchema,
  MCPGetRACIInputSchema,
  MCPGeneratePromptInputSchema,
  MCPGetMilestoneInputSchema,
  validateInput,
} from '../schemas.js';

// Utility imports
import { logger, configureLogger } from '../utils/logger.js';
import { OrchestrationError, ErrorCode, wrapError } from '../utils/errors.js';

// Observability imports
import {
  recordToolCall,
  recordToolError,
  performHealthCheck,
} from './observability.js';
import { setupGracefulShutdown } from './shutdown.js';

// Configure logger for MCP server
configureLogger({
  service: 'flashfusion-mcp-server',
  minLevel: process.env['LOG_LEVEL'] === 'debug' ? 'debug' : 'info',
});

/**
 * Tool definitions for the MCP server.
 */
const TOOLS = [
  {
    name: 'list_roles',
    description: 'List all 11 AI personas in the Symphony of Roles, optionally filtered by organizational layer',
    inputSchema: {
      type: 'object' as const,
      properties: {
        layer: {
          type: 'string',
          enum: ['Strategy', 'Design', 'Engineering', 'Quality', 'Growth'],
          description: 'Optional: Filter roles by organizational layer',
        },
      },
    },
  },
  {
    name: 'get_role',
    description: 'Get detailed information about a specific role including focus areas, contributions, and collaboration patterns',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          enum: getAllRoleNames() as unknown as string[],
          description: 'The name of the role to retrieve',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_raci',
    description: 'Get RACI assignments for a specific lifecycle phase showing accountability matrix',
    inputSchema: {
      type: 'object' as const,
      properties: {
        phase: {
          type: 'string',
          enum: ['Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'],
          description: 'The lifecycle phase to get RACI for',
        },
      },
      required: ['phase'],
    },
  },
  {
    name: 'generate_prompt',
    description: 'Generate an AI prompt for a specific role with variable interpolation',
    inputSchema: {
      type: 'object' as const,
      properties: {
        role: {
          type: 'string',
          enum: getAllRoleNames() as unknown as string[],
          description: 'The role to generate a prompt for',
        },
        variables: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Variables to interpolate into the prompt template',
        },
      },
      required: ['role'],
    },
  },
  {
    name: 'get_template',
    description: 'Get the raw prompt template for a specific role',
    inputSchema: {
      type: 'object' as const,
      properties: {
        role: {
          type: 'string',
          enum: getAllRoleNames() as unknown as string[],
          description: 'The role to get the template for',
        },
      },
      required: ['role'],
    },
  },
  {
    name: 'get_milestones',
    description: 'Get roadmap milestones, optionally filtered by phase or status',
    inputSchema: {
      type: 'object' as const,
      properties: {
        phase: {
          type: 'string',
          enum: ['Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'],
          description: 'Optional: Filter by lifecycle phase',
        },
        status: {
          type: 'string',
          enum: ['planned', 'in-progress', 'completed', 'blocked'],
          description: 'Optional: Filter by milestone status',
        },
      },
    },
  },
  {
    name: 'get_critical_path',
    description: 'Get the critical path of milestones (longest dependency chain)',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_board',
    description: 'Get the Kanban board configuration including columns and WIP limits',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_job_description',
    description: 'Get the job description for a specific role',
    inputSchema: {
      type: 'object' as const,
      properties: {
        role: {
          type: 'string',
          enum: getAllRoleNames() as unknown as string[],
          description: 'The role to get the job description for',
        },
      },
      required: ['role'],
    },
  },
  {
    name: 'get_presentation',
    description: 'Get a presentation template by ID',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          enum: PRESENTATION_TEMPLATES.map(p => p.id),
          description: 'The presentation template ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'health_check',
    description: 'Perform a health check on the MCP server',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

/**
 * Creates and configures the MCP server.
 */
function createServer(): Server {
  const server = new Server(
    {
      name: 'flashfusion-orchestration',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool listing handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing tools', { count: TOOLS.length });
    return { tools: TOOLS };
  });

  // Register tool execution handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const start = performance.now();

    logger.info('Tool invocation started', { tool: name });

    try {
      const result = await handleToolCall(name, args);
      const latency = performance.now() - start;
      recordToolCall(name, latency);

      logger.info('Tool invocation completed', { tool: name, latencyMs: latency.toFixed(2) });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const latency = performance.now() - start;
      recordToolError(name, error as Error);

      const wrappedError = wrapError(error);
      logger.error('Tool invocation failed', { tool: name, latencyMs: latency.toFixed(2) }, error as Error);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: true,
              code: wrappedError.code,
              message: wrappedError.message,
              fix: wrappedError.fix,
              retryable: wrappedError.retryable,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Handles individual tool calls with validation.
 */
async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<unknown> {
  switch (name) {
    case 'list_roles': {
      const validation = validateInput(MCPListRolesInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: 'Check the layer parameter is one of: Strategy, Design, Engineering, Quality, Growth',
          retryable: false,
          statusCode: 400,
        });
      }

      const layer = validation.data?.layer;
      const roles = layer ? getRolesByLayer(layer) : ROLE_MATRIX;

      return {
        count: roles.length,
        layer: layer ?? 'all',
        roles: roles.map(r => ({
          id: r.id,
          name: r.name,
          layer: r.layer,
          focus: r.focus,
        })),
      };
    }

    case 'get_role': {
      const validation = validateInput(MCPGetRoleInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: `Provide a valid role name. Available roles: ${getAllRoleNames().join(', ')}`,
          retryable: false,
          statusCode: 400,
        });
      }

      const role = getRoleByName(validation.data.name);
      return role;
    }

    case 'get_raci': {
      const validation = validateInput(MCPGetRACIInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: 'Provide a valid phase: Discovery, Design, Build, Release, Growth, or Maintenance',
          retryable: false,
          statusCode: 400,
        });
      }

      const phase = getRACIForPhase(validation.data.phase);
      const accountable = getAccountableForPhase(validation.data.phase);
      const responsible = getResponsibleForPhase(validation.data.phase);

      return {
        ...phase,
        summary: {
          accountable,
          responsible,
        },
      };
    }

    case 'generate_prompt': {
      const validation = validateInput(MCPGeneratePromptInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: `Provide a valid role name. Available roles: ${getAllRoleNames().join(', ')}`,
          retryable: false,
          statusCode: 400,
        });
      }

      const result = generatePrompt(
        validation.data.role,
        validation.data.variables ?? {}
      );

      if (!result.success) {
        throw new OrchestrationError(result.error ?? 'Prompt generation failed', {
          code: ErrorCode.VALIDATION_ERROR,
          fix: 'Provide all required variables for the template',
          retryable: false,
          context: result.metadata,
          statusCode: 400,
        });
      }

      return result;
    }

    case 'get_template': {
      const validation = validateInput(MCPGetRoleInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: `Provide a valid role name. Available roles: ${getAllRoleNames().join(', ')}`,
          retryable: false,
          statusCode: 400,
        });
      }

      const template = getTemplateForRole(validation.data.name);
      return template;
    }

    case 'get_milestones': {
      const validation = validateInput(MCPGetMilestoneInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: 'Check phase and status parameters are valid',
          retryable: false,
          statusCode: 400,
        });
      }

      let milestones = ROADMAP.milestones;

      if (validation.data?.phase) {
        milestones = getMilestonesByPhase(validation.data.phase);
      }

      if (validation.data?.status) {
        milestones = getMilestonesByStatus(validation.data.status);
      }

      return {
        count: milestones.length,
        filters: validation.data ?? {},
        milestones,
      };
    }

    case 'get_critical_path': {
      const criticalPath = getCriticalPath();
      return {
        count: criticalPath.length,
        milestones: criticalPath,
      };
    }

    case 'get_board': {
      return BOARD_SETUP;
    }

    case 'get_job_description': {
      const validation = validateInput(MCPGetRoleInputSchema, args);
      if (!validation.success) {
        throw new OrchestrationError(validation.error, {
          code: ErrorCode.VALIDATION_ERROR,
          fix: `Provide a valid role name. Available roles: ${getAllRoleNames().join(', ')}`,
          retryable: false,
          statusCode: 400,
        });
      }

      const jobDescription = getJobDescriptionForRole(validation.data.name);
      return jobDescription;
    }

    case 'get_presentation': {
      const id = args?.['id'];
      if (typeof id !== 'string') {
        throw new OrchestrationError('Presentation ID is required', {
          code: ErrorCode.VALIDATION_ERROR,
          fix: `Provide a valid presentation ID. Available: ${PRESENTATION_TEMPLATES.map(p => p.id).join(', ')}`,
          retryable: false,
          statusCode: 400,
        });
      }

      const presentation = getPresentationById(id);
      return presentation;
    }

    case 'health_check': {
      return performHealthCheck();
    }

    default:
      throw new OrchestrationError(`Unknown tool: ${name}`, {
        code: ErrorCode.NOT_FOUND,
        fix: `Available tools: ${TOOLS.map(t => t.name).join(', ')}`,
        retryable: false,
        statusCode: 404,
      });
  }
}

/**
 * Main entry point for the MCP server.
 */
async function main(): Promise<void> {
  logger.info('Starting FlashFusion Orchestration MCP Server', {
    version: '1.0.0',
    tools: TOOLS.length,
    roles: ROLE_MATRIX.length,
    phases: RACI_CHART.phases.length,
  });

  const server = createServer();
  const transport = new StdioServerTransport();

  // Setup graceful shutdown
  setupGracefulShutdown();

  // Connect and run
  await server.connect(transport);

  logger.info('MCP Server connected and ready');
}

// Run if this is the main module
main().catch((error) => {
  logger.error('Failed to start MCP server', {}, error as Error);
  process.exit(1);
});

// Export for testing
export { createServer, handleToolCall, TOOLS };
