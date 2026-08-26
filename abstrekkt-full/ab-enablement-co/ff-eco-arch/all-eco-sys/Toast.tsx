/**
 * Toast — Abstrekkt Design System
 * Modal — Abstrekkt Design System
 * Tabs  — Abstrekkt Design System
 */

'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ToastMessage, ToastPosition, ToastVariant, TabsVariant } from '../types'

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Toast
 *
 * State machine: queued → visible → dismissed
 * Duration default: 4000ms. 0 = persist until dismissed.
 * Position: top-right (default)
 * Variants: default | success | error | warning
 *
 * Accessibility: role=status (default/success), role=alert (error/warning)
 * Motion: opacity + translateY, 150ms enter, 150ms exit
 */

interface ToastContextValue {
  add:    (toast: Omit<ToastMessage, 'id'>) => string
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const TOAST_POSITION: Record<ToastPosition, string> = {
  'top-right':      'top-md right-md items-end',
  'top-center':     'top-md left-1/2 -translate-x-1/2 items-center',
  'bottom-right':   'bottom-md right-md items-end',
  'bottom-center':  'bottom-md left-1/2 -translate-x-1/2 items-center',
}

const TOAST_VARIANT: Record<ToastVariant, string> = {
  default: 'border-border text-fg',
  success: 'border-brass/40 text-fg',
  error:   'border-oxblood/50 text-fg',
  warning: 'border-brass-deep/50 text-fg',
}

const TOAST_ACCENT: Record<ToastVariant, string> = {
  default: '',
  success: 'border-l-2 border-l-brass',
  error:   'border-l-2 border-l-oxblood',
  warning: 'border-l-2 border-l-brass-deep',
}

interface ToastProviderProps {
  children:  React.ReactNode
  position?: ToastPosition
  maxStack?: number
}

export function ToastProvider({
  children,
  position = 'top-right',
  maxStack = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<(ToastMessage & { visible: boolean })[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, visible: false } : t)
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 200)
  }, [])

  const add = useCallback((toast: Omit<ToastMessage, 'id'>): string => {
    const id = Math.random().toString(36).slice(2, 10)
    const duration = toast.duration ?? 4000

    setToasts(prev => {
      const next = [...prev, { ...toast, id, visible: false }]
      return next.slice(-maxStack)
    })

    // Let DOM render before making visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t))
      })
    })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }

    return id
  }, [maxStack, remove])

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className={`fixed z-50 flex flex-col gap-sm pointer-events-none ${TOAST_POSITION[position]}`}
        style={{ maxWidth: '380px' }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            role={toast.variant === 'error' || toast.variant === 'warning' ? 'alert' : 'status'}
            className={`
              pointer-events-auto w-full
              bg-bg-2 border rounded-none
              px-5 py-4
              flex items-start justify-between gap-md
              transition-all duration-base ease-standard
              ${TOAST_VARIANT[toast.variant ?? 'default']}
              ${TOAST_ACCENT[toast.variant ?? 'default']}
              ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <p className="font-body text-body-sm text-fg flex-1">{toast.message}</p>
            <div className="flex items-center gap-sm shrink-0">
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="font-mono text-[10px] tracking-kicker uppercase text-brass hover:text-brass-soft transition-colors duration-fast"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => remove(toast.id)}
                aria-label="Dismiss notification"
                className="text-fg-mute hover:text-fg transition-colors duration-fast"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Modal
 *
 * Focus trap: active while open
 * Dismiss: ESC key or overlay click (if dismissOnOverlay=true)
 * Motion: opacity + scale, 300ms (slow token — modal only)
 * Accessibility: role=dialog, aria-modal, aria-labelledby
 */

interface ModalProps {
  open:             boolean
  onClose:          () => void
  title?:           string
  description?:     string
  dismissOnOverlay?: boolean
  children:         React.ReactNode
  footer?:          React.ReactNode
  'aria-label'?:    string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  dismissOnOverlay = true,
  children,
  footer,
  'aria-label': ariaLabel,
}: ModalProps) {
  const overlayRef    = useRef<HTMLDivElement>(null)
  const dialogRef     = useRef<HTMLDivElement>(null)
  const titleId       = useRef(`modal-title-${Math.random().toString(36).slice(2, 8)}`).current
  const descriptionId = useRef(`modal-desc-${Math.random().toString(36).slice(2, 8)}`).current

  // ESC to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    first?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      style={{ backgroundColor: 'rgba(8,7,5,0.85)' }}
      onClick={dismissOnOverlay ? (e) => {
        if (e.target === overlayRef.current) onClose()
      } : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className="
          relative w-full max-w-[560px]
          bg-bg-2 border border-border rounded-none
          p-[26px_30px]
          animate-in fade-in zoom-in-[0.97] duration-slow
        "
        style={{
          animation: 'modalEnter 300ms cubic-bezier(0,0,0.2,1) forwards',
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-lg">
            {title && (
              <h2 id={titleId} className="font-serif text-h2 text-fg">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-2 font-body text-body-sm text-fg-dim">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="
            absolute top-5 right-5
            text-fg-mute hover:text-fg
            transition-colors duration-fast
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-3
          "
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {children}

        {footer && (
          <>
            <div className="border-t border-rule mt-lg pt-md" />
            <div className="flex items-center justify-end gap-sm">{footer}</div>
          </>
        )}
      </div>
      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Tabs
 *
 * Variants: line (underline active) | pill (bg-fill active)
 * Keyboard: ArrowLeft/ArrowRight to navigate, Enter/Space to select
 * Accessibility: role=tablist, role=tab, role=tabpanel, aria-selected
 */

interface Tab {
  id:       string
  label:    string
  content:  React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs:        Tab[]
  defaultTab?: string
  variant?:    TabsVariant
  onChange?:   (tabId: string) => void
  className?:  string
}

const TAB_VARIANTS: Record<TabsVariant, { list: string; tab: string; active: string }> = {
  line: {
    list:   'border-b border-border flex gap-0',
    tab:    'px-5 py-3 font-mono text-label tracking-label uppercase text-fg-mute hover:text-fg transition-colors duration-fast cursor-pointer relative',
    active: 'text-fg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brass',
  },
  pill: {
    list:   'flex gap-xs bg-bg-3 p-xs rounded-sm w-fit',
    tab:    'px-4 py-2 font-mono text-[10px] tracking-kicker uppercase font-medium text-fg-mute hover:text-fg transition-colors duration-fast cursor-pointer rounded-sm',
    active: 'bg-bg-2 text-fg border border-border',
  },
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
  onChange,
  className = '',
}: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const select = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter(t => !t.disabled)
    const currentIndex = enabledTabs.findIndex(t => t.id === tabs[index].id)

    if (e.key === 'ArrowRight') {
      const next = enabledTabs[(currentIndex + 1) % enabledTabs.length]
      tabRefs.current.get(next.id)?.focus()
    }
    if (e.key === 'ArrowLeft') {
      const prev = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length]
      tabRefs.current.get(prev.id)?.focus()
    }
    if (e.key === 'Home') {
      tabRefs.current.get(enabledTabs[0].id)?.focus()
    }
    if (e.key === 'End') {
      tabRefs.current.get(enabledTabs[enabledTabs.length - 1].id)?.focus()
    }
  }

  const styles = TAB_VARIANTS[variant]
  const activePanel = tabs.find(t => t.id === active)

  return (
    <div className={className}>
      <div role="tablist" className={styles.list}>
        {tabs.map((tab, i) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              ref={el => { if (el) tabRefs.current.set(tab.id, el) }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && select(tab.id)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={`
                ${styles.tab}
                ${isActive ? styles.active : ''}
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2
              `}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {activePanel && (
        <div
          key={activePanel.id}
          role="tabpanel"
          id={`tabpanel-${activePanel.id}`}
          aria-labelledby={`tab-${activePanel.id}`}
          tabIndex={0}
          className="mt-lg focus-visible:outline-none"
        >
          {activePanel.content}
        </div>
      )}
    </div>
  )
}

// ─── USAGE EXAMPLES ───────────────────────────────────────────────────────────
/*
  // Toast system — wrap app in ToastProvider
  <ToastProvider position="top-right">
    <App />
  </ToastProvider>

  // Trigger toast
  const { add } = useToast()
  add({ message: 'Draft saved.', variant: 'success' })
  add({ message: 'Failed to publish.', variant: 'error', duration: 0 })

  // Modal
  const [open, setOpen] = useState(false)
  <Modal open={open} onClose={() => setOpen(false)} title="Confirm deletion"
    footer={<>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </>}
  >
    <p className="text-fg-dim text-body-md">This cannot be undone.</p>
  </Modal>

  // Tabs
  <Tabs
    variant="line"
    tabs={[
      { id: 'notes',    label: 'Notes',    content: <NotesPanel /> },
      { id: 'archive',  label: 'Archive',  content: <ArchivePanel /> },
    ]}
  />

  // Smoke test:
  //   Toast: message appears at position, auto-dismisses at duration, role=alert for error
  //   Modal: ESC closes, overlay click closes, focus trapped inside
  //   Tabs: arrow keys navigate, Enter selects, panel renders, aria-selected correct
*/
