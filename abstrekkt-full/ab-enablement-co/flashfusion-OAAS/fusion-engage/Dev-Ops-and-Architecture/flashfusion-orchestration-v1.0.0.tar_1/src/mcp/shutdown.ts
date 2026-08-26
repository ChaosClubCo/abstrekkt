/**
 * @module mcp/shutdown
 * @description Graceful shutdown handling for MCP server
 * @compliance Production reliability and clean resource cleanup
 */

import { logger } from '../utils/logger.js';

/**
 * Shutdown state tracking.
 */
let isShuttingDown = false;
let shutdownPromise: Promise<void> | null = null;

/**
 * Registered cleanup handlers.
 */
const cleanupHandlers: Array<() => Promise<void>> = [];

/**
 * Maximum time to wait for graceful shutdown (ms).
 */
const SHUTDOWN_TIMEOUT = 10000;

/**
 * Registers a cleanup handler to be called during shutdown.
 * 
 * @param handler - Async function to execute during cleanup
 */
export function registerCleanupHandler(handler: () => Promise<void>): void {
  cleanupHandlers.push(handler);
}

/**
 * Checks if shutdown is in progress.
 */
export function isShutdownInProgress(): boolean {
  return isShuttingDown;
}

/**
 * Executes all cleanup handlers with timeout.
 * @internal Exported for testing
 */
export async function executeCleanup(): Promise<void> {
  logger.info('Executing cleanup handlers', { count: cleanupHandlers.length });
  
  const cleanupPromises = cleanupHandlers.map(async (handler, index) => {
    try {
      await handler();
      logger.debug('Cleanup handler completed', { index });
    } catch (error) {
      logger.error('Cleanup handler failed', { index }, error as Error);
    }
  });
  
  await Promise.all(cleanupPromises);
}

/**
 * Initiates graceful shutdown.
 * 
 * @param signal - The signal that triggered shutdown
 */
async function initiateShutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress', { signal });
    return shutdownPromise ?? Promise.resolve();
  }
  
  isShuttingDown = true;
  logger.info('Graceful shutdown initiated', { signal });
  
  shutdownPromise = new Promise<void>(async (resolve) => {
    const timeoutId = setTimeout(() => {
      logger.error('Shutdown timeout exceeded, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);
    
    try {
      // Execute cleanup handlers
      await executeCleanup();
      
      clearTimeout(timeoutId);
      logger.info('Graceful shutdown completed');
      resolve();
      
      // Give time for final log flush
      setTimeout(() => {
        process.exit(0);
      }, 100);
    } catch (error) {
      clearTimeout(timeoutId);
      logger.error('Shutdown error', {}, error as Error);
      process.exit(1);
    }
  });
  
  return shutdownPromise;
}

/**
 * Sets up signal handlers for graceful shutdown.
 * 
 * @param server - Optional server instance to close
 */
export function setupGracefulShutdown(server?: { close: () => void }): void {
  // Register server cleanup if provided
  if (server) {
    registerCleanupHandler(async () => {
      logger.info('Closing server');
      server.close();
    });
  }
  
  // SIGTERM - Kubernetes/Docker graceful shutdown
  process.on('SIGTERM', () => {
    void initiateShutdown('SIGTERM');
  });
  
  // SIGINT - Ctrl+C
  process.on('SIGINT', () => {
    void initiateShutdown('SIGINT');
  });
  
  // Uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {}, error);
    void initiateShutdown('uncaughtException');
  });
  
  // Unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logger.error('Unhandled rejection', {}, error);
    void initiateShutdown('unhandledRejection');
  });
  
  logger.info('Graceful shutdown handlers registered');
}

/**
 * Triggers a manual shutdown (for testing or programmatic control).
 */
export async function triggerShutdown(): Promise<void> {
  await initiateShutdown('manual');
}
