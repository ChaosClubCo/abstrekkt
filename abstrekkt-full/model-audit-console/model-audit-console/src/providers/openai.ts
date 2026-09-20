import OpenAI from "openai";
import { ProviderResult, Finding } from "../types.js";
import { buildAuditPrompt } from "../auditPrompt.js";
import { safeParseJSON } from "../utils.js";

export async function auditWithGPT(code: string, filename: string): Promise<ProviderResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { model: "gpt", findings: [], error: "OPENAI_API_KEY not set" };
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.GPT_AUDIT_MODEL ?? "gpt-5.5",
      instructions: "You are a strict, production-focused code auditor. Output valid JSON only, no prose.",
      input: buildAuditPrompt(code, filename),
    });

    const findings = safeParseJSON<Omit<Finding, "model">[]>(response.output_text);
    return { model: "gpt", findings: findings.map((f) => ({ ...f, model: "gpt" })) };
  } catch (err) {
    return { model: "gpt", findings: [], error: err instanceof Error ? err.message : String(err) };
  }
}
