/**
 * Browser-safe Claude client.
 *
 * It does NOT import the Anthropic SDK and holds NO API key. All requests go to
 * your own backend proxy, which injects the key server-side, authenticates the
 * caller, and rate-limits. The browser never sees ANTHROPIC_API_KEY.
 *
 * Server proxy contract (see supabase/functions/server/index.tsx):
 *   POST {API_BASE}/chat
 *   Headers: Authorization: Bearer <supabase access token>
 *   Body:    { prompt, systemPrompt?, model?, temperature?, maxTokens?, stream? }
 */

import { ENV } from '../env';

export interface ClaudeRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  stopReason: string;
  usage: { inputTokens: number; outputTokens: number };
}

/** Resolve the auth token from your Supabase client session. */
async function getAccessToken(): Promise<string> {
  // Wire this to your real auth provider, e.g.:
  //   const { data } = await supabase.auth.getSession();
  //   return data.session?.access_token ?? '';
  const token = (globalThis as any).__supabaseAccessToken;
  if (!token) throw new Error('Not authenticated: no access token available.');
  return token;
}

const CHAT_ENDPOINT = `${ENV.API_BASE_URL.replace(/\/$/, '')}/chat`;

/** Non-streaming request. */
export async function askClaude(
  prompt: string,
  options: ClaudeRequestOptions = {},
): Promise<ClaudeResponse> {
  const token = await getAccessToken();

  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, ...options, stream: false }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    if (res.status === 401) throw new Error('Unauthorized — please sign in again.');
    if (res.status === 429) throw new Error('Rate limit reached — try again shortly.');
    throw new Error(`Chat request failed (${res.status}). ${detail.slice(0, 200)}`);
  }
  return res.json();
}

/** Streaming request — yields text deltas as they arrive. */
export async function* streamClaude(
  prompt: string,
  options: ClaudeRequestOptions = {},
): AsyncGenerator<string, void, unknown> {
  const token = await getAccessToken();

  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, ...options, stream: true }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Streaming request failed (${res.status}).`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
