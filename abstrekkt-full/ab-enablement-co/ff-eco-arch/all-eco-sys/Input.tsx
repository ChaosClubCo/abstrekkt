/**
 * Input / Textarea — Abstrekkt Design System
 *
 * States: default | focus | error | disabled
 * Sizes:  sm | md
 *
 * Rules:
 *   - Background: bg-3 (input surface)
 *   - Border steps: border → brass (focus) | oxblood (error)
 *   - Label: JetBrains Mono, 11px, uppercase, letter-spacing 0.08em
 *   - Error copy: oxblood-text (#d47272) — AA 4.80:1 on bg-2
 *   - Never use placeholder as label substitute
 */

import React, { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { InputSize } from '../types'

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface InputBaseProps {
  label?:       string
  error?:       string
  hint?:        string
  size?:        InputSize
  className?:   string
  id?:          string
  required?:    boolean
  disabled?:    boolean
  'data-testid'?: string
}

export interface InputProps
  extends InputBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

export interface TextareaProps
  extends InputBaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  rows?: number
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const LABEL_BASE =
  'block font-mono text-label tracking-label text-fg-mute mb-2 uppercase'

const INPUT_BASE =
  'w-full bg-bg-3 text-fg font-body text-body-md ' +
  'border border-border rounded-none ' +
  'placeholder:text-fg-mute ' +
  'transition-colors duration-base ease-standard ' +
  'focus-visible:outline-none focus-visible:border-brass ' +
  'disabled:opacity-40 disabled:cursor-not-allowed ' +
  'aria-[invalid=true]:border-oxblood'

const SIZE_MAP: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-[14px]',
  md: 'px-4 py-3 text-body-md',
}

const ERROR_STYLE = 'mt-2 font-mono text-caption text-oxblood-text tracking-caption uppercase'
const HINT_STYLE  = 'mt-2 font-mono text-caption text-fg-mute tracking-caption uppercase'

// ─── INPUT ────────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      id,
      required,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId    = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId    = error && inputId ? `${inputId}-error` : undefined
    const hasError   = Boolean(error)

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className={LABEL_BASE}>
            {label}
            {required && (
              <span className="text-brass ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId ?? (hint && inputId ? `${inputId}-hint` : undefined)}
          className={`${INPUT_BASE} ${SIZE_MAP[size]} ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={ERROR_STYLE}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={inputId ? `${inputId}-hint` : undefined} className={HINT_STYLE}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      rows = 4,
      id,
      required,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const areaId  = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = error && areaId ? `${areaId}-error` : undefined
    const hasError = Boolean(error)

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={areaId} className={LABEL_BASE}>
            {label}
            {required && (
              <span className="text-brass ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId ?? (hint && areaId ? `${areaId}-hint` : undefined)}
          className={`${INPUT_BASE} ${SIZE_MAP[size]} resize-y ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={ERROR_STYLE}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={areaId ? `${areaId}-hint` : undefined} className={HINT_STYLE}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
/*
  // Default
  <Input label="Title" placeholder="Enter note title" />

  // With error
  <Input
    label="Email"
    type="email"
    error="Enter a valid email address."
    value={email}
    onChange={e => setEmail(e.target.value)}
  />

  // With hint
  <Input
    label="Slug"
    hint="Lowercase, hyphens only. Used in URL."
    placeholder="my-note-title"
  />

  // Textarea
  <Textarea label="Body" rows={6} placeholder="Write something worth reading..." />

  // Smoke test: label links to input, error reads to screen reader via role=alert,
  // focus state shows brass border, disabled state prevents interaction.
*/
