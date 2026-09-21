"""Local/dev entrypoint.

Runs a startup security audit before binding. In production prefer a real
WSGI server (gunicorn) over the Flask dev server::

    gunicorn "app:create_app()" --bind 0.0.0.0:5000 --workers 4

SECURITY: never run this with FLASK_ENV unset against real credentials,
and never auto-execute untrusted code that imports this module.
"""

from __future__ import annotations

import logging
import sys

from app import create_app
from app.config import AppConfig, ConfigError
from app.security import SecurityValidator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("run")


def main() -> int:
    try:
        cfg = AppConfig.from_env()
    except ConfigError as exc:
        logger.error("Configuration error: %s", exc)
        return 1

    validator = SecurityValidator(cfg)
    if not validator.run() and cfg.env == "production":
        logger.error("Security audit failed in production — refusing to start.")
        return 1

    app = create_app(cfg)
    logger.info("Starting on %s (redirect_uri=%s)", cfg.base_url, cfg.redirect_uri)
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=cfg.debug,
        ssl_context="adhoc" if cfg.force_https else None,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
