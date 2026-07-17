"""
Prompt caching helpers for the Anthropic Messages API (Python SDK).

Two patterns, both correct-by-construction:

  1. cached_system_call()  -> EXPLICIT breakpoint on a large static system
     prompt + tool defs that you reuse across many requests with a *varying*
     user message. The breakpoint sits on the last STATIC block, never on the
     varying user turn. This is the #1 place people get it wrong.

  2. CachedConversation    -> AUTOMATIC caching for a growing multi-turn chat.
     Uses top-level cache_control so the breakpoint auto-advances each turn.

Both log cache hit/miss so you can verify caching is actually working.

Requires: pip install "anthropic>=0.40"
Env:      ANTHROPIC_API_KEY (never hard-code the key)
"""
from __future__ import annotations

import logging
import os
import time
from typing import Any

import anthropic
from anthropic import APIConnectionError, APIStatusError, RateLimitError

logger = logging.getLogger("prompt_cache")

# --- TTL selectors -----------------------------------------------------------
# 5m  = default; refreshes FREE on every hit. Use for steady (<5 min) traffic.
# 1h  = 2x write cost; use only when the same prefix is reused on 5min-1h gaps.
CACHE_5M: dict[str, str] = {"type": "ephemeral"}
CACHE_1H: dict[str, str] = {"type": "ephemeral", "ttl": "1h"}

# claude-opus-4-8 minimum cacheable prefix. Below this, cache_control is a
# silent no-op (both cache_* usage fields come back 0). Verify for your model.
MIN_CACHEABLE_TOKENS = 1024

_RETRYABLE = (APIConnectionError, RateLimitError)


def _client() -> anthropic.Anthropic:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. Route the key through env vars or a "
            "secret manager — never embed it in source."
        )
    return anthropic.Anthropic()


def mark_last(blocks: list[dict[str, Any]], ttl: dict[str, str] = CACHE_5M) -> list[dict[str, Any]]:
    """
    Return a copy of `blocks` with cache_control on the LAST block only.

    Placing it on the last *static* block means every later request re-hashes an
    identical prefix and hits the cache. Callers must pass blocks whose content
    is byte-identical across requests (no timestamps, no per-request context).
    """
    if not blocks:
        raise ValueError("Cannot cache an empty block list.")
    out = [dict(b) for b in blocks]  # shallow copy so we never mutate caller state
    out[-1] = {**out[-1], "cache_control": ttl}
    return out


def log_usage(usage: Any, *, label: str = "") -> dict[str, int]:
    """
    Emit a hit/miss line and return the token breakdown.

    cache_read  > 0 -> cache HIT (you paid 0.1x for those tokens)
    cache_write > 0 -> cache WRITE (you paid 1.25x/2x; first call or prefix changed)
    both == 0       -> NOT cached (prefix under the min-token floor, or no breakpoint)
    """
    read = getattr(usage, "cache_read_input_tokens", 0) or 0
    write = getattr(usage, "cache_creation_input_tokens", 0) or 0
    fresh = getattr(usage, "input_tokens", 0) or 0
    total_in = read + write + fresh

    if read:
        state = "HIT"
    elif write:
        state = "WRITE"
    else:
        state = "MISS (uncached — check min-token floor / breakpoint placement)"

    logger.info(
        "cache[%s] %s | read=%d write=%d fresh=%d total_in=%d out=%d",
        label or "-", state, read, write, fresh, total_in,
        getattr(usage, "output_tokens", 0) or 0,
    )
    return {"read": read, "write": write, "fresh": fresh, "total_input": total_in}


def _create_with_retry(client: anthropic.Anthropic, *, max_retries: int = 3, **kwargs: Any):
    """Thin retry wrapper: exponential backoff on transient network / 429s only."""
    attempt = 0
    while True:
        try:
            return client.messages.create(**kwargs)
        except _RETRYABLE as err:
            attempt += 1
            if attempt > max_retries:
                logger.error("Giving up after %d retries: %s", max_retries, err)
                raise
            backoff = 2 ** attempt
            logger.warning("Transient error (%s); retry %d in %ds", type(err).__name__, attempt, backoff)
            time.sleep(backoff)
        except APIStatusError as err:
            # 4xx (bad request, auth, etc.) are not retryable — surface immediately.
            logger.error("Non-retryable API error %s: %s", err.status_code, err.message)
            raise


