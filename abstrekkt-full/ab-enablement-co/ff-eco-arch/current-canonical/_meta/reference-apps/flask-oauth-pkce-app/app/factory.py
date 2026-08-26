"""Application factory.

``create_app`` wires config, security extensions (CSRF, rate limiting),
security headers, error handlers, and the routes blueprint. It accepts an
optional :class:`AppConfig` so tests can inject a fully-formed,
secret-free config without touching the real environment.
"""

from __future__ import annotations

import logging

from flask import Flask, jsonify

from .config import AppConfig
from .routes import bp as oauth_bp
from .security import apply_security_headers

logger = logging.getLogger(__name__)


def create_app(config: AppConfig | None = None) -> Flask:
    cfg = config or AppConfig.from_env()

    app = Flask(__name__)
    app.config.update(cfg.flask_settings())
    app.config["APP_CONFIG"] = cfg

    app.register_blueprint(oauth_bp)
    _init_extensions(app, cfg)
    _register_headers(app, cfg)
    _register_error_handlers(app)

    logger.info("Flask app created (env=%s)", cfg.env)
    return app


def _init_extensions(app: Flask, cfg: AppConfig) -> None:
    # CSRF protection for form posts (Flask-WTF). Optional at import time so
    # the package still imports if the extra isn't installed; we log if so.
    try:
        from flask_wtf.csrf import CSRFProtect

        CSRFProtect(app)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Flask-WTF CSRF not enabled: %s", exc)

    # Rate limiting (Flask-Limiter). In-memory storage by default; point at
    # Redis via RATELIMIT_STORAGE_URI for multi-process deployments.
    try:
        from flask_limiter import Limiter
        from flask_limiter.util import get_remote_address

        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[f"{cfg.rate_limit_per_hour} per hour"],
        )
        limiter.init_app(app)
        app.extensions["limiter"] = limiter
        # Tighter limits on the auth endpoints to blunt brute force.
        limiter.limit("5 per minute")(app.view_functions["oauth.login"])
        limiter.limit("10 per minute")(app.view_functions["oauth.callback"])
    except Exception as exc:  # noqa: BLE001
        logger.warning("Flask-Limiter not enabled: %s", exc)


def _register_headers(app: Flask, cfg: AppConfig) -> None:
    @app.after_request
    def _headers(response):  # type: ignore[no-untyped-def]
        return apply_security_headers(response, cfg)


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(400)
    def _bad_request(_e):  # type: ignore[no-untyped-def]
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(401)
    def _unauthorized(_e):  # type: ignore[no-untyped-def]
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(429)
    def _rate_limited(e):  # type: ignore[no-untyped-def]
        return jsonify({"error": "Too many requests", "detail": str(e.description)}), 429

    @app.errorhandler(500)
    def _server_error(_e):  # type: ignore[no-untyped-def]
        return jsonify({"error": "Internal server error"}), 500
