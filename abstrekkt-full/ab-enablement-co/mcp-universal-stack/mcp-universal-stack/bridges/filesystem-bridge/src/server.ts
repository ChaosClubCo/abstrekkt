/**
 * Filesystem MCP Bridge
 * 
 * Secure filesystem access with path allowlisting and symlink protection.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7819
 */

import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream, statSync } from 'fs';
import { createHash } from 'crypto';
import { glob } from 'glob';

const PORT = process.env.FILESYSTEM_BRIDGE_PORT || 7819;
const ALLOWED_PATHS = (process.env.FILESYSTEM_ALLOWED_PATHS || '/home/claude/projects,/home/claude/documents')
  .split(',')
  .map(p => path.resolve(p.trim()));
const MAX_FILE_SIZE = (parseInt(process.env.FILESYSTEM_MAX_FILE_SIZE_MB || '100') * 1024 * 1024);

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: { target: 'pino-pretty', options: { colorize: true } }
});

// ============================================================================
// SECURITY FUNCTIONS
// ============================================================================

/**
 * Validate that a path is within allowed directories
 */
async function validatePath(requestedPath: string): Promise<{ valid: boolean; resolved?: string; error?: string }> {
  try {
    // Resolve to absolute path
    const resolved = path.resolve(requestedPath);
    
    // Check against allowed paths
    const isAllowed = ALLOWED_PATHS.some(allowed => {
      return resolved.startsWith(allowed + path.sep) || resolved === allowed;
    });
    
    if (!isAllowed) {
      return {
        valid: false,
        error: `Path not in allowed directories: ${ALLOWED_PATHS.join(', ')}`
      };
    }
    
    // Check for symlink attacks
    try {
      const realPath = await fs.realpath(resolved);
      const isRealPathAllowed = ALLOWED_PATHS.some(allowed => {
        return realPath.startsWith(allowed + path.sep) || realPath === allowed;
      });
      
      if (!isRealPathAllowed) {
        return {
          valid: false,
          error: 'Symlink points outside allowed directories'
        };
      }
      
      return { valid: true, resolved: realPath };
    } catch (e) {
      // Path doesn't exist yet (for write operations)
      // Check parent directory
      const parentDir = path.dirname(resolved);
      try {
        const realParent = await fs.realpath(parentDir);
        const isParentAllowed = ALLOWED_PATHS.some(allowed => {
          return realParent.startsWith(allowed + path.sep) || realParent === allowed;
        });
        
        if (!isParentAllowed) {
          return {
            valid: false,
            error: 'Parent directory symlink points outside allowed directories'
          };
        }
        
        return { valid: true, resolved };
      } catch {
        return { valid: false, error: 'Parent directory does not exist' };
      }
    }
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

// ============================================================================
// SCHEMAS
// ============================================================================

const PathSchema = z.object({
  path: z.string().min(1).max(4096)
});

const ReadSchema = z.object({
  path: z.string().min(1).max(4096),
  encoding: z.enum(['utf-8', 'base64', 'hex']).default('utf-8'),
  start: z.number().optional(),
  end: z.number().optional()
});

const WriteSchema = z.object({
  path: z.string().min(1).max(4096),
  content: z.string(),
  encoding: z.enum(['utf-8', 'base64']).default('utf-8'),
  mode: z.enum(['write', 'append']).default('write'),
  createDirs: z.boolean().default(false)
});

const SearchSchema = z.object({
  pattern: z.string().min(1).max(256),
  cwd: z.string().optional(),
  maxDepth: z.number().min(1).max(10).default(5),
  ignore: z.array(z.string()).default(['node_modules', '.git', '*.log'])
});

const ListSchema = z.object({
  path: z.string().min(1).max(4096),
  recursive: z.boolean().default(false),
  maxDepth: z.number().min(1).max(5).default(2),
  includeHidden: z.boolean().default(false)
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();
app.use(helmet());
app.use(express.json({ limit: '50mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Rate limit exceeded', retry: true }
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
  // Verify allowed paths exist and are accessible
  const pathChecks = await Promise.all(
    ALLOWED_PATHS.map(async (p) => {
      try {
        await fs.access(p);
        return { path: p, accessible: true };
      } catch {
        return { path: p, accessible: false };
      }
    })
  );
  
  const allAccessible = pathChecks.every(c => c.accessible);
  
  res.status(allAccessible ? 200 : 503).json({
    status: allAccessible ? 'healthy' : 'degraded',
    service: 'filesystem-bridge',
    version: '2.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
    config: {
      allowed_paths: ALLOWED_PATHS,
      max_file_size_mb: MAX_FILE_SIZE / 1024 / 1024,
      path_checks: pathChecks
    }
  });
});

/**
 * Read file contents
 */
app.post('/mcp/read', async (req, res) => {
  try {
    const params = ReadSchema.parse(req.body);
    const validation = await validatePath(params.path);
    
    if (!validation.valid) {
      return res.status(403).json({
        success: false,
        error: 'Path validation failed',
        cause: validation.error,
        fix: `Use paths within: ${ALLOWED_PATHS.join(', ')}`,
        retry: false
      });
    }
    
    const filePath = validation.resolved!;
    const stats = await fs.stat(filePath);
    
    if (!stats.isFile()) {
      return res.status(400).json({
        success: false,
        error: 'Not a file',
        cause: 'Path points to a directory',
        fix: 'Use /mcp/list for directories',
        retry: false
      });
    }
    
    if (stats.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        success: false,
        error: 'File too large',
        cause: `File size ${stats.size} exceeds limit ${MAX_FILE_SIZE}`,
        fix: 'Use start/end parameters for partial read',
        retry: false
      });
    }
    
    let content: string;
    if (params.start !== undefined || params.end !== undefined) {
      // Partial read
      const buffer = Buffer.alloc((params.end || stats.size) - (params.start || 0));
      const fd = await fs.open(filePath, 'r');
      await fd.read(buffer, 0, buffer.length, params.start || 0);
      await fd.close();
      content = buffer.toString(params.encoding === 'base64' ? 'base64' : 'utf-8');
    } else {
      content = await fs.readFile(filePath, params.encoding === 'base64' ? 'base64' : 'utf-8');
    }
    
    const hash = createHash('sha256').update(content).digest('hex').substring(0, 16);
    
    res.json({
      success: true,
      data: {
        path: filePath,
        content,
        size: stats.size,
        hash,
        modified: stats.mtime.toISOString(),
        encoding: params.encoding
      }
    });
  } catch (error: any) {
    handleError(res, error, 'read');
  }
});

/**
 * Write file contents
 */
app.post('/mcp/write', async (req, res) => {
  try {
    const params = WriteSchema.parse(req.body);
    const validation = await validatePath(params.path);
    
    if (!validation.valid) {
      return res.status(403).json({
        success: false,
        error: 'Path validation failed',
        cause: validation.error,
        fix: `Use paths within: ${ALLOWED_PATHS.join(', ')}`,
        retry: false
      });
    }
    
    const filePath = validation.resolved!;
    
    // Create directories if needed
    if (params.createDirs) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    
    const content = params.encoding === 'base64' 
      ? Buffer.from(params.content, 'base64')
      : params.content;
    
    if (params.mode === 'append') {
      await fs.appendFile(filePath, content);
    } else {
      await fs.writeFile(filePath, content);
    }
    
    const stats = await fs.stat(filePath);
    
    logger.info({ path: filePath, size: stats.size, mode: params.mode }, 'File written');
    
    res.json({
      success: true,
      data: {
        path: filePath,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        mode: params.mode
      }
    });
  } catch (error: any) {
    handleError(res, error, 'write');
  }
});

/**
 * List directory contents
 */
app.post('/mcp/list', async (req, res) => {
  try {
    const params = ListSchema.parse(req.body);
    const validation = await validatePath(params.path);
    
    if (!validation.valid) {
      return res.status(403).json({
        success: false,
        error: 'Path validation failed',
        cause: validation.error,
        retry: false
      });
    }
    
    const dirPath = validation.resolved!;
    const stats = await fs.stat(dirPath);
    
    if (!stats.isDirectory()) {
      return res.status(400).json({
        success: false,
        error: 'Not a directory',
        cause: 'Path points to a file',
        fix: 'Use /mcp/read for files',
        retry: false
      });
    }
    
    const entries: any[] = [];
    
    async function listDir(dir: string, depth: number) {
      if (depth > params.maxDepth) return;
      
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        if (!params.includeHidden && item.name.startsWith('.')) continue;
        
        const itemPath = path.join(dir, item.name);
        const relativePath = path.relative(dirPath, itemPath);
        
        try {
          const itemStats = await fs.stat(itemPath);
          
          entries.push({
            name: item.name,
            path: relativePath,
            type: item.isDirectory() ? 'directory' : 'file',
            size: item.isFile() ? itemStats.size : undefined,
            modified: itemStats.mtime.toISOString()
          });
          
          if (params.recursive && item.isDirectory()) {
            await listDir(itemPath, depth + 1);
          }
        } catch (e) {
          // Skip inaccessible items
        }
      }
    }
    
    await listDir(dirPath, 1);
    
    res.json({
      success: true,
      data: {
        path: dirPath,
        entries,
        total: entries.length,
        directories: entries.filter(e => e.type === 'directory').length,
        files: entries.filter(e => e.type === 'file').length
      }
    });
  } catch (error: any) {
    handleError(res, error, 'list');
  }
});

/**
 * Search for files by pattern
 */
app.post('/mcp/search', async (req, res) => {
  try {
    const params = SearchSchema.parse(req.body);
    
    let searchDir = ALLOWED_PATHS[0];
    if (params.cwd) {
      const validation = await validatePath(params.cwd);
      if (!validation.valid) {
        return res.status(403).json({
          success: false,
          error: 'cwd validation failed',
          cause: validation.error,
          retry: false
        });
      }
      searchDir = validation.resolved!;
    }
    
    const matches = await glob(params.pattern, {
      cwd: searchDir,
      ignore: params.ignore,
      maxDepth: params.maxDepth,
      absolute: true
    });
    
    // Filter to allowed paths only
    const validMatches = matches.filter(m => {
      return ALLOWED_PATHS.some(allowed => m.startsWith(allowed));
    });
    
    const results = await Promise.all(
      validMatches.slice(0, 100).map(async (match) => {
        try {
          const stats = await fs.stat(match);
          return {
            path: match,
            relative: path.relative(searchDir, match),
            type: stats.isDirectory() ? 'directory' : 'file',
            size: stats.isFile() ? stats.size : undefined,
            modified: stats.mtime.toISOString()
          };
        } catch {
          return null;
        }
      })
    );
    
    res.json({
      success: true,
      data: {
        pattern: params.pattern,
        cwd: searchDir,
        matches: results.filter(Boolean),
        total: validMatches.length,
        truncated: validMatches.length > 100
      }
    });
  } catch (error: any) {
    handleError(res, error, 'search');
  }
});

/**
 * Get file/directory info
 */
app.post('/mcp/stat', async (req, res) => {
  try {
    const params = PathSchema.parse(req.body);
    const validation = await validatePath(params.path);
    
    if (!validation.valid) {
      return res.status(403).json({
        success: false,
        error: 'Path validation failed',
        cause: validation.error,
        retry: false
      });
    }
    
    const targetPath = validation.resolved!;
    const stats = await fs.stat(targetPath);
    
    res.json({
      success: true,
      data: {
        path: targetPath,
        type: stats.isDirectory() ? 'directory' : stats.isFile() ? 'file' : 'other',
        size: stats.size,
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        accessed: stats.atime.toISOString(),
        mode: stats.mode.toString(8),
        isSymlink: stats.isSymbolicLink()
      }
    });
  } catch (error: any) {
    handleError(res, error, 'stat');
  }
});

/**
 * Delete file or directory
 */
app.post('/mcp/delete', async (req, res) => {
  try {
    const { path: targetPath, recursive = false, confirm_delete } = req.body;
    
    if (!confirm_delete) {
      return res.status(400).json({
        success: false,
        error: 'Delete confirmation required',
        cause: 'Destructive operation requires confirmation',
        fix: 'Add confirm_delete: true to request',
        retry: false
      });
    }
    
    const validation = await validatePath(targetPath);
    if (!validation.valid) {
      return res.status(403).json({
        success: false,
        error: 'Path validation failed',
        cause: validation.error,
        retry: false
      });
    }
    
    const resolvedPath = validation.resolved!;
    const stats = await fs.stat(resolvedPath);
    
    if (stats.isDirectory()) {
      if (recursive) {
        await fs.rm(resolvedPath, { recursive: true });
      } else {
        await fs.rmdir(resolvedPath);
      }
    } else {
      await fs.unlink(resolvedPath);
    }
    
    logger.info({ path: resolvedPath, recursive }, 'Deleted');
    
    res.json({
      success: true,
      data: {
        path: resolvedPath,
        deleted: true
      }
    });
  } catch (error: any) {
    handleError(res, error, 'delete');
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
  
  if (error.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: 'Path not found',
      cause: 'File or directory does not exist',
      retry: false
    });
  }
  
  if (error.code === 'EACCES' || error.code === 'EPERM') {
    return res.status(403).json({
      success: false,
      error: 'Permission denied',
      cause: 'Insufficient permissions to access path',
      retry: false
    });
  }
  
  if (error.code === 'ENOTEMPTY') {
    return res.status(400).json({
      success: false,
      error: 'Directory not empty',
      cause: 'Cannot delete non-empty directory',
      fix: 'Use recursive: true to delete contents',
      retry: false
    });
  }
  
  res.status(500).json({
    success: false,
    error: error.message,
    cause: 'Filesystem operation failed',
    retry: true
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', retry: false });
});

app.listen(PORT, () => {
  logger.info({ port: PORT, allowed_paths: ALLOWED_PATHS }, '🚀 Filesystem MCP Bridge started');
});

export default app;
