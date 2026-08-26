import React from 'react';
import { useShortcutGuide, useShortcutsContext } from '../hooks';
import type { ShortcutsGuideProps } from '../types';

export function ShortcutsGuide({
  className = '',
  title = 'Keyboard Shortcuts',
}: ShortcutsGuideProps) {
  const { isOpen, close, shortcuts } = useShortcutGuide();
  const { formatShortcut } = useShortcutsContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={close}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {shortcuts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No shortcuts registered
            </p>
          ) : (
            <div className="space-y-8">
              {shortcuts.map((group) => (
                <div key={group.id}>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {group.label}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((shortcut, index) => (
                      <div
                        key={`${shortcut.key}-${index}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-gray-900 dark:text-gray-100">
                          {shortcut.description || shortcut.action}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-mono shadow-sm">
                          {formatShortcut(shortcut.key)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">?</kbd> to show this guide
        </div>
      </div>
    </div>
  );
}
