import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const BASE = "https://anthropic.skilljar.com";

const COURSES = [
  { id:"cc-action",  wsjf:1,  ov:"high",   track:"Dev",         diff:"Intermediate", hrs:"4-5", n:"Claude Code in Action",                   url:`${BASE}/claude-code-in-action`,
    desc:"Hooks, headless mode, parallel sessions, Plan mode, PR workflow.",
    concepts:[
      "CLAUDE.md = project-level persistent system prompt for the codebase",
      "Plan mode = read-only analysis — zero file modification, safe exploration",
      "Hooks fire on lifecycle events: PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit",
      "Headless mode = programmatic CLI usage via stdin/flags — powers CI/CD and bots",
      "Git worktrees enable parallel Claude Code sessions on different branches simultaneously",
      "PR workflow: Claude creates branch, commits changes, writes PR description — all from natural language",
      "VS Code extension: inline editing at cursor + chat sidebar with open-file context",
      "Slash commands: /fix /test /review /commit — built-in + custom commands via .claude/commands/"
    ]},
  { id:"claude-101", wsjf:2,  ov:"high",   track:"Foundations", diff:"Beginner",     hrs:"1-2", n:"Claude 101",                               url:`${BASE}/claude-101`,
    desc:"Plans, artifacts, memory, projects, connectors, file handling.",
    concepts:[
      "Plans: Free → Pro ($20/mo) → Max → Team → Enterprise — gated features at each tier",
      "Projects (Pro+): custom instructions + knowledge file pinning + isolated memory namespace",
      "Memory: auto-generated from conversations; edit/add/delete in Settings > Memory",
      "Artifacts: React/HTML/JS/Markdown/Mermaid/SVG — persistent storage on Pro+",
      "Web Search: all plans; Deep Research mode for multi-step investigation",
      "File creation: docx, pptx, xlsx, PDF, HTML, SVG, Markdown",
      "Extended thinking: visible reasoning; configurable budget; billed as output tokens",
      "Connectors: 50+ MCP integrations; custom MCP server URLs on Pro+; Desktop Extensions"
    ]},
  { id:"intro-cowork",  wsjf:3, ov:"high",  track:"Dev",         diff:"Beginner",     hrs:"2-3", n:"Introduction to Claude Cowork",            url:`${BASE}/introduction-to-claude-cowork`,
    desc:"Task loop, steering, skills, plugins, file workflows.",
    concepts:[
      "Cowork = Claude works on your ACTUAL files and projects (not just generating text)",
      "Task loop: Assign → Claude works on files → Review output → Steer → Repeat",
      "Steering = mid-task feedback to redirect without aborting and restarting",
      "Skills = SKILL.md packages Claude auto-applies to matching task contexts",
      "Plugins = MCP server connectors extending Claude's access to external services",
      "Research mode: Claude searches, reads URLs, synthesizes across sources",
      "Multi-step tasks: Claude maintains context across sequential file operations"
    ]},
  { id:"agent-skills",  wsjf:4, ov:"high",  track:"Dev",         diff:"Intermediate", hrs:"3-4", n:"Introduction to Agent Skills",             url:`${BASE}/introduction-to-agent-skills`,
    desc:"SKILL.md authoring, triggers, gerund naming, distribution.",
    concepts:[
      "Gerund naming is spec-required: 'generating-docs' not 'generate-docs' or 'doc-generator'",
      "Trigger phrases in description = activation mechanism — dense and specific wins",
      "YAML frontmatter: name (gerund), description (trigger-rich), version",
      "500-line soft limit — skills over this are doing too much; split them",
      "Progressive disclosure: basic guidance first, advanced patterns deeper in file",
      "Skills = portable/shareable; CLAUDE.md = project-specific and non-distributable",
      "Distribution: zip package → marketplace or direct Claude Code CLI install"
    ]},
  { id:"subagents",     wsjf:5, ov:"high",  track:"Dev",         diff:"Intermediate", hrs:"3-4", n:"Introduction to Subagents",                url:`${BASE}/introduction-to-subagents`,
    desc:"Task tool, context isolation, delegation patterns.",
    concepts:[
      "Subagents = specialized Claude Code instances handling isolated tasks",
      "Task tool = mechanism for spawning and invoking subagents from the main agent",
      "Context isolation: each subagent starts with a CLEAN, empty context",
      "Design principle: one subagent per task type — narrow specialization wins",
      "Parallel execution via Git worktrees — independent session per branch",
      "vs slash commands: subagents = isolated context; slash = inline same context",
      "Use cases: code-review-agent, test-writer-agent, docs-agent, data-analysis-agent"
    ]},
  { id:"intro-mcp",     wsjf:6, ov:"high",  track:"Dev",         diff:"Intermediate", hrs:"4-5", n:"Introduction to Model Context Protocol",   url:`${BASE}/introduction-to-model-context-protocol`,
    desc:"Three primitives, FastMCP, transport, initialization.",
    concepts:[
      "MCP = open standard for connecting AI to external tools (created by Anthropic)",
      "'USB-C for AI': one protocol, any AI model to any compliant tool server",
      "Three primitives: Tools (actions), Resources (data sources), Prompts (templates)",
      "Tools: callable functions with typed JSON Schema params; Claude decides when to call",
      "Resources: URI-addressed data sources — file://, db://, custom schemes",
      "Prompts: server-defined workflow templates for common interactions",
      "Transport: HTTP POST (client→server) + SSE (server→client)",
      "FastMCP: @mcp.tool(), @mcp.resource(), @mcp.prompt() decorators",
      "Init = capability negotiation: client + server agree on supported features"
    ]},
  { id:"mcp-adv",       wsjf:7, ov:"medium",track:"Dev",         diff:"Advanced",     hrs:"5-6", n:"MCP: Advanced Topics",                     url:`${BASE}/model-context-protocol-advanced-topics`,
    desc:"Sampling, notifications, roots, transports, production security.",
    concepts:[
      "Sampling = server requests model completions FROM the client (inverted flow)",
      "Sampling enables server-side AI logic without the server needing its own API key",
      "Notifications = server→client push for real-time state, progress, events",
      "Roots = client declares accessible filesystem paths (explicit security boundary)",
      "WebSockets = bidirectional real-time transport vs SSE polling",
      "stdio transport = subprocess communication for Claude Desktop Extensions",
      "Prompt injection via tool results = primary MCP attack vector — validate all outputs",
      "Production: input validation + rate limiting + auth at tool-call granularity"
    ]},
  { id:"api",           wsjf:8, ov:"high",  track:"Dev",         diff:"Intermediate", hrs:"5-6", n:"Building with the Claude API",             url:`${BASE}/claude-with-the-anthropic-api`,
    desc:"Messages API, tools, streaming, caching, batch, structured outputs.",
    concepts:[
      "Core endpoint: POST /v1/messages — required: model, max_tokens, messages[]",
      "Streaming: stream:true returns SSE text_delta events as tokens generate",
      "Tool use: JSON Schema definitions; Claude calls when relevant; you execute + return results",
      "Prompt caching: cache_control on static prefixes — reduces cost + latency for repeated calls",
      "Batch API: async delivery, 50% cost reduction vs real-time",
      "Structured outputs: guaranteed JSON schema compliance — eliminates parsing errors",
      "Vision: images as base64 or URL in content array alongside text blocks",
      "Files API: upload once → reference by file_id across all subsequent calls",
      "Citations API: character-level references to exact passages in provided documents",
      "Context window: 200K tokens standard; messages array = conversation history"
    ]},
  { id:"ai-fluency",    wsjf:9, ov:"medium",track:"Foundations", diff:"Beginner",     hrs:"3-4", n:"AI Fluency: Framework & Foundations",      url:`${BASE}/ai-fluency-framework-foundations`,
    desc:"4D framework, responsible AI collaboration, oversight, privacy.",
    concepts:[
      "AI Fluency = ability to work with AI effectively, efficiently, ethically, and safely",
      "4D Framework = structured methodology for consistent AI collaboration",
      "Hallucination = AI generating confident but factually incorrect information — always verify",
      "Prompt specificity: Claude follows instructions literally — vague in, vague out",
      "Data privacy: PII + confidential data require verified platform handling policies before input",
      "Appropriate oversight = humans review AI outputs before acting on them",
      "Course co-developed with Univ. College Cork + Ringling College; Creative Commons license",
      "Higher Ed Advisory Board chaired by Rick Levin (former Yale president, former Coursera CEO)"
    ]},
  { id:"bedrock",       wsjf:10,ov:"medium",track:"Enterprise",  diff:"Intermediate", hrs:"4-5", n:"Claude with Amazon Bedrock",               url:`${BASE}/claude-in-amazon-bedrock`,
    desc:"VPC deployment, Guardrails, Knowledge Bases, Agents, IAM.",
    concepts:[
      "Primary advantage: data stays in your AWS VPC — uses existing AWS security + IAM",
      "IAM permission: bedrock:InvokeModel on specific model ARN",
      "Guardrails = infrastructure-level content filtering (PII, topics, harmful content)",
      "Knowledge Bases = managed RAG: Bedrock handles embedding, vector storage, retrieval",
      "Bedrock Agents = managed multi-step orchestration with tool routing + memory",
      "Same per-token pricing as direct API; billed to your AWS account"
    ]},
  { id:"vertex",        wsjf:11,ov:"medium",track:"Enterprise",  diff:"Intermediate", hrs:"4-5", n:"Claude with Google Cloud's Vertex AI",     url:`${BASE}/claude-with-google-vertex`,
    desc:"Model Garden, IAM auth, Grounding, prompt management, data residency.",
    concepts:[
      "Vertex AI Model Garden = GCP's hub for accessing and deploying Claude",
      "Auth: GCP IAM — service accounts or Workload Identity Federation (no Anthropic key needed)",
      "Grounding = connect Claude to Google Search or your data stores for factual accuracy",
      "Prompt management: store, version, share templates as versioned GCP resources",
      "Data residency: GCP region selection controls where data is processed + stored",
      "Batch predictions: async large-scale inference via Vertex batch jobs"
    ]},
  { id:"edu",           wsjf:12,ov:"medium",track:"Foundations", diff:"Intermediate", hrs:"3-4", n:"AI Fluency for Educators",                 url:`${BASE}/ai-fluency-for-educators`,
    desc:"Teaching with AI, curriculum integration, assessment strategies.",
    concepts:[
      "Target: faculty + instructional designers — applying AI in YOUR OWN teaching",
      "Key distinction: this = use AI yourself; Teaching AI Fluency = train others to teach it",
      "Core challenge: assessing authentic student understanding vs AI-generated output",
      "Sequence: instructor fluency → co-creation with students → student-directed use",
      "Academic integrity: design assignments that verify learning, not just output production"
    ]},
  { id:"teach",         wsjf:13,ov:"medium",track:"Foundations", diff:"Advanced",     hrs:"4-5", n:"Teaching AI Fluency",                      url:`${BASE}/teaching-ai-fluency`,
    desc:"Train-the-trainer: assessment design, observable fluency, facilitation.",
    concepts:[
      "Target: instructors who will TRAIN OTHERS in AI fluency (train-the-trainer)",
      "Prerequisites: AI Fluency Foundation + AI Fluency for Educators recommended first",
      "Observable AI fluency: behavioral indicators — tool selection, critical evaluation, transparency",
      "Portfolio-based assessment: captures process + reflection + applied performance",
      "Creative Commons materials: any institution can freely adapt this curriculum",
      "Instructor must demonstrate personal AI fluency before training others"
    ]},
  { id:"students",      wsjf:14,ov:"low",   track:"Foundations", diff:"Beginner",     hrs:"2-3", n:"AI Fluency for Students",                  url:`${BASE}/ai-fluency-for-students`,
    desc:"Academic integrity, fact verification, career planning.",
    concepts:[
      "AI as amplifier: use AI to think better — not to replace your thinking",
      "Academic integrity: disclose AI use per institutional policies",
      "Fact verification: cross-reference AI claims against authoritative sources — AI can be confidently wrong",
      "Career framing: AI fluency = professional differentiator in most fields"
    ]},
  { id:"nonprofits",    wsjf:15,ov:"low",   track:"Foundations", diff:"Beginner",     hrs:"2-3", n:"AI Fluency for Nonprofits",               url:`${BASE}/ai-fluency-for-nonprofits`,
    desc:"Mission alignment, capacity building, beneficiary data ethics.",
    concepts:[
      "Primary framing: time savings = more capacity for mission-critical work (not revenue)",
      "Use cases: grant writing, donor comms, program reporting, volunteer coordination",
      "Mission alignment: AI should serve organizational values, not just save time",
      "Key ethical concern: beneficiary data privacy and bias in programs serving vulnerable populations"
    ]},
];

