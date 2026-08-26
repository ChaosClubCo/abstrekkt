#!/usr/bin/env bash
# run_council.sh — Drive Automation Council Runner
# Wraps the Chain 2 council POST with pre-flight checks.
# Usage:
#   bash scripts/run_council.sh --manifest <path_to_manifest.json>
#   bash scripts/run_council.sh --folder-id <DRIVE_FOLDER_ID> --run-id <run_id>
#
# Environment variables required (set in .env or export before running):
#   COUNCIL_HOST      — Base URL of council server (e.g., https://council.example.com)
#   SUPABASE_URL      — Personal Supabase project URL (NOT oorstbwcydxwiojrsoim)
#   SUPABASE_SERVICE_KEY — Service role key for personal project

set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
pass()  { echo -e "${GREEN}[PASS]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
info()  { echo -e "       $1"; }

# ── Load .env if present ──────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$(dirname "$SCRIPT_DIR")/.env"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  info "Loaded .env from $ENV_FILE"
fi

# ── Arg parsing ───────────────────────────────────────────────────────────────
MANIFEST_FILE=""
FOLDER_ID=""
RUN_ID="$(date +%Y-%m-%d-%H%M)"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --manifest)  MANIFEST_FILE="$2"; shift 2 ;;
    --folder-id) FOLDER_ID="$2";    shift 2 ;;
    --run-id)    RUN_ID="$2";       shift 2 ;;
    --dry-run)   DRY_RUN=true;      shift ;;
    *) fail "Unknown argument: $1" ;;
  esac
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Drive Council Runner — $RUN_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Pre-flight: Lane isolation check ─────────────────────────────────────────
echo ""
echo "▶ Lane Isolation Check"
if [[ -z "${SUPABASE_URL:-}" ]]; then
  fail "SUPABASE_URL is not set. Check .env."
fi
if echo "$SUPABASE_URL" | grep -q "oorstbwcydxwiojrsoim"; then
  fail "SUPABASE_URL points to the Intinc project (oorstbwcydxwiojrsoim). STOP. Set correct personal project URL."
fi
pass "Supabase URL does not match Intinc project"
info "URL: $SUPABASE_URL"

# ── Pre-flight: Required env vars ────────────────────────────────────────────
echo ""
echo "▶ Required Environment Variables"
[[ -n "${COUNCIL_HOST:-}" ]]          && pass "COUNCIL_HOST is set"          || fail "COUNCIL_HOST is not set"
[[ -n "${SUPABASE_SERVICE_KEY:-}" ]]  && pass "SUPABASE_SERVICE_KEY is set"  || fail "SUPABASE_SERVICE_KEY is not set"

# ── Pre-flight: Council endpoint reachable ────────────────────────────────────
echo ""
echo "▶ Council Endpoint Reachability"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout 5 \
  "$COUNCIL_HOST/health" || echo "000")
if [[ "$HTTP_STATUS" == "200" ]]; then
  pass "Council /health returned 200"
else
  fail "Council /health returned $HTTP_STATUS — is the server running?"
fi

# ── Pre-flight: Smoke tests ───────────────────────────────────────────────────
echo ""
echo "▶ Smoke Tests"
SMOKE_DIR="$(dirname "$SCRIPT_DIR")"
if [[ -f "$SMOKE_DIR/smoke_test.py" ]]; then
  SMOKE_OUTPUT=$(python "$SMOKE_DIR/smoke_test.py" 2>&1)
  if echo "$SMOKE_OUTPUT" | grep -q "FAIL"; then
    echo "$SMOKE_OUTPUT"
    fail "Smoke tests have failures — do NOT proceed until resolved."
  else
    pass "All smoke tests PASS"
  fi
else
  warn "smoke_test.py not found at $SMOKE_DIR — skipping smoke tests (NOT recommended)"
fi

# ── Build or load manifest ────────────────────────────────────────────────────
echo ""
echo "▶ Manifest"
if [[ -n "$MANIFEST_FILE" ]]; then
  [[ -f "$MANIFEST_FILE" ]] || fail "Manifest file not found: $MANIFEST_FILE"
  MANIFEST=$(cat "$MANIFEST_FILE")
  ITEM_COUNT=$(echo "$MANIFEST" | python3 -c "import json,sys; print(len(json.load(sys.stdin)['items']))")
  pass "Loaded manifest from file: $ITEM_COUNT items"
elif [[ -n "$FOLDER_ID" ]]; then
  warn "Folder-based manifest generation not implemented in this script."
  warn "Build manifest manually and use --manifest flag, or extend this script."
  fail "No manifest available — cannot proceed."
else
  fail "Must provide --manifest <file> or --folder-id <id>"
fi

# Warn if large batch and asyncio fix may not be applied
if [[ "$ITEM_COUNT" -gt 5 ]]; then
  warn "Batch size $ITEM_COUNT > 5. Ensure the asyncio parallel fix is applied to agent_council.py."
  warn "See references/asyncio-fix.md for instructions."
fi

# ── Dry run exit ──────────────────────────────────────────────────────────────
if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  DRY RUN — no council POST sent"
  echo "  Manifest ($ITEM_COUNT items) validated ✓"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi

# ── POST to /council ──────────────────────────────────────────────────────────
echo ""
echo "▶ Posting to Council ($ITEM_COUNT files)"
PAYLOAD=$(echo "$MANIFEST" | python3 -c "
import json, sys
manifest = json.load(sys.stdin)
manifest['run_id'] = '${RUN_ID}'
print(json.dumps({'manifest': manifest}))
")

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$COUNCIL_HOST/council" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "202" ]]; then
  pass "Council accepted — HTTP $HTTP_CODE"
  info "Response: $BODY"
else
  fail "Council returned HTTP $HTTP_CODE — Response: $BODY"
fi

# ── Poll Supabase for completion ──────────────────────────────────────────────
echo ""
echo "▶ Monitoring council_memos (run_id: $RUN_ID)"
info "Polling Supabase every 15s for up to 10 minutes..."

MAX_WAIT=600  # 10 minutes
ELAPSED=0
POLL_INTERVAL=15

while [[ $ELAPSED -lt $MAX_WAIT ]]; do
  sleep $POLL_INTERVAL
  ELAPSED=$((ELAPSED + POLL_INTERVAL))

  MEMO_COUNT=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    "$SUPABASE_URL/rest/v1/council_memos?run_id=eq.${RUN_ID}&select=id" \
    | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

  info "  [${ELAPSED}s] Memos written: $MEMO_COUNT / $ITEM_COUNT"

  if [[ "$MEMO_COUNT" -ge "$ITEM_COUNT" ]]; then
    pass "All $ITEM_COUNT memos written to council_memos"
    break
  fi
done

if [[ "$MEMO_COUNT" -lt "$ITEM_COUNT" ]]; then
  warn "Timeout: only $MEMO_COUNT / $ITEM_COUNT memos written after ${MAX_WAIT}s"
  warn "Check council server logs and Supabase file_audit for ERROR rows."
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Council Run Complete"
echo "  run_id: $RUN_ID"
echo "  Files:  $ITEM_COUNT"
echo "  Memos:  $MEMO_COUNT"
echo ""
echo "  Review CRITICAL + REVIEW items:"
echo "  SELECT file_name, overall_status FROM council_memos"
echo "  WHERE run_id = '$RUN_ID'"
echo "  AND (overall_status IN ('CRITICAL','NEEDS_ATTENTION')"
echo "       OR human_review_required = TRUE);"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
