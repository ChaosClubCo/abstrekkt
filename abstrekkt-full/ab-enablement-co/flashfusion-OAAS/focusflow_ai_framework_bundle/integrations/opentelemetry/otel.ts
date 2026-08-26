export function emitSpan(event: Record<string, any>) {
  // POST to OTLP/HTTP collector; implement according to your backend.
  // fetch(process.env.OTEL_EXPORTER_OTLP_ENDPOINT + "/v1/traces", { method: "POST", body: JSON.stringify(event)})
}