const STATIC_Q = [
  // Claude Code in Action
  {id:"cc1",c:"cc-action",q:"What does Plan mode do in Claude Code?",o:["Creates a deployment roadmap","Reads + analyzes the codebase without modifying any files","Generates a project plan document","Runs tests without code changes"],a:1,x:"Plan mode = safe exploration. Claude reads and reasons about your codebase to understand scope, but writes nothing. Use before committing to changes."},
  {id:"cc2",c:"cc-action",q:"What is CLAUDE.md?",o:["A changelog for model versions","A project-level instruction file — the persistent system prompt for the codebase","A CLI configuration file","An API key vault"],a:1,x:"CLAUDE.md at project root gives Claude Code persistent context: conventions, architecture patterns, test requirements, forbidden operations. Equivalent to a system prompt for the codebase."},
  {id:"cc3",c:"cc-action",q:"Claude Code Hooks — what are they?",o:["GitHub webhook endpoints","Event-driven automation on lifecycle events: PreToolUse, PostToolUse, Stop, SessionStart","CSS hooks","API callbacks"],a:1,x:"Hooks fire on lifecycle events. PreToolUse = before tool runs (use for approval/blocking). PostToolUse = after execution. Stop = when Claude finishes. Inject logic without modifying prompts."},
  {id:"cc4",c:"cc-action",q:"What does headless mode enable?",o:["Reduced model capabilities","Lower memory usage","Programmatic CLI usage via stdin/flags — no interactive terminal — enables CI/CD and bots","Offline operation"],a:2,x:"Headless = Claude Code as a programmable component. Pipe instructions via stdin, control with flags. Powers GitHub Actions, CI/CD automation, bot workflows."},
  {id:"cc5",c:"cc-action",q:"Git worktrees in Claude Code — primary use case?",o:["Storing Claude's memory","Running parallel Claude Code sessions on different branches simultaneously","Managing binary assets","Repository backup"],a:1,x:"Worktrees create separate checked-out directories per branch. Each runs its own independent Claude Code session — true parallelism."},
  {id:"cc6",c:"cc-action",q:"Which hook fires BEFORE a tool executes?",o:["PostToolUse","ToolInit","PreToolUse","ToolComplete"],a:2,x:"PreToolUse fires before execution — use for validation, approval gates, logging, or blocking."},
  {id:"cc7",c:"cc-action",q:"How does Claude Code create pull requests?",o:["Requires manual git steps","Creates draft PRs only","Generates branch, commits, writes PR description — all from natural language","Needs a separate GitHub Actions step"],a:2,x:"Full PR workflow from one instruction: Claude creates the branch, makes targeted file changes, writes commit messages, and generates a PR description."},
  {id:"cc8",c:"cc-action",q:"What does the VS Code extension add?",o:["More powerful models","Inline editing at cursor + chat sidebar with open-file context + native diff view","Cloud sync","Template library"],a:1,x:"Extension brings Claude Code into your editor flow: inline code edits at cursor, a sidebar chat that reads your open files, diffs in VS Code's diff viewer."},
  // Claude 101
  {id:"c1a",c:"claude-101",q:"Minimum plan required for Projects?",o:["Free","Pro","Team","Enterprise"],a:1,x:"Projects require Pro or above. Free plan supports conversations only."},
  {id:"c1b",c:"claude-101",q:"How does Memory work in Claude.ai?",o:["Only within one conversation","Auto-generated from past conversations; user-editable in Settings > Memory","Users write all entries manually","Enterprise only"],a:1,x:"Memory is background-generated from your conversation history. You can view, edit, add, or delete entries in Settings > Memory."},
  {id:"c1c",c:"claude-101",q:"Memory vs. Projects — key difference?",o:["Same thing","Memory = cross-conversation preferences; Projects = organized workspaces with isolated instructions + knowledge + memory","Projects store files; Memory stores notes","Memory is free; Projects are paid"],a:1,x:"Memory = facts about you across all conversations. Projects = isolated workspaces with their own custom instructions, pinned knowledge files, and separate memory namespace."},
  {id:"c1d",c:"claude-101",q:"Which file type can Claude NOT create?",o:["Word .docx documents","PowerPoint .pptx files","AI-generated images from text descriptions","Excel .xlsx spreadsheets"],a:2,x:"Claude can analyze images but cannot generate AI images. File creation covers docx, pptx, xlsx, pdf, html, svg, markdown."},
  {id:"c1e",c:"claude-101",q:"How is Extended Thinking billed?",o:["Flat monthly add-on","Input tokens","Output tokens — thinking budget consumes output token quota","Free for Pro users"],a:2,x:"Extended thinking tokens are billed at output token rates. You set a thinking budget (max tokens for reasoning)."},
  {id:"c1f",c:"claude-101",q:"What do Connectors provide?",o:["Faster responses","One-click MCP-based integrations to 50+ external services — Claude can take actions","Fine-tuning on your data","Advanced analytics"],a:1,x:"Connectors = curated MCP integrations directory (50+ services). Claude can read, search, create, and take actions."},
  {id:"c1g",c:"claude-101",q:"Artifact types Claude can create?",o:["Text documents only","React/HTML/JS, Markdown, Mermaid, SVG, data visualizations","Images and video","Python only"],a:1,x:"Artifact types: code (React, HTML, JS, Python), documents (Markdown), diagrams (Mermaid), SVG graphics, interactive data visualizations."},
  // Cowork
  {id:"cw1",c:"intro-cowork",q:"Core difference between Cowork and a regular conversation?",o:["Speed","Cowork operates on actual files — not just generating text for you to paste manually","Model power","Plan requirement"],a:1,x:"Cowork is file-level work: Claude reads, writes, and edits your actual project files."},
  {id:"cw2",c:"intro-cowork",q:"What is 'steering' in a Cowork task?",o:["Switching AI models","Providing mid-task feedback to adjust direction without restarting from scratch","Manually editing Claude's output","Running background automation"],a:1,x:"Steering = guidance during execution. While Claude runs a multi-step task, you can redirect without aborting."},
  {id:"cw3",c:"intro-cowork",q:"What are Cowork Plugins?",o:["Browser extensions","MCP server connectors extending Claude's access to external services","Prompt templates","Third-party AI models"],a:1,x:"Plugins = MCP server connectors. They extend what Claude can access during Cowork tasks."},
  {id:"cw4",c:"intro-cowork",q:"Cowork task loop flow?",o:["Prompt → Response → Done","Assign task → Claude works on files → Review → Steer → Repeat until done","Upload → Process → Download","Write → Test → Deploy"],a:1,x:"Iterative loop: assign task on real files → Claude executes → review output → steer if needed → repeat."},
  {id:"cw5",c:"intro-cowork",q:"What are Skills in Cowork?",o:["Pre-trained models","SKILL.md packages Claude auto-applies when it detects a matching task context","Purchased credits","Keyboard shortcuts"],a:1,x:"Skills = SKILL.md instruction packages that activate automatically on task context match."},
  // Agent Skills
  {id:"as1",c:"agent-skills",q:"Required naming format for Skills?",o:["PascalCase","snake_case","Gerund: 'generating-docs' not 'generate-docs'","Imperative"],a:2,x:"Gerund naming is a spec requirement: 'generating-docs', 'debugging-typescript', 'reviewing-prs'. This is not optional style."},
  {id:"as2",c:"agent-skills",q:"What triggers a Skill to activate?",o:["Active file extension","Time-based schedule","Trigger phrases in the skill's description matching current task context","User explicitly invoking by name"],a:2,x:"Trigger phrase density in the description controls activation. Dense, specific phrases give reliable activation."},
  {id:"as3",c:"agent-skills",q:"Purpose of the 500-line soft limit?",o:["Skills can't process files longer than 500 lines","Keep SKILL.md under 500 lines — over that means it's doing too much; split it","Skills time out at 500 lines","Maximum 500 skills installable"],a:1,x:"500 lines = too much scope for one skill. Split into focused skills with distinct trigger patterns."},
  {id:"as4",c:"agent-skills",q:"What is in SKILL.md frontmatter?",o:["API keys","Full instruction content","YAML: name (gerund), description (trigger-rich), version","Trigger phrase list only"],a:2,x:"Frontmatter YAML: name (gerund format), description (with dense trigger phrases), version."},
  {id:"as5",c:"agent-skills",q:"Skills vs. CLAUDE.md — key difference?",o:["Identical purpose","Skills = portable/shareable packages; CLAUDE.md = project-specific, non-distributable","CLAUDE.md is for skills","Skills affect only one project"],a:1,x:"CLAUDE.md lives in your repo, scoped to that codebase. Skills are portable packages installable across any project."},
  {id:"as6",c:"agent-skills",q:"What is progressive disclosure in SKILL.md?",o:["Unlocking premium features","Basic guidance first, advanced patterns deeper in the file","Gradual permission grants","Incremental file loading"],a:1,x:"Structure the skill so basic use cases are handled at the top, advanced edge cases further down."},
  {id:"as7",c:"agent-skills",q:"How are Skills distributed to a team?",o:["Anthropic marketplace only","Email attachment","Zip package → marketplace or direct CLI install","Manual copy into each repo"],a:2,x:"Skills are zipped packages. Install via Claude Code CLI. Works across all projects after single install."},
  // Subagents
  {id:"sa1",c:"subagents",q:"Core problem subagents solve?",o:["API cost reduction","Context window management + task specialization — keeps main agent focused","Network latency","File permissions"],a:1,x:"Complex tasks fill the main agent's context. Subagents handle isolated subtasks in clean contexts."},
  {id:"sa2",c:"subagents",q:"What is the Task tool?",o:["Project management feature","The mechanism for spawning and invoking subagents","A to-do list","GitHub Issues integration"],a:1,x:"Task tool = subagent invocation API. Main agent calls it with a defined task, subagent executes with isolated context."},
  {id:"sa3",c:"subagents",q:"What does context isolation mean for subagents?",o:["Sandboxed network","Each subagent starts with a clean context — no main conversation history inherited","No filesystem access","Encrypted comms"],a:1,x:"Each subagent gets a fresh, empty context. It sees only what you give it for its specific task."},
  {id:"sa4",c:"subagents",q:"Design principle for subagent specialization?",o:["One subagent for everything","One per task type — narrow, well-defined specialization","Max 3 per project","As general as possible"],a:1,x:"Narrow specialization: a 'code-review-agent' optimized for reviews outperforms a generalist."},
  {id:"sa5",c:"subagents",q:"How does parallel subagent execution work?",o:["Multiple API keys required","Git worktrees allow concurrent Claude Code sessions on different branches","Sequential only","Enterprise plan required"],a:1,x:"Git worktrees create separate directory check-outs per branch. Each runs its own independent Claude Code session."},
  // MCP Intro
  {id:"m1",c:"intro-mcp",q:"What does 'USB-C for AI' mean for MCP?",o:["USB hardware requirement","One universal protocol — any AI connects to any MCP tool server","Claude-only standard","Physical cable required"],a:1,x:"USB-C standardized hardware connections. MCP standardizes AI-to-tool connections: one protocol, any compliant AI to any compliant tool."},
  {id:"m2",c:"intro-mcp",q:"MCP's three core primitives?",o:["Read, Write, Execute","Connect, Process, Return","Tools, Resources, Prompts","Input, Transform, Output"],a:2,x:"Tools = actions Claude can invoke. Resources = data sources Claude reads (URI-addressed). Prompts = predefined workflow templates."},
  {id:"m3",c:"intro-mcp",q:"What is an MCP Tool?",o:["Paid Anthropic add-on","Callable function with typed JSON Schema params — Claude decides when to invoke","Pre-built prompt library","Runtime config"],a:1,x:"Tool = function definition: name, description, typed params. Claude reads the description to understand when to call it."},
  {id:"m4",c:"intro-mcp",q:"Standard MCP transport?",o:["WebSockets only","gRPC","HTTP POST (client→server) + SSE (server→client)","GraphQL subscriptions"],a:2,x:"Standard: HTTP POST for Claude calling tools, SSE for server streaming back. Deployable on any HTTP server."},
  {id:"m5",c:"intro-mcp",q:"Python library for building MCP servers?",o:["langchain-mcp","anthropic-tools","FastMCP with @mcp.tool() @mcp.resource() @mcp.prompt() decorators","flask-ai"],a:2,x:"FastMCP uses Python decorators: annotate a function with @mcp.tool() and it's registered as an MCP Tool."},
  {id:"m6",c:"intro-mcp",q:"What is an MCP Resource?",o:["Billing unit","URI-addressed data source Claude can read (file://, db://, custom schemes)","Pricing tier","Cached response"],a:1,x:"Resources are URI-addressed data sources: file:///path/doc.txt, db://table/record, custom://api/endpoint."},
  {id:"m7",c:"intro-mcp",q:"What is capability negotiation in MCP?",o:["API key validation","Initial handshake where client + server agree on supported feature intersection","Billing agreement","Rate limit setup"],a:1,x:"During init, client declares supported capabilities, server does the same. They agree to use the intersection."},
  {id:"m8",c:"intro-mcp",q:"What is an MCP Prompt?",o:["System prompt for Claude","Predefined workflow template the server exposes for common interactions","Pricing tier","Model configuration"],a:1,x:"MCP Prompts = server-defined workflow templates. Named, parameterized interaction patterns clients can invoke."},
  // MCP Advanced
  {id:"ma1",c:"mcp-adv",q:"What is MCP Sampling?",o:["Rate limiting","Server requests model completions FROM the client — inverted flow","Caching mechanism","Load balancing"],a:1,x:"Sampling inverts the direction: MCP server requests AI inference from the client's model. Enables server-side AI logic without the server needing its own API key."},
  {id:"ma2",c:"mcp-adv",q:"What are MCP Notifications?",o:["Email alerts","Server→client push for real-time state changes, progress, events","Billing alerts","Error logs"],a:1,x:"Notifications = server-initiated push messages. 'Task 45% complete', 'new resource available', 'job finished'. No polling."},
  {id:"ma3",c:"mcp-adv",q:"What does the 'roots' capability provide?",o:["Root server access","Client declares accessible filesystem paths — explicit security boundary","Admin permissions","URL config"],a:1,x:"Roots = client-declared filesystem boundaries. The server can't operate outside declared roots."},
  {id:"ma4",c:"mcp-adv",q:"Transport enabling bidirectional real-time MCP?",o:["HTTP long polling","FTP","WebSockets","REST callbacks"],a:2,x:"WebSockets = full-duplex, any-time messaging from either side without polling."},
  {id:"ma5",c:"mcp-adv",q:"Primary MCP security vulnerability?",o:["SQL injection","Prompt injection via tool results — malicious tool output designed to hijack model behavior","CORS violations","JWT expiration"],a:1,x:"Prompt injection via tool results: a compromised tool returns content designed to change Claude's behavior. Validate and sanitize all tool outputs."},
  {id:"ma6",c:"mcp-adv",q:"Transport used by Claude Desktop Extensions?",o:["HTTP/SSE","WebSockets","stdio — subprocess communication via stdin/stdout","gRPC"],a:2,x:"Desktop Extensions use stdio: each runs as a local subprocess. Claude Desktop spawns it, communicates via stdin/stdout."},
  // API
  {id:"api1",c:"api",q:"Core Claude API endpoint?",o:["POST /v1/completions","GET /v1/chat","POST /v1/messages","POST /v1/generate"],a:2,x:"POST /v1/messages — required: model, max_tokens, messages[]. The messages array maintains conversation history."},
  {id:"api2",c:"api",q:"How does streaming work?",o:["WebSocket connection","Polling /v1/stream","Set stream:true — API returns SSE text_delta events","Special HTTP header"],a:2,x:"stream:true switches from JSON response to SSE stream of events. Both Python and TypeScript SDKs support native stream iteration."},
  {id:"api3",c:"api",q:"What does Prompt Caching do?",o:["Stores prompts in database","Marks static prefixes with cache_control — reuses computation, reducing cost + latency","Pre-loads model weights","Saves conversation history"],a:1,x:"cache_control on static sections (system prompt, docs, examples) tells Claude to cache that computation."},
  {id:"api4",c:"api",q:"Batch API cost advantage?",o:["10%","25%","50% reduction vs real-time","Free for Enterprise"],a:2,x:"50% cost reduction for async delivery. Best for offline workloads, evaluations, bulk content generation."},
  {id:"api5",c:"api",q:"What are Structured Outputs?",o:["Formatted console logs","Guaranteed JSON schema compliance — response will match the schema you specify","HTML templates","Markdown rules"],a:1,x:"Structured Outputs = schema guarantee. Specify a JSON Schema, Claude's response conforms to it exactly."},
  {id:"api6",c:"api",q:"Files API benefit?",o:["Streaming large uploads","Upload once → reference by file_id across calls without re-sending bytes","Shared storage between users","Version control"],a:1,x:"file_id persists across calls. Upload a PDF once, use its ID in any subsequent API call."},
  {id:"api7",c:"api",q:"How are images passed to the API?",o:["URL query params","Separate image endpoint","Base64 or URL in content array alongside text blocks","HTTP multipart form"],a:2,x:"Images go in the content array as image blocks: {type:'image', source:{type:'base64',...}} or type:'url'."},
  {id:"api8",c:"api",q:"What does tool_choice:'any' do?",o:["Claude can optionally use tools","Disables all tools","Claude MUST use at least one of the provided tools","Claude must call all tools"],a:2,x:"tool_choice:'any' forces at least one tool call. 'auto' = Claude decides. Use 'any' for guaranteed extraction."},
  {id:"api9",c:"api",q:"Standard Claude context window?",o:["32K","128K","200K","500K"],a:2,x:"200K tokens standard — approximately 150K words or 500 pages. Some models in beta for 1M token contexts."},
  {id:"api10",c:"api",q:"What does the Citations API return?",o:["Web source URLs","APA bibliography entries","Character-level offsets pointing to exact passages in documents you provided","Numbered footnotes"],a:2,x:"Character-level references into your provided documents — not web URLs. For RAG apps needing auditable source attribution."},
  // AI Fluency
  {id:"af1",c:"ai-fluency",q:"What is AI Fluency?",o:["Expertise in building AI systems","Ability to work with AI effectively, efficiently, ethically, and safely","Achieving benchmark scores","Managing AI infrastructure"],a:1,x:"4 dimensions: Effective (desired outputs), Efficient (minimal unnecessary iterations), Ethical (appropriate use + privacy), Safe (appropriate human oversight)."},
  {id:"af2",c:"ai-fluency",q:"Why does prompt specificity matter?",o:["Reduces API costs","Claude follows instructions literally — vague input, vague output","Faster responses","Prevents hallucination entirely"],a:1,x:"Claude is instruction-following by design. Vague prompts force Claude to fill gaps with its own judgment."},
  {id:"af3",c:"ai-fluency",q:"What is hallucination in LLMs?",o:["AI infinite loop","Generating confident but factually incorrect information","Misunderstood command","Unexpectedly long responses"],a:1,x:"Structural property of LLMs: probabilistic generation can produce confident, well-structured, completely false information."},
  {id:"af4",c:"ai-fluency",q:"Data you should NOT input without verifying platform policies?",o:["Meeting notes","Public website content","PII and confidential business data","Your own code"],a:2,x:"PII and confidential data require verified data handling policies. Check: data residency, retention, training on your data."},
  {id:"af5",c:"ai-fluency",q:"Who chairs the Higher Ed Advisory Board?",o:["Sam Altman","Jensen Huang","Rick Levin (former Yale president, former Coursera CEO)","Bill Gates"],a:2,x:"Rick Levin's appointment signals Anthropic is building Academy as educational infrastructure."},
  {id:"af6",c:"ai-fluency",q:"License for AI Fluency course materials?",o:["All rights reserved","MIT License","Creative Commons — freely adaptable by any institution","Commercial only"],a:2,x:"Creative Commons. Any institution can adapt and use the materials freely."},
  // Bedrock
  {id:"bk1",c:"bedrock",q:"Primary enterprise advantage of Bedrock?",o:["Lower per-token cost","Larger context windows","Data stays in your AWS VPC — uses existing AWS security + IAM","Faster responses"],a:2,x:"Data residency in your AWS infrastructure. Existing security posture, compliance frameworks, and IAM all apply."},
  {id:"bk2",c:"bedrock",q:"Required IAM permission for Claude on Bedrock?",o:["iam:GetRole","s3:GetObject","bedrock:InvokeModel on the specific model ARN","ec2:RunInstances"],a:2,x:"bedrock:InvokeModel (or ...WithResponseStream for streaming) on the Claude model ARN."},
  {id:"bk3",c:"bedrock",q:"What are Bedrock Guardrails?",o:["AWS network firewall","Infrastructure-level content filtering (PII, topics, harmful content) — independent of prompting","API rate limits","Encryption settings"],a:1,x:"Guardrails = infrastructure-layer policy enforcement. Applied to inputs and outputs based on rules you configure."},
  {id:"bk4",c:"bedrock",q:"What are Bedrock Knowledge Bases?",o:["AWS documentation","Managed RAG: Bedrock handles embedding, vector storage, and retrieval for your private docs","Employee handbooks","Prompt libraries"],a:1,x:"Knowledge Bases = managed RAG pipeline. Bedrock ingests your documents, embeds them, stores in vector DB."},
  {id:"bk5",c:"bedrock",q:"Bedrock pricing vs. direct Anthropic API?",o:["Always cheaper","Always more expensive","Same per-token pricing; billing goes to your AWS account","Flat monthly subscription"],a:2,x:"Same per-token model pricing. Difference is billing (AWS account vs Anthropic account)."},
  {id:"bk6",c:"bedrock",q:"What are Bedrock Agents?",o:["Human oversight agents","Managed multi-step orchestration with tool routing + memory + knowledge base integration","Lambda aliases","Cost dashboards"],a:1,x:"Bedrock Agents = managed agentic layer. Define action groups (tools), connect knowledge bases, Bedrock handles orchestration."},
  // Vertex
  {id:"vx1",c:"vertex",q:"What is the Vertex AI Model Garden?",o:["Garden-themed demo","GCP's hub for accessing and deploying foundation models including Claude","AI training data marketplace","Visual prompt builder"],a:1,x:"Model Garden = GCP's unified catalog for foundation models. Find Claude, configure deployment, get API endpoints."},
  {id:"vx2",c:"vertex",q:"Authentication for Claude on Vertex AI?",o:["Anthropic API key","Username/password","GCP IAM — service accounts or Workload Identity Federation","GitHub OAuth"],a:2,x:"GCP IAM. Service accounts (JSON key) or Workload Identity Federation (for GKE/Cloud Run). No separate Anthropic API key."},
  {id:"vx3",c:"vertex",q:"What is Grounding in Vertex AI?",o:["Model training on your data","Fine-tuning","Connect Claude to Google Search or your data stores for factual accuracy","Output encryption"],a:2,x:"Grounding connects responses to authoritative sources: Google Search or your own Vertex AI data stores."},
  {id:"vx4",c:"vertex",q:"Data residency advantage of Vertex AI?",o:["Always US-only","No controls exist","GCP region selection ensures data processing stays within geographic boundaries","Always global network"],a:2,x:"Select a GCP region and data processing + storage stays within that region's boundaries. Critical for GDPR compliance."},
  {id:"vx5",c:"vertex",q:"What is Vertex AI prompt management?",o:["Auto-optimizing prompts","Store, version, share prompt templates with API deployment — team collaboration feature","Grammar validation","Encryption at rest"],a:1,x:"Prompt templates stored as versioned GCP resources. Test in console, deploy as API endpoints, share across teams."},
  // Educators
  {id:"edu1",c:"edu",q:"AI Fluency for Educators vs. Teaching AI Fluency — difference?",o:["Identical content","For Educators = apply AI in YOUR teaching; Teaching = train others to teach it","Difficulty difference only","Grade level difference"],a:1,x:"Critical distinction: For Educators = you use AI in your teaching practice. Teaching AI Fluency = you train other instructors."},
  {id:"edu2",c:"edu",q:"Core AI challenge for academic assessment?",o:["AI grading unreliable","Distinguishing AI-generated outputs from authentic student understanding","AI tools too expensive","Students won't use AI"],a:1,x:"Assessment integrity: traditional assignments completable by AI without student understanding."},
  {id:"edu3",c:"edu",q:"Recommended AI curriculum integration sequence?",o:["All at once","Students first","Instructor fluency → co-creation with students → student-directed use","Ban first, permit gradually"],a:2,x:"Instructor fluency must precede student guidance. Build your own AI practice first, then design AI-collaborative assignments."},
  // Teaching AI Fluency
  {id:"taf1",c:"teach",q:"Prerequisites for Teaching AI Fluency?",o:["None","Building with the Claude API","AI Fluency Foundation + AI Fluency for Educators","Just this course"],a:2,x:"You must have personal AI fluency before teaching it. Path: Foundation → For Educators → Teaching AI Fluency."},
  {id:"taf2",c:"teach",q:"What is observable AI fluency?",o:["AI benchmark scores","Number of tools used","Behavioral indicators: appropriate tool selection, critical evaluation, transparent use","Task completion speed"],a:2,x:"Observable = behavioral. Can you see them choosing appropriate tools? Critically evaluating outputs? These behaviors are assessable."},
  {id:"taf3",c:"teach",q:"Recommended assessment method for AI fluency?",o:["Multiple choice only","Timed coding challenges","Portfolio: process documentation, reflection, applied performance evidence","Peer-graded essays"],a:2,x:"Portfolio captures what tests miss: process of AI collaboration decisions, critical thinking about outputs."},
  {id:"taf4",c:"teach",q:"License for Anthropic Academy AI Fluency materials?",o:["All rights reserved","MIT License","Creative Commons — any institution can freely adapt them","Commercial only"],a:2,x:"Creative Commons. Any institution can adapt the curriculum freely."},
  // Students
  {id:"stu1",c:"students",q:"Core ethical principle for AI in academic work?",o:["Hide AI use","Use AI to think better, not outsource thinking; disclose per institutional policy","AI can write everything if reviewed","Research only, not writing"],a:1,x:"AI as amplifier: use it to think faster, iterate better, research broader — but understanding and authentic voice are yours."},
  {id:"stu2",c:"students",q:"How should students treat AI-generated facts?",o:["Trust — usually accurate","Ignore — unreliable","Cross-reference against authoritative sources — AI can be confidently wrong","Use for opinions only"],a:2,x:"AI generates plausible text, not verified facts. Verify against primary sources for any specific factual claim."},
  // Nonprofits
  {id:"npo1",c:"nonprofits",q:"Primary ROI framing for AI at nonprofits?",o:["Revenue from new services","Staff time savings → more capacity for mission-critical work","Technology prestige","Grant eligibility"],a:1,x:"Nonprofit AI ROI = capacity, not profit. Hours freed from operational overhead = more direct program delivery."},
  {id:"npo2",c:"nonprofits",q:"Unique ethical concern for nonprofit AI?",o:["No ethics concerns","Beneficiary data privacy, donor trust, potential bias in programs serving vulnerable populations","All nonprofit AI is ethical by definition","Government nonprofits only"],a:1,x:"Nonprofits often serve vulnerable populations. AI processing beneficiary data requires heightened review."},
];

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORE = "aa-cmd-v3";

