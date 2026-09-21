import React, { useState } from 'react';
import { useLocalization } from './useLocalization';

/**
 * Demo component demonstrating localization support. Users can select
 * from available languages and see translated strings update. In
 * production, this would integrate with a full i18n solution (e.g.
 * i18next, react-intl) and support complex localization features.
 */
export const LocalizationSupport: React.FC = () => {
  const { languages, currentLanguageCode, changeLanguage, t, logs, addLanguage } = useLocalization();
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newGreeting, setNewGreeting] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddLang = () => {
    if (!newCode.trim() || !newName.trim()) return;
    addLanguage(newCode.trim(), newName.trim(), {
      greeting: newGreeting.trim() || newName.trim(),
      description: newDescription.trim() || newName.trim(),
    });
    setNewCode('');
    setNewName('');
    setNewGreeting('');
    setNewDescription('');
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', maxWidth: 700 }}>
      <h2>Localization & Internationalization Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Select language:
          <select
            value={currentLanguageCode}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>{t('greeting')}</strong></p>
        <p>{t('description')}</p>
      </div>
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem', marginTop: '1rem' }}>
        <h3>Add Language</h3>
        <p>For demonstration you can add a new language by providing its code and name, plus optional translations for `greeting` and `description`.</p>
        <input
          type="text"
          placeholder="Language code (e.g. fr)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Language name (e.g. Français)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <br />
        <input
          type="text"
          placeholder="Translation for greeting"
          value={newGreeting}
          onChange={(e) => setNewGreeting(e.target.value)}
          style={{ marginTop: '0.5rem', marginRight: '0.5rem', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Translation for description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ marginTop: '0.5rem', width: '100%' }}
        />
        <button onClick={handleAddLang} style={{ marginTop: '0.5rem' }}>Add Language</button>
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

export default LocalizationSupport;