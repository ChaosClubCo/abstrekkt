/**
 * Bridges a managed agent's backend execution onto the A2A task lifecycle.
 *
 * Event sequence published to the ExecutionEventBus:
 *   Task(submitted) -> status-update(working) -> [status-update(working, delta)]*
 *     -> artifact-update(final) -> status-update(completed, final)
 * On failure: status-update(failed, final). On cancel: status-update(canceled, final).
 */
import { randomUUID } from "node:crypto";
import type {
  AgentExecutor,
  ExecutionEventBus,
  RequestContext,
} from "@a2a-js/sdk/server";
import type {
  Artifact,
  Message,
  Part,
  Task,
  TaskArtifactUpdateEvent,
  TaskState,
  TaskStatusUpdateEvent,
} from "@a2a-js/sdk";
import type { AgentDef } from "../types.js";
import type { AgentBackend } from "../backends/AgentBackend.js";

function now(): string {
  return new Date().toISOString();
}

/** Concatenate the text parts of an inbound message. */
function extractText(message: Message): string {
  return message.parts
    .filter((p): p is Extract<Part, { kind: "text" }> => p.kind === "text")
    .map((p) => p.text)
    .join("\n")
    .trim();
}

export class ManagedAgentExecutor implements AgentExecutor {
  /** Active task cancellations keyed by taskId. */
  private readonly running = new Map<
    string,
    { controller: AbortController; contextId: string }
  >();

  constructor(
    private readonly def: AgentDef,
    private readonly backend: AgentBackend,
  ) {}

  async execute(ctx: RequestContext, bus: ExecutionEventBus): Promise<void> {
    const { taskId, contextId, userMessage } = ctx;

    const statusEvent = (
      state: TaskState,
      final: boolean,
      message?: Message,
    ): TaskStatusUpdateEvent => ({
      kind: "status-update",
      taskId,
      contextId,
      status: { state, timestamp: now(), ...(message ? { message } : {}) },
      final,
    });

    const agentMessage = (text: string): Message => ({
      kind: "message",
      role: "agent",
      messageId: randomUUID(),
      parts: [{ kind: "text", text }],
      taskId,
      contextId,
    });

    // 1. Seed the task if this is a fresh interaction.
    if (!ctx.task) {
      const initial: Task = {
        kind: "task",
        id: taskId,
        contextId,
        status: { state: "submitted", timestamp: now() },
        history: [userMessage],
      };
      bus.publish(initial);
    }

    // 2. Transition to working.
    bus.publish(statusEvent("working", false));

    const controller = new AbortController();
    this.running.set(taskId, { controller, contextId });

    try {
      const input = extractText(userMessage);
      if (!input) {
        bus.publish(
          statusEvent(
            "failed",
            true,
            agentMessage("No text input was provided in the request message."),
          ),
        );
        return;
      }

      const result = await this.backend.run({
        def: this.def,
        input,
        contextId,
        taskId,
        signal: controller.signal,
        onDelta: (delta) => {
          // Forward incremental output as non-final working updates.
          bus.publish(statusEvent("working", false, agentMessage(delta)));
        },
      });

      if (controller.signal.aborted) return; // cancelTask already emitted terminal event

      // 3. Emit the final artifact.
      const artifact: Artifact = {
        artifactId: randomUUID(),
        name: `${this.def.slug}-result`,
        parts: [{ kind: "text", text: result.text }],
        metadata: result.meta,
      };
      const artifactEvent: TaskArtifactUpdateEvent = {
        kind: "artifact-update",
        taskId,
        contextId,
        artifact,
        append: false,
        lastChunk: true,
      };
      bus.publish(artifactEvent);

      // 4. Complete.
      bus.publish(statusEvent("completed", true));
    } catch (err) {
      if (controller.signal.aborted) return;
      const msg = err instanceof Error ? err.message : String(err);
      bus.publish(
        statusEvent("failed", true, agentMessage(`Execution failed: ${msg}`)),
      );
    } finally {
      this.running.delete(taskId);
      bus.finished();
    }
  }

  async cancelTask(taskId: string, bus: ExecutionEventBus): Promise<void> {
    const entry = this.running.get(taskId);
    if (entry) entry.controller.abort();
    bus.publish({
      kind: "status-update",
      taskId,
      contextId: entry?.contextId ?? taskId,
      status: { state: "canceled", timestamp: now() },
      final: true,
    });
    bus.finished();
  }
}
