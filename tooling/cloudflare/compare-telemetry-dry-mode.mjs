import { writeFileSync } from 'node:fs';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const accountId = required('CLOUDFLARE_ACCOUNT_ID');
const token = required('CLOUDFLARE_API_TOKEN');
const output = required('OUTPUT_PATH');
const from = Number(required('FROM_MS'));
const to = Number(required('TO_MS'));
const rayId = required('RAY_ID');
const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/observability/telemetry`;

async function post(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(`Cloudflare ${path} HTTP ${response.status}: ${JSON.stringify(payload.errors || [])}`);
  }
  return payload.result;
}

function queryBody(view, filters, variant) {
  const body = {
    queryId: `abstrekkt-view-diagnostic-${view}-${variant}-${Date.now()}`,
    timeframe: { from, to },
    limit: 2000,
    parameters: {
      datasets: [],
      filterCombination: 'and',
      filters,
    },
  };

  if (variant === 'legacy_malformed') {
    body.dry = true;
    body.parameters.view = view;
    return body;
  }

  body.view = view;
  if (variant === 'correct_dry_true') body.dry = true;
  if (variant === 'correct_dry_false') body.dry = false;
  return body;
}

async function query(view, filters, variant) {
  return post('/query', queryBody(view, filters, variant));
}

function eventList(result) {
  if (Array.isArray(result?.events)) return result.events;
  if (Array.isArray(result?.events?.events)) return result.events.events;
  return [];
}

function traceList(result) {
  return Array.isArray(result?.traces) ? result.traces : [];
}

function summarize(result) {
  const traces = traceList(result);
  const events = eventList(result);
  return {
    result_keys: result && typeof result === 'object' ? Object.keys(result).sort() : [],
    query_run_id: result?.run?.id || null,
    query_run_dry: result?.run?.dry ?? null,
    echoed_query: result?.run?.query || null,
    trace_count: traces.length,
    event_count: events.length,
    trace_ids: traces.slice(0, 50).map((trace) => trace?.traceId || trace?.trace_id).filter(Boolean),
    event_trace_ids: events.slice(0, 50).map((event) => event?.$metadata?.traceId).filter(Boolean),
    event_ray_ids: events.slice(0, 50).map((event) => event?.$metadata?.rayId).filter(Boolean),
    event_services: [...new Set(events.map((event) => event?.$metadata?.service).filter(Boolean))].sort(),
  };
}

async function listKeys(filters = []) {
  const result = await post('/keys', {
    datasets: [],
    filters,
    timeframe: { from, to },
  });
  return Array.isArray(result) ? result : [];
}

const rayFilter = [{ key: '$metadata.rayId', operation: 'eq', type: 'string', value: rayId }];
const serviceFilter = [{ key: '$metadata.service', operation: 'eq', type: 'string', value: 'kr-mentor-proxy' }];
const variants = [
  'legacy_malformed',
  'correct_dry_true',
  'correct_dry_false',
  'correct_dry_omitted',
];

const result = {
  schema: 'CloudflareTelemetryQueryShapeDiagnostic/v1',
  repository: process.env.GITHUB_REPOSITORY || 'Krosebrook/abstrekkt',
  source_run_id: '33264084513',
  source_worker_version_id: '7068a6d8-a0e1-4290-b88e-7d9528b6e04d',
  window: { from_ms: from, to_ms: to },
  ray_id: rayId,
  variants: {},
  key_catalog: {},
  queried_at: new Date().toISOString(),
};

const [globalKeys, serviceKeys] = await Promise.all([
  listKeys(),
  listKeys(serviceFilter),
]);
result.key_catalog = {
  global_count: globalKeys.length,
  service_count: serviceKeys.length,
  global_keys: globalKeys,
  service_keys: serviceKeys,
};

for (const variant of variants) {
  const [traces, events, rayEvents] = await Promise.all([
    query('traces', [], variant),
    query('events', [], variant),
    query('events', rayFilter, variant),
  ]);
  result.variants[variant] = {
    traces: summarize(traces),
    events: summarize(events),
    ray_events: summarize(rayEvents),
  };
}

writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
for (const [variant, data] of Object.entries(result.variants)) {
  console.log(
    `VARIANT=${variant} TRACE_COUNT=${data.traces.trace_count} ` +
    `EVENT_COUNT=${data.events.event_count} RAY_EVENT_COUNT=${data.ray_events.event_count} ` +
    `TRACE_RESULT_KEYS=${data.traces.result_keys.join(',')}`,
  );
}
console.log(`GLOBAL_KEY_COUNT=${globalKeys.length}`);
console.log(`SERVICE_KEY_COUNT=${serviceKeys.length}`);
