/**
 * Security Middleware for Base44 Backend Functions
 * Provides authentication, rate limiting, input validation, and error handling
 * 
 * Usage:
 * ```typescript
 * import { createHandler, validatePayload } from './lib/security.ts';
 * 
 * Deno.serve(createHandler(async (req, { user, base44 }) => {
 *   const body = validatePayload(await req.json(), MySchema);
 *   // Your logic here
 *   return { result: 'success' };
 * }));
 * ```
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { z, ZodSchema } from 'npm:zod';

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public userMessage?: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_API: 'EXTERNAL_API_ERROR',
  DATABASE: 'DATABASE_ERROR',
  SSRF_BLOCKED: 'SSRF_BLOCKED',
  INTERNAL: 'INTERNAL_ERROR',
} as const;

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_STORE = new Map<string, RateLimitEntry>();
const DEFAULT_WINDOW_MS = 60000; // 1 minute
const DEFAULT_MAX_REQUESTS = 100;

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of RATE_LIMIT_STORE.entries()) {
    if (entry.resetAt < now) {
      RATE_LIMIT_STORE.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  userId: string,
  options: {
    maxRequests?: number;
    windowMs?: number;
    endpoint?: string;
  } = {}
): boolean {
  const { maxRequests = DEFAULT_MAX_REQUESTS, windowMs = DEFAULT_WINDOW_MS, endpoint = 'default' } = options;
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs);
  const key = `${userId}:${endpoint}:${windowStart}`;
  
  const current = RATE_LIMIT_STORE.get(key);
  
  if (!current || current.resetAt < now) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

// ============================================================================
// INPUT VALIDATION
// ============================================================================

export function validatePayload<T>(data: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new AppError(
        `Validation failed: ${issues}`,
        ERROR_CODES.VALIDATION_ERROR,
        400,
        'Invalid request data. Please check your inputs.'
      );
    }
    throw error;
  }
}

// Common schemas for reuse
export const CommonSchemas = {
  email: z.string().email().toLowerCase(),
  uuid: z.string().uuid(),
  positiveInt: z.number().int().positive(),
  nonEmptyString: z.string().min(1).max(10000),
  date: z.string().datetime().or(z.date()),
};

// ============================================================================
// SSRF PROTECTION
// ============================================================================

const ALLOWED_PROTOCOLS = ['https:'];
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS metadata
  '10.',
  '172.16.',
  '172.17.',
  '172.18.',
  '172.19.',
  '172.20.',
  '172.21.',
  '172.22.',
  '172.23.',
  '172.24.',
  '172.25.',
  '172.26.',
  '172.27.',
  '172.28.',
  '172.29.',
  '172.30.',
  '172.31.',
  '192.168.',
];

export function validateUrl(
  urlString: string,
  allowedDomains?: string[]
): URL {
  let url: URL;
  
  try {
    url = new URL(urlString);
  } catch {
    throw new AppError(
      'Invalid URL format',
      ERROR_CODES.SSRF_BLOCKED,
      400,
      'The provided URL is invalid'
    );
  }
  
  // Check protocol
  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    throw new AppError(
      `Protocol ${url.protocol} not allowed`,
      ERROR_CODES.SSRF_BLOCKED,
      400,
      'Only HTTPS URLs are allowed'
    );
  }
  
  // Check for blocked domains/IPs
  const hostname = url.hostname.toLowerCase();
  for (const blocked of BLOCKED_DOMAINS) {
    if (hostname === blocked || hostname.startsWith(blocked)) {
      throw new AppError(
        `Domain ${hostname} is blocked`,
        ERROR_CODES.SSRF_BLOCKED,
        403,
        'This URL is not allowed for security reasons'
      );
    }
  }
  
  // Check allowed domains if provided
  if (allowedDomains && allowedDomains.length > 0) {
    const isAllowed = allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowed) {
      throw new AppError(
        `Domain ${hostname} not in allowlist`,
        ERROR_CODES.SSRF_BLOCKED,
        403,
        'This domain is not allowed'
      );
    }
  }
  
  return url;
}

// ============================================================================
// STRUCTURED LOGGING
// ============================================================================

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context
    }));
  },
  
  error(message: string, error?: Error | AppError, context?: Record<string, unknown>) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      code: error instanceof AppError ? error.code : undefined,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...context
    }));
  },
  
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...context
    }));
  },

  security(event: string, context: Record<string, unknown>) {
    console.warn(JSON.stringify({
      level: 'security',
      event,
      timestamp: new Date().toISOString(),
      ...context
    }));
  }
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export function handleError(error: unknown): Response {
  // Generate unique request ID for tracking
  const requestId = crypto.randomUUID();
  
  if (error instanceof AppError) {
    logger.error('Application error', error, { requestId });
    
    return Response.json({
      error: error.userMessage || error.message,
      code: error.code,
      requestId
    }, { status: error.statusCode });
  }
  
  if (error instanceof z.ZodError) {
    logger.error('Validation error', error, { requestId });
    
    return Response.json({
      error: 'Invalid request data',
      code: ERROR_CODES.VALIDATION_ERROR,
      details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      requestId
    }, { status: 400 });
  }
  
  // Don't expose internal errors to client
  logger.error('Unexpected error', error instanceof Error ? error : new Error(String(error)), { requestId });
  
  return Response.json({
    error: 'An unexpected error occurred. Please try again later.',
    code: ERROR_CODES.INTERNAL,
    requestId
  }, { status: 500 });
}

// ============================================================================
// HANDLER WRAPPER
// ============================================================================

export interface HandlerContext {
  user: any;
  base44: any;
  isAdmin: boolean;
  isFacilitator: boolean;
}

export type HandlerFunction = (
  req: Request,
  context: HandlerContext
) => Promise<Record<string, unknown>>;

export interface HandlerOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  endpoint?: string;
}

/**
 * Create a secure handler with automatic auth, rate limiting, and error handling
 */
