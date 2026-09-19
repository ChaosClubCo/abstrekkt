#!/usr/bin/env bash
# extract-subtree.sh — copy source paths into a staging directory for repo
# decomposition, refusing anything that matches docs/decomposition/never-extract.denylist.
#
# Authority domain: abstrekkt_publication. See docs/decomposition/03-EXTRACTION-RUNBOOK.md.
#
# Usage:
#   scripts/extract-subtree.sh [--dry-run] <source-path> [<source-path> ...] <target-staging-dir>
#
# - Always requires at least one source path and a target staging dir (the last argument).
# - --dry-run (or no explicit mode; dry-run is NOT the default — pass it explicitly to
#   preview) lists what would be copied and exits 0 without touching disk.
# - Without --dry-run, copies files and writes MANIFEST.sha256 in the target dir.
# - Refuses (exit 1) if any resolved source path matches a pattern in the denylist.
# - Makes no network calls. Never deletes anything. Never writes outside the target dir.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DENYLIST="${REPO_ROOT}/docs/decomposition/never-extract.denylist"

usage() {
  echo "Usage: $0 [--dry-run] <source-path> [<source-path> ...] <target-staging-dir>" >&2
  exit 2
}

DRY_RUN=0
ARGS=()
for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then
    DRY_RUN=1
  else
    ARGS+=("$arg")
  fi
done

if [[ "${#ARGS[@]}" -lt 2 ]]; then
  usage
fi

TARGET_DIR="${ARGS[-1]}"
unset 'ARGS[-1]'
SOURCE_PATHS=("${ARGS[@]}")

if [[ ! -f "$DENYLIST" ]]; then
  echo "ERROR: denylist not found at $DENYLIST — refusing to run without it." >&2
  exit 1
fi

# Load denylist patterns, skipping blank lines and comments.
PATTERNS=()
while IFS= read -r line; do
  line="${line%%$'\r'}"
  [[ -z "$line" ]] && continue
  [[ "$line" == \#* ]] && continue
  PATTERNS+=("$line")
done < "$DENYLIST"

# Normalize a pattern for matching against a relative path:
# - strip a trailing /** (directory-tree pattern) to a directory prefix match
# - a bare **/x*/** or **/*x*/** style pattern becomes a substring check
path_matches_pattern() {
  local rel="$1" pat="$2"

  # Directory-tree pattern: "dir/**" -> match rel == dir or rel starts with dir/
  if [[ "$pat" == */\*\* ]]; then
    local dir="${pat%/\*\*}"
    if [[ "$dir" == \*\*/* ]]; then
      # **/something/** — substring match on the middle segment
      local mid="${dir#\*\*/}"
      mid="${mid%\*}"
      mid="${mid#\*}"
      if [[ "$rel" == *"$mid"* ]]; then
        return 0
      fi
      return 1
    fi
    if [[ "$rel" == "$dir" || "$rel" == "$dir"/* ]]; then
      return 0
    fi
    return 1
  fi

  # Wildcard substring pattern like **/*intinc*/**  already handled above via /** suffix.
  # Exact file match.
  if [[ "$rel" == "$pat" ]]; then
    return 0
  fi

  return 1
}

is_denied() {
  local rel="$1"
  for pat in "${PATTERNS[@]}"; do
    if path_matches_pattern "$rel" "$pat"; then
      echo "$pat"
      return 0
    fi
  done
  return 1
}

# Validate every source path against the denylist before touching disk.
declare -a REL_SOURCES=()
for src in "${SOURCE_PATHS[@]}"; do
  if [[ ! -e "${REPO_ROOT}/${src}" && ! -e "$src" ]]; then
    echo "ERROR: source path does not exist: $src" >&2
    exit 1
  fi
  # Compute path relative to REPO_ROOT if it's inside the repo; otherwise use as-is.
  local_src="$src"
  case "$src" in
    "${REPO_ROOT}"/*) local_src="${src#"${REPO_ROOT}"/}" ;;
  esac
  rel="${local_src%/}"
  if match=$(is_denied "$rel"); then
    echo "REFUSED: '$rel' matches denylist pattern '$match' in $DENYLIST" >&2
    echo "See docs/decomposition/never-extract.denylist — this path must never be extracted." >&2
    exit 1
  fi
  REL_SOURCES+=("$rel")
done

echo "Denylist check passed for ${#REL_SOURCES[@]} source path(s)."

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "--- DRY RUN: would copy the following into $TARGET_DIR ---"
  for rel in "${REL_SOURCES[@]}"; do
    src_abs="${REPO_ROOT}/${rel}"
    if [[ -d "$src_abs" ]]; then
      find "$src_abs" -type f | sed "s|^${REPO_ROOT}/||"
    else
      echo "$rel"
    fi
  done
  echo "--- END DRY RUN (no files copied, MANIFEST not written) ---"
  exit 0
fi

mkdir -p "$TARGET_DIR"
MANIFEST="${TARGET_DIR}/MANIFEST.sha256"
: > "$MANIFEST"

for rel in "${REL_SOURCES[@]}"; do
  src_abs="${REPO_ROOT}/${rel}"
  dest_abs="${TARGET_DIR}/${rel}"
  mkdir -p "$(dirname "$dest_abs")"
  if [[ -d "$src_abs" ]]; then
    mkdir -p "$dest_abs"
    cp -R "$src_abs/." "$dest_abs/"
  else
    cp "$src_abs" "$dest_abs"
  fi
done

# Write manifest of every copied file, relative to TARGET_DIR.
( cd "$TARGET_DIR" && find . -type f ! -name 'MANIFEST.sha256' -exec sha256sum {} \; ) >> "$MANIFEST"

echo "Copied ${#REL_SOURCES[@]} source path(s) into $TARGET_DIR"
echo "Manifest written to $MANIFEST"
