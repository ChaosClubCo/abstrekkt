import React, { useRef } from 'react';
import { useDataMigration } from './useDataMigration';

/**
 * Demo component for data import/export and migration. Users can import
 * files (e.g. existing codebases) and initiate export of the current
 * project. In a real implementation, the import would parse the
 * uploaded archive and persist its contents, and export would
 * generate a downloadable zip or push to a Git repository.
 */
export const DataMigration: React.FC = () => {
  const { imports, exporting, importFile, exportProject, logs } = useDataMigration();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => importFile(file));
    }
    // reset input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Data Import/Export & Migration Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {imports.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <h4>Imported Files</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {imports.map((f) => (
                <li key={f.id}>{f.name} – {f.size} bytes (imported {new Date(f.importedAt).toLocaleString()})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button onClick={exportProject} disabled={exporting}>
        {exporting ? 'Exporting...' : 'Export Current Project'}
      </button>
      <div style={{ marginTop: '1rem' }}>
        <h4>Logs</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', fontSize: '0.8rem' }}>
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataMigration;