import type { Config, Context } from '@netlify/functions';
import { handleLoxihartProxy } from '../../src/server/loxihartProxy.mjs';

/**
 * Emergency lock of the public /api/loxihart proxy.
 * Canonical Loxihart runtime lives in Krosebrook/Loxihart; this mutation closes an
 * unauthenticated control-plane hole still served from this frozen tree.
 */
function netlifyEnv() {
  return {
    get(name: string): string | undefined {
      try {
        const value = Netlify.env.get(name);
        return value ?? undefined;
      } catch {
        return undefined;
      }
    },
  };
}

export default async (req: Request, _context: Context) => {
  return handleLoxihartProxy(req, netlifyEnv());
};

export const config: Config = {
  path: '/api/loxihart',
};