export function createHandler(
  handler: HandlerFunction,
  options: HandlerOptions = {}
): (req: Request) => Promise<Response> {
  const {
    requireAuth = true,
    requireAdmin = false,
    rateLimit,
    endpoint = 'default'
  } = options;
  
  return async (req: Request) => {
    const startTime = Date.now();
    
    try {
      // Initialize Base44 client
      const base44 = createClientFromRequest(req);
      
      // Authentication
      let user = null;
      if (requireAuth || requireAdmin) {
        user = await base44.auth.me();
        
        if (!user) {
          logger.security('Unauthorized access attempt', { endpoint });
          throw new AppError(
            'Authentication required',
            ERROR_CODES.UNAUTHORIZED,
            401,
            'You must be logged in to access this resource'
          );
        }
      }
      
      // Authorization
      const isAdmin = user?.role === 'admin';
      const isFacilitator = user?.user_type === 'facilitator';
      
      if (requireAdmin && !isAdmin) {
        logger.security('Forbidden access attempt', { 
          endpoint, 
          userId: user?.email,
          role: user?.role 
        });
        throw new AppError(
          'Admin access required',
          ERROR_CODES.FORBIDDEN,
          403,
          'You do not have permission to access this resource'
        );
      }
      
      // Rate limiting
      if (rateLimit && user) {
        const allowed = checkRateLimit(user.email, {
          ...rateLimit,
          endpoint
        });
        
        if (!allowed) {
          logger.security('Rate limit exceeded', {
            endpoint,
            userId: user.email
          });
          throw new AppError(
            'Rate limit exceeded',
            ERROR_CODES.RATE_LIMIT,
            429,
            'Too many requests. Please try again later.'
          );
        }
      }
      
      // Call handler
      const result = await handler(req, { user, base44, isAdmin, isFacilitator });
      
      // Log success
      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        endpoint,
        userId: user?.email,
        duration,
        success: true
      });
      
      return Response.json({ 
        success: true, 
        ...result 
      });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Request failed', error instanceof Error ? error : new Error(String(error)), {
        endpoint,
        duration
      });
      
      return handleError(error);
    }
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse JSON body
 */
export async function parseJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new AppError(
      'Invalid JSON in request body',
      ERROR_CODES.VALIDATION_ERROR,
      400,
      'Request body must be valid JSON'
    );
  }
}

/**
 * Fetch external URL safely with timeout and size limits
 */
export async function safeFetch(
  url: string | URL,
  options: RequestInit & {
    timeoutMs?: number;
    maxSizeBytes?: number;
    allowedDomains?: string[];
  } = {}
): Promise<Response> {
  const {
    timeoutMs = 30000,
    maxSizeBytes = 10 * 1024 * 1024, // 10MB
    allowedDomains,
    ...fetchOptions
  } = options;
  
  // Validate URL
  const validatedUrl = validateUrl(url.toString(), allowedDomains);
  
  // Fetch with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(validatedUrl.toString(), {
      ...fetchOptions,
      signal: controller.signal
    });
    
    // Check response size
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      throw new AppError(
        `Response too large: ${contentLength} bytes`,
        ERROR_CODES.EXTERNAL_API,
        400,
        'The requested resource is too large'
      );
    }
    
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      'External request failed',
      ERROR_CODES.EXTERNAL_API,
      502,
      'Failed to fetch external resource',
      error instanceof Error ? error : undefined
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Example 1: Simple authenticated endpoint
Deno.serve(createHandler(async (req, { user, base44 }) => {
  const body = await parseJsonBody(req);
  const validated = validatePayload(body, z.object({
    message: z.string().min(1).max(1000)
  }));
  
  return { 
    message: `Hello ${user.email}, you said: ${validated.message}` 
  };
}));

// Example 2: Admin-only endpoint with rate limiting
Deno.serve(createHandler(
  async (req, { user, base44 }) => {
    // Your logic here
    return { result: 'success' };
  },
  {
    requireAdmin: true,
    rateLimit: {
      maxRequests: 10,
      windowMs: 60000 // 10 requests per minute
    },
    endpoint: 'admin-export'
  }
));

// Example 3: Endpoint that fetches external URLs safely
Deno.serve(createHandler(async (req, { user, base44 }) => {
  const body = await parseJsonBody(req);
  const validated = validatePayload(body, z.object({
    imageUrl: z.string().url()
  }));
  
  // Safe fetch with SSRF protection
  const response = await safeFetch(validated.imageUrl, {
    allowedDomains: ['supabase.co', 'cloudinary.com'],
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    timeoutMs: 10000 // 10 seconds
  });
  
  const imageData = await response.arrayBuffer();
  
  return { 
    size: imageData.byteLength,
    contentType: response.headers.get('content-type')
  };
}));
*/
