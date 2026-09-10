import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import {
  eventRows,
  eventService,
  eventTraceId,
  eventVersionId,
  metadata,
  queryTelemetry,
  rayFilter,
  serviceFilter,
  traceFilter,
  traceRows,
} from './telemetry.mjs';

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

async function probeTarget(target, proxyToken) {
  const unauthenticated = await fetch(target, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });

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
  const cfRay = authenticated.headers.get('cf-ray');

  const probe = {
    marker,
    rayId: cfRay,
    rayIdBase: cfRay?.split('-')[0] || null,
    unauthenticatedStatus: unauthenticated.status,
    authenticatedStatus: authenticated.status,
    responseMatched: /Example Domain/i.test(responseText),
  };

  if (probe.unauthenticatedStatus !== 401) {
    throw Object.assign(new Error(`Unauthenticated POST returned ${probe.unauthenticatedStatus}; expected 401`), { probe });
  }
  if (probe.authenticatedStatus !== 200) {
    throw Object.assign(new Error(`Authenticated disposable request returned ${probe.authenticatedStatus}; expected 200`), { probe });
  }
  if (!probe.responseMatched) {
    throw Object.assign(new Error('Authenticated disposable request did not return the expected example.com response'), { probe });
  }
  if (!probe.rayId) {
    throw Object.assign(new Error('Authenticated disposable request returned no cf-ray header'), { probe });
  }
  return probe;
}

function chooseSpans(events, workerName, marker) {
  const workerEvents = events.filter((event) => eventService(event) === workerName);
  const root = workerEvents.find((event) => !metadata(event).parentSpanId);
  const child = workerEvents.find((event) => {
    const meta = metadata(event);
    if (!meta.parentSpanId) return false;
    const haystack = `${meta.spanName || ''} ${meta.url || ''} ${JSON.stringify(event.source || '')}`;
    return /fetch/i.test(haystack) || /example\.com/i.test(haystack) || haystack.includes(marker);
  });
  return { root, child };
}

async function findTrace(workerName, probe, from) {
  const rayIds = [...new Set([probe.rayId, probe.rayIdBase].filter(Boolean))];
  let last = { broadTraces: 0, serviceTraces: 0, rayEvents: 0, traceEvents: 0 };

  for (let attempt = 1; attempt <= 15; attempt += 1) {
    const to = Date.now() + 5_000;
    const [broadTracesResult, serviceTracesResult] = await Promise.all([
      queryTelemetry('traces', [], from, to),
      queryTelemetry('traces', [serviceFilter(workerName)], from, to),
    ]);
    const broadTraces = traceRows(broadTracesResult);
    const serviceTraces = traceRows(serviceTracesResult);
    last.broadTraces = broadTraces.length;
    last.serviceTraces = serviceTraces.length;

    for (const rayId of rayIds) {
      const rayEventsResult = await queryTelemetry('events', [rayFilter(rayId)], from, to);
      const rayEvents = eventRows(rayEventsResult);
      last.rayEvents = Math.max(last.rayEvents, rayEvents.length);
      const anchor = rayEvents.find((event) => eventService(event) === workerName && eventTraceId(event));
      const traceId = anchor && eventTraceId(anchor);
      if (!traceId) continue;

      const [traceResult, traceEventsResult] = await Promise.all([
        queryTelemetry('traces', [traceFilter(traceId)], from, to),
        queryTelemetry('events', [traceFilter(traceId)], from, to),
      ]);
      const trace = traceRows(traceResult).find((row) => row.traceId === traceId);
      const events = eventRows(traceEventsResult).filter((event) => eventTraceId(event) === traceId);
      last.traceEvents = events.length;
      const { root, child } = chooseSpans(events, workerName, probe.marker);
      if (!trace || !root || !child) continue;

      return {
        trace,
        root: metadata(root),
        child: metadata(child),
        scriptVersionId: eventVersionId(root) || eventVersionId(child),
        eventCount: events.length,
        diagnostics: {
          attempts: attempt,
          correlation: 'cf-ray -> telemetry rayId -> traceId',
          ray_id_used: rayId,
          broad_trace_count: broadTraces.length,
          service_trace_count: serviceTraces.length,
          ray_event_count: rayEvents.length,
          trace_event_count: events.length,
        },
      };
    }

    if (attempt < 15) await sleep(8_000);
  }

  throw new Error(
    `No correlated Worker trace after ingestion retries; broad_traces=${last.broadTraces}, service_traces=${last.serviceTraces}, ray_events=${last.rayEvents}, trace_events=${last.traceEvents}`,
  );
}

