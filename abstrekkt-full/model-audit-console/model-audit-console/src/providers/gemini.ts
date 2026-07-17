import { GoogleGenAI } from "@google/genai";
import { ProviderResult, Finding } from "../types.js";
import { buildAuditPrompt } from "../auditPrompt.js";
import { safeParseJSON } from "../utils.js";

export async function auditWithGemini(code: string, filename: string): Promise<ProviderResult> {
  if (!process.env.GEMINI_API_KEY) {
    return { model: "gemini", findings: [], error: "GEMINI_API_KEY not set" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_AUDIT_MODEL ?? "gemini-2.5-pro",
      contents: buildAuditPrompt(code, filename),
    });

    const text = response.text;
    if (!text) {
      return { model: "gemini", findings: [], error: "Empty response text from Gemini" };
    }

    const findings = safeParseJSON<Omit<Finding, "model">[]>(text);
    return { model: "gemini", findings: findings.map((f) => ({ ...f, model: "gemini" })) };
  } catch (err) {
    return { model: "gemini", findings: [], error: err instanceof Error ? err.message : String(err) };
  }
}
