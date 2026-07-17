/**
 * Supabase MCP Bridge
 * 
 * HTTP bridge exposing Supabase operations via MCP protocol.
 * Handles database queries, RLS validation, storage, and realtime.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7812
 */

import express, { Request, Response, NextFunction } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT = process.env.SUPABASE_BRIDGE_PORT || 7812;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  console.error('📋 Cause: Missing Supabase credentials');
  console.error('🔧 Fix: Export both environment variables from Supabase dashboard');
  console.error('🔄 Retry: export SUPABASE_URL=https://xxx.supabase.co && export SUPABASE_SERVICE_ROLE_KEY=...');
  process.exit(1);
}

// ============================================================================
// LOGGING
// ============================================================================

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'req.headers.apikey', 'supabase_key'],
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================

const QuerySchema = z.object({
  table: z.string().min(1).max(63),
  select: z.string().default('*'),
  filters: z.array(z.object({
    column: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains', 'containedBy']),
    value: z.any()
  })).optional(),
  order: z.object({
    column: z.string(),
    ascending: z.boolean().default(true)
  }).optional(),
  limit: z.number().min(1).max(1000).default(100),
  offset: z.number().min(0).default(0)
});

const InsertSchema = z.object({
  table: z.string().min(1).max(63),
  data: z.union([z.record(z.any()), z.array(z.record(z.any()))]),
  onConflict: z.string().optional(),
  returning: z.string().default('*')
});

const UpdateSchema = z.object({
  table: z.string().min(1).max(63),
  data: z.record(z.any()),
  filters: z.array(z.object({
    column: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte']),
    value: z.any()
  })).min(1), // At least one filter required for safety
  returning: z.string().default('*')
});

const DeleteSchema = z.object({
  table: z.string().min(1).max(63),
  filters: z.array(z.object({
    column: z.string(),
    operator: z.enum(['eq', 'neq', 'in']),
    value: z.any()
  })).min(1) // At least one filter required for safety
});

const RpcSchema = z.object({
  function: z.string().min(1).max(63),
  params: z.record(z.any()).default({})
});

const StorageSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  options: z.object({
    contentType: z.string().optional(),
    cacheControl: z.string().default('3600'),
    upsert: z.boolean().default(false)
  }).optional()
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: {
    error: 'Rate limit exceeded',
    cause: 'Too many requests to Supabase bridge',
    fix: 'Wait 60 seconds or optimize query batching',
    retry: true
  }
});
app.use(limiter);

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
    // Test connection with simple query
    const { data, error } = await supabase.from('_health_check').select('1').limit(1).maybeSingle();
    
    // Even if table doesn't exist, connection works if no network error
    const isHealthy = !error || error.code === 'PGRST116'; // Table not found is OK
    
    if (isHealthy) {
      res.json({
        status: 'healthy',
        service: 'supabase-bridge',
        version: '2.0.0',
        port: PORT,
        timestamp: new Date().toISOString(),
        supabase: {
          url: SUPABASE_URL,
          connected: true
        }
      });
    } else {
      throw error;
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      cause: 'Supabase connection failed',
      fix: 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
      retry: true
    });
  }
});

// ============================================================================
// MCP TOOL ENDPOINTS
// ============================================================================

/**
 * Query data from a table
 */
app.post('/mcp/query', async (req: Request, res: Response) => {
  try {
    const params = QuerySchema.parse(req.body);
    
    let query = supabase.from(params.table).select(params.select);
    
    // Apply filters
    if (params.filters) {
      for (const filter of params.filters) {
        query = applyFilter(query, filter);
      }
    }
    
    // Apply ordering
    if (params.order) {
      query = query.order(params.order.column, { ascending: params.order.ascending });
    }
    
    // Apply pagination
    query = query.range(params.offset, params.offset + params.limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      data,
      count: data?.length || 0,
      pagination: {
        offset: params.offset,
        limit: params.limit
      }
    });
  } catch (error: any) {
    handleError(res, error, 'query');
  }
});

