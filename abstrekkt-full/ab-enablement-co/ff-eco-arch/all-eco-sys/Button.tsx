/**
 * Button — Abstrekkt Design System
 *
 * Variants: primary | ghost | destructive
 * Sizes:    sm | md | lg
 * States:   default | hover | active | focus | loading | disabled
 *
 * Rules:
 *   - Never full-width (size to content + padding)
 *   - No border-radius on primary — square corners reinforce print aesthetic
 *   - Brass is primary CTA color, not a fill
 *   - Loading replaces children with spinner; dimensions preserved
 */

import React, { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant
  size?:     ButtonSize
  loading?:  boolean
  icon?:     React.ReactNode
  iconPosition?: 'left' | 'right'
}

// ─── STYLE MAPS ───────────────────────────────────────────────────────────────

const BASE =
  'inline-flex items-center justify-center gap-2 ' +
  'font-mono font-medium tracking-kicker uppercase ' +
  'border rounded-none ' +
  'transition-all duration-base ease-standard ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-3 ' +
  'disabled:pointer-events-none disabled:opacity-40 ' +
  'select-none whitespace-nowrap'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-transparent text-brass border-brass ' +
    'hover:bg-brass hover:text-ink ' +
    'active:bg-brass-deep active:border-brass-deep active:text-ink',

  ghost:
    'bg-transparent text-fg border-border ' +
    'hover:border-border-bright hover:text-fg ' +
    'active:bg-bg-2',

  destructive:
    'bg-transparent text-oxblood-text border-oxblood ' +
    'hover:bg-oxblood hover:text-fg ' +
    'active:bg-oxblood/80',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[10px] tracking-kicker',
  md: 'px-5 py-2.5 text-kicker',
  lg: 'px-7 py-3.5 text-[11px] tracking-kicker',
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg
    aria-hidden="true"
    className="animate-spin h-3 w-3"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size    = 'md',
      loading = false,
      disabled,
      icon,
      iconPosition = 'left',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {loading && <Spinner />}
        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true" className="shrink-0">{icon}</span>
        )}
        {children && (
          <span className={loading ? 'invisible' : undefined}>
            {loading ? children : children}
          </span>
        )}
        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true" className="shrink-0">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
/*
  // Primary CTA
  <Button variant="primary">Publish Note</Button>

  // Ghost secondary action
  <Button variant="ghost" size="sm">Cancel</Button>

  // Loading state
  <Button variant="primary" loading>Saving...</Button>

  // Destructive with icon
  <Button variant="destructive" icon={<TrashIcon />}>Delete Entry</Button>

  // Smoke test: button should render text, respond to click, show spinner on loading,
  // and be keyboard-focusable with visible brass outline ring.
*/
