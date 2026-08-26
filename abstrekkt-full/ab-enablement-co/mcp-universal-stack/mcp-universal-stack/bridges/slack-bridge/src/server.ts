/**
 * Slack MCP Bridge
 * 
 * HTTP bridge for Slack API operations: messaging, channels, search.
 * 
 * @author Kyle R. / Tessa (merged mastercontext)
 * @version 2.0.0
 * @port 7815
 */

import express, { Request, Response, NextFunction } from 'express';
import { WebClient } from '@slack/web-api';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';

const PORT = process.env.SLACK_BRIDGE_PORT || 7815;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN) {
  console.error('❌ Error: SLACK_BOT_TOKEN required');
  console.error('📋 Cause: Missing Slack Bot OAuth Token');
  console.error('🔧 Fix: Create Slack app, add bot scopes, install to workspace');
  process.exit(1);
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'slack_token'],
  transport: { target: 'pino-pretty', options: { colorize: true } }
});

const slack = new WebClient(SLACK_BOT_TOKEN);

// ============================================================================
// SCHEMAS
// ============================================================================

const PostMessageSchema = z.object({
  channel: z.string().min(1),
  text: z.string().min(1).max(40000),
  thread_ts: z.string().optional(),
  blocks: z.array(z.any()).optional(),
  unfurl_links: z.boolean().default(false)
});

const SearchSchema = z.object({
  query: z.string().min(1).max(1000),
  count: z.number().min(1).max(100).default(20),
  sort: z.enum(['timestamp', 'score']).default('timestamp'),
  sort_dir: z.enum(['asc', 'desc']).default('desc')
});

const ChannelSchema = z.object({
  channel: z.string().min(1),
  limit: z.number().min(1).max(1000).default(100),
  oldest: z.string().optional(),
  latest: z.string().optional()
});

// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60000, max: 60 }));

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
    const result = await slack.auth.test();
    res.json({
      status: 'healthy',
      service: 'slack-bridge',
      version: '2.0.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      slack: {
        team: result.team,
        user: result.user,
        bot_id: result.bot_id
      }
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Health check failed');
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

/**
 * Post a message to a channel
 */
app.post('/mcp/messages/post', async (req, res) => {
  try {
    const params = PostMessageSchema.parse(req.body);
    
    const result = await slack.chat.postMessage({
      channel: params.channel,
      text: params.text,
      thread_ts: params.thread_ts,
      blocks: params.blocks,
      unfurl_links: params.unfurl_links
    });
    
    logger.info({ channel: params.channel, ts: result.ts }, 'Message posted');
    
    res.json({
      success: true,
      data: {
        ok: result.ok,
        channel: result.channel,
        ts: result.ts,
        message: result.message
      }
    });
  } catch (error: any) {
    handleError(res, error, 'messages/post');
  }
});

/**
 * Get channel history
 */
app.post('/mcp/channels/history', async (req, res) => {
  try {
    const params = ChannelSchema.parse(req.body);
    
    const result = await slack.conversations.history({
      channel: params.channel,
      limit: params.limit,
      oldest: params.oldest,
      latest: params.latest
    });
    
    res.json({
      success: true,
      data: {
        messages: result.messages?.map(m => ({
          ts: m.ts,
          user: m.user,
          text: m.text,
          type: m.type,
          thread_ts: m.thread_ts,
          reply_count: m.reply_count
        })),
        has_more: result.has_more,
        response_metadata: result.response_metadata
      }
    });
  } catch (error: any) {
    handleError(res, error, 'channels/history');
  }
});

/**
 * List channels
 */
app.post('/mcp/channels/list', async (req, res) => {
  try {
    const { types = 'public_channel,private_channel', limit = 100 } = req.body;
    
    const result = await slack.conversations.list({
      types,
      limit,
      exclude_archived: true
    });
    
    res.json({
      success: true,
      data: result.channels?.map(c => ({
        id: c.id,
        name: c.name,
        is_private: c.is_private,
        is_member: c.is_member,
        num_members: c.num_members,
        topic: c.topic?.value,
        purpose: c.purpose?.value
      }))
    });
  } catch (error: any) {
    handleError(res, error, 'channels/list');
  }
});

/**
 * Get thread replies
 */
app.post('/mcp/threads/replies', async (req, res) => {
  try {
    const { channel, ts, limit = 100 } = req.body;
    
    if (!channel || !ts) {
      return res.status(400).json({
        success: false,
        error: 'channel and ts required',
        fix: 'Provide channel ID and thread timestamp',
        retry: false
      });
    }
    
    const result = await slack.conversations.replies({
      channel,
      ts,
      limit
    });
    
    res.json({
      success: true,
      data: {
        messages: result.messages?.map(m => ({
          ts: m.ts,
          user: m.user,
          text: m.text,
          type: m.type
        })),
        has_more: result.has_more
      }
    });
  } catch (error: any) {
    handleError(res, error, 'threads/replies');
  }
});

/**
 * Search messages
 */
app.post('/mcp/search', async (req, res) => {
  try {
    const params = SearchSchema.parse(req.body);
    
    const result = await slack.search.messages({
      query: params.query,
      count: params.count,
      sort: params.sort,
      sort_dir: params.sort_dir
    });
    
    res.json({
      success: true,
      data: {
        total: result.messages?.total,
        matches: result.messages?.matches?.map(m => ({
          ts: m.ts,
          channel: { id: m.channel?.id, name: m.channel?.name },
          user: m.user,
          text: m.text,
          permalink: m.permalink
        }))
      }
    });
  } catch (error: any) {
    handleError(res, error, 'search');
  }
});

/**
 * Get user info
 */
app.post('/mcp/users/info', async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'user ID required',
        retry: false
      });
    }
    
    const result = await slack.users.info({ user });
    
    res.json({
      success: true,
      data: {
        id: result.user?.id,
        name: result.user?.name,
        real_name: result.user?.real_name,
        email: result.user?.profile?.email,
        title: result.user?.profile?.title,
        is_bot: result.user?.is_bot,
        is_admin: result.user?.is_admin
      }
    });
  } catch (error: any) {
    handleError(res, error, 'users/info');
  }
});

