export type ModifierKey = 'mod' | 'ctrl' | 'alt' | 'shift' | 'meta';

export type Platform = 'mac' | 'windows' | 'linux' | 'auto';

export interface ShortcutOptions {
  description?: string;
  scope?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
  repeat?: boolean;
}

export interface RegisteredShortcut {
  id: string;
  key: string;
  callback: () => void;
  options: ShortcutOptions;
}

export interface ShortcutGroup {
  id: string;
  label: string;
  shortcuts: ShortcutDefinition[];
}

export interface ShortcutDefinition {
  key: string;
  action: string;
  description: string;
  scope?: string;
  group?: string;
}

export interface ShortcutsConfig {
  commandPaletteKey: string;
  guideKey: string;
  vimMode: boolean;
  platform: Platform;
  shortcuts: ShortcutDefinition[];
  groups: Array<{ id: string; label: string }>;
}

export interface Command {
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  action: () => void;
  group?: string;
  icon?: React.ReactNode;
  keywords?: string[];
}

export interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  commands: Command[];
  search: string;
  setSearch: (search: string) => void;
  filteredCommands: Command[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  executeSelected: () => void;
}

export interface ShortcutGuideContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  shortcuts: ShortcutGroup[];
}

export interface ShortcutsContextValue {
  register: (key: string, callback: () => void, options?: ShortcutOptions) => () => void;
  unregister: (key: string) => void;
  shortcuts: RegisteredShortcut[];
  platform: Platform;
  isMac: boolean;
  formatShortcut: (key: string) => string;
}

export interface ShortcutsProviderProps {
  children: React.ReactNode;
  config?: Partial<ShortcutsConfig>;
}

export interface CommandPaletteProps {
  placeholder?: string;
  className?: string;
  maxResults?: number;
}

export interface ShortcutsGuideProps {
  className?: string;
  title?: string;
}

export interface ShortcutHintProps {
  shortcut: string;
  className?: string;
}
