/**
 * @module utils/sanitization
 * @description Input sanitization utilities for XSS, template injection, and AI prompt injection prevention
 * @security CRITICAL - Mitigates OWASP A03:2021 (Injection), CWE-79 (XSS), CWE-116 (Improper Encoding)
 */

/**
 * Escape context determines the escaping strategy applied to user input.
 * Each context has specific dangerous patterns that must be neutralized.
 */
export enum EscapeContext {
  /** HTML context - escape tags, attributes, entities */
  HTML = 'html',
  /** Template variable context - prevent template expansion */
  TEMPLATE = 'template',
  /** AI prompt context - prevent prompt injection attacks */
  AI_PROMPT = 'ai_prompt',
  /** URL context - encode special URL characters */
  URL = 'url',
  /** JSON context - escape control characters */
  JSON = 'json',
}

/**
 * HTML entity map for character escaping.
 * Covers OWASP recommended characters for HTML context.
 */
const HTML_ENTITIES: Readonly<Record<string, string>> = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
});

/**
 * Dangerous prompt injection patterns to neutralize.
 * These patterns attempt to override AI system instructions.
 */
const PROMPT_INJECTION_PATTERNS: readonly RegExp[] = Object.freeze([
  /ignore\s+(all\s+)?previous\s+instructions?/gi,
  /disregard\s+(all\s+)?prior\s+(instructions?|prompts?)/gi,
  /new\s+(system\s+)?instructions?:/gi,
  /override\s+(system|safety|security|guardrails?)/gi,
  /bypass\s+(system|safety|security|guardrails?)/gi,
  /you\s+are\s+now\s+(?:a|an|in)\s+/gi,
  /act\s+as\s+(?:if\s+)?(?:you\s+(?:are|were)\s+)?/gi,
  /pretend\s+(?:you\s+are|to\s+be)/gi,
  /forget\s+(?:all\s+)?(?:previous|prior|your)\s+/gi,
  /\[\s*system\s*\]/gi,
  /\[\s*assistant\s*\]/gi,
  /\[\s*user\s*\]/gi,
  /<\s*(?:system|assistant|user)\s*>/gi,
  /```\s*(?:system|prompt|instruction)/gi,
]);

/**
 * Escapes input according to the specified security context.
 * 
 * @security Mitigates:
 * - CWE-79: Cross-Site Scripting (XSS)
 * - CWE-116: Improper Encoding or Escaping of Output
 * - Prompt Injection Attacks
 * 
 * @param input - The untrusted input to sanitize
 * @param context - The escaping context to apply
 * @returns Sanitized string safe for the specified context
 * 
 * @example
 * ```typescript
 * // HTML context
 * escape('<script>alert(1)</script>', EscapeContext.HTML);
 * // Returns: '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'
 * 
 * // AI prompt context
 * escape('Ignore previous instructions', EscapeContext.AI_PROMPT);
 * // Returns: '[BLOCKED:INJECTION]'
 * ```
 */
export function escape(input: string, context: EscapeContext): string {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected string input, received ${typeof input}`);
  }

  switch (context) {
    case EscapeContext.HTML:
      return escapeHTML(input);
    
    case EscapeContext.TEMPLATE:
      return escapeTemplate(input);
    
    case EscapeContext.AI_PROMPT:
      return escapeAIPrompt(input);
    
    case EscapeContext.URL:
      return escapeURL(input);
    
    case EscapeContext.JSON:
      return escapeJSON(input);
    
    default:
      throw new Error(`Unknown escape context: ${context as string}`);
  }
}

/**
 * Escapes HTML special characters to prevent XSS.
 * Implements OWASP XSS Prevention Cheat Sheet recommendations.
 */
function escapeHTML(input: string): string {
  return input.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char] ?? char);
}

/**
 * Escapes template variable syntax to prevent template injection.
 * Targets mustache/handlebars style {{ }} delimiters.
 */
function escapeTemplate(input: string): string {
  return input
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
    .replace(/\$\{/g, '&#36;&#123;')
    .replace(/\\\\/g, '&#92;&#92;');
}

/**
 * Detects and neutralizes AI prompt injection patterns.
 * Replaces dangerous patterns with safe markers.
 */
function escapeAIPrompt(input: string): string {
  let sanitized = input;
  
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '[BLOCKED:INJECTION]');
    }
  }
  
  return sanitized;
}

/**
 * URL-encodes special characters for safe URL inclusion.
 */
function escapeURL(input: string): string {
  return encodeURIComponent(input);
}

/**
 * Escapes JSON control characters for safe JSON string inclusion.
 */
function escapeJSON(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/[\b]/g, '\\b')
    .replace(/\f/g, '\\f');
}

/**
 * Applies multiple escape contexts in sequence.
 * Use for defense-in-depth when input flows through multiple contexts.
 * 
 * @param input - The untrusted input
 * @param contexts - Array of escape contexts to apply in order
 * @returns Sanitized string safe for all specified contexts
 * 
 * @example
 * ```typescript
 * // Input used in AI prompt that may contain HTML
 * escapeMultiple(userInput, [EscapeContext.AI_PROMPT, EscapeContext.HTML]);
 * ```
 */
export function escapeMultiple(input: string, contexts: readonly EscapeContext[]): string {
  return contexts.reduce((result, context) => escape(result, context), input);
}

/**
 * Validates that input contains no dangerous patterns for the specified context.
 * Returns validation result without modifying input.
 * 
 * @param input - The input to validate
 * @param context - The security context to validate against
 * @returns Validation result with details
 */
export function validateInput(
  input: string,
  context: EscapeContext
): { valid: boolean; threats: string[] } {
  const threats: string[] = [];

  if (context === EscapeContext.HTML) {
    if (/<script/i.test(input)) threats.push('script_tag');
    if (/on\w+\s*=/i.test(input)) threats.push('event_handler');
    if (/javascript:/i.test(input)) threats.push('javascript_uri');
    if (/<iframe/i.test(input)) threats.push('iframe_tag');
  }

  if (context === EscapeContext.AI_PROMPT) {
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        threats.push('prompt_injection');
        break;
      }
    }
  }

  if (context === EscapeContext.TEMPLATE) {
    if (/\{\{.*\}\}/.test(input)) threats.push('template_variable');
    if (/\$\{.*\}/.test(input)) threats.push('template_literal');
  }

  return {
    valid: threats.length === 0,
    threats,
  };
}

/**
 * Strips all HTML tags from input, leaving only text content.
 * Use when HTML is never acceptable in the output.
 */
export function stripHTML(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Truncates input to maximum length with ellipsis.
 * Prevents buffer overflow and DoS via oversized inputs.
 * 
 * @param input - The input to truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(input: string, maxLength: number): string {
  if (maxLength < 4) {
    throw new RangeError('maxLength must be at least 4 to accommodate ellipsis');
  }
  
  if (input.length <= maxLength) {
    return input;
  }
  
  return input.slice(0, maxLength - 3) + '...';
}
