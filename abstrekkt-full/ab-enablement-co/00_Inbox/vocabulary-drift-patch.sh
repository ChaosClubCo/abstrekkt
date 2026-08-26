#!/usr/bin/env bash
# Vocabulary Drift Patch v1.0
# Fixes drift identified in audit against Cross-Lane Vocabulary v1.4
# Run from the directory containing the source files.
#
# Backs up every modified file with .pre-patch.bak extension.
# Idempotent — safe to re-run.

set -euo pipefail

echo "=== Vocabulary Drift Patch v1.0 ==="
echo "Patching drift identified in v1.4 audit"
echo ""

# Inventory the files we expect to patch
SOURCE_DOCS=(
  "flashfusion-pipeline-spec-template.md"
  "flashfusion-pipeline-build-template.md"
  "build-docx.js"
)

# Optional: include the current glossary if you want the propagated quote fixed
# Comment out the next line to leave the v1.4 glossary's historical quote intact
GLOSSARY_DOCS=("cross-lane-vocabulary.md")

# Combine
ALL_DOCS=("${SOURCE_DOCS[@]}" "${GLOSSARY_DOCS[@]}")

# Verify all files exist
for f in "${ALL_DOCS[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: file not found: $f"
    exit 1
  fi
done

# Backup every file before modifying
echo "Backing up files..."
for f in "${ALL_DOCS[@]}"; do
  cp "$f" "$f.pre-patch.bak"
  echo "  $f → $f.pre-patch.bak"
done
echo ""

# ===================================================================
# Tier 1 patches — drifted in 3+ outputs
# ===================================================================

# Patch 1: "Build doc" (word-boundary, capital B, lowercase d) → "Build Doc"
echo "Patch 1: 'Build doc' → 'Build Doc'"
for f in "${ALL_DOCS[@]}"; do
  count=$(grep -cE "\bBuild doc\b" "$f" 2>/dev/null || true)
  if [[ "$count" -gt 0 ]]; then
    sed -i -E 's/\bBuild doc\b/Build Doc/g' "$f"
    echo "  $f: $count occurrences fixed"
  fi
done
echo ""

# Patch 2: "Run doc" → "Run Doc"
echo "Patch 2: 'Run doc' → 'Run Doc'"
for f in "${ALL_DOCS[@]}"; do
  count=$(grep -cE "\bRun doc\b" "$f" 2>/dev/null || true)
  if [[ "$count" -gt 0 ]]; then
    sed -i -E 's/\bRun doc\b/Run Doc/g' "$f"
    echo "  $f: $count occurrences fixed"
  fi
done
echo ""

# Patch 3: lowercase "build doc" inside descriptive prose → "Build Doc"
# (only matches when not at start of sentence — preserves "A build doc." style if intended)
echo "Patch 3: lowercase 'build doc' (mid-sentence) → 'Build Doc'"
for f in "${ALL_DOCS[@]}"; do
  count=$(grep -cE "\bbuild doc\b" "$f" 2>/dev/null || true)
  if [[ "$count" -gt 0 ]]; then
    sed -i -E 's/\bbuild doc\b/Build Doc/g' "$f"
    echo "  $f: $count occurrences fixed"
  fi
done
echo ""

# ===================================================================
# Tier 2 patches — drifted in <3 outputs but worth fixing
# ===================================================================

# Patch 4: "an architecture decision record" → "an ADR (Architecture Decision Record)"
# Only fires in the Spec Template's Appendix B
echo "Patch 4: 'architecture decision record' → 'ADR (Architecture Decision Record)'"
for f in "${ALL_DOCS[@]}"; do
  count=$(grep -cE "\barchitecture decision record\b" "$f" 2>/dev/null || true)
  if [[ "$count" -gt 0 ]]; then
    sed -i -E 's/\ban architecture decision record\b/an ADR (Architecture Decision Record)/g' "$f"
    sed -i -E 's/\barchitecture decision record\b/ADR (Architecture Decision Record)/g' "$f"
    echo "  $f: $count occurrences fixed"
  fi
done
echo ""

# ===================================================================
# Verification
# ===================================================================

echo "=== Verification — any drift remaining? ==="
remaining=0
for pattern in "\bBuild doc\b" "\bRun doc\b" "\bbuild doc\b" "\brun doc\b"; do
  for f in "${ALL_DOCS[@]}"; do
    count=$(grep -cE "$pattern" "$f" 2>/dev/null || true)
    if [[ "$count" -gt 0 ]]; then
      echo "  REMAINING: $f matches /$pattern/ ($count occurrences)"
      remaining=$((remaining + count))
    fi
  done
done

if [[ "$remaining" -eq 0 ]]; then
  echo "  All patches applied cleanly. No drift remaining."
else
  echo ""
  echo "  $remaining occurrences remain — manual review needed."
  echo "  These may be intentional (lane variants) or edge cases the patch missed."
fi

echo ""
echo "=== Next steps ==="
echo "1. Review the diffs (e.g., 'diff flashfusion-pipeline-spec-template.md.pre-patch.bak flashfusion-pipeline-spec-template.md')"
echo "2. If patches look right, delete the .pre-patch.bak files"
echo "3. Regenerate any .docx files from the patched .js scripts (e.g., 'node build-docx.js')"
echo "4. Re-export the docx to /mnt/user-data/outputs/ if needed"
echo ""
echo "Patch complete."
