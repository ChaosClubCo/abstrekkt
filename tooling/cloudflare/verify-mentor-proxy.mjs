import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function sha256File(path) {
  try {
    return createHash('sha256').update(readFileSync(path)).digest('hex');
  } catch {
    return null;
  }
}

function listRows(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.result)) return value.result;
  return [];
}

function firstId(value) {
  const row = listRows(value)[0];
  return row?.id || row?.version_id || row?.deployment_id || row?.uuid || null;
}

function parseDeploy(path) {
  const rows = readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const deploy = [...rows].reverse().find((row) => row.type === 'deploy');
  if (!deploy) throw new Error('No structured Wrangler deploy record found');
  const target = (deploy.targets || []).find((value) => /^https:\/\//.test(value));
  if (!target) throw new Error('No HTTPS deployment target found');
  return { deploy, target: target.replace(/\/$/, '') };
}

async function cloudflareQuery(view, filters, from, to) {
  const accountId = required('CLOUDFLARE_ACCOUNT_ID');
  const token = required('CLOUDFLARE_API_TOKEN');
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/observability/telemetry/query`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        queryId: `kr-mentor-proxy-${view}-${Date.now()}`,
        timeframe: { from, to },
        limit: 200,
        dry: true,
        parameters: {
          datasets: [],
          filterCombination: 'and',
          filters,
          view,
        },
      }),
    },
  );

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Cloudflare telemetry returned non-JSON HTTP ${response.status}`);
  }
  if (!response.ok || payload.success === false) {
    const message = payload?.errors?.map((error) => error.message).filter(Boolean).join('; ');
    throw new Error(`Cloudflare telemetry HTTP ${response.status}: ${message || 'query failed'}`);
  }
  return payload.result || payload;
}

function flattenEvents(value) {
  if (Array.isArray(value?.events)) return value.events;
  if (value?.events && typeof value.events === 'object') {
    return Object.values(value.events).flatMap((item) => (Array.isArray(item) ? item : [item]));
  }
  return [];
}

function metadata(event) {
  return event?.$metadata || event?.metadata || {};
}

function eventTraceId(event) {
  return metadata(event).traceId || event?.$workers?.traceId || event?.traceId || null;
}

function eventVersionId(event) {
  return (
    event?.$workers?.scriptVersion?.id ||
    metadata(event).scriptVersion?.id ||
    event?.scriptVersion?.id ||
    null
  );
}

async function probeTarget(target, proxyToken) {
  const unauthenticated = await fetch(target, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });
  if (unauthenticated.status !== 401) {
    throw new Error(`Unauthenticated POST returned ${unauthenticated.status}; expected 401`);
  }

  const marker = `cf-observability-${process.env.GITHUB_RUN_ID || 'local'}-${Date.now()}`;
  const probeUrl = `https://example.com/?cf_observability_probe=${encodeURIComponent(marker)}`;
  const authenticated = await fetch(target, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${proxyToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ target: 'url', method: 'GET', url: probeUrl }),
  });
  const responseText = await authenticated.text();
  if (authenticated.status !== 200) {
    throw new Error(`Authenticated disposable request returned ${authenticated.status}; expected 200`);
  }
  if (!/Example Domain/i.test(responseText)) {
    throw new Error('Authenticated disposable request did not return the expected example.com response');
  }
  return { marker, probeUrl, unauthenticatedStatus: 401, authenticatedStatus: 200 };
}

async function findTrace(workerName, marker, from) {
  const serviceFilter = {
    key: '$metadata.service',
    operation: 'eq',
    type: 'string',
    value: workerName,
  };
  let lastTraceCount = 0;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    const to = Date.now() + 5_000;
    const tracesResult = await cloudflareQuery('traces', [serviceFilter], from, to);
    const traces = Array.isArray(tracesResult?.traces) ? tracesResult.traces : [];
    lastTraceCount = traces.length;
    const candidates = [...traces]
      .filter((trace) => (trace.service || []).includes(workerName) && Number(trace.spans || 0) >= 2)
      .sort((a, b) => Number(b.traceStartMs || 0) - Number(a.traceStartMs || 0));

    for (const trace of candidates) {
      const traceFilter = {
        key: '$metadata.traceId',
        operation: 'eq',
        type: 'string',
        value: trace.traceId,
      };
      const eventsResult = await cloudflareQuery('events', [serviceFilter, traceFilter], from, to);
      const events = flattenEvents(eventsResult).filter((event) => eventTraceId(event) === trace.traceId);
      const markerEvent = events.find((event) => JSON.stringify(event).includes(marker));
      if (!markerEvent) continue;

      const root = events.find((event) => !metadata(event).parentSpanId);
      const child = events.find((event) => {
        const meta = metadata(event);
        if (!meta.parentSpanId) return false;
        const haystack = `${meta.spanName || ''} ${meta.url || ''} ${JSON.stringify(event.source || '')}`;
        return /fetch/i.test(haystack) || haystack.includes(marker) || /example\.com/i.test(haystack);
      });
      if (!root) throw new Error(`Trace ${trace.traceId} has no root/handler span event`);
      if (!child) throw new Error(`Trace ${trace.traceId} has no outbound fetch child span event`);

      return {
        trace,
        root: metadata(root),
        child: metadata(child),
        scriptVersionId: eventVersionId(root) || eventVersionId(child),
        eventCount: events.length,
      };
    }

    if (attempt < 10) await sleep(4_000);
  }
  throw new Error(`No matching traced authenticated request found after ingestion retries; observed ${lastTraceCount} traces`);
}

