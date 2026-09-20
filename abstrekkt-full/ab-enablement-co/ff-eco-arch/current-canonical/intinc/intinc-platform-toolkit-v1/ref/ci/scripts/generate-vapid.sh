#!/usr/bin/env bash
set -euo pipefail

# Generate VAPID keys for push notifications
echo "Generating VAPID keys..."
npx web-push generate-vapid-keys --json | tee vapid-keys.json
echo ""
echo "Keys saved to vapid-keys.json"
echo "Add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your .env file"
