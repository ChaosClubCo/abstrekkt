# Graph Schema v2

## Node types

`composition`, `version`, `document`, `source_image`, `source_document`, `audio_reference`, `visual_package`, `extraction`, `creator_persona`, `production_persona`, `workflow`, `theme`.

## Edge semantics

- `document_of`, `source_for`, `audio_render_of`, `visualizes`
- `version_of`, `alternate_version_of`, `production_branch_of`
- `shares_lines_with`, `same_source_pool_as`
- `expresses`, `contrasts_with_current_rule`
- `contains`, `governs_outputs_for`, `source_material_for`

`confirmed=false` means evidence-backed hypothesis, not rejection. Confidence is epistemic support, not artistic quality.
