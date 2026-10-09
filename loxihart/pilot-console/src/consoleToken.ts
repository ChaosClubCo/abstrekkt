export const CONSOLE_TOKEN_STORAGE_KEY = 'loxihart.consoleToken';

/**
 * Read the operator console token from sessionStorage.
 * The token is never baked into the SPA bundle.
 */
export function readConsoleToken(): string {
  try {
    return sessionStorage.getItem(CONSOLE_TOKEN_STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

/**
 * Persist a console token for this browser tab only.
 */
export function writeConsoleToken(token: string): void {
  const value = token.trim();
  if (!value) {
    clearConsoleToken();
    return;
  }
  try {
    sessionStorage.setItem(CONSOLE_TOKEN_STORAGE_KEY, value);
  } catch {
    // sessionStorage can throw in privacy-restricted browsers
  }
}

/**
 * Drop a rejected or expired console token.
 */
export function clearConsoleToken(): void {
  try {
    sessionStorage.removeItem(CONSOLE_TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage access errors
  }
}
