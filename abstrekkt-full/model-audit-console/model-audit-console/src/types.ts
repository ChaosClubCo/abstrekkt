export type Persona =
  | "security"
  | "architecture"
  | "qa"
  | "performance"
  | "devops"
  | "accessibility";

export type Severity = "P0" | "P1" | "P2";

export type ModelName = "claude" | "gpt" | "gemini";

export interface Finding {
  model: ModelName;
  persona: Persona;
  severity: Severity;
  location: string;
  description: string;
  fix: string;
}

export interface ProviderResult {
  model: ModelName;
  findings: Finding[];
  error?: string;
}