const defaultState = () => ({
  status: {},      // courseId → "wip" | "done"
  certLog: [],     // [{cid, name, date}]
  genBank: [],     // extra generated questions
  quizScores: [],  // [{date, cid, score, total}]
});

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  bg: "#0c1117",
  surface: "#141b24",
  card: "#1a2332",
  border: "#233044",
  borderLight: "#2d3f57",
  text: "#e2e8f0",
  muted: "#94a3b8",
  dim: "#5a7090",
  accent: "#c084fc",
  accentBg: "rgba(192,132,252,0.1)",
  success: "#34d399",
  successBg: "rgba(52,211,153,0.1)",
  warning: "#fbbf24",
  warningBg: "rgba(251,191,36,0.1)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.1)",
  info: "#60a5fa",
  infoBg: "rgba(96,165,250,0.1)",
  orange: "#fb923c",
  font: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', 'Fira Code', monospace",
};

// ─── TINY COMPONENTS ─────────────────────────────────────────────────────────

const Badge = ({ children, type = "neutral" }) => {
  const map = {
    neutral: { bg: S.card, color: S.muted },
    success: { bg: S.successBg, color: S.success },
    warning: { bg: S.warningBg, color: S.warning },
    danger:  { bg: S.dangerBg,  color: S.danger  },
    info:    { bg: S.infoBg,    color: S.info    },
    accent:  { bg: S.accentBg,  color: S.accent  },
  };
  const { bg, color } = map[type] || map.neutral;
  return (
    <span style={{ display:"inline-block", padding:"2px 7px", borderRadius:4, background:bg, color, fontSize:10, fontFamily:S.mono, fontWeight:600, letterSpacing:"0.5px", lineHeight:"18px" }}>
      {children}
    </span>
  );
};

