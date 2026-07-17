#!/usr/bin/env node
/**
 * Example MCP Server for ChatGPT Apps
 * 
 * This demonstrates a production-ready MCP server with:
 * - SSE (Server-Sent Events) transport
 * - OAuth 2.0 authentication
 * - Multiple tools
 * - Error handling
 * - Logging
 * 
 * Based on MCP specification: https://modelcontextprotocol.io/
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// ============================================================================
// Configuration
// ============================================================================

const PORT = process.env.PORT || 3000;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_AUTHORIZE_URL = process.env.OAUTH_AUTHORIZE_URL || 'https://auth.example.com/oauth/authorize';
const OAUTH_TOKEN_URL = process.env.OAUTH_TOKEN_URL || 'https://auth.example.com/oauth/token';
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

// Validate required environment variables
if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
  console.error('ERROR: OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET are required');
  process.exit(1);
}

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();

app.use(cors({
  origin: [
    'https://chatgpt.com',
    'https://chat.openai.com',
    'http://localhost:3000'  // For local testing
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// OAuth 2.0 Endpoints
// ============================================================================

/**
 * OAuth authorization endpoint
 * Redirects to provider's authorization URL
 */
app.get('/oauth/authorize', (req, res) => {
  const { state, redirect_uri } = req.query;
  
  if (!state || !redirect_uri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Build authorization URL
  const authUrl = new URL(OAUTH_AUTHORIZE_URL);
  authUrl.searchParams.set('client_id', OAUTH_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirect_uri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'read:data write:data');

  res.redirect(authUrl.toString());
});

/**
 * OAuth token exchange endpoint
 * Exchanges authorization code for access token
 */
app.post('/oauth/token', async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(OAUTH_TOKEN_URL, {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    res.json(tokenResponse.data);
  } catch (error) {
    console.error('Token exchange error:', error.message);
    res.status(500).json({ 
      error: 'Failed to exchange token',
      details: error.response?.data || error.message
    });
  }
});

// ============================================================================
// MCP Server
// ============================================================================

const server = new Server(
  {
    name: 'example-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_user',
        description: 'Get user information by ID',
        inputSchema: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              description: 'The unique identifier for the user'
            }
          },
          required: ['user_id']
        }
      },
      {
        name: 'list_projects',
        description: 'List all projects for the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['active', 'archived', 'all'],
              description: 'Filter projects by status',
              default: 'all'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of projects to return',
              default: 20,
              minimum: 1,
              maximum: 100
            }
          }
        }
      },
      {
        name: 'create_task',
        description: 'Create a new task in a project',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: {
              type: 'string',
              description: 'ID of the project to create task in'
            },
            title: {
              type: 'string',
              description: 'Title of the task'
            },
            description: {
              type: 'string',
              description: 'Detailed description of the task'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority level',
              default: 'medium'
            },
            assignee: {
              type: 'string',
              description: 'User ID to assign the task to (optional)'
            },
            due_date: {
              type: 'string',
              format: 'date',
              description: 'Due date in YYYY-MM-DD format (optional)'
            }
          },
          required: ['project_id', 'title']
        }
      },
      {
        name: 'search',
        description: 'Search across projects, tasks, and comments',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            },
            type: {
              type: 'string',
              enum: ['all', 'projects', 'tasks', 'comments'],
              description: 'Type of items to search',
              default: 'all'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 10,
              maximum: 50
            }
          },
          required: ['query']
        }
      }
    ]
  };
});

// ============================================================================
// Tool Implementations
// ============================================================================

/**
 * Execute tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
  const { name, arguments: args } = request.params;
  
  // Get access token from authorization header
  const accessToken = extra?.meta?.authorization?.replace('Bearer ', '');
  
  if (!accessToken) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: 'No access token provided' })
      }],
      isError: true
    };
  }

  try {
    switch (name) {
      case 'get_user':
        return await handleGetUser(args.user_id, accessToken);
      
      case 'list_projects':
        return await handleListProjects(args, accessToken);
      
      case 'create_task':
        return await handleCreateTask(args, accessToken);
      
      case 'search':
        return await handleSearch(args, accessToken);
      
      default:
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` })
          }],
          isError: true
        };
    }
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error.message);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ 
          error: error.message,
          details: error.response?.data 
        })
      }],
      isError: true
    };
  }
});

// ============================================================================
// Tool Handler Functions
// ============================================================================

async function handleGetUser(userId, accessToken) {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response.data, null, 2)
    }]
  };
}

async function handleListProjects(args, accessToken) {
  const { status = 'all', limit = 20 } = args;
  
  const params = new URLSearchParams({ limit: limit.toString() });
  if (status !== 'all') {
    params.set('status', status);
  }

  const response = await axios.get(`${API_BASE_URL}/projects?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response.data, null, 2)
    }]
  };
}

async function handleCreateTask(args, accessToken) {
  const { project_id, title, description, priority, assignee, due_date } = args;
  
  const taskData = {
    title,
    description,
    priority: priority || 'medium',
    ...(assignee && { assignee_id: assignee }),
    ...(due_date && { due_date })
  };

  const response = await axios.post(
    `${API_BASE_URL}/projects/${project_id}/tasks`,
    taskData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response.data, null, 2)
    }]
  };
}

async function handleSearch(args, accessToken) {
  const { query, type = 'all', limit = 10 } = args;
  
  const params = new URLSearchParams({ 
    q: query,
    type,
    limit: limit.toString()
  });

  const response = await axios.get(`${API_BASE_URL}/search?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response.data, null, 2)
    }]
  };
}

// ============================================================================
// SSE Endpoint
// ============================================================================

/**
 * Main MCP SSE endpoint
 * ChatGPT connects to this endpoint for bidirectional communication
 */
app.get('/mcp', async (req, res) => {
  console.log('New MCP connection established');
  
  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Create SSE transport
  const transport = new SSEServerTransport('/mcp', res);
  
  // Connect server to transport
  await server.connect(transport);
  
  // Handle client disconnect
  req.on('close', () => {
    console.log('MCP connection closed');
    server.close();
  });
});

// ============================================================================
// Error Handling
// ============================================================================

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`OAuth authorize: http://localhost:${PORT}/oauth/authorize`);
  console.log(`OAuth token: http://localhost:${PORT}/oauth/token`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close();
  process.exit(0);
});
