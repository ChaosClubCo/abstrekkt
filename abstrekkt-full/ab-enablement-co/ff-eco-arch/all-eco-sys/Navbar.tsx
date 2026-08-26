/**
 * Navbar   — Abstrekkt Design System
 * Sidebar  — Abstrekkt Design System
 * Select   — Abstrekkt Design System
 * Dropdown — Abstrekkt Design System
 * Table    — Abstrekkt Design System
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { NavItem, SelectOption, TableColumn, DropdownPlacement, TableSortDirection } from '../types'

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Navbar
 *
 * Behavior: sticky top-0, bg-ink with border-b. Not scroll-triggered.
 * Active state: brass text + left-border indicator (on mobile) or brass underline
 * Mobile: collapses to hamburger at md breakpoint. Focus-trapped when open.
 */

interface NavbarProps {
  logo:         React.ReactNode
  items:        NavItem[]
  actions?:     React.ReactNode
  className?:   string
}

export function Navbar({ logo, items, actions, className = '' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileOpen])

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      className={`
        sticky top-0 z-40
        bg-ink border-b border-border
        px-lg py-md
        ${className}
      `}
    >
      <div className="max-w-layout mx-auto flex items-center justify-between gap-xl">
        {/* Logo */}
        <div className="shrink-0">{logo}</div>

        {/* Desktop nav */}
        <ul
          role="list"
          className="hidden md:flex items-center gap-xl"
        >
          {items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`
                  font-mono text-label tracking-label uppercase
                  transition-colors duration-fast
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2
                  ${item.active
                    ? 'text-brass'
                    : 'text-fg-dim hover:text-fg'
                  }
                `}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions + Hamburger */}
        <div className="flex items-center gap-md">
          {actions && <div className="hidden md:flex items-center gap-sm">{actions}</div>}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(v => !v)}
            className="
              md:hidden text-fg-dim hover:text-fg
              transition-colors duration-fast
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2
            "
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <>
                  <line x1="3" y1="6"  x2="17" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-border mt-md pt-md pb-lg px-lg"
        >
          <ul role="list" className="flex flex-col gap-md">
            {items.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block font-mono text-label tracking-label uppercase py-1
                    border-l-2 pl-4 transition-all duration-fast
                    ${item.active
                      ? 'text-brass border-brass'
                      : 'text-fg-dim border-transparent hover:text-fg hover:border-border-bright'
                    }
                  `}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {actions && <div className="mt-lg flex flex-col gap-sm">{actions}</div>}
        </div>
      )}
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Sidebar
 *
 * Layout: fixed-left at lg+. Overlay drawer on mobile.
 * Width: 240px fixed.
 * Active state: brass text + bg-3 surface + left brass border.
 */

interface SidebarProps {
  items:      NavItem[]
  header?:    React.ReactNode
  footer?:    React.ReactNode
  open?:      boolean          // controlled mobile open
  onClose?:   () => void
  className?: string
}

export function Sidebar({ items, header, footer, open = false, onClose, className = '' }: SidebarProps) {
  const panelClass = `
    flex flex-col h-full w-[240px]
    bg-bg-2 border-r border-border
    ${className}
  `

  const content = (
    <div className={panelClass}>
      {header && (
        <div className="p-lg border-b border-border shrink-0">{header}</div>
      )}
      <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto p-md">
        <ul role="list" className="flex flex-col gap-xs">
          {items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`
                  flex items-center gap-sm
                  px-md py-2.5
                  font-mono text-label tracking-label
                  border-l-2 transition-all duration-fast
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2
                  ${item.active
                    ? 'text-brass bg-bg-3 border-brass'
                    : 'text-fg-dim border-transparent hover:text-fg hover:bg-bg-3 hover:border-border-bright'
                  }
                `}
              >
                {item.icon && (
                  <span aria-hidden="true" className="shrink-0">{item.icon}</span>
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {footer && (
        <div className="p-lg border-t border-border shrink-0">{footer}</div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop: static */}
      <aside className="hidden lg:block h-screen sticky top-0">{content}</aside>

      {/* Mobile: overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8,7,5,0.8)' }}
            onClick={onClose}
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECT
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Select (native)
 *
 * Wraps native <select> — accessible by default, custom visual chrome.
 * For grouped options, pass SelectOption[] with group property.
 */

interface SelectProps {
  options:    SelectOption[]
  value?:     string
  onChange?:  (value: string) => void
  label?:     string
  error?:     string
  hint?:      string
  disabled?:  boolean
  required?:  boolean
  id?:        string
  className?: string
  placeholder?: string
}

export function Select({
  options,
  value,
  onChange,
  label,
  error,
  hint,
  disabled,
  required,
  id,
  className = '',
  placeholder,
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const errorId  = error && selectId ? `${selectId}-error` : undefined

  // Group options
  const groups = options.reduce<Map<string | undefined, SelectOption[]>>((acc, opt) => {
    const key = opt.group
    if (!acc.has(key)) acc.set(key, [])
    acc.get(key)!.push(opt)
    return acc
  }, new Map())

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-mono text-label tracking-label text-fg-mute mb-2 uppercase"
        >
          {label}
          {required && <span className="text-brass ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`
            w-full appearance-none
            bg-bg-3 text-fg font-body text-body-md
            border border-border rounded-none
            px-4 py-3 pr-10
            transition-colors duration-base
            focus-visible:outline-none focus-visible:border-brass
            disabled:opacity-40 disabled:cursor-not-allowed
            aria-[invalid=true]:border-oxblood
            cursor-pointer
            ${className}
          `}
        >
          {placeholder && (
            <option value="" disabled={required}>{placeholder}</option>
          )}
          {Array.from(groups.entries()).map(([group, opts]) =>
            group ? (
              <optgroup key={group} label={group}>
                {opts.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              opts.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            )
          )}
        </select>
        {/* Chevron */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-mute">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <p id={errorId} role="alert" className="mt-2 font-mono text-caption text-oxblood-text tracking-caption uppercase">{error}</p>}
      {hint && !error && <p className="mt-2 font-mono text-caption text-fg-mute tracking-caption uppercase">{hint}</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Dropdown (action menu)
 *
 * Opens on click of trigger. Closes on: item click, ESC, outside click.
 * Keyboard: ArrowUp/ArrowDown to navigate items, Enter/Space to select.
 * Accessibility: role=menu, role=menuitem, aria-haspopup, aria-expanded
 */

interface DropdownItem {
  label:     string
  onClick:   () => void
  disabled?: boolean
  icon?:     React.ReactNode
  variant?:  'default' | 'destructive'
}

interface DropdownProps {
  trigger:    React.ReactNode
  items:      DropdownItem[]
  placement?: DropdownPlacement
  className?: string
}

const PLACEMENT_CLASS: Record<DropdownPlacement, string> = {
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end':   'top-full right-0 mt-1',
  'top-start':    'bottom-full left-0 mb-1',
  'top-end':      'bottom-full right-0 mb-1',
}

export function Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  className = '',
}: DropdownProps) {
  const [open, setOpen]       = useState(false)
  const [focused, setFocused] = useState(-1)
  const containerRef          = useRef<HTMLDivElement>(null)
  const itemRefs              = useRef<(HTMLButtonElement | null)[]>([])
  const menuId                = useRef(`menu-${Math.random().toString(36).slice(2, 8)}`).current

  const close = useCallback(() => { setOpen(false); setFocused(-1) }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', escHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', escHandler)
    }
  }, [open, close])

  // Focus first item when opened via keyboard
  useEffect(() => {
    if (open && focused >= 0) itemRefs.current[focused]?.focus()
  }, [open, focused])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    const enabledIndexes = items.reduce<number[]>((acc, item, i) => {
      if (!item.disabled) acc.push(i)
      return acc
    }, [])

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = enabledIndexes.find(i => i > focused) ?? enabledIndexes[0]
      setFocused(next ?? 0)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = [...enabledIndexes].reverse().find(i => i < focused) ?? enabledIndexes[enabledIndexes.length - 1]
      setFocused(prev ?? 0)
    }
    if (e.key === 'Home') { e.preventDefault(); setFocused(enabledIndexes[0] ?? 0) }
    if (e.key === 'End')  { e.preventDefault(); setFocused(enabledIndexes[enabledIndexes.length - 1] ?? 0) }
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} onKeyDown={handleKeyDown}>
      <div
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        {trigger}
      </div>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          className={`
            absolute z-50 min-w-[180px]
            bg-bg-2 border border-border rounded-none
            py-1
            ${PLACEMENT_CLASS[placement]}
          `}
        >
          {items.map((item, i) => (
            <button
              key={i}
              ref={el => { itemRefs.current[i] = el }}
              role="menuitem"
              disabled={item.disabled}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick()
                  close()
                }
              }}
              className={`
                w-full flex items-center gap-sm
                px-4 py-2.5
                text-left font-body text-body-sm
                transition-colors duration-fast
                focus-visible:outline-none focus-visible:bg-bg-3
                disabled:opacity-40 disabled:cursor-not-allowed
                ${item.variant === 'destructive'
                  ? 'text-oxblood-text hover:bg-bg-3'
                  : 'text-fg hover:bg-bg-3 hover:text-fg'
                }
              `}
            >
              {item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLE
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Table
 *
 * Sorting: client-side, column-level. aria-sort on active column header.
 * Empty state: renders EmptyState slot when data is empty.
 * Loading: skeleton rows (5) replace data rows.
 * No horizontal scroll wrapper — caller must handle if needed.
 */

interface TableProps<T extends Record<string, unknown>> {
  columns:    TableColumn<T>[]
  data:       T[]
  loading?:   boolean
  emptyState?: React.ReactNode
  caption?:   string
  onSort?:    (key: keyof T, direction: TableSortDirection) => void
  className?: string
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyState,
  caption,
  onSort,
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<TableSortDirection>(null)

  const handleSort = (key: keyof T) => {
    const nextDir: TableSortDirection =
      sortKey === key
        ? sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc'
        : 'asc'
    setSortKey(nextDir === null ? null : key)
    setSortDir(nextDir)
    onSort?.(key, nextDir)
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse" aria-label={caption}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th
                key={String(col.key)}
                scope="col"
                aria-sort={
                  col.sortable
                    ? sortKey === col.key
                      ? sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'
                      : 'none'
                    : undefined
                }
                style={{ width: col.width }}
                className={`
                  text-left px-4 py-3
                  font-mono text-[10px] tracking-kicker uppercase font-medium text-fg-mute
                  ${col.sortable ? 'cursor-pointer select-none hover:text-fg transition-colors duration-fast' : ''}
                `}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                onKeyDown={col.sortable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSort(col.key) }
                } : undefined}
                tabIndex={col.sortable ? 0 : undefined}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                      className={`shrink-0 transition-transform duration-fast ${
                        sortKey === col.key && sortDir === 'desc' ? 'rotate-180' : ''
                      } ${sortKey === col.key ? 'text-brass' : 'text-fg-mute'}`}
                    >
                      <path d="M5 2v6M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded-none bg-bg-3 animate-pulse" style={{ width: '60%' }} />
                    </td>
                  ))}
                </tr>
              ))
            : sortedData.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-xl text-center">
                    {emptyState ?? (
                      <span className="font-mono text-label text-fg-mute tracking-label uppercase">
                        No records found
                      </span>
                    )}
                  </td>
                </tr>
              )
              : sortedData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border hover:bg-bg-3 transition-colors duration-fast"
                  >
                    {columns.map(col => (
                      <td key={String(col.key)} className="px-4 py-3 font-body text-body-sm text-fg">
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? '—')
                        }
                      </td>
                    ))}
                  </tr>
                ))
          }
        </tbody>
      </table>
    </div>
  )
}
