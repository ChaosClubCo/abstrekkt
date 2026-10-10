const MAX_BODY_BYTES = 64 * 1024;

function json(data, status = 200) {
  return Response.json(data, { status });
}

function hexToBytes(hex) {
  if (!/^[0-9a-f]{64}$/i.test(hex)) return null;
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function sha256Hex(buffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

async function verifySignature(rawBody, secret, signatureHex) {
  const supplied = hexToBytes(signatureHex);
  if (!supplied) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  return crypto.subtle.verify('HMAC', key, supplied, rawBody);
}

async function registerDelivery(db, deliveryId, eventName, payloadSha256) {
  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO deliveries
        (delivery_id, event_name, payload_sha256)
       VALUES (?, ?, ?)`,
    )
    .bind(deliveryId, eventName, payloadSha256)
    .run();

  return result?.meta?.changes === 1;
}

export async function handleWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }

  if (!env?.WEBHOOK_SECRET || !env?.DB) {
    console.error(JSON.stringify({ type: 'receiver_misconfigured' }));
    return new Response('Receiver misconfigured', { status: 503 });
  }

  const signatureHeader = request.headers.get('X-Abstrekkt-Signature-256');
  const deliveryId = request.headers.get('X-Abstrekkt-Delivery');

  if (!signatureHeader?.startsWith('sha256=') || !deliveryId) {
    return new Response('Bad Request', { status: 400 });
  }

  const declaredLength = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return new Response('Payload Too Large', { status: 413 });
  }

  const rawBody = await request.arrayBuffer();
  if (rawBody.byteLength > MAX_BODY_BYTES) {
    return new Response('Payload Too Large', { status: 413 });
  }

  const signatureHex = signatureHeader.slice('sha256='.length);
  const verified = await verifySignature(
    rawBody,
    env.WEBHOOK_SECRET,
    signatureHex,
  );

  if (!verified) {
    console.warn(JSON.stringify({ type: 'signature_rejected', deliveryId }));
    return new Response('Invalid signature', { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (payload.delivery_id !== deliveryId) {
    return new Response('Delivery ID mismatch', { status: 400 });
  }

  const eventHeader = request.headers.get('X-Abstrekkt-Event');
  if (eventHeader && payload.event_name !== eventHeader) {
    return new Response('Event name mismatch', { status: 400 });
  }

  const payloadSha256 = await sha256Hex(rawBody);
  const accepted = await registerDelivery(
    env.DB,
    deliveryId,
    String(payload.event_name ?? ''),
    payloadSha256,
  );

  if (!accepted) {
    console.warn(JSON.stringify({ type: 'replay_rejected', deliveryId }));
    return new Response('Replay rejected', { status: 409 });
  }

  console.log(
    JSON.stringify({
      type: 'webhook_accepted',
      deliveryId,
      eventName: payload.event_name,
      payloadSha256,
      signatureVerified: true,
      parsedAfterVerification: true,
    }),
  );

  return json({
    ok: true,
    delivery_id: deliveryId,
    signature_verified: true,
    parsed_after_verification: true,
    payload_sha256: payloadSha256,
  });
}

export default {
  fetch(request, env) {
    return handleWebhook(request, env);
  },
};
