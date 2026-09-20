# Deployment Plan

Pre-deploy: CI green, migrations reviewed, security scan passed, validation has zero critical failures. Deploy DB migrations, backend, worker, frontend, then smoke check and monitor.
