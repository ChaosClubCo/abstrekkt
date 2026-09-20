# FlashFusion Brand Kit

Shared brand assets, design tokens, and component templates for the FlashFusion ecosystem.

## Contents

```
flashfusion-brand-kit/
  BRAND.md            # Brand guidelines
  MANIFEST.SHA256     # Asset integrity checksums
  README.md           # Package info
  assets/             # Logo, icons, and visual assets
  components/         # Reusable UI component templates
  tokens/             # Design tokens (colors, spacing, typography)
```

## Usage

Reference these assets and tokens when building any FlashFusion product to maintain brand consistency.

## Structure Note

This project has a nested wrapper directory (`flashfusion-brand-kit/flashfusion-brand-kit/`) — an artifact of packaging.

## Status

Shared asset - stable brand kit, version 1.0.

## Migration Priority

**P0** - Should be migrated to `shared/brand-kit` in the source-of-truth-monorepo as it is a shared dependency consumed by multiple projects.

## Related Projects

Part of the [FlashFusion ecosystem](./../../PROJECTS.md).
