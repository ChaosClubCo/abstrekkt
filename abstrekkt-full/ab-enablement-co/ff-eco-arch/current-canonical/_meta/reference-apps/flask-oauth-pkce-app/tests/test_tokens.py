"""Token encryption-at-rest tests, including tamper rejection."""

from __future__ import annotations

from cryptography.fernet import Fernet

from app.tokens import decrypt_tokens, encrypt_tokens


def test_encrypt_decrypt_roundtrip():
    cipher = Fernet(Fernet.generate_key())
    tokens = {"access_token": "abc", "refresh_token": "def", "expires_in": 3600}
    blob = encrypt_tokens(cipher, tokens)
    # Ciphertext must not contain the plaintext token.
    assert "abc" not in blob
    assert decrypt_tokens(cipher, blob) == tokens


def test_decrypt_tampered_returns_none():
    cipher = Fernet(Fernet.generate_key())
    assert decrypt_tokens(cipher, "not-valid-ciphertext") is None


def test_decrypt_with_wrong_key_returns_none():
    blob = encrypt_tokens(Fernet(Fernet.generate_key()), {"access_token": "x"})
    other = Fernet(Fernet.generate_key())
    assert decrypt_tokens(other, blob) is None