function baseReceipt(verdict, failureReason = null) {
  let deployed = null;
  try {
    deployed = parseDeploy(process.env.DEPLOY_LOG || '');
  } catch {}
  return {
    schema: 'CloudflareObservabilityReceipt/v1',
    repository: process.env.GITHUB_REPOSITORY || 'Krosebrook/abstrekkt',
    source_sha: process.env.SOURCE_SHA || null,
    trigger_origin_sha: process.env.TRIGGER_ORIGIN_SHA || null,
    control_plane_sha: process.env.CONTROL_PLANE_SHA || null,
    execution_sha: process.env.EXECUTION_SHA || null,
    workflow: {
      run_id: process.env.GITHUB_RUN_ID || null,
      run_attempt: process.env.GITHUB_RUN_ATTEMPT || null,
    },
    provider: 'Cloudflare Workers',
    worker: {
      name: deployed?.deploy?.worker_name || process.env.WORKER_NAME || 'kr-mentor-proxy',
      worker_tag: deployed?.deploy?.worker_tag || null,
      traced_version_id: deployed?.deploy?.version_id || null,
      deployment_target: deployed?.target || null,
    },
    observability: {
      tracing_enabled: true,
      payload_recording_enabled: false,
      trace_id: null,
      handler_span: { verified: false },
      outbound_fetch_span: { verified: false, target_host: 'example.com' },
    },
    readback: {
      probe_marker: null,
      cf_ray: null,
      unauthenticated_post_status: null,
      authenticated_disposable_request_status: null,
      authenticated_target_host: 'example.com',
    },
    proxy_secret: {
      mode: process.env.PROXY_TOKEN_MODE || 'unknown',
      value_recorded: false,
      cleanup_status: 'pending',
    },
    evidence_hashes: {
      deploy_log_sha256: sha256File(process.env.DEPLOY_LOG || ''),
      pre_versions_sha256: sha256File(process.env.PRE_VERSIONS_PATH || ''),
      pre_deployments_sha256: sha256File(process.env.PRE_DEPLOYMENTS_PATH || ''),
      post_versions_sha256: sha256File(process.env.POST_VERSIONS_PATH || ''),
      post_deployments_sha256: sha256File(process.env.POST_DEPLOYMENTS_PATH || ''),
      historical_diagnostic_sha256: sha256File(process.env.HISTORICAL_DIAGNOSTIC_PATH || ''),
    },
    failure_reason: failureReason,
    verified_at: new Date().toISOString(),
    verdict,
  };
}

function persistProbe(receiptPath, probe) {
  const receipt = readJson(receiptPath) || baseReceipt('BLOCKED', 'Trace verification pending');
  receipt.readback = {
    probe_marker: probe?.marker || null,
    cf_ray: probe?.rayId || null,
    cf_ray_base: probe?.rayIdBase || null,
    unauthenticated_post_status: probe?.unauthenticatedStatus ?? null,
    authenticated_disposable_request_status: probe?.authenticatedStatus ?? null,
    authenticated_target_host: 'example.com',
    authenticated_response_matched: probe?.responseMatched ?? false,
  };
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

function persistBlocked(receiptPath, error) {
  const receipt = readJson(receiptPath) || baseReceipt('BLOCKED');
  if (error?.probe) {
    receipt.readback = {
      ...receipt.readback,
      probe_marker: error.probe.marker || null,
      cf_ray: error.probe.rayId || null,
      cf_ray_base: error.probe.rayIdBase || null,
      unauthenticated_post_status: error.probe.unauthenticatedStatus ?? null,
      authenticated_disposable_request_status: error.probe.authenticatedStatus ?? null,
      authenticated_target_host: 'example.com',
      authenticated_response_matched: error.probe.responseMatched ?? false,
    };
  }
  receipt.failure_reason = error.message;
  receipt.verified_at = new Date().toISOString();
  receipt.verdict = 'BLOCKED';
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

async function verify() {
  const workerName = required('WORKER_NAME');
  const proxyToken = required('PROXY_TOKEN');
  required('SOURCE_SHA');
  required('TRIGGER_ORIGIN_SHA');
  required('CONTROL_PLANE_SHA');
  required('EXECUTION_SHA');
  const deployLog = required('DEPLOY_LOG');
  const receiptPath = required('RECEIPT_PATH');
  const traceFrom = Number(required('TRACE_FROM_MS'));
  if (!Number.isFinite(traceFrom)) throw new Error('TRACE_FROM_MS must be numeric');

  const { deploy, target } = parseDeploy(deployLog);
  if (!/\.workers\.dev$/i.test(new URL(target).hostname)) {
    throw new Error(`Deployment target is not a workers.dev URL: ${target}`);
  }

  const probe = await probeTarget(target, proxyToken);
  persistProbe(receiptPath, probe);
  const traced = await findTrace(workerName, probe, traceFrom - 30_000);
  const deployVersionId = deploy.version_id || null;
  if (deployVersionId && traced.scriptVersionId && deployVersionId !== traced.scriptVersionId) {
    throw new Error(`Trace version ${traced.scriptVersionId} does not match deployed version ${deployVersionId}`);
  }

  const receipt = readJson(receiptPath) || baseReceipt('PASS');
  receipt.verdict = 'PASS';
  receipt.failure_reason = null;
  receipt.verified_at = new Date().toISOString();
  receipt.worker.traced_version_id = deployVersionId || traced.scriptVersionId || null;
  receipt.observability = {
    tracing_enabled: true,
    payload_recording_enabled: false,
    trace_id: traced.trace.traceId,
    trace_start_ms: traced.trace.traceStartMs,
    trace_end_ms: traced.trace.traceEndMs,
    trace_duration_ms: traced.trace.traceDurationMs,
    span_count: traced.trace.spans,
    event_count: traced.eventCount,
    query_diagnostics: traced.diagnostics,
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
if (command === 'verify') {
  const receiptPath = process.env.RECEIPT_PATH;
  try {
    await verify();
  } catch (error) {
    if (receiptPath) persistBlocked(receiptPath, error);
    console.error(error.message);
    process.exitCode = 1;
  }
} else if (command === 'finalize') {
  finalize();
} else {
  throw new Error(`Unknown command: ${command}`);
}
