import { writeFileSync } from 'node:fs';
import {
  eventRows,
  eventService,
  eventTraceId,
  eventVersionId,
  getScriptSettings,
  metadata,
  queryTelemetry,
  serviceFilter,
  traceRows,
} from './telemetry.mjs';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const asNumber = (name) => {
  const value = Number(required(name));
  if (!Number.isFinite(value)) throw new Error(`${name} must be numeric`);
  return value;
};

const summarizeEvent = (event) => {
  const meta = metadata(event);
  return {
    timestamp: event?.timestamp ?? null,
    service: eventService(event),
    trace_id: eventTraceId(event),
    version_id: eventVersionId(event),
    ray_id: meta.rayId || null,
    span_id: meta.spanId || event?.$workers?.spanId || null,
    parent_span_id: meta.parentSpanId || null,
    span_name: meta.spanName || null,
    type: meta.type || null,
    url: meta.url || null,
    status_code: meta.statusCode || null,
  };
};

const workerName = required('WORKER_NAME');
const targetVersion = required('HISTORICAL_VERSION_ID');
const from = asNumber('HISTORICAL_FROM_MS');
const to = asNumber('HISTORICAL_TO_MS');
const output = required('DIAGNOSTIC_PATH');

const [settings, broadTracesResult, serviceTracesResult, broadEventsResult, serviceEventsResult] = await Promise.all([
  getScriptSettings(workerName),
  queryTelemetry('traces', [], from, to),
  queryTelemetry('traces', [serviceFilter(workerName)], from, to),
  queryTelemetry('events', [], from, to),
  queryTelemetry('events', [serviceFilter(workerName)], from, to),
]);

const broadTraces = traceRows(broadTracesResult);
const serviceTraces = traceRows(serviceTracesResult);
const broadEvents = eventRows(broadEventsResult);
const serviceEvents = eventRows(serviceEventsResult);
const versionEvents = serviceEvents.filter((event) => eventVersionId(event) === targetVersion);
const servicesSeen = [...new Set(broadEvents.map(eventService).filter(Boolean))].sort();
const versionIdsSeen = [...new Set(serviceEvents.map(eventVersionId).filter(Boolean))].sort();

let classification = 'service_traces_present';
if (broadTraces.length === 0) classification = 'zero_traces_global_in_window';
else if (serviceTraces.length === 0) classification = 'service_filter_mismatch_or_missing_service_metadata';

const diagnostic = {
  schema: 'CloudflareTelemetryDiagnostic/v1',
  repository: process.env.GITHUB_REPOSITORY || 'Krosebrook/abstrekkt',
  worker_name: workerName,
  target_version_id: targetVersion,
  historical_window: { from_ms: from, to_ms: to },
  classification,
  counts: {
    broad_traces: broadTraces.length,
    service_traces: serviceTraces.length,
    broad_events: broadEvents.length,
    service_events: serviceEvents.length,
    target_version_events: versionEvents.length,
  },
  services_seen: servicesSeen,
  worker_version_ids_seen: versionIdsSeen,
  target_version_event_samples: versionEvents.slice(0, 20).map(summarizeEvent),
  worker_observability_settings: settings?.observability || null,
  queried_at: new Date().toISOString(),
};

writeFileSync(output, `${JSON.stringify(diagnostic, null, 2)}\n`);
console.log(`HISTORICAL_DIAGNOSIS=${classification}`);
console.log(`BROAD_TRACES=${broadTraces.length}`);
console.log(`SERVICE_TRACES=${serviceTraces.length}`);
console.log(`TARGET_VERSION_EVENTS=${versionEvents.length}`);
