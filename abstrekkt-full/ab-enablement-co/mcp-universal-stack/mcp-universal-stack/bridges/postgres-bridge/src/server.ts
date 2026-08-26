/**
 * PostgreSQL MCP Bridge
 * 
 * Direct PostgreSQL access for SQL queries, schema inspection, and RLS audits.
 * Use this when Supabase abstraction is insufficient.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7814
 */

import express, { Request, Response, NextFunction } from 'express';
import pg, { Pool, PoolClient } from 'pg';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PORT = process.env.POSTGRES_BRIDGE_PORT || 7814;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable required');
  console.error('📋 Cause: Missing PostgreSQL connection string');
  console.error('🔧 Fix: Export DATABASE_URL=postgres://user:pass@host:5432/db');
  process.exit(1);
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'database_url', 'password'],
  transport: { target: 'pino-pretty', options: { colorize: true } }
});

// ============================================================================
// DATABASE POOL
// ============================================================================

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  logger.error({ error: err.message }, 'Unexpected pool error');
});

// ============================================================================
// INPUT VALIDATION
// ============================================================================

const QuerySchema = z.object({
  sql: z.string().min(1).max(10000),
  params: z.array(z.any()).default([]),
  timeout: z.number().min(1000).max(60000).default(30000)
});

const ExplainSchema = z.object({
  sql: z.string().min(1).max(10000),
  params: z.array(z.any()).default([]),
  analyze: z.boolean().default(false),
  buffers: z.boolean().default(false),
  format: z.enum(['text', 'json']).default('json')
});

// ============================================================================
// SECURITY: SQL INJECTION PREVENTION
// ============================================================================

const DANGEROUS_PATTERNS = [
  /;\s*DROP\s+/i,
  /;\s*DELETE\s+FROM\s+\w+\s*$/i, // DELETE without WHERE
  /;\s*TRUNCATE\s+/i,
  /;\s*ALTER\s+SYSTEM/i,
  /;\s*CREATE\s+ROLE/i,
  /;\s*GRANT\s+/i,
  /pg_read_file/i,
  /pg_write_file/i,
  /COPY\s+.*\s+FROM\s+PROGRAM/i
];

function validateSqlSafety(sql: string): { safe: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sql)) {
      return { safe: false, reason: `Potentially dangerous pattern detected: ${pattern.source}` };
    }
  }
  return { safe: true };
}

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Rate limit exceeded', cause: 'Too many queries', fix: 'Wait 60s', retry: true }
});
app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
  logger.info({ requestId: req.headers['x-request-id'], method: req.method, path: req.path }, 'Request');
  next();
});

// ============================================================================
// ENDPOINTS
// ============================================================================

app.get('/health', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version(), current_database(), current_user');
    client.release();
    
    res.json({
      status: 'healthy',
      service: 'postgres-bridge',
      version: '2.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      postgres: {
        version: result.rows[0].version.split(' ')[1],
        database: result.rows[0].current_database,
        user: result.rows[0].current_user,
        pool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount
        }
      }
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      cause: 'PostgreSQL connection failed',
      fix: 'Check DATABASE_URL and network connectivity',
      retry: true
    });
  }
});

/**
 * Execute a read-only query (SELECT, WITH, VALUES)
 */
app.post('/mcp/query', async (req: Request, res: Response) => {
  let client: PoolClient | null = null;
  try {
    const params = QuerySchema.parse(req.body);
    
    // Validate SQL safety
    const safety = validateSqlSafety(params.sql);
    if (!safety.safe) {
      return res.status(400).json({
        success: false,
        error: 'SQL validation failed',
        cause: safety.reason,
        fix: 'Remove dangerous SQL patterns',
        retry: false
      });
    }
    
    // Only allow read operations via this endpoint
    const sqlUpper = params.sql.trim().toUpperCase();
    if (!sqlUpper.startsWith('SELECT') && !sqlUpper.startsWith('WITH') && !sqlUpper.startsWith('VALUES')) {
      return res.status(400).json({
        success: false,
        error: 'Only SELECT queries allowed',
        cause: 'Use /mcp/execute for write operations',
        fix: 'Change endpoint or query type',
        retry: false
      });
    }
    
    client = await pool.connect();
    await client.query(`SET statement_timeout = ${params.timeout}`);
    
    const start = Date.now();
    const result = await client.query(params.sql, params.params);
    const duration = Date.now() - start;
    
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map(f => ({ name: f.name, dataTypeID: f.dataTypeID })),
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'query');
  } finally {
    client?.release();
  }
});

/**
 * Execute a write query (INSERT, UPDATE, DELETE) - requires explicit flag
 */
app.post('/mcp/execute', async (req: Request, res: Response) => {
  let client: PoolClient | null = null;
  try {
    const params = QuerySchema.parse(req.body);
    const { confirm_write } = req.body;
    
    if (!confirm_write) {
      return res.status(400).json({
        success: false,
        error: 'Write confirmation required',
        cause: 'Write operations require explicit confirmation',
        fix: 'Add confirm_write: true to request body',
        retry: false
      });
    }
    
    const safety = validateSqlSafety(params.sql);
    if (!safety.safe) {
      return res.status(400).json({
        success: false,
        error: 'SQL validation failed',
        cause: safety.reason,
        fix: 'Remove dangerous SQL patterns',
        retry: false
      });
    }
    
    client = await pool.connect();
    await client.query(`SET statement_timeout = ${params.timeout}`);
    
    const start = Date.now();
    const result = await client.query(params.sql, params.params);
    const duration = Date.now() - start;
    
    logger.info({ 
      command: result.command, 
      rowCount: result.rowCount,
      duration_ms: duration 
    }, 'Write executed');
    
    res.json({
      success: true,
      command: result.command,
      rowCount: result.rowCount,
      data: result.rows,
      duration_ms: duration
    });
  } catch (error: any) {
    handleError(res, error, 'execute');
  } finally {
    client?.release();
  }
});

