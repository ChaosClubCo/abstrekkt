/**
 * A backend executes an agent's actual reasoning. The A2A layer is transport +
 * orchestration; the backend is the "brain". Swapping backends (mock / claude /
 * managed) never changes the wire protocol, so this seam is the single point of
 * integration with whatever runtime actually runs the agent.
 */
import type { AgentDef } from "../types.js";

export interface BackendInvocation {
  def: AgentDef;
  /** The user text extracted from the inbound A2A message. */
  input: string;
  contextId: string;
  taskId: string;
  /** Aborted when the A2A task is cancelled or the delegation budget expires. */
  signal: AbortSignal;
  /** Optional streaming sink for incremental output text. */
  onDelta?: (textDelta: string) => void;
}

export interface BackendResult {
  /** Final assembled output text. */
  text: string;
  /** Backend-specific diagnostic metadata (model used, run id, etc.). */
  meta?: Record<string, unknown>;
}

export interface AgentBackend {
  /** Stable identifier: "mock" | "claude" | "managed". */
  readonly kind: string;
  run(inv: BackendInvocation): Promise<BackendResult>;
}

/** Thrown by backends for unrecoverable execution failures. */
export class BackendError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "BackendError";
  }
}

/** Guard: reject if the invocation was already aborted. */
export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new BackendError("Execution aborted before completion.");
  }
}
