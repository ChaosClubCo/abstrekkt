/**
 * Gateway authentication. A single static bearer token guards all mutating
 * (JSON-RPC message) endpoints. Agent Card + directory discovery stay public.
 *
 * The token is read from config (env only). If unset, the gateway runs in OPEN
 * mode — allowed for local dev, logged loudly, never a silent default in prod.
 */
import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";

function jsonRpcError(res: Response, code: number, message: string): void {
  res.status(401).json({
    jsonrpc: "2.0",
    id: null,
    error: { code, message },
  });
}

/** Constant-time bearer comparison that never short-circuits on length. */
function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Compare against self to keep timing uniform, then fail.
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * Build the auth middleware. When `expectedToken` is undefined the middleware
 * is a pass-through (open mode).
 */
export function bearerAuth(expectedToken?: string): RequestHandler {
  if (!expectedToken) {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
      jsonRpcError(res, -32001, "Missing or malformed Authorization header.");
      return;
    }
    if (!tokenMatches(match[1]!, expectedToken)) {
      jsonRpcError(res, -32001, "Invalid gateway token.");
      return;
    }
    next();
  };
}
