import { useState, useEffect, useCallback, useRef } from "react";

const COURSES = [
  { id: "claude-101", name: "Claude 101", slug: "claude-101", audience: "Everyone", difficulty: "Beginner", duration: "1-2 hrs", category: "Foundations", prereqs: [], description: "Learn how to use Claude for everyday work tasks, understand core features, and explore resources for more advanced learning.", topics: ["Chat interface", "Web search", "Artifacts", "Projects", "Memory", "Styles", "File handling"], modules: ["Getting Started with Claude", "Core Features Tour", "Projects & Memory", "Artifacts & Creation", "Web Search & Research", "Tips & Best Practices"], certified: true },
  { id: "ai-fluency", name: "AI Fluency: Framework & Foundations", slug: "ai-fluency-framework-foundations", audience: "Everyone", difficulty: "Beginner", duration: "3-4 hrs", category: "Foundations", prereqs: [], description: "Learn to collaborate with AI systems effectively, efficiently, ethically, and safely using the 4D Framework.", topics: ["4D Framework", "Responsible AI", "Thinking with AI", "Consistent results", "Ethics & safety"], modules: ["What is AI Fluency?", "The 4D Framework", "Effective AI Collaboration", "Responsible Usage", "Achieving Consistent Results", "Assessment"], certified: true },
  { id: "ai-cap-limits", name: "AI Capabilities and Limitations", slug: "ai-capabilities-and-limitations", audience: "Everyone", difficulty: "Beginner", duration: "1-2 hrs", category: "Foundations", prereqs: [], description: "An introductory course about how AI works, what it can do, and where its boundaries are.", topics: ["How LLMs work", "Strengths & weaknesses", "Hallucinations", "Context windows", "Token economics"], modules: ["How AI Models Work", "Capabilities Overview", "Understanding Limitations", "Practical Implications"], certified: true },
  { id: "ai-fluency-students", name: "AI Fluency for Students", slug: "ai-fluency-for-students", audience: "Students", difficulty: "Beginner", duration: "2-3 hrs", category: "Foundations", prereqs: ["ai-fluency"], description: "Develop AI Fluency skills that enhance learning, career planning, and academic success through responsible AI collaboration.", topics: ["Academic AI use", "Research with AI", "Career planning", "Responsible student use"], modules: ["AI in Academic Settings", "Research & Writing", "Career Development", "Responsible Academic Use"], certified: true },
  { id: "ai-fluency-educators", name: "AI Fluency for Educators", slug: "ai-fluency-for-educators", audience: "Educators", difficulty: "Intermediate", duration: "3-4 hrs", category: "Foundations", prereqs: ["ai-fluency"], description: "Apply AI Fluency into teaching practice and institutional strategy for faculty, instructional designers, and educational leaders.", topics: ["Teaching with AI", "Curriculum design", "Assessment strategies", "Institutional AI policy"], modules: ["AI in Education Landscape", "Curriculum Integration", "Assessment & Evaluation", "Institutional Strategy"], certified: true },
  { id: "teaching-ai-fluency", name: "Teaching AI Fluency", slug: "teaching-ai-fluency", audience: "Educators", difficulty: "Advanced", duration: "4-5 hrs", category: "Foundations", prereqs: ["ai-fluency", "ai-fluency-educators"], description: "Teach and assess AI Fluency in instructor-led settings for academic faculty, instructional designers, and others.", topics: ["Pedagogy for AI", "Assessment design", "Instructor facilitation", "Measuring AI fluency"], modules: ["Instructor Preparation", "Teaching Methods", "Assessment Design", "Facilitation Techniques", "Measuring Outcomes"], certified: true },
  { id: "ai-fluency-nonprofits", name: "AI Fluency for Nonprofits", slug: "ai-fluency-for-nonprofits", audience: "Nonprofit Professionals", difficulty: "Beginner", duration: "2-3 hrs", category: "Foundations", prereqs: ["ai-fluency"], description: "Develop AI fluency to increase organizational impact and efficiency while staying true to mission and values.", topics: ["AI for social impact", "Resource optimization", "Mission alignment", "Ethical AI in nonprofits"], modules: ["AI for Nonprofit Context", "Practical Applications", "Mission-Aligned Implementation", "Ethics & Governance"], certified: true },
  { id: "claude-code-101", name: "Claude Code 101", slug: "claude-code-101", audience: "Developers", difficulty: "Beginner", duration: "2-3 hrs", category: "Developer", prereqs: ["claude-101"], description: "Learn how to use Claude Code effectively in your daily development workflow.", topics: ["CLI installation", "Terminal workflows", "Codebase understanding", "Basic commands", "CLAUDE.md"], modules: ["Installation & Setup", "Basic Commands", "Codebase Navigation", "CLAUDE.md Configuration", "Daily Workflow Integration"], certified: true },
  { id: "claude-code-action", name: "Claude Code in Action", slug: "claude-code-in-action", audience: "Developers", difficulty: "Intermediate", duration: "4-5 hrs", category: "Developer", prereqs: ["claude-code-101"], description: "Integrate Claude Code into your development workflow with advanced patterns and real-world scenarios.", topics: ["Multi-file refactoring", "Test writing", "PR creation", "Git integration", "Hooks & automation", "Plan mode"], modules: ["Advanced CLI Usage", "Multi-file Operations", "Testing Workflows", "Git & PR Integration", "Hooks & Events", "Headless & CI/CD", "Real-world Projects"], certified: true },
  { id: "intro-cowork", name: "Introduction to Claude Cowork", slug: "introduction-to-claude-cowork", audience: "Everyone", difficulty: "Beginner", duration: "2-3 hrs", category: "Developer", prereqs: ["claude-101"], description: "Work alongside Claude on your real files and projects. Covers the Cowork task loop, plugins and skills, file and research workflows.", topics: ["Cowork task loop", "Plugins & skills", "File workflows", "Research workflows", "Multi-step work"], modules: ["What is Cowork?", "The Task Loop", "Plugins & Skills", "File Workflows", "Research Mode", "Steering Multi-step Work"], certified: true },
  { id: "building-api", name: "Building with the Claude API", slug: "claude-with-the-anthropic-api", audience: "Developers", difficulty: "Intermediate", duration: "5-6 hrs", category: "Developer", prereqs: ["claude-101"], description: "Comprehensive course covering the full spectrum of working with Anthropic models using the Claude API.", topics: ["Messages API", "Tool use", "Streaming", "Prompt engineering", "Structured outputs", "Agent workflows", "Batch processing", "Prompt caching"], modules: ["API Fundamentals", "Messages & Streaming", "Prompt Engineering", "Tool Use & Function Calling", "Structured Outputs", "Vision & Multimodal", "Batch & Caching", "Agent Workflows", "Production Patterns"], certified: true },
  { id: "intro-mcp", name: "Introduction to Model Context Protocol", slug: "introduction-to-model-context-protocol", audience: "Developers", difficulty: "Intermediate", duration: "4-5 hrs", category: "Developer", prereqs: ["building-api"], description: "Build MCP servers and clients from scratch using Python. Master tools, resources, and prompts to connect Claude with external services.", topics: ["MCP architecture", "Tools primitive", "Resources primitive", "Prompts primitive", "Python FastMCP", "Client connections"], modules: ["What is MCP?", "Architecture & Transport", "Tools Primitive", "Resources Primitive", "Prompts Primitive", "Building Your First Server", "Client Integration", "Testing & Debugging"], certified: true },
  { id: "mcp-advanced", name: "MCP: Advanced Topics", slug: "model-context-protocol-advanced-topics", audience: "Developers", difficulty: "Advanced", duration: "5-6 hrs", category: "Developer", prereqs: ["intro-mcp"], description: "Advanced MCP patterns including sampling, notifications, file system access, and transport mechanisms for production.", topics: ["Sampling", "Notifications", "File system access", "Transport mechanisms", "Production patterns", "Security"], modules: ["Sampling & Callbacks", "Notification Patterns", "File System Integration", "Transport Deep Dive", "Production Deployment", "Security & Auth", "Advanced Patterns"], certified: true },
  { id: "agent-skills", name: "Introduction to Agent Skills", slug: "introduction-to-agent-skills", audience: "Developers", difficulty: "Intermediate", duration: "3-4 hrs", category: "Developer", prereqs: ["claude-code-101"], description: "Build, configure, and share Skills in Claude Code — reusable markdown instructions that Claude automatically applies.", topics: ["SKILL.md format", "Trigger patterns", "Skill distribution", "Team sharing", "Troubleshooting"], modules: ["What Are Skills?", "SKILL.md Structure", "Trigger Configuration", "Building Your First Skill", "Distribution & Sharing", "Troubleshooting"], certified: true },
  { id: "subagents", name: "Introduction to Subagents", slug: "introduction-to-subagents", audience: "Developers", difficulty: "Intermediate", duration: "3-4 hrs", category: "Developer", prereqs: ["claude-code-action", "agent-skills"], description: "Use and create sub-agents in Claude Code to manage context, delegate tasks, and build specialized workflows.", topics: ["Subagent architecture", "Context management", "Task delegation", "Specialized workflows", "Parallel execution"], modules: ["What Are Subagents?", "Context Management", "Creating Subagents", "Task Delegation Patterns", "Specialized Workflows", "Best Practices"], certified: true },
  { id: "aws-bedrock", name: "Claude with Amazon Bedrock", slug: "claude-in-amazon-bedrock", audience: "Cloud Engineers", difficulty: "Intermediate", duration: "4-5 hrs", category: "Enterprise", prereqs: ["building-api"], description: "First-of-its-kind training for running Claude through AWS Bedrock infrastructure.", topics: ["Bedrock setup", "Model invocation", "Guardrails", "Knowledge bases", "Agent integration", "Cost optimization"], modules: ["AWS Bedrock Overview", "Claude Model Setup", "Invocation Patterns", "Guardrails & Safety", "Knowledge Bases", "Agent Integration", "Production Deployment"], certified: true },
  { id: "gcp-vertex", name: "Claude with Google Cloud Vertex AI", slug: "claude-with-google-vertex", audience: "Cloud Engineers", difficulty: "Intermediate", duration: "4-5 hrs", category: "Enterprise", prereqs: ["building-api"], description: "Comprehensive course covering working with Anthropic models through Google Cloud's Vertex AI.", topics: ["Vertex AI setup", "Model Garden", "Prompt management", "Grounding", "Enterprise features"], modules: ["Vertex AI Overview", "Model Garden Setup", "Claude Integration", "Prompt Management", "Enterprise Patterns", "Production Deployment"], certified: true },
];

