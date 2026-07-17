import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "flashfusion_interactive_prompt_generator_v3";

function Icon({ name, className = "h-4 w-4" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    wand: (
      <svg {...common}><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9H6" /><path d="M20 9h-2" /><path d="M17.8 6.2 19 5" /><path d="M6.2 17.8 5 19" /><path d="M17.8 11.8 19 13" /><path d="m3 21 9-9" /><path d="M12 12 8 8" /></svg>
    ),
    copy: (
      <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    download: (
      <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
    ),
    reset: (
      <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v6h6" /></svg>
    ),
    shuffle: (
      <svg {...common}><path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></svg>
    ),
    sparkles: (
      <svg {...common}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" /><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /><path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" /></svg>
    ),
    save: (
      <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>
    ),
    check: (
      <svg {...common}><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></svg>
    ),
    warning: (
      <svg {...common}><path d="m21.7 18-9-15a2 2 0 0 0-3.4 0l-9 15A2 2 0 0 0 2 21h18a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    ),
    sliders: (
      <svg {...common}><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M2 14h4" /><path d="M10 8h4" /><path d="M18 16h4" /></svg>
    ),
    brain: (
      <svg {...common}><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.2A3.5 3.5 0 0 0 7.5 18H9" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.2A3.5 3.5 0 0 1 16.5 18H15" /><path d="M9 3v18" /><path d="M15 3v18" /><path d="M9 9H7" /><path d="M15 9h2" /></svg>
    ),
    code: (
      <svg {...common}><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /><path d="m14 4-4 16" /></svg>
    ),
    briefcase: (
      <svg {...common}><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect x="2" y="6" width="20" height="14" rx="2" /></svg>
    ),
    palette: (
      <svg {...common}><path d="M12 22a10 10 0 1 1 10-10c0 2-1.5 3-3 3h-2.2a2 2 0 0 0-1.8 2.9l.2.3A2 2 0 0 1 13.4 22H12Z" /><circle cx="7.5" cy="10.5" r=".7" /><circle cx="12" cy="7.5" r=".7" /><circle cx="16.5" cy="10.5" r=".7" /></svg>
    ),
    search: (
      <svg {...common}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    bot: (
      <svg {...common}><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M12 8V4" /><path d="M8 4h8" /><path d="M9 14h.01" /><path d="M15 14h.01" /><path d="M9 18h6" /></svg>
    ),
    zap: (
      <svg {...common}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>
    ),
    edit: (
      <svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
    ),
    score: (
      <svg {...common}><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
    lock: (
      <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    ),
    rocket: (
      <svg {...common}><path d="M4.5 16.5c-1.5 1.3-2 4-2 4s2.7-.5 4-2c.7-.8.7-2 0-2.7-.7-.7-1.9-.7-2.7 0Z" /><path d="M9 15 15 9" /><path d="M15 9h4l2-7-7 2v4" /><path d="M9 15H5l-2 7 7-2v-4" /></svg>
    ),
  };

  return icons[name] ?? icons.wand;
}

const promptModes = [
  { id: "basic", label: "Basic", icon: "wand", description: "Clear, short, practical prompt." },
  { id: "advanced", label: "Advanced", icon: "sliders", description: "More structure, validation, and constraints." },
  { id: "technical", label: "Technical", icon: "brain", description: "Architecture, implementation, edge cases." },
  { id: "creative", label: "Creative", icon: "palette", description: "Concept, style, tone, visual direction." },
  { id: "research", label: "Research", icon: "search", description: "Evidence, citations, source hierarchy." },
  { id: "coding", label: "Coding", icon: "code", description: "Typed, production-ready engineering output." },
  { id: "business", label: "Business", icon: "briefcase", description: "Strategy, positioning, execution plan." },
  { id: "agentic", label: "Agentic", icon: "bot", description: "Multi-step AI agent workflow prompt." },
];

const platforms = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Lovable",
  "Base44",
  "Cursor",
  "Google Antigravity",
  "AI Studio",
  "Stitch",
  "GitHub Copilot",
  "Claude-Code",
  "Codex",
];

const toneOptions = ["Concise", "Friendly", "Direct", "Professional", "Playful", "Staff-level", "Instructional"];
const lengthOptions = ["Strict under 300 words", "Under 300 words", "500-800 words", "Detailed", "Exhaustive"];
const outputFormats = ["Markdown", "Numbered plan", "Table", "JSON", "Checklist", "Code-first", "Prompt block"];

const quickStarts = [
  { label: "Build an app", topic: "Build a production-ready AI-assisted onboarding wizard", mode: "coding", platforms: ["Lovable", "Base44", "Claude-Code"] },
  { label: "Write content", topic: "Create a personalized post from a lesson I learned", mode: "creative", platforms: ["ChatGPT", "Claude"] },
  { label: "Research", topic: "Generate a research brief with citations and source hierarchy", mode: "research", platforms: ["ChatGPT", "Gemini"] },
  { label: "Debug code", topic: "Refactor and debug a messy React app without rewriting unchanged files", mode: "coding", platforms: ["Cursor", "Claude-Code", "Codex"] },
  { label: "Create image prompt", topic: "Create a polished image-generation prompt for a playful creator-tool hero visual", mode: "creative", platforms: ["ChatGPT", "Gemini"] },
  { label: "Agent workflow", topic: "Design an agentic workflow for project cleanup, documentation, and smoke checks", mode: "agentic", platforms: ["Google Antigravity", "Claude-Code", "ChatGPT"] },
];

const randomTopics = [
  "AI-assisted onboarding wizard",
  "Refactor and debug a messy React app",
  "Create a product launch plan",
  "Generate a research brief with citations",
  "Design a playful mobile game character system",
  "Build a secure Supabase backend",
  "Create a Lovable app prompt",
  "Write a Claude-Code execution plan",
  "Make a FlashFusion-style landing page",
  "Create an agent workflow for project cleanup",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function safeJoin(items, fallback = "none") {
  return Array.isArray(items) && items.length ? items.join(", ") : fallback;
}

function safeLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const testKey = "__ff_prompt_forge_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

function inferRole(topic, mode) {
  const text = String(topic || "").toLowerCase();
  if (!text.trim()) return "You are a helpful, detail-oriented assistant skilled at clarifying vague requests and asking targeted follow-up questions.";
  if (mode === "coding" || text.includes("code") || text.includes("app") || text.includes("debug")) return "You are a senior full-stack software engineer and prompt architect.";
  if (mode === "research" || text.includes("research") || text.includes("market")) return "You are an expert research analyst skilled at evidence-based synthesis.";
  if (mode === "creative" || text.includes("image") || text.includes("design") || text.includes("character")) return "You are a creative director and production prompt designer.";
  if (mode === "business" || text.includes("strategy") || text.includes("launch")) return "You are a business strategist and execution-focused product advisor.";
  if (mode === "agentic") return "You are an expert AI agent architect who designs reliable multi-step workflows.";
  if (mode === "technical") return "You are a staff-level technical architect who turns ambiguous requirements into executable systems.";
  return "You are an expert prompt assistant who creates clear, actionable prompts for capable AI systems.";
}

function platformGuidance(selectedPlatforms) {
  const list = Array.isArray(selectedPlatforms) ? selectedPlatforms : [];
  const guidance = [];
  if (list.includes("ChatGPT")) guidance.push("For ChatGPT, make the prompt conversational, self-contained, and explicit about output structure.");
  if (list.includes("Claude")) guidance.push("For Claude, emphasize reasoning boundaries, artifact quality, examples, and careful instruction hierarchy.");
  if (list.includes("Gemini")) guidance.push("For Gemini, specify multimodal context, grounding requirements, and concise structured outputs.");
  if (list.includes("Lovable")) guidance.push("For Lovable, describe UI, data model, interactions, Supabase assumptions, and acceptance criteria.");
  if (list.includes("Base44")) guidance.push("For Base44, focus on app behavior, screens, user flows, database entities, and no-code implementation clarity.");
  if (list.includes("Cursor")) guidance.push("For Cursor, include repo-aware steps, file targets, tests, and safe incremental edits.");
  if (list.includes("Google Antigravity")) guidance.push("For Google Antigravity, include mission-oriented instructions, artifacts, browser/editor validation, and agent checkpoints.");
  if (list.includes("AI Studio")) guidance.push("For AI Studio, include model behavior, input/output schemas, safety constraints, and eval cases.");
  if (list.includes("Stitch")) guidance.push("For Stitch, prioritize interface structure, app screens, visual hierarchy, and implementation-ready UX details.");
  if (list.includes("GitHub Copilot")) guidance.push("For GitHub Copilot, include precise coding intent, file scope, comments, and test expectations.");
  if (list.includes("Claude-Code")) guidance.push("For Claude-Code, include terminal-safe steps, checkpoints, rollback, changed-files-only behavior, and smoke checks.");
  if (list.includes("Codex")) guidance.push("For Codex, include exact implementation task, repo assumptions, tests, and failure handling.");
  return guidance;
}

function outputFormatInstructions(outputFormat) {
  const map = {
    Markdown: "Use Markdown headings, concise paragraphs, and numbered steps.",
    "Numbered plan": "Use a numbered execution plan with clear step names, inputs, outputs, and validation checks.",
    Table: "Use a compact table for requirements, decisions, constraints, and acceptance checks, followed by only essential notes.",
    JSON: "Return a valid JSON object with keys: role, objective, inputs, output_requirements, process, constraints, example, final_instruction.",
    Checklist: "Use checklist bullets with completion criteria for each major instruction.",
    "Code-first": "Prioritize implementation instructions, file targets, typed code expectations, tests, smoke checks, and rollback behavior.",
    "Prompt block": "Return the final prompt inside a single fenced code block and avoid surrounding explanation unless needed.",
  };
  return map[outputFormat] ?? map.Markdown;
}

function lengthInstruction(length) {
  const map = {
    "Strict under 300 words": "Keep the produced prompt under 300 words. Remove nonessential examples, trim repetition, and prefer compact wording.",
    "Under 300 words": "Aim for a concise prompt under 300 words unless critical requirements require slightly more detail.",
    "500-800 words": "Produce a medium-detail prompt between 500 and 800 words.",
    Detailed: "Produce a detailed prompt with enough specificity to execute without guesswork.",
    Exhaustive: "Produce a comprehensive prompt with edge cases, validation, acceptance criteria, and troubleshooting guidance.",
  };
  return map[length] ?? map["Under 300 words"];
}

function scorePromptInputs({ topic, mode, selectedPlatforms, outputFormat, includeValidation, includeQuestions, includeCitations, extraContext }) {
  const components = [
    { key: "role", label: "Role clarity", value: mode ? 14 : 7 },
    { key: "objective", label: "Objective clarity", value: String(topic || "").trim() ? 18 : 8 },
    { key: "inputs", label: "Input specificity", value: String(extraContext || "").trim() || String(topic || "").length > 20 ? 14 : 8 },
    { key: "format", label: "Output format", value: outputFormat ? 14 : 8 },
    { key: "constraints", label: "Constraints", value: includeValidation ? 14 : 8 },
    { key: "ambiguity", label: "Ambiguity handling", value: includeQuestions ? 12 : 6 },
    { key: "platform", label: "Platform fit", value: Array.isArray(selectedPlatforms) && selectedPlatforms.length ? 14 : 8 },
  ];

  let score = components.reduce((total, item) => total + item.value, 0);
  if (mode === "research" && includeCitations) score += 4;
  if (mode === "research" && !includeCitations) score -= 6;
  if (!String(topic || "").trim()) score -= 8;
  score = Math.max(0, Math.min(100, score));

  const recommendations = [];
  if (!String(topic || "").trim()) recommendations.push("Add a topic or use a quick-start chip to reduce ambiguity.");
  if (!String(extraContext || "").trim()) recommendations.push("Add audience, stack, constraints, or example style in Extra context.");
  if (!Array.isArray(selectedPlatforms) || !selectedPlatforms.length) recommendations.push("Select at least one target platform for better optimization.");
  if (mode === "research" && !includeCitations) recommendations.push("Enable Citation rule for research prompts.");
  if (!includeValidation) recommendations.push("Enable Validation checks for more reliable outputs.");

  return { score, components, recommendations };
}

function buildPromptModel(options) {
  const {
    topic,
    mode,
    selectedPlatforms,
    tone,
    length,
    outputFormat,
    includeExamples,
    includeCitations,
    includeValidation,
    includeQuestions,
    extraContext,
  } = options;

  const cleanedTopic = String(topic || "").trim();
  const safeMode = promptModes.some((item) => item.id === mode) ? mode : "basic";
  const role = inferRole(cleanedTopic, safeMode);
  const selectedMode = promptModes.find((item) => item.id === safeMode)?.label ?? "Basic";
  const topicLine = cleanedTopic || "an empty or vague user request";
  const platformsLine = safeJoin(selectedPlatforms, "any capable AI system");
  const guidance = platformGuidance(selectedPlatforms);
  const extra = String(extraContext || "").trim();
  const score = scorePromptInputs(options);

  const warnings = [];
  if (!cleanedTopic) warnings.push("Input is empty: generated prompt will ask clarifying questions first.");
  if (!Array.isArray(selectedPlatforms) || !selectedPlatforms.length) warnings.push("No platform selected: prompt will target any capable AI system.");
  if (safeMode === "research" && !includeCitations) warnings.push("Research mode usually benefits from citations.");
  if (safeMode === "coding" && !includeValidation) warnings.push("Coding mode should keep validation enabled.");

  const emptyInputBehavior = !cleanedTopic
    ? "Because the original input is empty, first ask the user what task they want help with, then offer two practical defaults they can choose from."
    : "If the topic is underspecified, state reasonable assumptions before proceeding and ask for only critical missing details.";

  const processStepSeven = includeValidation
    ? "7. Validate the final output for completeness, internal consistency, safety, and missing assumptions."
    : "7. Keep the final output focused and avoid unnecessary expansion.";

  const platformBlock = guidance.length ? `\n# Platform Optimization\n${guidance.map((item) => `- ${item}`).join("\n")}\n` : "";
  const extraBlock = extra ? `\n\n# Extra Context\n${extra}` : "";
  const citationRule = includeCitations
    ? "Require citations for factual, current, legal, medical, financial, or technical claims."
    : "Do not require citations unless the user asks for research or current facts.";

  const prompt = `# Role\n${role}\n\n# Objective\nCreate a clear, actionable ${selectedMode.toLowerCase()} prompt for: ${topicLine}. Optimize it for ${platformsLine}.\n\n# User Inputs\nThe user may provide a topic, task name, vague instruction, target platform, constraints, examples, files, or desired output style. ${emptyInputBehavior}\n\n# Output Requirements\n${outputFormatInstructions(outputFormat)} Tone: ${tone}. ${lengthInstruction(length)} Include ${includeExamples ? "one concise example" : "no examples unless necessary"}. ${citationRule}\n\n# Process\n1. Identify the user’s true task and intended audience.\n2. Assign the AI a precise role matched to the task.\n3. Define the primary objective in one sentence.\n4. Specify required inputs and the exact output format.\n5. Add step-by-step instructions for producing the result.\n6. Handle ambiguity by asking targeted clarifying questions or stating safe defaults.\n${processStepSeven}\n${platformBlock}\n# Constraints\nDo not hallucinate facts, invent user preferences, or fabricate sources. Avoid unsafe, sensitive, or disallowed content. Keep the interaction concise, friendly, and iterative.\n\n# Final Instruction\n${includeQuestions ? "End with one clear follow-up question if critical detail is missing; otherwise present the final prompt." : "Present the final prompt directly once enough information is available."}${extraBlock}`;

  return {
    prompt,
    metadata: {
      mode: selectedMode,
      safeMode,
      role,
      targetPlatforms: Array.isArray(selectedPlatforms) && selectedPlatforms.length ? selectedPlatforms : ["Any capable AI system"],
      outputFormat,
      length,
      promptChars: prompt.length,
    },
    warnings,
    score,
  };
}

function improvePromptText(text) {
  if (!String(text || "").trim()) return text;
  return `${text.trim()}\n\n# Quality Lock\nBefore answering, verify that the response is specific, internally consistent, safe, non-hallucinated, and directly usable. If a critical requirement is missing, ask one targeted follow-up question instead of guessing.`;
}

function simplifyPromptText(text) {
  return String(text || "")
    .replace(/\n# Platform Optimization[\s\S]*?\n# Constraints/, "\n# Constraints")
    .replace(/\n# Extra Context[\s\S]*$/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function runSmokeTests() {
  const baseOptions = {
    topic: "",
    mode: "basic",
    selectedPlatforms: [],
    tone: "Friendly",
    length: "Strict under 300 words",
    outputFormat: "Markdown",
    includeExamples: true,
    includeCitations: false,
    includeValidation: true,
    includeQuestions: true,
    extraContext: "",
  };

  const cases = [
    {
      name: "Empty input asks for clarification",
      pass: buildPromptModel(baseOptions).prompt.includes("Because the original input is empty"),
    },
    {
      name: "Coding mode selects software role",
      pass: buildPromptModel({ ...baseOptions, topic: "debug my React app", mode: "coding", selectedPlatforms: ["Cursor"] }).prompt.includes("senior full-stack software engineer"),
    },
    {
      name: "Platform optimization appears for Claude-Code",
      pass: buildPromptModel({ ...baseOptions, topic: "create deploy plan", mode: "technical", selectedPlatforms: ["Claude-Code"], outputFormat: "Checklist" }).prompt.includes("checkpoint"),
    },
    {
      name: "Extra context is preserved",
      pass: buildPromptModel({ ...baseOptions, topic: "landing page", mode: "creative", selectedPlatforms: ["Lovable"], extraContext: "Use FlashFusion neon style." }).prompt.includes("Use FlashFusion neon style."),
    },
    {
      name: "Invalid mode falls back safely",
      pass: buildPromptModel({ ...baseOptions, topic: "make a thing", mode: "not-a-mode" }).metadata.safeMode === "basic",
    },
    {
      name: "Research citation warning appears",
      pass: buildPromptModel({ ...baseOptions, topic: "research AI tools", mode: "research", includeCitations: false }).warnings.includes("Research mode usually benefits from citations."),
    },
    {
      name: "JSON format instruction appears",
      pass: buildPromptModel({ ...baseOptions, topic: "make schema", outputFormat: "JSON" }).prompt.includes("valid JSON object"),
    },
    {
      name: "Quality score is bounded",
      pass: (() => {
        const score = buildPromptModel({ ...baseOptions, topic: "build app", selectedPlatforms: ["ChatGPT"] }).score.score;
        return score >= 0 && score <= 100;
      })(),
    },
  ];

  return cases;
}

function downloadText(filename, text) {
  if (typeof document === "undefined") return;
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function InteractivePromptGeneratorArtifact() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("basic");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["ChatGPT", "Claude"]);
  const [tone, setTone] = useState("Friendly");
  const [length, setLength] = useState("Strict under 300 words");
  const [outputFormat, setOutputFormat] = useState("Markdown");
  const [extraContext, setExtraContext] = useState("");
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(false);
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [previewMode, setPreviewMode] = useState("preview");
  const [manualPrompt, setManualPrompt] = useState("");
  const [manualDirty, setManualDirty] = useState(false);

  useEffect(() => {
    const storage = safeLocalStorage();
    setStorageAvailable(Boolean(storage));
    if (!storage) return;

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setTopic(parsed.topic ?? "");
      setMode(parsed.mode ?? "basic");
      setSelectedPlatforms(Array.isArray(parsed.selectedPlatforms) ? parsed.selectedPlatforms : ["ChatGPT", "Claude"]);
      setTone(parsed.tone ?? "Friendly");
      setLength(parsed.length ?? "Strict under 300 words");
      setOutputFormat(parsed.outputFormat ?? "Markdown");
      setExtraContext(parsed.extraContext ?? "");
      setIncludeExamples(Boolean(parsed.includeExamples ?? true));
      setIncludeCitations(Boolean(parsed.includeCitations ?? false));
      setIncludeValidation(Boolean(parsed.includeValidation ?? true));
      setIncludeQuestions(Boolean(parsed.includeQuestions ?? true));
      setManualPrompt(parsed.manualPrompt ?? "");
      setManualDirty(Boolean(parsed.manualDirty ?? false));
    } catch {
      storage.removeItem(STORAGE_KEY);
    }
  }, []);

  const promptModel = useMemo(
    () =>
      buildPromptModel({
        topic,
        mode,
        selectedPlatforms,
        tone,
        length,
        outputFormat,
        includeExamples,
        includeCitations,
        includeValidation,
        includeQuestions,
        extraContext,
      }),
    [topic, mode, selectedPlatforms, tone, length, outputFormat, includeExamples, includeCitations, includeValidation, includeQuestions, extraContext]
  );

  useEffect(() => {
    if (!manualDirty) setManualPrompt(promptModel.prompt);
  }, [promptModel.prompt, manualDirty]);

  const generatedPrompt = manualDirty ? manualPrompt : promptModel.prompt;
  const smokeTests = useMemo(() => runSmokeTests(), []);
  const passedSmokeTests = smokeTests.filter((test) => test.pass).length;

  const riskFlags = useMemo(() => {
    const flags = [...promptModel.warnings];
    if (!storageAvailable) flags.push("Local saving is unavailable in this browser context; export still works.");
    if (copyError) flags.push(copyError);
    return flags;
  }, [promptModel.warnings, storageAvailable, copyError]);

  const selectedMode = promptModes.find((item) => item.id === mode) ?? promptModes[0];

  function togglePlatform(platform) {
    setSelectedPlatforms((current) => (current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]));
    setManualDirty(false);
  }

  function applyQuickStart(item) {
    setTopic(item.topic);
    setMode(item.mode);
    setSelectedPlatforms(item.platforms);
    setIncludeCitations(item.mode === "research");
    setIncludeValidation(true);
    setIncludeQuestions(true);
    setManualDirty(false);
  }

  async function handleCopy() {
    setCopyError("");
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = generatedPrompt;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopyError("Copy failed in this browser context. Select the preview text manually or use Export.");
    }
  }

  function handleSave() {
    const storage = safeLocalStorage();
    setStorageAvailable(Boolean(storage));
    if (!storage) return;

    const payload = {
      topic,
      mode,
      selectedPlatforms,
      tone,
      length,
      outputFormat,
      extraContext,
      includeExamples,
      includeCitations,
      includeValidation,
      includeQuestions,
      manualPrompt,
      manualDirty,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function handleReset() {
    const storage = safeLocalStorage();
    setTopic("");
    setMode("basic");
    setSelectedPlatforms(["ChatGPT", "Claude"]);
    setTone("Friendly");
    setLength("Strict under 300 words");
    setOutputFormat("Markdown");
    setExtraContext("");
    setIncludeExamples(true);
    setIncludeCitations(false);
    setIncludeValidation(true);
    setIncludeQuestions(true);
    setCopyError("");
    setPreviewMode("preview");
    setManualPrompt("");
    setManualDirty(false);
    if (storage) storage.removeItem(STORAGE_KEY);
  }

  function handleRandomize() {
    const nextTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    const nextMode = promptModes[Math.floor(Math.random() * promptModes.length)].id;
    const shuffledPlatforms = [...platforms].sort(() => Math.random() - 0.5).slice(0, 3);
    const nextTone = toneOptions[Math.floor(Math.random() * toneOptions.length)];
    const nextFormat = outputFormats[Math.floor(Math.random() * outputFormats.length)];
    setTopic(nextTopic);
    setMode(nextMode);
    setSelectedPlatforms(shuffledPlatforms);
    setTone(nextTone);
    setOutputFormat(nextFormat);
    setIncludeCitations(nextMode === "research");
    setIncludeValidation(true);
    setCopyError("");
    setManualDirty(false);
  }

  function handleImprove() {
    setManualPrompt((current) => improvePromptText(current || promptModel.prompt));
    setManualDirty(true);
    setPreviewMode("edit");
  }

  function handleSimplify() {
    setManualPrompt((current) => simplifyPromptText(current || promptModel.prompt));
    setManualDirty(true);
    setPreviewMode("edit");
  }

  function handleRegenerate() {
    setManualPrompt(promptModel.prompt);
    setManualDirty(false);
    setPreviewMode("preview");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0A0614] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-[-10%] top-[-20%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-[-12%] top-[10%] h-[540px] w-[540px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] h-[560px] w-[560px] rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              <Icon name="sparkles" /> FlashFusion Prompt Forge v2
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Interactive Prompt Generator</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Define, optimize, edit, score, copy, and export prompts for ChatGPT, Claude, Gemini, Lovable, Base44, Cursor, Antigravity, Claude-Code, Codex, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRandomize} aria-label="Randomize prompt settings" className="rounded-2xl bg-fuchsia-500 px-4 font-bold text-white hover:bg-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200">
              <Icon name="shuffle" className="mr-2 h-4 w-4" /> Randomize
            </Button>
            <Button onClick={handleSave} aria-label="Save current prompt draft locally" className="rounded-2xl bg-cyan-400 px-4 font-bold text-slate-950 hover:bg-cyan-300 focus:ring-2 focus:ring-cyan-100">
              <Icon name="save" className="mr-2 h-4 w-4" /> {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-2 rounded-[2rem] border border-white/10 bg-black/25 p-3 text-sm text-white/80 sm:grid-cols-3">
          {["1. Define", "2. Optimize", "3. Export"].map((step, index) => (
            <div key={step} className={classNames("rounded-2xl px-4 py-3 font-bold", index === 0 ? "bg-cyan-300/15 text-cyan-50" : index === 1 ? "bg-fuchsia-300/10 text-fuchsia-50" : "bg-violet-300/10 text-violet-50")}>
              {step}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
            <Card className="rounded-[2rem] border-white/10 bg-white/[0.07] text-white shadow-2xl backdrop-blur-xl">
              <CardContent className="space-y-5 p-5">
                <div>
                  <label htmlFor="topic-input" className="mb-2 block text-sm font-bold text-white/95">Topic, task, or vague instruction</label>
                  <textarea id="topic-input" value={topic} onChange={(event) => { setTopic(event.target.value); setManualDirty(false); }} placeholder="Example: build an AI-assisted onboarding wizard, debug my React app, create a Base44 prompt..." className="min-h-[108px] w-full resize-y rounded-3xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none ring-0 placeholder:text-white/45 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20" />
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick start prompt templates">
                    {quickStarts.map((item) => (
                      <button key={item.label} onClick={() => applyQuickStart(item)} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/80 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/30">
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-bold text-white/95">Prompt mode</label>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white/80"><Icon name="zap" className="h-3 w-3" /> {selectedMode.label}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Prompt mode selector">
                    {promptModes.map((item) => {
                      const active = mode === item.id;
                      return (
                        <button key={item.id} aria-pressed={active} onClick={() => { setMode(item.id); setManualDirty(false); }} className={classNames("rounded-2xl border p-3 text-left transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-300/40", active ? "border-cyan-300 bg-cyan-300/15 shadow-lg shadow-cyan-500/10" : "border-white/10 bg-black/20 hover:border-white/25")}>
                          <Icon name={item.icon} className="mb-2 h-4 w-4 text-cyan-200" />
                          <div className="text-sm font-bold">{item.label}</div>
                          <div className="mt-1 line-clamp-2 text-xs text-white/70">{item.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/95">Optimization toggles</label>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Target platform toggles">
                    {platforms.map((platform) => {
                      const active = selectedPlatforms.includes(platform);
                      return (
                        <button key={platform} aria-pressed={active} onClick={() => togglePlatform(platform)} className={classNames("rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-fuchsia-300/30", active ? "border-fuchsia-300 bg-fuchsia-300/15 text-fuchsia-50" : "border-white/10 bg-black/20 text-white/75 hover:border-white/25")}>
                          {platform}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div><label htmlFor="tone-select" className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/70">Tone</label><select id="tone-select" value={tone} onChange={(event) => { setTone(event.target.value); setManualDirty(false); }} className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20">{toneOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
                  <div><label htmlFor="length-select" className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/70">Length</label><select id="length-select" value={length} onChange={(event) => { setLength(event.target.value); setManualDirty(false); }} className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20">{lengthOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
                  <div><label htmlFor="format-select" className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/70">Format</label><select id="format-select" value={outputFormat} onChange={(event) => { setOutputFormat(event.target.value); setManualDirty(false); }} className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20">{outputFormats.map((option) => <option key={option}>{option}</option>)}</select></div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    [includeExamples, setIncludeExamples, "Include example"],
                    [includeCitations, setIncludeCitations, "Citation rule"],
                    [includeValidation, setIncludeValidation, "Validation checks"],
                    [includeQuestions, setIncludeQuestions, "Follow-up question"],
                  ].map(([value, setter, label]) => (
                    <button key={label} aria-pressed={Boolean(value)} onClick={() => { setter(!value); setManualDirty(false); }} className={classNames("flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/30", value ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-50" : "border-white/10 bg-black/20 text-white/75")}>
                      {label}{value ? <Icon name="check" /> : <span className="h-4 w-4 rounded-full border border-white/30" />}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="extra-context" className="mb-2 block text-sm font-bold text-white/95">Extra context</label>
                  <textarea id="extra-context" value={extraContext} onChange={(event) => { setExtraContext(event.target.value); setManualDirty(false); }} placeholder="Optional: audience, stack, constraints, brand style, files, exclusions, examples..." className="min-h-[90px] w-full resize-y rounded-3xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/45 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20" />
                </div>

                <div className="flex gap-2 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
                  <Icon name="lock" className="mt-0.5 h-4 w-4 flex-none" />
                  <span>Privacy note: do not paste API keys, passwords, private credentials, or sensitive personal data. Saved drafts use local browser storage only.</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.12 }} className="space-y-4">
            <Card className="rounded-[2rem] border-white/10 bg-white/[0.08] text-white shadow-2xl backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black">Live Prompt Output</h2>
                    <p className="mt-1 text-sm text-white/75">Preview, edit, improve, simplify, copy, or export.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setPreviewMode(previewMode === "preview" ? "edit" : "preview")} aria-label="Toggle editable output mode" className="rounded-2xl border border-white/10 bg-black/30 px-4 font-bold text-white hover:bg-black/50 focus:ring-2 focus:ring-white/30"><Icon name="edit" className="mr-2 h-4 w-4" /> {previewMode === "preview" ? "Edit" : "Preview"}</Button>
                    <Button onClick={handleImprove} aria-label="Improve generated prompt" className="rounded-2xl bg-emerald-400 px-4 font-bold text-slate-950 hover:bg-emerald-300 focus:ring-2 focus:ring-emerald-100"><Icon name="rocket" className="mr-2 h-4 w-4" /> Improve</Button>
                    <Button onClick={handleSimplify} aria-label="Simplify generated prompt" className="rounded-2xl bg-white/10 px-4 font-bold text-white hover:bg-white/15 focus:ring-2 focus:ring-white/30">Simplify</Button>
                  </div>
                </div>

                {riskFlags.length > 0 && (
                  <div className="mb-4 space-y-2 rounded-3xl border border-amber-300/25 bg-amber-300/10 p-4" role="status" aria-live="polite">
                    {riskFlags.map((flag) => (<div key={flag} className="flex gap-2 text-sm text-amber-50"><Icon name="warning" className="mt-0.5 h-4 w-4 flex-none" /><span>{flag}</span></div>))}
                  </div>
                )}

                {previewMode === "edit" ? (
                  <textarea aria-label="Editable generated prompt" value={manualPrompt} onChange={(event) => { setManualPrompt(event.target.value); setManualDirty(true); }} className="min-h-[540px] w-full resize-y rounded-3xl border border-white/10 bg-black/45 p-5 text-sm leading-6 text-cyan-50 outline-none shadow-inner focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/20" />
                ) : (
                  <pre aria-label="Generated prompt preview" className="max-h-[680px] overflow-auto whitespace-pre-wrap rounded-3xl border border-white/10 bg-black/45 p-5 text-sm leading-6 text-cyan-50 shadow-inner">{generatedPrompt}</pre>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={handleCopy} aria-label="Copy generated prompt" className="rounded-2xl bg-white px-4 font-bold text-slate-950 hover:bg-white/90 focus:ring-2 focus:ring-white/30"><Icon name="copy" className="mr-2 h-4 w-4" /> {copied ? "Copied" : "Copy"}</Button>
                  <Button onClick={() => downloadText("generated-prompt.md", generatedPrompt)} aria-label="Export generated prompt as Markdown" className="rounded-2xl bg-violet-500 px-4 font-bold text-white hover:bg-violet-400 focus:ring-2 focus:ring-violet-200"><Icon name="download" className="mr-2 h-4 w-4" /> Export</Button>
                  <Button onClick={handleRegenerate} aria-label="Regenerate from current settings" className="rounded-2xl bg-cyan-400 px-4 font-bold text-slate-950 hover:bg-cyan-300 focus:ring-2 focus:ring-cyan-100"><Icon name="wand" className="mr-2 h-4 w-4" /> Regenerate</Button>
                  <Button onClick={handleReset} aria-label="Reset prompt generator" className="rounded-2xl border border-white/10 bg-black/30 px-4 font-bold text-white hover:bg-black/50 focus:ring-2 focus:ring-white/30"><Icon name="reset" className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-4">
              <Card className="rounded-3xl border-white/10 bg-white/[0.06] text-white"><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-white/60">Quality</div><div className="mt-1 text-lg font-black">{promptModel.score.score}/100</div></CardContent></Card>
              <Card className="rounded-3xl border-white/10 bg-white/[0.06] text-white"><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-white/60">Mode</div><div className="mt-1 text-lg font-black">{promptModel.metadata.mode}</div></CardContent></Card>
              <Card className="rounded-3xl border-white/10 bg-white/[0.06] text-white"><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-white/60">Platforms</div><div className="mt-1 text-lg font-black">{selectedPlatforms.length || "Any"}</div></CardContent></Card>
              <Card className="rounded-3xl border-white/10 bg-white/[0.06] text-white"><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-white/60">Smoke Tests</div><div className="mt-1 text-lg font-black">{passedSmokeTests}/{smokeTests.length}</div></CardContent></Card>
            </div>

            <Card className="rounded-[2rem] border-white/10 bg-white/[0.06] text-white">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-white/95"><Icon name="score" className="h-4 w-4 text-cyan-200" /> Prompt Quality Score</div>
                <div className="space-y-3">
                  {promptModel.score.components.map((item) => (
                    <div key={item.key}>
                      <div className="mb-1 flex justify-between text-xs text-white/75"><span>{item.label}</span><span>{item.value}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, item.value * 6)}%` }} /></div>
                    </div>
                  ))}
                </div>
                {promptModel.score.recommendations.length > 0 && (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 text-xs font-black uppercase tracking-wide text-white/60">Recommended improvements</div>
                    <ul className="space-y-1 text-sm text-white/80">
                      {promptModel.score.recommendations.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/10 bg-white/[0.06] text-white">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-white/95"><Icon name="check" className="h-4 w-4 text-emerald-200" /> Built-in Smoke Checks</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {smokeTests.map((test) => (
                    <div key={test.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm"><span className="text-white/80">{test.name}</span><span className={test.pass ? "text-emerald-200" : "text-rose-200"}>{test.pass ? "PASS" : "FAIL"}</span></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
