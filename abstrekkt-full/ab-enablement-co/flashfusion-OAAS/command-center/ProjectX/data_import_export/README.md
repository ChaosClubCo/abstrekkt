# Data Import/Export & Migration Demo

This module provides a basic framework for importing existing codebases or content into FlashFusion and exporting your generated projects. It includes a custom hook (`useDataMigration`) and a demo component (`DataMigration`) to simulate file imports and project exports.

## Features

- Upload (import) one or more files and display their names, sizes, and import timestamps. *(Demo only – no actual file content is parsed.)*
- Simulate exporting the current project as a zip archive.
- Display logs of import and export actions.

## Files

| File | Purpose |
|------|---------|
| `useDataMigration.ts` | Hook managing imported files, export status, and logs. Provides functions to import files and start exporting a project. |
| `DataMigration.tsx` | Demo component that renders file input for imports, lists imported files, provides an export button, and shows logs. |
| `README.md` | This file. Explains usage and next steps. |
| `PRODUCTION_PLAN.md` | Roadmap for turning this demo into a full import/export and migration system. |

## Usage

1. Copy the `data_import_export` directory into your project.
2. Import and use the `DataMigration` component:

```tsx
import DataMigration from './data_import_export/DataMigration';

function ImportExportPage() {
  return <DataMigration />;
}
```

3. Replace the import and export functions in `useDataMigration` with actual API calls to your backend. On import, parse and store code or content. On export, package the current project and return a downloadable file or push to a repository.

## Extending the Module

- **Parsing and validation:** When importing, read the uploaded archive and validate it. Extract files and structure into your database or file system. Provide feedback on errors.
- **Data mapping and migration:** Allow users to map imported data to existing project structures (e.g. mapping collections, fields, templates). Provide migration tools to transform data as needed.
- **Export options:** Offer multiple export formats (zip, Git repo push, API response). Provide options to include or exclude certain files (e.g. node_modules).
- **Progress & status:** Show progress bars and detailed statuses for long‑running import/export operations. Use polling or WebSockets to update progress.
- **Permissions:** Restrict import/export actions to authorized users. Validate file size and type.
- **Audit & history:** Track import/export history for each project and allow rollback if needed.

Consult **PRODUCTION_PLAN.md** for a comprehensive roadmap to production readiness.