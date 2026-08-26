import Anthropic from "@anthropic-ai/sdk";
import { ProviderResult, Finding } from "../types.js";
import { buildAuditPrompt } from "../auditPrompt.js";
import { safeParseJSON } from "../utils.js";

export async function auditWithClaude(code: string, filename: string): Promise<ProviderResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { model: "claude", findings: [], error: "ANTHROPIC_API_KEY not set" };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: process.env.CLAUDE_AUDIT_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildAuditPrompt(code, filename) }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { model: "claude", findings: [], error: "No text block in Claude response" };
    }

    const findings = safeParseJSON<Omit<Finding, "model">[]>(textBlock.text);
    return { model: "claude", findings: findings.map((f) => ({ ...f, model: "claude" })) };
  } catch (err) {
    return { model: "claude", findings: [], error: err instanceof Error ? err.message : String(err) };
  }
}
