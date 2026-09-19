import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * SHA-256 hex digest of the leaked Lakeview public demo token.
 * The plaintext secret is never stored in source; callers presenting it are rejected.
 */
export const REVOKED_CONSOLE_TOKEN_DIGESTS = Object.freeze([
  'a0a1cd22e1c832d33870baa6b30cf9a7df7178a16322c033c57a702b8cb349d9',
]);

export const CONSOLE_UNCONFIGURED_BODY = {
  error: {
    code: 'CONSOLE_UNCONFIGURED',
    message: 'Pilot Console proxy secrets are missing or revoked. Refusing to forward.',
  },
};

export const CONSOLE_UNAUTHORIZED_BODY = {
  error: {
    code: 'CONSOLE_UNAUTHORIZED',
    message: 'A valid console token is required.',
  },
};

/**
 * @param {unknown} body
 * @param {number} status
 * @returns {Response}
 */
export function jsonError(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeSecret(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * @param {string} value
 * @returns {Buffer}
 */
function sha256Buffer(value) {
  return createHash('sha256').update(value, 'utf8').digest();
}

/**
 * Compare two secrets without leaking length via SHA-256 then timingSafeEqual.
 * @param {unknown} presented
 * @param {unknown} expected
 * @returns {boolean}
 */
export function tokensMatch(presented, expected) {
  const left = normalizeSecret(presented);
  const right = normalizeSecret(expected);
  if (!left || !right) return false;
  const leftDigest = sha256Buffer(left);
  const rightDigest = sha256Buffer(right);
  return leftDigest.length === rightDigest.length && timingSafeEqual(leftDigest, rightDigest);
}

/**
 * @param {unknown} token
 * @returns {boolean}
 */
export function isRevokedConsoleToken(token) {
  const presented = normalizeSecret(token);
  if (!presented) return false;
  const digest = sha256Buffer(presented);
  return REVOKED_CONSOLE_TOKEN_DIGESTS.some((hex) => {
    const revoked = Buffer.from(hex, 'hex');
    return revoked.length === digest.length && timingSafeEqual(digest, revoked);
  });
}

/**
 * @param {{ get?: (name: string) => string | undefined | null }} env
 * @param {string} name
 * @returns {string}
 */
export function readEnvSecret(env, name) {
  return normalizeSecret(env?.get?.(name));
}

/**
 * Fail closed when a required secret is missing, blank, or revoked.
 * @param {{ get?: (name: string) => string | undefined | null }} env
 * @param {string} name
 * @returns {{ ok: true, value: string } | { ok: false, response: Response }}
 */
export function resolveRequiredSecret(env, name) {
  const value = readEnvSecret(env, name);
  if (!value || isRevokedConsoleToken(value)) {
    return { ok: false, response: jsonError(CONSOLE_UNCONFIGURED_BODY, 503) };
  }
  return { ok: true, value };
}

/**
 * @param {Request} req
 * @returns {string}
 */
export function readPresentedConsoleToken(req) {
  const authorization = req.headers.get('Authorization') ?? req.headers.get('authorization') ?? '';
  const bearer = /^Bearer\s+(\S+)/i.exec(authorization);
  if (bearer) return bearer[1];
  return normalizeSecret(req.headers.get('X-Loxihart-Console-Token'));
}

/**
 * Require a caller Bearer / X-Loxihart-Console-Token that matches LOXIHART_CONSOLE_TOKEN.
 * @param {Request} req
 * @param {{ get?: (name: string) => string | undefined | null }} env
 * @returns {{ ok: true } | { ok: false, response: Response }}
 */
export function authorizeConsoleAccess(req, env) {
  const consoleSecret = resolveRequiredSecret(env, 'LOXIHART_CONSOLE_TOKEN');
  if (!consoleSecret.ok) return consoleSecret;

  const presented = readPresentedConsoleToken(req);
  if (!presented || isRevokedConsoleToken(presented) || !tokensMatch(presented, consoleSecret.value)) {
    return { ok: false, response: jsonError(CONSOLE_UNAUTHORIZED_BODY, 401) };
  }
  return { ok: true };
}
