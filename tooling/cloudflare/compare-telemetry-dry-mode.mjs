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

async function query(view, filters, mode) {
  const body = {
    queryId: `abstrekkt-dry-compare-${view}-${mode}-${Date.now()}`,
    timeframe: { from, to },
    limit: 2000,
    parameters: {
      datasets: [],
      filterCombination: 'and',
      filters,
      view,
    },
  };

  if (mode === 'true') body.dry = true;
  if (mode === 'false') body.dry = false;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/observability/telemetry/query`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(`Cloudflare telemetry query failed HTTP ${response.status}: ${JSON.stringify(payload.errors || [])}`);
  }
  return payload.result;
}

function summarize(result) {
  const traces = Array.isArray(result?.traces) ? result.traces : [];
  const events = Array.isArray(result?.events?.events) ? result.events.events : [];
  return {
    query_run_id: result?.run?.id || null,
    query_run_dry: result?.run?.dry ?? null,
    trace_count: traces.length,
    event_count: events.length,
    trace_ids: traces.slice(0, 50).map((trace) => trace?.traceId).filter(Boolean),
    event_ids: events.slice(0, 50).map((event) => event?.$metadata?.id).filter(Boolean),
    services: [...new Set(traces.flatMap((trace) => Array.isArray(trace?.service) ? trace.service : []).filter(Boolean))].sort(),
  };
}

const rayFilter = [{ key: '$metadata.rayId', operation: 'eq', type: 'string', value: rayId }];
const result = {
  schema: 'CloudflareTelemetryDryModeDiagnostic/v1',
  repository: process.env.GITHUB_REPOSITORY || 'Krosebrook/abstrekkt',
  source_run_id: '33264084513',
  window: { from_ms: from, to_ms: to },
  ray_id: rayId,
  modes: {},
  queried_at: new Date().toISOString(),
};

for (const mode of ['true', 'false', 'omitted']) {
  const [traces, events, rayEvents] = await Promise.all([
    query('traces', [], mode),
    query('events', [], mode),
    query('events', rayFilter, mode),
  ]);
  result.modes[mode] = {
    traces: summarize(traces),
    events: summarize(events),
    ray_events: summarize(rayEvents),
  };
}

writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
for (const [mode, data] of Object.entries(result.modes)) {
  console.log(`MODE=${mode} TRACE_COUNT=${data.traces.trace_count} EVENT_COUNT=${data.events.event_count} RAY_EVENT_COUNT=${data.ray_events.event_count}`);
}