const QUIZ_BANK = [
  { id: "q1", courseId: "ai-fluency", question: "What is the Anthropic Academy and what does it offer?", options: ["A paid bootcamp for developers", "A first-party educational platform offering 17+ structured courses and official certifications for free", "A YouTube channel with AI tutorials", "A consulting service for enterprises"], correct: 1, explanation: "Anthropic Academy is a first-party educational platform offering structured courses and official certifications for free, providing training from foundational AI literacy to advanced technical implementation.", domain: "Foundations" },
  { id: "q2", courseId: "ai-fluency", question: "What is the '4D Framework' taught in the AI Fluency course?", options: ["Design, Develop, Deploy, Debug", "A structured methodology for thinking with AI that ensures consistent, reproducible results", "Data, Decisions, Direction, Delivery", "A four-step coding methodology"], correct: 1, explanation: "The 4D Framework is a structured methodology for 'thinking with AI' that moves beyond hit-or-miss prompting to ensure consistent, reproducible results across the enterprise.", domain: "Foundations" },
  { id: "q3", courseId: "intro-mcp", question: "What is the Model Context Protocol (MCP)?", options: ["A database query language", "A new standard for connecting Claude to tools, apps, and services — essentially 'USB for AI'", "A security protocol for API keys", "A prompt engineering technique"], correct: 1, explanation: "MCP is a new standard for connecting Claude AI to various tools, applications, or services, acting as a universal connector — often described as 'USB for AI.'", domain: "MCP" },
  { id: "q4", courseId: "building-api", question: "What does the 'Building with the Claude API' course primarily teach?", options: ["Frontend web development", "API fundamentals, prompt engineering, tool use, and agent workflows", "Database administration", "Cloud infrastructure management"], correct: 1, explanation: "This developer-focused course provides a full walkthrough of API fundamentals, prompt engineering, tool use, and how to build agent workflows and full AI applications.", domain: "API" },
  { id: "q5", courseId: "ai-fluency", question: "Which major firm is certifying 15,000+ professionals through Anthropic Academy?", options: ["Google", "McKinsey", "Deloitte", "Amazon"], correct: 2, explanation: "Deloitte has committed to certifying 15,000 of its professionals globally through Anthropic's programs, signaling that AI credentials are becoming recognized currency in the job market.", domain: "Foundations" },
  { id: "q6", courseId: "building-api", question: "What is 'prompt caching' in the Claude API?", options: ["Storing prompts in a database for later retrieval", "Caching static content across API calls to reduce cost and latency for repeated prefixes", "A browser-side caching mechanism", "Pre-loading prompts at application startup"], correct: 1, explanation: "Prompt caching allows you to cache static content (system prompts, large documents, few-shot examples) across API calls, reducing cost and latency for repeated prefixes.", domain: "API" },
  { id: "q7", courseId: "claude-code-action", question: "What is a CLAUDE.md file?", options: ["A readme file for Claude projects", "A project-level instructions file that acts like a persistent system prompt for the codebase", "A changelog for Claude updates", "A markdown template for documentation"], correct: 1, explanation: "CLAUDE.md is a project-level instructions file — like a persistent system prompt for the codebase that tells Claude Code about project conventions, patterns, and requirements.", domain: "Claude Code" },
  { id: "q8", courseId: "agent-skills", question: "What are Skills in Claude Code?", options: ["Pre-trained model weights", "Reusable SKILL.md markdown instructions that Claude automatically applies to the right tasks", "API endpoints for external services", "Unit test templates"], correct: 1, explanation: "Skills are reusable markdown-based instruction packages (SKILL.md files) that Claude Code automatically applies when relevant tasks are detected, making expertise shareable and repeatable.", domain: "Claude Code" },
  { id: "q9", courseId: "subagents", question: "What is the primary purpose of subagents in Claude Code?", options: ["Running multiple Claude models simultaneously", "Managing context, delegating tasks, and building specialized workflows while keeping the main conversation clean", "Creating API endpoints", "Generating test data"], correct: 1, explanation: "Subagents help manage context windows by delegating specific tasks to specialized agents, keeping the main conversation focused and clean while handling complex multi-step workflows.", domain: "Claude Code" },
  { id: "q10", courseId: "intro-mcp", question: "What are the three core primitives of MCP?", options: ["Read, Write, Execute", "Tools, Resources, and Prompts", "Input, Process, Output", "Query, Mutate, Subscribe"], correct: 1, explanation: "MCP's three core primitives are Tools (actions the model can take), Resources (data sources it can read), and Prompts (predefined interaction patterns).", domain: "MCP" },
  { id: "q11", courseId: "building-api", question: "What is 'structured outputs' in the Claude API?", options: ["Formatted console logging", "Forcing Claude to respond in specific JSON schemas with guaranteed compliance", "HTML template rendering", "Database schema generation"], correct: 1, explanation: "Structured outputs force Claude to respond in specific JSON schemas with guaranteed schema compliance — essential for API integrations, data extraction, and form filling.", domain: "API" },
  { id: "q12", courseId: "claude-code-action", question: "What is 'headless mode' in Claude Code?", options: ["Running without a display monitor", "Running Claude Code programmatically for CI/CD, automation, and bots without terminal interaction", "A debugging mode with minimal output", "Running with reduced model capabilities"], correct: 1, explanation: "Headless mode allows running Claude Code programmatically — ideal for CI/CD pipelines, automation scripts, and bot integration where there's no human at a terminal.", domain: "Claude Code" },
  { id: "q13", courseId: "aws-bedrock", question: "What unique capability does Claude have across cloud providers?", options: ["It only runs on AWS", "It's the only frontier AI model available on all three major cloud providers: AWS, Google Cloud, and Microsoft", "It requires custom hardware", "It only works with open-source infrastructure"], correct: 1, explanation: "Claude is the only frontier AI model available on all three major cloud providers — AWS, Google Cloud, and Microsoft — giving enterprises maximum deployment flexibility.", domain: "Enterprise" },
  { id: "q14", courseId: "intro-cowork", question: "What is the Cowork task loop?", options: ["A Kanban board for project management", "The iterative cycle of giving Claude tasks on real files, reviewing output, and steering multi-step work", "A code compilation pipeline", "An automated testing framework"], correct: 1, explanation: "The Cowork task loop is the core interaction pattern: give Claude a task on your real files, review its output, provide feedback, and steer multi-step work to completion.", domain: "Cowork" },
  { id: "q15", courseId: "ai-fluency", question: "Why is 'specificity' critical when pitching AI services to businesses?", options: ["It makes proposals longer", "The market rewards specialists who solve distinct problems for specific industries over generalists offering vague 'AI stuff'", "It increases billing rates", "Businesses prefer technical jargon"], correct: 1, explanation: "The market rewards specialists who solve distinct problems for specific industries — such as automating client intake for law firms — over generalists who offer vague 'AI stuff.' Narrowing focus demonstrates clear, tangible value.", domain: "Consulting" },
];