/**
 * Explain query plan
 */
app.post('/mcp/explain', async (req: Request, res: Response) => {
  let client: PoolClient | null = null;
  try {
    const params = ExplainSchema.parse(req.body);
    
    let explainSql = 'EXPLAIN';
    if (params.analyze) explainSql += ' ANALYZE';
    if (params.buffers) explainSql += ' BUFFERS';
    explainSql += ` (FORMAT ${params.format.toUpperCase()}) ${params.sql}`;
    
    client = await pool.connect();
    const result = await client.query(explainSql, params.params);
    
    res.json({
      success: true,
      plan: params.format === 'json' ? result.rows[0]['QUERY PLAN'] : result.rows.map(r => r['QUERY PLAN']).join('\n')
    });
  } catch (error: any) {
    handleError(res, error, 'explain');
  } finally {
    client?.release();
  }
});

/**
 * List all tables with row counts
 */
app.post('/mcp/schema/tables', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        (SELECT count(*) FROM information_schema.columns c 
         WHERE c.table_schema = schemaname AND c.table_name = tablename) as column_count,
        pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
      FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schemaname, tablename
    `);
    
    res.json({
      success: true,
      tables: result.rows
    });
  } catch (error: any) {
    handleError(res, error, 'schema/tables');
  }
});

/**
 * Get column definitions for a table
 */
app.post('/mcp/schema/columns', async (req: Request, res: Response) => {
  try {
    const { table, schema = 'public' } = req.body;
    
    if (!table) {
      return res.status(400).json({
        success: false,
        error: 'Table name required',
        retry: false
      });
    }
    
    const result = await pool.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default,
        (SELECT EXISTS(
          SELECT 1 FROM information_schema.key_column_usage k
          WHERE k.table_schema = c.table_schema 
            AND k.table_name = c.table_name 
            AND k.column_name = c.column_name
        )) as is_key
      FROM information_schema.columns c
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position
    `, [schema, table]);
    
    res.json({
      success: true,
      schema,
      table,
      columns: result.rows
    });
  } catch (error: any) {
    handleError(res, error, 'schema/columns');
  }
});

/**
 * Get indexes for a table
 */
app.post('/mcp/schema/indexes', async (req: Request, res: Response) => {
  try {
    const { table, schema = 'public' } = req.body;
    
    const result = await pool.query(`
      SELECT
        indexname,
        indexdef,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as size
      FROM pg_indexes
      WHERE schemaname = $1 AND tablename = $2
    `, [schema, table]);
    
    res.json({
      success: true,
      schema,
      table,
      indexes: result.rows
    });
  } catch (error: any) {
    handleError(res, error, 'schema/indexes');
  }
});

/**
 * Audit RLS policies
 */
app.post('/mcp/rls/audit', async (req: Request, res: Response) => {
  try {
    const { table, schema = 'public' } = req.body;
    
    let query = `
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = $1
    `;
    const params = [schema];
    
    if (table) {
      query += ' AND tablename = $2';
      params.push(table);
    }
    
    const policiesResult = await pool.query(query, params);
    
    // Also check if RLS is enabled on tables
    const rlsEnabledResult = await pool.query(`
      SELECT 
        relname as tablename,
        relrowsecurity as rls_enabled,
        relforcerowsecurity as rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = $1 AND c.relkind = 'r'
      ${table ? 'AND c.relname = $2' : ''}
    `, table ? [schema, table] : [schema]);
    
    res.json({
      success: true,
      schema,
      table: table || 'all',
      policies: policiesResult.rows,
      tables_rls_status: rlsEnabledResult.rows,
      audit_summary: {
        total_policies: policiesResult.rowCount,
        tables_with_rls: rlsEnabledResult.rows.filter(r => r.rls_enabled).length,
        tables_without_rls: rlsEnabledResult.rows.filter(r => !r.rls_enabled).length
      }
    });
  } catch (error: any) {
    handleError(res, error, 'rls/audit');
  }
});

/**
 * Get active connections and queries
 */
app.post('/mcp/activity', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        pid,
        usename,
        application_name,
        client_addr,
        state,
        query_start,
        now() - query_start as duration,
        LEFT(query, 100) as query_preview
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
      ORDER BY query_start DESC NULLS LAST
      LIMIT 50
    `);
    
    res.json({
      success: true,
      connections: result.rows,
      pool_stats: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    });
  } catch (error: any) {
    handleError(res, error, 'activity');
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(res: Response, error: any, operation: string) {
  logger.error({ operation, error: error.message, code: error.code }, 'Operation failed');
  
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
      retry: false
    });
  }
  
  // PostgreSQL error codes
  const pgErrors: Record<string, { status: number; message: string }> = {
    '42P01': { status: 404, message: 'Table does not exist' },
    '42703': { status: 400, message: 'Column does not exist' },
    '42501': { status: 403, message: 'Permission denied' },
    '57014': { status: 408, message: 'Query cancelled (timeout)' },
    '23505': { status: 409, message: 'Unique constraint violation' },
    '23503': { status: 409, message: 'Foreign key constraint violation' }
  };
  
  const pgError = pgErrors[error.code];
  if (pgError) {
    return res.status(pgError.status).json({
      success: false,
      error: pgError.message,
      code: error.code,
      detail: error.detail,
      fix: 'Check query syntax and table/column names',
      retry: false
    });
  }
  
  res.status(500).json({
    success: false,
    error: error.message,
    code: error.code,
    cause: 'Database operation failed',
    retry: true
  });
}

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found', retry: false });
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 PostgreSQL MCP Bridge started');
});

export default app;
