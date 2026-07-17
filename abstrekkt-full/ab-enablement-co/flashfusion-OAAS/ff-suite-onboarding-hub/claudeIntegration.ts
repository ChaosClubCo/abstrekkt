/**
 * CLAUDE AI INTEGRATION (PRODUCTION-READY)
 * Secure, validated, rate-limited Claude API integration
 * 
 * Changes from original:
 * ✅ Input validation with Zod schemas
 * ✅ SSRF protection on image/document URLs
 * ✅ Rate limiting (50 requests/minute for AI calls)
 * ✅ Structured error handling
 * ✅ Secure error messages (no internal details exposed)
 * ✅ Structured logging
 */

import Anthropic from 'npm:@anthropic-ai/sdk';
import { z } from 'npm:zod';
import {
  createHandler,
  validatePayload,
  safeFetch,
  logger,
  AppError,
  ERROR_CODES
} from './lib/security.ts';

// ============================================================================
// CONFIGURATION
// ============================================================================

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
});

const MODELS = {
  opus: 'claude-sonnet-4-20250514',
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-3-5-haiku-20241022',
  legacy_opus: 'claude-3-opus-20240229'
};

const DEFAULT_MODEL = MODELS.sonnet;
const MAX_TOKENS = 8192;

// Allowed domains for image/document URLs (SSRF protection)
const ALLOWED_MEDIA_DOMAINS = [
  'supabase.co',
  'cloudinary.com',
  's3.amazonaws.com',
  'storage.googleapis.com'
];

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().or(z.array(z.any()))
});

const BaseRequestSchema = z.object({
  action: z.enum(['chat', 'vision', 'analyze_document', 'extended_thinking', 'tool_use']),
  prompt: z.string().min(1).max(50000).optional(),
  model: z.string().optional(),
  max_tokens: z.number().int().min(1).max(16000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  messages: z.array(MessageSchema).optional(),
  system: z.string().max(10000).optional(),
  tools: z.array(z.any()).optional(),
  tool_choice: z.any().optional(),
  metadata: z.record(z.string()).optional(),
  stop_sequences: z.array(z.string()).optional(),
});

const VisionRequestSchema = BaseRequestSchema.extend({
  action: z.literal('vision'),
  image_urls: z.array(z.string().url()).min(1).max(5).optional(),
  image_url: z.string().url().optional(),
});

const DocumentRequestSchema = BaseRequestSchema.extend({
  action: z.literal('analyze_document'),
  document_url: z.string().url(),
});

// ============================================================================
// HANDLERS BY ACTION
// ============================================================================

async function handleChat(
  validated: z.infer<typeof BaseRequestSchema>,
  base44: any
) {
  const chatModel = validated.model || DEFAULT_MODEL;
  
  const requestParams: any = {
    model: chatModel,
    max_tokens: validated.max_tokens || MAX_TOKENS,
    temperature: validated.temperature ?? 1,
    messages: validated.messages || [{ 
      role: "user", 
      content: validated.prompt || '' 
    }]
  };

  if (validated.system) {
    requestParams.system = validated.system;
  }

  if (validated.tools && validated.tools.length > 0) {
    requestParams.tools = validated.tools;
    if (validated.tool_choice) {
      requestParams.tool_choice = validated.tool_choice;
    }
  }

  if (validated.metadata) {
    requestParams.metadata = validated.metadata;
  }

  if (validated.stop_sequences) {
    requestParams.stop_sequences = validated.stop_sequences;
  }

  logger.info('Claude API: chat request', {
    model: chatModel,
    messageCount: requestParams.messages.length
  });

  const response = await anthropic.messages.create(requestParams);

  // Extract content properly
  let content = '';
  let tool_use = null;
  
  for (const block of response.content) {
    if (block.type === 'text') {
      content += block.text;
    } else if (block.type === 'tool_use') {
      tool_use = {
        id: block.id,
        name: block.name,
        input: block.input
      };
    }
  }

  return {
    content,
    tool_use,
    stop_reason: response.stop_reason,
    usage: response.usage,
    model: chatModel
  };
}

async function handleVision(
  validated: z.infer<typeof VisionRequestSchema>,
  base44: any
) {
  const imageUrls = validated.image_urls || (validated.image_url ? [validated.image_url] : []);
  
  if (imageUrls.length === 0) {
    throw new AppError(
      'image_url or image_urls required for vision action',
      ERROR_CODES.VALIDATION_ERROR,
      400,
      'Please provide at least one image URL'
    );
  }

  logger.info('Claude API: vision request', {
    imageCount: imageUrls.length
  });

  const imageContent = [];
  
  for (const imageUrl of imageUrls) {
    try {
      // ✅ SECURITY: Safe fetch with SSRF protection
      const imageResponse = await safeFetch(imageUrl, {
        allowedDomains: ALLOWED_MEDIA_DOMAINS,
        maxSizeBytes: 5 * 1024 * 1024, // 5MB max
        timeoutMs: 15000 // 15 seconds
      });
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      const mediaType = imageResponse.headers.get('content-type') || 'image/jpeg';
      
      imageContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: base64
        }
      });
    } catch (error) {
      logger.error('Failed to fetch image', error instanceof Error ? error : new Error(String(error)), {
        imageUrl
      });
      
      throw new AppError(
        'Failed to fetch one or more images',
        ERROR_CODES.EXTERNAL_API,
        400,
        'Unable to access the provided image URL(s). Please verify they are publicly accessible.'
      );
    }
  }
  
  imageContent.push({ 
    type: "text", 
    text: validated.prompt || "Analyze these images carefully." 
  });

  const visionResponse = await anthropic.messages.create({
    model: validated.model || DEFAULT_MODEL,
    max_tokens: validated.max_tokens || MAX_TOKENS,
    messages: [{ role: "user", content: imageContent }],
    system: validated.system || "Analyze the image(s) carefully and provide detailed insights."
  });

  return {
    content: visionResponse.content[0].text,
    usage: visionResponse.usage,
    model: validated.model || DEFAULT_MODEL
  };
}

