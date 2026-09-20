/**
 * Card — Abstrekkt Design System
 * Badge — Abstrekkt Design System
 * Tooltip — Abstrekkt Design System
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import type { BadgeVariant, BaseComponentProps } from '../types'

// ═══════════════════════════════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Card
 *
 * Background: bg-2  Border: border  Padding: 26px 30px
 * Hover: border steps to border-bright
 * No drop shadow. No border-radius.
 * One brass accent element maximum.
 */

interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseComponentProps {
  as?:        'div' | 'article' | 'section' | 'li'
  kicker?:    string
  heading?:   string
  footer?:    React.ReactNode
  hoverable?: boolean
}

export function Card({
  as: Tag = 'div',
  kicker,
  heading,
  footer,
  hoverable = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const hoverClass = hoverable
    ? 'hover:border-border-bright cursor-pointer transition-colors duration-base ease-standard'
    : ''

  return (
    <Tag
      className={`
        bg-bg-2 border border-border rounded-none
        p-[26px_30px]
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {kicker && (
        <span
          aria-label={`Category: ${kicker}`}
          className="block font-mono text-kicker tracking-kicker text-brass uppercase mb-[14px]"
        >
          {kicker}
        </span>
      )}
      {heading && (
        <h3 className="font-serif text-h3 text-fg mb-md">
          {heading}
        </h3>
      )}
      {children}
      {footer && (
        <>
          <div className="border-t border-rule mt-lg pt-md" />
          {footer}
        </>
      )}
    </Tag>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Badge
 *
 * Shape: pill (border-radius sm = 4px) — the only rounded element in the system
 * Size: inline, mono font, kicker treatment
 * Variants: default | accent | error | muted
 */

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BaseComponentProps {
  variant?: BadgeVariant
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-bg-3 text-fg-dim border-border',
  accent:  'bg-brass-bg text-brass border-brass/30',
  error:   'bg-bg-3 text-oxblood-text border-oxblood/40',
  muted:   'bg-bg-3 text-fg-mute border-border',
}

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-mono text-[10px] tracking-kicker uppercase font-medium
        px-[8px] py-[3px]
        border rounded-sm
        ${BADGE_VARIANTS[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Tooltip
 *
 * Placement: top (default) | bottom | left | right
 * Delay: 500ms (hover), 0ms (focus)
 * Accessible: role=tooltip, aria-describedby linkage
 * Motion: opacity + translate, 150ms, no scale
 */

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps extends BaseComponentProps {
  content:    string
  placement?: TooltipPlacement
  delay?:     number
  children:   React.ReactElement
}

const TOOLTIP_PLACEMENT: Record<TooltipPlacement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({
  content,
  placement = 'top',
  delay = 500,
  children,
  id,
}: TooltipProps) {
  const [visible, setVisible]     = useState(false)
  const [mounted, setMounted]     = useState(false)
  const tooltipId                 = id || `tooltip-${Math.random().toString(36).slice(2, 8)}`
  const hoverTimer                = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = (immediate = false) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(
      () => { setMounted(true); requestAnimationFrame(() => setVisible(true)) },
      immediate ? 0 : delay
    )
  }

  const hide = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setVisible(false)
    setTimeout(() => setMounted(false), 150)
  }

  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }, [])

  const child = React.cloneElement(children, {
    'aria-describedby': tooltipId,
    onMouseEnter: (e: React.MouseEvent) => {
      show()
      children.props.onMouseEnter?.(e)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide()
      children.props.onMouseLeave?.(e)
    },
    onFocus: (e: React.FocusEvent) => {
      show(true)
      children.props.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent) => {
      hide()
      children.props.onBlur?.(e)
    },
  })

  return (
    <span className="relative inline-flex">
      {child}
      {mounted && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`
            absolute z-50 pointer-events-none
            ${TOOLTIP_PLACEMENT[placement]}
            px-3 py-1.5
            bg-bg-2 border border-border
            font-mono text-caption tracking-caption uppercase text-fg-dim
            whitespace-nowrap rounded-none
            transition-opacity duration-base ease-standard
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {content}
        </span>
      )}
    </span>
  )
}

// ─── USAGE EXAMPLES ───────────────────────────────────────────────────────────
/*
  // Card with kicker and heading
  <Card kicker="Essay" heading="What load-bearing means" hoverable>
    <p className="text-fg-dim text-body-md">
      Not every piece of structure holds the building up. Some just fill space.
    </p>
  </Card>

  // Badge
  <Badge variant="accent">Active</Badge>
  <Badge variant="error">Overdue</Badge>

  // Tooltip
  <Tooltip content="Published Jun 11 2026" placement="top">
    <span className="text-fg-mute text-label cursor-default">6 hours ago</span>
  </Tooltip>

  // Smoke test:
  //   Card: hover border brightens. No shadow appears.
  //   Badge: pill shape visible (4px radius). Color matches variant.
  //   Tooltip: appears after 500ms hover, immediately on focus.
  //            Hides on mouseleave/blur. Linked via aria-describedby.
*/