const CATEGORIES = ["All", "Foundations", "Developer", "Enterprise"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const MODES = ["Dashboard", "Courses", "Quiz", "Teaching", "Proof"];

const SPACED_REP_INTERVALS = [1, 3, 7, 14, 30, 60];

const defaultProgress = () => ({
  courses: {},
  quizHistory: [],
  spacedRep: {},
  teachingAssets: [],
  proofArtifacts: [],
  studyStreak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
});

export default function CertCommandCenter() {
  const [mode, setMode] = useState("Dashboard");
  const [progress, setProgress] = useState(defaultProgress());
  const [loaded, setLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [quizState, setQuizState] = useState(null);
  const [teachingTopic, setTeachingTopic] = useState("");
  const [teachingOutput, setTeachingOutput] = useState("");
  const [teachingLoading, setTeachingLoading] = useState(false);
  const [proofForm, setProofForm] = useState({ type: "certificate", title: "", url: "", notes: "" });
  const [view, setView] = useState("personal");

  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get("cert-cmd-center-v1");
        if (stored?.value) setProgress(JSON.parse(stored.value));
      } catch { /* first load */ }
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (p) => {
    setProgress(p);
    try { await window.storage.set("cert-cmd-center-v1", JSON.stringify(p)); } catch {}
  }, []);

  const updateCourseStatus = (courseId, status) => {
    const next = { ...progress, courses: { ...progress.courses, [courseId]: { ...progress.courses[courseId], status, updatedAt: new Date().toISOString() } } };
    save(next);
  };

  const completedCount = Object.values(progress.courses).filter(c => c?.status === "completed").length;
  const inProgressCount = Object.values(progress.courses).filter(c => c?.status === "in-progress").length;
  const totalQuizzes = progress.quizHistory.length;
  const avgScore = totalQuizzes > 0 ? Math.round(progress.quizHistory.reduce((a, h) => a + h.score, 0) / totalQuizzes) : 0;

  const startQuiz = (courseId = null) => {
    const pool = courseId ? QUIZ_BANK.filter(q => q.courseId === courseId) : [...QUIZ_BANK];
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    setQuizState({ questions: shuffled, current: 0, answers: [], startTime: Date.now(), courseId, showResult: false });
    setMode("Quiz");
  };

  const answerQuiz = (idx) => {
    const qs = quizState;
    const newAnswers = [...qs.answers, idx];
    if (qs.current + 1 >= qs.questions.length) {
      const score = Math.round(newAnswers.filter((a, i) => a === qs.questions[i].correct).length / qs.questions.length * 100);
      const entry = { date: new Date().toISOString(), courseId: qs.courseId, score, questionCount: qs.questions.length, timeMs: Date.now() - qs.startTime };
      const next = { ...progress, quizHistory: [...progress.quizHistory, entry] };
      save(next);
      setQuizState({ ...qs, answers: newAnswers, showResult: true });
    } else {
      setQuizState({ ...qs, current: qs.current + 1, answers: newAnswers });
    }
  };

  const generateTeaching = async () => {
    if (!teachingTopic.trim()) return;
    setTeachingLoading(true);
    setTeachingOutput("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are an expert AI instructor. Generate a teaching explanation for the following Anthropic/Claude concept using this exact structure:

**TL;DR:** (1-2 sentences, plain English)
**Analogy:** (relatable real-world comparison)
**Concrete Example:** (show it in action with a realistic scenario)
**Technical Detail:** (API calls, configuration, or architecture specifics)
**Common Misconception:** (what people get wrong and the correction)
**Interview Question:** (one expert-level question to test deep understanding, with answer)

Topic: ${teachingTopic}

Be specific to Anthropic's Claude ecosystem. Use real API examples where relevant.` }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("\n") || "Generation failed.";
      setTeachingOutput(text);
      const asset = { topic: teachingTopic, output: text, date: new Date().toISOString() };
      const next = { ...progress, teachingAssets: [...progress.teachingAssets, asset] };
      save(next);
    } catch (e) {
      setTeachingOutput("Error: " + e.message);
    }
    setTeachingLoading(false);
  };

  const addProof = () => {
    if (!proofForm.title.trim()) return;
    const next = { ...progress, proofArtifacts: [...progress.proofArtifacts, { ...proofForm, date: new Date().toISOString() }] };
    save(next);
    setProofForm({ type: "certificate", title: "", url: "", notes: "" });
  };

  const filteredCourses = COURSES.filter(c => (catFilter === "All" || c.category === catFilter) && (diffFilter === "All" || c.difficulty === diffFilter));

  const prereqTree = (courseId) => {
    const c = COURSES.find(x => x.id === courseId);
    if (!c) return [];
    return c.prereqs.map(pid => COURSES.find(x => x.id === pid)).filter(Boolean);
  };

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1a", color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" }}>Loading...</div>;

  const S = {
    bg: "#0a0f1a", card: "#111827", cardHover: "#1a2332", border: "#1e293b",
    text: "#e2e8f0", textMuted: "#94a3b8", textDim: "#64748b",
    accent: "#c084fc", accentDim: "#7c3aed", accentGlow: "rgba(192,132,252,0.15)",
    success: "#34d399", warning: "#fbbf24", danger: "#f87171",
    blue: "#60a5fa", orange: "#fb923c",
    font: "'IBM Plex Sans', -apple-system, sans-serif",
    mono: "'IBM Plex Mono', monospace",
  };

  const Pill = ({ children, active, onClick, color }) => (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: "6px", border: `1px solid ${active ? (color || S.accent) : S.border}`, background: active ? (color || S.accent) + "22" : "transparent", color: active ? (color || S.accent) : S.textMuted, fontSize: "12px", fontFamily: S.mono, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all 0.2s" }}>{children}</button>
  );

  const StatusBadge = ({ status }) => {
    const map = { completed: { bg: S.success + "22", color: S.success, label: "CERTIFIED" }, "in-progress": { bg: S.warning + "22", color: S.warning, label: "IN PROGRESS" }, "not-started": { bg: S.border, color: S.textDim, label: "NOT STARTED" } };
    const s = map[status] || map["not-started"];
    return <span style={{ padding: "3px 8px", borderRadius: "4px", background: s.bg, color: s.color, fontSize: "10px", fontFamily: S.mono, fontWeight: 600, letterSpacing: "0.5px" }}>{s.label}</span>;
  };

  const DashView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        {["personal", "team", "client"].map(v => <Pill key={v} active={view === v} onClick={() => setView(v)}>{v.charAt(0).toUpperCase() + v.slice(1)} View</Pill>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {[
          { label: "Courses Completed", value: `${completedCount}/${COURSES.length}`, color: S.success },
          { label: "In Progress", value: inProgressCount, color: S.warning },
          { label: "Quizzes Taken", value: totalQuizzes, color: S.blue },
          { label: "Avg Score", value: totalQuizzes > 0 ? `${avgScore}%` : "—", color: avgScore >= 80 ? S.success : avgScore >= 60 ? S.warning : S.danger },
          { label: "Teaching Assets", value: progress.teachingAssets.length, color: S.accent },
          { label: "Proof Artifacts", value: progress.proofArtifacts.length, color: S.orange },
        ].map((m, i) => (
          <div key={i} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>{m.label}</span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: m.color, fontFamily: S.mono }}>{m.value}</span>
          </div>
        ))}
      </div>
      {view === "personal" && (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontFamily: S.mono, color: S.accent, textTransform: "uppercase", letterSpacing: "1px" }}>Recommended Next Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {COURSES.filter(c => !progress.courses[c.id]?.status || progress.courses[c.id]?.status === "not-started").filter(c => c.prereqs.every(p => progress.courses[p]?.status === "completed")).slice(0, 4).map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: S.bg, borderRadius: "8px", border: `1px solid ${S.border}` }}>
                <div>
                  <span style={{ color: S.text, fontSize: "14px", fontWeight: 500 }}>{c.name}</span>
                  <span style={{ marginLeft: "10px", fontSize: "11px", color: S.textDim, fontFamily: S.mono }}>{c.difficulty} · {c.duration}</span>
                </div>
                <button onClick={() => { updateCourseStatus(c.id, "in-progress"); }} style={{ padding: "5px 12px", borderRadius: "6px", border: `1px solid ${S.accent}`, background: S.accentGlow, color: S.accent, fontSize: "11px", fontFamily: S.mono, cursor: "pointer", fontWeight: 600 }}>Start</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {view === "team" && (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontFamily: S.mono, color: S.blue, textTransform: "uppercase", letterSpacing: "1px" }}>Team Training Status</h3>
          <p style={{ color: S.textMuted, fontSize: "13px", lineHeight: 1.6 }}>Share this dashboard with your team to track collective progress across Anthropic Academy certifications. Each member's completion feeds into the team rollup.</p>
          <div style={{ marginTop: "12px", padding: "12px", background: S.bg, borderRadius: "8px", border: `1px solid ${S.border}` }}>
            <span style={{ color: S.textDim, fontSize: "12px", fontFamily: S.mono }}>Team members tracked: </span>
            <span style={{ color: S.text, fontSize: "12px", fontFamily: S.mono, fontWeight: 600 }}>1 (you) — invite via Notion share</span>
          </div>
        </div>
      )}
      {view === "client" && (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontFamily: S.mono, color: S.orange, textTransform: "uppercase", letterSpacing: "1px" }}>Consulting Credential Summary</h3>
          <p style={{ color: S.textMuted, fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px" }}>Exportable proof package for clients and employers. Shows certifications earned, teaching materials created, and demonstrated expertise.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ padding: "12px", background: S.bg, borderRadius: "8px", border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: "11px", color: S.textDim, fontFamily: S.mono }}>Certifications</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: S.success, fontFamily: S.mono }}>{completedCount}</div>
            </div>
            <div style={{ padding: "12px", background: S.bg, borderRadius: "8px", border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: "11px", color: S.textDim, fontFamily: S.mono }}>Teaching Demos</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: S.accent, fontFamily: S.mono }}>{progress.teachingAssets.length}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontFamily: S.mono, color: S.text, textTransform: "uppercase", letterSpacing: "1px" }}>Recent Quiz Performance</h3>
        {progress.quizHistory.length === 0 ? (
          <p style={{ color: S.textDim, fontSize: "13px" }}>No quizzes taken yet. Start one from the Quiz tab.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {progress.quizHistory.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: S.bg, borderRadius: "6px", border: `1px solid ${S.border}` }}>
                <span style={{ fontSize: "12px", color: S.textMuted, fontFamily: S.mono }}>{new Date(h.date).toLocaleDateString()} · {h.questionCount}Q</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: h.score >= 80 ? S.success : h.score >= 60 ? S.warning : S.danger, fontFamily: S.mono }}>{h.score}%</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => startQuiz()} style={{ marginTop: "14px", padding: "8px 18px", borderRadius: "6px", border: `1px solid ${S.accent}`, background: S.accentGlow, color: S.accent, fontSize: "12px", fontFamily: S.mono, cursor: "pointer", fontWeight: 600 }}>Take Full Practice Quiz</button>
      </div>
    </div>
  );

  const CourseView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {CATEGORIES.map(c => <Pill key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>{c}</Pill>)}
        <span style={{ width: "1px", background: S.border, margin: "0 4px" }} />
        {DIFFICULTIES.map(d => <Pill key={d} active={diffFilter === d} onClick={() => setDiffFilter(d)} color={S.blue}>{d}</Pill>)}
      </div>
      {selectedCourse ? (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
          <button onClick={() => setSelectedCourse(null)} style={{ background: "none", border: "none", color: S.accent, fontSize: "12px", fontFamily: S.mono, cursor: "pointer", marginBottom: "16px" }}>← Back to courses</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", color: S.text, fontWeight: 700 }}>{selectedCourse.name}</h2>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.textDim, padding: "2px 8px", background: S.bg, borderRadius: "4px" }}>{selectedCourse.difficulty}</span>
                <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.textDim }}>{selectedCourse.duration}</span>
                <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.textDim }}>{selectedCourse.audience}</span>
                <StatusBadge status={progress.courses[selectedCourse.id]?.status || "not-started"} />
              </div>
            </div>
          </div>
          <p style={{ color: S.textMuted, fontSize: "13px", lineHeight: 1.6, margin: "0 0 20px" }}>{selectedCourse.description}</p>
          {selectedCourse.prereqs.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: "12px", fontFamily: S.mono, color: S.warning, textTransform: "uppercase", letterSpacing: "0.5px" }}>Prerequisites</h4>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {prereqTree(selectedCourse.id).map(p => (
                  <span key={p.id} onClick={() => setSelectedCourse(p)} style={{ padding: "4px 10px", borderRadius: "6px", background: progress.courses[p.id]?.status === "completed" ? S.success + "22" : S.warning + "22", color: progress.courses[p.id]?.status === "completed" ? S.success : S.warning, fontSize: "11px", fontFamily: S.mono, cursor: "pointer" }}>{p.name} {progress.courses[p.id]?.status === "completed" ? "✓" : "⚠"}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontFamily: S.mono, color: S.accent, textTransform: "uppercase", letterSpacing: "0.5px" }}>Modules</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {selectedCourse.modules.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: S.bg, borderRadius: "6px", border: `1px solid ${S.border}` }}>
                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: S.textDim, fontFamily: S.mono, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: "13px", color: S.text }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontFamily: S.mono, color: S.blue, textTransform: "uppercase", letterSpacing: "0.5px" }}>Key Topics</h4>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {selectedCourse.topics.map((t, i) => <span key={i} style={{ padding: "3px 8px", borderRadius: "4px", background: S.blue + "15", color: S.blue, fontSize: "11px", fontFamily: S.mono }}>{t}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={`https://anthropic.skilljar.com/${selectedCourse.slug}`} target="_blank" rel="noreferrer" style={{ padding: "8px 16px", borderRadius: "6px", background: S.accent, color: "#0a0f1a", fontSize: "12px", fontFamily: S.mono, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>Open in Skilljar →</a>
            {["not-started", undefined].includes(progress.courses[selectedCourse.id]?.status) && <button onClick={() => updateCourseStatus(selectedCourse.id, "in-progress")} style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${S.warning}`, background: S.warning + "22", color: S.warning, fontSize: "12px", fontFamily: S.mono, fontWeight: 600, cursor: "pointer" }}>Mark In Progress</button>}
            {progress.courses[selectedCourse.id]?.status === "in-progress" && <button onClick={() => updateCourseStatus(selectedCourse.id, "completed")} style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${S.success}`, background: S.success + "22", color: S.success, fontSize: "12px", fontFamily: S.mono, fontWeight: 600, cursor: "pointer" }}>Mark Certified ✓</button>}
            {QUIZ_BANK.some(q => q.courseId === selectedCourse.id) && <button onClick={() => startQuiz(selectedCourse.id)} style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${S.blue}`, background: S.blue + "22", color: S.blue, fontSize: "12px", fontFamily: S.mono, fontWeight: 600, cursor: "pointer" }}>Practice Quiz</button>}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
          {filteredCourses.map(c => (
            <div key={c.id} onClick={() => setSelectedCourse(c)} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "10px", padding: "18px", cursor: "pointer", transition: "all 0.2s", position: "relative" }} onMouseEnter={e => { e.currentTarget.style.borderColor = S.accent; e.currentTarget.style.background = S.cardHover; }} onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.card; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.accent, padding: "2px 6px", background: S.accentGlow, borderRadius: "3px" }}>{c.category}</span>
                <StatusBadge status={progress.courses[c.id]?.status || "not-started"} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "15px", color: S.text, fontWeight: 600, lineHeight: 1.3 }}>{c.name}</h3>
              <p style={{ margin: "0 0 12px", fontSize: "12px", color: S.textDim, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.description}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.textDim, padding: "2px 6px", background: S.bg, borderRadius: "3px" }}>{c.difficulty}</span>
                <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.textDim }}>{c.duration}</span>
                <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.textDim }}>{c.modules.length} modules</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const QuizView = () => {
    if (!quizState) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px", color: S.text, fontSize: "16px" }}>Quiz Simulator</h3>
          <p style={{ color: S.textMuted, fontSize: "13px", lineHeight: 1.6, margin: "0 0 20px" }}>Practice assessments to prep for Skilljar certification quizzes. Questions cover all Anthropic Academy domains. Start a full quiz or pick a specific course.</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => startQuiz()} style={{ padding: "10px 20px", borderRadius: "8px", background: S.accent, color: "#0a0f1a", fontSize: "13px", fontFamily: S.mono, fontWeight: 700, border: "none", cursor: "pointer" }}>Full Practice Quiz ({QUIZ_BANK.length}Q)</button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontFamily: S.mono, color: S.textDim, textTransform: "uppercase" }}>By Course</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[...new Set(QUIZ_BANK.map(q => q.courseId))].map(cid => {
                const c = COURSES.find(x => x.id === cid);
                const count = QUIZ_BANK.filter(q => q.courseId === cid).length;
                return <button key={cid} onClick={() => startQuiz(cid)} style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "11px", fontFamily: S.mono, cursor: "pointer" }}>{c?.name || cid} ({count}Q)</button>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
    if (quizState.showResult) {
      const score = quizState.answers.filter((a, i) => a === quizState.questions[i].correct).length;
      const pct = Math.round(score / quizState.questions.length * 100);
      return (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px", fontWeight: 800, color: pct >= 80 ? S.success : pct >= 60 ? S.warning : S.danger, fontFamily: S.mono }}>{pct}%</div>
            <div style={{ fontSize: "14px", color: S.textMuted }}>{score}/{quizState.questions.length} correct</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {quizState.questions.map((q, i) => {
              const correct = quizState.answers[i] === q.correct;
              return (
                <div key={i} style={{ padding: "14px", background: S.bg, borderRadius: "8px", border: `1px solid ${correct ? S.success + "44" : S.danger + "44"}` }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px" }}>{correct ? "✓" : "✗"}</span>
                    <span style={{ fontSize: "13px", color: S.text, fontWeight: 500 }}>{q.question}</span>
                  </div>
                  {!correct && <div style={{ fontSize: "12px", color: S.success, marginLeft: "22px", marginBottom: "4px" }}>Correct: {q.options[q.correct]}</div>}
                  <div style={{ fontSize: "11px", color: S.textDim, marginLeft: "22px", fontStyle: "italic" }}>{q.explanation}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setQuizState(null)} style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "8px", background: S.accent, color: "#0a0f1a", border: "none", fontSize: "13px", fontFamily: S.mono, fontWeight: 700, cursor: "pointer" }}>Back to Quiz Menu</button>
        </div>
      );
    }
    const q = quizState.questions[quizState.current];
    return (
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px", maxWidth: "640px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.textDim }}>Question {quizState.current + 1} of {quizState.questions.length}</span>
          <span style={{ fontSize: "11px", fontFamily: S.mono, color: S.accent }}>{q.domain}</span>
        </div>
        <div style={{ width: "100%", height: "3px", background: S.border, borderRadius: "2px", marginBottom: "20px" }}>
          <div style={{ width: `${((quizState.current + 1) / quizState.questions.length) * 100}%`, height: "100%", background: S.accent, borderRadius: "2px", transition: "width 0.3s" }} />
        </div>
        <h3 style={{ margin: "0 0 20px", fontSize: "16px", color: S.text, fontWeight: 600, lineHeight: 1.5 }}>{q.question}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => answerQuiz(i)} style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "13px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", fontFamily: S.font, lineHeight: 1.4 }} onMouseEnter={e => { e.currentTarget.style.borderColor = S.accent; e.currentTarget.style.background = S.accentGlow; }} onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.bg; }}>
              <span style={{ fontFamily: S.mono, color: S.textDim, marginRight: "10px", fontSize: "11px" }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const TeachView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ margin: "0 0 8px", color: S.text, fontSize: "16px" }}>Teaching Material Generator</h3>
        <p style={{ color: S.textMuted, fontSize: "13px", margin: "0 0 16px" }}>Enter any Anthropic/Claude concept. Claude generates a structured teaching explanation you can use in sessions, slides, or consulting demos.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input value={teachingTopic} onChange={e => setTeachingTopic(e.target.value)} placeholder="e.g. MCP Tools primitive, Prompt caching, Extended thinking..." style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "13px", fontFamily: S.font, outline: "none" }} onKeyDown={e => e.key === "Enter" && generateTeaching()} />
          <button onClick={generateTeaching} disabled={teachingLoading} style={{ padding: "10px 20px", borderRadius: "8px", background: teachingLoading ? S.border : S.accent, color: teachingLoading ? S.textDim : "#0a0f1a", border: "none", fontSize: "13px", fontFamily: S.mono, fontWeight: 700, cursor: teachingLoading ? "wait" : "pointer" }}>{teachingLoading ? "Generating..." : "Generate"}</button>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          {["MCP Tools primitive", "Prompt caching", "Extended thinking", "Structured outputs", "Agent skills (SKILL.md)", "Subagent delegation", "Claude Code headless mode", "Tool use function calling"].map(t => (
            <button key={t} onClick={() => setTeachingTopic(t)} style={{ padding: "4px 8px", borderRadius: "4px", border: `1px solid ${S.border}`, background: "transparent", color: S.textDim, fontSize: "10px", fontFamily: S.mono, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>
      {teachingOutput && (
        <div style={{ background: S.card, border: `1px solid ${S.accent}33`, borderRadius: "12px", padding: "24px" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: "13px", fontFamily: S.mono, color: S.accent }}>Generated Teaching Material</h4>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "13px", color: S.text, lineHeight: 1.7, fontFamily: S.font, margin: 0 }}>{teachingOutput}</pre>
        </div>
      )}
      {progress.teachingAssets.length > 0 && (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: "13px", fontFamily: S.mono, color: S.textDim, textTransform: "uppercase" }}>Teaching Asset Library ({progress.teachingAssets.length})</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {progress.teachingAssets.slice().reverse().map((a, i) => (
              <div key={i} style={{ padding: "10px 14px", background: S.bg, borderRadius: "6px", border: `1px solid ${S.border}`, cursor: "pointer" }} onClick={() => { setTeachingTopic(a.topic); setTeachingOutput(a.output); }}>
                <div style={{ fontSize: "13px", color: S.text, fontWeight: 500 }}>{a.topic}</div>
                <div style={{ fontSize: "10px", color: S.textDim, fontFamily: S.mono, marginTop: "4px" }}>{new Date(a.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ProofView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px", color: S.text, fontSize: "16px" }}>Add Proof Artifact</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <select value={proofForm.type} onChange={e => setProofForm({ ...proofForm, type: e.target.value })} style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "12px", fontFamily: S.mono }}>
            <option value="certificate">Certificate</option>
            <option value="project">Practice Project</option>
            <option value="teaching">Teaching Demo</option>
            <option value="code">Code Example</option>
            <option value="video">Video/Recording</option>
            <option value="other">Other</option>
          </select>
          <input value={proofForm.title} onChange={e => setProofForm({ ...proofForm, title: e.target.value })} placeholder="Title" style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "12px" }} />
          <input value={proofForm.url} onChange={e => setProofForm({ ...proofForm, url: e.target.value })} placeholder="URL (GitHub, Notion, etc.)" style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "12px" }} />
          <input value={proofForm.notes} onChange={e => setProofForm({ ...proofForm, notes: e.target.value })} placeholder="Notes" style={{ padding: "8px 12px", borderRadius: "6px", border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: "12px" }} />
        </div>
        <button onClick={addProof} style={{ marginTop: "12px", padding: "8px 16px", borderRadius: "6px", background: S.success + "22", border: `1px solid ${S.success}`, color: S.success, fontSize: "12px", fontFamily: S.mono, fontWeight: 600, cursor: "pointer" }}>Add Proof</button>
      </div>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px", color: S.text, fontSize: "16px" }}>Credential Portfolio</h3>
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontFamily: S.mono, color: S.success, textTransform: "uppercase" }}>Certifications Earned ({completedCount})</h4>
          {completedCount === 0 ? <p style={{ color: S.textDim, fontSize: "12px" }}>Complete courses to add certifications here.</p> : (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {COURSES.filter(c => progress.courses[c.id]?.status === "completed").map(c => (
                <span key={c.id} style={{ padding: "6px 12px", borderRadius: "6px", background: S.success + "22", border: `1px solid ${S.success}44`, color: S.success, fontSize: "12px", fontFamily: S.mono }}>✓ {c.name}</span>
              ))}
            </div>
          )}
        </div>
        {progress.proofArtifacts.length > 0 && (
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontFamily: S.mono, color: S.orange, textTransform: "uppercase" }}>Proof Artifacts ({progress.proofArtifacts.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {progress.proofArtifacts.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: S.bg, borderRadius: "6px", border: `1px solid ${S.border}` }}>
                  <div>
                    <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.accent, padding: "2px 6px", background: S.accentGlow, borderRadius: "3px", marginRight: "8px" }}>{p.type}</span>
                    <span style={{ fontSize: "13px", color: S.text }}>{p.title}</span>
                    {p.notes && <span style={{ fontSize: "11px", color: S.textDim, marginLeft: "8px" }}>— {p.notes}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", color: S.textDim, fontFamily: S.mono }}>{new Date(p.date).toLocaleDateString()}</span>
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: S.blue, fontFamily: S.mono }}>Open →</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const resetData = async () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      const fresh = defaultProgress();
      setProgress(fresh);
      try { await window.storage.set("cert-cmd-center-v1", JSON.stringify(fresh)); } catch {}
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: S.font, padding: "0" }}>
      <div style={{ borderBottom: `1px solid ${S.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: S.card }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${S.accent}, ${S.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#fff" }}>A</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>Anthropic Academy</h1>
            <span style={{ fontSize: "10px", fontFamily: S.mono, color: S.textDim }}>CERTIFICATION COMMAND CENTER</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {MODES.map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: "7px 14px", borderRadius: "6px", border: `1px solid ${mode === m ? S.accent : "transparent"}`, background: mode === m ? S.accentGlow : "transparent", color: mode === m ? S.accent : S.textMuted, fontSize: "12px", fontFamily: S.mono, fontWeight: mode === m ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>{m}</button>
          ))}
        </div>
        <button onClick={resetData} style={{ padding: "5px 10px", borderRadius: "4px", border: `1px solid ${S.border}`, background: "transparent", color: S.textDim, fontSize: "10px", fontFamily: S.mono, cursor: "pointer" }} title="Reset all data">Reset</button>
      </div>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
        {mode === "Dashboard" && <DashView />}
        {mode === "Courses" && <CourseView />}
        {mode === "Quiz" && <QuizView />}
        {mode === "Teaching" && <TeachView />}
        {mode === "Proof" && <ProofView />}
      </div>
    </div>
  );
}
