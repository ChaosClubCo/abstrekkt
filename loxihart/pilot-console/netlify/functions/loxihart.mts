import type { Config, Context } from '@netlify/functions';
import { forwardLoxihart, resolveDemoToken, resolveOperation } from '../../src/server/loxihartTransport.mjs';

const CONTROL_API_BASE = 'https://nvolybcifgkzxvywhpuv.supabase.co/functions/v1/loxihart-control-api';
const ORGANIZATION_ID = 'org-lakeview-hvac';
const ACTOR_ID = 'operator:kyle-demo';
// Staging-only fallback for the fictional Lakeview demo. Production identities must use managed secrets.
const STAGING_DEMO_TOKEN = 'lakeview-public-demo-v1';
const STAGING_DEMO_HOSTS = new Set(['loxihart-pilot-console.netlify.app']);

function proxyError(code: string, message: string, status: number) {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function parseRequest(req: Request) {
  const url = new URL(req.url);
  if (req.method === 'GET') {
    return { operation: url.searchParams.get('operation') ?? '', payload: {} };
  }
  if (req.method !== 'POST') {
    throw Object.assign(new Error('Only GET and POST are supported.'), { status: 405 });
  }
  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 422 });
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw Object.assign(new Error('Request body must be a JSON object.'), { status: 422 });
  }
  const { operation, ...payload } = parsed as Record<string, unknown>;
  return { operation: typeof operation === 'string' ? operation : '', payload };
}

export default async (req: Request, _context: Context) => {
  try {
    const { operation, payload } = await parseRequest(req);
    const resolved = resolveOperation(operation, payload);
    const demoToken = resolveDemoToken({
      configuredToken: Netlify.env.get('LOXIHART_DEMO_TOKEN'),
      requestUrl: req.url,
      stagingToken: STAGING_DEMO_TOKEN,
      allowedHosts: STAGING_DEMO_HOSTS,
    });

    if (operation !== 'health' && !demoToken) {
      return proxyError('PROXY_CONFIGURATION_ERROR', 'LOXIHART_DEMO_TOKEN is not configured for this deployment.', 500);
    }

    return await forwardLoxihart({
      url: `${CONTROL_API_BASE}${resolved.path}`,
      method: resolved.method,
      body: resolved.body,
      identity: {
        demoToken: demoToken ?? '',
        organizationId: ORGANIZATION_ID,
        actorId: ACTOR_ID,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = Number((error as { status?: number })?.status) || 422;
    return proxyError('PROXY_VALIDATION_ERROR', message, status);
  }
};

export const config: Config = {
  path: '/api/loxihart',
};