# --- Pattern 1: explicit breakpoint on a static system prefix ----------------
def cached_system_call(
    *,
    system_blocks: list[dict[str, Any]],
    user_message: str,
    tools: list[dict[str, Any]] | None = None,
    model: str = "claude-opus-4-8",
    max_tokens: int = 1024,
    ttl: dict[str, str] = CACHE_5M,
    label: str = "system-call",
):
    """
    Cache a large static system prompt (+ optional tools) across requests whose
    user_message varies. Breakpoint lands on the last system block, NOT the user
    turn, so the varying suffix never poisons the cached prefix.

    Returns (message, usage_breakdown_dict).
    """
    client = _client()
    system = mark_last(system_blocks, ttl)

    # Tools sit *before* system in the cache hierarchy. If you also want the tool
    # array cached independently, mark its last entry too (separate breakpoint).
    tool_arg = mark_last(tools, ttl) if tools else anthropic.NOT_GIVEN

    msg = _create_with_retry(
        client,
        model=model,
        max_tokens=max_tokens,
        system=system,
        tools=tool_arg,
        messages=[{"role": "user", "content": user_message}],
    )
    return msg, log_usage(msg.usage, label=label)


# --- Pattern 2: automatic caching for a growing conversation -----------------
class CachedConversation:
    """
    Multi-turn chat with automatic caching. The top-level cache_control breakpoint
    auto-advances to the last cacheable block each turn, so the whole prior history
    is read from cache and only the new turn is processed fresh.
    """

    def __init__(
        self,
        *,
        system: str | list[dict[str, Any]],
        model: str = "claude-opus-4-8",
        max_tokens: int = 1024,
        ttl: dict[str, str] = CACHE_5M,
    ) -> None:
        self._client = _client()
        self._model = model
        self._max_tokens = max_tokens
        self._ttl = ttl
        self._system = system
        self._messages: list[dict[str, Any]] = []

    def send(self, user_message: str) -> tuple[Any, dict[str, int]]:
        """Append a user turn, call the API, store the reply, return (msg, usage)."""
        if not user_message.strip():
            raise ValueError("user_message must be non-empty.")
        self._messages.append({"role": "user", "content": user_message})

        msg = _create_with_retry(
            self._client,
            model=self._model,
            max_tokens=self._max_tokens,
            cache_control=self._ttl,   # <-- automatic caching, top level
            system=self._system,
            messages=self._messages,
        )
        # Persist assistant reply so the next turn's prefix is stable & cacheable.
        self._messages.append({"role": "assistant", "content": msg.content})
        return msg, log_usage(msg.usage, label=f"turn-{len(self._messages)//2}")


# --- Smoke test --------------------------------------------------------------
def _smoke_test() -> None:
    """
    Fires two identical-prefix calls. Expect: call 1 -> WRITE, call 2 -> HIT.
    Padding ensures the prefix clears the 1024-token floor.
    """
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    big_context = "You are a senior release engineer. " + ("Context line. " * 500)
    system = [{"type": "text", "text": big_context}]

    print("--- call 1 (expect WRITE) ---")
    _, u1 = cached_system_call(system_blocks=system, user_message="Name one deploy risk.")
    print("--- call 2 (expect HIT) ---")
    _, u2 = cached_system_call(system_blocks=system, user_message="Name a different one.")

    assert u1["write"] > 0 or u1["read"] > 0, "Call 1 did not cache — check token floor."
    assert u2["read"] > 0, "Call 2 was not a cache hit — breakpoint or timing issue."
    print(f"\nPASS: write={u1['write']} then read={u2['read']} (0.1x cost on the hit).")


if __name__ == "__main__":
    _smoke_test()