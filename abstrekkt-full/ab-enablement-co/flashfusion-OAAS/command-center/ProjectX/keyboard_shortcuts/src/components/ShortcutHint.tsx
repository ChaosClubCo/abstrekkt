import React from 'react';
import { useShortcutsContext } from '../hooks';
import type { ShortcutHintProps } from '../types';

export function ShortcutHint({ shortcut, className = '' }: ShortcutHintProps) {
  const { formatShortcut } = useShortcutsContext();

  const parts = formatShortcut(shortcut).split('+');

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {parts.map((part, index) => (
        <kbd
          key={index}
          className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 shadow-sm"
        >
          {part}
        </kbd>
      ))}
    </span>
  );
}
