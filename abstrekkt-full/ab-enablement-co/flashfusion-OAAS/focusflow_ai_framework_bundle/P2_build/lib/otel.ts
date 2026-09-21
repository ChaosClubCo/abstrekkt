export function withTrace<T>(name: string, fn: () => Promise<T>) {
  const t0 = performance.now();
  return fn().then((res) => {
    const latency_ms = performance.now() - t0;
    // TODO: send to OTLP {name, latency_ms}
    return res;
  });
}
