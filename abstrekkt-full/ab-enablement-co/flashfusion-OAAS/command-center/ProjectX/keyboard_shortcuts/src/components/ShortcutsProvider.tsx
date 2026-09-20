import React, { useMemo, useState, useCallback } from 'react';
import {
  ShortcutsContext,
  CommandPaletteContext,
  ShortcutGuideContext,
  useShortcutsState,
  useCommandPaletteState,
  useShortcut,
} from '../hooks';
import type { ShortcutsProviderProps, ShortcutGroup, ShortcutsConfig } from '../types';

const defaultConfig: ShortcutsConfig = {
  commandPaletteKey: 'mod+k',
  guideKey: 'shift+?',
  vimMode: false,
  platform: 'auto',
  shortcuts: [],
  groups: [
    { id: 'general', label: 'General' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'editing', label: 'Editing' },
  ],
};

export function ShortcutsProvider({ children, config }: ShortcutsProviderProps) {
  const mergedConfig = { ...defaultConfig, ...config };

  const shortcutsState = useShortcutsState(mergedConfig.platform);
  const commandPaletteState = useCommandPaletteState();

  // Shortcut guide state
  const [guideOpen, setGuideOpen] = useState(false);

  const shortcutGroups = useMemo<ShortcutGroup[]>(() => {
    const groups = new Map<string, ShortcutGroup>();

    // Initialize groups
    for (const group of mergedConfig.groups) {
      groups.set(group.id, { ...group, shortcuts: [] });
    }

    // Add shortcuts to groups
    for (const shortcut of shortcutsState.shortcuts) {
      const groupId = shortcut.options.scope || 'general';
      let group = groups.get(groupId);

      if (!group) {
        group = { id: groupId, label: groupId, shortcuts: [] };
        groups.set(groupId, group);
      }

      group.shortcuts.push({
        key: shortcut.key,
        action: shortcut.id,
        description: shortcut.options.description || '',
        scope: shortcut.options.scope,
        group: groupId,
      });
    }

    return Array.from(groups.values()).filter((g) => g.shortcuts.length > 0);
  }, [shortcutsState.shortcuts, mergedConfig.groups]);

  const guideContext = useMemo(
    () => ({
      isOpen: guideOpen,
      open: () => setGuideOpen(true),
      close: () => setGuideOpen(false),
      shortcuts: shortcutGroups,
    }),
    [guideOpen, shortcutGroups]
  );

  return (
    <ShortcutsContext.Provider value={shortcutsState}>
      <CommandPaletteContext.Provider value={commandPaletteState}>
        <ShortcutGuideContext.Provider value={guideContext}>
          <ShortcutsInitializer config={mergedConfig} />
          {children}
        </ShortcutGuideContext.Provider>
      </CommandPaletteContext.Provider>
    </ShortcutsContext.Provider>
  );
}

// Internal component to register built-in shortcuts
function ShortcutsInitializer({ config }: { config: ShortcutsConfig }) {
  const { toggle: togglePalette } = React.useContext(CommandPaletteContext)!;
  const guideContext = React.useContext(ShortcutGuideContext)!;

  // Command palette shortcut
  useShortcut(config.commandPaletteKey, togglePalette, {
    description: 'Open command palette',
    scope: 'general',
    preventDefault: true,
  });

  // Shortcuts guide
  useShortcut(config.guideKey, () => guideContext.open(), {
    description: 'Show keyboard shortcuts',
    scope: 'general',
  });

  // Escape to close
  useShortcut('escape', () => {
    if (guideContext.isOpen) {
      guideContext.close();
    }
  }, {
    description: 'Close',
    scope: 'general',
  });

  return null;
}
