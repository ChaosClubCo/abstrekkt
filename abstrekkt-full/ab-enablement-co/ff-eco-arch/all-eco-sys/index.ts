/**
 * Abstrekkt Design System — Shared Types
 * version: 1.1.0
 */

// ─── COLOR TOKENS ─────────────────────────────────────────────────────────────

export type ColorRaw =
  | 'ink' | 'ink-deep'
  | 'bg' | 'bg-2' | 'bg-3'
  | 'fg' | 'fg-dim' | 'fg-mute'
  | 'brass' | 'brass-soft' | 'brass-deep' | 'brass-bg' | 'gate'
  | 'border' | 'border-bright' | 'rule'
  | 'oxblood' | 'oxblood-text'

export type ColorSemantic =
  | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'disabled'

// ─── COMPONENT VARIANTS ───────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'ghost' | 'destructive'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export type BadgeVariant  = 'default' | 'accent' | 'error' | 'muted'

export type InputSize     = 'sm' | 'md'
export type InputState    = 'default' | 'focus' | 'error' | 'disabled'

export type ToastVariant  = 'default' | 'success' | 'error' | 'warning'
export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export type TabsVariant   = 'line' | 'pill'

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export type TableSortDirection = 'asc' | 'desc' | null

// ─── COMPONENT STATE MACHINES ─────────────────────────────────────────────────

export type InteractiveState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'loading'
  | 'disabled'
  | 'error'

// ─── SHARED PROPS ──────────────────────────────────────────────────────────────

export interface BaseComponentProps {
  className?: string
  id?: string
  'data-testid'?: string
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href:  string
  icon?: React.ReactNode
  external?: boolean
  active?: boolean
}

// ─── TABLE ─────────────────────────────────────────────────────────────────────

export interface TableColumn<T = Record<string, unknown>> {
  key:       keyof T
  header:    string
  sortable?: boolean
  width?:    string
  render?:   (value: T[keyof T], row: T) => React.ReactNode
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────

export interface ToastMessage {
  id:       string
  message:  string
  variant?: ToastVariant
  duration?: number    // ms, default 4000. 0 = persist.
  action?:  {
    label:   string
    onClick: () => void
  }
}

// ─── SELECT / DROPDOWN ─────────────────────────────────────────────────────────

export interface SelectOption {
  value:    string
  label:    string
  disabled?: boolean
  group?:   string
}
