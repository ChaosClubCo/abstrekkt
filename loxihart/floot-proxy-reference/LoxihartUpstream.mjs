export const CONTROL_API_UNREACHABLE_BODY = {
  error: {
    code: "CONTROL_API_UNREACHABLE",
    message: "The Loxihart Control API could not be reached.",
  },
};

export const CONTROL_API_TIMEOUT_BODY = {
  error: {
    code: "CONTROL_API_TIMEOUT",
    message: "The Loxihart Control API did not respond before the proxy timeout.",
  },
};

const AUTHORITY_HEADER_NAMES = new Set([
  "x-loxihart-demo-token",
  "x-loxihart-organization",
  "x-loxihart-actor",
]);

export function buildUpstreamHeaders({ browserHeaders = {}, identity }) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(browserHeaders)) {
    if (!AUTHORITY_HEADER_NAMES.has(name.toLowerCase())) headers.set(name, value);
  }
  headers.set("Content-Type", "application/json");
  headers.set("X-Loxihart-Demo-Token", identity.demoToken);
  headers.set("X-Loxihart-Organization", identity.organizationId);
  headers.set("X-Loxihart-Actor", identity.actorId);
  return headers;
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function forwardLoxihart({
  url,
  method = "GET",
  body,
  browserHeaders = {},
  identity,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15_000,
}) {
  let timedOut = false;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const upstream = await fetchImpl(url, {
      method,
      headers: buildUpstreamHeaders({ browserHeaders, identity }),
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });

    const rawBody = await upstream.text();
    return new Response(rawBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (timedOut || error?.name === "AbortError") {
      return jsonResponse(CONTROL_API_TIMEOUT_BODY, 504);
    }
    return jsonResponse(CONTROL_API_UNREACHABLE_BODY, 502);
  } finally {
    clearTimeout(timeout);
  }
}
