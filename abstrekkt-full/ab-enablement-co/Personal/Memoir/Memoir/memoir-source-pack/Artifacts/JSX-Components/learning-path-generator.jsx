import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  GraduationCap,
  Clock,
  Layers,
  X,
} from "lucide-react";

/**
 * SparkAcademy — Learning Path Generator
 * --------------------------------------
 * Assembles PUBLISHED SparkAcademy courses into a sequenced LearningPath and
 * emits a paste-ready Base44 record (entityName: "LearningPath").
 *
 * Integrity guard (mirrors the project's no-fabrication rule):
 *   - The model may ONLY select course IDs from the embedded catalog below.
 *   - Every returned course_id is validated against the catalog. Hallucinated
 *     IDs are rejected and reported, never silently included.
 *   - estimated_duration is RECOMPUTED from real course hours, not trusted
 *     from the model.
 *
 * Stack: React + Tailwind (core utilities only) + lucide-react.
 * Model: claude-sonnet-4-6 via the in-artifact Anthropic endpoint (no key needed).
 * No localStorage/sessionStorage. All state in-memory.
 *
 * Catalog snapshot: 35 published courses, pulled live 2026-06 from app
 * 69180d077a5cbed7242f90ab. Refresh the COURSES array when the catalog changes.
 */

const COURSES = [
  { id: "6a3381ef7a9d0b7d65f7dee2", t: "Getting Started with AI Prompting — Non-Technical Guide", tr: "business", lv: "beginner", h: 2, sk: ["prompt basics", "RCTF", "RISEN", "CO-STAR", "AI literacy"], d: "Plain-English first prompts, 5 frameworks, no coding." },
  { id: "69f445f234fd3e776eada5fd", t: "From Expert to Educator: Building a Premium Course Creator Business", tr: "business", lv: "advanced", h: 5, sk: ["course positioning", "curriculum architecture", "pricing", "organic marketing", "cohort design"], d: "For domain experts becoming premium course creators." },
  { id: "69f445f234fd3e776eada5fa", t: "AI Strategy for Senior Marketing Leaders", tr: "business", lv: "intermediate", h: 4.5, sk: ["AI marketing strategy", "generative content", "campaign analytics", "ROI"], d: "Strategic AI framework for senior marketers." },
  { id: "6a101804dde271a43b15fe8d", t: "AI for Customer Support", tr: "business", lv: "beginner", h: 1.5, sk: ["ticket drafting", "tone calibration", "escalation detection", "FAQ generation"], d: "Cut handle time with AI plus human review." },
  { id: "6a13d650158a12e74f8dbd68", t: "AI for Research and Competitive Analysis", tr: "business", lv: "intermediate", h: 0.5, sk: ["research prompting", "competitive analysis", "decision briefs"], d: "Pile of info to a decision brief in under an hour." },
  { id: "6a101804dde271a43b15fe8c", t: "AI for Sales Teams", tr: "business", lv: "beginner", h: 1.5, sk: ["prospect research", "personalized outreach", "call prep", "proposals"], d: "Research, outreach, and proposals faster." },
  { id: "6a13d650158a12e74f8dbd6a", t: "Measuring What AI Is Actually Doing for You", tr: "business", lv: "intermediate", h: 0.5, sk: ["ROI measurement", "time tracking", "adoption metrics"], d: "Tell whether AI is actually saving time." },
  { id: "6a13d650158a12e74f8dbd6b", t: "AI for Service Businesses", tr: "business", lv: "intermediate", h: 0.58, sk: ["deliverable generation", "scope documentation", "value preservation"], d: "Move faster without commoditizing expertise." },
  { id: "6a101804dde271a43b15fe8b", t: "AI for Managers and Leaders", tr: "business", lv: "intermediate", h: 2.5, sk: ["change management", "adoption metrics", "delegation"], d: "Lead a team using AI while managing risk." },
  { id: "6a101804dde271a43b15fe8a", t: "AI for Small Business Owners", tr: "business", lv: "beginner", h: 1.5, sk: ["customer emails", "marketing copy", "operations", "hiring"], d: "For solo operators and small-business managers." },
  { id: "6a13d650158a12e74f8dbd70", t: "Building AI Champions in Your Organization", tr: "business", lv: "advanced", h: 0.75, sk: ["champion programs", "internal advocacy", "adoption scaling"], d: "Identify, train, and support internal AI champions." },
  { id: "6a13d650158a12e74f8dbd6d", t: "AI-Powered Content Creation for Business", tr: "creative", lv: "beginner", h: 0.58, sk: ["content creation", "voice preservation", "brand consistency"], d: "Publish-ready drafts that sound like you." },
  { id: "6a101804dde271a43b15fe84", t: "AI Fundamentals for Everyone", tr: "foundational", lv: "beginner", h: 1.5, sk: ["AI literacy", "terminology", "safe use"], d: "Jargon-free intro for first-time users." },
  { id: "6a13d650158a12e74f8dbd6c", t: "AI for the Skeptical Manager", tr: "foundational", lv: "beginner", h: 0.33, sk: ["AI evaluation", "objection analysis", "adoption decisions"], d: "Honest framework for evaluating AI." },
  { id: "6a31ade5af5f2ee3272ad168", t: "Learning to Learn AI: Five Paradoxes for Faster Adoption", tr: "foundational", lv: "beginner", h: 1.5, sk: ["adult learning", "spaced repetition", "deliberate practice"], d: "Why retrieval beats review; build a learning system." },
  { id: "6a13d650158a12e74f8dbd67", t: "How Claude Actually Reads Your Instructions", tr: "foundational", lv: "beginner", h: 0.5, sk: ["prompt specificity", "instruction design"], d: "Write instructions the model can't misread." },
  { id: "6a101804dde271a43b15fe86", t: "Responsible AI Use", tr: "governance", lv: "beginner", h: 1, sk: ["AI ethics", "privacy", "hallucination awareness", "disclosure"], d: "Ethical guardrails; required for all learners." },
  { id: "6a101804dde271a43b15fe87", t: "AI Governance for Organizations", tr: "governance", lv: "intermediate", h: 3, sk: ["policy drafting", "NIST AI RMF", "shadow AI", "incident response"], d: "Governance framework for IT, compliance, legal, HR." },
  { id: "6a13d650158a12e74f8dbd6e", t: "Data Privacy and AI: What Your Business Needs to Know", tr: "governance", lv: "beginner", h: 0.5, sk: ["data privacy", "classification", "vendor policies"], d: "What is safe to put into AI tools, what is not." },
  { id: "6a101804dde271a43b15fe91", t: "Hallucination Testing and Verification", tr: "governance", lv: "intermediate", h: 1.5, sk: ["hallucination types", "verification", "grounding", "review gates"], d: "Systematically test AI outputs for errors." },
  { id: "6a101804dde271a43b15fe8f", t: "Shadow AI Detection and Response", tr: "governance", lv: "intermediate", h: 2, sk: ["shadow AI detection", "risk scoring", "disclosure", "amnesty"], d: "Manage unauthorized AI tool usage." },
  { id: "6a13d650158a12e74f8dbd69", t: "Custom Instructions and System Prompts", tr: "technical", lv: "intermediate", h: 0.67, sk: ["system prompts", "persistent context", "output controls"], d: "Persistent context so every session starts ahead." },
  { id: "6a3381ef7a9d0b7d65f7dee3", t: "Structured Prompting for Engineers — Technical Guide", tr: "technical", lv: "advanced", h: 4, sk: ["Claude API", "Claude Code", "MCP", "context windows", "ReAct"], d: "9 engineering frameworks plus integration patterns." },
  { id: "69f445f234fd3e776eada5fb", t: "AI-Native System Architecture for Senior Engineers", tr: "technical", lv: "advanced", h: 6, sk: ["LLM integration", "RAG", "agent orchestration", "observability"], d: "Production AI architecture for senior engineers." },
  { id: "6a101804dde271a43b15fe93", t: "AI for IT Admins and Security Owners", tr: "technical", lv: "intermediate", h: 3, sk: ["tool inventory", "vendor approval", "SSO", "incident response"], d: "Manage AI sprawl and enforce policy." },
  { id: "6a101804dde271a43b15fe92", t: "AI Workflow Automation", tr: "technical", lv: "intermediate", h: 2.5, sk: ["n8n", "Zapier/Make", "triggers", "error handling"], d: "No-code automation workflows, safety-first." },
  { id: "6a101804dde271a43b15fe90", t: "Prompt Injection Defense", tr: "technical", lv: "advanced", h: 2.5, sk: ["injection types", "defense patterns", "input validation"], d: "Defend against prompt injection attacks." },
  { id: "6a101804dde271a43b15fe88", t: "AI Security: Threats and Defenses", tr: "technical", lv: "advanced", h: 3.5, sk: ["prompt injection", "data leakage", "vendor security"], d: "Build an AI security program (defensive)." },
  { id: "6a101804dde271a43b15fe85", t: "Prompt Engineering Essentials", tr: "technical", lv: "beginner", h: 2, sk: ["prompt structure", "context", "chain-of-thought", "few-shot"], d: "Write clear prompts that get the output you need." },
  { id: "6a3381ef7a9d0b7d65f7dee1", t: "Top 15 Prompting Frameworks — Complete Library", tr: "technical", lv: "intermediate", h: 8, sk: ["15 frameworks", "templates", "enterprise wrappers", "150 prompts"], d: "Definitive 15-framework reference library." },
  { id: "6a101804dde271a43b15fe8e", t: "AI for HR and People Teams", tr: "workforce", lv: "intermediate", h: 2, sk: ["job descriptions", "hiring bias", "EEOC compliance", "onboarding"], d: "AI in HR with EEOC guidance and bias basics." },
  { id: "69f445f234fd3e776eada5fc", t: "AI Literacy Program Design: An L&D Leader's Playbook", tr: "workforce", lv: "intermediate", h: 4, sk: ["literacy curriculum", "competency frameworks", "ROI", "scaling"], d: "Design, pilot, and scale an AI literacy program." },
  { id: "6a31ade5af5f2ee3272ad167", t: "AI Workshop Facilitation: A Practitioner's Playbook", tr: "workforce", lv: "advanced", h: 4, sk: ["facilitation", "curriculum design", "tiered training"], d: "Three-tier system to run AI workshops." },
  { id: "6a101804dde271a43b15fe89", t: "AI for Everyday Work", tr: "workforce", lv: "beginner", h: 2, sk: ["email drafting", "meeting summaries", "research", "workflows"], d: "Practical AI for people with real jobs." },
  { id: "6a13d650158a12e74f8dbd6f", t: "AI for Project Management and Team Coordination", tr: "workforce", lv: "beginner", h: 0.5, sk: ["project briefs", "status reports", "action items"], d: "AI for PM without replacing your tools." },
];

