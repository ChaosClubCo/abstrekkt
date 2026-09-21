# Naming and Taxonomy Rules

Asset key format: AKI-000001 through AKI-999999.

Recommended human-readable naming:
[module]__[asset-purpose]__[format]__[status]__[yyyymmdd]

Example:
business-ai-audit__discovery-intake-form__doc__client-ready__20260511
manual-work-cost__roi-calculator__html__product-candidate__20260511
company-brain__retrieval-policy__md__approved-internal__20260511

Rules:
- Do not encode every tag into the filename.
- Keep asset_id stable in the database.
- Use filenames for human recognition; use metadata for intelligence.
- Never use client secrets, API keys, private names, or sensitive details in filenames.
- Use status in metadata first; filename status is optional and only for curated deliverables.