const Btn = ({ children, onClick, variant="ghost", small=false, disabled=false, style={} }) => {
  const base = {
    padding: small ? "5px 10px" : "7px 14px",
    borderRadius: 6, cursor: disabled ? "default" : "pointer",
    fontSize: small ? 11 : 12, fontFamily: S.mono, fontWeight: 500,
    display:"inline-flex", alignItems:"center", gap:5,
    transition:"all 0.15s", opacity: disabled ? 0.45 : 1,
    border:"none", ...style,
  };
  if (variant === "primary")   return <button disabled={disabled} onClick={onClick} style={{ ...base, background: S.accent, color:"#1a0033" }}>{children}</button>;
  if (variant === "success")   return <button disabled={disabled} onClick={onClick} style={{ ...base, background: S.successBg, color: S.success, border:`1px solid ${S.success}44` }}>{children}</button>;
  return <button disabled={disabled} onClick={onClick} style={{ ...base, background:"transparent", color: S.muted, border:`1px solid ${S.border}` }}>{children}</button>;
};

const Card = ({ children, style={} }) => (
  <div style={{ background: S.card, border:`1px solid ${S.border}`, borderRadius:10, padding:"16px 18px", ...style }}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize:10, fontFamily:S.mono, color:S.dim, letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>
    {children}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AcademyCmdCenter() {
  const [tab, setTab] = useState("dash");
  const [state, setState] = useState(defaultState());
  const [studyCourse, setStudyCourse] = useState(null);
  const [quizCtx, setQuizCtx] = useState(null);      // {pool, idx, answered, correctCount, done, cid}
  const [speedCtx, setSpeedCtx] = useState(null);    // {pool, idx, wrong, done}
  const [speedSec, setSpeedSec] = useState(10);
  const [genTopic, setGenTopic] = useState("");
  const [genCid, setGenCid] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genPreview, setGenPreview] = useState([]);
  const timerRef = useRef(null);

  // ── persistence ──
  useEffect(() => {
    (async () => {
      try {
        const s = await window.storage.get(STORE);
        if (s?.value) setState(JSON.parse(s.value));
      } catch {}
    })();
  }, []);

  const save = useCallback(async (next) => {
    setState(next);
    try { await window.storage.set(STORE, JSON.stringify(next)); } catch {}
  }, []);

  // ── derived ──
  const allQ = [...STATIC_Q, ...state.genBank];
  const completed = COURSES.filter(c => state.status[c.id] === "done").length;
  const inProg    = COURSES.filter(c => state.status[c.id] === "wip").length;
  const queue     = [...COURSES].sort((a,b) => a.wsjf - b.wsjf).filter(c => state.status[c.id] !== "done");

  // ── status helpers — functional setState avoids stale-closure clobber ──
  const persist = (next) => { try { window.storage.set(STORE, JSON.stringify(next)); } catch {} };

  const setStatus = (cid, st) => {
    setState(prev => {
      const next = { ...prev, status: { ...prev.status, [cid]: st } };
      persist(next); return next;
    });
  };

  const logCert = (cid) => {
    const course = COURSES.find(c => c.id === cid);
    if (!course) return;
    setState(prev => {
      if (prev.certLog.find(l => l.cid === cid)) return prev;
      const next = { ...prev, certLog: [...prev.certLog, { cid, name: course.n, date: new Date().toLocaleDateString() }] };
      persist(next); return next;
    });
  };

  // ── quiz ──
  const startQuiz = (cid = null) => {
    const pool = (cid ? allQ.filter(q => q.c === cid) : [...allQ])
      .sort(() => Math.random() - 0.5).slice(0, Math.min(10, allQ.length));
    if (!pool.length) return;
    setQuizCtx({ pool, idx: 0, answered: null, correctCount: 0, done: false, cid });
    setTab("quiz");
  };

  const answerQuiz = (i) => {
    if (!quizCtx || quizCtx.answered !== null) return;
    const correct = i === quizCtx.pool[quizCtx.idx].a;
    setQuizCtx(q => ({ ...q, answered: i, correctCount: q.correctCount + (correct ? 1 : 0) }));
  };

  const nextQ = () => {
    if (!quizCtx) return;
    const nextIdx = quizCtx.idx + 1;
    if (nextIdx >= quizCtx.pool.length) {
      const finalScore = Math.round(quizCtx.correctCount / quizCtx.pool.length * 100);
      setState(prev => {
        const next = { ...prev, quizScores: [...prev.quizScores, { date: new Date().toLocaleDateString(), cid: quizCtx.cid, score: finalScore, total: quizCtx.pool.length }] };
        persist(next); return next;
      });
      setQuizCtx(q => ({ ...q, done: true }));
    } else {
      setQuizCtx(q => ({ ...q, idx: nextIdx, answered: null }));
    }
  };

  // ── speed run ──
  const startSpeed = (cid = null) => {
    const pool = (cid ? allQ.filter(q => q.c === cid) : [...allQ])
      .sort(() => Math.random() - 0.5).slice(0, Math.min(15, allQ.length));
    if (!pool.length) return;
    setSpeedCtx({ pool, idx: 0, wrong: [], done: false, cid });
    setSpeedSec(10);
    setTab("speed");
  };

  useEffect(() => {
    if (tab !== "speed" || !speedCtx || speedCtx.done) { clearInterval(timerRef.current); return; }
    clearInterval(timerRef.current);
    setSpeedSec(10);
    timerRef.current = setInterval(() => {
      setSpeedSec(t => {
        if (t <= 1) {
          setSpeedCtx(s => {
            if (!s || s.done) return s;
            const wrong = [...s.wrong, s.pool[s.idx]];
            const nextIdx = s.idx + 1;
            return nextIdx >= s.pool.length ? { ...s, wrong, done: true } : { ...s, idx: nextIdx, wrong };
          });
          return 10;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [speedCtx?.idx, tab]);

  const answerSpeed = (i) => {
    if (!speedCtx || speedCtx.done) return;
    clearInterval(timerRef.current);
    const q = speedCtx.pool[speedCtx.idx];
    const wrong = i === q.a ? speedCtx.wrong : [...speedCtx.wrong, q];
    const nextIdx = speedCtx.idx + 1;
    setSpeedCtx(nextIdx >= speedCtx.pool.length
      ? { ...speedCtx, wrong, done: true }
      : { ...speedCtx, idx: nextIdx, wrong });
    setSpeedSec(10);
  };

  // ── AI generator ──
  const generateQs = async () => {
    if (!genTopic.trim()) return;
    setGenLoading(true); setGenPreview([]);
    try {
      const cn = genCid ? COURSES.find(c => c.id === genCid)?.n || genCid : "Anthropic Academy (all courses)";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `You are an exam prep assistant for Anthropic Academy certifications.\n\nCourse: ${cn}\nTopic: ${genTopic}\n\nGenerate 5 exam-quality multiple-choice questions. Focus on practical application and specific details — not just definitions. Common misconceptions and edge cases are ideal.\n\nReturn ONLY a JSON array (no markdown, no preamble):\n[{"q":"question","o":["A","B","C","D"],"a":0,"x":"explanation of correct answer"}]\n\n"a" = 0-indexed correct answer. Make distractors plausible.`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "[]";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setGenPreview(parsed.map((q, i) => ({ ...q, id: `gen_${Date.now()}_${i}`, c: genCid || "all" })));
    } catch (e) {
      setGenPreview([{ q: "Error generating questions. Try again.", o: ["Retry"], a: 0, x: String(e), id: "err", c: "all" }]);
    }
    setGenLoading(false);
  };

  const saveGenQs = () => {
    const toSave = [...genPreview];
    setState(prev => {
      const next = { ...prev, genBank: [...prev.genBank, ...toSave] };
      persist(next); return next;
    });
    setGenPreview([]); setGenTopic("");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const ovType  = (ov) => ov === "high" ? "success" : ov === "medium" ? "warning" : "neutral";
  const diffType= (d)  => d === "Advanced" ? "danger" : d === "Intermediate" ? "warning" : "info";
  const trackType=(t)  => t === "Dev" ? "info" : t === "Enterprise" ? "warning" : "neutral";

  // ── TABS ──
  const TABS = [
    { k:"dash",   label:"Dashboard" },
    { k:"study",  label:"Study" },
    { k:"quiz",   label:"Quiz" },
    { k:"speed",  label:"Speed run" },
    { k:"gen",    label:"AI generator" },
    { k:"proof",  label:"Proof log" },
  ];

  // ── DASHBOARD ──
  const DashTab = () => {
    const avgScore = state.quizScores.length
      ? Math.round(state.quizScores.reduce((s,e) => s+e.score, 0) / state.quizScores.length)
      : null;
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10, marginBottom:18 }}>
          {[
            { label:"Completed",   value:`${completed}/${COURSES.length}`, color: S.success },
            { label:"In Progress", value:inProg,                           color: S.warning },
            { label:"Quiz pool",   value:allQ.length,                      color: S.info    },
            { label:"Avg score",   value:avgScore !== null ? `${avgScore}%` : "—", color: avgScore >= 80 ? S.success : avgScore >= 60 ? S.warning : S.danger },
          ].map((m,i) => (
            <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:8, padding:"14px 16px" }}>
              <div style={{ fontSize:10, fontFamily:S.mono, color:S.dim, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>{m.label}</div>
              <div style={{ fontSize:26, fontWeight:700, fontFamily:S.mono, color:m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <Card style={{ marginBottom:14 }}>
          <Label>WSJF study queue — {queue.length} remaining</Label>
          {queue.slice(0,8).map(c => (
            <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${S.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                <span style={{ fontSize:10, fontFamily:S.mono, color:S.dim, minWidth:20 }}>#{c.wsjf}</span>
                <span style={{ fontSize:13, color:S.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</span>
                <Badge type={ovType(c.ov)}>{c.ov}</Badge>
                <Badge type={trackType(c.track)}>{c.track}</Badge>
              </div>
              <div style={{ display:"flex", gap:5, marginLeft:10 }}>
                <Btn small onClick={() => { setStudyCourse(c.id); setTab("study"); }}>study</Btn>
                <Btn small onClick={() => startQuiz(c.id)}>quiz</Btn>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Card>
            <Label>Quick actions</Label>
            <Btn style={{ width:"100%", marginBottom:6, justifyContent:"flex-start" }} onClick={() => startQuiz()}>▶ Practice all ({allQ.length}Q)</Btn>
            <Btn style={{ width:"100%", marginBottom:6, justifyContent:"flex-start" }} onClick={() => startSpeed()}>⚡ Speed run all</Btn>
            <Btn style={{ width:"100%", justifyContent:"flex-start" }} onClick={() => setTab("gen")}>✦ Generate new questions</Btn>
          </Card>
          <Card>
            <Label>Certified</Label>
            {completed === 0
              ? <div style={{ fontSize:12, color:S.dim }}>No courses completed yet.</div>
              : COURSES.filter(c => state.status[c.id] === "done").map(c => (
                  <div key={c.id} style={{ fontSize:12, color:S.success, fontFamily:S.mono, padding:"2px 0" }}>✓ {c.n}</div>
                ))
            }
          </Card>
        </div>

        {state.quizScores.length > 0 && (
          <Card style={{ marginTop:14 }}>
            <Label>Recent quiz results</Label>
            {state.quizScores.slice(-6).reverse().map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${S.border}`, fontSize:12 }}>
                <span style={{ color:S.muted, fontFamily:S.mono }}>{r.date} · {r.total}Q{r.cid ? ` · ${COURSES.find(c=>c.id===r.cid)?.n||r.cid}` : " · all"}</span>
                <span style={{ fontFamily:S.mono, fontWeight:700, color: r.score >= 80 ? S.success : r.score >= 60 ? S.warning : S.danger }}>{r.score}%</span>
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  };

  // ── STUDY ──
  const StudyTab = () => {
    const active = studyCourse ? COURSES.find(c => c.id === studyCourse) : null;
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:8, marginBottom:16 }}>
          {COURSES.map(c => {
            const st = state.status[c.id];
            const isSel = studyCourse === c.id;
            return (
              <div key={c.id}
                onClick={() => setStudyCourse(c.id)}
                style={{
                  background: isSel ? S.accentBg : S.surface,
                  border: `1px solid ${isSel ? S.accent : S.border}`,
                  borderRadius:8, padding:"11px 13px", cursor:"pointer",
                  transition:"all 0.15s",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <Badge>{`#${c.wsjf}`}</Badge>
                  <Badge type={ovType(c.ov)}>{c.ov}</Badge>
                </div>
                <div style={{ fontSize:12, fontWeight:500, color: isSel ? S.accent : S.text, lineHeight:1.4, marginBottom:6 }}>{c.n}</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  <Badge type={diffType(c.diff)}>{c.diff}</Badge>
                  <Badge type="neutral">{c.hrs}h</Badge>
                  {st === "done" && <Badge type="success">✓</Badge>}
                  {st === "wip"  && <Badge type="warning">wip</Badge>}
                </div>
              </div>
            );
          })}
        </div>

        {active && (
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <h2 style={{ fontSize:15, fontWeight:600, color:S.text, margin:"0 0 8px" }}>{active.n}</h2>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Badge type={diffType(active.diff)}>{active.diff}</Badge>
                  <Badge type={trackType(active.track)}>{active.track}</Badge>
                  <Badge type="neutral">{active.hrs}h</Badge>
                  <Badge type={ovType(active.ov)}>overlap: {active.ov}</Badge>
                  <Badge type="success">✓ AI permitted during assessment</Badge>
                </div>
              </div>
              <a href={active.url} target="_blank" rel="noreferrer"
                style={{ fontSize:11, fontFamily:S.mono, color:S.info, textDecoration:"none", marginLeft:12, whiteSpace:"nowrap" }}>
                → Skilljar
              </a>
            </div>

            <div style={{ fontSize:12, color:S.muted, marginBottom:10 }}>{active.desc}</div>

            <Label>key concepts — what's tested</Label>
            {active.concepts.map((concept, i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"7px 10px", background:S.bg, borderRadius:6, marginBottom:5 }}>
                <span style={{ fontSize:10, fontFamily:S.mono, color:S.accent, minWidth:20, paddingTop:2 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontSize:13, color:S.text, lineHeight:1.6 }}>{concept}</span>
              </div>
            ))}

            <div style={{ marginTop:16, padding:"12px 14px", background:S.bg, borderRadius:8, border:`1px solid ${S.successBg}` }}>
              <div style={{ fontSize:10, fontFamily:S.mono, color:S.success, letterSpacing:"1px", marginBottom:8 }}>EXAM-TIME AI PROMPTS — USE DURING THE ACTUAL ASSESSMENT</div>
              <div style={{ fontSize:12, color:S.dim, marginBottom:10 }}>Skilljar allows open-book, open-AI. If you hit an unfamiliar question, fire one of these at Claude:</div>
              {[
                `In the Anthropic Academy ${active.n} course, explain [paste question concept] in plain English with a concrete example.`,
                `For the Anthropic ${active.n} assessment: what is the correct answer to this and why: [paste question]`,
                `Compare and contrast these two options from an Anthropic Academy question about ${active.track === "Dev" ? "Claude Code / the API" : active.track === "Enterprise" ? "enterprise deployment" : "AI fluency"}: [paste options]`,
              ].map((p, i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:6, padding:"6px 10px", background:S.surface, borderRadius:6, border:`1px solid ${S.border}` }}>
                  <span style={{ fontSize:10, fontFamily:S.mono, color:S.success, minWidth:14, paddingTop:1 }}>{i+1}</span>
                  <span style={{ fontSize:11, fontFamily:S.mono, color:S.muted, lineHeight:1.65 }}>{p}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:14 }}>
              <Btn onClick={() => startQuiz(active.id)}>▶ Quiz this course</Btn>
              <Btn onClick={() => startSpeed(active.id)}>⚡ Speed run</Btn>
              <Btn onClick={() => setStatus(active.id, "wip")}>Mark in progress</Btn>
              <Btn variant="success" onClick={() => setStatus(active.id, "done")}>✓ Mark complete</Btn>
              {state.status[active.id] === "done" && !state.certLog.find(l=>l.cid===active.id) &&
                <Btn variant="success" onClick={() => { logCert(active.id); setTab("proof"); }}>Log certificate →</Btn>
              }
            </div>
          </Card>
        )}
      </div>
    );
  };

  // ── QUIZ ──
  const QuizTab = () => {
    if (!quizCtx) return (
      <div>
        <div style={{ fontSize:13, color:S.muted, marginBottom:14 }}>Select a course or quiz all questions:</div>
        <Btn style={{ marginBottom:8, marginRight:6 }} onClick={() => startQuiz()}>All courses ({allQ.length}Q)</Btn>
        {COURSES.map(c => (
          <Btn key={c.id} style={{ marginBottom:6, marginRight:6 }} onClick={() => startQuiz(c.id)}>{c.n}</Btn>
        ))}
      </div>
    );

    if (quizCtx.done) {
      const score = Math.round(quizCtx.correctCount / quizCtx.pool.length * 100);
      return (
        <div style={{ maxWidth:520 }}>
          <Card style={{ textAlign:"center", marginBottom:16, padding:"28px" }}>
            <div style={{ fontSize:52, fontWeight:700, fontFamily:S.mono, color: score >= 80 ? S.success : score >= 60 ? S.warning : S.danger, marginBottom:8 }}>
              {score}%
            </div>
            <div style={{ fontSize:13, color:S.muted }}>{quizCtx.correctCount}/{quizCtx.pool.length} correct</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:16 }}>
              <Btn onClick={() => startQuiz(quizCtx.cid)}>↺ Retry</Btn>
              <Btn onClick={() => setQuizCtx(null)}>← Pick another</Btn>
              <Btn onClick={() => setTab("dash")}>Dashboard</Btn>
            </div>
          </Card>
        </div>
      );
    }

    const q = quizCtx.pool[quizCtx.idx];
    const answered = quizCtx.answered !== null;
    const isCorrect = quizCtx.answered === q.a;

    return (
      <div style={{ maxWidth:540 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, fontSize:12, fontFamily:S.mono }}>
          <span style={{ color:S.dim }}>{quizCtx.idx + 1} / {quizCtx.pool.length}</span>
          <span style={{ color:S.success }}>{quizCtx.correctCount} correct</span>
        </div>

        <Card style={{ marginBottom:12 }}>
          <div style={{ fontSize:14, lineHeight:1.65, color:S.text, marginBottom:16 }}>{q.q}</div>
          {q.o.map((opt, i) => {
            let bg = S.surface, border = S.border, color = S.muted;
            if (answered) {
              if (i === q.a)                         { bg = S.successBg; border = S.success + "66"; color = S.success; }
              else if (i === quizCtx.answered && i !== q.a) { bg = S.dangerBg;  border = S.danger  + "66"; color = S.danger;  }
            }
            return (
              <button key={i}
                disabled={answered}
                onClick={() => answerQuiz(i)}
                style={{
                  width:"100%", padding:"10px 14px", borderRadius:6,
                  border:`1px solid ${border}`, background:bg, color,
                  fontSize:13, textAlign:"left", cursor:answered?"default":"pointer",
                  fontFamily:S.font, lineHeight:1.5, marginBottom:7, transition:"all 0.1s",
                }}>
                {opt}
              </button>
            );
          })}
        </Card>

        {answered && (
          <Card style={{ borderColor: isCorrect ? S.success + "44" : S.danger + "44" }}>
            <div style={{ fontSize:11, fontFamily:S.mono, color: isCorrect ? S.success : S.danger, marginBottom:6 }}>
              {isCorrect ? "✓ Correct" : `✗ Incorrect — answer: ${q.o[q.a]}`}
            </div>
            <div style={{ fontSize:13, color:S.muted, lineHeight:1.65, marginBottom:12 }}>{q.x}</div>
            <Btn onClick={nextQ} style={{ color:S.info }}>
              {quizCtx.idx + 1 >= quizCtx.pool.length ? "See results →" : "Next →"}
            </Btn>
          </Card>
        )}
      </div>
    );
  };

  // ── SPEED RUN ──
  const SpeedTab = () => {
    if (!speedCtx) return (
      <div>
        <div style={{ fontSize:13, color:S.muted, marginBottom:6 }}>10 seconds per question. Timeout = wrong.</div>
        <Btn style={{ marginBottom:8, marginRight:6 }} onClick={() => startSpeed()}>All courses</Btn>
        {COURSES.map(c => (
          <Btn key={c.id} style={{ marginBottom:6, marginRight:6 }} onClick={() => startSpeed(c.id)}>{c.n}</Btn>
        ))}
      </div>
    );

    if (speedCtx.done) {
      const total = speedCtx.pool.length;
      const correct = total - speedCtx.wrong.length;
      const score = Math.round(correct / total * 100);
      return (
        <div style={{ maxWidth:520 }}>
          <Card style={{ textAlign:"center", marginBottom:16, padding:"28px" }}>
            <div style={{ fontSize:52, fontWeight:700, fontFamily:S.mono, color: score >= 80 ? S.success : score >= 60 ? S.warning : S.danger, marginBottom:8 }}>
              {score}%
            </div>
            <div style={{ fontSize:13, color:S.muted }}>{correct}/{total} correct · {speedCtx.wrong.length} missed</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:16 }}>
              <Btn onClick={() => startSpeed(speedCtx.cid)}>↺ Retry</Btn>
              <Btn onClick={() => setSpeedCtx(null)}>← Back</Btn>
            </div>
          </Card>
          {speedCtx.wrong.length > 0 && (
            <div>
              <Label>MISSED — REVIEW THESE</Label>
              {speedCtx.wrong.map((q, i) => (
                <Card key={i} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:S.text, marginBottom:6 }}>{q.q}</div>
                  <div style={{ fontSize:12, color:S.success, marginBottom:4 }}>✓ {q.o[q.a]}</div>
                  <div style={{ fontSize:12, color:S.muted, lineHeight:1.55 }}>{q.x}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    const q = speedCtx.pool[speedCtx.idx];
    const pct = (speedSec / 10) * 100;
    const timerColor = speedSec > 5 ? S.success : speedSec > 2 ? S.warning : S.danger;

    return (
      <div style={{ maxWidth:540 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:12, fontFamily:S.mono, color:S.dim }}>{speedCtx.idx+1}/{speedCtx.pool.length}</span>
          <span style={{ fontSize:22, fontWeight:700, fontFamily:S.mono, color:timerColor }}>{speedSec}s</span>
        </div>
        <div style={{ height:3, background:S.border, borderRadius:2, marginBottom:14 }}>
          <div style={{ height:"100%", width:`${pct}%`, background:timerColor, borderRadius:2, transition:"width 1s linear" }} />
        </div>
        <Card>
          <div style={{ fontSize:14, lineHeight:1.65, color:S.text, marginBottom:14 }}>{q.q}</div>
          {q.o.map((opt, i) => (
            <button key={i}
              onClick={() => answerSpeed(i)}
              style={{
                width:"100%", padding:"10px 14px", borderRadius:6,
                border:`1px solid ${S.border}`, background:S.surface, color:S.muted,
                fontSize:13, textAlign:"left", cursor:"pointer",
                fontFamily:S.font, lineHeight:1.5, marginBottom:7,
              }}>
              {opt}
            </button>
          ))}
        </Card>
      </div>
    );
  };

  // ── AI GENERATOR ──
  const GenTab = () => (
    <div style={{ maxWidth:540 }}>
      <Card style={{ marginBottom:16 }}>
        <Label>Generate exam questions via Claude</Label>
        <div style={{ fontSize:11, color:S.dim, fontFamily:S.mono, marginBottom:12 }}>
          Enter a specific concept or edge case from any course. Claude will generate 5 exam-quality questions and save them to your quiz bank.
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, color:S.muted, marginBottom:4 }}>Topic or concept</div>
          <input
            value={genTopic}
            onChange={e => setGenTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generateQs()}
            placeholder="e.g. prompt caching TTL, MCP sampling flow, CLAUDE.md scope..."
            style={{
              width:"100%", padding:"8px 12px", borderRadius:6,
              border:`1px solid ${S.border}`, background:S.bg, color:S.text,
              fontSize:13, fontFamily:S.font, outline:"none",
            }}
          />
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:S.muted, marginBottom:4 }}>Course (optional)</div>
          <select
            value={genCid}
            onChange={e => setGenCid(e.target.value)}
            style={{
              width:"100%", padding:"8px 12px", borderRadius:6,
              border:`1px solid ${S.border}`, background:S.bg, color:S.text,
              fontSize:13, fontFamily:S.font,
            }}>
            <option value="">All courses</option>
            {COURSES.map(c => <option key={c.id} value={c.id}>{c.n}</option>)}
          </select>
        </div>
        <Btn variant="primary" disabled={genLoading || !genTopic.trim()} onClick={generateQs}>
          {genLoading ? "Generating…" : "✦ Generate 5 questions"}
        </Btn>
      </Card>

      {genPreview.length > 0 && (
        <div>
          <Label>{genPreview.length} QUESTIONS GENERATED — PREVIEW</Label>
          {genPreview.map((q, i) => (
            <Card key={i} style={{ marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:500, color:S.text, marginBottom:8 }}>{i+1}. {q.q}</div>
              <div style={{ fontSize:12, color:S.success, marginBottom:4 }}>✓ {q.o[q.a]}</div>
              <div style={{ fontSize:12, color:S.muted, lineHeight:1.55 }}>{q.x}</div>
            </Card>
          ))}
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="success" onClick={saveGenQs}>+ Save to quiz bank</Btn>
            <Btn onClick={() => setGenPreview([])}>Discard</Btn>
          </div>
        </div>
      )}

      {state.genBank.length > 0 && (
        <Card style={{ marginTop:16 }}>
          <Label>Saved bank</Label>
          <div style={{ fontSize:13, color:S.muted }}>{state.genBank.length} generated questions in your bank.</div>
          <Btn style={{ marginTop:8 }} onClick={() => startQuiz()}>Quiz generated questions</Btn>
        </Card>
      )}
    </div>
  );

  // ── PROOF LOG ──
  const ProofTab = () => {
    const certifiable = COURSES.filter(c => state.status[c.id] === "done" && !state.certLog.find(l => l.cid === c.id));
    return (
      <div style={{ maxWidth:520 }}>
        <Card style={{ marginBottom:14 }}>
          <Label>Certificate log</Label>
          {state.certLog.length === 0
            ? <div style={{ fontSize:12, color:S.dim }}>No certificates logged yet.</div>
            : state.certLog.map((l, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${S.border}` }}>
                  <div>
                    <div style={{ fontSize:13, color:S.text }}>{l.name}</div>
                    <div style={{ fontSize:10, fontFamily:S.mono, color:S.dim }}>logged {l.date}</div>
                  </div>
                  <Badge type="success">certified</Badge>
                </div>
              ))
          }
        </Card>

        {certifiable.length > 0 && (
          <Card style={{ marginBottom:14 }}>
            <Label>Ready to log — {certifiable.length} completed</Label>
            {certifiable.map(c => (
              <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${S.border}` }}>
                <span style={{ fontSize:13, color:S.text }}>{c.n}</span>
                <Btn small variant="success" onClick={() => logCert(c.id)}>+ Log</Btn>
              </div>
            ))}
          </Card>
        )}

        <Card>
          <Label>LinkedIn summary</Label>
          <pre style={{
            fontSize:12, fontFamily:S.mono, color:S.muted, lineHeight:1.7,
            whiteSpace:"pre-wrap", background:S.bg, padding:"12px", borderRadius:6,
            border:`1px solid ${S.border}`, margin:0,
          }}>
{`Anthropic Academy Certifications (${state.certLog.length}):
${state.certLog.length > 0
  ? state.certLog.map(l => `• ${l.name}`).join("\n")
  : COURSES.filter(c => state.status[c.id] === "done").map(c => `• ${c.n}`).join("\n") || "Complete courses to generate this summary."
}`}
          </pre>
        </Card>
      </div>
    );
  };

  // ── ROOT RENDER ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:S.bg, color:S.text, fontFamily:S.font }}>
      {/* Header */}
      <div style={{ background:S.surface, borderBottom:`1px solid ${S.border}`, padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg, ${S.accent}, #7c3aed)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff" }}>A</div>
          <div>
            <div style={{ fontSize:14, fontWeight:600, letterSpacing:"-0.3px" }}>Anthropic Academy</div>
            <div style={{ fontSize:10, fontFamily:S.mono, color:S.dim }}>CERTIFICATION COMMAND CENTER</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding:"6px 13px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:S.mono,
              background: tab === t.k ? S.accentBg : "transparent",
              color: tab === t.k ? S.accent : S.dim,
              border: `1px solid ${tab === t.k ? S.accent + "66" : "transparent"}`,
              fontWeight: tab === t.k ? 600 : 400,
            }}>{t.label}</button>
          ))}
        </div>
        <button
          onClick={() => { if (window.confirm("Reset all progress, quiz history, and certificates?")) save(defaultState()); }}
          style={{ fontSize:10, fontFamily:S.mono, color:S.dim, background:"transparent", border:"none", cursor:"pointer" }}>
          reset
        </button>
      </div>

      {/* Body */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"24px" }}>
        {tab === "dash"  && <DashTab />}
        {tab === "study" && <StudyTab />}
        {tab === "quiz"  && <QuizTab />}
        {tab === "speed" && <SpeedTab />}
        {tab === "gen"   && <GenTab />}
        {tab === "proof" && <ProofTab />}
      </div>
    </div>
  );
}
