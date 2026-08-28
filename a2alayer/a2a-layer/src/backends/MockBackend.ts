/**
 * Deterministic, network-free backend. Used by tests and local smoke runs
 * (A2A_BACKEND=mock). It echoes a structured acknowledgement so the full A2A
 * round-trip (card fetch -> message/send -> Task -> artifact) can be exercised
 * without any model credentials.
 */
import type { AgentBackend, BackendInvocation, BackendResult } from "./AgentBackend.js";
import { throwIfAborted } from "./AgentBackend.js";

export class MockBackend implements AgentBackend {
  readonly kind = "mock";

  async run(inv: BackendInvocation): Promise<BackendResult> {
    throwIfAborted(inv.signal);
    const { def, input } = inv;

    const chunks = [
      `[${def.name}] received request on lane ${def.lane}.`,
      ` Model would be ${def.model}.`,
      def.mcp.length
        ? ` Tools available: ${def.mcp.map((m) => m.name).join(", ")}.`
        : " No MCP tools bound.",
    ];

    let assembled = "";
    for (const c of chunks) {
      throwIfAborted(inv.signal);
      assembled += c;
      inv.onDelta?.(c);
    }

    const summary =
      `\n\nEcho of input (${input.length} chars): ` +
      (input.length > 240 ? `${input.slice(0, 237)}...` : input);
    assembled += summary;
    inv.onDelta?.(summary);

    return {
      text: assembled,
      meta: { backend: this.kind, model: def.model, lane: def.lane },
    };
  }
}