async function handleAnalyzeDocument(
  validated: z.infer<typeof DocumentRequestSchema>,
  base44: any
) {
  logger.info('Claude API: document analysis request');
  
  try {
    // ✅ SECURITY: Safe fetch with SSRF protection
    const docResponse = await safeFetch(validated.document_url, {
      allowedDomains: ALLOWED_MEDIA_DOMAINS,
      maxSizeBytes: 10 * 1024 * 1024, // 10MB max
      timeoutMs: 30000 // 30 seconds
    });
    
    const docBuffer = await docResponse.arrayBuffer();
    const docBase64 = btoa(String.fromCharCode(...new Uint8Array(docBuffer)));
    const docMediaType = docResponse.headers.get('content-type') || 'application/pdf';

    const docAnalysisResponse = await anthropic.messages.create({
      model: validated.model || DEFAULT_MODEL,
      max_tokens: validated.max_tokens || MAX_TOKENS,
      messages: [{
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: docMediaType,
              data: docBase64
            }
          },
          { 
            type: "text", 
            text: validated.prompt || "Analyze this document thoroughly." 
          }
        ]
      }],
      system: validated.system || "You are an expert document analyst. Provide comprehensive analysis."
    });

    return {
      content: docAnalysisResponse.content[0].text,
      usage: docAnalysisResponse.usage,
      model: validated.model || DEFAULT_MODEL
    };
  } catch (error) {
    logger.error('Document analysis failed', error instanceof Error ? error : new Error(String(error)), {
      documentUrl: validated.document_url
    });
    
    throw new AppError(
      'Failed to analyze document',
      ERROR_CODES.EXTERNAL_API,
      400,
      'Unable to access or process the provided document URL'
    );
  }
}