/**
 * Insert data into a table
 */
app.post('/mcp/insert', async (req: Request, res: Response) => {
  try {
    const params = InsertSchema.parse(req.body);
    
    let query = supabase.from(params.table).insert(params.data);
    
    if (params.onConflict) {
      query = query.upsert(params.data, { onConflict: params.onConflict });
    }
    
    const { data, error } = await query.select(params.returning);
    
    if (error) throw error;
    
    logger.info({ table: params.table, count: Array.isArray(data) ? data.length : 1 }, 'Data inserted');
    
    res.json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : 1
    });
  } catch (error: any) {
    handleError(res, error, 'insert');
  }
});

/**
 * Update data in a table
 */
app.post('/mcp/update', async (req: Request, res: Response) => {
  try {
    const params = UpdateSchema.parse(req.body);
    
    let query = supabase.from(params.table).update(params.data);
    
    // Apply filters (required)
    for (const filter of params.filters) {
      query = applyFilter(query, filter);
    }
    
    const { data, error } = await query.select(params.returning);
    
    if (error) throw error;
    
    logger.info({ table: params.table, count: data?.length || 0 }, 'Data updated');
    
    res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error: any) {
    handleError(res, error, 'update');
  }
});

/**
 * Delete data from a table
 */
app.post('/mcp/delete', async (req: Request, res: Response) => {
  try {
    const params = DeleteSchema.parse(req.body);
    
    let query = supabase.from(params.table).delete();
    
    // Apply filters (required)
    for (const filter of params.filters) {
      query = applyFilter(query, filter);
    }
    
    const { data, error } = await query.select();
    
    if (error) throw error;
    
    logger.info({ table: params.table, count: data?.length || 0 }, 'Data deleted');
    
    res.json({
      success: true,
      deleted_count: data?.length || 0
    });
  } catch (error: any) {
    handleError(res, error, 'delete');
  }
});

/**
 * Call a database function (RPC)
 */
app.post('/mcp/rpc', async (req: Request, res: Response) => {
  try {
    const params = RpcSchema.parse(req.body);
    
    const { data, error } = await supabase.rpc(params.function, params.params);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    handleError(res, error, 'rpc');
  }
});

/**
 * List tables in the database
 */
app.post('/mcp/schema/tables', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.rpc('get_tables_info');
    
    // Fallback: query information_schema directly
    if (error) {
      const { data: tables, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public');
      
      if (schemaError) throw schemaError;
      
      res.json({
        success: true,
        data: tables,
        source: 'information_schema'
      });
      return;
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    handleError(res, error, 'schema/tables');
  }
});

/**
 * Get table schema (columns)
 */
app.post('/mcp/schema/columns', async (req: Request, res: Response) => {
  try {
    const { table } = req.body;
    if (!table) {
      return res.status(400).json({
        success: false,
        error: 'Table name required',
        cause: 'Missing table parameter',
        fix: 'Provide table name in request body',
        retry: false
      });
    }
    
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', table);
    
    if (error) throw error;
    
    res.json({
      success: true,
      table,
      columns: data
    });
  } catch (error: any) {
    handleError(res, error, 'schema/columns');
  }
});

/**
 * Audit RLS policies for a table
 */
app.post('/mcp/rls/audit', async (req: Request, res: Response) => {
  try {
    const { table } = req.body;
    
    // Get RLS policies
    const { data: policies, error } = await supabase.rpc('get_policies', { p_table: table });
    
    if (error) {
      // Fallback: query pg_policies directly
      const query = table
        ? `SELECT * FROM pg_policies WHERE tablename = '${table}'`
        : 'SELECT * FROM pg_policies WHERE schemaname = \'public\'';
      
      // Note: This requires service role access
      return res.json({
        success: true,
        warning: 'RLS audit requires custom RPC function for full details',
        suggestion: 'Create get_policies RPC or use Supabase dashboard',
        table
      });
    }
    
    res.json({
      success: true,
      table,
      policies,
      rls_enabled: policies?.length > 0
    });
  } catch (error: any) {
    handleError(res, error, 'rls/audit');
  }
});

