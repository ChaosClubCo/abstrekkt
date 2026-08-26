import React from 'react';
import { useComprehensiveSearch, SearchCategory } from './useComprehensiveSearch';

/**
 * Demo component for the comprehensive search feature. Provides a search
 * input, category selectors, and displays results grouped by category.
 * In production you would fetch results from a search API and provide
 * advanced features like highlighting, autocomplete, and ranking.
 */
export const ComprehensiveSearch: React.FC = () => {
  const {
    query,
    setQuery,
    categories,
    toggleCategory,
    results,
    performSearch,
    logs,
  } = useComprehensiveSearch();

  const allCategories: SearchCategory[] = ['projects', 'templates', 'documentation', 'support'];

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Comprehensive Search Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across projects, templates, docs, support..."
          style={{ width: '100%', marginBottom: '0.5rem' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') performSearch();
          }}
        />
        <div style={{ marginBottom: '0.5rem' }}>
          {allCategories.map((cat) => (
            <label key={cat} style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />{' '}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))}
        </div>
        <button onClick={performSearch}>Search</button>
      </div>
      <div>
        <h3>Results</h3>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((res) => (
              <li key={res.id} style={{ marginBottom: '0.75rem' }}>
                <strong>{res.title}</strong>
                <br />
                <em style={{ fontSize: '0.8rem' }}>{res.category}</em>
                <p style={{ margin: 0 }}>{res.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
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

export default ComprehensiveSearch;