async function handleExtendedThinking(
  validated: z.infer<typeof BaseRequestSchema>,
  base44: any
) {
  logger.info('Claude API: extended thinking request');
  
  const thinkingResponse = await anthropic.messages.create({
    model: validated.model || DEFAULT_MODEL,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000
    },
    messages: validated.messages || [{ 
      role: "user", 
      content: validated.prompt || '' 
    }],
    system: validated.system || "Think through this problem step by step, showing your reasoning process."
  });

  let thinking = '';
  let answer = '';
  
  for (const block of thinkingResponse.content) {
    if (block.type === 'thinking') {
      thinking = block.thinking;
    } else if (block.type === 'text') {
      answer = block.text;
    }
  }

  return {
    thinking,
    content: answer,
    usage: thinkingResponse.usage,
    model: validated.model || DEFAULT_MODEL
  };
}

async function handleToolUse(
  validated: z.infer<typeof BaseRequestSchema>,
  base44: any
) {
  if (!validated.tools || validated.tools.length === 0) {
    throw new AppError(
      'tools array required for tool_use action',
      ERROR_CODES.VALIDATION_ERROR,
      400,
      'Tools array is required for tool use'
    );
  }

  logger.info('Claude API: tool use request', {
    toolCount: validated.tools.length
  });

  const toolResponse = await anthropic.messages.create({
    model: validated.model || DEFAULT_MODEL,
    max_tokens: validated.max_tokens || MAX_TOKENS,
    tools: validated.tools,
    tool_choice: validated.tool_choice || { type: "auto" },
    messages: validated.messages || [{ 
      role: "user", 
      content: validated.prompt || '' 
    }],
    system: validated.system || "Use the available tools to help answer the user's request."
  });

  const toolUses = [];
  let textContent = '';
  
  for (const block of toolResponse.content) {
    if (block.type === 'tool_use') {
      toolUses.push({
        id: block.id,
        name: block.name,
        input: block.input
      });
    } else if (block.type === 'text') {
      textContent += block.text;
    }
  }

  return {
    content: textContent,
    tool_uses: toolUses,
    stop_reason: toolResponse.stop_reason,
    usage: toolResponse.usage,
    model: validated.model || DEFAULT_MODEL
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(createHandler(
  async (req, { user, base44 }) => {
    // Parse and validate request
    const body = await req.json();
    
    let validated: any;
    if (body.action === 'vision') {
      validated = validatePayload(body, VisionRequestSchema);
    } else if (body.action === 'analyze_document') {
      validated = validatePayload(body, DocumentRequestSchema);
    } else {
      validated = validatePayload(body, BaseRequestSchema);
    }

    // Route to appropriate handler
    let result: any;
    
    switch (validated.action) {
      case 'chat':
        result = await handleChat(validated, base44);
        break;
      case 'vision':
        result = await handleVision(validated, base44);
        break;
      case 'analyze_document':
        result = await handleAnalyzeDocument(validated, base44);
        break;
      case 'extended_thinking':
        result = await handleExtendedThinking(validated, base44);
        break;
      case 'tool_use':
        result = await handleToolUse(validated, base44);
        break;
      default:
        throw new AppError(
          'Invalid action',
          ERROR_CODES.VALIDATION_ERROR,
          400,
          'Invalid action. Use: chat, vision, analyze_document, extended_thinking, tool_use'
        );
    }

    // Update integration usage stats (non-critical, don't fail if it errors)
    try {
      const integrations = await base44.asServiceRole.entities.Integration.filter({ 
        integration_key: 'claude' 
      });
      
      if (integrations.length > 0) {
        await base44.asServiceRole.entities.Integration.update(integrations[0].id, {
          last_used: new Date().toISOString(),
          usage_count: (integrations[0].usage_count || 0) + 1,
          status: 'active'
        });
      }
    } catch (error) {
      logger.warn('Failed to update integration stats', { error: error.message });
    }

    return result;
  },
  {
    requireAuth: true,
    rateLimit: {
      maxRequests: 50, // 50 AI requests per minute
      windowMs: 60000
    },
    endpoint: 'claude-api'
  }
));
