/**
 * OpenAI MCP Bridge
 * 
 * HTTP bridge for OpenAI API: chat completions, embeddings, assistants.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7816
 */

import express, { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

const PORT = process.env.OPENAI_BRIDGE_PORT || 7816;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY required');
  console.error('📋 Cause: Missing OpenAI API key');
  console.error('🔧 Fix: Get key from https://platform.openai.com/api-keys');
  process.exit(1);
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'openai_key'],
  transport: { target: 'pino-pretty', options: { colorize: true } }
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ============================================================================
// SCHEMAS
// ============================================================================

const ChatCompletionSchema = z.object({
  model: z.string().default('gpt-4o'),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant', 'function', 'tool']),
    content: z.string()
  })).min(1),
  max_tokens: z.number().min(1).max(128000).default(4096),
  temperature: z.number().min(0).max(2).default(0.7),
  stream: z.boolean().default(false),
  response_format: z.object({
    type: z.enum(['text', 'json_object'])
  }).optional()
});

const EmbeddingSchema = z.object({
  model: z.string().default('text-embedding-3-small'),
  input: z.union([z.string(), z.array(z.string())]),
  dimensions: z.number().optional()
});

const ImageGenerationSchema = z.object({
  model: z.string().default('dall-e-3'),
  prompt: z.string().min(1).max(4000),
  n: z.number().min(1).max(10).default(1),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard'),
  style: z.enum(['vivid', 'natural']).default('vivid')
});

const TranscriptionSchema = z.object({
  model: z.string().default('whisper-1'),
  file_url: z.string().url(),
  language: z.string().optional(),
  response_format: z.enum(['json', 'text', 'srt', 'vtt']).default('json')
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting: 60 requests/minute for AI operations
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    error: 'Rate limit exceeded',
    cause: 'Too many AI requests',
    fix: 'Wait 60 seconds or optimize request batching',
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
    // Test with minimal API call
    const models = await openai.models.list();
    const availableModels = models.data.slice(0, 5).map(m => m.id);
    
    res.json({
      status: 'healthy',
      service: 'openai-bridge',
      version: '2.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      openai: {
        connected: true,
        sample_models: availableModels
      }
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      cause: 'OpenAI API connection failed',
      fix: 'Check OPENAI_API_KEY validity',
      retry: true
    });
  }
});

/**
 * Chat completion
 */
app.post('/mcp/chat/completions', async (req, res) => {
  try {
    const params = ChatCompletionSchema.parse(req.body);
    
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: params.model,
      messages: params.messages,
      max_tokens: params.max_tokens,
      temperature: params.temperature,
      response_format: params.response_format
    });
    const duration = Date.now() - start;
    
    logger.info({ 
      model: params.model, 
      tokens: completion.usage,
      duration_ms: duration 
    }, 'Chat completion');
    
    res.json({
      success: true,
      data: {
        id: completion.id,
        model: completion.model,
        content: completion.choices[0]?.message?.content,
        finish_reason: completion.choices[0]?.finish_reason,
        usage: completion.usage
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'chat/completions');
  }
});

/**
 * Generate embeddings
 */
app.post('/mcp/embeddings', async (req, res) => {
  try {
    const params = EmbeddingSchema.parse(req.body);
    
    const start = Date.now();
    const embedding = await openai.embeddings.create({
      model: params.model,
      input: params.input,
      dimensions: params.dimensions
    });
    const duration = Date.now() - start;
    
    res.json({
      success: true,
      data: {
        model: embedding.model,
        embeddings: embedding.data.map(e => ({
          index: e.index,
          embedding: e.embedding,
          dimensions: e.embedding.length
        })),
        usage: embedding.usage
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'embeddings');
  }
});

/**
 * Generate images
 */
app.post('/mcp/images/generate', async (req, res) => {
  try {
    const params = ImageGenerationSchema.parse(req.body);
    
    const start = Date.now();
    const image = await openai.images.generate({
      model: params.model,
      prompt: params.prompt,
      n: params.n,
      size: params.size,
      quality: params.quality,
      style: params.style
    });
    const duration = Date.now() - start;
    
    logger.info({ model: params.model, size: params.size }, 'Image generated');
    
    res.json({
      success: true,
      data: {
        created: image.created,
        images: image.data.map(img => ({
          url: img.url,
          revised_prompt: img.revised_prompt
        }))
      },
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'images/generate');
  }
});

/**
 * List available models
 */
app.post('/mcp/models/list', async (req, res) => {
  try {
    const models = await openai.models.list();
    
    res.json({
      success: true,
      data: models.data.map(m => ({
        id: m.id,
        created: m.created,
        owned_by: m.owned_by
      })).sort((a, b) => b.created - a.created)
    });
  } catch (error: any) {
    handleError(res, error, 'models/list');
  }
});

/**
 * Moderate content
 */
app.post('/mcp/moderations', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input text required',
        retry: false
      });
    }
    
    const moderation = await openai.moderations.create({ input });
    
    res.json({
      success: true,
      data: {
        id: moderation.id,
        model: moderation.model,
        results: moderation.results.map(r => ({
          flagged: r.flagged,
          categories: r.categories,
          category_scores: r.category_scores
        }))
      }
    });
  } catch (error: any) {
    handleError(res, error, 'moderations');
  }
});

/**
 * Create assistant (for Assistants API)
 */
app.post('/mcp/assistants/create', async (req, res) => {
  try {
    const { name, instructions, model = 'gpt-4o', tools = [] } = req.body;
    
    if (!name || !instructions) {
      return res.status(400).json({
        success: false,
        error: 'name and instructions required',
        retry: false
      });
    }
    
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model,
      tools
    });
    
    logger.info({ assistant_id: assistant.id, name }, 'Assistant created');
    
    res.json({
      success: true,
      data: {
        id: assistant.id,
        name: assistant.name,
        model: assistant.model,
        created_at: assistant.created_at
      }
    });
  } catch (error: any) {
    handleError(res, error, 'assistants/create');
  }
});

/**
 * List assistants
 */
app.post('/mcp/assistants/list', async (req, res) => {
  try {
    const { limit = 20 } = req.body;
    
    const assistants = await openai.beta.assistants.list({ limit });
    
    res.json({
      success: true,
      data: assistants.data.map(a => ({
        id: a.id,
        name: a.name,
        model: a.model,
        created_at: a.created_at
      }))
    });
  } catch (error: any) {
    handleError(res, error, 'assistants/list');
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(res: Response, error: any, operation: string) {
  logger.error({ operation, error: error.message, code: error.code }, 'Failed');
  
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
      retry: false
    });
  }
  
  // OpenAI API errors
  if (error.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      cause: 'Invalid OpenAI API key',
      fix: 'Regenerate key at platform.openai.com/api-keys',
      retry: false
    });
  }
  
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      cause: 'Too many requests or quota exceeded',
      fix: 'Wait and retry, or check usage limits',
      retry: true,
      retry_after: error.headers?.['retry-after']
    });
  }
  
  if (error.status === 400 && error.message?.includes('content_policy')) {
    return res.status(400).json({
      success: false,
      error: 'Content policy violation',
      cause: 'Request violates OpenAI content policy',
      fix: 'Modify request to comply with content policy',
      retry: false
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message,
    cause: 'OpenAI API request failed',
    retry: error.status >= 500
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', retry: false });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 OpenAI MCP Bridge started');
});

export default app;