/**
 * Storage: List files in bucket
 */
app.post('/mcp/storage/list', async (req: Request, res: Response) => {
  try {
    const { bucket, path = '', limit = 100 } = req.body;
    
    if (!bucket) {
      return res.status(400).json({
        success: false,
        error: 'Bucket name required',
        cause: 'Missing bucket parameter',
        fix: 'Provide bucket name in request body',
        retry: false
      });
    }
    
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit,
      sortBy: { column: 'name', order: 'asc' }
    });
    
    if (error) throw error;
    
    res.json({
      success: true,
      bucket,
      path,
      files: data
    });
  } catch (error: any) {
    handleError(res, error, 'storage/list');
  }
});

/**
 * Storage: Get public URL
 */
app.post('/mcp/storage/url', async (req: Request, res: Response) => {
  try {
    const params = StorageSchema.parse(req.body);
    
    const { data } = supabase.storage.from(params.bucket).getPublicUrl(params.path);
    
    res.json({
      success: true,
      url: data.publicUrl
    });
  } catch (error: any) {
    handleError(res, error, 'storage/url');
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function applyFilter(query: any, filter: { column: string; operator: string; value: any }) {
  const { column, operator, value } = filter;
  
  switch (operator) {
    case 'eq': return query.eq(column, value);
    case 'neq': return query.neq(column, value);
    case 'gt': return query.gt(column, value);
    case 'gte': return query.gte(column, value);
    case 'lt': return query.lt(column, value);
    case 'lte': return query.lte(column, value);
    case 'like': return query.like(column, value);
    case 'ilike': return query.ilike(column, value);
    case 'is': return query.is(column, value);
    case 'in': return query.in(column, value);
    case 'contains': return query.contains(column, value);
    case 'containedBy': return query.containedBy(column, value);
    default: return query;
  }
}

function handleError(res: Response, error: any, operation: string) {
  const status = error.status || error.code === 'PGRST' ? 400 : 500;
  
  logger.error({ operation, error: error.message, code: error.code }, 'Operation failed');
  
  // Zod validation error
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: 'Invalid request parameters',
      fix: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
      retry: false
    });
  }
  
  // Supabase/PostgreSQL errors
  if (error.code === 'PGRST116') {
    return res.status(404).json({
      success: false,
      error: 'Table not found',
      cause: `Table does not exist in public schema`,
      fix: 'Check table name and ensure it exists in Supabase',
      retry: false
    });
  }
  
  if (error.code === '42501') {
    return res.status(403).json({
      success: false,
      error: 'Permission denied',
      cause: 'RLS policy blocked this operation',
      fix: 'Check RLS policies or use service role key',
      retry: false
    });
  }
  
  if (error.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate key violation',
      cause: 'Record with this key already exists',
      fix: 'Use upsert or check for existing record first',
      retry: false
    });
  }
  
  res.status(status).json({
    success: false,
    error: error.message,
    code: error.code,
    cause: 'Database operation failed',
    fix: 'Check query parameters and database state',
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

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  logger.info({ port: PORT, supabase_url: SUPABASE_URL }, '🚀 Supabase MCP Bridge started');
  logger.info({ endpoints: [
    'GET  /health',
    'POST /mcp/query',
    'POST /mcp/insert',
    'POST /mcp/update',
    'POST /mcp/delete',
    'POST /mcp/rpc',
    'POST /mcp/schema/tables',
    'POST /mcp/schema/columns',
    'POST /mcp/rls/audit',
    'POST /mcp/storage/list',
    'POST /mcp/storage/url'
  ]}, 'Available endpoints');
});

export default app;
