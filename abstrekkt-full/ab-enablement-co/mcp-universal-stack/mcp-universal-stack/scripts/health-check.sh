#!/usr/bin/env bash
# ==============================================================================
# MCP Universal Stack - Health Check Script
# ==============================================================================
# Usage: ./health-check.sh [--json] [--verbose]
# ==============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TIMEOUT=5
JSON_OUTPUT=false
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --json) JSON_OUTPUT=true; shift ;;
    --verbose|-v) VERBOSE=true; shift ;;
    --help|-h)
      echo "Usage: $0 [--json] [--verbose]"
      echo "  --json     Output results as JSON"
      echo "  --verbose  Show detailed output"
      exit 0
      ;;
    *) shift ;;
  esac
done

# Bridge definitions
declare -A BRIDGES=(
  ["github-bridge"]="7811"
  ["supabase-bridge"]="7812"
  ["firebase-bridge"]="7813"
  ["postgres-bridge"]="7814"
  ["slack-bridge"]="7815"
  ["openai-bridge"]="7816"
  ["anthropic-bridge"]="7817"
  ["google-bridge"]="7818"
  ["filesystem-bridge"]="7819"
)

declare -A PRIORITIES=(
  ["github-bridge"]="critical"
  ["supabase-bridge"]="critical"
  ["firebase-bridge"]="medium"
  ["postgres-bridge"]="critical"
  ["slack-bridge"]="high"
  ["openai-bridge"]="medium"
  ["anthropic-bridge"]="medium"
  ["google-bridge"]="medium"
  ["filesystem-bridge"]="high"
)

# Results storage
declare -A RESULTS
HEALTHY=0
UNHEALTHY=0
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Check single bridge
check_bridge() {
  local name=$1
  local port=$2
  local url="http://localhost:${port}/health"
  
  local start_time=$(date +%s%N)
  local response
  local http_code
  
  # Make request with timeout
  if response=$(curl -s -w "\n%{http_code}" --connect-timeout $TIMEOUT --max-time $TIMEOUT "$url" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n1)
    response=$(echo "$response" | sed '$d')
    local end_time=$(date +%s%N)
    local latency=$(( (end_time - start_time) / 1000000 ))
    
    if [[ "$http_code" == "200" ]]; then
      RESULTS[$name]="healthy|${latency}|${http_code}|"
      ((HEALTHY++))
      return 0
    else
      RESULTS[$name]="unhealthy|${latency}|${http_code}|HTTP ${http_code}"
      ((UNHEALTHY++))
      return 1
    fi
  else
    RESULTS[$name]="unhealthy|0|0|Connection refused or timeout"
    ((UNHEALTHY++))
    return 1
  fi
}

# Run all health checks
run_checks() {
  if ! $JSON_OUTPUT; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  MCP Universal Stack - Health Check${NC}"
    echo -e "${BLUE}  Timestamp: ${TIMESTAMP}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
  fi
  
  for bridge in "${!BRIDGES[@]}"; do
    local port=${BRIDGES[$bridge]}
    local priority=${PRIORITIES[$bridge]}
    
    if ! $JSON_OUTPUT && $VERBOSE; then
      echo -n "Checking ${bridge} (port ${port})... "
    fi
    
    if check_bridge "$bridge" "$port"; then
      if ! $JSON_OUTPUT; then
        if $VERBOSE; then
          echo -e "${GREEN}✓ healthy${NC}"
        else
          echo -e "  ${GREEN}✓${NC} ${bridge} (${priority})"
        fi
      fi
    else
      if ! $JSON_OUTPUT; then
        local error=$(echo "${RESULTS[$bridge]}" | cut -d'|' -f4)
        if $VERBOSE; then
          echo -e "${RED}✗ unhealthy - ${error}${NC}"
        else
          echo -e "  ${RED}✗${NC} ${bridge} (${priority}) - ${error}"
        fi
      fi
    fi
  done
}

# Output JSON results
output_json() {
  local bridges_json=""
  local first=true
  
  for bridge in "${!RESULTS[@]}"; do
    IFS='|' read -r status latency http_code error <<< "${RESULTS[$bridge]}"
    
    if ! $first; then
      bridges_json+=","
    fi
    first=false
    
    bridges_json+=$(cat <<EOF
    "${bridge}": {
      "status": "${status}",
      "latency_ms": ${latency:-0},
      "http_code": ${http_code:-0},
      "error": ${error:+"\"$error\""}${error:-null},
      "priority": "${PRIORITIES[$bridge]}"
    }
EOF
)
  done
  
  cat <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "summary": {
    "total": ${#BRIDGES[@]},
    "healthy": ${HEALTHY},
    "unhealthy": ${UNHEALTHY},
    "health_percentage": $(echo "scale=2; ${HEALTHY} * 100 / ${#BRIDGES[@]}" | bc)
  },
  "bridges": {
${bridges_json}
  },
  "alert_required": $([ $UNHEALTHY -gt 0 ] && echo "true" || echo "false")
}
EOF
}

# Output text summary
output_summary() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${BLUE}Summary${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  Total:     ${#BRIDGES[@]}"
  echo -e "  ${GREEN}Healthy:   ${HEALTHY}${NC}"
  echo -e "  ${RED}Unhealthy: ${UNHEALTHY}${NC}"
  echo ""
  
  if [[ $UNHEALTHY -gt 0 ]]; then
    echo -e "  ${RED}⚠️  Alert: Some bridges are unhealthy!${NC}"
    echo ""
    echo "  Troubleshooting:"
    echo "  ───────────────────────────────────────────────────────────"
    
    for bridge in "${!RESULTS[@]}"; do
      IFS='|' read -r status latency http_code error <<< "${RESULTS[$bridge]}"
      if [[ "$status" == "unhealthy" ]]; then
        local port=${BRIDGES[$bridge]}
        echo ""
        echo -e "  ${RED}${bridge}${NC} (port ${port})"
        echo "    Cause: ${error}"
        echo "    Fix:   Check if bridge is running: docker ps | grep ${bridge}"
        echo "    Fix:   Check logs: docker logs ${bridge}"
        echo "    Fix:   Restart: docker restart ${bridge}"
      fi
    done
    echo ""
  else
    echo -e "  ${GREEN}✓ All bridges healthy!${NC}"
    echo ""
  fi
}

# Main execution
main() {
  run_checks
  
  if $JSON_OUTPUT; then
    output_json
  else
    output_summary
  fi
  
  # Exit with error code if any unhealthy
  exit $UNHEALTHY
}

main
