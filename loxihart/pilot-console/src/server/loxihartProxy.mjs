import { authorizeConsoleAccess, jsonError, resolveRequiredSecret } from './consoleAuth.mjs';
import { forwardLoxihart, resolveOperation } from './loxihartTransport.mjs';

export const CONTROL_API_BASE = 'https://nvolybcifgkzxvywhpuv.supabase.co/functions/v1/loxihart-control-api';
const ORGANIZATION_ID = 'org-lakeview-hvac';
const ACTOR_ID = 'operator:kyle-demo';

/**
 * @param {Request} req
 * @returns {Promise<{ operation: string, payload: Record<string, unknown> }>}
 */
export async function parseRequest(req) {
  const url = new URL(req.url);
  if (req.method === 'GET') {
    return { operation: url.searchParams.get('operation') ?? '', payload: {} };
  }
  if (req.method !== 'POST') {
    throw Object.assign(new Error('Only GET and POST are supported.'), { status: 405 });
  }
  let parsed;
  try {
    parsed = await req.json();
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 422 });
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw Object.assign(new Error('Request body must be a JSON object.'), { status: 422 });
  }
  const { operation, ...payload } = parsed;
  return { operation: typeof operation === 'string' ? operation : '', payload };
}

/**
 * Fail-closed Pilot Console proxy: caller auth first, then upstream identity, then forward.
 * Never falls back to a hardcoded demo token.
 *
 * @param {Request} req
 * @param {{ get?: (name: string) => string | undefined | null }} env
 * @param {{
 *   controlApiBase?: string,
 *   forwardLoxihart?: typeof forwardLoxihart,
 *   fetchImpl?: typeof fetch,
 * }} [deps]
 * @returns {Promise<Response>}
 */
export async function handleLoxihartProxy(req, env, deps = {}) {
  const auth = authorizeConsoleAccess(req, env);
  if (!auth.ok) return auth.response;

  const demo = resolveRequiredSecret(env, 'LOXIHART_DEMO_TOKEN');
  if (!demo.ok) return demo.response;

  try {
    const { operation, payload } = await parseRequest(req);
    const resolved = resolveOperation(operation, payload);
    const forward = deps.forwardLoxihart ?? forwardLoxihart;
    const controlApiBase = deps.controlApiBase ?? CONTROL_API_BASE;
    return await forward({
      url: `${controlApiBase}${resolved.path}`,
      method: resolved.method,
      body: resolved.body,
      identity: {
        demoToken: demo.value,
        organizationId: ORGANIZATION_ID,
        actorId: ACTOR_ID,
      },
      ...(deps.fetchImpl ? { fetchImpl: deps.fetchImpl } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = Number(error?.status) || 422;
    return jsonError({ error: { code: 'PROXY_VALIDATION_ERROR', message } }, status);
  }
}