const TRACKS = ["foundational", "business", "technical", "governance", "creative", "workforce"];
const LEVEL_RANK = { beginner: 1, intermediate: 2, advanced: 3, expert: 3 };
const RANK_LEVEL = { 1: "beginner", 2: "intermediate", 3: "advanced" };
const COURSE_BY_ID = Object.fromEntries(COURSES.map((c) => [c.id, c]));

function stripFences(text) {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function extractText(data) {
  if (!data || !Array.isArray(data.content)) return "";
  return data.content
    .filter((b) => b && b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export default function LearningPathGenerator() {
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState("any");
  const [maxCourses, setMaxCourses] = useState(4);
  const [persona, setPersona] = useState("");
  const [category, setCategory] = useState("");
  const [trackFilter, setTrackFilter] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState("kyle@flashfusion.co");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { path, rejected, rationale }
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => {
    return COURSES.filter((c) => {
      if (trackFilter.length && !trackFilter.includes(c.tr)) return false;
      return true;
    });
  }, [trackFilter]);

  function toggleTrack(tr) {
    setTrackFilter((prev) =>
      prev.includes(tr) ? prev.filter((x) => x !== tr) : [...prev, tr]
    );
  }

  function buildRecord(parsed) {
    // Validate IDs against the real catalog — reject anything not in it.
    const seen = new Set();
    const validIds = [];
    const rejected = [];
    for (const id of Array.isArray(parsed.course_ids) ? parsed.course_ids : []) {
      if (COURSE_BY_ID[id] && !seen.has(id)) {
        seen.add(id);
        validIds.push(id);
      } else if (!COURSE_BY_ID[id]) {
        rejected.push(id);
      }
    }
    if (!validIds.length) {
      throw new Error(
        "Model returned no valid course IDs from the catalog. Try a broader goal or fewer track filters."
      );
    }
    // Recompute duration + difficulty from REAL course data (never trust the model's numbers).
    const courses = validIds.map((id) => COURSE_BY_ID[id]);
    const estimated_duration =
      Math.round(courses.reduce((s, c) => s + (c.h || 0), 0) * 100) / 100;
    const maxRank = courses.reduce(
      (m, c) => Math.max(m, LEVEL_RANK[c.lv] || 1),
      1
    );
    const difficulty_level = RANK_LEVEL[maxRank];

    const record = {
      title: String(parsed.title || "Untitled Learning Path").slice(0, 120),
      description: String(parsed.description || "").trim(),
      course_ids: validIds,
      difficulty_level,
      estimated_duration,
      skills_gained: Array.isArray(parsed.skills_gained)
        ? parsed.skills_gained.slice(0, 8).map((s) => String(s))
        : [],
      persona_slug: persona.trim() || undefined,
      category: category.trim() || undefined,
      icon: parsed.icon || "🧭",
      is_published: false,
      creator_email: creatorEmail.trim() || undefined,
    };
    // Drop undefined keys for a clean paste.
    Object.keys(record).forEach((k) => record[k] === undefined && delete record[k]);
    return { record, rejected, courses };
  }

  async function generate() {
    setError("");
    setResult(null);
    setCopied(false);
    if (!goal.trim()) {
      setError("Describe the audience or goal first.");
      return;
    }
    if (!pool.length) {
      setError("No courses match the selected track filters. Clear a filter.");
      return;
    }
    setLoading(true);

    const catalogForModel = pool.map((c) => ({
      id: c.id,
      title: c.t,
      track: c.tr,
      level: c.lv,
      hours: c.h,
      skills: c.sk,
      blurb: c.d,
    }));

    const diffLine =
      difficulty === "any"
        ? "Difficulty: pick what best fits the goal."
        : `Target difficulty: ${difficulty}. Prefer courses at or near this level, sequenced low-to-high.`;

    const prompt = `You are a curriculum architect for an AI-enablement LMS. Build ONE learning path by selecting and ORDERING courses from the provided catalog.

GOAL / AUDIENCE: ${goal.trim()}
${diffLine}
Select between 3 and ${maxCourses} courses. Order them as a real learner should take them (foundational first, advanced last). A coherent shorter path beats a padded longer one.

HARD RULES:
- Use ONLY course IDs that appear in the catalog below. Never invent an ID.
- Do not repeat a course.
- Sequence matters: order course_ids in the intended learning order.

CATALOG (JSON):
${JSON.stringify(catalogForModel)}

Respond with ONLY a JSON object, no prose, no markdown fences, in exactly this shape:
{"title": string (<= 70 chars), "description": string (<= 55 words, concrete, no hype), "course_ids": [string, ...], "skills_gained": [string, string, string, string], "icon": single emoji, "rationale": string (<= 35 words on why this sequence)}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed (HTTP ${response.status}).`);
      }

      const data = await response.json();
      const raw = extractText(data);
      if (!raw) throw new Error("Empty response from the model.");

      let parsed;
      try {
        parsed = JSON.parse(stripFences(raw));
      } catch (e) {
        throw new Error("Could not parse the model's JSON. Try generating again.");
      }

      const { record, rejected, courses } = buildRecord(parsed);
      setResult({
        record,
        rejected,
        courses,
        rationale: String(parsed.rationale || "").trim(),
      });
    } catch (e) {
      setError(e && e.message ? e.message : "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyJSON() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.record, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard blocked by the browser. Select the JSON and copy manually.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
            <GraduationCap className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Learning Path Generator
            </h1>
            <p className="text-sm text-slate-400">
              SparkAcademy · grounded in {COURSES.length} published courses · outputs a paste-ready LearningPath record
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Inputs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Audience / goal
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder="e.g. New compliance officers who need to stand up an AI governance program from zero"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="any">Any / best fit</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Max courses: {maxCourses}
                </label>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={maxCourses}
                  onChange={(e) => setMaxCourses(Number(e.target.value))}
                  className="w-full mt-3 accent-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  persona_slug <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="e.g. compliance"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  category <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Governance"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Restrict to tracks <span className="text-slate-500">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TRACKS.map((tr) => {
                  const on = trackFilter.includes(tr);
                  return (
                    <button
                      key={tr}
                      onClick={() => toggleTrack(tr)}
                      className={
                        "px-2.5 py-1 rounded-full text-xs border transition-colors " +
                        (on
                          ? "bg-indigo-500/25 border-indigo-400/50 text-indigo-200"
                          : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500")
                      }
                    >
                      {tr}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {pool.length} course{pool.length === 1 ? "" : "s"} in the selection pool
              </p>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate path
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-sm text-rose-200">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10">
                <Layers className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">
                  Describe an audience and generate. The path appears here with a
                  Base44-ready record.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                <Loader2 className="w-7 h-7 mb-3 animate-spin text-indigo-400" />
                <p className="text-sm">Sequencing courses…</p>
              </div>
            )}

            {result && (
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold flex items-center gap-2">
                      <span>{result.record.icon}</span>
                      <span>{result.record.title}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {result.record.difficulty_level}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {result.record.estimated_duration}h
                      </span>
                      <span>{result.record.course_ids.length} courses</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mt-3">
                  {result.record.description}
                </p>

                {result.rationale && (
                  <p className="text-xs text-slate-500 italic mt-2">
                    {result.rationale}
                  </p>
                )}

                {/* Ordered courses */}
                <ol className="mt-4 space-y-2">
                  {result.courses.map((c, i) => (
                    <li
                      key={c.id}
                      className="flex items-start gap-3 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
                    >
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-slate-100 truncate">{c.t}</div>
                        <div className="text-xs text-slate-500">
                          {c.tr} · {c.lv} · {c.h}h
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Skills */}
                {result.record.skills_gained.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {result.record.skills_gained.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rejected IDs (integrity report) */}
                {result.rejected.length > 0 && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      Rejected {result.rejected.length} invalid ID(s) the model
                      returned that aren't in the catalog:{" "}
                      <code className="break-all">{result.rejected.join(", ")}</code>
                    </span>
                  </div>
                )}

                {/* Base44-ready JSON */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      Base44 record · entityName "LearningPath"
                    </span>
                    <button
                      onClick={copyJSON}
                      className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-lg bg-black/60 border border-slate-800 p-3 text-xs text-slate-300 overflow-x-auto">
{JSON.stringify(result.record, null, 2)}
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">
                    Paste into <code>create_entities</code> (app
                    69180d077a5cbed7242f90ab). Ships as <code>is_published: false</code> —
                    review, then publish.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
