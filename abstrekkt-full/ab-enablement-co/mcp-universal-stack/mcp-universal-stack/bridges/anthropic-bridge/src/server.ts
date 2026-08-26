/**
 * Anthropic MCP Bridge
 * 
 * HTTP bridge for Anthropic Claude API: messages, completions.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7817
 */

import express, { Request, Response, NextFunction } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

const PORT = process.env.ANTHROPIC_BRIDGE_PORT || 7817;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY required');
  console.error('📋 Cause: Missing Anthropic API key');
  console.error('🔧 Fix: Get key from https://console.anthropic.com/settings/keys');
  process.exit(1);
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'anthropic_key', 'req.headers["x-api-key"]'],
  transport: { target: 'pino-pretty', options: { colorize: true } }
});

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ============================================================================
// SCHEMAS
// ============================================================================

const MessageSchema = z.object({
  model: z.string().default('claude-sonnet-4-20250514'),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.union([
      z.string(),
      z.array(z.object({
        type: z.enum(['text', 'image']),
        text: z.string().optional(),
        source: z.object({
          type: z.literal('base64'),
          media_type: z.string(),
          data: z.string()
        }).optional()
      }))
    ])
  })).min(1),
  max_tokens: z.number().min(1).max(200000).default(4096),
  temperature: z.number().min(0).max(1).default(0.7),
  system: z.string().optional(),
  stop_sequences: z.array(z.string()).optional(),
  metadata: z.object({
    user_id: z.string().optional()
  }).optional()
});

const CountTokensSchema = z.object({
  model: z.string().default('claude-sonnet-4-20250514'),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).min(1),
  system: z.string().optional()
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();
app.use(helmet());
app.use(express.json({ limit: '50mb' })); // Larger for image inputs

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    error: 'Rate limit exceeded',
    cause: 'Too many AI requests',
    fix: 'Wait 60 seconds',
    retry: true
  }
});
app.use(limiter);

app.use((req, res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
  logger.info({ requestId: req.headers['x-request-id'], path: req.path }, 'Request');
  next();
});

// ============================================================================
// ENDPOINTS
// ============================================================================

app.get('/health', async (req, res) => {
  try {
    // Simple validation - make a minimal API call
    const testMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok"' }]
    });
    
    res.json({
      status: 'healthy',
      service: 'anthropic-bridge',
      version: '2.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      anthropic: {
        connected: true,
        test_model: testMessage.model,
        test_response: testMessage.content[0]?.type === 'text' 
          ? testMessage.content[0].text.substring(0, 20) 
          : 'ok'
      }
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      cause: 'Anthropic API connection failed',
      fix: 'Check ANTHROPIC_API_KEY validity',
      retry: true
    });
  }
});

/**
 * Create message (main Claude API)
 */
app.post('/mcp/messages', async (req, res) => {
  try {
    const params = MessageSchema.parse(req.body);
    
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: params.model,
      max_tokens: params.max_tokens,
      messages: params.messages as any,
      temperature: params.temperature,
      system: params.system,
      stop_sequences: params.stop_sequences,
      metadata: params.metadata
    });
    const duration = Date.now() - start;
    
    logger.info({
      model: params.model,
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      duration_ms: duration
    }, 'Message created');
    
    res.json({
      success: true,
      data: {
        id: message.id,
        type: message.type,
        role: message.role,
        model: message.model,
        content: message.content,
        stop_reason: message.stop_reason,
        usage: message.usage
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'messages');
  }
});

/**
 * Streaming message endpoint
 */
app.post('/mcp/messages/stream', async (req, res) => {
  try {
    const params = MessageSchema.parse(req.body);
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const stream = await anthropic.messages.create({
      model: params.model,
      max_tokens: params.max_tokens,
      messages: params.messages as any,
      temperature: params.temperature,
      system: params.system,
      stream: true
    });
    
    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    // For streaming, send error as SSE event
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * Count tokens for a message
 */
app.post('/mcp/tokens/count', async (req, res) => {
  try {
    const params = CountTokensSchema.parse(req.body);
    
    const count = await anthropic.messages.countTokens({
      model: params.model,
      messages: params.messages,
      system: params.system
    });
    
    res.json({
      success: true,
      data: {
        input_tokens: count.input_tokens
      }
    });
  } catch (error: any) {
    handleError(res, error, 'tokens/count');
  }
});

/**
 * Vision - analyze image
 */
app.post('/mcp/vision/analyze', async (req, res) => {
  try {
    const { image_base64, media_type, prompt = 'Describe this image in detail.' } = req.body;
    
    if (!image_base64 || !media_type) {
      return res.status(400).json({
        success: false,
        error: 'image_base64 and media_type required',
        fix: 'Provide base64 encoded image and MIME type (image/jpeg, image/png, etc.)',
        retry: false
      });
    }
    
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type,
              data: image_base64
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    });
    const duration = Date.now() - start;
    
    res.json({
      success: true,
      data: {
        analysis: message.content[0]?.type === 'text' ? message.content[0].text : '',
        usage: message.usage
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'vision/analyze');
  }
});

/**
 * Tool use - structured extraction
 */
app.post('/mcp/tools/extract', async (req, res) => {
  try {
    const { content, schema, description = 'Extract structured data from the content' } = req.body;
    
    if (!content || !schema) {
      return res.status(400).json({
        success: false,
        error: 'content and schema required',
        fix: 'Provide content to extract from and JSON schema for output',
        retry: false
      });
    }
    
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      tools: [{
        name: 'extract_data',
        description,
        input_schema: schema
      }],
      tool_choice: { type: 'tool', name: 'extract_data' },
      messages: [{
        role: 'user',
        content: `Extract the requested information from this content:\n\n${content}`
      }]
    });
    const duration = Date.now() - start;
    
    // Find tool use in response
    const toolUse = message.content.find(c => c.type === 'tool_use');
    
    res.json({
      success: true,
      data: {
        extracted: toolUse?.type === 'tool_use' ? toolUse.input : null,
        usage: message.usage
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'tools/extract');
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(res: Response, error: any, operation: string) {
  logger.error({ operation, error: error.message, status: error.status }, 'Failed');
  
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
      retry: false
    });
  }
  
  // Anthropic API errors
  if (error.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      cause: 'Invalid Anthropic API key',
      fix: 'Regenerate key at console.anthropic.com',
      retry: false
    });
  }
  
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      cause: 'Too many requests or token quota exceeded',
      fix: 'Wait and retry, or check usage limits',
      retry: true,
      retry_after: error.headers?.['retry-after']
    });
  }
  
  if (error.status === 400) {
    return res.status(400).json({
      success: false,
      error: error.message,
      cause: 'Invalid request parameters',
      fix: 'Check message format and model name',
      retry: false
    });
  }
  
  if (error.status === 529) {
    return res.status(529).json({
      success: false,
      error: 'API overloaded',
      cause: 'Anthropic API is experiencing high load',
      fix: 'Retry with exponential backoff',
      retry: true
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message,
    cause: 'Anthropic API request failed',
    retry: error.status >= 500
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', retry: false });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 Anthropic MCP Bridge started');
});

export default app;
