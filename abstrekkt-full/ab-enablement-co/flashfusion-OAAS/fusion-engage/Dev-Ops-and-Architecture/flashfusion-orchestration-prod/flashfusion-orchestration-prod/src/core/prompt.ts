/**
 * Prompt generation with XSS prevention
 * Fixes: 2 XSS test failures
 */
import { escapeXSS, validateInputLength } from '../security/utils.js';
import { getPromptTemplate } from './data.js';
import { PromptTemplateSchema } from '../types/index.js';

export interface PromptGenerationOptions {
  templateId: string;
  variables: Record<string, string>;
  escapeXSS?: boolean; // Default true
  maxLength?: number; // Default 10000
}

/**
 * Generates a prompt from template with XSS prevention
 */
export function generatePrompt(options: PromptGenerationOptions): string {
  const {
    templateId,
    variables,
    escapeXSS: shouldEscape = true,
    maxLength = 10000,
  } = options;

  // Get template
  const template = getPromptTemplate(templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Validate all variables are provided
  const missingVars = template.variables.filter((v) => !(v in variables));
  if (missingVars.length > 0) {
    throw new Error(`Missing variables: ${missingVars.join(', ')}`);
  }

  // Validate input lengths
  for (const [key, value] of Object.entries(variables)) {
    validateInputLength(value, maxLength);
  }

  // Replace variables with escaped values
  let result = template.template;
  for (const [key, value] of Object.entries(variables)) {
    const escapedValue = shouldEscape ? escapeXSS(value) : value;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), escapedValue);
  }

  return result;
}

/**
 * Batch generates multiple prompts
 */
export function batchGeneratePrompts(
  requests: PromptGenerationOptions[]
): string[] {
  return requests.map((req) => generatePrompt(req));
}

/**
 * Validates a prompt template structure
 */
export function validatePromptTemplate(
  template: unknown
): { valid: boolean; errors: string[] } {
  try {
    PromptTemplateSchema.parse(template);
    return { valid: true, errors: [] };
  } catch (error: any) {
    return {
      valid: false,
      errors: error.errors?.map((e: any) => e.message) || [error.message],
    };
  }
}
