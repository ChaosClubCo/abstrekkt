const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

async function api(path, init = {}) {
  const accountId = required('CLOUDFLARE_ACCOUNT_ID');
  const token = required('CLOUDFLARE_API_TOKEN');
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Cloudflare API returned non-JSON HTTP ${response.status} for ${path}`);
  }
  if (!response.ok || payload.success === false) {
    const message = payload?.errors?.map((error) => error.message).filter(Boolean).join('; ');
    throw new Error(`Cloudflare API HTTP ${response.status} for ${path}: ${message || 'request failed'}`);
  }
  return payload.result ?? payload;
}

export function buildTelemetryQueryBody(view, filters, from, to, limit = 200) {
  return {
    queryId: `kr-mentor-proxy-${view}-${Date.now()}`,
    timeframe: { from, to },
    limit,
    dry: true,
    view,
    parameters: {
      datasets: [],
      filterCombination: 'and',
      filters,
    },
  };
}

export async function queryTelemetry(view, filters, from, to, limit = 200) {
  return api('/workers/observability/telemetry/query', {
    method: 'POST',
    body: JSON.stringify(buildTelemetryQueryBody(view, filters, from, to, limit)),
  });
}

export async function getScriptSettings(workerName) {
  return api(`/workers/scripts/${encodeURIComponent(workerName)}/settings`, { method: 'GET' });
}

export async function getScriptLevelSettings(workerName) {
  return api(`/workers/scripts/${encodeURIComponent(workerName)}/script-settings`, { method: 'GET' });
}

export async function patchScriptLevelSettings(workerName, settings) {
  return api(`/workers/scripts/${encodeURIComponent(workerName)}/script-settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}

export function traceRows(result) {
  if (Array.isArray(result?.traces)) return result.traces;
  if (Array.isArray(result?.data?.traces)) return result.data.traces;
  return [];
}

export function eventRows(result) {
  if (Array.isArray(result?.events)) return result.events;
  if (Array.isArray(result?.events?.events)) return result.events.events;
  if (Array.isArray(result?.data?.events)) return result.data.events;
  if (Array.isArray(result?.data?.events?.events)) return result.data.events.events;
  if (result?.invocations && typeof result.invocations === 'object') {
    return Object.values(result.invocations).flatMap((events) => (Array.isArray(events) ? events : []));
  }
  return [];
}

export function metadata(event) {
  return event?.$metadata || event?.metadata || {};
}

export function eventTraceId(event) {
  return metadata(event).traceId || event?.$workers?.traceId || event?.traceId || null;
}

export function eventVersionId(event) {
  return event?.$workers?.scriptVersion?.id || metadata(event).scriptVersion?.id || event?.scriptVersion?.id || null;
}

export function eventService(event) {
  return metadata(event).service || event?.$workers?.scriptName || null;
}

export function leafFilter(key, value, type = 'string') {
  return { key, operation: 'eq', type, value };
}

export const serviceFilter = (workerName) => leafFilter('$metadata.service', workerName);
export const traceFilter = (traceId) => leafFilter('$metadata.traceId', traceId);
export const rayFilter = (rayId) => leafFilter('$metadata.rayId', rayId);