/**
 * List users
 */
app.post('/mcp/users/list', async (req, res) => {
  try {
    const { limit = 100 } = req.body;
    
    const result = await slack.users.list({ limit });
    
    res.json({
      success: true,
      data: result.members?.filter(m => !m.deleted && !m.is_bot).map(m => ({
        id: m.id,
        name: m.name,
        real_name: m.real_name,
        email: m.profile?.email,
        title: m.profile?.title,
        is_admin: m.is_admin
      }))
    });
  } catch (error: any) {
    handleError(res, error, 'users/list');
  }
});

/**
 * Add reaction to message
 */
app.post('/mcp/reactions/add', async (req, res) => {
  try {
    const { channel, timestamp, name } = req.body;
    
    if (!channel || !timestamp || !name) {
      return res.status(400).json({
        success: false,
        error: 'channel, timestamp, and name required',
        retry: false
      });
    }
    
    await slack.reactions.add({ channel, timestamp, name });
    
    res.json({ success: true, message: `Reaction :${name}: added` });
  } catch (error: any) {
    handleError(res, error, 'reactions/add');
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(res: Response, error: any, operation: string) {
  logger.error({ operation, error: error.message, code: error.data?.error }, 'Failed');
  
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      cause: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
      retry: false
    });
  }
  
  const slackError = error.data?.error;
  const slackErrors: Record<string, { status: number; fix: string }> = {
    'channel_not_found': { status: 404, fix: 'Check channel ID or add bot to channel' },
    'not_in_channel': { status: 403, fix: 'Add bot to channel' },
    'invalid_auth': { status: 401, fix: 'Regenerate Slack bot token' },
    'missing_scope': { status: 403, fix: 'Add required OAuth scope to Slack app' },
    'ratelimited': { status: 429, fix: 'Wait and retry with backoff' }
  };
  
  const knownError = slackErrors[slackError];
  if (knownError) {
    return res.status(knownError.status).json({
      success: false,
      error: slackError,
      fix: knownError.fix,
      retry: slackError === 'ratelimited'
    });
  }
  
  res.status(500).json({
    success: false,
    error: error.message || slackError,
    retry: true
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', retry: false });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, '🚀 Slack MCP Bridge started');
});

export default app;