async function verify() {
  const workerName = required('WORKER_NAME');
  const proxyToken = required('PROXY_TOKEN');
  const sourceSha = required('SOURCE_SHA');
  const triggerOriginSha = required('TRIGGER_ORIGIN_SHA');
  const controlPlaneSha = required('CONTROL_PLANE_SHA');
  const executionSha = required('EXECUTION_SHA');
  const deployLog = required('DEPLOY_LOG');
  const receiptPath = required('RECEIPT_PATH');
  const traceFrom = Number(required('TRACE_FROM_MS'));
  if (!Number.isFinite(traceFrom)) throw new Error('TRACE_FROM_MS must be numeric');

  const { deploy, target } = parseDeploy(deployLog);
  if (!/\.workers\.dev$/i.test(new URL(target).hostname)) {
    throw new Error(`Deployment target is not a workers.dev URL: ${target}`);
  }

  const probe = await probeTarget(target, proxyToken);
  const traced = await findTrace(workerName, probe.marker, traceFrom - 30_000);
  const deployVersionId = deploy.version_id || null;
  if (deployVersionId && traced.scriptVersionId && deployVersionId !== traced.scriptVersionId) {
    throw new Error(
      `Trace version ${traced.scriptVersionId} does not match deployed version ${deployVersionId}`,
    );
  }

  const receipt = {
    schema: 'CloudflareObservabilityReceipt/v1',
    repository: process.env.GITHUB_REPOSITORY || 'Krosebrook/abstrekkt',
    source_sha: sourceSha,
    trigger_origin_sha: triggerOriginSha,
    control_plane_sha: controlPlaneSha,
    execution_sha: executionSha,
    workflow: {
      run_id: process.env.GITHUB_RUN_ID || null,
      run_attempt: process.env.GITHUB_RUN_ATTEMPT || null,
    },
    provider: 'Cloudflare Workers',
    worker: {
      name: deploy.worker_name || workerName,
      worker_tag: deploy.worker_tag || null,
      traced_version_id: deployVersionId || traced.scriptVersionId || null,
      deployment_target: target,
    },
    observability: {
      tracing_enabled: true,
      payload_recording_enabled: false,
      trace_id: traced.trace.traceId,
      trace_start_ms: traced.trace.traceStartMs,
      trace_end_ms: traced.trace.traceEndMs,
      trace_duration_ms: traced.trace.traceDurationMs,
      span_count: traced.trace.spans,
      event_count: traced.eventCount,
      handler_span: {
        verified: true,
        span_id: traced.root.spanId || null,
        span_name: traced.root.spanName || traced.trace.rootSpanName || null,
      },
      outbound_fetch_span: {
        verified: true,
        span_id: traced.child.spanId || null,
        parent_span_id: traced.child.parentSpanId || null,
        span_name: traced.child.spanName || null,
        target_host: 'example.com',
      },
    },
    readback: {
      unauthenticated_post_status: probe.unauthenticatedStatus,
      authenticated_disposable_request_status: probe.authenticatedStatus,
      authenticated_target_host: 'example.com',
    },
    proxy_secret: {
      mode: process.env.PROXY_TOKEN_MODE || 'unknown',
      value_recorded: false,
      cleanup_status: 'pending',
    },
    evidence_hashes: {
      deploy_log_sha256: sha256File(deployLog),
      pre_versions_sha256: sha256File(process.env.PRE_VERSIONS_PATH || ''),
      pre_deployments_sha256: sha256File(process.env.PRE_DEPLOYMENTS_PATH || ''),
      post_versions_sha256: sha256File(process.env.POST_VERSIONS_PATH || ''),
      post_deployments_sha256: sha256File(process.env.POST_DEPLOYMENTS_PATH || ''),
    },
    verified_at: new Date().toISOString(),
    verdict: 'PASS',
  };
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`TRACE_ID=${receipt.observability.trace_id}`);
}

function finalize() {
  const receiptPath = required('RECEIPT_PATH');
  const receipt = readJson(receiptPath);
  if (!receipt) throw new Error(`Could not read receipt: ${receiptPath}`);
  const versionsPath = process.env.FINAL_VERSIONS_PATH || '';
  const deploymentsPath = process.env.FINAL_DEPLOYMENTS_PATH || '';
  receipt.proxy_secret.cleanup_status = process.env.PROXY_SECRET_CLEANUP_STATUS || 'not_required';
  receipt.worker.final_locked_version_id = firstId(readJson(versionsPath));
  receipt.worker.final_deployment_id = firstId(readJson(deploymentsPath));
  receipt.evidence_hashes.final_versions_sha256 = sha256File(versionsPath);
  receipt.evidence_hashes.final_deployments_sha256 = sha256File(deploymentsPath);
  receipt.finalized_at = new Date().toISOString();
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

const command = process.argv[2] || 'verify';
if (command === 'verify') await verify();
else if (command === 'finalize') finalize();
else throw new Error(`Unknown command: ${command}`);
