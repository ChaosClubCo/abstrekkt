export const CONTROL_API_UNREACHABLE_BODY = {
  error: {
    code: 'CONTROL_API_UNREACHABLE',
    message: 'The Loxihart Control API could not be reached.',
  },
};

export const CONTROL_API_TIMEOUT_BODY = {
  error: {
    code: 'CONTROL_API_TIMEOUT',
    message: 'The Loxihart Control API did not respond before the proxy timeout.',
  },
};

const PILOT_ID = 'pilot-lakeview-001';
const AUTHORITY_HEADER_NAMES = new Set([
  'x-loxihart-demo-token',
  'x-loxihart-organization',
  'x-loxihart-actor',
]);
const AUTHORITATIVE_FIELDS = new Set([
  'verdict',
  'receiptId',
  'criteriaHash',
  'evidenceManifestHash',
  'receiptPayloadHash',
  'signature',
  'signatureBase64',
  'signedHash',
  'streamVersion',
  'canonicalVersion',
  'canonicalExpectedVersion',
]);

export function buildUpstreamHeaders({ browserHeaders = {}, identity }) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(browserHeaders)) {
    if (!AUTHORITY_HEADER_NAMES.has(name.toLowerCase())) headers.set(name, value);
  }
  headers.set('Content-Type', 'application/json');
  headers.set('X-Loxihart-Demo-Token', identity.demoToken);
  headers.set('X-Loxihart-Organization', identity.organizationId);
  headers.set('X-Loxihart-Actor', identity.actorId);
  return headers;
}

function requireReceiptId(payload) {
  const receiptId = payload?.receiptId;
  if (typeof receiptId !== 'string' || !receiptId.trim()) {
    throw new Error('receiptId is required.');
  }
  return encodeURIComponent(receiptId);
}

function cleanPayload(payload = {}) {
  const { operation: _operation, receiptId: _receiptId, ...body } = payload;
  return body;
}

function assertNoAuthoritativeFields(payload = {}) {
  for (const field of AUTHORITATIVE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      throw new Error('Authoritative verification fields cannot be supplied by the client.');
    }
  }
}

export function resolveOperation(operation, payload = {}) {
  const body = cleanPayload(payload);
  switch (operation) {
    case 'health':
      return { method: 'GET', path: '/health', body: undefined };
    case 'pilot.read':
      return { method: 'GET', path: `/v1/pilots/${PILOT_ID}`, body: undefined };
    case 'workflow.approve':
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/workflow/approve`, body };
    case 'sop.approve':
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/sop/approve`, body };
    case 'baseline.lock':
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/baseline/lock`, body };
    case 'change.approve':
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/change/approve`, body };
    case 'evidence.append':
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/evidence`, body };
    case 'verification.commit':
      assertNoAuthoritativeFields(body);
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/verification/commit`, body };
    case 'stream.head':
      return { method: 'GET', path: `/v1/pilots/${PILOT_ID}/stream/head`, body: undefined };
    case 'stream.read':
      return { method: 'GET', path: `/v1/pilots/${PILOT_ID}/stream`, body: undefined };
    case 'receipt.read': {
      const receiptId = requireReceiptId(payload);
      return { method: 'GET', path: `/v1/pilots/${PILOT_ID}/receipts/${receiptId}`, body: undefined };
    }
    case 'receipt.verify': {
      const receiptId = requireReceiptId(payload);
      return { method: 'POST', path: `/v1/pilots/${PILOT_ID}/receipts/${receiptId}/verify`, body: undefined };
    }
    default:
      throw new Error(`Unsupported proxy operation: ${String(operation)}`);
  }
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function forwardLoxihart({
  url,
  method = 'GET',
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

  const headers = buildUpstreamHeaders({ browserHeaders, identity });

  try {
    const upstream = await fetchImpl(url, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
    const rawBody = await upstream.text();
    return new Response(rawBody, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    if (timedOut || error?.name === 'AbortError') {
      return jsonResponse(CONTROL_API_TIMEOUT_BODY, 504);
    }
    return jsonResponse(CONTROL_API_UNREACHABLE_BODY, 502);
  } finally {
    clearTimeout(timeout);
  }
}
