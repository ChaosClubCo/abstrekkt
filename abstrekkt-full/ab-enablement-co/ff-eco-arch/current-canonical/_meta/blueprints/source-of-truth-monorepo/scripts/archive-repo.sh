#!/usr/bin/env bash
# scripts/archive-repo.sh
# Archive a repository: bare-clone for full-history retention, write a redirect
# README, log it, and (after explicit confirmation) archive it on GitHub.
# Usage: ./archive-repo.sh <repo-name> [reason] [successor]
#
# SAFETY: archival NEVER deletes. It preserves a --mirror clone and only flips
# the GitHub repo to "archived" after an interactive y/N confirm.
set -euo pipefail

REPO_NAME="${1:-}"
REASON="${2:-Superseded}"
SUCCESSOR="${3:-}"
OWNER="${GH_OWNER:-Krosebrook}"

if [ -z "$REPO_NAME" ]; then
  echo "Usage: ./archive-repo.sh <repo-name> [reason] [successor]" >&2
  exit 1
fi

MONOREPO_ROOT="$(git rev-parse --show-toplevel)"
ARCHIVE_DATE="$(date +%Y-%m-%d)"
ARCHIVE_DIR="$MONOREPO_ROOT/archive/$ARCHIVE_DATE/$REPO_NAME"

echo "==> Archiving $REPO_NAME (reason: $REASON)"

if [ -e "$ARCHIVE_DIR" ]; then
  echo "    Refusing: $ARCHIVE_DIR already exists." >&2
  exit 2
fi

echo "    Mirroring repository (full history)..."
git clone --mirror "https://github.com/$OWNER/$REPO_NAME.git" "$ARCHIVE_DIR"

echo "    Writing redirect README..."
cat > "$ARCHIVE_DIR/README.md" <<EOF
# $REPO_NAME (Archived)

**Status:** Archived on $ARCHIVE_DATE
**Reason:** $REASON
${SUCCESSOR:+**Successor:** $SUCCESSOR}

This repository has been archived as part of the monorepo consolidation.
**Source of truth:** [source-of-truth-monorepo](https://github.com/$OWNER/source-of-truth-monorepo)

## Restore archived code
\`\`\`bash
git clone --mirror archive/$ARCHIVE_DATE/$REPO_NAME restored-$REPO_NAME
\`\`\`

See CONSOLIDATION_LOG.md for full migration details.
EOF

echo "    Logging archival (append-only)..."
printf '| %s | archive | %s | archive/%s/%s | - | %s |\n' \
  "$ARCHIVE_DATE" "$REPO_NAME" "$ARCHIVE_DATE" "$REPO_NAME" "$REASON" \
  >> "$MONOREPO_ROOT/CONSOLIDATION_LOG.md"

# Optional: archive on GitHub (reversible). Requires explicit confirmation.
if command -v gh >/dev/null 2>&1; then
  read -r -p "    Archive Krosebrook/$REPO_NAME on GitHub too? (y/N) " reply
  if [ "$reply" = "y" ] || [ "$reply" = "Y" ]; then
    gh repo archive "$OWNER/$REPO_NAME" --yes
    echo "    GitHub repo archived (reversible in settings)."
  else
    echo "    Skipped GitHub archive."
  fi
fi

echo "==> Done: $REPO_NAME archived to archive/$ARCHIVE_DATE/$REPO_NAME"
