"""Token encryption-at-rest using Fernet (AES-128-CBC + HMAC).

Tokens are never stored in the session in plaintext. We serialize to
JSON, encrypt with the app's Fernet cipher, and base64-wrap for safe
storage in the signed Flask session cookie.

Decryption returns ``None`` on any failure (tampering, wrong key,
corrupt data) rather than raising, so callers can treat it as
"not authenticated" and re-auth.
"""

from __future__ import annotations

import base64
import json
import logging
from typing import Any

from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger(__name__)


def encrypt_tokens(cipher: Fernet, tokens: dict[str, Any]) -> str:
    """Encrypt a token dict to an opaque base64 string."""
    payload = json.dumps(tokens, separators=(",", ":")).encode("utf-8")
    encrypted = cipher.encrypt(payload)
    return base64.b64encode(encrypted).decode("ascii")


def decrypt_tokens(cipher: Fernet, blob: str) -> dict[str, Any] | None:
    """Decrypt a blob produced by :func:`encrypt_tokens`.

    Returns ``None`` on any decryption/parse failure (never raises).
    """
    try:
        encrypted = base64.b64decode(blob.encode("ascii"))
        decrypted = cipher.decrypt(encrypted)
        return json.loads(decrypted.decode("utf-8"))
    except (InvalidToken, ValueError, TypeError, json.JSONDecodeError) as exc:
        logger.warning("Token decryption failed: %s", type(exc).__name__)
        return None
